import React, { useState } from 'react';

export default function App() {
  const [showMainPage, setShowMainPage] = useState(false);

  if (showMainPage) {
    return <MainPage onBack={() => setShowMainPage(false)} />;
  }

  return <TitleScreen onEnter={() => setShowMainPage(true)} />;
}

function TitleScreen({ onEnter }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-8 animate-fade-in">
        {/* 로고/이미지 영역 */}
        <div className="mb-8">
          <div className="w-48 h-48 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse-slow">
            <svg 
              className="w-32 h-32 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 10V3L4 14h7v7l9-11h-7z" 
              />
            </svg>
          </div>
        </div>

        {/* 타이틀 */}
        <h1 className="text-6xl font-bold text-white tracking-wider">
          환영합니다
        </h1>
        
        <p className="text-xl text-blue-200 max-w-md mx-auto">
          멋진 애플리케이션에 오신 것을 환영합니다
        </p>

        {/* 시작 버튼 */}
        <button
          onClick={onEnter}
          className="mt-12 px-12 py-4 bg-white text-purple-900 rounded-full font-bold text-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-blue-50"
        >
          시작하기
        </button>

        {/* 장식 요소 */}
        <div className="mt-16 flex gap-2 justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function MainPage({ onBack }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">메인 페이지</h1>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              타이틀로 돌아가기
            </button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 카드 1 */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">빠른 성능</h3>
            <p className="text-gray-600">최적화된 성능으로 빠르게 작동합니다.</p>
          </div>

          {/* 카드 2 */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">안정성</h3>
            <p className="text-gray-600">신뢰할 수 있는 안정적인 서비스를 제공합니다.</p>
          </div>

          {/* 카드 3 */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">사용자 정의</h3>
            <p className="text-gray-600">원하는 대로 커스터마이징할 수 있습니다.</p>
          </div>
        </div>

        {/* 추가 컨텐츠 */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">애플리케이션 소개</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            이것은 타이틀 화면에서 메인 페이지로 전환되는 리액트 애플리케이션입니다. 
            아름다운 애니메이션과 반응형 디자인으로 구성되어 있으며, Tailwind CSS를 사용하여 
            스타일링되었습니다.
          </p>
        </div>
      </main>
    </div>
  );
}
