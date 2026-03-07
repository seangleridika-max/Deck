import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProjectPage from './pages/ProjectPage';
import SkillCenterPage from './pages/SkillCenterPage';

function App() {
  const { token } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={token ? <DashboardPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/skills"
          element={token ? <SkillCenterPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/project/:id"
          element={token ? <ProjectPage /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
