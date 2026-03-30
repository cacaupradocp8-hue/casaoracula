import React from "react"; // rebuild-trigger-v5
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
import { BootLoadingScreen } from "@/components/shared/BootLoadingScreen";

import { Suspense } from "react";

// Only Auth and NotFound are eagerly loaded (critical path)
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DashboardMembro from "./pages/DashboardMembro";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import SalaDaVisitante from "./pages/SalaDaVisitante";

// Entry routes after auth are eagerly loaded to avoid suspense stalls / white screen on boot
// All other pages are lazy-loaded
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const Welcome = React.lazy(() => import("./pages/Welcome"));
const Admin = React.lazy(() => import("./pages/Admin"));
const BibliotecaUnificada = React.lazy(() => import("./pages/BibliotecaUnificada"));
const Mentoria = React.lazy(() => import("./pages/Mentoria"));
const CasaTecelaAtrio = React.lazy(() => import("./pages/CasaTecelaAtrio"));
const CasaTecelaInterior = React.lazy(() => import("./pages/CasaTecelaInterior"));
const CirculoOracularPage = React.lazy(() => import("./pages/CirculoOracularPage"));
const HeroinaAppPage = React.lazy(() => import("./pages/HeroinaAppPage"));
const OraculaPage = React.lazy(() => import("./pages/OraculaPage"));
const PortalOraculaPage = React.lazy(() => import("./pages/PortalOraculaPage"));
const OraculaSalesPage = React.lazy(() => import("./pages/OraculaSalesPage"));
const Travessias = React.lazy(() => import("./pages/Travessias"));
const Agentes = React.lazy(() => import("./pages/Agentes"));
const LeituraOracular = React.lazy(() => import("./pages/LeituraOracular"));
const EspelhoConsciencia = React.lazy(() => import("./pages/salas/EspelhoConsciencia"));
const MapaArquetiposEgo = React.lazy(() => import("./pages/salas/MapaArquetiposEgo"));
const CartografiaTorre = React.lazy(() => import("./pages/salas/CartografiaTorre"));
const PlasticidadePsiquica = React.lazy(() => import("./pages/salas/PlasticidadePsiquica"));
const SalasList = React.lazy(() => import("./pages/SalasList"));
const FerramentasHub = React.lazy(() => import("./pages/FerramentasHub"));
const FerramentasVitrine = React.lazy(() => import("./pages/FerramentasVitrine"));
const SalaDetalhe = React.lazy(() => import("./pages/SalaDetalhe"));
const PortalDetalhe = React.lazy(() => import("./pages/PortalDetalhe"));
const AulaPage = React.lazy(() => import("./pages/AulaPage"));
const LaboratorioLeitura = React.lazy(() => import("./pages/LaboratorioLeitura"));
const Metodo = React.lazy(() => import("./pages/Metodo"));
const FerramentasMetodo = React.lazy(() => import("./pages/FerramentasMetodo"));
const FerramentasMetodoHub = React.lazy(() => import("./pages/FerramentasMetodoHub"));
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
const BibliotecaDasTravessias = React.lazy(() => import("./pages/BibliotecaDasTravessias"));
const BibliotecaTravessiaDetalhe = React.lazy(() => import("./pages/BibliotecaTravessiaDetalhe"));
const LabirintoHome = React.lazy(() => import("./pages/labirinto/LabirintoHome"));
const LabirintoPorta = React.lazy(() => import("./pages/labirinto/LabirintoPorta"));
const LabirintoComoUsar = React.lazy(() => import("./pages/labirinto/LabirintoComoUsar"));
const LabirintoTiposCampo = React.lazy(() => import("./pages/labirinto/LabirintoTiposCampo"));
const LabirintoTabela = React.lazy(() => import("./pages/labirinto/LabirintoTabela"));
const InstallApp = React.lazy(() => import("./pages/InstallApp"));
const Planos = React.lazy(() => import("./pages/Planos"));
const PlanosClubeOracular = React.lazy(() => import("./pages/PlanosClubeOracular"));
const PosCompra = React.lazy(() => import("./pages/PosCompra"));
const Assinatura = React.lazy(() => import("./pages/Assinatura"));
const Billing = React.lazy(() => import("./pages/Billing"));
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
const AgenteAnalista = React.lazy(() => import("./pages/salas/AgenteAnalista"));
const AgenteCurador = React.lazy(() => import("./pages/salas/AgenteCurador"));
const AgenteSimbólico = React.lazy(() => import("./pages/salas/AgenteSimbólico"));
const FerramentaDinamica = React.lazy(() => import("./pages/FerramentaDinamica"));
const CriarFerramenta = React.lazy(() => import("./pages/admin/CriarFerramenta"));
const AtelieConteudo = React.lazy(() => import("./pages/admin/AtelieConteudo"));
const AdminModulosFormativos = React.lazy(() => import("./pages/admin/AdminModulosFormativos"));
const AdminBooks = React.lazy(() => import("./pages/admin/AdminBooks"));
const AdminOracleCardsPage = React.lazy(() => import("./pages/admin/AdminOracleCardsPage"));
const Big5Simbolico = React.lazy(() => import("./pages/Big5Simbolico"));
const Big5Oracular = React.lazy(() => import("./pages/Big5Oracular"));
const Big5Funcional = React.lazy(() => import("./pages/Big5Funcional"));
const EneagramaFeminino = React.lazy(() => import("./pages/EneagramaFeminino"));
const JornadaHeroina = React.lazy(() => import("./pages/JornadaHeroina"));
const TorreViva = React.lazy(() => import("./pages/TorreViva"));
const AtlasArquetiposFemininos = React.lazy(() => import("./pages/AtlasArquetiposFemininos"));
const BibliotecaCasos = React.lazy(() => import("./pages/BibliotecaCasos"));
const MapaVivoList = React.lazy(() => import("./pages/MapaVivoList"));
const MapaVivoEditor = React.lazy(() => import("./pages/MapaVivoEditor"));
const PainelClinicoPage = React.lazy(() => import("./pages/casa-maquinas/PainelClinicoPage"));
const ModoSessaoImersivo = React.lazy(() => import("./pages/casa-maquinas/ModoSessaoImersivo"));
const MapaCidadelaPage = React.lazy(() => import("./pages/casa-maquinas/MapaCidadelaPage"));
const RelatorioJornadaPage = React.lazy(() => import("./pages/RelatorioJornadaPage"));
const MapaVivoPage = React.lazy(() => import("./pages/MapaVivoPage"));
const MapaVivoCidadelaPage = React.lazy(() => import("./pages/casa-maquinas/MapaVivoCidadelaPage"));
const JornadaAlmaPage = React.lazy(() => import("./pages/JornadaAlmaPage"));
const CasaTecelasPage = React.lazy(() => import("./pages/casa-maquinas/CasaTecelasPage"));
const AcademiaPage = React.lazy(() => import("./pages/casa-maquinas/AcademiaPage"));
const PerfilProfissionalPage = React.lazy(() => import("./pages/casa-maquinas/PerfilProfissionalPage"));
const SalaTreinamentoPage = React.lazy(() => import("./pages/SalaTreinamentoPage"));
const ComunidadePage = React.lazy(() => import("./pages/ComunidadePage"));
const AcademiaFormacaoPage = React.lazy(() => import("./pages/AcademiaFormacaoPage"));
const CartografiaPage = React.lazy(() => import("./pages/casa-maquinas/ferramentas/CartografiaPage"));
const CartografiaPsiquicaPage = React.lazy(() => import("./pages/CartografiaPsiquicaPage"));
const RevelacaoCidadelaPage = React.lazy(() => import("./pages/RevelacaoCidadelaPage"));
const RituaisMudraPage = React.lazy(() => import("./pages/RituaisMudraPage"));
const BussolaOniricaPage = React.lazy(() => import("./pages/BussolaOniricaPage"));
const CirculoSagradoPage = React.lazy(() => import("./pages/CirculoSagradoPage"));
const CursoDeusasPage = React.lazy(() => import("./pages/CursoDeusasPage"));
const CursoChaveOniricaPage = React.lazy(() => import("./pages/CursoChaveOniricaPage"));
const TorreVivaPage = React.lazy(() => import("./pages/casa-maquinas/ferramentas/TorreVivaPage"));
const LabirintoPage = React.lazy(() => import("./pages/casa-maquinas/ferramentas/LabirintoPage"));
const DecodificacaoOniricaPage = React.lazy(() => import("./pages/casa-maquinas/ferramentas/DecodificacaoOniricaPage"));
const AtlasArquetiposPage = React.lazy(() => import("./pages/casa-maquinas/ferramentas/AtlasArquetiposPage"));
const PlaceholderToolPage = React.lazy(() => import("./pages/casa-maquinas/ferramentas/PlaceholderToolPage"));
const InventarioPersonasPage = React.lazy(() => import("./pages/casa-maquinas/ferramentas/InventarioPersonasPage"));
const MapeamentoComplexosPage = React.lazy(() => import("./pages/casa-maquinas/ferramentas/MapeamentoComplexosPage"));
const MapaSombraPage = React.lazy(() => import("./pages/casa-maquinas/ferramentas/MapaSombraPage"));
const DiagnosticoEgoPage = React.lazy(() => import("./pages/casa-maquinas/ferramentas/DiagnosticoEgoPage"));
const SonhoEstruturadoPage = React.lazy(() => import("./pages/casa-maquinas/ferramentas/SonhoEstruturadoPage"));
const ImaginacaoAtivaPage = React.lazy(() => import("./pages/casa-maquinas/ferramentas/ImaginacaoAtivaPage"));
const EscritaNaoCensuradaPage = React.lazy(() => import("./pages/casa-maquinas/ferramentas/EscritaNaoCensuradaPage"));
const CorpoInconscientePage = React.lazy(() => import("./pages/casa-maquinas/ferramentas/CorpoInconscientePage"));
const SectionPlaceholder = React.lazy(() => import("./pages/casa-maquinas/SectionPlaceholder"));
const VozesHomePage = React.lazy(() => import("./pages/casa-maquinas/VozesHomePage"));
const VozesListaPage = React.lazy(() => import("./pages/casa-maquinas/VozesListaPage"));
const VozDetalhePage = React.lazy(() => import("./pages/casa-maquinas/VozDetalhePage"));
const VozesMapaPage = React.lazy(() => import("./pages/casa-maquinas/VozesMapaPage"));
const VozesTabelaPage = React.lazy(() => import("./pages/casa-maquinas/VozesTabelaPage"));
const ConfiguracoesSaasPage = React.lazy(() => import("./pages/casa-maquinas/ConfiguracoesSaasPage"));
const FormacaoMetodoPage = React.lazy(() => import("./pages/FormacaoMetodoPage"));
const FormacaoForumPage = React.lazy(() => import("./pages/FormacaoForumPage"));
const FormacaoAvaliacoesPage = React.lazy(() => import("./pages/FormacaoAvaliacoesPage"));
const Jornada = React.lazy(() => import("./pages/Jornada"));
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
const MinhaBiblioteca = React.lazy(() => import("./pages/MinhaBiblioteca"));

const TravessiaDetalhe = React.lazy(() => import("./pages/TravessiaDetalhe"));
const NarroterapiaHub = React.lazy(() => import("./pages/NarroterapiaHub"));
const BibliotecaContos = React.lazy(() => import("./pages/narroterapia/BibliotecaContos"));
const BibliotecaClinica = React.lazy(() => import("./pages/narroterapia/BibliotecaClinica"));
const ContoClinicoDetalhe = React.lazy(() => import("./pages/narroterapia/ContoClinicoDetalhe"));
const AudiosNarracao = React.lazy(() => import("./pages/narroterapia/AudiosNarracao"));
const RitualAutorizacao = React.lazy(() => import("./pages/narroterapia/RitualAutorizacao"));
const BibliotecaTravessias = React.lazy(() => import("./pages/BibliotecaTravessias"));
const BibliotecaTravessiasFamilia = React.lazy(() => import("./pages/BibliotecaTravessiasFamilia"));
const MapaHeroinaPage = React.lazy(() => import("./pages/mapa-heroina"));
const CartasJornadaPage = React.lazy(() => import("./pages/CartasJornadaPage"));
const PortalJunguiano = React.lazy(() => import("./pages/PortalJunguiano"));
const PortalJunguianoPorta = React.lazy(() => import("./pages/PortalJunguianoPorta"));
const ExperienciaGratuita = React.lazy(() => import("./pages/ExperienciaGratuita"));
const ClubeOracular = React.lazy(() => import("./pages/ClubeOracular"));
const MapaCasaOracula = React.lazy(() => import("./pages/MapaCasaOracula"));
const MinhaJornada = React.lazy(() => import("./pages/MinhaJornada"));

// Casa pages
const CasaAtrio = React.lazy(() => import("./pages/casa/CasaAtrio"));
const CasaSustentacao = React.lazy(() => import("./pages/casa/CasaSustentacao"));
const CasaLeitura = React.lazy(() => import("./pages/casa/CasaLeitura"));
const CasaCirculo = React.lazy(() => import("./pages/casa/CasaCirculo"));
const CasaJardim = React.lazy(() => import("./pages/casa/CasaJardim"));

// Radiestesia
const RadiestesiaPortal = React.lazy(() => import("./pages/radiestesia/RadiestesiaPortal"));
const Leitura5Camadas = React.lazy(() => import("./pages/radiestesia/Leitura5Camadas"));
const MesaRadionica = React.lazy(() => import("./pages/radiestesia/MesaRadionica"));
const CatalogoGraficos = React.lazy(() => import("./pages/radiestesia/CatalogoGraficos"));
const GraficoDetalhe = React.lazy(() => import("./pages/radiestesia/GraficoDetalhe"));
const Pantaculos = React.lazy(() => import("./pages/radiestesia/Pantaculos"));
const CristaisCampos = React.lazy(() => import("./pages/radiestesia/CristaisCampos"));
const EscalaNarrativa = React.lazy(() => import("./pages/radiestesia/EscalaNarrativa"));
const DiarioPraticas = React.lazy(() => import("./pages/radiestesia/DiarioPraticas"));

// Método
const AsPortas = React.lazy(() => import("./pages/metodo/AsPortas"));
const OsCamposPsiquicos = React.lazy(() => import("./pages/metodo/OsCamposPsiquicos"));
const AsTorres = React.lazy(() => import("./pages/metodo/AsTorres"));
const TriadeMetodo = React.lazy(() => import("./pages/metodo/TriadeMetodo"));

// Casa das Máquinas
const CasaDasMaquinas = React.lazy(() => import("./pages/casa-maquinas/CasaDasMaquinas"));
const SessoesPage = React.lazy(() => import("./pages/casa-maquinas/SessoesPage"));
const GestosIntegracaoPage = React.lazy(() => import("./pages/casa-maquinas/GestosIntegracaoPage"));
const MapaVivoClientePage = React.lazy(() => import("./pages/casa-maquinas/MapaVivoClientePage"));
const PainelInstitucionalPage = React.lazy(() => import("./pages/casa-maquinas/PainelInstitucionalPage"));
const ClientesPage = React.lazy(() => import("./pages/casa-maquinas/ClientesPage"));
const ClienteDetailPage = React.lazy(() => import("./pages/casa-maquinas/ClienteDetailPage"));
const ModoSessaoPage = React.lazy(() => import("./pages/casa-maquinas/ModoSessaoPage"));
const PerfilConducaoPage = React.lazy(() => import("./pages/casa-maquinas/PerfilConducaoPage"));
const CampoDasClientesPage = React.lazy(() => import("./pages/casa-maquinas/CampoDasClientesPage"));
const FerramentasPage = React.lazy(() => import("./pages/casa-maquinas/FerramentasPage"));
const GruposPage = React.lazy(() => import("./pages/casa-maquinas/GruposPage"));
const GrupoDetailPage = React.lazy(() => import("./pages/casa-maquinas/GrupoDetailPage"));
const BibliotecaIntervPage = React.lazy(() => import("./pages/casa-maquinas/BibliotecaIntervPage"));
const VariacoesFerramentasPage = React.lazy(() => import("./pages/casa-maquinas/VariacoesFerramentasPage"));
const QaJardimSessoesPage = React.lazy(() => import("./pages/casa-maquinas/QaJardimSessoesPage"));

// Labirinto da Heroína
const LabirintoHeroinaPage = React.lazy(() => import("./pages/labirinto-heroina/LabirintoHeroinaPraticoPage"));

// Clube do Livro
const ClubeLivroApresentacao = React.lazy(() => import("./pages/clube-livro/ClubeLivroApresentacao"));
const ClubeLivroCiclo = React.lazy(() => import("./pages/clube-livro/ClubeLivroCiclo"));
const ClubeLivroPorta = React.lazy(() => import("./pages/clube-livro/ClubeLivroPorta"));
const ClubeLivroFase = React.lazy(() => import("./pages/clube-livro/ClubeLivroFase"));
const ClubeLivroEscutas = React.lazy(() => import("./pages/clube-livro/ClubeLivroEscutas"));
const ClubeLivroEncontros = React.lazy(() => import("./pages/clube-livro/ClubeLivroEncontros"));
const ClubeLivroRitual = React.lazy(() => import("./pages/clube-livro/ClubeLivroRitual"));
const ClubeLivroAula = React.lazy(() => import("./pages/clube-livro/ClubeLivroAula"));
const IntegracaoOracular = React.lazy(() => import("./pages/clube-livro/IntegracaoOracular"));
const MeuCaminhoClube = React.lazy(() => import("./pages/clube-livro/MeuCaminhoClube"));
const Integracao8020 = React.lazy(() => import("./pages/clube-livro/Integracao8020"));
const ClubeLivroLivro = React.lazy(() => import("./pages/clube-livro/ClubeLivroLivro"));
const MapaJornadas = React.lazy(() => import("./pages/clube-livro/MapaJornadas"));
const MinhaTravessia = React.lazy(() => import("./pages/clube-livro/MinhaTravessia"));
const CertificadoTravessia = React.lazy(() => import("./pages/clube-livro/CertificadoTravessia"));
const Lab8020Season = React.lazy(() => import("./pages/clube-livro/Lab8020Season"));
const ClubeLivroSemana = React.lazy(() => import("./pages/clube-livro/ClubeLivroSemana"));

// Jardim do Ofício
const JardimOficioPage = React.lazy(() => import("./pages/jardim-oficio/JardimOficioPage"));
const PainelSupervisaoPage = React.lazy(() => import("./pages/jardim-oficio/PainelSupervisaoPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min — avoid refetching on every mount
      gcTime: 1000 * 60 * 10,   // 10 min garbage collection
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
const BOOT_ROUTE_LOG_PREFIX = '[boot-debug][routes]';

const logRouteStep = (
  stage: string,
  payload?: Record<string, unknown>,
  level: 'info' | 'warn' | 'error' = 'info'
) => {
  const logger = level === 'error' ? console.error : level === 'warn' ? console.warn : console.info;
  logger(`${BOOT_ROUTE_LOG_PREFIX} ${stage}`, payload ?? {});
};

// Loading component for auth states
function AuthLoading() {
  return <BootLoadingScreen />;
}

function AppRouteError({ title, message }: { title: string; message: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-center space-y-4">
        <h1 className="text-xl font-semibold text-destructive">{title}</h1>
        <p className="text-sm text-destructive/90">{message}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Recarregar app
        </button>
      </div>
    </div>
  );
}

interface RootErrorBoundaryState {
  hasError: boolean;
  errorMessage: string | null;
}

class RootErrorBoundary extends React.Component<{ children: React.ReactNode }, RootErrorBoundaryState> {
  state: RootErrorBoundaryState = {
    hasError: false,
    errorMessage: null,
  };

  static getDerivedStateFromError(error: Error): RootErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'Ocorreu um erro inesperado.',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[root-error-boundary]', error, info);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return <AppRouteError title="Aconteceu um erro na abertura" message={this.state.errorMessage || 'Erro desconhecido.'} />;
  }
}

// ProtectedRoute with preview mode support AND onboarding enforcement
function ProtectedRoute({ children, minPortal = "visitante" }: { children: React.ReactNode; minPortal?: PortalType }) {
  const { isLoading, isAuthenticated, user, isAuthReady, authError } = useAuth();
  const preview = useAdminPreviewOptional();
  const location = useLocation();
  const isOnboardingRoute = location.pathname === '/onboarding';
  const isPosCompraRoute = location.pathname === '/pos-compra';
  const isVisitorJourneyRoute = location.pathname === '/sala-da-visitante'
    || location.pathname.startsWith('/quiz/')
    || location.pathname === '/ferramenta/cartografia-psiquica-oracula'
    || location.pathname === '/ferramentas/cartografia-psiquica-oracula'
    || location.pathname === '/revelacao-cidadela'
    || location.pathname === '/cidadela/revelacao'
    || location.pathname === '/comece-aqui'
    || location.pathname === '/experiencia-gratuita'
    || location.pathname.startsWith('/travessia/');
  const isAdmin = user?.portal === 'admin';
  const isVisitor = user?.portal === 'visitante';
  const shouldSkipOnboarding = isAdmin || isVisitorJourneyRoute;
  const { onboardingCompleted, isLoading: onboardingLoading, error: onboardingError } = useOnboarding({
    enabled: !shouldSkipOnboarding,
  });

  if (!isAuthReady || isLoading) {
    logRouteStep('boot auth pendente', { path: location.pathname, isAuthReady, isLoading });
    return <AuthLoading />;
  }

  if (authError) {
    logRouteStep('falha no boot de autenticação', { path: location.pathname, authError }, 'error');
    return <AppRouteError title="Erro na autenticação" message={authError} />;
  }

  if (!isAuthenticated) {
    logRouteStep('usuária não autenticada, redirecionando para /auth', { path: location.pathname }, 'warn');
    return <Navigate to="/auth" replace />;
  }

  if (!shouldSkipOnboarding && onboardingLoading) {
    logRouteStep('onboarding pendente', { path: location.pathname, userId: user?.id ?? null });
    return <AuthLoading />;
  }

  // Onboarding error: fail-open — let user through to dashboard instead of blocking
  if (onboardingError && location.pathname !== '/onboarding') {
    logRouteStep('falha no onboarding, fail-open para dashboard', { path: location.pathname, onboardingError }, 'warn');
  }

  // Only redirect to onboarding if we successfully loaded status AND it's not completed
  // If there was an error loading onboarding, skip redirect (fail-open)
  // Visitor journey routes (sala, quiz, travessia) bypass onboarding enforcement
  if (!onboardingCompleted && !onboardingError && !isOnboardingRoute && !isAdmin && !isVisitorJourneyRoute) {
    logRouteStep('definição da rota pós-login: /onboarding', {
      from: location.pathname,
      userId: user?.id ?? null,
      onboardingCompleted,
    }, 'warn');
    return <Navigate to="/onboarding" replace />;
  }

  const isAdminRoute = minPortal === 'admin';
  const effectivePortal = preview?.isPreviewMode && preview?.previewPortal && user?.portal === 'admin' && !isAdminRoute
    ? preview.previewPortal
    : user?.portal || 'visitante';

  const hasAccess = canAccessFeature(effectivePortal, minPortal);

  if (isVisitor && !isAdmin && !hasAccess && !isPosCompraRoute) {
    logRouteStep('visitante bloqueada por permissão', { path: location.pathname, minPortal }, 'warn');
    return <LockedForVisitor />;
  }

  if (!hasAccess) {
    logRouteStep('fallback autenticado: redirecionando para /dashboard', {
      from: location.pathname,
      effectivePortal,
      minPortal,
    }, 'warn');
    return <Navigate to="/dashboard-membro" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user, isAuthReady, authError } = useAuth();
  const location = useLocation();
  const isAdmin = user?.portal === 'admin';
  const isVisitor = user?.portal === 'visitante';
  const shouldSkipOnboarding = !isAuthenticated || isAdmin || isVisitor;
  const { onboardingCompleted, isLoading: onboardingLoading, error: onboardingError } = useOnboarding({
    enabled: !shouldSkipOnboarding,
  });

  if (!isAuthReady || isLoading) {
    logRouteStep('PublicRoute aguardando auth boot', { path: location.pathname, isAuthReady, isLoading });
    return <AuthLoading />;
  }

  if (authError) {
    logRouteStep('PublicRoute recebeu erro de autenticação', { path: location.pathname, authError }, 'error');
    return <AppRouteError title="Erro na autenticação" message={authError} />;
  }

  if (!isAuthenticated) {
    logRouteStep('PublicRoute sem sessão, exibindo rota pública', { path: location.pathname });
    return <>{children}</>;
  }

  if (!shouldSkipOnboarding && onboardingLoading) {
    logRouteStep('PublicRoute aguardando onboarding', { path: location.pathname, userId: user?.id ?? null });
    return <AuthLoading />;
  }

  // Onboarding error: fail-open — send to dashboard instead of blocking
  if (onboardingError) {
    logRouteStep('PublicRoute erro no onboarding, fail-open para dashboard', { path: location.pathname, onboardingError }, 'warn');
  }

  // Only redirect to onboarding if we successfully loaded status AND it's not completed
  if (!onboardingCompleted && !onboardingError && !isAdmin && !isVisitor) {
    logRouteStep('definição da rota pós-login: /onboarding', {
      from: location.pathname,
      userId: user?.id ?? null,
      onboardingCompleted,
    }, 'warn');
    return <Navigate to="/onboarding" replace />;
  }

  // Visitantes vão para a Sala da Visitante; membros para o dashboard
  const destination = user?.portal === 'visitante' ? '/sala-da-visitante' : '/dashboard-membro';
  logRouteStep(`definição da rota pós-login: ${destination}`, {
    from: location.pathname,
    userId: user?.id ?? null,
    portal: user?.portal ?? null,
  });
  return <Navigate to={destination} replace />;
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
      <Route path="/formacao" element={<Navigate to="/cursos" replace />} />
      <Route path="/tour" element={<Navigate to="/mapa-casa" replace />} />

      {/* Onboarding Route - First-time experience (before completing) */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      {/* Sala da Visitante - Standalone entry page */}
      <Route
        path="/sala-da-visitante"
        element={
          <ProtectedRoute>
            <SalaDaVisitante />
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
            <Navigate to="/minha-jornada" replace />
          </ProtectedRoute>
        }
      />
      {/* experiencia-gratuita redirect moved below */}
      <Route
        path="/mapa-casa"
        element={
          <ProtectedRoute>
            <MapaCasaOracula />
          </ProtectedRoute>
        }
      />
      <Route
        path="/minha-jornada"
        element={
          <ProtectedRoute>
            <MinhaJornada />
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
        path="/convite-clube"
        element={
          <ProtectedRoute>
            <ConviteClube />
          </ProtectedRoute>
        }
      />
      <Route
        path="/convite-clube-oracular"
        element={
          <ProtectedRoute>
            <ConviteClube />
          </ProtectedRoute>
        }
      />
      <Route
        path="/experiencia-gratuita"
        element={
          <ProtectedRoute>
            <Navigate to="/quiz/descubra-seu-eixo" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Navigate to="/dashboard-membro" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard-membro"
        element={
          <ProtectedRoute>
            <DashboardMembro />
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
      <Route
        path="/circulo-oracular"
        element={
          <ProtectedRoute minPortal="assinante">
            <CirculoOracularPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jardim-heroina-app"
        element={
          <ProtectedRoute>
            <HeroinaAppPage />
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
          <ProtectedRoute>
            <Navigate to="/ferramentas" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sala-do-metodo"
        element={
          <ProtectedRoute>
            <Navigate to="/ferramentas" replace />
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
      
      {/* Clube de Leitura Oracular — Nova Home */}
      <Route
        path="/app/clube"
        element={
          <ProtectedRoute minPortal="aluna">
            <ClubeOracular />
          </ProtectedRoute>
        }
      />
      {/* Clube do Livro Oracular */}
      <Route
        path="/clube-livro/semana"
        element={
          <ProtectedRoute minPortal="aluna">
            <ClubeLivroSemana />
          </ProtectedRoute>
        }
      />
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
          <ProtectedRoute>
            <BibliotecaUnificada />
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
      {/* Salas - Redirect to Mapa da Casa */}
      <Route
        path="/salas"
        element={
          <ProtectedRoute>
            <Navigate to="/mapa-casa" replace />
          </ProtectedRoute>
        }
      />

      {/* Ferramentas - Tools hub (accessible to all authenticated members) */}
      <Route
        path="/ferramentas"
        element={
          <ProtectedRoute>
            <FerramentasHub />
          </ProtectedRoute>
        }
      />

      {/* Ferramentas Vitrine - Redirect to unified hub */}
      <Route
        path="/ferramentas-vitrine"
        element={
          <ProtectedRoute>
            <Navigate to="/ferramentas" replace />
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
        path="/ferramenta/cartografia-psiquica-oracula"
        element={
          <ProtectedRoute minPortal="visitante">
            <CartografiaPsiquicaPage />
          </ProtectedRoute>
        }
      />
      {/* Legacy redirect */}
      <Route path="/ferramenta/big5-oracular" element={<Navigate to="/ferramenta/cartografia-psiquica-oracula" replace />} />
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
      {/* Legacy redirect */}
      <Route path="/ferramenta/cartografia-psiquica" element={<Navigate to="/ferramenta/cartografia-psiquica-oracula" replace />} />
      <Route path="/cartografia-psiquica" element={<Navigate to="/ferramenta/cartografia-psiquica-oracula" replace />} />
      <Route path="/ferramentas/cartografia-psiquica-oracula" element={<Navigate to="/ferramenta/cartografia-psiquica-oracula" replace />} />
      <Route path="/cidadela/revelacao" element={<Navigate to="/revelacao-cidadela" replace />} />
      <Route
        path="/revelacao-cidadela"
        element={
          <ProtectedRoute minPortal="visitante">
            <RevelacaoCidadelaPage />
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
      
      {/* Legacy routes /salas/ - redirect to /ferramentas/ */}
      <Route path="/salas/big5" element={<Navigate to="/ferramentas/big5" replace />} />
      <Route path="/salas/eneagrama" element={<Navigate to="/ferramentas/eneagrama" replace />} />
      <Route path="/salas/oraculo-perguntas" element={<Navigate to="/ferramentas/oraculo-perguntas" replace />} />
      <Route path="/salas/mapa-oracula" element={<Navigate to="/ferramentas/mapa-oracula" replace />} />
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
            <Navigate to="/syntheia?agente=analista" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/agente-curador"
        element={
          <ProtectedRoute minPortal="mentorada">
            <Navigate to="/syntheia?agente=curador" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ferramentas/agente-simbolico"
        element={
          <ProtectedRoute minPortal="mentorada">
            <Navigate to="/syntheia?agente=simbolico" replace />
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
      <Route
        path="/quiz/:quizId/resultado"
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

      {/* Biblioteca de Casos - Redirect to unified biblioteca */}
      <Route
        path="/biblioteca-casos"
        element={
          <ProtectedRoute>
            <Navigate to="/biblioteca?aba=casos" replace />
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
        <Route path="/app/clientes/:clienteId/cidadela" element={<ProtectedRoute minPortal="oracula"><MapaCidadelaPage /></ProtectedRoute>} />
        <Route path="/saas/clientes/:clienteId/relatorio-jornada" element={<ProtectedRoute minPortal="oracula"><RelatorioJornadaPage /></ProtectedRoute>} />
        <Route path="/saas/clientes/:clienteId/mapa-vivo" element={<ProtectedRoute minPortal="oracula"><MapaVivoPage /></ProtectedRoute>} />
        <Route path="/saas/clientes/:clienteId/cidadela-viva" element={<ProtectedRoute minPortal="oracula"><MapaVivoCidadelaPage /></ProtectedRoute>} />
        <Route path="/saas/clientes/:clienteId/jornada-alma" element={<ProtectedRoute minPortal="aluna_formacao"><JornadaAlmaPage /></ProtectedRoute>} />
        <Route path="/saas/clientes/:clienteId/rituais-mudra" element={<ProtectedRoute minPortal="aluna_formacao"><RituaisMudraPage /></ProtectedRoute>} />
        <Route path="/saas/clientes/:clienteId/bussola-onirica" element={<ProtectedRoute minPortal="aluna_formacao"><BussolaOniricaPage /></ProtectedRoute>} />
        <Route path="/saas/clientes/:clienteId/circulo-sagrado" element={<ProtectedRoute minPortal="aluna_formacao"><CirculoSagradoPage /></ProtectedRoute>} />
        <Route path="/academia/curso-deusas" element={<ProtectedRoute minPortal="aluna_formacao"><CursoDeusasPage /></ProtectedRoute>} />
        <Route path="/academia/curso-chave-onirica" element={<ProtectedRoute minPortal="aluna_formacao"><CursoChaveOniricaPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/nova-sessao" element={<ProtectedRoute minPortal="oracula"><ModoSessaoPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/perfil-conducao" element={<ProtectedRoute minPortal="oracula"><PerfilConducaoPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/campo-clientes" element={<ProtectedRoute minPortal="oracula"><CampoDasClientesPage /></ProtectedRoute>} />
        <Route path="/saas/sessao/:clienteId" element={<ProtectedRoute minPortal="oracula"><ModoSessaoImersivo /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas" element={<ProtectedRoute minPortal="oracula"><FerramentasPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/grupos" element={<ProtectedRoute minPortal="oracula"><GruposPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/grupos/:groupId" element={<ProtectedRoute minPortal="oracula"><GrupoDetailPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/biblioteca" element={<ProtectedRoute minPortal="oracula"><BibliotecaIntervPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/variacoes-ferramentas" element={<ProtectedRoute minPortal="oracula"><VariacoesFerramentasPage /></ProtectedRoute>} />
        <Route path="/saas/biblioteca" element={<ProtectedRoute minPortal="oracula"><BibliotecaIntervPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/tecelãs" element={<ProtectedRoute minPortal="aluna"><CasaTecelasPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/academia" element={<ProtectedRoute minPortal="oracula"><AcademiaPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/perfil-profissional" element={<ProtectedRoute minPortal="oracula"><PerfilProfissionalPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/configuracoes" element={<ProtectedRoute minPortal="aluna_formacao"><ConfiguracoesSaasPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/treinamento" element={<ProtectedRoute minPortal="aluna_formacao"><SalaTreinamentoPage /></ProtectedRoute>} />
        <Route path="/treinamento" element={<ProtectedRoute minPortal="aluna_formacao"><SalaTreinamentoPage /></ProtectedRoute>} />
        <Route path="/comunidade" element={<ProtectedRoute><ComunidadePage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/comunidade" element={<Navigate to="/comunidade" replace />} />
        <Route path="/academia" element={<ProtectedRoute minPortal="aluna_formacao"><AcademiaFormacaoPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/academia-formacao" element={<Navigate to="/academia" replace />} />
        <Route path="/casa-das-maquinas/ferramentas/cartografia" element={<ProtectedRoute minPortal="oracula"><CartografiaPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/torre-viva" element={<ProtectedRoute minPortal="oracula"><TorreVivaPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/labirinto" element={<ProtectedRoute minPortal="oracula"><LabirintoPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/decodificacao-onirica" element={<ProtectedRoute minPortal="oracula"><DecodificacaoOniricaPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/atlas-arquetipos" element={<ProtectedRoute minPortal="oracula"><AtlasArquetiposPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/escrita-simbolica" element={<ProtectedRoute minPortal="oracula"><PlaceholderToolPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/espelho-relacional" element={<ProtectedRoute minPortal="oracula"><PlaceholderToolPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/ritual-simbolico" element={<ProtectedRoute minPortal="oracula"><PlaceholderToolPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/7-vozes" element={<ProtectedRoute minPortal="oracula"><VozesHomePage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/7-vozes/lista" element={<ProtectedRoute minPortal="oracula"><VozesListaPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/7-vozes/mapa" element={<ProtectedRoute minPortal="oracula"><VozesMapaPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/7-vozes/tabela" element={<ProtectedRoute minPortal="oracula"><VozesTabelaPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/7-vozes/:vozId" element={<ProtectedRoute minPortal="oracula"><VozDetalhePage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/oraculo" element={<ProtectedRoute minPortal="oracula"><Oraculos /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/oraculo/:oracleSlug" element={<ProtectedRoute minPortal="oracula"><OracleHome /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/oraculo/:oracleSlug/tirar" element={<ProtectedRoute minPortal="oracula"><OracleDraw /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/oraculo/:oracleSlug/historico" element={<ProtectedRoute minPortal="oracula"><OracleHistory /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/oraculo/:oracleSlug/biblioteca" element={<ProtectedRoute minPortal="oracula"><OracleCardLibrary /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/dialogo-partes" element={<ProtectedRoute minPortal="oracula"><PlaceholderToolPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/mapa-transformacao" element={<ProtectedRoute minPortal="oracula"><PlaceholderToolPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/ritual-passagem" element={<ProtectedRoute minPortal="oracula"><PlaceholderToolPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/inventario-personas/:clienteId" element={<ProtectedRoute minPortal="aluna_formacao"><InventarioPersonasPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/mapeamento-complexos/:clienteId" element={<ProtectedRoute minPortal="aluna_formacao"><MapeamentoComplexosPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/mapa-sombra/:clienteId" element={<ProtectedRoute minPortal="aluna_formacao"><MapaSombraPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/diagnostico-ego/:clienteId" element={<ProtectedRoute minPortal="aluna_formacao"><DiagnosticoEgoPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/sonho-estruturado/:clienteId" element={<ProtectedRoute minPortal="aluna_formacao"><SonhoEstruturadoPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/imaginacao-ativa/:clienteId" element={<ProtectedRoute minPortal="aluna_formacao"><ImaginacaoAtivaPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/escrita-nao-censurada/:clienteId" element={<ProtectedRoute minPortal="aluna_formacao"><EscritaNaoCensuradaPage /></ProtectedRoute>} />
        <Route path="/casa-das-maquinas/ferramentas/corpo-inconsciente/:clienteId" element={<ProtectedRoute minPortal="aluna_formacao"><CorpoInconscientePage /></ProtectedRoute>} />
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
              <Navigate to="/biblioteca?aba=pessoal" replace />
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
        <Route
          path="/oraculos/:oracleSlug/biblioteca"
          element={
            <ProtectedRoute>
              <OracleCardLibrary />
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

        {/* Formação no Método Orácula (LMS) */}
        <Route
          path="/formacao-metodo"
          element={
            <ProtectedRoute minPortal="mentorada">
              <FormacaoMetodoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/formacao-metodo/forum"
          element={
            <ProtectedRoute minPortal="mentorada">
              <FormacaoForumPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/formacao-metodo/avaliacoes"
          element={
            <ProtectedRoute minPortal="mentorada">
              <FormacaoAvaliacoesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/biblioteca-das-travessias"
          element={
            <ProtectedRoute>
              <Navigate to="/biblioteca?aba=travessias" replace />
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
        <Route path="/planos-clube" element={<Navigate to="/planos" replace />} />
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
              <Navigate to="/minha-conta" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <Navigate to="/minha-conta" replace />
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
        <Route
          path="/templo-de-escuta"
          element={
            <ProtectedRoute>
              <TemploEscuta />
            </ProtectedRoute>
          }
        />

        {/* Biblioteca das Travessias - Redirect to unified biblioteca */}
        <Route
          path="/biblioteca-travessias"
          element={
            <ProtectedRoute>
              <Navigate to="/biblioteca?aba=travessias" replace />
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

