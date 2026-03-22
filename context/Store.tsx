import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { AIEvent, Policy, User, Notification, Organization, Department, AIPlatform } from '../types';
import { CURRENT_USER, INITIAL_EVENTS, MOCK_POLICIES, MOCK_USERS, INITIAL_DEPARTMENTS, MOCK_PLATFORMS, MockAPI } from '../services/mockService';

interface AppState {
  user: User | null; // Current logged in user
  organization: Organization | null;
  isAuthenticated: boolean;
  users: User[]; // List of all users
  events: AIEvent[];
  policies: Policy[];
  departments: Department[];
  platforms: AIPlatform[];
  notifications: Notification[];
  isDarkMode: boolean;
  isLoading: boolean;
  searchQuery: string;
}

type Action =
  | { type: 'LOGIN'; payload: { user: User; organization?: Organization } }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER'; payload: { user: User; organization: Organization } }
  | { type: 'ADD_EVENT'; payload: AIEvent }
  | { type: 'SET_THEME'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'ADD_POLICY'; payload: Policy }
  | { type: 'UPDATE_POLICY'; payload: Policy }
  | { type: 'DELETE_POLICY'; payload: string }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'ADD_DEPARTMENT'; payload: Department }
  | { type: 'UPDATE_DEPARTMENT'; payload: Department }
  | { type: 'DELETE_DEPARTMENT'; payload: string }
  | { type: 'ADD_PLATFORM'; payload: AIPlatform }
  | { type: 'UPDATE_PLATFORM'; payload: AIPlatform }
  | { type: 'DELETE_PLATFORM'; payload: string };

const initialState: AppState = {
  user: null,
  organization: null,
  isAuthenticated: false,
  users: MOCK_USERS,
  events: INITIAL_EVENTS,
  policies: MOCK_POLICIES,
  departments: INITIAL_DEPARTMENTS,
  platforms: MOCK_PLATFORMS,
  notifications: [],
  isDarkMode: false,
  isLoading: false,
  searchQuery: '',
};

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'LOGIN':
      return { 
        ...state, 
        user: action.payload.user, 
        organization: action.payload.organization || null,
        isAuthenticated: true 
      };
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        organization: null,
        isAuthenticated: false 
      };
    case 'REGISTER':
      return { 
        ...state, 
        user: action.payload.user, 
        organization: action.payload.organization,
        isAuthenticated: true 
      };
    case 'ADD_EVENT':
      return { ...state, events: [action.payload, ...state.events] };
    case 'SET_THEME':
      return { ...state, isDarkMode: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'ADD_POLICY':
        return { ...state, policies: [...state.policies, action.payload] };
    case 'UPDATE_POLICY':
        return {
            ...state,
            policies: state.policies.map(p => p.id === action.payload.id ? action.payload : p)
        };
    case 'DELETE_POLICY':
        return {
            ...state,
            policies: state.policies.filter(p => p.id !== action.payload)
        };
    case 'ADD_USER':
        return { ...state, users: [action.payload, ...state.users] };
    case 'UPDATE_USER':
        return {
            ...state,
            users: state.users.map(u => u.id === action.payload.id ? action.payload : u)
        };
    case 'DELETE_USER':
        return {
            ...state,
            users: state.users.filter(u => u.id !== action.payload)
        };
    case 'ADD_DEPARTMENT':
        return { ...state, departments: [...state.departments, action.payload] };
    case 'UPDATE_DEPARTMENT':
        // Find the old department to get its name for cascading updates
        const oldDept = state.departments.find(d => d.id === action.payload.id);
        return {
            ...state,
            departments: state.departments.map(d => d.id === action.payload.id ? action.payload : d),
            // Cascade update to users if name changed
            users: oldDept && oldDept.name !== action.payload.name 
                ? state.users.map(u => u.department === oldDept.name ? { ...u, department: action.payload.name } : u)
                : state.users
        };
    case 'DELETE_DEPARTMENT':
        const deptToDelete = state.departments.find(d => d.id === action.payload);
        return {
            ...state,
            departments: state.departments.filter(d => d.id !== action.payload),
            // Move users to Unassigned
            users: deptToDelete 
                ? state.users.map(u => u.department === deptToDelete.name ? { ...u, department: 'Unassigned' } : u)
                : state.users
        };
    case 'ADD_PLATFORM':
        return { ...state, platforms: [...state.platforms, action.payload] };
    case 'UPDATE_PLATFORM':
        return {
            ...state,
            platforms: state.platforms.map(p => p.id === action.payload.id ? action.payload : p)
        };
    case 'DELETE_PLATFORM':
        return {
            ...state,
            platforms: state.platforms.filter(p => p.id !== action.payload)
        };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Theme Sync
  useEffect(() => {
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.isDarkMode]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useStore must be used within AppProvider');
  return context;
};