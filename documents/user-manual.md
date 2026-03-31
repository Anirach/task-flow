# TaskFlow User Manual

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Logging In](#2-logging-in)
3. [Dashboard](#3-dashboard)
4. [Projects](#4-projects)
5. [Kanban Board](#5-kanban-board)
6. [List View](#6-list-view)
7. [My Tasks](#7-my-tasks)
8. [Search](#8-search)
9. [Task Details & Comments](#9-task-details--comments)
10. [Notifications](#10-notifications)
11. [Settings](#11-settings)
12. [Roles & Permissions](#12-roles--permissions)
13. [Security](#13-security)
14. [Keyboard Shortcuts & Tips](#14-keyboard-shortcuts--tips)

---

## 1. Getting Started

TaskFlow is a project management application that helps teams organize work using Kanban boards, task lists, and collaborative features.

### First-Time Setup

1. Open TaskFlow in your browser at `http://localhost:3000`
2. You will see the landing page with an overview of features
3. Click **Log in** or **Get Started** to proceed to the login page

### Navigation Overview

Once logged in, the app has three main areas:

- **Sidebar** (left) — Navigate between Dashboard, My Tasks, projects, and Settings
- **Top Navbar** — Search tasks, toggle dark mode, view notifications
- **Main Content** (center) — The current page content

The sidebar can be collapsed by clicking the **X** button at the top to give more screen space.

---

## 2. Logging In

### Login Form

1. Enter your **Email Address**
2. Enter your **Password**
3. Click **Sign in to TaskFlow**

If the credentials are incorrect, an error message will appear in red above the form. After 10 failed attempts within 15 minutes, you will be temporarily locked out to protect your account.

### Staying Logged In

Your session is saved automatically. If you close the browser and return later, you will be logged back in without needing to re-enter your credentials. To log out, hover over your profile at the bottom of the sidebar and click the **Logout** button.

### Test Accounts

| Email | Password | Name |
|-------|----------|------|
| anirach@taskflow.io | password123 | Anirach M. |
| sarah@taskflow.io | password123 | Sarah K. |
| james@taskflow.io | password123 | James T. |
| prae@taskflow.io | password123 | Prae N. |
| leo@taskflow.io | password123 | Leo C. |

---

## 3. Dashboard

The Dashboard is your home screen after logging in. It provides an overview of all your work.

### Stats Cards

Four summary cards appear at the top:

| Card | Description |
|------|-------------|
| **Total Tasks** | Number of tasks across all your projects |
| **Due Today** | Tasks with a due date matching today |
| **Overdue** | Tasks past their due date that are not completed |
| **Completed** | Tasks that have been moved to the Done column |

### Active Projects

Below the stats, all projects you belong to are displayed as cards. Each project card shows:

- Project name and color icon
- Task completion count (e.g., "1/5 Tasks")
- Progress bar with percentage
- Team member avatars
- Member count

Click any project card to open its Kanban board.

### Create New Project

Click the **Create New Project** card (dashed border with `+` icon) to create a new project. A modal will appear with:

- **Project Name** (required) — e.g., "Website Redesign"
- **Theme Color** — Choose from 8 preset colors
- **Description** — Optional description of the project

Click **Create Project** to save. You will automatically become the project Admin.

### Recent Activity

Shows the 5 most recently updated tasks with their project name and timestamp.

### Team Members

Lists all users in the system with their avatar, name, and role.

---

## 4. Projects

### Project Sidebar

All projects you belong to appear in the sidebar under the **Projects** section. Each shows a colored dot matching the project theme color. Click a project name to open its board.

### Creating a Project

You can create a project from:
- The **+ New Project** button in the sidebar
- The **Create New Project** card on the Dashboard

When you create a project, you become its **Admin** and four default columns are added: To Do, In Progress, In Review, Done.

### Project Settings (Admin only)

On the project board, click the **gear icon** in the top-right to open Project Settings. Here you can:

- Edit the **project name**
- Change the **theme color** (9 color options)
- Update the **description**
- **Delete the project** — Click "Delete Project", then confirm. This permanently removes the project and all its tasks.

### Managing Members (Admin only)

On the project board, click the **+** button next to the member avatars to open the Manage Members modal.

**Current Members section:**
- View all project members
- Change each member's **role** using the dropdown (Admin / Member / Viewer)
- Remove a member by clicking the **X** button
- The last Admin cannot be removed or demoted

**Add Members section:**
- Search for users by name or email
- Click **Add** to add them to the project (they join as Member by default)

---

## 5. Kanban Board

The Kanban Board is the primary way to manage tasks within a project. Access it by clicking a project in the sidebar.

### Board Layout

The board displays columns from left to right. Each column represents a task status (e.g., To Do, In Progress, In Review, Done). Tasks appear as cards within their respective columns.

### Task Cards

Each task card shows:
- Task title
- Priority indicator (colored left border: red = High, orange = Medium, green = Low)
- Labels as hashtags (e.g., #design, #frontend)
- Due date (if set)
- Comment count (if any)
- Assignee avatar

Click a task card to open the [Task Detail Panel](#9-task-details--comments).

### Adding a Task

Click the **Add Task** button in the top-right of the board header. A modal will appear with:

| Field | Required | Description |
|-------|----------|-------------|
| Task Title | Yes | Short description of the task |
| Project | Yes | Pre-selected to current project |
| Status | No | Which column the task starts in (defaults to first column) |
| Priority | No | Low, Medium (default), or High |
| Assignee | No | Select a team member or leave Unassigned |
| Due Date | No | Pick a deadline |
| Labels | No | Comma-separated tags (e.g., "design, frontend, bug") |
| Description | No | Detailed description of the task |

You can also click **Add a card** at the bottom of any column to create a task directly in that column.

### Moving Tasks (Drag and Drop)

Click and hold a task card, then drag it to another column to change its status. The card will show a visual effect during the drag (slight rotation and shadow).

### Reordering Columns (Admin only)

Grab a column by its left-side grip handle and drag it to reorder. This allows you to customize your workflow.

### Adding a Column (Admin only)

Click the **Add Column** button (dashed card on the right side of the board). Type the column name and press **Enter** to create it, or **Escape** to cancel.

### Search & Filter

Use the **Filter tasks...** search input at the top to filter task cards by title. Results update as you type (with a slight delay for performance).

### Switching to List View

Click the **List** toggle button next to "Board" in the header to switch to the table view.

---

## 6. List View

The List View shows the same project tasks in a table format. Access it by clicking the **List** toggle on the project board.

### Table Columns

| Column | Description | Sortable | Editable |
|--------|-------------|----------|----------|
| Task Name | Title of the task | Yes | Yes (click to edit) |
| Assignee | Who is working on it | No | Yes (dropdown) |
| Priority | High / Medium / Low | Yes | Yes (dropdown) |
| Status | Current column | Yes | Yes (dropdown) |
| Due Date | Task deadline | Yes | Yes (date picker) |

### Sorting

Click any sortable column header to sort by that column. Click again to toggle between ascending and descending order. An arrow icon indicates the current sort direction.

### Inline Editing

Click any editable cell to modify it directly:
- **Text fields** — Type the new value, press **Enter** to save or **Escape** to cancel
- **Dropdowns** — Select from the options, the change saves automatically
- **Date picker** — Select a date, the change saves automatically

### Search

Use the search input to filter tasks by title, same as on the board view.

---

## 7. My Tasks

The **My Tasks** page shows all tasks assigned to you, grouped by project. Access it from the sidebar.

### Filters

Three filter tabs at the top:

| Filter | Shows |
|--------|-------|
| **All** | Every task assigned to you |
| **Today** | Tasks due today |
| **Overdue** | Tasks past their due date that are not completed |

### Task List

Tasks are grouped under their project name. Each task row shows:
- Task title (click to open details)
- Priority badge (High / Medium / Low)
- Current status
- Due date (highlighted in red if overdue)
- Comment count

### Search

Use the search input to filter your tasks by title.

### Empty State

If no tasks match the current filter, you'll see: "You're all caught up!"

---

## 8. Search

The **Search** page allows you to search across all tasks in all your projects. Access it by typing in the search bar in the top navbar and pressing Enter.

### How to Search

1. Type your search query in the navbar search bar
2. Press **Enter** — you'll be taken to the Search page
3. Results show tasks where the **title** or **description** matches your query

### Filtering Results

Use the **Priority** dropdown to further filter results by High, Medium, or Low priority.

### Search Results

Each result card shows:
- Project name with color indicator
- Status badge
- Task title and description preview
- Due date, comment count, and priority level

Click a result to open the Task Detail Panel.

---

## 9. Task Details & Comments

Click any task (on the board, list, my tasks, or search results) to open the Task Detail Panel on the right side of the screen.

### Task Information

The panel shows:
- **Project name** and **status badge**
- **Assignee** with avatar
- **Priority** badge
- **Due date** (or "No deadline")
- **Reporter** (who created the task)
- **Description** (or "No description provided")
- **Created date**

### Comments

Below the description, the comments section shows:
- Total comment count
- All comments with author avatar, name, timestamp, and text
- A comment input form (for non-Viewer members)

**To add a comment:**
1. Type your comment in the text area (max 1000 characters)
2. Click **Post Comment**
3. The comment appears immediately

### Deleting a Task

At the bottom of the panel, click **Delete Task** (if you have permission). A confirmation overlay will ask "Delete this task?" — click **Delete** to confirm or **Cancel** to go back.

**Who can delete:**
- **Admin** — Can delete any task in the project
- **Member** — Can only delete tasks they created (reporter)
- **Viewer** — Cannot delete tasks

---

## 10. Notifications

Click the **bell icon** in the top navbar to open the notification panel. A red badge shows the count of unread notifications.

### Notification Types

| Type | Icon | When |
|------|------|------|
| Task Assigned | User icon (blue) | Someone assigns a task to you |
| Comment Added | Chat icon (purple) | Someone comments on a task you're assigned to |
| Task Due Soon | Alert icon (red) | A task assigned to you is approaching its deadline |

### Managing Notifications

- **Unread notifications** have a highlighted background
- Click **Mark as read** on any notification to dismiss it
- Notifications are sorted newest first

---

## 11. Settings

Access Settings from the sidebar (gear icon at the bottom). The Settings page has three sections.

### Profile

- **Name** — Edit your display name
- **Email** — Shown but cannot be changed (read-only)

Click **Save Profile** to save changes. A confirmation message appears briefly.

### Change Password

1. Enter your **Current Password**
2. Enter your **New Password** (minimum 8 characters)
3. Enter it again in **Confirm New Password**
4. Click **Update Password**

Validation checks:
- New password must be at least 8 characters
- New password and confirmation must match
- Current password must be correct

### Appearance

Toggle between **Light** and **Dark** mode by clicking the respective button. The theme applies immediately across the entire app.

You can also toggle the theme using the **moon/sun icon** in the top navbar.

---

## 12. Roles & Permissions

TaskFlow uses project-scoped roles. Each member of a project has one of three roles:

### Admin

Full control over the project:
- Edit project name, color, and description
- Delete the project
- Add and remove project members
- Change member roles
- Add and reorder Kanban columns
- Create, edit, move, and delete any task
- Add comments

### Member

Can work on tasks but cannot modify the project:
- Create new tasks
- Edit tasks (title, description, priority, assignee, due date, labels)
- Move tasks between columns (drag and drop)
- Delete tasks they created
- Add comments
- Cannot edit project settings, manage members, or add columns

### Viewer

Read-only access:
- View the project board and task list
- View task details and comments
- Cannot create, edit, move, or delete tasks
- Cannot add comments
- Cannot modify anything

### How Roles Are Assigned

- When you **create a project**, you automatically become **Admin**
- When an Admin **adds a new member**, they join as **Member** by default
- An Admin can **change any member's role** in the Manage Members modal
- The **last Admin** of a project cannot be demoted or removed

---

## 13. Security

TaskFlow includes several security measures to protect your data:

### Account Protection
- **Rate limiting** — Login is limited to 10 attempts per 15 minutes. After exceeding this, you will be temporarily locked out. Registration is limited to 5 accounts per hour.
- **Password requirements** — Passwords must be at least 8 characters long (max 128).
- **Session expiry** — Your login session expires after 24 hours. You will need to log in again.

### Data Protection
- **Role-based access** — You can only see projects you are a member of. Actions are restricted based on your role (Admin/Member/Viewer).
- **Input validation** — All input fields have length limits to prevent abuse (e.g., task titles max 500 chars, descriptions max 5000 chars, comments max 5000 chars).
- **CORS protection** — The API only accepts requests from authorized origins.
- **Security headers** — The server sets industry-standard security headers (HSTS, X-Frame-Options, X-Content-Type-Options) to protect against common web attacks.

### Best Practices
- Use a strong, unique password for your account
- Log out when using shared computers
- Report any suspicious activity to your project Admin

---

## 14. Keyboard Shortcuts & Tips

### General

| Action | How |
|--------|-----|
| Search tasks | Type in the navbar search bar, press **Enter** |
| Toggle sidebar | Click the **X** / **menu** icon at the top of the sidebar |
| Toggle dark mode | Click the **moon/sun** icon in the navbar |

### Kanban Board

| Action | How |
|--------|-----|
| Move a task | Click and drag a task card to another column |
| Reorder columns | Drag a column by its left grip handle (Admin only) |
| Add a column | Click **Add Column**, type name, press **Enter** (Admin only) |
| Cancel adding column | Press **Escape** |
| Filter tasks | Type in the "Filter tasks..." input |

### List View Inline Editing

| Action | How |
|--------|-----|
| Start editing | Click the cell value |
| Save text edit | Press **Enter** |
| Cancel edit | Press **Escape** |
| Save dropdown/date | Change is saved automatically on selection |

### Tips

- **Create tasks faster** — Click "Add a card" at the bottom of any Kanban column to create a task directly in that status
- **Bulk organize** — Use the List View for quickly editing multiple tasks with inline editing
- **Track your work** — The My Tasks page shows only tasks assigned to you, with handy filters for today and overdue items
- **Stay informed** — Keep an eye on the notification bell for task assignments and comments
- **Customize your board** — Admins can add custom columns beyond the default four to match your team's workflow
