
DO $$
DECLARE
    f RECORD;
    missing_count INT := 0;
    found_count INT := 0;
BEGIN
    CREATE TEMP TABLE IF NOT EXISTS fk_audit (
        constraint_name TEXT,
        source_table TEXT,
        target_table TEXT,
        exists BOOLEAN,
        sql_to_create TEXT
    );

    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'academy_progress_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('academy_progress_user_id_fkey', 'academy_progress', 'profiles', TRUE, 'ALTER TABLE public.academy_progress ADD CONSTRAINT academy_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: access_expiration_logs access_expiration_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_expiration_logs
    ADD CONSTRAINT access_expiration_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('academy_progress_user_id_fkey', 'academy_progress', 'profiles', FALSE, 'ALTER TABLE public.academy_progress ADD CONSTRAINT academy_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: access_expiration_logs access_expiration_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_expiration_logs
    ADD CONSTRAINT access_expiration_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'admin_action_history_sent_by_fkey') THEN
        INSERT INTO fk_audit VALUES ('admin_action_history_sent_by_fkey', 'admin_action_history', 'profiles', TRUE, 'ALTER TABLE public.admin_action_history ADD CONSTRAINT admin_action_history_sent_by_fkey FOREIGN KEY (sent_by) REFERENCES auth.users(id);


--
-- Name: admin_action_history admin_action_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_action_history
    ADD CONSTRAINT admin_action_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('admin_action_history_sent_by_fkey', 'admin_action_history', 'profiles', FALSE, 'ALTER TABLE public.admin_action_history ADD CONSTRAINT admin_action_history_sent_by_fkey FOREIGN KEY (sent_by) REFERENCES auth.users(id);


--
-- Name: admin_action_history admin_action_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_action_history
    ADD CONSTRAINT admin_action_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'admin_automation_audit_admin_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('admin_automation_audit_admin_id_fkey', 'admin_automation_audit', 'admin_automation_rules', TRUE, 'ALTER TABLE public.admin_automation_audit ADD CONSTRAINT admin_automation_audit_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES auth.users(id);


--
-- Name: admin_automation_audit admin_automation_audit_rule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_automation_audit
    ADD CONSTRAINT admin_automation_audit_rule_id_fkey FOREIGN KEY (rule_id) REFERENCES public.admin_automation_rules(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('admin_automation_audit_admin_id_fkey', 'admin_automation_audit', 'admin_automation_rules', FALSE, 'ALTER TABLE public.admin_automation_audit ADD CONSTRAINT admin_automation_audit_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES auth.users(id);


--
-- Name: admin_automation_audit admin_automation_audit_rule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_automation_audit
    ADD CONSTRAINT admin_automation_audit_rule_id_fkey FOREIGN KEY (rule_id) REFERENCES public.admin_automation_rules(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agente_conversas_agente_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('agente_conversas_agente_id_fkey', 'agente_conversas', 'agentes', TRUE, 'ALTER TABLE public.agente_conversas ADD CONSTRAINT agente_conversas_agente_id_fkey FOREIGN KEY (agente_id) REFERENCES public.agentes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('agente_conversas_agente_id_fkey', 'agente_conversas', 'agentes', FALSE, 'ALTER TABLE public.agente_conversas ADD CONSTRAINT agente_conversas_agente_id_fkey FOREIGN KEY (agente_id) REFERENCES public.agentes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agente_conversas_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('agente_conversas_user_id_fkey', 'agente_conversas', 'agente_conversas', TRUE, 'ALTER TABLE public.agente_conversas ADD CONSTRAINT agente_conversas_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: agente_mensagens agente_mensagens_conversa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agente_mensagens
    ADD CONSTRAINT agente_mensagens_conversa_id_fkey FOREIGN KEY (conversa_id) REFERENCES public.agente_conversas(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('agente_conversas_user_id_fkey', 'agente_conversas', 'agente_conversas', FALSE, 'ALTER TABLE public.agente_conversas ADD CONSTRAINT agente_conversas_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: agente_mensagens agente_mensagens_conversa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agente_mensagens
    ADD CONSTRAINT agente_mensagens_conversa_id_fkey FOREIGN KEY (conversa_id) REFERENCES public.agente_conversas(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_interaction_logs_agente_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('ai_interaction_logs_agente_id_fkey', 'ai_interaction_logs', 'agentes', TRUE, 'ALTER TABLE public.ai_interaction_logs ADD CONSTRAINT ai_interaction_logs_agente_id_fkey FOREIGN KEY (agente_id) REFERENCES public.agentes(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('ai_interaction_logs_agente_id_fkey', 'ai_interaction_logs', 'agentes', FALSE, 'ALTER TABLE public.ai_interaction_logs ADD CONSTRAINT ai_interaction_logs_agente_id_fkey FOREIGN KEY (agente_id) REFERENCES public.agentes(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('ai_recommendations_client_id_fkey', 'ai_recommendations', 'clientes', TRUE, 'ALTER TABLE public.ai_recommendations ADD CONSTRAINT ai_recommendations_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('ai_recommendations_client_id_fkey', 'ai_recommendations', 'clientes', FALSE, 'ALTER TABLE public.ai_recommendations ADD CONSTRAINT ai_recommendations_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_distrito_sugerido_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('ai_recommendations_distrito_sugerido_id_fkey', 'ai_recommendations', 'city_districts', TRUE, 'ALTER TABLE public.ai_recommendations ADD CONSTRAINT ai_recommendations_distrito_sugerido_id_fkey FOREIGN KEY (distrito_sugerido_id) REFERENCES public.city_districts(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('ai_recommendations_distrito_sugerido_id_fkey', 'ai_recommendations', 'city_districts', FALSE, 'ALTER TABLE public.ai_recommendations ADD CONSTRAINT ai_recommendations_distrito_sugerido_id_fkey FOREIGN KEY (distrito_sugerido_id) REFERENCES public.city_districts(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_session_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('ai_recommendations_session_id_fkey', 'ai_recommendations', 'sessions', TRUE, 'ALTER TABLE public.ai_recommendations ADD CONSTRAINT ai_recommendations_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('ai_recommendations_session_id_fkey', 'ai_recommendations', 'sessions', FALSE, 'ALTER TABLE public.ai_recommendations ADD CONSTRAINT ai_recommendations_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_tool_sugerida_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('ai_recommendations_tool_sugerida_id_fkey', 'ai_recommendations', 'tools', TRUE, 'ALTER TABLE public.ai_recommendations ADD CONSTRAINT ai_recommendations_tool_sugerida_id_fkey FOREIGN KEY (tool_sugerida_id) REFERENCES public.tools(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('ai_recommendations_tool_sugerida_id_fkey', 'ai_recommendations', 'tools', FALSE, 'ALTER TABLE public.ai_recommendations ADD CONSTRAINT ai_recommendations_tool_sugerida_id_fkey FOREIGN KEY (tool_sugerida_id) REFERENCES public.tools(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'archetypal_profile_snapshots_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('archetypal_profile_snapshots_client_id_fkey', 'archetypal_profile_snapshots', 'clientes', TRUE, 'ALTER TABLE public.archetypal_profile_snapshots ADD CONSTRAINT archetypal_profile_snapshots_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('archetypal_profile_snapshots_client_id_fkey', 'archetypal_profile_snapshots', 'clientes', FALSE, 'ALTER TABLE public.archetypal_profile_snapshots ADD CONSTRAINT archetypal_profile_snapshots_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'archetype_tools_archetype_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('archetype_tools_archetype_id_fkey', 'archetype_tools', 'founding_archetypes', TRUE, 'ALTER TABLE public.archetype_tools ADD CONSTRAINT archetype_tools_archetype_id_fkey FOREIGN KEY (archetype_id) REFERENCES public.founding_archetypes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('archetype_tools_archetype_id_fkey', 'archetype_tools', 'founding_archetypes', FALSE, 'ALTER TABLE public.archetype_tools ADD CONSTRAINT archetype_tools_archetype_id_fkey FOREIGN KEY (archetype_id) REFERENCES public.founding_archetypes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'archetype_tools_tool_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('archetype_tools_tool_id_fkey', 'archetype_tools', 'tools', TRUE, 'ALTER TABLE public.archetype_tools ADD CONSTRAINT archetype_tools_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES public.tools(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('archetype_tools_tool_id_fkey', 'archetype_tools', 'tools', FALSE, 'ALTER TABLE public.archetype_tools ADD CONSTRAINT archetype_tools_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES public.tools(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'atelie_conteudos_created_by_fkey') THEN
        INSERT INTO fk_audit VALUES ('atelie_conteudos_created_by_fkey', 'atelie_conteudos', 'atelie_templates', TRUE, 'ALTER TABLE public.atelie_conteudos ADD CONSTRAINT atelie_conteudos_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: atelie_conteudos atelie_conteudos_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.atelie_conteudos
    ADD CONSTRAINT atelie_conteudos_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.atelie_templates(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('atelie_conteudos_created_by_fkey', 'atelie_conteudos', 'atelie_templates', FALSE, 'ALTER TABLE public.atelie_conteudos ADD CONSTRAINT atelie_conteudos_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: atelie_conteudos atelie_conteudos_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.atelie_conteudos
    ADD CONSTRAINT atelie_conteudos_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.atelie_templates(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'atlas_arquetipos_registros_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('atlas_arquetipos_registros_client_id_fkey', 'atlas_arquetipos_registros', 'clientes', TRUE, 'ALTER TABLE public.atlas_arquetipos_registros ADD CONSTRAINT atlas_arquetipos_registros_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('atlas_arquetipos_registros_client_id_fkey', 'atlas_arquetipos_registros', 'clientes', FALSE, 'ALTER TABLE public.atlas_arquetipos_registros ADD CONSTRAINT atlas_arquetipos_registros_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'aulas_created_by_fkey') THEN
        INSERT INTO fk_audit VALUES ('aulas_created_by_fkey', 'aulas', 'portais', TRUE, 'ALTER TABLE public.aulas ADD CONSTRAINT aulas_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: aulas aulas_portal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.aulas
    ADD CONSTRAINT aulas_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.portais(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('aulas_created_by_fkey', 'aulas', 'portais', FALSE, 'ALTER TABLE public.aulas ADD CONSTRAINT aulas_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: aulas aulas_portal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.aulas
    ADD CONSTRAINT aulas_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.portais(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'auto_mapeamento_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('auto_mapeamento_user_id_fkey', 'auto_mapeamento', 'labirinto_portas', TRUE, 'ALTER TABLE public.auto_mapeamento ADD CONSTRAINT auto_mapeamento_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: automation_settings automation_settings_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.automation_settings
    ADD CONSTRAINT automation_settings_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: biblioteca_casos biblioteca_casos_porta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.biblioteca_casos
    ADD CONSTRAINT biblioteca_casos_porta_id_fkey FOREIGN KEY (porta_id) REFERENCES public.labirinto_portas(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('auto_mapeamento_user_id_fkey', 'auto_mapeamento', 'labirinto_portas', FALSE, 'ALTER TABLE public.auto_mapeamento ADD CONSTRAINT auto_mapeamento_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: automation_settings automation_settings_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.automation_settings
    ADD CONSTRAINT automation_settings_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: biblioteca_casos biblioteca_casos_porta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.biblioteca_casos
    ADD CONSTRAINT biblioteca_casos_porta_id_fkey FOREIGN KEY (porta_id) REFERENCES public.labirinto_portas(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_funcional_perguntas_dimensao_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('big5_funcional_perguntas_dimensao_id_fkey', 'big5_funcional_perguntas', 'big5_funcional_dimensoes', TRUE, 'ALTER TABLE public.big5_funcional_perguntas ADD CONSTRAINT big5_funcional_perguntas_dimensao_id_fkey FOREIGN KEY (dimensao_id) REFERENCES public.big5_funcional_dimensoes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('big5_funcional_perguntas_dimensao_id_fkey', 'big5_funcional_perguntas', 'big5_funcional_dimensoes', FALSE, 'ALTER TABLE public.big5_funcional_perguntas ADD CONSTRAINT big5_funcional_perguntas_dimensao_id_fkey FOREIGN KEY (dimensao_id) REFERENCES public.big5_funcional_dimensoes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_oracular_perguntas_fator_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('big5_oracular_perguntas_fator_id_fkey', 'big5_oracular_perguntas', 'big5_oracular_fatores', TRUE, 'ALTER TABLE public.big5_oracular_perguntas ADD CONSTRAINT big5_oracular_perguntas_fator_id_fkey FOREIGN KEY (fator_id) REFERENCES public.big5_oracular_fatores(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('big5_oracular_perguntas_fator_id_fkey', 'big5_oracular_perguntas', 'big5_oracular_fatores', FALSE, 'ALTER TABLE public.big5_oracular_perguntas ADD CONSTRAINT big5_oracular_perguntas_fator_id_fkey FOREIGN KEY (fator_id) REFERENCES public.big5_oracular_fatores(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_porta_mapeamento_ritual_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('big5_porta_mapeamento_ritual_id_fkey', 'big5_porta_mapeamento', 'rituais_simbolicos', TRUE, 'ALTER TABLE public.big5_porta_mapeamento ADD CONSTRAINT big5_porta_mapeamento_ritual_id_fkey FOREIGN KEY (ritual_id) REFERENCES public.rituais_simbolicos(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('big5_porta_mapeamento_ritual_id_fkey', 'big5_porta_mapeamento', 'rituais_simbolicos', FALSE, 'ALTER TABLE public.big5_porta_mapeamento ADD CONSTRAINT big5_porta_mapeamento_ritual_id_fkey FOREIGN KEY (ritual_id) REFERENCES public.rituais_simbolicos(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_registros_cliente_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('big5_registros_cliente_id_fkey', 'big5_registros', 'big5_oracular_registros', TRUE, 'ALTER TABLE public.big5_registros ADD CONSTRAINT big5_registros_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES auth.users(id) ON DELETE SET NULL;


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
    ADD CONSTRAINT big5_ritual_registros_big5_registro_id_fkey FOREIGN KEY (big5_registro_id) REFERENCES public.big5_oracular_registros(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('big5_registros_cliente_id_fkey', 'big5_registros', 'big5_oracular_registros', FALSE, 'ALTER TABLE public.big5_registros ADD CONSTRAINT big5_registros_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES auth.users(id) ON DELETE SET NULL;


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
    ADD CONSTRAINT big5_ritual_registros_big5_registro_id_fkey FOREIGN KEY (big5_registro_id) REFERENCES public.big5_oracular_registros(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_ritual_registros_ritual_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('big5_ritual_registros_ritual_id_fkey', 'big5_ritual_registros', 'rituais_simbolicos', TRUE, 'ALTER TABLE public.big5_ritual_registros ADD CONSTRAINT big5_ritual_registros_ritual_id_fkey FOREIGN KEY (ritual_id) REFERENCES public.rituais_simbolicos(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('big5_ritual_registros_ritual_id_fkey', 'big5_ritual_registros', 'rituais_simbolicos', FALSE, 'ALTER TABLE public.big5_ritual_registros ADD CONSTRAINT big5_ritual_registros_ritual_id_fkey FOREIGN KEY (ritual_id) REFERENCES public.rituais_simbolicos(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_symbolic_afirmacoes_force_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('big5_symbolic_afirmacoes_force_id_fkey', 'big5_symbolic_afirmacoes', 'big5_symbolic_forces', TRUE, 'ALTER TABLE public.big5_symbolic_afirmacoes ADD CONSTRAINT big5_symbolic_afirmacoes_force_id_fkey FOREIGN KEY (force_id) REFERENCES public.big5_symbolic_forces(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('big5_symbolic_afirmacoes_force_id_fkey', 'big5_symbolic_afirmacoes', 'big5_symbolic_forces', FALSE, 'ALTER TABLE public.big5_symbolic_afirmacoes ADD CONSTRAINT big5_symbolic_afirmacoes_force_id_fkey FOREIGN KEY (force_id) REFERENCES public.big5_symbolic_forces(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_symbolic_registros_session_case_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('big5_symbolic_registros_session_case_id_fkey', 'big5_symbolic_registros', 'session_cases', TRUE, 'ALTER TABLE public.big5_symbolic_registros ADD CONSTRAINT big5_symbolic_registros_session_case_id_fkey FOREIGN KEY (session_case_id) REFERENCES public.session_cases(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('big5_symbolic_registros_session_case_id_fkey', 'big5_symbolic_registros', 'session_cases', FALSE, 'ALTER TABLE public.big5_symbolic_registros ADD CONSTRAINT big5_symbolic_registros_session_case_id_fkey FOREIGN KEY (session_case_id) REFERENCES public.session_cases(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_links_from_book_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('book_links_from_book_id_fkey', 'book_links', 'books', TRUE, 'ALTER TABLE public.book_links ADD CONSTRAINT book_links_from_book_id_fkey FOREIGN KEY (from_book_id) REFERENCES public.books(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('book_links_from_book_id_fkey', 'book_links', 'books', FALSE, 'ALTER TABLE public.book_links ADD CONSTRAINT book_links_from_book_id_fkey FOREIGN KEY (from_book_id) REFERENCES public.books(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_links_to_book_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('book_links_to_book_id_fkey', 'book_links', 'books', TRUE, 'ALTER TABLE public.book_links ADD CONSTRAINT book_links_to_book_id_fkey FOREIGN KEY (to_book_id) REFERENCES public.books(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('book_links_to_book_id_fkey', 'book_links', 'books', FALSE, 'ALTER TABLE public.book_links ADD CONSTRAINT book_links_to_book_id_fkey FOREIGN KEY (to_book_id) REFERENCES public.books(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_media_station_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('book_media_station_id_fkey', 'book_media', 'clube_estacoes', TRUE, 'ALTER TABLE public.book_media ADD CONSTRAINT book_media_station_id_fkey FOREIGN KEY (station_id) REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('book_media_station_id_fkey', 'book_media', 'clube_estacoes', FALSE, 'ALTER TABLE public.book_media ADD CONSTRAINT book_media_station_id_fkey FOREIGN KEY (station_id) REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_tours_book_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('book_tours_book_id_fkey', 'book_tours', 'books', TRUE, 'ALTER TABLE public.book_tours ADD CONSTRAINT book_tours_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('book_tours_book_id_fkey', 'book_tours', 'books', FALSE, 'ALTER TABLE public.book_tours ADD CONSTRAINT book_tours_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'canteiro_reactions_entry_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('canteiro_reactions_entry_id_fkey', 'canteiro_reactions', 'collective_bed_entries', TRUE, 'ALTER TABLE public.canteiro_reactions ADD CONSTRAINT canteiro_reactions_entry_id_fkey FOREIGN KEY (entry_id) REFERENCES public.collective_bed_entries(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('canteiro_reactions_entry_id_fkey', 'canteiro_reactions', 'collective_bed_entries', FALSE, 'ALTER TABLE public.canteiro_reactions ADD CONSTRAINT canteiro_reactions_entry_id_fkey FOREIGN KEY (entry_id) REFERENCES public.collective_bed_entries(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartografia_complexos_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('cartografia_complexos_client_id_fkey', 'cartografia_complexos', 'clientes', TRUE, 'ALTER TABLE public.cartografia_complexos ADD CONSTRAINT cartografia_complexos_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('cartografia_complexos_client_id_fkey', 'cartografia_complexos', 'clientes', FALSE, 'ALTER TABLE public.cartografia_complexos ADD CONSTRAINT cartografia_complexos_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartografia_psiquica_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('cartografia_psiquica_client_id_fkey', 'cartografia_psiquica', 'clientes', TRUE, 'ALTER TABLE public.cartografia_psiquica ADD CONSTRAINT cartografia_psiquica_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('cartografia_psiquica_client_id_fkey', 'cartografia_psiquica', 'clientes', FALSE, 'ALTER TABLE public.cartografia_psiquica ADD CONSTRAINT cartografia_psiquica_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_engine_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('cartographer_engine_client_id_fkey', 'cartographer_engine', 'clientes', TRUE, 'ALTER TABLE public.cartographer_engine ADD CONSTRAINT cartographer_engine_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('cartographer_engine_client_id_fkey', 'cartographer_engine', 'clientes', FALSE, 'ALTER TABLE public.cartographer_engine ADD CONSTRAINT cartographer_engine_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_engine_session_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('cartographer_engine_session_id_fkey', 'cartographer_engine', 'sessions', TRUE, 'ALTER TABLE public.cartographer_engine ADD CONSTRAINT cartographer_engine_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('cartographer_engine_session_id_fkey', 'cartographer_engine', 'sessions', FALSE, 'ALTER TABLE public.cartographer_engine ADD CONSTRAINT cartographer_engine_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_recommendations_engine_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('cartographer_recommendations_engine_id_fkey', 'cartographer_recommendations', 'cartographer_engine', TRUE, 'ALTER TABLE public.cartographer_recommendations ADD CONSTRAINT cartographer_recommendations_engine_id_fkey FOREIGN KEY (engine_id) REFERENCES public.cartographer_engine(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('cartographer_recommendations_engine_id_fkey', 'cartographer_recommendations', 'cartographer_engine', FALSE, 'ALTER TABLE public.cartographer_recommendations ADD CONSTRAINT cartographer_recommendations_engine_id_fkey FOREIGN KEY (engine_id) REFERENCES public.cartographer_engine(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_recommendations_ferramenta_escolhida_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('cartographer_recommendations_ferramenta_escolhida_id_fkey', 'cartographer_recommendations', 'tools', TRUE, 'ALTER TABLE public.cartographer_recommendations ADD CONSTRAINT cartographer_recommendations_ferramenta_escolhida_id_fkey FOREIGN KEY (ferramenta_escolhida_id) REFERENCES public.tools(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('cartographer_recommendations_ferramenta_escolhida_id_fkey', 'cartographer_recommendations', 'tools', FALSE, 'ALTER TABLE public.cartographer_recommendations ADD CONSTRAINT cartographer_recommendations_ferramenta_escolhida_id_fkey FOREIGN KEY (ferramenta_escolhida_id) REFERENCES public.tools(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_recommendations_tool_complementar_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('cartographer_recommendations_tool_complementar_id_fkey', 'cartographer_recommendations', 'tools', TRUE, 'ALTER TABLE public.cartographer_recommendations ADD CONSTRAINT cartographer_recommendations_tool_complementar_id_fkey FOREIGN KEY (tool_complementar_id) REFERENCES public.tools(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('cartographer_recommendations_tool_complementar_id_fkey', 'cartographer_recommendations', 'tools', FALSE, 'ALTER TABLE public.cartographer_recommendations ADD CONSTRAINT cartographer_recommendations_tool_complementar_id_fkey FOREIGN KEY (tool_complementar_id) REFERENCES public.tools(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_recommendations_tool_principal_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('cartographer_recommendations_tool_principal_id_fkey', 'cartographer_recommendations', 'tools', TRUE, 'ALTER TABLE public.cartographer_recommendations ADD CONSTRAINT cartographer_recommendations_tool_principal_id_fkey FOREIGN KEY (tool_principal_id) REFERENCES public.tools(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('cartographer_recommendations_tool_principal_id_fkey', 'cartographer_recommendations', 'tools', FALSE, 'ALTER TABLE public.cartographer_recommendations ADD CONSTRAINT cartographer_recommendations_tool_principal_id_fkey FOREIGN KEY (tool_principal_id) REFERENCES public.tools(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographies_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('cartographies_client_id_fkey', 'cartographies', 'clientes', TRUE, 'ALTER TABLE public.cartographies ADD CONSTRAINT cartographies_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('cartographies_client_id_fkey', 'cartographies', 'clientes', FALSE, 'ALTER TABLE public.cartographies ADD CONSTRAINT cartographies_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographies_session_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('cartographies_session_id_fkey', 'cartographies', 'sessions', TRUE, 'ALTER TABLE public.cartographies ADD CONSTRAINT cartographies_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('cartographies_session_id_fkey', 'cartographies', 'sessions', FALSE, 'ALTER TABLE public.cartographies ADD CONSTRAINT cartographies_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'casa_circulo_replies_autor_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('casa_circulo_replies_autor_id_fkey', 'casa_circulo_replies', 'casa_circulo_threads', TRUE, 'ALTER TABLE public.casa_circulo_replies ADD CONSTRAINT casa_circulo_replies_autor_id_fkey FOREIGN KEY (autor_id) REFERENCES auth.users(id);


--
-- Name: casa_circulo_replies casa_circulo_replies_thread_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.casa_circulo_replies
    ADD CONSTRAINT casa_circulo_replies_thread_id_fkey FOREIGN KEY (thread_id) REFERENCES public.casa_circulo_threads(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('casa_circulo_replies_autor_id_fkey', 'casa_circulo_replies', 'casa_circulo_threads', FALSE, 'ALTER TABLE public.casa_circulo_replies ADD CONSTRAINT casa_circulo_replies_autor_id_fkey FOREIGN KEY (autor_id) REFERENCES auth.users(id);


--
-- Name: casa_circulo_replies casa_circulo_replies_thread_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.casa_circulo_replies
    ADD CONSTRAINT casa_circulo_replies_thread_id_fkey FOREIGN KEY (thread_id) REFERENCES public.casa_circulo_threads(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'casa_circulo_threads_autor_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('casa_circulo_threads_autor_id_fkey', 'casa_circulo_threads', 'districts', TRUE, 'ALTER TABLE public.casa_circulo_threads ADD CONSTRAINT casa_circulo_threads_autor_id_fkey FOREIGN KEY (autor_id) REFERENCES auth.users(id);


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
    ADD CONSTRAINT cidadela_oracle_cards_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.districts(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('casa_circulo_threads_autor_id_fkey', 'casa_circulo_threads', 'districts', FALSE, 'ALTER TABLE public.casa_circulo_threads ADD CONSTRAINT casa_circulo_threads_autor_id_fkey FOREIGN KEY (autor_id) REFERENCES auth.users(id);


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
    ADD CONSTRAINT cidadela_oracle_cards_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.districts(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cidadela_oracle_cards_suggested_tool_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('cidadela_oracle_cards_suggested_tool_id_fkey', 'cidadela_oracle_cards', 'tools', TRUE, 'ALTER TABLE public.cidadela_oracle_cards ADD CONSTRAINT cidadela_oracle_cards_suggested_tool_id_fkey FOREIGN KEY (suggested_tool_id) REFERENCES public.tools(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('cidadela_oracle_cards_suggested_tool_id_fkey', 'cidadela_oracle_cards', 'tools', FALSE, 'ALTER TABLE public.cidadela_oracle_cards ADD CONSTRAINT cidadela_oracle_cards_suggested_tool_id_fkey FOREIGN KEY (suggested_tool_id) REFERENCES public.tools(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cidadela_oracle_usage_card_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('cidadela_oracle_usage_card_id_fkey', 'cidadela_oracle_usage', 'cidadela_oracle_cards', TRUE, 'ALTER TABLE public.cidadela_oracle_usage ADD CONSTRAINT cidadela_oracle_usage_card_id_fkey FOREIGN KEY (card_id) REFERENCES public.cidadela_oracle_cards(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('cidadela_oracle_usage_card_id_fkey', 'cidadela_oracle_usage', 'cidadela_oracle_cards', FALSE, 'ALTER TABLE public.cidadela_oracle_usage ADD CONSTRAINT cidadela_oracle_usage_card_id_fkey FOREIGN KEY (card_id) REFERENCES public.cidadela_oracle_cards(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cidadela_oracle_usage_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('cidadela_oracle_usage_client_id_fkey', 'cidadela_oracle_usage', 'clientes', TRUE, 'ALTER TABLE public.cidadela_oracle_usage ADD CONSTRAINT cidadela_oracle_usage_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('cidadela_oracle_usage_client_id_fkey', 'cidadela_oracle_usage', 'clientes', FALSE, 'ALTER TABLE public.cidadela_oracle_usage ADD CONSTRAINT cidadela_oracle_usage_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'circulo_oracular_registros_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('circulo_oracular_registros_user_id_fkey', 'circulo_oracular_registros', 'founding_archetypes', TRUE, 'ALTER TABLE public.circulo_oracular_registros ADD CONSTRAINT circulo_oracular_registros_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: client_archetype_state client_archetype_state_arquitipo_evolucao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_archetype_state
    ADD CONSTRAINT client_archetype_state_arquitipo_evolucao_id_fkey FOREIGN KEY (arquitipo_evolucao_id) REFERENCES public.founding_archetypes(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('circulo_oracular_registros_user_id_fkey', 'circulo_oracular_registros', 'founding_archetypes', FALSE, 'ALTER TABLE public.circulo_oracular_registros ADD CONSTRAINT circulo_oracular_registros_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: client_archetype_state client_archetype_state_arquitipo_evolucao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_archetype_state
    ADD CONSTRAINT client_archetype_state_arquitipo_evolucao_id_fkey FOREIGN KEY (arquitipo_evolucao_id) REFERENCES public.founding_archetypes(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_archetype_state_arquitipo_regente_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('client_archetype_state_arquitipo_regente_id_fkey', 'client_archetype_state', 'founding_archetypes', TRUE, 'ALTER TABLE public.client_archetype_state ADD CONSTRAINT client_archetype_state_arquitipo_regente_id_fkey FOREIGN KEY (arquitipo_regente_id) REFERENCES public.founding_archetypes(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('client_archetype_state_arquitipo_regente_id_fkey', 'client_archetype_state', 'founding_archetypes', FALSE, 'ALTER TABLE public.client_archetype_state ADD CONSTRAINT client_archetype_state_arquitipo_regente_id_fkey FOREIGN KEY (arquitipo_regente_id) REFERENCES public.founding_archetypes(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_archetype_state_arquitipo_sombra_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('client_archetype_state_arquitipo_sombra_id_fkey', 'client_archetype_state', 'founding_archetypes', TRUE, 'ALTER TABLE public.client_archetype_state ADD CONSTRAINT client_archetype_state_arquitipo_sombra_id_fkey FOREIGN KEY (arquitipo_sombra_id) REFERENCES public.founding_archetypes(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('client_archetype_state_arquitipo_sombra_id_fkey', 'client_archetype_state', 'founding_archetypes', FALSE, 'ALTER TABLE public.client_archetype_state ADD CONSTRAINT client_archetype_state_arquitipo_sombra_id_fkey FOREIGN KEY (arquitipo_sombra_id) REFERENCES public.founding_archetypes(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_archetype_state_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('client_archetype_state_client_id_fkey', 'client_archetype_state', 'clientes', TRUE, 'ALTER TABLE public.client_archetype_state ADD CONSTRAINT client_archetype_state_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('client_archetype_state_client_id_fkey', 'client_archetype_state', 'clientes', FALSE, 'ALTER TABLE public.client_archetype_state ADD CONSTRAINT client_archetype_state_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_cidadela_map_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('client_cidadela_map_client_id_fkey', 'client_cidadela_map', 'clientes', TRUE, 'ALTER TABLE public.client_cidadela_map ADD CONSTRAINT client_cidadela_map_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('client_cidadela_map_client_id_fkey', 'client_cidadela_map', 'clientes', FALSE, 'ALTER TABLE public.client_cidadela_map ADD CONSTRAINT client_cidadela_map_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_arquetipo_ativo_fkey') THEN
        INSERT INTO fk_audit VALUES ('client_city_state_arquetipo_ativo_fkey', 'client_city_state', 'founding_archetypes', TRUE, 'ALTER TABLE public.client_city_state ADD CONSTRAINT client_city_state_arquetipo_ativo_fkey FOREIGN KEY (arquetipo_ativo) REFERENCES public.founding_archetypes(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('client_city_state_arquetipo_ativo_fkey', 'client_city_state', 'founding_archetypes', FALSE, 'ALTER TABLE public.client_city_state ADD CONSTRAINT client_city_state_arquetipo_ativo_fkey FOREIGN KEY (arquetipo_ativo) REFERENCES public.founding_archetypes(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('client_city_state_client_id_fkey', 'client_city_state', 'clientes', TRUE, 'ALTER TABLE public.client_city_state ADD CONSTRAINT client_city_state_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('client_city_state_client_id_fkey', 'client_city_state', 'clientes', FALSE, 'ALTER TABLE public.client_city_state ADD CONSTRAINT client_city_state_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_distrito_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('client_city_state_distrito_id_fkey', 'client_city_state', 'city_districts', TRUE, 'ALTER TABLE public.client_city_state ADD CONSTRAINT client_city_state_distrito_id_fkey FOREIGN KEY (distrito_id) REFERENCES public.city_districts(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('client_city_state_distrito_id_fkey', 'client_city_state', 'city_districts', FALSE, 'ALTER TABLE public.client_city_state ADD CONSTRAINT client_city_state_distrito_id_fkey FOREIGN KEY (distrito_id) REFERENCES public.city_districts(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_ultima_ferramenta_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('client_city_state_ultima_ferramenta_id_fkey', 'client_city_state', 'tools', TRUE, 'ALTER TABLE public.client_city_state ADD CONSTRAINT client_city_state_ultima_ferramenta_id_fkey FOREIGN KEY (ultima_ferramenta_id) REFERENCES public.tools(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('client_city_state_ultima_ferramenta_id_fkey', 'client_city_state', 'tools', FALSE, 'ALTER TABLE public.client_city_state ADD CONSTRAINT client_city_state_ultima_ferramenta_id_fkey FOREIGN KEY (ultima_ferramenta_id) REFERENCES public.tools(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_ultima_sessao_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('client_city_state_ultima_sessao_id_fkey', 'client_city_state', 'sessions', TRUE, 'ALTER TABLE public.client_city_state ADD CONSTRAINT client_city_state_ultima_sessao_id_fkey FOREIGN KEY (ultima_sessao_id) REFERENCES public.sessions(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('client_city_state_ultima_sessao_id_fkey', 'client_city_state', 'sessions', FALSE, 'ALTER TABLE public.client_city_state ADD CONSTRAINT client_city_state_ultima_sessao_id_fkey FOREIGN KEY (ultima_sessao_id) REFERENCES public.sessions(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_labyrinths_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('client_labyrinths_client_id_fkey', 'client_labyrinths', 'clientes', TRUE, 'ALTER TABLE public.client_labyrinths ADD CONSTRAINT client_labyrinths_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('client_labyrinths_client_id_fkey', 'client_labyrinths', 'clientes', FALSE, 'ALTER TABLE public.client_labyrinths ADD CONSTRAINT client_labyrinths_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_live_map_entries_session_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('client_live_map_entries_session_id_fkey', 'client_live_map_entries', 'sessions', TRUE, 'ALTER TABLE public.client_live_map_entries ADD CONSTRAINT client_live_map_entries_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('client_live_map_entries_session_id_fkey', 'client_live_map_entries', 'sessions', FALSE, 'ALTER TABLE public.client_live_map_entries ADD CONSTRAINT client_live_map_entries_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_pattern_stats_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('client_pattern_stats_client_id_fkey', 'client_pattern_stats', 'clientes', TRUE, 'ALTER TABLE public.client_pattern_stats ADD CONSTRAINT client_pattern_stats_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('client_pattern_stats_client_id_fkey', 'client_pattern_stats', 'clientes', FALSE, 'ALTER TABLE public.client_pattern_stats ADD CONSTRAINT client_pattern_stats_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_seasons_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('client_seasons_client_id_fkey', 'client_seasons', 'clientes', TRUE, 'ALTER TABLE public.client_seasons ADD CONSTRAINT client_seasons_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('client_seasons_client_id_fkey', 'client_seasons', 'clientes', FALSE, 'ALTER TABLE public.client_seasons ADD CONSTRAINT client_seasons_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clientes_client_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('clientes_client_user_id_fkey', 'clientes', '_deprecated_club_cycles', TRUE, 'ALTER TABLE public.clientes ADD CONSTRAINT clientes_client_user_id_fkey FOREIGN KEY (client_user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


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
    ADD CONSTRAINT club_books_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES public._deprecated_club_cycles(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('clientes_client_user_id_fkey', 'clientes', '_deprecated_club_cycles', FALSE, 'ALTER TABLE public.clientes ADD CONSTRAINT clientes_client_user_id_fkey FOREIGN KEY (client_user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


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
    ADD CONSTRAINT club_books_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES public._deprecated_club_cycles(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'club_knowledge_entries_book_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('club_knowledge_entries_book_id_fkey', '_deprecated_club_knowledge_entries', 'books', TRUE, 'ALTER TABLE public._deprecated_club_knowledge_entries ADD CONSTRAINT club_knowledge_entries_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('club_knowledge_entries_book_id_fkey', '_deprecated_club_knowledge_entries', 'books', FALSE, 'ALTER TABLE public._deprecated_club_knowledge_entries ADD CONSTRAINT club_knowledge_entries_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'club_meetings_cycle_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('club_meetings_cycle_id_fkey', '_deprecated_club_meetings', '_deprecated_club_cycles', TRUE, 'ALTER TABLE public._deprecated_club_meetings ADD CONSTRAINT club_meetings_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES public._deprecated_club_cycles(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('club_meetings_cycle_id_fkey', '_deprecated_club_meetings', '_deprecated_club_cycles', FALSE, 'ALTER TABLE public._deprecated_club_meetings ADD CONSTRAINT club_meetings_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES public._deprecated_club_cycles(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'club_user_cycles_cycle_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('club_user_cycles_cycle_id_fkey', '_deprecated_club_user_cycles', '_deprecated_club_cycles', TRUE, 'ALTER TABLE public._deprecated_club_user_cycles ADD CONSTRAINT club_user_cycles_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES public._deprecated_club_cycles(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('club_user_cycles_cycle_id_fkey', '_deprecated_club_user_cycles', '_deprecated_club_cycles', FALSE, 'ALTER TABLE public._deprecated_club_user_cycles ADD CONSTRAINT club_user_cycles_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES public._deprecated_club_cycles(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_audio_albums_estacao_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('clube_audio_albums_estacao_id_fkey', 'clube_audio_albums', 'clube_estacoes', TRUE, 'ALTER TABLE public.clube_audio_albums ADD CONSTRAINT clube_audio_albums_estacao_id_fkey FOREIGN KEY (estacao_id) REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('clube_audio_albums_estacao_id_fkey', 'clube_audio_albums', 'clube_estacoes', FALSE, 'ALTER TABLE public.clube_audio_albums ADD CONSTRAINT clube_audio_albums_estacao_id_fkey FOREIGN KEY (estacao_id) REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_audio_progress_track_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('clube_audio_progress_track_id_fkey', 'clube_audio_progress', 'clube_audio_tracks', TRUE, 'ALTER TABLE public.clube_audio_progress ADD CONSTRAINT clube_audio_progress_track_id_fkey FOREIGN KEY (track_id) REFERENCES public.clube_audio_tracks(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('clube_audio_progress_track_id_fkey', 'clube_audio_progress', 'clube_audio_tracks', FALSE, 'ALTER TABLE public.clube_audio_progress ADD CONSTRAINT clube_audio_progress_track_id_fkey FOREIGN KEY (track_id) REFERENCES public.clube_audio_tracks(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_audio_tracks_album_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('clube_audio_tracks_album_id_fkey', 'clube_audio_tracks', 'clube_audio_albums', TRUE, 'ALTER TABLE public.clube_audio_tracks ADD CONSTRAINT clube_audio_tracks_album_id_fkey FOREIGN KEY (album_id) REFERENCES public.clube_audio_albums(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('clube_audio_tracks_album_id_fkey', 'clube_audio_tracks', 'clube_audio_albums', FALSE, 'ALTER TABLE public.clube_audio_tracks ADD CONSTRAINT clube_audio_tracks_album_id_fkey FOREIGN KEY (album_id) REFERENCES public.clube_audio_albums(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_carrossel_slides_estacao_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('clube_carrossel_slides_estacao_id_fkey', 'clube_carrossel_slides', 'oracular_seasons', TRUE, 'ALTER TABLE public.clube_carrossel_slides ADD CONSTRAINT clube_carrossel_slides_estacao_id_fkey FOREIGN KEY (estacao_id) REFERENCES public.oracular_seasons(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('clube_carrossel_slides_estacao_id_fkey', 'clube_carrossel_slides', 'oracular_seasons', FALSE, 'ALTER TABLE public.clube_carrossel_slides ADD CONSTRAINT clube_carrossel_slides_estacao_id_fkey FOREIGN KEY (estacao_id) REFERENCES public.oracular_seasons(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_engajamento_estacao_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('clube_engajamento_estacao_id_fkey', 'clube_engajamento', 'clube_estacoes', TRUE, 'ALTER TABLE public.clube_engajamento ADD CONSTRAINT clube_engajamento_estacao_id_fkey FOREIGN KEY (estacao_id) REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('clube_engajamento_estacao_id_fkey', 'clube_engajamento', 'clube_estacoes', FALSE, 'ALTER TABLE public.clube_engajamento ADD CONSTRAINT clube_engajamento_estacao_id_fkey FOREIGN KEY (estacao_id) REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_estacao_registros_estacao_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('clube_estacao_registros_estacao_id_fkey', 'clube_estacao_registros', 'clube_estacoes', TRUE, 'ALTER TABLE public.clube_estacao_registros ADD CONSTRAINT clube_estacao_registros_estacao_id_fkey FOREIGN KEY (estacao_id) REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('clube_estacao_registros_estacao_id_fkey', 'clube_estacao_registros', 'clube_estacoes', FALSE, 'ALTER TABLE public.clube_estacao_registros ADD CONSTRAINT clube_estacao_registros_estacao_id_fkey FOREIGN KEY (estacao_id) REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_estacoes_cartografia_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('clube_estacoes_cartografia_id_fkey', 'clube_estacoes', 'cartographies', TRUE, 'ALTER TABLE public.clube_estacoes ADD CONSTRAINT clube_estacoes_cartografia_id_fkey FOREIGN KEY (cartografia_id) REFERENCES public.cartographies(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('clube_estacoes_cartografia_id_fkey', 'clube_estacoes', 'cartographies', FALSE, 'ALTER TABLE public.clube_estacoes ADD CONSTRAINT clube_estacoes_cartografia_id_fkey FOREIGN KEY (cartografia_id) REFERENCES public.cartographies(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_estacoes_quiz_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('clube_estacoes_quiz_id_fkey', 'clube_estacoes', 'quizzes', TRUE, 'ALTER TABLE public.clube_estacoes ADD CONSTRAINT clube_estacoes_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('clube_estacoes_quiz_id_fkey', 'clube_estacoes', 'quizzes', FALSE, 'ALTER TABLE public.clube_estacoes ADD CONSTRAINT clube_estacoes_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_jornadas_estacao_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('clube_jornadas_estacao_id_fkey', 'clube_jornadas', 'clube_estacoes', TRUE, 'ALTER TABLE public.clube_jornadas ADD CONSTRAINT clube_jornadas_estacao_id_fkey FOREIGN KEY (estacao_id) REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('clube_jornadas_estacao_id_fkey', 'clube_jornadas', 'clube_estacoes', FALSE, 'ALTER TABLE public.clube_jornadas ADD CONSTRAINT clube_jornadas_estacao_id_fkey FOREIGN KEY (estacao_id) REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_livro_aulas_porta_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('clube_livro_aulas_porta_id_fkey', 'clube_livro_aulas', 'clube_livro_portas', TRUE, 'ALTER TABLE public.clube_livro_aulas ADD CONSTRAINT clube_livro_aulas_porta_id_fkey FOREIGN KEY (porta_id) REFERENCES public.clube_livro_portas(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('clube_livro_aulas_porta_id_fkey', 'clube_livro_aulas', 'clube_livro_portas', FALSE, 'ALTER TABLE public.clube_livro_aulas ADD CONSTRAINT clube_livro_aulas_porta_id_fkey FOREIGN KEY (porta_id) REFERENCES public.clube_livro_portas(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_livro_chat_interactions_book_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('clube_livro_chat_interactions_book_id_fkey', 'clube_livro_chat_interactions', 'books', TRUE, 'ALTER TABLE public.clube_livro_chat_interactions ADD CONSTRAINT clube_livro_chat_interactions_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('clube_livro_chat_interactions_book_id_fkey', 'clube_livro_chat_interactions', 'books', FALSE, 'ALTER TABLE public.clube_livro_chat_interactions ADD CONSTRAINT clube_livro_chat_interactions_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_livro_chat_interactions_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('clube_livro_chat_interactions_user_id_fkey', 'clube_livro_chat_interactions', 'clube_estacoes', TRUE, 'ALTER TABLE public.clube_livro_chat_interactions ADD CONSTRAINT clube_livro_chat_interactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: clube_livro_encontros clube_livro_encontros_estacao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clube_livro_encontros
    ADD CONSTRAINT clube_livro_encontros_estacao_id_fkey FOREIGN KEY (estacao_id) REFERENCES public.clube_estacoes(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('clube_livro_chat_interactions_user_id_fkey', 'clube_livro_chat_interactions', 'clube_estacoes', FALSE, 'ALTER TABLE public.clube_livro_chat_interactions ADD CONSTRAINT clube_livro_chat_interactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: clube_livro_encontros clube_livro_encontros_estacao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clube_livro_encontros
    ADD CONSTRAINT clube_livro_encontros_estacao_id_fkey FOREIGN KEY (estacao_id) REFERENCES public.clube_estacoes(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_livro_respostas_pergunta_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('clube_livro_respostas_pergunta_id_fkey', 'clube_livro_respostas', 'clube_livro_perguntas', TRUE, 'ALTER TABLE public.clube_livro_respostas ADD CONSTRAINT clube_livro_respostas_pergunta_id_fkey FOREIGN KEY (pergunta_id) REFERENCES public.clube_livro_perguntas(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('clube_livro_respostas_pergunta_id_fkey', 'clube_livro_respostas', 'clube_livro_perguntas', FALSE, 'ALTER TABLE public.clube_livro_respostas ADD CONSTRAINT clube_livro_respostas_pergunta_id_fkey FOREIGN KEY (pergunta_id) REFERENCES public.clube_livro_perguntas(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_obras_essencia_8020_book_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('clube_obras_essencia_8020_book_id_fkey', 'clube_obras_essencia_8020', 'books', TRUE, 'ALTER TABLE public.clube_obras_essencia_8020 ADD CONSTRAINT clube_obras_essencia_8020_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('clube_obras_essencia_8020_book_id_fkey', 'clube_obras_essencia_8020', 'books', FALSE, 'ALTER TABLE public.clube_obras_essencia_8020 ADD CONSTRAINT clube_obras_essencia_8020_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_portais_jornada_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('clube_portais_jornada_id_fkey', 'clube_portais', 'clube_jornadas', TRUE, 'ALTER TABLE public.clube_portais ADD CONSTRAINT clube_portais_jornada_id_fkey FOREIGN KEY (jornada_id) REFERENCES public.clube_jornadas(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('clube_portais_jornada_id_fkey', 'clube_portais', 'clube_jornadas', FALSE, 'ALTER TABLE public.clube_portais ADD CONSTRAINT clube_portais_jornada_id_fkey FOREIGN KEY (jornada_id) REFERENCES public.clube_jornadas(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_portal_audios_portal_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('clube_portal_audios_portal_id_fkey', 'clube_portal_audios', 'clube_portais', TRUE, 'ALTER TABLE public.clube_portal_audios ADD CONSTRAINT clube_portal_audios_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.clube_portais(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('clube_portal_audios_portal_id_fkey', 'clube_portal_audios', 'clube_portais', FALSE, 'ALTER TABLE public.clube_portal_audios ADD CONSTRAINT clube_portal_audios_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.clube_portais(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_portal_insights_estacao_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('clube_portal_insights_estacao_id_fkey', 'clube_portal_insights', 'oracular_seasons', TRUE, 'ALTER TABLE public.clube_portal_insights ADD CONSTRAINT clube_portal_insights_estacao_id_fkey FOREIGN KEY (estacao_id) REFERENCES public.oracular_seasons(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('clube_portal_insights_estacao_id_fkey', 'clube_portal_insights', 'oracular_seasons', FALSE, 'ALTER TABLE public.clube_portal_insights ADD CONSTRAINT clube_portal_insights_estacao_id_fkey FOREIGN KEY (estacao_id) REFERENCES public.oracular_seasons(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_portal_materiais_portal_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('clube_portal_materiais_portal_id_fkey', 'clube_portal_materiais', 'clube_portais', TRUE, 'ALTER TABLE public.clube_portal_materiais ADD CONSTRAINT clube_portal_materiais_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.clube_portais(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('clube_portal_materiais_portal_id_fkey', 'clube_portal_materiais', 'clube_portais', FALSE, 'ALTER TABLE public.clube_portal_materiais ADD CONSTRAINT clube_portal_materiais_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.clube_portais(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_progresso_passos_passo_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('clube_progresso_passos_passo_id_fkey', 'clube_progresso_passos', 'clube_rota_itens', TRUE, 'ALTER TABLE public.clube_progresso_passos ADD CONSTRAINT clube_progresso_passos_passo_id_fkey FOREIGN KEY (passo_id) REFERENCES public.clube_rota_itens(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('clube_progresso_passos_passo_id_fkey', 'clube_progresso_passos', 'clube_rota_itens', FALSE, 'ALTER TABLE public.clube_progresso_passos ADD CONSTRAINT clube_progresso_passos_passo_id_fkey FOREIGN KEY (passo_id) REFERENCES public.clube_rota_itens(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_progresso_passos_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('clube_progresso_passos_user_id_fkey', 'clube_progresso_passos', 'clube_estacoes', TRUE, 'ALTER TABLE public.clube_progresso_passos ADD CONSTRAINT clube_progresso_passos_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: clube_reflexoes clube_reflexoes_estacao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clube_reflexoes
    ADD CONSTRAINT clube_reflexoes_estacao_id_fkey FOREIGN KEY (estacao_id) REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('clube_progresso_passos_user_id_fkey', 'clube_progresso_passos', 'clube_estacoes', FALSE, 'ALTER TABLE public.clube_progresso_passos ADD CONSTRAINT clube_progresso_passos_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: clube_reflexoes clube_reflexoes_estacao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clube_reflexoes
    ADD CONSTRAINT clube_reflexoes_estacao_id_fkey FOREIGN KEY (estacao_id) REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_rota_itens_estacao_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('clube_rota_itens_estacao_id_fkey', 'clube_rota_itens', 'clube_estacoes', TRUE, 'ALTER TABLE public.clube_rota_itens ADD CONSTRAINT clube_rota_itens_estacao_id_fkey FOREIGN KEY (estacao_id) REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('clube_rota_itens_estacao_id_fkey', 'clube_rota_itens', 'clube_estacoes', FALSE, 'ALTER TABLE public.clube_rota_itens ADD CONSTRAINT clube_rota_itens_estacao_id_fkey FOREIGN KEY (estacao_id) REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_rota_progresso_estacao_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('clube_rota_progresso_estacao_id_fkey', 'clube_rota_progresso', 'clube_estacoes', TRUE, 'ALTER TABLE public.clube_rota_progresso ADD CONSTRAINT clube_rota_progresso_estacao_id_fkey FOREIGN KEY (estacao_id) REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('clube_rota_progresso_estacao_id_fkey', 'clube_rota_progresso', 'clube_estacoes', FALSE, 'ALTER TABLE public.clube_rota_progresso ADD CONSTRAINT clube_rota_progresso_estacao_id_fkey FOREIGN KEY (estacao_id) REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_rota_progresso_rota_item_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('clube_rota_progresso_rota_item_id_fkey', 'clube_rota_progresso', 'clube_rota_itens', TRUE, 'ALTER TABLE public.clube_rota_progresso ADD CONSTRAINT clube_rota_progresso_rota_item_id_fkey FOREIGN KEY (rota_item_id) REFERENCES public.clube_rota_itens(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('clube_rota_progresso_rota_item_id_fkey', 'clube_rota_progresso', 'clube_rota_itens', FALSE, 'ALTER TABLE public.clube_rota_progresso ADD CONSTRAINT clube_rota_progresso_rota_item_id_fkey FOREIGN KEY (rota_item_id) REFERENCES public.clube_rota_itens(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_rota_progresso_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('clube_rota_progresso_user_id_fkey', 'clube_rota_progresso', 'clube_v3_stations', TRUE, 'ALTER TABLE public.clube_rota_progresso ADD CONSTRAINT clube_rota_progresso_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: clube_v3_station_audios clube_v3_station_audios_station_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clube_v3_station_audios
    ADD CONSTRAINT clube_v3_station_audios_station_id_fkey FOREIGN KEY (station_id) REFERENCES public.clube_v3_stations(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('clube_rota_progresso_user_id_fkey', 'clube_rota_progresso', 'clube_v3_stations', FALSE, 'ALTER TABLE public.clube_rota_progresso ADD CONSTRAINT clube_rota_progresso_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: clube_v3_station_audios clube_v3_station_audios_station_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clube_v3_station_audios
    ADD CONSTRAINT clube_v3_station_audios_station_id_fkey FOREIGN KEY (station_id) REFERENCES public.clube_v3_stations(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_v3_station_content_station_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('clube_v3_station_content_station_id_fkey', 'clube_v3_station_content', 'clube_v3_stations', TRUE, 'ALTER TABLE public.clube_v3_station_content ADD CONSTRAINT clube_v3_station_content_station_id_fkey FOREIGN KEY (station_id) REFERENCES public.clube_v3_stations(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('clube_v3_station_content_station_id_fkey', 'clube_v3_station_content', 'clube_v3_stations', FALSE, 'ALTER TABLE public.clube_v3_station_content ADD CONSTRAINT clube_v3_station_content_station_id_fkey FOREIGN KEY (station_id) REFERENCES public.clube_v3_stations(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_v3_stations_route_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('clube_v3_stations_route_id_fkey', 'clube_v3_stations', 'clube_v3_routes', TRUE, 'ALTER TABLE public.clube_v3_stations ADD CONSTRAINT clube_v3_stations_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.clube_v3_routes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('clube_v3_stations_route_id_fkey', 'clube_v3_stations', 'clube_v3_routes', FALSE, 'ALTER TABLE public.clube_v3_stations ADD CONSTRAINT clube_v3_stations_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.clube_v3_routes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_v3_user_progress_station_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('clube_v3_user_progress_station_id_fkey', 'clube_v3_user_progress', 'clube_v3_stations', TRUE, 'ALTER TABLE public.clube_v3_user_progress ADD CONSTRAINT clube_v3_user_progress_station_id_fkey FOREIGN KEY (station_id) REFERENCES public.clube_v3_stations(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('clube_v3_user_progress_station_id_fkey', 'clube_v3_user_progress', 'clube_v3_stations', FALSE, 'ALTER TABLE public.clube_v3_user_progress ADD CONSTRAINT clube_v3_user_progress_station_id_fkey FOREIGN KEY (station_id) REFERENCES public.clube_v3_stations(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_ai_recommendations_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_ai_recommendations_client_id_fkey', 'co_ai_recommendations', 'clientes', TRUE, 'ALTER TABLE public.co_ai_recommendations ADD CONSTRAINT co_ai_recommendations_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_ai_recommendations_client_id_fkey', 'co_ai_recommendations', 'clientes', FALSE, 'ALTER TABLE public.co_ai_recommendations ADD CONSTRAINT co_ai_recommendations_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_ai_recommendations_tool_complementar_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_ai_recommendations_tool_complementar_id_fkey', 'co_ai_recommendations', 'sala_ferramentas', TRUE, 'ALTER TABLE public.co_ai_recommendations ADD CONSTRAINT co_ai_recommendations_tool_complementar_id_fkey FOREIGN KEY (tool_complementar_id) REFERENCES public.sala_ferramentas(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_ai_recommendations_tool_complementar_id_fkey', 'co_ai_recommendations', 'sala_ferramentas', FALSE, 'ALTER TABLE public.co_ai_recommendations ADD CONSTRAINT co_ai_recommendations_tool_complementar_id_fkey FOREIGN KEY (tool_complementar_id) REFERENCES public.sala_ferramentas(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_ai_recommendations_tool_sugerida_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_ai_recommendations_tool_sugerida_id_fkey', 'co_ai_recommendations', 'sala_ferramentas', TRUE, 'ALTER TABLE public.co_ai_recommendations ADD CONSTRAINT co_ai_recommendations_tool_sugerida_id_fkey FOREIGN KEY (tool_sugerida_id) REFERENCES public.sala_ferramentas(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_ai_recommendations_tool_sugerida_id_fkey', 'co_ai_recommendations', 'sala_ferramentas', FALSE, 'ALTER TABLE public.co_ai_recommendations ADD CONSTRAINT co_ai_recommendations_tool_sugerida_id_fkey FOREIGN KEY (tool_sugerida_id) REFERENCES public.sala_ferramentas(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_appointments_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_appointments_client_id_fkey', 'co_appointments', 'clientes', TRUE, 'ALTER TABLE public.co_appointments ADD CONSTRAINT co_appointments_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_appointments_client_id_fkey', 'co_appointments', 'clientes', FALSE, 'ALTER TABLE public.co_appointments ADD CONSTRAINT co_appointments_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_appointments_terapeuta_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_appointments_terapeuta_user_id_fkey', 'co_appointments', 'co_workspaces', TRUE, 'ALTER TABLE public.co_appointments ADD CONSTRAINT co_appointments_terapeuta_user_id_fkey FOREIGN KEY (terapeuta_user_id) REFERENCES auth.users(id);


--
-- Name: co_appointments co_appointments_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_appointments
    ADD CONSTRAINT co_appointments_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.co_workspaces(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_appointments_terapeuta_user_id_fkey', 'co_appointments', 'co_workspaces', FALSE, 'ALTER TABLE public.co_appointments ADD CONSTRAINT co_appointments_terapeuta_user_id_fkey FOREIGN KEY (terapeuta_user_id) REFERENCES auth.users(id);


--
-- Name: co_appointments co_appointments_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_appointments
    ADD CONSTRAINT co_appointments_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.co_workspaces(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_camara_sussurro_casos_proximo_treino_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_camara_sussurro_casos_proximo_treino_id_fkey', 'co_camara_sussurro_casos', 'co_camara_sussurro_casos', TRUE, 'ALTER TABLE public.co_camara_sussurro_casos ADD CONSTRAINT co_camara_sussurro_casos_proximo_treino_id_fkey FOREIGN KEY (proximo_treino_id) REFERENCES public.co_camara_sussurro_casos(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_camara_sussurro_casos_proximo_treino_id_fkey', 'co_camara_sussurro_casos', 'co_camara_sussurro_casos', FALSE, 'ALTER TABLE public.co_camara_sussurro_casos ADD CONSTRAINT co_camara_sussurro_casos_proximo_treino_id_fkey FOREIGN KEY (proximo_treino_id) REFERENCES public.co_camara_sussurro_casos(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_city_history_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_city_history_client_id_fkey', 'co_city_history', 'clientes', TRUE, 'ALTER TABLE public.co_city_history ADD CONSTRAINT co_city_history_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_city_history_client_id_fkey', 'co_city_history', 'clientes', FALSE, 'ALTER TABLE public.co_city_history ADD CONSTRAINT co_city_history_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_city_history_tool_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_city_history_tool_id_fkey', 'co_city_history', 'sala_ferramentas', TRUE, 'ALTER TABLE public.co_city_history ADD CONSTRAINT co_city_history_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES public.sala_ferramentas(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_city_history_tool_id_fkey', 'co_city_history', 'sala_ferramentas', FALSE, 'ALTER TABLE public.co_city_history ADD CONSTRAINT co_city_history_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES public.sala_ferramentas(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_client_invites_therapist_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_client_invites_therapist_user_id_fkey', 'co_client_invites', 'clientes', TRUE, 'ALTER TABLE public.co_client_invites ADD CONSTRAINT co_client_invites_therapist_user_id_fkey FOREIGN KEY (therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_client_profile co_client_profile_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_client_profile
    ADD CONSTRAINT co_client_profile_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_client_invites_therapist_user_id_fkey', 'co_client_invites', 'clientes', FALSE, 'ALTER TABLE public.co_client_invites ADD CONSTRAINT co_client_invites_therapist_user_id_fkey FOREIGN KEY (therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_client_profile co_client_profile_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_client_profile
    ADD CONSTRAINT co_client_profile_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_client_profile_therapist_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_client_profile_therapist_id_fkey', 'co_client_profile', 'clientes', TRUE, 'ALTER TABLE public.co_client_profile ADD CONSTRAINT co_client_profile_therapist_id_fkey FOREIGN KEY (therapist_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_client_profiles co_client_profiles_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_client_profiles
    ADD CONSTRAINT co_client_profiles_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_client_profile_therapist_id_fkey', 'co_client_profile', 'clientes', FALSE, 'ALTER TABLE public.co_client_profile ADD CONSTRAINT co_client_profile_therapist_id_fkey FOREIGN KEY (therapist_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_client_profiles co_client_profiles_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_client_profiles
    ADD CONSTRAINT co_client_profiles_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_convites_cliente_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_convites_cliente_id_fkey', 'co_convites', 'clientes', TRUE, 'ALTER TABLE public.co_convites ADD CONSTRAINT co_convites_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_convites_cliente_id_fkey', 'co_convites', 'clientes', FALSE, 'ALTER TABLE public.co_convites ADD CONSTRAINT co_convites_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_escutas_client_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_escutas_client_user_id_fkey', 'co_escutas', 'co_sessoes', TRUE, 'ALTER TABLE public.co_escutas ADD CONSTRAINT co_escutas_client_user_id_fkey FOREIGN KEY (client_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_escutas co_escutas_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_escutas
    ADD CONSTRAINT co_escutas_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: co_escutas co_escutas_sessao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_escutas
    ADD CONSTRAINT co_escutas_sessao_id_fkey FOREIGN KEY (sessao_id) REFERENCES public.co_sessoes(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_escutas_client_user_id_fkey', 'co_escutas', 'co_sessoes', FALSE, 'ALTER TABLE public.co_escutas ADD CONSTRAINT co_escutas_client_user_id_fkey FOREIGN KEY (client_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_escutas co_escutas_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_escutas
    ADD CONSTRAINT co_escutas_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: co_escutas co_escutas_sessao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_escutas
    ADD CONSTRAINT co_escutas_sessao_id_fkey FOREIGN KEY (sessao_id) REFERENCES public.co_sessoes(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_escutas_therapist_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_escutas_therapist_user_id_fkey', 'co_escutas', 'clientes', TRUE, 'ALTER TABLE public.co_escutas ADD CONSTRAINT co_escutas_therapist_user_id_fkey FOREIGN KEY (therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_garden_flowers co_garden_flowers_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_garden_flowers
    ADD CONSTRAINT co_garden_flowers_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_escutas_therapist_user_id_fkey', 'co_escutas', 'clientes', FALSE, 'ALTER TABLE public.co_escutas ADD CONSTRAINT co_escutas_therapist_user_id_fkey FOREIGN KEY (therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_garden_flowers co_garden_flowers_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_garden_flowers
    ADD CONSTRAINT co_garden_flowers_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_garden_flowers_origem_registro_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_garden_flowers_origem_registro_id_fkey', 'co_garden_flowers', 'co_journey_records', TRUE, 'ALTER TABLE public.co_garden_flowers ADD CONSTRAINT co_garden_flowers_origem_registro_id_fkey FOREIGN KEY (origem_registro_id) REFERENCES public.co_journey_records(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_garden_flowers_origem_registro_id_fkey', 'co_garden_flowers', 'co_journey_records', FALSE, 'ALTER TABLE public.co_garden_flowers ADD CONSTRAINT co_garden_flowers_origem_registro_id_fkey FOREIGN KEY (origem_registro_id) REFERENCES public.co_journey_records(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_jardim_entries_client_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_jardim_entries_client_user_id_fkey', 'co_jardim_entries', 'co_jardins', TRUE, 'ALTER TABLE public.co_jardim_entries ADD CONSTRAINT co_jardim_entries_client_user_id_fkey FOREIGN KEY (client_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_jardim_entries co_jardim_entries_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_jardim_entries
    ADD CONSTRAINT co_jardim_entries_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: co_jardim_entries co_jardim_entries_jardim_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_jardim_entries
    ADD CONSTRAINT co_jardim_entries_jardim_id_fkey FOREIGN KEY (jardim_id) REFERENCES public.co_jardins(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_jardim_entries_client_user_id_fkey', 'co_jardim_entries', 'co_jardins', FALSE, 'ALTER TABLE public.co_jardim_entries ADD CONSTRAINT co_jardim_entries_client_user_id_fkey FOREIGN KEY (client_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_jardim_entries co_jardim_entries_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_jardim_entries
    ADD CONSTRAINT co_jardim_entries_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: co_jardim_entries co_jardim_entries_jardim_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_jardim_entries
    ADD CONSTRAINT co_jardim_entries_jardim_id_fkey FOREIGN KEY (jardim_id) REFERENCES public.co_jardins(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_jardim_entries_therapist_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_jardim_entries_therapist_user_id_fkey', 'co_jardim_entries', 'clientes', TRUE, 'ALTER TABLE public.co_jardim_entries ADD CONSTRAINT co_jardim_entries_therapist_user_id_fkey FOREIGN KEY (therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT co_journey_records_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_jardim_entries_therapist_user_id_fkey', 'co_jardim_entries', 'clientes', FALSE, 'ALTER TABLE public.co_jardim_entries ADD CONSTRAINT co_jardim_entries_therapist_user_id_fkey FOREIGN KEY (therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT co_journey_records_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_journey_records_tool_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_journey_records_tool_id_fkey', 'co_journey_records', 'sala_ferramentas', TRUE, 'ALTER TABLE public.co_journey_records ADD CONSTRAINT co_journey_records_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES public.sala_ferramentas(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_journey_records_tool_id_fkey', 'co_journey_records', 'sala_ferramentas', FALSE, 'ALTER TABLE public.co_journey_records ADD CONSTRAINT co_journey_records_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES public.sala_ferramentas(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_mentora_feedback_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_mentora_feedback_user_id_fkey', 'co_mentora_feedback', 'clientes', TRUE, 'ALTER TABLE public.co_mentora_feedback ADD CONSTRAINT co_mentora_feedback_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_mentora_insights co_mentora_insights_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_mentora_insights
    ADD CONSTRAINT co_mentora_insights_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_orientacao_sugestoes_ia co_orientacao_sugestoes_ia_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_orientacao_sugestoes_ia
    ADD CONSTRAINT co_orientacao_sugestoes_ia_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_mentora_feedback_user_id_fkey', 'co_mentora_feedback', 'clientes', FALSE, 'ALTER TABLE public.co_mentora_feedback ADD CONSTRAINT co_mentora_feedback_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_mentora_insights co_mentora_insights_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_mentora_insights
    ADD CONSTRAINT co_mentora_insights_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_orientacao_sugestoes_ia co_orientacao_sugestoes_ia_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_orientacao_sugestoes_ia
    ADD CONSTRAINT co_orientacao_sugestoes_ia_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacao_sugestoes_ia_orientacao_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_orientacao_sugestoes_ia_orientacao_id_fkey', 'co_orientacao_sugestoes_ia', 'co_orientacoes', TRUE, 'ALTER TABLE public.co_orientacao_sugestoes_ia ADD CONSTRAINT co_orientacao_sugestoes_ia_orientacao_id_fkey FOREIGN KEY (orientacao_id) REFERENCES public.co_orientacoes(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_orientacao_sugestoes_ia_orientacao_id_fkey', 'co_orientacao_sugestoes_ia', 'co_orientacoes', FALSE, 'ALTER TABLE public.co_orientacao_sugestoes_ia ADD CONSTRAINT co_orientacao_sugestoes_ia_orientacao_id_fkey FOREIGN KEY (orientacao_id) REFERENCES public.co_orientacoes(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacao_sugestoes_ia_session_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_orientacao_sugestoes_ia_session_id_fkey', 'co_orientacao_sugestoes_ia', 'sessions', TRUE, 'ALTER TABLE public.co_orientacao_sugestoes_ia ADD CONSTRAINT co_orientacao_sugestoes_ia_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_orientacao_sugestoes_ia_session_id_fkey', 'co_orientacao_sugestoes_ia', 'sessions', FALSE, 'ALTER TABLE public.co_orientacao_sugestoes_ia ADD CONSTRAINT co_orientacao_sugestoes_ia_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacoes_cliente_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_orientacoes_cliente_id_fkey', 'co_orientacoes', 'clientes', TRUE, 'ALTER TABLE public.co_orientacoes ADD CONSTRAINT co_orientacoes_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_orientacoes_cliente_id_fkey', 'co_orientacoes', 'clientes', FALSE, 'ALTER TABLE public.co_orientacoes ADD CONSTRAINT co_orientacoes_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacoes_session_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_orientacoes_session_id_fkey', 'co_orientacoes', 'sessions', TRUE, 'ALTER TABLE public.co_orientacoes ADD CONSTRAINT co_orientacoes_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_orientacoes_session_id_fkey', 'co_orientacoes', 'sessions', FALSE, 'ALTER TABLE public.co_orientacoes ADD CONSTRAINT co_orientacoes_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_passport_entries_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_passport_entries_client_id_fkey', 'co_passport_entries', 'clientes', TRUE, 'ALTER TABLE public.co_passport_entries ADD CONSTRAINT co_passport_entries_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_passport_entries_client_id_fkey', 'co_passport_entries', 'clientes', FALSE, 'ALTER TABLE public.co_passport_entries ADD CONSTRAINT co_passport_entries_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_praticas_client_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_praticas_client_user_id_fkey', 'co_praticas', 'co_sessoes', TRUE, 'ALTER TABLE public.co_praticas ADD CONSTRAINT co_praticas_client_user_id_fkey FOREIGN KEY (client_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_praticas co_praticas_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_praticas
    ADD CONSTRAINT co_praticas_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: co_praticas co_praticas_sessao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_praticas
    ADD CONSTRAINT co_praticas_sessao_id_fkey FOREIGN KEY (sessao_id) REFERENCES public.co_sessoes(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_praticas_client_user_id_fkey', 'co_praticas', 'co_sessoes', FALSE, 'ALTER TABLE public.co_praticas ADD CONSTRAINT co_praticas_client_user_id_fkey FOREIGN KEY (client_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_praticas co_praticas_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_praticas
    ADD CONSTRAINT co_praticas_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: co_praticas co_praticas_sessao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_praticas
    ADD CONSTRAINT co_praticas_sessao_id_fkey FOREIGN KEY (sessao_id) REFERENCES public.co_sessoes(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_praticas_therapist_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_praticas_therapist_user_id_fkey', 'co_praticas', 'co_jardins', TRUE, 'ALTER TABLE public.co_praticas ADD CONSTRAINT co_praticas_therapist_user_id_fkey FOREIGN KEY (therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT co_registros_simbolicos_jardim_id_fkey FOREIGN KEY (jardim_id) REFERENCES public.co_jardins(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_praticas_therapist_user_id_fkey', 'co_praticas', 'co_jardins', FALSE, 'ALTER TABLE public.co_praticas ADD CONSTRAINT co_praticas_therapist_user_id_fkey FOREIGN KEY (therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT co_registros_simbolicos_jardim_id_fkey FOREIGN KEY (jardim_id) REFERENCES public.co_jardins(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_registros_simbolicos_sessao_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_registros_simbolicos_sessao_id_fkey', 'co_registros_simbolicos', 'co_sessoes', TRUE, 'ALTER TABLE public.co_registros_simbolicos ADD CONSTRAINT co_registros_simbolicos_sessao_id_fkey FOREIGN KEY (sessao_id) REFERENCES public.co_sessoes(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_registros_simbolicos_sessao_id_fkey', 'co_registros_simbolicos', 'co_sessoes', FALSE, 'ALTER TABLE public.co_registros_simbolicos ADD CONSTRAINT co_registros_simbolicos_sessao_id_fkey FOREIGN KEY (sessao_id) REFERENCES public.co_sessoes(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_registros_simbolicos_therapist_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_registros_simbolicos_therapist_user_id_fkey', 'co_registros_simbolicos', 'co_jardins', TRUE, 'ALTER TABLE public.co_registros_simbolicos ADD CONSTRAINT co_registros_simbolicos_therapist_user_id_fkey FOREIGN KEY (therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT co_sessoes_jardim_ref_id_fkey FOREIGN KEY (jardim_ref_id) REFERENCES public.co_jardins(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_registros_simbolicos_therapist_user_id_fkey', 'co_registros_simbolicos', 'co_jardins', FALSE, 'ALTER TABLE public.co_registros_simbolicos ADD CONSTRAINT co_registros_simbolicos_therapist_user_id_fkey FOREIGN KEY (therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT co_sessoes_jardim_ref_id_fkey FOREIGN KEY (jardim_ref_id) REFERENCES public.co_jardins(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sessoes_therapist_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_sessoes_therapist_user_id_fkey', 'co_sessoes', 'co_sim_steps', TRUE, 'ALTER TABLE public.co_sessoes ADD CONSTRAINT co_sessoes_therapist_user_id_fkey FOREIGN KEY (therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_sim_options co_sim_options_proximo_step_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_sim_options
    ADD CONSTRAINT co_sim_options_proximo_step_id_fkey FOREIGN KEY (proximo_step_id) REFERENCES public.co_sim_steps(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_sessoes_therapist_user_id_fkey', 'co_sessoes', 'co_sim_steps', FALSE, 'ALTER TABLE public.co_sessoes ADD CONSTRAINT co_sessoes_therapist_user_id_fkey FOREIGN KEY (therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_sim_options co_sim_options_proximo_step_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_sim_options
    ADD CONSTRAINT co_sim_options_proximo_step_id_fkey FOREIGN KEY (proximo_step_id) REFERENCES public.co_sim_steps(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_options_step_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_sim_options_step_id_fkey', 'co_sim_options', 'co_sim_steps', TRUE, 'ALTER TABLE public.co_sim_options ADD CONSTRAINT co_sim_options_step_id_fkey FOREIGN KEY (step_id) REFERENCES public.co_sim_steps(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_sim_options_step_id_fkey', 'co_sim_options', 'co_sim_steps', FALSE, 'ALTER TABLE public.co_sim_options ADD CONSTRAINT co_sim_options_step_id_fkey FOREIGN KEY (step_id) REFERENCES public.co_sim_steps(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_progress_case_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_sim_progress_case_id_fkey', 'co_sim_progress', 'co_sim_cases', TRUE, 'ALTER TABLE public.co_sim_progress ADD CONSTRAINT co_sim_progress_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.co_sim_cases(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_sim_progress_case_id_fkey', 'co_sim_progress', 'co_sim_cases', FALSE, 'ALTER TABLE public.co_sim_progress ADD CONSTRAINT co_sim_progress_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.co_sim_cases(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_progress_escolha_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_sim_progress_escolha_id_fkey', 'co_sim_progress', 'co_sim_options', TRUE, 'ALTER TABLE public.co_sim_progress ADD CONSTRAINT co_sim_progress_escolha_id_fkey FOREIGN KEY (escolha_id) REFERENCES public.co_sim_options(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_sim_progress_escolha_id_fkey', 'co_sim_progress', 'co_sim_options', FALSE, 'ALTER TABLE public.co_sim_progress ADD CONSTRAINT co_sim_progress_escolha_id_fkey FOREIGN KEY (escolha_id) REFERENCES public.co_sim_options(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_progress_step_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_sim_progress_step_id_fkey', 'co_sim_progress', 'co_sim_steps', TRUE, 'ALTER TABLE public.co_sim_progress ADD CONSTRAINT co_sim_progress_step_id_fkey FOREIGN KEY (step_id) REFERENCES public.co_sim_steps(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_sim_progress_step_id_fkey', 'co_sim_progress', 'co_sim_steps', FALSE, 'ALTER TABLE public.co_sim_progress ADD CONSTRAINT co_sim_progress_step_id_fkey FOREIGN KEY (step_id) REFERENCES public.co_sim_steps(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_steps_case_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_sim_steps_case_id_fkey', 'co_sim_steps', 'co_sim_cases', TRUE, 'ALTER TABLE public.co_sim_steps ADD CONSTRAINT co_sim_steps_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.co_sim_cases(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_sim_steps_case_id_fkey', 'co_sim_steps', 'co_sim_cases', FALSE, 'ALTER TABLE public.co_sim_steps ADD CONSTRAINT co_sim_steps_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.co_sim_cases(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_therapist_profile_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_therapist_profile_user_id_fkey', 'co_therapist_profile', 'tools', TRUE, 'ALTER TABLE public.co_therapist_profile ADD CONSTRAINT co_therapist_profile_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_tool_flows co_tool_flows_tool_destino_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_tool_flows
    ADD CONSTRAINT co_tool_flows_tool_destino_id_fkey FOREIGN KEY (tool_destino_id) REFERENCES public.tools(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_therapist_profile_user_id_fkey', 'co_therapist_profile', 'tools', FALSE, 'ALTER TABLE public.co_therapist_profile ADD CONSTRAINT co_therapist_profile_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_tool_flows co_tool_flows_tool_destino_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_tool_flows
    ADD CONSTRAINT co_tool_flows_tool_destino_id_fkey FOREIGN KEY (tool_destino_id) REFERENCES public.tools(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_tool_flows_tool_origem_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_tool_flows_tool_origem_id_fkey', 'co_tool_flows', 'tools', TRUE, 'ALTER TABLE public.co_tool_flows ADD CONSTRAINT co_tool_flows_tool_origem_id_fkey FOREIGN KEY (tool_origem_id) REFERENCES public.tools(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_tool_flows_tool_origem_id_fkey', 'co_tool_flows', 'tools', FALSE, 'ALTER TABLE public.co_tool_flows ADD CONSTRAINT co_tool_flows_tool_origem_id_fkey FOREIGN KEY (tool_origem_id) REFERENCES public.tools(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_tool_usage_tool_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_tool_usage_tool_id_fkey', 'co_tool_usage', 'sala_ferramentas', TRUE, 'ALTER TABLE public.co_tool_usage ADD CONSTRAINT co_tool_usage_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES public.sala_ferramentas(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_tool_usage_tool_id_fkey', 'co_tool_usage', 'sala_ferramentas', FALSE, 'ALTER TABLE public.co_tool_usage ADD CONSTRAINT co_tool_usage_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES public.sala_ferramentas(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_attempts_case_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_training_attempts_case_id_fkey', 'co_training_attempts', 'co_training_cases', TRUE, 'ALTER TABLE public.co_training_attempts ADD CONSTRAINT co_training_attempts_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.co_training_cases(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_training_attempts_case_id_fkey', 'co_training_attempts', 'co_training_cases', FALSE, 'ALTER TABLE public.co_training_attempts ADD CONSTRAINT co_training_attempts_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.co_training_cases(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_attempts_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_training_attempts_user_id_fkey', 'co_training_attempts', 'co_training_cases', TRUE, 'ALTER TABLE public.co_training_attempts ADD CONSTRAINT co_training_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_training_case_feedbacks co_training_case_feedbacks_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_training_case_feedbacks
    ADD CONSTRAINT co_training_case_feedbacks_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.co_training_cases(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_training_attempts_user_id_fkey', 'co_training_attempts', 'co_training_cases', FALSE, 'ALTER TABLE public.co_training_attempts ADD CONSTRAINT co_training_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_training_case_feedbacks co_training_case_feedbacks_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_training_case_feedbacks
    ADD CONSTRAINT co_training_case_feedbacks_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.co_training_cases(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_case_possible_readings_case_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_training_case_possible_readings_case_id_fkey', 'co_training_case_possible_readings', 'co_training_cases', TRUE, 'ALTER TABLE public.co_training_case_possible_readings ADD CONSTRAINT co_training_case_possible_readings_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.co_training_cases(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_training_case_possible_readings_case_id_fkey', 'co_training_case_possible_readings', 'co_training_cases', FALSE, 'ALTER TABLE public.co_training_case_possible_readings ADD CONSTRAINT co_training_case_possible_readings_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.co_training_cases(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_case_signals_case_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_training_case_signals_case_id_fkey', 'co_training_case_signals', 'co_training_cases', TRUE, 'ALTER TABLE public.co_training_case_signals ADD CONSTRAINT co_training_case_signals_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.co_training_cases(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_training_case_signals_case_id_fkey', 'co_training_case_signals', 'co_training_cases', FALSE, 'ALTER TABLE public.co_training_case_signals ADD CONSTRAINT co_training_case_signals_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.co_training_cases(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_progress_ultimo_case_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_training_progress_ultimo_case_id_fkey', 'co_training_progress', 'co_training_cases', TRUE, 'ALTER TABLE public.co_training_progress ADD CONSTRAINT co_training_progress_ultimo_case_id_fkey FOREIGN KEY (ultimo_case_id) REFERENCES public.co_training_cases(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_training_progress_ultimo_case_id_fkey', 'co_training_progress', 'co_training_cases', FALSE, 'ALTER TABLE public.co_training_progress ADD CONSTRAINT co_training_progress_ultimo_case_id_fkey FOREIGN KEY (ultimo_case_id) REFERENCES public.co_training_cases(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_progress_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_training_progress_user_id_fkey', 'co_training_progress', 'co_travessias', TRUE, 'ALTER TABLE public.co_training_progress ADD CONSTRAINT co_training_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_travessia_encontros co_travessia_encontros_travessia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_travessia_encontros
    ADD CONSTRAINT co_travessia_encontros_travessia_id_fkey FOREIGN KEY (travessia_id) REFERENCES public.co_travessias(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_training_progress_user_id_fkey', 'co_training_progress', 'co_travessias', FALSE, 'ALTER TABLE public.co_training_progress ADD CONSTRAINT co_training_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_travessia_encontros co_travessia_encontros_travessia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_travessia_encontros
    ADD CONSTRAINT co_travessia_encontros_travessia_id_fkey FOREIGN KEY (travessia_id) REFERENCES public.co_travessias(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_travessia_respostas_encontro_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_travessia_respostas_encontro_id_fkey', 'co_travessia_respostas', 'co_travessia_encontros', TRUE, 'ALTER TABLE public.co_travessia_respostas ADD CONSTRAINT co_travessia_respostas_encontro_id_fkey FOREIGN KEY (encontro_id) REFERENCES public.co_travessia_encontros(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_travessia_respostas_encontro_id_fkey', 'co_travessia_respostas', 'co_travessia_encontros', FALSE, 'ALTER TABLE public.co_travessia_respostas ADD CONSTRAINT co_travessia_respostas_encontro_id_fkey FOREIGN KEY (encontro_id) REFERENCES public.co_travessia_encontros(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_travessia_respostas_travessia_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_travessia_respostas_travessia_id_fkey', 'co_travessia_respostas', 'co_travessias', TRUE, 'ALTER TABLE public.co_travessia_respostas ADD CONSTRAINT co_travessia_respostas_travessia_id_fkey FOREIGN KEY (travessia_id) REFERENCES public.co_travessias(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_travessia_respostas_travessia_id_fkey', 'co_travessia_respostas', 'co_travessias', FALSE, 'ALTER TABLE public.co_travessia_respostas ADD CONSTRAINT co_travessia_respostas_travessia_id_fkey FOREIGN KEY (travessia_id) REFERENCES public.co_travessias(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_workspace_users_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_workspace_users_user_id_fkey', 'co_workspace_users', 'co_workspaces', TRUE, 'ALTER TABLE public.co_workspace_users ADD CONSTRAINT co_workspace_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_workspace_users co_workspace_users_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_workspace_users
    ADD CONSTRAINT co_workspace_users_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.co_workspaces(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_workspace_users_user_id_fkey', 'co_workspace_users', 'co_workspaces', FALSE, 'ALTER TABLE public.co_workspace_users ADD CONSTRAINT co_workspace_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_workspace_users co_workspace_users_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_workspace_users
    ADD CONSTRAINT co_workspace_users_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES public.co_workspaces(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_workspaces_owner_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('co_workspaces_owner_user_id_fkey', 'co_workspaces', 'collective_beds', TRUE, 'ALTER TABLE public.co_workspaces ADD CONSTRAINT co_workspaces_owner_user_id_fkey FOREIGN KEY (owner_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: collective_bed_entries collective_bed_entries_bed_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collective_bed_entries
    ADD CONSTRAINT collective_bed_entries_bed_id_fkey FOREIGN KEY (bed_id) REFERENCES public.collective_beds(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('co_workspaces_owner_user_id_fkey', 'co_workspaces', 'collective_beds', FALSE, 'ALTER TABLE public.co_workspaces ADD CONSTRAINT co_workspaces_owner_user_id_fkey FOREIGN KEY (owner_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: collective_bed_entries collective_bed_entries_bed_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collective_bed_entries
    ADD CONSTRAINT collective_bed_entries_bed_id_fkey FOREIGN KEY (bed_id) REFERENCES public.collective_beds(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'collective_bed_entries_season_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('collective_bed_entries_season_id_fkey', 'collective_bed_entries', 'oracular_seasons', TRUE, 'ALTER TABLE public.collective_bed_entries ADD CONSTRAINT collective_bed_entries_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.oracular_seasons(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('collective_bed_entries_season_id_fkey', 'collective_bed_entries', 'oracular_seasons', FALSE, 'ALTER TABLE public.collective_bed_entries ADD CONSTRAINT collective_bed_entries_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.oracular_seasons(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'collective_bed_entries_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('collective_bed_entries_user_id_fkey', 'collective_bed_entries', 'oracular_seasons', TRUE, 'ALTER TABLE public.collective_bed_entries ADD CONSTRAINT collective_bed_entries_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: collective_beds collective_beds_season_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collective_beds
    ADD CONSTRAINT collective_beds_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.oracular_seasons(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('collective_bed_entries_user_id_fkey', 'collective_bed_entries', 'oracular_seasons', FALSE, 'ALTER TABLE public.collective_bed_entries ADD CONSTRAINT collective_bed_entries_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: collective_beds collective_beds_season_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collective_beds
    ADD CONSTRAINT collective_beds_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.oracular_seasons(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_comments_autor_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('community_comments_autor_id_fkey', 'community_comments', 'community_posts', TRUE, 'ALTER TABLE public.community_comments ADD CONSTRAINT community_comments_autor_id_fkey FOREIGN KEY (autor_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: community_comments community_comments_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_comments
    ADD CONSTRAINT community_comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.community_posts(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('community_comments_autor_id_fkey', 'community_comments', 'community_posts', FALSE, 'ALTER TABLE public.community_comments ADD CONSTRAINT community_comments_autor_id_fkey FOREIGN KEY (autor_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: community_comments community_comments_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_comments
    ADD CONSTRAINT community_comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.community_posts(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_event_participants_event_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('community_event_participants_event_id_fkey', 'community_event_participants', 'community_events', TRUE, 'ALTER TABLE public.community_event_participants ADD CONSTRAINT community_event_participants_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.community_events(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('community_event_participants_event_id_fkey', 'community_event_participants', 'community_events', FALSE, 'ALTER TABLE public.community_event_participants ADD CONSTRAINT community_event_participants_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.community_events(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_event_participants_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('community_event_participants_user_id_fkey', 'community_event_participants', 'community_groups', TRUE, 'ALTER TABLE public.community_event_participants ADD CONSTRAINT community_event_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: community_events community_events_criador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_events
    ADD CONSTRAINT community_events_criador_id_fkey FOREIGN KEY (criador_id) REFERENCES auth.users(id);


--
-- Name: community_group_members community_group_members_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_group_members
    ADD CONSTRAINT community_group_members_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.community_groups(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('community_event_participants_user_id_fkey', 'community_event_participants', 'community_groups', FALSE, 'ALTER TABLE public.community_event_participants ADD CONSTRAINT community_event_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: community_events community_events_criador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_events
    ADD CONSTRAINT community_events_criador_id_fkey FOREIGN KEY (criador_id) REFERENCES auth.users(id);


--
-- Name: community_group_members community_group_members_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_group_members
    ADD CONSTRAINT community_group_members_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.community_groups(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_group_members_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('community_group_members_user_id_fkey', 'community_group_members', 'community_posts', TRUE, 'ALTER TABLE public.community_group_members ADD CONSTRAINT community_group_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: community_groups community_groups_criador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_groups
    ADD CONSTRAINT community_groups_criador_id_fkey FOREIGN KEY (criador_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: community_likes community_likes_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_likes
    ADD CONSTRAINT community_likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.community_posts(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('community_group_members_user_id_fkey', 'community_group_members', 'community_posts', FALSE, 'ALTER TABLE public.community_group_members ADD CONSTRAINT community_group_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: community_groups community_groups_criador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_groups
    ADD CONSTRAINT community_groups_criador_id_fkey FOREIGN KEY (criador_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: community_likes community_likes_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_likes
    ADD CONSTRAINT community_likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.community_posts(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_likes_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('community_likes_user_id_fkey', 'community_likes', 'community_topics', TRUE, 'ALTER TABLE public.community_likes ADD CONSTRAINT community_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT community_topic_replies_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.community_topics(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('community_likes_user_id_fkey', 'community_likes', 'community_topics', FALSE, 'ALTER TABLE public.community_likes ADD CONSTRAINT community_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT community_topic_replies_topic_id_fkey FOREIGN KEY (topic_id) REFERENCES public.community_topics(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_topics_autor_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('community_topics_autor_id_fkey', 'community_topics', 'community_forums', TRUE, 'ALTER TABLE public.community_topics ADD CONSTRAINT community_topics_autor_id_fkey FOREIGN KEY (autor_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: community_topics community_topics_forum_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_topics
    ADD CONSTRAINT community_topics_forum_id_fkey FOREIGN KEY (forum_id) REFERENCES public.community_forums(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('community_topics_autor_id_fkey', 'community_topics', 'community_forums', FALSE, 'ALTER TABLE public.community_topics ADD CONSTRAINT community_topics_autor_id_fkey FOREIGN KEY (autor_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: community_topics community_topics_forum_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_topics
    ADD CONSTRAINT community_topics_forum_id_fkey FOREIGN KEY (forum_id) REFERENCES public.community_forums(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conselho_partes_internas_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('conselho_partes_internas_client_id_fkey', 'conselho_partes_internas', 'clientes', TRUE, 'ALTER TABLE public.conselho_partes_internas ADD CONSTRAINT conselho_partes_internas_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('conselho_partes_internas_client_id_fkey', 'conselho_partes_internas', 'clientes', FALSE, 'ALTER TABLE public.conselho_partes_internas ADD CONSTRAINT conselho_partes_internas_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'content_blocks_agente_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('content_blocks_agente_id_fkey', 'content_blocks', 'agentes', TRUE, 'ALTER TABLE public.content_blocks ADD CONSTRAINT content_blocks_agente_id_fkey FOREIGN KEY (agente_id) REFERENCES public.agentes(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('content_blocks_agente_id_fkey', 'content_blocks', 'agentes', FALSE, 'ALTER TABLE public.content_blocks ADD CONSTRAINT content_blocks_agente_id_fkey FOREIGN KEY (agente_id) REFERENCES public.agentes(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conteudo_aulas_travessia_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('conteudo_aulas_travessia_id_fkey', 'conteudo_aulas', 'conteudo_travessias', TRUE, 'ALTER TABLE public.conteudo_aulas ADD CONSTRAINT conteudo_aulas_travessia_id_fkey FOREIGN KEY (travessia_id) REFERENCES public.conteudo_travessias(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('conteudo_aulas_travessia_id_fkey', 'conteudo_aulas', 'conteudo_travessias', FALSE, 'ALTER TABLE public.conteudo_aulas ADD CONSTRAINT conteudo_aulas_travessia_id_fkey FOREIGN KEY (travessia_id) REFERENCES public.conteudo_travessias(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conteudo_travessias_sala_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('conteudo_travessias_sala_id_fkey', 'conteudo_travessias', 'salas', TRUE, 'ALTER TABLE public.conteudo_travessias ADD CONSTRAINT conteudo_travessias_sala_id_fkey FOREIGN KEY (sala_id) REFERENCES public.salas(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('conteudo_travessias_sala_id_fkey', 'conteudo_travessias', 'salas', FALSE, 'ALTER TABLE public.conteudo_travessias ADD CONSTRAINT conteudo_travessias_sala_id_fkey FOREIGN KEY (sala_id) REFERENCES public.salas(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contos_clinicos_audio_padrao_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('contos_clinicos_audio_padrao_id_fkey', 'contos_clinicos', 'audio_assets', TRUE, 'ALTER TABLE public.contos_clinicos ADD CONSTRAINT contos_clinicos_audio_padrao_id_fkey FOREIGN KEY (audio_padrao_id) REFERENCES public.audio_assets(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('contos_clinicos_audio_padrao_id_fkey', 'contos_clinicos', 'audio_assets', FALSE, 'ALTER TABLE public.contos_clinicos ADD CONSTRAINT contos_clinicos_audio_padrao_id_fkey FOREIGN KEY (audio_padrao_id) REFERENCES public.audio_assets(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'corpo_inconsciente_cliente_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('corpo_inconsciente_cliente_id_fkey', 'corpo_inconsciente', 'clientes', TRUE, 'ALTER TABLE public.corpo_inconsciente ADD CONSTRAINT corpo_inconsciente_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('corpo_inconsciente_cliente_id_fkey', 'corpo_inconsciente', 'clientes', FALSE, 'ALTER TABLE public.corpo_inconsciente ADD CONSTRAINT corpo_inconsciente_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_enrollments_course_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('course_enrollments_course_id_fkey', 'course_enrollments', 'courses', TRUE, 'ALTER TABLE public.course_enrollments ADD CONSTRAINT course_enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('course_enrollments_course_id_fkey', 'course_enrollments', 'courses', FALSE, 'ALTER TABLE public.course_enrollments ADD CONSTRAINT course_enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_exercise_responses_lesson_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('course_exercise_responses_lesson_id_fkey', 'course_exercise_responses', 'course_lessons', TRUE, 'ALTER TABLE public.course_exercise_responses ADD CONSTRAINT course_exercise_responses_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.course_lessons(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('course_exercise_responses_lesson_id_fkey', 'course_exercise_responses', 'course_lessons', FALSE, 'ALTER TABLE public.course_exercise_responses ADD CONSTRAINT course_exercise_responses_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.course_lessons(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_lesson_progress_lesson_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('course_lesson_progress_lesson_id_fkey', 'course_lesson_progress', 'course_lessons', TRUE, 'ALTER TABLE public.course_lesson_progress ADD CONSTRAINT course_lesson_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.course_lessons(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('course_lesson_progress_lesson_id_fkey', 'course_lesson_progress', 'course_lessons', FALSE, 'ALTER TABLE public.course_lesson_progress ADD CONSTRAINT course_lesson_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.course_lessons(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_lessons_module_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('course_lessons_module_id_fkey', 'course_lessons', 'course_modules', TRUE, 'ALTER TABLE public.course_lessons ADD CONSTRAINT course_lessons_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.course_modules(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('course_lessons_module_id_fkey', 'course_lessons', 'course_modules', FALSE, 'ALTER TABLE public.course_lessons ADD CONSTRAINT course_lessons_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.course_modules(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_module_forum_posts_module_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('course_module_forum_posts_module_id_fkey', 'course_module_forum_posts', 'course_modules', TRUE, 'ALTER TABLE public.course_module_forum_posts ADD CONSTRAINT course_module_forum_posts_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.course_modules(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('course_module_forum_posts_module_id_fkey', 'course_module_forum_posts', 'course_modules', FALSE, 'ALTER TABLE public.course_module_forum_posts ADD CONSTRAINT course_module_forum_posts_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.course_modules(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_module_forum_posts_parent_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('course_module_forum_posts_parent_id_fkey', 'course_module_forum_posts', 'course_module_forum_posts', TRUE, 'ALTER TABLE public.course_module_forum_posts ADD CONSTRAINT course_module_forum_posts_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.course_module_forum_posts(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('course_module_forum_posts_parent_id_fkey', 'course_module_forum_posts', 'course_module_forum_posts', FALSE, 'ALTER TABLE public.course_module_forum_posts ADD CONSTRAINT course_module_forum_posts_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.course_module_forum_posts(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_module_forum_posts_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('course_module_forum_posts_user_id_fkey', 'course_module_forum_posts', 'courses', TRUE, 'ALTER TABLE public.course_module_forum_posts ADD CONSTRAINT course_module_forum_posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: course_modules course_modules_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_modules
    ADD CONSTRAINT course_modules_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('course_module_forum_posts_user_id_fkey', 'course_module_forum_posts', 'courses', FALSE, 'ALTER TABLE public.course_module_forum_posts ADD CONSTRAINT course_module_forum_posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: course_modules course_modules_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_modules
    ADD CONSTRAINT course_modules_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_work_submissions_course_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('course_work_submissions_course_id_fkey', 'course_work_submissions', 'courses', TRUE, 'ALTER TABLE public.course_work_submissions ADD CONSTRAINT course_work_submissions_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('course_work_submissions_course_id_fkey', 'course_work_submissions', 'courses', FALSE, 'ALTER TABLE public.course_work_submissions ADD CONSTRAINT course_work_submissions_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_work_submissions_reviewed_by_fkey') THEN
        INSERT INTO fk_audit VALUES ('course_work_submissions_reviewed_by_fkey', 'course_work_submissions', 'salas', TRUE, 'ALTER TABLE public.course_work_submissions ADD CONSTRAINT course_work_submissions_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES auth.users(id);


--
-- Name: course_work_submissions course_work_submissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_work_submissions
    ADD CONSTRAINT course_work_submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: courses courses_sala_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_sala_id_fkey FOREIGN KEY (sala_id) REFERENCES public.salas(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('course_work_submissions_reviewed_by_fkey', 'course_work_submissions', 'salas', FALSE, 'ALTER TABLE public.course_work_submissions ADD CONSTRAINT course_work_submissions_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES auth.users(id);


--
-- Name: course_work_submissions course_work_submissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_work_submissions
    ADD CONSTRAINT course_work_submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: courses courses_sala_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_sala_id_fkey FOREIGN KEY (sala_id) REFERENCES public.salas(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'custom_oracle_cards_custom_oracle_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('custom_oracle_cards_custom_oracle_id_fkey', 'custom_oracle_cards', 'custom_oracles', TRUE, 'ALTER TABLE public.custom_oracle_cards ADD CONSTRAINT custom_oracle_cards_custom_oracle_id_fkey FOREIGN KEY (custom_oracle_id) REFERENCES public.custom_oracles(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('custom_oracle_cards_custom_oracle_id_fkey', 'custom_oracle_cards', 'custom_oracles', FALSE, 'ALTER TABLE public.custom_oracle_cards ADD CONSTRAINT custom_oracle_cards_custom_oracle_id_fkey FOREIGN KEY (custom_oracle_id) REFERENCES public.custom_oracles(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cycle_books_book_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('cycle_books_book_id_fkey', 'cycle_books', 'books', TRUE, 'ALTER TABLE public.cycle_books ADD CONSTRAINT cycle_books_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('cycle_books_book_id_fkey', 'cycle_books', 'books', FALSE, 'ALTER TABLE public.cycle_books ADD CONSTRAINT cycle_books_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cycle_books_cycle_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('cycle_books_cycle_id_fkey', 'cycle_books', 'cycles', TRUE, 'ALTER TABLE public.cycle_books ADD CONSTRAINT cycle_books_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES public.cycles(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('cycle_books_cycle_id_fkey', 'cycle_books', 'cycles', FALSE, 'ALTER TABLE public.cycle_books ADD CONSTRAINT cycle_books_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES public.cycles(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'decodificacao_onirica_cliente_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('decodificacao_onirica_cliente_id_fkey', 'decodificacao_onirica', 'clientes', TRUE, 'ALTER TABLE public.decodificacao_onirica ADD CONSTRAINT decodificacao_onirica_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('decodificacao_onirica_cliente_id_fkey', 'decodificacao_onirica', 'clientes', FALSE, 'ALTER TABLE public.decodificacao_onirica ADD CONSTRAINT decodificacao_onirica_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'decodificacao_onirica_session_case_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('decodificacao_onirica_session_case_id_fkey', 'decodificacao_onirica', 'session_cases', TRUE, 'ALTER TABLE public.decodificacao_onirica ADD CONSTRAINT decodificacao_onirica_session_case_id_fkey FOREIGN KEY (session_case_id) REFERENCES public.session_cases(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('decodificacao_onirica_session_case_id_fkey', 'decodificacao_onirica', 'session_cases', FALSE, 'ALTER TABLE public.decodificacao_onirica ADD CONSTRAINT decodificacao_onirica_session_case_id_fkey FOREIGN KEY (session_case_id) REFERENCES public.session_cases(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'decodificacao_onirica_terapeuta_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('decodificacao_onirica_terapeuta_id_fkey', 'decodificacao_onirica', 'clientes', TRUE, 'ALTER TABLE public.decodificacao_onirica ADD CONSTRAINT decodificacao_onirica_terapeuta_id_fkey FOREIGN KEY (terapeuta_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT diagnostico_ego_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('decodificacao_onirica_terapeuta_id_fkey', 'decodificacao_onirica', 'clientes', FALSE, 'ALTER TABLE public.decodificacao_onirica ADD CONSTRAINT decodificacao_onirica_terapeuta_id_fkey FOREIGN KEY (terapeuta_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT diagnostico_ego_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'district_state_changes_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('district_state_changes_client_id_fkey', 'district_state_changes', 'clientes', TRUE, 'ALTER TABLE public.district_state_changes ADD CONSTRAINT district_state_changes_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('district_state_changes_client_id_fkey', 'district_state_changes', 'clientes', FALSE, 'ALTER TABLE public.district_state_changes ADD CONSTRAINT district_state_changes_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'district_state_changes_district_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('district_state_changes_district_id_fkey', 'district_state_changes', 'districts', TRUE, 'ALTER TABLE public.district_state_changes ADD CONSTRAINT district_state_changes_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.districts(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('district_state_changes_district_id_fkey', 'district_state_changes', 'districts', FALSE, 'ALTER TABLE public.district_state_changes ADD CONSTRAINT district_state_changes_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.districts(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'dreams_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('dreams_client_id_fkey', 'dreams', 'clientes', TRUE, 'ALTER TABLE public.dreams ADD CONSTRAINT dreams_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('dreams_client_id_fkey', 'dreams', 'clientes', FALSE, 'ALTER TABLE public.dreams ADD CONSTRAINT dreams_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'dreams_session_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('dreams_session_id_fkey', 'dreams', 'sessions', TRUE, 'ALTER TABLE public.dreams ADD CONSTRAINT dreams_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('dreams_session_id_fkey', 'dreams', 'sessions', FALSE, 'ALTER TABLE public.dreams ADD CONSTRAINT dreams_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'email_logs_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('email_logs_user_id_fkey', 'email_logs', 'profiles', TRUE, 'ALTER TABLE public.email_logs ADD CONSTRAINT email_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('email_logs_user_id_fkey', 'email_logs', 'profiles', FALSE, 'ALTER TABLE public.email_logs ADD CONSTRAINT email_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'eneagrama_feminino_afirmacoes_arquetipo_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('eneagrama_feminino_afirmacoes_arquetipo_id_fkey', 'eneagrama_feminino_afirmacoes', 'eneagrama_feminino_arquetipos', TRUE, 'ALTER TABLE public.eneagrama_feminino_afirmacoes ADD CONSTRAINT eneagrama_feminino_afirmacoes_arquetipo_id_fkey FOREIGN KEY (arquetipo_id) REFERENCES public.eneagrama_feminino_arquetipos(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('eneagrama_feminino_afirmacoes_arquetipo_id_fkey', 'eneagrama_feminino_afirmacoes', 'eneagrama_feminino_arquetipos', FALSE, 'ALTER TABLE public.eneagrama_feminino_afirmacoes ADD CONSTRAINT eneagrama_feminino_afirmacoes_arquetipo_id_fkey FOREIGN KEY (arquetipo_id) REFERENCES public.eneagrama_feminino_arquetipos(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'eneagrama_feminino_orientacoes_arquetipo_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('eneagrama_feminino_orientacoes_arquetipo_id_fkey', 'eneagrama_feminino_orientacoes', 'eneagrama_feminino_arquetipos', TRUE, 'ALTER TABLE public.eneagrama_feminino_orientacoes ADD CONSTRAINT eneagrama_feminino_orientacoes_arquetipo_id_fkey FOREIGN KEY (arquetipo_id) REFERENCES public.eneagrama_feminino_arquetipos(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('eneagrama_feminino_orientacoes_arquetipo_id_fkey', 'eneagrama_feminino_orientacoes', 'eneagrama_feminino_arquetipos', FALSE, 'ALTER TABLE public.eneagrama_feminino_orientacoes ADD CONSTRAINT eneagrama_feminino_orientacoes_arquetipo_id_fkey FOREIGN KEY (arquetipo_id) REFERENCES public.eneagrama_feminino_arquetipos(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'eneagrama_feminino_registros_session_case_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('eneagrama_feminino_registros_session_case_id_fkey', 'eneagrama_feminino_registros', 'session_cases', TRUE, 'ALTER TABLE public.eneagrama_feminino_registros ADD CONSTRAINT eneagrama_feminino_registros_session_case_id_fkey FOREIGN KEY (session_case_id) REFERENCES public.session_cases(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('eneagrama_feminino_registros_session_case_id_fkey', 'eneagrama_feminino_registros', 'session_cases', FALSE, 'ALTER TABLE public.eneagrama_feminino_registros ADD CONSTRAINT eneagrama_feminino_registros_session_case_id_fkey FOREIGN KEY (session_case_id) REFERENCES public.session_cases(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'eneagrama_feminino_registros_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('eneagrama_feminino_registros_user_id_fkey', 'eneagrama_feminino_registros', 'clientes', TRUE, 'ALTER TABLE public.eneagrama_feminino_registros ADD CONSTRAINT eneagrama_feminino_registros_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT escrita_nao_censurada_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('eneagrama_feminino_registros_user_id_fkey', 'eneagrama_feminino_registros', 'clientes', FALSE, 'ALTER TABLE public.eneagrama_feminino_registros ADD CONSTRAINT eneagrama_feminino_registros_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT escrita_nao_censurada_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'estudio_projetos_book_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('estudio_projetos_book_id_fkey', 'estudio_projetos', 'books', TRUE, 'ALTER TABLE public.estudio_projetos ADD CONSTRAINT estudio_projetos_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('estudio_projetos_book_id_fkey', 'estudio_projetos', 'books', FALSE, 'ALTER TABLE public.estudio_projetos ADD CONSTRAINT estudio_projetos_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'estudos_caso_respostas_estudo_caso_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('estudos_caso_respostas_estudo_caso_id_fkey', 'estudos_caso_respostas', 'estudos_caso', TRUE, 'ALTER TABLE public.estudos_caso_respostas ADD CONSTRAINT estudos_caso_respostas_estudo_caso_id_fkey FOREIGN KEY (estudo_caso_id) REFERENCES public.estudos_caso(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('estudos_caso_respostas_estudo_caso_id_fkey', 'estudos_caso_respostas', 'estudos_caso', FALSE, 'ALTER TABLE public.estudos_caso_respostas ADD CONSTRAINT estudos_caso_respostas_estudo_caso_id_fkey FOREIGN KEY (estudo_caso_id) REFERENCES public.estudos_caso(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'estudos_caso_respostas_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('estudos_caso_respostas_user_id_fkey', 'estudos_caso_respostas', 'exercises', TRUE, 'ALTER TABLE public.estudos_caso_respostas ADD CONSTRAINT estudos_caso_respostas_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: exercise_responses exercise_responses_exercise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exercise_responses
    ADD CONSTRAINT exercise_responses_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('estudos_caso_respostas_user_id_fkey', 'estudos_caso_respostas', 'exercises', FALSE, 'ALTER TABLE public.estudos_caso_respostas ADD CONSTRAINT estudos_caso_respostas_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: exercise_responses exercise_responses_exercise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exercise_responses
    ADD CONSTRAINT exercise_responses_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.exercises(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exercise_responses_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('exercise_responses_user_id_fkey', 'exercise_responses', 'lessons', TRUE, 'ALTER TABLE public.exercise_responses ADD CONSTRAINT exercise_responses_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: exercises exercises_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('exercise_responses_user_id_fkey', 'exercise_responses', 'lessons', FALSE, 'ALTER TABLE public.exercise_responses ADD CONSTRAINT exercise_responses_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: exercises exercises_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'facilitadora_profiles_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('facilitadora_profiles_user_id_fkey', 'facilitadora_profiles', 'clientes', TRUE, 'ALTER TABLE public.facilitadora_profiles ADD CONSTRAINT facilitadora_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: ferramenta_registros ferramenta_registros_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ferramenta_registros
    ADD CONSTRAINT ferramenta_registros_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('facilitadora_profiles_user_id_fkey', 'facilitadora_profiles', 'clientes', FALSE, 'ALTER TABLE public.facilitadora_profiles ADD CONSTRAINT facilitadora_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: ferramenta_registros ferramenta_registros_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ferramenta_registros
    ADD CONSTRAINT ferramenta_registros_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ferramenta_registros_ferramenta_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('ferramenta_registros_ferramenta_id_fkey', 'ferramenta_registros', 'sala_ferramentas', TRUE, 'ALTER TABLE public.ferramenta_registros ADD CONSTRAINT ferramenta_registros_ferramenta_id_fkey FOREIGN KEY (ferramenta_id) REFERENCES public.sala_ferramentas(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('ferramenta_registros_ferramenta_id_fkey', 'ferramenta_registros', 'sala_ferramentas', FALSE, 'ALTER TABLE public.ferramenta_registros ADD CONSTRAINT ferramenta_registros_ferramenta_id_fkey FOREIGN KEY (ferramenta_id) REFERENCES public.sala_ferramentas(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_big5_caso') THEN
        INSERT INTO fk_audit VALUES ('fk_big5_caso', 'big5_registros', 'casos', TRUE, 'ALTER TABLE public.big5_registros ADD CONSTRAINT fk_big5_caso FOREIGN KEY (caso_id) REFERENCES public.casos(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('fk_big5_caso', 'big5_registros', 'casos', FALSE, 'ALTER TABLE public.big5_registros ADD CONSTRAINT fk_big5_caso FOREIGN KEY (caso_id) REFERENCES public.casos(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_eneagrama_caso') THEN
        INSERT INTO fk_audit VALUES ('fk_eneagrama_caso', 'eneagrama_registros', 'casos', TRUE, 'ALTER TABLE public.eneagrama_registros ADD CONSTRAINT fk_eneagrama_caso FOREIGN KEY (caso_id) REFERENCES public.casos(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('fk_eneagrama_caso', 'eneagrama_registros', 'casos', FALSE, 'ALTER TABLE public.eneagrama_registros ADD CONSTRAINT fk_eneagrama_caso FOREIGN KEY (caso_id) REFERENCES public.casos(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'formacao_modulos_formacao_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('formacao_modulos_formacao_id_fkey', 'formacao_modulos', 'formacoes', TRUE, 'ALTER TABLE public.formacao_modulos ADD CONSTRAINT formacao_modulos_formacao_id_fkey FOREIGN KEY (formacao_id) REFERENCES public.formacoes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('formacao_modulos_formacao_id_fkey', 'formacao_modulos', 'formacoes', FALSE, 'ALTER TABLE public.formacao_modulos ADD CONSTRAINT formacao_modulos_formacao_id_fkey FOREIGN KEY (formacao_id) REFERENCES public.formacoes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'formacao_oracula_content_updated_by_fkey') THEN
        INSERT INTO fk_audit VALUES ('formacao_oracula_content_updated_by_fkey', 'formacao_oracula_content', 'city_districts', TRUE, 'ALTER TABLE public.formacao_oracula_content ADD CONSTRAINT formacao_oracula_content_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: founding_archetypes founding_archetypes_distrito_principal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.founding_archetypes
    ADD CONSTRAINT founding_archetypes_distrito_principal_id_fkey FOREIGN KEY (distrito_principal_id) REFERENCES public.city_districts(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('formacao_oracula_content_updated_by_fkey', 'formacao_oracula_content', 'city_districts', FALSE, 'ALTER TABLE public.formacao_oracula_content ADD CONSTRAINT formacao_oracula_content_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: founding_archetypes founding_archetypes_distrito_principal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.founding_archetypes
    ADD CONSTRAINT founding_archetypes_distrito_principal_id_fkey FOREIGN KEY (distrito_principal_id) REFERENCES public.city_districts(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'gestos_integracao_cliente_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('gestos_integracao_cliente_id_fkey', 'gestos_integracao', 'clientes', TRUE, 'ALTER TABLE public.gestos_integracao ADD CONSTRAINT gestos_integracao_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('gestos_integracao_cliente_id_fkey', 'gestos_integracao', 'clientes', FALSE, 'ALTER TABLE public.gestos_integracao ADD CONSTRAINT gestos_integracao_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'gestos_integracao_owner_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('gestos_integracao_owner_id_fkey', 'gestos_integracao', 'sessoes_casa_maquinas', TRUE, 'ALTER TABLE public.gestos_integracao ADD CONSTRAINT gestos_integracao_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: gestos_integracao gestos_integracao_sessao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gestos_integracao
    ADD CONSTRAINT gestos_integracao_sessao_id_fkey FOREIGN KEY (sessao_id) REFERENCES public.sessoes_casa_maquinas(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('gestos_integracao_owner_id_fkey', 'gestos_integracao', 'sessoes_casa_maquinas', FALSE, 'ALTER TABLE public.gestos_integracao ADD CONSTRAINT gestos_integracao_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: gestos_integracao gestos_integracao_sessao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gestos_integracao
    ADD CONSTRAINT gestos_integracao_sessao_id_fkey FOREIGN KEY (sessao_id) REFERENCES public.sessoes_casa_maquinas(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_encounters_group_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('group_encounters_group_id_fkey', 'group_encounters', 'therapy_groups', TRUE, 'ALTER TABLE public.group_encounters ADD CONSTRAINT group_encounters_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.therapy_groups(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('group_encounters_group_id_fkey', 'group_encounters', 'therapy_groups', FALSE, 'ALTER TABLE public.group_encounters ADD CONSTRAINT group_encounters_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.therapy_groups(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_field_snapshots_circulo_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('group_field_snapshots_circulo_id_fkey', 'group_field_snapshots', 'circulos_sagrados', TRUE, 'ALTER TABLE public.group_field_snapshots ADD CONSTRAINT group_field_snapshots_circulo_id_fkey FOREIGN KEY (circulo_id) REFERENCES public.circulos_sagrados(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('group_field_snapshots_circulo_id_fkey', 'group_field_snapshots', 'circulos_sagrados', FALSE, 'ALTER TABLE public.group_field_snapshots ADD CONSTRAINT group_field_snapshots_circulo_id_fkey FOREIGN KEY (circulo_id) REFERENCES public.circulos_sagrados(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_field_snapshots_group_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('group_field_snapshots_group_id_fkey', 'group_field_snapshots', 'therapeutic_groups', TRUE, 'ALTER TABLE public.group_field_snapshots ADD CONSTRAINT group_field_snapshots_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.therapeutic_groups(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('group_field_snapshots_group_id_fkey', 'group_field_snapshots', 'therapeutic_groups', FALSE, 'ALTER TABLE public.group_field_snapshots ADD CONSTRAINT group_field_snapshots_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.therapeutic_groups(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_members_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('group_members_client_id_fkey', 'group_members', 'clientes', TRUE, 'ALTER TABLE public.group_members ADD CONSTRAINT group_members_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('group_members_client_id_fkey', 'group_members', 'clientes', FALSE, 'ALTER TABLE public.group_members ADD CONSTRAINT group_members_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_members_group_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('group_members_group_id_fkey', 'group_members', 'therapy_groups', TRUE, 'ALTER TABLE public.group_members ADD CONSTRAINT group_members_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.therapy_groups(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('group_members_group_id_fkey', 'group_members', 'therapy_groups', FALSE, 'ALTER TABLE public.group_members ADD CONSTRAINT group_members_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.therapy_groups(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_participants_cliente_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('group_participants_cliente_id_fkey', 'group_participants', 'clientes', TRUE, 'ALTER TABLE public.group_participants ADD CONSTRAINT group_participants_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('group_participants_cliente_id_fkey', 'group_participants', 'clientes', FALSE, 'ALTER TABLE public.group_participants ADD CONSTRAINT group_participants_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_participants_group_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('group_participants_group_id_fkey', 'group_participants', 'therapeutic_groups', TRUE, 'ALTER TABLE public.group_participants ADD CONSTRAINT group_participants_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.therapeutic_groups(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('group_participants_group_id_fkey', 'group_participants', 'therapeutic_groups', FALSE, 'ALTER TABLE public.group_participants ADD CONSTRAINT group_participants_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.therapeutic_groups(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_sessions_group_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('group_sessions_group_id_fkey', 'group_sessions', 'therapeutic_groups', TRUE, 'ALTER TABLE public.group_sessions ADD CONSTRAINT group_sessions_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.therapeutic_groups(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('group_sessions_group_id_fkey', 'group_sessions', 'therapeutic_groups', FALSE, 'ALTER TABLE public.group_sessions ADD CONSTRAINT group_sessions_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.therapeutic_groups(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_sessions_therapist_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('group_sessions_therapist_id_fkey', 'group_sessions', 'labirinto_arquetipos', TRUE, 'ALTER TABLE public.group_sessions ADD CONSTRAINT group_sessions_therapist_id_fkey FOREIGN KEY (therapist_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: heroina_arquetipo_registros heroina_arquetipo_registros_arquetipo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.heroina_arquetipo_registros
    ADD CONSTRAINT heroina_arquetipo_registros_arquetipo_id_fkey FOREIGN KEY (arquetipo_id) REFERENCES public.labirinto_arquetipos(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('group_sessions_therapist_id_fkey', 'group_sessions', 'labirinto_arquetipos', FALSE, 'ALTER TABLE public.group_sessions ADD CONSTRAINT group_sessions_therapist_id_fkey FOREIGN KEY (therapist_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: heroina_arquetipo_registros heroina_arquetipo_registros_arquetipo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.heroina_arquetipo_registros
    ADD CONSTRAINT heroina_arquetipo_registros_arquetipo_id_fkey FOREIGN KEY (arquetipo_id) REFERENCES public.labirinto_arquetipos(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_arquetipo_registros_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('heroina_arquetipo_registros_user_id_fkey', 'heroina_arquetipo_registros', 'labirinto_metaforas', TRUE, 'ALTER TABLE public.heroina_arquetipo_registros ADD CONSTRAINT heroina_arquetipo_registros_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: heroina_cenario_registros heroina_cenario_registros_metafora_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.heroina_cenario_registros
    ADD CONSTRAINT heroina_cenario_registros_metafora_id_fkey FOREIGN KEY (metafora_id) REFERENCES public.labirinto_metaforas(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('heroina_arquetipo_registros_user_id_fkey', 'heroina_arquetipo_registros', 'labirinto_metaforas', FALSE, 'ALTER TABLE public.heroina_arquetipo_registros ADD CONSTRAINT heroina_arquetipo_registros_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: heroina_cenario_registros heroina_cenario_registros_metafora_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.heroina_cenario_registros
    ADD CONSTRAINT heroina_cenario_registros_metafora_id_fkey FOREIGN KEY (metafora_id) REFERENCES public.labirinto_metaforas(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_cenario_registros_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('heroina_cenario_registros_user_id_fkey', 'heroina_cenario_registros', 'labirinto_fases', TRUE, 'ALTER TABLE public.heroina_cenario_registros ADD CONSTRAINT heroina_cenario_registros_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: heroina_fase_ativa heroina_fase_ativa_fase_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.heroina_fase_ativa
    ADD CONSTRAINT heroina_fase_ativa_fase_id_fkey FOREIGN KEY (fase_id) REFERENCES public.labirinto_fases(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('heroina_cenario_registros_user_id_fkey', 'heroina_cenario_registros', 'labirinto_fases', FALSE, 'ALTER TABLE public.heroina_cenario_registros ADD CONSTRAINT heroina_cenario_registros_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: heroina_fase_ativa heroina_fase_ativa_fase_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.heroina_fase_ativa
    ADD CONSTRAINT heroina_fase_ativa_fase_id_fkey FOREIGN KEY (fase_id) REFERENCES public.labirinto_fases(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_fase_ativa_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('heroina_fase_ativa_user_id_fkey', 'heroina_fase_ativa', 'labirinto_rituais', TRUE, 'ALTER TABLE public.heroina_fase_ativa ADD CONSTRAINT heroina_fase_ativa_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT heroina_ritual_registros_ritual_id_fkey FOREIGN KEY (ritual_id) REFERENCES public.labirinto_rituais(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('heroina_fase_ativa_user_id_fkey', 'heroina_fase_ativa', 'labirinto_rituais', FALSE, 'ALTER TABLE public.heroina_fase_ativa ADD CONSTRAINT heroina_fase_ativa_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT heroina_ritual_registros_ritual_id_fkey FOREIGN KEY (ritual_id) REFERENCES public.labirinto_rituais(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'imaginacao_ativa_cliente_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('imaginacao_ativa_cliente_id_fkey', 'imaginacao_ativa', 'clientes', TRUE, 'ALTER TABLE public.imaginacao_ativa ADD CONSTRAINT imaginacao_ativa_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('imaginacao_ativa_cliente_id_fkey', 'imaginacao_ativa', 'clientes', FALSE, 'ALTER TABLE public.imaginacao_ativa ADD CONSTRAINT imaginacao_ativa_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'intervention_favorites_intervention_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('intervention_favorites_intervention_id_fkey', 'intervention_favorites', 'interventions', TRUE, 'ALTER TABLE public.intervention_favorites ADD CONSTRAINT intervention_favorites_intervention_id_fkey FOREIGN KEY (intervention_id) REFERENCES public.interventions(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('intervention_favorites_intervention_id_fkey', 'intervention_favorites', 'interventions', FALSE, 'ALTER TABLE public.intervention_favorites ADD CONSTRAINT intervention_favorites_intervention_id_fkey FOREIGN KEY (intervention_id) REFERENCES public.interventions(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'intervention_favorites_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('intervention_favorites_user_id_fkey', 'intervention_favorites', 'districts', TRUE, 'ALTER TABLE public.intervention_favorites ADD CONSTRAINT intervention_favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: interventions interventions_district_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interventions
    ADD CONSTRAINT interventions_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.districts(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('intervention_favorites_user_id_fkey', 'intervention_favorites', 'districts', FALSE, 'ALTER TABLE public.intervention_favorites ADD CONSTRAINT intervention_favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: interventions interventions_district_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interventions
    ADD CONSTRAINT interventions_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.districts(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'inventario_personas_cliente_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('inventario_personas_cliente_id_fkey', 'inventario_personas', 'clientes', TRUE, 'ALTER TABLE public.inventario_personas ADD CONSTRAINT inventario_personas_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('inventario_personas_cliente_id_fkey', 'inventario_personas', 'clientes', FALSE, 'ALTER TABLE public.inventario_personas ADD CONSTRAINT inventario_personas_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_do_oficio_cliente_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('jardim_do_oficio_cliente_id_fkey', 'jardim_do_oficio', 'clientes', TRUE, 'ALTER TABLE public.jardim_do_oficio ADD CONSTRAINT jardim_do_oficio_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('jardim_do_oficio_cliente_id_fkey', 'jardim_do_oficio', 'clientes', FALSE, 'ALTER TABLE public.jardim_do_oficio ADD CONSTRAINT jardim_do_oficio_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_do_oficio_sessao_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('jardim_do_oficio_sessao_id_fkey', 'jardim_do_oficio', 'sessoes_casa_maquinas', TRUE, 'ALTER TABLE public.jardim_do_oficio ADD CONSTRAINT jardim_do_oficio_sessao_id_fkey FOREIGN KEY (sessao_id) REFERENCES public.sessoes_casa_maquinas(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('jardim_do_oficio_sessao_id_fkey', 'jardim_do_oficio', 'sessoes_casa_maquinas', FALSE, 'ALTER TABLE public.jardim_do_oficio ADD CONSTRAINT jardim_do_oficio_sessao_id_fkey FOREIGN KEY (sessao_id) REFERENCES public.sessoes_casa_maquinas(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_do_oficio_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('jardim_do_oficio_user_id_fkey', 'jardim_do_oficio', 'therapeutic_groups', TRUE, 'ALTER TABLE public.jardim_do_oficio ADD CONSTRAINT jardim_do_oficio_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: jardim_grupo_registros jardim_grupo_registros_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jardim_grupo_registros
    ADD CONSTRAINT jardim_grupo_registros_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.therapeutic_groups(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('jardim_do_oficio_user_id_fkey', 'jardim_do_oficio', 'therapeutic_groups', FALSE, 'ALTER TABLE public.jardim_do_oficio ADD CONSTRAINT jardim_do_oficio_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: jardim_grupo_registros jardim_grupo_registros_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jardim_grupo_registros
    ADD CONSTRAINT jardim_grupo_registros_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.therapeutic_groups(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_grupo_registros_session_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('jardim_grupo_registros_session_id_fkey', 'jardim_grupo_registros', 'group_sessions', TRUE, 'ALTER TABLE public.jardim_grupo_registros ADD CONSTRAINT jardim_grupo_registros_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.group_sessions(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('jardim_grupo_registros_session_id_fkey', 'jardim_grupo_registros', 'group_sessions', FALSE, 'ALTER TABLE public.jardim_grupo_registros ADD CONSTRAINT jardim_grupo_registros_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.group_sessions(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_case_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('jardim_heroina_case_id_fkey', 'jardim_heroina', 'session_cases', TRUE, 'ALTER TABLE public.jardim_heroina ADD CONSTRAINT jardim_heroina_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.session_cases(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('jardim_heroina_case_id_fkey', 'jardim_heroina', 'session_cases', FALSE, 'ALTER TABLE public.jardim_heroina ADD CONSTRAINT jardim_heroina_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.session_cases(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('jardim_heroina_client_id_fkey', 'jardim_heroina', 'clientes', TRUE, 'ALTER TABLE public.jardim_heroina ADD CONSTRAINT jardim_heroina_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('jardim_heroina_client_id_fkey', 'jardim_heroina', 'clientes', FALSE, 'ALTER TABLE public.jardim_heroina ADD CONSTRAINT jardim_heroina_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_registros_mapa_vivo_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('jardim_heroina_registros_mapa_vivo_id_fkey', 'jardim_heroina_registros', 'mapa_vivo_heroina', TRUE, 'ALTER TABLE public.jardim_heroina_registros ADD CONSTRAINT jardim_heroina_registros_mapa_vivo_id_fkey FOREIGN KEY (mapa_vivo_id) REFERENCES public.mapa_vivo_heroina(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('jardim_heroina_registros_mapa_vivo_id_fkey', 'jardim_heroina_registros', 'mapa_vivo_heroina', FALSE, 'ALTER TABLE public.jardim_heroina_registros ADD CONSTRAINT jardim_heroina_registros_mapa_vivo_id_fkey FOREIGN KEY (mapa_vivo_id) REFERENCES public.mapa_vivo_heroina(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_registros_mapa_vivo_origem_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('jardim_heroina_registros_mapa_vivo_origem_id_fkey', 'jardim_heroina_registros', 'mapa_vivo_heroina', TRUE, 'ALTER TABLE public.jardim_heroina_registros ADD CONSTRAINT jardim_heroina_registros_mapa_vivo_origem_id_fkey FOREIGN KEY (mapa_vivo_origem_id) REFERENCES public.mapa_vivo_heroina(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('jardim_heroina_registros_mapa_vivo_origem_id_fkey', 'jardim_heroina_registros', 'mapa_vivo_heroina', FALSE, 'ALTER TABLE public.jardim_heroina_registros ADD CONSTRAINT jardim_heroina_registros_mapa_vivo_origem_id_fkey FOREIGN KEY (mapa_vivo_origem_id) REFERENCES public.mapa_vivo_heroina(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_registros_session_case_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('jardim_heroina_registros_session_case_id_fkey', 'jardim_heroina_registros', 'session_cases', TRUE, 'ALTER TABLE public.jardim_heroina_registros ADD CONSTRAINT jardim_heroina_registros_session_case_id_fkey FOREIGN KEY (session_case_id) REFERENCES public.session_cases(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('jardim_heroina_registros_session_case_id_fkey', 'jardim_heroina_registros', 'session_cases', FALSE, 'ALTER TABLE public.jardim_heroina_registros ADD CONSTRAINT jardim_heroina_registros_session_case_id_fkey FOREIGN KEY (session_case_id) REFERENCES public.session_cases(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_therapist_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('jardim_heroina_therapist_id_fkey', 'jardim_heroina', 'jornada_heroina_registros', TRUE, 'ALTER TABLE public.jardim_heroina ADD CONSTRAINT jardim_heroina_therapist_id_fkey FOREIGN KEY (therapist_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT jornada_heroina_notas_profissionais_registro_id_fkey FOREIGN KEY (registro_id) REFERENCES public.jornada_heroina_registros(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('jardim_heroina_therapist_id_fkey', 'jardim_heroina', 'jornada_heroina_registros', FALSE, 'ALTER TABLE public.jardim_heroina ADD CONSTRAINT jardim_heroina_therapist_id_fkey FOREIGN KEY (therapist_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT jornada_heroina_notas_profissionais_registro_id_fkey FOREIGN KEY (registro_id) REFERENCES public.jornada_heroina_registros(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_registros_cliente_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('jornada_heroina_registros_cliente_id_fkey', 'jornada_heroina_registros', 'clientes', TRUE, 'ALTER TABLE public.jornada_heroina_registros ADD CONSTRAINT jornada_heroina_registros_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('jornada_heroina_registros_cliente_id_fkey', 'jornada_heroina_registros', 'clientes', FALSE, 'ALTER TABLE public.jornada_heroina_registros ADD CONSTRAINT jornada_heroina_registros_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_registros_session_case_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('jornada_heroina_registros_session_case_id_fkey', 'jornada_heroina_registros', 'session_cases', TRUE, 'ALTER TABLE public.jornada_heroina_registros ADD CONSTRAINT jornada_heroina_registros_session_case_id_fkey FOREIGN KEY (session_case_id) REFERENCES public.session_cases(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('jornada_heroina_registros_session_case_id_fkey', 'jornada_heroina_registros', 'session_cases', FALSE, 'ALTER TABLE public.jornada_heroina_registros ADD CONSTRAINT jornada_heroina_registros_session_case_id_fkey FOREIGN KEY (session_case_id) REFERENCES public.session_cases(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_respostas_registro_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('jornada_heroina_respostas_registro_id_fkey', 'jornada_heroina_respostas', 'jornada_heroina_registros', TRUE, 'ALTER TABLE public.jornada_heroina_respostas ADD CONSTRAINT jornada_heroina_respostas_registro_id_fkey FOREIGN KEY (registro_id) REFERENCES public.jornada_heroina_registros(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('jornada_heroina_respostas_registro_id_fkey', 'jornada_heroina_respostas', 'jornada_heroina_registros', FALSE, 'ALTER TABLE public.jornada_heroina_respostas ADD CONSTRAINT jornada_heroina_respostas_registro_id_fkey FOREIGN KEY (registro_id) REFERENCES public.jornada_heroina_registros(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_individuacao_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('jornada_individuacao_client_id_fkey', 'jornada_individuacao', 'clientes', TRUE, 'ALTER TABLE public.jornada_individuacao ADD CONSTRAINT jornada_individuacao_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('jornada_individuacao_client_id_fkey', 'jornada_individuacao', 'clientes', FALSE, 'ALTER TABLE public.jornada_individuacao ADD CONSTRAINT jornada_individuacao_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_individuacao_therapist_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('jornada_individuacao_therapist_id_fkey', 'jornada_individuacao', 'districts', TRUE, 'ALTER TABLE public.jornada_individuacao ADD CONSTRAINT jornada_individuacao_therapist_id_fkey FOREIGN KEY (therapist_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: jornada_progressao jornada_progressao_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jornada_progressao
    ADD CONSTRAINT jornada_progressao_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: journey_districts journey_districts_district_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journey_districts
    ADD CONSTRAINT journey_districts_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.districts(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('jornada_individuacao_therapist_id_fkey', 'jornada_individuacao', 'districts', FALSE, 'ALTER TABLE public.jornada_individuacao ADD CONSTRAINT jornada_individuacao_therapist_id_fkey FOREIGN KEY (therapist_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: jornada_progressao jornada_progressao_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jornada_progressao
    ADD CONSTRAINT jornada_progressao_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: journey_districts journey_districts_district_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journey_districts
    ADD CONSTRAINT journey_districts_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.districts(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_districts_journey_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('journey_districts_journey_id_fkey', 'journey_districts', 'journeys', TRUE, 'ALTER TABLE public.journey_districts ADD CONSTRAINT journey_districts_journey_id_fkey FOREIGN KEY (journey_id) REFERENCES public.journeys(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('journey_districts_journey_id_fkey', 'journey_districts', 'journeys', FALSE, 'ALTER TABLE public.journey_districts ADD CONSTRAINT journey_districts_journey_id_fkey FOREIGN KEY (journey_id) REFERENCES public.journeys(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_events_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('journey_events_client_id_fkey', 'journey_events', 'clientes', TRUE, 'ALTER TABLE public.journey_events ADD CONSTRAINT journey_events_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('journey_events_client_id_fkey', 'journey_events', 'clientes', FALSE, 'ALTER TABLE public.journey_events ADD CONSTRAINT journey_events_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_events_session_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('journey_events_session_id_fkey', 'journey_events', 'sessions', TRUE, 'ALTER TABLE public.journey_events ADD CONSTRAINT journey_events_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('journey_events_session_id_fkey', 'journey_events', 'sessions', FALSE, 'ALTER TABLE public.journey_events ADD CONSTRAINT journey_events_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_events_therapist_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('journey_events_therapist_id_fkey', 'journey_events', 'clube_jornadas', TRUE, 'ALTER TABLE public.journey_events ADD CONSTRAINT journey_events_therapist_id_fkey FOREIGN KEY (therapist_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: journey_media journey_media_journey_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journey_media
    ADD CONSTRAINT journey_media_journey_id_fkey FOREIGN KEY (journey_id) REFERENCES public.clube_jornadas(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('journey_events_therapist_id_fkey', 'journey_events', 'clube_jornadas', FALSE, 'ALTER TABLE public.journey_events ADD CONSTRAINT journey_events_therapist_id_fkey FOREIGN KEY (therapist_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: journey_media journey_media_journey_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journey_media
    ADD CONSTRAINT journey_media_journey_id_fkey FOREIGN KEY (journey_id) REFERENCES public.clube_jornadas(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_reflections_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('journey_reflections_client_id_fkey', 'journey_reflections', 'clientes', TRUE, 'ALTER TABLE public.journey_reflections ADD CONSTRAINT journey_reflections_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('journey_reflections_client_id_fkey', 'journey_reflections', 'clientes', FALSE, 'ALTER TABLE public.journey_reflections ADD CONSTRAINT journey_reflections_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_reflections_therapist_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('journey_reflections_therapist_id_fkey', 'journey_reflections', 'clientes', TRUE, 'ALTER TABLE public.journey_reflections ADD CONSTRAINT journey_reflections_therapist_id_fkey FOREIGN KEY (therapist_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: journeys journeys_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journeys
    ADD CONSTRAINT journeys_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('journey_reflections_therapist_id_fkey', 'journey_reflections', 'clientes', FALSE, 'ALTER TABLE public.journey_reflections ADD CONSTRAINT journey_reflections_therapist_id_fkey FOREIGN KEY (therapist_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: journeys journeys_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journeys
    ADD CONSTRAINT journeys_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journeys_current_district_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('journeys_current_district_id_fkey', 'journeys', 'districts', TRUE, 'ALTER TABLE public.journeys ADD CONSTRAINT journeys_current_district_id_fkey FOREIGN KEY (current_district_id) REFERENCES public.districts(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('journeys_current_district_id_fkey', 'journeys', 'districts', FALSE, 'ALTER TABLE public.journeys ADD CONSTRAINT journeys_current_district_id_fkey FOREIGN KEY (current_district_id) REFERENCES public.districts(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lab_8020_progress_book_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('lab_8020_progress_book_id_fkey', 'lab_8020_progress', 'books', TRUE, 'ALTER TABLE public.lab_8020_progress ADD CONSTRAINT lab_8020_progress_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('lab_8020_progress_book_id_fkey', 'lab_8020_progress', 'books', FALSE, 'ALTER TABLE public.lab_8020_progress ADD CONSTRAINT lab_8020_progress_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lab_8020_progress_season_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('lab_8020_progress_season_id_fkey', 'lab_8020_progress', 'oracular_seasons', TRUE, 'ALTER TABLE public.lab_8020_progress ADD CONSTRAINT lab_8020_progress_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.oracular_seasons(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('lab_8020_progress_season_id_fkey', 'lab_8020_progress', 'oracular_seasons', FALSE, 'ALTER TABLE public.lab_8020_progress ADD CONSTRAINT lab_8020_progress_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.oracular_seasons(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_39_portas_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('labirinto_39_portas_client_id_fkey', 'labirinto_39_portas', 'clientes', TRUE, 'ALTER TABLE public.labirinto_39_portas ADD CONSTRAINT labirinto_39_portas_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('labirinto_39_portas_client_id_fkey', 'labirinto_39_portas', 'clientes', FALSE, 'ALTER TABLE public.labirinto_39_portas ADD CONSTRAINT labirinto_39_portas_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_anotacoes_cliente_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('labirinto_anotacoes_cliente_id_fkey', 'labirinto_anotacoes', 'clientes', TRUE, 'ALTER TABLE public.labirinto_anotacoes ADD CONSTRAINT labirinto_anotacoes_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('labirinto_anotacoes_cliente_id_fkey', 'labirinto_anotacoes', 'clientes', FALSE, 'ALTER TABLE public.labirinto_anotacoes ADD CONSTRAINT labirinto_anotacoes_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_anotacoes_porta_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('labirinto_anotacoes_porta_id_fkey', 'labirinto_anotacoes', 'labirinto_portas', TRUE, 'ALTER TABLE public.labirinto_anotacoes ADD CONSTRAINT labirinto_anotacoes_porta_id_fkey FOREIGN KEY (porta_id) REFERENCES public.labirinto_portas(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('labirinto_anotacoes_porta_id_fkey', 'labirinto_anotacoes', 'labirinto_portas', FALSE, 'ALTER TABLE public.labirinto_anotacoes ADD CONSTRAINT labirinto_anotacoes_porta_id_fkey FOREIGN KEY (porta_id) REFERENCES public.labirinto_portas(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_leituras_cliente_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('labirinto_leituras_cliente_id_fkey', 'labirinto_leituras', 'clientes', TRUE, 'ALTER TABLE public.labirinto_leituras ADD CONSTRAINT labirinto_leituras_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('labirinto_leituras_cliente_id_fkey', 'labirinto_leituras', 'clientes', FALSE, 'ALTER TABLE public.labirinto_leituras ADD CONSTRAINT labirinto_leituras_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_leituras_porta_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('labirinto_leituras_porta_id_fkey', 'labirinto_leituras', 'labirinto_portas', TRUE, 'ALTER TABLE public.labirinto_leituras ADD CONSTRAINT labirinto_leituras_porta_id_fkey FOREIGN KEY (porta_id) REFERENCES public.labirinto_portas(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('labirinto_leituras_porta_id_fkey', 'labirinto_leituras', 'labirinto_portas', FALSE, 'ALTER TABLE public.labirinto_leituras ADD CONSTRAINT labirinto_leituras_porta_id_fkey FOREIGN KEY (porta_id) REFERENCES public.labirinto_portas(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_arquetipo_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('labirinto_registros_arquetipo_id_fkey', 'labirinto_registros', 'labirinto_arquetipos', TRUE, 'ALTER TABLE public.labirinto_registros ADD CONSTRAINT labirinto_registros_arquetipo_id_fkey FOREIGN KEY (arquetipo_id) REFERENCES public.labirinto_arquetipos(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('labirinto_registros_arquetipo_id_fkey', 'labirinto_registros', 'labirinto_arquetipos', FALSE, 'ALTER TABLE public.labirinto_registros ADD CONSTRAINT labirinto_registros_arquetipo_id_fkey FOREIGN KEY (arquetipo_id) REFERENCES public.labirinto_arquetipos(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_fase_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('labirinto_registros_fase_id_fkey', 'labirinto_registros', 'labirinto_fases', TRUE, 'ALTER TABLE public.labirinto_registros ADD CONSTRAINT labirinto_registros_fase_id_fkey FOREIGN KEY (fase_id) REFERENCES public.labirinto_fases(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('labirinto_registros_fase_id_fkey', 'labirinto_registros', 'labirinto_fases', FALSE, 'ALTER TABLE public.labirinto_registros ADD CONSTRAINT labirinto_registros_fase_id_fkey FOREIGN KEY (fase_id) REFERENCES public.labirinto_fases(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_metafora_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('labirinto_registros_metafora_id_fkey', 'labirinto_registros', 'labirinto_metaforas', TRUE, 'ALTER TABLE public.labirinto_registros ADD CONSTRAINT labirinto_registros_metafora_id_fkey FOREIGN KEY (metafora_id) REFERENCES public.labirinto_metaforas(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('labirinto_registros_metafora_id_fkey', 'labirinto_registros', 'labirinto_metaforas', FALSE, 'ALTER TABLE public.labirinto_registros ADD CONSTRAINT labirinto_registros_metafora_id_fkey FOREIGN KEY (metafora_id) REFERENCES public.labirinto_metaforas(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_ritual_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('labirinto_registros_ritual_id_fkey', 'labirinto_registros', 'labirinto_rituais', TRUE, 'ALTER TABLE public.labirinto_registros ADD CONSTRAINT labirinto_registros_ritual_id_fkey FOREIGN KEY (ritual_id) REFERENCES public.labirinto_rituais(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('labirinto_registros_ritual_id_fkey', 'labirinto_registros', 'labirinto_rituais', FALSE, 'ALTER TABLE public.labirinto_registros ADD CONSTRAINT labirinto_registros_ritual_id_fkey FOREIGN KEY (ritual_id) REFERENCES public.labirinto_rituais(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_session_case_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('labirinto_registros_session_case_id_fkey', 'labirinto_registros', 'session_cases', TRUE, 'ALTER TABLE public.labirinto_registros ADD CONSTRAINT labirinto_registros_session_case_id_fkey FOREIGN KEY (session_case_id) REFERENCES public.session_cases(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('labirinto_registros_session_case_id_fkey', 'labirinto_registros', 'session_cases', FALSE, 'ALTER TABLE public.labirinto_registros ADD CONSTRAINT labirinto_registros_session_case_id_fkey FOREIGN KEY (session_case_id) REFERENCES public.session_cases(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_terapeuta_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('labirinto_registros_terapeuta_id_fkey', 'labirinto_registros', 'labirinto_arquetipos', TRUE, 'ALTER TABLE public.labirinto_registros ADD CONSTRAINT labirinto_registros_terapeuta_id_fkey FOREIGN KEY (terapeuta_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: labirinto_registros labirinto_registros_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.labirinto_registros
    ADD CONSTRAINT labirinto_registros_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: labirinto_roteiros_gerados labirinto_roteiros_gerados_arquetipo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.labirinto_roteiros_gerados
    ADD CONSTRAINT labirinto_roteiros_gerados_arquetipo_id_fkey FOREIGN KEY (arquetipo_id) REFERENCES public.labirinto_arquetipos(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('labirinto_registros_terapeuta_id_fkey', 'labirinto_registros', 'labirinto_arquetipos', FALSE, 'ALTER TABLE public.labirinto_registros ADD CONSTRAINT labirinto_registros_terapeuta_id_fkey FOREIGN KEY (terapeuta_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: labirinto_registros labirinto_registros_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.labirinto_registros
    ADD CONSTRAINT labirinto_registros_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: labirinto_roteiros_gerados labirinto_roteiros_gerados_arquetipo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.labirinto_roteiros_gerados
    ADD CONSTRAINT labirinto_roteiros_gerados_arquetipo_id_fkey FOREIGN KEY (arquetipo_id) REFERENCES public.labirinto_arquetipos(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_fase_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('labirinto_roteiros_gerados_fase_id_fkey', 'labirinto_roteiros_gerados', 'labirinto_fases', TRUE, 'ALTER TABLE public.labirinto_roteiros_gerados ADD CONSTRAINT labirinto_roteiros_gerados_fase_id_fkey FOREIGN KEY (fase_id) REFERENCES public.labirinto_fases(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('labirinto_roteiros_gerados_fase_id_fkey', 'labirinto_roteiros_gerados', 'labirinto_fases', FALSE, 'ALTER TABLE public.labirinto_roteiros_gerados ADD CONSTRAINT labirinto_roteiros_gerados_fase_id_fkey FOREIGN KEY (fase_id) REFERENCES public.labirinto_fases(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_metafora_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('labirinto_roteiros_gerados_metafora_id_fkey', 'labirinto_roteiros_gerados', 'labirinto_metaforas', TRUE, 'ALTER TABLE public.labirinto_roteiros_gerados ADD CONSTRAINT labirinto_roteiros_gerados_metafora_id_fkey FOREIGN KEY (metafora_id) REFERENCES public.labirinto_metaforas(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('labirinto_roteiros_gerados_metafora_id_fkey', 'labirinto_roteiros_gerados', 'labirinto_metaforas', FALSE, 'ALTER TABLE public.labirinto_roteiros_gerados ADD CONSTRAINT labirinto_roteiros_gerados_metafora_id_fkey FOREIGN KEY (metafora_id) REFERENCES public.labirinto_metaforas(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_ritual_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('labirinto_roteiros_gerados_ritual_id_fkey', 'labirinto_roteiros_gerados', 'labirinto_rituais', TRUE, 'ALTER TABLE public.labirinto_roteiros_gerados ADD CONSTRAINT labirinto_roteiros_gerados_ritual_id_fkey FOREIGN KEY (ritual_id) REFERENCES public.labirinto_rituais(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('labirinto_roteiros_gerados_ritual_id_fkey', 'labirinto_roteiros_gerados', 'labirinto_rituais', FALSE, 'ALTER TABLE public.labirinto_roteiros_gerados ADD CONSTRAINT labirinto_roteiros_gerados_ritual_id_fkey FOREIGN KEY (ritual_id) REFERENCES public.labirinto_rituais(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_session_case_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('labirinto_roteiros_gerados_session_case_id_fkey', 'labirinto_roteiros_gerados', 'session_cases', TRUE, 'ALTER TABLE public.labirinto_roteiros_gerados ADD CONSTRAINT labirinto_roteiros_gerados_session_case_id_fkey FOREIGN KEY (session_case_id) REFERENCES public.session_cases(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('labirinto_roteiros_gerados_session_case_id_fkey', 'labirinto_roteiros_gerados', 'session_cases', FALSE, 'ALTER TABLE public.labirinto_roteiros_gerados ADD CONSTRAINT labirinto_roteiros_gerados_session_case_id_fkey FOREIGN KEY (session_case_id) REFERENCES public.session_cases(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labyrinth_records_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('labyrinth_records_client_id_fkey', 'labyrinth_records', 'clientes', TRUE, 'ALTER TABLE public.labyrinth_records ADD CONSTRAINT labyrinth_records_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('labyrinth_records_client_id_fkey', 'labyrinth_records', 'clientes', FALSE, 'ALTER TABLE public.labyrinth_records ADD CONSTRAINT labyrinth_records_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labyrinth_records_session_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('labyrinth_records_session_id_fkey', 'labyrinth_records', 'sessions', TRUE, 'ALTER TABLE public.labyrinth_records ADD CONSTRAINT labyrinth_records_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('labyrinth_records_session_id_fkey', 'labyrinth_records', 'sessions', FALSE, 'ALTER TABLE public.labyrinth_records ADD CONSTRAINT labyrinth_records_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lessons_album_book_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('lessons_album_book_id_fkey', 'lessons_album', 'books', TRUE, 'ALTER TABLE public.lessons_album ADD CONSTRAINT lessons_album_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('lessons_album_book_id_fkey', 'lessons_album', 'books', FALSE, 'ALTER TABLE public.lessons_album ADD CONSTRAINT lessons_album_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lessons_travessia_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('lessons_travessia_id_fkey', 'lessons', 'travessias', TRUE, 'ALTER TABLE public.lessons ADD CONSTRAINT lessons_travessia_id_fkey FOREIGN KEY (travessia_id) REFERENCES public.travessias(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('lessons_travessia_id_fkey', 'lessons', 'travessias', FALSE, 'ALTER TABLE public.lessons ADD CONSTRAINT lessons_travessia_id_fkey FOREIGN KEY (travessia_id) REFERENCES public.travessias(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'library_items_created_by_fkey') THEN
        INSERT INTO fk_audit VALUES ('library_items_created_by_fkey', 'library_items', 'labirinto_fases', TRUE, 'ALTER TABLE public.library_items ADD CONSTRAINT library_items_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: mapa_heroina mapa_heroina_porta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mapa_heroina
    ADD CONSTRAINT mapa_heroina_porta_id_fkey FOREIGN KEY (porta_id) REFERENCES public.labirinto_fases(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('library_items_created_by_fkey', 'library_items', 'labirinto_fases', FALSE, 'ALTER TABLE public.library_items ADD CONSTRAINT library_items_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: mapa_heroina mapa_heroina_porta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mapa_heroina
    ADD CONSTRAINT mapa_heroina_porta_id_fkey FOREIGN KEY (porta_id) REFERENCES public.labirinto_fases(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_sombra_cliente_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('mapa_sombra_cliente_id_fkey', 'mapa_sombra', 'clientes', TRUE, 'ALTER TABLE public.mapa_sombra ADD CONSTRAINT mapa_sombra_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('mapa_sombra_cliente_id_fkey', 'mapa_sombra', 'clientes', FALSE, 'ALTER TABLE public.mapa_sombra ADD CONSTRAINT mapa_sombra_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_vivo_heroina_gesto_jardim_registro_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('mapa_vivo_heroina_gesto_jardim_registro_id_fkey', 'mapa_vivo_heroina', 'jardim_heroina_registros', TRUE, 'ALTER TABLE public.mapa_vivo_heroina ADD CONSTRAINT mapa_vivo_heroina_gesto_jardim_registro_id_fkey FOREIGN KEY (gesto_jardim_registro_id) REFERENCES public.jardim_heroina_registros(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('mapa_vivo_heroina_gesto_jardim_registro_id_fkey', 'mapa_vivo_heroina', 'jardim_heroina_registros', FALSE, 'ALTER TABLE public.mapa_vivo_heroina ADD CONSTRAINT mapa_vivo_heroina_gesto_jardim_registro_id_fkey FOREIGN KEY (gesto_jardim_registro_id) REFERENCES public.jardim_heroina_registros(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_vivo_heroina_session_case_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('mapa_vivo_heroina_session_case_id_fkey', 'mapa_vivo_heroina', 'session_cases', TRUE, 'ALTER TABLE public.mapa_vivo_heroina ADD CONSTRAINT mapa_vivo_heroina_session_case_id_fkey FOREIGN KEY (session_case_id) REFERENCES public.session_cases(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('mapa_vivo_heroina_session_case_id_fkey', 'mapa_vivo_heroina', 'session_cases', FALSE, 'ALTER TABLE public.mapa_vivo_heroina ADD CONSTRAINT mapa_vivo_heroina_session_case_id_fkey FOREIGN KEY (session_case_id) REFERENCES public.session_cases(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_vivo_historico_mapa_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('mapa_vivo_historico_mapa_id_fkey', 'mapa_vivo_historico', 'mapa_vivo_heroina', TRUE, 'ALTER TABLE public.mapa_vivo_historico ADD CONSTRAINT mapa_vivo_historico_mapa_id_fkey FOREIGN KEY (mapa_id) REFERENCES public.mapa_vivo_heroina(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('mapa_vivo_historico_mapa_id_fkey', 'mapa_vivo_historico', 'mapa_vivo_heroina', FALSE, 'ALTER TABLE public.mapa_vivo_historico ADD CONSTRAINT mapa_vivo_historico_mapa_id_fkey FOREIGN KEY (mapa_id) REFERENCES public.mapa_vivo_heroina(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapeamento_complexos_cliente_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('mapeamento_complexos_cliente_id_fkey', 'mapeamento_complexos', 'clientes', TRUE, 'ALTER TABLE public.mapeamento_complexos ADD CONSTRAINT mapeamento_complexos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('mapeamento_complexos_cliente_id_fkey', 'mapeamento_complexos', 'clientes', FALSE, 'ALTER TABLE public.mapeamento_complexos ADD CONSTRAINT mapeamento_complexos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'matriculas_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('matriculas_user_id_fkey', 'matriculas', 'message_campaigns', TRUE, 'ALTER TABLE public.matriculas ADD CONSTRAINT matriculas_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: message_campaigns message_campaigns_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_campaigns
    ADD CONSTRAINT message_campaigns_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: message_logs message_logs_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_logs
    ADD CONSTRAINT message_logs_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.message_campaigns(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('matriculas_user_id_fkey', 'matriculas', 'message_campaigns', FALSE, 'ALTER TABLE public.matriculas ADD CONSTRAINT matriculas_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: message_campaigns message_campaigns_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_campaigns
    ADD CONSTRAINT message_campaigns_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: message_logs message_logs_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_logs
    ADD CONSTRAINT message_logs_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.message_campaigns(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'message_logs_template_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('message_logs_template_id_fkey', 'message_logs', 'message_templates', TRUE, 'ALTER TABLE public.message_logs ADD CONSTRAINT message_logs_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.message_templates(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('message_logs_template_id_fkey', 'message_logs', 'message_templates', FALSE, 'ALTER TABLE public.message_logs ADD CONSTRAINT message_logs_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.message_templates(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'message_logs_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('message_logs_user_id_fkey', 'message_logs', 'mind_maps', TRUE, 'ALTER TABLE public.message_logs ADD CONSTRAINT message_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: message_templates message_templates_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_templates
    ADD CONSTRAINT message_templates_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: mind_map_nodes mind_map_nodes_map_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mind_map_nodes
    ADD CONSTRAINT mind_map_nodes_map_id_fkey FOREIGN KEY (map_id) REFERENCES public.mind_maps(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('message_logs_user_id_fkey', 'message_logs', 'mind_maps', FALSE, 'ALTER TABLE public.message_logs ADD CONSTRAINT message_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: message_templates message_templates_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_templates
    ADD CONSTRAINT message_templates_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: mind_map_nodes mind_map_nodes_map_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mind_map_nodes
    ADD CONSTRAINT mind_map_nodes_map_id_fkey FOREIGN KEY (map_id) REFERENCES public.mind_maps(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mind_map_nodes_parent_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('mind_map_nodes_parent_id_fkey', 'mind_map_nodes', 'mind_map_nodes', TRUE, 'ALTER TABLE public.mind_map_nodes ADD CONSTRAINT mind_map_nodes_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.mind_map_nodes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('mind_map_nodes_parent_id_fkey', 'mind_map_nodes', 'mind_map_nodes', FALSE, 'ALTER TABLE public.mind_map_nodes ADD CONSTRAINT mind_map_nodes_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.mind_map_nodes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mind_maps_owner_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('mind_maps_owner_id_fkey', 'mind_maps', 'profiles', TRUE, 'ALTER TABLE public.mind_maps ADD CONSTRAINT mind_maps_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.profiles(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('mind_maps_owner_id_fkey', 'mind_maps', 'profiles', FALSE, 'ALTER TABLE public.mind_maps ADD CONSTRAINT mind_maps_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.profiles(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'missoes_aula_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('missoes_aula_id_fkey', 'missoes', 'aulas', TRUE, 'ALTER TABLE public.missoes ADD CONSTRAINT missoes_aula_id_fkey FOREIGN KEY (aula_id) REFERENCES public.aulas(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('missoes_aula_id_fkey', 'missoes', 'aulas', FALSE, 'ALTER TABLE public.missoes ADD CONSTRAINT missoes_aula_id_fkey FOREIGN KEY (aula_id) REFERENCES public.aulas(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'missoes_created_by_fkey') THEN
        INSERT INTO fk_audit VALUES ('missoes_created_by_fkey', 'missoes', 'portais', TRUE, 'ALTER TABLE public.missoes ADD CONSTRAINT missoes_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: missoes missoes_portal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.missoes
    ADD CONSTRAINT missoes_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.portais(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('missoes_created_by_fkey', 'missoes', 'portais', FALSE, 'ALTER TABLE public.missoes ADD CONSTRAINT missoes_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: missoes missoes_portal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.missoes
    ADD CONSTRAINT missoes_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.portais(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narrative_maps_case_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('narrative_maps_case_id_fkey', 'narrative_maps', 'session_cases', TRUE, 'ALTER TABLE public.narrative_maps ADD CONSTRAINT narrative_maps_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.session_cases(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('narrative_maps_case_id_fkey', 'narrative_maps', 'session_cases', FALSE, 'ALTER TABLE public.narrative_maps ADD CONSTRAINT narrative_maps_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.session_cases(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narrative_maps_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('narrative_maps_client_id_fkey', 'narrative_maps', 'profiles', TRUE, 'ALTER TABLE public.narrative_maps ADD CONSTRAINT narrative_maps_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.profiles(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('narrative_maps_client_id_fkey', 'narrative_maps', 'profiles', FALSE, 'ALTER TABLE public.narrative_maps ADD CONSTRAINT narrative_maps_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.profiles(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narrative_maps_therapist_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('narrative_maps_therapist_id_fkey', 'narrative_maps', 'profiles', TRUE, 'ALTER TABLE public.narrative_maps ADD CONSTRAINT narrative_maps_therapist_id_fkey FOREIGN KEY (therapist_id) REFERENCES public.profiles(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('narrative_maps_therapist_id_fkey', 'narrative_maps', 'profiles', FALSE, 'ALTER TABLE public.narrative_maps ADD CONSTRAINT narrative_maps_therapist_id_fkey FOREIGN KEY (therapist_id) REFERENCES public.profiles(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narroterapia_estudos_audio_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('narroterapia_estudos_audio_id_fkey', 'narroterapia_estudos', 'audio_assets', TRUE, 'ALTER TABLE public.narroterapia_estudos ADD CONSTRAINT narroterapia_estudos_audio_id_fkey FOREIGN KEY (audio_id) REFERENCES public.audio_assets(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('narroterapia_estudos_audio_id_fkey', 'narroterapia_estudos', 'audio_assets', FALSE, 'ALTER TABLE public.narroterapia_estudos ADD CONSTRAINT narroterapia_estudos_audio_id_fkey FOREIGN KEY (audio_id) REFERENCES public.audio_assets(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narroterapia_reacoes_simbolicas_audio_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('narroterapia_reacoes_simbolicas_audio_id_fkey', 'narroterapia_reacoes_simbolicas', 'audio_assets', TRUE, 'ALTER TABLE public.narroterapia_reacoes_simbolicas ADD CONSTRAINT narroterapia_reacoes_simbolicas_audio_id_fkey FOREIGN KEY (audio_id) REFERENCES public.audio_assets(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('narroterapia_reacoes_simbolicas_audio_id_fkey', 'narroterapia_reacoes_simbolicas', 'audio_assets', FALSE, 'ALTER TABLE public.narroterapia_reacoes_simbolicas ADD CONSTRAINT narroterapia_reacoes_simbolicas_audio_id_fkey FOREIGN KEY (audio_id) REFERENCES public.audio_assets(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narroterapia_reacoes_simbolicas_conto_clinico_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('narroterapia_reacoes_simbolicas_conto_clinico_id_fkey', 'narroterapia_reacoes_simbolicas', 'contos_clinicos', TRUE, 'ALTER TABLE public.narroterapia_reacoes_simbolicas ADD CONSTRAINT narroterapia_reacoes_simbolicas_conto_clinico_id_fkey FOREIGN KEY (conto_clinico_id) REFERENCES public.contos_clinicos(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('narroterapia_reacoes_simbolicas_conto_clinico_id_fkey', 'narroterapia_reacoes_simbolicas', 'contos_clinicos', FALSE, 'ALTER TABLE public.narroterapia_reacoes_simbolicas ADD CONSTRAINT narroterapia_reacoes_simbolicas_conto_clinico_id_fkey FOREIGN KEY (conto_clinico_id) REFERENCES public.contos_clinicos(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'notification_logs_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('notification_logs_user_id_fkey', 'notification_logs', 'founding_archetypes', TRUE, 'ALTER TABLE public.notification_logs ADD CONSTRAINT notification_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT oracle_cards_archetype_id_fkey FOREIGN KEY (archetype_id) REFERENCES public.founding_archetypes(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('notification_logs_user_id_fkey', 'notification_logs', 'founding_archetypes', FALSE, 'ALTER TABLE public.notification_logs ADD CONSTRAINT notification_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT oracle_cards_archetype_id_fkey FOREIGN KEY (archetype_id) REFERENCES public.founding_archetypes(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_cards_deck_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('oracle_cards_deck_id_fkey', 'oracle_cards', 'oracle_decks', TRUE, 'ALTER TABLE public.oracle_cards ADD CONSTRAINT oracle_cards_deck_id_fkey FOREIGN KEY (deck_id) REFERENCES public.oracle_decks(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('oracle_cards_deck_id_fkey', 'oracle_cards', 'oracle_decks', FALSE, 'ALTER TABLE public.oracle_cards ADD CONSTRAINT oracle_cards_deck_id_fkey FOREIGN KEY (deck_id) REFERENCES public.oracle_decks(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_cards_district_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('oracle_cards_district_id_fkey', 'oracle_cards', 'city_districts', TRUE, 'ALTER TABLE public.oracle_cards ADD CONSTRAINT oracle_cards_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.city_districts(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('oracle_cards_district_id_fkey', 'oracle_cards', 'city_districts', FALSE, 'ALTER TABLE public.oracle_cards ADD CONSTRAINT oracle_cards_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.city_districts(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_cards_tool_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('oracle_cards_tool_id_fkey', 'oracle_cards', 'tools', TRUE, 'ALTER TABLE public.oracle_cards ADD CONSTRAINT oracle_cards_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES public.tools(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('oracle_cards_tool_id_fkey', 'oracle_cards', 'tools', FALSE, 'ALTER TABLE public.oracle_cards ADD CONSTRAINT oracle_cards_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES public.tools(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_categories_oracle_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('oracle_categories_oracle_id_fkey', 'oracle_categories', 'oracle_decks', TRUE, 'ALTER TABLE public.oracle_categories ADD CONSTRAINT oracle_categories_oracle_id_fkey FOREIGN KEY (oracle_id) REFERENCES public.oracle_decks(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('oracle_categories_oracle_id_fkey', 'oracle_categories', 'oracle_decks', FALSE, 'ALTER TABLE public.oracle_categories ADD CONSTRAINT oracle_categories_oracle_id_fkey FOREIGN KEY (oracle_id) REFERENCES public.oracle_decks(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_clients_therapist_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('oracle_clients_therapist_user_id_fkey', 'oracle_clients', 'oracle_clients', TRUE, 'ALTER TABLE public.oracle_clients ADD CONSTRAINT oracle_clients_therapist_user_id_fkey FOREIGN KEY (therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oracle_decks oracle_decks_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oracle_decks
    ADD CONSTRAINT oracle_decks_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: oracle_draws oracle_draws_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oracle_draws
    ADD CONSTRAINT oracle_draws_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.oracle_clients(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('oracle_clients_therapist_user_id_fkey', 'oracle_clients', 'oracle_clients', FALSE, 'ALTER TABLE public.oracle_clients ADD CONSTRAINT oracle_clients_therapist_user_id_fkey FOREIGN KEY (therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oracle_decks oracle_decks_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oracle_decks
    ADD CONSTRAINT oracle_decks_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: oracle_draws oracle_draws_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oracle_draws
    ADD CONSTRAINT oracle_draws_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.oracle_clients(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_draws_oracle_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('oracle_draws_oracle_id_fkey', 'oracle_draws', 'oracle_decks', TRUE, 'ALTER TABLE public.oracle_draws ADD CONSTRAINT oracle_draws_oracle_id_fkey FOREIGN KEY (oracle_id) REFERENCES public.oracle_decks(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('oracle_draws_oracle_id_fkey', 'oracle_draws', 'oracle_decks', FALSE, 'ALTER TABLE public.oracle_draws ADD CONSTRAINT oracle_draws_oracle_id_fkey FOREIGN KEY (oracle_id) REFERENCES public.oracle_decks(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_draws_spread_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('oracle_draws_spread_id_fkey', 'oracle_draws', 'oracle_spreads', TRUE, 'ALTER TABLE public.oracle_draws ADD CONSTRAINT oracle_draws_spread_id_fkey FOREIGN KEY (spread_id) REFERENCES public.oracle_spreads(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('oracle_draws_spread_id_fkey', 'oracle_draws', 'oracle_spreads', FALSE, 'ALTER TABLE public.oracle_draws ADD CONSTRAINT oracle_draws_spread_id_fkey FOREIGN KEY (spread_id) REFERENCES public.oracle_spreads(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_draws_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('oracle_draws_user_id_fkey', 'oracle_draws', 'oracle_spreads', TRUE, 'ALTER TABLE public.oracle_draws ADD CONSTRAINT oracle_draws_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oracle_spread_positions oracle_spread_positions_spread_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oracle_spread_positions
    ADD CONSTRAINT oracle_spread_positions_spread_id_fkey FOREIGN KEY (spread_id) REFERENCES public.oracle_spreads(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('oracle_draws_user_id_fkey', 'oracle_draws', 'oracle_spreads', FALSE, 'ALTER TABLE public.oracle_draws ADD CONSTRAINT oracle_draws_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oracle_spread_positions oracle_spread_positions_spread_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oracle_spread_positions
    ADD CONSTRAINT oracle_spread_positions_spread_id_fkey FOREIGN KEY (spread_id) REFERENCES public.oracle_spreads(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_spreads_oracle_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('oracle_spreads_oracle_id_fkey', 'oracle_spreads', 'oracle_decks', TRUE, 'ALTER TABLE public.oracle_spreads ADD CONSTRAINT oracle_spreads_oracle_id_fkey FOREIGN KEY (oracle_id) REFERENCES public.oracle_decks(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('oracle_spreads_oracle_id_fkey', 'oracle_spreads', 'oracle_decks', FALSE, 'ALTER TABLE public.oracle_spreads ADD CONSTRAINT oracle_spreads_oracle_id_fkey FOREIGN KEY (oracle_id) REFERENCES public.oracle_decks(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_usage_stats_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('oracle_usage_stats_client_id_fkey', 'oracle_usage_stats', 'clientes', TRUE, 'ALTER TABLE public.oracle_usage_stats ADD CONSTRAINT oracle_usage_stats_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('oracle_usage_stats_client_id_fkey', 'oracle_usage_stats', 'clientes', FALSE, 'ALTER TABLE public.oracle_usage_stats ADD CONSTRAINT oracle_usage_stats_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_aplicacoes_pergunta_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('oraculo_aplicacoes_pergunta_id_fkey', 'oraculo_aplicacoes', 'oraculo_perguntas', TRUE, 'ALTER TABLE public.oraculo_aplicacoes ADD CONSTRAINT oraculo_aplicacoes_pergunta_id_fkey FOREIGN KEY (pergunta_id) REFERENCES public.oraculo_perguntas(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('oraculo_aplicacoes_pergunta_id_fkey', 'oraculo_aplicacoes', 'oraculo_perguntas', FALSE, 'ALTER TABLE public.oraculo_aplicacoes ADD CONSTRAINT oraculo_aplicacoes_pergunta_id_fkey FOREIGN KEY (pergunta_id) REFERENCES public.oraculo_perguntas(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_aplicacoes_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('oraculo_aplicacoes_user_id_fkey', 'oraculo_aplicacoes', 'oraculo_perguntas', TRUE, 'ALTER TABLE public.oraculo_aplicacoes ADD CONSTRAINT oraculo_aplicacoes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oraculo_favoritos oraculo_favoritos_pergunta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oraculo_favoritos
    ADD CONSTRAINT oraculo_favoritos_pergunta_id_fkey FOREIGN KEY (pergunta_id) REFERENCES public.oraculo_perguntas(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('oraculo_aplicacoes_user_id_fkey', 'oraculo_aplicacoes', 'oraculo_perguntas', FALSE, 'ALTER TABLE public.oraculo_aplicacoes ADD CONSTRAINT oraculo_aplicacoes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oraculo_favoritos oraculo_favoritos_pergunta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oraculo_favoritos
    ADD CONSTRAINT oraculo_favoritos_pergunta_id_fkey FOREIGN KEY (pergunta_id) REFERENCES public.oraculo_perguntas(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_favoritos_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('oraculo_favoritos_user_id_fkey', 'oraculo_favoritos', 'oraculo_portais', TRUE, 'ALTER TABLE public.oraculo_favoritos ADD CONSTRAINT oraculo_favoritos_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oraculo_portal_aplicacoes oraculo_portal_aplicacoes_portal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oraculo_portal_aplicacoes
    ADD CONSTRAINT oraculo_portal_aplicacoes_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('oraculo_favoritos_user_id_fkey', 'oraculo_favoritos', 'oraculo_portais', FALSE, 'ALTER TABLE public.oraculo_favoritos ADD CONSTRAINT oraculo_favoritos_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oraculo_portal_aplicacoes oraculo_portal_aplicacoes_portal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oraculo_portal_aplicacoes
    ADD CONSTRAINT oraculo_portal_aplicacoes_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_audios_portal_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('oraculo_portal_audios_portal_id_fkey', 'oraculo_portal_audios', 'oraculo_portais', TRUE, 'ALTER TABLE public.oraculo_portal_audios ADD CONSTRAINT oraculo_portal_audios_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('oraculo_portal_audios_portal_id_fkey', 'oraculo_portal_audios', 'oraculo_portais', FALSE, 'ALTER TABLE public.oraculo_portal_audios ADD CONSTRAINT oraculo_portal_audios_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_essencia_portal_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('oraculo_portal_essencia_portal_id_fkey', 'oraculo_portal_essencia', 'oraculo_portais', TRUE, 'ALTER TABLE public.oraculo_portal_essencia ADD CONSTRAINT oraculo_portal_essencia_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('oraculo_portal_essencia_portal_id_fkey', 'oraculo_portal_essencia', 'oraculo_portais', FALSE, 'ALTER TABLE public.oraculo_portal_essencia ADD CONSTRAINT oraculo_portal_essencia_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_ferramenta_campos_ferramenta_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('oraculo_portal_ferramenta_campos_ferramenta_id_fkey', 'oraculo_portal_ferramenta_campos', 'oraculo_portal_ferramentas', TRUE, 'ALTER TABLE public.oraculo_portal_ferramenta_campos ADD CONSTRAINT oraculo_portal_ferramenta_campos_ferramenta_id_fkey FOREIGN KEY (ferramenta_id) REFERENCES public.oraculo_portal_ferramentas(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('oraculo_portal_ferramenta_campos_ferramenta_id_fkey', 'oraculo_portal_ferramenta_campos', 'oraculo_portal_ferramentas', FALSE, 'ALTER TABLE public.oraculo_portal_ferramenta_campos ADD CONSTRAINT oraculo_portal_ferramenta_campos_ferramenta_id_fkey FOREIGN KEY (ferramenta_id) REFERENCES public.oraculo_portal_ferramentas(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_ferramentas_portal_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('oraculo_portal_ferramentas_portal_id_fkey', 'oraculo_portal_ferramentas', 'oraculo_portais', TRUE, 'ALTER TABLE public.oraculo_portal_ferramentas ADD CONSTRAINT oraculo_portal_ferramentas_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('oraculo_portal_ferramentas_portal_id_fkey', 'oraculo_portal_ferramentas', 'oraculo_portais', FALSE, 'ALTER TABLE public.oraculo_portal_ferramentas ADD CONSTRAINT oraculo_portal_ferramentas_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_forja_erros_forja_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('oraculo_portal_forja_erros_forja_id_fkey', 'oraculo_portal_forja_erros', 'oraculo_portal_forjas', TRUE, 'ALTER TABLE public.oraculo_portal_forja_erros ADD CONSTRAINT oraculo_portal_forja_erros_forja_id_fkey FOREIGN KEY (forja_id) REFERENCES public.oraculo_portal_forjas(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('oraculo_portal_forja_erros_forja_id_fkey', 'oraculo_portal_forja_erros', 'oraculo_portal_forjas', FALSE, 'ALTER TABLE public.oraculo_portal_forja_erros ADD CONSTRAINT oraculo_portal_forja_erros_forja_id_fkey FOREIGN KEY (forja_id) REFERENCES public.oraculo_portal_forjas(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_forja_passos_forja_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('oraculo_portal_forja_passos_forja_id_fkey', 'oraculo_portal_forja_passos', 'oraculo_portal_forjas', TRUE, 'ALTER TABLE public.oraculo_portal_forja_passos ADD CONSTRAINT oraculo_portal_forja_passos_forja_id_fkey FOREIGN KEY (forja_id) REFERENCES public.oraculo_portal_forjas(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('oraculo_portal_forja_passos_forja_id_fkey', 'oraculo_portal_forja_passos', 'oraculo_portal_forjas', FALSE, 'ALTER TABLE public.oraculo_portal_forja_passos ADD CONSTRAINT oraculo_portal_forja_passos_forja_id_fkey FOREIGN KEY (forja_id) REFERENCES public.oraculo_portal_forjas(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_forjas_portal_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('oraculo_portal_forjas_portal_id_fkey', 'oraculo_portal_forjas', 'oraculo_portais', TRUE, 'ALTER TABLE public.oraculo_portal_forjas ADD CONSTRAINT oraculo_portal_forjas_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('oraculo_portal_forjas_portal_id_fkey', 'oraculo_portal_forjas', 'oraculo_portais', FALSE, 'ALTER TABLE public.oraculo_portal_forjas ADD CONSTRAINT oraculo_portal_forjas_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_jardins_portal_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('oraculo_portal_jardins_portal_id_fkey', 'oraculo_portal_jardins', 'oraculo_portais', TRUE, 'ALTER TABLE public.oraculo_portal_jardins ADD CONSTRAINT oraculo_portal_jardins_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('oraculo_portal_jardins_portal_id_fkey', 'oraculo_portal_jardins', 'oraculo_portais', FALSE, 'ALTER TABLE public.oraculo_portal_jardins ADD CONSTRAINT oraculo_portal_jardins_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_laboratorio_passos_laboratorio_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('oraculo_portal_laboratorio_passos_laboratorio_id_fkey', 'oraculo_portal_laboratorio_passos', 'oraculo_portal_laboratorios', TRUE, 'ALTER TABLE public.oraculo_portal_laboratorio_passos ADD CONSTRAINT oraculo_portal_laboratorio_passos_laboratorio_id_fkey FOREIGN KEY (laboratorio_id) REFERENCES public.oraculo_portal_laboratorios(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('oraculo_portal_laboratorio_passos_laboratorio_id_fkey', 'oraculo_portal_laboratorio_passos', 'oraculo_portal_laboratorios', FALSE, 'ALTER TABLE public.oraculo_portal_laboratorio_passos ADD CONSTRAINT oraculo_portal_laboratorio_passos_laboratorio_id_fkey FOREIGN KEY (laboratorio_id) REFERENCES public.oraculo_portal_laboratorios(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_laboratorios_portal_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('oraculo_portal_laboratorios_portal_id_fkey', 'oraculo_portal_laboratorios', 'oraculo_portais', TRUE, 'ALTER TABLE public.oraculo_portal_laboratorios ADD CONSTRAINT oraculo_portal_laboratorios_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('oraculo_portal_laboratorios_portal_id_fkey', 'oraculo_portal_laboratorios', 'oraculo_portais', FALSE, 'ALTER TABLE public.oraculo_portal_laboratorios ADD CONSTRAINT oraculo_portal_laboratorios_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_materiais_portal_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('oraculo_portal_materiais_portal_id_fkey', 'oraculo_portal_materiais', 'oraculo_portais', TRUE, 'ALTER TABLE public.oraculo_portal_materiais ADD CONSTRAINT oraculo_portal_materiais_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('oraculo_portal_materiais_portal_id_fkey', 'oraculo_portal_materiais', 'oraculo_portais', FALSE, 'ALTER TABLE public.oraculo_portal_materiais ADD CONSTRAINT oraculo_portal_materiais_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey', 'oraculo_portal_narroterapia_perguntas', 'oraculo_portal_narroterapia', TRUE, 'ALTER TABLE public.oraculo_portal_narroterapia_perguntas ADD CONSTRAINT oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey FOREIGN KEY (narroterapia_id) REFERENCES public.oraculo_portal_narroterapia(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey', 'oraculo_portal_narroterapia_perguntas', 'oraculo_portal_narroterapia', FALSE, 'ALTER TABLE public.oraculo_portal_narroterapia_perguntas ADD CONSTRAINT oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey FOREIGN KEY (narroterapia_id) REFERENCES public.oraculo_portal_narroterapia(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_narroterapia_portal_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('oraculo_portal_narroterapia_portal_id_fkey', 'oraculo_portal_narroterapia', 'oraculo_portais', TRUE, 'ALTER TABLE public.oraculo_portal_narroterapia ADD CONSTRAINT oraculo_portal_narroterapia_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('oraculo_portal_narroterapia_portal_id_fkey', 'oraculo_portal_narroterapia', 'oraculo_portais', FALSE, 'ALTER TABLE public.oraculo_portal_narroterapia ADD CONSTRAINT oraculo_portal_narroterapia_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_riscos_eticos_portal_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('oraculo_portal_riscos_eticos_portal_id_fkey', 'oraculo_portal_riscos_eticos', 'oraculo_portais', TRUE, 'ALTER TABLE public.oraculo_portal_riscos_eticos ADD CONSTRAINT oraculo_portal_riscos_eticos_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('oraculo_portal_riscos_eticos_portal_id_fkey', 'oraculo_portal_riscos_eticos', 'oraculo_portais', FALSE, 'ALTER TABLE public.oraculo_portal_riscos_eticos ADD CONSTRAINT oraculo_portal_riscos_eticos_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.oraculo_portais(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'personal_symbolic_maps_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('personal_symbolic_maps_user_id_fkey', 'personal_symbolic_maps', 'jornadas', TRUE, 'ALTER TABLE public.personal_symbolic_maps ADD CONSTRAINT personal_symbolic_maps_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: portais portais_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portais
    ADD CONSTRAINT portais_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: portais portais_jornada_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portais
    ADD CONSTRAINT portais_jornada_id_fkey FOREIGN KEY (jornada_id) REFERENCES public.jornadas(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('personal_symbolic_maps_user_id_fkey', 'personal_symbolic_maps', 'jornadas', FALSE, 'ALTER TABLE public.personal_symbolic_maps ADD CONSTRAINT personal_symbolic_maps_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: portais portais_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portais
    ADD CONSTRAINT portais_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: portais portais_jornada_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portais
    ADD CONSTRAINT portais_jornada_id_fkey FOREIGN KEY (jornada_id) REFERENCES public.jornadas(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portais_modulo_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('portais_modulo_id_fkey', 'portais', 'modulos_formativos', TRUE, 'ALTER TABLE public.portais ADD CONSTRAINT portais_modulo_id_fkey FOREIGN KEY (modulo_id) REFERENCES public.modulos_formativos(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('portais_modulo_id_fkey', 'portais', 'modulos_formativos', FALSE, 'ALTER TABLE public.portais ADD CONSTRAINT portais_modulo_id_fkey FOREIGN KEY (modulo_id) REFERENCES public.modulos_formativos(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_junguiano_modulos_config_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('portal_junguiano_modulos_config_id_fkey', 'portal_junguiano_modulos', 'portal_junguiano_config', TRUE, 'ALTER TABLE public.portal_junguiano_modulos ADD CONSTRAINT portal_junguiano_modulos_config_id_fkey FOREIGN KEY (config_id) REFERENCES public.portal_junguiano_config(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('portal_junguiano_modulos_config_id_fkey', 'portal_junguiano_modulos', 'portal_junguiano_config', FALSE, 'ALTER TABLE public.portal_junguiano_modulos ADD CONSTRAINT portal_junguiano_modulos_config_id_fkey FOREIGN KEY (config_id) REFERENCES public.portal_junguiano_config(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_junguiano_portais_modulo_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('portal_junguiano_portais_modulo_id_fkey', 'portal_junguiano_portais', 'portal_junguiano_modulos', TRUE, 'ALTER TABLE public.portal_junguiano_portais ADD CONSTRAINT portal_junguiano_portais_modulo_id_fkey FOREIGN KEY (modulo_id) REFERENCES public.portal_junguiano_modulos(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('portal_junguiano_portais_modulo_id_fkey', 'portal_junguiano_portais', 'portal_junguiano_modulos', FALSE, 'ALTER TABLE public.portal_junguiano_portais ADD CONSTRAINT portal_junguiano_portais_modulo_id_fkey FOREIGN KEY (modulo_id) REFERENCES public.portal_junguiano_modulos(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_junguiano_progresso_config_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('portal_junguiano_progresso_config_id_fkey', 'portal_junguiano_progresso', 'portal_junguiano_config', TRUE, 'ALTER TABLE public.portal_junguiano_progresso ADD CONSTRAINT portal_junguiano_progresso_config_id_fkey FOREIGN KEY (config_id) REFERENCES public.portal_junguiano_config(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('portal_junguiano_progresso_config_id_fkey', 'portal_junguiano_progresso', 'portal_junguiano_config', FALSE, 'ALTER TABLE public.portal_junguiano_progresso ADD CONSTRAINT portal_junguiano_progresso_config_id_fkey FOREIGN KEY (config_id) REFERENCES public.portal_junguiano_config(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_junguiano_registros_portal_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('portal_junguiano_registros_portal_id_fkey', 'portal_junguiano_registros', 'portal_junguiano_portais', TRUE, 'ALTER TABLE public.portal_junguiano_registros ADD CONSTRAINT portal_junguiano_registros_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.portal_junguiano_portais(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('portal_junguiano_registros_portal_id_fkey', 'portal_junguiano_registros', 'portal_junguiano_portais', FALSE, 'ALTER TABLE public.portal_junguiano_registros ADD CONSTRAINT portal_junguiano_registros_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.portal_junguiano_portais(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_progress_portal_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('portal_progress_portal_id_fkey', 'portal_progress', 'clube_portais', TRUE, 'ALTER TABLE public.portal_progress ADD CONSTRAINT portal_progress_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.clube_portais(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('portal_progress_portal_id_fkey', 'portal_progress', 'clube_portais', FALSE, 'ALTER TABLE public.portal_progress ADD CONSTRAINT portal_progress_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.clube_portais(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_salas_sala_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('portal_salas_sala_id_fkey', 'portal_salas', 'salas', TRUE, 'ALTER TABLE public.portal_salas ADD CONSTRAINT portal_salas_sala_id_fkey FOREIGN KEY (sala_id) REFERENCES public.salas(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('portal_salas_sala_id_fkey', 'portal_salas', 'salas', FALSE, 'ALTER TABLE public.portal_salas ADD CONSTRAINT portal_salas_sala_id_fkey FOREIGN KEY (sala_id) REFERENCES public.salas(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'post_session_closures_case_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('post_session_closures_case_id_fkey', 'post_session_closures', 'session_cases', TRUE, 'ALTER TABLE public.post_session_closures ADD CONSTRAINT post_session_closures_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.session_cases(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('post_session_closures_case_id_fkey', 'post_session_closures', 'session_cases', FALSE, 'ALTER TABLE public.post_session_closures ADD CONSTRAINT post_session_closures_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.session_cases(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'post_session_closures_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('post_session_closures_client_id_fkey', 'post_session_closures', 'profiles', TRUE, 'ALTER TABLE public.post_session_closures ADD CONSTRAINT post_session_closures_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.profiles(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('post_session_closures_client_id_fkey', 'post_session_closures', 'profiles', FALSE, 'ALTER TABLE public.post_session_closures ADD CONSTRAINT post_session_closures_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.profiles(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'post_session_closures_therapist_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('post_session_closures_therapist_id_fkey', 'post_session_closures', 'profiles', TRUE, 'ALTER TABLE public.post_session_closures ADD CONSTRAINT post_session_closures_therapist_id_fkey FOREIGN KEY (therapist_id) REFERENCES public.profiles(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('post_session_closures_therapist_id_fkey', 'post_session_closures', 'profiles', FALSE, 'ALTER TABLE public.post_session_closures ADD CONSTRAINT post_session_closures_therapist_id_fkey FOREIGN KEY (therapist_id) REFERENCES public.profiles(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'posts_mentoria_created_by_fkey') THEN
        INSERT INTO fk_audit VALUES ('posts_mentoria_created_by_fkey', 'posts_mentoria', 'clientes', TRUE, 'ALTER TABLE public.posts_mentoria ADD CONSTRAINT posts_mentoria_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: praticas_mudra praticas_mudra_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.praticas_mudra
    ADD CONSTRAINT praticas_mudra_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('posts_mentoria_created_by_fkey', 'posts_mentoria', 'clientes', FALSE, 'ALTER TABLE public.posts_mentoria ADD CONSTRAINT posts_mentoria_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: praticas_mudra praticas_mudra_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.praticas_mudra
    ADD CONSTRAINT praticas_mudra_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('profiles_id_fkey', 'profiles', 'formacoes', TRUE, 'ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: progresso_aluna progresso_aluna_formacao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.progresso_aluna
    ADD CONSTRAINT progresso_aluna_formacao_id_fkey FOREIGN KEY (formacao_id) REFERENCES public.formacoes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('profiles_id_fkey', 'profiles', 'formacoes', FALSE, 'ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: progresso_aluna progresso_aluna_formacao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.progresso_aluna
    ADD CONSTRAINT progresso_aluna_formacao_id_fkey FOREIGN KEY (formacao_id) REFERENCES public.formacoes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'progresso_aluna_modulo_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('progresso_aluna_modulo_id_fkey', 'progresso_aluna', 'formacao_modulos', TRUE, 'ALTER TABLE public.progresso_aluna ADD CONSTRAINT progresso_aluna_modulo_id_fkey FOREIGN KEY (modulo_id) REFERENCES public.formacao_modulos(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('progresso_aluna_modulo_id_fkey', 'progresso_aluna', 'formacao_modulos', FALSE, 'ALTER TABLE public.progresso_aluna ADD CONSTRAINT progresso_aluna_modulo_id_fkey FOREIGN KEY (modulo_id) REFERENCES public.formacao_modulos(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projetos_mestria_avaliador_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('projetos_mestria_avaliador_id_fkey', 'projetos_mestria', 'courses', TRUE, 'ALTER TABLE public.projetos_mestria ADD CONSTRAINT projetos_mestria_avaliador_id_fkey FOREIGN KEY (avaliador_id) REFERENCES auth.users(id);


--
-- Name: projetos_mestria projetos_mestria_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projetos_mestria
    ADD CONSTRAINT projetos_mestria_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('projetos_mestria_avaliador_id_fkey', 'projetos_mestria', 'courses', FALSE, 'ALTER TABLE public.projetos_mestria ADD CONSTRAINT projetos_mestria_avaliador_id_fkey FOREIGN KEY (avaliador_id) REFERENCES auth.users(id);


--
-- Name: projetos_mestria projetos_mestria_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projetos_mestria
    ADD CONSTRAINT projetos_mestria_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projetos_mestria_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('projetos_mestria_user_id_fkey', 'projetos_mestria', 'jornada_heroina_registros', TRUE, 'ALTER TABLE public.projetos_mestria ADD CONSTRAINT projetos_mestria_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: protocolo_oracula protocolo_oracula_caminho_registro_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.protocolo_oracula
    ADD CONSTRAINT protocolo_oracula_caminho_registro_id_fkey FOREIGN KEY (caminho_registro_id) REFERENCES public.jornada_heroina_registros(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('projetos_mestria_user_id_fkey', 'projetos_mestria', 'jornada_heroina_registros', FALSE, 'ALTER TABLE public.projetos_mestria ADD CONSTRAINT projetos_mestria_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: protocolo_oracula protocolo_oracula_caminho_registro_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.protocolo_oracula
    ADD CONSTRAINT protocolo_oracula_caminho_registro_id_fkey FOREIGN KEY (caminho_registro_id) REFERENCES public.jornada_heroina_registros(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protocolo_oracula_cliente_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('protocolo_oracula_cliente_id_fkey', 'protocolo_oracula', 'clientes', TRUE, 'ALTER TABLE public.protocolo_oracula ADD CONSTRAINT protocolo_oracula_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('protocolo_oracula_cliente_id_fkey', 'protocolo_oracula', 'clientes', FALSE, 'ALTER TABLE public.protocolo_oracula ADD CONSTRAINT protocolo_oracula_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protocolo_oracula_mapa_registro_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('protocolo_oracula_mapa_registro_id_fkey', 'protocolo_oracula', 'big5_symbolic_registros', TRUE, 'ALTER TABLE public.protocolo_oracula ADD CONSTRAINT protocolo_oracula_mapa_registro_id_fkey FOREIGN KEY (mapa_registro_id) REFERENCES public.big5_symbolic_registros(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('protocolo_oracula_mapa_registro_id_fkey', 'protocolo_oracula', 'big5_symbolic_registros', FALSE, 'ALTER TABLE public.protocolo_oracula ADD CONSTRAINT protocolo_oracula_mapa_registro_id_fkey FOREIGN KEY (mapa_registro_id) REFERENCES public.big5_symbolic_registros(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protocolo_oracula_oraculo_registro_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('protocolo_oracula_oraculo_registro_id_fkey', 'protocolo_oracula', 'eneagrama_feminino_registros', TRUE, 'ALTER TABLE public.protocolo_oracula ADD CONSTRAINT protocolo_oracula_oraculo_registro_id_fkey FOREIGN KEY (oraculo_registro_id) REFERENCES public.eneagrama_feminino_registros(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('protocolo_oracula_oraculo_registro_id_fkey', 'protocolo_oracula', 'eneagrama_feminino_registros', FALSE, 'ALTER TABLE public.protocolo_oracula ADD CONSTRAINT protocolo_oracula_oraculo_registro_id_fkey FOREIGN KEY (oraculo_registro_id) REFERENCES public.eneagrama_feminino_registros(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protocolo_oracula_session_case_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('protocolo_oracula_session_case_id_fkey', 'protocolo_oracula', 'session_cases', TRUE, 'ALTER TABLE public.protocolo_oracula ADD CONSTRAINT protocolo_oracula_session_case_id_fkey FOREIGN KEY (session_case_id) REFERENCES public.session_cases(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('protocolo_oracula_session_case_id_fkey', 'protocolo_oracula', 'session_cases', FALSE, 'ALTER TABLE public.protocolo_oracula ADD CONSTRAINT protocolo_oracula_session_case_id_fkey FOREIGN KEY (session_case_id) REFERENCES public.session_cases(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'push_subscriptions_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('push_subscriptions_user_id_fkey', 'push_subscriptions', 'quiz_perguntas', TRUE, 'ALTER TABLE public.push_subscriptions ADD CONSTRAINT push_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: quiz_opcoes quiz_opcoes_pergunta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_opcoes
    ADD CONSTRAINT quiz_opcoes_pergunta_id_fkey FOREIGN KEY (pergunta_id) REFERENCES public.quiz_perguntas(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('push_subscriptions_user_id_fkey', 'push_subscriptions', 'quiz_perguntas', FALSE, 'ALTER TABLE public.push_subscriptions ADD CONSTRAINT push_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: quiz_opcoes quiz_opcoes_pergunta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_opcoes
    ADD CONSTRAINT quiz_opcoes_pergunta_id_fkey FOREIGN KEY (pergunta_id) REFERENCES public.quiz_perguntas(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_perguntas_quiz_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('quiz_perguntas_quiz_id_fkey', 'quiz_perguntas', 'quizzes', TRUE, 'ALTER TABLE public.quiz_perguntas ADD CONSTRAINT quiz_perguntas_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('quiz_perguntas_quiz_id_fkey', 'quiz_perguntas', 'quizzes', FALSE, 'ALTER TABLE public.quiz_perguntas ADD CONSTRAINT quiz_perguntas_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_respostas_usuario_quiz_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('quiz_respostas_usuario_quiz_id_fkey', 'quiz_respostas_usuario', 'quizzes', TRUE, 'ALTER TABLE public.quiz_respostas_usuario ADD CONSTRAINT quiz_respostas_usuario_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('quiz_respostas_usuario_quiz_id_fkey', 'quiz_respostas_usuario', 'quizzes', FALSE, 'ALTER TABLE public.quiz_respostas_usuario ADD CONSTRAINT quiz_respostas_usuario_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_respostas_usuario_resultado_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('quiz_respostas_usuario_resultado_id_fkey', 'quiz_respostas_usuario', 'quiz_resultados', TRUE, 'ALTER TABLE public.quiz_respostas_usuario ADD CONSTRAINT quiz_respostas_usuario_resultado_id_fkey FOREIGN KEY (resultado_id) REFERENCES public.quiz_resultados(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('quiz_respostas_usuario_resultado_id_fkey', 'quiz_respostas_usuario', 'quiz_resultados', FALSE, 'ALTER TABLE public.quiz_respostas_usuario ADD CONSTRAINT quiz_respostas_usuario_resultado_id_fkey FOREIGN KEY (resultado_id) REFERENCES public.quiz_resultados(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_resultados_agente_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('quiz_resultados_agente_id_fkey', 'quiz_resultados', 'agentes', TRUE, 'ALTER TABLE public.quiz_resultados ADD CONSTRAINT quiz_resultados_agente_id_fkey FOREIGN KEY (agente_id) REFERENCES public.agentes(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('quiz_resultados_agente_id_fkey', 'quiz_resultados', 'agentes', FALSE, 'ALTER TABLE public.quiz_resultados ADD CONSTRAINT quiz_resultados_agente_id_fkey FOREIGN KEY (agente_id) REFERENCES public.agentes(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_resultados_quiz_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('quiz_resultados_quiz_id_fkey', 'quiz_resultados', 'quizzes', TRUE, 'ALTER TABLE public.quiz_resultados ADD CONSTRAINT quiz_resultados_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('quiz_resultados_quiz_id_fkey', 'quiz_resultados', 'quizzes', FALSE, 'ALTER TABLE public.quiz_resultados ADD CONSTRAINT quiz_resultados_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quizzes_portal_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('quizzes_portal_id_fkey', 'quizzes', 'conteudo_travessias', TRUE, 'ALTER TABLE public.quizzes ADD CONSTRAINT quizzes_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.conteudo_travessias(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('quizzes_portal_id_fkey', 'quizzes', 'conteudo_travessias', FALSE, 'ALTER TABLE public.quizzes ADD CONSTRAINT quizzes_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.conteudo_travessias(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quizzes_sala_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('quizzes_sala_id_fkey', 'quizzes', 'salas', TRUE, 'ALTER TABLE public.quizzes ADD CONSTRAINT quizzes_sala_id_fkey FOREIGN KEY (sala_id) REFERENCES public.salas(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('quizzes_sala_id_fkey', 'quizzes', 'salas', FALSE, 'ALTER TABLE public.quizzes ADD CONSTRAINT quizzes_sala_id_fkey FOREIGN KEY (sala_id) REFERENCES public.salas(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reflexoes_jornada_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('reflexoes_jornada_client_id_fkey', 'reflexoes_jornada', 'clientes', TRUE, 'ALTER TABLE public.reflexoes_jornada ADD CONSTRAINT reflexoes_jornada_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('reflexoes_jornada_client_id_fkey', 'reflexoes_jornada', 'clientes', FALSE, 'ALTER TABLE public.reflexoes_jornada ADD CONSTRAINT reflexoes_jornada_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'relacionamentos_espelho_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('relacionamentos_espelho_client_id_fkey', 'relacionamentos_espelho', 'clientes', TRUE, 'ALTER TABLE public.relacionamentos_espelho ADD CONSTRAINT relacionamentos_espelho_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('relacionamentos_espelho_client_id_fkey', 'relacionamentos_espelho', 'clientes', FALSE, 'ALTER TABLE public.relacionamentos_espelho ADD CONSTRAINT relacionamentos_espelho_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'respostas_exercicios_sessao_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('respostas_exercicios_sessao_id_fkey', 'respostas_exercicios', 'sessoes_labirinto', TRUE, 'ALTER TABLE public.respostas_exercicios ADD CONSTRAINT respostas_exercicios_sessao_id_fkey FOREIGN KEY (sessao_id) REFERENCES public.sessoes_labirinto(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('respostas_exercicios_sessao_id_fkey', 'respostas_exercicios', 'sessoes_labirinto', FALSE, 'ALTER TABLE public.respostas_exercicios ADD CONSTRAINT respostas_exercicios_sessao_id_fkey FOREIGN KEY (sessao_id) REFERENCES public.sessoes_labirinto(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rituais_integracao_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('rituais_integracao_client_id_fkey', 'rituais_integracao', 'clientes', TRUE, 'ALTER TABLE public.rituais_integracao ADD CONSTRAINT rituais_integracao_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('rituais_integracao_client_id_fkey', 'rituais_integracao', 'clientes', FALSE, 'ALTER TABLE public.rituais_integracao ADD CONSTRAINT rituais_integracao_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ritual_passages_ritual_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('ritual_passages_ritual_id_fkey', 'ritual_passages', 'ritual_definitions', TRUE, 'ALTER TABLE public.ritual_passages ADD CONSTRAINT ritual_passages_ritual_id_fkey FOREIGN KEY (ritual_id) REFERENCES public.ritual_definitions(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('ritual_passages_ritual_id_fkey', 'ritual_passages', 'ritual_definitions', FALSE, 'ALTER TABLE public.ritual_passages ADD CONSTRAINT ritual_passages_ritual_id_fkey FOREIGN KEY (ritual_id) REFERENCES public.ritual_definitions(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ritual_passages_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('ritual_passages_user_id_fkey', 'ritual_passages', 'travessia_familias', TRUE, 'ALTER TABLE public.ritual_passages ADD CONSTRAINT ritual_passages_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sala_ferramentas sala_ferramentas_familia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sala_ferramentas
    ADD CONSTRAINT sala_ferramentas_familia_id_fkey FOREIGN KEY (familia_id) REFERENCES public.travessia_familias(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('ritual_passages_user_id_fkey', 'ritual_passages', 'travessia_familias', FALSE, 'ALTER TABLE public.ritual_passages ADD CONSTRAINT ritual_passages_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sala_ferramentas sala_ferramentas_familia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sala_ferramentas
    ADD CONSTRAINT sala_ferramentas_familia_id_fkey FOREIGN KEY (familia_id) REFERENCES public.travessia_familias(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sala_ferramentas_ferramenta_pai_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('sala_ferramentas_ferramenta_pai_id_fkey', 'sala_ferramentas', 'sala_ferramentas', TRUE, 'ALTER TABLE public.sala_ferramentas ADD CONSTRAINT sala_ferramentas_ferramenta_pai_id_fkey FOREIGN KEY (ferramenta_pai_id) REFERENCES public.sala_ferramentas(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('sala_ferramentas_ferramenta_pai_id_fkey', 'sala_ferramentas', 'sala_ferramentas', FALSE, 'ALTER TABLE public.sala_ferramentas ADD CONSTRAINT sala_ferramentas_ferramenta_pai_id_fkey FOREIGN KEY (ferramenta_pai_id) REFERENCES public.sala_ferramentas(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sala_ferramentas_portal_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('sala_ferramentas_portal_id_fkey', 'sala_ferramentas', 'conteudo_travessias', TRUE, 'ALTER TABLE public.sala_ferramentas ADD CONSTRAINT sala_ferramentas_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.conteudo_travessias(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('sala_ferramentas_portal_id_fkey', 'sala_ferramentas', 'conteudo_travessias', FALSE, 'ALTER TABLE public.sala_ferramentas ADD CONSTRAINT sala_ferramentas_portal_id_fkey FOREIGN KEY (portal_id) REFERENCES public.conteudo_travessias(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sala_ferramentas_sala_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('sala_ferramentas_sala_id_fkey', 'sala_ferramentas', 'salas', TRUE, 'ALTER TABLE public.sala_ferramentas ADD CONSTRAINT sala_ferramentas_sala_id_fkey FOREIGN KEY (sala_id) REFERENCES public.salas(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('sala_ferramentas_sala_id_fkey', 'sala_ferramentas', 'salas', FALSE, 'ALTER TABLE public.sala_ferramentas ADD CONSTRAINT sala_ferramentas_sala_id_fkey FOREIGN KEY (sala_id) REFERENCES public.salas(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'season_books_season_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('season_books_season_id_fkey', 'season_books', 'oracular_seasons', TRUE, 'ALTER TABLE public.season_books ADD CONSTRAINT season_books_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.oracular_seasons(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('season_books_season_id_fkey', 'season_books', 'oracular_seasons', FALSE, 'ALTER TABLE public.season_books ADD CONSTRAINT season_books_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.oracular_seasons(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'season_labs_season_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('season_labs_season_id_fkey', 'season_labs', 'oracular_seasons', TRUE, 'ALTER TABLE public.season_labs ADD CONSTRAINT season_labs_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.oracular_seasons(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('season_labs_season_id_fkey', 'season_labs', 'oracular_seasons', FALSE, 'ALTER TABLE public.season_labs ADD CONSTRAINT season_labs_season_id_fkey FOREIGN KEY (season_id) REFERENCES public.oracular_seasons(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_archetypes_archetype_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('session_archetypes_archetype_id_fkey', 'session_archetypes', 'atlas_arquetipos_femininos', TRUE, 'ALTER TABLE public.session_archetypes ADD CONSTRAINT session_archetypes_archetype_id_fkey FOREIGN KEY (archetype_id) REFERENCES public.atlas_arquetipos_femininos(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('session_archetypes_archetype_id_fkey', 'session_archetypes', 'atlas_arquetipos_femininos', FALSE, 'ALTER TABLE public.session_archetypes ADD CONSTRAINT session_archetypes_archetype_id_fkey FOREIGN KEY (archetype_id) REFERENCES public.atlas_arquetipos_femininos(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_archetypes_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('session_archetypes_client_id_fkey', 'session_archetypes', 'clientes', TRUE, 'ALTER TABLE public.session_archetypes ADD CONSTRAINT session_archetypes_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('session_archetypes_client_id_fkey', 'session_archetypes', 'clientes', FALSE, 'ALTER TABLE public.session_archetypes ADD CONSTRAINT session_archetypes_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_archetypes_session_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('session_archetypes_session_id_fkey', 'session_archetypes', 'sessions', TRUE, 'ALTER TABLE public.session_archetypes ADD CONSTRAINT session_archetypes_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('session_archetypes_session_id_fkey', 'session_archetypes', 'sessions', FALSE, 'ALTER TABLE public.session_archetypes ADD CONSTRAINT session_archetypes_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_cases_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('session_cases_client_id_fkey', 'session_cases', 'clientes', TRUE, 'ALTER TABLE public.session_cases ADD CONSTRAINT session_cases_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('session_cases_client_id_fkey', 'session_cases', 'clientes', FALSE, 'ALTER TABLE public.session_cases ADD CONSTRAINT session_cases_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_cases_therapist_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('session_cases_therapist_id_fkey', 'session_cases', 'profiles', TRUE, 'ALTER TABLE public.session_cases ADD CONSTRAINT session_cases_therapist_id_fkey FOREIGN KEY (therapist_id) REFERENCES public.profiles(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('session_cases_therapist_id_fkey', 'session_cases', 'profiles', FALSE, 'ALTER TABLE public.session_cases ADD CONSTRAINT session_cases_therapist_id_fkey FOREIGN KEY (therapist_id) REFERENCES public.profiles(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_interventions_intervention_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('session_interventions_intervention_id_fkey', 'session_interventions', 'interventions', TRUE, 'ALTER TABLE public.session_interventions ADD CONSTRAINT session_interventions_intervention_id_fkey FOREIGN KEY (intervention_id) REFERENCES public.interventions(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('session_interventions_intervention_id_fkey', 'session_interventions', 'interventions', FALSE, 'ALTER TABLE public.session_interventions ADD CONSTRAINT session_interventions_intervention_id_fkey FOREIGN KEY (intervention_id) REFERENCES public.interventions(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_interventions_session_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('session_interventions_session_id_fkey', 'session_interventions', 'sessions', TRUE, 'ALTER TABLE public.session_interventions ADD CONSTRAINT session_interventions_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('session_interventions_session_id_fkey', 'session_interventions', 'sessions', FALSE, 'ALTER TABLE public.session_interventions ADD CONSTRAINT session_interventions_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_oracle_draws_case_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('session_oracle_draws_case_id_fkey', 'session_oracle_draws', 'session_cases', TRUE, 'ALTER TABLE public.session_oracle_draws ADD CONSTRAINT session_oracle_draws_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.session_cases(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('session_oracle_draws_case_id_fkey', 'session_oracle_draws', 'session_cases', FALSE, 'ALTER TABLE public.session_oracle_draws ADD CONSTRAINT session_oracle_draws_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.session_cases(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_oracle_draws_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('session_oracle_draws_client_id_fkey', 'session_oracle_draws', 'profiles', TRUE, 'ALTER TABLE public.session_oracle_draws ADD CONSTRAINT session_oracle_draws_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.profiles(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('session_oracle_draws_client_id_fkey', 'session_oracle_draws', 'profiles', FALSE, 'ALTER TABLE public.session_oracle_draws ADD CONSTRAINT session_oracle_draws_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.profiles(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_oracle_draws_therapist_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('session_oracle_draws_therapist_id_fkey', 'session_oracle_draws', 'profiles', TRUE, 'ALTER TABLE public.session_oracle_draws ADD CONSTRAINT session_oracle_draws_therapist_id_fkey FOREIGN KEY (therapist_id) REFERENCES public.profiles(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('session_oracle_draws_therapist_id_fkey', 'session_oracle_draws', 'profiles', FALSE, 'ALTER TABLE public.session_oracle_draws ADD CONSTRAINT session_oracle_draws_therapist_id_fkey FOREIGN KEY (therapist_id) REFERENCES public.profiles(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_scripts_case_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('session_scripts_case_id_fkey', 'session_scripts', 'session_cases', TRUE, 'ALTER TABLE public.session_scripts ADD CONSTRAINT session_scripts_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.session_cases(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('session_scripts_case_id_fkey', 'session_scripts', 'session_cases', FALSE, 'ALTER TABLE public.session_scripts ADD CONSTRAINT session_scripts_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.session_cases(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_scripts_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('session_scripts_client_id_fkey', 'session_scripts', 'profiles', TRUE, 'ALTER TABLE public.session_scripts ADD CONSTRAINT session_scripts_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.profiles(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('session_scripts_client_id_fkey', 'session_scripts', 'profiles', FALSE, 'ALTER TABLE public.session_scripts ADD CONSTRAINT session_scripts_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.profiles(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_scripts_narrative_map_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('session_scripts_narrative_map_id_fkey', 'session_scripts', 'narrative_maps', TRUE, 'ALTER TABLE public.session_scripts ADD CONSTRAINT session_scripts_narrative_map_id_fkey FOREIGN KEY (narrative_map_id) REFERENCES public.narrative_maps(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('session_scripts_narrative_map_id_fkey', 'session_scripts', 'narrative_maps', FALSE, 'ALTER TABLE public.session_scripts ADD CONSTRAINT session_scripts_narrative_map_id_fkey FOREIGN KEY (narrative_map_id) REFERENCES public.narrative_maps(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_scripts_therapist_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('session_scripts_therapist_id_fkey', 'session_scripts', 'profiles', TRUE, 'ALTER TABLE public.session_scripts ADD CONSTRAINT session_scripts_therapist_id_fkey FOREIGN KEY (therapist_id) REFERENCES public.profiles(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('session_scripts_therapist_id_fkey', 'session_scripts', 'profiles', FALSE, 'ALTER TABLE public.session_scripts ADD CONSTRAINT session_scripts_therapist_id_fkey FOREIGN KEY (therapist_id) REFERENCES public.profiles(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_cidadela_card_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('sessions_cidadela_card_id_fkey', 'sessions', 'cidadela_oracle_cards', TRUE, 'ALTER TABLE public.sessions ADD CONSTRAINT sessions_cidadela_card_id_fkey FOREIGN KEY (cidadela_card_id) REFERENCES public.cidadela_oracle_cards(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('sessions_cidadela_card_id_fkey', 'sessions', 'cidadela_oracle_cards', FALSE, 'ALTER TABLE public.sessions ADD CONSTRAINT sessions_cidadela_card_id_fkey FOREIGN KEY (cidadela_card_id) REFERENCES public.cidadela_oracle_cards(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('sessions_client_id_fkey', 'sessions', 'clientes', TRUE, 'ALTER TABLE public.sessions ADD CONSTRAINT sessions_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('sessions_client_id_fkey', 'sessions', 'clientes', FALSE, 'ALTER TABLE public.sessions ADD CONSTRAINT sessions_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_district_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('sessions_district_id_fkey', 'sessions', 'districts', TRUE, 'ALTER TABLE public.sessions ADD CONSTRAINT sessions_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.districts(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('sessions_district_id_fkey', 'sessions', 'districts', FALSE, 'ALTER TABLE public.sessions ADD CONSTRAINT sessions_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.districts(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_tool_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('sessions_tool_id_fkey', 'sessions', 'tools', TRUE, 'ALTER TABLE public.sessions ADD CONSTRAINT sessions_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES public.tools(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('sessions_tool_id_fkey', 'sessions', 'tools', FALSE, 'ALTER TABLE public.sessions ADD CONSTRAINT sessions_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES public.tools(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessoes_casa_maquinas_cliente_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('sessoes_casa_maquinas_cliente_id_fkey', 'sessoes_casa_maquinas', 'clientes', TRUE, 'ALTER TABLE public.sessoes_casa_maquinas ADD CONSTRAINT sessoes_casa_maquinas_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('sessoes_casa_maquinas_cliente_id_fkey', 'sessoes_casa_maquinas', 'clientes', FALSE, 'ALTER TABLE public.sessoes_casa_maquinas ADD CONSTRAINT sessoes_casa_maquinas_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessoes_casa_maquinas_owner_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('sessoes_casa_maquinas_owner_id_fkey', 'sessoes_casa_maquinas', 'labirinto_fases', TRUE, 'ALTER TABLE public.sessoes_casa_maquinas ADD CONSTRAINT sessoes_casa_maquinas_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sessoes_labirinto sessoes_labirinto_porta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessoes_labirinto
    ADD CONSTRAINT sessoes_labirinto_porta_id_fkey FOREIGN KEY (porta_id) REFERENCES public.labirinto_fases(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('sessoes_casa_maquinas_owner_id_fkey', 'sessoes_casa_maquinas', 'labirinto_fases', FALSE, 'ALTER TABLE public.sessoes_casa_maquinas ADD CONSTRAINT sessoes_casa_maquinas_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sessoes_labirinto sessoes_labirinto_porta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessoes_labirinto
    ADD CONSTRAINT sessoes_labirinto_porta_id_fkey FOREIGN KEY (porta_id) REFERENCES public.labirinto_fases(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'simulador_progresso_cenario_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('simulador_progresso_cenario_id_fkey', 'simulador_progresso', 'simulador_cenarios', TRUE, 'ALTER TABLE public.simulador_progresso ADD CONSTRAINT simulador_progresso_cenario_id_fkey FOREIGN KEY (cenario_id) REFERENCES public.simulador_cenarios(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('simulador_progresso_cenario_id_fkey', 'simulador_progresso', 'simulador_cenarios', FALSE, 'ALTER TABLE public.simulador_progresso ADD CONSTRAINT simulador_progresso_cenario_id_fkey FOREIGN KEY (cenario_id) REFERENCES public.simulador_cenarios(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'simulador_progresso_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('simulador_progresso_user_id_fkey', 'simulador_progresso', 'clientes', TRUE, 'ALTER TABLE public.simulador_progresso ADD CONSTRAINT simulador_progresso_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sonho_estruturado sonho_estruturado_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sonho_estruturado
    ADD CONSTRAINT sonho_estruturado_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('simulador_progresso_user_id_fkey', 'simulador_progresso', 'clientes', FALSE, 'ALTER TABLE public.simulador_progresso ADD CONSTRAINT simulador_progresso_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sonho_estruturado sonho_estruturado_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sonho_estruturado
    ADD CONSTRAINT sonho_estruturado_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sonhos_cabalisticos_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('sonhos_cabalisticos_client_id_fkey', 'sonhos_cabalisticos', 'clientes', TRUE, 'ALTER TABLE public.sonhos_cabalisticos ADD CONSTRAINT sonhos_cabalisticos_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('sonhos_cabalisticos_client_id_fkey', 'sonhos_cabalisticos', 'clientes', FALSE, 'ALTER TABLE public.sonhos_cabalisticos ADD CONSTRAINT sonhos_cabalisticos_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'station_progress_station_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('station_progress_station_id_fkey', 'station_progress', 'clube_estacoes', TRUE, 'ALTER TABLE public.station_progress ADD CONSTRAINT station_progress_station_id_fkey FOREIGN KEY (station_id) REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('station_progress_station_id_fkey', 'station_progress', 'clube_estacoes', FALSE, 'ALTER TABLE public.station_progress ADD CONSTRAINT station_progress_station_id_fkey FOREIGN KEY (station_id) REFERENCES public.clube_estacoes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'studio_episodes_created_by_fkey') THEN
        INSERT INTO fk_audit VALUES ('studio_episodes_created_by_fkey', 'studio_episodes', 'studio_method_axes', TRUE, 'ALTER TABLE public.studio_episodes ADD CONSTRAINT studio_episodes_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: studio_episodes studio_episodes_eixo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.studio_episodes
    ADD CONSTRAINT studio_episodes_eixo_id_fkey FOREIGN KEY (eixo_id) REFERENCES public.studio_method_axes(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('studio_episodes_created_by_fkey', 'studio_episodes', 'studio_method_axes', FALSE, 'ALTER TABLE public.studio_episodes ADD CONSTRAINT studio_episodes_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: studio_episodes studio_episodes_eixo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.studio_episodes
    ADD CONSTRAINT studio_episodes_eixo_id_fkey FOREIGN KEY (eixo_id) REFERENCES public.studio_method_axes(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'subscriptions_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('subscriptions_user_id_fkey', 'subscriptions', 'session_cases', TRUE, 'ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: symbolic_template_sessions symbolic_template_sessions_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.symbolic_template_sessions
    ADD CONSTRAINT symbolic_template_sessions_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.session_cases(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('subscriptions_user_id_fkey', 'subscriptions', 'session_cases', FALSE, 'ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: symbolic_template_sessions symbolic_template_sessions_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.symbolic_template_sessions
    ADD CONSTRAINT symbolic_template_sessions_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.session_cases(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'symbolic_template_sessions_cliente_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('symbolic_template_sessions_cliente_id_fkey', 'symbolic_template_sessions', 'clientes', TRUE, 'ALTER TABLE public.symbolic_template_sessions ADD CONSTRAINT symbolic_template_sessions_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('symbolic_template_sessions_cliente_id_fkey', 'symbolic_template_sessions', 'clientes', FALSE, 'ALTER TABLE public.symbolic_template_sessions ADD CONSTRAINT symbolic_template_sessions_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'syntheia_conversations_mode_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('syntheia_conversations_mode_id_fkey', 'syntheia_conversations', 'syntheia_modes', TRUE, 'ALTER TABLE public.syntheia_conversations ADD CONSTRAINT syntheia_conversations_mode_id_fkey FOREIGN KEY (mode_id) REFERENCES public.syntheia_modes(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('syntheia_conversations_mode_id_fkey', 'syntheia_conversations', 'syntheia_modes', FALSE, 'ALTER TABLE public.syntheia_conversations ADD CONSTRAINT syntheia_conversations_mode_id_fkey FOREIGN KEY (mode_id) REFERENCES public.syntheia_modes(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'syntheia_conversations_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('syntheia_conversations_user_id_fkey', 'syntheia_conversations', 'syntheia_voices', TRUE, 'ALTER TABLE public.syntheia_conversations ADD CONSTRAINT syntheia_conversations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: syntheia_conversations syntheia_conversations_voice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.syntheia_conversations
    ADD CONSTRAINT syntheia_conversations_voice_id_fkey FOREIGN KEY (voice_id) REFERENCES public.syntheia_voices(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('syntheia_conversations_user_id_fkey', 'syntheia_conversations', 'syntheia_voices', FALSE, 'ALTER TABLE public.syntheia_conversations ADD CONSTRAINT syntheia_conversations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: syntheia_conversations syntheia_conversations_voice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.syntheia_conversations
    ADD CONSTRAINT syntheia_conversations_voice_id_fkey FOREIGN KEY (voice_id) REFERENCES public.syntheia_voices(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'syntheia_messages_conversation_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('syntheia_messages_conversation_id_fkey', 'syntheia_messages', 'syntheia_conversations', TRUE, 'ALTER TABLE public.syntheia_messages ADD CONSTRAINT syntheia_messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.syntheia_conversations(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('syntheia_messages_conversation_id_fkey', 'syntheia_messages', 'syntheia_conversations', FALSE, 'ALTER TABLE public.syntheia_messages ADD CONSTRAINT syntheia_messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.syntheia_conversations(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tecela_casos_espelho_created_by_fkey') THEN
        INSERT INTO fk_audit VALUES ('tecela_casos_espelho_created_by_fkey', 'tecela_casos_espelho', 'tecela_conselho', TRUE, 'ALTER TABLE public.tecela_casos_espelho ADD CONSTRAINT tecela_casos_espelho_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT tecela_conselho_respostas_conselho_id_fkey FOREIGN KEY (conselho_id) REFERENCES public.tecela_conselho(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('tecela_casos_espelho_created_by_fkey', 'tecela_casos_espelho', 'tecela_conselho', FALSE, 'ALTER TABLE public.tecela_casos_espelho ADD CONSTRAINT tecela_casos_espelho_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT tecela_conselho_respostas_conselho_id_fkey FOREIGN KEY (conselho_id) REFERENCES public.tecela_conselho(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tecela_favoritos_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('tecela_favoritos_user_id_fkey', 'tecela_favoritos', 'tecela_registros_campo', TRUE, 'ALTER TABLE public.tecela_favoritos ADD CONSTRAINT tecela_favoritos_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT tecela_ressonancias_registro_id_fkey FOREIGN KEY (registro_id) REFERENCES public.tecela_registros_campo(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('tecela_favoritos_user_id_fkey', 'tecela_favoritos', 'tecela_registros_campo', FALSE, 'ALTER TABLE public.tecela_favoritos ADD CONSTRAINT tecela_favoritos_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT tecela_ressonancias_registro_id_fkey FOREIGN KEY (registro_id) REFERENCES public.tecela_registros_campo(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tecela_ressonancias_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('tecela_ressonancias_user_id_fkey', 'tecela_ressonancias', 'tecela_casos_espelho', TRUE, 'ALTER TABLE public.tecela_ressonancias ADD CONSTRAINT tecela_ressonancias_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: tecela_supervisoes tecela_supervisoes_caso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tecela_supervisoes
    ADD CONSTRAINT tecela_supervisoes_caso_id_fkey FOREIGN KEY (caso_id) REFERENCES public.tecela_casos_espelho(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('tecela_ressonancias_user_id_fkey', 'tecela_ressonancias', 'tecela_casos_espelho', FALSE, 'ALTER TABLE public.tecela_ressonancias ADD CONSTRAINT tecela_ressonancias_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: tecela_supervisoes tecela_supervisoes_caso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tecela_supervisoes
    ADD CONSTRAINT tecela_supervisoes_caso_id_fkey FOREIGN KEY (caso_id) REFERENCES public.tecela_casos_espelho(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tecela_supervisoes_created_by_fkey') THEN
        INSERT INTO fk_audit VALUES ('tecela_supervisoes_created_by_fkey', 'tecela_supervisoes', 'city_districts', TRUE, 'ALTER TABLE public.tecela_supervisoes ADD CONSTRAINT tecela_supervisoes_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT tool_districts_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.city_districts(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('tecela_supervisoes_created_by_fkey', 'tecela_supervisoes', 'city_districts', FALSE, 'ALTER TABLE public.tecela_supervisoes ADD CONSTRAINT tecela_supervisoes_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT tool_districts_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.city_districts(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tool_districts_tool_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('tool_districts_tool_id_fkey', 'tool_districts', 'tools', TRUE, 'ALTER TABLE public.tool_districts ADD CONSTRAINT tool_districts_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES public.tools(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('tool_districts_tool_id_fkey', 'tool_districts', 'tools', FALSE, 'ALTER TABLE public.tool_districts ADD CONSTRAINT tool_districts_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES public.tools(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tools_district_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('tools_district_id_fkey', 'tools', 'districts', TRUE, 'ALTER TABLE public.tools ADD CONSTRAINT tools_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.districts(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('tools_district_id_fkey', 'tools', 'districts', FALSE, 'ALTER TABLE public.tools ADD CONSTRAINT tools_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.districts(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tools_ferramenta_pai_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('tools_ferramenta_pai_id_fkey', 'tools', 'tools', TRUE, 'ALTER TABLE public.tools ADD CONSTRAINT tools_ferramenta_pai_id_fkey FOREIGN KEY (ferramenta_pai_id) REFERENCES public.tools(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('tools_ferramenta_pai_id_fkey', 'tools', 'tools', FALSE, 'ALTER TABLE public.tools ADD CONSTRAINT tools_ferramenta_pai_id_fkey FOREIGN KEY (ferramenta_pai_id) REFERENCES public.tools(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tools_proximo_passo_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('tools_proximo_passo_id_fkey', 'tools', 'tools', TRUE, 'ALTER TABLE public.tools ADD CONSTRAINT tools_proximo_passo_id_fkey FOREIGN KEY (proximo_passo_id) REFERENCES public.tools(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('tools_proximo_passo_id_fkey', 'tools', 'tools', FALSE, 'ALTER TABLE public.tools ADD CONSTRAINT tools_proximo_passo_id_fkey FOREIGN KEY (proximo_passo_id) REFERENCES public.tools(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'torre_arquetipo_sugestao_arquetipo_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('torre_arquetipo_sugestao_arquetipo_id_fkey', 'torre_arquetipo_sugestao', 'atlas_arquetipos_femininos', TRUE, 'ALTER TABLE public.torre_arquetipo_sugestao ADD CONSTRAINT torre_arquetipo_sugestao_arquetipo_id_fkey FOREIGN KEY (arquetipo_id) REFERENCES public.atlas_arquetipos_femininos(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('torre_arquetipo_sugestao_arquetipo_id_fkey', 'torre_arquetipo_sugestao', 'atlas_arquetipos_femininos', FALSE, 'ALTER TABLE public.torre_arquetipo_sugestao ADD CONSTRAINT torre_arquetipo_sugestao_arquetipo_id_fkey FOREIGN KEY (arquetipo_id) REFERENCES public.atlas_arquetipos_femininos(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'torre_porta_relacao_porta_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('torre_porta_relacao_porta_id_fkey', 'torre_porta_relacao', 'labirinto_portas', TRUE, 'ALTER TABLE public.torre_porta_relacao ADD CONSTRAINT torre_porta_relacao_porta_id_fkey FOREIGN KEY (porta_id) REFERENCES public.labirinto_portas(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('torre_porta_relacao_porta_id_fkey', 'torre_porta_relacao', 'labirinto_portas', FALSE, 'ALTER TABLE public.torre_porta_relacao ADD CONSTRAINT torre_porta_relacao_porta_id_fkey FOREIGN KEY (porta_id) REFERENCES public.labirinto_portas(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'towers_client_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('towers_client_id_fkey', 'towers', 'clientes', TRUE, 'ALTER TABLE public.towers ADD CONSTRAINT towers_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('towers_client_id_fkey', 'towers', 'clientes', FALSE, 'ALTER TABLE public.towers ADD CONSTRAINT towers_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clientes(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'towers_session_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('towers_session_id_fkey', 'towers', 'sessions', TRUE, 'ALTER TABLE public.towers ADD CONSTRAINT towers_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('towers_session_id_fkey', 'towers', 'sessions', FALSE, 'ALTER TABLE public.towers ADD CONSTRAINT towers_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_comentarios_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('travessia_comentarios_user_id_fkey', 'travessia_comentarios', 'profiles', TRUE, 'ALTER TABLE public.travessia_comentarios ADD CONSTRAINT travessia_comentarios_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('travessia_comentarios_user_id_fkey', 'travessia_comentarios', 'profiles', FALSE, 'ALTER TABLE public.travessia_comentarios ADD CONSTRAINT travessia_comentarios_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_day_unlocks_aula_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('travessia_day_unlocks_aula_id_fkey', 'travessia_day_unlocks', 'conteudo_aulas', TRUE, 'ALTER TABLE public.travessia_day_unlocks ADD CONSTRAINT travessia_day_unlocks_aula_id_fkey FOREIGN KEY (aula_id) REFERENCES public.conteudo_aulas(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('travessia_day_unlocks_aula_id_fkey', 'travessia_day_unlocks', 'conteudo_aulas', FALSE, 'ALTER TABLE public.travessia_day_unlocks ADD CONSTRAINT travessia_day_unlocks_aula_id_fkey FOREIGN KEY (aula_id) REFERENCES public.conteudo_aulas(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_day_unlocks_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('travessia_day_unlocks_user_id_fkey', 'travessia_day_unlocks', 'travessia_familias', TRUE, 'ALTER TABLE public.travessia_day_unlocks ADD CONSTRAINT travessia_day_unlocks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: travessia_library_items travessia_library_items_familia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travessia_library_items
    ADD CONSTRAINT travessia_library_items_familia_id_fkey FOREIGN KEY (familia_id) REFERENCES public.travessia_familias(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('travessia_day_unlocks_user_id_fkey', 'travessia_day_unlocks', 'travessia_familias', FALSE, 'ALTER TABLE public.travessia_day_unlocks ADD CONSTRAINT travessia_day_unlocks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: travessia_library_items travessia_library_items_familia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travessia_library_items
    ADD CONSTRAINT travessia_library_items_familia_id_fkey FOREIGN KEY (familia_id) REFERENCES public.travessia_familias(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_library_media_item_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('travessia_library_media_item_id_fkey', 'travessia_library_media', 'travessia_library_items', TRUE, 'ALTER TABLE public.travessia_library_media ADD CONSTRAINT travessia_library_media_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.travessia_library_items(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('travessia_library_media_item_id_fkey', 'travessia_library_media', 'travessia_library_items', FALSE, 'ALTER TABLE public.travessia_library_media ADD CONSTRAINT travessia_library_media_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.travessia_library_items(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_library_tags_item_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('travessia_library_tags_item_id_fkey', 'travessia_library_tags', 'travessia_library_items', TRUE, 'ALTER TABLE public.travessia_library_tags ADD CONSTRAINT travessia_library_tags_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.travessia_library_items(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('travessia_library_tags_item_id_fkey', 'travessia_library_tags', 'travessia_library_items', FALSE, 'ALTER TABLE public.travessia_library_tags ADD CONSTRAINT travessia_library_tags_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.travessia_library_items(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'treinamento_respostas_caso_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('treinamento_respostas_caso_id_fkey', 'treinamento_respostas', 'treinamento_casos_simulados', TRUE, 'ALTER TABLE public.treinamento_respostas ADD CONSTRAINT treinamento_respostas_caso_id_fkey FOREIGN KEY (caso_id) REFERENCES public.treinamento_casos_simulados(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('treinamento_respostas_caso_id_fkey', 'treinamento_respostas', 'treinamento_casos_simulados', FALSE, 'ALTER TABLE public.treinamento_respostas ADD CONSTRAINT treinamento_respostas_caso_id_fkey FOREIGN KEY (caso_id) REFERENCES public.treinamento_casos_simulados(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'treinamento_respostas_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('treinamento_respostas_user_id_fkey', 'treinamento_respostas', 'upsell_rules', TRUE, 'ALTER TABLE public.treinamento_respostas ADD CONSTRAINT treinamento_respostas_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: upsell_opportunities upsell_opportunities_rule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.upsell_opportunities
    ADD CONSTRAINT upsell_opportunities_rule_id_fkey FOREIGN KEY (rule_id) REFERENCES public.upsell_rules(id) ;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('treinamento_respostas_user_id_fkey', 'treinamento_respostas', 'upsell_rules', FALSE, 'ALTER TABLE public.treinamento_respostas ADD CONSTRAINT treinamento_respostas_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: upsell_opportunities upsell_opportunities_rule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.upsell_opportunities
    ADD CONSTRAINT upsell_opportunities_rule_id_fkey FOREIGN KEY (rule_id) REFERENCES public.upsell_rules(id) ;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'upsell_opportunities_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('upsell_opportunities_user_id_fkey', 'upsell_opportunities', 'conteudo_aulas', TRUE, 'ALTER TABLE public.upsell_opportunities ADD CONSTRAINT upsell_opportunities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_aula_progress user_aula_progress_aula_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_aula_progress
    ADD CONSTRAINT user_aula_progress_aula_id_fkey FOREIGN KEY (aula_id) REFERENCES public.conteudo_aulas(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('upsell_opportunities_user_id_fkey', 'upsell_opportunities', 'conteudo_aulas', FALSE, 'ALTER TABLE public.upsell_opportunities ADD CONSTRAINT upsell_opportunities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_aula_progress user_aula_progress_aula_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_aula_progress
    ADD CONSTRAINT user_aula_progress_aula_id_fkey FOREIGN KEY (aula_id) REFERENCES public.conteudo_aulas(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_cidadela_estado_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('user_cidadela_estado_user_id_fkey', 'user_cidadela_estado', 'profiles', TRUE, 'ALTER TABLE public.user_cidadela_estado ADD CONSTRAINT user_cidadela_estado_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('user_cidadela_estado_user_id_fkey', 'user_cidadela_estado', 'profiles', FALSE, 'ALTER TABLE public.user_cidadela_estado ADD CONSTRAINT user_cidadela_estado_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_favorites_library_item_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('user_favorites_library_item_id_fkey', 'user_favorites', 'library_items', TRUE, 'ALTER TABLE public.user_favorites ADD CONSTRAINT user_favorites_library_item_id_fkey FOREIGN KEY (library_item_id) REFERENCES public.library_items(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('user_favorites_library_item_id_fkey', 'user_favorites', 'library_items', FALSE, 'ALTER TABLE public.user_favorites ADD CONSTRAINT user_favorites_library_item_id_fkey FOREIGN KEY (library_item_id) REFERENCES public.library_items(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_favorites_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('user_favorites_user_id_fkey', 'user_favorites', 'lessons', TRUE, 'ALTER TABLE public.user_favorites ADD CONSTRAINT user_favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_journey_stats user_journey_stats_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_journey_stats
    ADD CONSTRAINT user_journey_stats_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_progress user_progress_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('user_favorites_user_id_fkey', 'user_favorites', 'lessons', FALSE, 'ALTER TABLE public.user_favorites ADD CONSTRAINT user_favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_journey_stats user_journey_stats_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_journey_stats
    ADD CONSTRAINT user_journey_stats_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_progress user_progress_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_progress_user_id_fkey') THEN
        INSERT INTO fk_audit VALUES ('user_progress_user_id_fkey', 'user_progress', 'symbolic_rewards', TRUE, 'ALTER TABLE public.user_progress ADD CONSTRAINT user_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT user_unlocked_rewards_reward_id_fkey FOREIGN KEY (reward_id) REFERENCES public.symbolic_rewards(id) ON DELETE CASCADE;');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('user_progress_user_id_fkey', 'user_progress', 'symbolic_rewards', FALSE, 'ALTER TABLE public.user_progress ADD CONSTRAINT user_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT user_unlocked_rewards_reward_id_fkey FOREIGN KEY (reward_id) REFERENCES public.symbolic_rewards(id) ON DELETE CASCADE;');
        missing_count := missing_count + 1;
    END IF;
    
    RAISE NOTICE 'Found: %, Missing: %', found_count, missing_count;
END $$;

SELECT * FROM fk_audit WHERE exists = FALSE;
