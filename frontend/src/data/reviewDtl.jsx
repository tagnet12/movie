import { React, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Dropdown } from 'react-bootstrap';;
// import axios from 'axios';
import api from './api';  // 경로는 파일 위치에 맞게 조정
import ConMsgBox from './msgBox/ConMsgBox.jsx';
import GenMsgBox from './msgBox/GenMsgBox.jsx';
import InputMsgBox from './msgBox/InputMsgBox.jsx';

function reviewDtl() {

  // 관람평정보 표시를 위한 파라미터 선언 ( 관람평정보 수정용 )
  const [reviews, setReviews] = useState();
  const [reviewType, setReviewType] = useState('관람평 유형 선택');  // 관람평 유형
  const [title, setTitle] = useState('');               // 영화제목
  const [reviewTxt, setReviewTxt] = useState('');       // 관람평
  const [rating, setRating] = useState('');             // 평점
  const [writer, setWriter] = useState('');             // 작성자
  const [reviewPwd, setReviewPwd] = useState('');       // 패스워드
  const [updateId, setUpdateId] = useState('');         // 수정할 ID
  const [deleteId, setDeleteId] = useState('');         // 삭제할 ID
  const [action, setAction] = useState('');
  const [validate, setValidate] = useState('');
  const [inputPwd, setInputPwd] = useState('');
  // const onAfterRef = useRef(false);
  const afterMsgRef = useRef(null); 

  const navigate = useNavigate()
  const location = useLocation();
  const reviewTypeRef = useRef(null);

  // 모달 관련 state
  const [showConModal, setShowConModal] = useState(false);  // 확인 메세지상자 표시여부
  const [showGenModal, setShowGenModal] = useState(false);  // 알림 메세지상자 표시여부
  const [showInputModal, setShowInputModal] = useState(false);  // 입력 메세지상자 표시여부
  const [conModalMessage, conModalMsg] = useState('');      // 확인 메세지 내용
  const [genModalMessage, genModalMsg] = useState('');      // 알림 메세지 내용
  const [inputModalMessage, inputModalMsg] = useState('');      // 입력 메세지 내용
  const conMsg = (str)=>{                                   // 확인 메세지 호출함수   
    setShowConModal(true); conModalMsg(str);
  }  
  const genMsg = (str)=>{                                   // 알림 메세지 호출함수 
    setShowGenModal(true); genModalMsg(str);
  }
  const inputMsg = (str)=>{                                 // 입력 메세지 호출함수 
    setShowInputModal(true); inputModalMsg(str);
  }  

  // 관람평정보 파라미터 세팅( 수정용 파라미터 )
  useEffect(() => {
    if(location.state?.reviewData)
    {
      const reviewData = location.state?.reviewData      
      console.log('📌 전달받은 관람평 정보:', reviewData);

      setUpdateId(reviewData.id);
      setDeleteId(reviewData.id);
      setTitle(reviewData.title);
      setRating(reviewData.rating);
      setReviewType(reviewData.reviewType);
      setWriter(reviewData.writer);
      setReviewPwd(reviewData.reviewPwd);
      setReviewTxt(reviewData.reviewTxt);
    }

    if(location.state?.action) {
      // 패스워드 활성/비활영 여부 설정
      if(location.state.action == 'reg'){document.getElementById('reviewPwd').disabled = false};
      if(location.state.action == 'mod'){document.getElementById('reviewPwd').disabled = true};
      setAction(location.state?.action);
      console.log('📌 전달받은 관람평 분기 구분:', location.state.action);
    }
    
  }, [location.state]);

  // 초기설정
  useEffect(() => {
    if(updateId && action === 'mod') {  // 수정 모드일 때만 실행
      hitsUpdate();        // 조회수 업데이트
    }
  }, [updateId, action]);  // 의존성 배열 추가

  // 버튼 클릭 이벤트( 등록, 수정, 삭제 )
  const handelAction = async (actions) => {
    if(actions != 'del'){             // 삭제일 때는 유효성 검사를 하지 않음
      if( !validation() ){ return;}   // 유효성 검사
    }

    let str = '관람평정보를 ';
    if(actions == 'reg'){ str += '등록'; }   // 등록하기
    if(actions == 'mod'){ str += '수정'; }   // 수정하기
    if(actions == 'del'){ str += '삭제'; }   // 삭제하기

    conMsg(str);
  }

  // 관람평정보 유효성 검사
  const validation = ()=>{
    // 삭제 시에는 유효성 검사 건너뛰기
    if(action === 'del') {
      return true;
    }

    if(document.getElementById('title').value == '')
    { genMsg('제목은 필수입력 항목입니다.'); 
      document.getElementById('title')?.focus(); return false; }

    if(reviewType == '관람평 유형 선택')
    { genMsg('관람평유형은 필수선택 항목입니다.'); 
      reviewTypeRef.current?.focus(); return false; }

    if(document.getElementById('writer').value == '')
    { genMsg('작성자는 필수입력 항목입니다.'); 
      document.getElementById('writer')?.focus(); return false; }      

    let inputValue = document.getElementById('reviewPwd');   
    if(document.getElementById('reviewPwd').value == '')
    { genMsg('패스워드는 필수입력 항목입니다.'); 
      inputValue?.focus(); return false; } 
      
    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;
    if( !regex.test(inputValue.value) )
    { setValidate('패스워드는 문자열, 숫자, 특수문자가 모두 포함되어야 합니다.'); 
      document.getElementById('validate-text').style.color = 'red';  
      inputValue?.focus(); return false; }  

    if( inputValue.value.length < 8 )
    { setValidate('패스워드는 8자리 이상으로 입력해야됩니다.'); 
      document.getElementById('validate-text').style.color = 'red'; 
      inputValue?.focus(); return false; } 

    setValidate('');  

    if(document.getElementById('reviewTxt').value == '')
    { genMsg('관람평은 필수입력 항목입니다.'); 
      document.getElementById('reviewTxt')?.focus(); return false; }      
     
    return true;
  }  

  // 관람평정보 등록하기
  const handleRegist = async (e) => {
    console.log('===== 저장 시작 =====');
    console.log('📤 전송할 데이터:', { 
      reviewType, title, reviewTxt, rating, writer, reviewPwd
    });

    try {
  
      // DB 데이터 저장
      // const response = await axios.post('http://localhost:5000/api/reviews', {
      const response = await api.post('/api/reviews', {
        review_type: reviewType, title: title, review_txt: reviewTxt, 
        rating: rating, writer: writer, review_pwd: reviewPwd
      });
      
      console.log('✅ 서버 응답:', response);
      console.log('✅ 응답 데이터:', response.data);

      // 목록 페이지로 이동  
      afterMsgRef.current = () => navigate('/review'); 
      genMsg(`관람평정보가 정상적으로 등록되었습니다.`);
      
      setTitle('');       

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

  // 관람평정보 수정하기
  const handleUpdate = async (inputPwd) => {
    
    // 패스워드 입력 받기
    inputMsg('수정하려면 패스워드를 입력하세요');
     
    // ✅ 입력값이 없으면(취소 등) 아무 동작도 하지 않음
    if (!inputPwd) { return; }

    // 패스워드 확인
    if (inputPwd !== reviewPwd) {
      genMsg('패스워드가 일치하지 않습니다.');
      return;
    }

    console.log('===== 수정 시작 =====');
    console.log('📤 전송할 ID:', updateId);  // ✅ ID 확인
    console.log('📤 전송할 데이터:', { 
      id : updateId,
      reviewType, title, reviewTxt, rating, writer
    });

    try {

      // ✅ updateId가 존재하는지 확인
      if (!updateId) {
        genMsg('수정할 관람평 ID가 없습니다.');
        return;
      }

      // DB 데이터 저장
      // const response = await axios.put(`http://localhost:5000/api/reviews/${updateId}`, {
      const response = await api.put(`/api/reviews/${updateId}`, { 
        review_type: reviewType, title: title, review_txt: reviewTxt, 
        rating: rating, writer: writer
      });
      
      console.log('✅ 서버 응답:', response);
      console.log('✅ 응답 데이터:', response.data);

      afterMsgRef.current = () => navigate('/review'); 
      genMsg(`관람평정보가 정상적으로 수정되었습니다.`);

    } catch (error) {
      console.error('수정 실패:', error);
      console.log('===== 에러 발  생 =====');
      console.log('❌ 에러 객체:', error);
      console.log('❌ 에러 메시지:', error.message);
      console.log('❌ 에러 코드:', error.code);
      console.log('❌ 응답 상태:', error.response?.status);
      console.log('❌ 응답 데이터:', error.response?.data);
      console.log('❌ 요청 설정:', error.config);

      genMsg('수정 실패: ' + (error.response?.data?.error || error.message));
    }
  }

  // 관람평 조회수 수정하기
  const hitsUpdate = async (e) => {
    console.log('===== 수정 시작 =====');
    console.log('📤 전송할 데이터:', { 
      id : updateId
    });

    try {

      // DB 데이터 저장
      // const response = await axios.put(`http://localhost:5000/api/reviews/${updateId}/hits`);
      const response = await api.put(`/api/reviews/${updateId}/hits`);

      console.log('✅ 서버 응답:', response);
      console.log('✅ 응답 데이터:', response.data);

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

  // 관람평정보 삭제하기
  const handleDelete = async (inputPwd) => {
    // 패스워드 입력 받기
    inputMsg('삭제하려면 패스워드를 입력하세요:');

    // ✅ 입력값이 없으면(취소 등) 아무 동작도 하지 않음
    if (!inputPwd) { return; } 
    // 패스워드 확인
    if (inputPwd !== reviewPwd) {
      genMsg('패스워드가 일치하지 않습니다.');
      return;
    }

    console.log('===== 삭제 시작 =====');
    console.log('📤 전송할 데이터:', { id : deleteId });

    try {
      // const response = await axios.delete(`http://localhost:5000/api/reviews/${deleteId}`);
      const response = await api.delete(`/api/reviews/${deleteId}`);

      console.log('✅ 서버 응답:', response);
      console.log('✅ 응답 데이터:', response.data);

      afterMsgRef.current = () => navigate('/review'); 
      genMsg(`관람평정보가 정상적으로 삭제되었습니다.`);

      setDeleteId('');

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

  return (
    <div className="movie-mng-container">
      {/* 헤더 */}
      <div className="header-section">
        <div className="header-content">
          <h1 className="header-main-title">🎬 관람평목록 관리</h1>
          <p className="header-subtitle">원하는 관람평 정보를 {action=='reg'?'등록':
                                        ('mod'?'수정':'')}해보세요</p>
        </div>
      </div>
      
      {/* 영화 추가 폼 */}
      <div className="movie-form-container">   
         <h2 className="form-title">✨ 관람평정보 {action=='reg'?'등록':
                                        ('mod'?'수정':'')}</h2>
                      
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
                  placeholder="영화 제목을 입력하세요"
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
                  name="rating"
                  type="text"
                  placeholder="예: 9.5"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="styled-input"
                  maxLength={4}
                />
              </div>
            </div>

            {/* 관람평 유형과 작성자와 패스워드 */}
            <div className="input-row" style={{gridTemplateColumns: '1fr 1fr 1fr', alignItems: 'flex-start'}}>
              <div className="input-group">
                <label className="input-label">
                  <span className="label-icon">🎭</span>
                  관람평 유형 <span className="required">*</span>
                </label>
                <Dropdown className="styled-dropdown">
                  <Dropdown.Toggle className="dropdown-toggle" ref = {reviewTypeRef}
                  style={{height: '70px', display: 'flex', alignItems: 'center'}} >
                    {reviewType || '관람평 유형 선택'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu">
                    <Dropdown.Item onClick={() => setReviewType('시네파크')}>시네파크</Dropdown.Item>
                    <Dropdown.Item onClick={() => setReviewType('네이버')}>네이버</Dropdown.Item>
                    <Dropdown.Item onClick={() => setReviewType('기타')}>기타</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              
              <div className="input-group">
                <label className="input-label">
                  <span className="label-icon">⏱️</span>
                  작성자 <span className="required">*</span>
                </label>
                <input
                  id = "writer"
                  name="writer"
                  type="text"
                  placeholder="예: 홍길동"
                  value={writer}
                  onChange={(e) => setWriter(e.target.value)}                  
                  className="styled-input"
                  maxLength={10}
                />
              </div>

              <div className="input-group">
                  <label className="input-label">
                    <span className="label-icon">🔐</span>
                    패스워드 <span className="required">*</span>
                  </label>
                  <input
                    id = "reviewPwd"
                    name="reviewPwd"
                    type="password"
                    placeholder="패스워드를 입력하세요"
                    value={reviewPwd}
                    onChange={(e) => setReviewPwd(e.target.value)}                  
                    className="styled-input"
                    maxLength={15}
                  />
                  <p id='validate-text' style={{fontSize: '12px', fontWeight: 'bold'}}>
                    {validate}
                  </p>     
              </div>  

            </div>

            {/* 영화 관람평 */}
            <div className="input-group">
              <label className="input-label">
                <span className="label-icon">📅</span>
                관람평 <span className="required">*</span>
              </label>
              <textarea
                id = "reviewTxt"
                name="reviewTxt"
                type="text"
                placeholder="영화 관람평을 입력하세요"
                value={reviewTxt}
                onChange={(e) => setReviewTxt(e.target.value)}                  
                className="styled-textarea" rows="4"
              />             
            </div>

            {/* 버튼 그룹 */}
            <div className="flex gap-3 pt-4">
              <button onClick={()=>{handelAction(action)}} className="btn-add">
                {action == 'reg' ? '✍️ ' : ('mod'?'✏️ ':'')}
                 관람평 정보 {action == 'reg' ? '등록' : ('mod'?'수정':'')}
              </button> &nbsp;&nbsp;

              {/* 수정 모드일 때만 삭제 버튼 표시 */}
              {(action === 'mod' || action === 'del') && (
                <>
                  <button onClick={()=>{
                      setAction('del'); handelAction('del');             
                  }} className="btn-del"> 🗑️ 관람평 정보 삭제 
                  </button> &nbsp;&nbsp;
                </>
              )}
              <button onClick={ async ()=>{
                navigate('/review');      // 관람평 페이지로 이동
              }} className="btn-list">
                📋 관람평 목록 보기
              </button>
            </div>
         </div>

        {/* 확인 모달 메세지 
            showModal : 메세지박스 표시여부 , modalMessage : 메세지내용 
            onClose : 메세지박스 종료 , action : 확인버튼 분기설정 파라미터
            handleRegist : 등록이벤트 , handleUpdate : 수정이벤트 , handleDelete : 삭제이벤트 */}
        <ConMsgBox showModal={showConModal} modalMessage={conModalMessage} 
           onClose={()=>{ setShowConModal(false); conModalMsg(''); }}
           onCancel={()=>{ if(action === 'del') setAction('mod'); }} // ✅ 삭제 중이었다면 다시 mod로 복원
           action={action} 
           handleRegist={handleRegist} handleUpdate={handleUpdate} handleDelete={handleDelete} />

        {/* 일반 알림 모달 메세지 
            showModal : 메세지박스 표시여부 , modalMessage : 메세지내용 
            onClose : 메세지박스 종료 , callBack : 콜백함수 싫행  */}
        <GenMsgBox showModal={showGenModal} modalMessage={genModalMessage} 
          onClose={()=>{ setShowGenModal(false); genModalMsg(''); 
              if (afterMsgRef.current) {       // ✅ 콜백이 있으면 실행 (목록 이동)
                afterMsgRef.current();
                afterMsgRef.current = null;    // ✅ 초기화
              }
          }} 
          callBack={''}
        /> 

        {/* 입력 모달 메세지 
            showModal : 메세지박스 표시여부 , modalMessage : 메세지내용 
            onClose : 메세지박스 종료 , callBack : 콜백함수 싫행  */}
        <InputMsgBox showModal={showInputModal} modalMessage={inputModalMessage} 
          onClose={()=>{ setShowInputModal(false); inputModalMsg(''); 
            // 성공 메시지였고 페이지 이동이 필요한 경우
            // if (onAfterRef.current) {
            //   onAfterRef.current = false; navigate('/review');
            // }
          }} action={action} 
          handleUpdate={handleUpdate} handleDelete={handleDelete}
        />         
    </div>
  );
}

export default reviewDtl;