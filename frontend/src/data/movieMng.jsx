import { React, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Dropdown } from 'react-bootstrap';
import './css/imageUpload.css';
// import axios from 'axios';
import api from './api';  // 경로는 파일 위치에 맞게 조정
import ConMsgBox from './msgBox/ConMsgBox.jsx';
import GenMsgBox from './msgBox/GenMsgBox.jsx';

function MovieMng({refreshMovies}) {
  // 영화 정보 표시를 위한 파라미터 선언 ( 영화정보 수정용 )
  const [movies, setMovies] = useState([]);         // 영화목록
  const [title, setTitle] = useState('');           // 영화제목
  const [rating, setRating] = useState('');         // 평점
  const [genre, setGenre] = useState('영화 장르를 선택하세요');         // 장르
  const [openDate, setOpenDate] = useState('');     // 개봉일
  const [showTime, setShowTime] = useState('');     // 상영시간
  const [director, setDirector] = useState('');     // 감독
  const [actor, setActor] = useState('');           // 출연진
  const [trailer, setTrailer] = useState('');       // 예고편
  const [story, setStory] = useState('');           // 줄거리
  const [imageFile, setImageFile] = useState('');   // 이미지 파일
  const [updateId, setUpdateId] = useState('');     // 수정할 ID
  const [deleteId, setDeleteId] = useState('');     // 수정할 ID    
  const [action, setAction] = useState('');

  const [selectedFile, setSelectedFile] = useState(null);   // 업로드할 파일객체
  const [imagePreview, setImagePreview] = useState('');     // 이미지 미리보기

  const navigate = useNavigate()
  const location = useLocation();
  const genreRef = useRef(null);
  const imageInputRef = useRef(null);
  const [pendingNav, setPendingNav] = useState(false);

  // 모달 관련 state
  const [showConModal, setShowConModal] = useState(false);  // 확인 메세지상자 표시여부
  const [showGenModal, setShowGenModal] = useState(false);  // 알림 메세지상자 표시여부
  const [conModalMessage, conModalMsg] = useState('');      // 확인 메세지 내용
  const [genModalMessage, genModalMsg] = useState('');      // 알림 메세지 내용
  const conMsg = (str)=>{                                   // 확인 메세지 호출함수   
    setShowConModal(true); conModalMsg(str);
  }  
  const genMsg = (str)=>{                                   // 알림 메세지 호출함수 
    setShowGenModal(true); genModalMsg(str);
  }

  // 영화정보 파라미터 세팅 ( 수정용 파라미터 )
  useEffect(() => {
    if(location.state?.movieData)
    {
      const movieData = location.state?.movieData
      console.log('📌 전달받은 영화 정보:', movieData);

      setTitle(movieData.title);
      setRating(movieData.rating);
      setGenre(movieData.genre);
      setOpenDate(movieData.openDate);

      // ✅ 상영시간 설정 직후 확인
      const timeValue = movieData.show_time;
      setShowTime(timeValue);

      setDirector(movieData.director);
      setActor(movieData.actor);
      setTrailer(movieData.trailer);
      
      setStory(movieData.story);
      setImageFile(movieData.imageFile);
    }

    if(location.state?.updateId)
    {
      setUpdateId(location.state?.updateId);
      console.log('📌 전달받은 영화 ID:', location.state.updateId);
    }

    if(location.state?.deleteId)
    {
      setDeleteId(location.state?.deleteId);
      console.log('📌 전달받은 영화 ID:', location.state.deleteId);
    }

    if(location.state?.action) {
      setAction(location.state?.action);
      console.log('📌 전달받은 액션 정보:', location.state.action);
    }
    
  }, [location.state?.updateId]);
  // }, [location.state]);

  // 영화 목록 불러오기 함수 호출
  useEffect(() => {
    fetchMovies();
  }, []);


  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  //@@@@@@@@@@@@@@@@@@@@@ mySql을 이용한 데이터 조회 및 저장 @@@@@@@@@@@@@@@@@@@@  
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

  // 영화 목록 불러오기( 화면하단 목록표시용 )
  const fetchMovies = async () => {
    try {
      // const response = await axios.get('http://localhost:5000/api/images');
      const response = await api.get('/api/images');
      setMovies(response.data);
    } catch (error) {
      console.error('불러오기 실패:', error);
    }
  };

  // 버튼 클릭 이벤트( 등록, 수정, 삭제 )
  const handelAction = (actions)=> {
    if(actions != 'del'){             // 삭제일 때는 유효성 검사를 하지 않음 
      if( !validation() ){ return;}   // 유효성 검사
    }
    
    let str = '영화정보를 ';
    if(actions == 'reg'){ str += '등록'; }   // 등록하기
    if(actions == 'mod'){ str += '수정'; }   // 수정하기
    if(actions == 'del'){ str += '삭제'; }   // 삭제하기

    conMsg(str);
  }

  // 영화정보 유효성 검사
  const validation = ()=>{
    const imgPreview = document.getElementById('imgPreview')
    if(!imgPreview || !imgPreview.src || imgPreview.src === '')
    { genMsg('이미지 파일은 필수선택 항목입니다.'); return false; } 

    if(document.getElementById('title').value == '')
    { genMsg('제목은 필수입력 항목입니다.'); 
      document.getElementById('title')?.focus(); return false; }

    const inputRating = document.getElementById('rating').value ;     
    if( Number(inputRating) > 10 )
    { genMsg('평점은 10점이내로 입력해야 됩니다.'); 
      document.getElementById('rating')?.focus(); return false; }

    if(genre == '영화 장르를 선택하세요')
    { genMsg('장르는 필수선택 항목입니다.'); 
      genreRef.current?.focus(); return false; }


    if(document.getElementById('openDate').value == '')
    { genMsg('개봉일은 필수입력 항목입니다.'); 
      document.getElementById('openDate')?.focus(); return false; }

    return true;
  }

  // 영화정보 등록하기
  const handleRegist = async (e) => {    
    console.log('===== 저장 시작 =====');
    console.log('📤 전송할 데이터:', { 
      title, rating, genre,
      open_date: openDate, 
      show_time: showTime,
      director, actor, story, trailer,
      image_file: imageFile
    });

    try {
      let uploadedFileName = imageFile;  // 기본값은 기존 파일명

      // 이미지 업로드
       uploadedFileName = await handleImageUpload(selectedFile) || imageFile;
  
      // DB 데이터 저장
      // const response = await axios.post('http://localhost:5000/api/images', {
      const response = await api.post('/api/images', {
        title: title, rating: rating, genre: genre,
        open_date: openDate, show_time: showTime,
        director: director, actor: actor, story: story, trailer,
        image_file: uploadedFileName
      });
      
      console.log('✅ 서버 응답:', response);
      console.log('✅ 응답 데이터:', response.data);

      genMsg(`영화정보가 정상적으로 등록되었습니다.`);
      
      setTitle('');

      // 목록 새로고침 후 타이틀 페이지로 이동
      await refreshMovies();  // 영화 목록 새로고침
      setPendingNav(true);   // ✅ 추가
      // navigate('/');          // 타이틀 페이지로 이동      

    } catch (error) {
      console.error('등록 실패:', error);
      console.log('===== 에러 발생 =====');
      console.log('❌ 에러 객체:', error);
      console.log('❌ 에러 메시지:', error.message);
      console.log('❌ 에러 코드:', error.code);
      console.log('❌ 응답 상태:', error.response?.status);
      console.log('❌ 응답 데이터:', error.response?.data);
      console.log('❌ 요청 설정:', error.config);

      genMsg('등록 실패: ' + (error.response?.data?.error || error.message));
    }
  };

  // 영화정보 수정하기
  const handleUpdate = async (e) => {
    console.log('===== 수정 시작 =====');

    console.log('📤 전송할 데이터:', { 
      id : updateId,
      title, rating, genre,
      open_date: openDate, 
      show_time: showTime,
      director, actor, story, trailer,
      image_file: imageFile
    });

    try {
      let uploadedFileName = imageFile;  // 기본값은 기존 파일명

      // 이미지 업로드
      if (selectedFile) {   // ✅ 새 이미지가 선택된 경우에만 업로드
        uploadedFileName = await handleImageUpload(selectedFile) || imageFile;
        console.log('✅ 새 이미지 업로드 완료:', uploadedFileName);
      }
      // DB 데이터 저장
      // const response = await axios.put(`http://localhost:5000/api/images/${updateId}`, {
      const response = await api.put(`/api/images/${updateId}`, { 
        title: title, rating: rating, genre: genre,
        open_date: openDate, show_time: showTime,
        director: director, actor: actor, story: story, trailer,
        image_file: uploadedFileName
      });
      
      console.log('✅ 서버 응답:', response);
      console.log('✅ 응답 데이터:', response.data);

      genMsg(`영화정보가 정상적으로 수정되었습니다.`);

      // 상태 초기화
      setTitle('');
      setUpdateId('');
      setSelectedFile(null);
      setImagePreview('');

      // 목록 새로고침 후 타이틀 페이지로 이동
      await refreshMovies();  // 영화 목록 새로고침
      setPendingNav(true);   // ✅ 추가
      // navigate('/');          // 타이틀 페이지로 이동

    } catch (error) {
      console.error('수정 실패:', error);
      console.log('===== 에러 발생 =====');
      console.log('❌ 에러 객체:', error);
      console.log('❌ 에러 메시지:', error.message);
      console.log('❌ 에러 코드:', error.code);
      console.log('❌ 응답 상태:', error.response?.status);
      console.log('❌ 응답 데이터:', error.response?.data);
      console.log('❌ 요청 설정:', error.config);

      genMsg('수정 실패: ' + (error.response?.data?.error || error.message));
    }
  }

  // 영화정보 삭제하기
  const handleDelete = async () => {
    
    console.log('===== 삭제 시작 =====');
    console.log('📤 전송할 데이터:', { id : deleteId });

    try {
      // const response = await axios.delete(`http://localhost:5000/api/images/${deleteId}`);
      const response = await api.delete(`/api/images/${deleteId}`);

      console.log('✅ 서버 응답:', response);
      console.log('✅ 응답 데이터:', response.data);

      genMsg(`영화정보가 정상적으로 삭제되었습니다.`);

      setDeleteId('');

      // 목록 새로고침 후 타이틀 페이지로 이동
      await refreshMovies();  // 영화 목록 새로고침
      setPendingNav(true);   // ✅ 추가
      // navigate('/');          // 타이틀 페이지로 이동
      
    } catch (error) {
      console.error('삭제 실패:', error);
      console.log('===== 에러 발생 =====');
      console.log('❌ 에러 객체:', error);
      console.log('❌ 에러 메시지:', error.message);
      console.log('❌ 에러 코드:', error.code);
      console.log('❌ 응답 상태:', error.response?.status);
      console.log('❌ 응답 데이터:', error.response?.data);
      console.log('❌ 요청 설정:', error.config);

      genMsg('삭제 실패: ' + (error.response?.data?.error || error.message || '알 수 없는 오류'));
    }
  };

  // 이미지 파일 선택하기
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 이미지 파일인지 확인
      if (!file.type.startsWith('image/')) {
        genMsg('이미지 파일만 업로드 가능합니다!');
        return;
      }

      // FileReader로 이미지 정보를 저장
      const reader = new FileReader();
      reader.onloadend = () => {   
        setSelectedFile(file);    // 파일 객체 저장
        setImageFile(file.name);  // 파일명  
      };
      reader.readAsDataURL(file);

      // ✅ 즉시 미리보기 생성 (서버 업로드 전)
      const blobUrl = URL.createObjectURL(file);
      setImagePreview(blobUrl);
    }
  };

  // 이미지 업로드 처리
  const handleImageUpload = async (file) => {
    if (!file) { return null; }
      console.log('📤 업로드할 파일:', file);

      // FormData 객체 생성
      const formData = new FormData();
      formData.append('image', file);

      try {
        console.log('📡 업로드 요청 전송 중...');
        // 서버에 이미지 업로드
        // const response = await axios.post('http://localhost:5000/api/upload-image', formData, {
        const response = await api.post('/api//upload-image', formData, {

          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('✅ 이미지 업로드 성공:', response.data);
        
        // 업로드된 파일 정보 저장
        setImageFile(response.data.filename);  // 서버에서 반환한 파일명
        
      } catch (error) {
        console.error('❌ 이미지 업로드 실패:', error);
        console.error('❌ 서버 응답:', error.response?.data);
        genMsg('이미지 업로드 실패: ' + (error.response?.data?.error || error.message));
        throw error;
      }
    
  };

  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  

  // ✅ 메모리 정리 (이미지 미리보기용)
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="movie-mng-container">
      {/* 헤더 */}
      <div className="header-section">
        <div className="header-content">
          <h1 className="header-main-title">🎬 영화목록 관리</h1>
          <p className="header-subtitle">원하는 영화 정보를 {action=='reg'?'등록':
                                        ('mod'?'수정':'')}해보세요</p>
        </div>
      </div>
      
      {/* 영화정보 추가, 수정 폼 */}
      <div className="movie-form-container">   
         <h2 className="form-title">✨ 영화정보 {action=='reg'?'등록':
                                        ('mod'?'수정':'')}
         </h2>
          
          {/* 이미지 경로 */}
          <div className="input-group image-upload-group">
            <label className="input-label">
              <span className="label-icon">🖼️</span>
              이미지 파일 <span className="required">*</span>
            </label>

            <div className="image-upload-container">  
              {/* 파일 선택 버튼 */}
              <label 
                htmlFor="image-upload" 
                className="btn-file-select"
              >
                📁 파일 선택
              </label>
              <input
                ref = {imageInputRef}
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
              
              {/* 선택된 파일명 표시 */}
              {imageFile && (
                <div className="selected-file-info">
                  <span className="file-icon">📄</span>
                  <span className="file-name">{imageFile}</span>
                </div>
              )}

              {/* 이미지 미리보기 */}
              {(imagePreview || imageFile) && (
                <div className="image-preview-wrapper">
                  <div className="preview-label">미리보기</div>
                  <div className="image-preview">
                    <img id = "imgPreview"
                      src={ imagePreview ||  // ✅ 새 파일: Blob URL (즉시 표시)
                        // `http://localhost:5000/image/${imageFile}` } 
                        `/image/${imageFile}` } 
                      alt="미리보기"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="14"%3E이미지 없음%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                </div>
              )} 

            </div>
          </div>

          {/* 제목과 평점 */}
          <div className="input-row">
            <div className="input-group">
              <label className="input-label">
                <span className="label-icon">📝</span>
                제목 <span className="required">*</span>
              </label>
              <input
                id = "title"
                name="title"
                type="text"
                placeholder="영화 제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="styled-input"
                maxLength={20}
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">
                <span className="label-icon">⭐</span>
                평점
              </label>
              <input
                id = "rating"
                name="point"
                type="text"
                placeholder="예: 9.5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="styled-input"
                maxLength={4}
              />
            </div>
          </div>

          {/* 장르 선택 */}
          <div className="input-group">
            <label className="input-label">
              <span className="label-icon">🎭</span>
              장르 <span className="required">*</span>
            </label>
            <Dropdown className="styled-dropdown">
              <Dropdown.Toggle className="dropdown-toggle" ref = {genreRef}>
                {genre}
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu">
                <Dropdown.Item onClick={() => setGenre('스릴러')}>스릴러</Dropdown.Item>
                <Dropdown.Item onClick={() => setGenre('공포')}>공포</Dropdown.Item>
                <Dropdown.Item onClick={() => setGenre('액션')}>액션</Dropdown.Item>
                <Dropdown.Item onClick={() => setGenre('판타지')}>판타지</Dropdown.Item>
                <Dropdown.Item onClick={() => setGenre('애니메이션')}>애니메이션</Dropdown.Item>
                <Dropdown.Item onClick={() => setGenre('코믹')}>코믹</Dropdown.Item>
                <Dropdown.Item onClick={() => setGenre('로맨스')}>로맨스</Dropdown.Item>
                <Dropdown.Item onClick={() => setGenre('드라마')}>드라마</Dropdown.Item>
                <Dropdown.Item onClick={() => setGenre('SF')}>SF</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          {/* 개봉일과 상영시간 */}
          <div className="input-row">
            <div className="input-group">
              <label className="input-label">
                <span className="label-icon">📅</span>
                개봉일 <span className="required">*</span>
              </label>
              <input
                id = "openDate"
                name="date"
                type="text"
                placeholder="예: 2026.01.01"
                value={openDate}
                onChange={(e) => setOpenDate(e.target.value)}                  
                className="styled-input"
                maxLength={10}
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">
                <span className="label-icon">⏱️</span>
                상영시간
              </label>
              <input
                id = "showTime"
                name="time"
                type="text"
                placeholder="예: 120분"
                value={showTime}
                onChange={(e) => setShowTime(e.target.value)}                  
                className="styled-input"
                maxLength={4}
              />
            </div>
          </div>

          {/* 감독과 배우 */}
          <div className="input-row">
            <div className="input-group">
              <label className="input-label">
                <span className="label-icon">🎬</span>
                감독
              </label>
              <input
                id = "director"
                name="director"
                type="text"
                placeholder="감독 이름"
                value={director}
                onChange={(e) => setDirector(e.target.value)}                  
                className="styled-input"
                maxLength={20}
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">
                <span className="label-icon">🎭</span>
                출연진
              </label>
              <input
                id = "actor"
                name="actor"
                type="text"
                placeholder="출연진 이름"
                value={actor}
                onChange={(e) => setActor(e.target.value)}                  
                className="styled-input"
                maxLength={50}
              />
            </div>
          </div>

          {/* 예고편 */}
          <div className="input-group">
            <label className="input-label">
              <span className="label-icon">🎞️ </span>
              예고편
            </label>
            <input
                id = "trailer"
                name="trailer"
                type="text"
                placeholder="예고편 영상 링크주소"
                value={trailer}
                onChange={(e) => setTrailer(e.target.value)}                  
                className="styled-input"
                maxLength={80}
              />
          </div>

          {/* 줄거리 */}
          <div className="input-group">
            <label className="input-label">
              <span className="label-icon">📖</span>
              줄거리
            </label>
            <textarea
              id = "story"
              name="story"
              placeholder="영화 줄거리를 입력하세요"
              value={story}
              onChange={(e) => setStory(e.target.value)}                
              rows="4"
              className="styled-textarea"
            />
          </div>

          {/* 버튼 그룹 */}
          <div className="flex gap-3 pt-4">
            <button onClick={()=>{
                const actions = action == 'reg'?'reg':'mod';
                if(action != 'reg'){setAction('mod');}              
                handelAction(actions);
              }} className="btn-add">
              {action == 'reg' ? '✍️ ' : ('mod'?'✏️ ':'')}  
              영화정보 {action == 'reg' ? '등록' : '수정'}
            </button> &nbsp;&nbsp;

            {/* 수정 모드일 때만 삭제 버튼 표시 */}
            { (action === 'del' || action === '' || action === 'mod') && (
              <>
                <button onClick={()=>{
                  setAction('del'); handelAction('del');
                }} className="btn-del">
                  🗑️ 영화정보 삭제
                </button> &nbsp;&nbsp;
              </>
            )}

            <button onClick={ async ()=>{
              await refreshMovies();  // 영화 목록 새로고침
              navigate('/');        // 타이틀 페이지로 이동
            }} className="btn-list">
              📋 최근 목록 보기
            </button>
          </div>

        {/* 확인 모달 메세지 
            showModal : 메세지박스 표시여부 , modalMessage : 메세지내용 
            onClose : 메세지박스 종료 , action : 확인버튼 분기설정 파라미터
            handleRegist : 등록이벤트 , handleUpdate : 수정이벤트 , handleDelete : 삭제이벤트 */}
        <ConMsgBox showModal={showConModal} modalMessage={conModalMessage} 
           onClose={()=>{ setShowConModal(false); conModalMsg(''); }} action={action} 
           handleRegist={handleRegist} handleUpdate={handleUpdate} handleDelete={handleDelete} 
        />

        {/* 일반 알림 모달 메세지 
          showModal : 메세지박스 표시여부 , modalMessage : 메세지내용 
          handleConfirm : 확인버튼 이벤트  */}
        <GenMsgBox showModal={showGenModal} modalMessage={genModalMessage} 
          onClose={()=>{ setShowGenModal(false); genModalMsg(''); }}
          callBack={() => {
            // 이미지 파일 필수 메시지일 때만 파일 선택창 열기
            if(genModalMessage === '이미지 파일은 필수선택 항목입니다.') {
              setTimeout(() => {
                imageInputRef.current?.click();
              }, 100);
            }
            // ✅ 성공 후 이동 처리
            if (pendingNav) {
              setPendingNav(false);
              navigate('/');
              return;
            }
          }} 
        />          
      </div>

      {/* 전체 영화 목록 표시 */}
      <div className="movie-list-container">
        <h2 className="list-title">
          🎥 현재 영화 목록
          <span className="movie-count">{movies.length}개</span>
        </h2>
        
        <div className="movie-grid">
          {movies.map(movie => (
            <div key={movie.id} className="movie-card">
              {movie.image && (
                <div className="movie-image">
                  <img 
                    src={`/image/${movie.imageFile}`} 
                    alt={movie.title}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
              <div className="movie-content">
                <h3 className="movie-ListTitle">{movie.title}</h3>
                <div className="movie-info">
                  <div className="info-item">
                    <span className="info-label">장르:</span>
                    <span className="info-value genre-badge">{movie.genre}</span>
                  </div>
                  {movie.point && (
                    <div className="info-item">
                      <span className="info-label">평점:</span>
                      <span className="info-value rating">⭐ {movie.point}</span>
                    </div>
                  )}
                  {movie.date && (
                    <div className="info-item">
                      <span className="info-label">개봉일:</span>
                      <span className="info-value">{movie.date}</span>
                    </div>
                  )}
                  {movie.time && (
                    <div className="info-item">
                      <span className="info-label">상영시간:</span>
                      <span className="info-value">{movie.time}</span>
                    </div>
                  )}
                  {movie.director && (
                    <div className="info-item">
                      <span className="info-label">감독:</span>
                      <span className="info-value">{movie.director}</span>
                    </div>
                  )}
                  {movie.actor && (
                    <div className="info-item">
                      <span className="info-label">배우:</span>
                      <span className="info-value">{movie.actor}</span>
                    </div>
                  )}
                  {movie.story && (
                    <div className="movie-story">
                      <p>{movie.story}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {movies.length === 0 && (
          <div className="empty-state">
            <p className="empty-icon">🎬</p>
            <p className="empty-text">등록된 영화가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieMng;