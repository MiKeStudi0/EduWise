import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import {
  LayoutDashboard, Users, Map, Code2, CreditCard, Search, Shield, Lock,
  Menu, X, Sun, Moon, LogOut, ChevronDown
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/users', label: 'Users', icon: Users },
  { path: '/roadmaps', label: 'Roadmaps', icon: Map },
  { path: '/technologies', label: 'Technologies', icon: Code2 },
  { path: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { path: '/seo', label: 'SEO Metadata', icon: Search },
  { path: '/roles', label: 'Roles', icon: Shield, adminOnly: true },
  { path: '/permissions', label: 'Permissions', icon: Lock, adminOnly: true },
];

export default function DashboardLayout() {
  const { currentRole, setCurrentRole, logout, theme, toggleTheme, canAccessRoles } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roleDropdown, setRoleDropdown] = useState(false);
  const location = useLocation();

  const filteredNav = navItems.filter(item => !item.adminOnly || canAccessRoles);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-card border-r border-border/50 flex flex-col transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 px-6 h-20 border-b border-border/50 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-primary-foreground font-bold text-sm">L</span>
          </div>
          <span className="font-bold text-lg text-foreground tracking-tight">Learnstak</span>
          <button className="lg:hidden ml-auto text-muted-foreground" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {filteredNav.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-20 border-b border-border/50 flex items-center justify-between px-6 lg:px-8 bg-card/80 backdrop-blur-md sticky top-0 z-30 shrink-0">
          <button className="lg:hidden text-muted-foreground" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-3 ml-auto">
            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdown(!roleDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/50 bg-background/50 text-sm font-medium hover:bg-accent transition-all shadow-sm"
              >
                {currentRole}
                <ChevronDown size={14} />
              </button>
              {roleDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setRoleDropdown(false)} />
                  <div className="absolute right-0 top-full mt-1 w-44 bg-card border border-border rounded-lg shadow-xl py-1 z-50">
                    {(['Admin', 'Content Manager', 'Viewer'] as const).map(role => (
                      <button
                        key={role}
                        onClick={() => { setCurrentRole(role); setRoleDropdown(false); }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-accent transition-colors ${
                          currentRole === role ? 'text-primary font-semibold' : 'text-foreground'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button onClick={toggleTheme} className="p-2.5 rounded-xl hover:bg-accent transition-colors text-muted-foreground border border-transparent hover:border-border/50">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button onClick={logout} className="p-2.5 rounded-xl hover:bg-accent transition-colors text-muted-foreground hover:text-destructive border border-transparent hover:border-border/50">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-muted/10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
