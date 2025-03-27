import React from 'react';
import * as XLSX from 'xlsx';

// ArrayBuffer를 16진수 문자열로 변환하는 유틸 함수
const bufferToHex = (buffer) => {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

function AutoCallExcel({ onExcelUpload }) {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일을 ArrayBuffer로 읽음
      const arrayBuffer = await file.arrayBuffer();
      // 해시 계산 (더 이상 중복 등록 체크에 사용하지 않음)
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const fileHash = bufferToHex(hashBuffer);

      // XLSX 라이브러리로 엑셀 데이터 파싱 (ArrayBuffer를 Uint8Array로 변환)
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      // 첫 행은 헤더(이름, 전화번호, 기타사항)라고 가정
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const [header, ...rows] = jsonData;
      const records = rows.map((row) => ({
        name: row[0] ? row[0].toString() : '',
        phone: row[1] ? row[1].toString() : '',
        extra: row[2] ? row[2].toString() : ''
      }));
      // onExcelUpload에 records와 fileHash 함께 전달 (fileHash는 내부 로직에서 사용하지 않음)
      onExcelUpload({ records, fileHash });
    }
  };

  const downloadSample = () => {
    const sampleData = [
      ['이름', '전화번호', '기타사항'],
      ['홍길동', '01012345678', '샘플 내용1'],
      ['김철수', '01087654321', '샘플 내용2'],
      ['나민수', '01012345678', '샘플 내용3'],
      ['박둘리', '01087654321', '샘플 내용4']
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sample');
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '전화번호등록샘플.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <label
        htmlFor="excelInput"
        style={{
          cursor: 'pointer',
          padding: '0.5rem .5rem',
          backgroundColor: '#4299e1',
          borderRadius: '0.5rem',
          color: '#fff'
        }}
      >
        엑셀 등록
        <input
          id="excelInput"
          type="file"
          accept=".xls,.xlsx"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </label>
      <button
        onClick={downloadSample}
        style={{
          padding: '0.5rem 0.5rem',
          backgroundColor: '#38A169',
          border: 'none',
          borderRadius: '0.5rem',
          color: '#fff',
          cursor: 'pointer'
        }}
      >
        샘플 다운로드
      </button>
    </div>
  );
}

export default AutoCallExcel;
