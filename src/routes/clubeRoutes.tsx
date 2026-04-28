import React from 'react';
import { Route, Navigate } from 'react-router-dom';

// ─── Módulo Clube do Livro Oracular (rotas principais) ───
const ClubeHome = React.lazy(() => import('@/pages/clube/ClubeHome'));
const ClubeCiclo = React.lazy(() => import('@/pages/clube/ClubeCiclo'));
const ClubeEncontro = React.lazy(() => import('@/pages/clube/ClubeEncontro'));
const ClubeChatLivro = React.lazy(() => import('@/pages/clube/ClubeChatLivro'));
const ClubeAcervo = React.lazy(() => import('@/pages/clube/ClubeAcervo'));
const ClubeForja = React.lazy(() => import('@/pages/clube/ClubeForja'));
const ClubeTreinamento = React.lazy(() => import('@/pages/clube/ClubeTreinamento'));
const ClubeEscutaImersiva = React.lazy(() => import('@/pages/clube/ClubeEscutaImersiva'));
const ClubeLaboratorio = React.lazy(() => import('@/pages/clube/ClubeLaboratorio'));
const ClubeLaboratorioObra = React.lazy(() => import('@/pages/clube/ClubeLaboratorioObra'));

// ─── Novas Telas Premium de Rota ───
const ClubeRotaPremium = React.lazy(() => import('@/pages/clube/ClubeRotaPremium'));

// ─── Rotas legadas (mantidas para compatibilidade) ───
const ClubeLivroCiclo = React.lazy(() => import('@/pages/clube-livro/ClubeLivroCiclo'));
const ClubeLivroPorta = React.lazy(() => import('@/pages/clube-livro/ClubeLivroPorta'));
const ClubeLivroFase = React.lazy(() => import('@/pages/clube-livro/ClubeLivroFase'));
const ClubeLivroEscutas = React.lazy(() => import('@/pages/clube-livro/ClubeLivroEscutas'));
const ClubeLivroEncontros = React.lazy(() => import('@/pages/clube-livro/ClubeLivroEncontros'));
const ClubeLivroRitual = React.lazy(() => import('@/pages/clube-livro/ClubeLivroRitual'));
const ClubeLivroAula = React.lazy(() => import('@/pages/clube-livro/ClubeLivroAula'));
const IntegracaoOracular = React.lazy(() => import('@/pages/clube-livro/IntegracaoOracular'));
const MeuCaminhoClube = React.lazy(() => import('@/pages/clube-livro/MeuCaminhoClube'));
const Integracao8020 = React.lazy(() => import('@/pages/clube-livro/Integracao8020'));
const ClubeLivroLivro = React.lazy(() => import('@/pages/clube-livro/ClubeLivroLivro'));
const MapaJornadas = React.lazy(() => import('@/pages/clube-livro/MapaJornadas'));
const MinhaTravessia = React.lazy(() => import('@/pages/clube-livro/MinhaTravessia'));
const CertificadoTravessia = React.lazy(() => import('@/pages/clube-livro/CertificadoTravessia'));
const Lab8020Season = React.lazy(() => import('@/pages/clube-livro/Lab8020Season'));
const ClubeLivroSemana = React.lazy(() => import('@/pages/clube-livro/ClubeLivroSemana'));
const COTravessiasList = React.lazy(() => import('@/pages/clube-livro/COTravessiasList'));
const COTravessiaDetail = React.lazy(() => import('@/pages/clube-livro/COTravessiaDetail'));
const COTravessiaEncontro = React.lazy(() => import('@/pages/clube-livro/COTravessiaEncontro'));

type PR = React.ComponentType<{ children: React.ReactNode; minPortal?: string }>;

export function renderClubeRoutes(ProtectedRoute: PR) {
  return [
    // ═══ ROTAS PRINCIPAIS DO CLUBE ═══
    <Route key="clube-home" path="/clube" element={<ProtectedRoute minPortal="visitante"><ClubeHome /></ProtectedRoute>} />,
    <Route key="clube-rota-premium" path="/clube/rota/:slug" element={<ProtectedRoute minPortal="mentorada"><ClubeRotaPremium /></ProtectedRoute>} />,
    <Route key="clube-ciclo" path="/clube/ciclo" element={<ProtectedRoute minPortal="mentorada"><ClubeCiclo /></ProtectedRoute>} />,
    <Route key="clube-chat" path="/clube/chat-livro" element={<ProtectedRoute minPortal="mentorada"><ClubeChatLivro /></ProtectedRoute>} />,
    <Route key="clube-encontro" path="/clube/encontro" element={<ProtectedRoute minPortal="mentorada"><ClubeEncontro /></ProtectedRoute>} />,
    <Route key="clube-acervo" path="/clube/acervo" element={<ProtectedRoute minPortal="mentorada"><ClubeAcervo /></ProtectedRoute>} />,
    <Route key="clube-forja" path="/clube/forja" element={<ProtectedRoute minPortal="mentorada"><ClubeForja /></ProtectedRoute>} />,
    <Route key="clube-treinamento" path="/clube/treinamento" element={<ProtectedRoute minPortal="mentorada"><ClubeTreinamento /></ProtectedRoute>} />,
    <Route key="clube-escuta" path="/clube/escuta" element={<ProtectedRoute minPortal="mentorada"><ClubeEscutaImersiva /></ProtectedRoute>} />,
    <Route key="clube-lab" path="/clube/laboratorio" element={<ProtectedRoute minPortal="mentorada"><ClubeLaboratorio /></ProtectedRoute>} />,
    <Route key="clube-lab-obra" path="/clube/laboratorio/:tipo/:id" element={<ProtectedRoute minPortal="mentorada"><ClubeLaboratorioObra /></ProtectedRoute>} />,

    // ═══ REDIRECIONAMENTOS de rotas legadas ═══
    <Route key="cl-redir-old" path="/app/clube" element={<Navigate to="/clube" replace />} />,
    <Route key="cl-redir-apr" path="/clube-livro" element={<Navigate to="/clube" replace />} />,

    // ═══ ROTAS LEGADAS (mantidas para não quebrar links) ═══
    <Route key="cl-sem" path="/clube-livro/semana" element={<Navigate to="/clube" replace />} />,
    <Route key="cl-mj" path="/clube-livro/mapa-jornadas" element={<Navigate to="/clube" replace />} />,
    <Route key="cl-mt" path="/clube-livro/minha-travessia" element={<Navigate to="/clube" replace />} />,
    <Route key="cl-liv" path="/clube-livro/livro/:id" element={<Navigate to="/clube" replace />} />,
    <Route key="cl-cic" path="/clube-livro/:id" element={<Navigate to="/clube" replace />} />,
    <Route key="cl-por" path="/clube-livro/:id/porta/:portaId" element={<Navigate to="/clube" replace />} />,
    <Route key="cl-rit" path="/clube-livro/:id/ritual" element={<Navigate to="/clube" replace />} />,
    <Route key="cl-aul" path="/clube-livro/:id/aula/:aulaId" element={<Navigate to="/clube" replace />} />,
    <Route key="cl-fas" path="/clube-livro/:id/fase/:faseId" element={<Navigate to="/clube" replace />} />,
    <Route key="cl-esc" path="/clube-livro/:id/escutas" element={<Navigate to="/clube" replace />} />,
    <Route key="cl-enc" path="/clube-livro/:id/encontros" element={<Navigate to="/clube" replace />} />,
    <Route key="cl-int" path="/clube-livro/:id/integracao" element={<Navigate to="/clube" replace />} />,
    <Route key="cl-mc" path="/clube-livro/:id/meu-caminho" element={<Navigate to="/clube" replace />} />,
    <Route key="cl-mc2" path="/clube-livro/meu-caminho" element={<Navigate to="/clube" replace />} />,
    <Route key="cl-8020" path="/clube-livro/:id/integracao-8020" element={<Navigate to="/clube" replace />} />,
    <Route key="cl-lab" path="/clube-livro/:id/lab-8020" element={<Navigate to="/clube" replace />} />,
    <Route key="cl-cert" path="/clube-livro/:id/certificado" element={<Navigate to="/clube" replace />} />,
    <Route key="cl-trav" path="/clube-livro/travessias" element={<Navigate to="/clube" replace />} />,
    <Route key="cl-td" path="/clube-livro/travessia/:travessiaId" element={<Navigate to="/clube" replace />} />,
    <Route key="cl-te" path="/clube-livro/travessia/:travessiaId/encontro/:encontroId" element={<Navigate to="/clube" replace />} />,
  ];
}
