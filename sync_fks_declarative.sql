-- IDEMPOTENT SYNC SCRIPT: CONFORM DATABASE TO fks_from_schema.json
-- This script will attempt to create all 384 expected FKs.
-- It skips existing ones and reports errors (orphans, missing columns) as NOTICES.
-- Run this in your Supabase SQL Editor.

DO $$
DECLARE
    v_count_added INT := 0;
    v_count_skipped INT := 0;
    v_count_error INT := 0;
BEGIN

    -- [1/384] access_expiration_logs_user_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'access_expiration_logs_user_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'access_expiration_logs' AND column_name = 'user_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'profiles' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "access_expiration_logs" ADD CONSTRAINT "access_expiration_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "access_expiration_logs" VALIDATE CONSTRAINT "access_expiration_logs_user_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped access_expiration_logs_user_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create access_expiration_logs_user_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [2/384] admin_action_history_user_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'admin_action_history_user_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'admin_action_history' AND column_name = 'user_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'profiles' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "admin_action_history" ADD CONSTRAINT "admin_action_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "admin_action_history" VALIDATE CONSTRAINT "admin_action_history_user_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped admin_action_history_user_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create admin_action_history_user_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [3/384] admin_automation_audit_rule_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'admin_automation_audit_rule_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'admin_automation_audit' AND column_name = 'rule_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'admin_automation_rules' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "admin_automation_audit" ADD CONSTRAINT "admin_automation_audit_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "admin_automation_rules" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "admin_automation_audit" VALIDATE CONSTRAINT "admin_automation_audit_rule_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped admin_automation_audit_rule_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create admin_automation_audit_rule_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [4/384] agente_conversas_agente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agente_conversas_agente_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'agente_conversas' AND column_name = 'agente_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'agentes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "agente_conversas" ADD CONSTRAINT "agente_conversas_agente_id_fkey" FOREIGN KEY ("agente_id") REFERENCES "agentes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "agente_conversas" VALIDATE CONSTRAINT "agente_conversas_agente_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped agente_conversas_agente_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create agente_conversas_agente_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [5/384] agente_mensagens_conversa_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agente_mensagens_conversa_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'agente_mensagens' AND column_name = 'conversa_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'agente_conversas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "agente_mensagens" ADD CONSTRAINT "agente_mensagens_conversa_id_fkey" FOREIGN KEY ("conversa_id") REFERENCES "agente_conversas" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "agente_mensagens" VALIDATE CONSTRAINT "agente_mensagens_conversa_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped agente_mensagens_conversa_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create agente_mensagens_conversa_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [6/384] ai_interaction_logs_agente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_interaction_logs_agente_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'ai_interaction_logs' AND column_name = 'agente_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'agentes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "ai_interaction_logs" ADD CONSTRAINT "ai_interaction_logs_agente_id_fkey" FOREIGN KEY ("agente_id") REFERENCES "agentes" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "ai_interaction_logs" VALIDATE CONSTRAINT "ai_interaction_logs_agente_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped ai_interaction_logs_agente_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create ai_interaction_logs_agente_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [7/384] ai_recommendations_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'ai_recommendations' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "ai_recommendations" ADD CONSTRAINT "ai_recommendations_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "ai_recommendations" VALIDATE CONSTRAINT "ai_recommendations_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped ai_recommendations_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create ai_recommendations_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [8/384] ai_recommendations_distrito_sugerido_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_distrito_sugerido_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'ai_recommendations' AND column_name = 'distrito_sugerido_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'city_districts' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "ai_recommendations" ADD CONSTRAINT "ai_recommendations_distrito_sugerido_id_fkey" FOREIGN KEY ("distrito_sugerido_id") REFERENCES "city_districts" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "ai_recommendations" VALIDATE CONSTRAINT "ai_recommendations_distrito_sugerido_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped ai_recommendations_distrito_sugerido_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create ai_recommendations_distrito_sugerido_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [9/384] ai_recommendations_session_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_session_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'ai_recommendations' AND column_name = 'session_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sessions' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "ai_recommendations" ADD CONSTRAINT "ai_recommendations_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "ai_recommendations" VALIDATE CONSTRAINT "ai_recommendations_session_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped ai_recommendations_session_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create ai_recommendations_session_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [10/384] ai_recommendations_tool_sugerida_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_tool_sugerida_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'ai_recommendations' AND column_name = 'tool_sugerida_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tools' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "ai_recommendations" ADD CONSTRAINT "ai_recommendations_tool_sugerida_id_fkey" FOREIGN KEY ("tool_sugerida_id") REFERENCES "tools" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "ai_recommendations" VALIDATE CONSTRAINT "ai_recommendations_tool_sugerida_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped ai_recommendations_tool_sugerida_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create ai_recommendations_tool_sugerida_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [11/384] archetypal_profile_snapshots_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'archetypal_profile_snapshots_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'archetypal_profile_snapshots' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "archetypal_profile_snapshots" ADD CONSTRAINT "archetypal_profile_snapshots_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "archetypal_profile_snapshots" VALIDATE CONSTRAINT "archetypal_profile_snapshots_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped archetypal_profile_snapshots_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create archetypal_profile_snapshots_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [12/384] archetype_tools_archetype_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'archetype_tools_archetype_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'archetype_tools' AND column_name = 'archetype_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'founding_archetypes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "archetype_tools" ADD CONSTRAINT "archetype_tools_archetype_id_fkey" FOREIGN KEY ("archetype_id") REFERENCES "founding_archetypes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "archetype_tools" VALIDATE CONSTRAINT "archetype_tools_archetype_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped archetype_tools_archetype_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create archetype_tools_archetype_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [13/384] archetype_tools_tool_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'archetype_tools_tool_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'archetype_tools' AND column_name = 'tool_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tools' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "archetype_tools" ADD CONSTRAINT "archetype_tools_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tools" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "archetype_tools" VALIDATE CONSTRAINT "archetype_tools_tool_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped archetype_tools_tool_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create archetype_tools_tool_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [14/384] atelie_conteudos_template_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'atelie_conteudos_template_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'atelie_conteudos' AND column_name = 'template_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'atelie_templates' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "atelie_conteudos" ADD CONSTRAINT "atelie_conteudos_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "atelie_templates" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "atelie_conteudos" VALIDATE CONSTRAINT "atelie_conteudos_template_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped atelie_conteudos_template_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create atelie_conteudos_template_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [15/384] atlas_arquetipos_registros_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'atlas_arquetipos_registros_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'atlas_arquetipos_registros' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "atlas_arquetipos_registros" ADD CONSTRAINT "atlas_arquetipos_registros_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "atlas_arquetipos_registros" VALIDATE CONSTRAINT "atlas_arquetipos_registros_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped atlas_arquetipos_registros_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create atlas_arquetipos_registros_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [16/384] aulas_portal_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'aulas_portal_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'aulas' AND column_name = 'portal_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'portais' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "aulas" ADD CONSTRAINT "aulas_portal_id_fkey" FOREIGN KEY ("portal_id") REFERENCES "portais" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "aulas" VALIDATE CONSTRAINT "aulas_portal_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped aulas_portal_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create aulas_portal_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [17/384] biblioteca_casos_porta_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'biblioteca_casos_porta_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'biblioteca_casos' AND column_name = 'porta_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_portas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "biblioteca_casos" ADD CONSTRAINT "biblioteca_casos_porta_id_fkey" FOREIGN KEY ("porta_id") REFERENCES "labirinto_portas" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "biblioteca_casos" VALIDATE CONSTRAINT "biblioteca_casos_porta_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped biblioteca_casos_porta_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create biblioteca_casos_porta_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [18/384] big5_funcional_perguntas_dimensao_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_funcional_perguntas_dimensao_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'big5_funcional_perguntas' AND column_name = 'dimensao_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'big5_funcional_dimensoes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "big5_funcional_perguntas" ADD CONSTRAINT "big5_funcional_perguntas_dimensao_id_fkey" FOREIGN KEY ("dimensao_id") REFERENCES "big5_funcional_dimensoes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "big5_funcional_perguntas" VALIDATE CONSTRAINT "big5_funcional_perguntas_dimensao_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped big5_funcional_perguntas_dimensao_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create big5_funcional_perguntas_dimensao_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [19/384] big5_oracular_perguntas_fator_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_oracular_perguntas_fator_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'big5_oracular_perguntas' AND column_name = 'fator_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'big5_oracular_fatores' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "big5_oracular_perguntas" ADD CONSTRAINT "big5_oracular_perguntas_fator_id_fkey" FOREIGN KEY ("fator_id") REFERENCES "big5_oracular_fatores" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "big5_oracular_perguntas" VALIDATE CONSTRAINT "big5_oracular_perguntas_fator_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped big5_oracular_perguntas_fator_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create big5_oracular_perguntas_fator_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [20/384] big5_porta_mapeamento_ritual_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_porta_mapeamento_ritual_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'big5_porta_mapeamento' AND column_name = 'ritual_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'rituais_simbolicos' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "big5_porta_mapeamento" ADD CONSTRAINT "big5_porta_mapeamento_ritual_id_fkey" FOREIGN KEY ("ritual_id") REFERENCES "rituais_simbolicos" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "big5_porta_mapeamento" VALIDATE CONSTRAINT "big5_porta_mapeamento_ritual_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped big5_porta_mapeamento_ritual_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create big5_porta_mapeamento_ritual_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [21/384] big5_ritual_registros_big5_registro_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_ritual_registros_big5_registro_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'big5_ritual_registros' AND column_name = 'big5_registro_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'big5_oracular_registros' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "big5_ritual_registros" ADD CONSTRAINT "big5_ritual_registros_big5_registro_id_fkey" FOREIGN KEY ("big5_registro_id") REFERENCES "big5_oracular_registros" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "big5_ritual_registros" VALIDATE CONSTRAINT "big5_ritual_registros_big5_registro_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped big5_ritual_registros_big5_registro_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create big5_ritual_registros_big5_registro_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [22/384] big5_ritual_registros_ritual_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_ritual_registros_ritual_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'big5_ritual_registros' AND column_name = 'ritual_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'rituais_simbolicos' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "big5_ritual_registros" ADD CONSTRAINT "big5_ritual_registros_ritual_id_fkey" FOREIGN KEY ("ritual_id") REFERENCES "rituais_simbolicos" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "big5_ritual_registros" VALIDATE CONSTRAINT "big5_ritual_registros_ritual_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped big5_ritual_registros_ritual_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create big5_ritual_registros_ritual_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [23/384] big5_symbolic_afirmacoes_force_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_symbolic_afirmacoes_force_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'big5_symbolic_afirmacoes' AND column_name = 'force_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'big5_symbolic_forces' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "big5_symbolic_afirmacoes" ADD CONSTRAINT "big5_symbolic_afirmacoes_force_id_fkey" FOREIGN KEY ("force_id") REFERENCES "big5_symbolic_forces" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "big5_symbolic_afirmacoes" VALIDATE CONSTRAINT "big5_symbolic_afirmacoes_force_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped big5_symbolic_afirmacoes_force_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create big5_symbolic_afirmacoes_force_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [24/384] big5_symbolic_registros_session_case_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_symbolic_registros_session_case_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'big5_symbolic_registros' AND column_name = 'session_case_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_cases' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "big5_symbolic_registros" ADD CONSTRAINT "big5_symbolic_registros_session_case_id_fkey" FOREIGN KEY ("session_case_id") REFERENCES "session_cases" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "big5_symbolic_registros" VALIDATE CONSTRAINT "big5_symbolic_registros_session_case_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped big5_symbolic_registros_session_case_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create big5_symbolic_registros_session_case_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [25/384] book_links_from_book_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_links_from_book_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'book_links' AND column_name = 'from_book_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'books' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "book_links" ADD CONSTRAINT "book_links_from_book_id_fkey" FOREIGN KEY ("from_book_id") REFERENCES "books" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "book_links" VALIDATE CONSTRAINT "book_links_from_book_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped book_links_from_book_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create book_links_from_book_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [26/384] book_links_to_book_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_links_to_book_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'book_links' AND column_name = 'to_book_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'books' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "book_links" ADD CONSTRAINT "book_links_to_book_id_fkey" FOREIGN KEY ("to_book_id") REFERENCES "books" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "book_links" VALIDATE CONSTRAINT "book_links_to_book_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped book_links_to_book_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create book_links_to_book_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [27/384] book_media_station_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_media_station_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'book_media' AND column_name = 'station_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_estacoes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "book_media" ADD CONSTRAINT "book_media_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "clube_estacoes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "book_media" VALIDATE CONSTRAINT "book_media_station_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped book_media_station_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create book_media_station_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [28/384] book_tours_book_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_tours_book_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'book_tours' AND column_name = 'book_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'books' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "book_tours" ADD CONSTRAINT "book_tours_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "book_tours" VALIDATE CONSTRAINT "book_tours_book_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped book_tours_book_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create book_tours_book_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [29/384] canteiro_reactions_entry_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'canteiro_reactions_entry_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'canteiro_reactions' AND column_name = 'entry_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'collective_bed_entries' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "canteiro_reactions" ADD CONSTRAINT "canteiro_reactions_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "collective_bed_entries" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "canteiro_reactions" VALIDATE CONSTRAINT "canteiro_reactions_entry_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped canteiro_reactions_entry_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create canteiro_reactions_entry_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [30/384] cartografia_complexos_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartografia_complexos_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'cartografia_complexos' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "cartografia_complexos" ADD CONSTRAINT "cartografia_complexos_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "cartografia_complexos" VALIDATE CONSTRAINT "cartografia_complexos_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped cartografia_complexos_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create cartografia_complexos_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [31/384] cartografia_psiquica_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartografia_psiquica_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'cartografia_psiquica' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "cartografia_psiquica" ADD CONSTRAINT "cartografia_psiquica_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "cartografia_psiquica" VALIDATE CONSTRAINT "cartografia_psiquica_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped cartografia_psiquica_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create cartografia_psiquica_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [32/384] cartographer_engine_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_engine_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'cartographer_engine' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "cartographer_engine" ADD CONSTRAINT "cartographer_engine_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "cartographer_engine" VALIDATE CONSTRAINT "cartographer_engine_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped cartographer_engine_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create cartographer_engine_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [33/384] cartographer_engine_session_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_engine_session_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'cartographer_engine' AND column_name = 'session_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sessions' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "cartographer_engine" ADD CONSTRAINT "cartographer_engine_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "cartographer_engine" VALIDATE CONSTRAINT "cartographer_engine_session_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped cartographer_engine_session_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create cartographer_engine_session_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [34/384] cartographer_recommendations_engine_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_recommendations_engine_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'cartographer_recommendations' AND column_name = 'engine_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'cartographer_engine' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "cartographer_recommendations" ADD CONSTRAINT "cartographer_recommendations_engine_id_fkey" FOREIGN KEY ("engine_id") REFERENCES "cartographer_engine" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "cartographer_recommendations" VALIDATE CONSTRAINT "cartographer_recommendations_engine_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped cartographer_recommendations_engine_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create cartographer_recommendations_engine_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [35/384] cartographer_recommendations_ferramenta_escolhida_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_recommendations_ferramenta_escolhida_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'cartographer_recommendations' AND column_name = 'ferramenta_escolhida_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tools' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "cartographer_recommendations" ADD CONSTRAINT "cartographer_recommendations_ferramenta_escolhida_id_fkey" FOREIGN KEY ("ferramenta_escolhida_id") REFERENCES "tools" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "cartographer_recommendations" VALIDATE CONSTRAINT "cartographer_recommendations_ferramenta_escolhida_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped cartographer_recommendations_ferramenta_escolhida_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create cartographer_recommendations_ferramenta_escolhida_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [36/384] cartographer_recommendations_tool_complementar_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_recommendations_tool_complementar_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'cartographer_recommendations' AND column_name = 'tool_complementar_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tools' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "cartographer_recommendations" ADD CONSTRAINT "cartographer_recommendations_tool_complementar_id_fkey" FOREIGN KEY ("tool_complementar_id") REFERENCES "tools" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "cartographer_recommendations" VALIDATE CONSTRAINT "cartographer_recommendations_tool_complementar_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped cartographer_recommendations_tool_complementar_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create cartographer_recommendations_tool_complementar_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [37/384] cartographer_recommendations_tool_principal_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_recommendations_tool_principal_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'cartographer_recommendations' AND column_name = 'tool_principal_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tools' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "cartographer_recommendations" ADD CONSTRAINT "cartographer_recommendations_tool_principal_id_fkey" FOREIGN KEY ("tool_principal_id") REFERENCES "tools" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "cartographer_recommendations" VALIDATE CONSTRAINT "cartographer_recommendations_tool_principal_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped cartographer_recommendations_tool_principal_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create cartographer_recommendations_tool_principal_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [38/384] cartographies_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographies_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'cartographies' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "cartographies" ADD CONSTRAINT "cartographies_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "cartographies" VALIDATE CONSTRAINT "cartographies_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped cartographies_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create cartographies_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [39/384] cartographies_session_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographies_session_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'cartographies' AND column_name = 'session_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sessions' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "cartographies" ADD CONSTRAINT "cartographies_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "cartographies" VALIDATE CONSTRAINT "cartographies_session_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped cartographies_session_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create cartographies_session_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [40/384] casa_circulo_replies_thread_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'casa_circulo_replies_thread_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'casa_circulo_replies' AND column_name = 'thread_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'casa_circulo_threads' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "casa_circulo_replies" ADD CONSTRAINT "casa_circulo_replies_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "casa_circulo_threads" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "casa_circulo_replies" VALIDATE CONSTRAINT "casa_circulo_replies_thread_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped casa_circulo_replies_thread_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create casa_circulo_replies_thread_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [41/384] cidadela_oracle_cards_district_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cidadela_oracle_cards_district_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'cidadela_oracle_cards' AND column_name = 'district_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'districts' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "cidadela_oracle_cards" ADD CONSTRAINT "cidadela_oracle_cards_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "cidadela_oracle_cards" VALIDATE CONSTRAINT "cidadela_oracle_cards_district_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped cidadela_oracle_cards_district_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create cidadela_oracle_cards_district_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [42/384] cidadela_oracle_cards_suggested_tool_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cidadela_oracle_cards_suggested_tool_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'cidadela_oracle_cards' AND column_name = 'suggested_tool_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tools' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "cidadela_oracle_cards" ADD CONSTRAINT "cidadela_oracle_cards_suggested_tool_id_fkey" FOREIGN KEY ("suggested_tool_id") REFERENCES "tools" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "cidadela_oracle_cards" VALIDATE CONSTRAINT "cidadela_oracle_cards_suggested_tool_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped cidadela_oracle_cards_suggested_tool_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create cidadela_oracle_cards_suggested_tool_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [43/384] cidadela_oracle_usage_card_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cidadela_oracle_usage_card_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'cidadela_oracle_usage' AND column_name = 'card_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'cidadela_oracle_cards' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "cidadela_oracle_usage" ADD CONSTRAINT "cidadela_oracle_usage_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cidadela_oracle_cards" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "cidadela_oracle_usage" VALIDATE CONSTRAINT "cidadela_oracle_usage_card_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped cidadela_oracle_usage_card_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create cidadela_oracle_usage_card_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [44/384] cidadela_oracle_usage_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cidadela_oracle_usage_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'cidadela_oracle_usage' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "cidadela_oracle_usage" ADD CONSTRAINT "cidadela_oracle_usage_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "cidadela_oracle_usage" VALIDATE CONSTRAINT "cidadela_oracle_usage_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped cidadela_oracle_usage_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create cidadela_oracle_usage_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [45/384] client_archetype_state_arquitipo_evolucao_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_archetype_state_arquitipo_evolucao_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'client_archetype_state' AND column_name = 'arquitipo_evolucao_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'founding_archetypes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "client_archetype_state" ADD CONSTRAINT "client_archetype_state_arquitipo_evolucao_id_fkey" FOREIGN KEY ("arquitipo_evolucao_id") REFERENCES "founding_archetypes" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "client_archetype_state" VALIDATE CONSTRAINT "client_archetype_state_arquitipo_evolucao_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped client_archetype_state_arquitipo_evolucao_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create client_archetype_state_arquitipo_evolucao_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [46/384] client_archetype_state_arquitipo_regente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_archetype_state_arquitipo_regente_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'client_archetype_state' AND column_name = 'arquitipo_regente_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'founding_archetypes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "client_archetype_state" ADD CONSTRAINT "client_archetype_state_arquitipo_regente_id_fkey" FOREIGN KEY ("arquitipo_regente_id") REFERENCES "founding_archetypes" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "client_archetype_state" VALIDATE CONSTRAINT "client_archetype_state_arquitipo_regente_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped client_archetype_state_arquitipo_regente_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create client_archetype_state_arquitipo_regente_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [47/384] client_archetype_state_arquitipo_sombra_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_archetype_state_arquitipo_sombra_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'client_archetype_state' AND column_name = 'arquitipo_sombra_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'founding_archetypes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "client_archetype_state" ADD CONSTRAINT "client_archetype_state_arquitipo_sombra_id_fkey" FOREIGN KEY ("arquitipo_sombra_id") REFERENCES "founding_archetypes" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "client_archetype_state" VALIDATE CONSTRAINT "client_archetype_state_arquitipo_sombra_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped client_archetype_state_arquitipo_sombra_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create client_archetype_state_arquitipo_sombra_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [48/384] client_archetype_state_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_archetype_state_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'client_archetype_state' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "client_archetype_state" ADD CONSTRAINT "client_archetype_state_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "client_archetype_state" VALIDATE CONSTRAINT "client_archetype_state_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped client_archetype_state_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create client_archetype_state_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [49/384] client_cidadela_map_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_cidadela_map_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'client_cidadela_map' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "client_cidadela_map" ADD CONSTRAINT "client_cidadela_map_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "client_cidadela_map" VALIDATE CONSTRAINT "client_cidadela_map_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped client_cidadela_map_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create client_cidadela_map_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [50/384] client_city_state_arquetipo_ativo_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_arquetipo_ativo_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'client_city_state' AND column_name = 'arquetipo_ativo'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'founding_archetypes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "client_city_state" ADD CONSTRAINT "client_city_state_arquetipo_ativo_fkey" FOREIGN KEY ("arquetipo_ativo") REFERENCES "founding_archetypes" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "client_city_state" VALIDATE CONSTRAINT "client_city_state_arquetipo_ativo_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped client_city_state_arquetipo_ativo_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create client_city_state_arquetipo_ativo_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [51/384] client_city_state_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'client_city_state' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "client_city_state" ADD CONSTRAINT "client_city_state_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "client_city_state" VALIDATE CONSTRAINT "client_city_state_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped client_city_state_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create client_city_state_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [52/384] client_city_state_distrito_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_distrito_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'client_city_state' AND column_name = 'distrito_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'city_districts' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "client_city_state" ADD CONSTRAINT "client_city_state_distrito_id_fkey" FOREIGN KEY ("distrito_id") REFERENCES "city_districts" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "client_city_state" VALIDATE CONSTRAINT "client_city_state_distrito_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped client_city_state_distrito_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create client_city_state_distrito_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [53/384] client_city_state_ultima_ferramenta_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_ultima_ferramenta_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'client_city_state' AND column_name = 'ultima_ferramenta_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tools' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "client_city_state" ADD CONSTRAINT "client_city_state_ultima_ferramenta_id_fkey" FOREIGN KEY ("ultima_ferramenta_id") REFERENCES "tools" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "client_city_state" VALIDATE CONSTRAINT "client_city_state_ultima_ferramenta_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped client_city_state_ultima_ferramenta_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create client_city_state_ultima_ferramenta_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [54/384] client_city_state_ultima_sessao_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_ultima_sessao_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'client_city_state' AND column_name = 'ultima_sessao_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sessions' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "client_city_state" ADD CONSTRAINT "client_city_state_ultima_sessao_id_fkey" FOREIGN KEY ("ultima_sessao_id") REFERENCES "sessions" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "client_city_state" VALIDATE CONSTRAINT "client_city_state_ultima_sessao_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped client_city_state_ultima_sessao_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create client_city_state_ultima_sessao_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [55/384] client_labyrinths_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_labyrinths_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'client_labyrinths' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "client_labyrinths" ADD CONSTRAINT "client_labyrinths_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "client_labyrinths" VALIDATE CONSTRAINT "client_labyrinths_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped client_labyrinths_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create client_labyrinths_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [56/384] client_live_map_entries_session_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_live_map_entries_session_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'client_live_map_entries' AND column_name = 'session_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sessions' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "client_live_map_entries" ADD CONSTRAINT "client_live_map_entries_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "client_live_map_entries" VALIDATE CONSTRAINT "client_live_map_entries_session_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped client_live_map_entries_session_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create client_live_map_entries_session_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [57/384] client_pattern_stats_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_pattern_stats_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'client_pattern_stats' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "client_pattern_stats" ADD CONSTRAINT "client_pattern_stats_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "client_pattern_stats" VALIDATE CONSTRAINT "client_pattern_stats_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped client_pattern_stats_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create client_pattern_stats_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [58/384] client_seasons_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_seasons_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'client_seasons' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "client_seasons" ADD CONSTRAINT "client_seasons_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "client_seasons" VALIDATE CONSTRAINT "client_seasons_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped client_seasons_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create client_seasons_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [59/384] club_books_cycle_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'club_books_cycle_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '_deprecated_club_books' AND column_name = 'cycle_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '_deprecated_club_cycles' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "_deprecated_club_books" ADD CONSTRAINT "club_books_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "_deprecated_club_cycles" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "_deprecated_club_books" VALIDATE CONSTRAINT "club_books_cycle_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped club_books_cycle_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create club_books_cycle_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [60/384] club_knowledge_entries_book_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'club_knowledge_entries_book_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '_deprecated_club_knowledge_entries' AND column_name = 'book_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'books' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "_deprecated_club_knowledge_entries" ADD CONSTRAINT "club_knowledge_entries_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "_deprecated_club_knowledge_entries" VALIDATE CONSTRAINT "club_knowledge_entries_book_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped club_knowledge_entries_book_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create club_knowledge_entries_book_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [61/384] club_meetings_cycle_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'club_meetings_cycle_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '_deprecated_club_meetings' AND column_name = 'cycle_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '_deprecated_club_cycles' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "_deprecated_club_meetings" ADD CONSTRAINT "club_meetings_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "_deprecated_club_cycles" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "_deprecated_club_meetings" VALIDATE CONSTRAINT "club_meetings_cycle_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped club_meetings_cycle_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create club_meetings_cycle_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [62/384] club_user_cycles_cycle_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'club_user_cycles_cycle_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '_deprecated_club_user_cycles' AND column_name = 'cycle_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '_deprecated_club_cycles' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "_deprecated_club_user_cycles" ADD CONSTRAINT "club_user_cycles_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "_deprecated_club_cycles" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "_deprecated_club_user_cycles" VALIDATE CONSTRAINT "club_user_cycles_cycle_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped club_user_cycles_cycle_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create club_user_cycles_cycle_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [63/384] clube_audio_albums_estacao_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_audio_albums_estacao_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_audio_albums' AND column_name = 'estacao_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_estacoes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "clube_audio_albums" ADD CONSTRAINT "clube_audio_albums_estacao_id_fkey" FOREIGN KEY ("estacao_id") REFERENCES "clube_estacoes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "clube_audio_albums" VALIDATE CONSTRAINT "clube_audio_albums_estacao_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped clube_audio_albums_estacao_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create clube_audio_albums_estacao_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [64/384] clube_audio_progress_track_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_audio_progress_track_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_audio_progress' AND column_name = 'track_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_audio_tracks' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "clube_audio_progress" ADD CONSTRAINT "clube_audio_progress_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "clube_audio_tracks" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "clube_audio_progress" VALIDATE CONSTRAINT "clube_audio_progress_track_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped clube_audio_progress_track_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create clube_audio_progress_track_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [65/384] clube_audio_tracks_album_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_audio_tracks_album_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_audio_tracks' AND column_name = 'album_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_audio_albums' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "clube_audio_tracks" ADD CONSTRAINT "clube_audio_tracks_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "clube_audio_albums" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "clube_audio_tracks" VALIDATE CONSTRAINT "clube_audio_tracks_album_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped clube_audio_tracks_album_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create clube_audio_tracks_album_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [66/384] clube_carrossel_slides_estacao_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_carrossel_slides_estacao_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_carrossel_slides' AND column_name = 'estacao_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oracular_seasons' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "clube_carrossel_slides" ADD CONSTRAINT "clube_carrossel_slides_estacao_id_fkey" FOREIGN KEY ("estacao_id") REFERENCES "oracular_seasons" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "clube_carrossel_slides" VALIDATE CONSTRAINT "clube_carrossel_slides_estacao_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped clube_carrossel_slides_estacao_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create clube_carrossel_slides_estacao_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [67/384] clube_engajamento_estacao_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_engajamento_estacao_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_engajamento' AND column_name = 'estacao_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_estacoes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "clube_engajamento" ADD CONSTRAINT "clube_engajamento_estacao_id_fkey" FOREIGN KEY ("estacao_id") REFERENCES "clube_estacoes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "clube_engajamento" VALIDATE CONSTRAINT "clube_engajamento_estacao_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped clube_engajamento_estacao_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create clube_engajamento_estacao_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [68/384] clube_estacao_registros_estacao_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_estacao_registros_estacao_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_estacao_registros' AND column_name = 'estacao_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_estacoes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "clube_estacao_registros" ADD CONSTRAINT "clube_estacao_registros_estacao_id_fkey" FOREIGN KEY ("estacao_id") REFERENCES "clube_estacoes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "clube_estacao_registros" VALIDATE CONSTRAINT "clube_estacao_registros_estacao_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped clube_estacao_registros_estacao_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create clube_estacao_registros_estacao_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [69/384] clube_estacoes_cartografia_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_estacoes_cartografia_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_estacoes' AND column_name = 'cartografia_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'cartographies' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "clube_estacoes" ADD CONSTRAINT "clube_estacoes_cartografia_id_fkey" FOREIGN KEY ("cartografia_id") REFERENCES "cartographies" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "clube_estacoes" VALIDATE CONSTRAINT "clube_estacoes_cartografia_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped clube_estacoes_cartografia_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create clube_estacoes_cartografia_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [70/384] clube_estacoes_quiz_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_estacoes_quiz_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_estacoes' AND column_name = 'quiz_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'quizzes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "clube_estacoes" ADD CONSTRAINT "clube_estacoes_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "clube_estacoes" VALIDATE CONSTRAINT "clube_estacoes_quiz_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped clube_estacoes_quiz_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create clube_estacoes_quiz_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [71/384] clube_jornadas_estacao_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_jornadas_estacao_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_jornadas' AND column_name = 'estacao_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_estacoes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "clube_jornadas" ADD CONSTRAINT "clube_jornadas_estacao_id_fkey" FOREIGN KEY ("estacao_id") REFERENCES "clube_estacoes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "clube_jornadas" VALIDATE CONSTRAINT "clube_jornadas_estacao_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped clube_jornadas_estacao_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create clube_jornadas_estacao_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [72/384] clube_livro_aulas_porta_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_livro_aulas_porta_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_livro_aulas' AND column_name = 'porta_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_livro_portas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "clube_livro_aulas" ADD CONSTRAINT "clube_livro_aulas_porta_id_fkey" FOREIGN KEY ("porta_id") REFERENCES "clube_livro_portas" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "clube_livro_aulas" VALIDATE CONSTRAINT "clube_livro_aulas_porta_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped clube_livro_aulas_porta_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create clube_livro_aulas_porta_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [73/384] clube_livro_chat_interactions_book_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_livro_chat_interactions_book_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_livro_chat_interactions' AND column_name = 'book_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'books' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "clube_livro_chat_interactions" ADD CONSTRAINT "clube_livro_chat_interactions_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "clube_livro_chat_interactions" VALIDATE CONSTRAINT "clube_livro_chat_interactions_book_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped clube_livro_chat_interactions_book_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create clube_livro_chat_interactions_book_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [74/384] clube_livro_encontros_estacao_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_livro_encontros_estacao_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_livro_encontros' AND column_name = 'estacao_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_estacoes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "clube_livro_encontros" ADD CONSTRAINT "clube_livro_encontros_estacao_id_fkey" FOREIGN KEY ("estacao_id") REFERENCES "clube_estacoes" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "clube_livro_encontros" VALIDATE CONSTRAINT "clube_livro_encontros_estacao_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped clube_livro_encontros_estacao_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create clube_livro_encontros_estacao_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [75/384] clube_livro_respostas_pergunta_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_livro_respostas_pergunta_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_livro_respostas' AND column_name = 'pergunta_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_livro_perguntas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "clube_livro_respostas" ADD CONSTRAINT "clube_livro_respostas_pergunta_id_fkey" FOREIGN KEY ("pergunta_id") REFERENCES "clube_livro_perguntas" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "clube_livro_respostas" VALIDATE CONSTRAINT "clube_livro_respostas_pergunta_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped clube_livro_respostas_pergunta_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create clube_livro_respostas_pergunta_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [76/384] clube_obras_essencia_8020_book_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_obras_essencia_8020_book_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_obras_essencia_8020' AND column_name = 'book_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'books' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "clube_obras_essencia_8020" ADD CONSTRAINT "clube_obras_essencia_8020_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "clube_obras_essencia_8020" VALIDATE CONSTRAINT "clube_obras_essencia_8020_book_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped clube_obras_essencia_8020_book_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create clube_obras_essencia_8020_book_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [77/384] clube_portais_jornada_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_portais_jornada_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_portais' AND column_name = 'jornada_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_jornadas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "clube_portais" ADD CONSTRAINT "clube_portais_jornada_id_fkey" FOREIGN KEY ("jornada_id") REFERENCES "clube_jornadas" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "clube_portais" VALIDATE CONSTRAINT "clube_portais_jornada_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped clube_portais_jornada_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create clube_portais_jornada_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [78/384] clube_portal_audios_portal_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_portal_audios_portal_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_portal_audios' AND column_name = 'portal_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_portais' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "clube_portal_audios" ADD CONSTRAINT "clube_portal_audios_portal_id_fkey" FOREIGN KEY ("portal_id") REFERENCES "clube_portais" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "clube_portal_audios" VALIDATE CONSTRAINT "clube_portal_audios_portal_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped clube_portal_audios_portal_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create clube_portal_audios_portal_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [79/384] clube_portal_insights_estacao_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_portal_insights_estacao_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_portal_insights' AND column_name = 'estacao_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oracular_seasons' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "clube_portal_insights" ADD CONSTRAINT "clube_portal_insights_estacao_id_fkey" FOREIGN KEY ("estacao_id") REFERENCES "oracular_seasons" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "clube_portal_insights" VALIDATE CONSTRAINT "clube_portal_insights_estacao_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped clube_portal_insights_estacao_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create clube_portal_insights_estacao_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [80/384] clube_portal_materiais_portal_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_portal_materiais_portal_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_portal_materiais' AND column_name = 'portal_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_portais' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "clube_portal_materiais" ADD CONSTRAINT "clube_portal_materiais_portal_id_fkey" FOREIGN KEY ("portal_id") REFERENCES "clube_portais" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "clube_portal_materiais" VALIDATE CONSTRAINT "clube_portal_materiais_portal_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped clube_portal_materiais_portal_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create clube_portal_materiais_portal_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [81/384] clube_progresso_passos_passo_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_progresso_passos_passo_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_progresso_passos' AND column_name = 'passo_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_rota_itens' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "clube_progresso_passos" ADD CONSTRAINT "clube_progresso_passos_passo_id_fkey" FOREIGN KEY ("passo_id") REFERENCES "clube_rota_itens" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "clube_progresso_passos" VALIDATE CONSTRAINT "clube_progresso_passos_passo_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped clube_progresso_passos_passo_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create clube_progresso_passos_passo_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [82/384] clube_reflexoes_estacao_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_reflexoes_estacao_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_reflexoes' AND column_name = 'estacao_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_estacoes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "clube_reflexoes" ADD CONSTRAINT "clube_reflexoes_estacao_id_fkey" FOREIGN KEY ("estacao_id") REFERENCES "clube_estacoes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "clube_reflexoes" VALIDATE CONSTRAINT "clube_reflexoes_estacao_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped clube_reflexoes_estacao_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create clube_reflexoes_estacao_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [83/384] clube_rota_itens_estacao_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_rota_itens_estacao_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_rota_itens' AND column_name = 'estacao_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_estacoes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "clube_rota_itens" ADD CONSTRAINT "clube_rota_itens_estacao_id_fkey" FOREIGN KEY ("estacao_id") REFERENCES "clube_estacoes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "clube_rota_itens" VALIDATE CONSTRAINT "clube_rota_itens_estacao_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped clube_rota_itens_estacao_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create clube_rota_itens_estacao_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [84/384] clube_rota_progresso_estacao_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_rota_progresso_estacao_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_rota_progresso' AND column_name = 'estacao_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_estacoes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "clube_rota_progresso" ADD CONSTRAINT "clube_rota_progresso_estacao_id_fkey" FOREIGN KEY ("estacao_id") REFERENCES "clube_estacoes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "clube_rota_progresso" VALIDATE CONSTRAINT "clube_rota_progresso_estacao_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped clube_rota_progresso_estacao_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create clube_rota_progresso_estacao_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [85/384] clube_rota_progresso_rota_item_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_rota_progresso_rota_item_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_rota_progresso' AND column_name = 'rota_item_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_rota_itens' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "clube_rota_progresso" ADD CONSTRAINT "clube_rota_progresso_rota_item_id_fkey" FOREIGN KEY ("rota_item_id") REFERENCES "clube_rota_itens" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "clube_rota_progresso" VALIDATE CONSTRAINT "clube_rota_progresso_rota_item_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped clube_rota_progresso_rota_item_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create clube_rota_progresso_rota_item_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [86/384] clube_v3_station_audios_station_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_v3_station_audios_station_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_v3_station_audios' AND column_name = 'station_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_v3_stations' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "clube_v3_station_audios" ADD CONSTRAINT "clube_v3_station_audios_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "clube_v3_stations" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "clube_v3_station_audios" VALIDATE CONSTRAINT "clube_v3_station_audios_station_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped clube_v3_station_audios_station_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create clube_v3_station_audios_station_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [87/384] clube_v3_station_content_station_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_v3_station_content_station_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_v3_station_content' AND column_name = 'station_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_v3_stations' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "clube_v3_station_content" ADD CONSTRAINT "clube_v3_station_content_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "clube_v3_stations" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "clube_v3_station_content" VALIDATE CONSTRAINT "clube_v3_station_content_station_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped clube_v3_station_content_station_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create clube_v3_station_content_station_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [88/384] clube_v3_stations_route_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_v3_stations_route_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_v3_stations' AND column_name = 'route_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_v3_routes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "clube_v3_stations" ADD CONSTRAINT "clube_v3_stations_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "clube_v3_routes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "clube_v3_stations" VALIDATE CONSTRAINT "clube_v3_stations_route_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped clube_v3_stations_route_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create clube_v3_stations_route_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [89/384] clube_v3_user_progress_station_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_v3_user_progress_station_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_v3_user_progress' AND column_name = 'station_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_v3_stations' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "clube_v3_user_progress" ADD CONSTRAINT "clube_v3_user_progress_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "clube_v3_stations" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "clube_v3_user_progress" VALIDATE CONSTRAINT "clube_v3_user_progress_station_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped clube_v3_user_progress_station_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create clube_v3_user_progress_station_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [90/384] co_ai_recommendations_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_ai_recommendations_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_ai_recommendations' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_ai_recommendations" ADD CONSTRAINT "co_ai_recommendations_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "co_ai_recommendations" VALIDATE CONSTRAINT "co_ai_recommendations_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_ai_recommendations_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_ai_recommendations_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [91/384] co_ai_recommendations_tool_complementar_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_ai_recommendations_tool_complementar_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_ai_recommendations' AND column_name = 'tool_complementar_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sala_ferramentas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_ai_recommendations" ADD CONSTRAINT "co_ai_recommendations_tool_complementar_id_fkey" FOREIGN KEY ("tool_complementar_id") REFERENCES "sala_ferramentas" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "co_ai_recommendations" VALIDATE CONSTRAINT "co_ai_recommendations_tool_complementar_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_ai_recommendations_tool_complementar_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_ai_recommendations_tool_complementar_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [92/384] co_ai_recommendations_tool_sugerida_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_ai_recommendations_tool_sugerida_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_ai_recommendations' AND column_name = 'tool_sugerida_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sala_ferramentas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_ai_recommendations" ADD CONSTRAINT "co_ai_recommendations_tool_sugerida_id_fkey" FOREIGN KEY ("tool_sugerida_id") REFERENCES "sala_ferramentas" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "co_ai_recommendations" VALIDATE CONSTRAINT "co_ai_recommendations_tool_sugerida_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_ai_recommendations_tool_sugerida_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_ai_recommendations_tool_sugerida_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [93/384] co_appointments_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_appointments_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_appointments' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_appointments" ADD CONSTRAINT "co_appointments_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "co_appointments" VALIDATE CONSTRAINT "co_appointments_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_appointments_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_appointments_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [94/384] co_appointments_workspace_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_appointments_workspace_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_appointments' AND column_name = 'workspace_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_workspaces' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_appointments" ADD CONSTRAINT "co_appointments_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "co_workspaces" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "co_appointments" VALIDATE CONSTRAINT "co_appointments_workspace_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_appointments_workspace_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_appointments_workspace_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [95/384] co_camara_sussurro_casos_proximo_treino_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_camara_sussurro_casos_proximo_treino_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_camara_sussurro_casos' AND column_name = 'proximo_treino_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_camara_sussurro_casos' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_camara_sussurro_casos" ADD CONSTRAINT "co_camara_sussurro_casos_proximo_treino_id_fkey" FOREIGN KEY ("proximo_treino_id") REFERENCES "co_camara_sussurro_casos" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "co_camara_sussurro_casos" VALIDATE CONSTRAINT "co_camara_sussurro_casos_proximo_treino_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_camara_sussurro_casos_proximo_treino_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_camara_sussurro_casos_proximo_treino_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [96/384] co_city_history_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_city_history_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_city_history' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_city_history" ADD CONSTRAINT "co_city_history_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "co_city_history" VALIDATE CONSTRAINT "co_city_history_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_city_history_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_city_history_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [97/384] co_city_history_tool_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_city_history_tool_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_city_history' AND column_name = 'tool_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sala_ferramentas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_city_history" ADD CONSTRAINT "co_city_history_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "sala_ferramentas" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "co_city_history" VALIDATE CONSTRAINT "co_city_history_tool_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_city_history_tool_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_city_history_tool_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [98/384] co_client_profile_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_client_profile_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_client_profile' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_client_profile" ADD CONSTRAINT "co_client_profile_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "co_client_profile" VALIDATE CONSTRAINT "co_client_profile_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_client_profile_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_client_profile_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [99/384] co_client_profiles_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_client_profiles_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_client_profiles' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_client_profiles" ADD CONSTRAINT "co_client_profiles_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "co_client_profiles" VALIDATE CONSTRAINT "co_client_profiles_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_client_profiles_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_client_profiles_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [100/384] co_convites_cliente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_convites_cliente_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_convites' AND column_name = 'cliente_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_convites" ADD CONSTRAINT "co_convites_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "co_convites" VALIDATE CONSTRAINT "co_convites_cliente_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_convites_cliente_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_convites_cliente_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [101/384] co_escutas_sessao_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_escutas_sessao_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_escutas' AND column_name = 'sessao_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_sessoes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_escutas" ADD CONSTRAINT "co_escutas_sessao_id_fkey" FOREIGN KEY ("sessao_id") REFERENCES "co_sessoes" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "co_escutas" VALIDATE CONSTRAINT "co_escutas_sessao_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_escutas_sessao_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_escutas_sessao_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [102/384] co_garden_flowers_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_garden_flowers_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_garden_flowers' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_garden_flowers" ADD CONSTRAINT "co_garden_flowers_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "co_garden_flowers" VALIDATE CONSTRAINT "co_garden_flowers_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_garden_flowers_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_garden_flowers_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [103/384] co_garden_flowers_origem_registro_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_garden_flowers_origem_registro_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_garden_flowers' AND column_name = 'origem_registro_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_journey_records' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_garden_flowers" ADD CONSTRAINT "co_garden_flowers_origem_registro_id_fkey" FOREIGN KEY ("origem_registro_id") REFERENCES "co_journey_records" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "co_garden_flowers" VALIDATE CONSTRAINT "co_garden_flowers_origem_registro_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_garden_flowers_origem_registro_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_garden_flowers_origem_registro_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [104/384] co_jardim_entries_jardim_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_jardim_entries_jardim_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_jardim_entries' AND column_name = 'jardim_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_jardins' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_jardim_entries" ADD CONSTRAINT "co_jardim_entries_jardim_id_fkey" FOREIGN KEY ("jardim_id") REFERENCES "co_jardins" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "co_jardim_entries" VALIDATE CONSTRAINT "co_jardim_entries_jardim_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_jardim_entries_jardim_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_jardim_entries_jardim_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [105/384] co_journey_records_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_journey_records_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_journey_records' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_journey_records" ADD CONSTRAINT "co_journey_records_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "co_journey_records" VALIDATE CONSTRAINT "co_journey_records_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_journey_records_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_journey_records_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [106/384] co_journey_records_tool_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_journey_records_tool_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_journey_records' AND column_name = 'tool_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sala_ferramentas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_journey_records" ADD CONSTRAINT "co_journey_records_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "sala_ferramentas" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "co_journey_records" VALIDATE CONSTRAINT "co_journey_records_tool_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_journey_records_tool_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_journey_records_tool_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [107/384] co_orientacao_sugestoes_ia_cliente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacao_sugestoes_ia_cliente_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'cliente_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_orientacao_sugestoes_ia" ADD CONSTRAINT "co_orientacao_sugestoes_ia_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "co_orientacao_sugestoes_ia" VALIDATE CONSTRAINT "co_orientacao_sugestoes_ia_cliente_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_orientacao_sugestoes_ia_cliente_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_orientacao_sugestoes_ia_cliente_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [108/384] co_orientacao_sugestoes_ia_orientacao_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacao_sugestoes_ia_orientacao_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'orientacao_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_orientacoes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_orientacao_sugestoes_ia" ADD CONSTRAINT "co_orientacao_sugestoes_ia_orientacao_id_fkey" FOREIGN KEY ("orientacao_id") REFERENCES "co_orientacoes" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "co_orientacao_sugestoes_ia" VALIDATE CONSTRAINT "co_orientacao_sugestoes_ia_orientacao_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_orientacao_sugestoes_ia_orientacao_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_orientacao_sugestoes_ia_orientacao_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [109/384] co_orientacao_sugestoes_ia_session_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacao_sugestoes_ia_session_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'session_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sessions' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_orientacao_sugestoes_ia" ADD CONSTRAINT "co_orientacao_sugestoes_ia_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "co_orientacao_sugestoes_ia" VALIDATE CONSTRAINT "co_orientacao_sugestoes_ia_session_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_orientacao_sugestoes_ia_session_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_orientacao_sugestoes_ia_session_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [110/384] co_orientacoes_cliente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacoes_cliente_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_orientacoes' AND column_name = 'cliente_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_orientacoes" ADD CONSTRAINT "co_orientacoes_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "co_orientacoes" VALIDATE CONSTRAINT "co_orientacoes_cliente_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_orientacoes_cliente_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_orientacoes_cliente_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [111/384] co_orientacoes_session_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacoes_session_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_orientacoes' AND column_name = 'session_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sessions' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_orientacoes" ADD CONSTRAINT "co_orientacoes_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "co_orientacoes" VALIDATE CONSTRAINT "co_orientacoes_session_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_orientacoes_session_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_orientacoes_session_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [112/384] co_passport_entries_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_passport_entries_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_passport_entries' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_passport_entries" ADD CONSTRAINT "co_passport_entries_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "co_passport_entries" VALIDATE CONSTRAINT "co_passport_entries_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_passport_entries_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_passport_entries_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [113/384] co_praticas_sessao_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_praticas_sessao_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_praticas' AND column_name = 'sessao_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_sessoes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_praticas" ADD CONSTRAINT "co_praticas_sessao_id_fkey" FOREIGN KEY ("sessao_id") REFERENCES "co_sessoes" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "co_praticas" VALIDATE CONSTRAINT "co_praticas_sessao_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_praticas_sessao_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_praticas_sessao_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [114/384] co_registros_simbolicos_jardim_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_registros_simbolicos_jardim_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_registros_simbolicos' AND column_name = 'jardim_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_jardins' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_registros_simbolicos" ADD CONSTRAINT "co_registros_simbolicos_jardim_id_fkey" FOREIGN KEY ("jardim_id") REFERENCES "co_jardins" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "co_registros_simbolicos" VALIDATE CONSTRAINT "co_registros_simbolicos_jardim_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_registros_simbolicos_jardim_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_registros_simbolicos_jardim_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [115/384] co_registros_simbolicos_sessao_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_registros_simbolicos_sessao_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_registros_simbolicos' AND column_name = 'sessao_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_sessoes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_registros_simbolicos" ADD CONSTRAINT "co_registros_simbolicos_sessao_id_fkey" FOREIGN KEY ("sessao_id") REFERENCES "co_sessoes" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "co_registros_simbolicos" VALIDATE CONSTRAINT "co_registros_simbolicos_sessao_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_registros_simbolicos_sessao_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_registros_simbolicos_sessao_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [116/384] co_sessoes_jardim_ref_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sessoes_jardim_ref_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_sessoes' AND column_name = 'jardim_ref_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_jardins' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_sessoes" ADD CONSTRAINT "co_sessoes_jardim_ref_id_fkey" FOREIGN KEY ("jardim_ref_id") REFERENCES "co_jardins" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "co_sessoes" VALIDATE CONSTRAINT "co_sessoes_jardim_ref_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_sessoes_jardim_ref_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_sessoes_jardim_ref_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [117/384] co_sim_options_proximo_step_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_options_proximo_step_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_sim_options' AND column_name = 'proximo_step_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_sim_steps' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_sim_options" ADD CONSTRAINT "co_sim_options_proximo_step_id_fkey" FOREIGN KEY ("proximo_step_id") REFERENCES "co_sim_steps" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "co_sim_options" VALIDATE CONSTRAINT "co_sim_options_proximo_step_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_sim_options_proximo_step_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_sim_options_proximo_step_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [118/384] co_sim_options_step_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_options_step_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_sim_options' AND column_name = 'step_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_sim_steps' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_sim_options" ADD CONSTRAINT "co_sim_options_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "co_sim_steps" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "co_sim_options" VALIDATE CONSTRAINT "co_sim_options_step_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_sim_options_step_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_sim_options_step_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [119/384] co_sim_progress_case_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_progress_case_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_sim_progress' AND column_name = 'case_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_sim_cases' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_sim_progress" ADD CONSTRAINT "co_sim_progress_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "co_sim_cases" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "co_sim_progress" VALIDATE CONSTRAINT "co_sim_progress_case_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_sim_progress_case_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_sim_progress_case_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [120/384] co_sim_progress_escolha_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_progress_escolha_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_sim_progress' AND column_name = 'escolha_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_sim_options' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_sim_progress" ADD CONSTRAINT "co_sim_progress_escolha_id_fkey" FOREIGN KEY ("escolha_id") REFERENCES "co_sim_options" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "co_sim_progress" VALIDATE CONSTRAINT "co_sim_progress_escolha_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_sim_progress_escolha_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_sim_progress_escolha_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [121/384] co_sim_progress_step_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_progress_step_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_sim_progress' AND column_name = 'step_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_sim_steps' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_sim_progress" ADD CONSTRAINT "co_sim_progress_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "co_sim_steps" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "co_sim_progress" VALIDATE CONSTRAINT "co_sim_progress_step_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_sim_progress_step_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_sim_progress_step_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [122/384] co_sim_steps_case_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_steps_case_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_sim_steps' AND column_name = 'case_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_sim_cases' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_sim_steps" ADD CONSTRAINT "co_sim_steps_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "co_sim_cases" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "co_sim_steps" VALIDATE CONSTRAINT "co_sim_steps_case_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_sim_steps_case_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_sim_steps_case_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [123/384] co_tool_flows_tool_destino_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_tool_flows_tool_destino_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_tool_flows' AND column_name = 'tool_destino_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tools' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_tool_flows" ADD CONSTRAINT "co_tool_flows_tool_destino_id_fkey" FOREIGN KEY ("tool_destino_id") REFERENCES "tools" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "co_tool_flows" VALIDATE CONSTRAINT "co_tool_flows_tool_destino_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_tool_flows_tool_destino_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_tool_flows_tool_destino_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [124/384] co_tool_flows_tool_origem_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_tool_flows_tool_origem_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_tool_flows' AND column_name = 'tool_origem_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tools' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_tool_flows" ADD CONSTRAINT "co_tool_flows_tool_origem_id_fkey" FOREIGN KEY ("tool_origem_id") REFERENCES "tools" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "co_tool_flows" VALIDATE CONSTRAINT "co_tool_flows_tool_origem_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_tool_flows_tool_origem_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_tool_flows_tool_origem_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [125/384] co_tool_usage_tool_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_tool_usage_tool_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_tool_usage' AND column_name = 'tool_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sala_ferramentas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_tool_usage" ADD CONSTRAINT "co_tool_usage_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "sala_ferramentas" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "co_tool_usage" VALIDATE CONSTRAINT "co_tool_usage_tool_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_tool_usage_tool_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_tool_usage_tool_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [126/384] co_training_attempts_case_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_attempts_case_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_training_attempts' AND column_name = 'case_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_training_cases' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_training_attempts" ADD CONSTRAINT "co_training_attempts_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "co_training_cases" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "co_training_attempts" VALIDATE CONSTRAINT "co_training_attempts_case_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_training_attempts_case_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_training_attempts_case_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [127/384] co_training_case_feedbacks_case_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_case_feedbacks_case_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_training_case_feedbacks' AND column_name = 'case_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_training_cases' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_training_case_feedbacks" ADD CONSTRAINT "co_training_case_feedbacks_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "co_training_cases" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "co_training_case_feedbacks" VALIDATE CONSTRAINT "co_training_case_feedbacks_case_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_training_case_feedbacks_case_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_training_case_feedbacks_case_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [128/384] co_training_case_possible_readings_case_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_case_possible_readings_case_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_training_case_possible_readings' AND column_name = 'case_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_training_cases' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_training_case_possible_readings" ADD CONSTRAINT "co_training_case_possible_readings_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "co_training_cases" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "co_training_case_possible_readings" VALIDATE CONSTRAINT "co_training_case_possible_readings_case_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_training_case_possible_readings_case_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_training_case_possible_readings_case_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [129/384] co_training_case_signals_case_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_case_signals_case_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_training_case_signals' AND column_name = 'case_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_training_cases' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_training_case_signals" ADD CONSTRAINT "co_training_case_signals_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "co_training_cases" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "co_training_case_signals" VALIDATE CONSTRAINT "co_training_case_signals_case_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_training_case_signals_case_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_training_case_signals_case_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [130/384] co_training_progress_ultimo_case_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_progress_ultimo_case_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_training_progress' AND column_name = 'ultimo_case_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_training_cases' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_training_progress" ADD CONSTRAINT "co_training_progress_ultimo_case_id_fkey" FOREIGN KEY ("ultimo_case_id") REFERENCES "co_training_cases" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "co_training_progress" VALIDATE CONSTRAINT "co_training_progress_ultimo_case_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_training_progress_ultimo_case_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_training_progress_ultimo_case_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [131/384] co_travessia_encontros_travessia_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_travessia_encontros_travessia_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_travessia_encontros' AND column_name = 'travessia_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_travessias' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_travessia_encontros" ADD CONSTRAINT "co_travessia_encontros_travessia_id_fkey" FOREIGN KEY ("travessia_id") REFERENCES "co_travessias" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "co_travessia_encontros" VALIDATE CONSTRAINT "co_travessia_encontros_travessia_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_travessia_encontros_travessia_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_travessia_encontros_travessia_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [132/384] co_travessia_respostas_encontro_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_travessia_respostas_encontro_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_travessia_respostas' AND column_name = 'encontro_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_travessia_encontros' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_travessia_respostas" ADD CONSTRAINT "co_travessia_respostas_encontro_id_fkey" FOREIGN KEY ("encontro_id") REFERENCES "co_travessia_encontros" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "co_travessia_respostas" VALIDATE CONSTRAINT "co_travessia_respostas_encontro_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_travessia_respostas_encontro_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_travessia_respostas_encontro_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [133/384] co_travessia_respostas_travessia_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_travessia_respostas_travessia_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_travessia_respostas' AND column_name = 'travessia_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_travessias' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_travessia_respostas" ADD CONSTRAINT "co_travessia_respostas_travessia_id_fkey" FOREIGN KEY ("travessia_id") REFERENCES "co_travessias" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "co_travessia_respostas" VALIDATE CONSTRAINT "co_travessia_respostas_travessia_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_travessia_respostas_travessia_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_travessia_respostas_travessia_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [134/384] co_workspace_users_workspace_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_workspace_users_workspace_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_workspace_users' AND column_name = 'workspace_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'co_workspaces' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "co_workspace_users" ADD CONSTRAINT "co_workspace_users_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "co_workspaces" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "co_workspace_users" VALIDATE CONSTRAINT "co_workspace_users_workspace_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped co_workspace_users_workspace_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create co_workspace_users_workspace_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [135/384] collective_bed_entries_bed_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'collective_bed_entries_bed_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'collective_bed_entries' AND column_name = 'bed_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'collective_beds' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "collective_bed_entries" ADD CONSTRAINT "collective_bed_entries_bed_id_fkey" FOREIGN KEY ("bed_id") REFERENCES "collective_beds" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "collective_bed_entries" VALIDATE CONSTRAINT "collective_bed_entries_bed_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped collective_bed_entries_bed_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create collective_bed_entries_bed_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [136/384] collective_bed_entries_season_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'collective_bed_entries_season_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'collective_bed_entries' AND column_name = 'season_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oracular_seasons' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "collective_bed_entries" ADD CONSTRAINT "collective_bed_entries_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "oracular_seasons" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "collective_bed_entries" VALIDATE CONSTRAINT "collective_bed_entries_season_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped collective_bed_entries_season_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create collective_bed_entries_season_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [137/384] collective_beds_season_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'collective_beds_season_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'collective_beds' AND column_name = 'season_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oracular_seasons' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "collective_beds" ADD CONSTRAINT "collective_beds_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "oracular_seasons" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "collective_beds" VALIDATE CONSTRAINT "collective_beds_season_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped collective_beds_season_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create collective_beds_season_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [138/384] community_comments_post_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_comments_post_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'community_comments' AND column_name = 'post_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'community_posts' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "community_posts" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "community_comments" VALIDATE CONSTRAINT "community_comments_post_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped community_comments_post_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create community_comments_post_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [139/384] community_event_participants_event_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_event_participants_event_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'community_event_participants' AND column_name = 'event_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'community_events' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "community_event_participants" ADD CONSTRAINT "community_event_participants_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "community_events" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "community_event_participants" VALIDATE CONSTRAINT "community_event_participants_event_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped community_event_participants_event_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create community_event_participants_event_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [140/384] community_group_members_group_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_group_members_group_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'community_group_members' AND column_name = 'group_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'community_groups' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "community_group_members" ADD CONSTRAINT "community_group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "community_groups" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "community_group_members" VALIDATE CONSTRAINT "community_group_members_group_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped community_group_members_group_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create community_group_members_group_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [141/384] community_likes_post_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_likes_post_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'community_likes' AND column_name = 'post_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'community_posts' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "community_likes" ADD CONSTRAINT "community_likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "community_posts" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "community_likes" VALIDATE CONSTRAINT "community_likes_post_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped community_likes_post_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create community_likes_post_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [142/384] community_topic_replies_topic_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_topic_replies_topic_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'community_topic_replies' AND column_name = 'topic_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'community_topics' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "community_topic_replies" ADD CONSTRAINT "community_topic_replies_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "community_topics" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "community_topic_replies" VALIDATE CONSTRAINT "community_topic_replies_topic_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped community_topic_replies_topic_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create community_topic_replies_topic_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [143/384] community_topics_forum_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_topics_forum_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'community_topics' AND column_name = 'forum_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'community_forums' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "community_topics" ADD CONSTRAINT "community_topics_forum_id_fkey" FOREIGN KEY ("forum_id") REFERENCES "community_forums" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "community_topics" VALIDATE CONSTRAINT "community_topics_forum_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped community_topics_forum_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create community_topics_forum_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [144/384] conselho_partes_internas_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conselho_partes_internas_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'conselho_partes_internas' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "conselho_partes_internas" ADD CONSTRAINT "conselho_partes_internas_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "conselho_partes_internas" VALIDATE CONSTRAINT "conselho_partes_internas_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped conselho_partes_internas_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create conselho_partes_internas_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [145/384] content_blocks_agente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'content_blocks_agente_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'content_blocks' AND column_name = 'agente_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'agentes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "content_blocks" ADD CONSTRAINT "content_blocks_agente_id_fkey" FOREIGN KEY ("agente_id") REFERENCES "agentes" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "content_blocks" VALIDATE CONSTRAINT "content_blocks_agente_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped content_blocks_agente_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create content_blocks_agente_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [146/384] conteudo_aulas_travessia_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conteudo_aulas_travessia_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'conteudo_aulas' AND column_name = 'travessia_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'conteudo_travessias' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "conteudo_aulas" ADD CONSTRAINT "conteudo_aulas_travessia_id_fkey" FOREIGN KEY ("travessia_id") REFERENCES "conteudo_travessias" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "conteudo_aulas" VALIDATE CONSTRAINT "conteudo_aulas_travessia_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped conteudo_aulas_travessia_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create conteudo_aulas_travessia_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [147/384] conteudo_travessias_sala_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conteudo_travessias_sala_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'conteudo_travessias' AND column_name = 'sala_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'salas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "conteudo_travessias" ADD CONSTRAINT "conteudo_travessias_sala_id_fkey" FOREIGN KEY ("sala_id") REFERENCES "salas" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "conteudo_travessias" VALIDATE CONSTRAINT "conteudo_travessias_sala_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped conteudo_travessias_sala_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create conteudo_travessias_sala_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [148/384] contos_clinicos_audio_padrao_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contos_clinicos_audio_padrao_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'contos_clinicos' AND column_name = 'audio_padrao_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'audio_assets' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "contos_clinicos" ADD CONSTRAINT "contos_clinicos_audio_padrao_id_fkey" FOREIGN KEY ("audio_padrao_id") REFERENCES "audio_assets" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "contos_clinicos" VALIDATE CONSTRAINT "contos_clinicos_audio_padrao_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped contos_clinicos_audio_padrao_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create contos_clinicos_audio_padrao_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [149/384] corpo_inconsciente_cliente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'corpo_inconsciente_cliente_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'corpo_inconsciente' AND column_name = 'cliente_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "corpo_inconsciente" ADD CONSTRAINT "corpo_inconsciente_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "corpo_inconsciente" VALIDATE CONSTRAINT "corpo_inconsciente_cliente_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped corpo_inconsciente_cliente_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create corpo_inconsciente_cliente_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [150/384] course_enrollments_course_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_enrollments_course_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'course_enrollments' AND column_name = 'course_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'courses' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "course_enrollments" VALIDATE CONSTRAINT "course_enrollments_course_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped course_enrollments_course_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create course_enrollments_course_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [151/384] course_exercise_responses_lesson_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_exercise_responses_lesson_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'course_exercise_responses' AND column_name = 'lesson_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'course_lessons' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "course_exercise_responses" ADD CONSTRAINT "course_exercise_responses_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "course_lessons" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "course_exercise_responses" VALIDATE CONSTRAINT "course_exercise_responses_lesson_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped course_exercise_responses_lesson_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create course_exercise_responses_lesson_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [152/384] course_lesson_progress_lesson_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_lesson_progress_lesson_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'course_lesson_progress' AND column_name = 'lesson_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'course_lessons' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "course_lesson_progress" ADD CONSTRAINT "course_lesson_progress_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "course_lessons" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "course_lesson_progress" VALIDATE CONSTRAINT "course_lesson_progress_lesson_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped course_lesson_progress_lesson_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create course_lesson_progress_lesson_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [153/384] course_lessons_module_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_lessons_module_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'course_lessons' AND column_name = 'module_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'course_modules' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "course_lessons" ADD CONSTRAINT "course_lessons_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "course_modules" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "course_lessons" VALIDATE CONSTRAINT "course_lessons_module_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped course_lessons_module_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create course_lessons_module_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [154/384] course_module_forum_posts_module_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_module_forum_posts_module_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'course_module_forum_posts' AND column_name = 'module_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'course_modules' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "course_module_forum_posts" ADD CONSTRAINT "course_module_forum_posts_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "course_modules" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "course_module_forum_posts" VALIDATE CONSTRAINT "course_module_forum_posts_module_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped course_module_forum_posts_module_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create course_module_forum_posts_module_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [155/384] course_module_forum_posts_parent_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_module_forum_posts_parent_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'course_module_forum_posts' AND column_name = 'parent_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'course_module_forum_posts' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "course_module_forum_posts" ADD CONSTRAINT "course_module_forum_posts_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "course_module_forum_posts" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "course_module_forum_posts" VALIDATE CONSTRAINT "course_module_forum_posts_parent_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped course_module_forum_posts_parent_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create course_module_forum_posts_parent_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [156/384] course_modules_course_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_modules_course_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'course_modules' AND column_name = 'course_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'courses' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "course_modules" ADD CONSTRAINT "course_modules_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "course_modules" VALIDATE CONSTRAINT "course_modules_course_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped course_modules_course_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create course_modules_course_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [157/384] course_work_submissions_course_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_work_submissions_course_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'course_work_submissions' AND column_name = 'course_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'courses' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "course_work_submissions" ADD CONSTRAINT "course_work_submissions_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "course_work_submissions" VALIDATE CONSTRAINT "course_work_submissions_course_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped course_work_submissions_course_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create course_work_submissions_course_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [158/384] courses_sala_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'courses_sala_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'courses' AND column_name = 'sala_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'salas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "courses" ADD CONSTRAINT "courses_sala_id_fkey" FOREIGN KEY ("sala_id") REFERENCES "salas" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "courses" VALIDATE CONSTRAINT "courses_sala_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped courses_sala_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create courses_sala_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [159/384] custom_oracle_cards_custom_oracle_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'custom_oracle_cards_custom_oracle_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'custom_oracle_cards' AND column_name = 'custom_oracle_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'custom_oracles' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "custom_oracle_cards" ADD CONSTRAINT "custom_oracle_cards_custom_oracle_id_fkey" FOREIGN KEY ("custom_oracle_id") REFERENCES "custom_oracles" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "custom_oracle_cards" VALIDATE CONSTRAINT "custom_oracle_cards_custom_oracle_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped custom_oracle_cards_custom_oracle_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create custom_oracle_cards_custom_oracle_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [160/384] cycle_books_book_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cycle_books_book_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'cycle_books' AND column_name = 'book_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'books' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "cycle_books" ADD CONSTRAINT "cycle_books_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "cycle_books" VALIDATE CONSTRAINT "cycle_books_book_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped cycle_books_book_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create cycle_books_book_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [161/384] cycle_books_cycle_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cycle_books_cycle_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'cycle_books' AND column_name = 'cycle_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'cycles' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "cycle_books" ADD CONSTRAINT "cycle_books_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "cycles" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "cycle_books" VALIDATE CONSTRAINT "cycle_books_cycle_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped cycle_books_cycle_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create cycle_books_cycle_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [162/384] decodificacao_onirica_cliente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'decodificacao_onirica_cliente_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'decodificacao_onirica' AND column_name = 'cliente_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "decodificacao_onirica" ADD CONSTRAINT "decodificacao_onirica_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "decodificacao_onirica" VALIDATE CONSTRAINT "decodificacao_onirica_cliente_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped decodificacao_onirica_cliente_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create decodificacao_onirica_cliente_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [163/384] decodificacao_onirica_session_case_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'decodificacao_onirica_session_case_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'decodificacao_onirica' AND column_name = 'session_case_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_cases' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "decodificacao_onirica" ADD CONSTRAINT "decodificacao_onirica_session_case_id_fkey" FOREIGN KEY ("session_case_id") REFERENCES "session_cases" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "decodificacao_onirica" VALIDATE CONSTRAINT "decodificacao_onirica_session_case_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped decodificacao_onirica_session_case_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create decodificacao_onirica_session_case_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [164/384] diagnostico_ego_cliente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'diagnostico_ego_cliente_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'diagnostico_ego' AND column_name = 'cliente_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "diagnostico_ego" ADD CONSTRAINT "diagnostico_ego_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "diagnostico_ego" VALIDATE CONSTRAINT "diagnostico_ego_cliente_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped diagnostico_ego_cliente_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create diagnostico_ego_cliente_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [165/384] district_state_changes_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'district_state_changes_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'district_state_changes' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "district_state_changes" ADD CONSTRAINT "district_state_changes_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "district_state_changes" VALIDATE CONSTRAINT "district_state_changes_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped district_state_changes_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create district_state_changes_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [166/384] district_state_changes_district_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'district_state_changes_district_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'district_state_changes' AND column_name = 'district_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'districts' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "district_state_changes" ADD CONSTRAINT "district_state_changes_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "district_state_changes" VALIDATE CONSTRAINT "district_state_changes_district_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped district_state_changes_district_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create district_state_changes_district_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [167/384] dreams_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'dreams_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'dreams' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "dreams" ADD CONSTRAINT "dreams_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "dreams" VALIDATE CONSTRAINT "dreams_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped dreams_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create dreams_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [168/384] dreams_session_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'dreams_session_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'dreams' AND column_name = 'session_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sessions' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "dreams" ADD CONSTRAINT "dreams_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "dreams" VALIDATE CONSTRAINT "dreams_session_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped dreams_session_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create dreams_session_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [169/384] email_logs_user_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'email_logs_user_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'email_logs' AND column_name = 'user_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'profiles' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "email_logs" VALIDATE CONSTRAINT "email_logs_user_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped email_logs_user_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create email_logs_user_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [170/384] eneagrama_feminino_afirmacoes_arquetipo_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'eneagrama_feminino_afirmacoes_arquetipo_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'eneagrama_feminino_afirmacoes' AND column_name = 'arquetipo_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'eneagrama_feminino_arquetipos' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "eneagrama_feminino_afirmacoes" ADD CONSTRAINT "eneagrama_feminino_afirmacoes_arquetipo_id_fkey" FOREIGN KEY ("arquetipo_id") REFERENCES "eneagrama_feminino_arquetipos" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "eneagrama_feminino_afirmacoes" VALIDATE CONSTRAINT "eneagrama_feminino_afirmacoes_arquetipo_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped eneagrama_feminino_afirmacoes_arquetipo_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create eneagrama_feminino_afirmacoes_arquetipo_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [171/384] eneagrama_feminino_orientacoes_arquetipo_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'eneagrama_feminino_orientacoes_arquetipo_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'eneagrama_feminino_orientacoes' AND column_name = 'arquetipo_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'eneagrama_feminino_arquetipos' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "eneagrama_feminino_orientacoes" ADD CONSTRAINT "eneagrama_feminino_orientacoes_arquetipo_id_fkey" FOREIGN KEY ("arquetipo_id") REFERENCES "eneagrama_feminino_arquetipos" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "eneagrama_feminino_orientacoes" VALIDATE CONSTRAINT "eneagrama_feminino_orientacoes_arquetipo_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped eneagrama_feminino_orientacoes_arquetipo_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create eneagrama_feminino_orientacoes_arquetipo_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [172/384] eneagrama_feminino_registros_session_case_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'eneagrama_feminino_registros_session_case_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'eneagrama_feminino_registros' AND column_name = 'session_case_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_cases' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "eneagrama_feminino_registros" ADD CONSTRAINT "eneagrama_feminino_registros_session_case_id_fkey" FOREIGN KEY ("session_case_id") REFERENCES "session_cases" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "eneagrama_feminino_registros" VALIDATE CONSTRAINT "eneagrama_feminino_registros_session_case_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped eneagrama_feminino_registros_session_case_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create eneagrama_feminino_registros_session_case_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [173/384] escrita_nao_censurada_cliente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'escrita_nao_censurada_cliente_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'escrita_nao_censurada' AND column_name = 'cliente_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "escrita_nao_censurada" ADD CONSTRAINT "escrita_nao_censurada_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "escrita_nao_censurada" VALIDATE CONSTRAINT "escrita_nao_censurada_cliente_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped escrita_nao_censurada_cliente_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create escrita_nao_censurada_cliente_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [174/384] estudio_projetos_book_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'estudio_projetos_book_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'estudio_projetos' AND column_name = 'book_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'books' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "estudio_projetos" ADD CONSTRAINT "estudio_projetos_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "estudio_projetos" VALIDATE CONSTRAINT "estudio_projetos_book_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped estudio_projetos_book_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create estudio_projetos_book_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [175/384] estudos_caso_respostas_estudo_caso_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'estudos_caso_respostas_estudo_caso_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'estudos_caso_respostas' AND column_name = 'estudo_caso_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'estudos_caso' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "estudos_caso_respostas" ADD CONSTRAINT "estudos_caso_respostas_estudo_caso_id_fkey" FOREIGN KEY ("estudo_caso_id") REFERENCES "estudos_caso" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "estudos_caso_respostas" VALIDATE CONSTRAINT "estudos_caso_respostas_estudo_caso_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped estudos_caso_respostas_estudo_caso_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create estudos_caso_respostas_estudo_caso_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [176/384] exercise_responses_exercise_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exercise_responses_exercise_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'exercise_responses' AND column_name = 'exercise_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'exercises' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "exercise_responses" ADD CONSTRAINT "exercise_responses_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "exercise_responses" VALIDATE CONSTRAINT "exercise_responses_exercise_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped exercise_responses_exercise_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create exercise_responses_exercise_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [177/384] exercises_lesson_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exercises_lesson_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'exercises' AND column_name = 'lesson_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'lessons' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "exercises" ADD CONSTRAINT "exercises_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "exercises" VALIDATE CONSTRAINT "exercises_lesson_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped exercises_lesson_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create exercises_lesson_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [178/384] ferramenta_registros_cliente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ferramenta_registros_cliente_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'ferramenta_registros' AND column_name = 'cliente_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "ferramenta_registros" ADD CONSTRAINT "ferramenta_registros_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "ferramenta_registros" VALIDATE CONSTRAINT "ferramenta_registros_cliente_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped ferramenta_registros_cliente_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create ferramenta_registros_cliente_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [179/384] ferramenta_registros_ferramenta_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ferramenta_registros_ferramenta_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'ferramenta_registros' AND column_name = 'ferramenta_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sala_ferramentas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "ferramenta_registros" ADD CONSTRAINT "ferramenta_registros_ferramenta_id_fkey" FOREIGN KEY ("ferramenta_id") REFERENCES "sala_ferramentas" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "ferramenta_registros" VALIDATE CONSTRAINT "ferramenta_registros_ferramenta_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped ferramenta_registros_ferramenta_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create ferramenta_registros_ferramenta_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [180/384] fk_big5_caso
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_big5_caso') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'big5_registros' AND column_name = 'caso_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'casos' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "big5_registros" ADD CONSTRAINT "fk_big5_caso" FOREIGN KEY ("caso_id") REFERENCES "casos" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "big5_registros" VALIDATE CONSTRAINT "fk_big5_caso"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped fk_big5_caso: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create fk_big5_caso: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [181/384] fk_eneagrama_caso
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_eneagrama_caso') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'eneagrama_registros' AND column_name = 'caso_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'casos' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "eneagrama_registros" ADD CONSTRAINT "fk_eneagrama_caso" FOREIGN KEY ("caso_id") REFERENCES "casos" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "eneagrama_registros" VALIDATE CONSTRAINT "fk_eneagrama_caso"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped fk_eneagrama_caso: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create fk_eneagrama_caso: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [182/384] formacao_modulos_formacao_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'formacao_modulos_formacao_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'formacao_modulos' AND column_name = 'formacao_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'formacoes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "formacao_modulos" ADD CONSTRAINT "formacao_modulos_formacao_id_fkey" FOREIGN KEY ("formacao_id") REFERENCES "formacoes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "formacao_modulos" VALIDATE CONSTRAINT "formacao_modulos_formacao_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped formacao_modulos_formacao_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create formacao_modulos_formacao_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [183/384] founding_archetypes_distrito_principal_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'founding_archetypes_distrito_principal_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'founding_archetypes' AND column_name = 'distrito_principal_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'city_districts' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "founding_archetypes" ADD CONSTRAINT "founding_archetypes_distrito_principal_id_fkey" FOREIGN KEY ("distrito_principal_id") REFERENCES "city_districts" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "founding_archetypes" VALIDATE CONSTRAINT "founding_archetypes_distrito_principal_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped founding_archetypes_distrito_principal_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create founding_archetypes_distrito_principal_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [184/384] gestos_integracao_cliente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'gestos_integracao_cliente_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'gestos_integracao' AND column_name = 'cliente_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "gestos_integracao" ADD CONSTRAINT "gestos_integracao_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "gestos_integracao" VALIDATE CONSTRAINT "gestos_integracao_cliente_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped gestos_integracao_cliente_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create gestos_integracao_cliente_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [185/384] gestos_integracao_sessao_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'gestos_integracao_sessao_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'gestos_integracao' AND column_name = 'sessao_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sessoes_casa_maquinas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "gestos_integracao" ADD CONSTRAINT "gestos_integracao_sessao_id_fkey" FOREIGN KEY ("sessao_id") REFERENCES "sessoes_casa_maquinas" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "gestos_integracao" VALIDATE CONSTRAINT "gestos_integracao_sessao_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped gestos_integracao_sessao_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create gestos_integracao_sessao_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [186/384] group_encounters_group_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_encounters_group_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'group_encounters' AND column_name = 'group_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'therapy_groups' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "group_encounters" ADD CONSTRAINT "group_encounters_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "therapy_groups" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "group_encounters" VALIDATE CONSTRAINT "group_encounters_group_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped group_encounters_group_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create group_encounters_group_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [187/384] group_field_snapshots_circulo_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_field_snapshots_circulo_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'group_field_snapshots' AND column_name = 'circulo_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'circulos_sagrados' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "group_field_snapshots" ADD CONSTRAINT "group_field_snapshots_circulo_id_fkey" FOREIGN KEY ("circulo_id") REFERENCES "circulos_sagrados" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "group_field_snapshots" VALIDATE CONSTRAINT "group_field_snapshots_circulo_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped group_field_snapshots_circulo_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create group_field_snapshots_circulo_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [188/384] group_field_snapshots_group_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_field_snapshots_group_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'group_field_snapshots' AND column_name = 'group_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'therapeutic_groups' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "group_field_snapshots" ADD CONSTRAINT "group_field_snapshots_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "therapeutic_groups" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "group_field_snapshots" VALIDATE CONSTRAINT "group_field_snapshots_group_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped group_field_snapshots_group_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create group_field_snapshots_group_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [189/384] group_members_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_members_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'group_members' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "group_members" ADD CONSTRAINT "group_members_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "group_members" VALIDATE CONSTRAINT "group_members_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped group_members_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create group_members_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [190/384] group_members_group_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_members_group_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'group_members' AND column_name = 'group_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'therapy_groups' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "group_members" ADD CONSTRAINT "group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "therapy_groups" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "group_members" VALIDATE CONSTRAINT "group_members_group_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped group_members_group_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create group_members_group_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [191/384] group_participants_cliente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_participants_cliente_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'group_participants' AND column_name = 'cliente_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "group_participants" ADD CONSTRAINT "group_participants_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "group_participants" VALIDATE CONSTRAINT "group_participants_cliente_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped group_participants_cliente_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create group_participants_cliente_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [192/384] group_participants_group_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_participants_group_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'group_participants' AND column_name = 'group_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'therapeutic_groups' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "group_participants" ADD CONSTRAINT "group_participants_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "therapeutic_groups" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "group_participants" VALIDATE CONSTRAINT "group_participants_group_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped group_participants_group_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create group_participants_group_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [193/384] group_sessions_group_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_sessions_group_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'group_sessions' AND column_name = 'group_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'therapeutic_groups' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "group_sessions" ADD CONSTRAINT "group_sessions_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "therapeutic_groups" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "group_sessions" VALIDATE CONSTRAINT "group_sessions_group_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped group_sessions_group_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create group_sessions_group_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [194/384] heroina_arquetipo_registros_arquetipo_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_arquetipo_registros_arquetipo_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'heroina_arquetipo_registros' AND column_name = 'arquetipo_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_arquetipos' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "heroina_arquetipo_registros" ADD CONSTRAINT "heroina_arquetipo_registros_arquetipo_id_fkey" FOREIGN KEY ("arquetipo_id") REFERENCES "labirinto_arquetipos" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "heroina_arquetipo_registros" VALIDATE CONSTRAINT "heroina_arquetipo_registros_arquetipo_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped heroina_arquetipo_registros_arquetipo_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create heroina_arquetipo_registros_arquetipo_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [195/384] heroina_cenario_registros_metafora_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_cenario_registros_metafora_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'heroina_cenario_registros' AND column_name = 'metafora_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_metaforas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "heroina_cenario_registros" ADD CONSTRAINT "heroina_cenario_registros_metafora_id_fkey" FOREIGN KEY ("metafora_id") REFERENCES "labirinto_metaforas" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "heroina_cenario_registros" VALIDATE CONSTRAINT "heroina_cenario_registros_metafora_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped heroina_cenario_registros_metafora_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create heroina_cenario_registros_metafora_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [196/384] heroina_fase_ativa_fase_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_fase_ativa_fase_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'heroina_fase_ativa' AND column_name = 'fase_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_fases' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "heroina_fase_ativa" ADD CONSTRAINT "heroina_fase_ativa_fase_id_fkey" FOREIGN KEY ("fase_id") REFERENCES "labirinto_fases" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "heroina_fase_ativa" VALIDATE CONSTRAINT "heroina_fase_ativa_fase_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped heroina_fase_ativa_fase_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create heroina_fase_ativa_fase_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [197/384] heroina_ritual_registros_ritual_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_ritual_registros_ritual_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'heroina_ritual_registros' AND column_name = 'ritual_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_rituais' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "heroina_ritual_registros" ADD CONSTRAINT "heroina_ritual_registros_ritual_id_fkey" FOREIGN KEY ("ritual_id") REFERENCES "labirinto_rituais" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "heroina_ritual_registros" VALIDATE CONSTRAINT "heroina_ritual_registros_ritual_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped heroina_ritual_registros_ritual_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create heroina_ritual_registros_ritual_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [198/384] imaginacao_ativa_cliente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'imaginacao_ativa_cliente_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'imaginacao_ativa' AND column_name = 'cliente_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "imaginacao_ativa" ADD CONSTRAINT "imaginacao_ativa_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "imaginacao_ativa" VALIDATE CONSTRAINT "imaginacao_ativa_cliente_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped imaginacao_ativa_cliente_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create imaginacao_ativa_cliente_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [199/384] intervention_favorites_intervention_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'intervention_favorites_intervention_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'intervention_favorites' AND column_name = 'intervention_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'interventions' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "intervention_favorites" ADD CONSTRAINT "intervention_favorites_intervention_id_fkey" FOREIGN KEY ("intervention_id") REFERENCES "interventions" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "intervention_favorites" VALIDATE CONSTRAINT "intervention_favorites_intervention_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped intervention_favorites_intervention_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create intervention_favorites_intervention_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [200/384] interventions_district_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'interventions_district_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'interventions' AND column_name = 'district_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'districts' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "interventions" ADD CONSTRAINT "interventions_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "interventions" VALIDATE CONSTRAINT "interventions_district_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped interventions_district_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create interventions_district_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [201/384] inventario_personas_cliente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'inventario_personas_cliente_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'inventario_personas' AND column_name = 'cliente_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "inventario_personas" ADD CONSTRAINT "inventario_personas_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "inventario_personas" VALIDATE CONSTRAINT "inventario_personas_cliente_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped inventario_personas_cliente_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create inventario_personas_cliente_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [202/384] jardim_do_oficio_cliente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_do_oficio_cliente_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'jardim_do_oficio' AND column_name = 'cliente_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "jardim_do_oficio" ADD CONSTRAINT "jardim_do_oficio_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "jardim_do_oficio" VALIDATE CONSTRAINT "jardim_do_oficio_cliente_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped jardim_do_oficio_cliente_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create jardim_do_oficio_cliente_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [203/384] jardim_do_oficio_sessao_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_do_oficio_sessao_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'jardim_do_oficio' AND column_name = 'sessao_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sessoes_casa_maquinas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "jardim_do_oficio" ADD CONSTRAINT "jardim_do_oficio_sessao_id_fkey" FOREIGN KEY ("sessao_id") REFERENCES "sessoes_casa_maquinas" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "jardim_do_oficio" VALIDATE CONSTRAINT "jardim_do_oficio_sessao_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped jardim_do_oficio_sessao_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create jardim_do_oficio_sessao_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [204/384] jardim_grupo_registros_group_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_grupo_registros_group_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'jardim_grupo_registros' AND column_name = 'group_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'therapeutic_groups' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "jardim_grupo_registros" ADD CONSTRAINT "jardim_grupo_registros_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "therapeutic_groups" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "jardim_grupo_registros" VALIDATE CONSTRAINT "jardim_grupo_registros_group_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped jardim_grupo_registros_group_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create jardim_grupo_registros_group_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [205/384] jardim_grupo_registros_session_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_grupo_registros_session_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'jardim_grupo_registros' AND column_name = 'session_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'group_sessions' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "jardim_grupo_registros" ADD CONSTRAINT "jardim_grupo_registros_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "group_sessions" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "jardim_grupo_registros" VALIDATE CONSTRAINT "jardim_grupo_registros_session_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped jardim_grupo_registros_session_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create jardim_grupo_registros_session_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [206/384] jardim_heroina_case_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_case_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'jardim_heroina' AND column_name = 'case_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_cases' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "jardim_heroina" ADD CONSTRAINT "jardim_heroina_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "session_cases" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "jardim_heroina" VALIDATE CONSTRAINT "jardim_heroina_case_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped jardim_heroina_case_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create jardim_heroina_case_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [207/384] jardim_heroina_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'jardim_heroina' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "jardim_heroina" ADD CONSTRAINT "jardim_heroina_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "jardim_heroina" VALIDATE CONSTRAINT "jardim_heroina_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped jardim_heroina_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create jardim_heroina_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [208/384] jardim_heroina_registros_mapa_vivo_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_registros_mapa_vivo_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'jardim_heroina_registros' AND column_name = 'mapa_vivo_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'mapa_vivo_heroina' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "jardim_heroina_registros" ADD CONSTRAINT "jardim_heroina_registros_mapa_vivo_id_fkey" FOREIGN KEY ("mapa_vivo_id") REFERENCES "mapa_vivo_heroina" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "jardim_heroina_registros" VALIDATE CONSTRAINT "jardim_heroina_registros_mapa_vivo_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped jardim_heroina_registros_mapa_vivo_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create jardim_heroina_registros_mapa_vivo_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [209/384] jardim_heroina_registros_mapa_vivo_origem_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_registros_mapa_vivo_origem_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'jardim_heroina_registros' AND column_name = 'mapa_vivo_origem_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'mapa_vivo_heroina' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "jardim_heroina_registros" ADD CONSTRAINT "jardim_heroina_registros_mapa_vivo_origem_id_fkey" FOREIGN KEY ("mapa_vivo_origem_id") REFERENCES "mapa_vivo_heroina" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "jardim_heroina_registros" VALIDATE CONSTRAINT "jardim_heroina_registros_mapa_vivo_origem_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped jardim_heroina_registros_mapa_vivo_origem_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create jardim_heroina_registros_mapa_vivo_origem_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [210/384] jardim_heroina_registros_session_case_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_registros_session_case_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'jardim_heroina_registros' AND column_name = 'session_case_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_cases' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "jardim_heroina_registros" ADD CONSTRAINT "jardim_heroina_registros_session_case_id_fkey" FOREIGN KEY ("session_case_id") REFERENCES "session_cases" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "jardim_heroina_registros" VALIDATE CONSTRAINT "jardim_heroina_registros_session_case_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped jardim_heroina_registros_session_case_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create jardim_heroina_registros_session_case_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [211/384] jornada_heroina_notas_profissionais_registro_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_notas_profissionais_registro_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'jornada_heroina_notas_profissionais' AND column_name = 'registro_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'jornada_heroina_registros' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "jornada_heroina_notas_profissionais" ADD CONSTRAINT "jornada_heroina_notas_profissionais_registro_id_fkey" FOREIGN KEY ("registro_id") REFERENCES "jornada_heroina_registros" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "jornada_heroina_notas_profissionais" VALIDATE CONSTRAINT "jornada_heroina_notas_profissionais_registro_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped jornada_heroina_notas_profissionais_registro_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create jornada_heroina_notas_profissionais_registro_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [212/384] jornada_heroina_registros_cliente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_registros_cliente_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'jornada_heroina_registros' AND column_name = 'cliente_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "jornada_heroina_registros" ADD CONSTRAINT "jornada_heroina_registros_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "jornada_heroina_registros" VALIDATE CONSTRAINT "jornada_heroina_registros_cliente_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped jornada_heroina_registros_cliente_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create jornada_heroina_registros_cliente_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [213/384] jornada_heroina_registros_session_case_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_registros_session_case_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'jornada_heroina_registros' AND column_name = 'session_case_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_cases' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "jornada_heroina_registros" ADD CONSTRAINT "jornada_heroina_registros_session_case_id_fkey" FOREIGN KEY ("session_case_id") REFERENCES "session_cases" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "jornada_heroina_registros" VALIDATE CONSTRAINT "jornada_heroina_registros_session_case_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped jornada_heroina_registros_session_case_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create jornada_heroina_registros_session_case_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [214/384] jornada_heroina_respostas_registro_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_respostas_registro_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'jornada_heroina_respostas' AND column_name = 'registro_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'jornada_heroina_registros' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "jornada_heroina_respostas" ADD CONSTRAINT "jornada_heroina_respostas_registro_id_fkey" FOREIGN KEY ("registro_id") REFERENCES "jornada_heroina_registros" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "jornada_heroina_respostas" VALIDATE CONSTRAINT "jornada_heroina_respostas_registro_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped jornada_heroina_respostas_registro_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create jornada_heroina_respostas_registro_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [215/384] jornada_individuacao_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_individuacao_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'jornada_individuacao' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "jornada_individuacao" ADD CONSTRAINT "jornada_individuacao_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "jornada_individuacao" VALIDATE CONSTRAINT "jornada_individuacao_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped jornada_individuacao_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create jornada_individuacao_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [216/384] journey_districts_district_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_districts_district_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'journey_districts' AND column_name = 'district_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'districts' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "journey_districts" ADD CONSTRAINT "journey_districts_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "journey_districts" VALIDATE CONSTRAINT "journey_districts_district_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped journey_districts_district_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create journey_districts_district_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [217/384] journey_districts_journey_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_districts_journey_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'journey_districts' AND column_name = 'journey_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'journeys' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "journey_districts" ADD CONSTRAINT "journey_districts_journey_id_fkey" FOREIGN KEY ("journey_id") REFERENCES "journeys" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "journey_districts" VALIDATE CONSTRAINT "journey_districts_journey_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped journey_districts_journey_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create journey_districts_journey_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [218/384] journey_events_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_events_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'journey_events' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "journey_events" ADD CONSTRAINT "journey_events_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "journey_events" VALIDATE CONSTRAINT "journey_events_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped journey_events_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create journey_events_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [219/384] journey_events_session_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_events_session_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'journey_events' AND column_name = 'session_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sessions' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "journey_events" ADD CONSTRAINT "journey_events_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "journey_events" VALIDATE CONSTRAINT "journey_events_session_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped journey_events_session_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create journey_events_session_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [220/384] journey_media_journey_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_media_journey_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'journey_media' AND column_name = 'journey_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_jornadas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "journey_media" ADD CONSTRAINT "journey_media_journey_id_fkey" FOREIGN KEY ("journey_id") REFERENCES "clube_jornadas" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "journey_media" VALIDATE CONSTRAINT "journey_media_journey_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped journey_media_journey_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create journey_media_journey_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [221/384] journey_reflections_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_reflections_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'journey_reflections' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "journey_reflections" ADD CONSTRAINT "journey_reflections_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "journey_reflections" VALIDATE CONSTRAINT "journey_reflections_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped journey_reflections_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create journey_reflections_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [222/384] journeys_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journeys_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'journeys' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "journeys" ADD CONSTRAINT "journeys_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "journeys" VALIDATE CONSTRAINT "journeys_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped journeys_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create journeys_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [223/384] journeys_current_district_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journeys_current_district_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'journeys' AND column_name = 'current_district_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'districts' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "journeys" ADD CONSTRAINT "journeys_current_district_id_fkey" FOREIGN KEY ("current_district_id") REFERENCES "districts" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "journeys" VALIDATE CONSTRAINT "journeys_current_district_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped journeys_current_district_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create journeys_current_district_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [224/384] lab_8020_progress_book_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lab_8020_progress_book_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'lab_8020_progress' AND column_name = 'book_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'books' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "lab_8020_progress" ADD CONSTRAINT "lab_8020_progress_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "lab_8020_progress" VALIDATE CONSTRAINT "lab_8020_progress_book_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped lab_8020_progress_book_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create lab_8020_progress_book_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [225/384] lab_8020_progress_season_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lab_8020_progress_season_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'lab_8020_progress' AND column_name = 'season_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oracular_seasons' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "lab_8020_progress" ADD CONSTRAINT "lab_8020_progress_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "oracular_seasons" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "lab_8020_progress" VALIDATE CONSTRAINT "lab_8020_progress_season_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped lab_8020_progress_season_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create lab_8020_progress_season_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [226/384] labirinto_39_portas_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_39_portas_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_39_portas' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "labirinto_39_portas" ADD CONSTRAINT "labirinto_39_portas_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "labirinto_39_portas" VALIDATE CONSTRAINT "labirinto_39_portas_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped labirinto_39_portas_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create labirinto_39_portas_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [227/384] labirinto_anotacoes_cliente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_anotacoes_cliente_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_anotacoes' AND column_name = 'cliente_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "labirinto_anotacoes" ADD CONSTRAINT "labirinto_anotacoes_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "labirinto_anotacoes" VALIDATE CONSTRAINT "labirinto_anotacoes_cliente_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped labirinto_anotacoes_cliente_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create labirinto_anotacoes_cliente_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [228/384] labirinto_anotacoes_porta_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_anotacoes_porta_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_anotacoes' AND column_name = 'porta_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_portas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "labirinto_anotacoes" ADD CONSTRAINT "labirinto_anotacoes_porta_id_fkey" FOREIGN KEY ("porta_id") REFERENCES "labirinto_portas" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "labirinto_anotacoes" VALIDATE CONSTRAINT "labirinto_anotacoes_porta_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped labirinto_anotacoes_porta_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create labirinto_anotacoes_porta_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [229/384] labirinto_leituras_cliente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_leituras_cliente_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_leituras' AND column_name = 'cliente_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "labirinto_leituras" ADD CONSTRAINT "labirinto_leituras_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "labirinto_leituras" VALIDATE CONSTRAINT "labirinto_leituras_cliente_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped labirinto_leituras_cliente_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create labirinto_leituras_cliente_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [230/384] labirinto_leituras_porta_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_leituras_porta_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_leituras' AND column_name = 'porta_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_portas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "labirinto_leituras" ADD CONSTRAINT "labirinto_leituras_porta_id_fkey" FOREIGN KEY ("porta_id") REFERENCES "labirinto_portas" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "labirinto_leituras" VALIDATE CONSTRAINT "labirinto_leituras_porta_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped labirinto_leituras_porta_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create labirinto_leituras_porta_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [231/384] labirinto_registros_arquetipo_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_arquetipo_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_registros' AND column_name = 'arquetipo_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_arquetipos' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "labirinto_registros" ADD CONSTRAINT "labirinto_registros_arquetipo_id_fkey" FOREIGN KEY ("arquetipo_id") REFERENCES "labirinto_arquetipos" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "labirinto_registros" VALIDATE CONSTRAINT "labirinto_registros_arquetipo_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped labirinto_registros_arquetipo_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create labirinto_registros_arquetipo_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [232/384] labirinto_registros_fase_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_fase_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_registros' AND column_name = 'fase_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_fases' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "labirinto_registros" ADD CONSTRAINT "labirinto_registros_fase_id_fkey" FOREIGN KEY ("fase_id") REFERENCES "labirinto_fases" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "labirinto_registros" VALIDATE CONSTRAINT "labirinto_registros_fase_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped labirinto_registros_fase_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create labirinto_registros_fase_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [233/384] labirinto_registros_metafora_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_metafora_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_registros' AND column_name = 'metafora_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_metaforas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "labirinto_registros" ADD CONSTRAINT "labirinto_registros_metafora_id_fkey" FOREIGN KEY ("metafora_id") REFERENCES "labirinto_metaforas" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "labirinto_registros" VALIDATE CONSTRAINT "labirinto_registros_metafora_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped labirinto_registros_metafora_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create labirinto_registros_metafora_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [234/384] labirinto_registros_ritual_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_ritual_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_registros' AND column_name = 'ritual_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_rituais' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "labirinto_registros" ADD CONSTRAINT "labirinto_registros_ritual_id_fkey" FOREIGN KEY ("ritual_id") REFERENCES "labirinto_rituais" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "labirinto_registros" VALIDATE CONSTRAINT "labirinto_registros_ritual_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped labirinto_registros_ritual_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create labirinto_registros_ritual_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [235/384] labirinto_registros_session_case_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_session_case_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_registros' AND column_name = 'session_case_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_cases' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "labirinto_registros" ADD CONSTRAINT "labirinto_registros_session_case_id_fkey" FOREIGN KEY ("session_case_id") REFERENCES "session_cases" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "labirinto_registros" VALIDATE CONSTRAINT "labirinto_registros_session_case_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped labirinto_registros_session_case_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create labirinto_registros_session_case_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [236/384] labirinto_roteiros_gerados_arquetipo_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_arquetipo_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_roteiros_gerados' AND column_name = 'arquetipo_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_arquetipos' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "labirinto_roteiros_gerados" ADD CONSTRAINT "labirinto_roteiros_gerados_arquetipo_id_fkey" FOREIGN KEY ("arquetipo_id") REFERENCES "labirinto_arquetipos" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "labirinto_roteiros_gerados" VALIDATE CONSTRAINT "labirinto_roteiros_gerados_arquetipo_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped labirinto_roteiros_gerados_arquetipo_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create labirinto_roteiros_gerados_arquetipo_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [237/384] labirinto_roteiros_gerados_fase_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_fase_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_roteiros_gerados' AND column_name = 'fase_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_fases' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "labirinto_roteiros_gerados" ADD CONSTRAINT "labirinto_roteiros_gerados_fase_id_fkey" FOREIGN KEY ("fase_id") REFERENCES "labirinto_fases" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "labirinto_roteiros_gerados" VALIDATE CONSTRAINT "labirinto_roteiros_gerados_fase_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped labirinto_roteiros_gerados_fase_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create labirinto_roteiros_gerados_fase_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [238/384] labirinto_roteiros_gerados_metafora_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_metafora_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_roteiros_gerados' AND column_name = 'metafora_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_metaforas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "labirinto_roteiros_gerados" ADD CONSTRAINT "labirinto_roteiros_gerados_metafora_id_fkey" FOREIGN KEY ("metafora_id") REFERENCES "labirinto_metaforas" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "labirinto_roteiros_gerados" VALIDATE CONSTRAINT "labirinto_roteiros_gerados_metafora_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped labirinto_roteiros_gerados_metafora_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create labirinto_roteiros_gerados_metafora_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [239/384] labirinto_roteiros_gerados_ritual_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_ritual_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_roteiros_gerados' AND column_name = 'ritual_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_rituais' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "labirinto_roteiros_gerados" ADD CONSTRAINT "labirinto_roteiros_gerados_ritual_id_fkey" FOREIGN KEY ("ritual_id") REFERENCES "labirinto_rituais" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "labirinto_roteiros_gerados" VALIDATE CONSTRAINT "labirinto_roteiros_gerados_ritual_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped labirinto_roteiros_gerados_ritual_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create labirinto_roteiros_gerados_ritual_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [240/384] labirinto_roteiros_gerados_session_case_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_session_case_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_roteiros_gerados' AND column_name = 'session_case_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_cases' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "labirinto_roteiros_gerados" ADD CONSTRAINT "labirinto_roteiros_gerados_session_case_id_fkey" FOREIGN KEY ("session_case_id") REFERENCES "session_cases" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "labirinto_roteiros_gerados" VALIDATE CONSTRAINT "labirinto_roteiros_gerados_session_case_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped labirinto_roteiros_gerados_session_case_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create labirinto_roteiros_gerados_session_case_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [241/384] labyrinth_records_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labyrinth_records_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labyrinth_records' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "labyrinth_records" ADD CONSTRAINT "labyrinth_records_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "labyrinth_records" VALIDATE CONSTRAINT "labyrinth_records_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped labyrinth_records_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create labyrinth_records_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [242/384] labyrinth_records_session_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labyrinth_records_session_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labyrinth_records' AND column_name = 'session_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sessions' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "labyrinth_records" ADD CONSTRAINT "labyrinth_records_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "labyrinth_records" VALIDATE CONSTRAINT "labyrinth_records_session_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped labyrinth_records_session_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create labyrinth_records_session_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [243/384] lessons_album_book_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lessons_album_book_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'lessons_album' AND column_name = 'book_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'books' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "lessons_album" ADD CONSTRAINT "lessons_album_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "lessons_album" VALIDATE CONSTRAINT "lessons_album_book_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped lessons_album_book_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create lessons_album_book_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [244/384] lessons_travessia_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lessons_travessia_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'lessons' AND column_name = 'travessia_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'travessias' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "lessons" ADD CONSTRAINT "lessons_travessia_id_fkey" FOREIGN KEY ("travessia_id") REFERENCES "travessias" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "lessons" VALIDATE CONSTRAINT "lessons_travessia_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped lessons_travessia_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create lessons_travessia_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [245/384] mapa_heroina_porta_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_heroina_porta_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'mapa_heroina' AND column_name = 'porta_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_fases' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "mapa_heroina" ADD CONSTRAINT "mapa_heroina_porta_id_fkey" FOREIGN KEY ("porta_id") REFERENCES "labirinto_fases" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "mapa_heroina" VALIDATE CONSTRAINT "mapa_heroina_porta_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped mapa_heroina_porta_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create mapa_heroina_porta_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [246/384] mapa_sombra_cliente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_sombra_cliente_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'mapa_sombra' AND column_name = 'cliente_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "mapa_sombra" ADD CONSTRAINT "mapa_sombra_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "mapa_sombra" VALIDATE CONSTRAINT "mapa_sombra_cliente_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped mapa_sombra_cliente_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create mapa_sombra_cliente_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [247/384] mapa_vivo_heroina_gesto_jardim_registro_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_vivo_heroina_gesto_jardim_registro_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'mapa_vivo_heroina' AND column_name = 'gesto_jardim_registro_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'jardim_heroina_registros' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "mapa_vivo_heroina" ADD CONSTRAINT "mapa_vivo_heroina_gesto_jardim_registro_id_fkey" FOREIGN KEY ("gesto_jardim_registro_id") REFERENCES "jardim_heroina_registros" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "mapa_vivo_heroina" VALIDATE CONSTRAINT "mapa_vivo_heroina_gesto_jardim_registro_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped mapa_vivo_heroina_gesto_jardim_registro_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create mapa_vivo_heroina_gesto_jardim_registro_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [248/384] mapa_vivo_heroina_session_case_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_vivo_heroina_session_case_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'mapa_vivo_heroina' AND column_name = 'session_case_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_cases' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "mapa_vivo_heroina" ADD CONSTRAINT "mapa_vivo_heroina_session_case_id_fkey" FOREIGN KEY ("session_case_id") REFERENCES "session_cases" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "mapa_vivo_heroina" VALIDATE CONSTRAINT "mapa_vivo_heroina_session_case_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped mapa_vivo_heroina_session_case_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create mapa_vivo_heroina_session_case_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [249/384] mapa_vivo_historico_mapa_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_vivo_historico_mapa_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'mapa_vivo_historico' AND column_name = 'mapa_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'mapa_vivo_heroina' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "mapa_vivo_historico" ADD CONSTRAINT "mapa_vivo_historico_mapa_id_fkey" FOREIGN KEY ("mapa_id") REFERENCES "mapa_vivo_heroina" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "mapa_vivo_historico" VALIDATE CONSTRAINT "mapa_vivo_historico_mapa_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped mapa_vivo_historico_mapa_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create mapa_vivo_historico_mapa_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [250/384] mapeamento_complexos_cliente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapeamento_complexos_cliente_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'mapeamento_complexos' AND column_name = 'cliente_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "mapeamento_complexos" ADD CONSTRAINT "mapeamento_complexos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "mapeamento_complexos" VALIDATE CONSTRAINT "mapeamento_complexos_cliente_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped mapeamento_complexos_cliente_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create mapeamento_complexos_cliente_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [251/384] message_logs_campaign_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'message_logs_campaign_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'message_logs' AND column_name = 'campaign_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'message_campaigns' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "message_logs" ADD CONSTRAINT "message_logs_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "message_campaigns" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "message_logs" VALIDATE CONSTRAINT "message_logs_campaign_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped message_logs_campaign_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create message_logs_campaign_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [252/384] message_logs_template_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'message_logs_template_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'message_logs' AND column_name = 'template_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'message_templates' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "message_logs" ADD CONSTRAINT "message_logs_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "message_templates" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "message_logs" VALIDATE CONSTRAINT "message_logs_template_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped message_logs_template_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create message_logs_template_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [253/384] mind_map_nodes_map_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mind_map_nodes_map_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'mind_map_nodes' AND column_name = 'map_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'mind_maps' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "mind_map_nodes" ADD CONSTRAINT "mind_map_nodes_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "mind_maps" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "mind_map_nodes" VALIDATE CONSTRAINT "mind_map_nodes_map_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped mind_map_nodes_map_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create mind_map_nodes_map_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [254/384] mind_map_nodes_parent_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mind_map_nodes_parent_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'mind_map_nodes' AND column_name = 'parent_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'mind_map_nodes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "mind_map_nodes" ADD CONSTRAINT "mind_map_nodes_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "mind_map_nodes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "mind_map_nodes" VALIDATE CONSTRAINT "mind_map_nodes_parent_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped mind_map_nodes_parent_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create mind_map_nodes_parent_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [255/384] mind_maps_owner_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mind_maps_owner_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'mind_maps' AND column_name = 'owner_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'profiles' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "mind_maps" ADD CONSTRAINT "mind_maps_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "profiles" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "mind_maps" VALIDATE CONSTRAINT "mind_maps_owner_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped mind_maps_owner_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create mind_maps_owner_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [256/384] missoes_aula_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'missoes_aula_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'missoes' AND column_name = 'aula_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'aulas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "missoes" ADD CONSTRAINT "missoes_aula_id_fkey" FOREIGN KEY ("aula_id") REFERENCES "aulas" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "missoes" VALIDATE CONSTRAINT "missoes_aula_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped missoes_aula_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create missoes_aula_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [257/384] missoes_portal_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'missoes_portal_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'missoes' AND column_name = 'portal_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'portais' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "missoes" ADD CONSTRAINT "missoes_portal_id_fkey" FOREIGN KEY ("portal_id") REFERENCES "portais" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "missoes" VALIDATE CONSTRAINT "missoes_portal_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped missoes_portal_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create missoes_portal_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [258/384] narrative_maps_case_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narrative_maps_case_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'narrative_maps' AND column_name = 'case_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_cases' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "narrative_maps" ADD CONSTRAINT "narrative_maps_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "session_cases" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "narrative_maps" VALIDATE CONSTRAINT "narrative_maps_case_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped narrative_maps_case_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create narrative_maps_case_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [259/384] narrative_maps_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narrative_maps_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'narrative_maps' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'profiles' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "narrative_maps" ADD CONSTRAINT "narrative_maps_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "profiles" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "narrative_maps" VALIDATE CONSTRAINT "narrative_maps_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped narrative_maps_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create narrative_maps_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [260/384] narrative_maps_therapist_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narrative_maps_therapist_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'narrative_maps' AND column_name = 'therapist_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'profiles' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "narrative_maps" ADD CONSTRAINT "narrative_maps_therapist_id_fkey" FOREIGN KEY ("therapist_id") REFERENCES "profiles" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "narrative_maps" VALIDATE CONSTRAINT "narrative_maps_therapist_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped narrative_maps_therapist_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create narrative_maps_therapist_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [261/384] narroterapia_estudos_audio_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narroterapia_estudos_audio_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'narroterapia_estudos' AND column_name = 'audio_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'audio_assets' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "narroterapia_estudos" ADD CONSTRAINT "narroterapia_estudos_audio_id_fkey" FOREIGN KEY ("audio_id") REFERENCES "audio_assets" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "narroterapia_estudos" VALIDATE CONSTRAINT "narroterapia_estudos_audio_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped narroterapia_estudos_audio_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create narroterapia_estudos_audio_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [262/384] narroterapia_reacoes_simbolicas_audio_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narroterapia_reacoes_simbolicas_audio_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'narroterapia_reacoes_simbolicas' AND column_name = 'audio_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'audio_assets' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "narroterapia_reacoes_simbolicas" ADD CONSTRAINT "narroterapia_reacoes_simbolicas_audio_id_fkey" FOREIGN KEY ("audio_id") REFERENCES "audio_assets" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "narroterapia_reacoes_simbolicas" VALIDATE CONSTRAINT "narroterapia_reacoes_simbolicas_audio_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped narroterapia_reacoes_simbolicas_audio_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create narroterapia_reacoes_simbolicas_audio_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [263/384] narroterapia_reacoes_simbolicas_conto_clinico_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narroterapia_reacoes_simbolicas_conto_clinico_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'narroterapia_reacoes_simbolicas' AND column_name = 'conto_clinico_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'contos_clinicos' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "narroterapia_reacoes_simbolicas" ADD CONSTRAINT "narroterapia_reacoes_simbolicas_conto_clinico_id_fkey" FOREIGN KEY ("conto_clinico_id") REFERENCES "contos_clinicos" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "narroterapia_reacoes_simbolicas" VALIDATE CONSTRAINT "narroterapia_reacoes_simbolicas_conto_clinico_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped narroterapia_reacoes_simbolicas_conto_clinico_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create narroterapia_reacoes_simbolicas_conto_clinico_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [264/384] oracle_cards_archetype_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_cards_archetype_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oracle_cards' AND column_name = 'archetype_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'founding_archetypes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "oracle_cards" ADD CONSTRAINT "oracle_cards_archetype_id_fkey" FOREIGN KEY ("archetype_id") REFERENCES "founding_archetypes" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "oracle_cards" VALIDATE CONSTRAINT "oracle_cards_archetype_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped oracle_cards_archetype_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create oracle_cards_archetype_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [265/384] oracle_cards_deck_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_cards_deck_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oracle_cards' AND column_name = 'deck_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oracle_decks' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "oracle_cards" ADD CONSTRAINT "oracle_cards_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "oracle_decks" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "oracle_cards" VALIDATE CONSTRAINT "oracle_cards_deck_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped oracle_cards_deck_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create oracle_cards_deck_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [266/384] oracle_cards_district_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_cards_district_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oracle_cards' AND column_name = 'district_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'city_districts' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "oracle_cards" ADD CONSTRAINT "oracle_cards_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "city_districts" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "oracle_cards" VALIDATE CONSTRAINT "oracle_cards_district_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped oracle_cards_district_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create oracle_cards_district_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [267/384] oracle_cards_tool_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_cards_tool_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oracle_cards' AND column_name = 'tool_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tools' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "oracle_cards" ADD CONSTRAINT "oracle_cards_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tools" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "oracle_cards" VALIDATE CONSTRAINT "oracle_cards_tool_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped oracle_cards_tool_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create oracle_cards_tool_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [268/384] oracle_categories_oracle_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_categories_oracle_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oracle_categories' AND column_name = 'oracle_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oracle_decks' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "oracle_categories" ADD CONSTRAINT "oracle_categories_oracle_id_fkey" FOREIGN KEY ("oracle_id") REFERENCES "oracle_decks" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "oracle_categories" VALIDATE CONSTRAINT "oracle_categories_oracle_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped oracle_categories_oracle_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create oracle_categories_oracle_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [269/384] oracle_draws_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_draws_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oracle_draws' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oracle_clients' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "oracle_draws" ADD CONSTRAINT "oracle_draws_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "oracle_clients" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "oracle_draws" VALIDATE CONSTRAINT "oracle_draws_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped oracle_draws_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create oracle_draws_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [270/384] oracle_draws_oracle_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_draws_oracle_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oracle_draws' AND column_name = 'oracle_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oracle_decks' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "oracle_draws" ADD CONSTRAINT "oracle_draws_oracle_id_fkey" FOREIGN KEY ("oracle_id") REFERENCES "oracle_decks" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "oracle_draws" VALIDATE CONSTRAINT "oracle_draws_oracle_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped oracle_draws_oracle_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create oracle_draws_oracle_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [271/384] oracle_draws_spread_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_draws_spread_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oracle_draws' AND column_name = 'spread_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oracle_spreads' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "oracle_draws" ADD CONSTRAINT "oracle_draws_spread_id_fkey" FOREIGN KEY ("spread_id") REFERENCES "oracle_spreads" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "oracle_draws" VALIDATE CONSTRAINT "oracle_draws_spread_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped oracle_draws_spread_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create oracle_draws_spread_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [272/384] oracle_spread_positions_spread_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_spread_positions_spread_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oracle_spread_positions' AND column_name = 'spread_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oracle_spreads' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "oracle_spread_positions" ADD CONSTRAINT "oracle_spread_positions_spread_id_fkey" FOREIGN KEY ("spread_id") REFERENCES "oracle_spreads" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "oracle_spread_positions" VALIDATE CONSTRAINT "oracle_spread_positions_spread_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped oracle_spread_positions_spread_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create oracle_spread_positions_spread_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [273/384] oracle_spreads_oracle_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_spreads_oracle_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oracle_spreads' AND column_name = 'oracle_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oracle_decks' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "oracle_spreads" ADD CONSTRAINT "oracle_spreads_oracle_id_fkey" FOREIGN KEY ("oracle_id") REFERENCES "oracle_decks" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "oracle_spreads" VALIDATE CONSTRAINT "oracle_spreads_oracle_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped oracle_spreads_oracle_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create oracle_spreads_oracle_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [274/384] oracle_usage_stats_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_usage_stats_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oracle_usage_stats' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "oracle_usage_stats" ADD CONSTRAINT "oracle_usage_stats_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "oracle_usage_stats" VALIDATE CONSTRAINT "oracle_usage_stats_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped oracle_usage_stats_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create oracle_usage_stats_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [275/384] oraculo_aplicacoes_pergunta_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_aplicacoes_pergunta_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_aplicacoes' AND column_name = 'pergunta_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_perguntas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "oraculo_aplicacoes" ADD CONSTRAINT "oraculo_aplicacoes_pergunta_id_fkey" FOREIGN KEY ("pergunta_id") REFERENCES "oraculo_perguntas" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "oraculo_aplicacoes" VALIDATE CONSTRAINT "oraculo_aplicacoes_pergunta_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped oraculo_aplicacoes_pergunta_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create oraculo_aplicacoes_pergunta_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [276/384] oraculo_favoritos_pergunta_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_favoritos_pergunta_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_favoritos' AND column_name = 'pergunta_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_perguntas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "oraculo_favoritos" ADD CONSTRAINT "oraculo_favoritos_pergunta_id_fkey" FOREIGN KEY ("pergunta_id") REFERENCES "oraculo_perguntas" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "oraculo_favoritos" VALIDATE CONSTRAINT "oraculo_favoritos_pergunta_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped oraculo_favoritos_pergunta_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create oraculo_favoritos_pergunta_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [277/384] oraculo_portal_aplicacoes_portal_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_aplicacoes_portal_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portal_aplicacoes' AND column_name = 'portal_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portais' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "oraculo_portal_aplicacoes" ADD CONSTRAINT "oraculo_portal_aplicacoes_portal_id_fkey" FOREIGN KEY ("portal_id") REFERENCES "oraculo_portais" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "oraculo_portal_aplicacoes" VALIDATE CONSTRAINT "oraculo_portal_aplicacoes_portal_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped oraculo_portal_aplicacoes_portal_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create oraculo_portal_aplicacoes_portal_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [278/384] oraculo_portal_audios_portal_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_audios_portal_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portal_audios' AND column_name = 'portal_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portais' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "oraculo_portal_audios" ADD CONSTRAINT "oraculo_portal_audios_portal_id_fkey" FOREIGN KEY ("portal_id") REFERENCES "oraculo_portais" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "oraculo_portal_audios" VALIDATE CONSTRAINT "oraculo_portal_audios_portal_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped oraculo_portal_audios_portal_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create oraculo_portal_audios_portal_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [279/384] oraculo_portal_essencia_portal_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_essencia_portal_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portal_essencia' AND column_name = 'portal_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portais' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "oraculo_portal_essencia" ADD CONSTRAINT "oraculo_portal_essencia_portal_id_fkey" FOREIGN KEY ("portal_id") REFERENCES "oraculo_portais" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "oraculo_portal_essencia" VALIDATE CONSTRAINT "oraculo_portal_essencia_portal_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped oraculo_portal_essencia_portal_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create oraculo_portal_essencia_portal_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [280/384] oraculo_portal_ferramenta_campos_ferramenta_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_ferramenta_campos_ferramenta_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portal_ferramenta_campos' AND column_name = 'ferramenta_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portal_ferramentas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "oraculo_portal_ferramenta_campos" ADD CONSTRAINT "oraculo_portal_ferramenta_campos_ferramenta_id_fkey" FOREIGN KEY ("ferramenta_id") REFERENCES "oraculo_portal_ferramentas" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "oraculo_portal_ferramenta_campos" VALIDATE CONSTRAINT "oraculo_portal_ferramenta_campos_ferramenta_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped oraculo_portal_ferramenta_campos_ferramenta_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create oraculo_portal_ferramenta_campos_ferramenta_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [281/384] oraculo_portal_ferramentas_portal_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_ferramentas_portal_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portal_ferramentas' AND column_name = 'portal_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portais' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "oraculo_portal_ferramentas" ADD CONSTRAINT "oraculo_portal_ferramentas_portal_id_fkey" FOREIGN KEY ("portal_id") REFERENCES "oraculo_portais" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "oraculo_portal_ferramentas" VALIDATE CONSTRAINT "oraculo_portal_ferramentas_portal_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped oraculo_portal_ferramentas_portal_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create oraculo_portal_ferramentas_portal_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [282/384] oraculo_portal_forja_erros_forja_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_forja_erros_forja_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portal_forja_erros' AND column_name = 'forja_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portal_forjas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "oraculo_portal_forja_erros" ADD CONSTRAINT "oraculo_portal_forja_erros_forja_id_fkey" FOREIGN KEY ("forja_id") REFERENCES "oraculo_portal_forjas" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "oraculo_portal_forja_erros" VALIDATE CONSTRAINT "oraculo_portal_forja_erros_forja_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped oraculo_portal_forja_erros_forja_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create oraculo_portal_forja_erros_forja_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [283/384] oraculo_portal_forja_passos_forja_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_forja_passos_forja_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portal_forja_passos' AND column_name = 'forja_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portal_forjas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "oraculo_portal_forja_passos" ADD CONSTRAINT "oraculo_portal_forja_passos_forja_id_fkey" FOREIGN KEY ("forja_id") REFERENCES "oraculo_portal_forjas" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "oraculo_portal_forja_passos" VALIDATE CONSTRAINT "oraculo_portal_forja_passos_forja_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped oraculo_portal_forja_passos_forja_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create oraculo_portal_forja_passos_forja_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [284/384] oraculo_portal_forjas_portal_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_forjas_portal_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portal_forjas' AND column_name = 'portal_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portais' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "oraculo_portal_forjas" ADD CONSTRAINT "oraculo_portal_forjas_portal_id_fkey" FOREIGN KEY ("portal_id") REFERENCES "oraculo_portais" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "oraculo_portal_forjas" VALIDATE CONSTRAINT "oraculo_portal_forjas_portal_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped oraculo_portal_forjas_portal_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create oraculo_portal_forjas_portal_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [285/384] oraculo_portal_jardins_portal_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_jardins_portal_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portal_jardins' AND column_name = 'portal_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portais' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "oraculo_portal_jardins" ADD CONSTRAINT "oraculo_portal_jardins_portal_id_fkey" FOREIGN KEY ("portal_id") REFERENCES "oraculo_portais" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "oraculo_portal_jardins" VALIDATE CONSTRAINT "oraculo_portal_jardins_portal_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped oraculo_portal_jardins_portal_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create oraculo_portal_jardins_portal_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [286/384] oraculo_portal_laboratorio_passos_laboratorio_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_laboratorio_passos_laboratorio_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portal_laboratorio_passos' AND column_name = 'laboratorio_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portal_laboratorios' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "oraculo_portal_laboratorio_passos" ADD CONSTRAINT "oraculo_portal_laboratorio_passos_laboratorio_id_fkey" FOREIGN KEY ("laboratorio_id") REFERENCES "oraculo_portal_laboratorios" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "oraculo_portal_laboratorio_passos" VALIDATE CONSTRAINT "oraculo_portal_laboratorio_passos_laboratorio_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped oraculo_portal_laboratorio_passos_laboratorio_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create oraculo_portal_laboratorio_passos_laboratorio_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [287/384] oraculo_portal_laboratorios_portal_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_laboratorios_portal_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portal_laboratorios' AND column_name = 'portal_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portais' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "oraculo_portal_laboratorios" ADD CONSTRAINT "oraculo_portal_laboratorios_portal_id_fkey" FOREIGN KEY ("portal_id") REFERENCES "oraculo_portais" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "oraculo_portal_laboratorios" VALIDATE CONSTRAINT "oraculo_portal_laboratorios_portal_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped oraculo_portal_laboratorios_portal_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create oraculo_portal_laboratorios_portal_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [288/384] oraculo_portal_materiais_portal_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_materiais_portal_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portal_materiais' AND column_name = 'portal_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portais' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "oraculo_portal_materiais" ADD CONSTRAINT "oraculo_portal_materiais_portal_id_fkey" FOREIGN KEY ("portal_id") REFERENCES "oraculo_portais" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "oraculo_portal_materiais" VALIDATE CONSTRAINT "oraculo_portal_materiais_portal_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped oraculo_portal_materiais_portal_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create oraculo_portal_materiais_portal_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [289/384] oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portal_narroterapia_perguntas' AND column_name = 'narroterapia_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portal_narroterapia' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "oraculo_portal_narroterapia_perguntas" ADD CONSTRAINT "oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey" FOREIGN KEY ("narroterapia_id") REFERENCES "oraculo_portal_narroterapia" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "oraculo_portal_narroterapia_perguntas" VALIDATE CONSTRAINT "oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [290/384] oraculo_portal_narroterapia_portal_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_narroterapia_portal_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portal_narroterapia' AND column_name = 'portal_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portais' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "oraculo_portal_narroterapia" ADD CONSTRAINT "oraculo_portal_narroterapia_portal_id_fkey" FOREIGN KEY ("portal_id") REFERENCES "oraculo_portais" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "oraculo_portal_narroterapia" VALIDATE CONSTRAINT "oraculo_portal_narroterapia_portal_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped oraculo_portal_narroterapia_portal_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create oraculo_portal_narroterapia_portal_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [291/384] oraculo_portal_riscos_eticos_portal_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_riscos_eticos_portal_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portal_riscos_eticos' AND column_name = 'portal_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oraculo_portais' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "oraculo_portal_riscos_eticos" ADD CONSTRAINT "oraculo_portal_riscos_eticos_portal_id_fkey" FOREIGN KEY ("portal_id") REFERENCES "oraculo_portais" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "oraculo_portal_riscos_eticos" VALIDATE CONSTRAINT "oraculo_portal_riscos_eticos_portal_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped oraculo_portal_riscos_eticos_portal_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create oraculo_portal_riscos_eticos_portal_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [292/384] portais_jornada_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portais_jornada_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'portais' AND column_name = 'jornada_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'jornadas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "portais" ADD CONSTRAINT "portais_jornada_id_fkey" FOREIGN KEY ("jornada_id") REFERENCES "jornadas" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "portais" VALIDATE CONSTRAINT "portais_jornada_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped portais_jornada_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create portais_jornada_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [293/384] portais_modulo_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portais_modulo_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'portais' AND column_name = 'modulo_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'modulos_formativos' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "portais" ADD CONSTRAINT "portais_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "modulos_formativos" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "portais" VALIDATE CONSTRAINT "portais_modulo_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped portais_modulo_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create portais_modulo_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [294/384] portal_junguiano_modulos_config_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_junguiano_modulos_config_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'portal_junguiano_modulos' AND column_name = 'config_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'portal_junguiano_config' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "portal_junguiano_modulos" ADD CONSTRAINT "portal_junguiano_modulos_config_id_fkey" FOREIGN KEY ("config_id") REFERENCES "portal_junguiano_config" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "portal_junguiano_modulos" VALIDATE CONSTRAINT "portal_junguiano_modulos_config_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped portal_junguiano_modulos_config_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create portal_junguiano_modulos_config_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [295/384] portal_junguiano_portais_modulo_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_junguiano_portais_modulo_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'portal_junguiano_portais' AND column_name = 'modulo_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'portal_junguiano_modulos' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "portal_junguiano_portais" ADD CONSTRAINT "portal_junguiano_portais_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "portal_junguiano_modulos" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "portal_junguiano_portais" VALIDATE CONSTRAINT "portal_junguiano_portais_modulo_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped portal_junguiano_portais_modulo_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create portal_junguiano_portais_modulo_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [296/384] portal_junguiano_progresso_config_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_junguiano_progresso_config_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'portal_junguiano_progresso' AND column_name = 'config_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'portal_junguiano_config' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "portal_junguiano_progresso" ADD CONSTRAINT "portal_junguiano_progresso_config_id_fkey" FOREIGN KEY ("config_id") REFERENCES "portal_junguiano_config" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "portal_junguiano_progresso" VALIDATE CONSTRAINT "portal_junguiano_progresso_config_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped portal_junguiano_progresso_config_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create portal_junguiano_progresso_config_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [297/384] portal_junguiano_registros_portal_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_junguiano_registros_portal_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'portal_junguiano_registros' AND column_name = 'portal_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'portal_junguiano_portais' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "portal_junguiano_registros" ADD CONSTRAINT "portal_junguiano_registros_portal_id_fkey" FOREIGN KEY ("portal_id") REFERENCES "portal_junguiano_portais" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "portal_junguiano_registros" VALIDATE CONSTRAINT "portal_junguiano_registros_portal_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped portal_junguiano_registros_portal_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create portal_junguiano_registros_portal_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [298/384] portal_progress_portal_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_progress_portal_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'portal_progress' AND column_name = 'portal_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_portais' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "portal_progress" ADD CONSTRAINT "portal_progress_portal_id_fkey" FOREIGN KEY ("portal_id") REFERENCES "clube_portais" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "portal_progress" VALIDATE CONSTRAINT "portal_progress_portal_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped portal_progress_portal_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create portal_progress_portal_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [299/384] portal_salas_sala_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_salas_sala_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'portal_salas' AND column_name = 'sala_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'salas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "portal_salas" ADD CONSTRAINT "portal_salas_sala_id_fkey" FOREIGN KEY ("sala_id") REFERENCES "salas" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "portal_salas" VALIDATE CONSTRAINT "portal_salas_sala_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped portal_salas_sala_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create portal_salas_sala_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [300/384] post_session_closures_case_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'post_session_closures_case_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'post_session_closures' AND column_name = 'case_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_cases' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "post_session_closures" ADD CONSTRAINT "post_session_closures_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "session_cases" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "post_session_closures" VALIDATE CONSTRAINT "post_session_closures_case_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped post_session_closures_case_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create post_session_closures_case_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [301/384] post_session_closures_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'post_session_closures_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'post_session_closures' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'profiles' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "post_session_closures" ADD CONSTRAINT "post_session_closures_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "profiles" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "post_session_closures" VALIDATE CONSTRAINT "post_session_closures_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped post_session_closures_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create post_session_closures_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [302/384] post_session_closures_therapist_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'post_session_closures_therapist_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'post_session_closures' AND column_name = 'therapist_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'profiles' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "post_session_closures" ADD CONSTRAINT "post_session_closures_therapist_id_fkey" FOREIGN KEY ("therapist_id") REFERENCES "profiles" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "post_session_closures" VALIDATE CONSTRAINT "post_session_closures_therapist_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped post_session_closures_therapist_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create post_session_closures_therapist_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [303/384] praticas_mudra_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'praticas_mudra_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'praticas_mudra' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "praticas_mudra" ADD CONSTRAINT "praticas_mudra_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "praticas_mudra" VALIDATE CONSTRAINT "praticas_mudra_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped praticas_mudra_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create praticas_mudra_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [304/384] progresso_aluna_formacao_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'progresso_aluna_formacao_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'progresso_aluna' AND column_name = 'formacao_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'formacoes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "progresso_aluna" ADD CONSTRAINT "progresso_aluna_formacao_id_fkey" FOREIGN KEY ("formacao_id") REFERENCES "formacoes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "progresso_aluna" VALIDATE CONSTRAINT "progresso_aluna_formacao_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped progresso_aluna_formacao_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create progresso_aluna_formacao_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [305/384] progresso_aluna_modulo_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'progresso_aluna_modulo_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'progresso_aluna' AND column_name = 'modulo_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'formacao_modulos' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "progresso_aluna" ADD CONSTRAINT "progresso_aluna_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "formacao_modulos" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "progresso_aluna" VALIDATE CONSTRAINT "progresso_aluna_modulo_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped progresso_aluna_modulo_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create progresso_aluna_modulo_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [306/384] projetos_mestria_course_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projetos_mestria_course_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'projetos_mestria' AND column_name = 'course_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'courses' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "projetos_mestria" ADD CONSTRAINT "projetos_mestria_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "projetos_mestria" VALIDATE CONSTRAINT "projetos_mestria_course_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped projetos_mestria_course_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create projetos_mestria_course_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [307/384] protocolo_oracula_caminho_registro_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protocolo_oracula_caminho_registro_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'protocolo_oracula' AND column_name = 'caminho_registro_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'jornada_heroina_registros' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "protocolo_oracula" ADD CONSTRAINT "protocolo_oracula_caminho_registro_id_fkey" FOREIGN KEY ("caminho_registro_id") REFERENCES "jornada_heroina_registros" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "protocolo_oracula" VALIDATE CONSTRAINT "protocolo_oracula_caminho_registro_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped protocolo_oracula_caminho_registro_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create protocolo_oracula_caminho_registro_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [308/384] protocolo_oracula_cliente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protocolo_oracula_cliente_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'protocolo_oracula' AND column_name = 'cliente_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "protocolo_oracula" ADD CONSTRAINT "protocolo_oracula_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "protocolo_oracula" VALIDATE CONSTRAINT "protocolo_oracula_cliente_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped protocolo_oracula_cliente_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create protocolo_oracula_cliente_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [309/384] protocolo_oracula_mapa_registro_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protocolo_oracula_mapa_registro_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'protocolo_oracula' AND column_name = 'mapa_registro_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'big5_symbolic_registros' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "protocolo_oracula" ADD CONSTRAINT "protocolo_oracula_mapa_registro_id_fkey" FOREIGN KEY ("mapa_registro_id") REFERENCES "big5_symbolic_registros" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "protocolo_oracula" VALIDATE CONSTRAINT "protocolo_oracula_mapa_registro_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped protocolo_oracula_mapa_registro_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create protocolo_oracula_mapa_registro_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [310/384] protocolo_oracula_oraculo_registro_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protocolo_oracula_oraculo_registro_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'protocolo_oracula' AND column_name = 'oraculo_registro_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'eneagrama_feminino_registros' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "protocolo_oracula" ADD CONSTRAINT "protocolo_oracula_oraculo_registro_id_fkey" FOREIGN KEY ("oraculo_registro_id") REFERENCES "eneagrama_feminino_registros" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "protocolo_oracula" VALIDATE CONSTRAINT "protocolo_oracula_oraculo_registro_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped protocolo_oracula_oraculo_registro_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create protocolo_oracula_oraculo_registro_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [311/384] protocolo_oracula_session_case_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protocolo_oracula_session_case_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'protocolo_oracula' AND column_name = 'session_case_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_cases' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "protocolo_oracula" ADD CONSTRAINT "protocolo_oracula_session_case_id_fkey" FOREIGN KEY ("session_case_id") REFERENCES "session_cases" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "protocolo_oracula" VALIDATE CONSTRAINT "protocolo_oracula_session_case_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped protocolo_oracula_session_case_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create protocolo_oracula_session_case_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [312/384] quiz_opcoes_pergunta_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_opcoes_pergunta_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'quiz_opcoes' AND column_name = 'pergunta_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'quiz_perguntas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "quiz_opcoes" ADD CONSTRAINT "quiz_opcoes_pergunta_id_fkey" FOREIGN KEY ("pergunta_id") REFERENCES "quiz_perguntas" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "quiz_opcoes" VALIDATE CONSTRAINT "quiz_opcoes_pergunta_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped quiz_opcoes_pergunta_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create quiz_opcoes_pergunta_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [313/384] quiz_perguntas_quiz_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_perguntas_quiz_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'quiz_perguntas' AND column_name = 'quiz_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'quizzes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "quiz_perguntas" ADD CONSTRAINT "quiz_perguntas_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "quiz_perguntas" VALIDATE CONSTRAINT "quiz_perguntas_quiz_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped quiz_perguntas_quiz_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create quiz_perguntas_quiz_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [314/384] quiz_respostas_usuario_quiz_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_respostas_usuario_quiz_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'quiz_respostas_usuario' AND column_name = 'quiz_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'quizzes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "quiz_respostas_usuario" ADD CONSTRAINT "quiz_respostas_usuario_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "quiz_respostas_usuario" VALIDATE CONSTRAINT "quiz_respostas_usuario_quiz_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped quiz_respostas_usuario_quiz_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create quiz_respostas_usuario_quiz_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [315/384] quiz_respostas_usuario_resultado_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_respostas_usuario_resultado_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'quiz_respostas_usuario' AND column_name = 'resultado_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'quiz_resultados' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "quiz_respostas_usuario" ADD CONSTRAINT "quiz_respostas_usuario_resultado_id_fkey" FOREIGN KEY ("resultado_id") REFERENCES "quiz_resultados" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "quiz_respostas_usuario" VALIDATE CONSTRAINT "quiz_respostas_usuario_resultado_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped quiz_respostas_usuario_resultado_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create quiz_respostas_usuario_resultado_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [316/384] quiz_resultados_agente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_resultados_agente_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'quiz_resultados' AND column_name = 'agente_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'agentes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "quiz_resultados" ADD CONSTRAINT "quiz_resultados_agente_id_fkey" FOREIGN KEY ("agente_id") REFERENCES "agentes" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "quiz_resultados" VALIDATE CONSTRAINT "quiz_resultados_agente_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped quiz_resultados_agente_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create quiz_resultados_agente_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [317/384] quiz_resultados_quiz_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_resultados_quiz_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'quiz_resultados' AND column_name = 'quiz_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'quizzes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "quiz_resultados" ADD CONSTRAINT "quiz_resultados_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "quiz_resultados" VALIDATE CONSTRAINT "quiz_resultados_quiz_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped quiz_resultados_quiz_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create quiz_resultados_quiz_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [318/384] quizzes_portal_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quizzes_portal_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'quizzes' AND column_name = 'portal_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'conteudo_travessias' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_portal_id_fkey" FOREIGN KEY ("portal_id") REFERENCES "conteudo_travessias" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "quizzes" VALIDATE CONSTRAINT "quizzes_portal_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped quizzes_portal_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create quizzes_portal_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [319/384] quizzes_sala_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quizzes_sala_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'quizzes' AND column_name = 'sala_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'salas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_sala_id_fkey" FOREIGN KEY ("sala_id") REFERENCES "salas" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "quizzes" VALIDATE CONSTRAINT "quizzes_sala_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped quizzes_sala_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create quizzes_sala_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [320/384] reflexoes_jornada_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reflexoes_jornada_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'reflexoes_jornada' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "reflexoes_jornada" ADD CONSTRAINT "reflexoes_jornada_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "reflexoes_jornada" VALIDATE CONSTRAINT "reflexoes_jornada_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped reflexoes_jornada_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create reflexoes_jornada_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [321/384] relacionamentos_espelho_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'relacionamentos_espelho_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'relacionamentos_espelho' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "relacionamentos_espelho" ADD CONSTRAINT "relacionamentos_espelho_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "relacionamentos_espelho" VALIDATE CONSTRAINT "relacionamentos_espelho_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped relacionamentos_espelho_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create relacionamentos_espelho_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [322/384] respostas_exercicios_sessao_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'respostas_exercicios_sessao_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'respostas_exercicios' AND column_name = 'sessao_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sessoes_labirinto' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "respostas_exercicios" ADD CONSTRAINT "respostas_exercicios_sessao_id_fkey" FOREIGN KEY ("sessao_id") REFERENCES "sessoes_labirinto" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "respostas_exercicios" VALIDATE CONSTRAINT "respostas_exercicios_sessao_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped respostas_exercicios_sessao_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create respostas_exercicios_sessao_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [323/384] rituais_integracao_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rituais_integracao_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'rituais_integracao' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "rituais_integracao" ADD CONSTRAINT "rituais_integracao_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "rituais_integracao" VALIDATE CONSTRAINT "rituais_integracao_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped rituais_integracao_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create rituais_integracao_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [324/384] ritual_passages_ritual_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ritual_passages_ritual_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'ritual_passages' AND column_name = 'ritual_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'ritual_definitions' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "ritual_passages" ADD CONSTRAINT "ritual_passages_ritual_id_fkey" FOREIGN KEY ("ritual_id") REFERENCES "ritual_definitions" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "ritual_passages" VALIDATE CONSTRAINT "ritual_passages_ritual_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped ritual_passages_ritual_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create ritual_passages_ritual_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [325/384] sala_ferramentas_familia_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sala_ferramentas_familia_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sala_ferramentas' AND column_name = 'familia_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'travessia_familias' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "sala_ferramentas" ADD CONSTRAINT "sala_ferramentas_familia_id_fkey" FOREIGN KEY ("familia_id") REFERENCES "travessia_familias" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "sala_ferramentas" VALIDATE CONSTRAINT "sala_ferramentas_familia_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped sala_ferramentas_familia_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create sala_ferramentas_familia_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [326/384] sala_ferramentas_ferramenta_pai_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sala_ferramentas_ferramenta_pai_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sala_ferramentas' AND column_name = 'ferramenta_pai_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sala_ferramentas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "sala_ferramentas" ADD CONSTRAINT "sala_ferramentas_ferramenta_pai_id_fkey" FOREIGN KEY ("ferramenta_pai_id") REFERENCES "sala_ferramentas" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "sala_ferramentas" VALIDATE CONSTRAINT "sala_ferramentas_ferramenta_pai_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped sala_ferramentas_ferramenta_pai_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create sala_ferramentas_ferramenta_pai_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [327/384] sala_ferramentas_portal_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sala_ferramentas_portal_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sala_ferramentas' AND column_name = 'portal_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'conteudo_travessias' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "sala_ferramentas" ADD CONSTRAINT "sala_ferramentas_portal_id_fkey" FOREIGN KEY ("portal_id") REFERENCES "conteudo_travessias" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "sala_ferramentas" VALIDATE CONSTRAINT "sala_ferramentas_portal_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped sala_ferramentas_portal_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create sala_ferramentas_portal_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [328/384] sala_ferramentas_sala_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sala_ferramentas_sala_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sala_ferramentas' AND column_name = 'sala_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'salas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "sala_ferramentas" ADD CONSTRAINT "sala_ferramentas_sala_id_fkey" FOREIGN KEY ("sala_id") REFERENCES "salas" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "sala_ferramentas" VALIDATE CONSTRAINT "sala_ferramentas_sala_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped sala_ferramentas_sala_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create sala_ferramentas_sala_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [329/384] season_books_season_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'season_books_season_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'season_books' AND column_name = 'season_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oracular_seasons' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "season_books" ADD CONSTRAINT "season_books_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "oracular_seasons" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "season_books" VALIDATE CONSTRAINT "season_books_season_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped season_books_season_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create season_books_season_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [330/384] season_labs_season_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'season_labs_season_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'season_labs' AND column_name = 'season_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'oracular_seasons' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "season_labs" ADD CONSTRAINT "season_labs_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "oracular_seasons" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "season_labs" VALIDATE CONSTRAINT "season_labs_season_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped season_labs_season_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create season_labs_season_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [331/384] session_archetypes_archetype_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_archetypes_archetype_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_archetypes' AND column_name = 'archetype_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'atlas_arquetipos_femininos' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "session_archetypes" ADD CONSTRAINT "session_archetypes_archetype_id_fkey" FOREIGN KEY ("archetype_id") REFERENCES "atlas_arquetipos_femininos" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "session_archetypes" VALIDATE CONSTRAINT "session_archetypes_archetype_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped session_archetypes_archetype_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create session_archetypes_archetype_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [332/384] session_archetypes_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_archetypes_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_archetypes' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "session_archetypes" ADD CONSTRAINT "session_archetypes_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "session_archetypes" VALIDATE CONSTRAINT "session_archetypes_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped session_archetypes_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create session_archetypes_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [333/384] session_archetypes_session_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_archetypes_session_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_archetypes' AND column_name = 'session_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sessions' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "session_archetypes" ADD CONSTRAINT "session_archetypes_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "session_archetypes" VALIDATE CONSTRAINT "session_archetypes_session_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped session_archetypes_session_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create session_archetypes_session_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [334/384] session_cases_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_cases_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_cases' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "session_cases" ADD CONSTRAINT "session_cases_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "session_cases" VALIDATE CONSTRAINT "session_cases_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped session_cases_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create session_cases_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [335/384] session_cases_therapist_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_cases_therapist_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_cases' AND column_name = 'therapist_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'profiles' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "session_cases" ADD CONSTRAINT "session_cases_therapist_id_fkey" FOREIGN KEY ("therapist_id") REFERENCES "profiles" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "session_cases" VALIDATE CONSTRAINT "session_cases_therapist_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped session_cases_therapist_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create session_cases_therapist_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [336/384] session_interventions_intervention_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_interventions_intervention_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_interventions' AND column_name = 'intervention_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'interventions' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "session_interventions" ADD CONSTRAINT "session_interventions_intervention_id_fkey" FOREIGN KEY ("intervention_id") REFERENCES "interventions" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "session_interventions" VALIDATE CONSTRAINT "session_interventions_intervention_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped session_interventions_intervention_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create session_interventions_intervention_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [337/384] session_interventions_session_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_interventions_session_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_interventions' AND column_name = 'session_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sessions' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "session_interventions" ADD CONSTRAINT "session_interventions_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "session_interventions" VALIDATE CONSTRAINT "session_interventions_session_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped session_interventions_session_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create session_interventions_session_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [338/384] session_oracle_draws_case_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_oracle_draws_case_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_oracle_draws' AND column_name = 'case_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_cases' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "session_oracle_draws" ADD CONSTRAINT "session_oracle_draws_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "session_cases" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "session_oracle_draws" VALIDATE CONSTRAINT "session_oracle_draws_case_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped session_oracle_draws_case_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create session_oracle_draws_case_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [339/384] session_oracle_draws_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_oracle_draws_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_oracle_draws' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'profiles' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "session_oracle_draws" ADD CONSTRAINT "session_oracle_draws_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "profiles" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "session_oracle_draws" VALIDATE CONSTRAINT "session_oracle_draws_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped session_oracle_draws_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create session_oracle_draws_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [340/384] session_oracle_draws_therapist_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_oracle_draws_therapist_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_oracle_draws' AND column_name = 'therapist_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'profiles' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "session_oracle_draws" ADD CONSTRAINT "session_oracle_draws_therapist_id_fkey" FOREIGN KEY ("therapist_id") REFERENCES "profiles" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "session_oracle_draws" VALIDATE CONSTRAINT "session_oracle_draws_therapist_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped session_oracle_draws_therapist_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create session_oracle_draws_therapist_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [341/384] session_scripts_case_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_scripts_case_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_scripts' AND column_name = 'case_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_cases' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "session_scripts" ADD CONSTRAINT "session_scripts_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "session_cases" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "session_scripts" VALIDATE CONSTRAINT "session_scripts_case_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped session_scripts_case_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create session_scripts_case_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [342/384] session_scripts_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_scripts_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_scripts' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'profiles' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "session_scripts" ADD CONSTRAINT "session_scripts_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "profiles" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "session_scripts" VALIDATE CONSTRAINT "session_scripts_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped session_scripts_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create session_scripts_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [343/384] session_scripts_narrative_map_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_scripts_narrative_map_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_scripts' AND column_name = 'narrative_map_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'narrative_maps' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "session_scripts" ADD CONSTRAINT "session_scripts_narrative_map_id_fkey" FOREIGN KEY ("narrative_map_id") REFERENCES "narrative_maps" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "session_scripts" VALIDATE CONSTRAINT "session_scripts_narrative_map_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped session_scripts_narrative_map_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create session_scripts_narrative_map_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [344/384] session_scripts_therapist_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_scripts_therapist_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_scripts' AND column_name = 'therapist_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'profiles' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "session_scripts" ADD CONSTRAINT "session_scripts_therapist_id_fkey" FOREIGN KEY ("therapist_id") REFERENCES "profiles" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "session_scripts" VALIDATE CONSTRAINT "session_scripts_therapist_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped session_scripts_therapist_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create session_scripts_therapist_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [345/384] sessions_cidadela_card_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_cidadela_card_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sessions' AND column_name = 'cidadela_card_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'cidadela_oracle_cards' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "sessions" ADD CONSTRAINT "sessions_cidadela_card_id_fkey" FOREIGN KEY ("cidadela_card_id") REFERENCES "cidadela_oracle_cards" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "sessions" VALIDATE CONSTRAINT "sessions_cidadela_card_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped sessions_cidadela_card_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create sessions_cidadela_card_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [346/384] sessions_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sessions' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "sessions" ADD CONSTRAINT "sessions_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "sessions" VALIDATE CONSTRAINT "sessions_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped sessions_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create sessions_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [347/384] sessions_district_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_district_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sessions' AND column_name = 'district_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'districts' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "sessions" ADD CONSTRAINT "sessions_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "sessions" VALIDATE CONSTRAINT "sessions_district_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped sessions_district_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create sessions_district_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [348/384] sessions_tool_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_tool_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sessions' AND column_name = 'tool_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tools' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "sessions" ADD CONSTRAINT "sessions_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tools" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "sessions" VALIDATE CONSTRAINT "sessions_tool_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped sessions_tool_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create sessions_tool_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [349/384] sessoes_casa_maquinas_cliente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessoes_casa_maquinas_cliente_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sessoes_casa_maquinas' AND column_name = 'cliente_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "sessoes_casa_maquinas" ADD CONSTRAINT "sessoes_casa_maquinas_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "sessoes_casa_maquinas" VALIDATE CONSTRAINT "sessoes_casa_maquinas_cliente_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped sessoes_casa_maquinas_cliente_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create sessoes_casa_maquinas_cliente_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [350/384] sessoes_labirinto_porta_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessoes_labirinto_porta_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sessoes_labirinto' AND column_name = 'porta_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_fases' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "sessoes_labirinto" ADD CONSTRAINT "sessoes_labirinto_porta_id_fkey" FOREIGN KEY ("porta_id") REFERENCES "labirinto_fases" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "sessoes_labirinto" VALIDATE CONSTRAINT "sessoes_labirinto_porta_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped sessoes_labirinto_porta_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create sessoes_labirinto_porta_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [351/384] simulador_progresso_cenario_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'simulador_progresso_cenario_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'simulador_progresso' AND column_name = 'cenario_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'simulador_cenarios' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "simulador_progresso" ADD CONSTRAINT "simulador_progresso_cenario_id_fkey" FOREIGN KEY ("cenario_id") REFERENCES "simulador_cenarios" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "simulador_progresso" VALIDATE CONSTRAINT "simulador_progresso_cenario_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped simulador_progresso_cenario_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create simulador_progresso_cenario_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [352/384] sonho_estruturado_cliente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sonho_estruturado_cliente_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sonho_estruturado' AND column_name = 'cliente_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "sonho_estruturado" ADD CONSTRAINT "sonho_estruturado_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "sonho_estruturado" VALIDATE CONSTRAINT "sonho_estruturado_cliente_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped sonho_estruturado_cliente_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create sonho_estruturado_cliente_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [353/384] sonhos_cabalisticos_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sonhos_cabalisticos_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sonhos_cabalisticos' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "sonhos_cabalisticos" ADD CONSTRAINT "sonhos_cabalisticos_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "sonhos_cabalisticos" VALIDATE CONSTRAINT "sonhos_cabalisticos_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped sonhos_cabalisticos_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create sonhos_cabalisticos_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [354/384] station_progress_station_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'station_progress_station_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'station_progress' AND column_name = 'station_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clube_estacoes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "station_progress" ADD CONSTRAINT "station_progress_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "clube_estacoes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "station_progress" VALIDATE CONSTRAINT "station_progress_station_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped station_progress_station_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create station_progress_station_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [355/384] studio_episodes_eixo_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'studio_episodes_eixo_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'studio_episodes' AND column_name = 'eixo_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'studio_method_axes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "studio_episodes" ADD CONSTRAINT "studio_episodes_eixo_id_fkey" FOREIGN KEY ("eixo_id") REFERENCES "studio_method_axes" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "studio_episodes" VALIDATE CONSTRAINT "studio_episodes_eixo_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped studio_episodes_eixo_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create studio_episodes_eixo_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [356/384] symbolic_template_sessions_case_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'symbolic_template_sessions_case_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'symbolic_template_sessions' AND column_name = 'case_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'session_cases' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "symbolic_template_sessions" ADD CONSTRAINT "symbolic_template_sessions_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "session_cases" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "symbolic_template_sessions" VALIDATE CONSTRAINT "symbolic_template_sessions_case_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped symbolic_template_sessions_case_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create symbolic_template_sessions_case_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [357/384] symbolic_template_sessions_cliente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'symbolic_template_sessions_cliente_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'symbolic_template_sessions' AND column_name = 'cliente_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "symbolic_template_sessions" ADD CONSTRAINT "symbolic_template_sessions_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes" ("id") ON DELETE SET NULL NOT VALID';
                EXECUTE 'ALTER TABLE "symbolic_template_sessions" VALIDATE CONSTRAINT "symbolic_template_sessions_cliente_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped symbolic_template_sessions_cliente_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create symbolic_template_sessions_cliente_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [358/384] syntheia_conversations_mode_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'syntheia_conversations_mode_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'syntheia_conversations' AND column_name = 'mode_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'syntheia_modes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "syntheia_conversations" ADD CONSTRAINT "syntheia_conversations_mode_id_fkey" FOREIGN KEY ("mode_id") REFERENCES "syntheia_modes" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "syntheia_conversations" VALIDATE CONSTRAINT "syntheia_conversations_mode_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped syntheia_conversations_mode_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create syntheia_conversations_mode_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [359/384] syntheia_conversations_voice_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'syntheia_conversations_voice_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'syntheia_conversations' AND column_name = 'voice_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'syntheia_voices' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "syntheia_conversations" ADD CONSTRAINT "syntheia_conversations_voice_id_fkey" FOREIGN KEY ("voice_id") REFERENCES "syntheia_voices" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "syntheia_conversations" VALIDATE CONSTRAINT "syntheia_conversations_voice_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped syntheia_conversations_voice_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create syntheia_conversations_voice_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [360/384] syntheia_messages_conversation_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'syntheia_messages_conversation_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'syntheia_messages' AND column_name = 'conversation_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'syntheia_conversations' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "syntheia_messages" ADD CONSTRAINT "syntheia_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "syntheia_conversations" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "syntheia_messages" VALIDATE CONSTRAINT "syntheia_messages_conversation_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped syntheia_messages_conversation_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create syntheia_messages_conversation_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [361/384] tecela_conselho_respostas_conselho_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tecela_conselho_respostas_conselho_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tecela_conselho_respostas' AND column_name = 'conselho_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tecela_conselho' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "tecela_conselho_respostas" ADD CONSTRAINT "tecela_conselho_respostas_conselho_id_fkey" FOREIGN KEY ("conselho_id") REFERENCES "tecela_conselho" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "tecela_conselho_respostas" VALIDATE CONSTRAINT "tecela_conselho_respostas_conselho_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped tecela_conselho_respostas_conselho_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create tecela_conselho_respostas_conselho_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [362/384] tecela_ressonancias_registro_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tecela_ressonancias_registro_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tecela_ressonancias' AND column_name = 'registro_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tecela_registros_campo' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "tecela_ressonancias" ADD CONSTRAINT "tecela_ressonancias_registro_id_fkey" FOREIGN KEY ("registro_id") REFERENCES "tecela_registros_campo" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "tecela_ressonancias" VALIDATE CONSTRAINT "tecela_ressonancias_registro_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped tecela_ressonancias_registro_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create tecela_ressonancias_registro_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [363/384] tecela_supervisoes_caso_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tecela_supervisoes_caso_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tecela_supervisoes' AND column_name = 'caso_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tecela_casos_espelho' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "tecela_supervisoes" ADD CONSTRAINT "tecela_supervisoes_caso_id_fkey" FOREIGN KEY ("caso_id") REFERENCES "tecela_casos_espelho" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "tecela_supervisoes" VALIDATE CONSTRAINT "tecela_supervisoes_caso_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped tecela_supervisoes_caso_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create tecela_supervisoes_caso_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [364/384] tool_districts_district_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tool_districts_district_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tool_districts' AND column_name = 'district_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'city_districts' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "tool_districts" ADD CONSTRAINT "tool_districts_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "city_districts" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "tool_districts" VALIDATE CONSTRAINT "tool_districts_district_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped tool_districts_district_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create tool_districts_district_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [365/384] tool_districts_tool_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tool_districts_tool_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tool_districts' AND column_name = 'tool_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tools' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "tool_districts" ADD CONSTRAINT "tool_districts_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tools" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "tool_districts" VALIDATE CONSTRAINT "tool_districts_tool_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped tool_districts_tool_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create tool_districts_tool_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [366/384] tools_district_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tools_district_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tools' AND column_name = 'district_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'districts' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "tools" ADD CONSTRAINT "tools_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "tools" VALIDATE CONSTRAINT "tools_district_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped tools_district_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create tools_district_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [367/384] tools_ferramenta_pai_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tools_ferramenta_pai_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tools' AND column_name = 'ferramenta_pai_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tools' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "tools" ADD CONSTRAINT "tools_ferramenta_pai_id_fkey" FOREIGN KEY ("ferramenta_pai_id") REFERENCES "tools" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "tools" VALIDATE CONSTRAINT "tools_ferramenta_pai_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped tools_ferramenta_pai_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create tools_ferramenta_pai_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [368/384] tools_proximo_passo_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tools_proximo_passo_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tools' AND column_name = 'proximo_passo_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'tools' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "tools" ADD CONSTRAINT "tools_proximo_passo_id_fkey" FOREIGN KEY ("proximo_passo_id") REFERENCES "tools" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "tools" VALIDATE CONSTRAINT "tools_proximo_passo_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped tools_proximo_passo_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create tools_proximo_passo_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [369/384] torre_arquetipo_sugestao_arquetipo_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'torre_arquetipo_sugestao_arquetipo_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'torre_arquetipo_sugestao' AND column_name = 'arquetipo_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'atlas_arquetipos_femininos' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "torre_arquetipo_sugestao" ADD CONSTRAINT "torre_arquetipo_sugestao_arquetipo_id_fkey" FOREIGN KEY ("arquetipo_id") REFERENCES "atlas_arquetipos_femininos" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "torre_arquetipo_sugestao" VALIDATE CONSTRAINT "torre_arquetipo_sugestao_arquetipo_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped torre_arquetipo_sugestao_arquetipo_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create torre_arquetipo_sugestao_arquetipo_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [370/384] torre_porta_relacao_porta_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'torre_porta_relacao_porta_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'torre_porta_relacao' AND column_name = 'porta_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'labirinto_portas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "torre_porta_relacao" ADD CONSTRAINT "torre_porta_relacao_porta_id_fkey" FOREIGN KEY ("porta_id") REFERENCES "labirinto_portas" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "torre_porta_relacao" VALIDATE CONSTRAINT "torre_porta_relacao_porta_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped torre_porta_relacao_porta_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create torre_porta_relacao_porta_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [371/384] towers_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'towers_client_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'towers' AND column_name = 'client_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'clientes' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "towers" ADD CONSTRAINT "towers_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clientes" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "towers" VALIDATE CONSTRAINT "towers_client_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped towers_client_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create towers_client_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [372/384] towers_session_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'towers_session_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'towers' AND column_name = 'session_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'sessions' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "towers" ADD CONSTRAINT "towers_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "towers" VALIDATE CONSTRAINT "towers_session_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped towers_session_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create towers_session_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [373/384] travessia_comentarios_user_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_comentarios_user_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'travessia_comentarios' AND column_name = 'user_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'profiles' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "travessia_comentarios" ADD CONSTRAINT "travessia_comentarios_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "travessia_comentarios" VALIDATE CONSTRAINT "travessia_comentarios_user_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped travessia_comentarios_user_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create travessia_comentarios_user_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [374/384] travessia_day_unlocks_aula_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_day_unlocks_aula_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'travessia_day_unlocks' AND column_name = 'aula_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'conteudo_aulas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "travessia_day_unlocks" ADD CONSTRAINT "travessia_day_unlocks_aula_id_fkey" FOREIGN KEY ("aula_id") REFERENCES "conteudo_aulas" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "travessia_day_unlocks" VALIDATE CONSTRAINT "travessia_day_unlocks_aula_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped travessia_day_unlocks_aula_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create travessia_day_unlocks_aula_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [375/384] travessia_library_items_familia_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_library_items_familia_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'travessia_library_items' AND column_name = 'familia_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'travessia_familias' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "travessia_library_items" ADD CONSTRAINT "travessia_library_items_familia_id_fkey" FOREIGN KEY ("familia_id") REFERENCES "travessia_familias" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "travessia_library_items" VALIDATE CONSTRAINT "travessia_library_items_familia_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped travessia_library_items_familia_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create travessia_library_items_familia_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [376/384] travessia_library_media_item_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_library_media_item_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'travessia_library_media' AND column_name = 'item_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'travessia_library_items' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "travessia_library_media" ADD CONSTRAINT "travessia_library_media_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "travessia_library_items" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "travessia_library_media" VALIDATE CONSTRAINT "travessia_library_media_item_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped travessia_library_media_item_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create travessia_library_media_item_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [377/384] travessia_library_tags_item_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_library_tags_item_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'travessia_library_tags' AND column_name = 'item_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'travessia_library_items' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "travessia_library_tags" ADD CONSTRAINT "travessia_library_tags_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "travessia_library_items" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "travessia_library_tags" VALIDATE CONSTRAINT "travessia_library_tags_item_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped travessia_library_tags_item_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create travessia_library_tags_item_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [378/384] treinamento_respostas_caso_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'treinamento_respostas_caso_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'treinamento_respostas' AND column_name = 'caso_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'treinamento_casos_simulados' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "treinamento_respostas" ADD CONSTRAINT "treinamento_respostas_caso_id_fkey" FOREIGN KEY ("caso_id") REFERENCES "treinamento_casos_simulados" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "treinamento_respostas" VALIDATE CONSTRAINT "treinamento_respostas_caso_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped treinamento_respostas_caso_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create treinamento_respostas_caso_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [379/384] upsell_opportunities_rule_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'upsell_opportunities_rule_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'upsell_opportunities' AND column_name = 'rule_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'upsell_rules' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "upsell_opportunities" ADD CONSTRAINT "upsell_opportunities_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "upsell_rules" ("id")  NOT VALID';
                EXECUTE 'ALTER TABLE "upsell_opportunities" VALIDATE CONSTRAINT "upsell_opportunities_rule_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped upsell_opportunities_rule_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create upsell_opportunities_rule_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [380/384] user_aula_progress_aula_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_aula_progress_aula_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'user_aula_progress' AND column_name = 'aula_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'conteudo_aulas' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "user_aula_progress" ADD CONSTRAINT "user_aula_progress_aula_id_fkey" FOREIGN KEY ("aula_id") REFERENCES "conteudo_aulas" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "user_aula_progress" VALIDATE CONSTRAINT "user_aula_progress_aula_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped user_aula_progress_aula_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create user_aula_progress_aula_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [381/384] user_cidadela_estado_user_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_cidadela_estado_user_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'user_cidadela_estado' AND column_name = 'user_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'profiles' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "user_cidadela_estado" ADD CONSTRAINT "user_cidadela_estado_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "user_cidadela_estado" VALIDATE CONSTRAINT "user_cidadela_estado_user_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped user_cidadela_estado_user_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create user_cidadela_estado_user_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [382/384] user_favorites_library_item_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_favorites_library_item_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'user_favorites' AND column_name = 'library_item_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'library_items' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_library_item_id_fkey" FOREIGN KEY ("library_item_id") REFERENCES "library_items" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "user_favorites" VALIDATE CONSTRAINT "user_favorites_library_item_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped user_favorites_library_item_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create user_favorites_library_item_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [383/384] user_progress_lesson_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_progress_lesson_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'user_progress' AND column_name = 'lesson_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'lessons' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "user_progress" VALIDATE CONSTRAINT "user_progress_lesson_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped user_progress_lesson_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create user_progress_lesson_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    -- [384/384] user_unlocked_rewards_reward_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_unlocked_rewards_reward_id_fkey') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'user_unlocked_rewards' AND column_name = 'reward_id'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'symbolic_rewards' AND column_name = 'id'
            ) THEN
                EXECUTE 'ALTER TABLE "user_unlocked_rewards" ADD CONSTRAINT "user_unlocked_rewards_reward_id_fkey" FOREIGN KEY ("reward_id") REFERENCES "symbolic_rewards" ("id") ON DELETE CASCADE NOT VALID';
                EXECUTE 'ALTER TABLE "user_unlocked_rewards" VALIDATE CONSTRAINT "user_unlocked_rewards_reward_id_fkey"';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped user_unlocked_rewards_reward_id_fkey: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create user_unlocked_rewards_reward_id_fkey: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;

    RAISE NOTICE '--- SYNC SUMMARY ---';
    RAISE NOTICE 'Added: %', v_count_added;
    RAISE NOTICE 'Skipped (already exists): %', v_count_skipped;
    RAISE NOTICE 'Errors/Missing: %', v_count_error;
END $$;
