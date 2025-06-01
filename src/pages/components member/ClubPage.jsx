import React, { useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
// 추가
import NoticeListPage from "../components member/NoticeListPage";
import { useEffect } from 'react'; // ✅ 맨 위 import 구역에 추가




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
  isMember // ✅ 추가
}) {
  const [showModal, setShowModal] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [isMemberState, setIsMemberState] = useState(isMember);

  useEffect(() => {
  const checkMembership = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user")); // user = { username: "user" }
      console.log("✅ 확인용 user =", user);
      console.log("✅ user.userId =", user?.userId);

      if (!user?.userId) {
        console.error("❌ userId가 존재하지 않아 요청 중단");
        return;
      }

      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/clubs/${encodeURIComponent(clubName)}/members/status`, {
        params: { userId: user.userId } // ✅ localStorage 기준으로 userId 전달
      });
      setIsMemberState(res.data.isMember);
    } catch (err) {
      console.error('가입 여부 확인 실패:', err);
    }
  };

  checkMembership();
}, [clubName]);
  const JoinModal = ({ clubName, onClose }) => {
    const [form, setForm] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return {
      userId: user?.userId || '',
      clubName: clubName,
      name: '',
      grade: '',
      major: '',
      phone: '',
      motivation: ''
    };
  });

    const maxLength = 50;

    const handleChange = (e) => {
      const { name, value } = e.target;

      if (name === 'phone' && !/^[0-9]*$/.test(value)) return;
      if (name === 'grade') {
        if (value === '' || /^[1-4]$/.test(value)) {
          setForm(prev => ({ ...prev, [name]: value }));
        }
        return;
      }

      setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const { name, grade, major, phone, motivation } = form;

      if (
        !name.trim() ||
        !grade.trim() ||
        !major.trim() ||
        !phone.trim() ||
        !motivation.trim()
      ) {
        alert('모든 항목을 입력해주세요.');
        return;
      }

      try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/join-requests`, form); // 🚀 백엔드로 POST 요청
        alert('가입 신청이 완료되었습니다!');
        setForm({clubName: form.clubName, name: '', grade: '', major: '', phone: '', motivation: '' });
        onClose();
      } catch (err) {
        console.error(err);
        alert('오류가 발생했습니다. 다시 시도해주세요.');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
        <div className="bg-white rounded-2xl w-[500px] max-h-[90vh] overflow-y-auto shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6">✍️ 동아리 가입 신청서</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="font-semibold block mb-1">이름</label>
                <input name="name" type="text" placeholder="이름" value={form.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
              </div>
              <div className="flex-1">
                <label className="font-semibold block mb-1">학년</label>
                <input name="grade" type="text" placeholder="1~4" value={form.grade} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="font-semibold block mb-1">전공과</label>
                <input name="major" type="text" placeholder="전공과" value={form.major} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
              </div>
              <div className="flex-1">
                <label className="font-semibold block mb-1">전화번호</label>
                <input name="phone" type="text" placeholder="숫자만 입력" value={form.phone} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div>
              <label className="font-semibold block mb-1">가입 동기</label>
              <textarea name="motivation" placeholder="간단히 적어주세요" maxLength={maxLength} value={form.motivation} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg resize-none min-h-[100px]" />
              <div className="text-right text-sm text-gray-400">{form.motivation.length} / {maxLength}자</div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300">닫기</button>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600">제출</button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  const handleLeaveClub = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/clubs/clubmembers`, {
        params: {
          clubName: clubName,
          userId: user.userId
        }
      });
      alert("탈퇴가 완료되었습니다.");
      setIsMemberState(false);
    } catch (error) {
      console.error("탈퇴 중 오류 발생:", error);
      alert("탈퇴 중 오류가 발생했습니다.");
    } finally {
      setShowLeaveConfirm(false);
    }
  };
  

  const LeaveConfirmModal = ({ onClose, onConfirm }) => (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', width: '360px', textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>정말로 탈퇴하시겠습니까?</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button onClick={onConfirm} style={{ backgroundColor: '#ef4444', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none' }}>예</button>
          <button onClick={onClose} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #ccc' }}>아니오</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* 상단 배너 */}
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '10px', left: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', zIndex: 2 }}>
          <img src="/logo.png" alt="왼쪽 아이콘" style={{ width: '40px', height: '40px' }} />
          <span style={{ fontWeight: 'semi-bold' }}>영남대학교<br />Yeungnam University</span>
        </div>
        <div style={{ position: 'absolute', top: '10px', right: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', zIndex: 2 }}>
          <img src="/danbi.png" alt="오른쪽 아이콘" style={{ width: '40px', height: '40px' }} />
          <span style={{ fontWeight: 'bold' }}>총동아리협회<br />Yeungnam University</span>
        </div>
        <img src={bannerImg} alt="배너 이미지" style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '12px' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', borderRadius: '12px', zIndex: 1 }}>
          <h1 style={{ fontSize: '4.5rem', color: theme.titleColor, marginBottom: '0rem' }}>{clubName}</h1>
          <p style={{ fontSize: '1.2rem', color: theme.subtitleColor }}>{subtitle}</p>
        </div>
      </div>
      <div className="flex mt-8 gap-8">
        <div className="flex-1 bg-gray-100 p-6 rounded-xl border border-gray-300 text-gray-800">
          
          <h2 className="text-base font-semibold mb-4">
            📌 모집대상: <span className="font-normal">영남대 재학생</span>
          </h2>

          <h3 className="text-base font-bold mt-6 mb-2">📅 주요활동 및 행사</h3>
          <ul className="list-disc list-inside space-y-1">
            {activities.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>

          <h4 className="text-base font-bold mt-6 mb-2">❓ 질문</h4>
          <ul className="space-y-4">
            {faq.map((item, idx) => (
              <li key={idx}>
                <p className="font-semibold">- {item.q}</p>
                <p className="text-[#4b5563] whitespace-pre-line">{item.a}</p>
              </li>
            ))}
          </ul>

          <h4 className="text-base font-bold mt-6 mb-2">💰 회비</h4>
          <p className="text-[#4b5563]">{fee}</p>

          <h4 className="text-base font-bold mt-6 mb-2">📝 면접</h4>
          <p className="text-[#4b5563]">{interview}</p>
        </div>
        <div style={{ flex: 1, backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #ccc' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
<div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
  {!isMemberState ? (
    <button
      style={{ backgroundColor: '#4ade80', borderRadius: '8px', padding: '0.5rem 1rem', fontWeight: 'bold', border: 'none', flex: 1 }}
      onClick={() => setShowModal(true)}
    >
      🖋 동아리 가입
    </button>
  ) : (
    <button
      style={{ backgroundColor: '#f87171', borderRadius: '8px', padding: '0.5rem 1rem', fontWeight: 'bold', border: 'none', color: 'white', flex: 1 }}
      onClick={() => setShowLeaveConfirm(true)}
    >
      ❌ 탈퇴하기
    </button>
  )}
  </div>

      {showModal && (
        <JoinModal
          clubName={clubName}
          onClose={() => setShowModal(false)}
        />
      )}

      {showLeaveConfirm && (
        <LeaveConfirmModal
          onClose={() => setShowLeaveConfirm(false)}
          onConfirm={handleLeaveClub}
        />
      )}



          </div>
          <div style={{ border: '2px solid #333', borderRadius: '12px', padding: '1rem', backgroundColor: '#fff' }}>
            <h3 style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>간부 명단</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
              {officers.map((person, idx) => (
                <div key={idx} style={{ flex: '0 0 45%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#eee', marginBottom: '0.5rem' }}>
                    <img src={person.img} alt={`${person.role} 이미지`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <p style={{ margin: '0.2rem 0' }}>{person.role} {person.name}</p>
                  <p style={{ fontSize: '0.8rem', color: 'gray', margin: 0 }}>{person.phone}</p>
                </div>
              ))}
            </div>
          </div>
<div style={{ backgroundColor: '#eef1ec', padding: '1rem', marginTop: '1rem', borderRadius: '8px' }}>
  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
    <Link to={`/adminnotice/${encodeURIComponent(clubName)}/create`}>
    </Link>
  </div>
  <NoticeListPage /> {/* 🔄 기존 ul → 컴포넌트로 교체 */}
  </div>
  
        </div>
      </div>
      
    </div>
  );
}
