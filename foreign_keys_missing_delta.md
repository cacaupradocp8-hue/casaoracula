# Foreign Keys Missing Delta Report

| Constraint Name | Source Table | Source Column | Target Table | Target Column | Reason |
| --- | --- | --- | --- | --- | --- |
| academy_progress_user_id_fkey | academy_progress | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: access_expiration_logs access_expiration_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_expiration_logs
    ADD CONSTRAINT access_expiration_logs_user_id_fkey FOREIGN KEY (user_id | profiles | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| admin_action_history_sent_by_fkey | admin_action_history | sent_by) REFERENCES auth.users(id);


--
-- Name: admin_action_history admin_action_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_action_history
    ADD CONSTRAINT admin_action_history_user_id_fkey FOREIGN KEY (user_id | profiles | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| admin_automation_audit_admin_id_fkey | admin_automation_audit | admin_id) REFERENCES auth.users(id);


--
-- Name: admin_automation_audit admin_automation_audit_rule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_automation_audit
    ADD CONSTRAINT admin_automation_audit_rule_id_fkey FOREIGN KEY (rule_id | admin_automation_rules | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| agente_conversas_agente_id_fkey | agente_conversas | agente_id | agentes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| agente_conversas_user_id_fkey | agente_conversas | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: agente_mensagens agente_mensagens_conversa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agente_mensagens
    ADD CONSTRAINT agente_mensagens_conversa_id_fkey FOREIGN KEY (conversa_id | agente_conversas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| ai_interaction_logs_agente_id_fkey | ai_interaction_logs | agente_id | agentes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| ai_recommendations_client_id_fkey | ai_recommendations | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| ai_recommendations_distrito_sugerido_id_fkey | ai_recommendations | distrito_sugerido_id | city_districts | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| ai_recommendations_session_id_fkey | ai_recommendations | session_id | sessions | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| ai_recommendations_tool_sugerida_id_fkey | ai_recommendations | tool_sugerida_id | tools | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| archetypal_profile_snapshots_client_id_fkey | archetypal_profile_snapshots | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| archetype_tools_archetype_id_fkey | archetype_tools | archetype_id | founding_archetypes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| archetype_tools_tool_id_fkey | archetype_tools | tool_id | tools | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| atelie_conteudos_created_by_fkey | atelie_conteudos | created_by) REFERENCES auth.users(id);


--
-- Name: atelie_conteudos atelie_conteudos_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.atelie_conteudos
    ADD CONSTRAINT atelie_conteudos_template_id_fkey FOREIGN KEY (template_id | atelie_templates | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| atlas_arquetipos_registros_client_id_fkey | atlas_arquetipos_registros | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| aulas_created_by_fkey | aulas | created_by) REFERENCES auth.users(id);


--
-- Name: aulas aulas_portal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.aulas
    ADD CONSTRAINT aulas_portal_id_fkey FOREIGN KEY (portal_id | portais | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| auto_mapeamento_user_id_fkey | auto_mapeamento | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: automation_settings automation_settings_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.automation_settings
    ADD CONSTRAINT automation_settings_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: biblioteca_casos biblioteca_casos_porta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.biblioteca_casos
    ADD CONSTRAINT biblioteca_casos_porta_id_fkey FOREIGN KEY (porta_id | labirinto_portas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| big5_funcional_perguntas_dimensao_id_fkey | big5_funcional_perguntas | dimensao_id | big5_funcional_dimensoes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| big5_oracular_perguntas_fator_id_fkey | big5_oracular_perguntas | fator_id | big5_oracular_fatores | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| big5_porta_mapeamento_ritual_id_fkey | big5_porta_mapeamento | ritual_id | rituais_simbolicos | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| big5_registros_cliente_id_fkey | big5_registros | cliente_id) REFERENCES auth.users(id) ON DELETE SET NULL;


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
    ADD CONSTRAINT big5_ritual_registros_big5_registro_id_fkey FOREIGN KEY (big5_registro_id | big5_oracular_registros | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| big5_ritual_registros_ritual_id_fkey | big5_ritual_registros | ritual_id | rituais_simbolicos | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| big5_symbolic_afirmacoes_force_id_fkey | big5_symbolic_afirmacoes | force_id | big5_symbolic_forces | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| big5_symbolic_registros_session_case_id_fkey | big5_symbolic_registros | session_case_id | session_cases | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| book_links_from_book_id_fkey | book_links | from_book_id | books | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| book_links_to_book_id_fkey | book_links | to_book_id | books | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| book_media_station_id_fkey | book_media | station_id | clube_estacoes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| book_tours_book_id_fkey | book_tours | book_id | books | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| canteiro_reactions_entry_id_fkey | canteiro_reactions | entry_id | collective_bed_entries | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| cartografia_complexos_client_id_fkey | cartografia_complexos | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| cartografia_psiquica_client_id_fkey | cartografia_psiquica | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| cartographer_engine_client_id_fkey | cartographer_engine | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| cartographer_engine_session_id_fkey | cartographer_engine | session_id | sessions | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| cartographer_recommendations_engine_id_fkey | cartographer_recommendations | engine_id | cartographer_engine | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| cartographer_recommendations_ferramenta_escolhida_id_fkey | cartographer_recommendations | ferramenta_escolhida_id | tools | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| cartographer_recommendations_tool_complementar_id_fkey | cartographer_recommendations | tool_complementar_id | tools | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| cartographer_recommendations_tool_principal_id_fkey | cartographer_recommendations | tool_principal_id | tools | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| cartographies_client_id_fkey | cartographies | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| cartographies_session_id_fkey | cartographies | session_id | sessions | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| casa_circulo_replies_autor_id_fkey | casa_circulo_replies | autor_id) REFERENCES auth.users(id);


--
-- Name: casa_circulo_replies casa_circulo_replies_thread_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.casa_circulo_replies
    ADD CONSTRAINT casa_circulo_replies_thread_id_fkey FOREIGN KEY (thread_id | casa_circulo_threads | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| casa_circulo_threads_autor_id_fkey | casa_circulo_threads | autor_id) REFERENCES auth.users(id);


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
    ADD CONSTRAINT cidadela_oracle_cards_district_id_fkey FOREIGN KEY (district_id | districts | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| cidadela_oracle_cards_suggested_tool_id_fkey | cidadela_oracle_cards | suggested_tool_id | tools | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| cidadela_oracle_usage_card_id_fkey | cidadela_oracle_usage | card_id | cidadela_oracle_cards | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| cidadela_oracle_usage_client_id_fkey | cidadela_oracle_usage | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| circulo_oracular_registros_user_id_fkey | circulo_oracular_registros | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: client_archetype_state client_archetype_state_arquitipo_evolucao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_archetype_state
    ADD CONSTRAINT client_archetype_state_arquitipo_evolucao_id_fkey FOREIGN KEY (arquitipo_evolucao_id | founding_archetypes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| client_archetype_state_arquitipo_regente_id_fkey | client_archetype_state | arquitipo_regente_id | founding_archetypes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| client_archetype_state_arquitipo_sombra_id_fkey | client_archetype_state | arquitipo_sombra_id | founding_archetypes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| client_archetype_state_client_id_fkey | client_archetype_state | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| client_cidadela_map_client_id_fkey | client_cidadela_map | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| client_city_state_arquetipo_ativo_fkey | client_city_state | arquetipo_ativo | founding_archetypes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| client_city_state_client_id_fkey | client_city_state | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| client_city_state_distrito_id_fkey | client_city_state | distrito_id | city_districts | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| client_city_state_ultima_ferramenta_id_fkey | client_city_state | ultima_ferramenta_id | tools | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| client_city_state_ultima_sessao_id_fkey | client_city_state | ultima_sessao_id | sessions | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| client_labyrinths_client_id_fkey | client_labyrinths | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| client_live_map_entries_session_id_fkey | client_live_map_entries | session_id | sessions | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| client_pattern_stats_client_id_fkey | client_pattern_stats | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| client_seasons_client_id_fkey | client_seasons | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| clientes_client_user_id_fkey | clientes | client_user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


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
    ADD CONSTRAINT club_books_cycle_id_fkey FOREIGN KEY (cycle_id | _deprecated_club_cycles | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| club_knowledge_entries_book_id_fkey | _deprecated_club_knowledge_entries | book_id | books | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| club_meetings_cycle_id_fkey | _deprecated_club_meetings | cycle_id | _deprecated_club_cycles | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| club_user_cycles_cycle_id_fkey | _deprecated_club_user_cycles | cycle_id | _deprecated_club_cycles | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| clube_audio_albums_estacao_id_fkey | clube_audio_albums | estacao_id | clube_estacoes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| clube_audio_progress_track_id_fkey | clube_audio_progress | track_id | clube_audio_tracks | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| clube_audio_tracks_album_id_fkey | clube_audio_tracks | album_id | clube_audio_albums | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| clube_carrossel_slides_estacao_id_fkey | clube_carrossel_slides | estacao_id | oracular_seasons | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| clube_engajamento_estacao_id_fkey | clube_engajamento | estacao_id | clube_estacoes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| clube_estacao_registros_estacao_id_fkey | clube_estacao_registros | estacao_id | clube_estacoes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| clube_estacoes_cartografia_id_fkey | clube_estacoes | cartografia_id | cartographies | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| clube_estacoes_quiz_id_fkey | clube_estacoes | quiz_id | quizzes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| clube_jornadas_estacao_id_fkey | clube_jornadas | estacao_id | clube_estacoes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| clube_livro_aulas_porta_id_fkey | clube_livro_aulas | porta_id | clube_livro_portas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| clube_livro_chat_interactions_book_id_fkey | clube_livro_chat_interactions | book_id | books | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| clube_livro_chat_interactions_user_id_fkey | clube_livro_chat_interactions | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: clube_livro_encontros clube_livro_encontros_estacao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clube_livro_encontros
    ADD CONSTRAINT clube_livro_encontros_estacao_id_fkey FOREIGN KEY (estacao_id | clube_estacoes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| clube_livro_respostas_pergunta_id_fkey | clube_livro_respostas | pergunta_id | clube_livro_perguntas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| clube_obras_essencia_8020_book_id_fkey | clube_obras_essencia_8020 | book_id | books | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| clube_portais_jornada_id_fkey | clube_portais | jornada_id | clube_jornadas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| clube_portal_audios_portal_id_fkey | clube_portal_audios | portal_id | clube_portais | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| clube_portal_insights_estacao_id_fkey | clube_portal_insights | estacao_id | oracular_seasons | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| clube_portal_materiais_portal_id_fkey | clube_portal_materiais | portal_id | clube_portais | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| clube_progresso_passos_passo_id_fkey | clube_progresso_passos | passo_id | clube_rota_itens | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| clube_progresso_passos_user_id_fkey | clube_progresso_passos | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: clube_reflexoes clube_reflexoes_estacao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clube_reflexoes
    ADD CONSTRAINT clube_reflexoes_estacao_id_fkey FOREIGN KEY (estacao_id | clube_estacoes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| clube_rota_itens_estacao_id_fkey | clube_rota_itens | estacao_id | clube_estacoes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| clube_rota_progresso_estacao_id_fkey | clube_rota_progresso | estacao_id | clube_estacoes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| clube_rota_progresso_rota_item_id_fkey | clube_rota_progresso | rota_item_id | clube_rota_itens | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| clube_rota_progresso_user_id_fkey | clube_rota_progresso | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: clube_v3_station_audios clube_v3_station_audios_station_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clube_v3_station_audios
    ADD CONSTRAINT clube_v3_station_audios_station_id_fkey FOREIGN KEY (station_id | clube_v3_stations | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| clube_v3_station_content_station_id_fkey | clube_v3_station_content | station_id | clube_v3_stations | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| clube_v3_stations_route_id_fkey | clube_v3_stations | route_id | clube_v3_routes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| clube_v3_user_progress_station_id_fkey | clube_v3_user_progress | station_id | clube_v3_stations | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_ai_recommendations_client_id_fkey | co_ai_recommendations | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_ai_recommendations_tool_complementar_id_fkey | co_ai_recommendations | tool_complementar_id | sala_ferramentas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_ai_recommendations_tool_sugerida_id_fkey | co_ai_recommendations | tool_sugerida_id | sala_ferramentas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_appointments_client_id_fkey | co_appointments | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_appointments_terapeuta_user_id_fkey | co_appointments | terapeuta_user_id) REFERENCES auth.users(id);


--
-- Name: co_appointments co_appointments_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_appointments
    ADD CONSTRAINT co_appointments_workspace_id_fkey FOREIGN KEY (workspace_id | co_workspaces | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_camara_sussurro_casos_proximo_treino_id_fkey | co_camara_sussurro_casos | proximo_treino_id | co_camara_sussurro_casos | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_city_history_client_id_fkey | co_city_history | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_city_history_tool_id_fkey | co_city_history | tool_id | sala_ferramentas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_client_invites_therapist_user_id_fkey | co_client_invites | therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_client_profile co_client_profile_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_client_profile
    ADD CONSTRAINT co_client_profile_client_id_fkey FOREIGN KEY (client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_client_profile_therapist_id_fkey | co_client_profile | therapist_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_client_profiles co_client_profiles_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_client_profiles
    ADD CONSTRAINT co_client_profiles_client_id_fkey FOREIGN KEY (client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_convites_cliente_id_fkey | co_convites | cliente_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_escutas_client_user_id_fkey | co_escutas | client_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_escutas co_escutas_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_escutas
    ADD CONSTRAINT co_escutas_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: co_escutas co_escutas_sessao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_escutas
    ADD CONSTRAINT co_escutas_sessao_id_fkey FOREIGN KEY (sessao_id | co_sessoes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_escutas_therapist_user_id_fkey | co_escutas | therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_garden_flowers co_garden_flowers_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_garden_flowers
    ADD CONSTRAINT co_garden_flowers_client_id_fkey FOREIGN KEY (client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_garden_flowers_origem_registro_id_fkey | co_garden_flowers | origem_registro_id | co_journey_records | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_jardim_entries_client_user_id_fkey | co_jardim_entries | client_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_jardim_entries co_jardim_entries_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_jardim_entries
    ADD CONSTRAINT co_jardim_entries_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: co_jardim_entries co_jardim_entries_jardim_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_jardim_entries
    ADD CONSTRAINT co_jardim_entries_jardim_id_fkey FOREIGN KEY (jardim_id | co_jardins | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_jardim_entries_therapist_user_id_fkey | co_jardim_entries | therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT co_journey_records_client_id_fkey FOREIGN KEY (client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_journey_records_tool_id_fkey | co_journey_records | tool_id | sala_ferramentas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_mentora_feedback_user_id_fkey | co_mentora_feedback | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_mentora_insights co_mentora_insights_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_mentora_insights
    ADD CONSTRAINT co_mentora_insights_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_orientacao_sugestoes_ia co_orientacao_sugestoes_ia_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_orientacao_sugestoes_ia
    ADD CONSTRAINT co_orientacao_sugestoes_ia_cliente_id_fkey FOREIGN KEY (cliente_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_orientacao_sugestoes_ia_orientacao_id_fkey | co_orientacao_sugestoes_ia | orientacao_id | co_orientacoes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_orientacao_sugestoes_ia_session_id_fkey | co_orientacao_sugestoes_ia | session_id | sessions | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_orientacoes_cliente_id_fkey | co_orientacoes | cliente_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_orientacoes_session_id_fkey | co_orientacoes | session_id | sessions | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_passport_entries_client_id_fkey | co_passport_entries | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_praticas_client_user_id_fkey | co_praticas | client_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_praticas co_praticas_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_praticas
    ADD CONSTRAINT co_praticas_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: co_praticas co_praticas_sessao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_praticas
    ADD CONSTRAINT co_praticas_sessao_id_fkey FOREIGN KEY (sessao_id | co_sessoes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_praticas_therapist_user_id_fkey | co_praticas | therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT co_registros_simbolicos_jardim_id_fkey FOREIGN KEY (jardim_id | co_jardins | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_registros_simbolicos_sessao_id_fkey | co_registros_simbolicos | sessao_id | co_sessoes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_registros_simbolicos_therapist_user_id_fkey | co_registros_simbolicos | therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT co_sessoes_jardim_ref_id_fkey FOREIGN KEY (jardim_ref_id | co_jardins | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_sessoes_therapist_user_id_fkey | co_sessoes | therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_sim_options co_sim_options_proximo_step_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_sim_options
    ADD CONSTRAINT co_sim_options_proximo_step_id_fkey FOREIGN KEY (proximo_step_id | co_sim_steps | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_sim_options_step_id_fkey | co_sim_options | step_id | co_sim_steps | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_sim_progress_case_id_fkey | co_sim_progress | case_id | co_sim_cases | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_sim_progress_escolha_id_fkey | co_sim_progress | escolha_id | co_sim_options | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_sim_progress_step_id_fkey | co_sim_progress | step_id | co_sim_steps | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_sim_steps_case_id_fkey | co_sim_steps | case_id | co_sim_cases | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_therapist_profile_user_id_fkey | co_therapist_profile | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_tool_flows co_tool_flows_tool_destino_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_tool_flows
    ADD CONSTRAINT co_tool_flows_tool_destino_id_fkey FOREIGN KEY (tool_destino_id | tools | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_tool_flows_tool_origem_id_fkey | co_tool_flows | tool_origem_id | tools | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_tool_usage_tool_id_fkey | co_tool_usage | tool_id | sala_ferramentas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_training_attempts_case_id_fkey | co_training_attempts | case_id | co_training_cases | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_training_attempts_user_id_fkey | co_training_attempts | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_training_case_feedbacks co_training_case_feedbacks_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_training_case_feedbacks
    ADD CONSTRAINT co_training_case_feedbacks_case_id_fkey FOREIGN KEY (case_id | co_training_cases | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_training_case_possible_readings_case_id_fkey | co_training_case_possible_readings | case_id | co_training_cases | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_training_case_signals_case_id_fkey | co_training_case_signals | case_id | co_training_cases | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_training_progress_ultimo_case_id_fkey | co_training_progress | ultimo_case_id | co_training_cases | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_training_progress_user_id_fkey | co_training_progress | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_travessia_encontros co_travessia_encontros_travessia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_travessia_encontros
    ADD CONSTRAINT co_travessia_encontros_travessia_id_fkey FOREIGN KEY (travessia_id | co_travessias | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_travessia_respostas_encontro_id_fkey | co_travessia_respostas | encontro_id | co_travessia_encontros | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_travessia_respostas_travessia_id_fkey | co_travessia_respostas | travessia_id | co_travessias | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_workspace_users_user_id_fkey | co_workspace_users | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: co_workspace_users co_workspace_users_workspace_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.co_workspace_users
    ADD CONSTRAINT co_workspace_users_workspace_id_fkey FOREIGN KEY (workspace_id | co_workspaces | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| co_workspaces_owner_user_id_fkey | co_workspaces | owner_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: collective_bed_entries collective_bed_entries_bed_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collective_bed_entries
    ADD CONSTRAINT collective_bed_entries_bed_id_fkey FOREIGN KEY (bed_id | collective_beds | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| collective_bed_entries_season_id_fkey | collective_bed_entries | season_id | oracular_seasons | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| collective_bed_entries_user_id_fkey | collective_bed_entries | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: collective_beds collective_beds_season_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collective_beds
    ADD CONSTRAINT collective_beds_season_id_fkey FOREIGN KEY (season_id | oracular_seasons | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| community_comments_autor_id_fkey | community_comments | autor_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: community_comments community_comments_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_comments
    ADD CONSTRAINT community_comments_post_id_fkey FOREIGN KEY (post_id | community_posts | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| community_event_participants_event_id_fkey | community_event_participants | event_id | community_events | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| community_event_participants_user_id_fkey | community_event_participants | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: community_events community_events_criador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_events
    ADD CONSTRAINT community_events_criador_id_fkey FOREIGN KEY (criador_id) REFERENCES auth.users(id);


--
-- Name: community_group_members community_group_members_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_group_members
    ADD CONSTRAINT community_group_members_group_id_fkey FOREIGN KEY (group_id | community_groups | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| community_group_members_user_id_fkey | community_group_members | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: community_groups community_groups_criador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_groups
    ADD CONSTRAINT community_groups_criador_id_fkey FOREIGN KEY (criador_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: community_likes community_likes_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_likes
    ADD CONSTRAINT community_likes_post_id_fkey FOREIGN KEY (post_id | community_posts | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| community_likes_user_id_fkey | community_likes | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT community_topic_replies_topic_id_fkey FOREIGN KEY (topic_id | community_topics | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| community_topics_autor_id_fkey | community_topics | autor_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: community_topics community_topics_forum_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.community_topics
    ADD CONSTRAINT community_topics_forum_id_fkey FOREIGN KEY (forum_id | community_forums | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| conselho_partes_internas_client_id_fkey | conselho_partes_internas | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| content_blocks_agente_id_fkey | content_blocks | agente_id | agentes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| conteudo_aulas_travessia_id_fkey | conteudo_aulas | travessia_id | conteudo_travessias | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| conteudo_travessias_sala_id_fkey | conteudo_travessias | sala_id | salas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| contos_clinicos_audio_padrao_id_fkey | contos_clinicos | audio_padrao_id | audio_assets | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| corpo_inconsciente_cliente_id_fkey | corpo_inconsciente | cliente_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| course_enrollments_course_id_fkey | course_enrollments | course_id | courses | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| course_exercise_responses_lesson_id_fkey | course_exercise_responses | lesson_id | course_lessons | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| course_lesson_progress_lesson_id_fkey | course_lesson_progress | lesson_id | course_lessons | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| course_lessons_module_id_fkey | course_lessons | module_id | course_modules | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| course_module_forum_posts_module_id_fkey | course_module_forum_posts | module_id | course_modules | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| course_module_forum_posts_parent_id_fkey | course_module_forum_posts | parent_id | course_module_forum_posts | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| course_module_forum_posts_user_id_fkey | course_module_forum_posts | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: course_modules course_modules_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_modules
    ADD CONSTRAINT course_modules_course_id_fkey FOREIGN KEY (course_id | courses | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| course_work_submissions_course_id_fkey | course_work_submissions | course_id | courses | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| course_work_submissions_reviewed_by_fkey | course_work_submissions | reviewed_by) REFERENCES auth.users(id);


--
-- Name: course_work_submissions course_work_submissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_work_submissions
    ADD CONSTRAINT course_work_submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: courses courses_sala_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_sala_id_fkey FOREIGN KEY (sala_id | salas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| custom_oracle_cards_custom_oracle_id_fkey | custom_oracle_cards | custom_oracle_id | custom_oracles | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| cycle_books_book_id_fkey | cycle_books | book_id | books | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| cycle_books_cycle_id_fkey | cycle_books | cycle_id | cycles | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| decodificacao_onirica_cliente_id_fkey | decodificacao_onirica | cliente_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| decodificacao_onirica_session_case_id_fkey | decodificacao_onirica | session_case_id | session_cases | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| decodificacao_onirica_terapeuta_id_fkey | decodificacao_onirica | terapeuta_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT diagnostico_ego_cliente_id_fkey FOREIGN KEY (cliente_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| district_state_changes_client_id_fkey | district_state_changes | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| district_state_changes_district_id_fkey | district_state_changes | district_id | districts | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| dreams_client_id_fkey | dreams | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| dreams_session_id_fkey | dreams | session_id | sessions | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| email_logs_user_id_fkey | email_logs | user_id | profiles | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| eneagrama_feminino_afirmacoes_arquetipo_id_fkey | eneagrama_feminino_afirmacoes | arquetipo_id | eneagrama_feminino_arquetipos | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| eneagrama_feminino_orientacoes_arquetipo_id_fkey | eneagrama_feminino_orientacoes | arquetipo_id | eneagrama_feminino_arquetipos | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| eneagrama_feminino_registros_session_case_id_fkey | eneagrama_feminino_registros | session_case_id | session_cases | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| eneagrama_feminino_registros_user_id_fkey | eneagrama_feminino_registros | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT escrita_nao_censurada_cliente_id_fkey FOREIGN KEY (cliente_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| estudio_projetos_book_id_fkey | estudio_projetos | book_id | books | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| estudos_caso_respostas_estudo_caso_id_fkey | estudos_caso_respostas | estudo_caso_id | estudos_caso | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| estudos_caso_respostas_user_id_fkey | estudos_caso_respostas | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: exercise_responses exercise_responses_exercise_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exercise_responses
    ADD CONSTRAINT exercise_responses_exercise_id_fkey FOREIGN KEY (exercise_id | exercises | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| exercise_responses_user_id_fkey | exercise_responses | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: exercises exercises_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_lesson_id_fkey FOREIGN KEY (lesson_id | lessons | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| facilitadora_profiles_user_id_fkey | facilitadora_profiles | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: ferramenta_registros ferramenta_registros_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ferramenta_registros
    ADD CONSTRAINT ferramenta_registros_cliente_id_fkey FOREIGN KEY (cliente_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| ferramenta_registros_ferramenta_id_fkey | ferramenta_registros | ferramenta_id | sala_ferramentas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| fk_big5_caso | big5_registros | caso_id | casos | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| fk_eneagrama_caso | eneagrama_registros | caso_id | casos | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| formacao_modulos_formacao_id_fkey | formacao_modulos | formacao_id | formacoes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| formacao_oracula_content_updated_by_fkey | formacao_oracula_content | updated_by) REFERENCES auth.users(id);


--
-- Name: founding_archetypes founding_archetypes_distrito_principal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.founding_archetypes
    ADD CONSTRAINT founding_archetypes_distrito_principal_id_fkey FOREIGN KEY (distrito_principal_id | city_districts | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| gestos_integracao_cliente_id_fkey | gestos_integracao | cliente_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| gestos_integracao_owner_id_fkey | gestos_integracao | owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: gestos_integracao gestos_integracao_sessao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gestos_integracao
    ADD CONSTRAINT gestos_integracao_sessao_id_fkey FOREIGN KEY (sessao_id | sessoes_casa_maquinas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| group_encounters_group_id_fkey | group_encounters | group_id | therapy_groups | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| group_field_snapshots_circulo_id_fkey | group_field_snapshots | circulo_id | circulos_sagrados | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| group_field_snapshots_group_id_fkey | group_field_snapshots | group_id | therapeutic_groups | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| group_members_client_id_fkey | group_members | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| group_members_group_id_fkey | group_members | group_id | therapy_groups | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| group_participants_cliente_id_fkey | group_participants | cliente_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| group_participants_group_id_fkey | group_participants | group_id | therapeutic_groups | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| group_sessions_group_id_fkey | group_sessions | group_id | therapeutic_groups | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| group_sessions_therapist_id_fkey | group_sessions | therapist_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: heroina_arquetipo_registros heroina_arquetipo_registros_arquetipo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.heroina_arquetipo_registros
    ADD CONSTRAINT heroina_arquetipo_registros_arquetipo_id_fkey FOREIGN KEY (arquetipo_id | labirinto_arquetipos | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| heroina_arquetipo_registros_user_id_fkey | heroina_arquetipo_registros | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: heroina_cenario_registros heroina_cenario_registros_metafora_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.heroina_cenario_registros
    ADD CONSTRAINT heroina_cenario_registros_metafora_id_fkey FOREIGN KEY (metafora_id | labirinto_metaforas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| heroina_cenario_registros_user_id_fkey | heroina_cenario_registros | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: heroina_fase_ativa heroina_fase_ativa_fase_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.heroina_fase_ativa
    ADD CONSTRAINT heroina_fase_ativa_fase_id_fkey FOREIGN KEY (fase_id | labirinto_fases | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| heroina_fase_ativa_user_id_fkey | heroina_fase_ativa | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT heroina_ritual_registros_ritual_id_fkey FOREIGN KEY (ritual_id | labirinto_rituais | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| imaginacao_ativa_cliente_id_fkey | imaginacao_ativa | cliente_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| intervention_favorites_intervention_id_fkey | intervention_favorites | intervention_id | interventions | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| intervention_favorites_user_id_fkey | intervention_favorites | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: interventions interventions_district_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interventions
    ADD CONSTRAINT interventions_district_id_fkey FOREIGN KEY (district_id | districts | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| inventario_personas_cliente_id_fkey | inventario_personas | cliente_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| jardim_do_oficio_cliente_id_fkey | jardim_do_oficio | cliente_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| jardim_do_oficio_sessao_id_fkey | jardim_do_oficio | sessao_id | sessoes_casa_maquinas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| jardim_do_oficio_user_id_fkey | jardim_do_oficio | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: jardim_grupo_registros jardim_grupo_registros_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jardim_grupo_registros
    ADD CONSTRAINT jardim_grupo_registros_group_id_fkey FOREIGN KEY (group_id | therapeutic_groups | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| jardim_grupo_registros_session_id_fkey | jardim_grupo_registros | session_id | group_sessions | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| jardim_heroina_case_id_fkey | jardim_heroina | case_id | session_cases | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| jardim_heroina_client_id_fkey | jardim_heroina | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| jardim_heroina_registros_mapa_vivo_id_fkey | jardim_heroina_registros | mapa_vivo_id | mapa_vivo_heroina | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| jardim_heroina_registros_mapa_vivo_origem_id_fkey | jardim_heroina_registros | mapa_vivo_origem_id | mapa_vivo_heroina | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| jardim_heroina_registros_session_case_id_fkey | jardim_heroina_registros | session_case_id | session_cases | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| jardim_heroina_therapist_id_fkey | jardim_heroina | therapist_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT jornada_heroina_notas_profissionais_registro_id_fkey FOREIGN KEY (registro_id | jornada_heroina_registros | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| jornada_heroina_registros_cliente_id_fkey | jornada_heroina_registros | cliente_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| jornada_heroina_registros_session_case_id_fkey | jornada_heroina_registros | session_case_id | session_cases | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| jornada_heroina_respostas_registro_id_fkey | jornada_heroina_respostas | registro_id | jornada_heroina_registros | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| jornada_individuacao_client_id_fkey | jornada_individuacao | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| jornada_individuacao_therapist_id_fkey | jornada_individuacao | therapist_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: jornada_progressao jornada_progressao_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jornada_progressao
    ADD CONSTRAINT jornada_progressao_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: journey_districts journey_districts_district_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journey_districts
    ADD CONSTRAINT journey_districts_district_id_fkey FOREIGN KEY (district_id | districts | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| journey_districts_journey_id_fkey | journey_districts | journey_id | journeys | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| journey_events_client_id_fkey | journey_events | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| journey_events_session_id_fkey | journey_events | session_id | sessions | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| journey_events_therapist_id_fkey | journey_events | therapist_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: journey_media journey_media_journey_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journey_media
    ADD CONSTRAINT journey_media_journey_id_fkey FOREIGN KEY (journey_id | clube_jornadas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| journey_reflections_client_id_fkey | journey_reflections | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| journey_reflections_therapist_id_fkey | journey_reflections | therapist_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: journeys journeys_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journeys
    ADD CONSTRAINT journeys_client_id_fkey FOREIGN KEY (client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| journeys_current_district_id_fkey | journeys | current_district_id | districts | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| lab_8020_progress_book_id_fkey | lab_8020_progress | book_id | books | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| lab_8020_progress_season_id_fkey | lab_8020_progress | season_id | oracular_seasons | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| labirinto_39_portas_client_id_fkey | labirinto_39_portas | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| labirinto_anotacoes_cliente_id_fkey | labirinto_anotacoes | cliente_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| labirinto_anotacoes_porta_id_fkey | labirinto_anotacoes | porta_id | labirinto_portas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| labirinto_leituras_cliente_id_fkey | labirinto_leituras | cliente_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| labirinto_leituras_porta_id_fkey | labirinto_leituras | porta_id | labirinto_portas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| labirinto_registros_arquetipo_id_fkey | labirinto_registros | arquetipo_id | labirinto_arquetipos | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| labirinto_registros_fase_id_fkey | labirinto_registros | fase_id | labirinto_fases | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| labirinto_registros_metafora_id_fkey | labirinto_registros | metafora_id | labirinto_metaforas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| labirinto_registros_ritual_id_fkey | labirinto_registros | ritual_id | labirinto_rituais | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| labirinto_registros_session_case_id_fkey | labirinto_registros | session_case_id | session_cases | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| labirinto_registros_terapeuta_id_fkey | labirinto_registros | terapeuta_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: labirinto_registros labirinto_registros_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.labirinto_registros
    ADD CONSTRAINT labirinto_registros_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: labirinto_roteiros_gerados labirinto_roteiros_gerados_arquetipo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.labirinto_roteiros_gerados
    ADD CONSTRAINT labirinto_roteiros_gerados_arquetipo_id_fkey FOREIGN KEY (arquetipo_id | labirinto_arquetipos | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| labirinto_roteiros_gerados_fase_id_fkey | labirinto_roteiros_gerados | fase_id | labirinto_fases | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| labirinto_roteiros_gerados_metafora_id_fkey | labirinto_roteiros_gerados | metafora_id | labirinto_metaforas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| labirinto_roteiros_gerados_ritual_id_fkey | labirinto_roteiros_gerados | ritual_id | labirinto_rituais | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| labirinto_roteiros_gerados_session_case_id_fkey | labirinto_roteiros_gerados | session_case_id | session_cases | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| labyrinth_records_client_id_fkey | labyrinth_records | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| labyrinth_records_session_id_fkey | labyrinth_records | session_id | sessions | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| lessons_album_book_id_fkey | lessons_album | book_id | books | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| lessons_travessia_id_fkey | lessons | travessia_id | travessias | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| library_items_created_by_fkey | library_items | created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: mapa_heroina mapa_heroina_porta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mapa_heroina
    ADD CONSTRAINT mapa_heroina_porta_id_fkey FOREIGN KEY (porta_id | labirinto_fases | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| mapa_sombra_cliente_id_fkey | mapa_sombra | cliente_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| mapa_vivo_heroina_gesto_jardim_registro_id_fkey | mapa_vivo_heroina | gesto_jardim_registro_id | jardim_heroina_registros | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| mapa_vivo_heroina_session_case_id_fkey | mapa_vivo_heroina | session_case_id | session_cases | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| mapa_vivo_historico_mapa_id_fkey | mapa_vivo_historico | mapa_id | mapa_vivo_heroina | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| mapeamento_complexos_cliente_id_fkey | mapeamento_complexos | cliente_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| matriculas_user_id_fkey | matriculas | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: message_campaigns message_campaigns_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_campaigns
    ADD CONSTRAINT message_campaigns_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: message_logs message_logs_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_logs
    ADD CONSTRAINT message_logs_campaign_id_fkey FOREIGN KEY (campaign_id | message_campaigns | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| message_logs_template_id_fkey | message_logs | template_id | message_templates | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| message_logs_user_id_fkey | message_logs | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: message_templates message_templates_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_templates
    ADD CONSTRAINT message_templates_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id);


--
-- Name: mind_map_nodes mind_map_nodes_map_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mind_map_nodes
    ADD CONSTRAINT mind_map_nodes_map_id_fkey FOREIGN KEY (map_id | mind_maps | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| mind_map_nodes_parent_id_fkey | mind_map_nodes | parent_id | mind_map_nodes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| mind_maps_owner_id_fkey | mind_maps | owner_id | profiles | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| missoes_aula_id_fkey | missoes | aula_id | aulas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| missoes_created_by_fkey | missoes | created_by) REFERENCES auth.users(id);


--
-- Name: missoes missoes_portal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.missoes
    ADD CONSTRAINT missoes_portal_id_fkey FOREIGN KEY (portal_id | portais | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| narrative_maps_case_id_fkey | narrative_maps | case_id | session_cases | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| narrative_maps_client_id_fkey | narrative_maps | client_id | profiles | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| narrative_maps_therapist_id_fkey | narrative_maps | therapist_id | profiles | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| narroterapia_estudos_audio_id_fkey | narroterapia_estudos | audio_id | audio_assets | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| narroterapia_reacoes_simbolicas_audio_id_fkey | narroterapia_reacoes_simbolicas | audio_id | audio_assets | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| narroterapia_reacoes_simbolicas_conto_clinico_id_fkey | narroterapia_reacoes_simbolicas | conto_clinico_id | contos_clinicos | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| notification_logs_user_id_fkey | notification_logs | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT oracle_cards_archetype_id_fkey FOREIGN KEY (archetype_id | founding_archetypes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| oracle_cards_deck_id_fkey | oracle_cards | deck_id | oracle_decks | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| oracle_cards_district_id_fkey | oracle_cards | district_id | city_districts | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| oracle_cards_tool_id_fkey | oracle_cards | tool_id | tools | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| oracle_categories_oracle_id_fkey | oracle_categories | oracle_id | oracle_decks | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| oracle_clients_therapist_user_id_fkey | oracle_clients | therapist_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oracle_decks oracle_decks_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oracle_decks
    ADD CONSTRAINT oracle_decks_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: oracle_draws oracle_draws_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oracle_draws
    ADD CONSTRAINT oracle_draws_client_id_fkey FOREIGN KEY (client_id | oracle_clients | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| oracle_draws_oracle_id_fkey | oracle_draws | oracle_id | oracle_decks | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| oracle_draws_spread_id_fkey | oracle_draws | spread_id | oracle_spreads | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| oracle_draws_user_id_fkey | oracle_draws | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oracle_spread_positions oracle_spread_positions_spread_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oracle_spread_positions
    ADD CONSTRAINT oracle_spread_positions_spread_id_fkey FOREIGN KEY (spread_id | oracle_spreads | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| oracle_spreads_oracle_id_fkey | oracle_spreads | oracle_id | oracle_decks | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| oracle_usage_stats_client_id_fkey | oracle_usage_stats | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| oraculo_aplicacoes_pergunta_id_fkey | oraculo_aplicacoes | pergunta_id | oraculo_perguntas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| oraculo_aplicacoes_user_id_fkey | oraculo_aplicacoes | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oraculo_favoritos oraculo_favoritos_pergunta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oraculo_favoritos
    ADD CONSTRAINT oraculo_favoritos_pergunta_id_fkey FOREIGN KEY (pergunta_id | oraculo_perguntas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| oraculo_favoritos_user_id_fkey | oraculo_favoritos | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oraculo_portal_aplicacoes oraculo_portal_aplicacoes_portal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.oraculo_portal_aplicacoes
    ADD CONSTRAINT oraculo_portal_aplicacoes_portal_id_fkey FOREIGN KEY (portal_id | oraculo_portais | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| oraculo_portal_audios_portal_id_fkey | oraculo_portal_audios | portal_id | oraculo_portais | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| oraculo_portal_essencia_portal_id_fkey | oraculo_portal_essencia | portal_id | oraculo_portais | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| oraculo_portal_ferramenta_campos_ferramenta_id_fkey | oraculo_portal_ferramenta_campos | ferramenta_id | oraculo_portal_ferramentas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| oraculo_portal_ferramentas_portal_id_fkey | oraculo_portal_ferramentas | portal_id | oraculo_portais | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| oraculo_portal_forja_erros_forja_id_fkey | oraculo_portal_forja_erros | forja_id | oraculo_portal_forjas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| oraculo_portal_forja_passos_forja_id_fkey | oraculo_portal_forja_passos | forja_id | oraculo_portal_forjas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| oraculo_portal_forjas_portal_id_fkey | oraculo_portal_forjas | portal_id | oraculo_portais | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| oraculo_portal_jardins_portal_id_fkey | oraculo_portal_jardins | portal_id | oraculo_portais | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| oraculo_portal_laboratorio_passos_laboratorio_id_fkey | oraculo_portal_laboratorio_passos | laboratorio_id | oraculo_portal_laboratorios | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| oraculo_portal_laboratorios_portal_id_fkey | oraculo_portal_laboratorios | portal_id | oraculo_portais | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| oraculo_portal_materiais_portal_id_fkey | oraculo_portal_materiais | portal_id | oraculo_portais | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey | oraculo_portal_narroterapia_perguntas | narroterapia_id | oraculo_portal_narroterapia | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| oraculo_portal_narroterapia_portal_id_fkey | oraculo_portal_narroterapia | portal_id | oraculo_portais | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| oraculo_portal_riscos_eticos_portal_id_fkey | oraculo_portal_riscos_eticos | portal_id | oraculo_portais | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| personal_symbolic_maps_user_id_fkey | personal_symbolic_maps | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: portais portais_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portais
    ADD CONSTRAINT portais_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: portais portais_jornada_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portais
    ADD CONSTRAINT portais_jornada_id_fkey FOREIGN KEY (jornada_id | jornadas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| portais_modulo_id_fkey | portais | modulo_id | modulos_formativos | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| portal_junguiano_modulos_config_id_fkey | portal_junguiano_modulos | config_id | portal_junguiano_config | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| portal_junguiano_portais_modulo_id_fkey | portal_junguiano_portais | modulo_id | portal_junguiano_modulos | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| portal_junguiano_progresso_config_id_fkey | portal_junguiano_progresso | config_id | portal_junguiano_config | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| portal_junguiano_registros_portal_id_fkey | portal_junguiano_registros | portal_id | portal_junguiano_portais | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| portal_progress_portal_id_fkey | portal_progress | portal_id | clube_portais | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| portal_salas_sala_id_fkey | portal_salas | sala_id | salas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| post_session_closures_case_id_fkey | post_session_closures | case_id | session_cases | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| post_session_closures_client_id_fkey | post_session_closures | client_id | profiles | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| post_session_closures_therapist_id_fkey | post_session_closures | therapist_id | profiles | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| posts_mentoria_created_by_fkey | posts_mentoria | created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: praticas_mudra praticas_mudra_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.praticas_mudra
    ADD CONSTRAINT praticas_mudra_client_id_fkey FOREIGN KEY (client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| profiles_id_fkey | profiles | id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: progresso_aluna progresso_aluna_formacao_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.progresso_aluna
    ADD CONSTRAINT progresso_aluna_formacao_id_fkey FOREIGN KEY (formacao_id | formacoes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| progresso_aluna_modulo_id_fkey | progresso_aluna | modulo_id | formacao_modulos | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| projetos_mestria_avaliador_id_fkey | projetos_mestria | avaliador_id) REFERENCES auth.users(id);


--
-- Name: projetos_mestria projetos_mestria_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projetos_mestria
    ADD CONSTRAINT projetos_mestria_course_id_fkey FOREIGN KEY (course_id | courses | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| projetos_mestria_user_id_fkey | projetos_mestria | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: protocolo_oracula protocolo_oracula_caminho_registro_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.protocolo_oracula
    ADD CONSTRAINT protocolo_oracula_caminho_registro_id_fkey FOREIGN KEY (caminho_registro_id | jornada_heroina_registros | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| protocolo_oracula_cliente_id_fkey | protocolo_oracula | cliente_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| protocolo_oracula_mapa_registro_id_fkey | protocolo_oracula | mapa_registro_id | big5_symbolic_registros | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| protocolo_oracula_oraculo_registro_id_fkey | protocolo_oracula | oraculo_registro_id | eneagrama_feminino_registros | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| protocolo_oracula_session_case_id_fkey | protocolo_oracula | session_case_id | session_cases | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| push_subscriptions_user_id_fkey | push_subscriptions | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: quiz_opcoes quiz_opcoes_pergunta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quiz_opcoes
    ADD CONSTRAINT quiz_opcoes_pergunta_id_fkey FOREIGN KEY (pergunta_id | quiz_perguntas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| quiz_perguntas_quiz_id_fkey | quiz_perguntas | quiz_id | quizzes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| quiz_respostas_usuario_quiz_id_fkey | quiz_respostas_usuario | quiz_id | quizzes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| quiz_respostas_usuario_resultado_id_fkey | quiz_respostas_usuario | resultado_id | quiz_resultados | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| quiz_resultados_agente_id_fkey | quiz_resultados | agente_id | agentes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| quiz_resultados_quiz_id_fkey | quiz_resultados | quiz_id | quizzes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| quizzes_portal_id_fkey | quizzes | portal_id | conteudo_travessias | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| quizzes_sala_id_fkey | quizzes | sala_id | salas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| reflexoes_jornada_client_id_fkey | reflexoes_jornada | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| relacionamentos_espelho_client_id_fkey | relacionamentos_espelho | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| respostas_exercicios_sessao_id_fkey | respostas_exercicios | sessao_id | sessoes_labirinto | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| rituais_integracao_client_id_fkey | rituais_integracao | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| ritual_passages_ritual_id_fkey | ritual_passages | ritual_id | ritual_definitions | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| ritual_passages_user_id_fkey | ritual_passages | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sala_ferramentas sala_ferramentas_familia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sala_ferramentas
    ADD CONSTRAINT sala_ferramentas_familia_id_fkey FOREIGN KEY (familia_id | travessia_familias | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| sala_ferramentas_ferramenta_pai_id_fkey | sala_ferramentas | ferramenta_pai_id | sala_ferramentas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| sala_ferramentas_portal_id_fkey | sala_ferramentas | portal_id | conteudo_travessias | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| sala_ferramentas_sala_id_fkey | sala_ferramentas | sala_id | salas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| season_books_season_id_fkey | season_books | season_id | oracular_seasons | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| season_labs_season_id_fkey | season_labs | season_id | oracular_seasons | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| session_archetypes_archetype_id_fkey | session_archetypes | archetype_id | atlas_arquetipos_femininos | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| session_archetypes_client_id_fkey | session_archetypes | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| session_archetypes_session_id_fkey | session_archetypes | session_id | sessions | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| session_cases_client_id_fkey | session_cases | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| session_cases_therapist_id_fkey | session_cases | therapist_id | profiles | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| session_interventions_intervention_id_fkey | session_interventions | intervention_id | interventions | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| session_interventions_session_id_fkey | session_interventions | session_id | sessions | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| session_oracle_draws_case_id_fkey | session_oracle_draws | case_id | session_cases | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| session_oracle_draws_client_id_fkey | session_oracle_draws | client_id | profiles | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| session_oracle_draws_therapist_id_fkey | session_oracle_draws | therapist_id | profiles | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| session_scripts_case_id_fkey | session_scripts | case_id | session_cases | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| session_scripts_client_id_fkey | session_scripts | client_id | profiles | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| session_scripts_narrative_map_id_fkey | session_scripts | narrative_map_id | narrative_maps | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| session_scripts_therapist_id_fkey | session_scripts | therapist_id | profiles | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| sessions_cidadela_card_id_fkey | sessions | cidadela_card_id | cidadela_oracle_cards | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| sessions_client_id_fkey | sessions | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| sessions_district_id_fkey | sessions | district_id | districts | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| sessions_tool_id_fkey | sessions | tool_id | tools | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| sessoes_casa_maquinas_cliente_id_fkey | sessoes_casa_maquinas | cliente_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| sessoes_casa_maquinas_owner_id_fkey | sessoes_casa_maquinas | owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sessoes_labirinto sessoes_labirinto_porta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessoes_labirinto
    ADD CONSTRAINT sessoes_labirinto_porta_id_fkey FOREIGN KEY (porta_id | labirinto_fases | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| simulador_progresso_cenario_id_fkey | simulador_progresso | cenario_id | simulador_cenarios | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| simulador_progresso_user_id_fkey | simulador_progresso | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sonho_estruturado sonho_estruturado_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sonho_estruturado
    ADD CONSTRAINT sonho_estruturado_cliente_id_fkey FOREIGN KEY (cliente_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| sonhos_cabalisticos_client_id_fkey | sonhos_cabalisticos | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| station_progress_station_id_fkey | station_progress | station_id | clube_estacoes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| studio_episodes_created_by_fkey | studio_episodes | created_by) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: studio_episodes studio_episodes_eixo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.studio_episodes
    ADD CONSTRAINT studio_episodes_eixo_id_fkey FOREIGN KEY (eixo_id | studio_method_axes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| subscriptions_user_id_fkey | subscriptions | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: symbolic_template_sessions symbolic_template_sessions_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.symbolic_template_sessions
    ADD CONSTRAINT symbolic_template_sessions_case_id_fkey FOREIGN KEY (case_id | session_cases | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| symbolic_template_sessions_cliente_id_fkey | symbolic_template_sessions | cliente_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| syntheia_conversations_mode_id_fkey | syntheia_conversations | mode_id | syntheia_modes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| syntheia_conversations_user_id_fkey | syntheia_conversations | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: syntheia_conversations syntheia_conversations_voice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.syntheia_conversations
    ADD CONSTRAINT syntheia_conversations_voice_id_fkey FOREIGN KEY (voice_id | syntheia_voices | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| syntheia_messages_conversation_id_fkey | syntheia_messages | conversation_id | syntheia_conversations | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| tecela_casos_espelho_created_by_fkey | tecela_casos_espelho | created_by) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT tecela_conselho_respostas_conselho_id_fkey FOREIGN KEY (conselho_id | tecela_conselho | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| tecela_favoritos_user_id_fkey | tecela_favoritos | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT tecela_ressonancias_registro_id_fkey FOREIGN KEY (registro_id | tecela_registros_campo | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| tecela_ressonancias_user_id_fkey | tecela_ressonancias | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: tecela_supervisoes tecela_supervisoes_caso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tecela_supervisoes
    ADD CONSTRAINT tecela_supervisoes_caso_id_fkey FOREIGN KEY (caso_id | tecela_casos_espelho | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| tecela_supervisoes_created_by_fkey | tecela_supervisoes | created_by) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT tool_districts_district_id_fkey FOREIGN KEY (district_id | city_districts | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| tool_districts_tool_id_fkey | tool_districts | tool_id | tools | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| tools_district_id_fkey | tools | district_id | districts | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| tools_ferramenta_pai_id_fkey | tools | ferramenta_pai_id | tools | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| tools_proximo_passo_id_fkey | tools | proximo_passo_id | tools | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| torre_arquetipo_sugestao_arquetipo_id_fkey | torre_arquetipo_sugestao | arquetipo_id | atlas_arquetipos_femininos | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| torre_porta_relacao_porta_id_fkey | torre_porta_relacao | porta_id | labirinto_portas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| towers_client_id_fkey | towers | client_id | clientes | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| towers_session_id_fkey | towers | session_id | sessions | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| travessia_comentarios_user_id_fkey | travessia_comentarios | user_id | profiles | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| travessia_day_unlocks_aula_id_fkey | travessia_day_unlocks | aula_id | conteudo_aulas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| travessia_day_unlocks_user_id_fkey | travessia_day_unlocks | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: travessia_library_items travessia_library_items_familia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travessia_library_items
    ADD CONSTRAINT travessia_library_items_familia_id_fkey FOREIGN KEY (familia_id | travessia_familias | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| travessia_library_media_item_id_fkey | travessia_library_media | item_id | travessia_library_items | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| travessia_library_tags_item_id_fkey | travessia_library_tags | item_id | travessia_library_items | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| treinamento_respostas_caso_id_fkey | treinamento_respostas | caso_id | treinamento_casos_simulados | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| treinamento_respostas_user_id_fkey | treinamento_respostas | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: upsell_opportunities upsell_opportunities_rule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.upsell_opportunities
    ADD CONSTRAINT upsell_opportunities_rule_id_fkey FOREIGN KEY (rule_id | upsell_rules | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| upsell_opportunities_user_id_fkey | upsell_opportunities | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_aula_progress user_aula_progress_aula_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_aula_progress
    ADD CONSTRAINT user_aula_progress_aula_id_fkey FOREIGN KEY (aula_id | conteudo_aulas | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| user_cidadela_estado_user_id_fkey | user_cidadela_estado | user_id | profiles | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| user_favorites_library_item_id_fkey | user_favorites | library_item_id | library_items | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| user_favorites_user_id_fkey | user_favorites | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_journey_stats user_journey_stats_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_journey_stats
    ADD CONSTRAINT user_journey_stats_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_progress user_progress_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_lesson_id_fkey FOREIGN KEY (lesson_id | lessons | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
| user_progress_user_id_fkey | user_progress | user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


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
    ADD CONSTRAINT user_unlocked_rewards_reward_id_fkey FOREIGN KEY (reward_id | symbolic_rewards | id | Missing in database. Likely skipped in previous runs due to processing order or reference issues. |
