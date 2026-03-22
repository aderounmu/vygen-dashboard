import { BusinessPermission } from "./services/business/types";

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

export enum Permission {
  VIEW_DASHBOARD = 'VIEW_DASHBOARD',
  VIEW_ACTIVITY = 'VIEW_ACTIVITY',
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_POLICIES = 'MANAGE_POLICIES',
  VIEW_REPORTS = 'VIEW_REPORTS',
  MANAGE_SETTINGS = 'MANAGE_SETTINGS'
}

export interface Department {
  id: string;
  name: string;
  description: string;
  permissions: BusinessPermission[];
}

export interface Organization {
  id: string;
  name: string;
  email: string;
  reference: string;
  domain?: string;
  logo?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  country: string;
  department: string; // The name of the department (acts as role)
  avatar: string;
  status: 'Active' | 'Inactive';
  organizationId?: string;
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