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



  useEffect(() => {
  const role = localStorage.getItem('userRole');
  axios.get(`/api/clubs/${encodeURIComponent(clubName)}?role=${role}`)
    .then(res => {
      setClubData(res.data);
    })
    .catch(err => {
      alert('동아리 정보를 불러오지 못했습니다.');
    });

}, [clubName]); // ✅ 전체 useEffect 블록의 마지막 줄

// ✅ 가입 여부 확인 API 호출
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.userId) return;

    axios.get('/api/clubs/${encodeURIComponent(clubName)}/members/status', {
      params: {
        clubName: decoded,
        userId: user.userId
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
  }, [decoded]);

  if (!clubData) return <div>로딩 중...</div>;

  if (!data) {
    return <div>존재하지 않는 동아리입니다: {decoded}</div>;
  }

  return <ClubPage {...data} isMember={isMember}/>;
};

export default ClubMemberPage;

