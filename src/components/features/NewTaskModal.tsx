import React, { useState } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Priority, Status } from '../../types';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStatus?: Status;
  initialProjectId?: string;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({ 
  isOpen, 
  onClose, 
  initialStatus = 'To Do',
  initialProjectId = ''
}) => {
  const { projects, users, addTask, currentUser } = useTaskStore();
  
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState(initialProjectId || (projects[0]?.id || ''));
  const [status, setStatus] = useState<Status>(initialStatus);
  const [priority, setPriority] = useState<Priority>('Medium');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [labels, setLabels] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;

    addTask({
      title,
      projectId,
      status,
      priority,
      assigneeId: assigneeId || null,
      reporterId: currentUser.id,
      dueDate: dueDate || null,
      description,
      labels: labels.split(',').map(l => l.trim()).filter(l => l !== ''),
    });

    // Reset and close
    setTitle('');
    setDescription('');
    setLabels('');
    onClose();
  };

  const selectedProject = projects.find(p => p.id === projectId);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Create New Task"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!title.trim() || !projectId}>Create Task</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Task Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full bg-white dark:bg-slate-800 border border-border rounded-lg p-2.5 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Project *</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-border rounded-lg p-2.5 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className="w-full bg-white dark:bg-slate-800 border border-border rounded-lg p-2.5 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            >
              {selectedProject?.columns.map(col => (
                <option key={col} value={col}>{col}</option>
              )) || (
                <>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="In Review">In Review</option>
                  <option value="Done">Done</option>
                </>
              )}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full bg-white dark:bg-slate-800 border border-border rounded-lg p-2.5 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Assignee</label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-border rounded-lg p-2.5 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            >
              <option value="">Unassigned</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 border border-border rounded-lg p-2.5 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Labels (comma separated)</label>
          <input
            type="text"
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
            placeholder="e.g. design, frontend, bug"
            className="w-full bg-white dark:bg-slate-800 border border-border rounded-lg p-2.5 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details..."
            className="w-full bg-white dark:bg-slate-800 border border-border rounded-lg p-2.5 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all h-24 resize-none"
          />
        </div>
      </form>
    </Modal>
  );
};
