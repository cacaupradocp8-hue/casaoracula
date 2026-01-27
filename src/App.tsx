import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AdminPreviewProvider, useAdminPreviewOptional } from "@/contexts/AdminPreviewContext";
import { PortalType, canAccessFeature } from "@/types/portal";
import { useOnboarding } from "@/hooks/useOnboarding";
import { LockedForVisitor } from "@/components/shared/LockedForVisitor";

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
import CasaTecelaAtrio from "./pages/CasaTecelaAtrio";
import CasaTecelaInterior from "./pages/CasaTecelaInterior";
import { CasaAtrio, CasaSustentacao, CasaLeitura, CasaCirculo, CasaJardim } from "./pages/casa";
import MentoriaOracular from "./pages/MentoriaOracular";
import Travessias from "./pages/Travessias";
import Agentes from "./pages/Agentes";
import LeituraOracular from "./pages/LeituraOracular";
// Novas ferramentas
import EspelhoConsciencia from "./pages/salas/EspelhoConsciencia";
import MapaArquetiposEgo from "./pages/salas/MapaArquetiposEgo";
import CartografiaTorre from "./pages/salas/CartografiaTorre";
import PlasticidadePsiquica from "./pages/salas/PlasticidadePsiquica";
import SalasList from "./pages/SalasList";
import FerramentasHub from "./pages/FerramentasHub";
import FerramentasVitrine from "./pages/FerramentasVitrine";
import SalaDetalhe from "./pages/SalaDetalhe";
import PortalDetalhe from "./pages/PortalDetalhe";
import AulaPage from "./pages/AulaPage";
import LaboratorioLeitura from "./pages/LaboratorioLeitura";
import Metodo from "./pages/Metodo";
import FerramentasMetodo from "./pages/FerramentasMetodo";
import FerramentasMetodoHub from "./pages/FerramentasMetodoHub";
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
import CursoModulo from "./pages/CursoModulo";
import BibliotecaDasTravessias from "./pages/BibliotecaDasTravessias";
import BibliotecaTravessiaDetalhe from "./pages/BibliotecaTravessiaDetalhe";
import LabirintoHome from "./pages/labirinto/LabirintoHome";
import LabirintoPorta from "./pages/labirinto/LabirintoPorta";
import LabirintoComoUsar from "./pages/labirinto/LabirintoComoUsar";
import LabirintoTiposCampo from "./pages/labirinto/LabirintoTiposCampo";
import LabirintoTabela from "./pages/labirinto/LabirintoTabela";
import InstallApp from "./pages/InstallApp";
import Planos from "./pages/Planos";
import Assinatura from "./pages/Assinatura";
import Billing from "./pages/Billing";
import CheckoutSucesso from "./pages/CheckoutSucesso";
import CheckoutCancelado from "./pages/CheckoutCancelado";
import Audios from "./pages/Audios";
import Notificacoes from "./pages/Notificacoes";
// Ferramentas (salas)
import Big5 from "./pages/salas/Big5";
import Eneagrama from "./pages/salas/Eneagrama";
import OraculoPerguntas from "./pages/salas/OraculoPerguntas";
import Chakras from "./pages/salas/Chakras";
import Hawkins from "./pages/salas/Hawkins";
import EscalaMAIA from "./pages/salas/EscalaMAIA";
import Antroposofia from "./pages/salas/Antroposofia";
import Neuroplasticidade from "./pages/salas/Neuroplasticidade";
import Narrativas from "./pages/salas/Narrativas";
// Portal Radiestesia Oracular
import { 
  RadiestesiaPortal, 
  Leitura5Camadas,
  MesaRadionica, 
  CatalogoGraficos,
  GraficoDetalhe,
  Pantaculos, 
  CristaisCampos, 
  EscalaNarrativa, 
  DiarioPraticas 
} from "./pages/radiestesia";
import Tarot from "./pages/salas/Tarot";
import Constelacao from "./pages/salas/Constelacao";
import Syntheia from "./pages/Syntheia";
import AgenteAnalista from "./pages/salas/AgenteAnalista";
import AgenteCurador from "./pages/salas/AgenteCurador";
import AgenteSimbólico from "./pages/salas/AgenteSimbólico";
import FerramentaDinamica from "./pages/FerramentaDinamica";
import Big5Simbolico from "./pages/Big5Simbolico";
import Big5Oracular from "./pages/Big5Oracular";
import Big5Funcional from "./pages/Big5Funcional";
import EneagramaFeminino from "./pages/EneagramaFeminino";
import JornadaHeroina from "./pages/JornadaHeroina";
import TorreViva from "./pages/TorreViva";
import AtlasArquetiposFemininos from "./pages/AtlasArquetiposFemininos";
import BibliotecaCasos from "./pages/BibliotecaCasos";
import { AsPortas, OsCamposPsiquicos, AsTorres, TriadeMetodo } from "./pages/metodo";
import FormacaoOracula from "./pages/FormacaoOracula";
import MapaVivoList from "./pages/MapaVivoList";
import MapaVivoEditor from "./pages/MapaVivoEditor";
import Jornada from "./pages/Jornada";
import Onboarding from "./pages/Onboarding";
// SalaDaVisitante removida - usar SalaDetalhe com ID do banco
// SalaDeSessao removido - usar SessionRoomHome
import SessionRoomHome from "./pages/SessionRoomHome";
import SessionRoomCase from "./pages/SessionRoomCase";
import SessionRoomGroup from "./pages/SessionRoomGroup";
import ManuaisProtocolo from "./pages/ManuaisProtocolo";
import RoteirosProtocolo from "./pages/RoteirosProtocolo";
// Symbolic Templates
import Big5TemplateList from "./pages/templates/Big5TemplateList";
import Big5TemplateEditor from "./pages/templates/Big5TemplateEditor";
import EnneagramTemplateList from "./pages/templates/EnneagramTemplateList";
import EnneagramTemplateEditor from "./pages/templates/EnneagramTemplateEditor";
import TarotTemplateList from "./pages/templates/TarotTemplateList";
import TarotTemplateEditor from "./pages/templates/TarotTemplateEditor";
import ConstellationTemplateList from "./pages/templates/ConstellationTemplateList";
import ConstellationTemplateEditor from "./pages/templates/ConstellationTemplateEditor";
// Personal Symbolic Maps
import PersonalMaps from "./pages/PersonalMaps";
import PersonalMapEditor from "./pages/PersonalMapEditor";
// Jardim da Psique - Espaço privado de registros
import JardimPsique from "./pages/JardimPsique";
import JardimPsiqueDetalhe from "./pages/JardimPsiqueDetalhe";
import MinhaBiblioteca from "./pages/MinhaBiblioteca";
// Tour da Casa
import Tour from "./pages/Tour";
// Travessia Detalhe
import TravessiaDetalhe from "./pages/TravessiaDetalhe";
// Narroterapia Oracular
import NarroterapiaHub from "./pages/NarroterapiaHub";
import BibliotecaContos from "./pages/narroterapia/BibliotecaContos";
import BibliotecaClinica from "./pages/narroterapia/BibliotecaClinica";
import ContoClinicoDetalhe from "./pages/narroterapia/ContoClinicoDetalhe";
import AudiosNarracao from "./pages/narroterapia/AudiosNarracao";
import RitualAutorizacao from "./pages/narroterapia/RitualAutorizacao";
// Biblioteca das Travessias (Symbolic Families)
import BibliotecaTravessias from "./pages/BibliotecaTravessias";
import BibliotecaTravessiasFamilia from "./pages/BibliotecaTravessiasFamilia";
// Clube do Livro Oracular
import { 
  ClubeLivroApresentacao, 
  ClubeLivroCiclo, 
  ClubeLivroFase, 
  ClubeLivroEscutas, 
  ClubeLivroEncontros 
} from "./pages/clube-livro";

const queryClient = new QueryClient();

// Loading component for auth states
function AuthLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-gold font-display text-xl">Carregando...</div>
    </div>
  );
}

// ProtectedRoute with preview mode support AND onboarding enforcement
function ProtectedRoute({ children, minPortal = "visitante" }: { children: React.ReactNode; minPortal?: PortalType }) {
  const { isLoading, isAuthenticated, user } = useAuth();
  const preview = useAdminPreviewOptional();
  const location = useLocation();
  const { onboardingCompleted, isLoading: onboardingLoading } = useOnboarding();

  // Wait for both auth and onboarding status to load
  if (isLoading || onboardingLoading) return <AuthLoading />;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  
  const isOnboardingRoute = location.pathname === '/onboarding';
  const isJornadaRoute = location.pathname === '/jornada';
  const isSalaVisitanteRoute = location.pathname === '/sala-da-visitante';
  const isPlanosRoute = location.pathname === '/planos';
  const isAdmin = user?.portal === 'admin';
  const isVisitor = user?.portal === 'visitante';
  
  // FIRST TIME ONLY: Force onboarding if not completed (except if already on /onboarding)
  // Once completed, user NEVER goes back to onboarding
  if (!onboardingCompleted && !isOnboardingRoute && !isAdmin) {
    return <Navigate to="/onboarding" replace />;
  }
  
  // Get effective portal considering preview mode
  const effectivePortal = preview?.isPreviewMode && preview?.previewPortal && user?.portal === 'admin'
    ? preview.previewPortal
    : user?.portal || 'visitante';
  
  // Check access with effective portal
  const hasAccess = canAccessFeature(effectivePortal, minPortal);
  
  // VISITORS: Show blocking component for restricted content (not redirect!)
  // Allowed routes for visitors: /jornada, /sala-da-visitante, /planos, /onboarding
  if (isVisitor && !isAdmin && !hasAccess) {
    return <LockedForVisitor />;
  }
  
  // Non-visitors without access go to jornada (their home)
  if (!hasAccess) return <Navigate to="/jornada" replace />;

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { onboardingCompleted, isLoading: onboardingLoading } = useOnboarding();

  if (isLoading || onboardingLoading) return <AuthLoading />;
  
  if (isAuthenticated) {
    const isAdmin = user?.portal === 'admin';
    
    // FIRST TIME ONLY: If onboarding NOT completed → force to onboarding
    if (!onboardingCompleted && !isAdmin) {
      return <Navigate to="/onboarding" replace />;
    }
    
    // ALL users (including visitors) go to /jornada (Meu Caminho) as the real home
    // No intermediate pages, no loops, no redirects to /welcome
    return <Navigate to="/jornada" replace />;
  }

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
      <Route path="/formacao-oracula" element={<FormacaoOracula />} />
      <Route path="/tour" element={<Tour />} />

      {/* Onboarding Route - First-time experience (before completing) */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      {/* Sala da Visitante - Redirect to database-driven room */}
      <Route
        path="/sala-da-visitante"
        element={
          <ProtectedRoute>
            <Navigate to="/salas/be626211-4608-4232-b678-8c3edfac2798" replace />
          </ProtectedRoute>
        }
      />

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
        path="/jornada"
        element={
          <ProtectedRoute>
            <Jornada />
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
            <TravessiaDetalhe />
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
        element={<Navigate to="/mentoria-oracular" replace />}
      />
      
      {/* Living Territories */}
      <Route
        path="/casa-tecelas"
        element={
          <ProtectedRoute minPortal="oracula">
            <CasaTecelaAtrio />
          </ProtectedRoute>
        }
      />
      <Route
        path="/casa-tecelas/interior"
        element={
          <ProtectedRoute minPortal="oracula">
            <CasaTecelaInterior />
          </ProtectedRoute>
        }
      />
      
      {/* Casa Orácula - 3 Room Architecture */}
      <Route
        path="/casa"
        element={
          <ProtectedRoute minPortal="oracula">
            <CasaAtrio />
          </ProtectedRoute>
        }
      />
      <Route
        path="/casa/sustentacao"
        element={
          <ProtectedRoute minPortal="oracula">
            <CasaSustentacao />
          </ProtectedRoute>
        }
      />
      <Route
        path="/casa/leitura"
        element={
          <ProtectedRoute minPortal="oracula">
            <CasaLeitura />
          </ProtectedRoute>
        }
      />
      <Route
        path="/casa/circulo"
        element={
          <ProtectedRoute minPortal="oracula">
            <CasaCirculo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/casa/jardim"
        element={
          <ProtectedRoute>
            <CasaJardim />
          </ProtectedRoute>
        }
      />
      <Route
        path="/casa/jardim/:id"
        element={
          <ProtectedRoute>
            <JardimPsiqueDetalhe />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentoria-oracular"
        element={
          <ProtectedRoute minPortal="oracula">
            <MentoriaOracular />
          </ProtectedRoute>
        }
      />
      <Route
        path="/metodo"
        element={
          <ProtectedRoute>
            <Metodo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas-metodo"
        element={
          <ProtectedRoute minPortal="aluna_formacao">
            <FerramentasMetodoHub />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sala-do-metodo"
        element={
          <ProtectedRoute minPortal="oracula">
            <FerramentasMetodo />
          </ProtectedRoute>
        }
      />
      
      {/* Narroterapia Oracular™ */}
      <Route
        path="/narroterapia"
        element={
          <ProtectedRoute>
            <NarroterapiaHub />
          </ProtectedRoute>
        }
      />
      <Route
        path="/narroterapia/biblioteca-contos"
        element={
          <ProtectedRoute>
            <BibliotecaContos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/narroterapia/clinica"
        element={
          <ProtectedRoute minPortal="aluna_formacao">
            <BibliotecaClinica />
          </ProtectedRoute>
        }
      />
        <Route
          path="/narroterapia/clinica/:slug"
          element={
            <ProtectedRoute minPortal="aluna_formacao">
              <ContoClinicoDetalhe />
            </ProtectedRoute>
          }
        />
        <Route
          path="/narroterapia/ritual"
          element={
            <ProtectedRoute minPortal="aluna_formacao">
              <RitualAutorizacao />
            </ProtectedRoute>
          }
        />
      <Route
        path="/narroterapia/audios"
        element={
          <ProtectedRoute minPortal="aluna_formacao">
            <AudiosNarracao />
          </ProtectedRoute>
        }
      />
      
      {/* Clube do Livro Oracular */}
      <Route
        path="/clube-livro"
        element={
          <ProtectedRoute minPortal="aluna">
            <ClubeLivroApresentacao />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clube-livro/:id"
        element={
          <ProtectedRoute minPortal="aluna">
            <ClubeLivroCiclo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clube-livro/:id/fase/:faseId"
        element={
          <ProtectedRoute minPortal="aluna">
            <ClubeLivroFase />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clube-livro/:id/escutas"
        element={
          <ProtectedRoute minPortal="aluna">
            <ClubeLivroEscutas />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clube-livro/:id/encontros"
        element={
          <ProtectedRoute minPortal="aluna">
            <ClubeLivroEncontros />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/biblioteca"
        element={
          <ProtectedRoute minPortal="mentorada">
            <Biblioteca />
          </ProtectedRoute>
        }
      />
      <Route
        path="/laboratorio-leitura"
        element={
          <ProtectedRoute minPortal="mentorada">
            <LaboratorioLeitura />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agentes"
        element={
          <ProtectedRoute minPortal="mentorada">
            <Agentes />
          </ProtectedRoute>
        }
      />
      {/* Salas - Experiential content listing */}
      <Route
        path="/salas"
        element={
          <ProtectedRoute>
            <SalasList />
          </ProtectedRoute>
        }
      />

      {/* Ferramentas - Professional tools hub */}
      <Route
        path="/ferramentas"
        element={
          <ProtectedRoute minPortal="mentorada">
            <FerramentasHub />
          </ProtectedRoute>
        }
      />

      {/* Ferramentas Vitrine - Showcase for visitors */}
      <Route
        path="/ferramentas-vitrine"
        element={
          <ProtectedRoute minPortal="visitante">
            <FerramentasVitrine />
          </ProtectedRoute>
        }
      />

      {/* Session Room - Sala de Sessão */}
      <Route
        path="/session-room"
        element={
          <ProtectedRoute minPortal="mentorada">
            <SessionRoomHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/session-room/:caseId"
        element={
          <ProtectedRoute minPortal="mentorada">
            <SessionRoomCase />
          </ProtectedRoute>
        }
      />
      <Route
        path="/session-room/group/:groupId"
        element={
          <ProtectedRoute minPortal="mentorada">
            <SessionRoomGroup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/session-room/manuais"
        element={
          <ProtectedRoute minPortal="mentorada">
            <ManuaisProtocolo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/session-room/roteiros"
        element={
          <ProtectedRoute minPortal="mentorada">
            <RoteirosProtocolo />
          </ProtectedRoute>
        }
      />
      {/* Atlas de Arquétipos Femininos - Clinical Tool */}
      <Route
        path="/atlas-arquetipos"
        element={
          <ProtectedRoute minPortal="oracula">
            <AtlasArquetiposFemininos />
          </ProtectedRoute>
        }
      />
      {/* Legacy redirect */}
      <Route
        path="/ferramentas/sala-de-sessao"
        element={<Navigate to="/session-room" replace />}
      />
      <Route
        path="/ferramentas/mapa-vivo"
        element={
          <ProtectedRoute minPortal="mentorada">
            <MapaVivoList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/mapa-vivo/:id"
        element={
          <ProtectedRoute minPortal="mentorada">
            <MapaVivoEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/big5"
        element={
          <ProtectedRoute minPortal="mentorada">
            <Big5 />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramenta/big5-simbolico"
        element={
          <ProtectedRoute minPortal="mentorada">
            <Big5Simbolico />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramenta/big5-oracular"
        element={
          <ProtectedRoute minPortal="mentorada">
            <Big5Oracular />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramenta/big5-funcional"
        element={
          <ProtectedRoute minPortal="mentorada">
            <Big5Funcional />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/eneagrama"
        element={
          <ProtectedRoute minPortal="mentorada">
            <Eneagrama />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramenta/eneagrama-feminino"
        element={
          <ProtectedRoute minPortal="mentorada">
            <EneagramaFeminino />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramenta/jornada-heroina"
        element={
          <ProtectedRoute minPortal="mentorada">
            <JornadaHeroina />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/oraculo-perguntas"
        element={
          <ProtectedRoute minPortal="mentorada">
            <OraculoPerguntas />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/mapa-oracula"
        element={
          <ProtectedRoute minPortal="mentorada">
            <MapaOracula />
          </ProtectedRoute>
        }
      />

      {/* Symbolic Templates */}
      <Route
        path="/templates/big5"
        element={
          <ProtectedRoute minPortal="mentorada">
            <Big5TemplateList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/templates/big5/:sessionId"
        element={
          <ProtectedRoute minPortal="mentorada">
            <Big5TemplateEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/templates/enneagram"
        element={
          <ProtectedRoute minPortal="mentorada">
            <EnneagramTemplateList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/templates/enneagram/:sessionId"
        element={
          <ProtectedRoute minPortal="mentorada">
            <EnneagramTemplateEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/templates/tarot"
        element={
          <ProtectedRoute minPortal="mentorada">
            <TarotTemplateList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/templates/tarot/:sessionId"
        element={
          <ProtectedRoute minPortal="mentorada">
            <TarotTemplateEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/templates/constellation"
        element={
          <ProtectedRoute minPortal="mentorada">
            <ConstellationTemplateList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/templates/constellation/:sessionId"
        element={
          <ProtectedRoute minPortal="mentorada">
            <ConstellationTemplateEditor />
          </ProtectedRoute>
        }
      />

      {/* Personal Symbolic Maps - Private Reflective Space */}
      <Route
        path="/mapas-pessoais"
        element={
          <ProtectedRoute minPortal="mentorada">
            <PersonalMaps />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mapas-pessoais/:id"
        element={
          <ProtectedRoute minPortal="mentorada">
            <PersonalMapEditor />
          </ProtectedRoute>
        }
      />
      
      {/* Legacy routes /salas/ - for backwards compatibility */}
      <Route
        path="/salas/big5"
        element={
          <ProtectedRoute minPortal="mentorada">
            <Big5 />
          </ProtectedRoute>
        }
      />
      <Route
        path="/salas/eneagrama"
        element={
          <ProtectedRoute minPortal="mentorada">
            <Eneagrama />
          </ProtectedRoute>
        }
      />
      <Route
        path="/salas/oraculo-perguntas"
        element={
          <ProtectedRoute minPortal="mentorada">
            <OraculoPerguntas />
          </ProtectedRoute>
        }
      />
      <Route
        path="/salas/mapa-oracula"
        element={
          <ProtectedRoute minPortal="mentorada">
            <MapaOracula />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/chakras"
        element={
          <ProtectedRoute minPortal="mentorada">
            <Chakras />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/hawkins"
        element={
          <ProtectedRoute minPortal="mentorada">
            <Hawkins />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/escala-maia"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <EscalaMAIA />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/antroposofia"
        element={
          <ProtectedRoute minPortal="mentorada">
            <Antroposofia />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/neuroplasticidade"
        element={
          <ProtectedRoute minPortal="mentorada">
            <Neuroplasticidade />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/narrativas"
        element={
          <ProtectedRoute minPortal="mentorada">
            <Narrativas />
          </ProtectedRoute>
        }
      />
      {/* Portal Radiestesia Oracular */}
      <Route
        path="/radiestesia"
        element={
          <ProtectedRoute minPortal="mentorada">
            <RadiestesiaPortal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/radiestesia/leitura"
        element={
          <ProtectedRoute minPortal="mentorada">
            <Leitura5Camadas />
          </ProtectedRoute>
        }
      />
      <Route
        path="/radiestesia/mesa"
        element={
          <ProtectedRoute minPortal="mentorada">
            <MesaRadionica />
          </ProtectedRoute>
        }
      />
      <Route
        path="/radiestesia/graficos"
        element={
          <ProtectedRoute minPortal="mentorada">
            <CatalogoGraficos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/radiestesia/graficos/:slug"
        element={
          <ProtectedRoute minPortal="mentorada">
            <GraficoDetalhe />
          </ProtectedRoute>
        }
      />
      <Route
        path="/radiestesia/pantaculos"
        element={
          <ProtectedRoute minPortal="mentorada">
            <Pantaculos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/radiestesia/cristais"
        element={
          <ProtectedRoute minPortal="mentorada">
            <CristaisCampos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/radiestesia/escala"
        element={
          <ProtectedRoute minPortal="mentorada">
            <EscalaNarrativa />
          </ProtectedRoute>
        }
      />
      <Route
        path="/radiestesia/diario"
        element={
          <ProtectedRoute minPortal="mentorada">
            <DiarioPraticas />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/ferramentas/tarot"
        element={
          <ProtectedRoute minPortal="mentorada">
            <Tarot />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/constelacao"
        element={
          <ProtectedRoute minPortal="mentorada">
            <Constelacao />
          </ProtectedRoute>
        }
      />
      {/* Syntheia - O Templo (primeiro nível) */}
      <Route
        path="/syntheia"
        element={
          <ProtectedRoute minPortal="mentorada">
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
          <ProtectedRoute minPortal="mentorada">
            <AgenteAnalista />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/agente-curador"
        element={
          <ProtectedRoute minPortal="mentorada">
            <AgenteCurador />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/agente-simbolico"
        element={
          <ProtectedRoute minPortal="mentorada">
            <AgenteSimbólico />
          </ProtectedRoute>
        }
      />

      {/* Novas Ferramentas Simbólicas */}
      <Route
        path="/ferramentas/espelho-de-consciencia"
        element={
          <ProtectedRoute minPortal="mentorada">
            <EspelhoConsciencia />
          </ProtectedRoute>
        }
      />
      {/* Legacy redirect */}
      <Route
        path="/ferramentas/espelho-consciencia"
        element={<Navigate to="/ferramentas/espelho-de-consciencia" replace />}
      />
      <Route
        path="/ferramentas/mapa-arquetipos-ego"
        element={
          <ProtectedRoute minPortal="mentorada">
            <MapaArquetiposEgo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/cartografia-torre"
        element={
          <ProtectedRoute minPortal="mentorada">
            <CartografiaTorre />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/plasticidade-psiquica"
        element={
          <ProtectedRoute minPortal="mentorada">
            <PlasticidadePsiquica />
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

      {/* Torre Viva™ - Ferramenta profissional avançada */}
      <Route
        path="/ferramentas/torre-viva"
        element={
          <ProtectedRoute minPortal="oracula">
            <TorreViva />
          </ProtectedRoute>
        }
      />

      {/* Biblioteca de Casos - Vinhetas clínicas para treino */}
      <Route
        path="/biblioteca-casos"
        element={
          <ProtectedRoute minPortal="oracula">
            <BibliotecaCasos />
          </ProtectedRoute>
        }
      />

      {/* Tríade do Método Orácula - Páginas conceituais */}
      <Route
        path="/metodo/portas"
        element={
          <ProtectedRoute minPortal="mentorada">
            <AsPortas />
          </ProtectedRoute>
        }
      />
      <Route
        path="/metodo/campos-psiquicos"
        element={
          <ProtectedRoute minPortal="mentorada">
            <OsCamposPsiquicos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/metodo/torres"
        element={
          <ProtectedRoute minPortal="mentorada">
            <AsTorres />
          </ProtectedRoute>
        }
      />
      <Route
        path="/metodo/triade"
        element={
          <ProtectedRoute minPortal="mentorada">
            <TriadeMetodo />
          </ProtectedRoute>
        }
      />

      <Route
        path="/leitura-oracular"
        element={
          <ProtectedRoute minPortal="oracula">
            <LeituraOracular />
          </ProtectedRoute>
        }
      />
      <Route
        path="/minhas-clientes"
        element={
          <ProtectedRoute minPortal="mentorada">
            <MinhasClientes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cliente/:clienteId"
        element={
          <ProtectedRoute minPortal="mentorada">
            <ClientePerfil />
          </ProtectedRoute>
        }
        />

        {/* Jardim da Psique - Espaço 100% privado */}
        <Route
          path="/jardim-da-psique"
          element={
            <ProtectedRoute>
              <JardimPsique />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jardim-da-psique/:id"
          element={
            <ProtectedRoute>
              <JardimPsiqueDetalhe />
            </ProtectedRoute>
          }
        />
        <Route
          path="/minha-biblioteca"
          element={
            <ProtectedRoute>
              <MinhaBiblioteca />
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
        <Route
          path="/cursos/:courseId/modulo/:moduleId"
          element={
            <ProtectedRoute>
              <CursoModulo />
            </ProtectedRoute>
          }
        />

        {/* Biblioteca das Travessias */}
        <Route
          path="/biblioteca-das-travessias"
          element={
            <ProtectedRoute minPortal="visitante">
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
            <ProtectedRoute minPortal="mentorada">
              <LabirintoHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/labirinto/porta/:portaId"
          element={
            <ProtectedRoute minPortal="mentorada">
              <LabirintoPorta />
            </ProtectedRoute>
          }
        />
        <Route
          path="/labirinto/como-usar"
          element={
            <ProtectedRoute minPortal="mentorada">
              <LabirintoComoUsar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/labirinto/tipos-de-campo"
          element={
            <ProtectedRoute minPortal="mentorada">
              <LabirintoTiposCampo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/labirinto/tabela"
          element={
            <ProtectedRoute minPortal="oracula">
              <LabirintoTabela />
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
        <Route
          path="/notificacoes"
          element={
            <ProtectedRoute>
              <Notificacoes />
            </ProtectedRoute>
          }
        />

        {/* Biblioteca das Travessias - Symbolic Families */}
        <Route
          path="/biblioteca-travessias"
          element={
            <ProtectedRoute>
              <BibliotecaTravessias />
            </ProtectedRoute>
          }
        />
        <Route
          path="/biblioteca-travessias/:familiaSlug"
          element={
            <ProtectedRoute>
              <BibliotecaTravessiasFamilia />
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
