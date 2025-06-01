import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '/yu_logo.png';

function LoginPage() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
        username: id,
        password: pw,
      });

      const role = res.data.role;
      localStorage.setItem('userRole', role);
      localStorage.setItem('user', JSON.stringify({ userId: id }));

      navigate('/main');
    } catch (err) {
      alert('로그인 실패! 아이디 또는 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#ffffff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* 배경 이미지 박스 */}
      <div
        style={{
          width: '90vw',
          height: '90vh',
          position: 'relative',
          borderRadius: '24px',
          border: '4px solid #3b82f6', // 파란 테두리
          overflow: 'hidden',
          boxShadow: '0 0 20px rgba(0,0,0,0.1)',
        }}
      >
        {/* 실제 이미지 */}
        <img
          src="/yu_bg.jpg"
          alt="배경 이미지"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 0,
          }}
        />

        {/* 내용 위에 덮어쓰기 */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          {/* 제목 영역 */}
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '80px', fontWeight: '900', margin: 0 }}>
              <span style={{ color: '#7dd3fc' }}>Y</span>
              <span style={{ color: 'white' }}>uClub</span>
            </h1>
            <p style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginTop: '10px' }}>
              함께 만들어가는 영남인의 동아리 공간
            </p>
          </div>

          {/* 로그인 박스 */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              width: '500px',
              padding: '30px',
              borderRadius: '16px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '-30px'
            }}
          >
            <img src={logo} alt="영남대학교 로고" style={{ width: '250px', marginBottom: '20px' }} />
            <input
              type="text"
              placeholder="아이디 or 학번"
              value={id}
              onChange={(e) => setId(e.target.value)}
              style={{
                width: '90%',
                padding: '12px',
                margin: '10px 0',
                fontSize: '14px',
                backgroundColor: '#FFFFFF',
                color: '#000',
                border: '1px solid #ccc',
                borderRadius: '5px',
                outline: 'none',
              }}
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              style={{
                width: '90%',
                padding: '12px',
                margin: '10px 0',
                fontSize: '14px',
                backgroundColor: '#FFFFFF',
                color: '#000',
                border: '1px solid #ccc',
                borderRadius: '5px',
                outline: 'none',
              }}
            />
            <button
              onClick={handleLogin}
              style={{
                width: '96%',
                padding: '12px',
                backgroundColor: '#a8daff',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                color: 'black',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px',
                marginBottom: '10px'
              }}
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              style={{
                width: '96%',
                padding: '12px',
                backgroundColor: '#a8daff',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                color: 'black',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px',
              }}
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;





