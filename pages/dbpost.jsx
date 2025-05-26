import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";

const Dbcut = () => {
  const [files, setFiles] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [selectedColumns, setSelectedColumns] = useState([null, null]);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const uploaded = Array.from(e.target.files);
    if (!uploaded.length) return;

    let baseHeaders = headers;
    let processed = 0;
    let newData = [];

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
        }
        newData = [...newData, ...json.slice(1)];
      }
      processed++;
      setProgress(Math.round((processed / uploaded.length) * 100));
    }

    setFiles((prev) => [...prev, ...uploaded]);
    setRawData((prev) => [...prev, ...newData]);
    setTimeout(() => setProgress(0), 800);
  };

  // 전 데이터(rawData) 기준으로 두 열의 중복을 모두 계산하고, 둘 중 하나라도 중복이 있으면 제거
  const filterData = () => {
    const [colA, colB] = selectedColumns;
    // 선택된 열이 없으면 원본 반환
    if (colA == null && colB == null) return rawData;

    const countsA = {};
    const countsB = {};
    rawData.forEach(row => {
      if (colA != null) {
        const keyA = row[colA];
        if (keyA && keyA !== "-") countsA[keyA] = (countsA[keyA] || 0) + 1;
      }
      if (colB != null) {
        const keyB = row[colB];
        if (keyB && keyB !== "-") countsB[keyB] = (countsB[keyB] || 0) + 1;
      }
    });

    return rawData.filter(row => {
      const keyA = colA != null ? row[colA] : null;
      const keyB = colB != null ? row[colB] : null;
      const dupA = colA != null && keyA && keyA !== "-" && countsA[keyA] > 1;
      const dupB = colB != null && keyB && keyB !== "-" && countsB[keyB] > 1;
      // A 또는 B 중복인 경우 제거
      return !(dupA || dupB);
    });
  };

  const filteredData = filterData();
  const totalCount = rawData.length;
  const mergedCount = filteredData.length;
  const duplicateCount = totalCount - mergedCount;

  const handleDownload = () => {
    if (!rawData.length || files.length < 2) {
      alert("2개 이상의 파일을 업로드해야 다운로드할 수 있습니다.");
      return;
    }
    if (!selectedColumns.some((c) => c != null)) {
      alert("중복 제거할 열을 하나 이상 선택해주세요.");
      return;
    }

    const today = new Date().toISOString().split('T')[0].replace(/-/g, '.');
    const filename = `${today}_우편발송 리스트.xlsx`;

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
    setSelectedColumns([null, null]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "24px", backgroundColor: "#1a202c", color: "white", borderRadius: "8px" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "16px" }}>
        3차 작업) 기존 전체파일과 2차작업 파일 비교 후 남은 파일만 정리
      </h2><br/>
      <p style={{ marginBottom: "16px" }}>파일을 2개 등록하세요. (열 A(연락처)와 열 B(근무지기본주소)를 중복제거 설정)</p><br/>

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
          <label htmlFor="col-select-a" style={{ marginRight: "8px" }}>중복 제거할 열 A:</label>
          <select
            id="col-select-a"
            value={selectedColumns[0] ?? ""}
            onChange={(e) => setSelectedColumns([e.target.value === "" ? null : +e.target.value, selectedColumns[1]])}
            style={{ padding: "8px", borderRadius: "4px", backgroundColor: "#2d3748", color: "white", border: "1px solid #4a5568", marginRight: "16px" }}
          >
            <option value="">(선택 안함)</option>
            {headers.map((h, i) => <option key={i} value={i}>{h}</option>)}
          </select>
          <label htmlFor="col-select-b" style={{ marginRight: "8px" }}>중복 제거할 열 B:</label>
          <select
            id="col-select-b"
            value={selectedColumns[1] ?? ""}
            onChange={(e) => setSelectedColumns([selectedColumns[0], e.target.value === "" ? null : +e.target.value])}
            style={{ padding: "8px", borderRadius: "4px", backgroundColor: "#2d3748", color: "white", border: "1px solid #4a5568" }}
          >
            <option value="">(선택 안함)</option>
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
          disabled={files.length < 2 || !selectedColumns.some((c) => c != null)}
          style={{ padding: "10px 16px", borderRadius: "6px", border: "none", cursor: files.length >= 2 && selectedColumns.some((c) => c != null) ? "pointer" : "not-allowed", backgroundColor: files.length >= 2 && selectedColumns.some((c) => c != null) ? "#38a169" : "#4a5568", color: "white" }}
        >
          💾 다운로드
        </button>
        <button onClick={handleRefresh} style={{ padding: "8px", borderRadius: "50%", border: "none", cursor: "pointer", backgroundColor: "#2d3748", color: "white" }}>
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