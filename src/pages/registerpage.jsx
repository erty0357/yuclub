import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    userId: '',
    password: '',
    email: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/api/users/join', form);
      alert('회원가입이 완료되었습니다.');
      navigate('/');
    } catch (err) {
      alert('회원가입 실패! 입력값을 확인해주세요.');
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#f0f4f8',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '400px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>회원가입</h2>

        <input
          name="name"
          placeholder="이름"
          value={form.name}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="userId"
          placeholder="아이디 (숫자만)"
          value={form.userId}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          name="email"
          type="email"
          placeholder="이메일"
          value={form.email}
          onChange={handleChange}
          style={inputStyle}
        />

        <button onClick={handleSubmit} style={buttonStyle}>
          회원가입
        </button>
        <button
          onClick={() => navigate('/')}
          style={{ ...buttonStyle, backgroundColor: '#3b82f6', marginTop: '10px' }}
        >
          로그인으로 돌아가기
        </button>
      </div>
    </div>
  );
}

// 스타일 분리
const inputStyle = {
  width: '100%',
  padding: '12px',
  marginBottom: '12px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none',
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#3b82f6',
  border: 'none',
  borderRadius: '8px',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '16px',
  cursor: 'pointer',
};
