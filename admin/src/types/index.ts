export type UserRole = 'Admin' | 'Content Manager' | 'Viewer';
export type Status = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: Status;
  createdAt: string;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  technologies: string;
  status: Status;
  createdAt: string;
}

export interface Technology {
  id: string;
  name: string;
  description: string;
  status: Status;
}

export interface Module {
  id: string;
  technologyId: string;
  name: string;
  description: string;
  status: Status;
}

export interface Topic {
  id: string;
  moduleId: string;
  name: string;
  description: string;
  status: Status;
}

export interface Subtopic {
  id: string;
  topicId: string;
  name: string;
  description: string;
  status: Status;
}

export interface Lesson {
  id: string;
  subtopicId: string;
  title: string;
  content: string;
  duration: string;
  status: Status;
}

export interface Subscription {
  id: string;
  userName: string;
  plan: string;
  status: Status;
  startDate: string;
  endDate: string;
  amount: string;
}

export interface SEOEntry {
  id: string;
  page: string;
  title: string;
  description: string;
  keywords: string;
  status: Status;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  status: Status;
}

export interface Permission {
  id: string;
  name: string;
  module: string;
  description: string;
  status: Status;
}
