import { useState } from 'react';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');  // 메시지를 상태로 저장
  const [error, setError] = useState(null);    // 오류 상태 추가

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputValue); // 여기에 inputValue 출력 확인

    try {
      const response = await fetch('http://localhost:3000/api/index', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputValue }),  // 서버로 보낼 데이터
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Data saved successfully!');  // 성공 메시지
        setError(null);  // 에러 메시지 초기화
        console.log(result);  // 서버에서 받은 응답 출력
      } else {
        setError(result.error || 'Failed to save data');  // 서버 오류 처리
        setMessage('');  // 성공 메시지 초기화
      }
    } catch (error) {
      setError('Error saving data');
      setMessage('');  // 성공 메시지 초기화
    }
  };

  return (
    <div>
      <h1>사용자 인풋 JSON에 저장하기</h1>
      <form onSubmit={handleSubmit}> {/* Fixed here */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter some data"
        />
        <button type="submit">Save Data</button>
      </form>

      {/* 성공 메시지 출력 */}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      {/* 오류 메시지 출력 */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default App;
