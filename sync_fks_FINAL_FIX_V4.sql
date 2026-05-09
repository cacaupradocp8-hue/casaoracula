-- =====================================================================
-- sync_fks_FINAL_FIX_V4.sql
-- Script final de correção em 2 etapas:
--   ETAPA 1: Adiciona PRIMARY KEY na coluna `id` das tabelas alvo que
--            não a possuem (causa raiz do TARGET_NOT_UNIQUE).
--   ETAPA 2: Cria todas as FKs READY + as que estavam TARGET_NOT_UNIQUE
--            (agora destravadas).
--
-- Idempotente: pode ser executado múltiplas vezes sem efeitos colaterais.
-- Cada FK é criada com NOT VALID + VALIDATE; em caso de falha (órfãos),
-- a constraint é removida automaticamente.
-- =====================================================================

SET search_path TO public;

-- =====================================================================
-- ETAPA 1: Adicionar PRIMARY KEY em tabelas alvo sem PK/UNIQUE em `id`
-- =====================================================================
DO $pk_fix$
DECLARE
    v_tables TEXT[] := ARRAY[
        'big5_funcional_dimensoes',
        'big5_oracular_fatores',
        'rituais_simbolicos',
        'big5_oracular_registros',
        'big5_symbolic_forces',
        'collective_bed_entries',
        'cartographer_engine',
        'casa_circulo_threads',
        'cartographies',
        'collective_beds',
        'community_posts',
        'community_events',
        'community_groups',
        'community_topics',
        'community_forums'
    ];
    v_table TEXT;
    v_pk_added INT := 0;
    v_pk_skipped INT := 0;
BEGIN
    FOREACH v_table IN ARRAY v_tables LOOP
        -- Verifica se a tabela existe
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name = v_table
        ) THEN
            RAISE NOTICE '[PK-FIX] Tabela % não existe. Pulando.', v_table;
            CONTINUE;
        END IF;

        -- Verifica se a coluna id existe
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = v_table AND column_name = 'id'
        ) THEN
            RAISE NOTICE '[PK-FIX] Tabela %.id não existe. Pulando.', v_table;
            CONTINUE;
        END IF;

        -- Verifica se já tem PK ou UNIQUE em id
        IF EXISTS (
            SELECT 1 FROM pg_index i
            JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
            JOIN pg_class c ON c.oid = i.indrelid
            JOIN pg_namespace n ON n.oid = c.relnamespace
            WHERE n.nspname = 'public'
              AND c.relname = v_table
              AND a.attname = 'id'
              AND (i.indisprimary OR i.indisunique)
              AND i.indnatts = 1
        ) THEN
            v_pk_skipped := v_pk_skipped + 1;
            CONTINUE;
        END IF;

        -- Adiciona PRIMARY KEY
        BEGIN
            EXECUTE format('ALTER TABLE public.%I ADD CONSTRAINT %I PRIMARY KEY (id)',
                v_table, v_table || '_pkey');
            v_pk_added := v_pk_added + 1;
            RAISE NOTICE '[PK-FIX] PRIMARY KEY adicionada em %.id', v_table;
        EXCEPTION WHEN OTHERS THEN
            -- Se falhar (ex: id duplicado ou nulo), tenta UNIQUE como fallback
            BEGIN
                EXECUTE format('ALTER TABLE public.%I ADD CONSTRAINT %I UNIQUE (id)',
                    v_table, v_table || '_id_key');
                v_pk_added := v_pk_added + 1;
                RAISE NOTICE '[PK-FIX] UNIQUE (fallback) adicionado em %.id', v_table;
            EXCEPTION WHEN OTHERS THEN
                RAISE WARNING '[PK-FIX] FALHA em %: %. Verifique duplicatas/NULLs em id.', v_table, SQLERRM;
            END;
        END;
    END LOOP;

    RAISE NOTICE '[PK-FIX] Resumo: % adicionadas, % já existiam.', v_pk_added, v_pk_skipped;
END $pk_fix$;


-- =====================================================================
-- ETAPA 2: Criar todas as FKs (READY + destravadas pela Etapa 1)
-- =====================================================================
DO $fk_create$
DECLARE
    v_added INT := 0;
    v_skipped_exists INT := 0;
    v_skipped_not_ready INT := 0;
    v_failed INT := 0;
    v_rec RECORD;

    -- Lista de FKs a criar (READY + TARGET_NOT_UNIQUE do diagnóstico V3)
    v_fks TEXT[][] := ARRAY[
        -- READY (do diagnóstico)
        ARRAY['ai_recommendations_distrito_sugerido_id_fkey','ai_recommendations','distrito_sugerido_id','city_districts','id'],
        ARRAY['ai_recommendations_session_id_fkey','ai_recommendations','session_id','sessions','id'],
        ARRAY['ai_recommendations_tool_sugerida_id_fkey','ai_recommendations','tool_sugerida_id','tools','id'],
        ARRAY['archetypal_profile_snapshots_client_id_fkey','archetypal_profile_snapshots','client_id','clientes','id'],
        ARRAY['archetype_tools_archetype_id_fkey','archetype_tools','archetype_id','founding_archetypes','id'],
        ARRAY['archetype_tools_tool_id_fkey','archetype_tools','tool_id','tools','id'],
        ARRAY['big5_symbolic_registros_session_case_id_fkey','big5_symbolic_registros','session_case_id','session_cases','id'],
        ARRAY['cartografia_complexos_client_id_fkey','cartografia_complexos','client_id','clientes','id'],
        ARRAY['cartografia_psiquica_client_id_fkey','cartografia_psiquica','client_id','clientes','id'],
        ARRAY['cartographer_engine_client_id_fkey','cartographer_engine','client_id','clientes','id'],
        ARRAY['cartographer_engine_session_id_fkey','cartographer_engine','session_id','sessions','id'],
        ARRAY['cartographer_recommendations_ferramenta_escolhida_id_fkey','cartographer_recommendations','ferramenta_escolhida_id','tools','id'],
        ARRAY['cartographer_recommendations_tool_complementar_id_fkey','cartographer_recommendations','tool_complementar_id','tools','id'],
        ARRAY['cartographer_recommendations_tool_principal_id_fkey','cartographer_recommendations','tool_principal_id','tools','id'],
        ARRAY['cartographies_client_id_fkey','cartographies','client_id','clientes','id'],
        ARRAY['cartographies_session_id_fkey','cartographies','session_id','sessions','id'],
        ARRAY['cidadela_oracle_cards_district_id_fkey','cidadela_oracle_cards','district_id','districts','id'],
        ARRAY['cidadela_oracle_cards_suggested_tool_id_fkey','cidadela_oracle_cards','suggested_tool_id','tools','id'],
        ARRAY['client_archetype_state_arquitipo_evolucao_id_fkey','client_archetype_state','arquitipo_evolucao_id','founding_archetypes','id'],
        ARRAY['client_archetype_state_arquitipo_regente_id_fkey','client_archetype_state','arquitipo_regente_id','founding_archetypes','id'],
        ARRAY['client_archetype_state_arquitipo_sombra_id_fkey','client_archetype_state','arquitipo_sombra_id','founding_archetypes','id'],
        ARRAY['client_archetype_state_client_id_fkey','client_archetype_state','client_id','clientes','id'],
        ARRAY['client_cidadela_map_client_id_fkey','client_cidadela_map','client_id','clientes','id'],
        ARRAY['client_city_state_arquetipo_ativo_fkey','client_city_state','arquetipo_ativo','founding_archetypes','id'],
        ARRAY['client_city_state_client_id_fkey','client_city_state','client_id','clientes','id'],
        ARRAY['client_city_state_distrito_id_fkey','client_city_state','distrito_id','city_districts','id'],
        ARRAY['client_city_state_ultima_ferramenta_id_fkey','client_city_state','ultima_ferramenta_id','tools','id'],
        ARRAY['client_city_state_ultima_sessao_id_fkey','client_city_state','ultima_sessao_id','sessions','id'],
        ARRAY['client_live_map_entries_session_id_fkey','client_live_map_entries','session_id','sessions','id'],
        ARRAY['client_pattern_stats_client_id_fkey','client_pattern_stats','client_id','clientes','id'],
        ARRAY['client_seasons_client_id_fkey','client_seasons','client_id','clientes','id'],
        ARRAY['clube_carrossel_slides_estacao_id_fkey','clube_carrossel_slides','estacao_id','oracular_seasons','id'],
        ARRAY['clube_portal_insights_estacao_id_fkey','clube_portal_insights','estacao_id','oracular_seasons','id'],
        ARRAY['co_orientacao_sugestoes_ia_session_id_fkey','co_orientacao_sugestoes_ia','session_id','sessions','id'],
        ARRAY['co_orientacoes_session_id_fkey','co_orientacoes','session_id','sessions','id'],
        ARRAY['co_tool_flows_tool_destino_id_fkey','co_tool_flows','tool_destino_id','tools','id'],
        ARRAY['co_tool_flows_tool_origem_id_fkey','co_tool_flows','tool_origem_id','tools','id'],
        ARRAY['collective_bed_entries_season_id_fkey','collective_bed_entries','season_id','oracular_seasons','id'],
        ARRAY['collective_beds_season_id_fkey','collective_beds','season_id','oracular_seasons','id'],
        ARRAY['conselho_partes_internas_client_id_fkey','conselho_partes_internas','client_id','clientes','id'],
        -- TARGET_NOT_UNIQUE (agora destravadas pela Etapa 1)
        ARRAY['big5_funcional_perguntas_dimensao_id_fkey','big5_funcional_perguntas','dimensao_id','big5_funcional_dimensoes','id'],
        ARRAY['big5_oracular_perguntas_fator_id_fkey','big5_oracular_perguntas','fator_id','big5_oracular_fatores','id'],
        ARRAY['big5_porta_mapeamento_ritual_id_fkey','big5_porta_mapeamento','ritual_id','rituais_simbolicos','id'],
        ARRAY['big5_ritual_registros_big5_registro_id_fkey','big5_ritual_registros','big5_registro_id','big5_oracular_registros','id'],
        ARRAY['big5_ritual_registros_ritual_id_fkey','big5_ritual_registros','ritual_id','rituais_simbolicos','id'],
        ARRAY['big5_symbolic_afirmacoes_force_id_fkey','big5_symbolic_afirmacoes','force_id','big5_symbolic_forces','id'],
        ARRAY['canteiro_reactions_entry_id_fkey','canteiro_reactions','entry_id','collective_bed_entries','id'],
        ARRAY['cartographer_recommendations_engine_id_fkey','cartographer_recommendations','engine_id','cartographer_engine','id'],
        ARRAY['casa_circulo_replies_thread_id_fkey','casa_circulo_replies','thread_id','casa_circulo_threads','id'],
        ARRAY['clube_estacoes_cartografia_id_fkey','clube_estacoes','cartografia_id','cartographies','id'],
        ARRAY['collective_bed_entries_bed_id_fkey','collective_bed_entries','bed_id','collective_beds','id'],
        ARRAY['community_comments_post_id_fkey','community_comments','post_id','community_posts','id'],
        ARRAY['community_event_participants_event_id_fkey','community_event_participants','event_id','community_events','id'],
        ARRAY['community_group_members_group_id_fkey','community_group_members','group_id','community_groups','id'],
        ARRAY['community_likes_post_id_fkey','community_likes','post_id','community_posts','id'],
        ARRAY['community_topic_replies_topic_id_fkey','community_topic_replies','topic_id','community_topics','id'],
        ARRAY['community_topics_forum_id_fkey','community_topics','forum_id','community_forums','id']
    ];
    v_fk TEXT[];
BEGIN
    FOREACH v_fk SLICE 1 IN ARRAY v_fks LOOP
        DECLARE
            v_name TEXT := v_fk[1];
            v_src  TEXT := v_fk[2];
            v_scol TEXT := v_fk[3];
            v_tgt  TEXT := v_fk[4];
            v_tcol TEXT := v_fk[5];
        BEGIN
            -- Já existe pelo nome?
            IF EXISTS (
                SELECT 1 FROM pg_constraint c
                JOIN pg_namespace n ON n.oid = c.connamespace
                WHERE c.conname = v_name AND n.nspname = 'public'
            ) THEN
                v_skipped_exists := v_skipped_exists + 1;
                CONTINUE;
            END IF;

            -- Verifica colunas existem
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                           WHERE table_schema='public' AND table_name=v_src AND column_name=v_scol)
            OR NOT EXISTS (SELECT 1 FROM information_schema.columns
                           WHERE table_schema='public' AND table_name=v_tgt AND column_name=v_tcol) THEN
                v_skipped_not_ready := v_skipped_not_ready + 1;
                RAISE NOTICE '[FK] Pulando %: coluna ausente.', v_name;
                CONTINUE;
            END IF;

            -- Verifica unicidade no alvo
            IF NOT EXISTS (
                SELECT 1 FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                JOIN pg_class c ON c.oid = i.indrelid
                JOIN pg_namespace n ON n.oid = c.relnamespace
                WHERE n.nspname='public' AND c.relname=v_tgt AND a.attname=v_tcol
                  AND (i.indisprimary OR i.indisunique) AND i.indnatts = 1
            ) THEN
                v_skipped_not_ready := v_skipped_not_ready + 1;
                RAISE NOTICE '[FK] Pulando %: alvo %.%  ainda sem PK/UNIQUE.', v_name, v_tgt, v_tcol;
                CONTINUE;
            END IF;

            -- Cria
            BEGIN
                EXECUTE format(
                    'ALTER TABLE public.%I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES public.%I(%I) NOT VALID',
                    v_src, v_name, v_scol, v_tgt, v_tcol
                );
                EXECUTE format('ALTER TABLE public.%I VALIDATE CONSTRAINT %I', v_src, v_name);
                v_added := v_added + 1;
            EXCEPTION WHEN OTHERS THEN
                EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT IF EXISTS %I', v_src, v_name);
                v_failed := v_failed + 1;
                RAISE WARNING '[FK] Falha em %: %', v_name, SQLERRM;
            END;
        END;
    END LOOP;

    RAISE NOTICE '[FK] Resumo: ADD=% | EXISTE=% | NAO_PRONTA=% | FALHOU=%',
        v_added, v_skipped_exists, v_skipped_not_ready, v_failed;
END $fk_create$;

-- Verificação final
SELECT
    (SELECT count(*) FROM pg_constraint c
     JOIN pg_namespace n ON n.oid = c.connamespace
     WHERE n.nspname = 'public' AND c.contype = 'f') AS total_fks_public;
