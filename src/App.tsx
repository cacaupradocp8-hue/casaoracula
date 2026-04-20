import React from "react"; // rebuild-trigger-v8

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ServiceWorkerUpdateToast } from "@/components/pwa/ServiceWorkerUpdateToast";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation } from "react-router-dom";
import RedirectWithParams from "@/components/routing/RedirectWithParams";
import { initRitualSessionTracking, trackRouteForRitual } from "@/hooks/useRitualState";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AdminPreviewProvider, useAdminPreviewOptional } from "@/contexts/AdminPreviewContext";
import { AppDomainProvider } from "@/contexts/AppDomainContext";
import { PortalType, canAccessFeature } from "@/types/portal";
import { useOnboarding } from "@/hooks/useOnboarding";
import { LockedForVisitor } from "@/components/shared/LockedForVisitor";
import { BootLoadingScreen } from "@/components/shared/BootLoadingScreen";
import { useRouteGuard } from "@/hooks/auth/useRouteGuard";

import { Suspense } from "react";

// Extracted route groups
import { renderCasaMaquinasRoutes } from "@/routes/casaMaquinasRoutes";
import { renderClubeRoutes } from "@/routes/clubeRoutes";
import { renderAdminRoutes } from "@/routes/adminRoutes";

// Only Auth and NotFound are eagerly loaded (critical path)
import Auth from "./pages/Auth";
// Dashboard and DashboardMembro kept as files but not directly routed — DashboardReorganizado is the active dashboard
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import SalaDaVisitante from "./pages/SalaDaVisitante";

function OracleRedirect({ suffix = '' }: { suffix?: string }) {
  const { oracleSlug } = useParams();
  return <Navigate to={`/oraculos/${oracleSlug}${suffix}`} replace />;
}

// Lazy-loaded pages
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const Welcome = React.lazy(() => import("./pages/Welcome"));
const BibliotecaUnificada = React.lazy(() => import("./pages/BibliotecaUnificada"));
const Mentoria = React.lazy(() => import("./pages/Mentoria"));
const CasaTecelaAtrio = React.lazy(() => import("./pages/CasaTecelaAtrio"));
const CasaTecelaInterior = React.lazy(() => import("./pages/CasaTecelaInterior"));
const CirculoOracularPage = React.lazy(() => import("./pages/CirculoOracularPage"));
const HeroinaAppPage = React.lazy(() => import("./pages/HeroinaAppPage"));
const JardimHeroinaClientePage = React.lazy(() => import("./pages/JardimHeroinaClientePage"));
const JardimHeroina = React.lazy(() => import("./pages/JardimHeroina"));
const AceitarConvitePage = React.lazy(() => import("./pages/AceitarConvitePage"));
const OraculaPage = React.lazy(() => import("./pages/OraculaPage"));
const PortalOraculaPage = React.lazy(() => import("./pages/PortalOraculaPage"));
const Travessias = React.lazy(() => import("./pages/Travessias"));
const Agentes = React.lazy(() => import("./pages/Agentes"));
const LeituraOracular = React.lazy(() => import("./pages/LeituraOracular"));
const EspelhoConsciencia = React.lazy(() => import("./pages/salas/EspelhoConsciencia"));
const MapaArquetiposEgo = React.lazy(() => import("./pages/salas/MapaArquetiposEgo"));
const CartografiaTorre = React.lazy(() => import("./pages/salas/CartografiaTorre"));
const PlasticidadePsiquica = React.lazy(() => import("./pages/salas/PlasticidadePsiquica"));
const SalasList = React.lazy(() => import("./pages/SalasList"));
const FerramentasHub = React.lazy(() => import("./pages/FerramentasHub"));
const SalaDetalhe = React.lazy(() => import("./pages/SalaDetalhe"));
const PortalDetalhe = React.lazy(() => import("./pages/PortalDetalhe"));
const AulaPage = React.lazy(() => import("./pages/AulaPage"));
const LaboratorioLeitura = React.lazy(() => import("./pages/LaboratorioLeitura"));
const Metodo = React.lazy(() => import("./pages/Metodo"));
const Portais = React.lazy(() => import("./pages/Portais"));
const ConfirmarProfissional = React.lazy(() => import("./pages/ConfirmarProfissional"));
const MinhasClientes = React.lazy(() => import("./pages/MinhasClientes"));
const MapaOracula = React.lazy(() => import("./pages/MapaOracula"));
const QuizPage = React.lazy(() => import("./pages/QuizPage"));
const ClientePerfil = React.lazy(() => import("./pages/ClientePerfil"));
const Oraculos = React.lazy(() => import("./pages/Oraculos"));
const OracleHome = React.lazy(() => import("./pages/OracleHome"));
const OracleDraw = React.lazy(() => import("./pages/OracleDraw"));
const OracleHistory = React.lazy(() => import("./pages/OracleHistory"));
const OracleCardLibrary = React.lazy(() => import("./pages/OracleCardLibrary"));
const Cursos = React.lazy(() => import("./pages/Cursos"));
const CursoDetalhe = React.lazy(() => import("./pages/CursoDetalhe"));
const CursoAula = React.lazy(() => import("./pages/CursoAula"));
const CursoModulo = React.lazy(() => import("./pages/CursoModulo"));
const BibliotecaTravessiaDetalhe = React.lazy(() => import("./pages/BibliotecaTravessiaDetalhe"));
const LabirintoHome = React.lazy(() => import("./pages/labirinto/LabirintoHome"));
const LabirintoPorta = React.lazy(() => import("./pages/labirinto/LabirintoPorta"));
const LabirintoComoUsar = React.lazy(() => import("./pages/labirinto/LabirintoComoUsar"));
const LabirintoTiposCampo = React.lazy(() => import("./pages/labirinto/LabirintoTiposCampo"));
const LabirintoTabela = React.lazy(() => import("./pages/labirinto/LabirintoTabela"));
const InstallApp = React.lazy(() => import("./pages/InstallApp"));
const Planos = React.lazy(() => import("./pages/Planos"));
const MinhaConta = React.lazy(() => import("./pages/MinhaConta"));
const Suporte = React.lazy(() => import("./pages/Suporte"));
const CheckoutSucesso = React.lazy(() => import("./pages/CheckoutSucesso"));
const ConviteClube = React.lazy(() => import("./pages/ConviteClube"));
const CheckoutCancelado = React.lazy(() => import("./pages/CheckoutCancelado"));
const Audios = React.lazy(() => import("./pages/Audios"));
const TemploEscuta = React.lazy(() => import("./pages/TemploEscuta"));
const EstudioOracular = React.lazy(() => import("./pages/EstudioOracular"));
const Notificacoes = React.lazy(() => import("./pages/Notificacoes"));
const Big5 = React.lazy(() => import("./pages/salas/Big5"));
const Eneagrama = React.lazy(() => import("./pages/salas/Eneagrama"));
const OraculoPerguntas = React.lazy(() => import("./pages/salas/OraculoPerguntas"));
const Chakras = React.lazy(() => import("./pages/salas/Chakras"));
const Hawkins = React.lazy(() => import("./pages/salas/Hawkins"));
const EscalaMAIA = React.lazy(() => import("./pages/salas/EscalaMAIA"));
const Antroposofia = React.lazy(() => import("./pages/salas/Antroposofia"));
const Neuroplasticidade = React.lazy(() => import("./pages/salas/Neuroplasticidade"));
const Narrativas = React.lazy(() => import("./pages/salas/Narrativas"));
const Tarot = React.lazy(() => import("./pages/salas/Tarot"));
const Constelacao = React.lazy(() => import("./pages/salas/Constelacao"));
const Syntheia = React.lazy(() => import("./pages/Syntheia"));
const FerramentaDinamica = React.lazy(() => import("./pages/FerramentaDinamica"));
const Canteiro = React.lazy(() => import("./pages/Canteiro"));
const Big5Simbolico = React.lazy(() => import("./pages/Big5Simbolico"));
const Big5Funcional = React.lazy(() => import("./pages/Big5Funcional"));
const EneagramaFeminino = React.lazy(() => import("./pages/EneagramaFeminino"));
const JornadaHeroina = React.lazy(() => import("./pages/JornadaHeroina"));
const TorreViva = React.lazy(() => import("./pages/TorreViva"));
const AtlasArquetiposFemininos = React.lazy(() => import("./pages/AtlasArquetiposFemininos"));
const MapaVivoList = React.lazy(() => import("./pages/MapaVivoList"));
const MapaVivoEditor = React.lazy(() => import("./pages/MapaVivoEditor"));
const CartografiaPsiquicaPage = React.lazy(() => import("./pages/CartografiaPsiquicaPage"));
const RevelacaoCidadelaPage = React.lazy(() => import("./pages/RevelacaoCidadelaPage"));
const SalaDeTreinamentoPage = React.lazy(() => import("./pages/SalaDeTreinamentoPage"));
const ComunidadePage = React.lazy(() => import("./pages/ComunidadePage"));
const AcademiaFormacaoPage = React.lazy(() => import("./pages/AcademiaFormacaoPage"));
const FormacaoMetodoPage = React.lazy(() => import("./pages/FormacaoMetodoPage"));
const FormacaoForumPage = React.lazy(() => import("./pages/FormacaoForumPage"));
const FormacaoAvaliacoesPage = React.lazy(() => import("./pages/FormacaoAvaliacoesPage"));
const BottomNavTestPage = React.lazy(() => import("./pages/BottomNavTestPage"));
const SessionRoomHome = React.lazy(() => import("./pages/SessionRoomHome"));
const SessionRoomCase = React.lazy(() => import("./pages/SessionRoomCase"));
const SessionRoomGroup = React.lazy(() => import("./pages/SessionRoomGroup"));
const ManuaisProtocolo = React.lazy(() => import("./pages/ManuaisProtocolo"));
const RoteirosProtocolo = React.lazy(() => import("./pages/RoteirosProtocolo"));
const Big5TemplateList = React.lazy(() => import("./pages/templates/Big5TemplateList"));
const Big5TemplateEditor = React.lazy(() => import("./pages/templates/Big5TemplateEditor"));
const EnneagramTemplateList = React.lazy(() => import("./pages/templates/EnneagramTemplateList"));
const EnneagramTemplateEditor = React.lazy(() => import("./pages/templates/EnneagramTemplateEditor"));
const TarotTemplateList = React.lazy(() => import("./pages/templates/TarotTemplateList"));
const TarotTemplateEditor = React.lazy(() => import("./pages/templates/TarotTemplateEditor"));
const ConstellationTemplateList = React.lazy(() => import("./pages/templates/ConstellationTemplateList"));
const ConstellationTemplateEditor = React.lazy(() => import("./pages/templates/ConstellationTemplateEditor"));
const PersonalMaps = React.lazy(() => import("./pages/PersonalMaps"));
const PersonalMapEditor = React.lazy(() => import("./pages/PersonalMapEditor"));
const JardimPsique = React.lazy(() => import("./pages/JardimPsique"));
const JardimPsiqueDetalhe = React.lazy(() => import("./pages/JardimPsiqueDetalhe"));
const TravessiaDetalhe = React.lazy(() => import("./pages/TravessiaDetalhe"));
const NarroterapiaHub = React.lazy(() => import("./pages/NarroterapiaHub"));
const BibliotecaContos = React.lazy(() => import("./pages/narroterapia/BibliotecaContos"));
const BibliotecaClinica = React.lazy(() => import("./pages/narroterapia/BibliotecaClinica"));
const ContoClinicoDetalhe = React.lazy(() => import("./pages/narroterapia/ContoClinicoDetalhe"));
const AudiosNarracao = React.lazy(() => import("./pages/narroterapia/AudiosNarracao"));
const RitualAutorizacao = React.lazy(() => import("./pages/narroterapia/RitualAutorizacao"));
const BibliotecaTravessiasFamilia = React.lazy(() => import("./pages/BibliotecaTravessiasFamilia"));
const MapaHeroinaPage = React.lazy(() => import("./pages/mapa-heroina"));
const CartasJornadaPage = React.lazy(() => import("./pages/CartasJornadaPage"));
const PortalJunguiano = React.lazy(() => import("./pages/PortalJunguiano"));
const PortalJunguianoPorta = React.lazy(() => import("./pages/PortalJunguianoPorta"));
const MapaCasaOracula = React.lazy(() => import("./pages/MapaCasaOracula"));
const MinhaJornada = React.lazy(() => import("./pages/MinhaJornada"));
const ExplorarACasa = React.lazy(() => import("./pages/ExplorarACasa"));
const Vitrine = React.lazy(() => import("./pages/FerramentasVitrine"));
const DashboardMembro = React.lazy(() => import("./pages/DashboardMembro"));
const PosCompra = React.lazy(() => import("./pages/PosCompra"));
const CasaAtrio = React.lazy(() => import("./pages/casa/CasaAtrio"));
const CasaSustentacao = React.lazy(() => import("./pages/casa/CasaSustentacao"));
const CasaLeitura = React.lazy(() => import("./pages/casa/CasaLeitura"));
const CasaCirculo = React.lazy(() => import("./pages/casa/CasaCirculo"));
const RadiestesiaPortal = React.lazy(() => import("./pages/radiestesia/RadiestesiaPortal"));
const Leitura5Camadas = React.lazy(() => import("./pages/radiestesia/Leitura5Camadas"));
const MesaRadionica = React.lazy(() => import("./pages/radiestesia/MesaRadionica"));
const CatalogoGraficos = React.lazy(() => import("./pages/radiestesia/CatalogoGraficos"));
const GraficoDetalhe = React.lazy(() => import("./pages/radiestesia/GraficoDetalhe"));
const Pantaculos = React.lazy(() => import("./pages/radiestesia/Pantaculos"));
const CristaisCampos = React.lazy(() => import("./pages/radiestesia/CristaisCampos"));
const EscalaNarrativa = React.lazy(() => import("./pages/radiestesia/EscalaNarrativa"));
const DiarioPraticas = React.lazy(() => import("./pages/radiestesia/DiarioPraticas"));
const AsPortas = React.lazy(() => import("./pages/metodo/AsPortas"));
const OsCamposPsiquicos = React.lazy(() => import("./pages/metodo/OsCamposPsiquicos"));
const AsTorres = React.lazy(() => import("./pages/metodo/AsTorres"));
const TriadeMetodo = React.lazy(() => import("./pages/metodo/TriadeMetodo"));
const LabirintoHeroinaPage = React.lazy(() => import("./pages/labirinto-heroina/LabirintoHeroinaPraticoPage"));
const DesbloqueiePage = React.lazy(() => import("./pages/DesbloqueiePage"));

// ─── Utility components ───────────────────────────────────────

function AuthLoading() {
  return <BootLoadingScreen />;
}

function AppRouteError({ title, message }: { title: string; message: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-center space-y-4">
        <h1 className="text-xl font-semibold text-destructive">{title}</h1>
        <p className="text-sm text-destructive/90">{message}</p>
        <button type="button" onClick={() => window.location.reload()} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          Recarregar app
        </button>
      </div>
    </div>
  );
}

// ─── Error boundaries ─────────────────────────────────────────

interface RootErrorBoundaryState { hasError: boolean; errorMessage: string | null; }

class RootErrorBoundary extends React.Component<{ children: React.ReactNode }, RootErrorBoundaryState> {
  state: RootErrorBoundaryState = { hasError: false, errorMessage: null };
  static getDerivedStateFromError(error: Error): RootErrorBoundaryState {
    return { hasError: true, errorMessage: error?.message || 'Ocorreu um erro inesperado.' };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) { console.error('[root-error-boundary]', error, info); }
  render() {
    if (!this.state.hasError) return this.props.children;
    return <AppRouteError title="Aconteceu um erro na abertura" message={this.state.errorMessage || 'Erro desconhecido.'} />;
  }
}

// ─── Route guards ─────────────────────────────────────────────

function ProtectedRoute({ children, minPortal = "visitante" }: { children: React.ReactNode; minPortal?: PortalType }) {
  const result = useRouteGuard(minPortal);
  if (result.status === 'loading') return <AuthLoading />;
  if (result.status === 'error') return <AppRouteError title="Erro na autenticação" message={result.errorMessage} />;
  if (result.status === 'redirect') return <Navigate to={result.to} replace />;
  if (result.status === 'locked-visitor') return <LockedForVisitor />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user, isAuthReady, authError } = useAuth();
  const location = useLocation();
  const isAdmin = user?.portal === 'admin';
  const isVisitor = user?.portal === 'visitante';
  const shouldSkipOnboarding = !isAuthenticated || isAdmin || isVisitor;
  const { onboardingCompleted, isLoading: onboardingLoading, error: onboardingError } = useOnboarding({ enabled: !shouldSkipOnboarding });

  if (!isAuthReady || isLoading) return <AuthLoading />;
  if (authError) return <AppRouteError title="Erro na autenticação" message={authError} />;
  if (!isAuthenticated) return <>{children}</>;
  if (!shouldSkipOnboarding && onboardingLoading) return <AuthLoading />;
  if (!onboardingCompleted && !onboardingError && !isAdmin && !isVisitor) return <Navigate to="/onboarding" replace />;

  const destination = user?.portal === 'visitante' ? '/sala-da-visitante' : '/dashboard-membro';
  return <Navigate to={destination} replace />;
}

function LegacyCursoRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/cursos/${id}`} replace />;
}
function LegacyAulaRedirect() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  return <Navigate to={`/cursos/${courseId}/aula/${lessonId}`} replace />;
}

// ─── Main routes ──────────────────────────────────────────────

function AppRoutes() {
  const location = useLocation();

  React.useEffect(() => {
    console.info('[boot-debug][routes] AppRoutes montado');
    window.dispatchEvent(new Event('lovable:app-mounted'));
    initRitualSessionTracking();
  }, []);

  React.useEffect(() => {
    console.info('[boot-debug][routes] navegação detectada', { pathname: location.pathname });
    trackRouteForRitual(location.pathname);
  }, [location.pathname]);

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<PublicRoute><Auth /></PublicRoute>} />
      <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/install" element={<InstallApp />} />
      <Route path="/formacao-oracula" element={<Navigate to="/oracula" replace />} />
      <Route path="/formacao-viva" element={<Navigate to="/oracula" replace />} />
      <Route path="/formacao" element={<Navigate to="/cursos" replace />} />
      <Route path="/tour" element={<Navigate to="/mapa-casa" replace />} />
      <Route path="/explorar-a-casa" element={<ExplorarACasa />} />
      <Route path="/vitrine" element={<Vitrine />} />
      <Route path="/desbloqueie" element={<DesbloqueiePage />} />

      {/* Onboarding & Visitor */}
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/sala-da-visitante" element={<ProtectedRoute><SalaDaVisitante /></ProtectedRoute>} />

      {/* Core navigation */}
      <Route path="/welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
      <Route path="/jornada" element={<ProtectedRoute><Navigate to="/minha-jornada" replace /></ProtectedRoute>} />
      <Route path="/mapa-casa" element={<ProtectedRoute><MapaCasaOracula /></ProtectedRoute>} />
      <Route path="/minha-jornada" element={<ProtectedRoute><MinhaJornada /></ProtectedRoute>} />
      <Route path="/comece-aqui" element={<ProtectedRoute><Navigate to="/sala-da-visitante" replace /></ProtectedRoute>} />
      <Route path="/convite-clube" element={<ProtectedRoute><ConviteClube /></ProtectedRoute>} />
      <Route path="/convite-clube-oracular" element={<ProtectedRoute><ConviteClube /></ProtectedRoute>} />
      <Route path="/experiencia-gratuita" element={<ProtectedRoute><Navigate to="/quiz/descubra-seu-eixo" replace /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Navigate to="/dashboard-membro" replace /></ProtectedRoute>} />
      <Route path="/dashboard-membro" element={<ProtectedRoute><DashboardMembro /></ProtectedRoute>} />
      {/* /clube is handled by clubeRoutes */}
      <Route path="/salas/:id" element={<ProtectedRoute><SalaDetalhe /></ProtectedRoute>} />
      <Route path="/portal/:id" element={<ProtectedRoute><PortalDetalhe /></ProtectedRoute>} />
      <Route path="/aulas/:id" element={<ProtectedRoute><AulaPage /></ProtectedRoute>} />

      {/* Travessias & Portais */}
      <Route path="/travessias" element={<ProtectedRoute><Travessias /></ProtectedRoute>} />
      <Route path="/travessia/:slug" element={<ProtectedRoute><TravessiaDetalhe /></ProtectedRoute>} />
      <Route path="/portais" element={<ProtectedRoute><Portais /></ProtectedRoute>} />
      <Route path="/portal-junguiano" element={<ProtectedRoute minPortal="aluna_formacao"><PortalJunguiano /></ProtectedRoute>} />
      <Route path="/portal-junguiano/porta/:id" element={<ProtectedRoute minPortal="aluna_formacao"><PortalJunguianoPorta /></ProtectedRoute>} />

      {/* Profissional */}
      <Route path="/confirmar-profissional" element={<ProtectedRoute><ConfirmarProfissional /></ProtectedRoute>} />
      <Route path="/mentoria" element={<Navigate to="/oracula" replace />} />
      <Route path="/casa-tecelas" element={<ProtectedRoute minPortal="oracula"><CasaTecelaAtrio /></ProtectedRoute>} />
      <Route path="/casa-tecelas/interior" element={<ProtectedRoute minPortal="oracula"><CasaTecelaInterior /></ProtectedRoute>} />
      <Route path="/circulo-oracular" element={<ProtectedRoute minPortal="assinante"><CirculoOracularPage /></ProtectedRoute>} />
      <Route path="/jardim-heroina-app" element={<Navigate to="/meu-jardim" replace />} />
      <Route path="/meu-jardim" element={<ProtectedRoute><JardimHeroinaClientePage /></ProtectedRoute>} />
      <Route path="/jardim" element={<ProtectedRoute><JardimHeroina /></ProtectedRoute>} />
      <Route path="/aceitar-convite" element={<Suspense fallback={<BootLoadingScreen />}><AceitarConvitePage /></Suspense>} />

      {/* Casa Orácula rooms */}
      <Route path="/casa" element={<ProtectedRoute minPortal="oracula"><CasaAtrio /></ProtectedRoute>} />
      <Route path="/casa/sustentacao" element={<ProtectedRoute minPortal="oracula"><CasaSustentacao /></ProtectedRoute>} />
      <Route path="/casa/leitura" element={<ProtectedRoute minPortal="oracula"><CasaLeitura /></ProtectedRoute>} />
      <Route path="/casa/circulo" element={<ProtectedRoute minPortal="oracula"><CasaCirculo /></ProtectedRoute>} />
      <Route path="/casa/jardim" element={<Navigate to="/jardim-da-psique" replace />} />
      <Route path="/casa/jardim/:id" element={<RedirectWithParams to="/jardim-da-psique/:id" />} />

      {/* Orácula */}
      <Route path="/oracula" element={<OraculaPage />} />
      <Route path="/portal-oracula" element={<ProtectedRoute minPortal="aluna"><PortalOraculaPage /></ProtectedRoute>} />
      <Route path="/mentoria-oracular" element={<OraculaPage />} />
      <Route path="/metodo" element={<ProtectedRoute><Metodo /></ProtectedRoute>} />
      <Route path="/ferramentas-metodo" element={<ProtectedRoute><Navigate to="/ferramentas" replace /></ProtectedRoute>} />
      <Route path="/sala-do-metodo" element={<ProtectedRoute><Navigate to="/ferramentas" replace /></ProtectedRoute>} />

      {/* Labirinto da Heroína */}
      <Route path="/labirinto-heroina" element={<ProtectedRoute minPortal="aluna_formacao"><LabirintoHeroinaPage /></ProtectedRoute>} />
      <Route path="/cartas-jornada" element={<ProtectedRoute minPortal="pre_iniciada"><CartasJornadaPage /></ProtectedRoute>} />
      <Route path="/mapa-heroina" element={<ProtectedRoute minPortal="aluna_formacao"><MapaHeroinaPage /></ProtectedRoute>} />

      {/* Narroterapia */}
      <Route path="/narroterapia" element={<ProtectedRoute><NarroterapiaHub /></ProtectedRoute>} />
      <Route path="/narroterapia/biblioteca-contos" element={<ProtectedRoute><BibliotecaContos /></ProtectedRoute>} />
      <Route path="/narroterapia/clinica" element={<ProtectedRoute minPortal="aluna_formacao"><BibliotecaClinica /></ProtectedRoute>} />
      <Route path="/narroterapia/clinica/:slug" element={<ProtectedRoute minPortal="aluna_formacao"><ContoClinicoDetalhe /></ProtectedRoute>} />
      <Route path="/narroterapia/ritual" element={<ProtectedRoute minPortal="aluna_formacao"><RitualAutorizacao /></ProtectedRoute>} />
      <Route path="/narroterapia/audios" element={<ProtectedRoute minPortal="aluna_formacao"><AudiosNarracao /></ProtectedRoute>} />

      {/* ═══ Clube do Livro (extracted) ═══ */}
      {renderClubeRoutes(ProtectedRoute)}

      {/* Biblioteca & Ferramentas */}
      <Route path="/biblioteca" element={<ProtectedRoute><BibliotecaUnificada /></ProtectedRoute>} />
      <Route path="/laboratorio-leitura" element={<ProtectedRoute minPortal="mentorada"><LaboratorioLeitura /></ProtectedRoute>} />
      <Route path="/agentes" element={<ProtectedRoute minPortal="mentorada"><Agentes /></ProtectedRoute>} />
      <Route path="/salas" element={<ProtectedRoute><Navigate to="/mapa-casa" replace /></ProtectedRoute>} />
      <Route path="/ferramentas" element={<ProtectedRoute><FerramentasHub /></ProtectedRoute>} />
      <Route path="/ferramentas-vitrine" element={<ProtectedRoute><Navigate to="/ferramentas" replace /></ProtectedRoute>} />

      {/* Session Room */}
      <Route path="/session-room" element={<ProtectedRoute minPortal="mentorada"><SessionRoomHome /></ProtectedRoute>} />
      <Route path="/session-room/:caseId" element={<ProtectedRoute minPortal="mentorada"><SessionRoomCase /></ProtectedRoute>} />
      <Route path="/session-room/group/:groupId" element={<ProtectedRoute minPortal="mentorada"><SessionRoomGroup /></ProtectedRoute>} />
      <Route path="/session-room/manuais" element={<ProtectedRoute minPortal="mentorada"><ManuaisProtocolo /></ProtectedRoute>} />
      <Route path="/session-room/roteiros" element={<ProtectedRoute minPortal="mentorada"><RoteirosProtocolo /></ProtectedRoute>} />
      <Route path="/atlas-arquetipos" element={<ProtectedRoute minPortal="oracula"><AtlasArquetiposFemininos /></ProtectedRoute>} />
      <Route path="/ferramentas/sala-de-sessao" element={<Navigate to="/session-room" replace />} />
      <Route path="/ferramentas/mapa-vivo" element={<ProtectedRoute minPortal="mentorada"><MapaVivoList /></ProtectedRoute>} />
      <Route path="/ferramentas/mapa-vivo/:id" element={<ProtectedRoute minPortal="mentorada"><MapaVivoEditor /></ProtectedRoute>} />

      {/* Ferramentas individuais */}
      <Route path="/ferramentas/big5" element={<ProtectedRoute minPortal="mentorada"><Big5 /></ProtectedRoute>} />
      <Route path="/ferramenta/big5-simbolico" element={<ProtectedRoute minPortal="mentorada"><Big5Simbolico /></ProtectedRoute>} />
      <Route path="/ferramenta/cartografia-psiquica-oracula" element={<ProtectedRoute minPortal="visitante"><CartografiaPsiquicaPage /></ProtectedRoute>} />
      <Route path="/ferramenta/big5-oracular" element={<Navigate to="/ferramenta/cartografia-psiquica-oracula" replace />} />
      <Route path="/ferramenta/big5-funcional" element={<ProtectedRoute minPortal="mentorada"><Big5Funcional /></ProtectedRoute>} />
      <Route path="/ferramentas/eneagrama" element={<ProtectedRoute minPortal="mentorada"><Eneagrama /></ProtectedRoute>} />
      <Route path="/ferramenta/eneagrama-feminino" element={<ProtectedRoute minPortal="mentorada"><EneagramaFeminino /></ProtectedRoute>} />
      <Route path="/ferramenta/jornada-heroina" element={<ProtectedRoute minPortal="mentorada"><JornadaHeroina /></ProtectedRoute>} />
      <Route path="/ferramenta/cartografia-psiquica" element={<Navigate to="/ferramenta/cartografia-psiquica-oracula" replace />} />
      <Route path="/cartografia-psiquica" element={<Navigate to="/ferramenta/cartografia-psiquica-oracula" replace />} />
      <Route path="/ferramentas/cartografia-psiquica-oracula" element={<Navigate to="/ferramenta/cartografia-psiquica-oracula" replace />} />
      <Route path="/cidadela/revelacao" element={<Navigate to="/revelacao-cidadela" replace />} />
      <Route path="/revelacao-cidadela" element={<ProtectedRoute minPortal="visitante"><RevelacaoCidadelaPage /></ProtectedRoute>} />
      <Route path="/ferramentas/oraculo-perguntas" element={<ProtectedRoute minPortal="mentorada"><OraculoPerguntas /></ProtectedRoute>} />
      <Route path="/ferramentas/mapa-oracula" element={<ProtectedRoute minPortal="mentorada"><MapaOracula /></ProtectedRoute>} />

      {/* Symbolic Templates */}
      <Route path="/templates/big5" element={<ProtectedRoute minPortal="mentorada"><Big5TemplateList /></ProtectedRoute>} />
      <Route path="/templates/big5/:sessionId" element={<ProtectedRoute minPortal="mentorada"><Big5TemplateEditor /></ProtectedRoute>} />
      <Route path="/templates/enneagram" element={<ProtectedRoute minPortal="mentorada"><EnneagramTemplateList /></ProtectedRoute>} />
      <Route path="/templates/enneagram/:sessionId" element={<ProtectedRoute minPortal="mentorada"><EnneagramTemplateEditor /></ProtectedRoute>} />
      <Route path="/templates/tarot" element={<ProtectedRoute minPortal="mentorada"><TarotTemplateList /></ProtectedRoute>} />
      <Route path="/templates/tarot/:sessionId" element={<ProtectedRoute minPortal="mentorada"><TarotTemplateEditor /></ProtectedRoute>} />
      <Route path="/templates/constellation" element={<ProtectedRoute minPortal="mentorada"><ConstellationTemplateList /></ProtectedRoute>} />
      <Route path="/templates/constellation/:sessionId" element={<ProtectedRoute minPortal="mentorada"><ConstellationTemplateEditor /></ProtectedRoute>} />

      {/* Personal Maps */}
      <Route path="/mapas-pessoais" element={<ProtectedRoute minPortal="mentorada"><PersonalMaps /></ProtectedRoute>} />
      <Route path="/mapas-pessoais/:id" element={<ProtectedRoute minPortal="mentorada"><PersonalMapEditor /></ProtectedRoute>} />

      {/* Legacy sala redirects */}
      <Route path="/salas/big5" element={<Navigate to="/ferramentas/big5" replace />} />
      <Route path="/salas/eneagrama" element={<Navigate to="/ferramentas/eneagrama" replace />} />
      <Route path="/salas/oraculo-perguntas" element={<Navigate to="/ferramentas/oraculo-perguntas" replace />} />
      <Route path="/salas/mapa-oracula" element={<Navigate to="/ferramentas/mapa-oracula" replace />} />

      {/* More ferramentas */}
      <Route path="/ferramentas/chakras" element={<ProtectedRoute minPortal="mentorada"><Chakras /></ProtectedRoute>} />
      <Route path="/ferramentas/hawkins" element={<ProtectedRoute minPortal="mentorada"><Hawkins /></ProtectedRoute>} />
      <Route path="/ferramentas/escala-maia" element={<ProtectedRoute minPortal="pre_iniciada"><EscalaMAIA /></ProtectedRoute>} />
      <Route path="/ferramentas/antroposofia" element={<ProtectedRoute minPortal="mentorada"><Antroposofia /></ProtectedRoute>} />
      <Route path="/ferramentas/neuroplasticidade" element={<ProtectedRoute minPortal="mentorada"><Neuroplasticidade /></ProtectedRoute>} />
      <Route path="/ferramentas/narrativas" element={<ProtectedRoute minPortal="mentorada"><Narrativas /></ProtectedRoute>} />

      {/* Radiestesia */}
      <Route path="/radiestesia" element={<ProtectedRoute minPortal="mentorada"><RadiestesiaPortal /></ProtectedRoute>} />
      <Route path="/radiestesia/leitura" element={<ProtectedRoute minPortal="mentorada"><Leitura5Camadas /></ProtectedRoute>} />
      <Route path="/radiestesia/mesa" element={<ProtectedRoute minPortal="mentorada"><MesaRadionica /></ProtectedRoute>} />
      <Route path="/radiestesia/graficos" element={<ProtectedRoute minPortal="mentorada"><CatalogoGraficos /></ProtectedRoute>} />
      <Route path="/radiestesia/graficos/:slug" element={<ProtectedRoute minPortal="mentorada"><GraficoDetalhe /></ProtectedRoute>} />
      <Route path="/radiestesia/pantaculos" element={<ProtectedRoute minPortal="mentorada"><Pantaculos /></ProtectedRoute>} />
      <Route path="/radiestesia/cristais" element={<ProtectedRoute minPortal="mentorada"><CristaisCampos /></ProtectedRoute>} />
      <Route path="/radiestesia/escala" element={<ProtectedRoute minPortal="mentorada"><EscalaNarrativa /></ProtectedRoute>} />
      <Route path="/radiestesia/diario" element={<ProtectedRoute minPortal="mentorada"><DiarioPraticas /></ProtectedRoute>} />

      <Route path="/ferramentas/tarot" element={<ProtectedRoute minPortal="mentorada"><Tarot /></ProtectedRoute>} />
      <Route path="/ferramentas/constelacao" element={<ProtectedRoute minPortal="mentorada"><Constelacao /></ProtectedRoute>} />
      <Route path="/syntheia" element={<ProtectedRoute minPortal="mentorada"><Syntheia /></ProtectedRoute>} />
      <Route path="/ferramentas/sintheia" element={<Navigate to="/syntheia" replace />} />
      <Route path="/ferramentas/agente-analista" element={<ProtectedRoute minPortal="mentorada"><Navigate to="/syntheia?agente=analista" replace /></ProtectedRoute>} />
      <Route path="/ferramentas/agente-curador" element={<ProtectedRoute minPortal="mentorada"><Navigate to="/syntheia?agente=curador" replace /></ProtectedRoute>} />
      <Route path="/ferramentas/agente-simbolico" element={<ProtectedRoute minPortal="mentorada"><Navigate to="/syntheia?agente=simbolico" replace /></ProtectedRoute>} />
      <Route path="/ferramentas/espelho-de-consciencia" element={<ProtectedRoute minPortal="mentorada"><EspelhoConsciencia /></ProtectedRoute>} />
      <Route path="/ferramentas/espelho-consciencia" element={<Navigate to="/ferramentas/espelho-de-consciencia" replace />} />
      <Route path="/ferramentas/mapa-arquetipos-ego" element={<ProtectedRoute minPortal="mentorada"><MapaArquetiposEgo /></ProtectedRoute>} />
      <Route path="/ferramentas/cartografia-torre" element={<ProtectedRoute minPortal="mentorada"><CartografiaTorre /></ProtectedRoute>} />
      <Route path="/ferramentas/plasticidade-psiquica" element={<ProtectedRoute minPortal="mentorada"><PlasticidadePsiquica /></ProtectedRoute>} />

      <Route path="/quiz/:quizId" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
      <Route path="/quiz/:quizId/resultado" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
      <Route path="/ferramentas/torre-viva" element={<ProtectedRoute minPortal="oracula"><TorreViva /></ProtectedRoute>} />
      <Route path="/biblioteca-casos" element={<ProtectedRoute><Navigate to="/biblioteca?aba=casos" replace /></ProtectedRoute>} />

      {/* Método */}
      <Route path="/metodo/portas" element={<ProtectedRoute minPortal="mentorada"><AsPortas /></ProtectedRoute>} />
      <Route path="/metodo/campos-psiquicos" element={<ProtectedRoute minPortal="mentorada"><OsCamposPsiquicos /></ProtectedRoute>} />
      <Route path="/metodo/torres" element={<ProtectedRoute minPortal="mentorada"><AsTorres /></ProtectedRoute>} />
      <Route path="/metodo/triade" element={<ProtectedRoute minPortal="mentorada"><TriadeMetodo /></ProtectedRoute>} />

      <Route path="/leitura-oracular" element={<ProtectedRoute minPortal="oracula"><LeituraOracular /></ProtectedRoute>} />
      <Route path="/minhas-clientes" element={<ProtectedRoute minPortal="mentorada"><MinhasClientes /></ProtectedRoute>} />
      <Route path="/cliente/:clienteId" element={<ProtectedRoute minPortal="mentorada"><ClientePerfil /></ProtectedRoute>} />

      {/* ═══ Casa das Máquinas (extracted) ═══ */}
      {renderCasaMaquinasRoutes(ProtectedRoute)}

      {/* Treinamento redirects */}
      <Route path="/treinamento" element={<Navigate to="/sala-de-treinamento" replace />} />
      <Route path="/sala-de-treinamento" element={<ProtectedRoute minPortal="aluna_formacao"><SalaDeTreinamentoPage /></ProtectedRoute>} />
      <Route path="/sala-treinamento" element={<Navigate to="/sala-de-treinamento" replace />} />
      <Route path="/comunidade" element={<ProtectedRoute><ComunidadePage /></ProtectedRoute>} />
      <Route path="/academia" element={<ProtectedRoute minPortal="aluna_formacao"><AcademiaFormacaoPage /></ProtectedRoute>} />

      {/* Jardim da Psique */}
      <Route path="/jardim-da-psique" element={<ProtectedRoute><JardimPsique /></ProtectedRoute>} />
      <Route path="/jardim-da-psique/:id" element={<ProtectedRoute><JardimPsiqueDetalhe /></ProtectedRoute>} />

      {/* Canteiro */}
      <Route path="/canteiro" element={<ProtectedRoute><Canteiro /></ProtectedRoute>} />
      <Route path="/minha-biblioteca" element={<ProtectedRoute><Navigate to="/biblioteca?aba=pessoal" replace /></ProtectedRoute>} />

      {/* Oráculos */}
      <Route path="/oraculos" element={<ProtectedRoute><Oraculos /></ProtectedRoute>} />
      <Route path="/oraculos/:oracleSlug" element={<ProtectedRoute><OracleHome /></ProtectedRoute>} />
      <Route path="/oraculos/:oracleSlug/tirar" element={<ProtectedRoute><OracleDraw /></ProtectedRoute>} />
      <Route path="/oraculos/:oracleSlug/historico" element={<ProtectedRoute><OracleHistory /></ProtectedRoute>} />
      <Route path="/oraculos/:oracleSlug/biblioteca" element={<ProtectedRoute><OracleCardLibrary /></ProtectedRoute>} />

      {/* Legacy curso redirects */}
      <Route path="/curso/:id" element={<LegacyCursoRedirect />} />
      <Route path="/curso/:courseId/aula/:lessonId" element={<LegacyAulaRedirect />} />

      {/* Cursos */}
      <Route path="/cursos" element={<ProtectedRoute><Cursos /></ProtectedRoute>} />
      <Route path="/cursos/:id" element={<ProtectedRoute><CursoDetalhe /></ProtectedRoute>} />
      <Route path="/cursos/:courseId/aula/:lessonId" element={<ProtectedRoute><CursoAula /></ProtectedRoute>} />
      <Route path="/cursos/:courseId/modulo/:moduleId" element={<ProtectedRoute><CursoModulo /></ProtectedRoute>} />

      {/* Formação */}
      <Route path="/formacao-metodo" element={<ProtectedRoute minPortal="mentorada"><FormacaoMetodoPage /></ProtectedRoute>} />
      <Route path="/formacao-metodo/forum" element={<ProtectedRoute minPortal="mentorada"><FormacaoForumPage /></ProtectedRoute>} />
      <Route path="/formacao-metodo/avaliacoes" element={<ProtectedRoute minPortal="mentorada"><FormacaoAvaliacoesPage /></ProtectedRoute>} />

      {/* Biblioteca Travessias */}

      {/* Test: Bottom Nav Preview */}
      <Route path="/test-bottom-nav" element={<BottomNavTestPage />} />

      <Route path="/biblioteca-das-travessias" element={<ProtectedRoute><Navigate to="/biblioteca?aba=travessias" replace /></ProtectedRoute>} />
      <Route path="/biblioteca-das-travessias/:slug" element={<ProtectedRoute><BibliotecaTravessiaDetalhe /></ProtectedRoute>} />

      {/* Labirinto das 39 Portas */}
      <Route path="/labirinto" element={<ProtectedRoute minPortal="mentorada"><LabirintoHome /></ProtectedRoute>} />
      <Route path="/labirinto/porta/:portaId" element={<ProtectedRoute minPortal="mentorada"><LabirintoPorta /></ProtectedRoute>} />
      <Route path="/labirinto/como-usar" element={<ProtectedRoute minPortal="mentorada"><LabirintoComoUsar /></ProtectedRoute>} />
      <Route path="/labirinto/tipos-de-campo" element={<ProtectedRoute minPortal="mentorada"><LabirintoTiposCampo /></ProtectedRoute>} />
      <Route path="/labirinto/tabela" element={<ProtectedRoute minPortal="oracula"><LabirintoTabela /></ProtectedRoute>} />

      {/* ═══ Admin (extracted) ═══ */}
      {renderAdminRoutes(ProtectedRoute)}

      <Route path="/estudio-oracular" element={<ProtectedRoute><EstudioOracular /></ProtectedRoute>} />

      {/* Planos e Conta */}
      <Route path="/planos" element={<Planos />} />
      <Route path="/planos-clube" element={<Navigate to="/planos" replace />} />
      <Route path="/pos-compra" element={<ProtectedRoute><PosCompra /></ProtectedRoute>} />
      <Route path="/assinatura" element={<ProtectedRoute><Navigate to="/minha-conta" replace /></ProtectedRoute>} />
      <Route path="/billing" element={<ProtectedRoute><Navigate to="/minha-conta" replace /></ProtectedRoute>} />
      <Route path="/minha-conta" element={<ProtectedRoute><MinhaConta /></ProtectedRoute>} />
      <Route path="/suporte" element={<ProtectedRoute><Suporte /></ProtectedRoute>} />
      <Route path="/checkout/sucesso" element={<ProtectedRoute><CheckoutSucesso /></ProtectedRoute>} />
      <Route path="/checkout/cancelado" element={<ProtectedRoute><CheckoutCancelado /></ProtectedRoute>} />
      <Route path="/audios" element={<ProtectedRoute><Audios /></ProtectedRoute>} />
      <Route path="/notificacoes" element={<ProtectedRoute><Notificacoes /></ProtectedRoute>} />
      <Route path="/templo-de-escuta" element={<ProtectedRoute><TemploEscuta /></ProtectedRoute>} />

      <Route path="/biblioteca-travessias" element={<ProtectedRoute><Navigate to="/biblioteca?aba=travessias" replace /></ProtectedRoute>} />
      <Route path="/biblioteca-travessias/:familiaSlug" element={<ProtectedRoute><BibliotecaTravessiasFamilia /></ProtectedRoute>} />

      {/* Dynamic Tool Route - MUST be after all static /ferramentas/ routes */}
      <Route path="/ferramentas/:slug" element={<ProtectedRoute><FerramentaDinamica /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <RootErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {import.meta.env.PROD && <ServiceWorkerUpdateToast />}
        <BrowserRouter>
          <AuthProvider>
            <AdminPreviewProvider>
              <AppDomainProvider>
                <Suspense fallback={<BootLoadingScreen message="Carregando a próxima etapa da travessia." />}>
                  <AppRoutes />
                </Suspense>
              </AppDomainProvider>
            </AdminPreviewProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </RootErrorBoundary>
);

export default App;
