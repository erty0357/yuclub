import axios from "axios";

// 환경변수에서 API 주소를 불러오되, fallback도 지정함 (로컬용)
const API_URL = import.meta.env.VITE_API_BASE_URL + "/api/notices";

// 공지 생성
export async function createNotice(notice) {
  const res = await fetch(`${API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(notice),
  });

  if (!res.ok) throw new Error("등록 실패");

  return res.json(); // 등록된 공지 객체 반환
}

// 공지 리스트 조회 (배열 보장)
export const getNotices = async (clubName) => {
  try {
    const res = await axios.get(`${API_URL}/${clubName}`);
    return Array.isArray(res.data) ? res.data : []; // 💡 빈 배열 fallback
  } catch (error) {
    console.error("공지 조회 실패:", error);
    return []; // 💥 에러 시에도 빈 배열 반환
  }
};

// 공지 상세 조회
export const getNoticeDetail = async (clubName, id) => {
  try {
    const res = await axios.get(`${API_URL}/${clubName}/${id}`);
    return res.data;
  } catch (error) {
    console.error("공지 상세 조회 실패:", error);
    return null;
  }
};

// 공지 삭제
export async function deleteNotice(noticeId) {
  const res = await fetch(`${API_URL}/${noticeId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("삭제 실패");
}

  
