import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { SectionErrorBoundary } from '@/components/shared/SectionErrorBoundary';

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

export function clubeRoutes(ProtectedRoute: React.ComponentType<{ children: React.ReactNode; minPortal?: string }>) {
  return (
    <SectionErrorBoundary sectionName="Clube do Livro">
      <Route path="/app/clube" element={<ProtectedRoute minPortal="aluna"><ClubeOracular /></ProtectedRoute>} />
      <Route path="/clube-livro/semana" element={<ProtectedRoute minPortal="aluna"><ClubeLivroSemana /></ProtectedRoute>} />
      <Route path="/clube-livro" element={<ProtectedRoute minPortal="aluna"><ClubeLivroApresentacao /></ProtectedRoute>} />
      <Route path="/clube-livro/mapa-jornadas" element={<ProtectedRoute minPortal="aluna"><MapaJornadas /></ProtectedRoute>} />
      <Route path="/clube-livro/minha-travessia" element={<ProtectedRoute minPortal="aluna"><MinhaTravessia /></ProtectedRoute>} />
      <Route path="/clube-livro/livro/:id" element={<ProtectedRoute minPortal="aluna"><ClubeLivroLivro /></ProtectedRoute>} />
      <Route path="/clube-livro/:id" element={<ProtectedRoute minPortal="aluna"><ClubeLivroCiclo /></ProtectedRoute>} />
      <Route path="/clube-livro/:id/porta/:portaId" element={<ProtectedRoute minPortal="aluna"><ClubeLivroPorta /></ProtectedRoute>} />
      <Route path="/clube-livro/:id/ritual" element={<ProtectedRoute minPortal="aluna"><ClubeLivroRitual /></ProtectedRoute>} />
      <Route path="/clube-livro/:id/aula/:aulaId" element={<ProtectedRoute minPortal="aluna"><ClubeLivroAula /></ProtectedRoute>} />
      <Route path="/clube-livro/:id/fase/:faseId" element={<ProtectedRoute minPortal="aluna"><ClubeLivroFase /></ProtectedRoute>} />
      <Route path="/clube-livro/:id/escutas" element={<ProtectedRoute minPortal="aluna"><ClubeLivroEscutas /></ProtectedRoute>} />
      <Route path="/clube-livro/:id/encontros" element={<ProtectedRoute minPortal="aluna"><ClubeLivroEncontros /></ProtectedRoute>} />
      <Route path="/clube-livro/:id/integracao" element={<ProtectedRoute minPortal="aluna"><IntegracaoOracular /></ProtectedRoute>} />
      <Route path="/clube-livro/:id/meu-caminho" element={<ProtectedRoute minPortal="aluna"><MeuCaminhoClube /></ProtectedRoute>} />
      <Route path="/clube-livro/meu-caminho" element={<ProtectedRoute minPortal="aluna"><MeuCaminhoClube /></ProtectedRoute>} />
      <Route path="/clube-livro/:id/integracao-8020" element={<ProtectedRoute minPortal="aluna"><Integracao8020 /></ProtectedRoute>} />
      <Route path="/clube-livro/:id/lab-8020" element={<ProtectedRoute minPortal="aluna"><Lab8020Season /></ProtectedRoute>} />
      <Route path="/clube-livro/:id/certificado" element={<ProtectedRoute minPortal="aluna"><CertificadoTravessia /></ProtectedRoute>} />
      <Route path="/clube-livro/travessias" element={<ProtectedRoute minPortal="aluna"><COTravessiasList /></ProtectedRoute>} />
      <Route path="/clube-livro/travessia/:travessiaId" element={<ProtectedRoute minPortal="aluna"><COTravessiaDetail /></ProtectedRoute>} />
      <Route path="/clube-livro/travessia/:travessiaId/encontro/:encontroId" element={<ProtectedRoute minPortal="aluna"><COTravessiaEncontro /></ProtectedRoute>} />
    </SectionErrorBoundary>
  );
}
