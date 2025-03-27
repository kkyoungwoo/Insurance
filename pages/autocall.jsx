import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AutoCallExcel from './autocallexcel';

/* ────────────── 설정 변수 (개발 편의용) ────────────── */
const CALL_TIMEOUT_SECONDS = 18;         // 전화 응답 대기 최대 시간 (초)
const REJECT_THRESHOLD_SECONDS = 30;       // 30초 이내 통화된 경우 "거절" 처리
const DELAY_TIME_DEFAULT = 8;              // 기본 딜레이 시간 (초)
const RATE_PER_MINUTE = 0.0040;            // 분당 요금 ($)
const RATE_PER_SECOND = RATE_PER_MINUTE / 60;

/* ────────────── Twilio API 설정 ────────────── */
const TWILIO_CONFIG = {
  ENABLED: false, // 실제 API 사용시 true, 테스트 시 false
  ACCOUNT_SID: 'your_account_sid_here',
  AUTH_TOKEN: 'your_auth_token_here',
  // voice_url: 'https://your-voice-url.com/twiml', // (옵션) 음성 URL이 없으면 주석처리 또는 빈 문자열로 처리
  voice_url: ''
};

/* ────────────── 예시 등록된 발신번호 목록 ────────────── */
const REGISTERED_FROM_NUMBERS = [
  '+821012345678',
  '+821112345678'
];

/* ────────────── 전화번호 포맷 처리 함수 ────────────── */
const processPhoneNumber = (numStr) => {
  if (!numStr) return '';
  let cleaned = numStr.replace(/\+82\s*/, '');
  let digits = cleaned.replace(/\D/g, '');
  if (!digits.startsWith('0')) {
    digits = '0' + digits;
  }
  return digits;
};

const getCallNumber = (phone) => {
  if (phone.startsWith('0')) {
    return '+82' + phone.substring(1);
  }
  return '+82' + phone;
};

/* ────────────── 타임아웃 기능 ────────────── */
const callWithTimeout = (promise, timeoutSec) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Call timed out"));
    }, timeoutSec * 1000);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

/* ────────────── 모의 API 호출 (테스트 시 사용) ────────────── */
// 통화 시간은 30초 ~ 300초 사이의 랜덤 값(0.1초 단위 반올림)으로 생성하며, 비용은 RATE_PER_SECOND를 곱해 계산합니다.
const mockCallAPI = async (number) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const randomDuration = Math.random() * (300 - 30) + 30;
  const duration = Math.round(randomDuration * 10) / 10;
  const cost = (duration * RATE_PER_SECOND).toFixed(4);
  return { status: 'SUCCESS', duration, cost };
};

/* ────────────── 실제 Twilio API 호출 함수 ────────────── */
const callTwilioAPI = async (toNumber, fromNumber) => {
  const { ACCOUNT_SID, AUTH_TOKEN, voice_url } = TWILIO_CONFIG;
  const url = `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Calls.json`;
  
  const params = new URLSearchParams();
  params.append('To', toNumber);
  params.append('From', fromNumber);
  if (voice_url && voice_url.trim() !== '') {
    params.append('Url', voice_url);
  }
  
  const authString = btoa(`${ACCOUNT_SID}:${AUTH_TOKEN}`);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authString}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });
  
  if (!response.ok) {
    throw new Error('Twilio API 호출 실패');
  }
  const data = await response.json();
  const rawDuration = data.duration || (Math.random() * (300 - 30) + 30);
  const duration = Math.round(rawDuration * 10) / 10;
  const cost = (duration * RATE_PER_SECOND).toFixed(4);
  return { 
    status: data.status || 'SUCCESS', 
    duration, 
    cost 
  };
};

/* ────────────── 수동 입력 전화번호 파싱 (줄별 데이터) ────────────── */
const getUniqueNumbers = (input) => {
  const items = input.split(/[\n,]+/).filter(item => item.trim().length > 0);
  const numbers = items.map(item => processPhoneNumber(item.trim()));
  const total = numbers.length;
  const uniqueSet = new Set(numbers);
  const uniqueNumbers = Array.from(uniqueSet);
  const duplicateCount = total - uniqueNumbers.length;
  return { uniqueNumbers, total, duplicateCount, uniqueCount: uniqueNumbers.length };
};

/* ────────────── 로컬스토리지 관련 상수 및 함수 ────────────── */
const LOCAL_STORAGE_CALL_KEY = 'autoCall_callRecords';
const LOCAL_STORAGE_PAUSE_KEY = 'autoCall_pauseRecords';
const LOCAL_STORAGE_DATE_KEY = 'autoCall_date';

const getCurrentDateString = () => new Date().toLocaleDateString();

export default function AutoCall() {
  // 모든 훅은 최상단에서 호출
  const [mounted, setMounted] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  
  // 정지 기록 및 호출 기록 표시 개수 (기본 10개)
  const [visiblePauseCount, setVisiblePauseCount] = useState(10);
  const [visibleCallCount, setVisibleCallCount] = useState(10);
  
  // localStorage에서 기록 불러오기 (날짜가 같으면)
  const currentDate = getCurrentDateString();
  const storedDate = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_DATE_KEY) : null;
  let initialCallRecords = [];
  let initialPauseRecords = [];
  if (storedDate === currentDate) {
    try {
      initialCallRecords = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CALL_KEY)) || [];
      initialPauseRecords = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PAUSE_KEY)) || [];
    } catch (e) {
      initialCallRecords = [];
      initialPauseRecords = [];
    }
  } else {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_DATE_KEY, currentDate);
    }
  }
  
  const [state, setState] = useState({
    fromNumber: '01012345678',
    inputNumbers: '',
    delayTime: DELAY_TIME_DEFAULT,
    isRunning: false,
    progress: 0,
    callRecords: initialCallRecords,
    currentCall: null,
    apiStatus: 'disconnected',
    pauseRecords: initialPauseRecords,
    currentSessionStart: null,
    excelRecords: [],
    excelRecordsTotal: 0,
    excelRecordsDuplicate: 0,
    lastUploadedHash: ''
  });
  
  const NEXT_NUMBERS_COUNT = 6;
  const currentIndexRef = useRef(0);
  const uniqueNumbersRef = useRef([]);
  const isRunningRef = useRef(state.isRunning);
  // currentSessionStart를 별도의 ref로 관리하여 비동기 업데이트 문제 회피
  const currentSessionStartRef = useRef(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    isRunningRef.current = state.isRunning;
  }, [state.isRunning]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_CALL_KEY, JSON.stringify(state.callRecords));
    }
  }, [state.callRecords]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_PAUSE_KEY, JSON.stringify(state.pauseRecords));
    }
  }, [state.pauseRecords]);
  
  // 자정마다 기록 초기화
  useEffect(() => {
    const interval = setInterval(() => {
      const current = getCurrentDateString();
      const stored = localStorage.getItem(LOCAL_STORAGE_DATE_KEY);
      if (stored !== current) {
        setState(prev => ({
          ...prev,
          callRecords: [],
          pauseRecords: []
        }));
        localStorage.setItem(LOCAL_STORAGE_DATE_KEY, current);
        localStorage.removeItem(LOCAL_STORAGE_CALL_KEY);
        localStorage.removeItem(LOCAL_STORAGE_PAUSE_KEY);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  
  const handleExcelUpload = ({ records, fileHash }) => {
    const processed = records.map(rec => ({
      phone: processPhoneNumber(rec.phone),
      name: rec.name,
      extra: rec.extra
    }));
    setState(prev => {
      const combined = [...prev.excelRecords, ...processed];
      const totalCombined = combined.length;
      const map = new Map();
      combined.forEach(rec => {
        map.set(rec.phone, rec);
      });
      const mergedRecords = Array.from(map.values());
      const duplicateCount = totalCombined - mergedRecords.length;
      const excelText = mergedRecords
        .map(rec => `${rec.name} | ${rec.phone} | ${rec.extra}`)
        .join('\n');
      return {
        ...prev,
        excelRecords: mergedRecords,
        excelRecordsTotal: totalCombined,
        excelRecordsDuplicate: duplicateCount,
        inputNumbers: excelText
      };
    });
    alert('새로운 엑셀 파일이 등록되었습니다.');
  };

  const processCall = async () => {
    // 모든 고유번호에 대한 콜이 완료된 경우
    if (currentIndexRef.current >= uniqueNumbersRef.current.length) {
      // currentSessionStartRef가 남아있다면 완료 기록을 추가합니다.
      if (currentSessionStartRef.current) {
        const pauseTime = Date.now();
        const durationMinutes = Math.floor((pauseTime - currentSessionStartRef.current) / 60000);
        const completeRecord = {
          id: uuidv4(),
          start: currentSessionStartRef.current,
          end: pauseTime,
          duration: durationMinutes,
          isComplete: true // 완료 기록임을 표시
        };
        setState(prev => ({
          ...prev,
          pauseRecords: [completeRecord, ...prev.pauseRecords],
          currentSessionStart: null,
          isRunning: false,
          progress: 100,
          currentCall: null
        }));
        currentSessionStartRef.current = null;
      } else {
        setState(prev => ({ ...prev, isRunning: false, progress: 100, currentCall: null }));
      }
      return;
    }
    
    const currentEntry = uniqueNumbersRef.current[currentIndexRef.current];
    const record = {
      id: uuidv4(),
      number: currentEntry.phone,
      name: currentEntry.name,
      extra: currentEntry.extra,
      status: '진행중',
      timestamp: Date.now(),
      result: null,
      duration: null,
      cost: null
    };
    
    try {
      setState(prev => ({
        ...prev,
        currentCall: record,
        apiStatus: 'connecting'
      }));
      
      const normalizedFromNumber = processPhoneNumber(state.fromNumber);
      
      const result = await callWithTimeout(
        TWILIO_CONFIG.ENABLED 
          ? callTwilioAPI(
              currentEntry.phone ? getCallNumber(currentEntry.phone) : '', 
              getCallNumber(normalizedFromNumber)
            )
          : mockCallAPI(currentEntry.phone ? getCallNumber(currentEntry.phone) : ''),
        CALL_TIMEOUT_SECONDS
      );
      
      const finalResult = (result.status === 'SUCCESS' && result.duration <= REJECT_THRESHOLD_SECONDS)
                            ? '거절'
                            : result.status;
      
      setState(prev => ({
        ...prev,
        callRecords: [{
          ...record, 
          status: '완료', 
          result: finalResult,
          duration: result.duration,
          cost: result.cost
        }, ...prev.callRecords],
        apiStatus: 'connected'
      }));
    } catch (error) {
      const errorResult = error.message.includes("timed out") ? "TIMEOUT" : "API오류";
      setState(prev => ({
        ...prev,
        callRecords: [{
          ...record, 
          status: '완료', 
          result: errorResult
        }, ...prev.callRecords],
        apiStatus: 'disconnected'
      }));
    }
    
    const newProgress = ((currentIndexRef.current + 1) / uniqueNumbersRef.current.length) * 100;
    currentIndexRef.current++;
    setState(prev => ({ ...prev, progress: newProgress, currentCall: null }));
    
    if (isRunningRef.current && currentIndexRef.current < uniqueNumbersRef.current.length) {
      setTimeout(() => {
        processCall();
      }, state.delayTime * 1000);
    } else {
      setState(prev => ({ ...prev, isRunning: false }));
    }
  };
  
  const startOrResumeCall = () => {
    const normalizedFromNumber = processPhoneNumber(state.fromNumber);
    if (!REGISTERED_FROM_NUMBERS.includes(getCallNumber(normalizedFromNumber))) {
      alert('등록된 발신번호가 아닙니다.');
      return;
    }
    const now = Date.now();
    currentSessionStartRef.current = now;
    setState(prev => ({
      ...prev,
      currentSessionStart: now
    }));
    if (state.excelRecords && state.excelRecords.length > 0) {
      uniqueNumbersRef.current = state.excelRecords;
    } else {
      const { uniqueNumbers } = getUniqueNumbers(state.inputNumbers);
      uniqueNumbersRef.current = uniqueNumbers.map(num => ({ phone: num, name: '', extra: '' }));
    }
    currentIndexRef.current = 0;
    setState(prev => ({ ...prev, progress: 0, isRunning: true }));
  };
  
  const pauseCall = () => {
    if (currentSessionStartRef.current) {
      const pauseTime = Date.now();
      const durationMinutes = Math.floor((pauseTime - currentSessionStartRef.current) / 60000);
      const newRecord = {
        id: uuidv4(),
        start: currentSessionStartRef.current,
        end: pauseTime,
        duration: durationMinutes
      };
      setState(prev => ({
        ...prev,
        pauseRecords: [newRecord, ...prev.pauseRecords],
        currentSessionStart: null
      }));
      currentSessionStartRef.current = null;
    }
    setState(prev => ({ ...prev, isRunning: false }));
  };
  
  const restartCall = () => {
    const normalizedFromNumber = processPhoneNumber(state.fromNumber);
    if (!REGISTERED_FROM_NUMBERS.includes(getCallNumber(normalizedFromNumber))) {
      alert('등록된 발신번호가 아닙니다.');
      return;
    }
    const now = Date.now();
    currentSessionStartRef.current = now;
    setState(prev => ({
      ...prev,
      currentSessionStart: now
    }));
    if (state.excelRecords && state.excelRecords.length > 0) {
      uniqueNumbersRef.current = state.excelRecords;
    } else {
      const { uniqueNumbers } = getUniqueNumbers(state.inputNumbers);
      uniqueNumbersRef.current = uniqueNumbers.map(num => ({ phone: num, name: '', extra: '' }));
    }
    currentIndexRef.current = 0;
    setState(prev => ({
      ...prev,
      isRunning: true,
      progress: 0,
      currentCall: null,
      apiStatus: TWILIO_CONFIG.ENABLED ? 'connecting' : 'connected'
    }));
  };
  
  useEffect(() => {
    if (state.isRunning) {
      processCall();
    }
  }, [state.isRunning, state.delayTime]);
  
  const getStatistics = () => {
    const stats = { 
      총합: 0, 
      SUCCESS: 0, 
      거절: 0,
      TIMEOUT: 0,
      평균시간: 0, 
      시간합계: 0,
      API오류: 0,
      총비용: 0
    };
    let totalDuration = 0;
    let countDuration = 0;
    let totalCost = 0;
    
    state.callRecords.forEach(r => {
      stats.총합++;
      if (r.result === 'SUCCESS' || r.result === '거절') {
        if (r.result === 'SUCCESS') stats.SUCCESS++;
        if (r.result === '거절') stats.거절++;
        if (r.duration) {
          totalDuration += r.duration;
          countDuration++;
        }
        if (r.cost) {
          totalCost += parseFloat(r.cost);
        }
      } else if (r.result === 'TIMEOUT') {
        stats.TIMEOUT++;
      } else if (r.result === 'API오류') {
        stats.API오류++;
      }
    });
    stats.시간합계 = Math.round(totalDuration);
    stats.평균시간 = countDuration > 0 ? Math.floor(totalDuration / countDuration) : 0;
    stats.총비용 = totalCost.toFixed(4);
    return stats;
  };
  
  const counts = state.excelRecords.length > 0 ? {
    total: state.excelRecordsTotal,
    duplicateCount: state.excelRecordsDuplicate,
    uniqueCount: state.excelRecords.length
  } : getUniqueNumbers(state.inputNumbers);
  
  const sortedCallRecords = state.callRecords.slice().sort((a, b) => b.timestamp - a.timestamp);
  const upcomingNumbers = uniqueNumbersRef.current.slice(currentIndexRef.current, currentIndexRef.current + NEXT_NUMBERS_COUNT);
  
  const startPauseButtonText = state.isRunning 
    ? '⏸️ 작업 중지'
    : (uniqueNumbersRef.current.length && currentIndexRef.current > 0 && currentIndexRef.current < uniqueNumbersRef.current.length)
      ? '▶️ 이어서 전화하기'
      : '▶️ 콜 시작';
  
  const currentCallDisplay = state.currentCall 
    ? (state.currentCall.name 
         ? `${state.currentCall.name} (${state.currentCall.number})\n${state.currentCall.extra}`
         : state.currentCall.number)
    : '현재 호출중인 번호가 없습니다.';
  
  const formatTime = (timestamp) => new Date(timestamp).toLocaleTimeString();
  
  /* ────────────── 스타일 정의 ────────────── */
  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#1a202c',
    color: '#ffffff',
    padding: '2rem'
  };
  
  const innerContainerStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  };
  
  const headerStyle = {
    textAlign: 'center',
    marginBottom: '3rem'
  };
  
  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem'
  };
  
  const apiStatusBadgeStyle = (connected) => ({
    marginLeft: '1rem',
    fontSize: '0.875rem',
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    backgroundColor: connected ? '#48bb78' : '#f56565',
    color: '#ffffff'
  });
  
  const panelFlexStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2rem',
    marginBottom: '2rem'
  };
  
  const panelStyle = {
    backgroundColor: '#2d3748',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    flex: '1',
    minWidth: '300px'
  };
  
  const inputStyle = {
    padding: '0.75rem',
    backgroundColor: '#4a5568',
    borderRadius: '0.5rem',
    width: '100%',
    textAlign: 'center',
    border: 'none',
    color: '#ffffff'
  };
  
  const textareaStyle = {
    width: '100%',
    height: '12rem',
    padding: '1rem',
    backgroundColor: '#4a5568',
    borderRadius: '0.5rem',
    marginTop: '0.5rem',
    border: 'none',
    color: '#ffffff',
    fontFamily: 'monospace'
  };
  
  const buttonStyle = (active, apiConnected) => ({
    flex: '1',
    padding: '1rem',
    borderRadius: '0.5rem',
    fontWeight: 'bold',
    backgroundColor: active ? '#e53e3e' : '#4299e1',
    opacity: apiConnected ? '1' : '0.5',
    cursor: apiConnected ? 'pointer' : 'not-allowed',
    border: 'none',
    color: '#ffffff'
  });
  
  const progressBarContainerStyle = {
    height: '0.75rem',
    backgroundColor: '#4a5568',
    borderRadius: '9999px'
  };
  
  const progressBarStyle = {
    height: '100%',
    backgroundColor: '#4299e1',
    borderRadius: '9999px',
    transition: 'width 0.3s ease'
  };
  
  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
  };
  
  const thStyle = {
    padding: '0.75rem',
    textAlign: 'left',
    backgroundColor: '#4a5568'
  };
  
  const tdStyle = {
    padding: '0.75rem',
    textAlign: 'left',
    borderTop: '1px solid #4a5568'
  };
  
  const statusBadgeStyle = (status, result = false) => {
    let bgColor = '#718096';
    if (status === '완료') {
      if (result === 'SUCCESS') bgColor = '#48bb78';
      else if (result === 'API오류') bgColor = '#f56565';
      else if (result === '거절') bgColor = '#ed8936';
      else if (result === 'TIMEOUT') bgColor = '#a0aec0';
    } else if (status === '진행중') {
      bgColor = '#4299e1';
    }
    return {
      padding: '0.25rem 0.5rem',
      borderRadius: '9999px',
      fontSize: '0.875rem',
      backgroundColor: bgColor,
      color: '#ffffff',
      textAlign: 'center'
    };
  };
  
  const statOrder = ['총합', 'SUCCESS', '거절', 'TIMEOUT', '평균시간', '시간합계', 'API오류', '총비용'];
  const stats = getStatistics();
  
  if (!mounted) return <div>Loading...</div>;
  
  return (
    <div style={containerStyle}>
      <div style={innerContainerStyle}>
        <header style={headerStyle}>
          <h1 style={titleStyle}>
            Auto Call
            <span style={apiStatusBadgeStyle(state.apiStatus === 'connected')}>
              {state.apiStatus === 'connected' ? '시스템 연결' : '시스템 연결안됨'}
            </span>
          </h1>
          <p style={{ color: '#a0aec0' }}>
            {TWILIO_CONFIG.ENABLED ? 'Twilio 시스템 연동 완료' : '오토 콜 시뮬레이션'}
          </p>
          <p style={{ color: '#68d391', fontSize: '0.9rem' }}>
            (현재 {TWILIO_CONFIG.ENABLED ? '실제 콜 모드' : '시뮬레이션 모드'} 중입니다.)
          </p>
        </header>
        <div style={panelFlexStyle}>
          <div style={panelStyle}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ flex: '1 1 250px' }}>
                <label htmlFor="fromNumber" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  발신번호
                </label>
                <input
                  id="fromNumber"
                  type="text"
                  style={inputStyle}
                  placeholder="예) 01012345678"
                  value={state.fromNumber}
                  onChange={(e) =>
                    setState(prev => ({ ...prev, fromNumber: e.target.value }))
                  }
                />
              </div>
              <div style={{ flex: '2 1 400px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label htmlFor="inputNumbers" style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    전화번호 입력 (수동)
                  </label>
                  <AutoCallExcel onExcelUpload={handleExcelUpload} />
                </div>
                <textarea
                  id="inputNumbers"
                  style={textareaStyle}
                  placeholder="전화번호 입력 (예: 010-1234-5678, 0212345678)"
                  value={state.inputNumbers}
                  onChange={(e) =>
                    setState(prev => ({ ...prev, inputNumbers: e.target.value }))
                  }
                  readOnly={state.excelRecords.length > 0}
                />
              </div>
            </div>
            <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#cbd5e0' }}>
              <div>등록된 전화번호(수동 입력): {counts.total}개</div>
              <div>중복된 번호: {counts.duplicateCount}개</div>
              <div>고유 번호: {counts.uniqueCount}개</div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
              <span>전화 딜레이</span>
              <input
                type="number"
                style={{ ...inputStyle, width: '80px' }}
                value={state.delayTime}
                onChange={(e) =>
                  setState(prev => ({ ...prev, delayTime: parseInt(e.target.value, 10) }))
                }
              />
              <span>초</span>
            </div>
          </div>
          <div style={panelStyle}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <button
                disabled={buttonDisabled}
                style={buttonStyle(state.isRunning, state.apiStatus === 'connected' || !TWILIO_CONFIG.ENABLED)}
                onClick={() => {
                  if (buttonDisabled) return;
                  setButtonDisabled(true);
                  state.isRunning ? pauseCall() : startOrResumeCall();
                  setTimeout(() => setButtonDisabled(false), 1000);
                }}
              >
                {startPauseButtonText}
              </button>
              <button
                disabled={buttonDisabled}
                style={buttonStyle(false, state.apiStatus === 'connected' || !TWILIO_CONFIG.ENABLED)}
                onClick={() => {
                  if (buttonDisabled) return;
                  setButtonDisabled(true);
                  restartCall();
                  setTimeout(() => setButtonDisabled(false), 1000);
                }}
              >
                🔄 처음부터 콜 시작
              </button>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={progressBarContainerStyle}>
                <div style={{ ...progressBarStyle, width: `${state.progress}%` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                <span>진행률:</span>
                <span>{state.progress.toFixed(1)}%</span>
              </div>
            </div>
            <div style={{
              backgroundColor: '#2d3748',
              padding: '1rem',
              borderRadius: '0.5rem',
              textAlign: 'center',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '2rem',
              whiteSpace: 'pre-wrap'
            }}>
              {currentCallDisplay}
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>🔜 다음 전화번호</h2>
            {upcomingNumbers.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {upcomingNumbers.map((entry, idx) => (
                  <li key={idx} style={{ fontWeight: idx === 0 ? 'bold' : 'normal', marginBottom: '0.5rem' }}>
                    {entry.name 
                      ? `${entry.name} (${entry.phone}) - ${entry.extra}` 
                      : entry.phone}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#cbd5e0' }}>대기중인 번호가 없습니다.</p>
            )}
          </div>
          <div style={panelStyle}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>📊 실시간 통계</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {statOrder.map((key) => (
                <div key={key} style={{ padding: '1rem', backgroundColor: '#edf2f7', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '3rem' }}>
                  <span style={{ fontSize: '1rem', color: '#2d3748' }}>{key}</span>
                  <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#2d3748' }}>
                    {key === '평균시간'
                      ? `${(stats[key] / 60).toFixed(1)}분`
                      : key === '시간합계'
                        ? `${(stats[key] / 60).toFixed(1)}분`
                        : key === '총비용'
                          ? `$${stats[key]}`
                          : stats[key]}
                  </span>
                </div>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"center",alignItems:"center", flexDirection:"column"}}>
              <div style={{marginTop:"35px",fontWeight:"bold"}}>메모</div>
              <div style={{marginTop:"20px"}}>워크비자 화이팅</div>
            </div>
          </div>
        </div>
        <div style={{ ...panelStyle, marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>⏸️ 정지 기록 (자정 초기화)</h2>
          {state.pauseRecords.length > 0 ? (
            <>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>번호</th>
                    <th style={thStyle}>시작 시간</th>
                    <th style={thStyle}>정지 시간</th>
                    <th style={thStyle}>간격 (분)</th>
                  </tr>
                </thead>
                <tbody>
                  {[...state.pauseRecords]
                    .sort((a, b) => b.end - a.end)
                    .slice(0, visiblePauseCount)
                    .map((record, index) => (
                      <tr 
                        key={record.id} 
                        style={ record.isComplete ? { fontWeight: 'bold' } : {} }
                      >
                        <td style={tdStyle}>{index + 1}</td>
                        <td style={tdStyle}>{formatTime(record.start)}</td>
                        <td style={tdStyle}>{formatTime(record.end)}</td>
                        <td style={tdStyle}>{record.duration}분</td>
                      </tr>
                  ))}
                </tbody>
              </table>
              {state.pauseRecords.length > visiblePauseCount && (
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <button
                    style={{ ...buttonStyle(false, true), padding: '0.5rem 1rem' }}
                    onClick={() => setVisiblePauseCount(prev => prev + 50)}
                  >
                    더보기
                  </button>
                </div>
              )}
            </>
          ) : (
            <p style={{ color: '#cbd5e0', textAlign: 'center' }}>정지 기록이 없습니다.</p>
          )}
        </div>
        <div style={panelStyle}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>📜 호출 기록 (자정 초기화)</h2>
          {sortedCallRecords.length > 0 ? (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>번호</th>
                      <th style={thStyle}>전화번호</th>
                      <th style={thStyle}>이름</th>
                      <th style={thStyle}>기타사항</th>
                      <th style={{ textAlign: 'center', ...thStyle }}>상태</th>
                      <th style={{ textAlign: 'center', ...thStyle }}>결과</th>
                      <th style={{ textAlign: 'center', ...thStyle }}>통화시간(초)</th>
                      <th style={{ textAlign: 'center', ...thStyle }}>비용($)</th>
                      <th style={{ textAlign: 'right', ...thStyle }}>시간</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedCallRecords.slice(0, visibleCallCount).map((record, index) => (
                      <tr key={record.id}>
                        <td style={tdStyle}>{sortedCallRecords.length - index}</td>
                        <td style={tdStyle}>{record.number}</td>
                        <td style={tdStyle}>{record.name || '-'}</td>
                        <td style={tdStyle}>{record.extra || '-'}</td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          <span style={statusBadgeStyle(record.status)}>
                            {record.status}
                          </span>
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          <span style={statusBadgeStyle('완료', record.result)}>
                            {record.result || '-'}
                          </span>
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          {record.duration !== null ? record.duration : '-'}
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          {record.cost !== null ? `$${record.cost}` : '-'}
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'right', fontSize: '0.875rem', color: '#a0aec0' }}>
                          {new Date(record.timestamp).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {sortedCallRecords.length > visibleCallCount && (
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <button
                    style={{ ...buttonStyle(false, true), padding: '0.5rem 1rem' }}
                    onClick={() => setVisibleCallCount(prev => prev + 50)}
                  >
                    더보기
                  </button>
                </div>
              )}
            </>
          ) : (
            <p style={{ color: '#cbd5e0', textAlign: 'center' }}>호출 기록이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
