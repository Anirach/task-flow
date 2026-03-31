export type Priority = 'High' | 'Medium' | 'Low';
export type Status = string;

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  description: string;
  memberIds: string[];
  columns: string[];
  createdAt: string;
  taskCount: number;
  completedCount: number;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assigneeId: string | null;
  reporterId: string;
  dueDate: string | null;
  labels: string[];
  commentCount: number;
  attachmentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'task_assigned' | 'comment_added' | 'task_due_soon';
  message: string;
  taskId: string;
  isRead: boolean;
  createdAt: string;
}
