import axios from "axios";

const API_URL = "http://localhost:8080/api/notices";

export async function createNotice(notice) {
  const res = await fetch("/api/notices", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(notice),
  });

  if (!res.ok) throw new Error("등록 실패");

  return res.json(); // 🔥 생성된 notice 객체를 반환 (id 포함)
}
  
  export const getNotices = (clubName) => {
    return axios.get(`${API_URL}/${clubName}`).then(res => res.data);
  };
  
  export const getNoticeDetail = (clubName, id) => {
    return axios.get(`${API_URL}/${clubName}/${id}`).then(res => res.data);
  };

export async function deleteNotice(noticeId) {
  const response = await fetch(`/api/notices/${noticeId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error("삭제 실패");
  }
}

  