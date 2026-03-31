import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, User, Tag, MessageSquare, Send, Clock, Trash2 } from 'lucide-react';
import { Task, Status, Priority } from '../../types';
import { useTaskStore } from '../../store/useTaskStore';
import { SlidePanel } from '../ui/SlidePanel';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

interface TaskDetailPanelProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  projectRole?: string;
}

import { useShallow } from 'zustand/react/shallow';

export const TaskDetailPanel: React.FC<TaskDetailPanelProps> = ({ task, isOpen, onClose, projectRole }) => {
  const { users, comments, addComment, deleteTask, updateTask, fetchComments, projects, currentUser } = useTaskStore(useShallow(state => ({
    users: state.users,
    comments: state.comments,
    addComment: state.addComment,
    deleteTask: state.deleteTask,
    updateTask: state.updateTask,
    fetchComments: state.fetchComments,
    projects: state.projects,
    currentUser: state.currentUser
  })));
  const [commentText, setCommentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (task && isOpen) {
      fetchComments(task.id);
    }
  }, [task?.id, isOpen]);

  if (!task) return null;

  const assignee = users.find((u) => u.id === task.assigneeId);
  const reporter = users.find((u) => u.id === task.reporterId);
  const project = projects.find((p) => p.id === task.projectId);
  const taskComments = comments.filter((c) => c.taskId === task.id);

  const role = projectRole || project?.userRole;
  const isViewer = role === 'Viewer';
  const canDelete = role === 'Admin' || (role === 'Member' && task.reporterId === currentUser.id);

  const handleAddComment = () => {
    if (commentText.trim()) {
      addComment(task.id, commentText);
      setCommentText('');
    }
  };

  const handleDelete = () => {
    deleteTask(task.id);
    onClose();
  };

  return (
    <SlidePanel isOpen={isOpen} onClose={onClose} title={task.title} width="max-w-2xl">
      <div className="flex flex-col h-full bg-surface">
        <div className="p-6 border-b border-border bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 mb-4 text-xs text-text-secondary font-medium">
            <span>{project?.name}</span>
            <span>/</span>
            <Badge variant={task.status.toLowerCase().replace(' ', '') as any}>{task.status}</Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">Assignee</label>
                <div className="flex items-center gap-2">
                  <Avatar src={assignee?.avatar} name={assignee?.name || 'Unassigned'} size="sm" />
                  <span className="text-sm font-medium">{assignee?.name || 'Unassigned'}</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">Priority</label>
                <Badge variant={task.priority.toLowerCase() as any}>{task.priority}</Badge>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">Due Date</label>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calendar size={16} className="text-text-secondary" />
                  <span>{task.dueDate ? format(new Date(task.dueDate), 'MMMM d, yyyy') : 'No deadline'}</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">Reporter</label>
                <div className="flex items-center gap-2">
                  <Avatar src={reporter?.avatar} name={reporter?.name || 'Unknown'} size="sm" />
                  <span className="text-sm font-medium">{reporter?.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <section>
            <h3 className="text-sm font-bold text-primary-dark dark:text-primary-light mb-3 flex items-center gap-2">
              <Clock size={16} />
              Description
            </h3>
            <div className="text-sm text-text-primary leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-border">
              {task.description || <span className="text-text-secondary italic">No description provided.</span>}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-primary-dark dark:text-primary-light mb-4 flex items-center gap-2">
              <MessageSquare size={16} />
              Comments ({taskComments.length})
            </h3>
            
            <div className="space-y-4 mb-6">
              {taskComments.map((comment) => {
                const author = users.find((u) => u.id === comment.authorId);
                return (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar src={author?.avatar} name={author?.name || 'User'} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold">{author?.name}</span>
                        <span className="text-[10px] text-text-secondary">
                          {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <div className="text-sm text-text-primary bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg rounded-tl-none border border-border/50">
                        {comment.text}
                      </div>
                    </div>
                  </div>
                );
              })}
              {taskComments.length === 0 && (
                <p className="text-sm text-text-secondary text-center py-4 italic">No comments yet. Start the conversation!</p>
              )}
            </div>

            {!isViewer && (
              <div className="flex gap-3 items-start">
                <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
                <div className="flex-1 space-y-2">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full bg-white dark:bg-slate-800 border border-border rounded-lg p-3 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none h-24 text-text-primary"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-text-secondary">{commentText.length}/1000 characters</span>
                    <Button
                      size="sm"
                      onClick={handleAddComment}
                      disabled={!commentText.trim()}
                      className="gap-2"
                    >
                      <Send size={14} />
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="mt-auto p-6 border-t border-border bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center relative">
          <div className="text-[10px] text-text-secondary">
            Created on {format(new Date(task.createdAt), 'MMM d, yyyy')}
          </div>
          {canDelete && (
            <Button variant="ghost" size="sm" onClick={() => setIsDeleting(true)} className="text-priority-high hover:bg-red-50 dark:hover:bg-red-900/20 gap-2">
              <Trash2 size={16} />
              Delete Task
            </Button>
          )}

          {isDeleting && (
            <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm flex items-center justify-between px-6 z-10">
              <span className="text-sm font-bold text-primary-dark dark:text-primary-light">Delete this task?</span>
              <div className="flex gap-2">
                <Button size="xs" variant="ghost" onClick={() => setIsDeleting(false)}>Cancel</Button>
                <Button size="xs" className="bg-priority-high hover:bg-red-700" onClick={handleDelete}>Delete</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </SlidePanel>
  );
};
