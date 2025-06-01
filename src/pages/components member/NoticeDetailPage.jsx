import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { getNoticeDetail } from "../../noticeApi";

const NoticeDetailPage = () => {
  const { clubName: rawClubName, noticeId } = useParams();
  const location = useLocation();
  const clubName = decodeURIComponent(rawClubName).trim();
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);

  const isAdminPage =
    location.state?.fromAdmin === true ||
    window.location.pathname.includes("/adminnotice");

  const backUrl = isAdminPage
    ? `/adminpage/${encodeURIComponent(clubName)}`
    : `/memberpage/${encodeURIComponent(clubName)}`;

  useEffect(() => {
    getNoticeDetail(clubName, noticeId)
      .then((data) => {
        if (!data || !data.title || !data.content) {
          throw new Error("공지사항 데이터가 올바르지 않습니다.");
        }
        setNotice(data);
      })
      .catch((err) => {
        console.error(err);
        setError("공지사항을 불러오지 못했습니다.");
      });
  }, [clubName, noticeId]);

  if (error) return <div style={{ padding: "2rem", color: "red" }}>{error}</div>;
  if (!notice) return <div style={{ padding: "2rem" }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
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
        <h2 style={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          {notice.title || "제목 없음"}
        </h2>

        <hr style={{ marginBottom: '1.5rem', border: 'none', borderTop: '1px solid #e5e7eb' }} />

        <pre
          style={{
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6',
            fontFamily: 'inherit',
            fontSize: '1rem',
            color: '#374151',
          }}
        >
          {notice.content || "내용 없음"}
        </pre>
      </div>
    </div>
  );
};

export default NoticeDetailPage;

