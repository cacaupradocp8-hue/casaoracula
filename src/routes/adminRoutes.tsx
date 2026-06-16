import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const Admin = React.lazy(() => import('@/pages/Admin'));
const CriarFerramenta = React.lazy(() => import('@/pages/admin/CriarFerramenta'));

const AdminModulosFormativos = React.lazy(() => import('@/pages/admin/AdminModulosFormativos'));
const AdminAlunaAcompanhamento = React.lazy(() => import('@/pages/admin/AdminAlunaAcompanhamento'));
const AdminOracleCardsPage = React.lazy(() => import('@/pages/admin/AdminOracleCardsPage'));
const ClubeEditorialPreviewPage = React.lazy(() => import('@/pages/admin/clube/ClubeEditorialPreviewPage'));

type PR = React.ComponentType<{ children: React.ReactNode; minPortal?: string }>;

export function renderAdminRoutes(ProtectedRoute: PR) {
  return (
    <>
      <Route key="adm" path="/admin" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route key="adm-rotas" path="/admin/rotas" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route key="adm-fc" path="/admin/ferramentas/criar" element={<ProtectedRoute minPortal="admin"><CriarFerramenta /></ProtectedRoute>} />
      
      <Route key="adm-mf" path="/admin/modulos-formativos" element={<ProtectedRoute minPortal="admin"><AdminModulosFormativos /></ProtectedRoute>} />
      <Route key="adm-oc" path="/admin/oracle-cards" element={<ProtectedRoute minPortal="admin"><AdminOracleCardsPage /></ProtectedRoute>} />
      <Route key="adm-al" path="/admin/alunas-acompanhamento" element={<ProtectedRoute minPortal="admin"><AdminAlunaAcompanhamento /></ProtectedRoute>} />
      <Route key="adm-quiz" path="/admin/quiz" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      
      {/* ═══ CENTRAL OFICIAL DO CLUBE ═══ */}

      <Route key="adm-cl-hub" path="/admin/clube" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route key="adm-cl-ciclos" path="/admin/clube/ciclos" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route key="adm-cl-portais" path="/admin/clube/portais" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route key="adm-cl-conteudos" path="/admin/clube/conteudos" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route key="adm-cl-treinamento" path="/admin/clube/treinamento" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route key="adm-cl-chat" path="/admin/clube/chat" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route key="adm-cl-lobos" path="/admin/clube/rota-dos-lobos" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route key="adm-cl-lab8020" path="/admin/clube/laboratorio-8020" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route key="adm-cl-ci" path="/admin/clube/carrosseis-insights" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route key="adm-cl-col" path="/admin/clube/colheita-rastros" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route key="adm-cl-central" path="/admin/clube/central/:estacaoId" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route key="adm-cl-rota" path="/admin/clube/rota/:estacaoId" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route key="adm-cl-preview" path="/admin/clube/preview/:itemId" element={<ProtectedRoute minPortal="admin"><ClubeEditorialPreviewPage /></ProtectedRoute>} />
      
      {/* ═══ REDIRECIONAMENTOS DE LEGADO (Movidos para legacyRedirects.tsx) ═══ */}
    </>
  );
}
