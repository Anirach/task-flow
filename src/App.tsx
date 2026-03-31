import { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { useTaskStore } from './store/useTaskStore';

// Eager load: landing + login (first paint)
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';

// Lazy load: authenticated pages (loaded after login)
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const ProjectBoard = lazy(() => import('./pages/ProjectBoard').then(m => ({ default: m.ProjectBoard })));
const ProjectList = lazy(() => import('./pages/ProjectList').then(m => ({ default: m.ProjectList })));
const MyTasks = lazy(() => import('./pages/MyTasks').then(m => ({ default: m.MyTasks })));
const SearchPage = lazy(() => import('./pages/SearchPage').then(m => ({ default: m.SearchPage })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full min-h-[200px]">
      <div className="w-6 h-6 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

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
      <Suspense fallback={<PageLoader />}>
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
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
