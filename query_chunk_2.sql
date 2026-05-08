
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
    ('co_escutas_sessao_id_fkey', 'co_escutas', 'co_sessoes', 'id'),
    ('co_garden_flowers_client_id_fkey', 'co_garden_flowers', 'clientes', 'id'),
    ('co_garden_flowers_origem_registro_id_fkey', 'co_garden_flowers', 'co_journey_records', 'id'),
    ('co_jardim_entries_jardim_id_fkey', 'co_jardim_entries', 'co_jardins', 'id'),
    ('co_journey_records_client_id_fkey', 'co_journey_records', 'clientes', 'id'),
    ('co_journey_records_tool_id_fkey', 'co_journey_records', 'sala_ferramentas', 'id'),
    ('co_orientacao_sugestoes_ia_cliente_id_fkey', 'co_orientacao_sugestoes_ia', 'clientes', 'id'),
    ('co_orientacao_sugestoes_ia_orientacao_id_fkey', 'co_orientacao_sugestoes_ia', 'co_orientacoes', 'id'),
    ('co_orientacao_sugestoes_ia_session_id_fkey', 'co_orientacao_sugestoes_ia', 'sessions', 'id'),
    ('co_orientacoes_cliente_id_fkey', 'co_orientacoes', 'clientes', 'id'),
    ('co_orientacoes_session_id_fkey', 'co_orientacoes', 'sessions', 'id'),
    ('co_passport_entries_client_id_fkey', 'co_passport_entries', 'clientes', 'id'),
    ('co_praticas_sessao_id_fkey', 'co_praticas', 'co_sessoes', 'id'),
    ('co_registros_simbolicos_jardim_id_fkey', 'co_registros_simbolicos', 'co_jardins', 'id'),
    ('co_registros_simbolicos_sessao_id_fkey', 'co_registros_simbolicos', 'co_sessoes', 'id'),
    ('co_sessoes_jardim_ref_id_fkey', 'co_sessoes', 'co_jardins', 'id'),
    ('co_sim_options_proximo_step_id_fkey', 'co_sim_options', 'co_sim_steps', 'id'),
    ('co_sim_options_step_id_fkey', 'co_sim_options', 'co_sim_steps', 'id'),
    ('co_sim_progress_case_id_fkey', 'co_sim_progress', 'co_sim_cases', 'id'),
    ('co_sim_progress_escolha_id_fkey', 'co_sim_progress', 'co_sim_options', 'id'),
    ('co_sim_progress_step_id_fkey', 'co_sim_progress', 'co_sim_steps', 'id'),
    ('co_sim_steps_case_id_fkey', 'co_sim_steps', 'co_sim_cases', 'id'),
    ('co_tool_flows_tool_destino_id_fkey', 'co_tool_flows', 'tools', 'id'),
    ('co_tool_flows_tool_origem_id_fkey', 'co_tool_flows', 'tools', 'id'),
    ('co_tool_usage_tool_id_fkey', 'co_tool_usage', 'sala_ferramentas', 'id'),
    ('co_training_attempts_case_id_fkey', 'co_training_attempts', 'co_training_cases', 'id'),
    ('co_training_case_feedbacks_case_id_fkey', 'co_training_case_feedbacks', 'co_training_cases', 'id'),
    ('co_training_case_possible_readings_case_id_fkey', 'co_training_case_possible_readings', 'co_training_cases', 'id'),
    ('co_training_case_signals_case_id_fkey', 'co_training_case_signals', 'co_training_cases', 'id'),
    ('co_training_progress_ultimo_case_id_fkey', 'co_training_progress', 'co_training_cases', 'id'),
    ('co_travessia_encontros_travessia_id_fkey', 'co_travessia_encontros', 'co_travessias', 'id'),
    ('co_travessia_respostas_encontro_id_fkey', 'co_travessia_respostas', 'co_travessia_encontros', 'id'),
    ('co_travessia_respostas_travessia_id_fkey', 'co_travessia_respostas', 'co_travessias', 'id'),
    ('co_workspace_users_workspace_id_fkey', 'co_workspace_users', 'co_workspaces', 'id'),
    ('collective_bed_entries_bed_id_fkey', 'collective_bed_entries', 'collective_beds', 'id'),
    ('collective_bed_entries_season_id_fkey', 'collective_bed_entries', 'oracular_seasons', 'id'),
    ('collective_beds_season_id_fkey', 'collective_beds', 'oracular_seasons', 'id'),
    ('community_comments_post_id_fkey', 'community_comments', 'community_posts', 'id'),
    ('community_event_participants_event_id_fkey', 'community_event_participants', 'community_events', 'id'),
    ('community_group_members_group_id_fkey', 'community_group_members', 'community_groups', 'id'),
    ('community_likes_post_id_fkey', 'community_likes', 'community_posts', 'id'),
    ('community_topic_replies_topic_id_fkey', 'community_topic_replies', 'community_topics', 'id'),
    ('community_topics_forum_id_fkey', 'community_topics', 'community_forums', 'id'),
    ('conselho_partes_internas_client_id_fkey', 'conselho_partes_internas', 'clientes', 'id'),
    ('content_blocks_agente_id_fkey', 'content_blocks', 'agentes', 'id'),
    ('conteudo_aulas_travessia_id_fkey', 'conteudo_aulas', 'conteudo_travessias', 'id'),
    ('conteudo_travessias_sala_id_fkey', 'conteudo_travessias', 'salas', 'id'),
    ('contos_clinicos_audio_padrao_id_fkey', 'contos_clinicos', 'audio_assets', 'id'),
    ('corpo_inconsciente_cliente_id_fkey', 'corpo_inconsciente', 'clientes', 'id'),
    ('course_enrollments_course_id_fkey', 'course_enrollments', 'courses', 'id')
) as fk(name, table_name, ref_table, ref_columns);
  