import { useState, useEffect } from 'react';
import { useParams, Routes, Route, useNavigate } from "react-router-dom";
import Admin from './admin.jsx';
// import axios from 'axios';
import api from './api';  // 경로는 파일 위치에 맞게 조정
import './css/detail.css'

function Detail({ setImgNo, refreshMovies }) {
  let { id } = useParams();
  let navigate = useNavigate();
  const [movies, setMovies] = useState({});

  useEffect(() => {
    fetchMovies();
  }, [id, setImgNo]);

  const fetchMovies = async () => {
    try {
      // const response = await axios.get('http://localhost:5000/api/images');
      const response = await api.get('/api/images');
      const movie = response.data;
      const foundMovie = movie.find(m => m.id === Number(id));
      if (foundMovie) {
        setMovies(foundMovie);
        setImgNo(foundMovie.id);
      } else {
        console.error('해당 ID의 영화를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('영화 정보 불러오기 실패:', error);
    }
  };

  const handelAction = () => {
    navigate('/admin', {
      state: {
        deleteId: id,
        updateId: id,
        movieData: movies,
      },
    });
  };

  // 평점을 별로 표현 (5점 만점 기준)
  const renderStars = (rating) => {
    // const score = parseFloat(rating) || 0;
    // const filled = Math.round(score / 2);
    // return '★'.repeat(filled) + '☆'.repeat(5 - filled);

    const score = Math.min(10, Math.max(0, Math.trunc(parseFloat(rating) || 0)));
    const filled = Math.trunc(score / 2);           // 꽉 찬 별 개수
    const hasHalf = score % 2 === 1;                // 홀수면 반개 별 존재
    const empty = 5 - filled - (hasHalf ? 1 : 0);   // 빈 별 개수

    return (
      <span>
        {'★'.repeat(filled)}
        {hasHalf && (
          <span className="detail-half-star">
            <span className="detail-half-star__bg">☆</span>
            <span className="detail-half-star__fill">★</span>
          </span>
        )}
        {'☆'.repeat(empty)}
      </span>
    );    
  };

  return (
    <div className="movie-mng-container"><br></br>
         {/* <div style={styles.badge}>🎬 영화 정보</div> */}
        <div className="movie-form-container">  
    {/* <div style={styles.page}> */}
      <div className="detail-container">

        {/* 헤더 영역 */}
       
        <h1 className="detail-title">{movies.title || '—'}</h1>

        <div className="detail-rating-wrap">
          <span className="detail-rating-stars">{renderStars(movies.rating)}</span>
          <span className="detail-rating-value">{movies.rating}</span>
          <span className="detail-rating-max">/ 10</span>
        </div>

        <hr className="detail-divider" />

        {/* 기본 정보 그리드 */}
        <div className="detail-info-grid">
          <div className="detail-info-card">
            <div className="detail-info-label">장르</div>
            <div className="detail-info-value">{movies.genre || '—'}</div>
          </div>
          <div className="detail-info-card">
            <div className="detail-info-label">개봉일</div>
            <div className="detail-info-value">{movies.open_date || '—'}</div>
          </div>
          <div className="detail-info-card">
            <div className="detail-info-label">상영시간</div>
            <div className="detail-info-value">{movies.show_time ? `${movies.show_time}` : '—'}</div>
          </div>
          <div className="detail-info-card">
            <div className="detail-info-label">감독</div>
            <div className="detail-info-value">{movies.director || '—'}</div>
          </div>
        </div>

        {/* 출연진 */}
        <div className="detail-full-card">
          <div className="detail-info-label">출연진</div>
          <div className="detail-info-value detail-info-value--mt">{movies.actor || '—'}</div>
        </div>

        {/* 줄거리 */}
        <div className="detail-full-card">
          <div className="detail-info-label">줄거리</div>
          <p className="detail-story-text">{movies.story || '—'}</p>
        </div>

        {/* 예고편 */}
        <div className="detail-full-card">
          <div className="detail-info-label">예고편</div>
          <span
            className="detail-trailer-link" 
            onClick={() => {
              if (movies.trailer) window.open(movies.trailer, '_blank', 'noopener,noreferrer');
            }}
            // onMouseEnter={e => { e.currentTarget.style.color = 'blue'; e.currentTarget.style.textDecoration = 'underline'; }}
            // onMouseLeave={e => { e.currentTarget.style.color = 'darkblue'; e.currentTarget.style.textDecoration = 'none'; }}
          >
            ▶ {movies.trailer || '링크 없음'}
          </span>
        </div>


{/* </div> */}
      </div>

        {/* 버튼 그룹 */}
        <div className="detail-button-group">
          <button
            className="detail-btn detail-btn--primary"
            onClick={handelAction}
            // onMouseEnter={e => { e.target.style.background = '#5bb8d4'; e.target.style.color = 'white'; }}
            // onMouseLeave={e => { e.target.style.background = 'lightblue'; e.target.style.color = 'black'; }}
          >
            ✏️ 영화정보 관리
          </button>
          <button
            className="detail-btn detail-btn--secondary"
            onClick={async () => {
              await refreshMovies();
              navigate('/');
            }}  
            // onMouseEnter={e => { e.target.style.background = '#5bb8d4'; e.target.style.color = 'white'; }}
            // onMouseLeave={e => { e.target.style.background = 'lightblue'; e.target.style.color = 'black'; }}
          >
            🔄 최근 목록 보기
          </button>
        </div>
        </div>
<br></br>
      <Routes>
        <Route path='/admin' element={<Admin />} />
      </Routes>
    </div>
  );
}

export default Detail;