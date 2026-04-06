import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const Admin = React.lazy(() => import('@/pages/Admin'));
const CriarFerramenta = React.lazy(() => import('@/pages/admin/CriarFerramenta'));
const AtelieConteudo = React.lazy(() => import('@/pages/admin/AtelieConteudo'));
const AdminModulosFormativos = React.lazy(() => import('@/pages/admin/AdminModulosFormativos'));
const AdminBooks = React.lazy(() => import('@/pages/admin/AdminBooks'));
const AdminAlunaAcompanhamento = React.lazy(() => import('@/pages/admin/AdminAlunaAcompanhamento'));
const AdminOracleCardsPage = React.lazy(() => import('@/pages/admin/AdminOracleCardsPage'));

export function adminRoutes(ProtectedRoute: React.ComponentType<{ children: React.ReactNode; minPortal?: string }>) {
  return (
    <>
      <Route path="/admin" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />
      <Route path="/admin/ferramentas/criar" element={<ProtectedRoute minPortal="admin"><CriarFerramenta /></ProtectedRoute>} />
      <Route path="/admin/atelie-conteudo" element={<ProtectedRoute minPortal="admin"><AtelieConteudo /></ProtectedRoute>} />
      <Route path="/admin/modulos-formativos" element={<ProtectedRoute minPortal="admin"><AdminModulosFormativos /></ProtectedRoute>} />
      <Route path="/admin/books" element={<ProtectedRoute minPortal="admin"><AdminBooks /></ProtectedRoute>} />
      <Route path="/admin/oracle-cards" element={<ProtectedRoute minPortal="admin"><AdminOracleCardsPage /></ProtectedRoute>} />
      <Route path="/admin/alunas-acompanhamento" element={<ProtectedRoute minPortal="admin"><AdminAlunaAcompanhamento /></ProtectedRoute>} />
    </>
  );
}
