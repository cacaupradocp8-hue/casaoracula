import React from "react";
import { Route, Navigate } from "react-router-dom";

// Lazy-loaded pages (Importing same components used in App.tsx)
const ClubeRotasCatalogo = React.lazy(() => import("@/pages/clube/ClubeRotasCatalogo"));
const ClubeRotaPremium = React.lazy(() => import("@/pages/clube/ClubeRotaPremium"));
const Travessias = React.lazy(() => import("@/pages/Travessias"));
const TravessiaDetalhe = React.lazy(() => import("@/pages/TravessiaDetalhe"));
const BibliotecaTravessiaDetalhe = React.lazy(() => import("@/pages/BibliotecaTravessiaDetalhe"));
const BibliotecaTravessiasFamilia = React.lazy(() => import("@/pages/BibliotecaTravessiasFamilia"));
const MinhaJornada = React.lazy(() => import("@/pages/MinhaJornada"));

/**
 * Renderiza as rotas relacionadas à Jornada Simbólica e ao Clube.
 * O objetivo é reduzir a densidade do App.tsx mantendo o comportamento original.
 */
export const renderJornadaRoutes = (ProtectedRoute: React.ComponentType<any>) => {
  return (
    <>
      {/* Core navigation - Jornada */}
      <Route path="/jornada" element={<ProtectedRoute><Navigate to="/minha-jornada" replace /></ProtectedRoute>} />
      <Route path="/minha-jornada" element={<ProtectedRoute><MinhaJornada /></ProtectedRoute>} />
      
      {/* Travessias */}
      <Route path="/travessias" element={<ProtectedRoute><Travessias /></ProtectedRoute>} />
      <Route path="/travessia/:slug" element={<ProtectedRoute><TravessiaDetalhe /></ProtectedRoute>} />
      
      {/* Clube */}
      <Route path="/clube" element={<ProtectedRoute><ClubeRotasCatalogo /></ProtectedRoute>} />
      <Route path="/clube/rota/:slug" element={<ProtectedRoute><ClubeRotaPremium /></ProtectedRoute>} />
      
      {/* Biblioteca de Travessias - Redirects para a Unificada */}
      <Route path="/biblioteca-das-travessias" element={<ProtectedRoute><Navigate to="/biblioteca?aba=travessias" replace /></ProtectedRoute>} />
      <Route path="/biblioteca-das-travessias/:slug" element={<ProtectedRoute><BibliotecaTravessiaDetalhe /></ProtectedRoute>} />
      <Route path="/biblioteca-travessias" element={<ProtectedRoute><Navigate to="/biblioteca?aba=travessias" replace /></ProtectedRoute>} />
      <Route path="/biblioteca-travessias/:familiaSlug" element={<ProtectedRoute><BibliotecaTravessiasFamilia /></ProtectedRoute>} />
      <Route path="/minha-biblioteca" element={<ProtectedRoute><Navigate to="/biblioteca?aba=pessoal" replace /></ProtectedRoute>} />
    </>
  );
};
