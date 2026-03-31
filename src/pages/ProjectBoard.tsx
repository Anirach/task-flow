import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutGrid, List, Filter, Plus, Users, Settings as SettingsIcon, Search } from 'lucide-react';
import { 
  DndContext, 
  DragEndEvent, 
  DragStartEvent,
  DragOverlay,
  useSensor, 
  useSensors, 
  PointerSensor, 
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  defaultDropAnimationSideEffects,
  closestCorners
} from '@dnd-kit/core';
import { 
  SortableContext, 
  sortableKeyboardCoordinates, 
  horizontalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable';
import { useTaskStore } from '../store/useTaskStore';
import { KanbanColumn } from '../components/features/KanbanColumn';
import { TaskCard } from '../components/features/TaskCard';
import { TaskDetailPanel } from '../components/features/TaskDetailPanel';
import { NewTaskModal } from '../components/features/NewTaskModal';
import { ProjectSettingsModal } from '../components/features/ProjectSettingsModal';
import { ManageMembersModal } from '../components/features/ManageMembersModal';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Status, Task } from '../types';
import { cn } from '../utils/cn';

export const ProjectBoard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, tasks, users, moveTask, addColumn, reorderColumns } = useTaskStore();
  
  const project = projects.find(p => p.id === id);
  const projectTasks = tasks.filter(t => t.projectId === id);
  const projectMembers = users.filter(u => project?.memberIds.includes(u.id));

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isProjectSettingsModalOpen, setIsProjectSettingsModalOpen] = useState(false);
  const [isManageMembersModalOpen, setIsManageMembersModalOpen] = useState(false);
  const [newTaskInitialStatus, setNewTaskInitialStatus] = useState<Status>('To Do');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    if (task) {
      setActiveTask(task);
    } else if (project?.columns.includes(active.id as string)) {
      setActiveColumnId(active.id as string);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    setActiveColumnId(null);

    if (!over) return;

    // Handle column reordering
    if (active.id !== over.id && project?.columns.includes(active.id as string)) {
      const oldIndex = project.columns.indexOf(active.id as string);
      const newIndex = project.columns.indexOf(over.id as string);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newColumns = arrayMove(project.columns, oldIndex, newIndex);
        reorderColumns(project.id, newColumns);
      }
      return;
    }

    // Handle task moving
    const taskId = active.id as string;
    const newStatus = over.id as Status;

    if (taskId && project?.columns.includes(newStatus)) {
      moveTask(taskId, newStatus);
    }
  };

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <h2 className="text-2xl font-bold text-primary-dark mb-2">Project not found</h2>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  const filteredTasks = projectTasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTask = (status: Status) => {
    setNewTaskInitialStatus(status);
    setIsNewTaskModalOpen(true);
  };

  const handleAddColumn = () => {
    if (newColumnName.trim() && project) {
      addColumn(project.id, newColumnName.trim());
      setNewColumnName('');
      setIsAddingColumn(false);
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
              <div className="flex items-center gap-2 text-xs text-text-secondary font-medium">
                <span>{projectTasks.length} Tasks</span>
                <span>•</span>
                <span>{projectMembers.length} Members</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 mr-2">
              {projectMembers.map(u => (
                <Avatar key={u.id} src={u.avatar} name={u.name} size="sm" />
              ))}
              <button 
                onClick={() => setIsManageMembersModalOpen(true)}
                className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary hover:bg-primary-light dark:hover:bg-primary/20 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="h-8 w-px bg-border mx-1" />
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button 
                className="px-3 py-1.5 bg-surface shadow-sm rounded-md text-xs font-bold text-primary flex items-center gap-2"
              >
                <LayoutGrid size={14} />
                Board
              </button>
              <button 
                onClick={() => navigate(`/projects/${id}/list`)}
                className="px-3 py-1.5 text-xs font-bold text-text-secondary hover:text-primary flex items-center gap-2 transition-colors"
              >
                <List size={14} />
                List
              </button>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2"
              onClick={() => setIsProjectSettingsModalOpen(true)}
            >
              <SettingsIcon size={18} />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
            <input
              type="text"
              placeholder="Filter tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-border rounded-lg py-1.5 pl-9 pr-4 text-xs outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
            />
          </div>
          <Button variant="ghost" size="sm" className="gap-2 text-xs border border-border bg-surface">
            <Filter size={14} />
            Filter
          </Button>
          <div className="flex-1" />
          <Button size="sm" className="gap-2" onClick={() => handleAddTask('To Do')}>
            <Plus size={16} />
            Add Task
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-x-auto overflow-y-hidden bg-slate-50/30 dark:bg-slate-900/30 p-8">
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 h-full min-w-max">
            <SortableContext items={project.columns} strategy={horizontalListSortingStrategy}>
              {project.columns.map((status) => (
                <KanbanColumn
                  key={status}
                  title={status}
                  status={status}
                  tasks={filteredTasks.filter(t => t.status === status)}
                  onAddTask={handleAddTask}
                  onTaskClick={setSelectedTask}
                />
              ))}
            </SortableContext>
            
            {isAddingColumn ? (
              <div className="w-72 shrink-0 bg-surface border border-border rounded-xl p-4 h-fit shadow-sm">
                <input
                  autoFocus
                  type="text"
                  placeholder="Column name..."
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddColumn();
                    if (e.key === 'Escape') setIsAddingColumn(false);
                  }}
                  className="w-full bg-white dark:bg-slate-800 border border-border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary mb-3"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddColumn} disabled={!newColumnName.trim()}>
                    Add
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsAddingColumn(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsAddingColumn(true)}
                className="w-72 shrink-0 h-12 border-2 border-dashed border-border rounded-xl flex items-center justify-center gap-2 text-text-secondary hover:border-primary hover:text-primary transition-all text-sm font-bold bg-surface/50"
              >
                <Plus size={18} />
                Add Column
              </button>
            )}
          </div>

          <DragOverlay dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: {
                  opacity: '0.4',
                },
              },
            }),
          }}>
            {activeTask ? (
              <div className="w-72 rotate-2 scale-105 shadow-2xl pointer-events-none">
                <TaskCard task={activeTask} onClick={() => {}} />
              </div>
            ) : activeColumnId ? (
              <div className="w-72 h-full rotate-1 scale-105 shadow-2xl pointer-events-none">
                <KanbanColumn
                  title={activeColumnId}
                  status={activeColumnId}
                  tasks={filteredTasks.filter(t => t.status === activeColumnId)}
                  onAddTask={() => {}}
                  onTaskClick={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <TaskDetailPanel 
        task={selectedTask} 
        isOpen={!!selectedTask} 
        onClose={() => setSelectedTask(null)} 
      />

      <NewTaskModal 
        isOpen={isNewTaskModalOpen} 
        onClose={() => setIsNewTaskModalOpen(false)}
        initialStatus={newTaskInitialStatus}
        initialProjectId={id}
      />

      <ProjectSettingsModal
        isOpen={isProjectSettingsModalOpen}
        onClose={() => setIsProjectSettingsModalOpen(false)}
        project={project}
      />

      <ManageMembersModal
        isOpen={isManageMembersModalOpen}
        onClose={() => setIsManageMembersModalOpen(false)}
        project={project}
      />
    </div>
  );
};
