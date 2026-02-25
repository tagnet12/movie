import React, { useState, useEffect } from 'react';

export default function SimpleSlideBanner() {
  const [current, setCurrent] = useState(0);

  const slides = [
    { title: "첫 번째 슬라이드", bg: "#FF6B6B" },
    { title: "두 번째 슬라이드", bg: "#4ECDC4" },
    { title: "세 번째 슬라이드", bg: "#45B7D1" },
    { title: "네 번째 슬라이드", bg: "#FFA07A" }
  ];

  // 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // 이전/다음 버튼
  const prev = () => setCurrent((current - 1 + slides.length) % slides.length);
  const next = () => setCurrent((current + 1) % slides.length);

  return (
    <div style={{ position: 'relative', width: '100%', height: '500px', overflow: 'hidden' }}>
      {/* 슬라이드 */}
      {slides.map((slide, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: slide.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: i === current ? 1 : 0,
            transition: 'opacity 0.5s'
          }}
        >
          <h2 style={{ color: 'white', fontSize: '48px', fontWeight: 'bold' }}>
            {slide.title}
          </h2>
        </div>
      ))}

      {/* 이전 버튼 */}
      <button
        onClick={prev}
        style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.3)',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          cursor: 'pointer',
          fontSize: '24px',
          color: 'white'
        }}
      >
        ‹
      </button>

      {/* 다음 버튼 */}
      <button
        onClick={next}
        style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,0.3)',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          cursor: 'pointer',
          fontSize: '24px',
          color: 'white'
        }}
      >
        ›
      </button>

      {/* 하단 도트 */}
      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px' }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? '30px' : '10px',
              height: '10px',
              borderRadius: '5px',
              border: 'none',
              background: 'white',
              opacity: i === current ? 1 : 0.5,
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          />
        ))}
      </div>
    </div>
  );
}
