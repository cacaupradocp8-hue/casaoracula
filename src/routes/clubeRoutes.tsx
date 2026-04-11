import React from 'react';
import { Route } from 'react-router-dom';

const ClubeLivroApresentacao = React.lazy(() => import('@/pages/clube-livro/ClubeLivroApresentacao'));
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
const ClubeOracular = React.lazy(() => import('@/pages/ClubeOracular'));

// Novo módulo Clube do Livro Oracular
const ClubeHome = React.lazy(() => import('@/pages/clube/ClubeHome'));
const ClubeCiclo = React.lazy(() => import('@/pages/clube/ClubeCiclo'));
const ClubeEncontro = React.lazy(() => import('@/pages/clube/ClubeEncontro'));

type PR = React.ComponentType<{ children: React.ReactNode; minPortal?: string }>;

export function renderClubeRoutes(ProtectedRoute: PR) {
  return [
    <Route key="cl-home" path="/app/clube" element={<ProtectedRoute minPortal="aluna"><ClubeOracular /></ProtectedRoute>} />,
    <Route key="cl-sem" path="/clube-livro/semana" element={<ProtectedRoute minPortal="aluna"><ClubeLivroSemana /></ProtectedRoute>} />,
    <Route key="cl-apr" path="/clube-livro" element={<ProtectedRoute minPortal="aluna"><ClubeLivroApresentacao /></ProtectedRoute>} />,
    <Route key="cl-mj" path="/clube-livro/mapa-jornadas" element={<ProtectedRoute minPortal="aluna"><MapaJornadas /></ProtectedRoute>} />,
    <Route key="cl-mt" path="/clube-livro/minha-travessia" element={<ProtectedRoute minPortal="aluna"><MinhaTravessia /></ProtectedRoute>} />,
    <Route key="cl-liv" path="/clube-livro/livro/:id" element={<ProtectedRoute minPortal="aluna"><ClubeLivroLivro /></ProtectedRoute>} />,
    <Route key="cl-cic" path="/clube-livro/:id" element={<ProtectedRoute minPortal="aluna"><ClubeLivroCiclo /></ProtectedRoute>} />,
    <Route key="cl-por" path="/clube-livro/:id/porta/:portaId" element={<ProtectedRoute minPortal="aluna"><ClubeLivroPorta /></ProtectedRoute>} />,
    <Route key="cl-rit" path="/clube-livro/:id/ritual" element={<ProtectedRoute minPortal="aluna"><ClubeLivroRitual /></ProtectedRoute>} />,
    <Route key="cl-aul" path="/clube-livro/:id/aula/:aulaId" element={<ProtectedRoute minPortal="aluna"><ClubeLivroAula /></ProtectedRoute>} />,
    <Route key="cl-fas" path="/clube-livro/:id/fase/:faseId" element={<ProtectedRoute minPortal="aluna"><ClubeLivroFase /></ProtectedRoute>} />,
    <Route key="cl-esc" path="/clube-livro/:id/escutas" element={<ProtectedRoute minPortal="aluna"><ClubeLivroEscutas /></ProtectedRoute>} />,
    <Route key="cl-enc" path="/clube-livro/:id/encontros" element={<ProtectedRoute minPortal="aluna"><ClubeLivroEncontros /></ProtectedRoute>} />,
    <Route key="cl-int" path="/clube-livro/:id/integracao" element={<ProtectedRoute minPortal="aluna"><IntegracaoOracular /></ProtectedRoute>} />,
    <Route key="cl-mc" path="/clube-livro/:id/meu-caminho" element={<ProtectedRoute minPortal="aluna"><MeuCaminhoClube /></ProtectedRoute>} />,
    <Route key="cl-mc2" path="/clube-livro/meu-caminho" element={<ProtectedRoute minPortal="aluna"><MeuCaminhoClube /></ProtectedRoute>} />,
    <Route key="cl-8020" path="/clube-livro/:id/integracao-8020" element={<ProtectedRoute minPortal="aluna"><Integracao8020 /></ProtectedRoute>} />,
    <Route key="cl-lab" path="/clube-livro/:id/lab-8020" element={<ProtectedRoute minPortal="aluna"><Lab8020Season /></ProtectedRoute>} />,
    <Route key="cl-cert" path="/clube-livro/:id/certificado" element={<ProtectedRoute minPortal="aluna"><CertificadoTravessia /></ProtectedRoute>} />,
    <Route key="cl-trav" path="/clube-livro/travessias" element={<ProtectedRoute minPortal="aluna"><COTravessiasList /></ProtectedRoute>} />,
    <Route key="cl-td" path="/clube-livro/travessia/:travessiaId" element={<ProtectedRoute minPortal="aluna"><COTravessiaDetail /></ProtectedRoute>} />,
    <Route key="cl-te" path="/clube-livro/travessia/:travessiaId/encontro/:encontroId" element={<ProtectedRoute minPortal="aluna"><COTravessiaEncontro /></ProtectedRoute>} />,

    {/* Novo módulo Clube do Livro Oracular */}
    <Route key="clube-home" path="/clube" element={<ProtectedRoute minPortal="mentorada"><ClubeHome /></ProtectedRoute>} />,
    <Route key="clube-ciclo" path="/clube/ciclo" element={<ProtectedRoute minPortal="mentorada"><ClubeCiclo /></ProtectedRoute>} />,
    <Route key="clube-encontro" path="/clube/encontro" element={<ProtectedRoute minPortal="mentorada"><ClubeEncontro /></ProtectedRoute>} />,
  ];
}
