import React, { useState } from 'react';
import * as XLSX from 'xlsx';

export default function ExcelHandler() {
  const [data, setData] = useState([
    { 이름: '홍길동', 나이: 25, 직업: '개발자' },
    { 이름: '김철수', 나이: 30, 직업: '디자이너' },
    { 이름: '이영희', 나이: 28, 직업: '기획자' }
  ]);

  // 엑셀 파일로 저장
  const handleExport = () => {
    // 데이터를 워크시트로 변환
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // 새 워크북 생성
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '직원목록');
    
    // 파일 다운로드
    XLSX.writeFile(workbook, '데이터.xlsx');
  };

  // 엑셀 파일 불러오기
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: 'binary' });
      
      // 첫 번째 시트 가져오기
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // 시트를 JSON으로 변환
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setData(jsonData);
    };
    
    reader.readAsBinaryString(file);
  };

  // 데이터 추가
  const handleAddRow = () => {
    setData([...data, { 이름: '', 나이: 0, 직업: '' }]);
  };

  // 데이터 수정
  const handleChange = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          엑셀 데이터 관리
        </h1>

        {/* 버튼 영역 */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleExport}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md"
          >
            📥 엑셀로 저장
          </button>
          
          <label className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md cursor-pointer text-center">
            📤 엑셀 불러오기
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleImport}
              className="hidden"
            />
          </label>

          <button
            onClick={handleAddRow}
            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md"
          >
            ➕ 행 추가
          </button>
        </div>

        {/* 데이터 테이블 */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">번호</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">이름</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">나이</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">직업</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-gray-600">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={row.이름 || ''}
                      onChange={(e) => handleChange(index, '이름', e.target.value)}
                      className="w-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      value={row.나이 || 0}
                      onChange={(e) => handleChange(index, '나이', parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={row.직업 || ''}
                      onChange={(e) => handleChange(index, '직업', e.target.value)}
                      className="w-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500 rounded"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>사용법:</strong>
          </p>
          <ul className="text-sm text-gray-600 mt-2 space-y-1">
            <li>• 테이블에서 직접 데이터를 수정할 수 있습니다</li>
            <li>• "엑셀로 저장" 버튼으로 현재 데이터를 엑셀 파일로 다운로드합니다</li>
            <li>• "엑셀 불러오기" 버튼으로 엑셀 파일의 데이터를 가져옵니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
