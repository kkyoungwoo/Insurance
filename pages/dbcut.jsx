import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";

const Dbcut = () => {
  const [files, setFiles] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [selectedColumnIndex, setSelectedColumnIndex] = useState(5); // 기본값: 5번째 열 (0부터 시작)
  const fileInputRef = useRef(null);

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
          setSelectedColumnIndex(5); // 첫 파일 등록 시 기본 선택 열 설정
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

  const filteredData = headers.length > 0
    ? (() => {
        const counts = rawData.reduce((acc, row) => {
          const key = row[selectedColumnIndex];
          if (key !== "" && key !== "-" && key != null) {
            acc[key] = (acc[key] || 0) + 1;
          }
          return acc;
        }, {});
        return rawData.filter((row) => counts[row[selectedColumnIndex]] === 1);
      })()
    : [];

  const totalCount = rawData.filter(row => row[selectedColumnIndex] !== "" && row[selectedColumnIndex] !== "-" && row[selectedColumnIndex] != null).length;
  const mergedCount = filteredData.length;
  const duplicateCount = totalCount - mergedCount;

  const handleDownload = () => {
    if (!rawData.length || files.length < 2) {
      alert("2개 이상의 파일을 업로드해야 다운로드할 수 있습니다.");
      return;
    }
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '.');
    const filename = `${today}_우편발송_데이터.xlsx`;

    const ws = XLSX.utils.aoa_to_sheet([headers, ...filteredData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Result");
    XLSX.writeFile(wb, filename);
  };

  const handleRefresh = () => {
    setFiles([]);
    setHeaders([]);
    setRawData([]);
    setProgress(0);
    setSelectedColumnIndex(5); // 초기화 시에도 5번째 열 유지
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "24px", backgroundColor: "#1a202c", color: "white", borderRadius: "8px" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "16px" }}>
        2차 작업) 엑셀파일을 합친 후 중복 제거
      </h2>
      <p style={{ marginBottom: "16px" }}>(근무지기본주소를 중복 기준값으로 설정)</p>
      <p style={{ marginBottom: "16px" }}>(중복값을 제외한 데이터만 최종 출력됩니다)</p>

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
        style={{ padding: "10px 16px", backgroundColor: "#3182ce", borderRadius: "6px", border: "none", cursor: "pointer", color: "white" }}
      >
        📂 엑셀 파일 업로드
      </button>

      {progress > 0 && <p style={{ marginTop: "12px" }}>⏳ 진행률: {progress}%</p>}

      {headers.length > 0 && (
        <div style={{ marginTop: "16px" }}>
          <label htmlFor="col-select" style={{ marginRight: "8px" }}>중복 제거할 열:</label>
          <select
            id="col-select"
            value={selectedColumnIndex}
            onChange={(e) => setSelectedColumnIndex(+e.target.value)}
            style={{ padding: "8px", borderRadius: "4px", backgroundColor: "#2d3748", color: "white", border: "1px solid #4a5568" }}
          >
            {headers.map((h, i) => <option key={i} value={i}>{h}</option>)}
          </select>
        </div>
      )}

      {headers.length > 0 && (
        <div style={{ marginTop: "16px", backgroundColor: "#2d3748", padding: "12px", borderRadius: "4px" }}>
          <div>📊 총 유효 데이터: {totalCount}개</div>
          <div>🔄 중복된 데이터: {duplicateCount}개</div>
          <div>✅ 중복 제거 후 데이터: {mergedCount}개</div>
        </div>
      )}

      <div style={{ marginTop: "16px", display: "flex", gap: "12px", justifyContent: "flex-start" }}>
        <button
          onClick={handleDownload}
          disabled={files.length < 2}
          style={{ padding: "10px 16px", borderRadius: "6px", border: "none", cursor: files.length >= 2 ? "pointer" : "not-allowed", backgroundColor: files.length >= 2 ? "#38a169" : "#4a5568", color: "white" }}
        >
          💾 다운로드
        </button>
        <button
          onClick={handleRefresh}
          style={{ padding: "8px", borderRadius: "50%", border: "none", cursor: "pointer", backgroundColor: "#2d3748", color: "white" }}
        >
          🔄
        </button>
      </div>

      {files.length > 0 && (
        <ul style={{ marginTop: "16px", maxHeight: "160px", overflowY: "auto", padding: "8px", backgroundColor: "#2d3748", borderRadius: "4px", fontSize: "0.875rem", textAlign: "left" }}>
          {files.map((f, idx) => <li key={idx}>📄 {f.name}</li>)}
        </ul>
      )}
    </div>
  );
};

export default Dbcut;