# bloco_07i_column_mismatch_REVIEW_ONLY.md

Documentação de inconsistências de nomenclatura.

- **FK**: access_expiration_logs_user_id_fkey
  - Esperado: access_expiration_logs.user_id -> profiles.id

- **FK**: admin_action_history_user_id_fkey
  - Esperado: admin_action_history.user_id -> profiles.id

- **FK**: admin_automation_audit_rule_id_fkey
  - Esperado: admin_automation_audit.rule_id -> admin_automation_rules.id

- **FK**: agente_conversas_agente_id_fkey
  - Esperado: agente_conversas.agente_id -> agentes.id

- **FK**: agente_mensagens_conversa_id_fkey
  - Esperado: agente_mensagens.conversa_id -> agente_conversas.id

- **FK**: ai_interaction_logs_agente_id_fkey
  - Esperado: ai_interaction_logs.agente_id -> agentes.id

- **FK**: ai_recommendations_client_id_fkey
  - Esperado: ai_recommendations.client_id -> clientes.id

- **FK**: ai_recommendations_distrito_sugerido_id_fkey
  - Esperado: ai_recommendations.distrito_sugerido_id -> city_districts.id

- **FK**: ai_recommendations_session_id_fkey
  - Esperado: ai_recommendations.session_id -> sessions.id

- **FK**: ai_recommendations_tool_sugerida_id_fkey
  - Esperado: ai_recommendations.tool_sugerida_id -> tools.id

- **FK**: archetypal_profile_snapshots_client_id_fkey
  - Esperado: archetypal_profile_snapshots.client_id -> clientes.id

- **FK**: archetype_tools_archetype_id_fkey
  - Esperado: archetype_tools.archetype_id -> founding_archetypes.id

- **FK**: archetype_tools_tool_id_fkey
  - Esperado: archetype_tools.tool_id -> tools.id

- **FK**: atelie_conteudos_template_id_fkey
  - Esperado: atelie_conteudos.template_id -> atelie_templates.id

- **FK**: atlas_arquetipos_registros_client_id_fkey
  - Esperado: atlas_arquetipos_registros.client_id -> clientes.id

- **FK**: aulas_portal_id_fkey
  - Esperado: aulas.portal_id -> portais.id

- **FK**: biblioteca_casos_porta_id_fkey
  - Esperado: biblioteca_casos.porta_id -> labirinto_portas.id

- **FK**: big5_funcional_perguntas_dimensao_id_fkey
  - Esperado: big5_funcional_perguntas.dimensao_id -> big5_funcional_dimensoes.id

- **FK**: big5_oracular_perguntas_fator_id_fkey
  - Esperado: big5_oracular_perguntas.fator_id -> big5_oracular_fatores.id

- **FK**: big5_porta_mapeamento_ritual_id_fkey
  - Esperado: big5_porta_mapeamento.ritual_id -> rituais_simbolicos.id

- **FK**: big5_ritual_registros_big5_registro_id_fkey
  - Esperado: big5_ritual_registros.big5_registro_id -> big5_oracular_registros.id

- **FK**: big5_ritual_registros_ritual_id_fkey
  - Esperado: big5_ritual_registros.ritual_id -> rituais_simbolicos.id

- **FK**: big5_symbolic_afirmacoes_force_id_fkey
  - Esperado: big5_symbolic_afirmacoes.force_id -> big5_symbolic_forces.id

- **FK**: big5_symbolic_registros_session_case_id_fkey
  - Esperado: big5_symbolic_registros.session_case_id -> session_cases.id

- **FK**: book_links_from_book_id_fkey
  - Esperado: book_links.from_book_id -> books.id

- **FK**: book_links_to_book_id_fkey
  - Esperado: book_links.to_book_id -> books.id

