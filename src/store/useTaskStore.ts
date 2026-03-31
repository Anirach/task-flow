import { create } from 'zustand';
import { Project, Task, User, Comment, Notification, Status, Priority } from '../types';
import * as api from '../lib/api';

interface TaskState {
  projects: Project[];
  tasks: Task[];
  users: User[];
  comments: Comment[];
  notifications: Notification[];
  currentUser: User;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  restoreSession: () => Promise<boolean>;
  fetchAll: () => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'taskCount' | 'completedCount' | 'columns'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addColumn: (projectId: string, columnName: string) => Promise<void>;
  reorderColumns: (projectId: string, newColumns: string[]) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'commentCount' | 'attachmentCount'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  moveTask: (taskId: string, newStatus: Status) => Promise<void>;
  fetchComments: (taskId: string) => Promise<void>;
  addComment: (taskId: string, text: string) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
}

const emptyUser: User = { id: '', name: '', email: '', avatar: '', role: '' };

export const useTaskStore = create<TaskState>((set, get) => ({
  projects: [],
  tasks: [],
  users: [],
  comments: [],
  notifications: [],
  currentUser: emptyUser,
  isAuthenticated: false,
  isLoading: false,

  login: async (email, password) => {
    const { token, user } = await api.auth.login(email, password);
    api.setToken(token);
    set({ currentUser: user, isAuthenticated: true });
    await get().fetchAll();
  },

  logout: () => {
    api.setToken(null);
    set({
      isAuthenticated: false,
      currentUser: emptyUser,
      projects: [],
      tasks: [],
      users: [],
      comments: [],
      notifications: [],
    });
  },

  restoreSession: async () => {
    const token = api.getToken();
    if (!token) return false;
    try {
      const user = await api.auth.me();
      set({ currentUser: user, isAuthenticated: true });
      await get().fetchAll();
      return true;
    } catch {
      api.setToken(null);
      return false;
    }
  },

  fetchAll: async () => {
    set({ isLoading: true });
    try {
      const [projectList, taskList, userList, notifList] = await Promise.all([
        api.projects.list(),
        api.tasks.list(),
        api.users.list(),
        api.notifications.list(),
      ]);
      set({
        projects: projectList,
        tasks: taskList,
        users: userList,
        notifications: notifList,
        isLoading: false,
      });
    } catch (err) {
      console.error('Failed to fetch data:', err);
      set({ isLoading: false });
    }
  },

  addProject: async (project) => {
    const created = await api.projects.create({
      name: project.name,
      color: project.color,
      description: project.description,
      memberIds: project.memberIds,
    });
    set((state) => ({ projects: [...state.projects, created] }));
  },

  updateProject: async (id, updates) => {
    const updated = await api.projects.update(id, updates);
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? updated : p)),
    }));
  },

  deleteProject: async (id) => {
    await api.projects.delete(id);
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      tasks: state.tasks.filter((t) => t.projectId !== id),
    }));
  },

  addColumn: async (projectId, columnName) => {
    const updated = await api.projects.addColumn(projectId, columnName);
    set((state) => ({
      projects: state.projects.map((p) => (p.id === projectId ? updated : p)),
    }));
  },

  reorderColumns: async (projectId, newColumns) => {
    // Optimistic update for smooth drag
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, columns: newColumns } : p
      ),
    }));
    try {
      await api.projects.reorderColumns(projectId, newColumns);
    } catch (err) {
      // Revert on error by refetching
      const project = await api.projects.get(projectId);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === projectId ? project : p)),
      }));
    }
  },

  addTask: async (task) => {
    const created = await api.tasks.create({
      projectId: task.projectId,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assigneeId: task.assigneeId,
      dueDate: task.dueDate,
      labels: task.labels,
    });
    set((state) => {
      // Update project taskCount
      const projects = state.projects.map((p) =>
        p.id === task.projectId ? { ...p, taskCount: p.taskCount + 1 } : p
      );
      return { tasks: [...state.tasks, created], projects };
    });
  },

  updateTask: async (taskId, updates) => {
    const updated = await api.tasks.update(taskId, updates);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? updated : t)),
    }));
  },

  deleteTask: async (taskId) => {
    const task = get().tasks.find((t) => t.id === taskId);
    await api.tasks.delete(taskId);
    set((state) => {
      const projects = task
        ? state.projects.map((p) =>
            p.id === task.projectId ? { ...p, taskCount: p.taskCount - 1 } : p
          )
        : state.projects;
      return {
        tasks: state.tasks.filter((t) => t.id !== taskId),
        projects,
      };
    });
  },

  moveTask: async (taskId, newStatus) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    // Optimistic update for smooth drag
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t
      ),
    }));

    try {
      await api.tasks.move(taskId, newStatus);
      // Refresh project counts
      if (task) {
        const project = await api.projects.get(task.projectId);
        set((state) => ({
          projects: state.projects.map((p) => (p.id === task.projectId ? project : p)),
        }));
      }
    } catch (err) {
      // Revert on error
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, status: task.status } : t
        ),
      }));
    }
  },

  fetchComments: async (taskId) => {
    const taskComments = await api.comments.list(taskId);
    set((state) => {
      // Replace comments for this task, keep others
      const otherComments = state.comments.filter((c) => c.taskId !== taskId);
      return { comments: [...otherComments, ...taskComments] };
    });
  },

  addComment: async (taskId, text) => {
    const created = await api.comments.create(taskId, text);
    set((state) => ({
      comments: [...state.comments, created],
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, commentCount: t.commentCount + 1 } : t
      ),
    }));
  },

  markNotificationAsRead: async (id) => {
    await api.notifications.markRead(id);
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    }));
  },
}));
