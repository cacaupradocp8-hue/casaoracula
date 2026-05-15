# Relatório de Implementação: SPRINT 08C - Controle de Status Rascunho/Publicado

## Objetivo
Implementar e validar o controle editorial de status (Rascunho/Publicado) para as estações e itens da rota do Clube Oracular, garantindo que conteúdos em desenvolvimento fiquem invisíveis para as assinantes, mas acessíveis para o Admin e no Modo Preview.

## Auditoria de Campos
Foi realizada uma auditoria no banco de dados que confirmou a existência dos campos necessários:
- **clube_estacoes**: Campos `publicada` (boolean) e `status` (enum) identificados.
- **clube_rota_itens**: Campos `publicado` (boolean) e `status` (text) identificados.

## Implementações Realizadas

### 1. Painel Editorial (Admin)
- Atualizada a listagem de estações para exibir o status de visibilidade como **Publicado** ou **Rascunho** (mapeado a partir do campo `publicada`).
- Atualizada a listagem de itens da rota para exibir o status como **Publicado** ou **Rascunho** (mapeado a partir do campo `publicado`).
- Sincronização automática do campo técnico `status` ao alternar a visibilidade nos diálogos de edição.

### 2. Filtro de Conteúdo (Assinante)
- Modificado o hook `useRotaOracular` para filtrar os itens da rota, garantindo que apenas registros com `publicado === true` sejam retornados para a usuária final.
- Mantido o filtro de estações que já exigia `publicada === true` e `ativa === true`.

### 3. Modo Preview (Admin)
- Validado que o Modo Preview (`/admin/clube/preview/:itemId`) continua exibindo o conteúdo completo, independente do status de publicação, permitindo que o Admin revise rascunhos em um ambiente fiel ao da assinante.
- A lógica de progresso na rota foi ajustada para ignorar itens em rascunho na jornada da assinante, evitando "buracos" ou bloqueios indevidos.

## Validações de Segurança
- [x] **Acesso Admin:** Itens em rascunho são visíveis apenas no Painel Editorial e no Modo Preview.
- [x] **Experiência Assinante:** Assinantes não visualizam conteúdos marcados como Rascunho.
- [x] **Integridade de Dados:** Nenhuma tabela foi criada e a estrutura do banco permaneceu intacta.
- [x] **Progresso:** A alteração de status não corrompe o registro de progresso histórico (clube_rota_progresso).
- [x] **Build:** O projeto compila sem erros.

## Classificação
**APROVADO**

O controle editorial de publicação está plenamente operacional, oferecendo segurança para a criação de novos conteúdos sem exposição prematura às assinantes.
