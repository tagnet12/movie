import React, { useState } from 'react';

export default function App() {
  const [showMain, setShowMain] = useState(false);

  if (showMain) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold mb-4">메인 페이지</h1>
        <p className="mb-4">환영합니다!</p>
        <button 
          onClick={() => setShowMain(false)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          뒤로가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="text-center">
        {/* 이미지 */}
        <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center">
          <span className="text-5xl">🚀</span>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-8">타이틀 화면</h1>
        
        <button 
          onClick={() => setShowMain(true)}
          className="px-8 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100"
        >
          시작하기
        </button>
      </div>
    </div>
  );
}
