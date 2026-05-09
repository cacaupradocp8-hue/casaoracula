-- sync_fks_READY_ONLY_PUBLIC_FAILURE_DIAGNOSTIC_V3_FIXED.sql
-- Script SOMENTE LEITURA de Diagnóstico Completo.
-- Analisa todas as 142 FKs e identifica o status exato de cada uma.
-- Não altera dados nem estrutura de tabelas reais.

SET search_path TO public;

DO $diag$
DECLARE
    v_rec RECORD;
    v_orphan_count BIGINT;
    v_sql TEXT;
BEGIN
    -- 1. Criar tabela temporária para os resultados
    CREATE TEMP TABLE IF NOT EXISTS diag_results (
        fk_name TEXT,
        source_table TEXT,
        source_column TEXT,
        target_table TEXT,
        target_column TEXT,
        status TEXT,
        details TEXT,
        orphan_count BIGINT
    ) ON COMMIT DROP;

    -- 2. Lista de Candidatas (as 142)
    CREATE TEMP TABLE IF NOT EXISTS temp_candidates (
        fk_name TEXT, src_table TEXT, src_col TEXT, tgt_table TEXT, tgt_col TEXT
    ) ON COMMIT DROP;

    INSERT INTO temp_candidates VALUES 
    ('access_expiration_logs_user_id_fkey', 'access_expiration_logs', 'user_id', 'profiles', 'id'),
    ('admin_action_history_user_id_fkey', 'admin_action_history', 'user_id', 'profiles', 'id'),
    ('admin_automation_audit_rule_id_fkey', 'admin_automation_audit', 'rule_id', 'admin_automation_rules', 'id'),
    ('agente_conversas_agente_id_fkey', 'agente_conversas', 'agente_id', 'agentes', 'id'),
    ('agente_mensagens_conversa_id_fkey', 'agente_mensagens', 'conversa_id', 'agente_conversas', 'id'),
    ('ai_interaction_logs_agente_id_fkey', 'ai_interaction_logs', 'agente_id', 'agentes', 'id'),
    ('ai_recommendations_client_id_fkey', 'ai_recommendations', 'client_id', 'clientes', 'id'),
    ('ai_recommendations_distrito_sugerido_id_fkey', 'ai_recommendations', 'distrito_sugerido_id', 'city_districts', 'id'),
    ('ai_recommendations_session_id_fkey', 'ai_recommendations', 'session_id', 'sessions', 'id'),
    ('ai_recommendations_tool_sugerida_id_fkey', 'ai_recommendations', 'tool_sugerida_id', 'tools', 'id'),
    ('archetypal_profile_snapshots_client_id_fkey', 'archetypal_profile_snapshots', 'client_id', 'clientes', 'id'),
    ('archetype_tools_archetype_id_fkey', 'archetype_tools', 'archetype_id', 'founding_archetypes', 'id'),
    ('archetype_tools_tool_id_fkey', 'archetype_tools', 'tool_id', 'tools', 'id'),
    ('atelie_conteudos_template_id_fkey', 'atelie_conteudos', 'template_id', 'atelie_templates', 'id'),
    ('atlas_arquetipos_registros_client_id_fkey', 'atlas_arquetipos_registros', 'client_id', 'clientes', 'id'),
    ('aulas_portal_id_fkey', 'aulas', 'portal_id', 'portais', 'id'),
    ('biblioteca_casos_porta_id_fkey', 'biblioteca_casos', 'porta_id', 'labirinto_portas', 'id'),
    ('big5_funcional_perguntas_dimensao_id_fkey', 'big5_funcional_perguntas', 'dimensao_id', 'big5_funcional_dimensoes', 'id'),
    ('big5_oracular_perguntas_fator_id_fkey', 'big5_oracular_perguntas', 'fator_id', 'big5_oracular_fatores', 'id'),
    ('big5_porta_mapeamento_ritual_id_fkey', 'big5_porta_mapeamento', 'ritual_id', 'rituais_simbolicos', 'id'),
    ('big5_ritual_registros_big5_registro_id_fkey', 'big5_ritual_registros', 'big5_registro_id', 'big5_oracular_registros', 'id'),
    ('big5_ritual_registros_ritual_id_fkey', 'big5_ritual_registros', 'ritual_id', 'rituais_simbolicos', 'id'),
    ('big5_symbolic_afirmacoes_force_id_fkey', 'big5_symbolic_afirmacoes', 'force_id', 'big5_symbolic_forces', 'id'),
    ('big5_symbolic_registros_session_case_id_fkey', 'big5_symbolic_registros', 'session_case_id', 'session_cases', 'id'),
    ('book_links_from_book_id_fkey', 'book_links', 'from_book_id', 'books', 'id'),
    ('book_links_to_book_id_fkey', 'book_links', 'to_book_id', 'books', 'id'),
    ('book_media_station_id_fkey', 'book_media', 'station_id', 'clube_estacoes', 'id'),
    ('book_tours_book_id_fkey', 'book_tours', 'book_id', 'books', 'id'),
    ('canteiro_reactions_entry_id_fkey', 'canteiro_reactions', 'entry_id', 'collective_bed_entries', 'id'),
    ('cartografia_complexos_client_id_fkey', 'cartografia_complexos', 'client_id', 'clientes', 'id'),
    ('cartografia_psiquica_client_id_fkey', 'cartografia_psiquica', 'client_id', 'clientes', 'id'),
    ('cartographer_engine_client_id_fkey', 'cartographer_engine', 'client_id', 'clientes', 'id'),
    ('cartographer_engine_session_id_fkey', 'cartographer_engine', 'session_id', 'sessions', 'id'),
    ('cartographer_recommendations_engine_id_fkey', 'cartographer_recommendations', 'engine_id', 'cartographer_engine', 'id'),
    ('cartographer_recommendations_ferramenta_escolhida_id_fkey', 'cartographer_recommendations', 'ferramenta_escolhida_id', 'tools', 'id'),
    ('cartographer_recommendations_tool_complementar_id_fkey', 'cartographer_recommendations', 'tool_complementar_id', 'tools', 'id'),
    ('cartographer_recommendations_tool_principal_id_fkey', 'cartographer_recommendations', 'tool_principal_id', 'tools', 'id'),
    ('cartographies_client_id_fkey', 'cartographies', 'client_id', 'clientes', 'id'),
    ('cartographies_session_id_fkey', 'cartographies', 'session_id', 'sessions', 'id'),
    ('casa_circulo_replies_thread_id_fkey', 'casa_circulo_replies', 'thread_id', 'casa_circulo_threads', 'id'),
    ('cidadela_oracle_cards_district_id_fkey', 'cidadela_oracle_cards', 'district_id', 'districts', 'id'),
    ('cidadela_oracle_cards_suggested_tool_id_fkey', 'cidadela_oracle_cards', 'suggested_tool_id', 'tools', 'id'),
    ('cidadela_oracle_usage_card_id_fkey', 'cidadela_oracle_usage', 'card_id', 'cidadela_oracle_cards', 'id'),
    ('cidadela_oracle_usage_client_id_fkey', 'cidadela_oracle_usage', 'client_id', 'clientes', 'id'),
    ('client_archetype_state_arquitipo_evolucao_id_fkey', 'client_archetype_state', 'arquitipo_evolucao_id', 'founding_archetypes', 'id'),
    ('client_archetype_state_arquitipo_regente_id_fkey', 'client_archetype_state', 'arquitipo_regente_id', 'founding_archetypes', 'id'),
    ('client_archetype_state_arquitipo_sombra_id_fkey', 'client_archetype_state', 'arquitipo_sombra_id', 'founding_archetypes', 'id'),
    ('client_archetype_state_client_id_fkey', 'client_archetype_state', 'client_id', 'clientes', 'id'),
    ('client_cidadela_map_client_id_fkey', 'client_cidadela_map', 'client_id', 'clientes', 'id'),
    ('client_city_state_arquetipo_ativo_fkey', 'client_city_state', 'arquetipo_ativo', 'founding_archetypes', 'id'),
    ('client_city_state_client_id_fkey', 'client_city_state', 'client_id', 'clientes', 'id'),
    ('client_city_state_distrito_id_fkey', 'client_city_state', 'distrito_id', 'city_districts', 'id'),
    ('client_city_state_ultima_ferramenta_id_fkey', 'client_city_state', 'ultima_ferramenta_id', 'tools', 'id'),
    ('client_city_state_ultima_sessao_id_fkey', 'client_city_state', 'ultima_sessao_id', 'sessions', 'id'),
    ('client_labyrinths_client_id_fkey', 'client_labyrinths', 'client_id', 'clientes', 'id'),
    ('client_live_map_entries_session_id_fkey', 'client_live_map_entries', 'session_id', 'sessions', 'id'),
    ('client_pattern_stats_client_id_fkey', 'client_pattern_stats', 'client_id', 'clientes', 'id'),
    ('client_seasons_client_id_fkey', 'client_seasons', 'client_id', 'clientes', 'id'),
    ('clube_audio_albums_estacao_id_fkey', 'clube_audio_albums', 'estacao_id', 'clube_estacoes', 'id'),
    ('clube_audio_progress_track_id_fkey', 'clube_audio_progress', 'track_id', 'clube_audio_tracks', 'id'),
    ('clube_audio_tracks_album_id_fkey', 'clube_audio_tracks', 'album_id', 'clube_audio_albums', 'id'),
    ('clube_carrossel_slides_estacao_id_fkey', 'clube_carrossel_slides', 'estacao_id', 'oracular_seasons', 'id'),
    ('clube_engajamento_estacao_id_fkey', 'clube_engajamento', 'estacao_id', 'clube_estacoes', 'id'),
    ('clube_estacao_registros_estacao_id_fkey', 'clube_estacao_registros', 'estacao_id', 'clube_estacoes', 'id'),
    ('clube_estacoes_cartografia_id_fkey', 'clube_estacoes', 'cartografia_id', 'cartographies', 'id'),
    ('clube_estacoes_quiz_id_fkey', 'clube_estacoes', 'quiz_id', 'quizzes', 'id'),
    ('clube_jornadas_estacao_id_fkey', 'clube_jornadas', 'estacao_id', 'clube_estacoes', 'id'),
    ('clube_livro_aulas_porta_id_fkey', 'clube_livro_aulas', 'porta_id', 'clube_livro_portas', 'id'),
    ('clube_livro_chat_interactions_book_id_fkey', 'clube_livro_chat_interactions', 'book_id', 'books', 'id'),
    ('clube_livro_encontros_estacao_id_fkey', 'clube_livro_encontros', 'estacao_id', 'clube_estacoes', 'id'),
    ('clube_livro_respostas_pergunta_id_fkey', 'clube_livro_respostas', 'pergunta_id', 'clube_livro_perguntas', 'id'),
    ('clube_obras_essencia_8020_book_id_fkey', 'clube_obras_essencia_8020', 'book_id', 'books', 'id'),
    ('clube_portais_jornada_id_fkey', 'clube_portais', 'jornada_id', 'clube_jornadas', 'id'),
    ('clube_portal_audios_portal_id_fkey', 'clube_portal_audios', 'portal_id', 'clube_portais', 'id'),
    ('clube_portal_insights_estacao_id_fkey', 'clube_portal_insights', 'estacao_id', 'oracular_seasons', 'id'),
    ('clube_portal_materiais_portal_id_fkey', 'clube_portal_materiais', 'portal_id', 'clube_portais', 'id'),
    ('clube_progresso_passos_passo_id_fkey', 'clube_progresso_passos', 'passo_id', 'clube_rota_itens', 'id'),
    ('clube_reflexoes_estacao_id_fkey', 'clube_reflexoes', 'estacao_id', 'clube_estacoes', 'id'),
    ('clube_rota_itens_estacao_id_fkey', 'clube_rota_itens', 'estacao_id', 'clube_estacoes', 'id'),
    ('clube_rota_progresso_estacao_id_fkey', 'clube_rota_progresso', 'estacao_id', 'clube_estacoes', 'id'),
    ('clube_rota_progresso_rota_item_id_fkey', 'clube_rota_progresso', 'rota_item_id', 'clube_rota_itens', 'id'),
    ('clube_v3_station_audios_station_id_fkey', 'clube_v3_station_audios', 'station_id', 'clube_v3_stations', 'id'),
    ('clube_v3_station_content_station_id_fkey', 'clube_v3_station_content', 'station_id', 'clube_v3_stations', 'id'),
    ('clube_v3_stations_route_id_fkey', 'clube_v3_stations', 'route_id', 'clube_v3_routes', 'id'),
    ('clube_v3_user_progress_station_id_fkey', 'clube_v3_user_progress', 'station_id', 'clube_v3_stations', 'id'),
    ('co_ai_recommendations_client_id_fkey', 'co_ai_recommendations', 'client_id', 'clientes', 'id'),
    ('co_ai_recommendations_tool_complementar_id_fkey', 'co_ai_recommendations', 'tool_complementar_id', 'sala_ferramentas', 'id'),
    ('co_ai_recommendations_tool_sugerida_id_fkey', 'co_ai_recommendations', 'tool_sugerida_id', 'sala_ferramentas', 'id'),
    ('co_appointments_client_id_fkey', 'co_appointments', 'client_id', 'clientes', 'id'),
    ('co_appointments_workspace_id_fkey', 'co_appointments', 'workspace_id', 'co_workspaces', 'id'),
    ('co_camara_sussurro_casos_proximo_treino_id_fkey', 'co_camara_sussurro_casos', 'proximo_treino_id', 'co_camara_sussurro_casos', 'id'),
    ('co_city_history_client_id_fkey', 'co_city_history', 'client_id', 'clientes', 'id'),
    ('co_city_history_tool_id_fkey', 'co_city_history', 'tool_id', 'sala_ferramentas', 'id'),
    ('co_client_profile_client_id_fkey', 'co_client_profile', 'client_id', 'clientes', 'id'),
    ('co_client_profiles_client_id_fkey', 'co_client_profiles', 'client_id', 'clientes', 'id'),
    ('co_convites_cliente_id_fkey', 'co_convites', 'cliente_id', 'clientes', 'id'),
    ('co_escutas_sessao_id_fkey', 'co_escutas', 'sessao_id', 'co_sessoes', 'id'),
    ('co_garden_flowers_client_id_fkey', 'co_garden_flowers', 'client_id', 'clientes', 'id'),
    ('co_garden_flowers_origem_registro_id_fkey', 'co_garden_flowers', 'origem_registro_id', 'co_journey_records', 'id'),
    ('co_jardim_entries_jardim_id_fkey', 'co_jardim_entries', 'jardim_id', 'co_jardins', 'id'),
    ('co_journey_records_client_id_fkey', 'co_journey_records', 'client_id', 'clientes', 'id'),
    ('co_journey_records_tool_id_fkey', 'co_journey_records', 'tool_id', 'sala_ferramentas', 'id'),
    ('co_orientacao_sugestoes_ia_cliente_id_fkey', 'co_orientacao_sugestoes_ia', 'cliente_id', 'clientes', 'id'),
    ('co_orientacao_sugestoes_ia_orientacao_id_fkey', 'co_orientacao_sugestoes_ia', 'orientacao_id', 'co_orientacoes', 'id'),
    ('co_orientacao_sugestoes_ia_session_id_fkey', 'co_orientacao_sugestoes_ia', 'session_id', 'sessions', 'id'),
    ('co_orientacoes_cliente_id_fkey', 'co_orientacoes', 'cliente_id', 'clientes', 'id'),
    ('co_orientacoes_session_id_fkey', 'co_orientacoes', 'session_id', 'sessions', 'id'),
    ('co_passport_entries_client_id_fkey', 'co_passport_entries', 'client_id', 'clientes', 'id'),
    ('co_praticas_sessao_id_fkey', 'co_praticas', 'sessao_id', 'co_sessoes', 'id'),
    ('co_registros_simbolicos_jardim_id_fkey', 'co_registros_simbolicos', 'jardim_id', 'co_jardins', 'id'),
    ('co_registros_simbolicos_sessao_id_fkey', 'co_registros_simbolicos', 'sessao_id', 'co_sessoes', 'id'),
    ('co_sessoes_jardim_ref_id_fkey', 'co_sessoes', 'jardim_ref_id', 'co_jardins', 'id'),
    ('co_sim_options_proximo_step_id_fkey', 'co_sim_options', 'proximo_step_id', 'co_sim_steps', 'id'),
    ('co_sim_options_step_id_fkey', 'co_sim_options', 'step_id', 'co_sim_steps', 'id'),
    ('co_sim_progress_case_id_fkey', 'co_sim_progress', 'case_id', 'co_sim_cases', 'id'),
    ('co_sim_progress_escolha_id_fkey', 'co_sim_progress', 'escolha_id', 'co_sim_options', 'id'),
    ('co_sim_progress_step_id_fkey', 'co_sim_progress', 'step_id', 'co_sim_steps', 'id'),
    ('co_sim_steps_case_id_fkey', 'co_sim_steps', 'case_id', 'co_sim_cases', 'id'),
    ('co_tool_flows_tool_destino_id_fkey', 'co_tool_flows', 'tool_destino_id', 'tools', 'id'),
    ('co_tool_flows_tool_origem_id_fkey', 'co_tool_flows', 'tool_origem_id', 'tools', 'id'),
    ('co_tool_usage_tool_id_fkey', 'co_tool_usage', 'tool_id', 'sala_ferramentas', 'id'),
    ('co_training_attempts_case_id_fkey', 'co_training_attempts', 'case_id', 'co_training_cases', 'id'),
    ('co_training_case_feedbacks_case_id_fkey', 'co_training_case_feedbacks', 'case_id', 'co_training_cases', 'id'),
    ('co_training_case_possible_readings_case_id_fkey', 'co_training_case_possible_readings', 'case_id', 'co_training_cases', 'id'),
    ('co_training_case_signals_case_id_fkey', 'co_training_case_signals', 'case_id', 'co_training_cases', 'id'),
    ('co_training_progress_ultimo_case_id_fkey', 'co_training_progress', 'ultimo_case_id', 'co_training_cases', 'id'),
    ('co_travessia_encontros_travessia_id_fkey', 'co_travessia_encontros', 'travessia_id', 'co_travessias', 'id'),
    ('co_travessia_respostas_encontro_id_fkey', 'co_travessia_respostas', 'encontro_id', 'co_travessia_encontros', 'id'),
    ('co_travessia_respostas_travessia_id_fkey', 'co_travessia_respostas', 'travessia_id', 'co_travessias', 'id'),
    ('co_workspace_users_workspace_id_fkey', 'co_workspace_users', 'workspace_id', 'co_workspaces', 'id'),
    ('collective_bed_entries_bed_id_fkey', 'collective_bed_entries', 'bed_id', 'collective_beds', 'id'),
    ('collective_bed_entries_season_id_fkey', 'collective_bed_entries', 'season_id', 'oracular_seasons', 'id'),
    ('collective_beds_season_id_fkey', 'collective_beds', 'season_id', 'oracular_seasons', 'id'),
    ('community_comments_post_id_fkey', 'community_comments', 'post_id', 'community_posts', 'id'),
    ('community_event_participants_event_id_fkey', 'community_event_participants', 'event_id', 'community_events', 'id'),
    ('community_group_members_group_id_fkey', 'community_group_members', 'group_id', 'community_groups', 'id'),
    ('community_likes_post_id_fkey', 'community_likes', 'post_id', 'community_posts', 'id'),
    ('community_topic_replies_topic_id_fkey', 'community_topic_replies', 'topic_id', 'community_topics', 'id'),
    ('community_topics_forum_id_fkey', 'community_topics', 'forum_id', 'community_forums', 'id'),
    ('conselho_partes_internas_client_id_fkey', 'conselho_partes_internas', 'client_id', 'clientes', 'id'),
    ('content_blocks_agente_id_fkey', 'content_blocks', 'agente_id', 'agentes', 'id'),
    ('conteudo_aulas_travessia_id_fkey', 'conteudo_aulas', 'travessia_id', 'conteudo_travessias', 'id');

    -- 3. Loop de Diagnóstico
    FOR v_rec IN (SELECT * FROM temp_candidates) LOOP
        DECLARE
            v_src_col_exists BOOLEAN;
            v_tgt_col_exists BOOLEAN;
            v_tgt_unique BOOLEAN;
            v_exists_name BOOLEAN;
            v_exists_struct BOOLEAN;
            v_src_udt TEXT;
            v_tgt_udt TEXT;
            v_status TEXT;
            v_details TEXT;
        BEGIN
            v_orphan_count := 0;

            -- Check name existence
            SELECT EXISTS (
                SELECT 1 FROM pg_constraint pc 
                JOIN pg_namespace n ON n.oid = pc.connamespace 
                WHERE pc.conname = v_rec.fk_name AND n.nspname = 'public'
            ) INTO v_exists_name;

            -- Check structural existence (diff name)
            SELECT EXISTS (
                SELECT 1 FROM pg_constraint pc
                JOIN pg_namespace n ON n.oid = pc.connamespace
                JOIN pg_class cs ON cs.oid = pc.conrelid
                JOIN pg_class ct ON ct.oid = pc.confrelid
                JOIN pg_attribute sa ON sa.attrelid = pc.conrelid AND sa.attnum = pc.conkey[1]
                JOIN pg_attribute ta ON ta.attrelid = pc.confrelid AND ta.attnum = pc.confkey[1]
                WHERE pc.contype = 'f' AND n.nspname = 'public'
                  AND cs.relname = v_rec.src_table AND ct.relname = v_rec.tgt_table
                  AND sa.attname = v_rec.src_col AND ta.attname = v_rec.tgt_col
                  AND array_length(pc.conkey, 1) = 1
            ) INTO v_exists_struct;

            -- Check columns
            SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name=v_rec.src_table AND column_name=v_rec.src_col) INTO v_src_col_exists;
            SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name=v_rec.tgt_table AND column_name=v_rec.tgt_col) INTO v_tgt_col_exists;

            IF v_exists_name THEN
                v_status := 'ALREADY_EXISTS_NAME';
                v_details := 'FK com este nome já existe.';
            ELSIF v_exists_struct THEN
                v_status := 'ALREADY_EXISTS_STRUCTURAL';
                v_details := 'Já existe FK idêntica com outro nome.';
            ELSIF NOT v_src_col_exists THEN
                v_status := 'SOURCE_COLUMN_MISSING';
                v_details := 'Coluna source ' || v_rec.src_col || ' não encontrada.';
            ELSIF NOT v_tgt_col_exists THEN
                v_status := 'TARGET_COLUMN_MISSING';
                v_details := 'Coluna target ' || v_rec.tgt_col || ' não encontrada.';
            ELSE
                -- Check types
                SELECT udt_name INTO v_src_udt FROM information_schema.columns WHERE table_schema='public' AND table_name=v_rec.src_table AND column_name=v_rec.src_col;
                SELECT udt_name INTO v_tgt_udt FROM information_schema.columns WHERE table_schema='public' AND table_name=v_rec.tgt_table AND column_name=v_rec.tgt_col;
                
                IF COALESCE(v_src_udt,'') <> COALESCE(v_tgt_udt,'') THEN
                    v_status := 'TYPE_MISMATCH';
                    v_details := 'Tipos divergem: ' || COALESCE(v_src_udt,'null') || ' vs ' || COALESCE(v_tgt_udt,'null');
                ELSE
                    -- Check target unique
                    SELECT EXISTS (
                        SELECT 1 FROM pg_index i
                        JOIN pg_class c ON c.oid = i.indrelid
                        JOIN pg_namespace n ON n.oid = c.relnamespace
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE n.nspname='public' AND c.relname=v_rec.tgt_table AND a.attname=v_rec.tgt_col
                        AND (i.indisprimary OR i.indisunique) AND i.indnatts = 1
                    ) INTO v_tgt_unique;

                    IF NOT v_tgt_unique THEN
                        v_status := 'TARGET_NOT_UNIQUE';
                        v_details := 'Coluna target não possui PK/UNIQUE.';
                    ELSE
                        -- Check for orphans
                        v_sql := format('SELECT count(*) FROM public.%I s LEFT JOIN public.%I t ON s.%I = t.%I WHERE s.%I IS NOT NULL AND t.%I IS NULL',
                                        v_rec.src_table, v_rec.tgt_table, v_rec.src_col, v_rec.tgt_col, v_rec.src_col, v_rec.tgt_col);
                        EXECUTE v_sql INTO v_orphan_count;
                        
                        IF v_orphan_count > 0 THEN
                            v_status := 'ORPHANS_FOUND';
                            v_details := 'Encontrados ' || v_orphan_count || ' registros órfãos.';
                        ELSE
                            v_status := 'READY';
                            v_details := 'Pronta para criação.';
                        END IF;
                    END IF;
                END IF;
            END IF;

            INSERT INTO diag_results VALUES (v_rec.fk_name, v_rec.src_table, v_rec.src_col, v_rec.tgt_table, v_rec.tgt_col, v_status, v_details, v_orphan_count);
        END;
    END LOOP;
END $diag$;

-- Mostrar Resultados
SELECT status, count(*) FROM diag_results GROUP BY status ORDER BY status;

SELECT * FROM diag_results ORDER BY status, fk_name;
