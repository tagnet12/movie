
import { useState, useEffect } from 'react';
import { Navbar, Nav, NavLink, Container } from 'react-bootstrap';
import { Link, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Detail from './detail.jsx';
import Month from './month.jsx';
import Genre from './genre.jsx';
import MovieMng from './movieMng.jsx';
import Admin from './admin.jsx';
import Review from './review.jsx';
import ReviewDtl from './reviewDtl.jsx'
import './css/layout.css'; 
import './css/layout2.css';
import axios from 'axios';

function Title(){
  let [imgNo, setImgNo] = useState(0);
  // let [action, setAction] = new useState(''); // 영화정보의 수정, 삭제 여부
  let [slideDirection, setSlideDirection] = useState('');  // 슬라이드 방향
  let [genreKey, setGenreKey] = useState(0);               // Genre 컴포넌트 강제 리렌더링용
  let [monthKey, setMonthKey] = useState(0);               // Month 컴포넌트 강제 리렌더링용
  let [movieMngKey, setMovieMngKey] = useState(0);         // movieMng 컴포넌트 강제 리렌더링용
  const navigate = useNavigate();
  const location = useLocation();                          // 현재 URL 위치 감지

  // ================ 배너이미지 표시여부를 결정하기 위한 변수 =============
  // ============== (홈화면에서만 표시되도록 설정하기 위한 변수) ===========
  // 월별 페이지 여부 확인
  const isMonthPage = location.pathname.startsWith('/month'); 
  // 장르별 페이지 여부 확인
  const isGenrePage = location.pathname.startsWith('/genre');
  // 영화목록관리 페이지 여부 확인
  const isMovieMngPage = location.pathname.startsWith('/movieMng');
  // 관리자 페이지 여부 확인
  const isAdminPage = location.pathname.startsWith('/admin');
  // 관람평 페이지 여부 확인
  const isReviewPage = location.pathname.startsWith('/review'); 
  // =================================================================

  // ✅ 페이지 진입 시 스크롤 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);  // 경로가 변경될 때마다 실행  

  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  //@@@@@@@@@@@@@@@@@@@@@@@@ mySql을 이용한 데이터 조회  @@@@@@@@@@@@@@@@@@@@@@@  
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

     // 파라미터 세팅
    const [movies, setMovies] = useState([]);       // 영화목록

    // 이미지 목록 불러오기 함수 호출
    useEffect(() => {
      fetchMovies();
    }, []);

    // 이미지 목록 불러오기
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/images');
        setMovies(response.data);
      } catch (error) {
        console.error('불러오기 실패:', error);
      }
    };

  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


  // URL이 변경될 때 imgNo 동기화
  useEffect(() => {
    const match = location.pathname.match(/\/detail\/(\d+)/);
    if (match) {
      const newImgNo = Number(match[1]);
      setImgNo(newImgNo);
      console.log('URL에서 감지된 imgNo:', newImgNo); // 디버깅용
    } else if (location.pathname === '/') {
      // 홈으로 돌아올 때는 첫 번째 영화의 ID로 설정
      if (movies.length > 0) {
        setImgNo(movies[0].id);
      }
      console.log('홈으로 이동'); // 디버깅용
    }
  }, [location.pathname, movies]); // location 전체가 아닌 pathname만 의존

  // 왼쪽으로 배너 슬라이드 이동
  const prev = () => { 
    if (movies.length === 0) return; // movies가 없으면 실행 안 함

    // const newNo = imgNo === 0 ? movies.length - 1 : imgNo - 1;    
    const currentIndex = movies.findIndex(m => m.id === imgNo); 
    const newIndex = currentIndex === 0 ? movies.length - 1 : currentIndex - 1;   
    const newId = movies[newIndex]?.id;

    setSlideDirection('slide-left');  // 왼쪽으로 슬라이드

    setTimeout(() => {
      setSlideDirection('');
      setImgNo(newId ); 
      
      // detail 페이지에 있을 때만 navigate 실행
      if (location.pathname.startsWith('/detail/')) {
        navigate(`/detail/${newId }`);      
      }
    }, 500); // 애니메이션 시간과 맞춤
  }

  // 오른쪽으로 배너 슬라이드 이동
  const next = () => { 
    if (movies.length === 0) return; // movies가 없으면 실행 안 함

    // const newNo = imgNo === movies.length - 1 ? 0 : imgNo + 1;    
    const currentIndex = movies.findIndex(m => m.id === imgNo);
    const newIndex = currentIndex === movies.length - 1 ? 0 : currentIndex + 1;
    const newId = movies[newIndex]?.id;

    setSlideDirection('slide-right');  // 오른쪽으로 슬라이드

    setTimeout(() => {
      setSlideDirection('');
      setImgNo(newId); 

      // detail 페이지에 있을 때만 navigate 실행
      if (location.pathname.startsWith('/detail/')) {
        navigate(`/detail/${newId}`);
      }
    }, 500); // 애니메이션 시간과 맞춤
  }

  // 월별 메뉴 클릭 핸들러  
  const handleMonthClick = () => {
    // 이미 월별 페이지에 있을 경우 강제 리로드
    setMonthKey(prev => prev + 1);  // 강제 리렌더링
    navigate('/month');
  }

  // 장르별 메뉴 클릭 핸들러
  const handleGenreClick = () => {
    // 이미 장르별 페이지에 있을 경우 강제 리로드
    setGenreKey(prev => prev + 1);  // 강제 리렌더링
    navigate('/genre');
  }

  // // 영화목록관리 메뉴 클릭 핸들러
  // const handleMovieMngClick = () => {
  //   // 이미 장르 페이지에 있을 경우 강제 리로드
  //   setMovieMngKey(prev => prev + 1);  // 강제 리렌더링
  //   navigate('/movieMng');
  // }

  // 관리자페이지 메뉴 클릭 핸들러
  // const handleAdminClick = () => {
  //   // 이미 관리자 페이지에 있을 경우 강제 리로드
  //   setMovieMngKey(prev => prev + 1);  // 강제 리렌더링
  //   navigate('/admin');
  // }

  // console.log('현재 imgNo:', imgNo, '이미지:', info[imgNo]?.title); // 디버깅용
  console.log('현재 imgNo:', imgNo, '이미지:', movies.find(m => m.id === imgNo)?.title);


  return (
    <div style={{top: '10%'}}>
        {/* 메인 제목 */}
        <div className='black-nav'>
          <Navbar.Brand href='/'>
            <h1 className='movie-title'>🎬 Cine Park</h1>
          </Navbar.Brand>
        </div>
      
        {/* 메뉴 표시 */}
        <Navbar className="Navbar" bg="dark" variant='dark'>
          <Container>
            <Link to='/'>홈으로</Link>
            <Nav className="me-auto">           
              <NavLink onClick={handleMonthClick} >월별</NavLink>
              <NavLink onClick={handleGenreClick} >장르별</NavLink>
              <NavLink onClick={()=>{ navigate('/admin', {state:{action: 'reg'}}); }} >영화정보 등록</NavLink>
              <NavLink onClick={()=>{ navigate('/review'); }} >영화 관람평</NavLink>
            </Nav>
          </Container>
        </Navbar>

        {/* 배너 이미지목록 설정 */}
        <div id="divBg" className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8" style={{ minHeight: '100vh', justifyContent: 'flex-start', paddingTop: '2rem' }}>
          
          {/* 홈화면과 디테일 페이지에서만 배너 이미지 표시 */}
          {!isMonthPage && !isGenrePage && !isMovieMngPage && !isAdminPage && 
           !isReviewPage && movies.length > 0 &&(
            <>
              {/* 배너 이미지 표시 */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="w-96 h-64 overflow-hidden rounded-lg mb-6 relative">
                  <Link to={`/detail/${imgNo}`}>
                    {/* <img src={`/image/${movies[imgNo]?.imageFile}`} 
                        className={`banner-bg ${slideDirection}`} 
                        alt={movies[imgNo]?.title} /> */}
                    {/* 배열 인덱스가 아닌 id로 찾기 */}
                    <img src={`http://localhost:5000/image/${movies.find(m => m.id === imgNo)?.imageFile}`} 
                        className={`banner-bg ${slideDirection}`} 
                        alt={movies.find(m => m.id === imgNo)?.title} />    
                  </Link>

                  {/* 배너버튼 */}
                  <button className="nav-button prev" onClick={ prev } style={{ position: 'absolute', transform: 'translateY(-50%)', zIndex: 10 }}>&lt;</button>
                  <button className="nav-button next" onClick={ next } style={{ position: 'absolute', transform: 'translateY(-50%)', zIndex: 10 }}>&gt;</button>                 
                </div>
                {/* 디버깅: 현재 표시 중인 영화 제목 */}
                {/* <div className="text-center mt-2">
                  <strong>현재 배너: {info[imgNo]?.title}</strong>
                </div> */}
              </div>

              {/* 코멘트 */}
              <p className="read-the-docs">
                Click on the movie poster to view more
              </p>   
            </>
          )}
          
          <Routes>
            {/* 영화 상세정보 */}
            <Route path='/detail/:id' element={<Detail setImgNo={setImgNo} refreshMovies={fetchMovies} />}/>    
            <Route path='/month' element={<Month setImgNo={setImgNo} key={monthKey} />} /> 
            <Route path='/genre' element={<Genre setImgNo={setImgNo} key={genreKey} />} /> 
            <Route path='/movieMng' element={<MovieMng setImgNo={setImgNo} refreshMovies={fetchMovies} key={movieMngKey} />} />
            <Route path='/admin' element={<Admin refreshMovies={fetchMovies} /> } />
            <Route path='/review' element={<Review /> } />
            <Route path='/reviewDtl' element={<ReviewDtl /> } />

            {/* 최근 개봉작 목록 */}
            <Route path='/' element={      
              <>   
                <div className='container'>
                  <div className='row'>
                    <h2 className="section-title">🎥 최근 개봉작 &nbsp;&nbsp;
                    <span className="movie-count">{movies.length}개</span></h2>
                    { movies
                       .sort((a, b) => b.openDate - a.openDate)  // 개봉일 내림차순 정렬
                       .slice(0, 9)  // 상위 9개만
                       .map( (movies, i)=>{ // 최근 9개만 출력
                      return ( 
                        <div className='col-md-4' key={i}> 
                          <Link to={`/detail/${movies.id}`} >
                            <img className='imgList' src={`http://localhost:5000/image/${movies.imageFile}`} alt={movies.title} width='80%' height='60%' /> 
                          </Link>
                          <div>{movies.title}({movies.openDate})</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                {movies.length === 0 && (
                  <div className="empty-state">
                    <p className="empty-icon">🎬</p>
                    <p className="empty-text">등록된 영화가 없습니다</p>
                  </div>
                )}
              </>
            }/>     
          </Routes>
        </div>
    </div>
  )
}

export default Title;

// useEffect 추가: useLocation hook으로 현재 URL을 감지하고, URL에서 id를 추출하여 imgNo를 업데이트합니다
// useLocation import: react-router-dom에서 useLocation을 추가로 가져옵니다