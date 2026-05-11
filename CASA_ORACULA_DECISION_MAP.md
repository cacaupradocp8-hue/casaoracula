# CASA_ORACULA_DECISION_MAP.md

**Fase 3 — Mapa de Decisões Estratégicas**

Este documento detalha as decisões fundamentais para a refatoração e evolução da Casa Orácula, consolidando o entendimento de negócio e técnico antes de qualquer implementação.

---

## 1. BIBLIOTECA OFICIAL
- **Tema:** Unificação de Acervos.
- **Contexto:** Existência de 3 bibliotecas redundantes (Unificada, das Travessias, Travessias).
- **Opções:** Unificar tudo em uma; manter todas separadas; unificação seletiva.
- **Decisão Recomendada:** **Biblioteca Unificada** como motor oficial geral.
- **Justificativa de Negócio:** Reduzir confusão da usuária e centralizar o valor do acervo em um único local.
- **Impacto Técnico:** Redirecionamento de rotas legadas; integração de filtros por categoria.
- **Risco:** Perda de contexto específico de algumas travessias se a filtragem não for intuitiva.
- **Dependências:** Mapeamento de tags de conteúdo.
- **O que NÃO fazer agora:** Apagar arquivos de componentes antigos ou alterar o banco de dados.
- **Critério de Validação:** Usuária acessa qualquer link de biblioteca antiga e cai na Unificada com o filtro correto.

## 2. MAPAS / CIDADELA / MAPA VIVO / CARTOGRAFIA
- **Tema:** Motores Visuais e Clínicos.
- **Contexto:** 5 motores de mapa competindo por atenção e recursos.
- **Opções:** Unificar em uma engine única; manter distinção por propósito.
- **Decisão Recomendada:** **Distinção por Propósito**.
  - **Mandala da Cidadela:** Experiência simbólica/visual principal.
  - **Mapa Vivo:** Engine clínica/evolutiva (acompanhamento).
  - **Cartografia Psíquica:** Diagnóstico inicial (Behavioral Reading).
- **Justificativa de Negócio:** Cada motor atende a um momento diferente da jornada (Simbólico vs. Clínico vs. Diagnóstico).
- **Impacto Técnico:** Desativação do "Mapa Oracula" (legado) e integração do "Mapa Vivo Live" como modo interno do Mapa Vivo.
- **Risco:** Sobrecarga de manutenção de 3 motores; confusão sobre qual usar em cada etapa.
- **Dependências:** Definição clara de UI/UX para transição entre motores.
- **O que NÃO fazer agora:** Tentar fundir o código das engines.
- **Critério de Validação:** Fluxo claro definido no Discovery para cada motor.

## 3. CHECKOUTS
- **Tema:** Fluxo de Receita.
- **Contexto:** Páginas de checkout duplicadas em `/planos` e `/planos-clube-oracular`.
- **Opções:** Manter duplicado; unificação total; unificação de UI com segmentação por tabs.
- **Decisão Recomendada:** **Unificação de UI em `/planos`** via tabs ou cards.
- **Justificativa de Negócio:** Evitar divergência de preços/ofertas e facilitar a gestão de campanhas.
- **Impacto Técnico:** Criação de componente centralizador de planos; preservação de tokens de convite.
- **Risco:** Impacto em taxas de conversão se a nova UI não for otimizada.
- **Dependências:** Mapeamento completo de IDs de preços do Stripe.
- **O que NÃO fazer agora:** Mexer em Stripe Webhooks ou lógica de backend.
- **Critério de Validação:** Todas as ofertas high-ticket e recorrentes disponíveis em um único hub.

## 4. RADIESTESIA
- **Tema:** Produto Lateral.
- **Contexto:** Ferramenta experimental com alta complexidade técnica mas uso segmentado.
- **Opções:** Remover; manter como está; tratar como Laboratório.
- **Decisão Recomendada:** **Tratar como Laboratório**.
- **Justificativa de Negócio:** Funcionalidade estratégica para um nicho, mas não deve poluir a experiência da usuária padrão.
- **Impacto Técnico:** Ocultação de menus; acesso via URL direta ou perfil Admin.
- **Risco:** Manutenção de código "morto" para a maioria das usuárias.
- **Dependências:** Flags de acesso por perfil/permissionamento.
- **O que NÃO fazer agora:** Refatorar o código interno das ferramentas de radiestesia.
- **Critério de Validação:** Usuária padrão não vê "Radiestesia" no menu, mas o link direto continua funcional.

## 5. TABELAS DEPRECATED
- **Tema:** Higiene de Dados.
- **Contexto:** Tabelas `_deprecated_club_*` ocupando espaço e gerando ruído no schema.
- **Opções:** Apagar imediatamente; ignorar; arquivar logicamente.
- **Decisão Recomendada:** **Arquivamento Lógico (Legacy)**.
- **Justificativa de Negócio:** Segurança de dados históricos; evitar quebra de relatórios antigos.
- **Impacto Técnico:** Comentários no schema Supabase; remoção de hooks que ainda possam ler dados residuais.
- **Risco:** Exclusão acidental de dados necessários para auditoria financeira.
- **Dependências:** Relatório de ausência de uso em frontend/functions/policies.
- **O que NÃO fazer agora:** Executar `DROP TABLE`.
- **Critério de Validação:** Nenhuma funcionalidade ativa depende dessas tabelas.

## 6. TIPOS DE PORTAL LEGADOS
- **Tema:** Normalização de Identidade.
- **Contexto:** Perfis como `mentorada`, `pre_iniciada`, `iniciada` normalizados via código.
- **Opções:** Migração massiva no banco; manter normalização em runtime.
- **Decisão Recomendada:** **Manter Normalização em Runtime** (Fase 3/4) e migrar gradualmente.
- **Justificativa de Negócio:** Evitar quebra de acesso durante a transição de branding.
- **Impacto Técnico:** Manutenção da função `normalizePortalType()`.
- **Risco:** Inconsistência de dados se novos fluxos ignorarem a normalização.
- **Dependências:** Auditoria de usuárias afetadas.
- **O que NÃO fazer agora:** Alterar o ENUM de roles no banco de dados.
- **Critério de Validação:** Usuárias com tipos antigos continuam acessando o conteúdo de `aluna`/`oracula`.

## 7. PAINEL MESTRE
- **Tema:** Inteligência de Gestão.
- **Contexto:** Dashboard crítico da Founder acoplado ao Admin geral.
- **Opções:** Manter acoplado; extrair para domínio próprio.
- **Decisão Recomendada:** **Extração para `src/domains/painel-mestre`**.
- **Justificativa de Negócio:** Proteção de dados financeiros e isolamento de lógica crítica.
- **Impacto Técnico:** Reorganização de arquivos; isolamento de serviços financeiros.
- **Risco:** Erros de importação no Admin durante a migração.
- **Dependências:** Plano de extração com rollback (Sprint 01).
- **O que NÃO fazer agora:** Adicionar novas métricas antes de isolar a estrutura.
- **Critério de Validação:** Dashboard funcional no novo diretório com paridade de dados.

## 8. CLUBE V3
- **Tema:** Motor de Recorrência (MRR).
- **Contexto:** Núcleo de receita direta e engajamento.
- **Opções:** Refatoração total; hardening de estabilidade.
- **Decisão Recomendada:** **Hardening e Estabilização**.
- **Justificativa de Negócio:** Risco altíssimo de interrupção de receita.
- **Impacto Técnico:** Melhoria de logs e tratamento de erros no `useClubeOracular`.
- **Risco:** Regressão em funcionalidades de acesso.
- **Dependências:** Monitoramento de logs do Edge Function `clube-knowledge-retrieval`.
- **O que NÃO fazer agora:** Alterar a lógica de entrega de conteúdo ou gamificação.
- **Critério de Validação:** Zero falhas de carregamento relatadas no hub do clube.

## 9. CASA DAS MÁQUINAS
- **Tema:** Diferencial Profissional.
- **Contexto:** Ferramenta clínica para terapeutas (Oráculas).
- **Opções:** Simplificar; isolar; expandir.
- **Decisão Recomendada:** **Isolamento em `src/domains/casa-maquinas`**.
- **Justificativa de Negócio:** Garantir que ferramentas de produtividade clínica não sejam afetadas por mudanças no Clube/Jornadas.
- **Impacto Técnico:** Reorganização de hooks clínicos.
- **Risco:** Vazamento de dados de clientes se RLS for mal configurada (manter intacto).
- **Dependências:** Sincronização com Mapa Vivo.
- **O que NÃO fazer agora:** Alterar as tabelas `terapeuta_clientes` ou `co_sessions`.
- **Critério de Validação:** Terapeutas conseguem realizar sessões sem interrupção.

## 10. SYNTHEIA VOICE
- **Tema:** Inovação Sensorial.
- **Contexto:** Funcionalidade experimental de voz (ElevenLabs/TTS).
- **Opções:** Descontinuar; manter ativa; ocultar temporariamente.
- **Decisão Recomendada:** **Ocultar Temporariamente (Opcional)**.
- **Justificativa de Negócio:** Alto custo e natureza experimental; focar em estabilidade textual antes da voz.
- **Impacto Técnico:** Desativação visual do componente de voz no chat.
- **Risco:** Desperdício de créditos de API se não houver controle de abuso.
- **Dependências:** Limites de cota por usuário.
- **O que NÃO fazer agora:** Excluir Edge Functions de TTS.
- **Critério de Validação:** Redução imediata de custos de API de voz sem impacto na experiência core (texto).

## 11. SISTEMA CLÍNICO FUTURO
- **Tema:** Expansão de Produto.
- **Contexto:** Visão de tornar a Casa Orácula uma plataforma completa de gestão clínica.
- **Opções:** Implementar agora; preparar arquitetura.
- **Decisão Recomendada:** **Preparar Arquitetura (Backlog)**.
- **Justificativa de Negócio:** Construir bases sólidas (domínios isolados) antes de adicionar complexidade.
- **Impacto Técnico:** Definição de contratos de dados em `src/domains/casa-maquinas`.
- **Risco:** Over-engineering para uma demanda futura incerta.
- **Dependências:** Estabilidade dos motores de mapa.
- **O que NÃO fazer agora:** Criar novas tabelas para gestão de prontuários médicos.
- **Critério de Validação:** Código atual refatorado permite adição de novos módulos clínicos via injeção de dependência.

## 12. SKILL DE OTIMIZAÇÃO DE IMAGEM
- **Tema:** Performance Web.
- **Contexto:** Regras de formatos modernos, lazy loading e CLS.
- **Decisão:** **Mover para Backlog Separado**.
- **Justificativa de Negócio:** Prioridade total em arquitetura e estabilidade funcional antes de ajustes finos de ativos visuais.
- **Impacto Técnico:** Nenhum imediato.
- **O que NÃO fazer agora:** Aplicar qualquer regra do arquivo `otimizador-imagem.md`.

---
*Mapa gerado em 11/05/2026 — Somente Planejamento.*
