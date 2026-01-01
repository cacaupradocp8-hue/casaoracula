import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Pages
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Travessias from "./pages/Travessias";
import Formacao from "./pages/Formacao";
import Metodo from "./pages/Metodo";
import Biblioteca from "./pages/Biblioteca";
import Casos from "./pages/Casos";
import LeituraOracular from "./pages/LeituraOracular";
import Mentoria from "./pages/Mentoria";
import Agentes from "./pages/Agentes";
import Salas from "./pages/Salas";
import Big5 from "./pages/salas/Big5";
import Eneagrama from "./pages/salas/Eneagrama";
import OraculoPerguntas from "./pages/salas/OraculoPerguntas";
import Admin from "./pages/Admin";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

import { PortalType } from '@/types/portal';

function ProtectedRoute({ children, minPortal = 'visitante' }: { children: React.ReactNode; minPortal?: PortalType }) {
  const { user, isLoading, isAuthenticated, canAccess } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-gold font-display text-xl">Carregando...</div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  if (!canAccess(minPortal)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-gold font-display text-xl">Carregando...</div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/travessias" element={<ProtectedRoute minPortal="pre_iniciada"><Travessias /></ProtectedRoute>} />
      <Route path="/formacao" element={<ProtectedRoute><Formacao /></ProtectedRoute>} />
      <Route path="/metodo" element={<ProtectedRoute minPortal="pre_iniciada"><Metodo /></ProtectedRoute>} />
      <Route path="/biblioteca" element={<ProtectedRoute minPortal="pre_iniciada"><Biblioteca /></ProtectedRoute>} />
      <Route path="/casos" element={<ProtectedRoute minPortal="pre_iniciada"><Casos /></ProtectedRoute>} />
      <Route path="/mentoria" element={<ProtectedRoute minPortal="pre_iniciada"><Mentoria /></ProtectedRoute>} />
      <Route path="/agentes" element={<ProtectedRoute minPortal="pre_iniciada"><Agentes /></ProtectedRoute>} />
      <Route path="/salas" element={<ProtectedRoute minPortal="pre_iniciada"><Salas /></ProtectedRoute>} />
      <Route path="/salas/big5" element={<ProtectedRoute minPortal="pre_iniciada"><Big5 /></ProtectedRoute>} />
      <Route path="/salas/eneagrama" element={<ProtectedRoute minPortal="pre_iniciada"><Eneagrama /></ProtectedRoute>} />
      <Route path="/salas/oraculo-perguntas" element={<ProtectedRoute minPortal="pre_iniciada"><OraculoPerguntas /></ProtectedRoute>} />
      <Route path="/leitura-oracular" element={<ProtectedRoute minPortal="iniciada"><LeituraOracular /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      
      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
