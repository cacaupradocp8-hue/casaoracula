import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Pages
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import SalaDetalhe from "./pages/SalaDetalhe";
import PortalDetalhe from "./pages/PortalDetalhe";
import Travessias from "./pages/Travessias";
import Portais from "./pages/Portais";
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
import MapaOracula from "./pages/MapaOracula";
import AulaPage from "./pages/AulaPage";
import Admin from "./pages/Admin";
import MinhasClientes from "./pages/MinhasClientes";
import ConfirmarProfissional from "./pages/ConfirmarProfissional";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

import { PortalType } from '@/types/portal';

// Loading component for auth states
function AuthLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-gold font-display text-xl">Carregando...</div>
    </div>
  );
}

// These components must be rendered inside AuthProvider
function ProtectedRoute({ children, minPortal = 'visitante' }: { children: React.ReactNode; minPortal?: PortalType }) {
  const { isLoading, isAuthenticated, canAccess } = useAuth();
  
  if (isLoading) return <AuthLoading />;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (!canAccess(minPortal)) return <Navigate to="/dashboard" replace />;
  
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <AuthLoading />;
  if (isAuthenticated) return <Navigate to="/welcome" replace />;
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Protected Routes - New Navigation Structure */}
      <Route path="/welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/salas/:id" element={<ProtectedRoute><SalaDetalhe /></ProtectedRoute>} />
      <Route path="/portal/:id" element={<ProtectedRoute><PortalDetalhe /></ProtectedRoute>} />
      <Route path="/aulas/:id" element={<ProtectedRoute><AulaPage /></ProtectedRoute>} />
      
      {/* Legacy routes - kept for compatibility */}
      <Route path="/travessias" element={<ProtectedRoute><Travessias /></ProtectedRoute>} />
      <Route path="/travessia/:slug" element={<ProtectedRoute><Portais /></ProtectedRoute>} />
      <Route path="/portais" element={<ProtectedRoute><Portais /></ProtectedRoute>} />
      
      {/* Other Protected Routes */}
      <Route path="/confirmar-profissional" element={<ProtectedRoute><ConfirmarProfissional /></ProtectedRoute>} />
      <Route path="/mentoria" element={<ProtectedRoute minPortal="iniciada"><Mentoria /></ProtectedRoute>} />
      <Route path="/metodo" element={<ProtectedRoute minPortal="pre_iniciada"><Metodo /></ProtectedRoute>} />
      <Route path="/biblioteca" element={<ProtectedRoute minPortal="pre_iniciada"><Biblioteca /></ProtectedRoute>} />
      <Route path="/casos" element={<ProtectedRoute minPortal="pre_iniciada"><Casos /></ProtectedRoute>} />
      <Route path="/agentes" element={<ProtectedRoute minPortal="pre_iniciada"><Agentes /></ProtectedRoute>} />
      <Route path="/ferramentas" element={<ProtectedRoute minPortal="pre_iniciada"><Salas /></ProtectedRoute>} />
      <Route path="/salas/big5" element={<ProtectedRoute minPortal="pre_iniciada"><Big5 /></ProtectedRoute>} />
      <Route path="/salas/eneagrama" element={<ProtectedRoute minPortal="pre_iniciada"><Eneagrama /></ProtectedRoute>} />
      <Route path="/salas/oraculo-perguntas" element={<ProtectedRoute minPortal="pre_iniciada"><OraculoPerguntas /></ProtectedRoute>} />
      <Route path="/salas/mapa-oracula" element={<ProtectedRoute minPortal="pre_iniciada"><MapaOracula /></ProtectedRoute>} />
      <Route path="/leitura-oracular" element={<ProtectedRoute minPortal="iniciada"><LeituraOracular /></ProtectedRoute>} />
      <Route path="/minhas-clientes" element={<ProtectedRoute minPortal="pre_iniciada"><MinhasClientes /></ProtectedRoute>} />
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
