# Relatório de Backup — Casa Oracula

**Data:** 06/05/2026
**Origem (Projeto):** pvjiznbfwtjqmpeiqqzk (Lovable Cloud)
**Status:** Concluído com Sucesso

## Resumo Técnico
- **Schema:** 100% extraído em `schema_only.sql`.
- **Tabelas Detectadas:** ~150 tabelas (incluindo obsoletas e técnicas).
- **Volume de Dados:**
    - **Editorial:** Inclui Oráculos, Cursos, Ferramentas e Configurações de App.
    - **Sensível:** Contém `oracle_clients`, `session_notes`, `therapy_groups`, `exercise_responses`, `syntheia_conversations`.
- **Circularidades:** Detectadas em `tools`, `sala_ferramentas`, `course_module_forum_posts` e `mapa_vivo_heroina`. (Tratado no Manual de Restauração).

## Observações de Segurança
1.  **Dados Sensíveis:** Foram isolados em `data_sensitive_optional.sql` para evitar vazamentos acidentais durante a restauração de teste.
2.  **Auth Users:** Não incluídos no SQL (Limitação de segurança do Supabase). Devem ser tratados via API.
3.  **Storage:** O backup SQL contém as *referências* aos arquivos. Os arquivos físicos devem ser movidos entre buckets via script ou CLI do Supabase.

## Próximos Passos Recomendados
1.  Baixar a pasta `/backup_casa_oracula/`.
2.  Testar a restauração em um projeto Supabase Local ou Staging.
3.  Validar o funcionamento da Syntheia com as chaves de API no novo ambiente.
