
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
    ('simulador_progresso_cenario_id_fkey', 'simulador_progresso', 'simulador_cenarios', 'id'),
    ('sonho_estruturado_cliente_id_fkey', 'sonho_estruturado', 'clientes', 'id'),
    ('sonhos_cabalisticos_client_id_fkey', 'sonhos_cabalisticos', 'clientes', 'id'),
    ('station_progress_station_id_fkey', 'station_progress', 'clube_estacoes', 'id'),
    ('studio_episodes_eixo_id_fkey', 'studio_episodes', 'studio_method_axes', 'id'),
    ('symbolic_template_sessions_case_id_fkey', 'symbolic_template_sessions', 'session_cases', 'id'),
    ('symbolic_template_sessions_cliente_id_fkey', 'symbolic_template_sessions', 'clientes', 'id'),
    ('syntheia_conversations_mode_id_fkey', 'syntheia_conversations', 'syntheia_modes', 'id'),
    ('syntheia_conversations_voice_id_fkey', 'syntheia_conversations', 'syntheia_voices', 'id'),
    ('syntheia_messages_conversation_id_fkey', 'syntheia_messages', 'syntheia_conversations', 'id'),
    ('tecela_conselho_respostas_conselho_id_fkey', 'tecela_conselho_respostas', 'tecela_conselho', 'id'),
    ('tecela_ressonancias_registro_id_fkey', 'tecela_ressonancias', 'tecela_registros_campo', 'id'),
    ('tecela_supervisoes_caso_id_fkey', 'tecela_supervisoes', 'tecela_casos_espelho', 'id'),
    ('tool_districts_district_id_fkey', 'tool_districts', 'city_districts', 'id'),
    ('tool_districts_tool_id_fkey', 'tool_districts', 'tools', 'id'),
    ('tools_district_id_fkey', 'tools', 'districts', 'id'),
    ('tools_ferramenta_pai_id_fkey', 'tools', 'tools', 'id'),
    ('tools_proximo_passo_id_fkey', 'tools', 'tools', 'id'),
    ('torre_arquetipo_sugestao_arquetipo_id_fkey', 'torre_arquetipo_sugestao', 'atlas_arquetipos_femininos', 'id'),
    ('torre_porta_relacao_porta_id_fkey', 'torre_porta_relacao', 'labirinto_portas', 'id'),
    ('towers_client_id_fkey', 'towers', 'clientes', 'id'),
    ('towers_session_id_fkey', 'towers', 'sessions', 'id'),
    ('travessia_comentarios_user_id_fkey', 'travessia_comentarios', 'profiles', 'id'),
    ('travessia_day_unlocks_aula_id_fkey', 'travessia_day_unlocks', 'conteudo_aulas', 'id'),
    ('travessia_library_items_familia_id_fkey', 'travessia_library_items', 'travessia_familias', 'id'),
    ('travessia_library_media_item_id_fkey', 'travessia_library_media', 'travessia_library_items', 'id'),
    ('travessia_library_tags_item_id_fkey', 'travessia_library_tags', 'travessia_library_items', 'id'),
    ('treinamento_respostas_caso_id_fkey', 'treinamento_respostas', 'treinamento_casos_simulados', 'id'),
    ('upsell_opportunities_rule_id_fkey', 'upsell_opportunities', 'upsell_rules', 'id'),
    ('user_aula_progress_aula_id_fkey', 'user_aula_progress', 'conteudo_aulas', 'id'),
    ('user_cidadela_estado_user_id_fkey', 'user_cidadela_estado', 'profiles', 'id'),
    ('user_favorites_library_item_id_fkey', 'user_favorites', 'library_items', 'id'),
    ('user_progress_lesson_id_fkey', 'user_progress', 'lessons', 'id'),
    ('user_unlocked_rewards_reward_id_fkey', 'user_unlocked_rewards', 'symbolic_rewards', 'id')
) as fk(name, table_name, ref_table, ref_columns);
  