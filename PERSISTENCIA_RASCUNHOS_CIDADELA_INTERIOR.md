# PERSISTENCIA_RASCUNHOS_CIDADELA_INTERIOR.md

## 1. Estrutura Atual Encontrada
- O motor central da Cartografia Estrutural (CidaDELA Interior) utilizava rascunhos apenas em memória durante a sessão.
- Não havia persistência no banco de dados para estados parciais (`draft`).
- Ao atualizar a página ou sair, a assinante perdia todo o progresso.

## 2. Solução Implementada
- **Nova Tabela no Supabase**: `cartografia_estrutural_drafts` vinculada ao `user_id`.
- **Mecanismo de Autosave**: Implementado no hook `useCartografiaEstrutural`.
- **UX de Salvamento**: Microcopy de feedback em tempo real (Salvando, Salvo, Erro).
- **Recuperação Inteligente**: Opção "Continuar de onde parei" na tela inicial da CidaDELA se um rascunho for detectado.
- **Ciclo de Vida**: O rascunho é marcado como `completed` ao gerar o Mapa Vivo final.

## 3. Arquivos Alterados
- `supabase/migrations/..._add_cartografia_drafts.sql`: Criação da tabela e políticas RLS.
- `src/hooks/useCartografiaEstrutural.ts`: Lógica de persistência, carregamento e retomada.
- `src/components/cartografia/CartografiaEstruturalStepper.tsx`: Feedback visual de salvamento e botão de retomada.

## 4. Tabela/Campos Usados
**Tabela**: `cartografia_estrutural_drafts`
- `user_id`: UUID (FK para auth.users)
- `step`: TEXT (Etapa atual do stepper)
- `respostas`: JSONB (Dados qualitativos e Big Five)
- `status`: TEXT ('draft' ou 'completed')
- `versao`: TEXT ('2.0-estrutural')

## 5. Fluxo de Salvamento
1. A cada mudança de etapa ou alteração significativa nas respostas, um `setTimeout` de 1s é acionado.
2. O hook realiza um `upsert` na tabela de rascunhos.
3. O status visual no topo do stepper muda para "Salvando..." e depois "Progresso salvo".

## 6. Fluxo de Retomada
1. Ao abrir a CidaDELA, o sistema verifica se existe um rascunho com status `draft`.
2. Se existir, o botão "Continuar de onde parei" aparece ao lado de "Começar a travessia".
3. Ao clicar, as respostas e a etapa correta são injetadas no estado do componente.

## 7. Testes Realizados
- [x] Iniciar CidaDELA e responder Território 1.
- [x] Sair e voltar: Botão de retomada exibido.
- [x] Retomar: Dados restaurados e etapa correta (Território 1).
- [x] Concluir cartografia: Status do rascunho mudou para `completed`.
- [x] Visitante sem assinatura: Acesso continua bloqueado pelas regras de acesso do motor central (não alteradas).

## 8. Riscos Pendentes
- **Limpeza de rascunhos antigos**: Rascunhos marcados como `completed` permanecem no banco para histórico. Poderia haver uma rotina de arquivamento no futuro se o volume crescer muito.
- **Conflito de Versão**: Se a estrutura das perguntas mudar drasticamente, rascunhos antigos podem precisar de migração (campo `versao` já prevê isso).

A persistência de rascunhos remove o maior atrito da jornada da assinante, garantindo segurança na travessia profunda da CidaDELA Interior.
