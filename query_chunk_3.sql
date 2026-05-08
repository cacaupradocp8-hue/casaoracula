
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
    ('course_exercise_responses_lesson_id_fkey', 'course_exercise_responses', 'course_lessons', 'id'),
    ('course_lesson_progress_lesson_id_fkey', 'course_lesson_progress', 'course_lessons', 'id'),
    ('course_lessons_module_id_fkey', 'course_lessons', 'course_modules', 'id'),
    ('course_module_forum_posts_module_id_fkey', 'course_module_forum_posts', 'course_modules', 'id'),
    ('course_module_forum_posts_parent_id_fkey', 'course_module_forum_posts', 'course_module_forum_posts', 'id'),
    ('course_modules_course_id_fkey', 'course_modules', 'courses', 'id'),
    ('course_work_submissions_course_id_fkey', 'course_work_submissions', 'courses', 'id'),
    ('courses_sala_id_fkey', 'courses', 'salas', 'id'),
    ('custom_oracle_cards_custom_oracle_id_fkey', 'custom_oracle_cards', 'custom_oracles', 'id'),
    ('cycle_books_book_id_fkey', 'cycle_books', 'books', 'id'),
    ('cycle_books_cycle_id_fkey', 'cycle_books', 'cycles', 'id'),
    ('decodificacao_onirica_cliente_id_fkey', 'decodificacao_onirica', 'clientes', 'id'),
    ('decodificacao_onirica_session_case_id_fkey', 'decodificacao_onirica', 'session_cases', 'id'),
    ('diagnostico_ego_cliente_id_fkey', 'diagnostico_ego', 'clientes', 'id'),
    ('district_state_changes_client_id_fkey', 'district_state_changes', 'clientes', 'id'),
    ('district_state_changes_district_id_fkey', 'district_state_changes', 'districts', 'id'),
    ('dreams_client_id_fkey', 'dreams', 'clientes', 'id'),
    ('dreams_session_id_fkey', 'dreams', 'sessions', 'id'),
    ('email_logs_user_id_fkey', 'email_logs', 'profiles', 'id'),
    ('eneagrama_feminino_afirmacoes_arquetipo_id_fkey', 'eneagrama_feminino_afirmacoes', 'eneagrama_feminino_arquetipos', 'id'),
    ('eneagrama_feminino_orientacoes_arquetipo_id_fkey', 'eneagrama_feminino_orientacoes', 'eneagrama_feminino_arquetipos', 'id'),
    ('eneagrama_feminino_registros_session_case_id_fkey', 'eneagrama_feminino_registros', 'session_cases', 'id'),
    ('escrita_nao_censurada_cliente_id_fkey', 'escrita_nao_censurada', 'clientes', 'id'),
    ('estudio_projetos_book_id_fkey', 'estudio_projetos', 'books', 'id'),
    ('estudos_caso_respostas_estudo_caso_id_fkey', 'estudos_caso_respostas', 'estudos_caso', 'id'),
    ('exercise_responses_exercise_id_fkey', 'exercise_responses', 'exercises', 'id'),
    ('exercises_lesson_id_fkey', 'exercises', 'lessons', 'id'),
    ('ferramenta_registros_cliente_id_fkey', 'ferramenta_registros', 'clientes', 'id'),
    ('ferramenta_registros_ferramenta_id_fkey', 'ferramenta_registros', 'sala_ferramentas', 'id'),
    ('fk_big5_caso', 'big5_registros', 'casos', 'id'),
    ('fk_eneagrama_caso', 'eneagrama_registros', 'casos', 'id'),
    ('formacao_modulos_formacao_id_fkey', 'formacao_modulos', 'formacoes', 'id'),
    ('founding_archetypes_distrito_principal_id_fkey', 'founding_archetypes', 'city_districts', 'id'),
    ('gestos_integracao_cliente_id_fkey', 'gestos_integracao', 'clientes', 'id'),
    ('gestos_integracao_sessao_id_fkey', 'gestos_integracao', 'sessoes_casa_maquinas', 'id'),
    ('group_encounters_group_id_fkey', 'group_encounters', 'therapy_groups', 'id'),
    ('group_field_snapshots_circulo_id_fkey', 'group_field_snapshots', 'circulos_sagrados', 'id'),
    ('group_field_snapshots_group_id_fkey', 'group_field_snapshots', 'therapeutic_groups', 'id'),
    ('group_members_client_id_fkey', 'group_members', 'clientes', 'id'),
    ('group_members_group_id_fkey', 'group_members', 'therapy_groups', 'id'),
    ('group_participants_cliente_id_fkey', 'group_participants', 'clientes', 'id'),
    ('group_participants_group_id_fkey', 'group_participants', 'therapeutic_groups', 'id'),
    ('group_sessions_group_id_fkey', 'group_sessions', 'therapeutic_groups', 'id'),
    ('heroina_arquetipo_registros_arquetipo_id_fkey', 'heroina_arquetipo_registros', 'labirinto_arquetipos', 'id'),
    ('heroina_cenario_registros_metafora_id_fkey', 'heroina_cenario_registros', 'labirinto_metaforas', 'id'),
    ('heroina_fase_ativa_fase_id_fkey', 'heroina_fase_ativa', 'labirinto_fases', 'id'),
    ('heroina_ritual_registros_ritual_id_fkey', 'heroina_ritual_registros', 'labirinto_rituais', 'id'),
    ('imaginacao_ativa_cliente_id_fkey', 'imaginacao_ativa', 'clientes', 'id'),
    ('intervention_favorites_intervention_id_fkey', 'intervention_favorites', 'interventions', 'id'),
    ('interventions_district_id_fkey', 'interventions', 'districts', 'id')
) as fk(name, table_name, ref_table, ref_columns);
  