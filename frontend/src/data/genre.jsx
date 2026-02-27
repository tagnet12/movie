import {Link, Routes, Route} from "react-router-dom";
import { Dropdown } from 'react-bootstrap';
import Detail from './detail.jsx';
import { useState, useEffect } from "react";
// import axios from 'axios';
import api from './api';  // 경로는 파일 위치에 맞게 조정

function Genre({setImgNo}){

  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  //@@@@@@@@@@@@@@@@@@@@@@@@ mySql을 이용한 데이터 조회  @@@@@@@@@@@@@@@@@@@@@@@  
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

     // 파라미터 세팅
    const [movies, setMovies] = useState([]);       // 영화목록

    // 이미지 목록 불러오기 함수 호출
    useEffect(() => {
      fetchImages();
    }, []);

    // 이미지 목록 불러오기
    const fetchImages = async () => {
      try {
        // const response = await axios.get('http://localhost:5000/api/images');
        const response = await api.get('/api/images');
        setMovies(response.data);
      } catch (error) {
        console.error('불러오기 실패:', error);
      }
    };

  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  


  let [sectionTitle, setSectionTitle] = useState('전체');
  let [selectedItem, setSelectedItem] = useState('장르별 선택');
  let [selectGenre,setSelectGenre] = useState('전체');

  // 장르 선택시 관련 텍스트 설정
  const genreChange = (genre)=>{
    if(genre == '장르별 선택'){ 
      setSelectGenre('전체'); setSectionTitle('전체'); 
      setSelectedItem('전체목록');   // 선택된 아이템명칭 설정
    }
    else{ 
      setSelectGenre(genre);    // 장르 목록 설정 (선택된 장르목록 검색시 )
      setSectionTitle(genre);   // 타이틀 설정
      setSelectedItem(genre);   // 선택된 아이템명칭 설정
    }  
  }

  // 선택한 장르에 대한 필터링 설정
  const infoFilter = movies.filter(movie => movie.genre === selectGenre);

  // 표시할 영화 개수 계산
  const movieCount = selectGenre === '전체' ? movies.length : infoFilter.length;

    return(
        <div>
            {/* 헤더 섹션 */}
            <div className="header-section">
              <div className="header-content">
                <h1 className="header-main-title">🎬 장르별 영화</h1>
                <p className="header-subtitle">원하는 장르의 영화를 선택해보세요</p>
              </div>
            </div>

            {/* 드롭다운 섹션 */}
            <div className="dropdown-section">
              <div className="dropdown-container">
                  <Dropdown className="custom-dropdown">
                    <Dropdown.Toggle variant="light" id="dropdown-genre">
                      <span className="dropdown-icon">🎭</span>      
                        {selectedItem}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={()=> genreChange('장르별 선택')} className="custom-dropdown-item">전체목록</Dropdown.Item>                       
                        <Dropdown.Item onClick={()=> genreChange('스릴러') } className="custom-dropdown-item">스릴러</Dropdown.Item>
                        <Dropdown.Item onClick={()=> genreChange('공포') } className="custom-dropdown-item">공포</Dropdown.Item>
                        <Dropdown.Item onClick={()=> genreChange('액션') } className="custom-dropdown-item">액션</Dropdown.Item>
                        <Dropdown.Item onClick={()=> genreChange('판타지') } className="custom-dropdown-item">판타지</Dropdown.Item>
                        <Dropdown.Item onClick={()=> genreChange('애니메이션') } className="custom-dropdown-item">애니메이션</Dropdown.Item>
                        <Dropdown.Item onClick={()=> genreChange('코믹') } className="custom-dropdown-item">코믹</Dropdown.Item>
                        <Dropdown.Item onClick={()=> genreChange('로맨스') } className="custom-dropdown-item">로맨스</Dropdown.Item>
                        <Dropdown.Item onClick={()=> genreChange('드라마') } className="custom-dropdown-item">드라마</Dropdown.Item>
                        <Dropdown.Item onClick={()=> genreChange('SF') } className="custom-dropdown-item">SF</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
              </div>
            </div>

            <Routes>
            {/* 영화 상세정보 페이지 */}
            <Route path='/detail/:id' element={<Detail setImgNo={setImgNo} />}/>    

            {/* 장르별 목록 */}
            <Route path='/' element={      
              <>   
                <div className='container'>
                  <div className='row'>
                    <h2 className="section-title">{sectionTitle} 목록 &nbsp;&nbsp;
                    <span className="movie-count">{movieCount}개</span></h2>
                    { 
                      selectGenre === '전체'
                      ? <ImageList allFlag={'all'} selectGenre={''} movies={movies} />                         // 전체목록 표시
                      : infoFilter.length === 0 
                        ? <NoList key='no-list' />  // '조회된 내용이 없습니다.'                            // 0건 목록 표시 
                        : <ImageList allFlag={'notAll'} selectGenre={selectGenre} movies={infoFilter} />   // 장르별 목록 표시
                    }
                  </div>
                </div>
              </>
            }/>     
          </Routes>            
        </div>
    )
}

// 전체 또는 장르별 설정
function ImageList({allFlag, selectGenre, movies}){
  return(
    movies
    .sort((a, b) => b.openDate - a.openDate)  // 개봉일 내림차순 정렬
    .map( (movie, i) => { 
      if( allFlag === 'all' )
      {
        return( <ImageListView movie={movie} i={i} /> )
      }else{
        if( movie.genre === selectGenre ){
          return( <ImageListView movie={movie} i={i} /> )
        }
      }
    })
  )
}

// 이미지 목록 표시
function ImageListView({movie, i}){
  return(
    <div className='col-md-4' key={i}> 
      <Link to={`/detail/${movie.id}`}>
        {/* <img className='imgList' src={`http://localhost:5000/image/${movie.imageFile}`} alt={movie.title} width='80%' height='60%' />  */}
        <img className='imgList' src={`${import.meta.env.VITE_API_URL}/image/${movie.imageFile}`} alt={movie.title} width='80%' height='60%' />
      </Link>
      <div>{movie.title}({movie.openDate})</div>
    </div>
  )
}

// 0건 목록 표시 
function NoList(){
  return(
    <div className="empty-state">
      <p className="empty-icon">🎬</p>
      <p className="empty-text">등록된 영화가 없습니다</p>
    </div>
  )
}

export default Genre;