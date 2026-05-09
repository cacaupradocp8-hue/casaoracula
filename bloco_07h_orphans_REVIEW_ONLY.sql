-- bloco_07h_orphans_REVIEW_ONLY.sql
-- Somente leitura (SELECT)
-- Check orphans for access_expiration_logs_user_id_fkey
SELECT 'access_expiration_logs' as table_name, 'user_id' as column_name, count(*) as orphan_count
FROM public.access_expiration_logs t
WHERE t.user_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM public.profiles r WHERE r.id = t.user_id);

-- Check orphans for admin_action_history_user_id_fkey
SELECT 'admin_action_history' as table_name, 'user_id' as column_name, count(*) as orphan_count
FROM public.admin_action_history t
WHERE t.user_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM public.profiles r WHERE r.id = t.user_id);

-- Check orphans for admin_automation_audit_rule_id_fkey
SELECT 'admin_automation_audit' as table_name, 'rule_id' as column_name, count(*) as orphan_count
FROM public.admin_automation_audit t
WHERE t.rule_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM public.admin_automation_rules r WHERE r.id = t.rule_id);

-- Check orphans for agente_conversas_agente_id_fkey
SELECT 'agente_conversas' as table_name, 'agente_id' as column_name, count(*) as orphan_count
FROM public.agente_conversas t
WHERE t.agente_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM public.agentes r WHERE r.id = t.agente_id);

-- Check orphans for agente_mensagens_conversa_id_fkey
SELECT 'agente_mensagens' as table_name, 'conversa_id' as column_name, count(*) as orphan_count
FROM public.agente_mensagens t
WHERE t.conversa_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM public.agente_conversas r WHERE r.id = t.conversa_id);

-- Check orphans for ai_interaction_logs_agente_id_fkey
SELECT 'ai_interaction_logs' as table_name, 'agente_id' as column_name, count(*) as orphan_count
FROM public.ai_interaction_logs t
WHERE t.agente_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM public.agentes r WHERE r.id = t.agente_id);

-- Check orphans for ai_recommendations_client_id_fkey
SELECT 'ai_recommendations' as table_name, 'client_id' as column_name, count(*) as orphan_count
FROM public.ai_recommendations t
WHERE t.client_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM public.clientes r WHERE r.id = t.client_id);

-- Check orphans for ai_recommendations_distrito_sugerido_id_fkey
SELECT 'ai_recommendations' as table_name, 'distrito_sugerido_id' as column_name, count(*) as orphan_count
FROM public.ai_recommendations t
WHERE t.distrito_sugerido_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM public.city_districts r WHERE r.id = t.distrito_sugerido_id);

-- Check orphans for ai_recommendations_session_id_fkey
SELECT 'ai_recommendations' as table_name, 'session_id' as column_name, count(*) as orphan_count
FROM public.ai_recommendations t
WHERE t.session_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM public.sessions r WHERE r.id = t.session_id);

-- Check orphans for ai_recommendations_tool_sugerida_id_fkey
SELECT 'ai_recommendations' as table_name, 'tool_sugerida_id' as column_name, count(*) as orphan_count
FROM public.ai_recommendations t
WHERE t.tool_sugerida_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM public.tools r WHERE r.id = t.tool_sugerida_id);

-- Check orphans for archetypal_profile_snapshots_client_id_fkey
SELECT 'archetypal_profile_snapshots' as table_name, 'client_id' as column_name, count(*) as orphan_count
FROM public.archetypal_profile_snapshots t
WHERE t.client_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM public.clientes r WHERE r.id = t.client_id);

-- Check orphans for archetype_tools_archetype_id_fkey
SELECT 'archetype_tools' as table_name, 'archetype_id' as column_name, count(*) as orphan_count
FROM public.archetype_tools t
WHERE t.archetype_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM public.founding_archetypes r WHERE r.id = t.archetype_id);

-- Check orphans for archetype_tools_tool_id_fkey
SELECT 'archetype_tools' as table_name, 'tool_id' as column_name, count(*) as orphan_count
FROM public.archetype_tools t
WHERE t.tool_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM public.tools r WHERE r.id = t.tool_id);

-- Check orphans for atelie_conteudos_template_id_fkey
SELECT 'atelie_conteudos' as table_name, 'template_id' as column_name, count(*) as orphan_count
FROM public.atelie_conteudos t
WHERE t.template_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM public.atelie_templates r WHERE r.id = t.template_id);

-- Check orphans for atlas_arquetipos_registros_client_id_fkey
SELECT 'atlas_arquetipos_registros' as table_name, 'client_id' as column_name, count(*) as orphan_count
FROM public.atlas_arquetipos_registros t
WHERE t.client_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM public.clientes r WHERE r.id = t.client_id);

-- Check orphans for aulas_portal_id_fkey
SELECT 'aulas' as table_name, 'portal_id' as column_name, count(*) as orphan_count
FROM public.aulas t
WHERE t.portal_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM public.portais r WHERE r.id = t.portal_id);

-- Check orphans for biblioteca_casos_porta_id_fkey
SELECT 'biblioteca_casos' as table_name, 'porta_id' as column_name, count(*) as orphan_count
FROM public.biblioteca_casos t
WHERE t.porta_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM public.labirinto_portas r WHERE r.id = t.porta_id);

-- Check orphans for big5_funcional_perguntas_dimensao_id_fkey
SELECT 'big5_funcional_perguntas' as table_name, 'dimensao_id' as column_name, count(*) as orphan_count
FROM public.big5_funcional_perguntas t
WHERE t.dimensao_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM public.big5_funcional_dimensoes r WHERE r.id = t.dimensao_id);

-- Check orphans for big5_oracular_perguntas_fator_id_fkey
SELECT 'big5_oracular_perguntas' as table_name, 'fator_id' as column_name, count(*) as orphan_count
FROM public.big5_oracular_perguntas t
WHERE t.fator_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM public.big5_oracular_fatores r WHERE r.id = t.fator_id);

-- Check orphans for big5_porta_mapeamento_ritual_id_fkey
SELECT 'big5_porta_mapeamento' as table_name, 'ritual_id' as column_name, count(*) as orphan_count
FROM public.big5_porta_mapeamento t
WHERE t.ritual_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM public.rituais_simbolicos r WHERE r.id = t.ritual_id);

-- Check orphans for big5_ritual_registros_big5_registro_id_fkey
SELECT 'big5_ritual_registros' as table_name, 'big5_registro_id' as column_name, count(*) as orphan_count
FROM public.big5_ritual_registros t
WHERE t.big5_registro_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM public.big5_oracular_registros r WHERE r.id = t.big5_registro_id);

-- Check orphans for big5_ritual_registros_ritual_id_fkey
SELECT 'big5_ritual_registros' as table_name, 'ritual_id' as column_name, count(*) as orphan_count
FROM public.big5_ritual_registros t
WHERE t.ritual_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM public.rituais_simbolicos r WHERE r.id = t.ritual_id);

-- Check orphans for big5_symbolic_afirmacoes_force_id_fkey
SELECT 'big5_symbolic_afirmacoes' as table_name, 'force_id' as column_name, count(*) as orphan_count
FROM public.big5_symbolic_afirmacoes t
WHERE t.force_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM public.big5_symbolic_forces r WHERE r.id = t.force_id);

-- Check orphans for big5_symbolic_registros_session_case_id_fkey
SELECT 'big5_symbolic_registros' as table_name, 'session_case_id' as column_name, count(*) as orphan_count
FROM public.big5_symbolic_registros t
WHERE t.session_case_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM public.session_cases r WHERE r.id = t.session_case_id);

-- Check orphans for book_links_from_book_id_fkey
SELECT 'book_links' as table_name, 'from_book_id' as column_name, count(*) as orphan_count
FROM public.book_links t
WHERE t.from_book_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM public.books r WHERE r.id = t.from_book_id);

-- Check orphans for book_links_to_book_id_fkey
SELECT 'book_links' as table_name, 'to_book_id' as column_name, count(*) as orphan_count
FROM public.book_links t
WHERE t.to_book_id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM public.books r WHERE r.id = t.to_book_id);

