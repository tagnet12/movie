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
    // debug: true 
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
  // const selectSql = "SELECT *, open_date as openDate, image_file as imageFile FROM movie_info WHERE del_yn = 'N' ";
  const insertSql = "INSERT INTO movie_info (title, rating, genre, cookieYn, open_date, show_time, director, actor, story, trailer, image_file, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const updateSql = "UPDATE movie_info SET title = ?, rating = ?, genre = ?, cookieYn = ?, open_date = ?, show_time = ?, director = ?, actor = ?, story = ?, trailer = ?, image_file = ?, image_url = ? WHERE id = ?";
  const deleteSql = "UPDATE movie_info SET del_yn = 'Y' WHERE id = ?";

  // 관람평 게시판
  const selectSql2 = "SELECT *, review_type as reviewType, review_txt as reviewTxt, CAST(FROM_BASE64(review_pwd) AS CHAR) as reviewPwd, reg_dt as regDt FROM review_board WHERE del_yn = 'N'";
  const insertSql2 = "INSERT INTO review_board (review_type, title, review_txt, rating, writer, review_pwd) VALUES (?, ?, ?, ?, ?, TO_BASE64(?))";
  const updateSql2 = "UPDATE review_board SET review_type = ?, title = ?, review_txt = ?, rating = ?, writer = ? WHERE id = ?";
  const updateHitsSql = "UPDATE review_board SET hits = hits + 1 WHERE id = ?"; 
  const deleteSql2 = "UPDATE review_board SET del_yn = 'Y' WHERE id = ?"; 

  // 제안 및 문의 게시판
  const selectSql3 = "SELECT rb.*, rb.request_type as requestType, rb.request_txt as requestTxt, CAST(FROM_BASE64(rb.request_pwd) AS CHAR) as requestPwd, rb.reg_dt as regDt, (SELECT COUNT(*) FROM request_comment rc WHERE rc.request_id = rb.id AND rc.del_yn = 'N') as commentCount FROM request_board rb WHERE rb.del_yn = 'N'";
  const insertSql3 = "INSERT INTO request_board (category, title, request_txt, request_type, writer, request_pwd) VALUES (?, ?, ?, ?, ?, TO_BASE64(?))";
  const updateSql3 = "UPDATE request_board SET category = ?, title = ?, request_txt = ?, request_type = ?, writer = ? WHERE id = ?";
  const updateHitsSql2 = "UPDATE request_board SET hits = hits + 1 WHERE id = ?"; 
  const deleteSql3 = "UPDATE request_board SET del_yn = 'Y' WHERE id = ?";

  // 영화 댓글
  const selectMovieCommentSql = "SELECT id, movie_id as movieId, comment, writer, rating, reg_dt as regDt FROM movie_comment WHERE movie_id = ? AND del_yn = 'N' ORDER BY reg_dt DESC";
  const insertMovieCommentSql = "INSERT INTO movie_comment (movie_id, comment, writer, rating, comment_pwd) VALUES (?, ?, ?, ?, TO_BASE64(?))";
  const selectMovieCommentPwdSql = "SELECT CAST(FROM_BASE64(comment_pwd) AS CHAR) as comment_pwd FROM movie_comment WHERE id = ? AND del_yn = 'N'";
  const updateMovieCommentSql = "UPDATE movie_comment SET comment = ?, rating = ? WHERE id = ?";
  const deleteMovieCommentSql = "UPDATE movie_comment SET del_yn = 'Y' WHERE id = ?";

  // 제안 및 문의 댓글
  const selectCommentSql = "SELECT id, request_id as requestId, comment, writer, reg_dt as regDt FROM request_comment WHERE request_id = ? AND del_yn = 'N' ORDER BY reg_dt ASC";
  const insertCommentSql = "INSERT INTO request_comment (request_id, comment, writer, comment_pwd) VALUES (?, ?, ?, TO_BASE64(?))";
  const selectCommentPwdSql = "SELECT CAST(FROM_BASE64(comment_pwd) AS CHAR) as comment_pwd FROM request_comment WHERE id = ? AND del_yn = 'N'";
  const updateCommentSql = "UPDATE request_comment SET comment = ? WHERE id = ?";
  const deleteCommentSql = "UPDATE request_comment SET del_yn = 'Y' WHERE id = ?";

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@



// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// --------------------------------- 쿼리문 싫행 ---------------------------------
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

// 영화 목록 조회 쿼리
app.get('/api/images', (req, res) => {

  let {searchType, searchTxt, sortType} = req.query;
  if(searchTxt == null || searchTxt == undefined){ searchTxt = ''; }

  console.log('전달받은 데이터: ' + searchType + ' , ' + searchTxt + ' , sortType: ' + sortType)

  // const selectSql = "SELECT *, open_date as openDate, image_file as imageFile FROM movie_info WHERE del_yn = 'N' ";
  let query = "SELECT *, open_date as openDate, image_file as imageFile, image_url as imageUrl FROM movie_info WHERE del_yn = 'N' ";

  // 검색 조건 추가
    if (searchType === 'title') {
      query += ` AND title LIKE '%${searchTxt}%'`;
    } else if (searchType === 'director') {
      query += ` AND director LIKE '%${searchTxt}%'`;
    } else if (searchType === 'actor') {
      query += ` AND actor LIKE '%${searchTxt}%'`;
    } else if (searchType === 'rating') {
      query += ` AND LEFT(rating, 1) = '${searchTxt}'`;
    } else if (searchType === 'opendate') {
      query += ` AND open_date  LIKE '%${searchTxt}%'`;
    } else if (searchType === 'all' && searchTxt != '' ) {
      query += ` AND (title LIKE '%${searchTxt}%'`
      query += ` OR director LIKE '%${searchTxt}%'`
      query += ` OR actor LIKE '%${searchTxt}%'`
      query += ` OR LEFT(rating, 1) = '${searchTxt}'`;
      query += ` OR open_date LIKE '%${searchTxt}%')`
    }
    
  query += sortType === 'popular' ? ' ORDER BY CAST(rating AS DECIMAL(5,1)) DESC' : ' ORDER BY open_date DESC';

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

// -----------------------------------------

// 영화 목록 등록 쿼리
app.post('/api/images', (req, res) => {
  // 파라미터 세팅
  const { title, rating, genre, cookieYn, open_date, show_time, director, actor, story, trailer, image_file, image_url } = req.body;

console.log('📥 받은 데이터:', req.body);
  console.log('📌 image_file:', image_file);
  console.log('📌 image_url:', image_url);
  console.log('📌 trailer:', trailer);

  // 쿼리 로그 출력
  console.log('📝 실행할 쿼리:', insertSql);
  console.log('📦 전달된 데이터:', { title, rating, genre, cookieYn, open_date, show_time, director, actor, story, trailer, image_file });

  // 쿼리 실행
  db.query(insertSql, [title, rating, genre, cookieYn, open_date, show_time, director, actor, story, trailer, image_file, image_url], (err, result) => {
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
  const { title, rating, genre, cookieYn, open_date, show_time, director, actor, story, trailer, image_file, image_url } = req.body;

  // 쿼리 로그 출력
  console.log('📝 실행할 쿼리:', updateSql);
  console.log('📦 전달된 id:', id);

  // ID가 없으면 에러
  if (!id) {
    console.error('❌ ID가 전달되지 않음');
    return res.status(400).json({ error: 'ID가 필요합니다' });
  }

  // 쿼리 실행 
  db.query(updateSql, [title, rating, genre, cookieYn, open_date, show_time, director, actor, story, trailer, image_file, image_url, id], (err, result) => {
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
      query += ` AND (title LIKE '%${searchTxt}%'`
      query += ` OR review_type LIKE '%${searchTxt}%'`
      query += ` OR review_txt LIKE '%${searchTxt}%'`
      query += ` OR rating LIKE '%${searchTxt}%'`
      query += ` OR writer LIKE '%${searchTxt}%')`
    }
  
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

// =========================================================================
// =========================================================================

// 제안 및 문의 조회 쿼리
app.get('/api/requests', (req, res) => {
  let {searchType, searchTxt} = req.query;
  if(searchTxt == null || searchTxt == undefined){ searchTxt = ''; }

  console.log('전달받은 데이터: ' + searchType + ' , ' + searchTxt)

  let query = selectSql3;

  // 검색 조건 추가
    if (searchType === 'title') {
      query += ` AND title LIKE '%${searchTxt}%'`;
    } else if (searchType === 'category') {
      query += ` AND category LIKE '%${searchTxt}%'`;
    } else if (searchType === 'requestTxt') {
      query += ` AND request_txt LIKE '%${searchTxt}%'`;
    } else if (searchType === 'requestype') {
      query += ` AND request_type LIKE '%${searchTxt}%'`;
    } else if (searchType === 'writer') {
      query += ` AND writer LIKE '%${searchTxt}%'`;
    } else if (searchType === 'all' && searchTxt != '' ) {
      query += ` AND (title LIKE '%${searchTxt}%'`
      query += ` OR category LIKE '%${searchTxt}%'`
      query += ` OR request_txt LIKE '%${searchTxt}%'`
      query += ` OR request_type LIKE '%${searchTxt}%'`
      query += ` OR writer LIKE '%${searchTxt}%')`
    }
  
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

// 제안 및 문의 등록 쿼리
app.post('/api/requests', (req, res) => {
  // 파라미터 세팅
  const { category, title, request_txt, request_type, writer, request_pwd } = req.body;

  console.log('📥 파라미터로 받은 데이터:', req.body);

  // 쿼리 로그 출력
  console.log('📝 실행할 쿼리:', insertSql3);
  console.log('📦 쿼리로 전달된 데이터:', { category, title, request_txt, request_type, writer, request_pwd });

  // 쿼리 실행
  db.query(insertSql3, [category, title, request_txt, request_type, writer, request_pwd], (err, result) => {
    if (err) {
      console.error('❌ 쿼리 에러:', err);
      return res.status(500).json({ error: err.message });
    }
    console.log('✅ 제안 및 문의 저장 성공! ID:', result.insertId);
    res.json({ 
      message: '제안 및 문의 저장 성공!', 
      id: result.insertId 
    });
  });  
});

// 제안 및 문의 수정 쿼리
app.put('/api/requests/:id', (req, res) => {
  // 파라미터 세팅
  const { id } = req.params;
  const { category, title, request_txt, request_type, writer } = req.body;

  // 쿼리 로그 출력
  console.log('📝 실행할 쿼리:', updateSql3);
  console.log('📦 전달된 id:', id);
  console.log('전달받은 데이터: ' + category + ' , ' + title + ' , ' + request_txt + ' , ' + request_type + ' , ' + writer)

  // ID가 없으면 에러
  if (!id) {
    console.error('❌ ID가 전달되지 않음');
    return res.status(400).json({ error: 'ID가 필요합니다' });
  }

  // 쿼리 실행 
  db.query(updateSql3, [category, title, request_txt, request_type, writer, id], (err, result) => {
    if (err) {
      console.error('❌ 쿼리 에러:', err);
      return res.status(500).json({ error: err.message });
    }

    console.log('✅ 수정 성공! 영향받은 행:', result.affectedRows);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '해당 ID의 제안 및 문의를 찾을 수 없습니다' });
    }

    console.log('✅ 수정 성공! ID:', id);
    res.json({
      message: '제안 및 문의 수정 성공!', 
      affectedRows: result.affectedRows,
      id : id
    });
  });  
});

// 제안 및 문의 조회수 수정 쿼리
app.put('/api/requests/:id/hits', (req, res) => {
  // 파라미터 세팅
  const { id } = req.params;

  // 쿼리 로그 출력
  console.log('📝 실행할 쿼리:', updateHitsSql2);
  console.log('📦 전달된 id:', id);

  // ID가 없으면 에러
  if (!id) {
    console.error('❌ ID가 전달되지 않음');
    return res.status(400).json({ error: 'ID가 필요합니다' });
  }

  // 쿼리 실행 
  db.query(updateHitsSql2, [id], (err, result) => {
    if (err) {
      console.error('❌ 쿼리 에러:', err);
      return res.status(500).json({ error: err.message });
    }

    console.log('✅ 수정 성공! 영향받은 행:', result.affectedRows);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '해당 ID의 제안 및 문의를 찾을 수 없습니다' });
    }

    console.log('✅ 수정 성공! ID:', id);
    res.json({
      message: '조회수 수정 성공!', 
      affectedRows: result.affectedRows,
      id : id
    });
  });  
});

// 제안 및 문의 삭제 쿼리
app.delete('/api/requests/:id', (req, res) => {
  // 파라미터 세팅
  const { id } = req.params;

  // 쿼리 로그 출력
  console.log('📝 실행할 쿼리:', deleteSql3);
  console.log('📦 전달된 데이터:', id);

  // ID가 없으면 에러
  if (!id) {
    console.error('❌ ID가 전달되지 않음');
    return res.status(400).json({ error: 'ID가 필요합니다' });
  }

  // 쿼리 실행 
  db.query(deleteSql3, [id], (err, result) => {
    if (err) {
      console.error('❌ 쿼리 에러:', err);
      return res.status(500).json({ error: err.message });
    }

    console.log('✅ 삭제 성공! 영향받은 행:', result.affectedRows);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '해당 ID의 제안 및 문의를 찾을 수 없습니다' });
    }

    console.log('✅ 삭제 성공! ID:', id);
    res.json({
      message: '제안 및 문의 정보 삭제 성공!', 
      // id: result.deleteId 
      affectedRows: result.affectedRows,
      id : id
    });
  });  
});

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

// 제안 및 문의 댓글 조회 쿼리
app.get('/api/request-comments/:requestId', (req, res) => {
  const { requestId } = req.params;
  db.query(selectCommentSql, [requestId], (err, result) => {
    if (err) {
      console.error('❌ 댓글 조회 에러:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

// 제안 및 문의 댓글 등록 쿼리
app.post('/api/request-comments', (req, res) => {
  const { request_id, comment, writer, comment_pwd } = req.body;
  if (!request_id || !comment || !writer || !comment_pwd) {
    return res.status(400).json({ error: '필수 항목이 누락되었습니다.' });
  }
  db.query(insertCommentSql, [request_id, comment, writer, comment_pwd], (err, result) => {
    if (err) {
      console.error('❌ 댓글 등록 에러:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: '댓글 등록 성공!', id: result.insertId });
  });
});

// 제안 및 문의 댓글 수정 쿼리
app.put('/api/request-comments/:id', (req, res) => {
  const { id } = req.params;
  const { comment, comment_pwd } = req.body;

  // 패스워드 확인
  db.query(selectCommentPwdSql, [id], (err, result) => {
    if (err) {
      console.error('❌ 댓글 패스워드 조회 에러:', err);
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
    }
    if (result[0].comment_pwd !== comment_pwd) {
      return res.status(401).json({ error: '패스워드가 일치하지 않습니다.' });
    }
    db.query(updateCommentSql, [comment, id], (err2) => {
      if (err2) {
        console.error('❌ 댓글 수정 에러:', err2);
        return res.status(500).json({ error: err2.message });
      }
      res.json({ message: '댓글 수정 성공!', id });
    });
  });
});

// 제안 및 문의 댓글 삭제 쿼리
app.delete('/api/request-comments/:id', (req, res) => {
  const { id } = req.params;
  const { comment_pwd } = req.body;

  // 패스워드 확인
  db.query(selectCommentPwdSql, [id], (err, result) => {
    if (err) {
      console.error('❌ 댓글 패스워드 조회 에러:', err);
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
    }
    if (result[0].comment_pwd !== comment_pwd) {
      return res.status(401).json({ error: '패스워드가 일치하지 않습니다.' });
    }
    db.query(deleteCommentSql, [id], (err2, _result2) => {
      if (err2) {
        console.error('❌ 댓글 삭제 에러:', err2);
        return res.status(500).json({ error: err2.message });
      }
      res.json({ message: '댓글 삭제 성공!', id });
    });
  });
});

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

// 영화 댓글 조회
app.get('/api/movie-comments/:movieId', (req, res) => {
  const { movieId } = req.params;
  db.query(selectMovieCommentSql, [movieId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// 영화 댓글 등록
app.post('/api/movie-comments', (req, res) => {
  const { movie_id, comment, writer, rating, comment_pwd } = req.body;
  if (!movie_id || !comment || !writer || !comment_pwd) {
    return res.status(400).json({ error: '필수 항목이 누락되었습니다.' });
  }
  db.query(insertMovieCommentSql, [movie_id, comment, writer, rating || null, comment_pwd], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '댓글 등록 성공!', id: result.insertId });
  });
});

// 영화 댓글 수정
app.put('/api/movie-comments/:id', (req, res) => {
  const { id } = req.params;
  const { comment, rating, comment_pwd } = req.body;
  db.query(selectMovieCommentPwdSql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
    if (result[0].comment_pwd !== comment_pwd) return res.status(401).json({ error: '패스워드가 일치하지 않습니다.' });
    db.query(updateMovieCommentSql, [comment, rating || null, id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: '댓글 수정 성공!', id });
    });
  });
});

// 영화 댓글 삭제
app.delete('/api/movie-comments/:id', (req, res) => {
  const { id } = req.params;
  const { comment_pwd } = req.body;
  db.query(selectMovieCommentPwdSql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
    if (result[0].comment_pwd !== comment_pwd) return res.status(401).json({ error: '패스워드가 일치하지 않습니다.' });
    db.query(deleteMovieCommentSql, [id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: '댓글 삭제 성공!', id });
    });
  });
});

// =========================================================================
// =========================================================================

// 아카데미 시상식 회차 목록 조회
app.get('/api/academy/ceremonies', (req, res) => {
  const sql = "SELECT DISTINCT ceremony_no, ceremony_year FROM academy_award WHERE del_yn = 'N' ORDER BY ceremony_no DESC";
  console.log('📝 실행할 쿼리:', sql);
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ 아카데미 회차 목록 조회 에러:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// 아카데미 시상식 특정 회차 수상자 조회
app.get('/api/academy/:ceremonyNo', (req, res) => {
  const { ceremonyNo } = req.params;
  const sql = "SELECT * FROM academy_award WHERE ceremony_no = ? AND del_yn = 'N' ORDER BY id ASC";
  console.log('📝 실행할 쿼리:', sql, '| 회차:', ceremonyNo);
  db.query(sql, [ceremonyNo], (err, results) => {
    if (err) {
      console.error('❌ 아카데미 수상자 조회 에러:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// 아카데미 수상자 등록
app.post('/api/academy', (req, res) => {
  const { ceremony_no, ceremony_year, category, category_nm, winner_nm, movie_title, tmdb_id } = req.body;
  const sql = "INSERT INTO academy_award (ceremony_no, ceremony_year, category, category_nm, winner_nm, movie_title, tmdb_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
  console.log('📝 아카데미 등록 쿼리 실행');
  db.query(sql, [ceremony_no, ceremony_year, category, category_nm, winner_nm, movie_title || null, tmdb_id || null], (err, result) => {
    if (err) {
      console.error('❌ 아카데미 등록 에러:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: '등록 성공!', id: result.insertId });
  });
});

// 아카데미 수상자 수정
app.put('/api/academy/:id', (req, res) => {
  const { id } = req.params;
  const { ceremony_no, ceremony_year, category, category_nm, winner_nm, movie_title, tmdb_id } = req.body;
  const sql = "UPDATE academy_award SET ceremony_no=?, ceremony_year=?, category=?, category_nm=?, winner_nm=?, movie_title=?, tmdb_id=? WHERE id=?";
  console.log('📝 아카데미 수정 쿼리 실행 | id:', id);
  db.query(sql, [ceremony_no, ceremony_year, category, category_nm, winner_nm, movie_title || null, tmdb_id || null, id], (err, result) => {
    if (err) {
      console.error('❌ 아카데미 수정 에러:', err);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: '해당 ID를 찾을 수 없습니다' });
    res.json({ message: '수정 성공!', id });
  });
});

// 아카데미 수상자 삭제
app.delete('/api/academy/:id', (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE academy_award SET del_yn = 'Y' WHERE id = ?";
  console.log('📝 아카데미 삭제 쿼리 실행 | id:', id);
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ 아카데미 삭제 에러:', err);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: '해당 ID를 찾을 수 없습니다' });
    res.json({ message: '삭제 성공!', id });
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
    public_id: () => Date.now() + '-' + Math.round(Math.random() * 1e6),
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
      filename: req.file.originalname,  // 원본 파일명 (image_file 컬럼)
      imageUrl: req.file.path,          // Cloudinary 전체 URL (image_url 컬럼)
    });
  } catch (error) {
    console.error('업로드 에러:', error);
    res.status(500).json({ error: '이미지 업로드 중 오류가 발생했습니다.' });
  }
});

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@