import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GenMsgBox from './msgBox/GenMsgBox.jsx';
import './css/admin.css'

function admin({refreshMovies}){
  const [inputValue, setInputValue] = useState('');
  const [deleteId, setDeleteId] = useState('');       // 삭제할 ID
  const [updateId, setUpdateId] = useState('');       // 수정할 ID
  const navigate = useNavigate();
  const location = useLocation();                     // location 추가
  const [movieData, setMovieData] = useState(null);
  const [action, setAction] = useState('');
  const [validate, setValidate] = useState('');

  // 모달 관련 state
  const [showGenModal, setShowGenModal] = useState(false);  // 알림 메세지상자 표시여부
  const [genModalMessage, genModalMsg] = useState('');      // 알림 메세지 내용
  const genMsg = (str)=>{
    setShowGenModal(true); genModalMsg(str);
  } 

  // detail 페이지에서 전달받은 ID가 있으면 설정
  useEffect(() => {
    if (location.state?.deleteId) {
      setDeleteId(location.state.deleteId);
      console.log('📌 전달받은 영화 ID:', location.state.deleteId);
    } 
    
    if(location.state?.updateId) {
      setUpdateId(location.state?.updateId);
      console.log('📌 전달받은 영화 ID:', location.state.updateId);
    } 
    
    if(location.state?.movieData) {
      setMovieData(location.state?.movieData);
      console.log('📌 전달받은 영화 ID:', location.state.movieData);
    }

    if(location.state?.action) {
      setAction(location.state?.action);
      console.log('📌 전달받은 영화 ID:', location.state.action);
    }

  }, [location]);

  // 관리자 로그인 체크 및 액션 호출
  const goAdmin = async () => { 
    if(!validation()){return;}     // 유효성 검사

    // if(inputValue !== '1q2w3e4r%t') {
    //   genMsg('올바른 관리자암호를 입력해주세요.');
    //   return;
    // }

    navigate('/movieMng', { 
      state: { movieData: movieData, updateId: updateId, deleteId: deleteId, action: action }
    });
  }

  const validation = ()=>{
  
    // 폰트설정하기 ( 색상, 크기 등 )
    // reviewDtl페이지에도 같은 조건 적용하기

    if(inputValue == '')
    { genMsg('패스워드는 필수입력 항목입니다.'); 
      document.getElementById('inputPwd')?.focus();
      return false; } 
      
    let str = inputValue; 
    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;
    if( !regex.test(str) )
    { setValidate('* 패스워드는 문자열, 숫자, 특수문자가 모두 포함되어야 합니다.');
      document.getElementById('validate-text').style.color = 'red';      
      document.getElementById('inputPwd')?.focus(); return false; }  

    if( str.length < 8 )
    { setValidate('패스워드는 8자리 이상으로 입력해야됩니다.'); 
      document.getElementById('validate-text').style.color = 'red';
      document.getElementById('inputPwd')?.focus(); return false; } 

    return true;
  }  

  return(
    <div className="admin-container">
      <div className="admin-login-box">
        {/* 제목 그룹 */}
        <h1 className="admin-title">
          <span>🔐</span>
          관리자 로그인
        </h1>
        <p className="admin-subtitle">
          관리자 권한이 필요한 페이지입니다
        </p>

        {/* 입력 그룹 */}
        <label className="admin-input-label">
          <span className="label-icon">🔐</span>
          관리자 암호
        </label>
        <input id='inputPwd'
          name="password"
          type="password"
          placeholder="관리자 암호를 입력하세요"
          className="admin-input"
          value={inputValue}
          onChange={(e)=>{setInputValue(e.target.value)}}
          onKeyDown={(e)=>{if(e.key === "Enter"){goAdmin()}}}
          autoFocus
        />         

        <p id='validate-text' style={{fontSize: '12px', fontWeight: 'bold'}}>
            {validate}
        </p>

        {/* 버튼 그룹 */}
        <div className="flex gap-3 pt-4">
          <button className="btn-add" onClick={goAdmin}>확인</button> &nbsp;
          <button onClick={ async ()=>{
              await refreshMovies();  // 영화 목록 새로고침
              navigate('/');        // 타이틀 페이지로 이동
          }} className="btn-reset">취소</button>
        </div>

          {/* 일반 알림 모달 메세지 
            showModal : 메세지박스 표시여부 , modalMessage : 메세지내용 
            handleConfirm : 확인버튼 이벤트  */}
          <GenMsgBox showModal={showGenModal} modalMessage={genModalMessage} 
            onClose={()=>{ setShowGenModal(false); genModalMsg(''); }}
            callBack={''} 
          />         
      </div>
    </div>
  )
}

export default admin;