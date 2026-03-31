import React, { useState } from 'react';
import { CheckCircle2, Calendar, Filter, Search, MessageSquare, Clock } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';
import { TaskDetailPanel } from '../components/features/TaskDetailPanel';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Task } from '../types';
import { format } from 'date-fns';
import { cn } from '../utils/cn';

import { useShallow } from 'zustand/react/shallow';

export const MyTasks: React.FC = () => {
  const { tasks, projects, currentUser } = useTaskStore(useShallow(state => ({
    tasks: state.tasks,
    projects: state.projects,
    currentUser: state.currentUser
  })));
  const myTasks = tasks.filter(t => t.assigneeId === currentUser.id);
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'All' | 'Today' | 'Overdue'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const filteredTasks = myTasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (filter === 'Today') {
      matchesFilter = t.dueDate === todayStr;
    } else if (filter === 'Overdue') {
      const project = projects.find(p => p.id === t.projectId);
      const doneStatus = project?.columns[project.columns.length - 1] || 'Done';
      matchesFilter = !!(t.dueDate && t.dueDate < todayStr && t.status !== doneStatus);
    }
    
    return matchesSearch && matchesFilter;
  });

  // Group by project
  const groupedTasks = filteredTasks.reduce((acc, task) => {
    const project = projects.find(p => p.id === task.projectId);
    const projectName = project?.name || 'Other';
    if (!acc[projectName]) acc[projectName] = [];
    acc[projectName].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary-dark dark:text-primary-light mb-2">My Tasks</h1>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-2">
            {(['All', 'Today', 'Overdue'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-xs font-bold transition-all',
                  filter === f 
                    ? 'bg-primary text-white shadow-md shadow-primary/20' 
                    : 'bg-surface text-text-secondary border border-border hover:bg-slate-50 dark:hover:bg-slate-800'
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
              <input
                type="text"
                placeholder="Search my tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface border border-border rounded-lg py-1.5 pl-9 pr-4 text-xs outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-text-primary"
              />
            </div>
            <div className="flex items-center gap-2 text-text-secondary text-sm font-medium shrink-0">
              <CheckCircle2 size={16} className="text-green-500" />
              <span className="dark:text-slate-400">
                {myTasks.filter(t => {
                  const project = projects.find(p => p.id === t.projectId);
                  const doneStatus = project?.columns[project.columns.length - 1] || 'Done';
                  return t.status === doneStatus;
                }).length} Completed
              </span>
            </div>
          </div>
        </div>
      </header>

      {Object.keys(groupedTasks).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedTasks).map(([projectName, projectTasks]) => (
            <div key={projectName}>
              <h2 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: projects.find(p => p.name === projectName)?.color }} />
                {projectName}
                <span className="ml-2 bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full lowercase font-medium">
                  {projectTasks.length} tasks
                </span>
              </h2>
              <div className="card divide-y divide-border overflow-hidden">
                {projectTasks.map((task) => (
                  <div 
                    key={task.id} 
                    onClick={() => setSelectedTask(task)}
                    className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">{task.title}</span>
                        <Badge variant={task.priority.toLowerCase() as any} className="text-[9px] px-1.5">{task.priority}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-text-secondary">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{task.status}</span>
                        </div>
                        {task.dueDate && (
                          <div className={cn("flex items-center gap-1", (() => {
                            const project = projects.find(p => p.id === task.projectId);
                            const doneStatus = project?.columns[project.columns.length - 1] || 'Done';
                            return task.dueDate < todayStr && task.status !== doneStatus;
                          })() ? "text-priority-high font-bold" : "")}>
                            <Calendar size={12} />
                            <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                          </div>
                        )}
                        {task.commentCount > 0 && (
                          <div className="flex items-center gap-1">
                            <MessageSquare size={12} />
                            <span>{task.commentCount}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0">
                      <button className="w-6 h-6 rounded-full border-2 border-border flex items-center justify-center text-transparent hover:border-green-500 hover:text-green-500 transition-all">
                        <CheckCircle2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-xl font-bold text-primary-dark dark:text-primary-light mb-2">You're all caught up!</h2>
          <p className="text-text-secondary dark:text-slate-400 max-w-xs">No tasks found for the current filter. Enjoy your productive day!</p>
        </div>
      )}

      <TaskDetailPanel 
        task={selectedTask} 
        isOpen={!!selectedTask} 
        onClose={() => setSelectedTask(null)} 
      />
    </div>
  );
};
