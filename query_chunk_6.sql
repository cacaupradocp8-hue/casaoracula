
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
    ('post_session_closures_client_id_fkey', 'post_session_closures', 'profiles', 'id'),
    ('post_session_closures_therapist_id_fkey', 'post_session_closures', 'profiles', 'id'),
    ('praticas_mudra_client_id_fkey', 'praticas_mudra', 'clientes', 'id'),
    ('progresso_aluna_formacao_id_fkey', 'progresso_aluna', 'formacoes', 'id'),
    ('progresso_aluna_modulo_id_fkey', 'progresso_aluna', 'formacao_modulos', 'id'),
    ('projetos_mestria_course_id_fkey', 'projetos_mestria', 'courses', 'id'),
    ('protocolo_oracula_caminho_registro_id_fkey', 'protocolo_oracula', 'jornada_heroina_registros', 'id'),
    ('protocolo_oracula_cliente_id_fkey', 'protocolo_oracula', 'clientes', 'id'),
    ('protocolo_oracula_mapa_registro_id_fkey', 'protocolo_oracula', 'big5_symbolic_registros', 'id'),
    ('protocolo_oracula_oraculo_registro_id_fkey', 'protocolo_oracula', 'eneagrama_feminino_registros', 'id'),
    ('protocolo_oracula_session_case_id_fkey', 'protocolo_oracula', 'session_cases', 'id'),
    ('quiz_opcoes_pergunta_id_fkey', 'quiz_opcoes', 'quiz_perguntas', 'id'),
    ('quiz_perguntas_quiz_id_fkey', 'quiz_perguntas', 'quizzes', 'id'),
    ('quiz_respostas_usuario_quiz_id_fkey', 'quiz_respostas_usuario', 'quizzes', 'id'),
    ('quiz_respostas_usuario_resultado_id_fkey', 'quiz_respostas_usuario', 'quiz_resultados', 'id'),
    ('quiz_resultados_agente_id_fkey', 'quiz_resultados', 'agentes', 'id'),
    ('quiz_resultados_quiz_id_fkey', 'quiz_resultados', 'quizzes', 'id'),
    ('quizzes_portal_id_fkey', 'quizzes', 'conteudo_travessias', 'id'),
    ('quizzes_sala_id_fkey', 'quizzes', 'salas', 'id'),
    ('reflexoes_jornada_client_id_fkey', 'reflexoes_jornada', 'clientes', 'id'),
    ('relacionamentos_espelho_client_id_fkey', 'relacionamentos_espelho', 'clientes', 'id'),
    ('respostas_exercicios_sessao_id_fkey', 'respostas_exercicios', 'sessoes_labirinto', 'id'),
    ('rituais_integracao_client_id_fkey', 'rituais_integracao', 'clientes', 'id'),
    ('ritual_passages_ritual_id_fkey', 'ritual_passages', 'ritual_definitions', 'id'),
    ('sala_ferramentas_familia_id_fkey', 'sala_ferramentas', 'travessia_familias', 'id'),
    ('sala_ferramentas_ferramenta_pai_id_fkey', 'sala_ferramentas', 'sala_ferramentas', 'id'),
    ('sala_ferramentas_portal_id_fkey', 'sala_ferramentas', 'conteudo_travessias', 'id'),
    ('sala_ferramentas_sala_id_fkey', 'sala_ferramentas', 'salas', 'id'),
    ('season_books_season_id_fkey', 'season_books', 'oracular_seasons', 'id'),
    ('season_labs_season_id_fkey', 'season_labs', 'oracular_seasons', 'id'),
    ('session_archetypes_archetype_id_fkey', 'session_archetypes', 'atlas_arquetipos_femininos', 'id'),
    ('session_archetypes_client_id_fkey', 'session_archetypes', 'clientes', 'id'),
    ('session_archetypes_session_id_fkey', 'session_archetypes', 'sessions', 'id'),
    ('session_cases_client_id_fkey', 'session_cases', 'clientes', 'id'),
    ('session_cases_therapist_id_fkey', 'session_cases', 'profiles', 'id'),
    ('session_interventions_intervention_id_fkey', 'session_interventions', 'interventions', 'id'),
    ('session_interventions_session_id_fkey', 'session_interventions', 'sessions', 'id'),
    ('session_oracle_draws_case_id_fkey', 'session_oracle_draws', 'session_cases', 'id'),
    ('session_oracle_draws_client_id_fkey', 'session_oracle_draws', 'profiles', 'id'),
    ('session_oracle_draws_therapist_id_fkey', 'session_oracle_draws', 'profiles', 'id'),
    ('session_scripts_case_id_fkey', 'session_scripts', 'session_cases', 'id'),
    ('session_scripts_client_id_fkey', 'session_scripts', 'profiles', 'id'),
    ('session_scripts_narrative_map_id_fkey', 'session_scripts', 'narrative_maps', 'id'),
    ('session_scripts_therapist_id_fkey', 'session_scripts', 'profiles', 'id'),
    ('sessions_cidadela_card_id_fkey', 'sessions', 'cidadela_oracle_cards', 'id'),
    ('sessions_client_id_fkey', 'sessions', 'clientes', 'id'),
    ('sessions_district_id_fkey', 'sessions', 'districts', 'id'),
    ('sessions_tool_id_fkey', 'sessions', 'tools', 'id'),
    ('sessoes_casa_maquinas_cliente_id_fkey', 'sessoes_casa_maquinas', 'clientes', 'id'),
    ('sessoes_labirinto_porta_id_fkey', 'sessoes_labirinto', 'labirinto_fases', 'id')
) as fk(name, table_name, ref_table, ref_columns);
  