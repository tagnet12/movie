import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Test() {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');

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
    
    try {
      await axios.post('http://localhost:5000/api/images', {
        title: title,
        image_url: imageUrl
      });
      
      alert('저장 완료!');
      setTitle('');
      setImageUrl('');
      fetchImages(); // 목록 새로고침
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장 실패!');
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
          <button type="submit" style={{ padding: '10px 20px' }}>
            저장
          </button>
        </div>
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
              {new Date(image.created_at).toLocaleString('ko-KR')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Test;