import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Calendar, MessageSquare, Folder } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';
import { TaskDetailPanel } from '../components/features/TaskDetailPanel';
import { Badge } from '../components/ui/Badge';
import { Task } from '../types';
import { format } from 'date-fns';
import { cn } from '../utils/cn';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { tasks, projects } = useTaskStore();
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [localQuery, setLocalQuery] = useState(query);
  const [priorityFilter, setPriorityFilter] = useState<string>('All');

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const results = tasks.filter(t => {
    const matchesQuery = t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    return matchesQuery && matchesPriority;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: localQuery });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-primary-dark mb-6">Search Results</h1>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search for tasks, descriptions, or labels..."
              className="w-full bg-white border border-border rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
            />
          </div>
          <button type="submit" className="btn-primary px-8">Search</button>
        </form>
      </header>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary font-medium">
            Found <span className="text-primary font-bold">{results.length}</span> results for "{query}"
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-white border border-border rounded-lg py-1 px-2 text-xs outline-none focus:border-primary transition-all"
            >
              <option value="All">All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((task) => {
              const project = projects.find(p => p.id === task.projectId);
              return (
                <div 
                  key={task.id} 
                  onClick={() => setSelectedTask(task)}
                  className="card p-5 hover:border-primary transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project?.color }} />
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">{project?.name}</span>
                    </div>
                    <Badge variant={task.status.toLowerCase().replace(' ', '') as any}>{task.status}</Badge>
                  </div>
                  
                  <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">{task.title}</h3>
                  <p className="text-sm text-text-secondary line-clamp-2 mb-4">{task.description}</p>
                  
                  <div className="flex items-center gap-6 text-xs text-text-secondary font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      <span>{task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageSquare size={14} />
                      <span>{task.commentCount} comments</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Folder size={14} />
                      <span className="capitalize">{task.priority} Priority</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
              <Search size={40} />
            </div>
            <h2 className="text-xl font-bold text-primary-dark mb-2">No results found</h2>
            <p className="text-text-secondary max-w-xs">We couldn't find any tasks matching "{query}". Try checking your spelling or using different keywords.</p>
          </div>
        )}
      </div>

      <TaskDetailPanel 
        task={selectedTask} 
        isOpen={!!selectedTask} 
        onClose={() => setSelectedTask(null)} 
      />
    </div>
  );
};
