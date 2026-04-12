import React from 'react';
import { Route } from 'react-router-dom';

const Admin = React.lazy(() => import('@/pages/Admin'));
const CriarFerramenta = React.lazy(() => import('@/pages/admin/CriarFerramenta'));
const AtelieConteudo = React.lazy(() => import('@/pages/admin/AtelieConteudo'));
const AdminModulosFormativos = React.lazy(() => import('@/pages/admin/AdminModulosFormativos'));
const AdminBooks = React.lazy(() => import('@/pages/admin/AdminBooks'));
const AdminAlunaAcompanhamento = React.lazy(() => import('@/pages/admin/AdminAlunaAcompanhamento'));
const AdminOracleCardsPage = React.lazy(() => import('@/pages/admin/AdminOracleCardsPage'));
const AdminClubeJornadas = React.lazy(() => import('@/pages/admin/clube/AdminClubeJornadas'));
const AdminPortalCMS = React.lazy(() => import('@/pages/admin/clube/AdminPortalCMS'));

// Clube de Leitura Oracular — Hub + Sub-páginas
const AdminClubeHub = React.lazy(() => import('@/pages/admin/clube/AdminClubeHub'));
const AdminClubeCiclos = React.lazy(() => import('@/pages/admin/clube/AdminClubeCiclos'));
const AdminClubeAcervo = React.lazy(() => import('@/pages/admin/clube/AdminClubeAcervo'));
const AdminClubeEstacoes = React.lazy(() => import('@/pages/admin/clube/AdminClubeEstacoes'));
const AdminClubeEscutas = React.lazy(() => import('@/pages/admin/clube/AdminClubeEscutas'));
const AdminClubeEncontros = React.lazy(() => import('@/pages/admin/clube/AdminClubeEncontros'));
const AdminClubeGerador = React.lazy(() => import('@/pages/admin/clube/AdminClubeGerador'));
const AdminClubePortais = React.lazy(() => import('@/pages/admin/clube/AdminClubePortais'));
const AdminClubeConfig = React.lazy(() => import('@/pages/admin/clube/AdminClubeConfig'));

type PR = React.ComponentType<{ children: React.ReactNode; minPortal?: string }>;

export function renderAdminRoutes(ProtectedRoute: PR) {
  return [
    <Route key="adm" path="/admin" element={<ProtectedRoute minPortal="admin"><Admin /></ProtectedRoute>} />,
    <Route key="adm-fc" path="/admin/ferramentas/criar" element={<ProtectedRoute minPortal="admin"><CriarFerramenta /></ProtectedRoute>} />,
    <Route key="adm-at" path="/admin/atelie-conteudo" element={<ProtectedRoute minPortal="admin"><AtelieConteudo /></ProtectedRoute>} />,
    <Route key="adm-mf" path="/admin/modulos-formativos" element={<ProtectedRoute minPortal="admin"><AdminModulosFormativos /></ProtectedRoute>} />,
    <Route key="adm-bk" path="/admin/books" element={<ProtectedRoute minPortal="admin"><AdminBooks /></ProtectedRoute>} />,
    <Route key="adm-oc" path="/admin/oracle-cards" element={<ProtectedRoute minPortal="admin"><AdminOracleCardsPage /></ProtectedRoute>} />,
    <Route key="adm-al" path="/admin/alunas-acompanhamento" element={<ProtectedRoute minPortal="admin"><AdminAlunaAcompanhamento /></ProtectedRoute>} />,
    // Clube de Leitura Oracular
    <Route key="adm-cl-hub" path="/admin/clube-livro" element={<ProtectedRoute minPortal="admin"><AdminClubeHub /></ProtectedRoute>} />,
    <Route key="adm-cl-ciclos" path="/admin/clube-livro/ciclos" element={<ProtectedRoute minPortal="admin"><AdminClubeCiclos /></ProtectedRoute>} />,
    <Route key="adm-cl-acervo" path="/admin/clube-livro/acervo" element={<ProtectedRoute minPortal="admin"><AdminClubeAcervo /></ProtectedRoute>} />,
    <Route key="adm-cl-estacoes" path="/admin/clube-livro/estacoes" element={<ProtectedRoute minPortal="admin"><AdminClubeEstacoes /></ProtectedRoute>} />,
    <Route key="adm-cl-escutas" path="/admin/clube-livro/escutas" element={<ProtectedRoute minPortal="admin"><AdminClubeEscutas /></ProtectedRoute>} />,
    <Route key="adm-cl-encontros" path="/admin/clube-livro/encontros" element={<ProtectedRoute minPortal="admin"><AdminClubeEncontros /></ProtectedRoute>} />,
    <Route key="adm-cl-gerador" path="/admin/clube-livro/gerador" element={<ProtectedRoute minPortal="admin"><AdminClubeGerador /></ProtectedRoute>} />,
    <Route key="adm-cl-portais" path="/admin/clube-livro/portais" element={<ProtectedRoute minPortal="admin"><AdminClubePortais /></ProtectedRoute>} />,
    <Route key="adm-cl-config" path="/admin/clube-livro/config" element={<ProtectedRoute minPortal="admin"><AdminClubeConfig /></ProtectedRoute>} />,
    <Route key="adm-cl-jornadas" path="/admin/clube-livro/jornadas" element={<ProtectedRoute minPortal="admin"><AdminClubeJornadas /></ProtectedRoute>} />,
    <Route key="adm-cl-portais-cms" path="/admin/clube-livro/portais-cms" element={<ProtectedRoute minPortal="admin"><AdminPortalCMS /></ProtectedRoute>} />,
  ];
}
