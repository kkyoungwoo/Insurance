import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";

const Dbadd = () => {
  const [files, setFiles] = useState([]);
  const [headers, setHeaders] = useState([]); // 첫번째 행(헤더)
  const [fullData, setFullData] = useState([]); // 헤더 이후의 데이터들
  const [progress, setProgress] = useState(0);
  // 드롭다운에서 선택한 열의 인덱스 (기본값은 0)
  const [selectedColumnIndex, setSelectedColumnIndex] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFiles([]);
    setHeaders([]);
    setFullData([]);
    setProgress(0);
    setSelectedColumnIndex(0);
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
          // 한글 CSV가 깨지지 않도록 euc-kr 인코딩 사용
          reader.readAsText(file, "euc-kr");
        });
        workbook = XLSX.read(text, { type: "string", codepage: 949 });
      } else {
        const data = await file.arrayBuffer();
        workbook = XLSX.read(data);
      }

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      // defval 옵션으로 빈 셀은 빈 문자열로 처리
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: ""
      });

      if (jsonData.length > 0) {
        // 첫번째 파일에서만 헤더(첫번째 행) 저장 (동일한 형태의 엑셀 가정)
        if (commonHeaders.length === 0) {
          commonHeaders = jsonData[0];
          setHeaders(commonHeaders);
          // 헤더가 있을 경우 기본 선택은 첫번째 열(인덱스 0)
          setSelectedColumnIndex(0);
        }
        // 헤더 이후의 데이터만 추가
        allData = [...allData, ...jsonData.slice(1)];
      }
      processedFiles++;
      setProgress(Math.round((processedFiles / uploadedFiles.length) * 100));
    }

    setFiles((prev) => [...prev, ...uploadedFiles]);
    setFullData(allData);
    setTimeout(() => setProgress(0), 1000);
  };

  // 선택한 열의 인덱스를 기준으로 유효한 데이터(값이 "-", 빈 문자열, null, undefined 제외)만 필터링
  const validData =
    headers.length > selectedColumnIndex
      ? fullData.filter((row) => {
          const value = row[selectedColumnIndex];
          return value !== "-" && value !== "" && value != null;
        })
      : [];

  // 중복 제거: 선택한 열의 값을 key로 하여 _마지막(최근) 데이터만 남김_
  const dedupedDataMap = new Map();
  validData.forEach((row) => {
    dedupedDataMap.set(row[selectedColumnIndex], row);
  });
  const mergedData = Array.from(dedupedDataMap.values());

  // 통계 계산
  const totalCount = validData.length;
  const mergedCount = mergedData.length;
  const duplicateCount = totalCount - mergedCount;
  const stats = {
    total: totalCount,
    duplicates: duplicateCount,
    merged: mergedCount
  };

  const handleMerge = () => {
    if (files.length === 0 || fullData.length === 0) {
      alert("파일을 먼저 등록하세요.");
      return;
    }

    // 현재 날짜 (YYYY.MM.DD 형식)
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0].replace(/-/g, ".");
    const fileName = `${formattedDate}_1차 작업.xlsx`;

    // 엑셀 데이터 생성 (헤더 + 병합 후 데이터)
    const ws = XLSX.utils.aoa_to_sheet([headers, ...mergedData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Merged");
    XLSX.writeFile(wb, fileName);
  };

  const handleRefresh = () => {
    setFiles([]);
    setHeaders([]);
    setFullData([]);
    setProgress(0);
    setSelectedColumnIndex(0);
    // 파일 입력 요소의 값을 초기화하여 같은 파일을 다시 선택할 수 있도록 함.
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "24px",
        backgroundColor: "#1a202c",
        color: "white",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        textAlign: "left"
      }}
    >
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "16px"
        }}
      >
        1차 작업) 원천 엑셀 파일 병합 및 중복 제거
      </h2>
      <h6>(회사명, 연락처, 근무지기본주소 3번 작업 필요)</h6><br/>
      <p style={{ marginBottom: "16px" }}>(중복 1개만 남기고 최종 출력됩니다)</p><br/>
      <div
        style={{
          fontSize: "1rem",
          fontWeight: "bold",
          marginBottom: "16px"
        }}
      >
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "16px"
        }}
      >
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          multiple
          onChange={handleFileUpload}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        <button
          style={{
            padding: "10px 16px",
            backgroundColor: "#3182ce",
            color: "white",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer"
          }}
          onClick={() => fileInputRef.current.click()}
        >
          📂 엑셀 파일 업로드
        </button>
      </div>
      {progress > 0 && (
        <div
          style={{
            marginTop: "16px",
            fontSize: "0.875rem",
            fontWeight: "bold"
          }}
        >
          ⏳ 진행률: {progress}%
        </div>
      )}

      {/* 드롭다운: 헤더 행의 값들을 표시하여 필터할 열 선택 */}
      {headers.length > 0 && (
        <div style={{ marginTop: "16px" }}>
          <label
            htmlFor="dropdown"
            style={{ marginRight: "8px", fontWeight: "bold" }}
          >
            중복항목 제거할 열 선택:
          </label>
          <select
            id="dropdown"
            value={selectedColumnIndex}
            onChange={(e) => setSelectedColumnIndex(Number(e.target.value))}
            style={{
              backgroundColor: "#2d3748",
              color: "white",
              border: "1px solid #4a5568",
              padding: "8px 12px",
              borderRadius: "4px",
              outline: "none",
              cursor: "pointer"
            }}
          >
            {headers.map((colName, idx) => (
              <option
                key={idx}
                value={idx}
                style={{ backgroundColor: "#2d3748", color: "white" }}
              >
                {colName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 통계 영역 */}
      {headers.length > 0 && (
        <div
          style={{
            marginTop: "16px",
            textAlign: "left",
            backgroundColor: "#2d3748",
            padding: "12px",
            borderRadius: "4px",
            fontSize: "0.875rem"
          }}
        >
          <div>📊 총 데이터: {stats.total}개</div>
          <div>🔄 중복 데이터: {stats.duplicates}개</div>
          <div>✅ 병합 후 데이터: {stats.merged}개</div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          marginTop: "16px",
          gap: "16px"
        }}
      >
        <button
          style={{
            padding: "10px 16px",
            borderRadius: "6px",
            border: "none",
            cursor: files.length === 0 ? "not-allowed" : "pointer",
            backgroundColor: files.length === 0 ? "#4a5568" : "#38a169",
            color: "white",
          }}
          onClick={handleMerge}
          disabled={files.length === 0}
        >
          🔗 합치기
        </button>
        <button
          style={{
            padding: "8px 12px",
            backgroundColor: "#2d3748",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            color: "white"
          }}
          onClick={handleRefresh}
        >
          🔄
        </button>
      </div>

      {/* 업로드된 엑셀 파일 리스트 */}
      {files.length > 0 && (
        <ul
          style={{
            marginTop: "16px",
            borderTop: "1px solid #4a5568",
            paddingTop: "8px",
            maxHeight: "160px",
            overflowY: "auto",
            fontSize: "0.875rem",
            textAlign: "left"
          }}
        >
          {files.map((file, index) => (
            <li key={index} style={{ padding: "4px 0" }}>
              📄 {file.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dbadd;
