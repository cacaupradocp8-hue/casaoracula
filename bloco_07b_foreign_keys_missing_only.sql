-- Bloco 07b: Foreign Keys Missing Only


DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'academy_progress_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'academy_progress') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
                OR 'profiles' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.academy_progress ADD CONSTRAINT academy_progress_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: access_expiration_logs access_expiration_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_expiration_logs
    ADD CONSTRAINT access_expiration_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ;
                RAISE NOTICE 'Created FK academy_progress_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK academy_progress_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK academy_progress_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'admin_action_history_sent_by_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_action_history') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
                OR 'profiles' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.admin_action_history ADD CONSTRAINT admin_action_history_sent_by_fkey 
                FOREIGN KEY (sent_by) REFERENCES auth.users(id);


--
-- Name: admin_action_history admin_action_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_action_history
    ADD CONSTRAINT admin_action_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ;
                RAISE NOTICE 'Created FK admin_action_history_sent_by_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK admin_action_history_sent_by_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK admin_action_history_sent_by_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'admin_automation_audit_admin_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_automation_audit') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_automation_rules') 
                OR 'admin_automation_rules' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.admin_automation_audit ADD CONSTRAINT admin_automation_audit_admin_id_fkey 
                FOREIGN KEY (admin_id) REFERENCES auth.users(id);


--
-- Name: admin_automation_audit admin_automation_audit_rule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_automation_audit
    ADD CONSTRAINT admin_automation_audit_rule_id_fkey FOREIGN KEY (rule_id) REFERENCES public.admin_automation_rules(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK admin_automation_audit_admin_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK admin_automation_audit_admin_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK admin_automation_audit_admin_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agente_conversas_agente_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agente_conversas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agentes') 
                OR 'agentes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.agente_conversas ADD CONSTRAINT agente_conversas_agente_id_fkey 
                FOREIGN KEY (agente_id) REFERENCES public.agentes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK agente_conversas_agente_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK agente_conversas_agente_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK agente_conversas_agente_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agente_conversas_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agente_conversas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agente_conversas') 
                OR 'agente_conversas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.agente_conversas ADD CONSTRAINT agente_conversas_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: agente_mensagens agente_mensagens_conversa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agente_mensagens
    ADD CONSTRAINT agente_mensagens_conversa_id_fkey FOREIGN KEY (conversa_id) REFERENCES public.agente_conversas(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK agente_conversas_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK agente_conversas_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK agente_conversas_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_interaction_logs_agente_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_interaction_logs') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agentes') 
                OR 'agentes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.ai_interaction_logs ADD CONSTRAINT ai_interaction_logs_agente_id_fkey 
                FOREIGN KEY (agente_id) REFERENCES public.agentes(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK ai_interaction_logs_agente_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK ai_interaction_logs_agente_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK ai_interaction_logs_agente_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_recommendations') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.ai_recommendations ADD CONSTRAINT ai_recommendations_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK ai_recommendations_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK ai_recommendations_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK ai_recommendations_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_distrito_sugerido_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_recommendations') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'city_districts') 
                OR 'city_districts' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.ai_recommendations ADD CONSTRAINT ai_recommendations_distrito_sugerido_id_fkey 
                FOREIGN KEY (distrito_sugerido_id) REFERENCES public.city_districts(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK ai_recommendations_distrito_sugerido_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK ai_recommendations_distrito_sugerido_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK ai_recommendations_distrito_sugerido_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_session_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_recommendations') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
                OR 'sessions' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.ai_recommendations ADD CONSTRAINT ai_recommendations_session_id_fkey 
                FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK ai_recommendations_session_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK ai_recommendations_session_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK ai_recommendations_session_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_tool_sugerida_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_recommendations') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
                OR 'tools' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.ai_recommendations ADD CONSTRAINT ai_recommendations_tool_sugerida_id_fkey 
                FOREIGN KEY (tool_sugerida_id) REFERENCES public.tools(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK ai_recommendations_tool_sugerida_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK ai_recommendations_tool_sugerida_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK ai_recommendations_tool_sugerida_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'archetypal_profile_snapshots_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'archetypal_profile_snapshots') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.archetypal_profile_snapshots ADD CONSTRAINT archetypal_profile_snapshots_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK archetypal_profile_snapshots_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK archetypal_profile_snapshots_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK archetypal_profile_snapshots_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'archetype_tools_archetype_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'archetype_tools') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_archetypes') 
                OR 'founding_archetypes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.archetype_tools ADD CONSTRAINT archetype_tools_archetype_id_fkey 
                FOREIGN KEY (archetype_id) REFERENCES public.founding_archetypes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK archetype_tools_archetype_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK archetype_tools_archetype_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK archetype_tools_archetype_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'archetype_tools_tool_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'archetype_tools') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
                OR 'tools' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.archetype_tools ADD CONSTRAINT archetype_tools_tool_id_fkey 
                FOREIGN KEY (tool_id) REFERENCES public.tools(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK archetype_tools_tool_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK archetype_tools_tool_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK archetype_tools_tool_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'atelie_conteudos_created_by_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'atelie_conteudos') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'atelie_templates') 
                OR 'atelie_templates' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.atelie_conteudos ADD CONSTRAINT atelie_conteudos_created_by_fkey 
                FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: atelie_conteudos atelie_conteudos_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.atelie_conteudos
    ADD CONSTRAINT atelie_conteudos_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.atelie_templates(id) ;
                RAISE NOTICE 'Created FK atelie_conteudos_created_by_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK atelie_conteudos_created_by_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK atelie_conteudos_created_by_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'atlas_arquetipos_registros_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_registros') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.atlas_arquetipos_registros ADD CONSTRAINT atlas_arquetipos_registros_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK atlas_arquetipos_registros_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK atlas_arquetipos_registros_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK atlas_arquetipos_registros_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'aulas_created_by_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'aulas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portais') 
                OR 'portais' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.aulas ADD CONSTRAINT aulas_created_by_fkey 
                FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: aulas aulas_portal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.aulas
    ADD CONSTRAINT aulas_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.portais(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK aulas_created_by_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK aulas_created_by_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK aulas_created_by_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'auto_mapeamento_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'auto_mapeamento') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_portas') 
                OR 'labirinto_portas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.auto_mapeamento ADD CONSTRAINT auto_mapeamento_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: automation_settings automation_settings_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.automation_settings
    ADD CONSTRAINT automation_settings_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: biblioteca_casos biblioteca_casos_porta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.biblioteca_casos
    ADD CONSTRAINT biblioteca_casos_porta_id_fkey FOREIGN KEY (porta_id) REFERENCES public.labirinto_portas(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK auto_mapeamento_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK auto_mapeamento_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK auto_mapeamento_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_funcional_perguntas_dimensao_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_funcional_perguntas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_funcional_dimensoes') 
                OR 'big5_funcional_dimensoes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.big5_funcional_perguntas ADD CONSTRAINT big5_funcional_perguntas_dimensao_id_fkey 
                FOREIGN KEY (dimensao_id) REFERENCES public.big5_funcional_dimensoes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK big5_funcional_perguntas_dimensao_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK big5_funcional_perguntas_dimensao_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK big5_funcional_perguntas_dimensao_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_oracular_perguntas_fator_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_oracular_perguntas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_oracular_fatores') 
                OR 'big5_oracular_fatores' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.big5_oracular_perguntas ADD CONSTRAINT big5_oracular_perguntas_fator_id_fkey 
                FOREIGN KEY (fator_id) REFERENCES public.big5_oracular_fatores(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK big5_oracular_perguntas_fator_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK big5_oracular_perguntas_fator_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK big5_oracular_perguntas_fator_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_porta_mapeamento_ritual_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_porta_mapeamento') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rituais_simbolicos') 
                OR 'rituais_simbolicos' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.big5_porta_mapeamento ADD CONSTRAINT big5_porta_mapeamento_ritual_id_fkey 
                FOREIGN KEY (ritual_id) REFERENCES public.rituais_simbolicos(id) ;
                RAISE NOTICE 'Created FK big5_porta_mapeamento_ritual_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK big5_porta_mapeamento_ritual_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK big5_porta_mapeamento_ritual_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_registros_cliente_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_registros') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_oracular_registros') 
                OR 'big5_oracular_registros' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.big5_registros ADD CONSTRAINT big5_registros_cliente_id_fkey 
                FOREIGN KEY (cliente_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: big5_registros big5_registros_therapist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.big5_registros
    ADD CONSTRAINT big5_registros_therapist_id_fkey FOREIGN KEY (terapeuta_id) REFERENCES auth.users(id);


--
-- Name: big5_registros big5_registros_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.big5_registros
    ADD CONSTRAINT big5_registros_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: big5_ritual_registros big5_ritual_registros_big5_registro_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.big5_ritual_registros
    ADD CONSTRAINT big5_ritual_registros_big5_registro_id_fkey FOREIGN KEY (big5_registro_id) REFERENCES public.big5_oracular_registros(id) ;
                RAISE NOTICE 'Created FK big5_registros_cliente_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK big5_registros_cliente_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK big5_registros_cliente_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_ritual_registros_ritual_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_ritual_registros') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rituais_simbolicos') 
                OR 'rituais_simbolicos' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.big5_ritual_registros ADD CONSTRAINT big5_ritual_registros_ritual_id_fkey 
                FOREIGN KEY (ritual_id) REFERENCES public.rituais_simbolicos(id) ;
                RAISE NOTICE 'Created FK big5_ritual_registros_ritual_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK big5_ritual_registros_ritual_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK big5_ritual_registros_ritual_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_symbolic_afirmacoes_force_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_symbolic_afirmacoes') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_symbolic_forces') 
                OR 'big5_symbolic_forces' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.big5_symbolic_afirmacoes ADD CONSTRAINT big5_symbolic_afirmacoes_force_id_fkey 
                FOREIGN KEY (force_id) REFERENCES public.big5_symbolic_forces(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK big5_symbolic_afirmacoes_force_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK big5_symbolic_afirmacoes_force_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK big5_symbolic_afirmacoes_force_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_symbolic_registros_session_case_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_symbolic_registros') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
                OR 'session_cases' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.big5_symbolic_registros ADD CONSTRAINT big5_symbolic_registros_session_case_id_fkey 
                FOREIGN KEY (session_case_id) REFERENCES public.session_cases(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK big5_symbolic_registros_session_case_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK big5_symbolic_registros_session_case_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK big5_symbolic_registros_session_case_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_links_from_book_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'book_links') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
                OR 'books' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.book_links ADD CONSTRAINT book_links_from_book_id_fkey 
                FOREIGN KEY (from_book_id) REFERENCES public.books(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK book_links_from_book_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK book_links_from_book_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK book_links_from_book_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_links_to_book_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'book_links') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
                OR 'books' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.book_links ADD CONSTRAINT book_links_to_book_id_fkey 
                FOREIGN KEY (to_book_id) REFERENCES public.books(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK book_links_to_book_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK book_links_to_book_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK book_links_to_book_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_media_station_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'book_media') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
                OR 'clube_estacoes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.book_media ADD CONSTRAINT book_media_station_id_fkey 
                FOREIGN KEY (station_id) REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK book_media_station_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK book_media_station_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK book_media_station_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_tours_book_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'book_tours') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
                OR 'books' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.book_tours ADD CONSTRAINT book_tours_book_id_fkey 
                FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK book_tours_book_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK book_tours_book_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK book_tours_book_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'canteiro_reactions_entry_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'canteiro_reactions') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'collective_bed_entries') 
                OR 'collective_bed_entries' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.canteiro_reactions ADD CONSTRAINT canteiro_reactions_entry_id_fkey 
                FOREIGN KEY (entry_id) REFERENCES public.collective_bed_entries(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK canteiro_reactions_entry_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK canteiro_reactions_entry_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK canteiro_reactions_entry_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartografia_complexos_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartografia_complexos') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.cartografia_complexos ADD CONSTRAINT cartografia_complexos_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK cartografia_complexos_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK cartografia_complexos_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK cartografia_complexos_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartografia_psiquica_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartografia_psiquica') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.cartografia_psiquica ADD CONSTRAINT cartografia_psiquica_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK cartografia_psiquica_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK cartografia_psiquica_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK cartografia_psiquica_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_engine_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographer_engine') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.cartographer_engine ADD CONSTRAINT cartographer_engine_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK cartographer_engine_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK cartographer_engine_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK cartographer_engine_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_engine_session_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographer_engine') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
                OR 'sessions' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.cartographer_engine ADD CONSTRAINT cartographer_engine_session_id_fkey 
                FOREIGN KEY (session_id) REFERENCES public.sessions(id) ;
                RAISE NOTICE 'Created FK cartographer_engine_session_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK cartographer_engine_session_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK cartographer_engine_session_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_recommendations_engine_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographer_engine') 
                OR 'cartographer_engine' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.cartographer_recommendations ADD CONSTRAINT cartographer_recommendations_engine_id_fkey 
                FOREIGN KEY (engine_id) REFERENCES public.cartographer_engine(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK cartographer_recommendations_engine_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK cartographer_recommendations_engine_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK cartographer_recommendations_engine_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_recommendations_ferramenta_escolhida_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
                OR 'tools' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.cartographer_recommendations ADD CONSTRAINT cartographer_recommendations_ferramenta_escolhida_id_fkey 
                FOREIGN KEY (ferramenta_escolhida_id) REFERENCES public.tools(id) ;
                RAISE NOTICE 'Created FK cartographer_recommendations_ferramenta_escolhida_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK cartographer_recommendations_ferramenta_escolhida_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK cartographer_recommendations_ferramenta_escolhida_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_recommendations_tool_complementar_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
                OR 'tools' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.cartographer_recommendations ADD CONSTRAINT cartographer_recommendations_tool_complementar_id_fkey 
                FOREIGN KEY (tool_complementar_id) REFERENCES public.tools(id) ;
                RAISE NOTICE 'Created FK cartographer_recommendations_tool_complementar_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK cartographer_recommendations_tool_complementar_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK cartographer_recommendations_tool_complementar_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_recommendations_tool_principal_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
                OR 'tools' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.cartographer_recommendations ADD CONSTRAINT cartographer_recommendations_tool_principal_id_fkey 
                FOREIGN KEY (tool_principal_id) REFERENCES public.tools(id) ;
                RAISE NOTICE 'Created FK cartographer_recommendations_tool_principal_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK cartographer_recommendations_tool_principal_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK cartographer_recommendations_tool_principal_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographies_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographies') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.cartographies ADD CONSTRAINT cartographies_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK cartographies_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK cartographies_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK cartographies_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographies_session_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographies') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
                OR 'sessions' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.cartographies ADD CONSTRAINT cartographies_session_id_fkey 
                FOREIGN KEY (session_id) REFERENCES public.sessions(id) ;
                RAISE NOTICE 'Created FK cartographies_session_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK cartographies_session_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK cartographies_session_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'casa_circulo_replies_autor_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'casa_circulo_replies') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'casa_circulo_threads') 
                OR 'casa_circulo_threads' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.casa_circulo_replies ADD CONSTRAINT casa_circulo_replies_autor_id_fkey 
                FOREIGN KEY (autor_id) REFERENCES auth.users(id);


--
-- Name: casa_circulo_replies casa_circulo_replies_thread_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.casa_circulo_replies
    ADD CONSTRAINT casa_circulo_replies_thread_id_fkey FOREIGN KEY (thread_id) REFERENCES public.casa_circulo_threads(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK casa_circulo_replies_autor_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK casa_circulo_replies_autor_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK casa_circulo_replies_autor_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'casa_circulo_threads_autor_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'casa_circulo_threads') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') 
                OR 'districts' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.casa_circulo_threads ADD CONSTRAINT casa_circulo_threads_autor_id_fkey 
                FOREIGN KEY (autor_id) REFERENCES auth.users(id);


--
-- Name: casa_posts casa_posts_autor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.casa_posts
    ADD CONSTRAINT casa_posts_autor_id_fkey FOREIGN KEY (autor_id) REFERENCES auth.users(id);


--
-- Name: certificates certificates_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: cidadela_mapa_vivo cidadela_mapa_vivo_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cidadela_mapa_vivo
    ADD CONSTRAINT cidadela_mapa_vivo_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: cidadela_oracle_cards cidadela_oracle_cards_district_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cidadela_oracle_cards
    ADD CONSTRAINT cidadela_oracle_cards_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.districts(id) ;
                RAISE NOTICE 'Created FK casa_circulo_threads_autor_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK casa_circulo_threads_autor_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK casa_circulo_threads_autor_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cidadela_oracle_cards_suggested_tool_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
                OR 'tools' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.cidadela_oracle_cards ADD CONSTRAINT cidadela_oracle_cards_suggested_tool_id_fkey 
                FOREIGN KEY (suggested_tool_id) REFERENCES public.tools(id) ;
                RAISE NOTICE 'Created FK cidadela_oracle_cards_suggested_tool_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK cidadela_oracle_cards_suggested_tool_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK cidadela_oracle_cards_suggested_tool_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cidadela_oracle_usage_card_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_usage') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards') 
                OR 'cidadela_oracle_cards' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.cidadela_oracle_usage ADD CONSTRAINT cidadela_oracle_usage_card_id_fkey 
                FOREIGN KEY (card_id) REFERENCES public.cidadela_oracle_cards(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK cidadela_oracle_usage_card_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK cidadela_oracle_usage_card_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK cidadela_oracle_usage_card_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cidadela_oracle_usage_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_usage') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.cidadela_oracle_usage ADD CONSTRAINT cidadela_oracle_usage_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK cidadela_oracle_usage_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK cidadela_oracle_usage_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK cidadela_oracle_usage_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'circulo_oracular_registros_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'circulo_oracular_registros') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_archetypes') 
                OR 'founding_archetypes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.circulo_oracular_registros ADD CONSTRAINT circulo_oracular_registros_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: client_archetype_state client_archetype_state_arquitipo_evolucao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_archetype_state
    ADD CONSTRAINT client_archetype_state_arquitipo_evolucao_id_fkey FOREIGN KEY (arquitipo_evolucao_id) REFERENCES public.founding_archetypes(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK circulo_oracular_registros_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK circulo_oracular_registros_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK circulo_oracular_registros_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_archetype_state_arquitipo_regente_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_archetype_state') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_archetypes') 
                OR 'founding_archetypes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.client_archetype_state ADD CONSTRAINT client_archetype_state_arquitipo_regente_id_fkey 
                FOREIGN KEY (arquitipo_regente_id) REFERENCES public.founding_archetypes(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK client_archetype_state_arquitipo_regente_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK client_archetype_state_arquitipo_regente_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK client_archetype_state_arquitipo_regente_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_archetype_state_arquitipo_sombra_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_archetype_state') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_archetypes') 
                OR 'founding_archetypes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.client_archetype_state ADD CONSTRAINT client_archetype_state_arquitipo_sombra_id_fkey 
                FOREIGN KEY (arquitipo_sombra_id) REFERENCES public.founding_archetypes(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK client_archetype_state_arquitipo_sombra_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK client_archetype_state_arquitipo_sombra_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK client_archetype_state_arquitipo_sombra_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_archetype_state_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_archetype_state') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.client_archetype_state ADD CONSTRAINT client_archetype_state_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK client_archetype_state_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK client_archetype_state_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK client_archetype_state_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_cidadela_map_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_cidadela_map') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.client_cidadela_map ADD CONSTRAINT client_cidadela_map_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK client_cidadela_map_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK client_cidadela_map_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK client_cidadela_map_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_arquetipo_ativo_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_city_state') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_archetypes') 
                OR 'founding_archetypes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.client_city_state ADD CONSTRAINT client_city_state_arquetipo_ativo_fkey 
                FOREIGN KEY (arquetipo_ativo) REFERENCES public.founding_archetypes(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK client_city_state_arquetipo_ativo_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK client_city_state_arquetipo_ativo_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK client_city_state_arquetipo_ativo_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_city_state') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.client_city_state ADD CONSTRAINT client_city_state_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK client_city_state_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK client_city_state_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK client_city_state_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_distrito_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_city_state') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'city_districts') 
                OR 'city_districts' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.client_city_state ADD CONSTRAINT client_city_state_distrito_id_fkey 
                FOREIGN KEY (distrito_id) REFERENCES public.city_districts(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK client_city_state_distrito_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK client_city_state_distrito_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK client_city_state_distrito_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_ultima_ferramenta_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_city_state') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
                OR 'tools' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.client_city_state ADD CONSTRAINT client_city_state_ultima_ferramenta_id_fkey 
                FOREIGN KEY (ultima_ferramenta_id) REFERENCES public.tools(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK client_city_state_ultima_ferramenta_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK client_city_state_ultima_ferramenta_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK client_city_state_ultima_ferramenta_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_ultima_sessao_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_city_state') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
                OR 'sessions' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.client_city_state ADD CONSTRAINT client_city_state_ultima_sessao_id_fkey 
                FOREIGN KEY (ultima_sessao_id) REFERENCES public.sessions(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK client_city_state_ultima_sessao_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK client_city_state_ultima_sessao_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK client_city_state_ultima_sessao_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_labyrinths_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_labyrinths') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.client_labyrinths ADD CONSTRAINT client_labyrinths_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK client_labyrinths_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK client_labyrinths_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK client_labyrinths_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_live_map_entries_session_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_live_map_entries') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
                OR 'sessions' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.client_live_map_entries ADD CONSTRAINT client_live_map_entries_session_id_fkey 
                FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK client_live_map_entries_session_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK client_live_map_entries_session_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK client_live_map_entries_session_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_pattern_stats_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_pattern_stats') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.client_pattern_stats ADD CONSTRAINT client_pattern_stats_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK client_pattern_stats_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK client_pattern_stats_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK client_pattern_stats_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_seasons_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_seasons') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.client_seasons ADD CONSTRAINT client_seasons_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK client_seasons_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK client_seasons_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK client_seasons_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clientes_client_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles') 
                OR '_deprecated_club_cycles' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.clientes ADD CONSTRAINT clientes_client_user_id_fkey 
                FOREIGN KEY (client_user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: clientes clientes_invited_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_invited_by_fkey FOREIGN KEY (invited_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: clientes_piloto clientes_piloto_supervisor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes_piloto
    ADD CONSTRAINT clientes_piloto_supervisor_id_fkey FOREIGN KEY (supervisor_id) REFERENCES auth.users(id);


--
-- Name: clientes_piloto clientes_piloto_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes_piloto
    ADD CONSTRAINT clientes_piloto_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: _deprecated_club_books club_books_cycle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._deprecated_club_books
    ADD CONSTRAINT club_books_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES public._deprecated_club_cycles(id) ;
                RAISE NOTICE 'Created FK clientes_client_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK clientes_client_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK clientes_client_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'club_knowledge_entries_book_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_knowledge_entries') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
                OR 'books' = 'users') THEN
            
            BEGIN
                ALTER TABLE public._deprecated_club_knowledge_entries ADD CONSTRAINT club_knowledge_entries_book_id_fkey 
                FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK club_knowledge_entries_book_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK club_knowledge_entries_book_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK club_knowledge_entries_book_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'club_meetings_cycle_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_meetings') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles') 
                OR '_deprecated_club_cycles' = 'users') THEN
            
            BEGIN
                ALTER TABLE public._deprecated_club_meetings ADD CONSTRAINT club_meetings_cycle_id_fkey 
                FOREIGN KEY (cycle_id) REFERENCES public._deprecated_club_cycles(id) ;
                RAISE NOTICE 'Created FK club_meetings_cycle_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK club_meetings_cycle_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK club_meetings_cycle_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'club_user_cycles_cycle_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_user_cycles') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles') 
                OR '_deprecated_club_cycles' = 'users') THEN
            
            BEGIN
                ALTER TABLE public._deprecated_club_user_cycles ADD CONSTRAINT club_user_cycles_cycle_id_fkey 
                FOREIGN KEY (cycle_id) REFERENCES public._deprecated_club_cycles(id) ;
                RAISE NOTICE 'Created FK club_user_cycles_cycle_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK club_user_cycles_cycle_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK club_user_cycles_cycle_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_audio_albums_estacao_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_audio_albums') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
                OR 'clube_estacoes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.clube_audio_albums ADD CONSTRAINT clube_audio_albums_estacao_id_fkey 
                FOREIGN KEY (estacao_id) REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK clube_audio_albums_estacao_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK clube_audio_albums_estacao_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK clube_audio_albums_estacao_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_audio_progress_track_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_audio_progress') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_audio_tracks') 
                OR 'clube_audio_tracks' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.clube_audio_progress ADD CONSTRAINT clube_audio_progress_track_id_fkey 
                FOREIGN KEY (track_id) REFERENCES public.clube_audio_tracks(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK clube_audio_progress_track_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK clube_audio_progress_track_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK clube_audio_progress_track_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_audio_tracks_album_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_audio_tracks') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_audio_albums') 
                OR 'clube_audio_albums' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.clube_audio_tracks ADD CONSTRAINT clube_audio_tracks_album_id_fkey 
                FOREIGN KEY (album_id) REFERENCES public.clube_audio_albums(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK clube_audio_tracks_album_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK clube_audio_tracks_album_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK clube_audio_tracks_album_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_carrossel_slides_estacao_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_carrossel_slides') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
                OR 'oracular_seasons' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.clube_carrossel_slides ADD CONSTRAINT clube_carrossel_slides_estacao_id_fkey 
                FOREIGN KEY (estacao_id) REFERENCES public.oracular_seasons(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK clube_carrossel_slides_estacao_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK clube_carrossel_slides_estacao_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK clube_carrossel_slides_estacao_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_engajamento_estacao_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_engajamento') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
                OR 'clube_estacoes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.clube_engajamento ADD CONSTRAINT clube_engajamento_estacao_id_fkey 
                FOREIGN KEY (estacao_id) REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK clube_engajamento_estacao_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK clube_engajamento_estacao_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK clube_engajamento_estacao_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_estacao_registros_estacao_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacao_registros') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
                OR 'clube_estacoes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.clube_estacao_registros ADD CONSTRAINT clube_estacao_registros_estacao_id_fkey 
                FOREIGN KEY (estacao_id) REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK clube_estacao_registros_estacao_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK clube_estacao_registros_estacao_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK clube_estacao_registros_estacao_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_estacoes_cartografia_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographies') 
                OR 'cartographies' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.clube_estacoes ADD CONSTRAINT clube_estacoes_cartografia_id_fkey 
                FOREIGN KEY (cartografia_id) REFERENCES public.cartographies(id) ;
                RAISE NOTICE 'Created FK clube_estacoes_cartografia_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK clube_estacoes_cartografia_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK clube_estacoes_cartografia_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_estacoes_quiz_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quizzes') 
                OR 'quizzes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.clube_estacoes ADD CONSTRAINT clube_estacoes_quiz_id_fkey 
                FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ;
                RAISE NOTICE 'Created FK clube_estacoes_quiz_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK clube_estacoes_quiz_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK clube_estacoes_quiz_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_jornadas_estacao_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_jornadas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
                OR 'clube_estacoes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.clube_jornadas ADD CONSTRAINT clube_jornadas_estacao_id_fkey 
                FOREIGN KEY (estacao_id) REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK clube_jornadas_estacao_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK clube_jornadas_estacao_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK clube_jornadas_estacao_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_livro_aulas_porta_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_aulas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_portas') 
                OR 'clube_livro_portas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.clube_livro_aulas ADD CONSTRAINT clube_livro_aulas_porta_id_fkey 
                FOREIGN KEY (porta_id) REFERENCES public.clube_livro_portas(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK clube_livro_aulas_porta_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK clube_livro_aulas_porta_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK clube_livro_aulas_porta_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_livro_chat_interactions_book_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_chat_interactions') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
                OR 'books' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.clube_livro_chat_interactions ADD CONSTRAINT clube_livro_chat_interactions_book_id_fkey 
                FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK clube_livro_chat_interactions_book_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK clube_livro_chat_interactions_book_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK clube_livro_chat_interactions_book_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_livro_chat_interactions_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_chat_interactions') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
                OR 'clube_estacoes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.clube_livro_chat_interactions ADD CONSTRAINT clube_livro_chat_interactions_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: clube_livro_encontros clube_livro_encontros_estacao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clube_livro_encontros
    ADD CONSTRAINT clube_livro_encontros_estacao_id_fkey FOREIGN KEY (estacao_id) REFERENCES public.clube_estacoes(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK clube_livro_chat_interactions_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK clube_livro_chat_interactions_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK clube_livro_chat_interactions_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_livro_respostas_pergunta_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_respostas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_perguntas') 
                OR 'clube_livro_perguntas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.clube_livro_respostas ADD CONSTRAINT clube_livro_respostas_pergunta_id_fkey 
                FOREIGN KEY (pergunta_id) REFERENCES public.clube_livro_perguntas(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK clube_livro_respostas_pergunta_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK clube_livro_respostas_pergunta_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK clube_livro_respostas_pergunta_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_obras_essencia_8020_book_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_obras_essencia_8020') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
                OR 'books' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.clube_obras_essencia_8020 ADD CONSTRAINT clube_obras_essencia_8020_book_id_fkey 
                FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK clube_obras_essencia_8020_book_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK clube_obras_essencia_8020_book_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK clube_obras_essencia_8020_book_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_portais_jornada_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portais') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_jornadas') 
                OR 'clube_jornadas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.clube_portais ADD CONSTRAINT clube_portais_jornada_id_fkey 
                FOREIGN KEY (jornada_id) REFERENCES public.clube_jornadas(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK clube_portais_jornada_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK clube_portais_jornada_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK clube_portais_jornada_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_portal_audios_portal_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portal_audios') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portais') 
                OR 'clube_portais' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.clube_portal_audios ADD CONSTRAINT clube_portal_audios_portal_id_fkey 
                FOREIGN KEY (portal_id) REFERENCES public.clube_portais(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK clube_portal_audios_portal_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK clube_portal_audios_portal_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK clube_portal_audios_portal_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_portal_insights_estacao_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portal_insights') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
                OR 'oracular_seasons' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.clube_portal_insights ADD CONSTRAINT clube_portal_insights_estacao_id_fkey 
                FOREIGN KEY (estacao_id) REFERENCES public.oracular_seasons(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK clube_portal_insights_estacao_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK clube_portal_insights_estacao_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK clube_portal_insights_estacao_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_portal_materiais_portal_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portal_materiais') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portais') 
                OR 'clube_portais' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.clube_portal_materiais ADD CONSTRAINT clube_portal_materiais_portal_id_fkey 
                FOREIGN KEY (portal_id) REFERENCES public.clube_portais(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK clube_portal_materiais_portal_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK clube_portal_materiais_portal_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK clube_portal_materiais_portal_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_progresso_passos_passo_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_progresso_passos') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_rota_itens') 
                OR 'clube_rota_itens' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.clube_progresso_passos ADD CONSTRAINT clube_progresso_passos_passo_id_fkey 
                FOREIGN KEY (passo_id) REFERENCES public.clube_rota_itens(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK clube_progresso_passos_passo_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK clube_progresso_passos_passo_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK clube_progresso_passos_passo_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_progresso_passos_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_progresso_passos') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
                OR 'clube_estacoes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.clube_progresso_passos ADD CONSTRAINT clube_progresso_passos_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: clube_reflexoes clube_reflexoes_estacao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clube_reflexoes
    ADD CONSTRAINT clube_reflexoes_estacao_id_fkey FOREIGN KEY (estacao_id) REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK clube_progresso_passos_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK clube_progresso_passos_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK clube_progresso_passos_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_rota_itens_estacao_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_rota_itens') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
                OR 'clube_estacoes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.clube_rota_itens ADD CONSTRAINT clube_rota_itens_estacao_id_fkey 
                FOREIGN KEY (estacao_id) REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK clube_rota_itens_estacao_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK clube_rota_itens_estacao_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK clube_rota_itens_estacao_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_rota_progresso_estacao_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
                OR 'clube_estacoes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.clube_rota_progresso ADD CONSTRAINT clube_rota_progresso_estacao_id_fkey 
                FOREIGN KEY (estacao_id) REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK clube_rota_progresso_estacao_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK clube_rota_progresso_estacao_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK clube_rota_progresso_estacao_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_rota_progresso_rota_item_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_rota_itens') 
                OR 'clube_rota_itens' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.clube_rota_progresso ADD CONSTRAINT clube_rota_progresso_rota_item_id_fkey 
                FOREIGN KEY (rota_item_id) REFERENCES public.clube_rota_itens(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK clube_rota_progresso_rota_item_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK clube_rota_progresso_rota_item_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK clube_rota_progresso_rota_item_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_rota_progresso_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_stations') 
                OR 'clube_v3_stations' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.clube_rota_progresso ADD CONSTRAINT clube_rota_progresso_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: clube_v3_station_audios clube_v3_station_audios_station_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clube_v3_station_audios
    ADD CONSTRAINT clube_v3_station_audios_station_id_fkey FOREIGN KEY (station_id) REFERENCES public.clube_v3_stations(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK clube_rota_progresso_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK clube_rota_progresso_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK clube_rota_progresso_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_v3_station_content_station_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_station_content') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_stations') 
                OR 'clube_v3_stations' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.clube_v3_station_content ADD CONSTRAINT clube_v3_station_content_station_id_fkey 
                FOREIGN KEY (station_id) REFERENCES public.clube_v3_stations(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK clube_v3_station_content_station_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK clube_v3_station_content_station_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK clube_v3_station_content_station_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_v3_stations_route_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_stations') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_routes') 
                OR 'clube_v3_routes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.clube_v3_stations ADD CONSTRAINT clube_v3_stations_route_id_fkey 
                FOREIGN KEY (route_id) REFERENCES public.clube_v3_routes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK clube_v3_stations_route_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK clube_v3_stations_route_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK clube_v3_stations_route_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_v3_user_progress_station_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_user_progress') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_stations') 
                OR 'clube_v3_stations' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.clube_v3_user_progress ADD CONSTRAINT clube_v3_user_progress_station_id_fkey 
                FOREIGN KEY (station_id) REFERENCES public.clube_v3_stations(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK clube_v3_user_progress_station_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK clube_v3_user_progress_station_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK clube_v3_user_progress_station_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_ai_recommendations_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_ai_recommendations ADD CONSTRAINT co_ai_recommendations_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_ai_recommendations_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_ai_recommendations_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_ai_recommendations_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_ai_recommendations_tool_complementar_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
                OR 'sala_ferramentas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_ai_recommendations ADD CONSTRAINT co_ai_recommendations_tool_complementar_id_fkey 
                FOREIGN KEY (tool_complementar_id) REFERENCES public.sala_ferramentas(id) ;
                RAISE NOTICE 'Created FK co_ai_recommendations_tool_complementar_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_ai_recommendations_tool_complementar_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_ai_recommendations_tool_complementar_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_ai_recommendations_tool_sugerida_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
                OR 'sala_ferramentas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_ai_recommendations ADD CONSTRAINT co_ai_recommendations_tool_sugerida_id_fkey 
                FOREIGN KEY (tool_sugerida_id) REFERENCES public.sala_ferramentas(id) ;
                RAISE NOTICE 'Created FK co_ai_recommendations_tool_sugerida_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_ai_recommendations_tool_sugerida_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_ai_recommendations_tool_sugerida_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_appointments_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_appointments') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_appointments ADD CONSTRAINT co_appointments_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_appointments_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_appointments_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_appointments_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_appointments_terapeuta_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_appointments') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_workspaces') 
                OR 'co_workspaces' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_appointments ADD CONSTRAINT co_appointments_terapeuta_user_id_fkey 
                FOREIGN KEY (terapeuta_user_id) REFERENCES auth.users(id);


--
-- Name: co_appointments co_appointments_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_appointments
    ADD CONSTRAINT co_appointments_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.co_workspaces(id) ;
                RAISE NOTICE 'Created FK co_appointments_terapeuta_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_appointments_terapeuta_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_appointments_terapeuta_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_camara_sussurro_casos_proximo_treino_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_camara_sussurro_casos') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_camara_sussurro_casos') 
                OR 'co_camara_sussurro_casos' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_camara_sussurro_casos ADD CONSTRAINT co_camara_sussurro_casos_proximo_treino_id_fkey 
                FOREIGN KEY (proximo_treino_id) REFERENCES public.co_camara_sussurro_casos(id) ;
                RAISE NOTICE 'Created FK co_camara_sussurro_casos_proximo_treino_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_camara_sussurro_casos_proximo_treino_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_camara_sussurro_casos_proximo_treino_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_city_history_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_city_history') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_city_history ADD CONSTRAINT co_city_history_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_city_history_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_city_history_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_city_history_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_city_history_tool_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_city_history') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
                OR 'sala_ferramentas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_city_history ADD CONSTRAINT co_city_history_tool_id_fkey 
                FOREIGN KEY (tool_id) REFERENCES public.sala_ferramentas(id) ;
                RAISE NOTICE 'Created FK co_city_history_tool_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_city_history_tool_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_city_history_tool_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_client_invites_therapist_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_client_invites') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_client_invites ADD CONSTRAINT co_client_invites_therapist_user_id_fkey 
                FOREIGN KEY (therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_client_profile co_client_profile_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_client_profile
    ADD CONSTRAINT co_client_profile_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_client_invites_therapist_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_client_invites_therapist_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_client_invites_therapist_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_client_profile_therapist_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_client_profile') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_client_profile ADD CONSTRAINT co_client_profile_therapist_id_fkey 
                FOREIGN KEY (therapist_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_client_profiles co_client_profiles_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_client_profiles
    ADD CONSTRAINT co_client_profiles_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_client_profile_therapist_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_client_profile_therapist_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_client_profile_therapist_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_convites_cliente_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_convites') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_convites ADD CONSTRAINT co_convites_cliente_id_fkey 
                FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_convites_cliente_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_convites_cliente_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_convites_cliente_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_escutas_client_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_escutas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sessoes') 
                OR 'co_sessoes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_escutas ADD CONSTRAINT co_escutas_client_user_id_fkey 
                FOREIGN KEY (client_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_escutas co_escutas_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_escutas
    ADD CONSTRAINT co_escutas_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: co_escutas co_escutas_sessao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_escutas
    ADD CONSTRAINT co_escutas_sessao_id_fkey FOREIGN KEY (sessao_id) REFERENCES public.co_sessoes(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK co_escutas_client_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_escutas_client_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_escutas_client_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_escutas_therapist_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_escutas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_escutas ADD CONSTRAINT co_escutas_therapist_user_id_fkey 
                FOREIGN KEY (therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_garden_flowers co_garden_flowers_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_garden_flowers
    ADD CONSTRAINT co_garden_flowers_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_escutas_therapist_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_escutas_therapist_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_escutas_therapist_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_garden_flowers_origem_registro_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_garden_flowers') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_journey_records') 
                OR 'co_journey_records' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_garden_flowers ADD CONSTRAINT co_garden_flowers_origem_registro_id_fkey 
                FOREIGN KEY (origem_registro_id) REFERENCES public.co_journey_records(id) ;
                RAISE NOTICE 'Created FK co_garden_flowers_origem_registro_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_garden_flowers_origem_registro_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_garden_flowers_origem_registro_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_jardim_entries_client_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_jardim_entries') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_jardins') 
                OR 'co_jardins' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_jardim_entries ADD CONSTRAINT co_jardim_entries_client_user_id_fkey 
                FOREIGN KEY (client_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_jardim_entries co_jardim_entries_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_jardim_entries
    ADD CONSTRAINT co_jardim_entries_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: co_jardim_entries co_jardim_entries_jardim_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_jardim_entries
    ADD CONSTRAINT co_jardim_entries_jardim_id_fkey FOREIGN KEY (jardim_id) REFERENCES public.co_jardins(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_jardim_entries_client_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_jardim_entries_client_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_jardim_entries_client_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_jardim_entries_therapist_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_jardim_entries') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_jardim_entries ADD CONSTRAINT co_jardim_entries_therapist_user_id_fkey 
                FOREIGN KEY (therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_jardins co_jardins_client_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_jardins
    ADD CONSTRAINT co_jardins_client_user_id_fkey FOREIGN KEY (client_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_jardins co_jardins_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_jardins
    ADD CONSTRAINT co_jardins_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: co_jardins co_jardins_therapist_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_jardins
    ADD CONSTRAINT co_jardins_therapist_user_id_fkey FOREIGN KEY (therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_journey_records co_journey_records_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_journey_records
    ADD CONSTRAINT co_journey_records_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_jardim_entries_therapist_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_jardim_entries_therapist_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_jardim_entries_therapist_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_journey_records_tool_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_journey_records') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
                OR 'sala_ferramentas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_journey_records ADD CONSTRAINT co_journey_records_tool_id_fkey 
                FOREIGN KEY (tool_id) REFERENCES public.sala_ferramentas(id) ;
                RAISE NOTICE 'Created FK co_journey_records_tool_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_journey_records_tool_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_journey_records_tool_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_mentora_feedback_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_mentora_feedback') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_mentora_feedback ADD CONSTRAINT co_mentora_feedback_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_mentora_insights co_mentora_insights_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_mentora_insights
    ADD CONSTRAINT co_mentora_insights_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_orientacao_sugestoes_ia co_orientacao_sugestoes_ia_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_orientacao_sugestoes_ia
    ADD CONSTRAINT co_orientacao_sugestoes_ia_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_mentora_feedback_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_mentora_feedback_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_mentora_feedback_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacao_sugestoes_ia_orientacao_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacoes') 
                OR 'co_orientacoes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_orientacao_sugestoes_ia ADD CONSTRAINT co_orientacao_sugestoes_ia_orientacao_id_fkey 
                FOREIGN KEY (orientacao_id) REFERENCES public.co_orientacoes(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK co_orientacao_sugestoes_ia_orientacao_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_orientacao_sugestoes_ia_orientacao_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_orientacao_sugestoes_ia_orientacao_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacao_sugestoes_ia_session_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
                OR 'sessions' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_orientacao_sugestoes_ia ADD CONSTRAINT co_orientacao_sugestoes_ia_session_id_fkey 
                FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK co_orientacao_sugestoes_ia_session_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_orientacao_sugestoes_ia_session_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_orientacao_sugestoes_ia_session_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacoes_cliente_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacoes') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_orientacoes ADD CONSTRAINT co_orientacoes_cliente_id_fkey 
                FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_orientacoes_cliente_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_orientacoes_cliente_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_orientacoes_cliente_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacoes_session_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacoes') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
                OR 'sessions' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_orientacoes ADD CONSTRAINT co_orientacoes_session_id_fkey 
                FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK co_orientacoes_session_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_orientacoes_session_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_orientacoes_session_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_passport_entries_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_passport_entries') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_passport_entries ADD CONSTRAINT co_passport_entries_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_passport_entries_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_passport_entries_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_passport_entries_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_praticas_client_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_praticas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sessoes') 
                OR 'co_sessoes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_praticas ADD CONSTRAINT co_praticas_client_user_id_fkey 
                FOREIGN KEY (client_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_praticas co_praticas_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_praticas
    ADD CONSTRAINT co_praticas_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: co_praticas co_praticas_sessao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_praticas
    ADD CONSTRAINT co_praticas_sessao_id_fkey FOREIGN KEY (sessao_id) REFERENCES public.co_sessoes(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK co_praticas_client_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_praticas_client_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_praticas_client_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_praticas_therapist_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_praticas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_jardins') 
                OR 'co_jardins' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_praticas ADD CONSTRAINT co_praticas_therapist_user_id_fkey 
                FOREIGN KEY (therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_registros_simbolicos co_registros_simbolicos_client_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_registros_simbolicos
    ADD CONSTRAINT co_registros_simbolicos_client_user_id_fkey FOREIGN KEY (client_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_registros_simbolicos co_registros_simbolicos_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_registros_simbolicos
    ADD CONSTRAINT co_registros_simbolicos_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: co_registros_simbolicos co_registros_simbolicos_jardim_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_registros_simbolicos
    ADD CONSTRAINT co_registros_simbolicos_jardim_id_fkey FOREIGN KEY (jardim_id) REFERENCES public.co_jardins(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK co_praticas_therapist_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_praticas_therapist_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_praticas_therapist_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_registros_simbolicos_sessao_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_registros_simbolicos') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sessoes') 
                OR 'co_sessoes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_registros_simbolicos ADD CONSTRAINT co_registros_simbolicos_sessao_id_fkey 
                FOREIGN KEY (sessao_id) REFERENCES public.co_sessoes(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK co_registros_simbolicos_sessao_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_registros_simbolicos_sessao_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_registros_simbolicos_sessao_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_registros_simbolicos_therapist_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_registros_simbolicos') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_jardins') 
                OR 'co_jardins' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_registros_simbolicos ADD CONSTRAINT co_registros_simbolicos_therapist_user_id_fkey 
                FOREIGN KEY (therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_sessoes co_sessoes_client_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_sessoes
    ADD CONSTRAINT co_sessoes_client_user_id_fkey FOREIGN KEY (client_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_sessoes co_sessoes_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_sessoes
    ADD CONSTRAINT co_sessoes_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: co_sessoes co_sessoes_jardim_ref_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_sessoes
    ADD CONSTRAINT co_sessoes_jardim_ref_id_fkey FOREIGN KEY (jardim_ref_id) REFERENCES public.co_jardins(id) ;
                RAISE NOTICE 'Created FK co_registros_simbolicos_therapist_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_registros_simbolicos_therapist_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_registros_simbolicos_therapist_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sessoes_therapist_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sessoes') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_steps') 
                OR 'co_sim_steps' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_sessoes ADD CONSTRAINT co_sessoes_therapist_user_id_fkey 
                FOREIGN KEY (therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_sim_options co_sim_options_proximo_step_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_sim_options
    ADD CONSTRAINT co_sim_options_proximo_step_id_fkey FOREIGN KEY (proximo_step_id) REFERENCES public.co_sim_steps(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK co_sessoes_therapist_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_sessoes_therapist_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_sessoes_therapist_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_options_step_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_options') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_steps') 
                OR 'co_sim_steps' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_sim_options ADD CONSTRAINT co_sim_options_step_id_fkey 
                FOREIGN KEY (step_id) REFERENCES public.co_sim_steps(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_sim_options_step_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_sim_options_step_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_sim_options_step_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_progress_case_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_progress') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_cases') 
                OR 'co_sim_cases' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_sim_progress ADD CONSTRAINT co_sim_progress_case_id_fkey 
                FOREIGN KEY (case_id) REFERENCES public.co_sim_cases(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_sim_progress_case_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_sim_progress_case_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_sim_progress_case_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_progress_escolha_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_progress') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_options') 
                OR 'co_sim_options' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_sim_progress ADD CONSTRAINT co_sim_progress_escolha_id_fkey 
                FOREIGN KEY (escolha_id) REFERENCES public.co_sim_options(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_sim_progress_escolha_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_sim_progress_escolha_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_sim_progress_escolha_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_progress_step_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_progress') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_steps') 
                OR 'co_sim_steps' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_sim_progress ADD CONSTRAINT co_sim_progress_step_id_fkey 
                FOREIGN KEY (step_id) REFERENCES public.co_sim_steps(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_sim_progress_step_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_sim_progress_step_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_sim_progress_step_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_steps_case_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_steps') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_cases') 
                OR 'co_sim_cases' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_sim_steps ADD CONSTRAINT co_sim_steps_case_id_fkey 
                FOREIGN KEY (case_id) REFERENCES public.co_sim_cases(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_sim_steps_case_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_sim_steps_case_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_sim_steps_case_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_therapist_profile_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_therapist_profile') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
                OR 'tools' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_therapist_profile ADD CONSTRAINT co_therapist_profile_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_tool_flows co_tool_flows_tool_destino_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_tool_flows
    ADD CONSTRAINT co_tool_flows_tool_destino_id_fkey FOREIGN KEY (tool_destino_id) REFERENCES public.tools(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_therapist_profile_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_therapist_profile_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_therapist_profile_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_tool_flows_tool_origem_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_tool_flows') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
                OR 'tools' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_tool_flows ADD CONSTRAINT co_tool_flows_tool_origem_id_fkey 
                FOREIGN KEY (tool_origem_id) REFERENCES public.tools(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_tool_flows_tool_origem_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_tool_flows_tool_origem_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_tool_flows_tool_origem_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_tool_usage_tool_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_tool_usage') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
                OR 'sala_ferramentas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_tool_usage ADD CONSTRAINT co_tool_usage_tool_id_fkey 
                FOREIGN KEY (tool_id) REFERENCES public.sala_ferramentas(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_tool_usage_tool_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_tool_usage_tool_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_tool_usage_tool_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_attempts_case_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_attempts') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_cases') 
                OR 'co_training_cases' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_training_attempts ADD CONSTRAINT co_training_attempts_case_id_fkey 
                FOREIGN KEY (case_id) REFERENCES public.co_training_cases(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_training_attempts_case_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_training_attempts_case_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_training_attempts_case_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_attempts_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_attempts') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_cases') 
                OR 'co_training_cases' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_training_attempts ADD CONSTRAINT co_training_attempts_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_training_case_feedbacks co_training_case_feedbacks_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_training_case_feedbacks
    ADD CONSTRAINT co_training_case_feedbacks_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.co_training_cases(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_training_attempts_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_training_attempts_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_training_attempts_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_case_possible_readings_case_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_case_possible_readings') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_cases') 
                OR 'co_training_cases' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_training_case_possible_readings ADD CONSTRAINT co_training_case_possible_readings_case_id_fkey 
                FOREIGN KEY (case_id) REFERENCES public.co_training_cases(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_training_case_possible_readings_case_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_training_case_possible_readings_case_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_training_case_possible_readings_case_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_case_signals_case_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_case_signals') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_cases') 
                OR 'co_training_cases' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_training_case_signals ADD CONSTRAINT co_training_case_signals_case_id_fkey 
                FOREIGN KEY (case_id) REFERENCES public.co_training_cases(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_training_case_signals_case_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_training_case_signals_case_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_training_case_signals_case_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_progress_ultimo_case_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_progress') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_cases') 
                OR 'co_training_cases' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_training_progress ADD CONSTRAINT co_training_progress_ultimo_case_id_fkey 
                FOREIGN KEY (ultimo_case_id) REFERENCES public.co_training_cases(id) ;
                RAISE NOTICE 'Created FK co_training_progress_ultimo_case_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_training_progress_ultimo_case_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_training_progress_ultimo_case_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_progress_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_progress') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessias') 
                OR 'co_travessias' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_training_progress ADD CONSTRAINT co_training_progress_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_travessia_encontros co_travessia_encontros_travessia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_travessia_encontros
    ADD CONSTRAINT co_travessia_encontros_travessia_id_fkey FOREIGN KEY (travessia_id) REFERENCES public.co_travessias(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_training_progress_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_training_progress_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_training_progress_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_travessia_respostas_encontro_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessia_respostas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessia_encontros') 
                OR 'co_travessia_encontros' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_travessia_respostas ADD CONSTRAINT co_travessia_respostas_encontro_id_fkey 
                FOREIGN KEY (encontro_id) REFERENCES public.co_travessia_encontros(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_travessia_respostas_encontro_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_travessia_respostas_encontro_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_travessia_respostas_encontro_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_travessia_respostas_travessia_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessia_respostas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessias') 
                OR 'co_travessias' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_travessia_respostas ADD CONSTRAINT co_travessia_respostas_travessia_id_fkey 
                FOREIGN KEY (travessia_id) REFERENCES public.co_travessias(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_travessia_respostas_travessia_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_travessia_respostas_travessia_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_travessia_respostas_travessia_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_workspace_users_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_workspace_users') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_workspaces') 
                OR 'co_workspaces' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_workspace_users ADD CONSTRAINT co_workspace_users_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_workspace_users co_workspace_users_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_workspace_users
    ADD CONSTRAINT co_workspace_users_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.co_workspaces(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_workspace_users_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_workspace_users_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_workspace_users_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_workspaces_owner_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_workspaces') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'collective_beds') 
                OR 'collective_beds' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.co_workspaces ADD CONSTRAINT co_workspaces_owner_user_id_fkey 
                FOREIGN KEY (owner_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: collective_bed_entries collective_bed_entries_bed_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collective_bed_entries
    ADD CONSTRAINT collective_bed_entries_bed_id_fkey FOREIGN KEY (bed_id) REFERENCES public.collective_beds(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK co_workspaces_owner_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK co_workspaces_owner_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK co_workspaces_owner_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'collective_bed_entries_season_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'collective_bed_entries') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
                OR 'oracular_seasons' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.collective_bed_entries ADD CONSTRAINT collective_bed_entries_season_id_fkey 
                FOREIGN KEY (season_id) REFERENCES public.oracular_seasons(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK collective_bed_entries_season_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK collective_bed_entries_season_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK collective_bed_entries_season_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'collective_bed_entries_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'collective_bed_entries') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
                OR 'oracular_seasons' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.collective_bed_entries ADD CONSTRAINT collective_bed_entries_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: collective_beds collective_beds_season_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collective_beds
    ADD CONSTRAINT collective_beds_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.oracular_seasons(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK collective_bed_entries_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK collective_bed_entries_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK collective_bed_entries_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_comments_autor_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_comments') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_posts') 
                OR 'community_posts' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.community_comments ADD CONSTRAINT community_comments_autor_id_fkey 
                FOREIGN KEY (autor_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: community_comments community_comments_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_comments
    ADD CONSTRAINT community_comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.community_posts(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK community_comments_autor_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK community_comments_autor_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK community_comments_autor_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_event_participants_event_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_event_participants') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_events') 
                OR 'community_events' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.community_event_participants ADD CONSTRAINT community_event_participants_event_id_fkey 
                FOREIGN KEY (event_id) REFERENCES public.community_events(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK community_event_participants_event_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK community_event_participants_event_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK community_event_participants_event_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_event_participants_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_event_participants') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_groups') 
                OR 'community_groups' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.community_event_participants ADD CONSTRAINT community_event_participants_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: community_events community_events_criador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_events
    ADD CONSTRAINT community_events_criador_id_fkey FOREIGN KEY (criador_id) REFERENCES auth.users(id);


--
-- Name: community_group_members community_group_members_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_group_members
    ADD CONSTRAINT community_group_members_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.community_groups(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK community_event_participants_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK community_event_participants_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK community_event_participants_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_group_members_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_group_members') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_posts') 
                OR 'community_posts' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.community_group_members ADD CONSTRAINT community_group_members_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: community_groups community_groups_criador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_groups
    ADD CONSTRAINT community_groups_criador_id_fkey FOREIGN KEY (criador_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: community_likes community_likes_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_likes
    ADD CONSTRAINT community_likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.community_posts(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK community_group_members_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK community_group_members_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK community_group_members_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_likes_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_likes') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_topics') 
                OR 'community_topics' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.community_likes ADD CONSTRAINT community_likes_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: community_posts community_posts_autor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_posts
    ADD CONSTRAINT community_posts_autor_id_fkey FOREIGN KEY (autor_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: community_topic_replies community_topic_replies_autor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_topic_replies
    ADD CONSTRAINT community_topic_replies_autor_id_fkey FOREIGN KEY (autor_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: community_topic_replies community_topic_replies_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_topic_replies
    ADD CONSTRAINT community_topic_replies_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.community_topics(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK community_likes_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK community_likes_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK community_likes_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_topics_autor_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_topics') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_forums') 
                OR 'community_forums' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.community_topics ADD CONSTRAINT community_topics_autor_id_fkey 
                FOREIGN KEY (autor_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: community_topics community_topics_forum_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_topics
    ADD CONSTRAINT community_topics_forum_id_fkey FOREIGN KEY (forum_id) REFERENCES public.community_forums(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK community_topics_autor_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK community_topics_autor_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK community_topics_autor_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conselho_partes_internas_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conselho_partes_internas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.conselho_partes_internas ADD CONSTRAINT conselho_partes_internas_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK conselho_partes_internas_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK conselho_partes_internas_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK conselho_partes_internas_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'content_blocks_agente_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'content_blocks') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agentes') 
                OR 'agentes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.content_blocks ADD CONSTRAINT content_blocks_agente_id_fkey 
                FOREIGN KEY (agente_id) REFERENCES public.agentes(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK content_blocks_agente_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK content_blocks_agente_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK content_blocks_agente_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conteudo_aulas_travessia_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_aulas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_travessias') 
                OR 'conteudo_travessias' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.conteudo_aulas ADD CONSTRAINT conteudo_aulas_travessia_id_fkey 
                FOREIGN KEY (travessia_id) REFERENCES public.conteudo_travessias(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK conteudo_aulas_travessia_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK conteudo_aulas_travessia_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK conteudo_aulas_travessia_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conteudo_travessias_sala_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_travessias') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'salas') 
                OR 'salas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.conteudo_travessias ADD CONSTRAINT conteudo_travessias_sala_id_fkey 
                FOREIGN KEY (sala_id) REFERENCES public.salas(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK conteudo_travessias_sala_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK conteudo_travessias_sala_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK conteudo_travessias_sala_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contos_clinicos_audio_padrao_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contos_clinicos') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'audio_assets') 
                OR 'audio_assets' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.contos_clinicos ADD CONSTRAINT contos_clinicos_audio_padrao_id_fkey 
                FOREIGN KEY (audio_padrao_id) REFERENCES public.audio_assets(id) ;
                RAISE NOTICE 'Created FK contos_clinicos_audio_padrao_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK contos_clinicos_audio_padrao_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK contos_clinicos_audio_padrao_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'corpo_inconsciente_cliente_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'corpo_inconsciente') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.corpo_inconsciente ADD CONSTRAINT corpo_inconsciente_cliente_id_fkey 
                FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK corpo_inconsciente_cliente_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK corpo_inconsciente_cliente_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK corpo_inconsciente_cliente_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_enrollments_course_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_enrollments') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses') 
                OR 'courses' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.course_enrollments ADD CONSTRAINT course_enrollments_course_id_fkey 
                FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK course_enrollments_course_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK course_enrollments_course_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK course_enrollments_course_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_exercise_responses_lesson_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_exercise_responses') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_lessons') 
                OR 'course_lessons' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.course_exercise_responses ADD CONSTRAINT course_exercise_responses_lesson_id_fkey 
                FOREIGN KEY (lesson_id) REFERENCES public.course_lessons(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK course_exercise_responses_lesson_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK course_exercise_responses_lesson_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK course_exercise_responses_lesson_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_lesson_progress_lesson_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_lesson_progress') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_lessons') 
                OR 'course_lessons' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.course_lesson_progress ADD CONSTRAINT course_lesson_progress_lesson_id_fkey 
                FOREIGN KEY (lesson_id) REFERENCES public.course_lessons(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK course_lesson_progress_lesson_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK course_lesson_progress_lesson_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK course_lesson_progress_lesson_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_lessons_module_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_lessons') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_modules') 
                OR 'course_modules' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.course_lessons ADD CONSTRAINT course_lessons_module_id_fkey 
                FOREIGN KEY (module_id) REFERENCES public.course_modules(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK course_lessons_module_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK course_lessons_module_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK course_lessons_module_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_module_forum_posts_module_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_modules') 
                OR 'course_modules' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.course_module_forum_posts ADD CONSTRAINT course_module_forum_posts_module_id_fkey 
                FOREIGN KEY (module_id) REFERENCES public.course_modules(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK course_module_forum_posts_module_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK course_module_forum_posts_module_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK course_module_forum_posts_module_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_module_forum_posts_parent_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts') 
                OR 'course_module_forum_posts' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.course_module_forum_posts ADD CONSTRAINT course_module_forum_posts_parent_id_fkey 
                FOREIGN KEY (parent_id) REFERENCES public.course_module_forum_posts(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK course_module_forum_posts_parent_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK course_module_forum_posts_parent_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK course_module_forum_posts_parent_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_module_forum_posts_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses') 
                OR 'courses' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.course_module_forum_posts ADD CONSTRAINT course_module_forum_posts_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: course_modules course_modules_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_modules
    ADD CONSTRAINT course_modules_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK course_module_forum_posts_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK course_module_forum_posts_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK course_module_forum_posts_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_work_submissions_course_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_work_submissions') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses') 
                OR 'courses' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.course_work_submissions ADD CONSTRAINT course_work_submissions_course_id_fkey 
                FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK course_work_submissions_course_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK course_work_submissions_course_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK course_work_submissions_course_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_work_submissions_reviewed_by_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_work_submissions') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'salas') 
                OR 'salas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.course_work_submissions ADD CONSTRAINT course_work_submissions_reviewed_by_fkey 
                FOREIGN KEY (reviewed_by) REFERENCES auth.users(id);


--
-- Name: course_work_submissions course_work_submissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_work_submissions
    ADD CONSTRAINT course_work_submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: courses courses_sala_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_sala_id_fkey FOREIGN KEY (sala_id) REFERENCES public.salas(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK course_work_submissions_reviewed_by_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK course_work_submissions_reviewed_by_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK course_work_submissions_reviewed_by_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'custom_oracle_cards_custom_oracle_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'custom_oracle_cards') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'custom_oracles') 
                OR 'custom_oracles' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.custom_oracle_cards ADD CONSTRAINT custom_oracle_cards_custom_oracle_id_fkey 
                FOREIGN KEY (custom_oracle_id) REFERENCES public.custom_oracles(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK custom_oracle_cards_custom_oracle_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK custom_oracle_cards_custom_oracle_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK custom_oracle_cards_custom_oracle_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cycle_books_book_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cycle_books') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
                OR 'books' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.cycle_books ADD CONSTRAINT cycle_books_book_id_fkey 
                FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK cycle_books_book_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK cycle_books_book_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK cycle_books_book_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cycle_books_cycle_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cycle_books') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cycles') 
                OR 'cycles' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.cycle_books ADD CONSTRAINT cycle_books_cycle_id_fkey 
                FOREIGN KEY (cycle_id) REFERENCES public.cycles(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK cycle_books_cycle_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK cycle_books_cycle_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK cycle_books_cycle_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'decodificacao_onirica_cliente_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'decodificacao_onirica') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.decodificacao_onirica ADD CONSTRAINT decodificacao_onirica_cliente_id_fkey 
                FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK decodificacao_onirica_cliente_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK decodificacao_onirica_cliente_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK decodificacao_onirica_cliente_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'decodificacao_onirica_session_case_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'decodificacao_onirica') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
                OR 'session_cases' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.decodificacao_onirica ADD CONSTRAINT decodificacao_onirica_session_case_id_fkey 
                FOREIGN KEY (session_case_id) REFERENCES public.session_cases(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK decodificacao_onirica_session_case_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK decodificacao_onirica_session_case_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK decodificacao_onirica_session_case_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'decodificacao_onirica_terapeuta_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'decodificacao_onirica') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.decodificacao_onirica ADD CONSTRAINT decodificacao_onirica_terapeuta_id_fkey 
                FOREIGN KEY (terapeuta_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: degustacao_requests degustacao_requests_aprovado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.degustacao_requests
    ADD CONSTRAINT degustacao_requests_aprovado_por_fkey FOREIGN KEY (aprovado_por) REFERENCES auth.users(id);


--
-- Name: degustacao_requests degustacao_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.degustacao_requests
    ADD CONSTRAINT degustacao_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: diagnostico_ego diagnostico_ego_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diagnostico_ego
    ADD CONSTRAINT diagnostico_ego_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK decodificacao_onirica_terapeuta_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK decodificacao_onirica_terapeuta_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK decodificacao_onirica_terapeuta_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'district_state_changes_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'district_state_changes') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.district_state_changes ADD CONSTRAINT district_state_changes_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK district_state_changes_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK district_state_changes_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK district_state_changes_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'district_state_changes_district_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'district_state_changes') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') 
                OR 'districts' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.district_state_changes ADD CONSTRAINT district_state_changes_district_id_fkey 
                FOREIGN KEY (district_id) REFERENCES public.districts(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK district_state_changes_district_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK district_state_changes_district_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK district_state_changes_district_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'dreams_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'dreams') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.dreams ADD CONSTRAINT dreams_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK dreams_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK dreams_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK dreams_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'dreams_session_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'dreams') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
                OR 'sessions' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.dreams ADD CONSTRAINT dreams_session_id_fkey 
                FOREIGN KEY (session_id) REFERENCES public.sessions(id) ;
                RAISE NOTICE 'Created FK dreams_session_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK dreams_session_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK dreams_session_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'email_logs_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'email_logs') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
                OR 'profiles' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.email_logs ADD CONSTRAINT email_logs_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK email_logs_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK email_logs_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK email_logs_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'eneagrama_feminino_afirmacoes_arquetipo_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_afirmacoes') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_arquetipos') 
                OR 'eneagrama_feminino_arquetipos' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.eneagrama_feminino_afirmacoes ADD CONSTRAINT eneagrama_feminino_afirmacoes_arquetipo_id_fkey 
                FOREIGN KEY (arquetipo_id) REFERENCES public.eneagrama_feminino_arquetipos(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK eneagrama_feminino_afirmacoes_arquetipo_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK eneagrama_feminino_afirmacoes_arquetipo_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK eneagrama_feminino_afirmacoes_arquetipo_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'eneagrama_feminino_orientacoes_arquetipo_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_orientacoes') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_arquetipos') 
                OR 'eneagrama_feminino_arquetipos' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.eneagrama_feminino_orientacoes ADD CONSTRAINT eneagrama_feminino_orientacoes_arquetipo_id_fkey 
                FOREIGN KEY (arquetipo_id) REFERENCES public.eneagrama_feminino_arquetipos(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK eneagrama_feminino_orientacoes_arquetipo_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK eneagrama_feminino_orientacoes_arquetipo_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK eneagrama_feminino_orientacoes_arquetipo_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'eneagrama_feminino_registros_session_case_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_registros') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
                OR 'session_cases' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.eneagrama_feminino_registros ADD CONSTRAINT eneagrama_feminino_registros_session_case_id_fkey 
                FOREIGN KEY (session_case_id) REFERENCES public.session_cases(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK eneagrama_feminino_registros_session_case_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK eneagrama_feminino_registros_session_case_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK eneagrama_feminino_registros_session_case_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'eneagrama_feminino_registros_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_registros') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.eneagrama_feminino_registros ADD CONSTRAINT eneagrama_feminino_registros_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: eneagrama_registros eneagrama_registros_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.eneagrama_registros
    ADD CONSTRAINT eneagrama_registros_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: eneagrama_registros eneagrama_registros_terapeuta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.eneagrama_registros
    ADD CONSTRAINT eneagrama_registros_terapeuta_id_fkey FOREIGN KEY (terapeuta_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: eneagrama_registros eneagrama_registros_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.eneagrama_registros
    ADD CONSTRAINT eneagrama_registros_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: escrita_nao_censurada escrita_nao_censurada_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.escrita_nao_censurada
    ADD CONSTRAINT escrita_nao_censurada_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK eneagrama_feminino_registros_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK eneagrama_feminino_registros_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK eneagrama_feminino_registros_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'estudio_projetos_book_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'estudio_projetos') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
                OR 'books' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.estudio_projetos ADD CONSTRAINT estudio_projetos_book_id_fkey 
                FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK estudio_projetos_book_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK estudio_projetos_book_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK estudio_projetos_book_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'estudos_caso_respostas_estudo_caso_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'estudos_caso_respostas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'estudos_caso') 
                OR 'estudos_caso' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.estudos_caso_respostas ADD CONSTRAINT estudos_caso_respostas_estudo_caso_id_fkey 
                FOREIGN KEY (estudo_caso_id) REFERENCES public.estudos_caso(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK estudos_caso_respostas_estudo_caso_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK estudos_caso_respostas_estudo_caso_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK estudos_caso_respostas_estudo_caso_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'estudos_caso_respostas_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'estudos_caso_respostas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'exercises') 
                OR 'exercises' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.estudos_caso_respostas ADD CONSTRAINT estudos_caso_respostas_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: exercise_responses exercise_responses_exercise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exercise_responses
    ADD CONSTRAINT exercise_responses_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK estudos_caso_respostas_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK estudos_caso_respostas_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK estudos_caso_respostas_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exercise_responses_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'exercise_responses') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lessons') 
                OR 'lessons' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.exercise_responses ADD CONSTRAINT exercise_responses_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: exercises exercises_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK exercise_responses_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK exercise_responses_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK exercise_responses_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'facilitadora_profiles_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'facilitadora_profiles') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.facilitadora_profiles ADD CONSTRAINT facilitadora_profiles_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: ferramenta_registros ferramenta_registros_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ferramenta_registros
    ADD CONSTRAINT ferramenta_registros_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK facilitadora_profiles_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK facilitadora_profiles_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK facilitadora_profiles_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ferramenta_registros_ferramenta_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ferramenta_registros') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
                OR 'sala_ferramentas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.ferramenta_registros ADD CONSTRAINT ferramenta_registros_ferramenta_id_fkey 
                FOREIGN KEY (ferramenta_id) REFERENCES public.sala_ferramentas(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK ferramenta_registros_ferramenta_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK ferramenta_registros_ferramenta_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK ferramenta_registros_ferramenta_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_big5_caso') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_registros') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'casos') 
                OR 'casos' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.big5_registros ADD CONSTRAINT fk_big5_caso 
                FOREIGN KEY (caso_id) REFERENCES public.casos(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK fk_big5_caso';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK fk_big5_caso: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK fk_big5_caso: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_eneagrama_caso') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_registros') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'casos') 
                OR 'casos' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.eneagrama_registros ADD CONSTRAINT fk_eneagrama_caso 
                FOREIGN KEY (caso_id) REFERENCES public.casos(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK fk_eneagrama_caso';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK fk_eneagrama_caso: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK fk_eneagrama_caso: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'formacao_modulos_formacao_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'formacao_modulos') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'formacoes') 
                OR 'formacoes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.formacao_modulos ADD CONSTRAINT formacao_modulos_formacao_id_fkey 
                FOREIGN KEY (formacao_id) REFERENCES public.formacoes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK formacao_modulos_formacao_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK formacao_modulos_formacao_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK formacao_modulos_formacao_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'formacao_oracula_content_updated_by_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'formacao_oracula_content') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'city_districts') 
                OR 'city_districts' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.formacao_oracula_content ADD CONSTRAINT formacao_oracula_content_updated_by_fkey 
                FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: founding_archetypes founding_archetypes_distrito_principal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.founding_archetypes
    ADD CONSTRAINT founding_archetypes_distrito_principal_id_fkey FOREIGN KEY (distrito_principal_id) REFERENCES public.city_districts(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK formacao_oracula_content_updated_by_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK formacao_oracula_content_updated_by_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK formacao_oracula_content_updated_by_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'gestos_integracao_cliente_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'gestos_integracao') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.gestos_integracao ADD CONSTRAINT gestos_integracao_cliente_id_fkey 
                FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK gestos_integracao_cliente_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK gestos_integracao_cliente_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK gestos_integracao_cliente_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'gestos_integracao_owner_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'gestos_integracao') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas') 
                OR 'sessoes_casa_maquinas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.gestos_integracao ADD CONSTRAINT gestos_integracao_owner_id_fkey 
                FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: gestos_integracao gestos_integracao_sessao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gestos_integracao
    ADD CONSTRAINT gestos_integracao_sessao_id_fkey FOREIGN KEY (sessao_id) REFERENCES public.sessoes_casa_maquinas(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK gestos_integracao_owner_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK gestos_integracao_owner_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK gestos_integracao_owner_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_encounters_group_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_encounters') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'therapy_groups') 
                OR 'therapy_groups' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.group_encounters ADD CONSTRAINT group_encounters_group_id_fkey 
                FOREIGN KEY (group_id) REFERENCES public.therapy_groups(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK group_encounters_group_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK group_encounters_group_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK group_encounters_group_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_field_snapshots_circulo_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_field_snapshots') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'circulos_sagrados') 
                OR 'circulos_sagrados' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.group_field_snapshots ADD CONSTRAINT group_field_snapshots_circulo_id_fkey 
                FOREIGN KEY (circulo_id) REFERENCES public.circulos_sagrados(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK group_field_snapshots_circulo_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK group_field_snapshots_circulo_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK group_field_snapshots_circulo_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_field_snapshots_group_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_field_snapshots') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'therapeutic_groups') 
                OR 'therapeutic_groups' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.group_field_snapshots ADD CONSTRAINT group_field_snapshots_group_id_fkey 
                FOREIGN KEY (group_id) REFERENCES public.therapeutic_groups(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK group_field_snapshots_group_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK group_field_snapshots_group_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK group_field_snapshots_group_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_members_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_members') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.group_members ADD CONSTRAINT group_members_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK group_members_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK group_members_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK group_members_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_members_group_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_members') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'therapy_groups') 
                OR 'therapy_groups' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.group_members ADD CONSTRAINT group_members_group_id_fkey 
                FOREIGN KEY (group_id) REFERENCES public.therapy_groups(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK group_members_group_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK group_members_group_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK group_members_group_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_participants_cliente_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_participants') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.group_participants ADD CONSTRAINT group_participants_cliente_id_fkey 
                FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK group_participants_cliente_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK group_participants_cliente_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK group_participants_cliente_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_participants_group_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_participants') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'therapeutic_groups') 
                OR 'therapeutic_groups' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.group_participants ADD CONSTRAINT group_participants_group_id_fkey 
                FOREIGN KEY (group_id) REFERENCES public.therapeutic_groups(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK group_participants_group_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK group_participants_group_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK group_participants_group_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_sessions_group_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_sessions') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'therapeutic_groups') 
                OR 'therapeutic_groups' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.group_sessions ADD CONSTRAINT group_sessions_group_id_fkey 
                FOREIGN KEY (group_id) REFERENCES public.therapeutic_groups(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK group_sessions_group_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK group_sessions_group_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK group_sessions_group_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_sessions_therapist_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_sessions') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos') 
                OR 'labirinto_arquetipos' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.group_sessions ADD CONSTRAINT group_sessions_therapist_id_fkey 
                FOREIGN KEY (therapist_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: heroina_arquetipo_registros heroina_arquetipo_registros_arquetipo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.heroina_arquetipo_registros
    ADD CONSTRAINT heroina_arquetipo_registros_arquetipo_id_fkey FOREIGN KEY (arquetipo_id) REFERENCES public.labirinto_arquetipos(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK group_sessions_therapist_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK group_sessions_therapist_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK group_sessions_therapist_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_arquetipo_registros_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'heroina_arquetipo_registros') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas') 
                OR 'labirinto_metaforas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.heroina_arquetipo_registros ADD CONSTRAINT heroina_arquetipo_registros_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: heroina_cenario_registros heroina_cenario_registros_metafora_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.heroina_cenario_registros
    ADD CONSTRAINT heroina_cenario_registros_metafora_id_fkey FOREIGN KEY (metafora_id) REFERENCES public.labirinto_metaforas(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK heroina_arquetipo_registros_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK heroina_arquetipo_registros_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK heroina_arquetipo_registros_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_cenario_registros_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'heroina_cenario_registros') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_fases') 
                OR 'labirinto_fases' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.heroina_cenario_registros ADD CONSTRAINT heroina_cenario_registros_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: heroina_fase_ativa heroina_fase_ativa_fase_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.heroina_fase_ativa
    ADD CONSTRAINT heroina_fase_ativa_fase_id_fkey FOREIGN KEY (fase_id) REFERENCES public.labirinto_fases(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK heroina_cenario_registros_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK heroina_cenario_registros_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK heroina_cenario_registros_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_fase_ativa_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'heroina_fase_ativa') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_rituais') 
                OR 'labirinto_rituais' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.heroina_fase_ativa ADD CONSTRAINT heroina_fase_ativa_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: heroina_jornada heroina_jornada_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.heroina_jornada
    ADD CONSTRAINT heroina_jornada_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: heroina_registros heroina_registros_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.heroina_registros
    ADD CONSTRAINT heroina_registros_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: heroina_ritual_registros heroina_ritual_registros_ritual_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.heroina_ritual_registros
    ADD CONSTRAINT heroina_ritual_registros_ritual_id_fkey FOREIGN KEY (ritual_id) REFERENCES public.labirinto_rituais(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK heroina_fase_ativa_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK heroina_fase_ativa_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK heroina_fase_ativa_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'imaginacao_ativa_cliente_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'imaginacao_ativa') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.imaginacao_ativa ADD CONSTRAINT imaginacao_ativa_cliente_id_fkey 
                FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK imaginacao_ativa_cliente_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK imaginacao_ativa_cliente_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK imaginacao_ativa_cliente_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'intervention_favorites_intervention_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'intervention_favorites') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'interventions') 
                OR 'interventions' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.intervention_favorites ADD CONSTRAINT intervention_favorites_intervention_id_fkey 
                FOREIGN KEY (intervention_id) REFERENCES public.interventions(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK intervention_favorites_intervention_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK intervention_favorites_intervention_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK intervention_favorites_intervention_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'intervention_favorites_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'intervention_favorites') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') 
                OR 'districts' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.intervention_favorites ADD CONSTRAINT intervention_favorites_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: interventions interventions_district_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interventions
    ADD CONSTRAINT interventions_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.districts(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK intervention_favorites_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK intervention_favorites_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK intervention_favorites_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'inventario_personas_cliente_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'inventario_personas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.inventario_personas ADD CONSTRAINT inventario_personas_cliente_id_fkey 
                FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK inventario_personas_cliente_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK inventario_personas_cliente_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK inventario_personas_cliente_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_do_oficio_cliente_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_do_oficio') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.jardim_do_oficio ADD CONSTRAINT jardim_do_oficio_cliente_id_fkey 
                FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK jardim_do_oficio_cliente_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK jardim_do_oficio_cliente_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK jardim_do_oficio_cliente_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_do_oficio_sessao_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_do_oficio') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas') 
                OR 'sessoes_casa_maquinas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.jardim_do_oficio ADD CONSTRAINT jardim_do_oficio_sessao_id_fkey 
                FOREIGN KEY (sessao_id) REFERENCES public.sessoes_casa_maquinas(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK jardim_do_oficio_sessao_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK jardim_do_oficio_sessao_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK jardim_do_oficio_sessao_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_do_oficio_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_do_oficio') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'therapeutic_groups') 
                OR 'therapeutic_groups' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.jardim_do_oficio ADD CONSTRAINT jardim_do_oficio_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: jardim_grupo_registros jardim_grupo_registros_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jardim_grupo_registros
    ADD CONSTRAINT jardim_grupo_registros_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.therapeutic_groups(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK jardim_do_oficio_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK jardim_do_oficio_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK jardim_do_oficio_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_grupo_registros_session_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_grupo_registros') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_sessions') 
                OR 'group_sessions' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.jardim_grupo_registros ADD CONSTRAINT jardim_grupo_registros_session_id_fkey 
                FOREIGN KEY (session_id) REFERENCES public.group_sessions(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK jardim_grupo_registros_session_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK jardim_grupo_registros_session_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK jardim_grupo_registros_session_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_case_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_heroina') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
                OR 'session_cases' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.jardim_heroina ADD CONSTRAINT jardim_heroina_case_id_fkey 
                FOREIGN KEY (case_id) REFERENCES public.session_cases(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK jardim_heroina_case_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK jardim_heroina_case_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK jardim_heroina_case_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_heroina') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.jardim_heroina ADD CONSTRAINT jardim_heroina_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK jardim_heroina_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK jardim_heroina_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK jardim_heroina_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_registros_mapa_vivo_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina') 
                OR 'mapa_vivo_heroina' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.jardim_heroina_registros ADD CONSTRAINT jardim_heroina_registros_mapa_vivo_id_fkey 
                FOREIGN KEY (mapa_vivo_id) REFERENCES public.mapa_vivo_heroina(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK jardim_heroina_registros_mapa_vivo_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK jardim_heroina_registros_mapa_vivo_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK jardim_heroina_registros_mapa_vivo_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_registros_mapa_vivo_origem_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina') 
                OR 'mapa_vivo_heroina' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.jardim_heroina_registros ADD CONSTRAINT jardim_heroina_registros_mapa_vivo_origem_id_fkey 
                FOREIGN KEY (mapa_vivo_origem_id) REFERENCES public.mapa_vivo_heroina(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK jardim_heroina_registros_mapa_vivo_origem_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK jardim_heroina_registros_mapa_vivo_origem_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK jardim_heroina_registros_mapa_vivo_origem_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_registros_session_case_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
                OR 'session_cases' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.jardim_heroina_registros ADD CONSTRAINT jardim_heroina_registros_session_case_id_fkey 
                FOREIGN KEY (session_case_id) REFERENCES public.session_cases(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK jardim_heroina_registros_session_case_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK jardim_heroina_registros_session_case_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK jardim_heroina_registros_session_case_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_therapist_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_heroina') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros') 
                OR 'jornada_heroina_registros' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.jardim_heroina ADD CONSTRAINT jardim_heroina_therapist_id_fkey 
                FOREIGN KEY (therapist_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: jardim_psique_registros jardim_psique_registros_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jardim_psique_registros
    ADD CONSTRAINT jardim_psique_registros_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: jornada_habitante_eventos jornada_habitante_eventos_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jornada_habitante_eventos
    ADD CONSTRAINT jornada_habitante_eventos_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: jornada_heroina_notas_profissionais jornada_heroina_notas_profissionais_registro_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jornada_heroina_notas_profissionais
    ADD CONSTRAINT jornada_heroina_notas_profissionais_registro_id_fkey FOREIGN KEY (registro_id) REFERENCES public.jornada_heroina_registros(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK jardim_heroina_therapist_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK jardim_heroina_therapist_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK jardim_heroina_therapist_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_registros_cliente_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.jornada_heroina_registros ADD CONSTRAINT jornada_heroina_registros_cliente_id_fkey 
                FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK jornada_heroina_registros_cliente_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK jornada_heroina_registros_cliente_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK jornada_heroina_registros_cliente_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_registros_session_case_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
                OR 'session_cases' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.jornada_heroina_registros ADD CONSTRAINT jornada_heroina_registros_session_case_id_fkey 
                FOREIGN KEY (session_case_id) REFERENCES public.session_cases(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK jornada_heroina_registros_session_case_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK jornada_heroina_registros_session_case_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK jornada_heroina_registros_session_case_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_respostas_registro_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_heroina_respostas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros') 
                OR 'jornada_heroina_registros' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.jornada_heroina_respostas ADD CONSTRAINT jornada_heroina_respostas_registro_id_fkey 
                FOREIGN KEY (registro_id) REFERENCES public.jornada_heroina_registros(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK jornada_heroina_respostas_registro_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK jornada_heroina_respostas_registro_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK jornada_heroina_respostas_registro_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_individuacao_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_individuacao') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.jornada_individuacao ADD CONSTRAINT jornada_individuacao_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK jornada_individuacao_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK jornada_individuacao_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK jornada_individuacao_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_individuacao_therapist_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_individuacao') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') 
                OR 'districts' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.jornada_individuacao ADD CONSTRAINT jornada_individuacao_therapist_id_fkey 
                FOREIGN KEY (therapist_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: jornada_progressao jornada_progressao_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jornada_progressao
    ADD CONSTRAINT jornada_progressao_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: journey_districts journey_districts_district_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journey_districts
    ADD CONSTRAINT journey_districts_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.districts(id) ;
                RAISE NOTICE 'Created FK jornada_individuacao_therapist_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK jornada_individuacao_therapist_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK jornada_individuacao_therapist_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_districts_journey_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journey_districts') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journeys') 
                OR 'journeys' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.journey_districts ADD CONSTRAINT journey_districts_journey_id_fkey 
                FOREIGN KEY (journey_id) REFERENCES public.journeys(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK journey_districts_journey_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK journey_districts_journey_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK journey_districts_journey_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_events_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journey_events') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.journey_events ADD CONSTRAINT journey_events_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK journey_events_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK journey_events_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK journey_events_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_events_session_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journey_events') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
                OR 'sessions' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.journey_events ADD CONSTRAINT journey_events_session_id_fkey 
                FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK journey_events_session_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK journey_events_session_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK journey_events_session_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_events_therapist_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journey_events') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_jornadas') 
                OR 'clube_jornadas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.journey_events ADD CONSTRAINT journey_events_therapist_id_fkey 
                FOREIGN KEY (therapist_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: journey_media journey_media_journey_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journey_media
    ADD CONSTRAINT journey_media_journey_id_fkey FOREIGN KEY (journey_id) REFERENCES public.clube_jornadas(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK journey_events_therapist_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK journey_events_therapist_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK journey_events_therapist_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_reflections_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journey_reflections') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.journey_reflections ADD CONSTRAINT journey_reflections_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK journey_reflections_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK journey_reflections_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK journey_reflections_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_reflections_therapist_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journey_reflections') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.journey_reflections ADD CONSTRAINT journey_reflections_therapist_id_fkey 
                FOREIGN KEY (therapist_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: journeys journeys_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journeys
    ADD CONSTRAINT journeys_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK journey_reflections_therapist_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK journey_reflections_therapist_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK journey_reflections_therapist_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journeys_current_district_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journeys') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') 
                OR 'districts' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.journeys ADD CONSTRAINT journeys_current_district_id_fkey 
                FOREIGN KEY (current_district_id) REFERENCES public.districts(id) ;
                RAISE NOTICE 'Created FK journeys_current_district_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK journeys_current_district_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK journeys_current_district_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lab_8020_progress_book_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lab_8020_progress') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
                OR 'books' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.lab_8020_progress ADD CONSTRAINT lab_8020_progress_book_id_fkey 
                FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK lab_8020_progress_book_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK lab_8020_progress_book_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK lab_8020_progress_book_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lab_8020_progress_season_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lab_8020_progress') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
                OR 'oracular_seasons' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.lab_8020_progress ADD CONSTRAINT lab_8020_progress_season_id_fkey 
                FOREIGN KEY (season_id) REFERENCES public.oracular_seasons(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK lab_8020_progress_season_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK lab_8020_progress_season_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK lab_8020_progress_season_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_39_portas_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_39_portas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.labirinto_39_portas ADD CONSTRAINT labirinto_39_portas_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK labirinto_39_portas_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK labirinto_39_portas_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK labirinto_39_portas_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_anotacoes_cliente_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_anotacoes') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.labirinto_anotacoes ADD CONSTRAINT labirinto_anotacoes_cliente_id_fkey 
                FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK labirinto_anotacoes_cliente_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK labirinto_anotacoes_cliente_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK labirinto_anotacoes_cliente_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_anotacoes_porta_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_anotacoes') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_portas') 
                OR 'labirinto_portas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.labirinto_anotacoes ADD CONSTRAINT labirinto_anotacoes_porta_id_fkey 
                FOREIGN KEY (porta_id) REFERENCES public.labirinto_portas(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK labirinto_anotacoes_porta_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK labirinto_anotacoes_porta_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK labirinto_anotacoes_porta_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_leituras_cliente_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_leituras') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.labirinto_leituras ADD CONSTRAINT labirinto_leituras_cliente_id_fkey 
                FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK labirinto_leituras_cliente_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK labirinto_leituras_cliente_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK labirinto_leituras_cliente_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_leituras_porta_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_leituras') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_portas') 
                OR 'labirinto_portas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.labirinto_leituras ADD CONSTRAINT labirinto_leituras_porta_id_fkey 
                FOREIGN KEY (porta_id) REFERENCES public.labirinto_portas(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK labirinto_leituras_porta_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK labirinto_leituras_porta_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK labirinto_leituras_porta_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_arquetipo_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_registros') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos') 
                OR 'labirinto_arquetipos' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.labirinto_registros ADD CONSTRAINT labirinto_registros_arquetipo_id_fkey 
                FOREIGN KEY (arquetipo_id) REFERENCES public.labirinto_arquetipos(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK labirinto_registros_arquetipo_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK labirinto_registros_arquetipo_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK labirinto_registros_arquetipo_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_fase_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_registros') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_fases') 
                OR 'labirinto_fases' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.labirinto_registros ADD CONSTRAINT labirinto_registros_fase_id_fkey 
                FOREIGN KEY (fase_id) REFERENCES public.labirinto_fases(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK labirinto_registros_fase_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK labirinto_registros_fase_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK labirinto_registros_fase_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_metafora_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_registros') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas') 
                OR 'labirinto_metaforas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.labirinto_registros ADD CONSTRAINT labirinto_registros_metafora_id_fkey 
                FOREIGN KEY (metafora_id) REFERENCES public.labirinto_metaforas(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK labirinto_registros_metafora_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK labirinto_registros_metafora_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK labirinto_registros_metafora_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_ritual_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_registros') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_rituais') 
                OR 'labirinto_rituais' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.labirinto_registros ADD CONSTRAINT labirinto_registros_ritual_id_fkey 
                FOREIGN KEY (ritual_id) REFERENCES public.labirinto_rituais(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK labirinto_registros_ritual_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK labirinto_registros_ritual_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK labirinto_registros_ritual_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_session_case_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_registros') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
                OR 'session_cases' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.labirinto_registros ADD CONSTRAINT labirinto_registros_session_case_id_fkey 
                FOREIGN KEY (session_case_id) REFERENCES public.session_cases(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK labirinto_registros_session_case_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK labirinto_registros_session_case_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK labirinto_registros_session_case_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_terapeuta_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_registros') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos') 
                OR 'labirinto_arquetipos' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.labirinto_registros ADD CONSTRAINT labirinto_registros_terapeuta_id_fkey 
                FOREIGN KEY (terapeuta_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: labirinto_registros labirinto_registros_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.labirinto_registros
    ADD CONSTRAINT labirinto_registros_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: labirinto_roteiros_gerados labirinto_roteiros_gerados_arquetipo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.labirinto_roteiros_gerados
    ADD CONSTRAINT labirinto_roteiros_gerados_arquetipo_id_fkey FOREIGN KEY (arquetipo_id) REFERENCES public.labirinto_arquetipos(id) ;
                RAISE NOTICE 'Created FK labirinto_registros_terapeuta_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK labirinto_registros_terapeuta_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK labirinto_registros_terapeuta_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_fase_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_fases') 
                OR 'labirinto_fases' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.labirinto_roteiros_gerados ADD CONSTRAINT labirinto_roteiros_gerados_fase_id_fkey 
                FOREIGN KEY (fase_id) REFERENCES public.labirinto_fases(id) ;
                RAISE NOTICE 'Created FK labirinto_roteiros_gerados_fase_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK labirinto_roteiros_gerados_fase_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK labirinto_roteiros_gerados_fase_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_metafora_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas') 
                OR 'labirinto_metaforas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.labirinto_roteiros_gerados ADD CONSTRAINT labirinto_roteiros_gerados_metafora_id_fkey 
                FOREIGN KEY (metafora_id) REFERENCES public.labirinto_metaforas(id) ;
                RAISE NOTICE 'Created FK labirinto_roteiros_gerados_metafora_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK labirinto_roteiros_gerados_metafora_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK labirinto_roteiros_gerados_metafora_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_ritual_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_rituais') 
                OR 'labirinto_rituais' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.labirinto_roteiros_gerados ADD CONSTRAINT labirinto_roteiros_gerados_ritual_id_fkey 
                FOREIGN KEY (ritual_id) REFERENCES public.labirinto_rituais(id) ;
                RAISE NOTICE 'Created FK labirinto_roteiros_gerados_ritual_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK labirinto_roteiros_gerados_ritual_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK labirinto_roteiros_gerados_ritual_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_session_case_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
                OR 'session_cases' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.labirinto_roteiros_gerados ADD CONSTRAINT labirinto_roteiros_gerados_session_case_id_fkey 
                FOREIGN KEY (session_case_id) REFERENCES public.session_cases(id) ;
                RAISE NOTICE 'Created FK labirinto_roteiros_gerados_session_case_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK labirinto_roteiros_gerados_session_case_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK labirinto_roteiros_gerados_session_case_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labyrinth_records_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labyrinth_records') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.labyrinth_records ADD CONSTRAINT labyrinth_records_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK labyrinth_records_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK labyrinth_records_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK labyrinth_records_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labyrinth_records_session_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labyrinth_records') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
                OR 'sessions' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.labyrinth_records ADD CONSTRAINT labyrinth_records_session_id_fkey 
                FOREIGN KEY (session_id) REFERENCES public.sessions(id) ;
                RAISE NOTICE 'Created FK labyrinth_records_session_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK labyrinth_records_session_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK labyrinth_records_session_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lessons_album_book_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lessons_album') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
                OR 'books' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.lessons_album ADD CONSTRAINT lessons_album_book_id_fkey 
                FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK lessons_album_book_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK lessons_album_book_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK lessons_album_book_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lessons_travessia_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lessons') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessias') 
                OR 'travessias' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.lessons ADD CONSTRAINT lessons_travessia_id_fkey 
                FOREIGN KEY (travessia_id) REFERENCES public.travessias(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK lessons_travessia_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK lessons_travessia_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK lessons_travessia_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'library_items_created_by_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'library_items') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_fases') 
                OR 'labirinto_fases' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.library_items ADD CONSTRAINT library_items_created_by_fkey 
                FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: mapa_heroina mapa_heroina_porta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mapa_heroina
    ADD CONSTRAINT mapa_heroina_porta_id_fkey FOREIGN KEY (porta_id) REFERENCES public.labirinto_fases(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK library_items_created_by_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK library_items_created_by_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK library_items_created_by_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_sombra_cliente_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_sombra') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.mapa_sombra ADD CONSTRAINT mapa_sombra_cliente_id_fkey 
                FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK mapa_sombra_cliente_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK mapa_sombra_cliente_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK mapa_sombra_cliente_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_vivo_heroina_gesto_jardim_registro_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros') 
                OR 'jardim_heroina_registros' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.mapa_vivo_heroina ADD CONSTRAINT mapa_vivo_heroina_gesto_jardim_registro_id_fkey 
                FOREIGN KEY (gesto_jardim_registro_id) REFERENCES public.jardim_heroina_registros(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK mapa_vivo_heroina_gesto_jardim_registro_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK mapa_vivo_heroina_gesto_jardim_registro_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK mapa_vivo_heroina_gesto_jardim_registro_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_vivo_heroina_session_case_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
                OR 'session_cases' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.mapa_vivo_heroina ADD CONSTRAINT mapa_vivo_heroina_session_case_id_fkey 
                FOREIGN KEY (session_case_id) REFERENCES public.session_cases(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK mapa_vivo_heroina_session_case_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK mapa_vivo_heroina_session_case_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK mapa_vivo_heroina_session_case_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_vivo_historico_mapa_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_vivo_historico') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina') 
                OR 'mapa_vivo_heroina' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.mapa_vivo_historico ADD CONSTRAINT mapa_vivo_historico_mapa_id_fkey 
                FOREIGN KEY (mapa_id) REFERENCES public.mapa_vivo_heroina(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK mapa_vivo_historico_mapa_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK mapa_vivo_historico_mapa_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK mapa_vivo_historico_mapa_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapeamento_complexos_cliente_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapeamento_complexos') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.mapeamento_complexos ADD CONSTRAINT mapeamento_complexos_cliente_id_fkey 
                FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK mapeamento_complexos_cliente_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK mapeamento_complexos_cliente_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK mapeamento_complexos_cliente_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'matriculas_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'matriculas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'message_campaigns') 
                OR 'message_campaigns' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.matriculas ADD CONSTRAINT matriculas_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: message_campaigns message_campaigns_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_campaigns
    ADD CONSTRAINT message_campaigns_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: message_logs message_logs_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_logs
    ADD CONSTRAINT message_logs_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.message_campaigns(id) ;
                RAISE NOTICE 'Created FK matriculas_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK matriculas_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK matriculas_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'message_logs_template_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'message_logs') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'message_templates') 
                OR 'message_templates' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.message_logs ADD CONSTRAINT message_logs_template_id_fkey 
                FOREIGN KEY (template_id) REFERENCES public.message_templates(id) ;
                RAISE NOTICE 'Created FK message_logs_template_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK message_logs_template_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK message_logs_template_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'message_logs_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'message_logs') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mind_maps') 
                OR 'mind_maps' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.message_logs ADD CONSTRAINT message_logs_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: message_templates message_templates_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_templates
    ADD CONSTRAINT message_templates_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: mind_map_nodes mind_map_nodes_map_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mind_map_nodes
    ADD CONSTRAINT mind_map_nodes_map_id_fkey FOREIGN KEY (map_id) REFERENCES public.mind_maps(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK message_logs_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK message_logs_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK message_logs_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mind_map_nodes_parent_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mind_map_nodes') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mind_map_nodes') 
                OR 'mind_map_nodes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.mind_map_nodes ADD CONSTRAINT mind_map_nodes_parent_id_fkey 
                FOREIGN KEY (parent_id) REFERENCES public.mind_map_nodes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK mind_map_nodes_parent_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK mind_map_nodes_parent_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK mind_map_nodes_parent_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mind_maps_owner_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mind_maps') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
                OR 'profiles' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.mind_maps ADD CONSTRAINT mind_maps_owner_id_fkey 
                FOREIGN KEY (owner_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK mind_maps_owner_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK mind_maps_owner_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK mind_maps_owner_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'missoes_aula_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'missoes') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'aulas') 
                OR 'aulas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.missoes ADD CONSTRAINT missoes_aula_id_fkey 
                FOREIGN KEY (aula_id) REFERENCES public.aulas(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK missoes_aula_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK missoes_aula_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK missoes_aula_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'missoes_created_by_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'missoes') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portais') 
                OR 'portais' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.missoes ADD CONSTRAINT missoes_created_by_fkey 
                FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: missoes missoes_portal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.missoes
    ADD CONSTRAINT missoes_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.portais(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK missoes_created_by_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK missoes_created_by_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK missoes_created_by_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narrative_maps_case_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narrative_maps') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
                OR 'session_cases' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.narrative_maps ADD CONSTRAINT narrative_maps_case_id_fkey 
                FOREIGN KEY (case_id) REFERENCES public.session_cases(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK narrative_maps_case_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK narrative_maps_case_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK narrative_maps_case_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narrative_maps_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narrative_maps') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
                OR 'profiles' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.narrative_maps ADD CONSTRAINT narrative_maps_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK narrative_maps_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK narrative_maps_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK narrative_maps_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narrative_maps_therapist_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narrative_maps') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
                OR 'profiles' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.narrative_maps ADD CONSTRAINT narrative_maps_therapist_id_fkey 
                FOREIGN KEY (therapist_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK narrative_maps_therapist_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK narrative_maps_therapist_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK narrative_maps_therapist_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narroterapia_estudos_audio_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narroterapia_estudos') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'audio_assets') 
                OR 'audio_assets' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.narroterapia_estudos ADD CONSTRAINT narroterapia_estudos_audio_id_fkey 
                FOREIGN KEY (audio_id) REFERENCES public.audio_assets(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK narroterapia_estudos_audio_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK narroterapia_estudos_audio_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK narroterapia_estudos_audio_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narroterapia_reacoes_simbolicas_audio_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narroterapia_reacoes_simbolicas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'audio_assets') 
                OR 'audio_assets' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.narroterapia_reacoes_simbolicas ADD CONSTRAINT narroterapia_reacoes_simbolicas_audio_id_fkey 
                FOREIGN KEY (audio_id) REFERENCES public.audio_assets(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK narroterapia_reacoes_simbolicas_audio_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK narroterapia_reacoes_simbolicas_audio_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK narroterapia_reacoes_simbolicas_audio_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narroterapia_reacoes_simbolicas_conto_clinico_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narroterapia_reacoes_simbolicas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contos_clinicos') 
                OR 'contos_clinicos' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.narroterapia_reacoes_simbolicas ADD CONSTRAINT narroterapia_reacoes_simbolicas_conto_clinico_id_fkey 
                FOREIGN KEY (conto_clinico_id) REFERENCES public.contos_clinicos(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK narroterapia_reacoes_simbolicas_conto_clinico_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK narroterapia_reacoes_simbolicas_conto_clinico_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK narroterapia_reacoes_simbolicas_conto_clinico_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'notification_logs_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notification_logs') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_archetypes') 
                OR 'founding_archetypes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.notification_logs ADD CONSTRAINT notification_logs_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: notification_preferences notification_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oracle_cards oracle_cards_archetype_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oracle_cards
    ADD CONSTRAINT oracle_cards_archetype_id_fkey FOREIGN KEY (archetype_id) REFERENCES public.founding_archetypes(id) ;
                RAISE NOTICE 'Created FK notification_logs_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK notification_logs_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK notification_logs_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_cards_deck_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_cards') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_decks') 
                OR 'oracle_decks' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.oracle_cards ADD CONSTRAINT oracle_cards_deck_id_fkey 
                FOREIGN KEY (deck_id) REFERENCES public.oracle_decks(id) ;
                RAISE NOTICE 'Created FK oracle_cards_deck_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK oracle_cards_deck_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK oracle_cards_deck_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_cards_district_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_cards') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'city_districts') 
                OR 'city_districts' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.oracle_cards ADD CONSTRAINT oracle_cards_district_id_fkey 
                FOREIGN KEY (district_id) REFERENCES public.city_districts(id) ;
                RAISE NOTICE 'Created FK oracle_cards_district_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK oracle_cards_district_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK oracle_cards_district_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_cards_tool_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_cards') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
                OR 'tools' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.oracle_cards ADD CONSTRAINT oracle_cards_tool_id_fkey 
                FOREIGN KEY (tool_id) REFERENCES public.tools(id) ;
                RAISE NOTICE 'Created FK oracle_cards_tool_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK oracle_cards_tool_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK oracle_cards_tool_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_categories_oracle_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_categories') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_decks') 
                OR 'oracle_decks' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.oracle_categories ADD CONSTRAINT oracle_categories_oracle_id_fkey 
                FOREIGN KEY (oracle_id) REFERENCES public.oracle_decks(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK oracle_categories_oracle_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK oracle_categories_oracle_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK oracle_categories_oracle_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_clients_therapist_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_clients') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_clients') 
                OR 'oracle_clients' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.oracle_clients ADD CONSTRAINT oracle_clients_therapist_user_id_fkey 
                FOREIGN KEY (therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oracle_decks oracle_decks_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oracle_decks
    ADD CONSTRAINT oracle_decks_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: oracle_draws oracle_draws_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oracle_draws
    ADD CONSTRAINT oracle_draws_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.oracle_clients(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK oracle_clients_therapist_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK oracle_clients_therapist_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK oracle_clients_therapist_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_draws_oracle_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_draws') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_decks') 
                OR 'oracle_decks' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.oracle_draws ADD CONSTRAINT oracle_draws_oracle_id_fkey 
                FOREIGN KEY (oracle_id) REFERENCES public.oracle_decks(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK oracle_draws_oracle_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK oracle_draws_oracle_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK oracle_draws_oracle_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_draws_spread_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_draws') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_spreads') 
                OR 'oracle_spreads' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.oracle_draws ADD CONSTRAINT oracle_draws_spread_id_fkey 
                FOREIGN KEY (spread_id) REFERENCES public.oracle_spreads(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK oracle_draws_spread_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK oracle_draws_spread_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK oracle_draws_spread_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_draws_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_draws') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_spreads') 
                OR 'oracle_spreads' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.oracle_draws ADD CONSTRAINT oracle_draws_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oracle_spread_positions oracle_spread_positions_spread_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oracle_spread_positions
    ADD CONSTRAINT oracle_spread_positions_spread_id_fkey FOREIGN KEY (spread_id) REFERENCES public.oracle_spreads(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK oracle_draws_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK oracle_draws_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK oracle_draws_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_spreads_oracle_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_spreads') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_decks') 
                OR 'oracle_decks' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.oracle_spreads ADD CONSTRAINT oracle_spreads_oracle_id_fkey 
                FOREIGN KEY (oracle_id) REFERENCES public.oracle_decks(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK oracle_spreads_oracle_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK oracle_spreads_oracle_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK oracle_spreads_oracle_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_usage_stats_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_usage_stats') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.oracle_usage_stats ADD CONSTRAINT oracle_usage_stats_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK oracle_usage_stats_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK oracle_usage_stats_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK oracle_usage_stats_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_aplicacoes_pergunta_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_aplicacoes') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_perguntas') 
                OR 'oraculo_perguntas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.oraculo_aplicacoes ADD CONSTRAINT oraculo_aplicacoes_pergunta_id_fkey 
                FOREIGN KEY (pergunta_id) REFERENCES public.oraculo_perguntas(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK oraculo_aplicacoes_pergunta_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK oraculo_aplicacoes_pergunta_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK oraculo_aplicacoes_pergunta_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_aplicacoes_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_aplicacoes') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_perguntas') 
                OR 'oraculo_perguntas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.oraculo_aplicacoes ADD CONSTRAINT oraculo_aplicacoes_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oraculo_favoritos oraculo_favoritos_pergunta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oraculo_favoritos
    ADD CONSTRAINT oraculo_favoritos_pergunta_id_fkey FOREIGN KEY (pergunta_id) REFERENCES public.oraculo_perguntas(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK oraculo_aplicacoes_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK oraculo_aplicacoes_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK oraculo_aplicacoes_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_favoritos_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_favoritos') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
                OR 'oraculo_portais' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.oraculo_favoritos ADD CONSTRAINT oraculo_favoritos_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oraculo_portal_aplicacoes oraculo_portal_aplicacoes_portal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oraculo_portal_aplicacoes
    ADD CONSTRAINT oraculo_portal_aplicacoes_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK oraculo_favoritos_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK oraculo_favoritos_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK oraculo_favoritos_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_audios_portal_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_audios') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
                OR 'oraculo_portais' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.oraculo_portal_audios ADD CONSTRAINT oraculo_portal_audios_portal_id_fkey 
                FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK oraculo_portal_audios_portal_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK oraculo_portal_audios_portal_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK oraculo_portal_audios_portal_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_essencia_portal_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_essencia') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
                OR 'oraculo_portais' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.oraculo_portal_essencia ADD CONSTRAINT oraculo_portal_essencia_portal_id_fkey 
                FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK oraculo_portal_essencia_portal_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK oraculo_portal_essencia_portal_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK oraculo_portal_essencia_portal_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_ferramenta_campos_ferramenta_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramenta_campos') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramentas') 
                OR 'oraculo_portal_ferramentas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.oraculo_portal_ferramenta_campos ADD CONSTRAINT oraculo_portal_ferramenta_campos_ferramenta_id_fkey 
                FOREIGN KEY (ferramenta_id) REFERENCES public.oraculo_portal_ferramentas(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK oraculo_portal_ferramenta_campos_ferramenta_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK oraculo_portal_ferramenta_campos_ferramenta_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK oraculo_portal_ferramenta_campos_ferramenta_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_ferramentas_portal_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramentas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
                OR 'oraculo_portais' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.oraculo_portal_ferramentas ADD CONSTRAINT oraculo_portal_ferramentas_portal_id_fkey 
                FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK oraculo_portal_ferramentas_portal_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK oraculo_portal_ferramentas_portal_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK oraculo_portal_ferramentas_portal_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_forja_erros_forja_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forja_erros') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas') 
                OR 'oraculo_portal_forjas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.oraculo_portal_forja_erros ADD CONSTRAINT oraculo_portal_forja_erros_forja_id_fkey 
                FOREIGN KEY (forja_id) REFERENCES public.oraculo_portal_forjas(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK oraculo_portal_forja_erros_forja_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK oraculo_portal_forja_erros_forja_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK oraculo_portal_forja_erros_forja_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_forja_passos_forja_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forja_passos') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas') 
                OR 'oraculo_portal_forjas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.oraculo_portal_forja_passos ADD CONSTRAINT oraculo_portal_forja_passos_forja_id_fkey 
                FOREIGN KEY (forja_id) REFERENCES public.oraculo_portal_forjas(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK oraculo_portal_forja_passos_forja_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK oraculo_portal_forja_passos_forja_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK oraculo_portal_forja_passos_forja_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_forjas_portal_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
                OR 'oraculo_portais' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.oraculo_portal_forjas ADD CONSTRAINT oraculo_portal_forjas_portal_id_fkey 
                FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK oraculo_portal_forjas_portal_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK oraculo_portal_forjas_portal_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK oraculo_portal_forjas_portal_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_jardins_portal_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_jardins') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
                OR 'oraculo_portais' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.oraculo_portal_jardins ADD CONSTRAINT oraculo_portal_jardins_portal_id_fkey 
                FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK oraculo_portal_jardins_portal_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK oraculo_portal_jardins_portal_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK oraculo_portal_jardins_portal_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_laboratorio_passos_laboratorio_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorio_passos') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorios') 
                OR 'oraculo_portal_laboratorios' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.oraculo_portal_laboratorio_passos ADD CONSTRAINT oraculo_portal_laboratorio_passos_laboratorio_id_fkey 
                FOREIGN KEY (laboratorio_id) REFERENCES public.oraculo_portal_laboratorios(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK oraculo_portal_laboratorio_passos_laboratorio_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK oraculo_portal_laboratorio_passos_laboratorio_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK oraculo_portal_laboratorio_passos_laboratorio_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_laboratorios_portal_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorios') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
                OR 'oraculo_portais' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.oraculo_portal_laboratorios ADD CONSTRAINT oraculo_portal_laboratorios_portal_id_fkey 
                FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK oraculo_portal_laboratorios_portal_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK oraculo_portal_laboratorios_portal_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK oraculo_portal_laboratorios_portal_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_materiais_portal_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_materiais') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
                OR 'oraculo_portais' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.oraculo_portal_materiais ADD CONSTRAINT oraculo_portal_materiais_portal_id_fkey 
                FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK oraculo_portal_materiais_portal_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK oraculo_portal_materiais_portal_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK oraculo_portal_materiais_portal_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia_perguntas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia') 
                OR 'oraculo_portal_narroterapia' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.oraculo_portal_narroterapia_perguntas ADD CONSTRAINT oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey 
                FOREIGN KEY (narroterapia_id) REFERENCES public.oraculo_portal_narroterapia(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_narroterapia_portal_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
                OR 'oraculo_portais' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.oraculo_portal_narroterapia ADD CONSTRAINT oraculo_portal_narroterapia_portal_id_fkey 
                FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK oraculo_portal_narroterapia_portal_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK oraculo_portal_narroterapia_portal_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK oraculo_portal_narroterapia_portal_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_riscos_eticos_portal_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_riscos_eticos') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
                OR 'oraculo_portais' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.oraculo_portal_riscos_eticos ADD CONSTRAINT oraculo_portal_riscos_eticos_portal_id_fkey 
                FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK oraculo_portal_riscos_eticos_portal_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK oraculo_portal_riscos_eticos_portal_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK oraculo_portal_riscos_eticos_portal_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'personal_symbolic_maps_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'personal_symbolic_maps') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornadas') 
                OR 'jornadas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.personal_symbolic_maps ADD CONSTRAINT personal_symbolic_maps_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: portais portais_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portais
    ADD CONSTRAINT portais_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: portais portais_jornada_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portais
    ADD CONSTRAINT portais_jornada_id_fkey FOREIGN KEY (jornada_id) REFERENCES public.jornadas(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK personal_symbolic_maps_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK personal_symbolic_maps_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK personal_symbolic_maps_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portais_modulo_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portais') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'modulos_formativos') 
                OR 'modulos_formativos' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.portais ADD CONSTRAINT portais_modulo_id_fkey 
                FOREIGN KEY (modulo_id) REFERENCES public.modulos_formativos(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK portais_modulo_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK portais_modulo_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK portais_modulo_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_junguiano_modulos_config_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_modulos') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_config') 
                OR 'portal_junguiano_config' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.portal_junguiano_modulos ADD CONSTRAINT portal_junguiano_modulos_config_id_fkey 
                FOREIGN KEY (config_id) REFERENCES public.portal_junguiano_config(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK portal_junguiano_modulos_config_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK portal_junguiano_modulos_config_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK portal_junguiano_modulos_config_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_junguiano_portais_modulo_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_portais') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_modulos') 
                OR 'portal_junguiano_modulos' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.portal_junguiano_portais ADD CONSTRAINT portal_junguiano_portais_modulo_id_fkey 
                FOREIGN KEY (modulo_id) REFERENCES public.portal_junguiano_modulos(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK portal_junguiano_portais_modulo_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK portal_junguiano_portais_modulo_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK portal_junguiano_portais_modulo_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_junguiano_progresso_config_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_progresso') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_config') 
                OR 'portal_junguiano_config' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.portal_junguiano_progresso ADD CONSTRAINT portal_junguiano_progresso_config_id_fkey 
                FOREIGN KEY (config_id) REFERENCES public.portal_junguiano_config(id) ;
                RAISE NOTICE 'Created FK portal_junguiano_progresso_config_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK portal_junguiano_progresso_config_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK portal_junguiano_progresso_config_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_junguiano_registros_portal_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_registros') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_portais') 
                OR 'portal_junguiano_portais' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.portal_junguiano_registros ADD CONSTRAINT portal_junguiano_registros_portal_id_fkey 
                FOREIGN KEY (portal_id) REFERENCES public.portal_junguiano_portais(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK portal_junguiano_registros_portal_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK portal_junguiano_registros_portal_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK portal_junguiano_registros_portal_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_progress_portal_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_progress') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portais') 
                OR 'clube_portais' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.portal_progress ADD CONSTRAINT portal_progress_portal_id_fkey 
                FOREIGN KEY (portal_id) REFERENCES public.clube_portais(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK portal_progress_portal_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK portal_progress_portal_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK portal_progress_portal_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_salas_sala_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_salas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'salas') 
                OR 'salas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.portal_salas ADD CONSTRAINT portal_salas_sala_id_fkey 
                FOREIGN KEY (sala_id) REFERENCES public.salas(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK portal_salas_sala_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK portal_salas_sala_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK portal_salas_sala_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'post_session_closures_case_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'post_session_closures') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
                OR 'session_cases' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.post_session_closures ADD CONSTRAINT post_session_closures_case_id_fkey 
                FOREIGN KEY (case_id) REFERENCES public.session_cases(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK post_session_closures_case_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK post_session_closures_case_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK post_session_closures_case_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'post_session_closures_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'post_session_closures') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
                OR 'profiles' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.post_session_closures ADD CONSTRAINT post_session_closures_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK post_session_closures_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK post_session_closures_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK post_session_closures_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'post_session_closures_therapist_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'post_session_closures') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
                OR 'profiles' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.post_session_closures ADD CONSTRAINT post_session_closures_therapist_id_fkey 
                FOREIGN KEY (therapist_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK post_session_closures_therapist_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK post_session_closures_therapist_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK post_session_closures_therapist_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'posts_mentoria_created_by_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'posts_mentoria') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.posts_mentoria ADD CONSTRAINT posts_mentoria_created_by_fkey 
                FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: praticas_mudra praticas_mudra_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.praticas_mudra
    ADD CONSTRAINT praticas_mudra_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK posts_mentoria_created_by_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK posts_mentoria_created_by_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK posts_mentoria_created_by_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'formacoes') 
                OR 'formacoes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey 
                FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: progresso_aluna progresso_aluna_formacao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.progresso_aluna
    ADD CONSTRAINT progresso_aluna_formacao_id_fkey FOREIGN KEY (formacao_id) REFERENCES public.formacoes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK profiles_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK profiles_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK profiles_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'progresso_aluna_modulo_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'progresso_aluna') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'formacao_modulos') 
                OR 'formacao_modulos' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.progresso_aluna ADD CONSTRAINT progresso_aluna_modulo_id_fkey 
                FOREIGN KEY (modulo_id) REFERENCES public.formacao_modulos(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK progresso_aluna_modulo_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK progresso_aluna_modulo_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK progresso_aluna_modulo_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projetos_mestria_avaliador_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'projetos_mestria') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses') 
                OR 'courses' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.projetos_mestria ADD CONSTRAINT projetos_mestria_avaliador_id_fkey 
                FOREIGN KEY (avaliador_id) REFERENCES auth.users(id);


--
-- Name: projetos_mestria projetos_mestria_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projetos_mestria
    ADD CONSTRAINT projetos_mestria_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK projetos_mestria_avaliador_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK projetos_mestria_avaliador_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK projetos_mestria_avaliador_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projetos_mestria_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'projetos_mestria') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros') 
                OR 'jornada_heroina_registros' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.projetos_mestria ADD CONSTRAINT projetos_mestria_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: protocolo_oracula protocolo_oracula_caminho_registro_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.protocolo_oracula
    ADD CONSTRAINT protocolo_oracula_caminho_registro_id_fkey FOREIGN KEY (caminho_registro_id) REFERENCES public.jornada_heroina_registros(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK projetos_mestria_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK projetos_mestria_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK projetos_mestria_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protocolo_oracula_cliente_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'protocolo_oracula') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.protocolo_oracula ADD CONSTRAINT protocolo_oracula_cliente_id_fkey 
                FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK protocolo_oracula_cliente_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK protocolo_oracula_cliente_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK protocolo_oracula_cliente_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protocolo_oracula_mapa_registro_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'protocolo_oracula') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_symbolic_registros') 
                OR 'big5_symbolic_registros' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.protocolo_oracula ADD CONSTRAINT protocolo_oracula_mapa_registro_id_fkey 
                FOREIGN KEY (mapa_registro_id) REFERENCES public.big5_symbolic_registros(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK protocolo_oracula_mapa_registro_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK protocolo_oracula_mapa_registro_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK protocolo_oracula_mapa_registro_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protocolo_oracula_oraculo_registro_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'protocolo_oracula') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_registros') 
                OR 'eneagrama_feminino_registros' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.protocolo_oracula ADD CONSTRAINT protocolo_oracula_oraculo_registro_id_fkey 
                FOREIGN KEY (oraculo_registro_id) REFERENCES public.eneagrama_feminino_registros(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK protocolo_oracula_oraculo_registro_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK protocolo_oracula_oraculo_registro_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK protocolo_oracula_oraculo_registro_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protocolo_oracula_session_case_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'protocolo_oracula') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
                OR 'session_cases' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.protocolo_oracula ADD CONSTRAINT protocolo_oracula_session_case_id_fkey 
                FOREIGN KEY (session_case_id) REFERENCES public.session_cases(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK protocolo_oracula_session_case_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK protocolo_oracula_session_case_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK protocolo_oracula_session_case_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'push_subscriptions_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'push_subscriptions') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_perguntas') 
                OR 'quiz_perguntas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.push_subscriptions ADD CONSTRAINT push_subscriptions_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: quiz_opcoes quiz_opcoes_pergunta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_opcoes
    ADD CONSTRAINT quiz_opcoes_pergunta_id_fkey FOREIGN KEY (pergunta_id) REFERENCES public.quiz_perguntas(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK push_subscriptions_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK push_subscriptions_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK push_subscriptions_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_perguntas_quiz_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_perguntas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quizzes') 
                OR 'quizzes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.quiz_perguntas ADD CONSTRAINT quiz_perguntas_quiz_id_fkey 
                FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK quiz_perguntas_quiz_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK quiz_perguntas_quiz_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK quiz_perguntas_quiz_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_respostas_usuario_quiz_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_respostas_usuario') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quizzes') 
                OR 'quizzes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.quiz_respostas_usuario ADD CONSTRAINT quiz_respostas_usuario_quiz_id_fkey 
                FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK quiz_respostas_usuario_quiz_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK quiz_respostas_usuario_quiz_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK quiz_respostas_usuario_quiz_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_respostas_usuario_resultado_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_respostas_usuario') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_resultados') 
                OR 'quiz_resultados' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.quiz_respostas_usuario ADD CONSTRAINT quiz_respostas_usuario_resultado_id_fkey 
                FOREIGN KEY (resultado_id) REFERENCES public.quiz_resultados(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK quiz_respostas_usuario_resultado_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK quiz_respostas_usuario_resultado_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK quiz_respostas_usuario_resultado_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_resultados_agente_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_resultados') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agentes') 
                OR 'agentes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.quiz_resultados ADD CONSTRAINT quiz_resultados_agente_id_fkey 
                FOREIGN KEY (agente_id) REFERENCES public.agentes(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK quiz_resultados_agente_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK quiz_resultados_agente_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK quiz_resultados_agente_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_resultados_quiz_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_resultados') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quizzes') 
                OR 'quizzes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.quiz_resultados ADD CONSTRAINT quiz_resultados_quiz_id_fkey 
                FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK quiz_resultados_quiz_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK quiz_resultados_quiz_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK quiz_resultados_quiz_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quizzes_portal_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quizzes') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_travessias') 
                OR 'conteudo_travessias' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.quizzes ADD CONSTRAINT quizzes_portal_id_fkey 
                FOREIGN KEY (portal_id) REFERENCES public.conteudo_travessias(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK quizzes_portal_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK quizzes_portal_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK quizzes_portal_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quizzes_sala_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quizzes') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'salas') 
                OR 'salas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.quizzes ADD CONSTRAINT quizzes_sala_id_fkey 
                FOREIGN KEY (sala_id) REFERENCES public.salas(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK quizzes_sala_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK quizzes_sala_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK quizzes_sala_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reflexoes_jornada_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'reflexoes_jornada') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.reflexoes_jornada ADD CONSTRAINT reflexoes_jornada_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK reflexoes_jornada_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK reflexoes_jornada_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK reflexoes_jornada_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'relacionamentos_espelho_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'relacionamentos_espelho') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.relacionamentos_espelho ADD CONSTRAINT relacionamentos_espelho_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK relacionamentos_espelho_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK relacionamentos_espelho_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK relacionamentos_espelho_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'respostas_exercicios_sessao_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'respostas_exercicios') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessoes_labirinto') 
                OR 'sessoes_labirinto' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.respostas_exercicios ADD CONSTRAINT respostas_exercicios_sessao_id_fkey 
                FOREIGN KEY (sessao_id) REFERENCES public.sessoes_labirinto(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK respostas_exercicios_sessao_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK respostas_exercicios_sessao_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK respostas_exercicios_sessao_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rituais_integracao_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rituais_integracao') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.rituais_integracao ADD CONSTRAINT rituais_integracao_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK rituais_integracao_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK rituais_integracao_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK rituais_integracao_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ritual_passages_ritual_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ritual_passages') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ritual_definitions') 
                OR 'ritual_definitions' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.ritual_passages ADD CONSTRAINT ritual_passages_ritual_id_fkey 
                FOREIGN KEY (ritual_id) REFERENCES public.ritual_definitions(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK ritual_passages_ritual_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK ritual_passages_ritual_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK ritual_passages_ritual_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ritual_passages_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ritual_passages') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_familias') 
                OR 'travessia_familias' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.ritual_passages ADD CONSTRAINT ritual_passages_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sala_ferramentas sala_ferramentas_familia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sala_ferramentas
    ADD CONSTRAINT sala_ferramentas_familia_id_fkey FOREIGN KEY (familia_id) REFERENCES public.travessia_familias(id) ;
                RAISE NOTICE 'Created FK ritual_passages_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK ritual_passages_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK ritual_passages_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sala_ferramentas_ferramenta_pai_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
                OR 'sala_ferramentas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.sala_ferramentas ADD CONSTRAINT sala_ferramentas_ferramenta_pai_id_fkey 
                FOREIGN KEY (ferramenta_pai_id) REFERENCES public.sala_ferramentas(id) ;
                RAISE NOTICE 'Created FK sala_ferramentas_ferramenta_pai_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK sala_ferramentas_ferramenta_pai_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK sala_ferramentas_ferramenta_pai_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sala_ferramentas_portal_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_travessias') 
                OR 'conteudo_travessias' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.sala_ferramentas ADD CONSTRAINT sala_ferramentas_portal_id_fkey 
                FOREIGN KEY (portal_id) REFERENCES public.conteudo_travessias(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK sala_ferramentas_portal_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK sala_ferramentas_portal_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK sala_ferramentas_portal_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sala_ferramentas_sala_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'salas') 
                OR 'salas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.sala_ferramentas ADD CONSTRAINT sala_ferramentas_sala_id_fkey 
                FOREIGN KEY (sala_id) REFERENCES public.salas(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK sala_ferramentas_sala_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK sala_ferramentas_sala_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK sala_ferramentas_sala_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'season_books_season_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'season_books') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
                OR 'oracular_seasons' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.season_books ADD CONSTRAINT season_books_season_id_fkey 
                FOREIGN KEY (season_id) REFERENCES public.oracular_seasons(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK season_books_season_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK season_books_season_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK season_books_season_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'season_labs_season_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'season_labs') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
                OR 'oracular_seasons' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.season_labs ADD CONSTRAINT season_labs_season_id_fkey 
                FOREIGN KEY (season_id) REFERENCES public.oracular_seasons(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK season_labs_season_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK season_labs_season_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK season_labs_season_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_archetypes_archetype_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_archetypes') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_femininos') 
                OR 'atlas_arquetipos_femininos' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.session_archetypes ADD CONSTRAINT session_archetypes_archetype_id_fkey 
                FOREIGN KEY (archetype_id) REFERENCES public.atlas_arquetipos_femininos(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK session_archetypes_archetype_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK session_archetypes_archetype_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK session_archetypes_archetype_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_archetypes_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_archetypes') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.session_archetypes ADD CONSTRAINT session_archetypes_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK session_archetypes_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK session_archetypes_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK session_archetypes_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_archetypes_session_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_archetypes') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
                OR 'sessions' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.session_archetypes ADD CONSTRAINT session_archetypes_session_id_fkey 
                FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK session_archetypes_session_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK session_archetypes_session_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK session_archetypes_session_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_cases_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.session_cases ADD CONSTRAINT session_cases_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK session_cases_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK session_cases_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK session_cases_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_cases_therapist_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
                OR 'profiles' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.session_cases ADD CONSTRAINT session_cases_therapist_id_fkey 
                FOREIGN KEY (therapist_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK session_cases_therapist_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK session_cases_therapist_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK session_cases_therapist_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_interventions_intervention_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_interventions') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'interventions') 
                OR 'interventions' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.session_interventions ADD CONSTRAINT session_interventions_intervention_id_fkey 
                FOREIGN KEY (intervention_id) REFERENCES public.interventions(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK session_interventions_intervention_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK session_interventions_intervention_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK session_interventions_intervention_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_interventions_session_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_interventions') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
                OR 'sessions' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.session_interventions ADD CONSTRAINT session_interventions_session_id_fkey 
                FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK session_interventions_session_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK session_interventions_session_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK session_interventions_session_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_oracle_draws_case_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_oracle_draws') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
                OR 'session_cases' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.session_oracle_draws ADD CONSTRAINT session_oracle_draws_case_id_fkey 
                FOREIGN KEY (case_id) REFERENCES public.session_cases(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK session_oracle_draws_case_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK session_oracle_draws_case_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK session_oracle_draws_case_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_oracle_draws_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_oracle_draws') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
                OR 'profiles' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.session_oracle_draws ADD CONSTRAINT session_oracle_draws_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK session_oracle_draws_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK session_oracle_draws_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK session_oracle_draws_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_oracle_draws_therapist_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_oracle_draws') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
                OR 'profiles' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.session_oracle_draws ADD CONSTRAINT session_oracle_draws_therapist_id_fkey 
                FOREIGN KEY (therapist_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK session_oracle_draws_therapist_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK session_oracle_draws_therapist_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK session_oracle_draws_therapist_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_scripts_case_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_scripts') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
                OR 'session_cases' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.session_scripts ADD CONSTRAINT session_scripts_case_id_fkey 
                FOREIGN KEY (case_id) REFERENCES public.session_cases(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK session_scripts_case_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK session_scripts_case_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK session_scripts_case_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_scripts_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_scripts') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
                OR 'profiles' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.session_scripts ADD CONSTRAINT session_scripts_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK session_scripts_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK session_scripts_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK session_scripts_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_scripts_narrative_map_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_scripts') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narrative_maps') 
                OR 'narrative_maps' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.session_scripts ADD CONSTRAINT session_scripts_narrative_map_id_fkey 
                FOREIGN KEY (narrative_map_id) REFERENCES public.narrative_maps(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK session_scripts_narrative_map_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK session_scripts_narrative_map_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK session_scripts_narrative_map_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_scripts_therapist_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_scripts') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
                OR 'profiles' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.session_scripts ADD CONSTRAINT session_scripts_therapist_id_fkey 
                FOREIGN KEY (therapist_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK session_scripts_therapist_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK session_scripts_therapist_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK session_scripts_therapist_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_cidadela_card_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards') 
                OR 'cidadela_oracle_cards' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.sessions ADD CONSTRAINT sessions_cidadela_card_id_fkey 
                FOREIGN KEY (cidadela_card_id) REFERENCES public.cidadela_oracle_cards(id) ;
                RAISE NOTICE 'Created FK sessions_cidadela_card_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK sessions_cidadela_card_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK sessions_cidadela_card_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.sessions ADD CONSTRAINT sessions_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK sessions_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK sessions_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK sessions_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_district_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') 
                OR 'districts' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.sessions ADD CONSTRAINT sessions_district_id_fkey 
                FOREIGN KEY (district_id) REFERENCES public.districts(id) ;
                RAISE NOTICE 'Created FK sessions_district_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK sessions_district_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK sessions_district_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_tool_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
                OR 'tools' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.sessions ADD CONSTRAINT sessions_tool_id_fkey 
                FOREIGN KEY (tool_id) REFERENCES public.tools(id) ;
                RAISE NOTICE 'Created FK sessions_tool_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK sessions_tool_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK sessions_tool_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessoes_casa_maquinas_cliente_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.sessoes_casa_maquinas ADD CONSTRAINT sessoes_casa_maquinas_cliente_id_fkey 
                FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK sessoes_casa_maquinas_cliente_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK sessoes_casa_maquinas_cliente_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK sessoes_casa_maquinas_cliente_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessoes_casa_maquinas_owner_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_fases') 
                OR 'labirinto_fases' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.sessoes_casa_maquinas ADD CONSTRAINT sessoes_casa_maquinas_owner_id_fkey 
                FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sessoes_labirinto sessoes_labirinto_porta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessoes_labirinto
    ADD CONSTRAINT sessoes_labirinto_porta_id_fkey FOREIGN KEY (porta_id) REFERENCES public.labirinto_fases(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK sessoes_casa_maquinas_owner_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK sessoes_casa_maquinas_owner_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK sessoes_casa_maquinas_owner_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'simulador_progresso_cenario_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'simulador_progresso') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'simulador_cenarios') 
                OR 'simulador_cenarios' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.simulador_progresso ADD CONSTRAINT simulador_progresso_cenario_id_fkey 
                FOREIGN KEY (cenario_id) REFERENCES public.simulador_cenarios(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK simulador_progresso_cenario_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK simulador_progresso_cenario_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK simulador_progresso_cenario_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'simulador_progresso_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'simulador_progresso') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.simulador_progresso ADD CONSTRAINT simulador_progresso_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sonho_estruturado sonho_estruturado_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sonho_estruturado
    ADD CONSTRAINT sonho_estruturado_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK simulador_progresso_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK simulador_progresso_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK simulador_progresso_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sonhos_cabalisticos_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sonhos_cabalisticos') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.sonhos_cabalisticos ADD CONSTRAINT sonhos_cabalisticos_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK sonhos_cabalisticos_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK sonhos_cabalisticos_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK sonhos_cabalisticos_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'station_progress_station_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'station_progress') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
                OR 'clube_estacoes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.station_progress ADD CONSTRAINT station_progress_station_id_fkey 
                FOREIGN KEY (station_id) REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK station_progress_station_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK station_progress_station_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK station_progress_station_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'studio_episodes_created_by_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'studio_episodes') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'studio_method_axes') 
                OR 'studio_method_axes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.studio_episodes ADD CONSTRAINT studio_episodes_created_by_fkey 
                FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: studio_episodes studio_episodes_eixo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.studio_episodes
    ADD CONSTRAINT studio_episodes_eixo_id_fkey FOREIGN KEY (eixo_id) REFERENCES public.studio_method_axes(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK studio_episodes_created_by_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK studio_episodes_created_by_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK studio_episodes_created_by_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'subscriptions_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'subscriptions') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
                OR 'session_cases' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: symbolic_template_sessions symbolic_template_sessions_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.symbolic_template_sessions
    ADD CONSTRAINT symbolic_template_sessions_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.session_cases(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK subscriptions_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK subscriptions_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK subscriptions_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'symbolic_template_sessions_cliente_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'symbolic_template_sessions') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.symbolic_template_sessions ADD CONSTRAINT symbolic_template_sessions_cliente_id_fkey 
                FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL;
                RAISE NOTICE 'Created FK symbolic_template_sessions_cliente_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK symbolic_template_sessions_cliente_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK symbolic_template_sessions_cliente_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'syntheia_conversations_mode_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'syntheia_conversations') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'syntheia_modes') 
                OR 'syntheia_modes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.syntheia_conversations ADD CONSTRAINT syntheia_conversations_mode_id_fkey 
                FOREIGN KEY (mode_id) REFERENCES public.syntheia_modes(id) ;
                RAISE NOTICE 'Created FK syntheia_conversations_mode_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK syntheia_conversations_mode_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK syntheia_conversations_mode_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'syntheia_conversations_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'syntheia_conversations') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'syntheia_voices') 
                OR 'syntheia_voices' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.syntheia_conversations ADD CONSTRAINT syntheia_conversations_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: syntheia_conversations syntheia_conversations_voice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.syntheia_conversations
    ADD CONSTRAINT syntheia_conversations_voice_id_fkey FOREIGN KEY (voice_id) REFERENCES public.syntheia_voices(id) ;
                RAISE NOTICE 'Created FK syntheia_conversations_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK syntheia_conversations_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK syntheia_conversations_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'syntheia_messages_conversation_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'syntheia_messages') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'syntheia_conversations') 
                OR 'syntheia_conversations' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.syntheia_messages ADD CONSTRAINT syntheia_messages_conversation_id_fkey 
                FOREIGN KEY (conversation_id) REFERENCES public.syntheia_conversations(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK syntheia_messages_conversation_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK syntheia_messages_conversation_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK syntheia_messages_conversation_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tecela_casos_espelho_created_by_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tecela_casos_espelho') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tecela_conselho') 
                OR 'tecela_conselho' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.tecela_casos_espelho ADD CONSTRAINT tecela_casos_espelho_created_by_fkey 
                FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: tecela_comentarios tecela_comentarios_autor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tecela_comentarios
    ADD CONSTRAINT tecela_comentarios_autor_id_fkey FOREIGN KEY (autor_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: tecela_conselho tecela_conselho_autor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tecela_conselho
    ADD CONSTRAINT tecela_conselho_autor_id_fkey FOREIGN KEY (autor_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: tecela_conselho_respostas tecela_conselho_respostas_autor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tecela_conselho_respostas
    ADD CONSTRAINT tecela_conselho_respostas_autor_id_fkey FOREIGN KEY (autor_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: tecela_conselho_respostas tecela_conselho_respostas_conselho_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tecela_conselho_respostas
    ADD CONSTRAINT tecela_conselho_respostas_conselho_id_fkey FOREIGN KEY (conselho_id) REFERENCES public.tecela_conselho(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK tecela_casos_espelho_created_by_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK tecela_casos_espelho_created_by_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK tecela_casos_espelho_created_by_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tecela_favoritos_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tecela_favoritos') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tecela_registros_campo') 
                OR 'tecela_registros_campo' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.tecela_favoritos ADD CONSTRAINT tecela_favoritos_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: tecela_intervencoes tecela_intervencoes_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tecela_intervencoes
    ADD CONSTRAINT tecela_intervencoes_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: tecela_mensagens_dia tecela_mensagens_dia_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tecela_mensagens_dia
    ADD CONSTRAINT tecela_mensagens_dia_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: tecela_registros_campo tecela_registros_campo_autor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tecela_registros_campo
    ADD CONSTRAINT tecela_registros_campo_autor_id_fkey FOREIGN KEY (autor_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: tecela_ressonancias tecela_ressonancias_registro_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tecela_ressonancias
    ADD CONSTRAINT tecela_ressonancias_registro_id_fkey FOREIGN KEY (registro_id) REFERENCES public.tecela_registros_campo(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK tecela_favoritos_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK tecela_favoritos_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK tecela_favoritos_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tecela_ressonancias_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tecela_ressonancias') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tecela_casos_espelho') 
                OR 'tecela_casos_espelho' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.tecela_ressonancias ADD CONSTRAINT tecela_ressonancias_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: tecela_supervisoes tecela_supervisoes_caso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tecela_supervisoes
    ADD CONSTRAINT tecela_supervisoes_caso_id_fkey FOREIGN KEY (caso_id) REFERENCES public.tecela_casos_espelho(id) ;
                RAISE NOTICE 'Created FK tecela_ressonancias_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK tecela_ressonancias_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK tecela_ressonancias_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tecela_supervisoes_created_by_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tecela_supervisoes') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'city_districts') 
                OR 'city_districts' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.tecela_supervisoes ADD CONSTRAINT tecela_supervisoes_created_by_fkey 
                FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: tecela_tramas tecela_tramas_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tecela_tramas
    ADD CONSTRAINT tecela_tramas_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: therapeutic_groups therapeutic_groups_therapist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.therapeutic_groups
    ADD CONSTRAINT therapeutic_groups_therapist_id_fkey FOREIGN KEY (therapist_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: tool_districts tool_districts_district_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tool_districts
    ADD CONSTRAINT tool_districts_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.city_districts(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK tecela_supervisoes_created_by_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK tecela_supervisoes_created_by_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK tecela_supervisoes_created_by_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tool_districts_tool_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tool_districts') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
                OR 'tools' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.tool_districts ADD CONSTRAINT tool_districts_tool_id_fkey 
                FOREIGN KEY (tool_id) REFERENCES public.tools(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK tool_districts_tool_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK tool_districts_tool_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK tool_districts_tool_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tools_district_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') 
                OR 'districts' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.tools ADD CONSTRAINT tools_district_id_fkey 
                FOREIGN KEY (district_id) REFERENCES public.districts(id) ;
                RAISE NOTICE 'Created FK tools_district_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK tools_district_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK tools_district_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tools_ferramenta_pai_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
                OR 'tools' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.tools ADD CONSTRAINT tools_ferramenta_pai_id_fkey 
                FOREIGN KEY (ferramenta_pai_id) REFERENCES public.tools(id) ;
                RAISE NOTICE 'Created FK tools_ferramenta_pai_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK tools_ferramenta_pai_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK tools_ferramenta_pai_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tools_proximo_passo_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
                OR 'tools' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.tools ADD CONSTRAINT tools_proximo_passo_id_fkey 
                FOREIGN KEY (proximo_passo_id) REFERENCES public.tools(id) ;
                RAISE NOTICE 'Created FK tools_proximo_passo_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK tools_proximo_passo_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK tools_proximo_passo_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'torre_arquetipo_sugestao_arquetipo_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'torre_arquetipo_sugestao') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_femininos') 
                OR 'atlas_arquetipos_femininos' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.torre_arquetipo_sugestao ADD CONSTRAINT torre_arquetipo_sugestao_arquetipo_id_fkey 
                FOREIGN KEY (arquetipo_id) REFERENCES public.atlas_arquetipos_femininos(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK torre_arquetipo_sugestao_arquetipo_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK torre_arquetipo_sugestao_arquetipo_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK torre_arquetipo_sugestao_arquetipo_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'torre_porta_relacao_porta_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'torre_porta_relacao') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_portas') 
                OR 'labirinto_portas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.torre_porta_relacao ADD CONSTRAINT torre_porta_relacao_porta_id_fkey 
                FOREIGN KEY (porta_id) REFERENCES public.labirinto_portas(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK torre_porta_relacao_porta_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK torre_porta_relacao_porta_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK torre_porta_relacao_porta_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'towers_client_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'towers') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                OR 'clientes' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.towers ADD CONSTRAINT towers_client_id_fkey 
                FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK towers_client_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK towers_client_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK towers_client_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'towers_session_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'towers') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
                OR 'sessions' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.towers ADD CONSTRAINT towers_session_id_fkey 
                FOREIGN KEY (session_id) REFERENCES public.sessions(id) ;
                RAISE NOTICE 'Created FK towers_session_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK towers_session_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK towers_session_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_comentarios_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_comentarios') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
                OR 'profiles' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.travessia_comentarios ADD CONSTRAINT travessia_comentarios_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK travessia_comentarios_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK travessia_comentarios_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK travessia_comentarios_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_day_unlocks_aula_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_day_unlocks') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_aulas') 
                OR 'conteudo_aulas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.travessia_day_unlocks ADD CONSTRAINT travessia_day_unlocks_aula_id_fkey 
                FOREIGN KEY (aula_id) REFERENCES public.conteudo_aulas(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK travessia_day_unlocks_aula_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK travessia_day_unlocks_aula_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK travessia_day_unlocks_aula_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_day_unlocks_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_day_unlocks') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_familias') 
                OR 'travessia_familias' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.travessia_day_unlocks ADD CONSTRAINT travessia_day_unlocks_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: travessia_library_items travessia_library_items_familia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travessia_library_items
    ADD CONSTRAINT travessia_library_items_familia_id_fkey FOREIGN KEY (familia_id) REFERENCES public.travessia_familias(id) ;
                RAISE NOTICE 'Created FK travessia_day_unlocks_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK travessia_day_unlocks_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK travessia_day_unlocks_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_library_media_item_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_library_media') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_library_items') 
                OR 'travessia_library_items' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.travessia_library_media ADD CONSTRAINT travessia_library_media_item_id_fkey 
                FOREIGN KEY (item_id) REFERENCES public.travessia_library_items(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK travessia_library_media_item_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK travessia_library_media_item_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK travessia_library_media_item_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_library_tags_item_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_library_tags') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_library_items') 
                OR 'travessia_library_items' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.travessia_library_tags ADD CONSTRAINT travessia_library_tags_item_id_fkey 
                FOREIGN KEY (item_id) REFERENCES public.travessia_library_items(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK travessia_library_tags_item_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK travessia_library_tags_item_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK travessia_library_tags_item_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'treinamento_respostas_caso_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'treinamento_respostas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'treinamento_casos_simulados') 
                OR 'treinamento_casos_simulados' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.treinamento_respostas ADD CONSTRAINT treinamento_respostas_caso_id_fkey 
                FOREIGN KEY (caso_id) REFERENCES public.treinamento_casos_simulados(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK treinamento_respostas_caso_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK treinamento_respostas_caso_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK treinamento_respostas_caso_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'treinamento_respostas_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'treinamento_respostas') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'upsell_rules') 
                OR 'upsell_rules' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.treinamento_respostas ADD CONSTRAINT treinamento_respostas_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: upsell_opportunities upsell_opportunities_rule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.upsell_opportunities
    ADD CONSTRAINT upsell_opportunities_rule_id_fkey FOREIGN KEY (rule_id) REFERENCES public.upsell_rules(id) ;
                RAISE NOTICE 'Created FK treinamento_respostas_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK treinamento_respostas_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK treinamento_respostas_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'upsell_opportunities_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'upsell_opportunities') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_aulas') 
                OR 'conteudo_aulas' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.upsell_opportunities ADD CONSTRAINT upsell_opportunities_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_aula_progress user_aula_progress_aula_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_aula_progress
    ADD CONSTRAINT user_aula_progress_aula_id_fkey FOREIGN KEY (aula_id) REFERENCES public.conteudo_aulas(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK upsell_opportunities_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK upsell_opportunities_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK upsell_opportunities_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_cidadela_estado_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_cidadela_estado') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
                OR 'profiles' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.user_cidadela_estado ADD CONSTRAINT user_cidadela_estado_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK user_cidadela_estado_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK user_cidadela_estado_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK user_cidadela_estado_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_favorites_library_item_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_favorites') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'library_items') 
                OR 'library_items' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.user_favorites ADD CONSTRAINT user_favorites_library_item_id_fkey 
                FOREIGN KEY (library_item_id) REFERENCES public.library_items(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK user_favorites_library_item_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK user_favorites_library_item_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK user_favorites_library_item_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_favorites_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_favorites') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lessons') 
                OR 'lessons' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.user_favorites ADD CONSTRAINT user_favorites_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_journey_stats user_journey_stats_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_journey_stats
    ADD CONSTRAINT user_journey_stats_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_progress user_progress_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK user_favorites_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK user_favorites_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK user_favorites_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;

DO $fk$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_progress_user_id_fkey') THEN
        -- Check if tables exist
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_progress') 
           AND (EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'symbolic_rewards') 
                OR 'symbolic_rewards' = 'users') THEN
            
            BEGIN
                ALTER TABLE public.user_progress ADD CONSTRAINT user_progress_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_road_nodes user_road_nodes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_road_nodes
    ADD CONSTRAINT user_road_nodes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_unlocked_rewards user_unlocked_rewards_reward_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_unlocked_rewards
    ADD CONSTRAINT user_unlocked_rewards_reward_id_fkey FOREIGN KEY (reward_id) REFERENCES public.symbolic_rewards(id) ON DELETE CASCADE;
                RAISE NOTICE 'Created FK user_progress_user_id_fkey';
            EXCEPTION WHEN OTHERS THEN
                RAISE NOTICE 'Could not create FK user_progress_user_id_fkey: %', SQLERRM;
            END;
        ELSE
            RAISE NOTICE 'Skipping FK user_progress_user_id_fkey: Table(s) not found';
        END IF;
    END IF;
END $fk$;
