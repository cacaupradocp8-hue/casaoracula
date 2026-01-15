import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AdminPreviewProvider, useAdminPreviewOptional } from "@/contexts/AdminPreviewContext";
import { PortalType, canAccessFeature } from "@/types/portal";

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
import LaboratorioLeitura from "./pages/LaboratorioLeitura";
import Metodo from "./pages/Metodo";
import Portais from "./pages/Portais";
import ConfirmarProfissional from "./pages/ConfirmarProfissional";
import MinhasClientes from "./pages/MinhasClientes";
import MapaOracula from "./pages/MapaOracula";
import QuizPage from "./pages/QuizPage";
import ClientePerfil from "./pages/ClientePerfil";
import Oraculos from "./pages/Oraculos";
import OracleHome from "./pages/OracleHome";
import OracleDraw from "./pages/OracleDraw";
import OracleHistory from "./pages/OracleHistory";
import Cursos from "./pages/Cursos";
import CursoDetalhe from "./pages/CursoDetalhe";
import CursoAula from "./pages/CursoAula";
import BibliotecaDasTravessias from "./pages/BibliotecaDasTravessias";
import BibliotecaTravessiaDetalhe from "./pages/BibliotecaTravessiaDetalhe";
import LabirintoHome from "./pages/labirinto/LabirintoHome";
import LabirintoPorta from "./pages/labirinto/LabirintoPorta";
import InstallApp from "./pages/InstallApp";
import Planos from "./pages/Planos";
import Assinatura from "./pages/Assinatura";
import Billing from "./pages/Billing";
import CheckoutSucesso from "./pages/CheckoutSucesso";
import CheckoutCancelado from "./pages/CheckoutCancelado";
import Audios from "./pages/Audios";

// Ferramentas (salas)
import Big5 from "./pages/salas/Big5";
import Eneagrama from "./pages/salas/Eneagrama";
import OraculoPerguntas from "./pages/salas/OraculoPerguntas";
import Chakras from "./pages/salas/Chakras";
import Hawkins from "./pages/salas/Hawkins";
import Antroposofia from "./pages/salas/Antroposofia";
import Neuroplasticidade from "./pages/salas/Neuroplasticidade";
import Narrativas from "./pages/salas/Narrativas";
// Radiestesia agora é dinâmica via FerramentaDinamica
import Tarot from "./pages/salas/Tarot";
import Constelacao from "./pages/salas/Constelacao";
import Syntheia from "./pages/Syntheia";
import AgenteAnalista from "./pages/salas/AgenteAnalista";
import AgenteCurador from "./pages/salas/AgenteCurador";
import AgenteSimbólico from "./pages/salas/AgenteSimbólico";
import FerramentaDinamica from "./pages/FerramentaDinamica";
import Big5Simbolico from "./pages/Big5Simbolico";
import EneagramaFeminino from "./pages/EneagramaFeminino";
import JornadaHeroina from "./pages/JornadaHeroina";
const queryClient = new QueryClient();

// Loading component for auth states
function AuthLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-gold font-display text-xl">Carregando...</div>
    </div>
  );
}

// ProtectedRoute with preview mode support
function ProtectedRoute({ children, minPortal = "visitante" }: { children: React.ReactNode; minPortal?: PortalType }) {
  const { isLoading, isAuthenticated, user } = useAuth();
  const preview = useAdminPreviewOptional();

  if (isLoading) return <AuthLoading />;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  
  // Get effective portal considering preview mode
  const effectivePortal = preview?.isPreviewMode && preview?.previewPortal && user?.portal === 'admin'
    ? preview.previewPortal
    : user?.portal || 'visitante';
  
  // Check access with effective portal
  const hasAccess = canAccessFeature(effectivePortal, minPortal);
  
  if (!hasAccess) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <AuthLoading />;
  if (isAuthenticated) return <Navigate to="/welcome" replace />;

  return <>{children}</>;
}

// Legacy redirect components for old /curso/ routes
function LegacyCursoRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/cursos/${id}`} replace />;
}

function LegacyAulaRedirect() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  return <Navigate to={`/cursos/${courseId}/aula/${lessonId}`} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Landing />
          </PublicRoute>
        }
      />
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        }
      />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/install" element={<InstallApp />} />

      {/* Protected Routes - New Navigation Structure */}
      <Route
        path="/welcome"
        element={
          <ProtectedRoute>
            <Welcome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/salas/:id"
        element={
          <ProtectedRoute>
            <SalaDetalhe />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portal/:id"
        element={
          <ProtectedRoute>
            <PortalDetalhe />
          </ProtectedRoute>
        }
      />
      <Route
        path="/aulas/:id"
        element={
          <ProtectedRoute>
            <AulaPage />
          </ProtectedRoute>
        }
      />

      {/* Legacy routes - kept for compatibility */}
      <Route
        path="/travessias"
        element={
          <ProtectedRoute>
            <Travessias />
          </ProtectedRoute>
        }
      />
      <Route
        path="/travessia/:slug"
        element={
          <ProtectedRoute>
            <Portais />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portais"
        element={
          <ProtectedRoute>
            <Portais />
          </ProtectedRoute>
        }
      />

      {/* Other Protected Routes */}
      <Route
        path="/confirmar-profissional"
        element={
          <ProtectedRoute>
            <ConfirmarProfissional />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentoria"
        element={
          <ProtectedRoute minPortal="iniciada">
            <Mentoria />
          </ProtectedRoute>
        }
      />
      <Route
        path="/metodo"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <Metodo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/biblioteca"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <Biblioteca />
          </ProtectedRoute>
        }
      />
      <Route
        path="/laboratorio-leitura"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <LaboratorioLeitura />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agentes"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <Agentes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <Salas />
          </ProtectedRoute>
        }
      />

      {/* Ferramentas - Rotas /ferramentas/ (principal) */}
      <Route
        path="/ferramentas/big5"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <Big5 />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramenta/big5-simbolico"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <Big5Simbolico />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/eneagrama"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <Eneagrama />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramenta/eneagrama-feminino"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <EneagramaFeminino />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramenta/jornada-heroina"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <JornadaHeroina />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/oraculo-perguntas"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <OraculoPerguntas />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/mapa-oracula"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <MapaOracula />
          </ProtectedRoute>
        }
      />
      
      {/* Legacy routes /salas/ - for backwards compatibility */}
      <Route
        path="/salas/big5"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <Big5 />
          </ProtectedRoute>
        }
      />
      <Route
        path="/salas/eneagrama"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <Eneagrama />
          </ProtectedRoute>
        }
      />
      <Route
        path="/salas/oraculo-perguntas"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <OraculoPerguntas />
          </ProtectedRoute>
        }
      />
      <Route
        path="/salas/mapa-oracula"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <MapaOracula />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/chakras"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <Chakras />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/hawkins"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <Hawkins />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/antroposofia"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <Antroposofia />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/neuroplasticidade"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <Neuroplasticidade />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/narrativas"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <Narrativas />
          </ProtectedRoute>
        }
      />
      {/* Radiestesia agora é dinâmica via /ferramentas/:slug */}
      <Route
        path="/ferramentas/tarot"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <Tarot />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/constelacao"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <Constelacao />
          </ProtectedRoute>
        }
      />
      {/* Syntheia - O Templo (primeiro nível) */}
      <Route
        path="/syntheia"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <Syntheia />
          </ProtectedRoute>
        }
      />
      {/* Redirect legado /ferramentas/sintheia → /syntheia */}
      <Route
        path="/ferramentas/sintheia"
        element={<Navigate to="/syntheia" replace />}
      />
      <Route
        path="/ferramentas/agente-analista"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <AgenteAnalista />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/agente-curador"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <AgenteCurador />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/agente-simbolico"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <AgenteSimbólico />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quiz/:quizId"
        element={
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/leitura-oracular"
        element={
          <ProtectedRoute minPortal="iniciada">
            <LeituraOracular />
          </ProtectedRoute>
        }
      />
      <Route
        path="/minhas-clientes"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <MinhasClientes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cliente/:clienteId"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <ClientePerfil />
          </ProtectedRoute>
        }
        />

        {/* Oráculos Module */}
        <Route
          path="/oraculos"
          element={
            <ProtectedRoute>
              <Oraculos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/oraculos/:oracleSlug"
          element={
            <ProtectedRoute>
              <OracleHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/oraculos/:oracleSlug/tirar"
          element={
            <ProtectedRoute>
              <OracleDraw />
            </ProtectedRoute>
          }
        />
        <Route
          path="/oraculos/:oracleSlug/historico"
          element={
            <ProtectedRoute>
              <OracleHistory />
            </ProtectedRoute>
          }
        />

        {/* Legacy redirects for old /curso/ routes */}
        <Route path="/curso/:id" element={<LegacyCursoRedirect />} />
        <Route path="/curso/:courseId/aula/:lessonId" element={<LegacyAulaRedirect />} />

        {/* Cursos Module */}
        <Route
          path="/cursos"
          element={
            <ProtectedRoute>
              <Cursos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cursos/:id"
          element={
            <ProtectedRoute>
              <CursoDetalhe />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cursos/:courseId/aula/:lessonId"
          element={
            <ProtectedRoute>
              <CursoAula />
            </ProtectedRoute>
          }
        />

        {/* Biblioteca das Travessias */}
        <Route
          path="/biblioteca-das-travessias"
          element={
            <ProtectedRoute>
              <BibliotecaDasTravessias />
            </ProtectedRoute>
          }
        />
        <Route
          path="/biblioteca-das-travessias/:slug"
          element={
            <ProtectedRoute>
              <BibliotecaTravessiaDetalhe />
            </ProtectedRoute>
          }
        />

        {/* Labirinto das 39 Portas */}
        <Route
          path="/labirinto"
          element={
            <ProtectedRoute minPortal="pre_iniciada">
              <LabirintoHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/labirinto/porta/:portaId"
          element={
            <ProtectedRoute minPortal="pre_iniciada">
              <LabirintoPorta />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute minPortal="admin">
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* Planos e Assinatura */}
        <Route path="/planos" element={<Planos />} />
        <Route
          path="/assinatura"
          element={
            <ProtectedRoute>
              <Assinatura />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <Billing />
            </ProtectedRoute>
          }
        />
        <Route path="/checkout/sucesso" element={<ProtectedRoute><CheckoutSucesso /></ProtectedRoute>} />
        <Route path="/checkout/cancelado" element={<ProtectedRoute><CheckoutCancelado /></ProtectedRoute>} />
        <Route
          path="/audios"
          element={
            <ProtectedRoute>
              <Audios />
            </ProtectedRoute>
          }
        />

        {/* Dynamic Tool Route - MUST be after all static /ferramentas/ routes */}
        <Route
          path="/ferramentas/:slug"
          element={
            <ProtectedRoute>
              <FerramentaDinamica />
            </ProtectedRoute>
          }
        />

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
          <AdminPreviewProvider>
            <AppRoutes />
          </AdminPreviewProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
