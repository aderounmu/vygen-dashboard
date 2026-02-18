import { AIEvent, RiskLevel, ActionType, User, UserRole, Policy } from '../types';

// Constants for generation
export const DEPARTMENTS = ['Engineering', 'Finance', 'HR', 'Marketing', 'Sales', 'Executive'];
const TOOLS = ['ChatGPT', 'Gemini Ultra', 'Claude 3', 'GitHub Copilot', 'Perplexity'];
const DATA_TYPES = ['None', 'PII', 'Source Code', 'Credentials', 'Financial Data', 'Health Data', 'Internal Strategy'];

// Helpers
const getRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate Users
export const MOCK_USERS: User[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `u-${i}`,
  name: `User ${i + 1}`,
  email: `user${i+1}@nexus.io`,
  role: i === 0 ? UserRole.ADMIN : getRandom(Object.values(UserRole)),
  department: getRandom(DEPARTMENTS),
  avatar: `https://picsum.photos/seed/u${i}/32/32`,
  status: Math.random() > 0.1 ? 'Active' : 'Inactive'
}));

export const CURRENT_USER: User = {
  id: 'u-admin',
  name: 'Alex Sentinel',
  email: 'alex@nexus.io',
  role: UserRole.ADMIN,
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