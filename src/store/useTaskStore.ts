import { create } from 'zustand';
import { Project, Task, User, Comment, Notification, Status, Priority } from '../types';
import { mockProjects, mockTasks, mockUsers, mockComments, mockNotifications } from '../data/mockData';

interface TaskState {
  projects: Project[];
  tasks: Task[];
  users: User[];
  comments: Comment[];
  notifications: Notification[];
  currentUser: User;
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string) => void;
  logout: () => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'taskCount' | 'completedCount' | 'columns'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addColumn: (projectId: string, columnName: string) => void;
  reorderColumns: (projectId: string, newColumns: string[]) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'commentCount' | 'attachmentCount'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, newStatus: Status) => void;
  addComment: (taskId: string, text: string) => void;
  markNotificationAsRead: (id: string) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  projects: mockProjects,
  tasks: mockTasks,
  users: mockUsers,
  comments: mockComments,
  notifications: mockNotifications,
  currentUser: mockUsers[0], // Default to Anirach M.
  isAuthenticated: false,

  login: (email) => set((state) => {
    const user = state.users.find(u => u.email === email) || state.users[0];
    return { currentUser: user, isAuthenticated: true };
  }),

  logout: () => set({ isAuthenticated: false }),

  addProject: (project) => set((state) => {
    const newProject: Project = {
      ...project,
      id: `proj-${Math.random().toString(36).substr(2, 9)}`,
      columns: ['To Do', 'In Progress', 'In Review', 'Done'],
      createdAt: new Date().toISOString(),
      taskCount: 0,
      completedCount: 0,
    };
    return { projects: [...state.projects, newProject] };
  }),

  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
  })),

  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter((p) => p.id !== id),
    tasks: state.tasks.filter((t) => t.projectId !== id),
  })),

  addColumn: (projectId, columnName) => set((state) => ({
    projects: state.projects.map((p) => 
      p.id === projectId ? { ...p, columns: [...p.columns, columnName] } : p
    ),
  })),
  
  reorderColumns: (projectId, newColumns) => set((state) => ({
    projects: state.projects.map((p) => 
      p.id === projectId ? { ...p, columns: newColumns } : p
    ),
  })),

  addTask: (task) => set((state) => {
    const newTask: Task = {
      ...task,
      id: `task-${Math.random().toString(36).substr(2, 9)}`,
      commentCount: 0,
      attachmentCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Update project task count
    const updatedProjects = state.projects.map(p => 
      p.id === task.projectId ? { ...p, taskCount: p.taskCount + 1 } : p
    );

    return { 
      tasks: [...state.tasks, newTask],
      projects: updatedProjects
    };
  }),

  updateTask: (taskId, updates) => set((state) => ({
    tasks: state.tasks.map((t) => 
      t.id === taskId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
    ),
  })),

  deleteTask: (taskId) => set((state) => {
    const taskToDelete = state.tasks.find(t => t.id === taskId);
    if (!taskToDelete) return state;

    const updatedProjects = state.projects.map(p => 
      p.id === taskToDelete.projectId ? { ...p, taskCount: p.taskCount - 1 } : p
    );

    return {
      tasks: state.tasks.filter((t) => t.id !== taskId),
      projects: updatedProjects
    };
  }),

  moveTask: (taskId, newStatus) => set((state) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return state;

    const oldStatus = task.status;
    if (oldStatus === newStatus) return state;

    const updatedTasks = state.tasks.map((t) => 
      t.id === taskId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t
    );

    // Update completed count if moving to/from Done
    const updatedProjects = state.projects.map(p => {
      if (p.id === task.projectId) {
        let completedCount = p.completedCount;
        const doneStatus = p.columns[p.columns.length - 1]; // Assume last column is 'Done'
        if (newStatus === doneStatus) completedCount++;
        if (oldStatus === doneStatus) completedCount--;
        return { ...p, completedCount };
      }
      return p;
    });

    return { tasks: updatedTasks, projects: updatedProjects };
  }),

  addComment: (taskId, text) => set((state) => {
    const newComment: Comment = {
      id: `comment-${Math.random().toString(36).substr(2, 9)}`,
      taskId,
      authorId: state.currentUser.id,
      text,
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = state.tasks.map(t => 
      t.id === taskId ? { ...t, commentCount: t.commentCount + 1 } : t
    );

    return { 
      comments: [...state.comments, newComment],
      tasks: updatedTasks
    };
  }),

  markNotificationAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    )
  })),
}));
