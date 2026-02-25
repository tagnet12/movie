import React, { useState } from 'react';

export default function inputTest() {
  const [leftText, setLeftText] = useState('');
  const [rightText, setRightText] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">텍스트 입력</h1>
        
        <div className="flex gap-4">
          {/* 왼쪽 입력 */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              입력 1
            </label>
            <input
              type="text"
              value={leftText}
              onChange={(e) => setLeftText(e.target.value)}
              placeholder="첫 번째 텍스트 입력"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* 오른쪽 입력 */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              입력 2
            </label>
            <input
              type="text"
              value={rightText}
              onChange={(e) => setRightText(e.target.value)}
              placeholder="두 번째 텍스트 입력"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* 입력된 값 표시 */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">입력된 값:</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">입력 1:</p>
              <p className="text-gray-800">{leftText || '(비어있음)'}</p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">입력 2:</p>
              <p className="text-gray-800">{rightText || '(비어있음)'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}