import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/loginpage';
import MainPage from './pages/mainpage';
import ClubMemberPage from './pages/memberpage';
import ClubAdminPage from './pages/adminpage';
import JoinRequestListPage from './pages/agreementpage';
import NoticeListPage from "./pages/components member/NoticeListPage";
import NoticeDetailPage from "./pages/components member/NoticeDetailPage";
import NoticeCreatePage from "./pages/components admin/NoticeCreatePage";
import RegisterPage from './pages/registerpage';


function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/memberpage/:clubName" element={<ClubMemberPage />} />
      <Route path="/adminpage/:clubName" element={<ClubAdminPage />} />
      <Route path="/adminpage/:clubName/agreement" element={<JoinRequestListPage />} />
      <Route path="/register" element={<RegisterPage />} /> 
      <Route path="/notice/:clubName" element={<NoticeListPage />} />
      <Route path="/notice/:clubName/:noticeId" element={<NoticeDetailPage />} />

      <Route path="/adminnotice/:clubName/:noticeId" element={<NoticeDetailPage />} />
      <Route path="/adminnotice/:clubName/create" element={<NoticeCreatePage />} />
    </Routes>
  );
}

export default App;
