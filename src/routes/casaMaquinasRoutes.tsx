import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import RedirectWithParams from '@/components/routing/RedirectWithParams';
import { SectionErrorBoundary } from '@/components/shared/SectionErrorBoundary';

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
const CartografiaPage = React.lazy(() => import('@/pages/casa-maquinas/ferramentas/CartografiaPage'));
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

function OracleRedirect({ suffix = '' }: { suffix?: string }) {
  const { oracleSlug } = require('react-router-dom').useParams();
  return <Navigate to={`/oraculos/${oracleSlug}${suffix}`} replace />;
}

export function casaMaquinasRoutes(ProtectedRoute: React.ComponentType<{ children: React.ReactNode; minPortal?: string }>) {
  return (
    <SectionErrorBoundary sectionName="Casa das Máquinas">
      <Route path="/casa-das-maquinas" element={<ProtectedRoute minPortal="oracula"><CasaDasMaquinas /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/clientes" element={<ProtectedRoute minPortal="oracula"><ClientesPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/clientes/:clienteId" element={<ProtectedRoute minPortal="oracula"><ClienteDetailPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/clientes/:clienteId/mapa-cidadela" element={<ProtectedRoute minPortal="oracula"><MapaCidadelaPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/clientes/:clienteId/relatorio-jornada" element={<ProtectedRoute minPortal="oracula"><RelatorioJornadaPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/clientes/:clienteId/mapa-vivo" element={<ProtectedRoute minPortal="oracula"><MapaVivoPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/clientes/:clienteId/cidadela-viva" element={<ProtectedRoute minPortal="oracula"><MapaVivoCidadelaPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/clientes/:clienteId/jornada-alma" element={<ProtectedRoute minPortal="aluna_formacao"><JornadaAlmaPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/clientes/:clienteId/rituais-mudra" element={<ProtectedRoute minPortal="aluna_formacao"><RituaisMudraPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/clientes/:clienteId/bussola-onirica" element={<ProtectedRoute minPortal="aluna_formacao"><BussolaOniricaPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/clientes/:clienteId/circulo-sagrado" element={<ProtectedRoute minPortal="aluna_formacao"><CirculoSagradoPage /></ProtectedRoute>} />
      {/* Legacy redirects */}
      <Route path="/saas/clientes/:clienteId/mapa-cidadela" element={<RedirectWithParams to="/casa-das-maquinas/clientes/:clienteId/mapa-cidadela" />} />
      <Route path="/saas/clientes/:clienteId/relatorio-jornada" element={<RedirectWithParams to="/casa-das-maquinas/clientes/:clienteId/relatorio-jornada" />} />
      <Route path="/saas/clientes/:clienteId/mapa-vivo" element={<RedirectWithParams to="/casa-das-maquinas/clientes/:clienteId/mapa-vivo" />} />
      <Route path="/saas/clientes/:clienteId/cidadela-viva" element={<RedirectWithParams to="/casa-das-maquinas/clientes/:clienteId/cidadela-viva" />} />
      <Route path="/saas/clientes/:clienteId/jornada-alma" element={<RedirectWithParams to="/casa-das-maquinas/clientes/:clienteId/jornada-alma" />} />
      <Route path="/saas/clientes/:clienteId/rituais-mudra" element={<RedirectWithParams to="/casa-das-maquinas/clientes/:clienteId/rituais-mudra" />} />
      <Route path="/saas/clientes/:clienteId/bussola-onirica" element={<RedirectWithParams to="/casa-das-maquinas/clientes/:clienteId/bussola-onirica" />} />
      <Route path="/saas/clientes/:clienteId/circulo-sagrado" element={<RedirectWithParams to="/casa-das-maquinas/clientes/:clienteId/circulo-sagrado" />} />
      <Route path="/app/clientes/:clienteId/cidadela" element={<RedirectWithParams to="/casa-das-maquinas/clientes/:clienteId/mapa-cidadela" />} />
      <Route path="/academia/curso-deusas" element={<ProtectedRoute minPortal="aluna_formacao"><CursoDeusasPage /></ProtectedRoute>} />
      <Route path="/academia/curso-chave-onirica" element={<ProtectedRoute minPortal="aluna_formacao"><CursoChaveOniricaPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/nova-sessao" element={<ProtectedRoute minPortal="oracula"><ModoSessaoPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/perfil-conducao" element={<ProtectedRoute minPortal="oracula"><PerfilConducaoPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/campo-clientes" element={<ProtectedRoute minPortal="oracula"><CampoDasClientesPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/sessao/:clienteId" element={<ProtectedRoute minPortal="oracula"><ModoSessaoImersivo /></ProtectedRoute>} />
      <Route path="/saas/sessao/:clienteId" element={<RedirectWithParams to="/casa-das-maquinas/sessao/:clienteId" />} />
      <Route path="/casa-das-maquinas/ferramentas" element={<ProtectedRoute minPortal="oracula"><FerramentasPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/grupos" element={<ProtectedRoute minPortal="oracula"><GruposPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/grupos/:groupId" element={<ProtectedRoute minPortal="oracula"><GrupoDetailPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/biblioteca" element={<ProtectedRoute minPortal="oracula"><BibliotecaIntervPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/variacoes-ferramentas" element={<ProtectedRoute minPortal="oracula"><VariacoesFerramentasPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/qa-jardim-sessoes" element={<ProtectedRoute minPortal="admin"><QaJardimSessoesPage /></ProtectedRoute>} />
      <Route path="/saas/biblioteca" element={<Navigate to="/casa-das-maquinas/biblioteca" replace />} />
      <Route path="/casa-das-maquinas/tecelãs" element={<ProtectedRoute minPortal="aluna"><CasaTecelasPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/academia" element={<ProtectedRoute minPortal="oracula"><AcademiaPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/perfil-profissional" element={<ProtectedRoute minPortal="oracula"><PerfilProfissionalPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/configuracoes" element={<ProtectedRoute minPortal="aluna_formacao"><ConfiguracoesSaasPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/treinamento" element={<ProtectedRoute minPortal="aluna_formacao"><SalaTreinamentoPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/ferramentas/cartografia" element={<ProtectedRoute minPortal="oracula"><CartografiaPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/ferramentas/torre-viva" element={<ProtectedRoute minPortal="oracula"><TorreVivaPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/ferramentas/labirinto" element={<ProtectedRoute minPortal="oracula"><LabirintoPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/ferramentas/decodificacao-onirica" element={<ProtectedRoute minPortal="oracula"><DecodificacaoOniricaPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/ferramentas/atlas-arquetipos" element={<ProtectedRoute minPortal="oracula"><AtlasArquetiposPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/ferramentas/escrita-simbolica" element={<Navigate to="/casa-das-maquinas/ferramentas" replace />} />
      <Route path="/casa-das-maquinas/ferramentas/espelho-relacional" element={<Navigate to="/casa-das-maquinas/ferramentas" replace />} />
      <Route path="/casa-das-maquinas/ferramentas/ritual-simbolico" element={<Navigate to="/casa-das-maquinas/ferramentas" replace />} />
      <Route path="/casa-das-maquinas/7-vozes" element={<ProtectedRoute minPortal="oracula"><VozesHomePage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/7-vozes/lista" element={<ProtectedRoute minPortal="oracula"><VozesListaPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/7-vozes/mapa" element={<ProtectedRoute minPortal="oracula"><VozesMapaPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/7-vozes/tabela" element={<ProtectedRoute minPortal="oracula"><VozesTabelaPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/7-vozes/:vozId" element={<ProtectedRoute minPortal="oracula"><VozDetalhePage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/oraculo" element={<Navigate to="/oraculos" replace />} />
      <Route path="/casa-das-maquinas/ferramentas/dialogo-partes" element={<Navigate to="/casa-das-maquinas/ferramentas" replace />} />
      <Route path="/casa-das-maquinas/ferramentas/mapa-transformacao" element={<Navigate to="/casa-das-maquinas/ferramentas" replace />} />
      <Route path="/casa-das-maquinas/ferramentas/ritual-passagem" element={<Navigate to="/casa-das-maquinas/ferramentas" replace />} />
      <Route path="/casa-das-maquinas/ferramentas/inventario-personas/:clienteId" element={<ProtectedRoute minPortal="aluna_formacao"><InventarioPersonasPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/ferramentas/mapeamento-complexos/:clienteId" element={<ProtectedRoute minPortal="aluna_formacao"><MapeamentoComplexosPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/ferramentas/mapa-sombra/:clienteId" element={<ProtectedRoute minPortal="aluna_formacao"><MapaSombraPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/ferramentas/diagnostico-ego/:clienteId" element={<ProtectedRoute minPortal="aluna_formacao"><DiagnosticoEgoPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/ferramentas/sonho-estruturado/:clienteId" element={<ProtectedRoute minPortal="aluna_formacao"><SonhoEstruturadoPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/ferramentas/imaginacao-ativa/:clienteId" element={<ProtectedRoute minPortal="aluna_formacao"><ImaginacaoAtivaPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/ferramentas/escrita-nao-censurada/:clienteId" element={<ProtectedRoute minPortal="aluna_formacao"><EscritaNaoCensuradaPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/ferramentas/corpo-inconsciente/:clienteId" element={<ProtectedRoute minPortal="aluna_formacao"><CorpoInconscientePage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/sessoes" element={<ProtectedRoute minPortal="oracula"><SessoesPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/gestos" element={<ProtectedRoute minPortal="oracula"><GestosIntegracaoPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/mapa-vivo/:clienteId" element={<ProtectedRoute minPortal="oracula"><MapaVivoClientePage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/painel" element={<ProtectedRoute minPortal="admin"><PainelInstitucionalPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/painel-clinico" element={<ProtectedRoute minPortal="oracula"><PainelClinicoPage /></ProtectedRoute>} />
      {/* Jardim do Ofício */}
      <Route path="/casa-das-maquinas/jardim-oficio" element={<ProtectedRoute minPortal="oracula"><JardimOficioPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/supervisao" element={<ProtectedRoute minPortal="assinante"><PainelSupervisaoPage /></ProtectedRoute>} />
      <Route path="/casa-das-maquinas/comunidade" element={<Navigate to="/comunidade" replace />} />
      <Route path="/casa-das-maquinas/academia-formacao" element={<Navigate to="/academia" replace />} />
    </SectionErrorBoundary>
  );
}
