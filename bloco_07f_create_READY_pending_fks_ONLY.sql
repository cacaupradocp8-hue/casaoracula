-- bloco_07f_create_READY_pending_fks_ONLY.sql
DO $fk$
BEGIN
    -- access_expiration_logs_user_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'access_expiration_logs_user_id_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'access_expiration_logs' AND column_name = 'user_id')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'id') THEN
            ALTER TABLE public.access_expiration_logs ADD CONSTRAINT access_expiration_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles (id) NOT VALID;
            ALTER TABLE public.access_expiration_logs VALIDATE CONSTRAINT access_expiration_logs_user_id_fkey;
        END IF;
    END IF;

    -- admin_action_history_user_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'admin_action_history_user_id_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_action_history' AND column_name = 'user_id')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'id') THEN
            ALTER TABLE public.admin_action_history ADD CONSTRAINT admin_action_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles (id) NOT VALID;
            ALTER TABLE public.admin_action_history VALIDATE CONSTRAINT admin_action_history_user_id_fkey;
        END IF;
    END IF;

    -- admin_automation_audit_rule_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'admin_automation_audit_rule_id_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_automation_audit' AND column_name = 'rule_id')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_automation_rules' AND column_name = 'id') THEN
            ALTER TABLE public.admin_automation_audit ADD CONSTRAINT admin_automation_audit_rule_id_fkey FOREIGN KEY (rule_id) REFERENCES public.admin_automation_rules (id) NOT VALID;
            ALTER TABLE public.admin_automation_audit VALIDATE CONSTRAINT admin_automation_audit_rule_id_fkey;
        END IF;
    END IF;

    -- agente_conversas_agente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agente_conversas_agente_id_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agente_conversas' AND column_name = 'agente_id')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agentes' AND column_name = 'id') THEN
            ALTER TABLE public.agente_conversas ADD CONSTRAINT agente_conversas_agente_id_fkey FOREIGN KEY (agente_id) REFERENCES public.agentes (id) NOT VALID;
            ALTER TABLE public.agente_conversas VALIDATE CONSTRAINT agente_conversas_agente_id_fkey;
        END IF;
    END IF;

    -- agente_mensagens_conversa_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agente_mensagens_conversa_id_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agente_mensagens' AND column_name = 'conversa_id')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agente_conversas' AND column_name = 'id') THEN
            ALTER TABLE public.agente_mensagens ADD CONSTRAINT agente_mensagens_conversa_id_fkey FOREIGN KEY (conversa_id) REFERENCES public.agente_conversas (id) NOT VALID;
            ALTER TABLE public.agente_mensagens VALIDATE CONSTRAINT agente_mensagens_conversa_id_fkey;
        END IF;
    END IF;

    -- ai_interaction_logs_agente_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_interaction_logs_agente_id_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_interaction_logs' AND column_name = 'agente_id')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'agentes' AND column_name = 'id') THEN
            ALTER TABLE public.ai_interaction_logs ADD CONSTRAINT ai_interaction_logs_agente_id_fkey FOREIGN KEY (agente_id) REFERENCES public.agentes (id) NOT VALID;
            ALTER TABLE public.ai_interaction_logs VALIDATE CONSTRAINT ai_interaction_logs_agente_id_fkey;
        END IF;
    END IF;

    -- ai_recommendations_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_client_id_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_recommendations' AND column_name = 'client_id')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'id') THEN
            ALTER TABLE public.ai_recommendations ADD CONSTRAINT ai_recommendations_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes (id) NOT VALID;
            ALTER TABLE public.ai_recommendations VALIDATE CONSTRAINT ai_recommendations_client_id_fkey;
        END IF;
    END IF;

    -- ai_recommendations_distrito_sugerido_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_distrito_sugerido_id_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_recommendations' AND column_name = 'distrito_sugerido_id')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'city_districts' AND column_name = 'id') THEN
            ALTER TABLE public.ai_recommendations ADD CONSTRAINT ai_recommendations_distrito_sugerido_id_fkey FOREIGN KEY (distrito_sugerido_id) REFERENCES public.city_districts (id) NOT VALID;
            ALTER TABLE public.ai_recommendations VALIDATE CONSTRAINT ai_recommendations_distrito_sugerido_id_fkey;
        END IF;
    END IF;

    -- ai_recommendations_session_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_session_id_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_recommendations' AND column_name = 'session_id')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sessions' AND column_name = 'id') THEN
            ALTER TABLE public.ai_recommendations ADD CONSTRAINT ai_recommendations_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions (id) NOT VALID;
            ALTER TABLE public.ai_recommendations VALIDATE CONSTRAINT ai_recommendations_session_id_fkey;
        END IF;
    END IF;

    -- ai_recommendations_tool_sugerida_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_tool_sugerida_id_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_recommendations' AND column_name = 'tool_sugerida_id')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tools' AND column_name = 'id') THEN
            ALTER TABLE public.ai_recommendations ADD CONSTRAINT ai_recommendations_tool_sugerida_id_fkey FOREIGN KEY (tool_sugerida_id) REFERENCES public.tools (id) NOT VALID;
            ALTER TABLE public.ai_recommendations VALIDATE CONSTRAINT ai_recommendations_tool_sugerida_id_fkey;
        END IF;
    END IF;

    -- archetypal_profile_snapshots_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'archetypal_profile_snapshots_client_id_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'archetypal_profile_snapshots' AND column_name = 'client_id')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'id') THEN
            ALTER TABLE public.archetypal_profile_snapshots ADD CONSTRAINT archetypal_profile_snapshots_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes (id) NOT VALID;
            ALTER TABLE public.archetypal_profile_snapshots VALIDATE CONSTRAINT archetypal_profile_snapshots_client_id_fkey;
        END IF;
    END IF;

    -- archetype_tools_archetype_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'archetype_tools_archetype_id_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'archetype_tools' AND column_name = 'archetype_id')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'founding_archetypes' AND column_name = 'id') THEN
            ALTER TABLE public.archetype_tools ADD CONSTRAINT archetype_tools_archetype_id_fkey FOREIGN KEY (archetype_id) REFERENCES public.founding_archetypes (id) NOT VALID;
            ALTER TABLE public.archetype_tools VALIDATE CONSTRAINT archetype_tools_archetype_id_fkey;
        END IF;
    END IF;

    -- archetype_tools_tool_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'archetype_tools_tool_id_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'archetype_tools' AND column_name = 'tool_id')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tools' AND column_name = 'id') THEN
            ALTER TABLE public.archetype_tools ADD CONSTRAINT archetype_tools_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES public.tools (id) NOT VALID;
            ALTER TABLE public.archetype_tools VALIDATE CONSTRAINT archetype_tools_tool_id_fkey;
        END IF;
    END IF;

    -- atelie_conteudos_template_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'atelie_conteudos_template_id_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'atelie_conteudos' AND column_name = 'template_id')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'atelie_templates' AND column_name = 'id') THEN
            ALTER TABLE public.atelie_conteudos ADD CONSTRAINT atelie_conteudos_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.atelie_templates (id) NOT VALID;
            ALTER TABLE public.atelie_conteudos VALIDATE CONSTRAINT atelie_conteudos_template_id_fkey;
        END IF;
    END IF;

    -- atlas_arquetipos_registros_client_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'atlas_arquetipos_registros_client_id_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'atlas_arquetipos_registros' AND column_name = 'client_id')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clientes' AND column_name = 'id') THEN
            ALTER TABLE public.atlas_arquetipos_registros ADD CONSTRAINT atlas_arquetipos_registros_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes (id) NOT VALID;
            ALTER TABLE public.atlas_arquetipos_registros VALIDATE CONSTRAINT atlas_arquetipos_registros_client_id_fkey;
        END IF;
    END IF;

    -- aulas_portal_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'aulas_portal_id_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'aulas' AND column_name = 'portal_id')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portais' AND column_name = 'id') THEN
            ALTER TABLE public.aulas ADD CONSTRAINT aulas_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.portais (id) NOT VALID;
            ALTER TABLE public.aulas VALIDATE CONSTRAINT aulas_portal_id_fkey;
        END IF;
    END IF;

    -- biblioteca_casos_porta_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'biblioteca_casos_porta_id_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'biblioteca_casos' AND column_name = 'porta_id')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'labirinto_portas' AND column_name = 'id') THEN
            ALTER TABLE public.biblioteca_casos ADD CONSTRAINT biblioteca_casos_porta_id_fkey FOREIGN KEY (porta_id) REFERENCES public.labirinto_portas (id) NOT VALID;
            ALTER TABLE public.biblioteca_casos VALIDATE CONSTRAINT biblioteca_casos_porta_id_fkey;
        END IF;
    END IF;

    -- big5_funcional_perguntas_dimensao_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_funcional_perguntas_dimensao_id_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'big5_funcional_perguntas' AND column_name = 'dimensao_id')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'big5_funcional_dimensoes' AND column_name = 'id') THEN
            ALTER TABLE public.big5_funcional_perguntas ADD CONSTRAINT big5_funcional_perguntas_dimensao_id_fkey FOREIGN KEY (dimensao_id) REFERENCES public.big5_funcional_dimensoes (id) NOT VALID;
            ALTER TABLE public.big5_funcional_perguntas VALIDATE CONSTRAINT big5_funcional_perguntas_dimensao_id_fkey;
        END IF;
    END IF;

    -- big5_oracular_perguntas_fator_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_oracular_perguntas_fator_id_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'big5_oracular_perguntas' AND column_name = 'fator_id')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'big5_oracular_fatores' AND column_name = 'id') THEN
            ALTER TABLE public.big5_oracular_perguntas ADD CONSTRAINT big5_oracular_perguntas_fator_id_fkey FOREIGN KEY (fator_id) REFERENCES public.big5_oracular_fatores (id) NOT VALID;
            ALTER TABLE public.big5_oracular_perguntas VALIDATE CONSTRAINT big5_oracular_perguntas_fator_id_fkey;
        END IF;
    END IF;

    -- big5_porta_mapeamento_ritual_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_porta_mapeamento_ritual_id_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'big5_porta_mapeamento' AND column_name = 'ritual_id')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rituais_simbolicos' AND column_name = 'id') THEN
            ALTER TABLE public.big5_porta_mapeamento ADD CONSTRAINT big5_porta_mapeamento_ritual_id_fkey FOREIGN KEY (ritual_id) REFERENCES public.rituais_simbolicos (id) NOT VALID;
            ALTER TABLE public.big5_porta_mapeamento VALIDATE CONSTRAINT big5_porta_mapeamento_ritual_id_fkey;
        END IF;
    END IF;

    -- big5_ritual_registros_big5_registro_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_ritual_registros_big5_registro_id_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'big5_ritual_registros' AND column_name = 'big5_registro_id')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'big5_oracular_registros' AND column_name = 'id') THEN
            ALTER TABLE public.big5_ritual_registros ADD CONSTRAINT big5_ritual_registros_big5_registro_id_fkey FOREIGN KEY (big5_registro_id) REFERENCES public.big5_oracular_registros (id) NOT VALID;
            ALTER TABLE public.big5_ritual_registros VALIDATE CONSTRAINT big5_ritual_registros_big5_registro_id_fkey;
        END IF;
    END IF;

    -- big5_ritual_registros_ritual_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_ritual_registros_ritual_id_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'big5_ritual_registros' AND column_name = 'ritual_id')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rituais_simbolicos' AND column_name = 'id') THEN
            ALTER TABLE public.big5_ritual_registros ADD CONSTRAINT big5_ritual_registros_ritual_id_fkey FOREIGN KEY (ritual_id) REFERENCES public.rituais_simbolicos (id) NOT VALID;
            ALTER TABLE public.big5_ritual_registros VALIDATE CONSTRAINT big5_ritual_registros_ritual_id_fkey;
        END IF;
    END IF;

    -- big5_symbolic_afirmacoes_force_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_symbolic_afirmacoes_force_id_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'big5_symbolic_afirmacoes' AND column_name = 'force_id')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'big5_symbolic_forces' AND column_name = 'id') THEN
            ALTER TABLE public.big5_symbolic_afirmacoes ADD CONSTRAINT big5_symbolic_afirmacoes_force_id_fkey FOREIGN KEY (force_id) REFERENCES public.big5_symbolic_forces (id) NOT VALID;
            ALTER TABLE public.big5_symbolic_afirmacoes VALIDATE CONSTRAINT big5_symbolic_afirmacoes_force_id_fkey;
        END IF;
    END IF;

    -- big5_symbolic_registros_session_case_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_symbolic_registros_session_case_id_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'big5_symbolic_registros' AND column_name = 'session_case_id')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'session_cases' AND column_name = 'id') THEN
            ALTER TABLE public.big5_symbolic_registros ADD CONSTRAINT big5_symbolic_registros_session_case_id_fkey FOREIGN KEY (session_case_id) REFERENCES public.session_cases (id) NOT VALID;
            ALTER TABLE public.big5_symbolic_registros VALIDATE CONSTRAINT big5_symbolic_registros_session_case_id_fkey;
        END IF;
    END IF;

    -- book_links_from_book_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_links_from_book_id_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'book_links' AND column_name = 'from_book_id')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'id') THEN
            ALTER TABLE public.book_links ADD CONSTRAINT book_links_from_book_id_fkey FOREIGN KEY (from_book_id) REFERENCES public.books (id) NOT VALID;
            ALTER TABLE public.book_links VALIDATE CONSTRAINT book_links_from_book_id_fkey;
        END IF;
    END IF;

    -- book_links_to_book_id_fkey
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_links_to_book_id_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'book_links' AND column_name = 'to_book_id')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'books' AND column_name = 'id') THEN
            ALTER TABLE public.book_links ADD CONSTRAINT book_links_to_book_id_fkey FOREIGN KEY (to_book_id) REFERENCES public.books (id) NOT VALID;
            ALTER TABLE public.book_links VALIDATE CONSTRAINT book_links_to_book_id_fkey;
        END IF;
    END IF;

END $fk$;