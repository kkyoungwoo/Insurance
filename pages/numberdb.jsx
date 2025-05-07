// pages/numberdb.jsx
import { useState, useRef } from 'react';

export default function NumberDBPage() {
  const [numbers, setNumbers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [copyStatus, setCopyStatus] = useState('');
  const [filename, setFilename] = useState('');
  const fileInputRef = useRef();

  // count 단위로 나눠서 쉼표 처리 후 한 줄 문자열로 반환
  function groupByCount(list, count) {
    const result = [];
    for (let i = 0; i < list.length; i += count) {
      const slice = list.slice(i, i + count);
      // 마지막 요소 제외하고 뒤에 쉼표 추가
      const withCommas = slice.map((num, idx) =>
        idx < slice.length - 1 ? `${num},` : num
      );
      // 줄바꿈 없이 한 줄로
      result.push(withCommas.join(''));
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
        .map(line => line.trim().replace(/\s+/g, ''))
        .filter(line => line !== '');
      setNumbers(arr);
      setGroups([]);
      setCopyStatus('');
    };
    reader.readAsText(file, 'utf-8');
  };

  // 010/10 핸들러
  const handle010 = () => {
    const mobile11 = numbers.filter(n => n.startsWith('010') && n.length === 11);
    const mobile10 = numbers
      .filter(n => n.startsWith('10') && n.length === 10)
      .map(n => '0' + n);
    setGroups(groupByCount([...mobile11, ...mobile10], 25));
    setCopyStatus('');
  };

  // 지역번호 핸들러
  const handleRegion = () => {
    const regionCodes = [
      '02','031','032','033','041','042','043','044',
      '051','052','053','054','055',
      '061','062','063','064'
    ];
    const regional = [];
    regionCodes.forEach(code => {
      const with0 = numbers.filter(n => n.startsWith(code) && n.length === 10);
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
    const text = groups
      .map((grp, idx) => `그룹 ${idx + 1} ${grp}`)
      .join('\n');
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
        backgroundColor: '#ebf8ff',
        border: '1px solid #90cdf4',
        borderRadius: '8px',
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: '16px' }}>
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
            fontWeight: 'bold',
          }}
        >
          📂 텍스트 파일 업로드
        </button>
        {filename && <span style={{ marginLeft: '12px' }}>{filename}</span>}
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
            fontWeight: 'bold',
          }}
        >
          📋 전체 복사
        </button>
      </div>

      {/* 복사 상태 */}
      {copyStatus && (
        <p style={{ textAlign: 'center', marginBottom: '16px' }}>
          {copyStatus}
        </p>
      )}

      {/* 결과 출력 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {groups.map((grp, idx) => (
          <div key={idx} style={{ textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 8px', fontWeight: 'bold', color: '#3182ce' }}>
              그룹 {idx + 1}
            </h2>
            <textarea
              readOnly
              value={grp}
              rows={1}
              style={{
                width: '100%',
                padding: '12px',
                fontFamily: 'monospace',
                textAlign: 'center',
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
