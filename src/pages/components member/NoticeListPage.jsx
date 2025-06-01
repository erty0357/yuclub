// src/pages/components member/NoticeListPage.jsx

import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { getNotices, deleteNotice } from "../../noticeApi";

const NoticeListPage = () => {
  const { clubName: rawClubName } = useParams();
  const clubName = decodeURIComponent(rawClubName).trim();
  const location = useLocation();
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    console.log("📦 요청된 clubName:", clubName);
    getNotices(clubName).then((data) => {
      if (Array.isArray(data)) {
        console.log("📬 받은 공지 배열:", data); // 🔍 전체 응답 구조 확인용
        setNotices(data);
      } else {
        setNotices([]);
      }
    });
  }, [clubName]);

  const handleDelete = async (noticeId) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteNotice(noticeId);
      setNotices((prev) => prev.filter((n) => n.id !== noticeId));
      alert("삭제되었습니다.");
    } catch (err) {
      console.error(err);
      alert("삭제 중 오류 발생");
    }
  };

  const isAdmin = window.location.pathname.includes("/adminpage");

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4>📢 공지사항</h4>
        {isAdmin && (
          <Link to={`/adminnotice/${encodeURIComponent(clubName)}/create`}>
            <button
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '0.4rem 1rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              + 등록
            </button>
          </Link>
        )}
      </div>

      <div
        style={{
          backgroundColor: '#f3f6f2',
          padding: '1rem',
          borderRadius: '8px',
          maxHeight: '300px',
          overflowY: 'auto',
          marginTop: '0.5rem'
        }}
      >
        <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
          {Array.isArray(notices) && notices.length > 0 ? (
            notices.map((notice) => {
              console.log("📄 개별 공지:", notice); // ✅ 핵심 디버깅 포인트
              return (
                <li
                  key={notice.id}
                  style={{
                    marginBottom: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Link
                    to={{
                      pathname: isAdmin
                        ? `/adminnotice/${encodeURIComponent(clubName)}/${notice.id}`
                        : `/notice/${encodeURIComponent(clubName)}/${notice.id}`,
                      state: isAdmin ? { fromAdmin: true } : {},
                    }}
                    style={{ flex: 1, textDecoration: 'underline', color: '#2563eb' }}
                  >
                    {notice.title}
                  </Link>

                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(notice.id)}
                      style={{
                        marginLeft: '0.5rem',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.3rem 0.6rem',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      삭제
                    </button>
                  )}
                </li>
              );
            })
          ) : (
            <li>공지사항이 없습니다.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NoticeListPage;

