-- sync_fks_READY_ONLY_PUBLIC_SAFE_V2.sql
-- Este script contém EXATAMENTE 142 FKs candidatas validadas.
-- Qualificado com schema public.

SET search_path TO public;

DO $main$
DECLARE
    v_added INTEGER := 0;
    v_skipped_existing_name INTEGER := 0;
    v_skipped_existing_structural INTEGER := 0;
    v_skipped_not_ready INTEGER := 0;
    v_failed INTEGER := 0;
    v_rec RECORD;
BEGIN
    -- Tabela temporária para auditoria
    CREATE TEMP TABLE expected_fks_to_create (
        fk_name TEXT,
        src_table TEXT,
        src_col TEXT,
        tgt_table TEXT,
        tgt_col TEXT,
        extra_clause TEXT
    ) ON COMMIT DROP;

    INSERT INTO expected_fks_to_create VALUES ('access_expiration_logs_user_id_fkey', 'access_expiration_logs', 'user_id', 'profiles', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('admin_action_history_user_id_fkey', 'admin_action_history', 'user_id', 'profiles', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('admin_automation_audit_rule_id_fkey', 'admin_automation_audit', 'rule_id', 'admin_automation_rules', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('agente_conversas_agente_id_fkey', 'agente_conversas', 'agente_id', 'agentes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('agente_mensagens_conversa_id_fkey', 'agente_mensagens', 'conversa_id', 'agente_conversas', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('ai_interaction_logs_agente_id_fkey', 'ai_interaction_logs', 'agente_id', 'agentes', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('ai_recommendations_client_id_fkey', 'ai_recommendations', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('ai_recommendations_distrito_sugerido_id_fkey', 'ai_recommendations', 'distrito_sugerido_id', 'city_districts', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('ai_recommendations_session_id_fkey', 'ai_recommendations', 'session_id', 'sessions', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('ai_recommendations_tool_sugerida_id_fkey', 'ai_recommendations', 'tool_sugerida_id', 'tools', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('archetypal_profile_snapshots_client_id_fkey', 'archetypal_profile_snapshots', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('archetype_tools_archetype_id_fkey', 'archetype_tools', 'archetype_id', 'founding_archetypes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('archetype_tools_tool_id_fkey', 'archetype_tools', 'tool_id', 'tools', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('atelie_conteudos_template_id_fkey', 'atelie_conteudos', 'template_id', 'atelie_templates', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('atlas_arquetipos_registros_client_id_fkey', 'atlas_arquetipos_registros', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('aulas_portal_id_fkey', 'aulas', 'portal_id', 'portais', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('biblioteca_casos_porta_id_fkey', 'biblioteca_casos', 'porta_id', 'labirinto_portas', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('big5_funcional_perguntas_dimensao_id_fkey', 'big5_funcional_perguntas', 'dimensao_id', 'big5_funcional_dimensoes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('big5_oracular_perguntas_fator_id_fkey', 'big5_oracular_perguntas', 'fator_id', 'big5_oracular_fatores', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('big5_porta_mapeamento_ritual_id_fkey', 'big5_porta_mapeamento', 'ritual_id', 'rituais_simbolicos', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('big5_ritual_registros_big5_registro_id_fkey', 'big5_ritual_registros', 'big5_registro_id', 'big5_oracular_registros', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('big5_ritual_registros_ritual_id_fkey', 'big5_ritual_registros', 'ritual_id', 'rituais_simbolicos', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('big5_symbolic_afirmacoes_force_id_fkey', 'big5_symbolic_afirmacoes', 'force_id', 'big5_symbolic_forces', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('big5_symbolic_registros_session_case_id_fkey', 'big5_symbolic_registros', 'session_case_id', 'session_cases', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('book_links_from_book_id_fkey', 'book_links', 'from_book_id', 'books', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('book_links_to_book_id_fkey', 'book_links', 'to_book_id', 'books', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('book_media_station_id_fkey', 'book_media', 'station_id', 'clube_estacoes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('book_tours_book_id_fkey', 'book_tours', 'book_id', 'books', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('canteiro_reactions_entry_id_fkey', 'canteiro_reactions', 'entry_id', 'collective_bed_entries', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('cartografia_complexos_client_id_fkey', 'cartografia_complexos', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('cartografia_psiquica_client_id_fkey', 'cartografia_psiquica', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('cartographer_engine_client_id_fkey', 'cartographer_engine', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('cartographer_engine_session_id_fkey', 'cartographer_engine', 'session_id', 'sessions', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('cartographer_recommendations_engine_id_fkey', 'cartographer_recommendations', 'engine_id', 'cartographer_engine', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('cartographer_recommendations_ferramenta_escolhida_id_fkey', 'cartographer_recommendations', 'ferramenta_escolhida_id', 'tools', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('cartographer_recommendations_tool_complementar_id_fkey', 'cartographer_recommendations', 'tool_complementar_id', 'tools', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('cartographer_recommendations_tool_principal_id_fkey', 'cartographer_recommendations', 'tool_principal_id', 'tools', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('cartographies_client_id_fkey', 'cartographies', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('cartographies_session_id_fkey', 'cartographies', 'session_id', 'sessions', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('casa_circulo_replies_thread_id_fkey', 'casa_circulo_replies', 'thread_id', 'casa_circulo_threads', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('cidadela_oracle_cards_district_id_fkey', 'cidadela_oracle_cards', 'district_id', 'districts', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('cidadela_oracle_cards_suggested_tool_id_fkey', 'cidadela_oracle_cards', 'suggested_tool_id', 'tools', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('cidadela_oracle_usage_card_id_fkey', 'cidadela_oracle_usage', 'card_id', 'cidadela_oracle_cards', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('cidadela_oracle_usage_client_id_fkey', 'cidadela_oracle_usage', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('client_archetype_state_arquitipo_evolucao_id_fkey', 'client_archetype_state', 'arquitipo_evolucao_id', 'founding_archetypes', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('client_archetype_state_arquitipo_regente_id_fkey', 'client_archetype_state', 'arquitipo_regente_id', 'founding_archetypes', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('client_archetype_state_arquitipo_sombra_id_fkey', 'client_archetype_state', 'arquitipo_sombra_id', 'founding_archetypes', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('client_archetype_state_client_id_fkey', 'client_archetype_state', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('client_cidadela_map_client_id_fkey', 'client_cidadela_map', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('client_city_state_arquetipo_ativo_fkey', 'client_city_state', 'arquetipo_ativo', 'founding_archetypes', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('client_city_state_client_id_fkey', 'client_city_state', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('client_city_state_distrito_id_fkey', 'client_city_state', 'distrito_id', 'city_districts', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('client_city_state_ultima_ferramenta_id_fkey', 'client_city_state', 'ultima_ferramenta_id', 'tools', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('client_city_state_ultima_sessao_id_fkey', 'client_city_state', 'ultima_sessao_id', 'sessions', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('client_labyrinths_client_id_fkey', 'client_labyrinths', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('client_live_map_entries_session_id_fkey', 'client_live_map_entries', 'session_id', 'sessions', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('client_pattern_stats_client_id_fkey', 'client_pattern_stats', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('client_seasons_client_id_fkey', 'client_seasons', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('clube_audio_albums_estacao_id_fkey', 'clube_audio_albums', 'estacao_id', 'clube_estacoes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('clube_audio_progress_track_id_fkey', 'clube_audio_progress', 'track_id', 'clube_audio_tracks', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('clube_audio_tracks_album_id_fkey', 'clube_audio_tracks', 'album_id', 'clube_audio_albums', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('clube_carrossel_slides_estacao_id_fkey', 'clube_carrossel_slides', 'estacao_id', 'oracular_seasons', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('clube_engajamento_estacao_id_fkey', 'clube_engajamento', 'estacao_id', 'clube_estacoes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('clube_estacao_registros_estacao_id_fkey', 'clube_estacao_registros', 'estacao_id', 'clube_estacoes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('clube_estacoes_cartografia_id_fkey', 'clube_estacoes', 'cartografia_id', 'cartographies', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('clube_estacoes_quiz_id_fkey', 'clube_estacoes', 'quiz_id', 'quizzes', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('clube_jornadas_estacao_id_fkey', 'clube_jornadas', 'estacao_id', 'clube_estacoes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('clube_livro_aulas_porta_id_fkey', 'clube_livro_aulas', 'porta_id', 'clube_livro_portas', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('clube_livro_chat_interactions_book_id_fkey', 'clube_livro_chat_interactions', 'book_id', 'books', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('clube_livro_encontros_estacao_id_fkey', 'clube_livro_encontros', 'estacao_id', 'clube_estacoes', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('clube_livro_respostas_pergunta_id_fkey', 'clube_livro_respostas', 'pergunta_id', 'clube_livro_perguntas', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('clube_obras_essencia_8020_book_id_fkey', 'clube_obras_essencia_8020', 'book_id', 'books', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('clube_portais_jornada_id_fkey', 'clube_portais', 'jornada_id', 'clube_jornadas', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('clube_portal_audios_portal_id_fkey', 'clube_portal_audios', 'portal_id', 'clube_portais', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('clube_portal_insights_estacao_id_fkey', 'clube_portal_insights', 'estacao_id', 'oracular_seasons', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('clube_portal_materiais_portal_id_fkey', 'clube_portal_materiais', 'portal_id', 'clube_portais', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('clube_progresso_passos_passo_id_fkey', 'clube_progresso_passos', 'passo_id', 'clube_rota_itens', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('clube_reflexoes_estacao_id_fkey', 'clube_reflexoes', 'estacao_id', 'clube_estacoes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('clube_rota_itens_estacao_id_fkey', 'clube_rota_itens', 'estacao_id', 'clube_estacoes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('clube_rota_progresso_estacao_id_fkey', 'clube_rota_progresso', 'estacao_id', 'clube_estacoes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('clube_rota_progresso_rota_item_id_fkey', 'clube_rota_progresso', 'rota_item_id', 'clube_rota_itens', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('clube_v3_station_audios_station_id_fkey', 'clube_v3_station_audios', 'station_id', 'clube_v3_stations', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('clube_v3_station_content_station_id_fkey', 'clube_v3_station_content', 'station_id', 'clube_v3_stations', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('clube_v3_stations_route_id_fkey', 'clube_v3_stations', 'route_id', 'clube_v3_routes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('clube_v3_user_progress_station_id_fkey', 'clube_v3_user_progress', 'station_id', 'clube_v3_stations', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('co_ai_recommendations_client_id_fkey', 'co_ai_recommendations', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('co_ai_recommendations_tool_complementar_id_fkey', 'co_ai_recommendations', 'tool_complementar_id', 'sala_ferramentas', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('co_ai_recommendations_tool_sugerida_id_fkey', 'co_ai_recommendations', 'tool_sugerida_id', 'sala_ferramentas', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('co_appointments_client_id_fkey', 'co_appointments', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('co_appointments_workspace_id_fkey', 'co_appointments', 'workspace_id', 'co_workspaces', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('co_camara_sussurro_casos_proximo_treino_id_fkey', 'co_camara_sussurro_casos', 'proximo_treino_id', 'co_camara_sussurro_casos', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('co_city_history_client_id_fkey', 'co_city_history', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('co_city_history_tool_id_fkey', 'co_city_history', 'tool_id', 'sala_ferramentas', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('co_client_profile_client_id_fkey', 'co_client_profile', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('co_client_profiles_client_id_fkey', 'co_client_profiles', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('co_convites_cliente_id_fkey', 'co_convites', 'cliente_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('co_escutas_sessao_id_fkey', 'co_escutas', 'sessao_id', 'co_sessoes', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('co_garden_flowers_client_id_fkey', 'co_garden_flowers', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('co_garden_flowers_origem_registro_id_fkey', 'co_garden_flowers', 'origem_registro_id', 'co_journey_records', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('co_jardim_entries_jardim_id_fkey', 'co_jardim_entries', 'jardim_id', 'co_jardins', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('co_journey_records_client_id_fkey', 'co_journey_records', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('co_journey_records_tool_id_fkey', 'co_journey_records', 'tool_id', 'sala_ferramentas', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('co_orientacao_sugestoes_ia_cliente_id_fkey', 'co_orientacao_sugestoes_ia', 'cliente_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('co_orientacao_sugestoes_ia_orientacao_id_fkey', 'co_orientacao_sugestoes_ia', 'orientacao_id', 'co_orientacoes', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('co_orientacao_sugestoes_ia_session_id_fkey', 'co_orientacao_sugestoes_ia', 'session_id', 'sessions', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('co_orientacoes_cliente_id_fkey', 'co_orientacoes', 'cliente_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('co_orientacoes_session_id_fkey', 'co_orientacoes', 'session_id', 'sessions', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('co_passport_entries_client_id_fkey', 'co_passport_entries', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('co_praticas_sessao_id_fkey', 'co_praticas', 'sessao_id', 'co_sessoes', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('co_registros_simbolicos_jardim_id_fkey', 'co_registros_simbolicos', 'jardim_id', 'co_jardins', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('co_registros_simbolicos_sessao_id_fkey', 'co_registros_simbolicos', 'sessao_id', 'co_sessoes', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('co_sessoes_jardim_ref_id_fkey', 'co_sessoes', 'jardim_ref_id', 'co_jardins', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('co_sim_options_proximo_step_id_fkey', 'co_sim_options', 'proximo_step_id', 'co_sim_steps', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('co_sim_options_step_id_fkey', 'co_sim_options', 'step_id', 'co_sim_steps', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('co_sim_progress_case_id_fkey', 'co_sim_progress', 'case_id', 'co_sim_cases', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('co_sim_progress_escolha_id_fkey', 'co_sim_progress', 'escolha_id', 'co_sim_options', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('co_sim_progress_step_id_fkey', 'co_sim_progress', 'step_id', 'co_sim_steps', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('co_sim_steps_case_id_fkey', 'co_sim_steps', 'case_id', 'co_sim_cases', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('co_tool_flows_tool_destino_id_fkey', 'co_tool_flows', 'tool_destino_id', 'tools', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('co_tool_flows_tool_origem_id_fkey', 'co_tool_flows', 'tool_origem_id', 'tools', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('co_tool_usage_tool_id_fkey', 'co_tool_usage', 'tool_id', 'sala_ferramentas', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('co_training_attempts_case_id_fkey', 'co_training_attempts', 'case_id', 'co_training_cases', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('co_training_case_feedbacks_case_id_fkey', 'co_training_case_feedbacks', 'case_id', 'co_training_cases', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('co_training_case_possible_readings_case_id_fkey', 'co_training_case_possible_readings', 'case_id', 'co_training_cases', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('co_training_case_signals_case_id_fkey', 'co_training_case_signals', 'case_id', 'co_training_cases', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('co_training_progress_ultimo_case_id_fkey', 'co_training_progress', 'ultimo_case_id', 'co_training_cases', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('co_travessia_encontros_travessia_id_fkey', 'co_travessia_encontros', 'travessia_id', 'co_travessias', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('co_travessia_respostas_encontro_id_fkey', 'co_travessia_respostas', 'encontro_id', 'co_travessia_encontros', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('co_travessia_respostas_travessia_id_fkey', 'co_travessia_respostas', 'travessia_id', 'co_travessias', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('co_workspace_users_workspace_id_fkey', 'co_workspace_users', 'workspace_id', 'co_workspaces', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('collective_bed_entries_bed_id_fkey', 'collective_bed_entries', 'bed_id', 'collective_beds', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('collective_bed_entries_season_id_fkey', 'collective_bed_entries', 'season_id', 'oracular_seasons', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('collective_beds_season_id_fkey', 'collective_beds', 'season_id', 'oracular_seasons', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('community_comments_post_id_fkey', 'community_comments', 'post_id', 'community_posts', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('community_event_participants_event_id_fkey', 'community_event_participants', 'event_id', 'community_events', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('community_group_members_group_id_fkey', 'community_group_members', 'group_id', 'community_groups', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('community_likes_post_id_fkey', 'community_likes', 'post_id', 'community_posts', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('community_topic_replies_topic_id_fkey', 'community_topic_replies', 'topic_id', 'community_topics', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('community_topics_forum_id_fkey', 'community_topics', 'forum_id', 'community_forums', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('conselho_partes_internas_client_id_fkey', 'conselho_partes_internas', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('content_blocks_agente_id_fkey', 'content_blocks', 'agente_id', 'agentes', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('conteudo_aulas_travessia_id_fkey', 'conteudo_aulas', 'travessia_id', 'conteudo_travessias', 'id', 'ON DELETE CASCADE');

    -- Iteração segura
    FOR v_rec IN SELECT * FROM expected_fks_to_create LOOP
        BEGIN
            -- 1. Verificação por NOME
            IF EXISTS (
                SELECT 1 FROM pg_constraint c 
                JOIN pg_namespace n ON n.oid = c.connamespace 
                WHERE c.conname = v_rec.fk_name AND n.nspname = 'public'
            ) THEN
                v_skipped_existing_name := v_skipped_existing_name + 1;
                CONTINUE;
            END IF;

            -- 2. Verificação ESTRUTURAL (Equivalência)
            -- Verifica se já existe uma FK entre as mesmas tabelas/colunas mesmo com outro nome
            IF EXISTS (
                SELECT 1 
                FROM information_schema.key_column_usage kcu
                JOIN information_schema.referential_constraints rc ON kcu.constraint_name = rc.constraint_name
                JOIN information_schema.key_column_usage kcu_ref ON rc.unique_constraint_name = kcu_ref.constraint_name
                WHERE kcu.table_schema = 'public'
                  AND kcu.table_name = v_rec.src_table
                  AND kcu.column_name = v_rec.src_col
                  AND kcu_ref.table_name = v_rec.tgt_table
                  AND kcu_ref.column_name = v_rec.tgt_col
            ) THEN
                v_skipped_existing_structural := v_skipped_existing_structural + 1;
                CONTINUE;
            END IF;

            -- 3. Verificação de Prontidão (Tabelas/Colunas/Unicidade)
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = v_rec.src_table AND column_name = v_rec.src_col) OR
               NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = v_rec.tgt_table AND column_name = v_rec.tgt_col) THEN
                v_skipped_not_ready := v_skipped_not_ready + 1;
                CONTINUE;
            END IF;

            -- Verificação de UNIQUE no alvo
            IF NOT EXISTS (
                SELECT 1 FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                JOIN pg_class c ON c.oid = i.indrelid
                JOIN pg_namespace n ON n.oid = c.connamespace
                WHERE n.nspname = 'public' AND c.relname = v_rec.tgt_table AND a.attname = v_rec.tgt_col
                AND (i.indisprimary OR i.indisunique)
            ) THEN
                v_skipped_not_ready := v_skipped_not_ready + 1;
                CONTINUE;
            END IF;

            -- 4. Criação Segura
            BEGIN
                EXECUTE format('ALTER TABLE public.%I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES public.%I(%I) %s NOT VALID', 
                    v_rec.src_table, v_rec.fk_name, v_rec.src_col, v_rec.tgt_table, v_rec.tgt_col, v_rec.extra_clause);
                
                EXECUTE format('ALTER TABLE public.%I VALIDATE CONSTRAINT %I', v_rec.src_table, v_rec.fk_name);
                
                v_added := v_added + 1;
            EXCEPTION WHEN OTHERS THEN
                -- Rollback imediato da constraint em caso de erro no VALIDATE (órfãos)
                EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT IF EXISTS %I', v_rec.src_table, v_rec.fk_name);
                v_failed := v_failed + 1;
                RAISE WARNING 'Falha na FK %: %. Removida.', v_rec.fk_name, SQLERRM;
            END;

        EXCEPTION WHEN OTHERS THEN
            v_failed := v_failed + 1;
        END;
    END LOOP;

    -- Tabela de Resumo
    CREATE TEMP TABLE sync_summary_v2 AS 
    SELECT 'added' as status, v_added as count
    UNION ALL SELECT 'skipped_existing_name', v_skipped_existing_name
    UNION ALL SELECT 'skipped_existing_structural', v_skipped_existing_structural
    UNION ALL SELECT 'skipped_not_ready', v_skipped_not_ready
    UNION ALL SELECT 'failed', v_failed;
END $main$;

SELECT * FROM sync_summary_v2;
DROP TABLE IF EXISTS sync_summary_v2;
