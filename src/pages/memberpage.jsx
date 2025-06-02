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
  const [checked, setChecked] = useState(false); // 로딩 상태

  // ✅ 동아리 정보 불러오기
  useEffect(() => {
    const role = localStorage.getItem('userRole');

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/clubs/${encodeURIComponent(clubName)}/members/status`)
      .then(res => {
        setClubData(res.data);
      })
      .catch(err => {
        alert('동아리 정보를 불러오지 못했습니다.');
        console.error(err);
      });
  }, [clubName]);

  // ✅ 가입 여부 확인 API 호출
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = localStorage.getItem('userRole');
    if (!user || !user.userId) return;

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/clubs/${encodeURIComponent(clubName)}`, {
        params: {
          clubName: decoded,
          userId: user.userId,
          role: role
        }
      })
      .then(res => {
        setIsMember(res.data.isMember);
      })
      .catch(err => {
        console.error('가입 여부 확인 실패:', err);
      })
      .finally(() => {
        setChecked(true);
      });
  }, [decoded, clubName]);

  if (!clubData) return <div>로딩 중...</div>;

  if (!data) {
    return <div>존재하지 않는 동아리입니다: {decoded}</div>;
  }

  return <ClubPage {...data} isMember={isMember} />;
};

export default ClubMemberPage;


