import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Dropdown, Table } from 'react-bootstrap';
// import axios from 'axios';
import api from './api';  // 경로는 파일 위치에 맞게 조정

function review() {    

  let [selectedItem, setSelectedItem] = useState('전체목록');  
  const [reviews, setReviews] = useState([]);
  const [searchType, setSearchType] = useState('all');
  const [searchTxt, setSearchTxt] = useState('');  
  const navigate = useNavigate();
  const location = useLocation();  // ✅ 추가

  // ✅ 페이지 진입 시 스크롤 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);  // 경로가 변경될 때마다 실행

  // 관람평 목록 불러오기 함수 호출
  useEffect(() => {
    fetchReviews();
  }, []);

  // 관람평 목록 불러오기
  const fetchReviews = async () => {
    try {
      // const response = await axios.get('http://localhost:5000/api/reviews', {params: {
      const response = await api.get('/api/reviews', {params: { 
        searchType: searchType , searchTxt: searchTxt
      }});

      setReviews(response.data);
    } catch (error) {
      console.error('관람평 불러오기 실패:', error);
    }
  };

  // 버튼 클릭 이벤트( 관람평 수정 )
  const handleUpdate = (review) => {
      navigate('/reviewDtl/', { 
          state: { action: 'mod',
                    reviewData : review 
                  } 
      });   // 관람평 수정페이지 이동
  }

  // 검색 항목 변경값 세팅
  const searchChange = (key, val) => {
    setSearchType(key);     // 관람평 목록 검색을 위한 키값
    setSelectedItem(val);   // 검색(선택)항목에 표시될 텍스트

    if(key == 'all'){ setSearchTxt(''); } 
    document.getElementById('searchTxt')?.focus();
  }

  return(
      <div>
          {/* 헤더 섹션 */}
          <div className="header-section">
            <div className="header-content">
              <h1 className="header-main-title">🎬 영화 관람평 관리</h1>
              <p className="header-subtitle">원하는 영화의 관람평을 작성하거나 확인해보세요</p>
            </div>
          </div>

          {/* 검색 그룹 */}
          <div className="dropdown-section">
            <div className="dropdown-container" style={{display : 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center', maxWidth: '50%'}}>
                <Dropdown className="custom-dropdown"  style={{width: 'auto', minWidth: '200px'}}>
                  <Dropdown.Toggle variant="light" id="dropdown-search">
                    <span className="dropdown-icon">🎭</span>      
                      {selectedItem}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                      <Dropdown.Item onClick={()=>{ searchChange('all','전체목록'); }} className="custom-dropdown-item">전체목록</Dropdown.Item>                       
                      <Dropdown.Item onClick={()=>{ searchChange('reviewType','관람평유형'); } } className="custom-dropdown-item">관람평유형</Dropdown.Item>                        
                      <Dropdown.Item onClick={()=>{ searchChange('title','제목'); } } className="custom-dropdown-item">제목</Dropdown.Item>
                      <Dropdown.Item onClick={()=>{ searchChange('reviewTxt','관람평'); } } className="custom-dropdown-item">관람평</Dropdown.Item>
                      <Dropdown.Item onClick={()=>{ searchChange('rating','평점'); } } className="custom-dropdown-item">평점</Dropdown.Item>
                      <Dropdown.Item onClick={()=>{ searchChange('writer','작성자'); } } className="custom-dropdown-item">작성자</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <input
                  id="searchTxt"
                  name="searchText"
                  type="text"
                  placeholder="검색어를 입력하세요"
                  value={searchTxt}
                  className="admin-input"
                  onChange={(e)=>{setSearchTxt(e.target.value)}}
                  onKeyDown={(e)=>{if(e.key === "Enter"){fetchReviews()}}}
                  autoFocus
                  style={{width:'400px', minWidth: '400px', height:'45px'}}
                /> 

                <button onClick={
                  fetchReviews 
                } className="btn-add" style={{padding: '8px 16px', fontSize: '18px' , whiteSpace: 'nowrap'}}> 
                🔍 검색하기 </button> 
            </div>
          </div>
          
          {/* 버튼 그룹 */}
          <div style={{marginBottom: '20px'}}>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
              <h2 className="section-title" style={{margin: 0, display: 'block', borderBottom: 'none', paddingBottom: 0}}>🎥 관람평 목록 &nbsp;&nbsp;
                <span className="movie-count">{reviews.length}개</span>
              </h2>

              <button onClick={()=>{ 
                  navigate('/reviewDtl/', {state:{action: 'reg'}});       
              }} className="btn-add" style={{padding: '8px 16px', fontSize: '18.5px', whiteSpace: 'nowrap', position: 'absolute', right: 0}}> 
                ✍️ 관람평 등록 </button>
            </div>
            <div style={{borderBottom: '3px solid #667eea', marginTop: '15px'}}></div>
          </div>
          
          <Table>
            <thead>
                <tr>
                    <th>순번</th>
                    <th>관람평 유형</th>
                    <th>영화 제목</th>
                    <th>평점</th>
                    <th>조회수</th>
                    <th>작성자</th>
                    <th>작성일</th>
                </tr>
            </thead>
            <tbody>
                {  reviews.length > 0 ? (
                  reviews.map( (review, index)=>(
                  <tr>
                    <td>{index + 1}</td>
                    <td>{review.reviewType}</td>                    
                    <td onClick={()=>{ handleUpdate(review); }} style={{cursor: 'pointer', color: '#667eea'}}>
                      {review.title}</td>
                    <td>{review.rating}</td>
                    <td>{review.hits}</td>
                    <td>{review.writer}</td>
                    <td>{review.regDt ? review.regDt.split('T')[0] : ''}</td>
                  </tr>
                  ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{textAlign: 'center'}}> 
                        조회된 데이터가 없습니다.
                      </td>
                    </tr>
                  )
                }                  
            </tbody>
          </Table>
      </div>
  )
}

export default review;