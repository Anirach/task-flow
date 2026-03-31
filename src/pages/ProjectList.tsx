import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutGrid, List, Filter, Plus, Search, MoreVertical, MessageSquare, Calendar } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';
import { TaskDetailPanel } from '../components/features/TaskDetailPanel';
import { NewTaskModal } from '../components/features/NewTaskModal';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Task, Status, Priority } from '../types';
import { format } from 'date-fns';
import { cn } from '../utils/cn';
import { Check, X } from 'lucide-react';

export const ProjectList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, tasks, users, updateTask } = useTaskStore();
  
  const project = projects.find(p => p.id === id);
  const projectTasks = tasks.filter(t => t.projectId === id);
  const projectMembers = users.filter(u => project?.memberIds.includes(u.id));

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'priority' | 'status' | 'dueDate'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Inline editing state
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<any>(null);

  if (!project) return null;

  const handleSort = (key: typeof sortBy) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const filteredTasks = projectTasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else if (sortBy === 'priority') {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
    } else if (sortBy === 'status') {
      const statusOrder = project.columns.reduce((acc, status, index) => {
        acc[status] = index;
        return acc;
      }, {} as Record<string, number>);
      comparison = (statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0);
    } else if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const startEditing = (taskId: string, field: string, value: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTaskId(taskId);
    setEditingField(field);
    setEditValue(value);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingField(null);
    setEditValue(null);
  };

  const saveEditing = (taskId: string) => {
    if (editingField) {
      updateTask(taskId, { [editingField]: editValue });
    }
    cancelEditing();
  };

  const handleKeyDown = (e: React.KeyboardEvent, taskId: string) => {
    if (e.key === 'Enter') {
      saveEditing(taskId);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="bg-surface border-b border-border px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: project.color }}
            >
              {project.name[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-dark">{project.name}</h1>
              <p className="text-xs text-text-secondary font-medium">{projectTasks.length} Tasks</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => navigate(`/projects/${id}/board`)}
                className="px-3 py-1.5 text-xs font-bold text-text-secondary hover:text-primary flex items-center gap-2 transition-colors"
              >
                <LayoutGrid size={14} />
                Board
              </button>
              <button 
                className="px-3 py-1.5 bg-white shadow-sm rounded-md text-xs font-bold text-primary flex items-center gap-2"
              >
                <List size={14} />
                List
              </button>
            </div>
            <Button size="sm" className="gap-2" onClick={() => setIsNewTaskModalOpen(true)}>
              <Plus size={16} />
              Add Task
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
            <input
              type="text"
              placeholder="Search in list..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-border rounded-lg py-1.5 pl-9 pr-4 text-xs outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
            />
          </div>
          <Button variant="ghost" size="sm" className="gap-2 text-xs border border-border bg-white">
            <Filter size={14} />
            Filter
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-8">
        <div className="card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-border">
                <th 
                  className="px-6 py-3 text-[10px] font-bold text-text-secondary uppercase tracking-wider cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('title')}
                >
                  Task Name {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-[10px] font-bold text-text-secondary uppercase tracking-wider">Assignee</th>
                <th 
                  className="px-6 py-3 text-[10px] font-bold text-text-secondary uppercase tracking-wider cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('priority')}
                >
                  Priority {sortBy === 'priority' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-[10px] font-bold text-text-secondary uppercase tracking-wider cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('status')}
                >
                  Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-[10px] font-bold text-text-secondary uppercase tracking-wider cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('dueDate')}
                >
                  Due Date {sortBy === 'dueDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-[10px] font-bold text-text-secondary uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedTasks.map((task) => {
                const assignee = users.find(u => u.id === task.assigneeId);
                const isEditing = editingTaskId === task.id;

                return (
                  <tr 
                    key={task.id} 
                    onClick={() => !editingTaskId && setSelectedTask(task)}
                    className={cn(
                      "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group",
                      isEditing && "bg-primary/5 hover:bg-primary/5"
                    )}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {isEditing && editingField === 'title' ? (
                          <div className="flex items-center gap-2 w-full" onClick={e => e.stopPropagation()}>
                            <input
                              autoFocus
                              type="text"
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              onKeyDown={e => handleKeyDown(e, task.id)}
                              className="flex-1 bg-surface dark:bg-slate-800 border border-primary rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <button onClick={() => saveEditing(task.id)} className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"><Check size={14} /></button>
                            <button onClick={cancelEditing} className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><X size={14} /></button>
                          </div>
                        ) : (
                          <div 
                            className="flex items-center gap-3 flex-1"
                            onClick={(e) => startEditing(task.id, 'title', task.title, e)}
                          >
                            <span className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">{task.title}</span>
                            {task.commentCount > 0 && (
                              <div className="flex items-center gap-1 text-[10px] text-text-secondary">
                                <MessageSquare size={12} />
                                <span>{task.commentCount}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isEditing && editingField === 'assigneeId' ? (
                        <select
                          autoFocus
                          value={editValue}
                          onChange={e => {
                            setEditValue(e.target.value);
                            updateTask(task.id, { assigneeId: e.target.value });
                            cancelEditing();
                          }}
                          onClick={e => e.stopPropagation()}
                          onBlur={cancelEditing}
                          className="bg-surface dark:bg-slate-800 border border-primary rounded px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="">Unassigned</option>
                          {users.map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                          ))}
                        </select>
                      ) : (
                        <div 
                          className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 p-1 rounded transition-colors"
                          onClick={(e) => startEditing(task.id, 'assigneeId', task.assigneeId, e)}
                        >
                          <Avatar src={assignee?.avatar} name={assignee?.name || 'Unassigned'} size="xs" />
                          <span className="text-xs font-medium text-text-secondary">{assignee?.name || 'Unassigned'}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing && editingField === 'priority' ? (
                        <select
                          autoFocus
                          value={editValue}
                          onChange={e => {
                            setEditValue(e.target.value);
                            updateTask(task.id, { priority: e.target.value as Priority });
                            cancelEditing();
                          }}
                          onClick={e => e.stopPropagation()}
                          onBlur={cancelEditing}
                          className="bg-surface dark:bg-slate-800 border border-primary rounded px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      ) : (
                        <div onClick={(e) => startEditing(task.id, 'priority', task.priority, e)}>
                          <Badge variant={task.priority.toLowerCase() as any}>{task.priority}</Badge>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing && editingField === 'status' ? (
                        <select
                          autoFocus
                          value={editValue}
                          onChange={e => {
                            setEditValue(e.target.value);
                            updateTask(task.id, { status: e.target.value as Status });
                            cancelEditing();
                          }}
                          onClick={e => e.stopPropagation()}
                          onBlur={cancelEditing}
                          className="bg-surface dark:bg-slate-800 border border-primary rounded px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          {project.columns.map(col => (
                            <option key={col} value={col}>{col}</option>
                          ))}
                        </select>
                      ) : (
                        <div onClick={(e) => startEditing(task.id, 'status', task.status, e)}>
                          <Badge variant={task.status.toLowerCase().replace(' ', '') as any}>{task.status}</Badge>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing && editingField === 'dueDate' ? (
                        <input
                          autoFocus
                          type="date"
                          value={editValue || ''}
                          onChange={e => {
                            setEditValue(e.target.value);
                            updateTask(task.id, { dueDate: e.target.value });
                            cancelEditing();
                          }}
                          onClick={e => e.stopPropagation()}
                          onBlur={cancelEditing}
                          className="bg-surface dark:bg-slate-800 border border-primary rounded px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      ) : (
                        <div 
                          className="flex items-center gap-2 text-xs text-text-secondary hover:bg-slate-100 dark:hover:bg-slate-800 p-1 rounded transition-colors"
                          onClick={(e) => startEditing(task.id, 'dueDate', task.dueDate, e)}
                        >
                          <Calendar size={14} />
                          <span>{task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : '-'}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 text-text-secondary hover:text-primary rounded-md">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-secondary text-sm italic">
                    No tasks found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TaskDetailPanel 
        task={selectedTask} 
        isOpen={!!selectedTask} 
        onClose={() => setSelectedTask(null)} 
      />

      <NewTaskModal 
        isOpen={isNewTaskModalOpen} 
        onClose={() => setIsNewTaskModalOpen(false)}
        initialProjectId={id}
      />
    </div>
  );
};
