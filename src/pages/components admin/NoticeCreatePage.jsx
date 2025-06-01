import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createNotice } from "../../noticeApi";

const NoticeCreatePage = () => {
  const { clubName: rawClubName } = useParams();
  const clubName = decodeURIComponent(rawClubName).trim();

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
    console.log("📦 전달되는 clubName:", clubName, "| 길이:", clubName.length);
    const notice = { clubName, title, content };
  console.log("📦 보낼 notice:", notice);  // 이거 추가

    try {
      const newNotice = await createNotice(notice);  // ✅ id 받기
      alert("공지사항이 등록되었습니다.");
      navigate(`/adminnotice/${encodeURIComponent(clubName)}/${newNotice.id}`,{
        state: { fromAdmin: true }
      });
    } catch (error) {
      console.error(error);
      alert("공지사항 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', backgroundColor: '#f9fafb', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: '1rem' }}>{clubName} 공지사항 등록</h2>
  
      <input
        type="text"
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: '100%', padding: '0.6rem', marginBottom: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
      />
  
      <textarea
        placeholder="내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc', resize: 'vertical' }}
      />
  
      <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
        <button
          onClick={handleSubmit}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '0.6rem 1.2rem',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          등록
        </button>
      </div>
    </div>
  );
};

export default NoticeCreatePage;


