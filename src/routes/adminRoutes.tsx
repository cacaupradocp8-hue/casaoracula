import React from 'react';
import { Route } from 'react-router-dom';

const Admin = React.lazy(() => import('@/pages/Admin'));
const CriarFerramenta = React.lazy(() => import('@/pages/admin/CriarFerramenta'));
const AtelieConteudo = React.lazy(() => import('@/pages/admin/AtelieConteudo'));
const AdminModulosFormativos = React.lazy(() => import('@/pages/admin/AdminModulosFormativos'));
const AdminBooks = React.lazy(() => import('@/pages/admin/AdminBooks'));
const AdminAlunaAcompanhamento = React.lazy(() => import('@/pages/admin/AdminAlunaAcompanhamento'));
const AdminOracleCardsPage = React.lazy(() => import('@/pages/admin/AdminOracleCardsPage'));

// ═══ ESTRUTURA OFICIAL CLUBE (Sub-rotas do Admin) ═══
// Nota: Carregadas dentro do componente Admin.tsx para manter o layout da barra lateral
const AdminClubeHub = React.lazy(() => import('@/pages/admin/clube/AdminClubeHub'));
const AdminCentralJornadas = React.lazy(() => import('@/pages/admin/clube/AdminCentralJornadas'));
const AdminClubeAcervo = React.lazy(() => import('@/pages/admin/clube/AdminClubeAcervo'));
const AdminPortalCMS = React.lazy(() => import('@/pages/admin/clube/AdminPortalCMS'));
const AdminClubeTreinamento = React.lazy(() => import('@/pages/admin/clube/AdminClubeTreinamento'));
const AdminClubeChat = React.lazy(() => import('@/pages/admin/clube/AdminClubeChat'));

// Sub-páginas detalhadas
const AdminCentralEstacao = React.lazy(() => import('@/pages/admin/clube/AdminCentralEstacao'));
const AdminOraculoPortais = React.lazy(() => import('@/pages/admin/clube/AdminOraculoPortais'));
const AdminOraculoPortalEditor = React.lazy(() => import('@/pages/admin/clube/AdminOraculoPortalEditor'));

// Legado (serão removidas do menu, mas mantidas as rotas)
const AdminClubeCiclos = React.lazy(() => import('@/pages/admin/clube/AdminClubeCiclos'));
const AdminClubeEstacoes = React.lazy(() => import('@/pages/admin/clube/AdminClubeEstacoes'));
const AdminClubeEscutas = React.lazy(() => import('@/pages/admin/clube/AdminClubeEscutas'));
const AdminClubeEncontros = React.lazy(() => import('@/pages/admin/clube/AdminClubeEncontros'));
const AdminClubeGerador = React.lazy(() => import('@/pages/admin/clube/AdminClubeGerador'));
const AdminClubePortais = React.lazy(() => import('@/pages/admin/clube/AdminClubePortais'));
const AdminClubeConfig = React.lazy(() => import('@/pages/admin/clube/AdminClubeConfig'));
const AdminClubeJornadas = React.lazy(() => import('@/pages/admin/clube/AdminClubeJornadas'));

type PR = React.ComponentType<{ children: React.ReactNode; minPortal?: string }>;

export function renderAdminRoutes(ProtectedRoute: PR) {
  return (
    <>
      <Route key="adm" path="/admin" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route key="adm-fc" path="/admin/ferramentas/criar" element={<ProtectedRoute minPortal="admin"><CriarFerramenta /></ProtectedRoute>} />
      <Route key="adm-at" path="/admin/atelie-conteudo" element={<ProtectedRoute minPortal="admin"><AtelieConteudo /></ProtectedRoute>} />
      <Route key="adm-mf" path="/admin/modulos-formativos" element={<ProtectedRoute minPortal="admin"><AdminModulosFormativos /></ProtectedRoute>} />
      <Route key="adm-bk" path="/admin/books" element={<ProtectedRoute minPortal="admin"><AdminBooks /></ProtectedRoute>} />
      <Route key="adm-oc" path="/admin/oracle-cards" element={<ProtectedRoute minPortal="admin"><AdminOracleCardsPage /></ProtectedRoute>} />
      <Route key="adm-al" path="/admin/alunas-acompanhamento" element={<ProtectedRoute minPortal="admin"><AdminAlunaAcompanhamento /></ProtectedRoute>} />
      
      {/* ═══ REDIRECIONAMENTOS PARA O COMPONENTE ADMIN UNIFICADO ═══ */}
      <Route key="adm-cl-hub" path="/admin/clube" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route key="adm-cl-ciclos-new" path="/admin/clube/ciclos" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route key="adm-cl-portais-new" path="/admin/clube/portais" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route key="adm-cl-conteudos-new" path="/admin/clube/conteudos" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route key="adm-cl-treinamento-new" path="/admin/clube/treinamento" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route key="adm-cl-chat-new" path="/admin/clube/chat" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      
      {/* Sub-páginas da Central */}
      <Route key="adm-central-est" path="/admin/clube/central/:estacaoId" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route key="adm-cl-oraculo-portais" path="/admin/clube/oraculo-portais" element={<ProtectedRoute minPortal="admin"><AdminOraculoPortais /></ProtectedRoute>} />
      <Route key="adm-cl-oraculo-portal-edit" path="/admin/clube/oraculo-portais/:portalId" element={<ProtectedRoute minPortal="admin"><AdminOraculoPortalEditor /></ProtectedRoute>} />

      {/* ═══ LEGADO REDIRECTS PARA O ADMIN UNIFICADO ═══ */}
      <Route key="adm-cl-hub-old" path="/admin/clube-livro" element={<Navigate to="/admin/clube" replace />} />
      <Route key="adm-cl-ciclos" path="/admin/clube-livro/ciclos" element={<Navigate to="/admin/clube" replace />} />
      <Route key="adm-cl-acervo" path="/admin/clube-livro/acervo" element={<Navigate to="/admin/clube" replace />} />
      <Route key="adm-cl-estacoes" path="/admin/clube-livro/estacoes" element={<Navigate to="/admin/clube" replace />} />
      <Route key="adm-cl-escutas" path="/admin/clube-livro/escutas" element={<Navigate to="/admin/clube" replace />} />
      <Route key="adm-cl-encontros" path="/admin/clube-livro/encontros" element={<Navigate to="/admin/clube" replace />} />
      <Route key="adm-cl-gerador" path="/admin/clube-livro/gerador" element={<Navigate to="/admin/clube" replace />} />
      <Route key="adm-cl-portais-legacy" path="/admin/clube-livro/portais" element={<Navigate to="/admin/clube" replace />} />
      <Route key="adm-cl-config" path="/admin/clube-livro/config" element={<Navigate to="/admin/clube" replace />} />
      <Route key="adm-central" path="/admin/clube-livro/central" element={<Navigate to="/admin/clube" replace />} />
      <Route key="adm-cl-jornadas" path="/admin/clube-livro/jornadas" element={<Navigate to="/admin/clube" replace />} />
      <Route key="adm-cl-portais-cms" path="/admin/clube-livro/portais-cms" element={<Navigate to="/admin/clube" replace />} />
    </>
  );
}
