import React from 'react';
import { Route, Navigate, useParams } from 'react-router-dom';
import RedirectWithParams from '@/components/routing/RedirectWithParams';

// Lazy imports
const CasaDasMaquinas = React.lazy(() => import('@/pages/casa-maquinas/CasaDasMaquinas'));
const ClientesPage = React.lazy(() => import('@/pages/casa-maquinas/ClientesPage'));
const ClienteDetailPage = React.lazy(() => import('@/pages/casa-maquinas/ClienteDetailPage'));
const MapaCidadelaPage = React.lazy(() => import('@/pages/casa-maquinas/MapaCidadelaPage'));
const RelatorioJornadaPage = React.lazy(() => import('@/pages/RelatorioJornadaPage'));
const MapaVivoPage = React.lazy(() => import('@/pages/MapaVivoPage'));
const MapaVivoCidadelaPage = React.lazy(() => import('@/pages/casa-maquinas/MapaVivoCidadelaPage'));
const JornadaAlmaPage = React.lazy(() => import('@/pages/JornadaAlmaPage'));
const RituaisMudraPage = React.lazy(() => import('@/pages/RituaisMudraPage'));
const BussolaOniricaPage = React.lazy(() => import('@/pages/BussolaOniricaPage'));
const CirculoSagradoPage = React.lazy(() => import('@/pages/CirculoSagradoPage'));
const ModoSessaoPage = React.lazy(() => import('@/pages/casa-maquinas/ModoSessaoPage'));
const ModoSessaoImersivo = React.lazy(() => import('@/pages/casa-maquinas/ModoSessaoImersivo'));
const PerfilConducaoPage = React.lazy(() => import('@/pages/casa-maquinas/PerfilConducaoPage'));
const CampoDasClientesPage = React.lazy(() => import('@/pages/casa-maquinas/CampoDasClientesPage'));
const FerramentasPage = React.lazy(() => import('@/pages/casa-maquinas/FerramentasPage'));
const GruposPage = React.lazy(() => import('@/pages/casa-maquinas/GruposPage'));
const GrupoDetailPage = React.lazy(() => import('@/pages/casa-maquinas/GrupoDetailPage'));
const BibliotecaIntervPage = React.lazy(() => import('@/pages/casa-maquinas/BibliotecaIntervPage'));
const VariacoesFerramentasPage = React.lazy(() => import('@/pages/casa-maquinas/VariacoesFerramentasPage'));
const QaJardimSessoesPage = React.lazy(() => import('@/pages/casa-maquinas/QaJardimSessoesPage'));
const CasaTecelasPage = React.lazy(() => import('@/pages/casa-maquinas/CasaTecelasPage'));
const AcademiaPage = React.lazy(() => import('@/pages/casa-maquinas/AcademiaPage'));
const PerfilProfissionalPage = React.lazy(() => import('@/pages/casa-maquinas/PerfilProfissionalPage'));
const ConfiguracoesSaasPage = React.lazy(() => import('@/pages/casa-maquinas/ConfiguracoesSaasPage'));
const SalaTreinamentoPage = React.lazy(() => import('@/pages/SalaTreinamentoPage'));
const SessoesPage = React.lazy(() => import('@/pages/casa-maquinas/SessoesPage'));
const GestosIntegracaoPage = React.lazy(() => import('@/pages/casa-maquinas/GestosIntegracaoPage'));
const MapaVivoClientePage = React.lazy(() => import('@/pages/casa-maquinas/MapaVivoClientePage'));
const PainelInstitucionalPage = React.lazy(() => import('@/pages/casa-maquinas/PainelInstitucionalPage'));
const PainelClinicoPage = React.lazy(() => import('@/pages/casa-maquinas/PainelClinicoPage'));
// CartografiaPage removed — all cartografia routes redirect to /ferramenta/cartografia-psiquica-oracula
const TorreVivaPage = React.lazy(() => import('@/pages/casa-maquinas/ferramentas/TorreVivaPage'));
const LabirintoPage = React.lazy(() => import('@/pages/casa-maquinas/ferramentas/LabirintoPage'));
const DecodificacaoOniricaPage = React.lazy(() => import('@/pages/casa-maquinas/ferramentas/DecodificacaoOniricaPage'));
const AtlasArquetiposPage = React.lazy(() => import('@/pages/casa-maquinas/ferramentas/AtlasArquetiposPage'));
const InventarioPersonasPage = React.lazy(() => import('@/pages/casa-maquinas/ferramentas/InventarioPersonasPage'));
const MapeamentoComplexosPage = React.lazy(() => import('@/pages/casa-maquinas/ferramentas/MapeamentoComplexosPage'));
const MapaSombraPage = React.lazy(() => import('@/pages/casa-maquinas/ferramentas/MapaSombraPage'));
const DiagnosticoEgoPage = React.lazy(() => import('@/pages/casa-maquinas/ferramentas/DiagnosticoEgoPage'));
const SonhoEstruturadoPage = React.lazy(() => import('@/pages/casa-maquinas/ferramentas/SonhoEstruturadoPage'));
const ImaginacaoAtivaPage = React.lazy(() => import('@/pages/casa-maquinas/ferramentas/ImaginacaoAtivaPage'));
const EscritaNaoCensuradaPage = React.lazy(() => import('@/pages/casa-maquinas/ferramentas/EscritaNaoCensuradaPage'));
const CorpoInconscientePage = React.lazy(() => import('@/pages/casa-maquinas/ferramentas/CorpoInconscientePage'));
const VozesHomePage = React.lazy(() => import('@/pages/casa-maquinas/VozesHomePage'));
const VozesListaPage = React.lazy(() => import('@/pages/casa-maquinas/VozesListaPage'));
const VozDetalhePage = React.lazy(() => import('@/pages/casa-maquinas/VozDetalhePage'));
const VozesMapaPage = React.lazy(() => import('@/pages/casa-maquinas/VozesMapaPage'));
const VozesTabelaPage = React.lazy(() => import('@/pages/casa-maquinas/VozesTabelaPage'));
const JardimOficioPage = React.lazy(() => import('@/pages/jardim-oficio/JardimOficioPage'));
const PainelSupervisaoPage = React.lazy(() => import('@/pages/jardim-oficio/PainelSupervisaoPage'));
const CursoDeusasPage = React.lazy(() => import('@/pages/CursoDeusasPage'));
const CursoChaveOniricaPage = React.lazy(() => import('@/pages/CursoChaveOniricaPage'));
const CabineTerapeutaPage = React.lazy(() => import('@/pages/casa-maquinas/CabineTerapeutaPage'));

function OracleRedirectCM({ suffix = '' }: { suffix?: string }) {
  const { oracleSlug } = useParams();
  return <Navigate to={`/oraculos/${oracleSlug}${suffix}`} replace />;
}

type PR = React.ComponentType<{ children: React.ReactNode; minPortal?: string }>;

export function renderCasaMaquinasRoutes(ProtectedRoute: PR) {
  return (
    <>
    <Route key="cm-home" path="/casa-das-maquinas" element={<ProtectedRoute minPortal="oracula"><CasaDasMaquinas /></ProtectedRoute>} />,
    <Route key="cm-cab" path="/casa-das-maquinas/cabine" element={<ProtectedRoute minPortal="oracula"><CabineTerapeutaPage /></ProtectedRoute>} />,
    <Route key="cm-cli" path="/casa-das-maquinas/clientes" element={<ProtectedRoute minPortal="oracula"><ClientesPage /></ProtectedRoute>} />,
    <Route key="cm-cli-d" path="/casa-das-maquinas/clientes/:clienteId" element={<ProtectedRoute minPortal="oracula"><ClienteDetailPage /></ProtectedRoute>} />,
    <Route key="cm-mc" path="/casa-das-maquinas/clientes/:clienteId/mapa-cidadela" element={<ProtectedRoute minPortal="oracula"><MapaCidadelaPage /></ProtectedRoute>} />,
    <Route key="cm-rj" path="/casa-das-maquinas/clientes/:clienteId/relatorio-jornada" element={<ProtectedRoute minPortal="oracula"><RelatorioJornadaPage /></ProtectedRoute>} />,
    <Route key="cm-mv" path="/casa-das-maquinas/clientes/:clienteId/mapa-vivo" element={<ProtectedRoute minPortal="oracula"><MapaVivoPage /></ProtectedRoute>} />,
    <Route key="cm-cv" path="/casa-das-maquinas/clientes/:clienteId/cidadela-viva" element={<ProtectedRoute minPortal="oracula"><MapaVivoCidadelaPage /></ProtectedRoute>} />,
    <Route key="cm-ja" path="/casa-das-maquinas/clientes/:clienteId/jornada-alma" element={<ProtectedRoute minPortal="aluna_formacao"><JornadaAlmaPage /></ProtectedRoute>} />,
    <Route key="cm-rm" path="/casa-das-maquinas/clientes/:clienteId/rituais-mudra" element={<ProtectedRoute minPortal="aluna_formacao"><RituaisMudraPage /></ProtectedRoute>} />,
    <Route key="cm-bo" path="/casa-das-maquinas/clientes/:clienteId/bussola-onirica" element={<ProtectedRoute minPortal="aluna_formacao"><BussolaOniricaPage /></ProtectedRoute>} />,
    <Route key="cm-cs" path="/casa-das-maquinas/clientes/:clienteId/circulo-sagrado" element={<ProtectedRoute minPortal="aluna_formacao"><CirculoSagradoPage /></ProtectedRoute>} />,
    // Legacy redirects
    <Route key="rdr-mc" path="/saas/clientes/:clienteId/mapa-cidadela" element={<RedirectWithParams to="/casa-das-maquinas/clientes/:clienteId/mapa-cidadela" />} />,
    <Route key="rdr-rj" path="/saas/clientes/:clienteId/relatorio-jornada" element={<RedirectWithParams to="/casa-das-maquinas/clientes/:clienteId/relatorio-jornada" />} />,
    <Route key="rdr-mv" path="/saas/clientes/:clienteId/mapa-vivo" element={<RedirectWithParams to="/casa-das-maquinas/clientes/:clienteId/mapa-vivo" />} />,
    <Route key="rdr-cv" path="/saas/clientes/:clienteId/cidadela-viva" element={<RedirectWithParams to="/casa-das-maquinas/clientes/:clienteId/cidadela-viva" />} />,
    <Route key="rdr-ja" path="/saas/clientes/:clienteId/jornada-alma" element={<RedirectWithParams to="/casa-das-maquinas/clientes/:clienteId/jornada-alma" />} />,
    <Route key="rdr-rm" path="/saas/clientes/:clienteId/rituais-mudra" element={<RedirectWithParams to="/casa-das-maquinas/clientes/:clienteId/rituais-mudra" />} />,
    <Route key="rdr-bo" path="/saas/clientes/:clienteId/bussola-onirica" element={<RedirectWithParams to="/casa-das-maquinas/clientes/:clienteId/bussola-onirica" />} />,
    <Route key="rdr-cs" path="/saas/clientes/:clienteId/circulo-sagrado" element={<RedirectWithParams to="/casa-das-maquinas/clientes/:clienteId/circulo-sagrado" />} />,
    <Route key="rdr-cid" path="/app/clientes/:clienteId/cidadela" element={<RedirectWithParams to="/casa-das-maquinas/clientes/:clienteId/mapa-cidadela" />} />,
    <Route key="cm-deusas" path="/academia/curso-deusas" element={<ProtectedRoute minPortal="aluna_formacao"><CursoDeusasPage /></ProtectedRoute>} />,
    <Route key="cm-chave" path="/academia/curso-chave-onirica" element={<ProtectedRoute minPortal="aluna_formacao"><CursoChaveOniricaPage /></ProtectedRoute>} />,
    <Route key="cm-ns" path="/casa-das-maquinas/nova-sessao" element={<ProtectedRoute minPortal="oracula"><ModoSessaoPage /></ProtectedRoute>} />,
    <Route key="cm-pc" path="/casa-das-maquinas/perfil-conducao" element={<ProtectedRoute minPortal="oracula"><PerfilConducaoPage /></ProtectedRoute>} />,
    <Route key="cm-cc" path="/casa-das-maquinas/campo-clientes" element={<ProtectedRoute minPortal="oracula"><CampoDasClientesPage /></ProtectedRoute>} />,
    <Route key="cm-si" path="/casa-das-maquinas/sessao/:clienteId" element={<ProtectedRoute minPortal="oracula"><ModoSessaoImersivo /></ProtectedRoute>} />,
    <Route key="rdr-si" path="/saas/sessao/:clienteId" element={<RedirectWithParams to="/casa-das-maquinas/sessao/:clienteId" />} />,
    <Route key="cm-fer" path="/casa-das-maquinas/ferramentas" element={<ProtectedRoute minPortal="oracula"><FerramentasPage /></ProtectedRoute>} />,
    <Route key="cm-gr" path="/casa-das-maquinas/grupos" element={<ProtectedRoute minPortal="oracula"><GruposPage /></ProtectedRoute>} />,
    <Route key="cm-grd" path="/casa-das-maquinas/grupos/:groupId" element={<ProtectedRoute minPortal="oracula"><GrupoDetailPage /></ProtectedRoute>} />,
    <Route key="cm-bib" path="/casa-das-maquinas/biblioteca" element={<ProtectedRoute minPortal="oracula"><BibliotecaIntervPage /></ProtectedRoute>} />,
    <Route key="cm-var" path="/casa-das-maquinas/variacoes-ferramentas" element={<ProtectedRoute minPortal="oracula"><VariacoesFerramentasPage /></ProtectedRoute>} />,
    <Route key="cm-qa" path="/casa-das-maquinas/qa-jardim-sessoes" element={<ProtectedRoute minPortal="admin"><QaJardimSessoesPage /></ProtectedRoute>} />,
    <Route key="rdr-bib" path="/saas/biblioteca" element={<Navigate to="/casa-das-maquinas/biblioteca" replace />} />,
    <Route key="cm-tec" path="/casa-das-maquinas/tecelãs" element={<ProtectedRoute minPortal="aluna"><CasaTecelasPage /></ProtectedRoute>} />,
    <Route key="cm-acad" path="/casa-das-maquinas/academia" element={<ProtectedRoute minPortal="oracula"><AcademiaPage /></ProtectedRoute>} />,
    <Route key="cm-prof" path="/casa-das-maquinas/perfil-profissional" element={<ProtectedRoute minPortal="oracula"><PerfilProfissionalPage /></ProtectedRoute>} />,
    <Route key="cm-conf" path="/casa-das-maquinas/configuracoes" element={<ProtectedRoute minPortal="aluna_formacao"><ConfiguracoesSaasPage /></ProtectedRoute>} />,
    <Route key="cm-trei" path="/casa-das-maquinas/treinamento" element={<ProtectedRoute minPortal="aluna_formacao"><SalaTreinamentoPage /></ProtectedRoute>} />,
    <Route key="cm-cart" path="/casa-das-maquinas/ferramentas/cartografia" element={<Navigate to="/ferramenta/cartografia-psiquica-oracula" replace />} />,
    <Route key="cm-tv" path="/casa-das-maquinas/ferramentas/torre-viva" element={<ProtectedRoute minPortal="oracula"><TorreVivaPage /></ProtectedRoute>} />,
    <Route key="cm-lab" path="/casa-das-maquinas/ferramentas/labirinto" element={<ProtectedRoute minPortal="oracula"><LabirintoPage /></ProtectedRoute>} />,
    <Route key="cm-don" path="/casa-das-maquinas/ferramentas/decodificacao-onirica" element={<ProtectedRoute minPortal="oracula"><DecodificacaoOniricaPage /></ProtectedRoute>} />,
    <Route key="cm-atl" path="/casa-das-maquinas/ferramentas/atlas-arquetipos" element={<ProtectedRoute minPortal="oracula"><AtlasArquetiposPage /></ProtectedRoute>} />,
    <Route key="cm-es" path="/casa-das-maquinas/ferramentas/escrita-simbolica" element={<Navigate to="/casa-das-maquinas/ferramentas" replace />} />,
    <Route key="cm-er" path="/casa-das-maquinas/ferramentas/espelho-relacional" element={<Navigate to="/casa-das-maquinas/ferramentas" replace />} />,
    <Route key="cm-rs" path="/casa-das-maquinas/ferramentas/ritual-simbolico" element={<Navigate to="/casa-das-maquinas/ferramentas" replace />} />,
    <Route key="cm-7v" path="/casa-das-maquinas/7-vozes" element={<ProtectedRoute minPortal="oracula"><VozesHomePage /></ProtectedRoute>} />,
    <Route key="cm-7vl" path="/casa-das-maquinas/7-vozes/lista" element={<ProtectedRoute minPortal="oracula"><VozesListaPage /></ProtectedRoute>} />,
    <Route key="cm-7vm" path="/casa-das-maquinas/7-vozes/mapa" element={<ProtectedRoute minPortal="oracula"><VozesMapaPage /></ProtectedRoute>} />,
    <Route key="cm-7vt" path="/casa-das-maquinas/7-vozes/tabela" element={<ProtectedRoute minPortal="oracula"><VozesTabelaPage /></ProtectedRoute>} />,
    <Route key="cm-7vd" path="/casa-das-maquinas/7-vozes/:vozId" element={<ProtectedRoute minPortal="oracula"><VozDetalhePage /></ProtectedRoute>} />,
    <Route key="cm-orc" path="/casa-das-maquinas/oraculo" element={<Navigate to="/oraculos" replace />} />,
    <Route key="cm-orc1" path="/casa-das-maquinas/oraculo/:oracleSlug" element={<OracleRedirectCM />} />,
    <Route key="cm-orc2" path="/casa-das-maquinas/oraculo/:oracleSlug/tirar" element={<OracleRedirectCM suffix="/tirar" />} />,
    <Route key="cm-orc3" path="/casa-das-maquinas/oraculo/:oracleSlug/historico" element={<OracleRedirectCM suffix="/historico" />} />,
    <Route key="cm-orc4" path="/casa-das-maquinas/oraculo/:oracleSlug/biblioteca" element={<OracleRedirectCM suffix="/biblioteca" />} />,
    <Route key="cm-dp" path="/casa-das-maquinas/ferramentas/dialogo-partes" element={<Navigate to="/casa-das-maquinas/ferramentas" replace />} />,
    <Route key="cm-mt" path="/casa-das-maquinas/ferramentas/mapa-transformacao" element={<Navigate to="/casa-das-maquinas/ferramentas" replace />} />,
    <Route key="cm-rp" path="/casa-das-maquinas/ferramentas/ritual-passagem" element={<Navigate to="/casa-das-maquinas/ferramentas" replace />} />,
    <Route key="cm-ip" path="/casa-das-maquinas/ferramentas/inventario-personas/:clienteId" element={<ProtectedRoute minPortal="aluna_formacao"><InventarioPersonasPage /></ProtectedRoute>} />,
    <Route key="cm-mpc" path="/casa-das-maquinas/ferramentas/mapeamento-complexos/:clienteId" element={<ProtectedRoute minPortal="aluna_formacao"><MapeamentoComplexosPage /></ProtectedRoute>} />,
    <Route key="cm-ms" path="/casa-das-maquinas/ferramentas/mapa-sombra/:clienteId" element={<ProtectedRoute minPortal="aluna_formacao"><MapaSombraPage /></ProtectedRoute>} />,
    <Route key="cm-de" path="/casa-das-maquinas/ferramentas/diagnostico-ego/:clienteId" element={<ProtectedRoute minPortal="aluna_formacao"><DiagnosticoEgoPage /></ProtectedRoute>} />,
    <Route key="cm-se" path="/casa-das-maquinas/ferramentas/sonho-estruturado/:clienteId" element={<ProtectedRoute minPortal="aluna_formacao"><SonhoEstruturadoPage /></ProtectedRoute>} />,
    <Route key="cm-ia" path="/casa-das-maquinas/ferramentas/imaginacao-ativa/:clienteId" element={<ProtectedRoute minPortal="aluna_formacao"><ImaginacaoAtivaPage /></ProtectedRoute>} />,
    <Route key="cm-enc" path="/casa-das-maquinas/ferramentas/escrita-nao-censurada/:clienteId" element={<ProtectedRoute minPortal="aluna_formacao"><EscritaNaoCensuradaPage /></ProtectedRoute>} />,
    <Route key="cm-ci" path="/casa-das-maquinas/ferramentas/corpo-inconsciente/:clienteId" element={<ProtectedRoute minPortal="aluna_formacao"><CorpoInconscientePage /></ProtectedRoute>} />,
    <Route key="cm-sess" path="/casa-das-maquinas/sessoes" element={<ProtectedRoute minPortal="oracula"><SessoesPage /></ProtectedRoute>} />,
    <Route key="cm-gest" path="/casa-das-maquinas/gestos" element={<ProtectedRoute minPortal="oracula"><GestosIntegracaoPage /></ProtectedRoute>} />,
    <Route key="cm-mvc" path="/casa-das-maquinas/mapa-vivo/:clienteId" element={<ProtectedRoute minPortal="oracula"><MapaVivoClientePage /></ProtectedRoute>} />,
    <Route key="cm-pain" path="/casa-das-maquinas/painel" element={<ProtectedRoute minPortal="admin"><PainelInstitucionalPage /></ProtectedRoute>} />,
    <Route key="cm-pcli" path="/casa-das-maquinas/painel-clinico" element={<ProtectedRoute minPortal="oracula"><PainelClinicoPage /></ProtectedRoute>} />,
    <Route key="cm-jo" path="/casa-das-maquinas/jardim-oficio" element={<ProtectedRoute minPortal="oracula"><JardimOficioPage /></ProtectedRoute>} />,
    <Route key="cm-sup" path="/casa-das-maquinas/supervisao" element={<ProtectedRoute minPortal="assinante"><PainelSupervisaoPage /></ProtectedRoute>} />,
    <Route key="cm-com" path="/casa-das-maquinas/comunidade" element={<Navigate to="/comunidade" replace />} />,
    <Route key="cm-af" path="/casa-das-maquinas/academia-formacao" element={<Navigate to="/academia" replace />} />,
    </>
  );
}
