import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ClubPage from './components member/ClubPage';
import clubMemberDataMap from './memberData';

const ClubMemberPage = () => {
  const { clubName } = useParams();
  const decoded = decodeURIComponent(clubName);
  const data = clubMemberDataMap[decoded];

  const [clubData, setClubData] = useState(null);
  const [isMember, setIsMember] = useState(false);

  // ✅ 1. 가입 여부 확인 (userId를 이용)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.userId) return;

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/clubs/${encodeURIComponent(clubName)}`, {
        params: {
          clubName: decoded,
          userId: user.userId,
          role: localStorage.getItem('userRole'),
        }
      })
      .then(res => {
        setIsMember(res.data.isMember);
      })
      .catch(err => {
        console.error('가입 여부 확인 실패:', err);
      });
  }, [decoded, clubName]);

  // ✅ 2. 동아리 정보 불러오기 (userId가 필요한 경우 포함)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.userId) return;

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/clubs/${encodeURIComponent(clubName)}/members/status`, {
        params: {
          userId: user.userId,
        }
      })
      .then(res => {
        setClubData(res.data);
      })
      .catch(err => {
        alert('동아리 정보를 불러오지 못했습니다.');
        console.error(err);
      });
  }, [clubName]);

  // ✅ 예외 처리
  if (!data) return <div>존재하지 않는 동아리입니다: {decoded}</div>;
  if (!clubData) return <div>로딩 중...</div>;

  // ✅ 최종 렌더링
  return <ClubPage {...data} isMember={isMember} />;
};

export default ClubMemberPage;



