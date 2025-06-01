// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
console.log("✅ 최신 App.jsx 렌더됨");

import LoginPage from './pages/loginpage';
import RegisterPage from './pages/registerpage';
import MainPage from './pages/mainpage';
import ClubMemberPage from './pages/memberpage';
import ClubAdminPage from './pages/adminpage';
import JoinRequestListPage from './pages/agreementpage';

import NoticeListPage from "./pages/components member/NoticeListPage";
import NoticeDetailPage from "./pages/components member/NoticeDetailPage";
import NoticeCreatePage from "./pages/components admin/NoticeCreatePage";

// ✅ 로그인 여부 확인 함수
const isLoggedIn = () => {
  return !!localStorage.getItem("token"); // 또는 세션스토리지, 쿠키 등 사용 중인 인증 방식
};

// ✅ 보호 라우트 컴포넌트
const ProtectedRoute = ({ element }) => {
  return isLoggedIn() ? element : <Navigate to="/" />;
};

function App() {
  return (
    <Routes>
      {/* 🔓 공개 라우트 */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 🔐 로그인 후 접근 가능한 라우트 */}
      <Route path="/main" element={<ProtectedRoute element={<MainPage />} />} />
      <Route path="/memberpage/:clubName" element={<ProtectedRoute element={<ClubMemberPage />} />} />
      <Route path="/adminpage/:clubName" element={<ProtectedRoute element={<ClubAdminPage />} />} />
      <Route path="/adminpage/:clubName/agreement" element={<ProtectedRoute element={<JoinRequestListPage />} />} />
      
      <Route path="/notice/:clubName" element={<ProtectedRoute element={<NoticeListPage />} />} />
      <Route path="/notice/:clubName/:noticeId" element={<ProtectedRoute element={<NoticeDetailPage />} />} />

      <Route path="/adminnotice/:clubName/:noticeId" element={<ProtectedRoute element={<NoticeDetailPage />} />} />
      <Route path="/adminnotice/:clubName/create" element={<ProtectedRoute element={<NoticeCreatePage />} />} />
    </Routes>
  );
}

export default App;

