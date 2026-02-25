import { useState, useEffect } from 'react';
import { Table, NavLink } from 'react-bootstrap';
import {useParams, Routes, Route, useNavigate } from "react-router-dom";
import Admin from './admin.jsx';
import axios from 'axios';

function detail({setImgNo, refreshMovies}){
  let {id} = useParams();           // 영화 데이터 식별 번호
  let navigate = useNavigate();

  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  //@@@@@@@@@@@@@@@@@@@@@@@@ mySql을 이용한 데이터 조회  @@@@@@@@@@@@@@@@@@@@@@@  
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

     // 파라미터 세팅
    const [movies, setMovies] = useState([]);       // 영화목록

    // 영화 정보 불러오기 함수 호출
    useEffect(() => {
      fetchMovies();           // 영화 정보 불러오기
    }, [id, setImgNo]);             // 의존성 배열에 setImgNo도 추가

    // 영화 정보 불러오기
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/images');
        const movie = response.data;

        // id로 영화 찾기 (배열 인덱스가 아닌 movie.id로 검색)
        const foundMovie = movie.find(movie => movie.id === Number(id));
        
        if (foundMovie) {   // 검색된 영화정보가 있으면
            setMovies(foundMovie);      // 영화정보 객체 세팅
            setImgNo(foundMovie.id);    // 영화 id 세팅
        } else {
            console.error('해당 ID의 영화를 찾을 수 없습니다.');
        }        
      } catch (error) {
        console.error('영화 정보 불러오기 실패:', error);
      }
    };

  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    // 버튼 클릭 이벤트( 관리자 페이지 이동 )
    const handelAction = ()=> {
        navigate('/admin', { 
            state: { 
                        deleteId : id,
                        updateId : id,
                        movieData : movies 
                    } 
        });
    }
  
    return(
    <div>
        <h2 className="section-title">영화정보</h2>
        <Table>
            <thead>
                <tr>
                    <th>제목</th>
                    <th>평점</th>                    
                    <th>장르</th>
                    <th>개봉일</th>
                    <th>런닝타임</th>
                    <th>감독</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{movies.title}</td>
                    <td>{movies.rating}</td>                    
                    <td>{movies.genre}</td>
                    <td>{movies.open_date}</td>
                    <td>{movies.show_time}</td>
                    <td>{movies.director}</td>
                </tr>
            </tbody>
        </Table>

        <Table>
            <thead>
                <tr>
                    <th>출연진</th>
                    <td>{movies.actor}</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>줄거리</th>
                    <td style={{whiteSpace: 'pre-line'}}>{movies.story}</td>
                </tr>
                <tr>
                    <th>예고편</th>
                    <td><NavLink onClick={()=>{ window.open(`${movies.trailer}`, '_blank', 'noopener,noreferrer'); }}>{movies.trailer}</NavLink></td>
                </tr>                
            </tbody>
        </Table>     

        {/* 버튼 그룹 */}
        <div className="flex gap-3 pt-4">
            <button onClick={()=>{ 
                handelAction();            
            }} className="btn-add"> ➕ 영화정보 관리 </button>&nbsp;&nbsp;
            
            <button onClick={ async ()=>{
                await refreshMovies();   // 영화 목록 새로고침
                navigate('/');           // 타이틀 페이지로 이동
            }} className="btn-reset"> 🔄 최근 목록 보기 </button>
        </div>   
        
        <Routes>
            {/* 영화 정보 수정 및 삭제 */}
            <Route path='/admin' element={<Admin/>} />
        </Routes>
    </div>
    )
}

export default detail;