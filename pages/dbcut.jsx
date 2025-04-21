import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";

const Dbcut = () => {
  const [files, setFiles] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [selectedColumnIndex, setSelectedColumnIndex] = useState(5);
  const fileInputRef = useRef(null);

  // 1) 파일 업로드
  const handleFileUpload = async (e) => {
    const uploaded = Array.from(e.target.files);
    if (!uploaded.length) return;

    let baseHeaders = headers;
    let processed = 0;
    let newData = [...rawData];

    for (const file of uploaded) {
      let workbook;
      if (file.name.toLowerCase().endsWith(".csv")) {
        const text = await new Promise((res, rej) => {
          const reader = new FileReader();
          reader.onload = (evt) => res(evt.target.result);
          reader.onerror = (err) => rej(err);
          reader.readAsText(file, "euc-kr");
        });
        workbook = XLSX.read(text, { type: "string", codepage: 949 });
      } else {
        const data = await file.arrayBuffer();
        workbook = XLSX.read(data);
      }

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

      if (json.length) {
        if (!baseHeaders.length) {
          baseHeaders = json[0];
          setHeaders(baseHeaders);
          setSelectedColumnIndex(5);
        }
        newData = [...newData, ...json.slice(1)];
      }

      processed++;
      setProgress(Math.round((processed / uploaded.length) * 100));
    }

    setFiles((prev) => [...prev, ...uploaded]);
    setRawData(newData);
    setTimeout(() => setProgress(0), 800);
  };

  const totalCount = rawData.length;

  // 다운로드: 중복 제거 없이 rawData 그대로 저장
  const handleDownload = () => {
    if (files.length < 2) {
      alert("2개 이상의 파일을 업로드해야 다운로드할 수 있습니다.");
      return;
    }
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, ".");
    const filename = `${today}_2차 작업.xlsx`;

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rawData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Result");
    XLSX.writeFile(wb, filename);
  };

  const handleRefresh = () => {
    setFiles([]);
    setHeaders([]);
    setRawData([]);
    setProgress(0);
    setSelectedColumnIndex(5);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "24px",
        backgroundColor: "#1a202c",
        color: "white",
        borderRadius: "8px",
      }}
    >
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "16px" }}>
        2차 작업) 변환 엑셀파일 + 기존 엑셀파일 합치기
      </h2>
      <p style={{ marginBottom: "16px" }}>
        중복 제거는 수행하지 않습니다.
      </p><br/>

      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        multiple
        onChange={handleFileUpload}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      <button
        onClick={() => fileInputRef.current.click()}
        style={{
          padding: "10px 16px",
          backgroundColor: "#3182ce",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          color: "white",
        }}
      >
        📂 엑셀 파일 업로드
      </button>

      {progress > 0 && <p style={{ marginTop: "12px" }}>⏳ 진행률: {progress}%</p>}

      {headers.length > 0 && (
        <>

          <div
            style={{
              marginTop: "16px",
              backgroundColor: "#2d3748",
              padding: "12px",
              borderRadius: "4px",
            }}
          >
            <div>📊 총 데이터(헤더 제외): {totalCount}개</div>
          </div>
        </>
      )}

      <div
        style={{
          marginTop: "16px",
          display: "flex",
          gap: "12px",
          justifyContent: "flex-start",
        }}
      >
        <button
          onClick={handleDownload}
          disabled={files.length < 2}
          style={{
            padding: "10px 16px",
            borderRadius: "6px",
            border: "none",
            cursor: files.length >= 2 ? "pointer" : "not-allowed",
            backgroundColor: files.length >= 2 ? "#38a169" : "#4a5568",
            color: "white",
          }}
        >
          💾 다운로드
        </button>
        <button
          onClick={handleRefresh}
          style={{
            padding: "8px",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            backgroundColor: "#2d3748",
            color: "white",
          }}
        >
          🔄
        </button>
      </div>

      {files.length > 0 && (
        <ul
          style={{
            marginTop: "16px",
            maxHeight: "160px",
            overflowY: "auto",
            padding: "8px",
            backgroundColor: "#2d3748",
            borderRadius: "4px",
            fontSize: "0.875rem",
            textAlign: "left",
          }}
        >
          {files.map((f, idx) => (
            <li key={idx}>📄 {f.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dbcut;
