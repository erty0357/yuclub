import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { getNoticeDetail } from "../../noticeApi";

const NoticeDetailPage = () => {
  const { clubName: rawClubName, noticeId } = useParams();
  const location = useLocation();
  const clubName = decodeURIComponent(rawClubName).trim();
  const [notice, setNotice] = useState(null);

  // 🔍 디버깅용 콘솔
  console.log("📍 current pathname:", window.location.pathname);
  console.log("📍 location.state:", location.state);

  // ✅ 돌아갈 경로 판단
  const isAdminPage =
    location.state?.fromAdmin === true ||
    window.location.pathname.includes("/adminnotice");

  const backUrl = isAdminPage
    ? `/adminpage/${encodeURIComponent(clubName)}`
    : `/memberpage/${encodeURIComponent(clubName)}`;

  useEffect(() => {
    getNoticeDetail(clubName, noticeId).then(setNotice);
  }, [clubName, noticeId]);

  if (!notice) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      {/* ← 돌아가기 링크 */}
      <Link to={backUrl}>
        <span style={{ color: '#3b82f6', textDecoration: 'underline', fontSize: '0.9rem' }}>
          ← 돌아가기
        </span>
      </Link>

      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginTop: '1rem',
        }}
      >
        {/* 제목 */}
        <h2 style={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          {notice.title}
        </h2>

        {/* 구분선 */}
        <hr style={{ marginBottom: '1.5rem', border: 'none', borderTop: '1px solid #e5e7eb' }} />

        {/* 본문 내용 */}
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6',
            fontFamily: 'inherit',
            fontSize: '1rem',
            color: '#374151',
          }}
        >
          {notice.content}
        </pre>
      </div>
    </div>
  );
};

export default NoticeDetailPage;
