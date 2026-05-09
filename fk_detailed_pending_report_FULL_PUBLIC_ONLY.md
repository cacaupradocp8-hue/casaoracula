# fk_detailed_pending_report_FULL_PUBLIC_ONLY.md

Este relatório contém exatamente 26 FKs pendentes ou bloqueadas identificadas como prioritárias para revisão.

| origem_schema | origem_tabela | origem_coluna | destino_schema | destino_tabela | destino_coluna | nome_fk | status_real | orphan_count | motivo_real | risco |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| public | access_expiration_logs | user_id | public | profiles | id | access_expiration_logs_user_id_fkey | READY | 0 | - | baixo |
| public | admin_action_history | user_id | public | profiles | id | admin_action_history_user_id_fkey | READY | 0 | - | baixo |
| public | admin_automation_audit | rule_id | public | admin_automation_rules | id | admin_automation_audit_rule_id_fkey | READY | 0 | - | baixo |
| public | agente_conversas | agente_id | public | agentes | id | agente_conversas_agente_id_fkey | READY | 0 | - | baixo |
| public | agente_mensagens | conversa_id | public | agente_conversas | id | agente_mensagens_conversa_id_fkey | READY | 0 | - | baixo |
| public | ai_interaction_logs | agente_id | public | agentes | id | ai_interaction_logs_agente_id_fkey | READY | 0 | - | baixo |
| public | ai_recommendations | client_id | public | clientes | id | ai_recommendations_client_id_fkey | READY | 0 | - | baixo |
| public | ai_recommendations | distrito_sugerido_id | public | city_districts | id | ai_recommendations_distrito_sugerido_id_fkey | READY | 0 | - | baixo |
| public | ai_recommendations | session_id | public | sessions | id | ai_recommendations_session_id_fkey | READY | 0 | - | baixo |
| public | ai_recommendations | tool_sugerida_id | public | tools | id | ai_recommendations_tool_sugerida_id_fkey | READY | 0 | - | baixo |
| public | archetypal_profile_snapshots | client_id | public | clientes | id | archetypal_profile_snapshots_client_id_fkey | READY | 0 | - | baixo |
| public | archetype_tools | archetype_id | public | founding_archetypes | id | archetype_tools_archetype_id_fkey | READY | 0 | - | baixo |
| public | archetype_tools | tool_id | public | tools | id | archetype_tools_tool_id_fkey | READY | 0 | - | baixo |
| public | atelie_conteudos | template_id | public | atelie_templates | id | atelie_conteudos_template_id_fkey | READY | 0 | - | baixo |
| public | atlas_arquetipos_registros | client_id | public | clientes | id | atlas_arquetipos_registros_client_id_fkey | READY | 0 | - | baixo |
| public | aulas | portal_id | public | portais | id | aulas_portal_id_fkey | READY | 0 | - | baixo |
| public | biblioteca_casos | porta_id | public | labirinto_portas | id | biblioteca_casos_porta_id_fkey | READY | 0 | - | baixo |
| public | big5_funcional_perguntas | dimensao_id | public | big5_funcional_dimensoes | id | big5_funcional_perguntas_dimensao_id_fkey | READY | 0 | - | baixo |
| public | big5_oracular_perguntas | fator_id | public | big5_oracular_fatores | id | big5_oracular_perguntas_fator_id_fkey | READY | 0 | - | baixo |
| public | big5_porta_mapeamento | ritual_id | public | rituais_simbolicos | id | big5_porta_mapeamento_ritual_id_fkey | READY | 0 | - | baixo |
| public | big5_ritual_registros | big5_registro_id | public | big5_oracular_registros | id | big5_ritual_registros_big5_registro_id_fkey | READY | 0 | - | baixo |
| public | big5_ritual_registros | ritual_id | public | rituais_simbolicos | id | big5_ritual_registros_ritual_id_fkey | READY | 0 | - | baixo |
| public | big5_symbolic_afirmacoes | force_id | public | big5_symbolic_forces | id | big5_symbolic_afirmacoes_force_id_fkey | READY | 0 | - | baixo |
| public | big5_symbolic_registros | session_case_id | public | session_cases | id | big5_symbolic_registros_session_case_id_fkey | READY | 0 | - | baixo |
| public | book_links | from_book_id | public | books | id | book_links_from_book_id_fkey | READY | 0 | - | baixo |
| public | book_links | to_book_id | public | books | id | book_links_to_book_id_fkey | READY | 0 | - | baixo |
