# DATABASE SECURITY LINTER REPORT - Casa Orácula

**Total de Avisos:** 144

| ID | Tipo de Aviso | Tabela/Função Afetada | Severidade | Risco Real | Sugestão de Correção | Prioridade |
|:---|:---|:---|:---|:---|:---|:---|
| 1-7 | Security Definer View | Diversas Views | ERROR | Escalação de privilégios via view. | Alterar para SECURITY INVOKER ou revisar OWNER. | Alta |
| 8-144| Search Path Mutable | Diversas Funções SQL/pgSQL | WARN | Sequestro de execução (Shadow Schema). | Adicionar `SET search_path = public`. | Média |

## Análise de Risco
O maior risco reside nas **Security Definer Views**, que podem permitir que um usuário com poucas permissões acesse dados que apenas o criador da view poderia ver.

As funções sem **search_path** são um risco "teórico" alto em ambientes compartilhados, mas no Lovable Cloud o risco é mitigado pelo isolamento do projeto, embora a correção seja uma boa prática recomendada pelo Supabase.

---
*Apenas diagnóstico. Nenhuma alteração foi realizada.*
