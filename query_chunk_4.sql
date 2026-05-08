
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
    ('inventario_personas_cliente_id_fkey', 'inventario_personas', 'clientes', 'id'),
    ('jardim_do_oficio_cliente_id_fkey', 'jardim_do_oficio', 'clientes', 'id'),
    ('jardim_do_oficio_sessao_id_fkey', 'jardim_do_oficio', 'sessoes_casa_maquinas', 'id'),
    ('jardim_grupo_registros_group_id_fkey', 'jardim_grupo_registros', 'therapeutic_groups', 'id'),
    ('jardim_grupo_registros_session_id_fkey', 'jardim_grupo_registros', 'group_sessions', 'id'),
    ('jardim_heroina_case_id_fkey', 'jardim_heroina', 'session_cases', 'id'),
    ('jardim_heroina_client_id_fkey', 'jardim_heroina', 'clientes', 'id'),
    ('jardim_heroina_registros_mapa_vivo_id_fkey', 'jardim_heroina_registros', 'mapa_vivo_heroina', 'id'),
    ('jardim_heroina_registros_mapa_vivo_origem_id_fkey', 'jardim_heroina_registros', 'mapa_vivo_heroina', 'id'),
    ('jardim_heroina_registros_session_case_id_fkey', 'jardim_heroina_registros', 'session_cases', 'id'),
    ('jornada_heroina_notas_profissionais_registro_id_fkey', 'jornada_heroina_notas_profissionais', 'jornada_heroina_registros', 'id'),
    ('jornada_heroina_registros_cliente_id_fkey', 'jornada_heroina_registros', 'clientes', 'id'),
    ('jornada_heroina_registros_session_case_id_fkey', 'jornada_heroina_registros', 'session_cases', 'id'),
    ('jornada_heroina_respostas_registro_id_fkey', 'jornada_heroina_respostas', 'jornada_heroina_registros', 'id'),
    ('jornada_individuacao_client_id_fkey', 'jornada_individuacao', 'clientes', 'id'),
    ('journey_districts_district_id_fkey', 'journey_districts', 'districts', 'id'),
    ('journey_districts_journey_id_fkey', 'journey_districts', 'journeys', 'id'),
    ('journey_events_client_id_fkey', 'journey_events', 'clientes', 'id'),
    ('journey_events_session_id_fkey', 'journey_events', 'sessions', 'id'),
    ('journey_media_journey_id_fkey', 'journey_media', 'clube_jornadas', 'id'),
    ('journey_reflections_client_id_fkey', 'journey_reflections', 'clientes', 'id'),
    ('journeys_client_id_fkey', 'journeys', 'clientes', 'id'),
    ('journeys_current_district_id_fkey', 'journeys', 'districts', 'id'),
    ('lab_8020_progress_book_id_fkey', 'lab_8020_progress', 'books', 'id'),
    ('lab_8020_progress_season_id_fkey', 'lab_8020_progress', 'oracular_seasons', 'id'),
    ('labirinto_39_portas_client_id_fkey', 'labirinto_39_portas', 'clientes', 'id'),
    ('labirinto_anotacoes_cliente_id_fkey', 'labirinto_anotacoes', 'clientes', 'id'),
    ('labirinto_anotacoes_porta_id_fkey', 'labirinto_anotacoes', 'labirinto_portas', 'id'),
    ('labirinto_leituras_cliente_id_fkey', 'labirinto_leituras', 'clientes', 'id'),
    ('labirinto_leituras_porta_id_fkey', 'labirinto_leituras', 'labirinto_portas', 'id'),
    ('labirinto_registros_arquetipo_id_fkey', 'labirinto_registros', 'labirinto_arquetipos', 'id'),
    ('labirinto_registros_fase_id_fkey', 'labirinto_registros', 'labirinto_fases', 'id'),
    ('labirinto_registros_metafora_id_fkey', 'labirinto_registros', 'labirinto_metaforas', 'id'),
    ('labirinto_registros_ritual_id_fkey', 'labirinto_registros', 'labirinto_rituais', 'id'),
    ('labirinto_registros_session_case_id_fkey', 'labirinto_registros', 'session_cases', 'id'),
    ('labirinto_roteiros_gerados_arquetipo_id_fkey', 'labirinto_roteiros_gerados', 'labirinto_arquetipos', 'id'),
    ('labirinto_roteiros_gerados_fase_id_fkey', 'labirinto_roteiros_gerados', 'labirinto_fases', 'id'),
    ('labirinto_roteiros_gerados_metafora_id_fkey', 'labirinto_roteiros_gerados', 'labirinto_metaforas', 'id'),
    ('labirinto_roteiros_gerados_ritual_id_fkey', 'labirinto_roteiros_gerados', 'labirinto_rituais', 'id'),
    ('labirinto_roteiros_gerados_session_case_id_fkey', 'labirinto_roteiros_gerados', 'session_cases', 'id'),
    ('labyrinth_records_client_id_fkey', 'labyrinth_records', 'clientes', 'id'),
    ('labyrinth_records_session_id_fkey', 'labyrinth_records', 'sessions', 'id'),
    ('lessons_album_book_id_fkey', 'lessons_album', 'books', 'id'),
    ('lessons_travessia_id_fkey', 'lessons', 'travessias', 'id'),
    ('mapa_heroina_porta_id_fkey', 'mapa_heroina', 'labirinto_fases', 'id'),
    ('mapa_sombra_cliente_id_fkey', 'mapa_sombra', 'clientes', 'id'),
    ('mapa_vivo_heroina_gesto_jardim_registro_id_fkey', 'mapa_vivo_heroina', 'jardim_heroina_registros', 'id'),
    ('mapa_vivo_heroina_session_case_id_fkey', 'mapa_vivo_heroina', 'session_cases', 'id'),
    ('mapa_vivo_historico_mapa_id_fkey', 'mapa_vivo_historico', 'mapa_vivo_heroina', 'id'),
    ('mapeamento_complexos_cliente_id_fkey', 'mapeamento_complexos', 'clientes', 'id')
) as fk(name, table_name, ref_table, ref_columns);
  