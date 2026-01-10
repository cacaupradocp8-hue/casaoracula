import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { PortalType } from '@/types/portal';

// Pages
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Welcome from "./pages/Welcome";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Biblioteca from "./pages/Biblioteca";
import Mentoria from "./pages/Mentoria";
import Travessias from "./pages/Travessias";
import Agentes from "./pages/Agentes";
import LeituraOracular from "./pages/LeituraOracular";
import Salas from "./pages/Salas";
import SalaDetalhe from "./pages/SalaDetalhe";
import PortalDetalhe from "./pages/PortalDetalhe";
import AulaPage from "./pages/AulaPage";
import Casos from "./pages/Casos";
import Metodo from "./pages/Metodo";
import Portais from "./pages/Portais";
import ConfirmarProfissional from "./pages/ConfirmarProfissional";
import MinhasClientes from "./pages/MinhasClientes";
import MapaOracula from "./pages/MapaOracula";
import QuizPage from "./pages/QuizPage";
import Cursos from "./pages/Cursos";
import CursoDetalhe from "./pages/CursoDetalhe";
import CursoAula from "./pages/CursoAula";
import Big5 from "./pages/salas/Big5";
import Eneagrama from "./pages/salas/Eneagrama";
import OraculoPerguntas from "./pages/salas/OraculoPerguntas";

const queryClient = new QueryClient();

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
      <Route path="/portal/:id/aula/:aulaId" element={<ProtectedRoute><AulaPage /></ProtectedRoute>} />
      <Route path="/travessias" element={<ProtectedRoute><Travessias /></ProtectedRoute>} />
      <Route path="/portais" element={<ProtectedRoute><Portais /></ProtectedRoute>} />
      <Route path="/metodo" element={<ProtectedRoute><Metodo /></ProtectedRoute>} />
      <Route path="/biblioteca" element={<ProtectedRoute><Biblioteca /></ProtectedRoute>} />
      <Route path="/casos" element={<ProtectedRoute minPortal="iniciada"><Casos /></ProtectedRoute>} />
      <Route path="/leitura-oracular" element={<ProtectedRoute><LeituraOracular /></ProtectedRoute>} />
      <Route path="/mentoria" element={<ProtectedRoute minPortal="pre_iniciada"><Mentoria /></ProtectedRoute>} />
      <Route path="/agentes" element={<ProtectedRoute minPortal="pre_iniciada"><Agentes /></ProtectedRoute>} />
      <Route path="/salas" element={<ProtectedRoute><Salas /></ProtectedRoute>} />
      <Route path="/mapa-oracula" element={<ProtectedRoute><MapaOracula /></ProtectedRoute>} />
      <Route path="/quiz/:id" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
      
      {/* Courses Routes */}
      <Route path="/cursos" element={<ProtectedRoute><Cursos /></ProtectedRoute>} />
      <Route path="/cursos/:id" element={<ProtectedRoute><CursoDetalhe /></ProtectedRoute>} />
      <Route path="/cursos/:courseId/aula/:lessonId" element={<ProtectedRoute><CursoAula /></ProtectedRoute>} />
      
      {/* Sala Ferramentas Routes */}
      <Route path="/salas/big5" element={<ProtectedRoute><Big5 /></ProtectedRoute>} />
      <Route path="/salas/eneagrama" element={<ProtectedRoute><Eneagrama /></ProtectedRoute>} />
      <Route path="/salas/oraculo-perguntas" element={<ProtectedRoute><OraculoPerguntas /></ProtectedRoute>} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route path="/minhas-clientes" element={<ProtectedRoute minPortal="iniciada"><MinhasClientes /></ProtectedRoute>} />
      <Route path="/confirmar-profissional" element={<ProtectedRoute><ConfirmarProfissional /></ProtectedRoute>} />
      
      {/* Catch all */}
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
