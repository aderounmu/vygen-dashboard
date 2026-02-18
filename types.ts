export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum ActionType {
  ALLOW = 'ALLOW',
  AUDIT = 'AUDIT',
  WARN = 'WARN',
  BLOCK = 'BLOCK'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  SECURITY = 'SECURITY',
  EXECUTIVE = 'EXECUTIVE',
  USER = 'USER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar: string;
  status: 'Active' | 'Inactive';
}

export interface AIEvent {
  id: string;
  timestamp: string; // ISO String
  user: User;
  tool: string; // e.g., 'ChatGPT', 'Gemini', 'Claude'
  model: string;
  promptSnippet: string;
  detectedDataTypes: string[]; // e.g., 'PII', 'Source Code', 'Financial'
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  actionTaken: ActionType;
  department: string;
  latencyMs: number;
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  conditionDataType: string;
  conditionTool: string;
  action: ActionType;
  enabled: boolean;
}

export interface DashboardMetrics {
  totalPrompts: number;
  sensitivePercentage: number;
  highRiskCount: number;
  preventedLeaks: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
}