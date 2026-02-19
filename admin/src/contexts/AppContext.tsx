import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { User, Roadmap, Technology, Module, Topic, Subtopic, Lesson, Subscription, SEOEntry, Role, Permission, UserRole } from '@/types';
import * as mock from '@/data/mockData';

interface CRUDOps<T extends { id: string }> {
  items: T[];
  add: (item: Omit<T, 'id'>) => void;
  update: (id: string, data: Partial<T>) => void;
  remove: (id: string) => void;
  toggleStatus: (id: string) => void;
}

function useCRUD<T extends { id: string }>(initial: T[]): CRUDOps<T> {
  const [items, setItems] = useState<T[]>(initial);
  const add = useCallback((item: Omit<T, 'id'>) => {
    setItems(prev => [...prev, { ...item, id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}` } as T]);
  }, []);
  const update = useCallback((id: string, data: Partial<T>) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
  }, []);
  const remove = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);
  const toggleStatus = useCallback((id: string) => {
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, status: (i as any).status === 'active' ? 'inactive' : 'active' } : i
    ));
  }, []);
  return { items, add, update, remove, toggleStatus };
}

interface AppContextType {
  isAuthenticated: boolean;
  currentRole: UserRole;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setCurrentRole: (role: UserRole) => void;
  canEdit: boolean;
  canAccessRoles: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  users: CRUDOps<User>;
  roadmaps: CRUDOps<Roadmap>;
  technologies: CRUDOps<Technology>;
  modules: CRUDOps<Module>;
  topics: CRUDOps<Topic>;
  subtopics: CRUDOps<Subtopic>;
  lessons: CRUDOps<Lesson>;
  subscriptions: CRUDOps<Subscription>;
  seoEntries: CRUDOps<SEOEntry>;
  roles: CRUDOps<Role>;
  permissions: CRUDOps<Permission>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('learnstak_token'));
  const [currentRole, setCurrentRole] = useState<UserRole>(() => (localStorage.getItem('learnstak_role') as UserRole) || 'Admin');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('learnstak_theme') as 'light' | 'dark') || 'dark');

  useEffect(() => {
    localStorage.setItem('learnstak_theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => { localStorage.setItem('learnstak_role', currentRole); }, [currentRole]);

  const login = async (_email: string, _password: string) => {
    await new Promise(r => setTimeout(r, 800));
    localStorage.setItem('learnstak_token', 'mock-token');
    setIsAuthenticated(true);
    return true;
  };

  const register = async (_name: string, _email: string, _password: string) => {
    await new Promise(r => setTimeout(r, 800));
    return true;
  };

  const logout = () => {
    localStorage.removeItem('learnstak_token');
    setIsAuthenticated(false);
  };

  const toggleTheme = () => setTheme(p => p === 'dark' ? 'light' : 'dark');
  const canEdit = currentRole !== 'Viewer';
  const canAccessRoles = currentRole === 'Admin';

  const users = useCRUD(mock.initialUsers);
  const roadmaps = useCRUD(mock.initialRoadmaps);
  const technologies = useCRUD(mock.initialTechnologies);
  const modules = useCRUD(mock.initialModules);
  const topics = useCRUD(mock.initialTopics);
  const subtopics = useCRUD(mock.initialSubtopics);
  const lessons = useCRUD(mock.initialLessons);
  const subscriptions = useCRUD(mock.initialSubscriptions);
  const seoEntries = useCRUD(mock.initialSEOEntries);
  const roles = useCRUD(mock.initialRoles);
  const permissions = useCRUD(mock.initialPermissions);

  return (
    <AppContext.Provider value={{
      isAuthenticated, currentRole, login, register, logout, setCurrentRole,
      canEdit, canAccessRoles, theme, toggleTheme,
      users, roadmaps, technologies, modules, topics, subtopics, lessons,
      subscriptions, seoEntries, roles, permissions,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
