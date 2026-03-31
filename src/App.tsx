import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ProjectBoard } from './pages/ProjectBoard';
import { ProjectList } from './pages/ProjectList';
import { MyTasks } from './pages/MyTasks';
import { SearchPage } from './pages/SearchPage';
import { useTaskStore } from './store/useTaskStore';

export default function App() {
  const isAuthenticated = useTaskStore((state) => state.isAuthenticated);
  const restoreSession = useTaskStore((state) => state.restoreSession);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    restoreSession().finally(() => setIsRestoring(false));
  }, []);

  if (isRestoring) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={!isAuthenticated ? <Landing /> : <Navigate to="/dashboard" replace />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />

        {/* Protected Routes */}
        <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-tasks" element={<MyTasks />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/projects/:id/board" element={<ProjectBoard />} />
          <Route path="/projects/:id/list" element={<ProjectList />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
