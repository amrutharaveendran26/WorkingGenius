export interface Owner {
  id: number;
  name: string;
  email: string;
}

export interface Board {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  teamId: number;
  statusId: number;
  priorityId: number;
  dueDate: string;
  isDeleted: boolean;
  createdAt: string;
  category: string;
  team: string;
  status: string;
  priority: string;
  owners: Owner[];
  boards: Board[];
}

export interface GetAllProjectsResponse {
  success: boolean;
  message: string;
  projects: Project[];
}

export interface MasterResponse<T> {
  success: boolean;
  type: string;
  count: number;
  data: T[];
}

export interface Team {
  id: number;
  name: string;
  description?: string;
}

export interface Employee {
  id: number;
  name: string;
  email?: string;
  role?: string;
}

export interface Board {
  id: number;
  name: string;
}

export interface ProjectStatus {
  id: number;
  name: string;
  description?: string;
}

export interface ProjectPriority {
  id: number;
  name: string;
  description?: string;
}

export interface ProjectCategory {
  id: number;
  name: string;
  description?: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  comments: number;
  attachments: number;
  priority: string;
  status: string;
  column: string;
  completed: boolean;
  progress?: number;
  progressEnabled: boolean;
  boards: string[];
  owners: string[];
  subtasks: {
    id: number;
    title: string;
    assignee: string;
    dueDate: string;
    completed: boolean;
  }[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}