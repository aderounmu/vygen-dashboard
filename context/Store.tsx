import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { AIEvent, Policy, User, Notification, UserRole } from '../types';
import { CURRENT_USER, INITIAL_EVENTS, MOCK_POLICIES, MOCK_USERS, DEPARTMENTS, MockAPI } from '../services/mockService';

interface AppState {
  user: User; // Current logged in user
  users: User[]; // List of all users
  events: AIEvent[];
  policies: Policy[];
  departments: string[];
  notifications: Notification[];
  isDarkMode: boolean;
  isLoading: boolean;
  searchQuery: string;
}

type Action =
  | { type: 'ADD_EVENT'; payload: AIEvent }
  | { type: 'SET_THEME'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'UPDATE_POLICY'; payload: Policy }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'ADD_DEPARTMENT'; payload: string }
  | { type: 'UPDATE_DEPARTMENT'; payload: { oldName: string; newName: string } }
  | { type: 'DELETE_DEPARTMENT'; payload: string };

const initialState: AppState = {
  user: CURRENT_USER,
  users: MOCK_USERS,
  events: INITIAL_EVENTS,
  policies: MOCK_POLICIES,
  departments: DEPARTMENTS,
  notifications: [],
  isDarkMode: false,
  isLoading: false,
  searchQuery: '',
};

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
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
    case 'UPDATE_POLICY':
        return {
            ...state,
            policies: state.policies.map(p => p.id === action.payload.id ? action.payload : p)
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
        if (state.departments.includes(action.payload)) return state;
        return { ...state, departments: [...state.departments, action.payload] };
    case 'UPDATE_DEPARTMENT':
        return {
            ...state,
            departments: state.departments.map(d => d === action.payload.oldName ? action.payload.newName : d),
            // Cascade update to users
            users: state.users.map(u => u.department === action.payload.oldName ? { ...u, department: action.payload.newName } : u)
        };
    case 'DELETE_DEPARTMENT':
        return {
            ...state,
            departments: state.departments.filter(d => d !== action.payload),
            // Move users to Unassigned
            users: state.users.map(u => u.department === action.payload ? { ...u, department: 'Unassigned' } : u)
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