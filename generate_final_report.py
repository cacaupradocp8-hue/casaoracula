import json
import re
import collections

# Hardcoded existing tables from the manual observation
existing_tables_str = """
_deprecated_club_books, _deprecated_club_cartography, _deprecated_club_cycles, _deprecated_club_knowledge_entries, _deprecated_club_meetings, _deprecated_club_reflections, _deprecated_club_tools, _deprecated_club_user_cycles, academy_progress, access_expiration_logs, admin_action_history, admin_automation_audit, admin_automation_rules, agente_conversas, agente_mensagens, agentes, ai_global_settings, ai_interaction_logs, ai_provider_prices, ai_recommendations, app_settings, archetypal_profile_snapshots, archetype_tools, atelie_conteudos, atelie_templates, atlas_arquetipos_femininos, atlas_arquetipos_registros, audio_assets, aulas, auto_mapeamento, automation_alerts, automation_execution_logs, automation_rules, automation_settings, biblioteca_casos, big5_dimensoes, big5_funcional_dimensoes, big5_funcional_perguntas, big5_funcional_registros, big5_oracular_fatores, big5_oracular_perguntas, big5_oracular_registros, big5_porta_mapeamento, big5_questionario, big5_registros, big5_ritual_registros, big5_symbolic_afirmacoes, big5_symbolic_forces, big5_symbolic_registros, book_links, book_media, book_tours, books, canteiro_reactions, cartografia_complexos, cartografia_psiquica, cartographer_engine, cartographer_recommendations, cartographer_rules, cartographer_training_cases, cartographies, casa_circulo_replies, casa_circulo_threads, casa_posts, casos, certificates, cidadela_mapa_vivo, cidadela_oracle_cards, cidadela_oracle_usage, circulo_oracular_registros, circulos_sagrados, city_districts, client_archetype_state, client_cidadela_map, client_city_state, client_labyrinths, client_live_map_entries, client_live_map_state, client_pattern_stats, client_seasons, clientes, clientes_piloto, clube_audio_albums, clube_audio_progress, clube_audio_tracks, clube_audit_log, clube_carrossel_slides, clube_engajamento, clube_estacao_registros, clube_estacoes, clube_jornadas, clube_livro_aulas, clube_livro_chat_interactions, clube_livro_encontros, clube_livro_escuta_progress, clube_livro_integracao_8020, clube_livro_integracao_8020_config, clube_livro_integracao_config, clube_livro_integracoes, clube_livro_perguntas, clube_livro_portas, clube_livro_respostas, clube_livro_ritual_aceites, clube_obras_essencia_8020, clube_portais, clube_portal_audios, clube_portal_insights, clube_portal_materiais, clube_progresso_passos, clube_reflexoes, clube_rota_itens, clube_rota_progresso, clube_v3_routes, clube_v3_station_audios, clube_v3_station_content, clube_v3_stations, clube_v3_user_progress, co_ai_recommendations, co_appointments, co_camara_sussurro_casos, co_cartografia_profile, co_city_history, co_client_invites, co_client_profile, co_client_profiles, co_convites, co_detectores_eventos, co_escutas, co_garden_flowers, co_intervencoes, co_intervencoes_aplicadas, co_jardim_entries, co_jardins, co_journey_records, co_laboratorio_casos, co_mapa_vivo, co_mentora_feedback, co_mentora_insights, co_orientacao_sugestoes_ia, co_orientacoes, co_passport_entries, co_praticas, co_registros_simbolicos, co_session_notes, co_sessoes, co_sim_cases, co_sim_options, co_sim_progress, co_sim_steps, co_therapist_profile, co_tool_flows, co_tool_usage, co_training_attempts, co_training_case_feedbacks, co_training_case_possible_readings, co_training_case_signals, co_training_cases, co_training_progress, co_travessia_encontros, co_travessia_respostas, co_travessias, co_workspace_users, co_workspaces, collective_bed_entries, collective_beds, community_comments, community_event_participants, community_events, community_forums, community_group_members, community_groups, community_likes, community_posts, community_topic_replies, community_topics, confirmacao_profissional, conselho_partes_internas, content_blocks, conteudo_aulas, conteudo_travessias, contos_clinicos, corpo_inconsciente, course_enrollments, course_exercise_responses, course_lesson_progress, course_lessons, course_module_forum_posts, course_modules, course_work_submissions, courses, custom_oracle_cards, custom_oracles, cycle_books, cycles, decodificacao_onirica, degustacao_requests, diagnostico_ego, diario_bordo_aulas, district_state_changes, districts, dreams, email_logs, email_send_log, email_send_state, email_unsubscribe_tokens, eneagrama_feminino_afirmacoes, eneagrama_feminino_arquetipos, eneagrama_feminino_orientacoes, eneagrama_feminino_registros, eneagrama_instintos, eneagrama_registros, eneagrama_tipos, escrita_nao_censurada, estudio_projetos, estudos_caso, estudos_caso_respostas, exercise_responses, exercises, facilitadora_profiles, ferramenta_registros, formacao_area_config, formacao_modulos, formacao_oracula_content, formacoes, formation_map_nodes, founder_financial_daily, founder_financial_metrics, founding_archetypes, gestos_integracao, group_encounters, group_field_snapshots, group_members, group_participants, group_sessions, heroina_arquetipo_registros, heroina_cenario_registros, heroina_fase_ativa, heroina_insights, heroina_jornada, heroina_registros, heroina_ritual_registros, image_assets, imaginacao_ativa, intervention_favorites, interventions, inventario_personas, jardim_do_oficio, jardim_grupo_registros, jardim_heroina, jardim_heroina_registros, jardim_psique_registros, jornada_convites, jornada_frases_selo, jornada_habitante_eventos, jornada_heroina_fases, jornada_heroina_notas_profissionais, jornada_heroina_registros, jornada_heroina_respostas, jornada_individuacao, jornada_progressao, jornadas, journey_districts, journey_events, journey_media, journey_reflections, journeys, lab_8020_progress, lab_casos, labirinto_39_portas, labirinto_anotacoes, labirinto_arquetipos, labirinto_fases, labirinto_leituras, labirinto_metaforas, labirinto_portas, labirinto_registros, labirinto_rituais, labirinto_roteiro_templates, labirinto_roteiros_gerados, labyrinth_records, lessons, lessons_album, library_items, lista_espera, mapa_heroina, mapa_sombra, mapa_vivo_heroina, mapa_vivo_historico, mapeamento_complexos, matriculas, matriculas_pendentes, message_campaigns, message_logs, message_templates, mind_map_nodes, mind_maps, missoes, modulos_formativos, narrative_maps, narroterapia_autorizacao, narroterapia_estudos, narroterapia_reacoes_simbolicas, notification_logs, notification_preferences, notifications, ofertas, oracle_cards, oracle_categories, oracle_clients, oracle_decks, oracle_draws, oracle_spread_positions, oracle_spreads, oracle_symbolic_focuses, oracle_usage_stats, oracular_readings, oracular_seasons, oraculo_aplicacoes, oraculo_favoritos, oraculo_perguntas, oraculo_portais, oraculo_portal_aplicacoes, oraculo_portal_audios, oraculo_portal_essencia, oraculo_portal_ferramenta_campos, oraculo_portal_ferramentas, oraculo_portal_forja_erros, oraculo_portal_forja_passos, oraculo_portal_forjas, oraculo_portal_jardins, oraculo_portal_laboratorio_passos, oraculo_portal_laboratorios, oraculo_portal_materiais, oraculo_portal_narroterapia, oraculo_portal_narroterapia_perguntas, oraculo_portal_riscos_eticos, pattern_flags, personal_symbolic_maps, plan_limits, plans, portais, portal_junguiano_config, portal_junguiano_modulos, portal_junguiano_portais, portal_junguiano_progresso, portal_junguiano_registros, portal_progress, portal_salas, post_session_closures, posts_mentoria, praticas_mudra, profiles, progresso_aluna, projetos_mestria, protocolo_oracula, push_subscriptions, quiz_opcoes, quiz_perguntas, quiz_respostas_usuario, quiz_resultados, quizzes, radiestesia_config, radiestesia_cristais, radiestesia_graficos, reflexoes_jornada, relacionamentos_espelho, respostas_exercicios, rituais_integracao, rituais_simbolicos, ritual_definitions, ritual_passages, sala_ferramentas, salas, season_books, season_labs, session_archetypes, session_cases, session_interventions, session_oracle_draws, session_scripts, sessions, sessoes_casa_maquinas, sessoes_labirinto, simulador_cenarios, simulador_progresso, sonho_estruturado, sonhos_cabalisticos, station_progress, student_learning_events, student_learning_progress, studio_episodes, studio_method_axes, studio_method_blocks, subscriptions, suppressed_emails, symbolic_insights, symbolic_rewards, symbolic_template_sessions, syntheia_conversations, syntheia_creations, syntheia_messages, syntheia_modes, syntheia_voices, tecela_casos_espelho, tecela_comentarios, tecela_conselho, tecela_conselho_respostas, tecela_favoritos, tecela_intervencoes, tecela_mensagens_dia, tecela_registros_campo, tecela_ressonancias, tecela_supervisoes, tecela_tramas, templates, text_models, therapeutic_groups, therapy_groups, tool_districts, tools, torre_arquetipo_sugestao, torre_casos_clinicos, torre_porta_relacao, tour_sections, towers, travessia_comentarios, travessia_day_unlocks, travessia_familias, travessia_library_items, travessia_library_media, travessia_library_tags, travessias, treinamento_casos_simulados, treinamento_respostas, upsell_opportunities, upsell_rules, user_aula_progress, user_cidadela_estado, user_favorites, user_journey_stats, user_progress, user_road_nodes, user_roles, user_unlocked_rewards, video_playback_logs, vitrine_cards, voz_historico, webhook_events, webhook_logs
"""

existing_tables = set([t.strip().lower() for t in existing_tables_str.split(',')])

# 1. Load FK data
with open('fks_from_schema.json', 'r') as f:
    fks = json.load(f)

# 2. Process FKs
missing_source_tables = set()
missing_target_tables = set()
all_missing_tables = set()
dependencies = collections.defaultdict(list)
status_counts = collections.defaultdict(int)

for fk in fks:
    source_table = fk['table'].lower()
    target_table = fk['ref_table'].lower()
    
    source_exists = source_table in existing_tables
    target_exists = target_table in existing_tables
    
    status = 'READY_TO_CREATE'
    if not source_exists and not target_exists:
        status = 'MISSING_SOURCE_AND_TARGET'
    elif not source_exists:
        status = 'MISSING_SOURCE_TABLE'
    elif not target_exists:
        status = 'MISSING_TARGET_TABLE'
    
    if not source_exists:
        missing_source_tables.add(source_table)
        all_missing_tables.add(source_table)
        dependencies[source_table].append(f"{fk['name']} ({source_table} -> {target_table})")
    
    if not target_exists:
        missing_target_tables.add(target_table)
        all_missing_tables.add(target_table)
        dependencies[target_table].append(f"{fk['name']} ({source_table} -> {target_table})")

    status_counts[status] += 1

# 3. Generate Report
report_md = "# Consolidated Foreign Key Dry-Run Report\n\n"
report_md += "## Summary of Statuses\n\n"
for status, count in sorted(status_counts.items()):
    report_md += f"- **{status}**: {count}\n"

report_md += f"\n- **Total Analyzed**: {len(fks)}\n"

report_md += "\n## Missing Tables as SOURCE\n\n"
for table in sorted(missing_source_tables):
    report_md += f"- {table}\n"

report_md += "\n## Missing Tables as TARGET\n\n"
for table in sorted(missing_target_tables):
    report_md += f"- {table}\n"

report_md += "\n## Consolidated List of All Missing Tables\n\n"
for table in sorted(all_missing_tables):
    report_md += f"- {table}\n"

report_md += "\n## Dependencies (FKs blocked by missing tables)\n\n"
for table in sorted(all_missing_tables):
    report_md += f"### {table}\n"
    for dep in sorted(dependencies[table]):
        report_md += f"- {dep}\n"
    report_md += "\n"

with open('fk_dry_run_consolidated_report.md', 'w') as f:
    f.write(report_md)

# 4. Extract Definitions
with open('schema_only_cleaned.sql', 'r') as f:
    schema_sql = f.read()

# Custom extractor for CREATE TABLE blocks
# We'll split the schema into blocks by the pattern '-- Name: ...'
blocks = re.split(r'--\s+Name:', schema_sql)
table_definitions = {}

for block in blocks:
    # Look for 'CREATE TABLE public.table_name' in the block
    match = re.search(r'CREATE TABLE\s+public\.([\w_]+)\s*\(.*?\);', block, re.DOTALL | re.IGNORECASE)
    if match:
        table_name = match.group(1).lower()
        # Find the full statement in the block
        # It should end with );
        stmt_match = re.search(r'(CREATE TABLE\s+public\.' + table_name + r'\s*\(.*?\);)', block, re.DOTALL | re.IGNORECASE)
        if stmt_match:
            table_definitions[table_name] = stmt_match.group(1)

# 5. Generate SQL
missing_tables_sql = "-- bloco_07c_create_missing_tables_from_fk_diagnostics.sql\n"
missing_tables_sql += "-- Only CREATE TABLE IF NOT EXISTS and PK/UK constraints\n\n"

for table in sorted(all_missing_tables):
    if table in table_definitions:
        stmt = table_definitions[table]
        # Replace public.table_name with IF NOT EXISTS
        stmt = re.sub(r'CREATE TABLE\s+public\.' + table + r'\s*\(', 'CREATE TABLE IF NOT EXISTS public.' + table + ' (', stmt, flags=re.IGNORECASE)
        missing_tables_sql += stmt + "\n\n"

with open('bloco_07c_create_missing_tables_from_fk_diagnostics.sql', 'w') as f:
    f.write(missing_tables_sql)

print(f"Report generated.")
