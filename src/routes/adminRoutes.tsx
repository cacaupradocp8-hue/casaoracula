import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const Admin = React.lazy(() => import('@/pages/Admin'));
const CriarFerramenta = React.lazy(() => import('@/pages/admin/CriarFerramenta'));
const AtelieConteudo = React.lazy(() => import('@/pages/admin/AtelieConteudo'));
const AdminModulosFormativos = React.lazy(() => import('@/pages/admin/AdminModulosFormativos'));
const AdminBooks = React.lazy(() => import('@/pages/admin/AdminBooks'));
const AdminAlunaAcompanhamento = React.lazy(() => import('@/pages/admin/AdminAlunaAcompanhamento'));
const AdminOracleCardsPage = React.lazy(() => import('@/pages/admin/AdminOracleCardsPage'));

// ESTRUTURA OFICIAL CLUBE (Sub-rotas do Admin)
// Nota: Carregadas dentro do componente Admin.tsx para manter o layout da barra lateral
const AdminOraculoPortais = React.lazy(() => import('@/pages/admin/clube/AdminOraculoPortais'));
const AdminOraculoPortalEditor = React.lazy(() => import('@/pages/admin/clube/AdminOraculoPortalEditor'));

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
      
      {/* ESTRUTURA OFICIAL CLUBE (Unificada em /admin/clube) */}
      <Route key="adm-cl-hub" path="/admin/clube" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route key="adm-cl-ciclos" path="/admin/clube/ciclos" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route key="adm-cl-portais" path="/admin/clube/portais" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route key="adm-cl-conteudos" path="/admin/clube/conteudos" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route key="adm-cl-treinamento" path="/admin/clube/treinamento" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route key="adm-cl-chat" path="/admin/clube/chat" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route key="adm-cl-central" path="/admin/clube/central/:estacaoId" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      
      {/* Sub-páginas externas (se houver necessidade de layout fora do Admin) */}
      <Route key="adm-cl-oraculo-portais" path="/admin/clube/oraculo-portais" element={<ProtectedRoute minPortal="admin"><AdminOraculoPortais /></ProtectedRoute>} />
      <Route key="adm-cl-oraculo-portal-edit" path="/admin/clube/oraculo-portais/:portalId" element={<ProtectedRoute minPortal="admin"><AdminOraculoPortalEditor /></ProtectedRoute>} />

      {/* REDIRECIONAMENTOS DE LEGADO */}
      <Route key="adm-cl-legacy-all" path="/admin/clube-livro/*" element={<Navigate to="/admin/clube" replace />} />
      <Route key="adm-cl-legacy-base" path="/admin/clube-livro" element={<Navigate to="/admin/clube" replace />} />
    </>
  );
}
