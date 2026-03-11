require('dotenv').config();

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// ------------------------------- cloudinary 설정 ------------------------------
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',                // 로컬 개발용
    'https://port-0-cinepark-frontend-mm0ur6nb0ab5ea2b.sel3.cloudtype.app', // 배포용
    'https://cineparks.github.io'           // 배포용 (짧은 주소용)
  ]
}));
app.use(express.json());

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// ---------------------------------- MySQL 연결 ---------------------------------
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  
  // db 환경설정 및 연결
  const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    // ssl: {
    //   rejectUnauthorized: false
    // }   
    // host: 'localhost',
    // user: 'root',
    // password: '1q2w3e4r%t',
    // database: 'my_image_db'
  });

  // -----------------------------------------

  console.log('MySQL Pool 생성 완료!');

  // db 연결오류 체크 ( 예외처리 )
  // db.connect((err) => {
  //   if (err) {
  //     console.error('MySQL 연결 실패:', err);
  //     return;
  //   }
  //   console.log('MySQL 연결 성공!');
  // });
  
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@



// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// --------------------------------- 쿼리문 세팅 ---------------------------------
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

  // 영화정보
  const selectSql = "SELECT *, open_date as openDate, image_file as imageFile FROM movie_info WHERE del_yn = 'N' ORDER BY open_date DESC";
  const insertSql = "INSERT INTO movie_info (title, rating, genre, open_date, show_time, director, actor, story, trailer, image_file) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const updateSql = "UPDATE movie_info SET title = ?, rating = ?, genre = ?, open_date = ?, show_time = ?, director = ?, actor = ?, story = ?, trailer = ?, image_file = ? WHERE id = ?";
  const deleteSql = "UPDATE movie_info SET del_yn = 'Y' WHERE id = ?";

  // 관람평 게시판
  const selectSql2 = "SELECT *, review_type as reviewType, review_txt as reviewTxt, CAST(FROM_BASE64(review_pwd) AS CHAR) as reviewPwd, reg_dt as regDt FROM review_board WHERE del_yn = 'N'";
  const insertSql2 = "INSERT INTO review_board (review_type, title, review_txt, rating, writer, review_pwd) VALUES (?, ?, ?, ?, ?, TO_BASE64(?))";
  const updateSql2 = "UPDATE review_board SET review_type = ?, title = ?, review_txt = ?, rating = ?, writer = ? WHERE id = ?";
  const updateHitsSql = "UPDATE review_board SET hits = hits + 1 WHERE id = ?"; 
  const deleteSql2 = "UPDATE review_board SET del_yn = 'Y' WHERE id = ?"; 
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@



// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// --------------------------------- 쿼리문 싫행 ---------------------------------
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

// 영화 목록 조회 쿼리
app.get('/api/images', (req, res) => {
  // 쿼리 실행 
  db.query(selectSql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// -----------------------------------------

// 영화 목록 등록 쿼리
app.post('/api/images', (req, res) => {
  // 파라미터 세팅
  const { title, rating, genre, open_date, show_time, director, actor, story, trailer, image_file } = req.body;

console.log('📥 받은 데이터:', req.body);
  console.log('📌 image_file:', image_file);
  console.log('📌 trailer:', trailer);

  // 쿼리 로그 출력
  console.log('📝 실행할 쿼리:', insertSql);
  console.log('📦 전달된 데이터:', { title, rating, genre, open_date, show_time, director, actor, story, trailer, image_file });

  // 쿼리 실행
  db.query(insertSql, [title, rating, genre, open_date, show_time, director, actor, story, trailer, image_file], (err, result) => {
    if (err) {
      console.error('❌ 쿼리 에러:', err);
      return res.status(500).json({ error: err.message });
    }
    console.log('✅ 저장 성공! ID:', result.insertId);
    res.json({ 
      message: '저장 성공!', 
      id: result.insertId 
    });
  });
});

// -----------------------------------------

// 영화 목록 수정 쿼리
app.put('/api/images/:id', (req, res) => {
  // 파라미터 세팅
  const { id } = req.params;
  const { title, rating, genre, open_date, show_time, director, actor, story, trailer, image_file } = req.body;

  // 쿼리 로그 출력
  console.log('📝 실행할 쿼리:', updateSql);
  console.log('📦 전달된 id:', id);

  // ID가 없으면 에러
  if (!id) {
    console.error('❌ ID가 전달되지 않음');
    return res.status(400).json({ error: 'ID가 필요합니다' });
  }

  // 쿼리 실행 
  db.query(updateSql, [title, rating, genre, open_date, show_time, director, actor, story, trailer, image_file, id], (err, result) => {
    if (err) {
      console.error('❌ 쿼리 에러:', err);
      return res.status(500).json({ error: err.message });
    }

    console.log('✅ 수정 성공! 영향받은 행:', result.affectedRows);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '해당 ID의 영화를 찾을 수 없습니다' });
    }

    console.log('✅ 수정 성공! ID:', id);
    res.json({
      message: '수정 성공!', 
      affectedRows: result.affectedRows,
      id : id
    });
  });
});

// -----------------------------------------

// 영화 목록 삭제 쿼리
app.delete('/api/images/:id', (req, res) => {
  // 파라미터 세팅
  const { id } = req.params;

  // 쿼리 로그 출력
  console.log('📝 실행할 쿼리:', deleteSql);
  console.log('📦 전달된 데이터:', id);

  // ID가 없으면 에러
  if (!id) {
    console.error('❌ ID가 전달되지 않음');
    return res.status(400).json({ error: 'ID가 필요합니다' });
  }

  // 쿼리 실행 
  db.query(deleteSql, [id], (err, result) => {
    if (err) {
      console.error('❌ 쿼리 에러:', err);
      return res.status(500).json({ error: err.message });
    }

    console.log('✅ 삭제 성공! 영향받은 행:', result.affectedRows);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '해당 ID의 영화를 찾을 수 없습니다' });
    }

    console.log('✅ 삭제 성공! ID:', id);
    res.json({
      message: '삭제 성공!', 
      // id: result.deleteId 
      affectedRows: result.affectedRows,
      id : id
    });
  });
});

// =========================================================================
// =========================================================================

// 관람평 조회 쿼리
app.get('/api/reviews', (req, res) => {
  let {searchType, searchTxt} = req.query;
  if(searchTxt == null || searchTxt == undefined){ searchTxt = ''; }

  console.log('전달받은 데이터: ' + searchType + ' , ' + searchTxt)

  let query = selectSql2;

  // 검색 조건 추가
  // if (searchType && searchTxt && searchType !== 'all') {
    if (searchType === 'title') {
      query += ` AND title LIKE '%${searchTxt}%'`;
    } else if (searchType === 'reviewType') {
      query += ` AND review_type LIKE '%${searchTxt}%'`;
    } else if (searchType === 'reviewTxt') {
      query += ` AND review_txt LIKE '%${searchTxt}%'`;
    } else if (searchType === 'rating') {
      query += ` AND rating LIKE '%${searchTxt}%'`;
    } else if (searchType === 'writer') {
      query += ` AND writer LIKE '%${searchTxt}%'`;
    } else if (searchType === 'all' && searchTxt != '' ) {
      query += `AND (title LIKE '%${searchTxt}%'`
      query += `OR review_type LIKE '%${searchTxt}%'`
      query += `OR review_txt LIKE '%${searchTxt}%'`
      query += `OR rating LIKE '%${searchTxt}%'`
      query += `OR writer LIKE '%${searchTxt}%')`
    }
  // }
  
  query += ' ORDER BY reg_dt DESC';

  // 쿼리 로그 출력
  console.log('📝 실행할 쿼리:', query);

  // 쿼리 실행 
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// 관람평 등록 쿼리
app.post('/api/reviews', (req, res) => {
  // 파라미터 세팅
  const { review_type, title, review_txt, rating, writer, review_pwd } = req.body;

  console.log('📥 받은 데이터:', req.body);

  // 쿼리 로그 출력
  console.log('📝 실행할 쿼리:', insertSql2);
  console.log('📦 전달된 데이터:', { review_type, title, review_txt, rating, writer, review_pwd });

  // 쿼리 실행
  db.query(insertSql2, [review_type, title, review_txt, rating, writer, review_pwd], (err, result) => {
    if (err) {
      console.error('❌ 쿼리 에러:', err);
      return res.status(500).json({ error: err.message });
    }
    console.log('✅ 관람평 저장 성공! ID:', result.insertId);
    res.json({ 
      message: '관람평 저장 성공!', 
      id: result.insertId 
    });
  });  
});

// 관람평 수정 쿼리
app.put('/api/reviews/:id', (req, res) => {
  // 파라미터 세팅
  const { id } = req.params;
  const { review_type, title, review_txt, rating, writer } = req.body;

  // 쿼리 로그 출력
  console.log('📝 실행할 쿼리:', updateSql2);
  console.log('📦 전달된 id:', id);
  console.log('전달받은 데이터: ' + review_type + ' , ' + title+ ' , ' + review_txt + ' , ' + rating+ ' , ' + writer)

  // ID가 없으면 에러
  if (!id) {
    console.error('❌ ID가 전달되지 않음');
    return res.status(400).json({ error: 'ID가 필요합니다' });
  }

  // 쿼리 실행 
  db.query(updateSql2, [review_type, title, review_txt, rating, writer, id], (err, result) => {
    if (err) {
      console.error('❌ 쿼리 에러:', err);
      return res.status(500).json({ error: err.message });
    }

    console.log('✅ 수정 성공! 영향받은 행:', result.affectedRows);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '해당 ID의 관람평을 찾을 수 없습니다' });
    }

    console.log('✅ 수정 성공! ID:', id);
    res.json({
      message: '관람평 수정 성공!', 
      affectedRows: result.affectedRows,
      id : id
    });
  });  
});

// 관람평 조회수 수정 쿼리
app.put('/api/reviews/:id/hits', (req, res) => {
  // 파라미터 세팅
  const { id } = req.params;

  // 쿼리 로그 출력
  console.log('📝 실행할 쿼리:', updateHitsSql);
  console.log('📦 전달된 id:', id);

  // ID가 없으면 에러
  if (!id) {
    console.error('❌ ID가 전달되지 않음');
    return res.status(400).json({ error: 'ID가 필요합니다' });
  }

  // 쿼리 실행 
  db.query(updateHitsSql, [id], (err, result) => {
    if (err) {
      console.error('❌ 쿼리 에러:', err);
      return res.status(500).json({ error: err.message });
    }

    console.log('✅ 수정 성공! 영향받은 행:', result.affectedRows);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '해당 ID의 관람평을 찾을 수 없습니다' });
    }

    console.log('✅ 수정 성공! ID:', id);
    res.json({
      message: '조회수 수정 성공!', 
      affectedRows: result.affectedRows,
      id : id
    });
  });  
});

// 관람평 삭제 쿼리
app.delete('/api/reviews/:id', (req, res) => {
  // 파라미터 세팅
  const { id } = req.params;

  // 쿼리 로그 출력
  console.log('📝 실행할 쿼리:', deleteSql2);
  console.log('📦 전달된 데이터:', id);

  // ID가 없으면 에러
  if (!id) {
    console.error('❌ ID가 전달되지 않음');
    return res.status(400).json({ error: 'ID가 필요합니다' });
  }

  // 쿼리 실행 
  db.query(deleteSql2, [id], (err, result) => {
    if (err) {
      console.error('❌ 쿼리 에러:', err);
      return res.status(500).json({ error: err.message });
    }

    console.log('✅ 삭제 성공! 영향받은 행:', result.affectedRows);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '해당 ID의 영화를 찾을 수 없습니다' });
    }

    console.log('✅ 삭제 성공! ID:', id);
    res.json({
      message: '관람평 정보 삭제 성공!', 
      // id: result.deleteId 
      affectedRows: result.affectedRows,
      id : id
    });
  });  
});

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@



// 서버 로그
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행중...`);
});




// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// ------------------------------- 이미지 업로드 ---------------------------------
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

// 이미지 업로드 설정
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/image/') // 이미지 저장 경로
//   },
//   filename: function (req, file, cb) {
    // 고유한 파일명 생성 (타임스탬프 + 원본 파일명)
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // cb(null, uniqueSuffix + path.extname(file.originalname));
    
    // ✅ 원본 파일명 그대로 사용
//     cb(null, file.originalname);
//   }
// });

// 기존 diskStorage 대신 CloudinaryStorage 사용
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cinepark',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    public_id: (req, file) => file.originalname.split('.')[0],
  },
});
// -----------------------------------------

// 이미지 업로드
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
  fileFilter: function (req, file, cb) {
    // 이미지 파일만 허용
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다!'));
    }
  }
});

// -----------------------------------------

// ✅ 정적 파일 제공 설정 추가
app.use('/image', express.static(path.join(__dirname, 'public', 'image')));

// 이미지 업로드 라우트
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '파일이 업로드되지 않았습니다.' });
    }
    
    console.log('✅ req.file 전체:', req.file);  // ✅ 추가
    console.log('✅ filename:', req.file.filename);  // ✅ 추가
    console.log('✅ path:', req.file.path);  // ✅ 추가

    res.json({
      success: true,
      filename: req.file.path,  // ✅ Cloudinary 전체 URL로 변경
      originalname: req.file.originalname,
      // path: `/image/${req.file.filename}`
      path: req.file.path  // Cloudinary URL
    });
  } catch (error) {
    console.error('업로드 에러:', error);
    res.status(500).json({ error: '이미지 업로드 중 오류가 발생했습니다.' });
  }
});

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@