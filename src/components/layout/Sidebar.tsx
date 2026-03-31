import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Settings, Plus, ChevronRight, Menu, X } from 'lucide-react';
import { useTaskStore } from '../../store/useTaskStore';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  onNewProject: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed, onNewProject }) => {
  const { projects, currentUser } = useTaskStore();

  return (
    <aside
      className={cn(
        'bg-surface border-r border-border h-full flex flex-col transition-all duration-300 z-30',
        isCollapsed ? 'w-16' : 'w-60'
      )}
    >
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Workspace</span>}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-primary-light dark:hover:bg-primary/20"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>

      <div className="px-3 mb-6">
        <Button
          onClick={onNewProject}
          className={cn('w-full flex items-center gap-2', isCollapsed && 'p-2 justify-center')}
        >
          <Plus size={20} />
          {!isCollapsed && <span>New Project</span>}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
              isActive ? 'bg-primary-light dark:bg-primary/20 text-primary font-semibold' : 'text-text-secondary hover:bg-slate-50 dark:hover:bg-slate-800',
              isCollapsed && 'justify-center'
            )
          }
        >
          <LayoutDashboard size={20} />
          {!isCollapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink
          to="/my-tasks"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
              isActive ? 'bg-primary-light dark:bg-primary/20 text-primary font-semibold' : 'text-text-secondary hover:bg-slate-50 dark:hover:bg-slate-800',
              isCollapsed && 'justify-center'
            )
          }
        >
          <CheckSquare size={20} />
          {!isCollapsed && <span>My Tasks</span>}
        </NavLink>

        <div className="pt-4 pb-2">
          {!isCollapsed && <span className="px-3 text-[10px] font-bold text-text-secondary uppercase tracking-wider">Projects</span>}
        </div>

        {projects.map((project) => (
          <NavLink
            key={project.id}
            to={`/projects/${project.id}/board`}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-md transition-colors group',
                isActive ? 'bg-primary-light dark:bg-primary/20 text-primary font-semibold' : 'text-text-secondary hover:bg-slate-50 dark:hover:bg-slate-800',
                isCollapsed && 'justify-center'
              )
            }
          >
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: project.color }}
            />
            {!isCollapsed && (
              <>
                <span className="flex-1 truncate">{project.name}</span>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <div className={cn('flex items-center gap-3 p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer', isCollapsed && 'justify-center')}>
          <Settings size={20} className="text-text-secondary" />
          {!isCollapsed && <span className="text-text-secondary text-sm">Settings</span>}
        </div>
        <div className={cn('flex items-center gap-3 p-2 mt-1 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer', isCollapsed && 'justify-center')}>
          <img src={currentUser.avatar} alt={currentUser.name} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{currentUser.name}</p>
              <p className="text-[10px] text-text-secondary truncate">{currentUser.role}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
