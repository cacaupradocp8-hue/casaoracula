
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
    ('client_city_state_client_id_fkey', 'client_city_state', 'clientes', 'id'),
    ('client_city_state_distrito_id_fkey', 'client_city_state', 'city_districts', 'id'),
    ('client_city_state_ultima_ferramenta_id_fkey', 'client_city_state', 'tools', 'id'),
    ('client_city_state_ultima_sessao_id_fkey', 'client_city_state', 'sessions', 'id'),
    ('client_labyrinths_client_id_fkey', 'client_labyrinths', 'clientes', 'id'),
    ('client_live_map_entries_session_id_fkey', 'client_live_map_entries', 'sessions', 'id'),
    ('client_pattern_stats_client_id_fkey', 'client_pattern_stats', 'clientes', 'id'),
    ('client_seasons_client_id_fkey', 'client_seasons', 'clientes', 'id'),
    ('club_books_cycle_id_fkey', '_deprecated_club_books', '_deprecated_club_cycles', 'id'),
    ('club_knowledge_entries_book_id_fkey', '_deprecated_club_knowledge_entries', 'books', 'id'),
    ('club_meetings_cycle_id_fkey', '_deprecated_club_meetings', '_deprecated_club_cycles', 'id'),
    ('club_user_cycles_cycle_id_fkey', '_deprecated_club_user_cycles', '_deprecated_club_cycles', 'id'),
    ('clube_audio_albums_estacao_id_fkey', 'clube_audio_albums', 'clube_estacoes', 'id'),
    ('clube_audio_progress_track_id_fkey', 'clube_audio_progress', 'clube_audio_tracks', 'id'),
    ('clube_audio_tracks_album_id_fkey', 'clube_audio_tracks', 'clube_audio_albums', 'id'),
    ('clube_carrossel_slides_estacao_id_fkey', 'clube_carrossel_slides', 'oracular_seasons', 'id'),
    ('clube_engajamento_estacao_id_fkey', 'clube_engajamento', 'clube_estacoes', 'id'),
    ('clube_estacao_registros_estacao_id_fkey', 'clube_estacao_registros', 'clube_estacoes', 'id'),
    ('clube_estacoes_cartografia_id_fkey', 'clube_estacoes', 'cartographies', 'id'),
    ('clube_estacoes_quiz_id_fkey', 'clube_estacoes', 'quizzes', 'id'),
    ('clube_jornadas_estacao_id_fkey', 'clube_jornadas', 'clube_estacoes', 'id'),
    ('clube_livro_aulas_porta_id_fkey', 'clube_livro_aulas', 'clube_livro_portas', 'id'),
    ('clube_livro_chat_interactions_book_id_fkey', 'clube_livro_chat_interactions', 'books', 'id'),
    ('clube_livro_encontros_estacao_id_fkey', 'clube_livro_encontros', 'clube_estacoes', 'id'),
    ('clube_livro_respostas_pergunta_id_fkey', 'clube_livro_respostas', 'clube_livro_perguntas', 'id'),
    ('clube_obras_essencia_8020_book_id_fkey', 'clube_obras_essencia_8020', 'books', 'id'),
    ('clube_portais_jornada_id_fkey', 'clube_portais', 'clube_jornadas', 'id'),
    ('clube_portal_audios_portal_id_fkey', 'clube_portal_audios', 'clube_portais', 'id'),
    ('clube_portal_insights_estacao_id_fkey', 'clube_portal_insights', 'oracular_seasons', 'id'),
    ('clube_portal_materiais_portal_id_fkey', 'clube_portal_materiais', 'clube_portais', 'id'),
    ('clube_progresso_passos_passo_id_fkey', 'clube_progresso_passos', 'clube_rota_itens', 'id'),
    ('clube_reflexoes_estacao_id_fkey', 'clube_reflexoes', 'clube_estacoes', 'id'),
    ('clube_rota_itens_estacao_id_fkey', 'clube_rota_itens', 'clube_estacoes', 'id'),
    ('clube_rota_progresso_estacao_id_fkey', 'clube_rota_progresso', 'clube_estacoes', 'id'),
    ('clube_rota_progresso_rota_item_id_fkey', 'clube_rota_progresso', 'clube_rota_itens', 'id'),
    ('clube_v3_station_audios_station_id_fkey', 'clube_v3_station_audios', 'clube_v3_stations', 'id'),
    ('clube_v3_station_content_station_id_fkey', 'clube_v3_station_content', 'clube_v3_stations', 'id'),
    ('clube_v3_stations_route_id_fkey', 'clube_v3_stations', 'clube_v3_routes', 'id'),
    ('clube_v3_user_progress_station_id_fkey', 'clube_v3_user_progress', 'clube_v3_stations', 'id'),
    ('co_ai_recommendations_client_id_fkey', 'co_ai_recommendations', 'clientes', 'id'),
    ('co_ai_recommendations_tool_complementar_id_fkey', 'co_ai_recommendations', 'sala_ferramentas', 'id'),
    ('co_ai_recommendations_tool_sugerida_id_fkey', 'co_ai_recommendations', 'sala_ferramentas', 'id'),
    ('co_appointments_client_id_fkey', 'co_appointments', 'clientes', 'id'),
    ('co_appointments_workspace_id_fkey', 'co_appointments', 'co_workspaces', 'id'),
    ('co_camara_sussurro_casos_proximo_treino_id_fkey', 'co_camara_sussurro_casos', 'co_camara_sussurro_casos', 'id'),
    ('co_city_history_client_id_fkey', 'co_city_history', 'clientes', 'id'),
    ('co_city_history_tool_id_fkey', 'co_city_history', 'sala_ferramentas', 'id'),
    ('co_client_profile_client_id_fkey', 'co_client_profile', 'clientes', 'id'),
    ('co_client_profiles_client_id_fkey', 'co_client_profiles', 'clientes', 'id'),
    ('co_convites_cliente_id_fkey', 'co_convites', 'clientes', 'id')
) as fk(name, table_name, ref_table, ref_columns);
  