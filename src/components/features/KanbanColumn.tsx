import React from 'react';
import { Plus, MoreHorizontal, GripVertical } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, Status } from '../../types';
import { TaskCard } from './TaskCard';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

interface KanbanColumnProps {
  title: string;
  status: Status;
  tasks: Task[];
  onAddTask: (status: Status) => void;
  onTaskClick: (task: Task) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, status, tasks, onAddTask, onTaskClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: status });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: status,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div 
      ref={(node) => {
        setSortableRef(node);
        setDroppableRef(node);
      }}
      style={style}
      className={cn(
        "flex flex-col w-72 shrink-0 h-full bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-border/50 transition-colors",
        isOver && "bg-primary-light/30 border-primary/30",
        isDragging && "opacity-50 border-primary"
      )}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-text-secondary">
            <GripVertical size={14} />
          </div>
          <h3 className="font-bold text-sm text-text-primary">{title}</h3>
          <span className="bg-slate-200 dark:bg-slate-700 text-text-secondary text-[10px] font-bold px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <Button variant="ghost" size="sm" className="p-1 h-auto">
          <MoreHorizontal size={16} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
        ))}
        
        <button
          onClick={() => onAddTask(status)}
          className="w-full py-2 px-3 flex items-center gap-2 text-text-secondary hover:text-primary hover:bg-primary-light rounded-lg transition-all text-sm font-medium border border-dashed border-transparent hover:border-primary/30"
        >
          <Plus size={16} />
          <span>Add a card</span>
        </button>
      </div>
    </div>
  );
};
