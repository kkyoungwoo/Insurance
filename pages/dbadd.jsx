import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";

const Dbadd = () => {
  const [files, setFiles] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFiles([]);
    setHeaders([]);
    setFullData([]);
    setProgress(0);
  }, []);

  const handleFileUpload = async (e) => {
    const uploadedFiles = Array.from(e.target.files);
    if (uploadedFiles.length === 0) return;

    let allData = [...fullData];
    let commonHeaders = headers;
    let processedFiles = 0;

    for (const file of uploadedFiles) {
      let workbook;
      if (file.name.toLowerCase().endsWith(".csv")) {
        const text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (evt) => resolve(evt.target.result);
          reader.onerror = (err) => reject(err);
          reader.readAsText(file, "euc-kr");
        });
        workbook = XLSX.read(text, { type: "string", codepage: 949 });
      } else {
        const data = await file.arrayBuffer();
        workbook = XLSX.read(data);
      }

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length > 0) {
        if (commonHeaders.length === 0) {
          commonHeaders = jsonData[0];
          setHeaders(commonHeaders);
        }
        allData = [...allData, ...jsonData.slice(1)];
      }

      processedFiles++;
      setProgress(Math.round((processedFiles / uploadedFiles.length) * 100));
    }

    setFiles((prev) => [...prev, ...uploadedFiles]);
    setFullData(allData);
    setTimeout(() => setProgress(0), 1000); 
  };

  const handleMerge = () => {
    if (files.length === 0 || fullData.length === 0) {
      alert("파일을 먼저 등록하세요.");
      return;
    }
  
    // 현재 날짜 가져오기 (YYYY.MM.DD 형식)
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0].replace(/-/g, ".");
  
    // 저장할 파일명
    const fileName = `${formattedDate} 엑셀 병합파일.xlsx`;
  
    // 엑셀 데이터 생성
    const ws = XLSX.utils.aoa_to_sheet([headers, ...fullData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Merged");
    XLSX.writeFile(wb, fileName);
  };
  

  const handleRefresh = () => {
    setFiles([]);
    setHeaders([]);
    setFullData([]);
    setProgress(0);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '24px', backgroundColor: '#1a202c', color: 'white', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '8px', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>엑셀 파일 여러개를 하나로 병합</h2>
      <div style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '16px' }}>(같은 형태의 엑셀을 등록하세요)</div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          multiple
          onChange={handleFileUpload}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <button
          style={{ padding: '10px 16px', backgroundColor: '#3182ce', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
          onClick={() => fileInputRef.current.click()}
        >
          📂 엑셀 파일 업로드
        </button>
      </div>
      {progress > 0 && (
        <div style={{ marginTop: '16px', fontSize: '0.875rem', fontWeight: 'bold' }}>
          ⏳ 진행률: {progress}%
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '16px', gap: '16px' }}>
        <button
          style={{ padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: files.length === 0 ? 'not-allowed' : 'pointer', backgroundColor: files.length === 0 ? '#4a5568' : '#38a169', color: 'white' }}
          onClick={handleMerge}
          disabled={files.length === 0}
        >
          🔗 합치기
        </button>
        <button
          style={{ padding: '8px 12px', backgroundColor: '#2d3748', borderRadius: '50%', border: 'none', cursor: 'pointer', color: 'white' }}
          onClick={handleRefresh}
        >
          🔄
        </button>
      </div>
      {files.length > 0 && (
        <ul style={{ marginTop: '16px', borderTop: '1px solid #4a5568', paddingTop: '8px', maxHeight: '160px', overflowY: 'auto', fontSize: '0.875rem' }}>
          {files.map((file, index) => (
            <li key={index} style={{ padding: '4px 0' }}>📄 {file.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dbadd;