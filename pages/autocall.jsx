import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

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
// 실제 서비스에서는 Twilio API를 통해 발신번호 등록여부를 확인해야 합니다.
const REGISTERED_FROM_NUMBERS = [
  '+821012345678', 
  '+821112345678'
];

/* ────────────── 헬퍼 함수: 정규화 (자동 +82 처리) ────────────── */
const normalizeFromNumber = (numStr) => {
  if (!numStr) return '';
  // 모든 숫자만 남김
  let digits = numStr.replace(/\D/g, '');
  // 만약 이미 국가번호 82로 시작하면
  if (digits.startsWith('82')) {
    return '+' + digits;
  }
  // 0으로 시작하는 경우: 0을 제거하고 +82 추가
  if (digits.startsWith('0')) {
    return '+82' + digits.substring(1);
  }
  // 만약 10으로 시작하고 총 길이가 10인 경우 (예: 1012345678), 앞에 0을 붙인 후 처리
  if (digits.startsWith('10') && digits.length === 10) {
    return '+82' + digits;
  }
  // 그 외: 기본적으로 +82 붙임
  return '+82' + digits;
};

/* ────────────── 타임아웃 기능: 주어진 시간 내에 프로미스가 해결되지 않으면 에러 발생 ────────────── */
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
  const randomDuration = Math.random() * (300 - 30) + 30; // 30초 ~ 300초 사이
  const duration = Math.round(randomDuration * 10) / 10;   // 0.1초 단위 반올림
  const cost = (duration * RATE_PER_SECOND).toFixed(4);
  return { status: 'SUCCESS', duration, cost };
};

/* ────────────── 실제 Twilio API 호출 함수 ────────────── */
const callTwilioAPI = async (toNumber, fromNumber) => {
  const { ACCOUNT_SID, AUTH_TOKEN, voice_url } = TWILIO_CONFIG;
  const url = `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Calls.json`;
  
  // 기본 파라미터 설정 (발신번호는 사용자가 입력한 값)
  const params = new URLSearchParams();
  params.append('To', toNumber);
  params.append('From', fromNumber);
  if (voice_url && voice_url.trim() !== '') {
    params.append('Url', voice_url);
  }
  
  // Basic Auth 헤더 생성
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
  // API 응답에 duration, price 등의 정보가 포함되어 있다고 가정합니다.
  const rawDuration = data.duration || (Math.random() * (300 - 30) + 30);
  const duration = Math.round(rawDuration * 10) / 10;
  const cost = (duration * RATE_PER_SECOND).toFixed(4);
  return { 
    status: data.status || 'SUCCESS', 
    duration, 
    cost 
  };
};

/* ────────────── 전화번호 문자열 파싱 함수 ────────────── */
const getUniqueNumbers = (input) => {
  const cleaned = input
    .split(/[,\s]+/) // 쉼표, 탭, 스페이스로 분리
    .map(num => num.replace(/\D/g, ''))
    .filter(num => num.length >= 9 && num.length <= 11);
  const uniqueSet = new Set(cleaned);
  const uniqueNumbers = Array.from(uniqueSet);
  return {
    uniqueNumbers,
    total: cleaned.length,
    duplicateCount: cleaned.length - uniqueNumbers.length,
    uniqueCount: uniqueNumbers.length
  };
};

export default function AutoCall() {
  // 컴포넌트 상태 정의 (fromNumber 추가)
  const [state, setState] = useState({
    fromNumber: '01012345678', // 기본값 (입력값은 자동 +82 처리됨)
    inputNumbers: '',
    delayTime: DELAY_TIME_DEFAULT, // 딜레이 (초)
    isRunning: false,
    progress: 0,
    callRecords: [],
    currentCall: null,
    apiStatus: 'disconnected',
    pauseRecords: [], // 정지 기록
    currentSessionStart: null // 현재 호출 세션 시작 시각
  });
  
  // 다음 호출할 번호 목록을 보여주기 위한 개수 (다음 10개)
  const NEXT_NUMBERS_COUNT = 6;
  
  // 현재 인덱스, 고유 전화번호 목록, 실행 상태 추적
  const currentIndexRef = useRef(0);
  const uniqueNumbersRef = useRef([]);
  const isRunningRef = useRef(state.isRunning);
  
  useEffect(() => {
    isRunningRef.current = state.isRunning;
  }, [state.isRunning]);
  
  // 호출 진행 함수
  const processCall = async () => {
    if (currentIndexRef.current >= uniqueNumbersRef.current.length) {
      setState(prev => ({ ...prev, isRunning: false, progress: 100, currentCall: null }));
      return;
    }
    
    const currentNumber = uniqueNumbersRef.current[currentIndexRef.current];
    const record = {
      id: uuidv4(),
      number: currentNumber,
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
      
      // 정규화된 발신번호 추출
      const normalizedFromNumber = normalizeFromNumber(state.fromNumber);
      
      // CALL_TIMEOUT_SECONDS (15초) 내에 API 호출이 완료되지 않으면 타임아웃 에러 발생
      const result = await callWithTimeout(
        TWILIO_CONFIG.ENABLED 
          ? callTwilioAPI(currentNumber, normalizedFromNumber)
          : mockCallAPI(currentNumber),
        CALL_TIMEOUT_SECONDS
      );
      
      // 통화 성공 후 20초 이하이면 "거절"로 처리
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
      // 타임아웃일 경우 "TIMEOUT" 처리, 그 외는 "API오류"
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
    
    // 통화가 완료된 후 delayTime(기본 3초) 후에 다음 통화를 진행합니다.
    if (isRunningRef.current && currentIndexRef.current < uniqueNumbersRef.current.length) {
      setTimeout(() => {
        processCall();
      }, state.delayTime * 1000);
    } else {
      setState(prev => ({ ...prev, isRunning: false }));
    }
  };
  
  // 시작 또는 이어서 호출 (발신번호 유효성 검사 추가)
  const startOrResumeCall = () => {
    // 정규화된 발신번호
    const normalizedFromNumber = normalizeFromNumber(state.fromNumber);
    if (!REGISTERED_FROM_NUMBERS.includes(normalizedFromNumber)) {
      alert('등록된 발신번호가 아닙니다.');
      return;
    }
    
    // 새로운 호출 세션 시작 시점 기록
    setState(prev => ({
      ...prev,
      currentSessionStart: Date.now()
    }));
    
    if (uniqueNumbersRef.current.length === 0 || currentIndexRef.current >= uniqueNumbersRef.current.length) {
      const { uniqueNumbers } = getUniqueNumbers(state.inputNumbers);
      uniqueNumbersRef.current = uniqueNumbers;
      currentIndexRef.current = 0;
      setState(prev => ({ ...prev, callRecords: [], progress: 0 }));
    }
    setState(prev => ({ ...prev, isRunning: true }));
  };
  
  // 일시정지
  const pauseCall = () => {
    // 호출 정지 시 현재 호출 세션의 시간 간격을 기록
    if (state.currentSessionStart) {
      const pauseTime = Date.now();
      const durationMinutes = Math.floor((pauseTime - state.currentSessionStart) / 60000);
      const newRecord = {
        id: uuidv4(),
        start: state.currentSessionStart,
        end: pauseTime,
        duration: durationMinutes
      };
      setState(prev => ({
        ...prev,
        pauseRecords: [newRecord, ...prev.pauseRecords],
        currentSessionStart: null
      }));
    }
    setState(prev => ({ ...prev, isRunning: false }));
  };
  
  // 처음부터 호출 (재시작) -- 발신번호 유효성 검사 포함
  const restartCall = () => {
    const normalizedFromNumber = normalizeFromNumber(state.fromNumber);
    if (!REGISTERED_FROM_NUMBERS.includes(normalizedFromNumber)) {
      alert('등록된 발신번호가 아닙니다.');
      return;
    }
    
    const { uniqueNumbers } = getUniqueNumbers(state.inputNumbers);
    uniqueNumbersRef.current = uniqueNumbers;
    currentIndexRef.current = 0;
    setState(prev => ({
      ...prev,
      isRunning: true,
      progress: 0,
      callRecords: [],
      currentCall: null,
      apiStatus: TWILIO_CONFIG.ENABLED ? 'connecting' : 'connected',
      currentSessionStart: Date.now() // 새로운 호출 세션 시작
    }));
  };
  
  useEffect(() => {
    if (state.isRunning) {
      processCall();
    }
  }, [state.isRunning, state.delayTime]);
  
  /* ────────────── 실시간 통계 계산 함수 ────────────── */
  const getStatistics = () => {
    // 통계 항목: 총합, SUCCESS, API오류, TIMEOUT, 거절, 평균시간, 총비용, 총 통화시간(초)
    const stats = { 
      총합: 0, 
      SUCCESS: 0, 
      API오류: 0, 
      TIMEOUT: 0,
      거절: 0,
      평균시간: 0, 
      총비용: 0,
      시간합계: 0
    };
    let totalDuration = 0;
    let countDuration = 0;
    let totalCost = 0;
    
    state.callRecords.forEach(r => {
      stats.총합++;
      if (r.result === 'SUCCESS' || r.result === '거절') {
        // SUCCESS와 거절은 통화 성공으로 간주하여 통화 시간과 비용 합산
        if (r.result === 'SUCCESS') stats.SUCCESS++;
        if (r.result === '거절') stats.거절++;
        if (r.duration) {
          totalDuration += r.duration;
          countDuration++;
        }
        if (r.cost) {
          totalCost += parseFloat(r.cost);
        }
      } else if (r.result === 'API오류') {
        stats.API오류++;
      } else if (r.result === 'TIMEOUT') {
        stats.TIMEOUT++;
      }
    });
    stats.시간합계 = Math.round(totalDuration);
    stats.평균시간 = countDuration > 0 ? Math.floor(totalDuration / countDuration) : 0;
    stats.총비용 = totalCost.toFixed(4);
    return stats;
  };
  
  // 전화번호 등록 정보
  const { total, duplicateCount, uniqueCount } = getUniqueNumbers(state.inputNumbers);
  
  // 최근 호출 기록 (최신순 정렬)
  const sortedCallRecords = state.callRecords.slice().sort((a, b) => b.timestamp - a.timestamp);
  
  // 다음 호출 대기 목록 (다음 NEXT_NUMBERS_COUNT개)
  const upcomingNumbers = uniqueNumbersRef.current.slice(currentIndexRef.current, currentIndexRef.current + NEXT_NUMBERS_COUNT);
  
  // 버튼 텍스트 결정
  const startPauseButtonText = state.isRunning 
    ? '⏸️ 작업 중지'
    : (uniqueNumbersRef.current.length && currentIndexRef.current > 0 && currentIndexRef.current < uniqueNumbersRef.current.length)
      ? '▶️ 이어서 전화하기'
      : '▶️ 콜 시작';
  
  // 날짜 및 시간 포맷팅 함수
  const formatTime = (timestamp) => new Date(timestamp).toLocaleTimeString();
  const formatDate = (timestamp) => new Date(timestamp).toLocaleDateString();
  
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
    color: '#ffffff'
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
  
  // 현재 진행 중인 전화번호를 상단에 크게 표시 (호출 중이면)
  const currentCallDisplay = state.currentCall 
    ? `${state.currentCall.number}`
    : '현재 호출중인 번호가 없습니다.';
  
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
          {/* 발신번호와 전화번호 입력 섹션 (flex row, wrap 적용) */}
          <div style={panelStyle}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              {/* 발신번호 입력 */}
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
              {/* 전화번호 입력 */}
              <div style={{ flex: '2 1 400px' }}>
                <label htmlFor="inputNumbers" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  전화번호 입력
                </label>
                <textarea
                  id="inputNumbers"
                  style={textareaStyle}
                  placeholder="전화번호 입력 (예: 010-1234-5678, 0212345678)"
                  value={state.inputNumbers}
                  onChange={(e) =>
                    setState(prev => ({ ...prev, inputNumbers: e.target.value }))
                  }
                />
              </div>
            </div>
            <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#cbd5e0' }}>
              <div>등록된 전화번호: {total}개</div>
              <div>중복된 번호: {duplicateCount}개</div>
              <div>고유 번호: {uniqueCount}개</div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
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
          
          {/* 다음 호출 안내 섹션 */}
          <div style={panelStyle}>
            
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <button
                style={buttonStyle(state.isRunning, state.apiStatus === 'connected' || !TWILIO_CONFIG.ENABLED)}
                onClick={() => {
                  state.isRunning ? pauseCall() : startOrResumeCall();
                }}
              >
                {startPauseButtonText}
              </button>
              <button
                style={buttonStyle(false, state.apiStatus === 'connected' || !TWILIO_CONFIG.ENABLED)}
                onClick={restartCall}
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
              marginBottom: '2rem'
            }}>
              {currentCallDisplay}
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>🔜 다음 전화번호</h2>
            {upcomingNumbers.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {upcomingNumbers.map((num, idx) => (
                  <li key={idx} style={{ fontWeight: idx === 0 ? 'bold' : 'normal', marginBottom: '0.5rem' }}>
                    {num}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#cbd5e0' }}>대기중인 번호가 없습니다.</p>
            )}
          </div>
          
          {/* 실시간 통계 섹션 */}
          <div style={panelStyle}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>📊 실시간 통계</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
    {Object.entries(getStatistics()).map(([key, value]) => (
      <div key={key} style={{ padding: '1rem', backgroundColor: '#edf2f7', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '3rem' }}>
        <span style={{ fontSize: '1rem', color: '#2d3748' }}>{key}</span>
        <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#2d3748' }}>
          {key === '평균시간'
            ? `${(value / 60).toFixed(1)}분`
            : key === '총비용'
              ? `$${value}`
              : key === '시간합계'
              ? `${(value / 60).toFixed(1)}분`
                : value}
        </span>
      </div>
    ))}
  </div>
          </div>
        </div>
        
        {/* 정지 기록 패널 (항상 남도록) */}
        <div style={{ ...panelStyle, marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>⏸️ 정지 기록</h2>
          {state.pauseRecords.length > 0 ? (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>시작 시간</th>
                  <th style={thStyle}>정지 시간</th>
                  <th style={thStyle}>간격 (분)</th>
                </tr>
              </thead>
              <tbody>
                {state.pauseRecords.map((record) => (
                  <tr key={record.id}>
                    <td style={tdStyle}>{formatTime(record.start)}</td>
                    <td style={tdStyle}>{formatTime(record.end)}</td>
                    <td style={tdStyle}>{record.duration}분</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: '#cbd5e0', textAlign: 'center' }}>정지 기록이 없습니다.</p>
          )}
        </div>
        
        {/* 호출 기록 테이블 */}
        <div style={panelStyle}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>📜 호출 기록</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>전화번호</th>
                  <th style={{ textAlign: 'center', ...thStyle }}>상태</th>
                  <th style={{ textAlign: 'center', ...thStyle }}>결과</th>
                  <th style={{ textAlign: 'center', ...thStyle }}>통화시간(초)</th>
                  <th style={{ textAlign: 'center', ...thStyle }}>비용($)</th>
                  <th style={{ textAlign: 'right', ...thStyle }}>시간</th>
                </tr>
              </thead>
              <tbody>
                {sortedCallRecords.map((record) => (
                  <tr key={record.id}>
                    <td style={tdStyle}>{record.number}</td>
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
        </div>
        
      </div>
    </div>
  );
}
