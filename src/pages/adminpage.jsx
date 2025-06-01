import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ClubPage from './components admin/ClubPage';
import clubAdminDataMap from './adminData';
import NoticeListPage from './components member/NoticeListPage';

const ClubAdminPage = () => {
  const { clubName } = useParams();
  const [clubData, setClubData] = useState(null);
  const decoded = decodeURIComponent(clubName).trim();
  const data = clubAdminDataMap[decoded];
  const [members, setMembers] = useState([]);

  // ✅ 1. 동아리 데이터 가져오기
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    axios.get(`/api/clubs/${encodeURIComponent(clubName)}?role=${role}`)
      .then(res => setClubData(res.data))
      .catch(err => {
        alert('동아리 정보를 불러오지 못했습니다.');
      });
  }, [clubName]);

  // ✅ 2. 회원 목록 가져오기
  useEffect(() => {
    axios.get(`/api/clubs/${decoded}/members`)
       .then(res => {
      console.log("✅ 관리자 회원 목록 응답:", res.data);
      setMembers(res.data);
    })
    .catch(err => {
      console.error("회원 목록 조회 실패", err);
    });
  }, [decoded]);

  // ✅ 조건부 렌더링은 useEffect 바깥에
  if (!clubData) return <div>로딩 중...</div>;

  if (!data) {
    return <div>존재하지 않는 동아리입니다: {decoded}</div>;
  }

  return <ClubPage {...data} members={members} />;
};

export default ClubAdminPage;
