import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { ReactNode } from "react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import UsersPage from "@/pages/Users";
import RoadmapsPage from "@/pages/Roadmaps";
import SubscriptionsPage from "@/pages/Subscriptions";
import SEOMetadataPage from "@/pages/SEOMetadata";
import RolesPage from "@/pages/RolesPage";
import PermissionsPage from "@/pages/PermissionsPage";
import TechnologiesList from "@/pages/technologies/TechnologiesList";
import TechModules from "@/pages/technologies/TechModules";
import ModuleTopics from "@/pages/technologies/ModuleTopics";
import TopicSubtopics from "@/pages/technologies/TopicSubtopics";
import SubtopicLessons from "@/pages/technologies/SubtopicLessons";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: ReactNode }) {
  const { canAccessRoles } = useApp();
  if (!canAccessRoles) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AuthRedirect({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useApp();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
      <Route path="/register" element={<AuthRedirect><Register /></AuthRedirect>} />

      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/roadmaps" element={<RoadmapsPage />} />
        <Route path="/technologies" element={<TechnologiesList />} />
        <Route path="/technologies/:techId/modules" element={<TechModules />} />
        <Route path="/technologies/:techId/modules/:moduleId/topics" element={<ModuleTopics />} />
        <Route path="/technologies/:techId/modules/:moduleId/topics/:topicId/subtopics" element={<TopicSubtopics />} />
        <Route path="/technologies/:techId/modules/:moduleId/topics/:topicId/subtopics/:subtopicId/lessons" element={<SubtopicLessons />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/seo" element={<SEOMetadataPage />} />
        <Route path="/roles" element={<AdminRoute><RolesPage /></AdminRoute>} />
        <Route path="/permissions" element={<AdminRoute><PermissionsPage /></AdminRoute>} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

const App = () => (
  <AppProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AppProvider>
);

export default App;
