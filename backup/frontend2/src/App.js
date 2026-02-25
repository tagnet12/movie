import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // 파라미터 세팅
  const [images, setImages] = useState([]);       // 이미지 목록
  const [title, setTitle] = useState('');         // 영화제목
  const [rating, setRating] = useState('');       // 평점
  const [genre, setGenre] = useState('');         // 장르
  const [openDate, setOpenDate] = useState('');   // 개봉일
  const [showTime, setShowTime] = useState('');   // 상영시간
  const [director, setDirector] = useState('');   // 감독
  const [actor, setActor] = useState('');         // 출연진
  const [story, setStory] = useState('');         // 줄거리
  const [imageUrl, setImageUrl] = useState('');   // 이미지 경로

  // 이미지 목록 불러오기
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/images');
      setImages(response.data);
    } catch (error) {
      console.error('불러오기 실패:', error);
    }
  };

  // 이미지 저장하기
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('===== 저장 시작 =====');
  console.log('📤 전송할 데이터:', { 
    title, 
    rating, genre,
    open_date: openDate, 
    show_time: showTime,
    director, actor,
    story,
    image_url: imageUrl 
  });

    try {
      const response = await axios.post('http://localhost:5000/api/images', {
        title: title,
        rating: rating, genre: genre,
        open_date: openDate, show_time: showTime,
        director: director, actor: actor,
        story: story,
        image_url: imageUrl
      });
      
    console.log('✅ 서버 응답:', response);
    console.log('✅ 응답 데이터:', response.data);

      alert('저장 완료!');
      setTitle('');
      setImageUrl('');
      fetchImages(); // 목록 새로고침
    } catch (error) {
      console.error('저장 실패:', error);
      console.log('===== 에러 발생 =====');
    console.log('❌ 에러 객체:', error);
    console.log('❌ 에러 메시지:', error.message);
    console.log('❌ 에러 코드:', error.code);
    console.log('❌ 응답 상태:', error.response?.status);
    console.log('❌ 응답 데이터:', error.response?.data);
    console.log('❌ 요청 설정:', error.config);

      alert('저장 실패: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>이미지 목록 관리</h1>
      
      {/* 입력 폼 */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <div>
          <input
            type="text"
            placeholder="이미지 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ padding: '10px', marginRight: '10px', width: '200px' }}
          />
          <input
            type="text"
            placeholder="이미지 URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
            style={{ padding: '10px', marginRight: '10px', width: '300px' }}
          />
          <input
            type="text"
            placeholder="평점"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
                    <input
            type="text"
            placeholder="장르"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
                    <input
            type="text"
            placeholder="개봉일"
            value={openDate}
            onChange={(e) => setOpenDate(e.target.value)}
          />
                    <input
            type="text"
            placeholder="상영시간"
            value={showTime}
            onChange={(e) => setShowTime(e.target.value)}
          />
                    <input
            type="text"
            placeholder="감독"
            value={director}
            onChange={(e) => setDirector(e.target.value)}
          />
                    <input
            type="text"
            placeholder="배우"
            value={actor}
            onChange={(e) => setActor(e.target.value)}
          />
                    <input
            type="text"
            placeholder="줄거리"
            value={story}
            onChange={(e) => setStory(e.target.value)}
          />
        </div>
          <button type="submit" style={{ padding: '10px 20px' }}>
            저장
          </button>        
      </form>

      {/* 이미지 목록 */}
      <h2>저장된 이미지</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {images.map((image) => (
          <div key={image.id} style={{ border: '1px solid #ddd', padding: '10px' }}>
            <h3>{image.title}</h3>
            <img 
              src={image.image_url} 
              alt={image.title}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <p style={{ fontSize: '12px', color: '#666' }}>
            <h3>{image.rating}</h3>
            <h3>{image.genre}</h3>
            <h3>{image.openDate}</h3>
            <h3>{image.showTime}</h3>
            <h3>{image.director}</h3>
            <h3>{image.actor}</h3>
            <h3>{image.story}</h3>
              {new Date(image.reg_dt).toLocaleString('ko-KR')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
