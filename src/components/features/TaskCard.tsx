import React from 'react';
import { Calendar, MessageSquare, Paperclip } from 'lucide-react';
import { format } from 'date-fns';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Task, User } from '../../types';
import { useTaskStore } from '../../store/useTaskStore';
import { Avatar } from '../ui/Avatar';
import { cn } from '../../utils/cn';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const users = useTaskStore(state => state.users);
  const assignee = users.find((u) => u.id === task.assigneeId);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    opacity: isDragging ? 0.3 : 1,
  };

  const priorityColors = {
    High: 'border-l-priority-high',
    Medium: 'border-l-priority-medium',
    Low: 'border-l-priority-low',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'card p-4 cursor-pointer border-l-4 mb-3 select-none active:cursor-grabbing transition-shadow',
        isDragging && 'shadow-xl ring-2 ring-primary/20 bg-slate-50',
        priorityColors[task.priority]
      )}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-sm font-semibold text-text-primary line-clamp-2 leading-snug">
            {task.title}
          </h3>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {task.labels.map((label) => (
            <span key={label} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-medium">
              #{label}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-3 text-text-secondary">
            {task.dueDate && (
              <div className="flex items-center gap-1 text-[11px]">
                <Calendar size={12} />
                <span>{format(new Date(task.dueDate), 'MMM d')}</span>
              </div>
            )}
            {task.commentCount > 0 && (
              <div className="flex items-center gap-1 text-[11px]">
                <MessageSquare size={12} />
                <span>{task.commentCount}</span>
              </div>
            )}
            {task.attachmentCount > 0 && (
              <div className="flex items-center gap-1 text-[11px]">
                <Paperclip size={12} />
                <span>{task.attachmentCount}</span>
              </div>
            )}
          </div>

          <div className="flex -space-x-2">
            {assignee ? (
              <Avatar src={assignee.avatar} name={assignee.name} size="xs" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-[8px] text-slate-400">
                ?
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
