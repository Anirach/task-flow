import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { NewProjectModal } from '../features/NewProjectModal';
import { NotificationPanel } from '../features/NotificationPanel';
import { useThemeStore } from '../../store/useThemeStore';

export const Layout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const { theme } = useThemeStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        onNewProject={() => setIsNewProjectModalOpen(true)}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onOpenNotifications={() => setIsNotificationPanelOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ onNewProject: () => setIsNewProjectModalOpen(true) }} />
        </main>
      </div>

      <NewProjectModal 
        isOpen={isNewProjectModalOpen} 
        onClose={() => setIsNewProjectModalOpen(false)} 
      />
      
      <NotificationPanel 
        isOpen={isNotificationPanelOpen} 
        onClose={() => setIsNotificationPanelOpen(false)} 
      />
    </div>
  );
};
