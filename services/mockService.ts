import { AIEvent, RiskLevel, ActionType, User, Policy, Department, Permission } from '../types';

// Constants for generation
export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'd1',
    name: 'Engineering',
    description: 'Software development and technical operations',
    permissions: [Permission.VIEW_DASHBOARD, Permission.VIEW_ACTIVITY]
  },
  {
    id: 'd2',
    name: 'Security',
    description: 'Security oversight and policy management',
    permissions: [Permission.VIEW_DASHBOARD, Permission.VIEW_ACTIVITY, Permission.MANAGE_POLICIES, Permission.MANAGE_USERS, Permission.MANAGE_SETTINGS]
  },
  {
    id: 'd3',
    name: 'Executive',
    description: 'High-level oversight and reporting',
    permissions: [Permission.VIEW_DASHBOARD, Permission.VIEW_ACTIVITY, Permission.VIEW_REPORTS]
  },
  {
    id: 'd4',
    name: 'HR',
    description: 'Human resources and personnel management',
    permissions: [Permission.VIEW_DASHBOARD]
  },
  {
    id: 'd5',
    name: 'Finance',
    description: 'Financial planning and analysis',
    permissions: [Permission.VIEW_DASHBOARD, Permission.VIEW_REPORTS]
  }
];

const TOOLS = ['ChatGPT', 'Gemini Ultra', 'Claude 3', 'GitHub Copilot', 'Perplexity'];
const DATA_TYPES = ['None', 'PII', 'Source Code', 'Credentials', 'Financial Data', 'Health Data', 'Internal Strategy'];

// Helpers
const getRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Realistic Name Lists
const FIRST_NAMES = ['James', 'Sarah', 'Michael', 'Emma', 'David', 'Olivia', 'Robert', 'Sophia', 'William', 'Isabella', 'Joseph', 'Mia', 'Thomas', 'Charlotte', 'Charles', 'Amelia', 'Christopher', 'Evelyn', 'Daniel', 'Abigail'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

// Generate Users
export const MOCK_USERS: User[] = Array.from({ length: 20 }).map((_, i) => {
  const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
  const lastName = LAST_NAMES[i % LAST_NAMES.length];
  const name = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@vyken.security`;
  
  return {
    id: `u-${i}`,
    firstName,
    lastName,
    name,
    email,
    country: 'USA',
    department: getRandom(INITIAL_DEPARTMENTS).name,
    avatar: `https://picsum.photos/seed/u${i}/32/32`,
    status: Math.random() > 0.1 ? 'Active' : 'Inactive'
  };
});

export const CURRENT_USER: User = {
  id: 'u-admin',
  firstName: 'Alex',
  lastName: 'Sentinel',
  name: 'Alex Sentinel',
  email: 'alex.sentinel@vyken.security',
  country: 'USA',
  department: 'Security',
  avatar: 'https://picsum.photos/seed/admin/32/32',
  status: 'Active'
};

// Generate Events
const generateEvent = (id: number, dateOverride?: Date): AIEvent => {
  const riskScore = randomInt(0, 100);
  let riskLevel = RiskLevel.LOW;
  if (riskScore > 30) riskLevel = RiskLevel.MEDIUM;
  if (riskScore > 70) riskLevel = RiskLevel.HIGH;
  if (riskScore > 90) riskLevel = RiskLevel.CRITICAL;

  const dataTypes = [];
  if (riskScore > 10) dataTypes.push(getRandom(DATA_TYPES.filter(d => d !== 'None')));
  if (riskScore > 80) dataTypes.push(getRandom(DATA_TYPES.filter(d => d !== 'None')));

  const action = riskLevel === RiskLevel.CRITICAL ? ActionType.BLOCK : 
                 riskLevel === RiskLevel.HIGH ? ActionType.WARN : 
                 riskLevel === RiskLevel.MEDIUM ? ActionType.AUDIT : ActionType.ALLOW;

  const user = getRandom(MOCK_USERS);
  const date = dateOverride || new Date(Date.now() - randomInt(0, 7 * 24 * 60 * 60 * 1000));

  return {
    id: `evt-${id}`,
    timestamp: date.toISOString(),
    user: user,
    department: user.department,
    tool: getRandom(TOOLS),
    model: 'Latest',
    promptSnippet: `Analyze this ${getRandom(['code', 'document', 'email', 'strategy'])} for...`,
    detectedDataTypes: dataTypes.length > 0 ? dataTypes : ['None'],
    riskScore,
    riskLevel,
    actionTaken: action,
    latencyMs: randomInt(200, 2000)
  };
};

// Initial Mock Data set
export const INITIAL_EVENTS: AIEvent[] = Array.from({ length: 200 }).map((_, i) => generateEvent(i)).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

export const MOCK_POLICIES: Policy[] = [
  { id: 'p1', name: 'Block Source Code in Public AI', description: 'Prevent proprietary code leakage', conditionDataType: 'Source Code', conditionTool: 'Public', action: ActionType.BLOCK, enabled: true },
  { id: 'p2', name: 'Warn on PII', description: 'User must acknowledge PII risk', conditionDataType: 'PII', conditionTool: 'Any', action: ActionType.WARN, enabled: true },
  { id: 'p3', name: 'Audit Finance Queries', description: 'Log all finance dept prompts', conditionDataType: 'Financial Data', conditionTool: 'Any', action: ActionType.AUDIT, enabled: true },
];

// Service Layer
export const MockAPI = {
  fetchEvents: async (): Promise<AIEvent[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...INITIAL_EVENTS]), 800));
  },
  
  fetchStats: async (): Promise<any> => {
    return new Promise(resolve => setTimeout(() => resolve({
      total: 12450,
      sensitive: 15.8,
      riskScore: 68
    }), 500));
  },

  createNewEvent: (): AIEvent => {
    return generateEvent(Date.now(), new Date());
  }
};