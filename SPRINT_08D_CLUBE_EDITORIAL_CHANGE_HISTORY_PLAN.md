# Relatório de Auditoria e Planejamento: SPRINT 08D - Histórico de Alterações Editoriais

## Objetivo
Planejar a rastreabilidade de alterações feitas no Painel Editorial do Clube Oracular, identificando a infraestrutura existente e propondo a implementação visual ou técnica necessária.

## Auditoria de Infraestrutura Atual
Após auditoria no banco de dados, os seguintes pontos foram identificados:

1. **Existência de Tabela de Log**: 
   - A tabela `clube_audit_log` já existe e possui a estrutura ideal:
     - `id`: Identificador único.
     - `tabela`: Nome da tabela alterada (`clube_estacoes`, `clube_rota_itens`, etc).
     - `registro_id`: ID do item específico alterado.
     - `acao`: Tipo de operação (`INSERT`, `UPDATE`, `DELETE`).
     - `campo_alterado`: Nome da coluna modificada.
     - `valor_anterior`: Estado anterior do dado.
     - `valor_novo`: Novo estado do dado.
     - `user_id`: Identificação do Admin que realizou a mudança.
     - `created_at`: Data e hora da alteração.

2. **Mecanismo de Captura**:
   - Não foram identificadas `triggers` ou `functions` de banco de dados vinculadas às tabelas editoriais para alimentar este log automaticamente.
   - Atualmente, o log parece depender de inserção manual via aplicação (Frontend/API) ou está inativo para os fluxos de estações e rotas.

## Proposta de Implementação

### 1. Painel de Histórico (Frontend)
- **Localização**: Nova aba "Histórico" no Painel Editorial ou botão "Ver Histórico" dentro dos modais de edição.
- **Funcionalidades**:
  - Listagem cronológica de mudanças.
  - Filtros por Admin (quem alterou).
  - Filtros por Data.
  - Agrupamento por Item (ex: ver todas as mudanças feitas na "Estação I").
  - Visualização clara de "De" -> "Para" para textos e status.

### 2. Integração Técnica (Log Automático)
Para garantir que toda alteração via Painel Editorial seja registrada sem violar a trava de "não criar triggers" sem autorização nesta sprint:
- **Abordagem via Application Level**: Integrar a chamada de log nas Mutations de salvamento (`updateEstacao` e `updateItem`) no componente `AdminClubeEditorialTab.tsx`.

## Regras e Travas Respeitadas
- Nenhuma tabela nova será criada.
- Nenhuma alteração em RLS ou Auth.
- Estrutura existente será reutilizada.

## Classificação
**PRONTO PARA IMPLEMENTAÇÃO VISUAL**

(Com a ressalva de que a alimentação do log será feita via aplicação para respeitar as travas de banco de dados desta fase).

## Próximo Passo Sugerido
Implementar a interface de visualização do histórico e a função de registro (audit helper) no frontend.
