import React from 'react';
import { Route, Navigate, useParams } from 'react-router-dom';
import RedirectWithParams from '@/components/routing/RedirectWithParams';

/**
 * Componentes auxiliares de redirecionamento
 */
function OracleRedirect() {
  const { oracleSlug } = useParams();
  return <Navigate to={`/oraculos/${oracleSlug}`} replace />;
}

function OracleRedirectWithSuffix({ suffix = '' }: { suffix?: string }) {
  const { oracleSlug } = useParams();
  return <Navigate to={`/oraculos/${oracleSlug}${suffix}`} replace />;
}

function LegacyCursoRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/cursos/${id}`} replace />;
}

function LegacyAulaRedirect() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  return <Navigate to={`/cursos/${courseId}/aula/${lessonId}`} replace />;
}

/**
 * Renderiza todos os redirecionamentos de legado para manter a compatibilidade
 * sem poluir os ficheiros de rotas principais.
 */
export function renderLegacyRedirects() {
  return (
    <>
      {/* ─── REDIRECIONAMENTOS SAAS E APP ANTIGOS ─── */}
      <Route path="/saas/clientes/:clienteId/mapa-cidadela" element={<RedirectWithParams to="/casa-das-maquinas/clientes/:clienteId/mapa-cidadela" />} />
      <Route path="/saas/clientes/:clienteId/relatorio-jornada" element={<RedirectWithParams to="/casa-das-maquinas/clientes/:clienteId/relatorio-jornada" />} />
      <Route path="/saas/clientes/:clienteId/mapa-vivo" element={<RedirectWithParams to="/casa-das-maquinas/clientes/:clienteId/mapa-vivo" />} />
      <Route path="/saas/clientes/:clienteId/cidadela-viva" element={<RedirectWithParams to="/casa-das-maquinas/clientes/:clienteId/cidadela-viva" />} />
      <Route path="/saas/clientes/:clienteId/jornada-alma" element={<RedirectWithParams to="/casa-das-maquinas/clientes/:clienteId/jornada-alma" />} />
      <Route path="/saas/clientes/:clienteId/rituais-mudra" element={<RedirectWithParams to="/casa-das-maquinas/clientes/:clienteId/rituais-mudra" />} />
      <Route path="/saas/clientes/:clienteId/bussola-onirica" element={<RedirectWithParams to="/casa-das-maquinas/clientes/:clienteId/bussola-onirica" />} />
      <Route path="/saas/clientes/:clienteId/circulo-sagrado" element={<RedirectWithParams to="/casa-das-maquinas/clientes/:clienteId/circulo-sagrado" />} />
      <Route path="/saas/sessao/:clienteId" element={<RedirectWithParams to="/casa-das-maquinas/sessao/:clienteId" />} />
      <Route path="/saas/biblioteca" element={<Navigate to="/casa-das-maquinas/biblioteca" replace />} />
      <Route path="/app/clientes/:clienteId/cidadela" element={<RedirectWithParams to="/casa-das-maquinas/clientes/:clienteId/mapa-cidadela" />} />

      {/* ─── REDIRECIONAMENTOS DE ADMIN E CLUBE ─── */}
      <Route path="/admin/clube-livro" element={<Navigate to="/admin/clube" replace />} />
      <Route path="/admin/clube-livro/*" element={<Navigate to="/admin/clube" replace />} />
      <Route path="/admin/books" element={<Navigate to="/admin/clube/conteudos" replace />} />
      <Route path="/admin/clube/oraculo-portais" element={<Navigate to="/admin/clube/portais" replace />} />
      <Route path="/admin/clube/oraculo-portais/:portalId" element={<Navigate to="/admin/clube/portais" replace />} />

      {/* ─── REDIRECIONAMENTOS DE FORMAÇÃO E CONTEÚDO ─── */}
      <Route path="/formacao-oracula" element={<Navigate to="/oracula" replace />} />
      <Route path="/formacao-viva" element={<Navigate to="/oracula" replace />} />
      <Route path="/formacao" element={<Navigate to="/cursos" replace />} />
      <Route path="/tour" element={<Navigate to="/mapa-casa" replace />} />
      <Route path="/comece-aqui" element={<Navigate to="/sala-da-visitante" replace />} />
      <Route path="/dashboard" element={<Navigate to="/dashboard-membro" replace />} />
      <Route path="/mentoria" element={<Navigate to="/oracula" replace />} />
      <Route path="/experiencia-gratuita" element={<Navigate to="/quiz/descubra-seu-eixo" replace />} />
      
      {/* ─── REDIRECIONAMENTOS DE CURSOS V1/V2 ─── */}
      <Route path="/course/:id" element={<LegacyCursoRedirect />} />
      <Route path="/course/:courseId/lesson/:lessonId" element={<LegacyAulaRedirect />} />
      <Route path="/curso/:id" element={<LegacyCursoRedirect />} />
      <Route path="/curso/:courseId/aula/:lessonId" element={<LegacyAulaRedirect />} />

      {/* ─── REDIRECIONAMENTOS DE CASA E JARDIM ─── */}
      <Route path="/jardim-heroina-app" element={<Navigate to="/meu-jardim" replace />} />
      <Route path="/casa/jardim" element={<Navigate to="/jardim-da-psique" replace />} />
      <Route path="/casa/jardim/:id" element={<RedirectWithParams to="/jardim-da-psique/:id" />} />

      {/* ─── REDIRECIONAMENTOS DE FERRAMENTAS E SALAS ─── */}
      <Route path="/ferramentas-metodo" element={<Navigate to="/ferramentas" replace />} />
      <Route path="/sala-do-metodo" element={<Navigate to="/ferramentas" replace />} />
      <Route path="/salas" element={<Navigate to="/mapa-casa" replace />} />
      <Route path="/ferramentas-vitrine" element={<Navigate to="/ferramentas" replace />} />
      <Route path="/ferramentas/sala-de-sessao" element={<Navigate to="/session-room" replace />} />
      <Route path="/ferramenta/big5-oracular" element={<Navigate to="/ferramenta/cartografia-psiquica-oracula" replace />} />
      <Route path="/ferramenta/cartografia-psiquica" element={<Navigate to="/ferramenta/cartografia-psiquica-oracula" replace />} />
      <Route path="/cartografia-psiquica" element={<Navigate to="/ferramenta/cartografia-psiquica-oracula" replace />} />
      <Route path="/ferramentas/cartografia-psiquica-oracula" element={<Navigate to="/ferramenta/cartografia-psiquica-oracula" replace />} />
      <Route path="/revelacao-cidadela" element={<Navigate to="/cidadela/revelacao" replace />} />
      
      <Route path="/salas/big5" element={<Navigate to="/ferramentas/big5" replace />} />
      <Route path="/salas/eneagrama" element={<Navigate to="/ferramentas/eneagrama" replace />} />
      <Route path="/salas/oraculo-perguntas" element={<Navigate to="/ferramentas/oraculo-perguntas" replace />} />
      <Route path="/salas/mapa-oracula" element={<Navigate to="/ferramentas/mapa-oracula" replace />} />
      
      <Route path="/ferramentas/sintheia" element={<Navigate to="/syntheia" replace />} />
      <Route path="/ferramentas/agente-analista" element={<Navigate to="/syntheia?agente=analista" replace />} />
      <Route path="/ferramentas/agente-curador" element={<Navigate to="/syntheia?agente=curador" replace />} />
      <Route path="/ferramentas/agente-simbolico" element={<Navigate to="/syntheia?agente=simbolico" replace />} />
      <Route path="/ferramentas/espelho-consciencia" element={<Navigate to="/ferramentas/espelho-de-consciencia" replace />} />

      {/* ─── REDIRECIONAMENTOS DE CASA DAS MÁQUINAS ─── */}
      <Route path="/casa-das-maquinas/ferramentas/cartografia" element={<Navigate to="/ferramenta/cartografia-psiquica-oracula" replace />} />
      <Route path="/casa-das-maquinas/ferramentas/escrita-simbolica" element={<Navigate to="/casa-das-maquinas/ferramentas" replace />} />
      <Route path="/casa-das-maquinas/ferramentas/espelho-relacional" element={<Navigate to="/casa-das-maquinas/ferramentas" replace />} />
      <Route path="/casa-das-maquinas/ferramentas/ritual-simbolico" element={<Navigate to="/casa-das-maquinas/ferramentas" replace />} />
      <Route path="/casa-das-maquinas/ferramentas/dialogo-partes" element={<Navigate to="/casa-das-maquinas/ferramentas" replace />} />
      <Route path="/casa-das-maquinas/ferramentas/mapa-transformacao" element={<Navigate to="/casa-das-maquinas/ferramentas" replace />} />
      <Route path="/casa-das-maquinas/ferramentas/ritual-passagem" element={<Navigate to="/casa-das-maquinas/ferramentas" replace />} />
      <Route path="/casa-das-maquinas/comunidade" element={<Navigate to="/comunidade" replace />} />
      <Route path="/casa-das-maquinas/academia-formacao" element={<Navigate to="/academia" replace />} />

      {/* ─── REDIRECIONAMENTOS DE ORÁCULO ─── */}
      <Route path="/casa-das-maquinas/oraculo" element={<Navigate to="/oraculos" replace />} />
      <Route path="/casa-das-maquinas/oraculo/:oracleSlug" element={<OracleRedirect />} />
      <Route path="/casa-das-maquinas/oraculo/:oracleSlug/tirar" element={<OracleRedirectWithSuffix suffix="/tirar" />} />
      <Route path="/casa-das-maquinas/oraculo/:oracleSlug/historico" element={<OracleRedirectWithSuffix suffix="/historico" />} />
      <Route path="/casa-das-maquinas/oraculo/:oracleSlug/biblioteca" element={<OracleRedirectWithSuffix suffix="/biblioteca" />} />

      {/* ─── REDIRECIONAMENTOS DE PLANOS E CONTA ─── */}
      <Route path="/planos-clube" element={<Navigate to="/planos" replace />} />
      <Route path="/assinatura" element={<Navigate to="/minha-conta" replace />} />
      <Route path="/billing" element={<Navigate to="/minha-conta" replace />} />

      {/* ─── REDIRECIONAMENTOS DE RELATÓRIOS ANTIGOS ─── */}
      <Route path="/relatorio/sprint-06" element={<Navigate to="/dashboard-membro" replace />} />
      <Route path="/relatorio/sprint-07" element={<Navigate to="/dashboard-membro" replace />} />
    </>
  );
}
