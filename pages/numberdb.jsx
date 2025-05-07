// pages/numberdb.jsx
import { useState, useRef } from 'react';

export default function NumberDBPage() {
  const [numbers, setNumbers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [copyStatus, setCopyStatus] = useState('');
  const [filename, setFilename] = useState('');
  const fileInputRef = useRef();

  // count 단위로 나눠서 줄바꿈 문자열 배열로 반환
  function groupByCount(list, count) {
    const result = [];
    for (let i = 0; i < list.length; i += count) {
      result.push(list.slice(i, i + count).join('\n'));
    }
    return result;
  }

  // .txt 파일 업로드 핸들러
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFilename(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      const arr = text
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line !== '');
      setNumbers(arr);
      setGroups([]);
      setCopyStatus('');
    };
    reader.readAsText(file, 'utf-8');
  };

  // 010/10 핸들러: 010시작11자리 + 10시작10자리(0추가)
  const handle010 = () => {
    const mobile11 = numbers.filter(n => n.startsWith('010') && n.length === 11);
    const mobile10 = numbers
      .filter(n => n.startsWith('10') && n.length === 10)
      .map(n => '0' + n);
    const all010 = [...mobile11, ...mobile10];
    setGroups(groupByCount(all010, 25));
    setCopyStatus('');
  };

  // 지역번호 핸들러: 모든 한국 지역번호 지원
  const handleRegion = () => {
    // 한국 지역번호 리스트 (선택)
    const regionCodes = [
      '02','031','032','033','041','042','043','044',
      '051','052','053','054','055',
      '061','062','063','064'
    ];
    const regional = [];

    regionCodes.forEach(code => {
      // '0' 포함 코드로 정확히 10자리
      const with0 = numbers.filter(n => n.startsWith(code) && n.length === 10);
      // 앞자리 '0' 없는 경우 (code='0xx' 이므로 slice(1)로 비교), 길이 9 → 앞에 '0' 추가
      const without0 = numbers
        .filter(n => n.startsWith(code.slice(1)) && n.length === 9)
        .map(n => '0' + n);
      regional.push(...with0, ...without0);
    });

    setGroups(groupByCount(regional, 25));
    setCopyStatus('');
  };

  // 전체 복사
  const handleCopyAll = async () => {
    if (!groups.length) return;
    const text = groups.map((grp, idx) => `그룹 ${idx + 1}\n${grp}`).join('\n\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('✅ 복사 완료!');
    } catch {
      setCopyStatus('❌ 복사 실패. 다시 시도해주세요.');
    }
    setTimeout(() => setCopyStatus(''), 2000);
  };

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '40px auto',
        padding: '24px',
        backgroundColor: '#ebf8ff', // 연한 블루 계열
        border: '1px solid #90cdf4',
        borderRadius: '8px',
      }}
    >
      <h1 style={{ textAlign: 'center', color: 'black', marginBottom: '16px' }}>
        📞 전화번호 분류기
      </h1>

      {/* 파일 업로드 */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <input
          type="file"
          accept=".txt"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleUpload}
        />
        <button
          onClick={() => fileInputRef.current.click()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#fff',
            border: '2px solid #90cdf4',
            borderRadius: '6px',
            cursor: 'pointer',
            color: '#000',
            fontWeight: 'bold',
          }}
        >
          📂 텍스트 파일 업로드
        </button>
        {filename && <span style={{ marginLeft: '12px', color: '#000' }}>{filename}</span>}
      </div>

      {/* 동작 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
        <button
          onClick={handle010}
          disabled={!numbers.length}
          style={{
            padding: '10px 20px',
            backgroundColor: numbers.length ? '#bee3f8' : '#e2e8f0',
            border: '2px solid #3182ce',
            borderRadius: '6px',
            cursor: numbers.length ? 'pointer' : 'not-allowed',
            color: '#000',
            fontWeight: 'bold',
          }}
        >
          ✅ 010/10 → 11자리
        </button>
        <button
          onClick={handleRegion}
          disabled={!numbers.length}
          style={{
            padding: '10px 20px',
            backgroundColor: numbers.length ? '#bee3f8' : '#e2e8f0',
            border: '2px solid #3182ce',
            borderRadius: '6px',
            cursor: numbers.length ? 'pointer' : 'not-allowed',
            color: '#000',
            fontWeight: 'bold',
          }}
        >
          🗺️ 지역번호 → 10자리
        </button>
        <button
          onClick={handleCopyAll}
          disabled={!groups.length}
          style={{
            padding: '10px 20px',
            backgroundColor: groups.length ? '#bee3f8' : '#e2e8f0',
            border: '2px solid #38a169',
            borderRadius: '6px',
            cursor: groups.length ? 'pointer' : 'not-allowed',
            color: '#000',
            fontWeight: 'bold',
          }}
        >
          📋 전체 복사
        </button>
      </div>

      {/* 복사 상태 */}
      {copyStatus && (
        <p style={{ textAlign: 'center', color: '#000', marginBottom: '16px' }}>
          {copyStatus}
        </p>
      )}

      {/* 결과 출력 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {groups.map((grp, idx) => (
          <div key={idx} style={{ textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 8px', color: '#3182ce', fontWeight: 'bold' }}>
              그룹 {idx + 1}
            </h2>
            <textarea
              readOnly
              value={grp}
              rows={grp.split('\n').length}
              style={{
                width: '100%',
                padding: '12px',
                fontFamily: 'monospace',
                textAlign: 'center',
                color: '#000',
                backgroundColor: '#fff',
                border: '2px solid #90cdf4',
                borderRadius: '6px',
                resize: 'none',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
