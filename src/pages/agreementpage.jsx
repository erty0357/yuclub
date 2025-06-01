import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function JoinRequestListPage() {
  const { clubName } = useParams(); // ✅ URL에서 clubName 추출
  console.log("📤 [프론트] clubName from useParams:", clubName);
  const [joinRequests, setJoinRequests] = useState([]);

const handleApprove = async (request) => {
  try {
    await axios.post(`/api/join-requests/${request.clubName}/approve`, {
      clubName: request.clubName,
      name: request.name,
      grade: request.grade,
      
      major: request.major,
      phone: request.phone,
      userId: request.userId,
    });

    // ✅ 정확히 해당 객체만 제거 (동명이인 문제 방지)
      setJoinRequests(prev =>
        prev.filter(r => r !== request)
      );

    alert(`${request.name}님의 가입이 승인되었습니다.`);
  } catch (error) {
    console.error("가입 승인 실패:", error);
    alert("가입 승인 중 오류가 발생했습니다.");
  }
};

  // ✅ 최초 렌더링 시 데이터 요청
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/join-requests/${clubName}`);
        setJoinRequests(res.data);
      } catch (err) {
        console.error(err);
        alert('가입 신청서를 불러오지 못했습니다.');
      }
    };

    fetchData();
  }, [clubName]);

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        {clubName} 가입 신청서 목록
      </h2>

      <div
        style={{
          maxHeight: '500px',
          overflowY: 'auto',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '1rem',
          backgroundColor: '#f9f9f9'
        }}
      >
        {joinRequests.map((request, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: 'white',
              padding: '0.75rem',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '0.75rem'
            }}
          >
            <p style={{ margin: '0.25rem 0' }}><strong>이름:</strong> {request.name}</p>
            <p style={{ margin: '0.25rem 0' }}><strong>학년:</strong> {request.grade}</p>
            <p style={{ margin: '0.25rem 0' }}><strong>전공과:</strong> {request.major}</p>
            <p style={{ margin: '0.25rem 0' }}><strong>전화번호:</strong> {request.phone}</p>
            <p style={{ margin: '0.25rem 0' }}><strong>가입 동기:</strong> {request.motivation}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                onClick={() => handleApprove(request)}
                style={{
                  backgroundColor: '#4ade80',
                  color: 'white',
                  border: 'none',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                승인
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

