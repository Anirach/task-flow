import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Bell, Moon, Sun } from 'lucide-react';
import { useTaskStore } from '../../store/useTaskStore';
import { useThemeStore } from '../../store/useThemeStore';
import { Avatar } from '../ui/Avatar';
import { cn } from '../../utils/cn';

interface NavbarProps {
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNotifications }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { notifications, currentUser } = useTaskStore();
  const { theme, toggleTheme } = useThemeStore();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="h-14 bg-surface border-b border-border flex items-center justify-between px-4 sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:bg-primary-dark transition-colors">
            T
          </div>
          <span className="text-xl font-bold text-primary-dark hidden sm:block">TaskFlow</span>
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-8 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search tasks, projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-full py-2 pl-10 pr-4 text-sm transition-all outline-none"
          />
        </div>
      </form>

      <div className="flex items-center gap-3">
        <button 
          onClick={toggleTheme}
          className="p-2 text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <button 
          onClick={onOpenNotifications}
          className="p-2 text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative transition-colors"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-priority-high text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-surface">
              {unreadCount}
            </span>
          )}
        </button>
        
        <div className="h-8 w-px bg-border mx-1" />
        
        <div className="flex items-center gap-2 pl-1 cursor-pointer hover:bg-slate-50 p-1 rounded-lg transition-colors">
          <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold leading-tight">{currentUser.name}</p>
            <p className="text-[10px] text-text-secondary leading-tight">Personal Workspace</p>
          </div>
        </div>
      </div>
    </header>
  );
};
