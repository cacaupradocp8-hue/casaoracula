-- sync_fks_READY_ONLY_PUBLIC_SAFE.sql
-- Este script cria apenas as FKs que foram validadas como READY_TO_CREATE.
-- Qualificado com schema public.tabela.

SET search_path TO public;

DO $main$
DECLARE
    v_added INTEGER := 0;
    v_skipped_existing INTEGER := 0;
    v_skipped_not_ready INTEGER := 0;
    v_failed INTEGER := 0;
    v_rec RECORD;
BEGIN
    -- Criando tabela temporária para os dados esperados
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
    INSERT INTO expected_fks_to_create VALUES ('conteudo_travessias_sala_id_fkey', 'conteudo_travessias', 'sala_id', 'salas', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('contos_clinicos_audio_padrao_id_fkey', 'contos_clinicos', 'audio_padrao_id', 'audio_assets', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('corpo_inconsciente_cliente_id_fkey', 'corpo_inconsciente', 'cliente_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('course_enrollments_course_id_fkey', 'course_enrollments', 'course_id', 'courses', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('course_exercise_responses_lesson_id_fkey', 'course_exercise_responses', 'lesson_id', 'course_lessons', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('course_lesson_progress_lesson_id_fkey', 'course_lesson_progress', 'lesson_id', 'course_lessons', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('course_lessons_module_id_fkey', 'course_lessons', 'module_id', 'course_modules', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('course_module_forum_posts_module_id_fkey', 'course_module_forum_posts', 'module_id', 'course_modules', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('course_module_forum_posts_parent_id_fkey', 'course_module_forum_posts', 'parent_id', 'course_module_forum_posts', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('course_modules_course_id_fkey', 'course_modules', 'course_id', 'courses', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('course_work_submissions_course_id_fkey', 'course_work_submissions', 'course_id', 'courses', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('courses_sala_id_fkey', 'courses', 'sala_id', 'salas', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('custom_oracle_cards_custom_oracle_id_fkey', 'custom_oracle_cards', 'custom_oracle_id', 'custom_oracles', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('cycle_books_book_id_fkey', 'cycle_books', 'book_id', 'books', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('cycle_books_cycle_id_fkey', 'cycle_books', 'cycle_id', 'cycles', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('decodificacao_onirica_cliente_id_fkey', 'decodificacao_onirica', 'cliente_id', 'clientes', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('decodificacao_onirica_session_case_id_fkey', 'decodificacao_onirica', 'session_case_id', 'session_cases', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('diagnostico_ego_cliente_id_fkey', 'diagnostico_ego', 'cliente_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('district_state_changes_client_id_fkey', 'district_state_changes', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('district_state_changes_district_id_fkey', 'district_state_changes', 'district_id', 'districts', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('dreams_client_id_fkey', 'dreams', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('dreams_session_id_fkey', 'dreams', 'session_id', 'sessions', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('email_logs_user_id_fkey', 'email_logs', 'user_id', 'profiles', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('eneagrama_feminino_afirmacoes_arquetipo_id_fkey', 'eneagrama_feminino_afirmacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('eneagrama_feminino_orientacoes_arquetipo_id_fkey', 'eneagrama_feminino_orientacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('eneagrama_feminino_registros_session_case_id_fkey', 'eneagrama_feminino_registros', 'session_case_id', 'session_cases', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('escrita_nao_censurada_cliente_id_fkey', 'escrita_nao_censurada', 'cliente_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('estudio_projetos_book_id_fkey', 'estudio_projetos', 'book_id', 'books', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('estudos_caso_respostas_estudo_caso_id_fkey', 'estudos_caso_respostas', 'estudo_caso_id', 'estudos_caso', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('exercise_responses_exercise_id_fkey', 'exercise_responses', 'exercise_id', 'exercises', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('exercises_lesson_id_fkey', 'exercises', 'lesson_id', 'lessons', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('ferramenta_registros_cliente_id_fkey', 'ferramenta_registros', 'cliente_id', 'clientes', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('ferramenta_registros_ferramenta_id_fkey', 'ferramenta_registros', 'ferramenta_id', 'sala_ferramentas', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('fk_big5_caso', 'big5_registros', 'caso_id', 'casos', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('fk_eneagrama_caso', 'eneagrama_registros', 'caso_id', 'casos', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('formacao_modulos_formacao_id_fkey', 'formacao_modulos', 'formacao_id', 'formacoes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('founding_archetypes_distrito_principal_id_fkey', 'founding_archetypes', 'distrito_principal_id', 'city_districts', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('gestos_integracao_cliente_id_fkey', 'gestos_integracao', 'cliente_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('gestos_integracao_sessao_id_fkey', 'gestos_integracao', 'sessao_id', 'sessoes_casa_maquinas', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('group_encounters_group_id_fkey', 'group_encounters', 'group_id', 'therapy_groups', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('group_field_snapshots_circulo_id_fkey', 'group_field_snapshots', 'circulo_id', 'circulos_sagrados', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('group_field_snapshots_group_id_fkey', 'group_field_snapshots', 'group_id', 'therapeutic_groups', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('group_members_client_id_fkey', 'group_members', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('group_members_group_id_fkey', 'group_members', 'group_id', 'therapy_groups', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('group_participants_cliente_id_fkey', 'group_participants', 'cliente_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('group_participants_group_id_fkey', 'group_participants', 'group_id', 'therapeutic_groups', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('group_sessions_group_id_fkey', 'group_sessions', 'group_id', 'therapeutic_groups', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('heroina_arquetipo_registros_arquetipo_id_fkey', 'heroina_arquetipo_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('heroina_cenario_registros_metafora_id_fkey', 'heroina_cenario_registros', 'metafora_id', 'labirinto_metaforas', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('heroina_fase_ativa_fase_id_fkey', 'heroina_fase_ativa', 'fase_id', 'labirinto_fases', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('heroina_ritual_registros_ritual_id_fkey', 'heroina_ritual_registros', 'ritual_id', 'labirinto_rituais', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('imaginacao_ativa_cliente_id_fkey', 'imaginacao_ativa', 'cliente_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('intervention_favorites_intervention_id_fkey', 'intervention_favorites', 'intervention_id', 'interventions', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('interventions_district_id_fkey', 'interventions', 'district_id', 'districts', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('inventario_personas_cliente_id_fkey', 'inventario_personas', 'cliente_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('jardim_do_oficio_cliente_id_fkey', 'jardim_do_oficio', 'cliente_id', 'clientes', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('jardim_do_oficio_sessao_id_fkey', 'jardim_do_oficio', 'sessao_id', 'sessoes_casa_maquinas', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('jardim_grupo_registros_group_id_fkey', 'jardim_grupo_registros', 'group_id', 'therapeutic_groups', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('jardim_grupo_registros_session_id_fkey', 'jardim_grupo_registros', 'session_id', 'group_sessions', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('jardim_heroina_case_id_fkey', 'jardim_heroina', 'case_id', 'session_cases', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('jardim_heroina_client_id_fkey', 'jardim_heroina', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('jardim_heroina_registros_mapa_vivo_id_fkey', 'jardim_heroina_registros', 'mapa_vivo_id', 'mapa_vivo_heroina', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('jardim_heroina_registros_mapa_vivo_origem_id_fkey', 'jardim_heroina_registros', 'mapa_vivo_origem_id', 'mapa_vivo_heroina', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('jardim_heroina_registros_session_case_id_fkey', 'jardim_heroina_registros', 'session_case_id', 'session_cases', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('jornada_heroina_notas_profissionais_registro_id_fkey', 'jornada_heroina_notas_profissionais', 'registro_id', 'jornada_heroina_registros', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('jornada_heroina_registros_cliente_id_fkey', 'jornada_heroina_registros', 'cliente_id', 'clientes', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('jornada_heroina_registros_session_case_id_fkey', 'jornada_heroina_registros', 'session_case_id', 'session_cases', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('jornada_heroina_respostas_registro_id_fkey', 'jornada_heroina_respostas', 'registro_id', 'jornada_heroina_registros', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('jornada_individuacao_client_id_fkey', 'jornada_individuacao', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('journey_districts_district_id_fkey', 'journey_districts', 'district_id', 'districts', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('journey_districts_journey_id_fkey', 'journey_districts', 'journey_id', 'journeys', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('journey_events_client_id_fkey', 'journey_events', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('journey_events_session_id_fkey', 'journey_events', 'session_id', 'sessions', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('journey_media_journey_id_fkey', 'journey_media', 'journey_id', 'clube_jornadas', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('journey_reflections_client_id_fkey', 'journey_reflections', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('journeys_client_id_fkey', 'journeys', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('journeys_current_district_id_fkey', 'journeys', 'current_district_id', 'districts', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('lab_8020_progress_book_id_fkey', 'lab_8020_progress', 'book_id', 'books', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('lab_8020_progress_season_id_fkey', 'lab_8020_progress', 'season_id', 'oracular_seasons', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('labirinto_39_portas_client_id_fkey', 'labirinto_39_portas', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('labirinto_anotacoes_cliente_id_fkey', 'labirinto_anotacoes', 'cliente_id', 'clientes', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('labirinto_anotacoes_porta_id_fkey', 'labirinto_anotacoes', 'porta_id', 'labirinto_portas', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('labirinto_leituras_cliente_id_fkey', 'labirinto_leituras', 'cliente_id', 'clientes', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('labirinto_leituras_porta_id_fkey', 'labirinto_leituras', 'porta_id', 'labirinto_portas', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('labirinto_registros_arquetipo_id_fkey', 'labirinto_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('labirinto_registros_fase_id_fkey', 'labirinto_registros', 'fase_id', 'labirinto_fases', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('labirinto_registros_metafora_id_fkey', 'labirinto_registros', 'metafora_id', 'labirinto_metaforas', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('labirinto_registros_ritual_id_fkey', 'labirinto_registros', 'ritual_id', 'labirinto_rituais', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('labirinto_registros_session_case_id_fkey', 'labirinto_registros', 'session_case_id', 'session_cases', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('labirinto_roteiros_gerados_arquetipo_id_fkey', 'labirinto_roteiros_gerados', 'arquetipo_id', 'labirinto_arquetipos', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('labirinto_roteiros_gerados_fase_id_fkey', 'labirinto_roteiros_gerados', 'fase_id', 'labirinto_fases', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('labirinto_roteiros_gerados_metafora_id_fkey', 'labirinto_roteiros_gerados', 'metafora_id', 'labirinto_metaforas', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('labirinto_roteiros_gerados_ritual_id_fkey', 'labirinto_roteiros_gerados', 'ritual_id', 'labirinto_rituais', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('labirinto_roteiros_gerados_session_case_id_fkey', 'labirinto_roteiros_gerados', 'session_case_id', 'session_cases', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('labyrinth_records_client_id_fkey', 'labyrinth_records', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('labyrinth_records_session_id_fkey', 'labyrinth_records', 'session_id', 'sessions', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('lessons_album_book_id_fkey', 'lessons_album', 'book_id', 'books', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('lessons_travessia_id_fkey', 'lessons', 'travessia_id', 'travessias', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('mapa_heroina_porta_id_fkey', 'mapa_heroina', 'porta_id', 'labirinto_fases', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('mapa_sombra_cliente_id_fkey', 'mapa_sombra', 'cliente_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('mapa_vivo_heroina_gesto_jardim_registro_id_fkey', 'mapa_vivo_heroina', 'gesto_jardim_registro_id', 'jardim_heroina_registros', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('mapa_vivo_heroina_session_case_id_fkey', 'mapa_vivo_heroina', 'session_case_id', 'session_cases', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('mapa_vivo_historico_mapa_id_fkey', 'mapa_vivo_historico', 'mapa_id', 'mapa_vivo_heroina', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('mapeamento_complexos_cliente_id_fkey', 'mapeamento_complexos', 'cliente_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('message_logs_campaign_id_fkey', 'message_logs', 'campaign_id', 'message_campaigns', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('message_logs_template_id_fkey', 'message_logs', 'template_id', 'message_templates', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('mind_map_nodes_map_id_fkey', 'mind_map_nodes', 'map_id', 'mind_maps', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('mind_map_nodes_parent_id_fkey', 'mind_map_nodes', 'parent_id', 'mind_map_nodes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('mind_maps_owner_id_fkey', 'mind_maps', 'owner_id', 'profiles', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('missoes_aula_id_fkey', 'missoes', 'aula_id', 'aulas', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('missoes_portal_id_fkey', 'missoes', 'portal_id', 'portais', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('narrative_maps_case_id_fkey', 'narrative_maps', 'case_id', 'session_cases', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('narrative_maps_client_id_fkey', 'narrative_maps', 'client_id', 'profiles', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('narrative_maps_therapist_id_fkey', 'narrative_maps', 'therapist_id', 'profiles', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('narroterapia_estudos_audio_id_fkey', 'narroterapia_estudos', 'audio_id', 'audio_assets', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('narroterapia_reacoes_simbolicas_audio_id_fkey', 'narroterapia_reacoes_simbolicas', 'audio_id', 'audio_assets', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('narroterapia_reacoes_simbolicas_conto_clinico_id_fkey', 'narroterapia_reacoes_simbolicas', 'conto_clinico_id', 'contos_clinicos', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('oracle_cards_archetype_id_fkey', 'oracle_cards', 'archetype_id', 'founding_archetypes', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('oracle_cards_deck_id_fkey', 'oracle_cards', 'deck_id', 'oracle_decks', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('oracle_cards_district_id_fkey', 'oracle_cards', 'district_id', 'city_districts', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('oracle_cards_tool_id_fkey', 'oracle_cards', 'tool_id', 'tools', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('oracle_categories_oracle_id_fkey', 'oracle_categories', 'oracle_id', 'oracle_decks', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('oracle_draws_client_id_fkey', 'oracle_draws', 'client_id', 'oracle_clients', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('oracle_draws_oracle_id_fkey', 'oracle_draws', 'oracle_id', 'oracle_decks', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('oracle_draws_spread_id_fkey', 'oracle_draws', 'spread_id', 'oracle_spreads', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('oracle_spread_positions_spread_id_fkey', 'oracle_spread_positions', 'spread_id', 'oracle_spreads', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('oracle_spreads_oracle_id_fkey', 'oracle_spreads', 'oracle_id', 'oracle_decks', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('oracle_usage_stats_client_id_fkey', 'oracle_usage_stats', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('oraculo_aplicacoes_pergunta_id_fkey', 'oraculo_aplicacoes', 'pergunta_id', 'oraculo_perguntas', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('oraculo_favoritos_pergunta_id_fkey', 'oraculo_favoritos', 'pergunta_id', 'oraculo_perguntas', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('oraculo_portal_aplicacoes_portal_id_fkey', 'oraculo_portal_aplicacoes', 'portal_id', 'oraculo_portais', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('oraculo_portal_audios_portal_id_fkey', 'oraculo_portal_audios', 'portal_id', 'oraculo_portais', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('oraculo_portal_essencia_portal_id_fkey', 'oraculo_portal_essencia', 'portal_id', 'oraculo_portais', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('oraculo_portal_ferramenta_campos_ferramenta_id_fkey', 'oraculo_portal_ferramenta_campos', 'ferramenta_id', 'oraculo_portal_ferramentas', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('oraculo_portal_ferramentas_portal_id_fkey', 'oraculo_portal_ferramentas', 'portal_id', 'oraculo_portais', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('oraculo_portal_forja_erros_forja_id_fkey', 'oraculo_portal_forja_erros', 'forja_id', 'oraculo_portal_forjas', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('oraculo_portal_forja_passos_forja_id_fkey', 'oraculo_portal_forja_passos', 'forja_id', 'oraculo_portal_forjas', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('oraculo_portal_forjas_portal_id_fkey', 'oraculo_portal_forjas', 'portal_id', 'oraculo_portais', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('oraculo_portal_jardins_portal_id_fkey', 'oraculo_portal_jardins', 'portal_id', 'oraculo_portais', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('oraculo_portal_laboratorio_passos_laboratorio_id_fkey', 'oraculo_portal_laboratorio_passos', 'laboratorio_id', 'oraculo_portal_laboratorios', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('oraculo_portal_laboratorios_portal_id_fkey', 'oraculo_portal_laboratorios', 'portal_id', 'oraculo_portais', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('oraculo_portal_materiais_portal_id_fkey', 'oraculo_portal_materiais', 'portal_id', 'oraculo_portais', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey', 'oraculo_portal_narroterapia_perguntas', 'narroterapia_id', 'oraculo_portal_narroterapia', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('oraculo_portal_narroterapia_portal_id_fkey', 'oraculo_portal_narroterapia', 'portal_id', 'oraculo_portais', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('oraculo_portal_riscos_eticos_portal_id_fkey', 'oraculo_portal_riscos_eticos', 'portal_id', 'oraculo_portais', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('portais_jornada_id_fkey', 'portais', 'jornada_id', 'jornadas', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('portais_modulo_id_fkey', 'portais', 'modulo_id', 'modulos_formativos', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('portal_junguiano_modulos_config_id_fkey', 'portal_junguiano_modulos', 'config_id', 'portal_junguiano_config', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('portal_junguiano_portais_modulo_id_fkey', 'portal_junguiano_portais', 'modulo_id', 'portal_junguiano_modulos', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('portal_junguiano_progresso_config_id_fkey', 'portal_junguiano_progresso', 'config_id', 'portal_junguiano_config', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('portal_junguiano_registros_portal_id_fkey', 'portal_junguiano_registros', 'portal_id', 'portal_junguiano_portais', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('portal_progress_portal_id_fkey', 'portal_progress', 'portal_id', 'clube_portais', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('portal_salas_sala_id_fkey', 'portal_salas', 'sala_id', 'salas', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('post_session_closures_case_id_fkey', 'post_session_closures', 'case_id', 'session_cases', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('post_session_closures_client_id_fkey', 'post_session_closures', 'client_id', 'profiles', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('post_session_closures_therapist_id_fkey', 'post_session_closures', 'therapist_id', 'profiles', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('praticas_mudra_client_id_fkey', 'praticas_mudra', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('progresso_aluna_formacao_id_fkey', 'progresso_aluna', 'formacao_id', 'formacoes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('progresso_aluna_modulo_id_fkey', 'progresso_aluna', 'modulo_id', 'formacao_modulos', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('projetos_mestria_course_id_fkey', 'projetos_mestria', 'course_id', 'courses', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('protocolo_oracula_caminho_registro_id_fkey', 'protocolo_oracula', 'caminho_registro_id', 'jornada_heroina_registros', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('protocolo_oracula_cliente_id_fkey', 'protocolo_oracula', 'cliente_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('protocolo_oracula_mapa_registro_id_fkey', 'protocolo_oracula', 'mapa_registro_id', 'big5_symbolic_registros', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('protocolo_oracula_oraculo_registro_id_fkey', 'protocolo_oracula', 'oraculo_registro_id', 'eneagrama_feminino_registros', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('protocolo_oracula_session_case_id_fkey', 'protocolo_oracula', 'session_case_id', 'session_cases', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('quiz_opcoes_pergunta_id_fkey', 'quiz_opcoes', 'pergunta_id', 'quiz_perguntas', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('quiz_perguntas_quiz_id_fkey', 'quiz_perguntas', 'quiz_id', 'quizzes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('quiz_respostas_usuario_quiz_id_fkey', 'quiz_respostas_usuario', 'quiz_id', 'quizzes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('quiz_respostas_usuario_resultado_id_fkey', 'quiz_respostas_usuario', 'resultado_id', 'quiz_resultados', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('quiz_resultados_agente_id_fkey', 'quiz_resultados', 'agente_id', 'agentes', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('quiz_resultados_quiz_id_fkey', 'quiz_resultados', 'quiz_id', 'quizzes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('quizzes_portal_id_fkey', 'quizzes', 'portal_id', 'conteudo_travessias', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('quizzes_sala_id_fkey', 'quizzes', 'sala_id', 'salas', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('reflexoes_jornada_client_id_fkey', 'reflexoes_jornada', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('relacionamentos_espelho_client_id_fkey', 'relacionamentos_espelho', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('respostas_exercicios_sessao_id_fkey', 'respostas_exercicios', 'sessao_id', 'sessoes_labirinto', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('rituais_integracao_client_id_fkey', 'rituais_integracao', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('ritual_passages_ritual_id_fkey', 'ritual_passages', 'ritual_id', 'ritual_definitions', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('sala_ferramentas_familia_id_fkey', 'sala_ferramentas', 'familia_id', 'travessia_familias', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('sala_ferramentas_ferramenta_pai_id_fkey', 'sala_ferramentas', 'ferramenta_pai_id', 'sala_ferramentas', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('sala_ferramentas_portal_id_fkey', 'sala_ferramentas', 'portal_id', 'conteudo_travessias', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('sala_ferramentas_sala_id_fkey', 'sala_ferramentas', 'sala_id', 'salas', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('season_books_season_id_fkey', 'season_books', 'season_id', 'oracular_seasons', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('season_labs_season_id_fkey', 'season_labs', 'season_id', 'oracular_seasons', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('session_archetypes_archetype_id_fkey', 'session_archetypes', 'archetype_id', 'atlas_arquetipos_femininos', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('session_archetypes_client_id_fkey', 'session_archetypes', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('session_archetypes_session_id_fkey', 'session_archetypes', 'session_id', 'sessions', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('session_cases_client_id_fkey', 'session_cases', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('session_cases_therapist_id_fkey', 'session_cases', 'therapist_id', 'profiles', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('session_interventions_intervention_id_fkey', 'session_interventions', 'intervention_id', 'interventions', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('session_interventions_session_id_fkey', 'session_interventions', 'session_id', 'sessions', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('session_oracle_draws_case_id_fkey', 'session_oracle_draws', 'case_id', 'session_cases', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('session_oracle_draws_client_id_fkey', 'session_oracle_draws', 'client_id', 'profiles', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('session_oracle_draws_therapist_id_fkey', 'session_oracle_draws', 'therapist_id', 'profiles', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('session_scripts_case_id_fkey', 'session_scripts', 'case_id', 'session_cases', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('session_scripts_client_id_fkey', 'session_scripts', 'client_id', 'profiles', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('session_scripts_narrative_map_id_fkey', 'session_scripts', 'narrative_map_id', 'narrative_maps', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('session_scripts_therapist_id_fkey', 'session_scripts', 'therapist_id', 'profiles', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('sessions_cidadela_card_id_fkey', 'sessions', 'cidadela_card_id', 'cidadela_oracle_cards', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('sessions_client_id_fkey', 'sessions', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('sessions_district_id_fkey', 'sessions', 'district_id', 'districts', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('sessions_tool_id_fkey', 'sessions', 'tool_id', 'tools', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('sessoes_casa_maquinas_cliente_id_fkey', 'sessoes_casa_maquinas', 'cliente_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('sessoes_labirinto_porta_id_fkey', 'sessoes_labirinto', 'porta_id', 'labirinto_fases', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('simulador_progresso_cenario_id_fkey', 'simulador_progresso', 'cenario_id', 'simulador_cenarios', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('sonho_estruturado_cliente_id_fkey', 'sonho_estruturado', 'cliente_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('sonhos_cabalisticos_client_id_fkey', 'sonhos_cabalisticos', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('station_progress_station_id_fkey', 'station_progress', 'station_id', 'clube_estacoes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('studio_episodes_eixo_id_fkey', 'studio_episodes', 'eixo_id', 'studio_method_axes', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('symbolic_template_sessions_case_id_fkey', 'symbolic_template_sessions', 'case_id', 'session_cases', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('symbolic_template_sessions_cliente_id_fkey', 'symbolic_template_sessions', 'cliente_id', 'clientes', 'id', 'ON DELETE SET NULL');
    INSERT INTO expected_fks_to_create VALUES ('syntheia_conversations_mode_id_fkey', 'syntheia_conversations', 'mode_id', 'syntheia_modes', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('syntheia_conversations_voice_id_fkey', 'syntheia_conversations', 'voice_id', 'syntheia_voices', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('syntheia_messages_conversation_id_fkey', 'syntheia_messages', 'conversation_id', 'syntheia_conversations', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('tecela_conselho_respostas_conselho_id_fkey', 'tecela_conselho_respostas', 'conselho_id', 'tecela_conselho', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('tecela_ressonancias_registro_id_fkey', 'tecela_ressonancias', 'registro_id', 'tecela_registros_campo', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('tecela_supervisoes_caso_id_fkey', 'tecela_supervisoes', 'caso_id', 'tecela_casos_espelho', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('tool_districts_district_id_fkey', 'tool_districts', 'district_id', 'city_districts', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('tool_districts_tool_id_fkey', 'tool_districts', 'tool_id', 'tools', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('tools_district_id_fkey', 'tools', 'district_id', 'districts', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('tools_ferramenta_pai_id_fkey', 'tools', 'ferramenta_pai_id', 'tools', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('tools_proximo_passo_id_fkey', 'tools', 'proximo_passo_id', 'tools', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('torre_arquetipo_sugestao_arquetipo_id_fkey', 'torre_arquetipo_sugestao', 'arquetipo_id', 'atlas_arquetipos_femininos', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('torre_porta_relacao_porta_id_fkey', 'torre_porta_relacao', 'porta_id', 'labirinto_portas', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('towers_client_id_fkey', 'towers', 'client_id', 'clientes', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('towers_session_id_fkey', 'towers', 'session_id', 'sessions', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('travessia_comentarios_user_id_fkey', 'travessia_comentarios', 'user_id', 'profiles', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('travessia_day_unlocks_aula_id_fkey', 'travessia_day_unlocks', 'aula_id', 'conteudo_aulas', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('travessia_library_items_familia_id_fkey', 'travessia_library_items', 'familia_id', 'travessia_familias', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('travessia_library_media_item_id_fkey', 'travessia_library_media', 'item_id', 'travessia_library_items', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('travessia_library_tags_item_id_fkey', 'travessia_library_tags', 'item_id', 'travessia_library_items', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('treinamento_respostas_caso_id_fkey', 'treinamento_respostas', 'caso_id', 'treinamento_casos_simulados', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('upsell_opportunities_rule_id_fkey', 'upsell_opportunities', 'rule_id', 'upsell_rules', 'id', '');
    INSERT INTO expected_fks_to_create VALUES ('user_aula_progress_aula_id_fkey', 'user_aula_progress', 'aula_id', 'conteudo_aulas', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('user_cidadela_estado_user_id_fkey', 'user_cidadela_estado', 'user_id', 'profiles', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('user_favorites_library_item_id_fkey', 'user_favorites', 'library_item_id', 'library_items', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('user_progress_lesson_id_fkey', 'user_progress', 'lesson_id', 'lessons', 'id', 'ON DELETE CASCADE');
    INSERT INTO expected_fks_to_create VALUES ('user_unlocked_rewards_reward_id_fkey', 'user_unlocked_rewards', 'reward_id', 'symbolic_rewards', 'id', 'ON DELETE CASCADE');

    -- Iterar sobre as FKs e tentar criar
    FOR v_rec IN SELECT * FROM expected_fks_to_create LOOP
        BEGIN
            -- 1. Verificar se a constraint já existe
            IF EXISTS (
                SELECT 1 FROM pg_constraint c 
                JOIN pg_namespace n ON n.oid = c.connamespace 
                WHERE c.conname = v_rec.fk_name AND n.nspname = 'public'
            ) THEN
                v_skipped_existing := v_skipped_existing + 1;
                CONTINUE;
            END IF;

            -- 2. Verificar existência de tabelas e colunas (src e tgt)
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = v_rec.src_table AND column_name = v_rec.src_col) OR
               NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = v_rec.tgt_table AND column_name = v_rec.tgt_col) THEN
                v_skipped_not_ready := v_skipped_not_ready + 1;
                RAISE NOTICE 'Skipping %: Table or column missing.', v_rec.fk_name;
                CONTINUE;
            END IF;

            -- 3. Verificar se o destino tem PK ou UNIQUE na coluna alvo
            IF NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                JOIN pg_class c ON c.oid = i.indrelid
                JOIN pg_namespace n ON n.oid = c.connamespace
                WHERE n.nspname = 'public' 
                AND c.relname = v_rec.tgt_table 
                AND a.attname = v_rec.tgt_col
                AND (i.indisprimary OR i.indisunique)
            ) THEN
                v_skipped_not_ready := v_skipped_not_ready + 1;
                RAISE NOTICE 'Skipping %: Target column is not PK/UNIQUE.', v_rec.fk_name;
                CONTINUE;
            END IF;

            -- 4. Verificar compatibilidade de tipos
            IF (
                SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = v_rec.src_table AND column_name = v_rec.src_col
            ) != (
                SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = v_rec.tgt_table AND column_name = v_rec.tgt_col
            ) THEN
                v_skipped_not_ready := v_skipped_not_ready + 1;
                RAISE NOTICE 'Skipping %: Type mismatch.', v_rec.fk_name;
                CONTINUE;
            END IF;

            -- 5. Tentar criar (Se usar NOT VALID + VALIDATE, rollback no erro)
            BEGIN
                EXECUTE format('ALTER TABLE public.%I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES public.%I(%I) %s NOT VALID', 
                    v_rec.src_table, v_rec.fk_name, v_rec.src_col, v_rec.tgt_table, v_rec.tgt_col, v_rec.extra_clause);
                
                EXECUTE format('ALTER TABLE public.%I VALIDATE CONSTRAINT %I', v_rec.src_table, v_rec.fk_name);
                
                v_added := v_added + 1;
            EXCEPTION WHEN OTHERS THEN
                -- Se falhar o validate ou a criação, removemos a constraint para não deixar lixo
                EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT IF EXISTS %I', v_rec.src_table, v_rec.fk_name);
                v_failed := v_failed + 1;
                RAISE WARNING 'Failed to create %: %', v_rec.fk_name, SQLERRM;
            END;

        EXCEPTION WHEN OTHERS THEN
            v_failed := v_failed + 1;
            RAISE WARNING 'General error for %: %', v_rec.fk_name, SQLERRM;
        END;
    END LOOP;

    -- Resumo final
    RAISE NOTICE 'Summary: Added: %, Skipped Existing: %, Skipped Not Ready: %, Failed: %', v_added, v_skipped_existing, v_skipped_not_ready, v_failed;
    
    -- Exibir via SELECT para facilitar visualização no Supabase
    CREATE TEMP TABLE sync_summary AS 
    SELECT 'added' as status, v_added as count
    UNION ALL SELECT 'skipped_existing', v_skipped_existing
    UNION ALL SELECT 'skipped_not_ready', v_skipped_not_ready
    UNION ALL SELECT 'failed', v_failed;
END $main$;

SELECT * FROM sync_summary;
DROP TABLE IF EXISTS sync_summary;
