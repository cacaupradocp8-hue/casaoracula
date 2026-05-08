
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
    ('message_logs_campaign_id_fkey', 'message_logs', 'message_campaigns', 'id'),
    ('message_logs_template_id_fkey', 'message_logs', 'message_templates', 'id'),
    ('mind_map_nodes_map_id_fkey', 'mind_map_nodes', 'mind_maps', 'id'),
    ('mind_map_nodes_parent_id_fkey', 'mind_map_nodes', 'mind_map_nodes', 'id'),
    ('mind_maps_owner_id_fkey', 'mind_maps', 'profiles', 'id'),
    ('missoes_aula_id_fkey', 'missoes', 'aulas', 'id'),
    ('missoes_portal_id_fkey', 'missoes', 'portais', 'id'),
    ('narrative_maps_case_id_fkey', 'narrative_maps', 'session_cases', 'id'),
    ('narrative_maps_client_id_fkey', 'narrative_maps', 'profiles', 'id'),
    ('narrative_maps_therapist_id_fkey', 'narrative_maps', 'profiles', 'id'),
    ('narroterapia_estudos_audio_id_fkey', 'narroterapia_estudos', 'audio_assets', 'id'),
    ('narroterapia_reacoes_simbolicas_audio_id_fkey', 'narroterapia_reacoes_simbolicas', 'audio_assets', 'id'),
    ('narroterapia_reacoes_simbolicas_conto_clinico_id_fkey', 'narroterapia_reacoes_simbolicas', 'contos_clinicos', 'id'),
    ('oracle_cards_archetype_id_fkey', 'oracle_cards', 'founding_archetypes', 'id'),
    ('oracle_cards_deck_id_fkey', 'oracle_cards', 'oracle_decks', 'id'),
    ('oracle_cards_district_id_fkey', 'oracle_cards', 'city_districts', 'id'),
    ('oracle_cards_tool_id_fkey', 'oracle_cards', 'tools', 'id'),
    ('oracle_categories_oracle_id_fkey', 'oracle_categories', 'oracle_decks', 'id'),
    ('oracle_draws_client_id_fkey', 'oracle_draws', 'oracle_clients', 'id'),
    ('oracle_draws_oracle_id_fkey', 'oracle_draws', 'oracle_decks', 'id'),
    ('oracle_draws_spread_id_fkey', 'oracle_draws', 'oracle_spreads', 'id'),
    ('oracle_spread_positions_spread_id_fkey', 'oracle_spread_positions', 'oracle_spreads', 'id'),
    ('oracle_spreads_oracle_id_fkey', 'oracle_spreads', 'oracle_decks', 'id'),
    ('oracle_usage_stats_client_id_fkey', 'oracle_usage_stats', 'clientes', 'id'),
    ('oraculo_aplicacoes_pergunta_id_fkey', 'oraculo_aplicacoes', 'oraculo_perguntas', 'id'),
    ('oraculo_favoritos_pergunta_id_fkey', 'oraculo_favoritos', 'oraculo_perguntas', 'id'),
    ('oraculo_portal_aplicacoes_portal_id_fkey', 'oraculo_portal_aplicacoes', 'oraculo_portais', 'id'),
    ('oraculo_portal_audios_portal_id_fkey', 'oraculo_portal_audios', 'oraculo_portais', 'id'),
    ('oraculo_portal_essencia_portal_id_fkey', 'oraculo_portal_essencia', 'oraculo_portais', 'id'),
    ('oraculo_portal_ferramenta_campos_ferramenta_id_fkey', 'oraculo_portal_ferramenta_campos', 'oraculo_portal_ferramentas', 'id'),
    ('oraculo_portal_ferramentas_portal_id_fkey', 'oraculo_portal_ferramentas', 'oraculo_portais', 'id'),
    ('oraculo_portal_forja_erros_forja_id_fkey', 'oraculo_portal_forja_erros', 'oraculo_portal_forjas', 'id'),
    ('oraculo_portal_forja_passos_forja_id_fkey', 'oraculo_portal_forja_passos', 'oraculo_portal_forjas', 'id'),
    ('oraculo_portal_forjas_portal_id_fkey', 'oraculo_portal_forjas', 'oraculo_portais', 'id'),
    ('oraculo_portal_jardins_portal_id_fkey', 'oraculo_portal_jardins', 'oraculo_portais', 'id'),
    ('oraculo_portal_laboratorio_passos_laboratorio_id_fkey', 'oraculo_portal_laboratorio_passos', 'oraculo_portal_laboratorios', 'id'),
    ('oraculo_portal_laboratorios_portal_id_fkey', 'oraculo_portal_laboratorios', 'oraculo_portais', 'id'),
    ('oraculo_portal_materiais_portal_id_fkey', 'oraculo_portal_materiais', 'oraculo_portais', 'id'),
    ('oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey', 'oraculo_portal_narroterapia_perguntas', 'oraculo_portal_narroterapia', 'id'),
    ('oraculo_portal_narroterapia_portal_id_fkey', 'oraculo_portal_narroterapia', 'oraculo_portais', 'id'),
    ('oraculo_portal_riscos_eticos_portal_id_fkey', 'oraculo_portal_riscos_eticos', 'oraculo_portais', 'id'),
    ('portais_jornada_id_fkey', 'portais', 'jornadas', 'id'),
    ('portais_modulo_id_fkey', 'portais', 'modulos_formativos', 'id'),
    ('portal_junguiano_modulos_config_id_fkey', 'portal_junguiano_modulos', 'portal_junguiano_config', 'id'),
    ('portal_junguiano_portais_modulo_id_fkey', 'portal_junguiano_portais', 'portal_junguiano_modulos', 'id'),
    ('portal_junguiano_progresso_config_id_fkey', 'portal_junguiano_progresso', 'portal_junguiano_config', 'id'),
    ('portal_junguiano_registros_portal_id_fkey', 'portal_junguiano_registros', 'portal_junguiano_portais', 'id'),
    ('portal_progress_portal_id_fkey', 'portal_progress', 'clube_portais', 'id'),
    ('portal_salas_sala_id_fkey', 'portal_salas', 'salas', 'id'),
    ('post_session_closures_case_id_fkey', 'post_session_closures', 'session_cases', 'id')
) as fk(name, table_name, ref_table, ref_columns);
  