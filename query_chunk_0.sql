
SELECT
    fk.name,
    fk.table_name,
    fk.ref_table,
    fk.ref_columns,
    EXISTS (SELECT 1 FROM pg_constraint WHERE conname = fk.name) as exists,
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = fk.table_name) as source_table_exists,
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = fk.ref_table) as target_table_exists,
    (SELECT EXISTS (
        SELECT 1 FROM pg_class t
        JOIN pg_attribute a ON a.attrelid = t.oid
        JOIN pg_index i ON i.indrelid = t.oid
        JOIN pg_namespace n ON n.oid = t.relnamespace
        WHERE t.relname = fk.ref_table AND a.attname = fk.ref_columns -- Simplification for single column
        AND i.indisunique AND n.nspname = 'public'
    )) as target_unique
FROM (
    VALUES 
    ('access_expiration_logs_user_id_fkey', 'access_expiration_logs', 'profiles', 'id'),
    ('admin_action_history_user_id_fkey', 'admin_action_history', 'profiles', 'id'),
    ('admin_automation_audit_rule_id_fkey', 'admin_automation_audit', 'admin_automation_rules', 'id'),
    ('agente_conversas_agente_id_fkey', 'agente_conversas', 'agentes', 'id'),
    ('agente_mensagens_conversa_id_fkey', 'agente_mensagens', 'agente_conversas', 'id'),
    ('ai_interaction_logs_agente_id_fkey', 'ai_interaction_logs', 'agentes', 'id'),
    ('ai_recommendations_client_id_fkey', 'ai_recommendations', 'clientes', 'id'),
    ('ai_recommendations_distrito_sugerido_id_fkey', 'ai_recommendations', 'city_districts', 'id'),
    ('ai_recommendations_session_id_fkey', 'ai_recommendations', 'sessions', 'id'),
    ('ai_recommendations_tool_sugerida_id_fkey', 'ai_recommendations', 'tools', 'id'),
    ('archetypal_profile_snapshots_client_id_fkey', 'archetypal_profile_snapshots', 'clientes', 'id'),
    ('archetype_tools_archetype_id_fkey', 'archetype_tools', 'founding_archetypes', 'id'),
    ('archetype_tools_tool_id_fkey', 'archetype_tools', 'tools', 'id'),
    ('atelie_conteudos_template_id_fkey', 'atelie_conteudos', 'atelie_templates', 'id'),
    ('atlas_arquetipos_registros_client_id_fkey', 'atlas_arquetipos_registros', 'clientes', 'id'),
    ('aulas_portal_id_fkey', 'aulas', 'portais', 'id'),
    ('biblioteca_casos_porta_id_fkey', 'biblioteca_casos', 'labirinto_portas', 'id'),
    ('big5_funcional_perguntas_dimensao_id_fkey', 'big5_funcional_perguntas', 'big5_funcional_dimensoes', 'id'),
    ('big5_oracular_perguntas_fator_id_fkey', 'big5_oracular_perguntas', 'big5_oracular_fatores', 'id'),
    ('big5_porta_mapeamento_ritual_id_fkey', 'big5_porta_mapeamento', 'rituais_simbolicos', 'id'),
    ('big5_ritual_registros_big5_registro_id_fkey', 'big5_ritual_registros', 'big5_oracular_registros', 'id'),
    ('big5_ritual_registros_ritual_id_fkey', 'big5_ritual_registros', 'rituais_simbolicos', 'id'),
    ('big5_symbolic_afirmacoes_force_id_fkey', 'big5_symbolic_afirmacoes', 'big5_symbolic_forces', 'id'),
    ('big5_symbolic_registros_session_case_id_fkey', 'big5_symbolic_registros', 'session_cases', 'id'),
    ('book_links_from_book_id_fkey', 'book_links', 'books', 'id'),
    ('book_links_to_book_id_fkey', 'book_links', 'books', 'id'),
    ('book_media_station_id_fkey', 'book_media', 'clube_estacoes', 'id'),
    ('book_tours_book_id_fkey', 'book_tours', 'books', 'id'),
    ('canteiro_reactions_entry_id_fkey', 'canteiro_reactions', 'collective_bed_entries', 'id'),
    ('cartografia_complexos_client_id_fkey', 'cartografia_complexos', 'clientes', 'id'),
    ('cartografia_psiquica_client_id_fkey', 'cartografia_psiquica', 'clientes', 'id'),
    ('cartographer_engine_client_id_fkey', 'cartographer_engine', 'clientes', 'id'),
    ('cartographer_engine_session_id_fkey', 'cartographer_engine', 'sessions', 'id'),
    ('cartographer_recommendations_engine_id_fkey', 'cartographer_recommendations', 'cartographer_engine', 'id'),
    ('cartographer_recommendations_ferramenta_escolhida_id_fkey', 'cartographer_recommendations', 'tools', 'id'),
    ('cartographer_recommendations_tool_complementar_id_fkey', 'cartographer_recommendations', 'tools', 'id'),
    ('cartographer_recommendations_tool_principal_id_fkey', 'cartographer_recommendations', 'tools', 'id'),
    ('cartographies_client_id_fkey', 'cartographies', 'clientes', 'id'),
    ('cartographies_session_id_fkey', 'cartographies', 'sessions', 'id'),
    ('casa_circulo_replies_thread_id_fkey', 'casa_circulo_replies', 'casa_circulo_threads', 'id'),
    ('cidadela_oracle_cards_district_id_fkey', 'cidadela_oracle_cards', 'districts', 'id'),
    ('cidadela_oracle_cards_suggested_tool_id_fkey', 'cidadela_oracle_cards', 'tools', 'id'),
    ('cidadela_oracle_usage_card_id_fkey', 'cidadela_oracle_usage', 'cidadela_oracle_cards', 'id'),
    ('cidadela_oracle_usage_client_id_fkey', 'cidadela_oracle_usage', 'clientes', 'id'),
    ('client_archetype_state_arquitipo_evolucao_id_fkey', 'client_archetype_state', 'founding_archetypes', 'id'),
    ('client_archetype_state_arquitipo_regente_id_fkey', 'client_archetype_state', 'founding_archetypes', 'id'),
    ('client_archetype_state_arquitipo_sombra_id_fkey', 'client_archetype_state', 'founding_archetypes', 'id'),
    ('client_archetype_state_client_id_fkey', 'client_archetype_state', 'clientes', 'id'),
    ('client_cidadela_map_client_id_fkey', 'client_cidadela_map', 'clientes', 'id'),
    ('client_city_state_arquetipo_ativo_fkey', 'client_city_state', 'founding_archetypes', 'id')
) as fk(name, table_name, ref_table, ref_columns);
  