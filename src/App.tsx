import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ServiceWorkerUpdateToast } from "@/components/pwa/ServiceWorkerUpdateToast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation } from "react-router-dom";
import { initRitualSessionTracking, trackRouteForRitual } from "@/hooks/useRitualState";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AdminPreviewProvider, useAdminPreviewOptional } from "@/contexts/AdminPreviewContext";
import { AppDomainProvider } from "@/contexts/AppDomainContext";
import { PortalType, canAccessFeature } from "@/types/portal";
import { useOnboarding } from "@/hooks/useOnboarding";
import { LockedForVisitor } from "@/components/shared/LockedForVisitor";

// Pages
// Landing page removed - route "/" now goes to Auth
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
import OraculaPage from "./pages/OraculaPage";
import PortalOraculaPage from "./pages/PortalOraculaPage";
import OraculaSalesPage from "./pages/OraculaSalesPage";
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
import PlanosClubeOracular from "./pages/PlanosClubeOracular";
import PosCompra from "./pages/PosCompra";
import Assinatura from "./pages/Assinatura";
import Billing from "./pages/Billing";
import MinhaConta from "./pages/MinhaConta";
import Suporte from "./pages/Suporte";
import CheckoutSucesso from "./pages/CheckoutSucesso";
import CheckoutCancelado from "./pages/CheckoutCancelado";
import Audios from "./pages/Audios";
import EstudioOracular from "./pages/EstudioOracular";
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
import CriarFerramenta from "./pages/admin/CriarFerramenta";
import AtelieConteudo from "./pages/admin/AtelieConteudo";
import AdminModulosFormativos from "./pages/admin/AdminModulosFormativos";
import AdminBooks from "./pages/admin/AdminBooks";
import AdminOracleCardsPage from "./pages/admin/AdminOracleCardsPage";
import Big5Simbolico from "./pages/Big5Simbolico";
import Big5Oracular from "./pages/Big5Oracular";
import Big5Funcional from "./pages/Big5Funcional";
import EneagramaFeminino from "./pages/EneagramaFeminino";
import JornadaHeroina from "./pages/JornadaHeroina";
import TorreViva from "./pages/TorreViva";
import AtlasArquetiposFemininos from "./pages/AtlasArquetiposFemininos";
import BibliotecaCasos from "./pages/BibliotecaCasos";
import { AsPortas, OsCamposPsiquicos, AsTorres, TriadeMetodo } from "./pages/metodo";
// FormacaoOracula, FormacaoVivaPage, FormacaoPage - removidos do import direto
// Agora usando OraculaPage como gate e PortalOraculaPage para área interna
import MapaVivoList from "./pages/MapaVivoList";
import MapaVivoEditor from "./pages/MapaVivoEditor";
// Casa das Máquinas
import { CasaDasMaquinas, SessoesPage, GestosIntegracaoPage, MapaVivoClientePage, PainelInstitucionalPage, ClientesPage, ClienteDetailPage, ModoSessaoPage, FerramentasPage, GruposPage, GrupoDetailPage, BibliotecaIntervPage } from "./pages/casa-maquinas";
import PainelClinicoPage from "./pages/casa-maquinas/PainelClinicoPage";
import ModoSessaoImersivo from "./pages/casa-maquinas/ModoSessaoImersivo";
import MapaCidadelaPage from "./pages/casa-maquinas/MapaCidadelaPage";
import RelatorioJornadaPage from "./pages/RelatorioJornadaPage";
import MapaVivoPage from "./pages/MapaVivoPage";
import JornadaAlmaPage from "./pages/JornadaAlmaPage";
import CasaTecelasPage from "./pages/casa-maquinas/CasaTecelasPage";
import AcademiaPage from "./pages/casa-maquinas/AcademiaPage";
import PerfilProfissionalPage from "./pages/casa-maquinas/PerfilProfissionalPage";
import SalaTreinamentoPage from "./pages/SalaTreinamentoPage";
import ComunidadePage from "./pages/ComunidadePage";
import AcademiaFormacaoPage from "./pages/AcademiaFormacaoPage";
import CartografiaPage from "./pages/casa-maquinas/ferramentas/CartografiaPage";
import CartografiaPsiquicaPage from "./pages/CartografiaPsiquicaPage";
import RituaisMudraPage from "./pages/RituaisMudraPage";
import BussolaOniricaPage from "./pages/BussolaOniricaPage";
import TorreVivaPage from "./pages/casa-maquinas/ferramentas/TorreVivaPage";
import LabirintoPage from "./pages/casa-maquinas/ferramentas/LabirintoPage";
import DecodificacaoOniricaPage from "./pages/casa-maquinas/ferramentas/DecodificacaoOniricaPage";
import AtlasArquetiposPage from "./pages/casa-maquinas/ferramentas/AtlasArquetiposPage";
import PlaceholderToolPage from "./pages/casa-maquinas/ferramentas/PlaceholderToolPage";
import SectionPlaceholder from "./pages/casa-maquinas/SectionPlaceholder";

// Jardim do Ofício
import { JardimOficioPage, PainelSupervisaoPage } from "./pages/jardim-oficio";
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
  ClubeLivroPorta,
  ClubeLivroFase, 
  ClubeLivroEscutas, 
  ClubeLivroEncontros,
  ClubeLivroRitual,
  ClubeLivroAula,
  IntegracaoOracular,
  MeuCaminhoClube,
  Integracao8020,
  ClubeLivroLivro,
  MapaJornadas,
  MinhaTravessia,
  CertificadoTravessia,
  
  Lab8020Season,
} from "./pages/clube-livro";
// Labirinto da Heroína Interna®
import { LabirintoHeroinaPage } from "./pages/labirinto-heroina";
import MapaHeroinaPage from "./pages/mapa-heroina";
import CartasJornadaPage from "./pages/CartasJornadaPage";
import PortalJunguiano from "./pages/PortalJunguiano";
import PortalJunguianoPorta from "./pages/PortalJunguianoPorta";
// Novas páginas de navegação simplificada
import ExperienciaGratuita from "./pages/ExperienciaGratuita";

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
  const isPosCompraRoute = location.pathname === '/pos-compra';
  const isAdmin = user?.portal === 'admin';
  const isVisitor = user?.portal === 'visitante';
  
  // FIRST TIME ONLY: Force onboarding if not completed (except if already on /onboarding)
  // Once completed, user NEVER goes back to onboarding
  if (!onboardingCompleted && !isOnboardingRoute && !isAdmin) {
    return <Navigate to="/onboarding" replace />;
  }
  
  // ADMIN ALWAYS has access to admin routes, even in preview mode
  // Preview mode only affects non-admin content visibility
  const isAdminRoute = minPortal === 'admin';
  
  // For admin routes: check ACTUAL portal, not effective portal
  // For other routes: use effective portal (respects preview mode)
  const effectivePortal = preview?.isPreviewMode && preview?.previewPortal && user?.portal === 'admin' && !isAdminRoute
    ? preview.previewPortal
    : user?.portal || 'visitante';
  
  // Check access with appropriate portal
  const hasAccess = canAccessFeature(effectivePortal, minPortal);
  
  // VISITORS: Show blocking component for restricted content (not redirect!)
  // Allowed routes for visitors: /jornada, /sala-da-visitante, /planos, /pos-compra, /onboarding
  if (isVisitor && !isAdmin && !hasAccess && !isPosCompraRoute) {
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
  const location = useLocation();

  // Init session tracking once + track deep routes
  React.useEffect(() => { initRitualSessionTracking(); }, []);
  React.useEffect(() => { trackRouteForRitual(location.pathname); }, [location.pathname]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Auth />
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
      {/* Rotas legadas /formacao-oracula, /formacao-viva, /formacao removidas - usar /oracula */}
      <Route path="/formacao-oracula" element={<Navigate to="/oracula" replace />} />
      <Route path="/formacao-viva" element={<Navigate to="/oracula" replace />} />
      <Route path="/formacao" element={<Navigate to="/oracula" replace />} />
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
        path="/experiencia-gratuita"
        element={
          <ProtectedRoute>
            <ExperienciaGratuita />
          </ProtectedRoute>
        }
      />
      <Route
        path="/comece-aqui"
        element={
          <ProtectedRoute>
            <Navigate to="/sala-da-visitante" replace />
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
      {/* Portal Junguiano — Travessia das 9 Forças da Psique */}
      <Route
        path="/portal-junguiano"
        element={
          <ProtectedRoute minPortal="aluna_formacao">
            <PortalJunguiano />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portal-junguiano/porta/:id"
        element={
          <ProtectedRoute minPortal="aluna_formacao">
            <PortalJunguianoPorta />
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
        element={<Navigate to="/oracula" replace />}
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
      {/* Formação Orácula - Public sales page */}
      <Route
        path="/oracula"
        element={<OraculaPage />}
      />
      {/* Portal interno para alunas matriculadas */}
      <Route
        path="/portal-oracula"
        element={
          <ProtectedRoute minPortal="aluna">
            <PortalOraculaPage />
          </ProtectedRoute>
        }
      />
      {/* Legacy redirect */}
      <Route
        path="/mentoria-oracular"
        element={<OraculaPage />}
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
      
      {/* Labirinto da Heroína Interna® */}
      <Route
        path="/labirinto-heroina"
        element={
          <ProtectedRoute minPortal="aluna_formacao">
            <LabirintoHeroinaPage />
          </ProtectedRoute>
        }
      />
      
      {/* Cartas da Jornada - Oráculo Labirinto da Heroína */}
      <Route
        path="/cartas-jornada"
        element={
          <ProtectedRoute minPortal="pre_iniciada">
            <CartasJornadaPage />
          </ProtectedRoute>
        }
      />
      
      {/* Mapa Pessoal da Heroína */}
      <Route
        path="/mapa-heroina"
        element={
          <ProtectedRoute minPortal="aluna_formacao">
            <MapaHeroinaPage />
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
        path="/clube-livro/mapa-jornadas"
        element={
          <ProtectedRoute minPortal="aluna">
            <MapaJornadas />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clube-livro/minha-travessia"
        element={
          <ProtectedRoute minPortal="aluna">
            <MinhaTravessia />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clube-livro/livro/:id"
        element={
          <ProtectedRoute minPortal="aluna">
            <ClubeLivroLivro />
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
        path="/clube-livro/:id/porta/:portaId"
        element={
          <ProtectedRoute minPortal="aluna">
            <ClubeLivroPorta />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clube-livro/:id/ritual"
        element={
          <ProtectedRoute minPortal="aluna">
            <ClubeLivroRitual />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clube-livro/:id/aula/:aulaId"
        element={
          <ProtectedRoute minPortal="aluna">
            <ClubeLivroAula />
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

      {/* Integração Oracular */}
      <Route
        path="/clube-livro/:id/integracao"
        element={
          <ProtectedRoute minPortal="aluna">
            <IntegracaoOracular />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clube-livro/:id/meu-caminho"
        element={
          <ProtectedRoute minPortal="aluna">
            <MeuCaminhoClube />
          </ProtectedRoute>
        }
      />
      {/* Rota global "Meu Caminho" sem ciclo específico */}
      <Route
        path="/clube-livro/meu-caminho"
        element={
          <ProtectedRoute minPortal="aluna">
            <MeuCaminhoClube />
          </ProtectedRoute>
        }
      />

      {/* Integração 80/20 (legado) */}
      <Route
        path="/clube-livro/:id/integracao-8020"
        element={
          <ProtectedRoute minPortal="aluna">
            <Integracao8020 />
          </ProtectedRoute>
        }
      />
      {/* Lab 80/20 por estação */}
      <Route
        path="/clube-livro/:id/lab-8020"
        element={
          <ProtectedRoute minPortal="aluna">
            <Lab8020Season />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clube-livro/:id/certificado"
        element={
          <ProtectedRoute minPortal="aluna">
            <CertificadoTravessia />
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
        path="/ferramenta/cartografia-psiquica"
        element={
          <ProtectedRoute minPortal="mentorada">
            <CartografiaPsiquicaPage />
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
          <ProtectedRoute minPortal="visitante">
            <Big5 />
          </ProtectedRoute>
        }
      />
      <Route
        path="/salas/eneagrama"
        element={
          <ProtectedRoute minPortal="visitante">
            <Eneagrama />
          </ProtectedRoute>
        }
      />
      <Route
        path="/salas/oraculo-perguntas"
        element={
          <ProtectedRoute minPortal="visitante">
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

        {/* Casa das Máquinas - acesso a partir de certificada (oracula) */}
        <Route
          path="/casa-das-maquinas"
          element={
            <ProtectedRoute minPortal="oracula">
              <CasaDasMaquinas />
            </ProtectedRoute>
          }
        />
        <Route path="/casa-das-maquinas/clientes" element={<ProtectedRoute minPortal="oracula"><ClientesPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/clientes/:clienteId" element={<ProtectedRoute minPortal="oracula"><ClienteDetailPage /></ProtectedRoute>} />
        <Route path="/saas/clientes/:clienteId/mapa-cidadela" element={<ProtectedRoute minPortal="oracula"><MapaCidadelaPage /></ProtectedRoute>} />
        <Route path="/saas/clientes/:clienteId/relatorio-jornada" element={<ProtectedRoute minPortal="oracula"><RelatorioJornadaPage /></ProtectedRoute>} />
        <Route path="/saas/clientes/:clienteId/mapa-vivo" element={<ProtectedRoute minPortal="oracula"><MapaVivoPage /></ProtectedRoute>} />
        <Route path="/saas/clientes/:clienteId/jornada-alma" element={<ProtectedRoute minPortal="aluna_formacao"><JornadaAlmaPage /></ProtectedRoute>} />
        <Route path="/saas/clientes/:clienteId/rituais-mudra" element={<ProtectedRoute minPortal="aluna_formacao"><RituaisMudraPage /></ProtectedRoute>} />
        <Route path="/saas/clientes/:clienteId/bussola-onirica" element={<ProtectedRoute minPortal="aluna_formacao"><BussolaOniricaPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/nova-sessao" element={<ProtectedRoute minPortal="oracula"><ModoSessaoPage /></ProtectedRoute>} />
        <Route path="/saas/sessao/:clienteId" element={<ProtectedRoute minPortal="oracula"><ModoSessaoImersivo /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas" element={<ProtectedRoute minPortal="oracula"><FerramentasPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/grupos" element={<ProtectedRoute minPortal="oracula"><GruposPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/grupos/:groupId" element={<ProtectedRoute minPortal="oracula"><GrupoDetailPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/biblioteca" element={<ProtectedRoute minPortal="oracula"><BibliotecaIntervPage /></ProtectedRoute>} />
        <Route path="/saas/biblioteca" element={<ProtectedRoute minPortal="oracula"><BibliotecaIntervPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/tecelãs" element={<ProtectedRoute minPortal="aluna"><CasaTecelasPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/academia" element={<ProtectedRoute minPortal="oracula"><AcademiaPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/perfil-profissional" element={<ProtectedRoute minPortal="oracula"><PerfilProfissionalPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/treinamento" element={<ProtectedRoute minPortal="aluna_formacao"><SalaTreinamentoPage /></ProtectedRoute>} />
        <Route path="/treinamento" element={<ProtectedRoute minPortal="aluna_formacao"><SalaTreinamentoPage /></ProtectedRoute>} />
        <Route path="/comunidade" element={<ProtectedRoute minPortal="aluna_formacao"><ComunidadePage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/comunidade" element={<ProtectedRoute minPortal="aluna_formacao"><ComunidadePage /></ProtectedRoute>} />
        <Route path="/academia" element={<ProtectedRoute minPortal="aluna_formacao"><AcademiaFormacaoPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/academia-formacao" element={<ProtectedRoute minPortal="aluna_formacao"><AcademiaFormacaoPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/cartografia" element={<ProtectedRoute minPortal="oracula"><CartografiaPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/torre-viva" element={<ProtectedRoute minPortal="oracula"><TorreVivaPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/labirinto" element={<ProtectedRoute minPortal="oracula"><LabirintoPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/decodificacao-onirica" element={<ProtectedRoute minPortal="oracula"><DecodificacaoOniricaPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/atlas-arquetipos" element={<ProtectedRoute minPortal="oracula"><AtlasArquetiposPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/escrita-simbolica" element={<ProtectedRoute minPortal="oracula"><PlaceholderToolPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/espelho-relacional" element={<ProtectedRoute minPortal="oracula"><PlaceholderToolPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/ritual-simbolico" element={<ProtectedRoute minPortal="oracula"><PlaceholderToolPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/dialogo-partes" element={<ProtectedRoute minPortal="oracula"><PlaceholderToolPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/mapa-transformacao" element={<ProtectedRoute minPortal="oracula"><PlaceholderToolPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/ritual-passagem" element={<ProtectedRoute minPortal="oracula"><PlaceholderToolPage /></ProtectedRoute>} />
        <Route
          path="/casa-das-maquinas/sessoes"
          element={
            <ProtectedRoute minPortal="oracula">
              <SessoesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/casa-das-maquinas/gestos"
          element={
            <ProtectedRoute minPortal="oracula">
              <GestosIntegracaoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/casa-das-maquinas/mapa-vivo/:clienteId"
          element={
            <ProtectedRoute minPortal="oracula">
              <MapaVivoClientePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/casa-das-maquinas/painel"
          element={
            <ProtectedRoute minPortal="admin">
              <PainelInstitucionalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/casa-das-maquinas/painel-clinico"
          element={
            <ProtectedRoute minPortal="oracula">
              <PainelClinicoPage />
            </ProtectedRoute>
          }
        />
        

        {/* Jardim do Ofício */}
        <Route
          path="/casa-das-maquinas/jardim-oficio"
          element={
            <ProtectedRoute minPortal="oracula">
              <JardimOficioPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/casa-das-maquinas/supervisao"
          element={
            <ProtectedRoute minPortal="assinante">
              <PainelSupervisaoPage />
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
        
        {/* Admin - Criar Ferramenta Padronizada */}
        <Route
          path="/admin/ferramentas/criar"
          element={
            <ProtectedRoute minPortal="admin">
              <CriarFerramenta />
            </ProtectedRoute>
          }
        />
        
        {/* Admin - Ateliê de Conteúdo */}
        <Route
          path="/admin/atelie-conteudo"
          element={
            <ProtectedRoute minPortal="admin">
              <AtelieConteudo />
            </ProtectedRoute>
          }
        />

        {/* Admin - Módulos Formativos (Vitrine) */}
        <Route
          path="/admin/modulos-formativos"
          element={
            <ProtectedRoute minPortal="admin">
              <AdminModulosFormativos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/books"
          element={
            <ProtectedRoute minPortal="admin">
              <AdminBooks />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/oracle-cards" element={<ProtectedRoute minPortal="admin"><AdminOracleCardsPage /></ProtectedRoute>} />

        <Route
          path="/estudio-oracular"
          element={
            <ProtectedRoute>
              <EstudioOracular />
            </ProtectedRoute>
          }
        />

        {/* Planos e Assinatura */}
        <Route path="/planos" element={<Planos />} />
        <Route path="/planos-clube" element={<PlanosClubeOracular />} />
        <Route 
          path="/pos-compra" 
          element={
            <ProtectedRoute>
              <PosCompra />
            </ProtectedRoute>
          } 
        />
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
        <Route
          path="/minha-conta"
          element={
            <ProtectedRoute>
              <MinhaConta />
            </ProtectedRoute>
          }
        />
        <Route
          path="/suporte"
          element={
            <ProtectedRoute>
              <Suporte />
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
      {import.meta.env.PROD && <ServiceWorkerUpdateToast />}
      <BrowserRouter>
        <AuthProvider>
          <AdminPreviewProvider>
            <AppDomainProvider>
              <AppRoutes />
            </AppDomainProvider>
          </AdminPreviewProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
