import {Link, Routes, Route} from "react-router-dom";
import { Dropdown } from 'react-bootstrap';
import Detail from './detail.jsx';
import { useState, useEffect } from "react";;
import axios from 'axios';

function month({setImgNo}){

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
        const response = await axios.get('http://localhost:5000/api/images');
        setMovies(response.data);
      } catch (error) {
        console.error('불러오기 실패:', error);
      }
    };

  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 


  const months = ['01월','02월','03월','04월','05월','06월','07월','08월','09월','10월','11월','12월'];
  let [years, setYears] = useState('');
  let [sectionTitle1, setSectionTitle1] = useState('');
  let [sectionTitle2, setSectionTitle2] = useState('전체');
  let [selectedItem1, setSelectedItem1] = useState('년도별 선택');
  let [selectedItem2, setSelectedItem2] = useState('월별 선택');
  let [selectDate,setSelectDate] = useState('전체');
  let [disabledYn, setDisabledYn] = useState(true);

  // 년도별 선택 드롭박스 아이템 변경
  const yearChange = (year)=>{
    if(year == '년도별 선택'){ 
      setSelectDate('전체'); setSectionTitle1('전체');
      setSelectedItem1('전체목록'); setDisabledYn(true);
      setSectionTitle2(''); setSelectedItem2('월별 선택'); 
    }
    else{ 
      setSectionTitle1(year); setSelectedItem1(year); 
      setYears(year.substring(0,4)); setDisabledYn(false);

      if(selectedItem2 == '월별 선택'){
        setSectionTitle2('');
        setSelectDate(year.substring(0,4)); // 년도만으로 필터링 (예: '2025')
      } else {
        // 이미 월이 선택되어 있는 경우
        setSelectDate(year.substring(0,4) + '.' + selectedItem2.substring(0,2));
      }
    }
  }

  // 월별 선택 드롭박스 아이템 변경
  const monthChange = (months)=>{
    setSectionTitle2(months); setSelectedItem2(months); //setMonthList(months);
    setSelectDate(years + '.' + months.substring(0,2));
  }

  // 선택한 장르에 대한 필터링 설정
  const infoFilter = movies.filter(list =>{ 
    if(selectDate.length == 4)
    { return list.openDate.substring(0,4) === selectDate  }
    else
    { return list.openDate.substring(0,7) === selectDate }
  
  });

  // 표시할 영화 개수 계산
  const movieCount = selectDate === '전체' ? movies.length : infoFilter.length;

    return(
        <div>
            {/* 헤더 섹션 */}
            <div className="header-section">
              <div className="header-content">
                <h1 className="header-main-title">🎬 월별 영화</h1>
                <p className="header-subtitle">원하는 월별의 영화를 선택해보세요</p>
              </div>
            </div>

            {/* 드롭다운 섹션 */}
            <div className="dropdown-section">
              <div className="dropdown-container" style={{ display: 'flex', gap: '15px' }}>
              <Dropdown className="custom-dropdown">
                    <Dropdown.Toggle variant="light" id="dropdown-year">
                      <span className="dropdown-icon">🎭</span> 
                        {selectedItem1}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={()=> yearChange('년도별 선택') } className="custom-dropdown-item">전체목록</Dropdown.Item>
                        <Dropdown.Item onClick={()=> yearChange('2025년') } className="custom-dropdown-item">2025년</Dropdown.Item>
                        <Dropdown.Item onClick={()=> yearChange('2026년') } className="custom-dropdown-item">2026년</Dropdown.Item>
                    </Dropdown.Menu>
              </Dropdown>
              <Dropdown className="custom-dropdown">
                    <Dropdown.Toggle variant="light" id="dropdown-month" disabled={disabledYn}>
                      <span className="dropdown-icon">🎭</span> 
                        {selectedItem2}
                    </Dropdown.Toggle>
                    
                    <Dropdown.Menu style={{ maxHeight: '420px', overflowY: 'auto' }} >
                      {months.map( (months, index) => (
                          <Dropdown.Item onClick={()=> monthChange(months) } className="custom-dropdown-item">{months}</Dropdown.Item>
                        )
                      )}
                    </Dropdown.Menu>
              </Dropdown>
            </div>
            </div>
            
            <Routes>
            {/* 영화 상세정보 */}
            <Route path='/detail/:id' element={<Detail setImgNo={setImgNo} />}/>    

            {/* 최근 개봉작 목록 */}
            <Route path='/' element={      
              <>   
                <div className='container'>
                  <div className='row'>
                    <h2 className="section-title">{sectionTitle1} {sectionTitle2} 목록 &nbsp;&nbsp;
                    <span className="movie-count">{movieCount}개</span></h2>
                    { 
                      selectDate == '전체'
                      ? <ImageList allFlag={'all'} selectDate={''} movies={movies} />                // 전체목록 표시
                      : infoFilter.length === 0 
                        ? <NoList />  // '조회된 내용이 없습니다.'                     // 0건 목록 표시 
                        : <ImageList allFlag={'notAll'} selectDate={selectDate} movies={infoFilter} />   // 장르별 목록 표시
                    }
                  </div>
                </div>
              </>
            }/>     
          </Routes>
        </div>
    )
}

// 전체 또는 월별 설정
function ImageList({allFlag, selectDate, movies}){
  return(
    movies
    .sort((a, b) => b.openDate - a.openDate)  // 개봉일 내림차순 정렬
    .map( (list, i) => { 
      if( allFlag == 'all' )
      {
        return( <ImageListView list={list} i={i} /> )
      }else{
        if( list.openDate.startsWith(selectDate) ){
          return( <ImageListView list={list} i={i} key={i} /> )
        }
      }

      // startsWith : 첫번째 부분 데이터 비교
    })
  )
}

// 이미지 목록 표시
function ImageListView({list, i}){
  return(
    <div className='col-md-4' key={i}> 
      <Link to={`/detail/${list.id}`}>
        <img className='imgList' src={`http://localhost:5000/image/${list.imageFile}`} alt={list.title} width='80%' height='60%' /> 
      </Link>
      <div>{list.title}({list.openDate})</div>
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

export default month;