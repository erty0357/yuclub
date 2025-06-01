import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import NoticeListPage from "../components member/NoticeListPage";



export default function ClubPage({
  clubName,
  subtitle,
  bannerImg,
  activities,
  faq,
  fee,
  interview,
  officers,
  notices,
  theme = { titleColor: '#ffffff', subtitleColor: '#cccccc' },
  members = []
}) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const normalizedClubName = clubName.toLowerCase().replace(/\s+/g, '-');

    // ✅ 1. DB에서 이전 신청서 기반 알림 목록 로딩
    fetch(`/api/join-requests/${normalizedClubName}`)
    .then(res => res.json())
    .then(data => {
      const initial = data.map(req => req.name + "님이 가입 신청서를 보냈습니다!");
      setNotifications(initial);
    });
    
    const socket = new SockJS('/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        // ✅ clubName 정규화: 소문자 + 공백 하이픈 처리
      const normalizedClubName = clubName.toLowerCase().replace(/\s+/g, '-');
      console.log(`✅ WebSocket 연결됨: ${normalizedClubName}`);

      // ✅ 정규화된 구독 주소
      client.subscribe(`/topic/notifications/${normalizedClubName}`, (message) => {
        console.log("📥 수신된 원본 메시지:", message.body);
        try {
          const payload = JSON.parse(message.body);
          console.log("📥 파싱된 payload:", payload);
          console.log("📥 알림 수신:", payload);
          
          setNotifications(prev => {
            console.log("📈 기존 알림:", prev);
            if (prev.includes(payload.content)) {
              console.log("🚫 중복된 알림, 무시됨");
              return prev;
            }
            console.log("➕ 새 알림 추가:", payload.content);
            return [...prev, payload.content];
          });

          // 🔁 DB에서 알림 다시 fetch해서 최신 상태로 동기화
          fetch(`/api/join-requests/${normalizedClubName}`)
          .then(res => res.json())
          .then(data => {
            const updated = data.map(req => req.name + "님이 가입 신청서를 보냈습니다!");
            setNotifications(updated);
          });

        } catch (e) {
          console.error("❌ 메시지 파싱 실패:", e);
        }
        });
      }
    });

    client.activate();
    return () => client.deactivate();
  }, [clubName]);


  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* 상단 배너 */}
      <div style={{ position: 'relative' }}>
        <img src={bannerImg} alt="배너 이미지"
             style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '12px' }} />
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          borderRadius: '12px', color: 'white', zIndex: 1
        }}>
          <h1 style={{ fontSize: '4.5rem', color: theme.titleColor }}>{clubName}</h1>
          <p style={{ fontSize: '1.2rem', color: theme.subtitleColor }}>{subtitle}</p>
        </div>
      </div>

      {/* 본문 2열 구성 */}
      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
        {/* 왼쪽 박스 */}
        <div style={{ flex: 1, backgroundColor: '#f3f4f6', padding: '1.5rem', borderRadius: '12px', border: '1px solid #ccc' }}>
          <h2>📌 모집대상: <span style={{ fontWeight: 'normal' }}>영남대 재학생</span></h2>
          <h3 style={{ marginTop: '1rem' }}>📅 주요활동 및 행사</h3>
          <ul>
            {activities.map((item, idx) => <li key={idx}>- {item}</li>)}
          </ul>
          <h3 style={{ marginTop: '1rem' }}>❓ 질문</h3>
          {faq.map((item, idx) => (
            <div key={idx} style={{ marginBottom: '1rem' }}>
              <p style={{ fontWeight: 'bold' }}>- {item.q}</p>
              <p style={{ color: '#4b5563', whiteSpace: 'pre-line' }}>{item.a}</p>
            </div>
          ))}
          <h3>💰 회비</h3>
          <p>{fee}</p>
          <h3>📝 면접</h3>
          <p>{interview}</p>
        </div>

        {/* 오른쪽 박스 */}
        <div style={{ flex: 1, backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #ccc' }}>
          {/* 가입 승인 버튼 + 알림 */}
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginBottom: '1rem'}}>
            <button
              style={{
                backgroundColor: '#4ade80',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontWeight: 'bold',
                border: 'none',
              }}
              onClick={() => navigate(`/adminpage/${clubName}/agreement`)}
            >
              🖋 동아리 가입 승인
            </button>

            {notifications.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-10px',
                backgroundColor: 'red',
                color: 'white',
                borderRadius: '9999px',
                padding: '2px 6px',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>
                {notifications.length}
              </span>
            )}
          </div>

          {/* 회원 목록 */}
          <div style={{ marginTop: '1rem', border: '2px solid #333', borderRadius: '12px', padding: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
            <h3 style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>회원 목록</h3>
            {members.map((member, idx) => (
              <div key={idx} style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #ccc' }}>
                <p><strong>이름:</strong> {member.name}</p>
                <p><strong>학년:</strong> {member.grade}</p>
                <p><strong>전공과:</strong> {member.major}</p>
                <p><strong>전화번호:</strong> {member.phone}</p>
              </div>
            ))}
          </div>
<div style={{ backgroundColor: '#eef1ec', padding: '1rem', marginTop: '1rem', borderRadius: '8px' }}>
  <NoticeListPage /> {/* 🔄 기존 ul → 컴포넌트로 교체 */}
          </div>

          {/* 실시간 알림 */}
          <div style={{ backgroundColor: '#fffbe6', padding: '1rem', marginTop: '1rem', borderRadius: '8px', border: '1px dashed #facc15' }}>
            <h4>🔔 실시간 알림</h4>
            <ul>
              {notifications.map((msg, idx) => (
                <li key={idx}>📢 {msg}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
