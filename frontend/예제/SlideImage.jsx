// 슬라이드 애니메이션을 추가한 코드입니다:

import { useState } from 'react';

export default function ImageChanger() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('right');
  
  const images = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=500'
  ];
  
  const handleClick = () => {
    setDirection('right');
    setCurrentIndex((prevIndex) => (prevIndex + 1) % 3);
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="w-96 h-64 overflow-hidden rounded-lg mb-6 relative">
          <img 
            key={currentIndex}
            src={images[currentIndex]} 
            alt={`이미지 ${currentIndex + 1}`}
            className="w-full h-full object-cover absolute animate-slideIn"
          />
        </div>
        <button 
          onClick={handleClick}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          다음 이미지 ({currentIndex + 1}/3)
        </button>
      </div>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

// **추가된 부분:**

// 1. **overflow-hidden**: 이미지 컨테이너에 추가하여 슬라이드가 밖으로 넘치지 않게 합니다
// 2. **key={currentIndex}**: 이미지가 바뀔 때마다 애니메이션을 다시 실행합니다
// 3. **@keyframes slideIn**: 오른쪽에서 왼쪽으로 슬라이드되는 애니메이션을 정의합니다
// 4. **animate-slideIn**: 0.5초 동안 부드럽게 슬라이드됩니다

// 이제 버튼을 누르면 이미지가 오른쪽에서 왼쪽으로 슬라이드되면서 바뀝니다!