import React, { useState, useRef } from "react";
import { read, utils, writeFile } from "xlsx";
import Head from "next/head";
import HeaderNormal from "../components/header/HeaderNormal";
import Layout from "../layout/Layout";
import Dbadd from "./dbadd";

export const PopulationDeclineArea = [
  "부산 동구",
  "부산 서구",
  "부산 영도구",
  "대구 남구",
  "대구 서구",
  "대구 군위군",
  "경기 가평군",
  "경기 연천군",
  "강원특별자치도 고성군",
  "강원특별자치도 삼척시",
  "강원특별자치도 양구군",
  "강원특별자치도 양양군",
  "강원특별자치도 영월군",
  "강원특별자치도 정선군",
  "강원특별자치도 철원군",
  "강원특별자치도 태백시",
  "강원특별자치도 평창군",
  "강원특별자치도 흥청군",
  "강원특별자치도 화천군",
  "강원특별자치도 횡성군",
  "충북 괴산군",
  "충북 단양군",
  "충북 보은군",
  "충북 영동군",
  "충북 옥천군",
  "충북 제천시",
  "충남 공주시",
  "충남 금산군",
  "충남 논산시",
  "충남 보령시",
  "충남 서천군",
  "충남 예산군",
  "충남 청양군",
  "충남 태안군",
  "전북특별자치도 고창군",
  "전북특별자치도 김제시",
  "전북특별자치도 남원시",
  "전북특별자치도 무주군",
  "전북특별자치도 부안군",
  "전북특별자치도 순창군",
  "전북특별자치도 임실군",
  "전북특별자치도 장수군",
  "전북특별자치도 정읍시",
  "전북특별자치도 진안군",
  "전남 강진군",
  "전남 고흥군",
  "전남 곡성군",
  "전남 구례군",
  "전남 담양군",
  "전남 보성군",
  "전남 신안군",
  "전남 영광군",
  "전남 영암군",
  "전남 완도군",
  "전남 장성군",
  "전남 장흥군",
  "전남 진도군",
  "전남 함평군",
  "전남 해남군",
  "전남 화순군",
  "경북 고령군",
  "경북 문경시",
  "경북 봉화군",
  "경북 상주시",
  "경북 성주군",
  "경북 안동시",
  "경북 영덕군",
  "경북 영양군",
  "경북 영주시",
  "경북 영천시",
  "경북 울릉군",
  "경북 울진군",
  "경북 의성군",
  "경북 청도군",
  "경북 청송군",
  "경남 거창군",
  "경남 고성군",
  "경남 남해군",
  "경남 밀양시",
  "경남 산청군",
  "경남 의령군",
  "경남 창녕군",
  "경남 하동군",
  "경남 함안군",
  "경남 함양군",
  "경남 합천군"
];

const DbMaker = () => {
  const [file, setFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedPhoneColumn, setSelectedPhoneColumn] = useState("");
  const [previewData, setPreviewData] = useState([]);
  const [fullData, setFullData] = useState([]); // 전체 데이터를 저장 (헤더 포함)
  const [filteredData, setFilteredData] = useState(null);
  const [processStatus, setProcessStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

// 시도 이름 표준화 함수 개선
const normalizeRegionName = (sido) => {
  const regionMap = {
    "서울특별시": "서울",
    "부산광역시": "부산",
    "대구광역시": "대구",
    "인천광역시": "인천",
    "광주광역시": "광주",
    "대전광역시": "대전",
    "울산광역시": "울산",
    "세종특별자치시": "세종",
    "경기도": "경기",
    "충청남도": "충남",
    "충청북도": "충북",
    "전라남도": "전남",
    "전라북도": "전북",
    "경상남도": "경남",
    "경상북도": "경북",
    "강원특별자치도": "강원",
    "제주특별자치도": "제주"
  };
  return regionMap[sido] || sido.replace(/특별자치시|광역시|특별자치도/g, '');
};

// 개선된 주소 분해 함수
const parseAddress = (address) => {
  if (!address) return null;
  address = address.toString()
    .replace(/\([^)]*\)/g, '') // 괄호 내용 제거
    .replace(/출근지|센터/g, '') // 특정 키워드 제거
    .replace(/\s+/g, ' ')
    .trim();

  // 특별시/광역시/도 + 구/군/시 추출
  const pattern1 = /((?:[가-힣]+특별자치시|[가-힣]+광역시|[가-힣]+특별자치도|[가-힣]+도|세종특별자치시))\s+([가-힣]+구|[가-힣]+시|[가-힣]+군)/;
  
  // 광역시 생략 형식 (예: "울산 울주군")
  const pattern2 = /(부산|대구|인천|광주|대전|울산|세종)\s+([가-힣]+구|[가-힣]+시|[가-힣]+군)/;

  let match = address.match(pattern1) || address.match(pattern2);
  
  if (!match) {
    // 도시명 + 구 형식 (예: "대전 서구")
    const fallback = address.match(/([가-힣]{2,}[시])\s+([가-힣]+구)/);
    if (fallback) return { sido: fallback[1], gungu: fallback[2] };
    return null;
  }

  const sido = normalizeRegionName(match[1]);
  const gungu = match[2].replace(/시$/, ''); // '시' 접미사 제거

  return { sido, gungu };
};

  // 파일 읽기 핸들러
  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    let workbook;
    if (uploadedFile.name.toLowerCase().endsWith(".csv")) {
      const text = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (evt) => resolve(evt.target.result);
        reader.onerror = (err) => reject(err);
        reader.readAsText(uploadedFile, "euc-kr");
      });
      workbook = read(text, { type: "string", codepage: 949 });
    } else {
      const data = await uploadedFile.arrayBuffer();
      workbook = read(data);
    }

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

    setFile(uploadedFile);
    if (jsonData && jsonData.length > 0) {
      setHeaders(jsonData[0]);
      setFullData(jsonData);
      // 미리보기는 주소 컬럼 선택 후 갱신
      setPreviewData([]);
    }
    // 파일 업로드 시 이전 선택값 및 결과 초기화
    setSelectedColumn("");
    setSelectedPhoneColumn("");
    setFilteredData(null);
    setProcessStatus("");
  };

  // 주소 컬럼 선택 핸들러 (미리보기 갱신)
  const handleColumnSelect = (e) => {
    const column = e.target.value;
    setSelectedColumn(column);
    setFilteredData(null);
    if (fullData.length > 0 && headers.length > 0) {
      const colIndex = headers.indexOf(column);
      const newPreview = fullData.slice(1, 6).map((row) => row[colIndex]);
      setPreviewData(newPreview);
    }
  };

  // 전화번호 컬럼 선택 핸들러
  const handlePhoneColumnSelect = (e) => {
    const phoneColumn = e.target.value;
    setSelectedPhoneColumn(phoneColumn);
    setFilteredData(null);
  };

  // 데이터 처리 함수: 주소에서 시도/군구 추출 및 전화번호 중복 제거 (나중 등록 데이터 삭제)
  const processData = async () => {
    if (!file || !selectedColumn || !selectedPhoneColumn) return;
    setIsLoading(true);
    setProcessStatus("처리 중...");

    const jsonData = fullData;
    const addressIndex = headers.indexOf(selectedColumn);
    const phoneIndex = headers.indexOf(selectedPhoneColumn);
    const newHeader = ["시도", "군구", ...headers];

    const newRows = [];
    const phoneNumbersSet = new Set();

    jsonData.slice(1).forEach((row) => {
      const address = row[addressIndex];
      const parsed = parseAddress(address);
      if (!parsed) return;
      const { sido, gungu } = parsed;
      if (PopulationDeclineArea.includes(`${sido} ${gungu}`)) {
        const phone = row[phoneIndex];

        // 전화번호가 "-", null, undefined, 빈 문자열이면 중복 제거를 적용하지 않음
        if (phone && phone !== "-" && phone.trim() !== "") {
          if (phoneNumbersSet.has(phone)) {
            // 중복된 전화번호가 있으면 건너뜀
            return;
          }
          phoneNumbersSet.add(phone);
        }

        newRows.push([sido, gungu, ...row]);
      }
    });

    const resultData = [newHeader, ...newRows];
    setFilteredData(resultData);

    const totalCount = jsonData.length - 1;
    const filteredCount = newRows.length;

    setProcessStatus(
      <>
        변환 완료! 다운로드 버튼을 클릭해 {totalCount}개 중{" "}
        <span style={{ color: "#92FF0D", fontWeight: "bold" }}>
          {filteredCount}
        </span>
        개의 데이터를 받으세요.
      </>
    );
    setIsLoading(false);
  };

  // 파일 다운로드 핸들러 (엑셀 파일로 저장)
  const handleDownload = () => {
    if (!filteredData) return;

    // 현재 날짜 가져오기 (YYYY.MM.DD 형식)
    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 10).replace(/-/g, ".");

    // 다운로드 횟수 관리 (예: 로컬 스토리지 사용)
    let downloadCount = parseInt(localStorage.getItem("downloadCount") || "0", 10) + 1;
    localStorage.setItem("downloadCount", downloadCount);

    // 파일명 생성 (예: 2025.01.12_DB(1))
    const fileName = `${formattedDate}_DB(${downloadCount}).xlsx`;

    // 엑셀 파일 생성 및 다운로드
    const ws = utils.aoa_to_sheet(filteredData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Filtered Data");
    writeFile(wb, fileName);
  };

  return (
    <Layout>
      <Head>
        <meta charSet="UTF-8" />
        <title>DB구매 문의하기 | WORK VISA</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap"
          rel="stylesheet"
        />
      </Head>

      <HeaderNormal className="header">
        <p className="subtitle line-shape mb-20">
          <span className="pl-10 pr-10 background-section">
            WORK VISA DB MAKER
          </span>
        </p>
        <h3 className="text-uppercase">DB 제작 프로그램</h3>
      </HeaderNormal>
      <Dbadd/>
      <div className="container">
        {/* 파일 업로드 섹션 */}
        <div className="upload-section">
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <button className="button" onClick={() => fileInputRef.current.click()}>
            최종 DB 제작, 엑셀 업로드
          </button>
        </div>

        {/* 주소 컬럼 선택 섹션 */}
        {headers.length > 0 && (
          <div className="dropdown-section">
            <label htmlFor="addressColumn">주소 컬럼: </label>
            <select
              id="addressColumn"
              value={selectedColumn}
              onChange={handleColumnSelect}
              className="select-field"
            >
              <option value="">주소 컬럼 선택</option>
              {headers.map((header, index) => (
                <option key={index} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 중복 컬럼 선택 섹션 */}
        {headers.length > 0 && (
          <div className="dropdown-section">
            <label htmlFor="phoneColumn">중복 제거 컬럼(휴대폰 번호 추천): </label>
            <select
              id="phoneColumn"
              value={selectedPhoneColumn}
              onChange={handlePhoneColumnSelect}
              className="select-field"
            >
              <option value="">전화번호 컬럼 선택</option>
              {headers.map((header, index) => (
                <option key={index} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 미리보기 (주소 컬럼의 상위 5개 행) */}
        {previewData.length > 0 && (
          <div className="preview-section">
            <h3>미리보기 (주소 컬럼)</h3>
            <pre className="preview-container">
              {JSON.stringify(previewData, null, 2)}
            </pre>
          </div>
        )}

        {/* 변환 실행 버튼 및 상태 */}
        {(selectedColumn && selectedPhoneColumn) && (
          <div className="process-section">
            <button className="button" onClick={processData} disabled={isLoading}>
              변환 실행
            </button>
            {isLoading && <div className="loading-spinner">로딩 중...</div>}
            {processStatus && <span className="status">{processStatus}</span>}
          </div>
        )}

        {/* 다운로드 버튼 */}
        {filteredData && (
          <div className="download-section">
            <button className="button download" onClick={handleDownload}>
              수정된 파일 다운로드
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 40px auto;
          padding: 30px;
          background-color: #1f1f1f;
          border-radius: 8px;
          color: #ffffff;
          font-family: "Noto Sans KR", sans-serif;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        .upload-section,
        .dropdown-section,
        .preview-section,
        .process-section,
        .download-section {
          margin-bottom: 20px;
          text-align: center;
        }
        .button {
          background-color: #4caf50;
          color: #fff;
          border: none;
          padding: 12px 24px;
          margin: 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
        }
        .button:hover {
          background-color: #45a049;
        }
        .button.download {
          background-color: #2196f3;
        }
        .button.download:hover {
          background-color: #1976d2;
        }
        .select-field {
          background-color: #2a2a2a;
          color: #fff;
          padding: 10px;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          outline: none;
          width: 100%;
          max-width: 300px;
        }
        .preview-container {
          background-color: #333;
          padding: 15px;
          border-radius: 8px;
          overflow-x: auto;
          font-family: monospace;
          text-align: left;
        }
        .status {
          display: block;
          margin-top: 10px;
          font-weight: bold;
        }
      `}</style>
    </Layout>
  );
};

export default DbMaker;
