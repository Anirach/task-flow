import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, TrendingUp, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';
import { ProjectCard } from '../components/features/ProjectCard';
import { Button } from '../components/ui/Button';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { projects, tasks, currentUser } = useTaskStore();
  const { onNewProject } = useOutletContext<{ onNewProject: () => void }>();

  const stats = [
    { label: 'Total Tasks', value: tasks.length, icon: <TrendingUp size={20} />, color: 'text-primary', bg: 'bg-primary-light dark:bg-primary/20' },
    { label: 'Due Today', value: tasks.filter(t => t.dueDate === format(new Date(), 'yyyy-MM-dd')).length, icon: <Clock size={20} />, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { label: 'Overdue', value: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done').length, icon: <AlertCircle size={20} />, color: 'text-priority-high dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
    { label: 'Completed', value: tasks.filter(t => t.status === 'Done').length, icon: <CheckCircle2 size={20} />, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary-dark mb-2">Welcome back, {currentUser.name.split(' ')[0]}!</h1>
          <p className="text-text-secondary">Here's what's happening across your projects today.</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-text-primary">{format(new Date(), 'EEEE, MMMM do')}</p>
          <p className="text-xs text-text-secondary">Personal Workspace</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-primary-dark">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-primary-dark">Active Projects</h2>
          <Button variant="ghost" size="sm" className="text-primary">View All</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          <button 
            onClick={onNewProject}
            className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-text-secondary hover:border-primary hover:text-primary hover:bg-primary-light/30 dark:hover:bg-primary/10 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <Plus size={24} />
            </div>
            <span className="font-bold">Create New Project</span>
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <h2 className="text-xl font-bold text-primary-dark mb-6">Recent Activity</h2>
          <div className="card divide-y divide-border">
            {tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: projects.find(p => p.id === task.projectId)?.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-text-primary truncate">{task.title}</p>
                  <p className="text-xs text-text-secondary">Updated in {projects.find(p => p.id === task.projectId)?.name}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-bold text-text-secondary uppercase">{format(new Date(task.updatedAt), 'h:mm a')}</p>
                  <p className="text-[10px] text-text-secondary">{format(new Date(task.updatedAt), 'MMM d')}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary-dark mb-6">Team Members</h2>
          <div className="card p-4 space-y-4">
            {useTaskStore.getState().users.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <div className="relative">
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">{user.name}</p>
                  <p className="text-xs text-text-secondary">{user.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
