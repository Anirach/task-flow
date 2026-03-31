import { Project, User, Task, Comment, Notification } from '../types';

export const mockProjects: Project[] = [
  {
    "id": "proj-001",
    "name": "Website Redesign",
    "color": "#1A73E8",
    "description": "Full redesign of the company marketing website.",
    "memberIds": ["user-001", "user-002", "user-003"],
    "columns": ["To Do", "In Progress", "In Review", "Done"],
    "createdAt": "2025-02-01T09:00:00Z",
    "taskCount": 24,
    "completedCount": 9
  },
  {
    "id": "proj-002",
    "name": "Mobile App Launch",
    "color": "#6A1B9A",
    "description": "iOS and Android launch for Q2 2025.",
    "memberIds": ["user-001", "user-004", "user-005"],
    "columns": ["To Do", "In Progress", "In Review", "Done"],
    "createdAt": "2025-01-15T08:00:00Z",
    "taskCount": 18,
    "completedCount": 14
  },
  {
    "id": "proj-003",
    "name": "Q2 Marketing Campaign",
    "color": "#E65100",
    "description": "Social and email campaign for product launch.",
    "memberIds": ["user-002", "user-003"],
    "columns": ["To Do", "In Progress", "In Review", "Done"],
    "createdAt": "2025-03-01T10:00:00Z",
    "taskCount": 11,
    "completedCount": 3
  }
];

export const mockUsers: User[] = [
  {
    "id": "user-001",
    "name": "Anirach M.",
    "email": "anirach@taskflow.io",
    "avatar": "https://i.pravatar.cc/40?img=12",
    "role": "Team Lead"
  },
  {
    "id": "user-002",
    "name": "Sarah K.",
    "email": "sarah@taskflow.io",
    "avatar": "https://i.pravatar.cc/40?img=5",
    "role": "Designer"
  },
  {
    "id": "user-003",
    "name": "James T.",
    "email": "james@taskflow.io",
    "avatar": "https://i.pravatar.cc/40?img=7",
    "role": "Developer"
  },
  {
    "id": "user-004",
    "name": "Prae N.",
    "email": "prae@taskflow.io",
    "avatar": "https://i.pravatar.cc/40?img=9",
    "role": "Developer"
  },
  {
    "id": "user-005",
    "name": "Leo C.",
    "email": "leo@taskflow.io",
    "avatar": "https://i.pravatar.cc/40?img=11",
    "role": "QA Engineer"
  }
];

export const mockTasks: Task[] = [
  {
    "id": "task-001",
    "projectId": "proj-001",
    "title": "Redesign landing page hero section",
    "description": "Create a new above-the-fold layout with CTA buttons and animation.",
    "status": "In Progress",
    "priority": "High",
    "assigneeId": "user-002",
    "reporterId": "user-001",
    "dueDate": "2025-04-15",
    "labels": ["design", "frontend"],
    "commentCount": 4,
    "attachmentCount": 2,
    "createdAt": "2025-03-10T10:00:00Z",
    "updatedAt": "2025-04-01T14:30:00Z"
  },
  {
    "id": "task-002",
    "projectId": "proj-001",
    "title": "Fix navigation menu on mobile",
    "description": "Hamburger menu does not open on iOS Safari.",
    "status": "To Do",
    "priority": "High",
    "assigneeId": "user-003",
    "reporterId": "user-001",
    "dueDate": "2025-04-10",
    "labels": ["bug", "mobile"],
    "commentCount": 1,
    "attachmentCount": 0,
    "createdAt": "2025-04-01T09:00:00Z",
    "updatedAt": "2025-04-01T09:00:00Z"
  },
  {
    "id": "task-003",
    "projectId": "proj-002",
    "title": "Write app store description copy",
    "description": "Craft 170-char short description and 4000-char long description for App Store.",
    "status": "Done",
    "priority": "Medium",
    "assigneeId": "user-002",
    "reporterId": "user-001",
    "dueDate": "2025-03-30",
    "labels": ["copywriting", "marketing"],
    "commentCount": 2,
    "attachmentCount": 1,
    "createdAt": "2025-03-15T11:00:00Z",
    "updatedAt": "2025-03-28T16:00:00Z"
  },
  {
    "id": "task-004",
    "projectId": "proj-002",
    "title": "Perform regression testing on checkout flow",
    "description": "Run full regression suite on all payment methods.",
    "status": "In Review",
    "priority": "High",
    "assigneeId": "user-005",
    "reporterId": "user-004",
    "dueDate": "2025-04-08",
    "labels": ["testing", "qa"],
    "commentCount": 6,
    "attachmentCount": 3,
    "createdAt": "2025-03-20T09:00:00Z",
    "updatedAt": "2025-04-02T10:00:00Z"
  },
  {
    "id": "task-005",
    "projectId": "proj-003",
    "title": "Schedule 5 social media posts for launch week",
    "description": "Plan LinkedIn, Instagram, and Twitter content calendar.",
    "status": "To Do",
    "priority": "Medium",
    "assigneeId": "user-003",
    "reporterId": "user-002",
    "dueDate": "2025-04-20",
    "labels": ["social", "content"],
    "commentCount": 0,
    "attachmentCount": 0,
    "createdAt": "2025-04-03T08:00:00Z",
    "updatedAt": "2025-04-03T08:00:00Z"
  }
];

export const mockComments: Comment[] = [
  {
    "id": "comment-001",
    "taskId": "task-001",
    "authorId": "user-001",
    "text": "Sarah, can you share the Figma prototype link when ready?",
    "createdAt": "2025-03-12T10:30:00Z"
  },
  {
    "id": "comment-002",
    "taskId": "task-001",
    "authorId": "user-002",
    "text": "Sure! Here's the link: figma.com/file/xyz. Still working on the mobile breakpoint.",
    "createdAt": "2025-03-12T11:45:00Z"
  },
  {
    "id": "comment-003",
    "taskId": "task-001",
    "authorId": "user-003",
    "text": "Mobile breakpoint looks good in my testing. The animation is smooth.",
    "createdAt": "2025-03-14T09:00:00Z"
  },
  {
    "id": "comment-004",
    "taskId": "task-001",
    "authorId": "user-004",
    "text": "I've added some feedback on the typography in the design doc.",
    "createdAt": "2025-03-15T14:20:00Z"
  }
];

export const mockNotifications: Notification[] = [
  {
    "id": "notif-001",
    "userId": "user-001",
    "type": "task_assigned",
    "message": "Sarah K. assigned you to 'Fix navigation menu on mobile'",
    "taskId": "task-002",
    "isRead": false,
    "createdAt": "2025-04-01T09:05:00Z"
  },
  {
    "id": "notif-002",
    "userId": "user-001",
    "type": "comment_added",
    "message": "James T. commented on 'Redesign landing page hero section'",
    "taskId": "task-001",
    "isRead": false,
    "createdAt": "2025-03-14T09:01:00Z"
  },
  {
    "id": "notif-003",
    "userId": "user-001",
    "type": "task_due_soon",
    "message": "'Fix navigation menu on mobile' is due in 2 days",
    "taskId": "task-002",
    "isRead": true,
    "createdAt": "2025-04-08T08:00:00Z"
  }
];
