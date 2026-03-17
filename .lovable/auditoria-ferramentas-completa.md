# 🔍 Auditoria Completa de Ferramentas — Casa Orácula
**Data:** 2026-03-17 | **Versão:** 1.0

---

## ETAPA 1 — LEVANTAMENTO COMPLETO

### A) FERRAMENTAS NO BANCO DE DADOS (`sala_ferramentas`)

| # | Nome | Sala | Tipo | Rota | Ativa | Portal Mínimo |
|---|------|------|------|------|-------|---------------|
| 1 | Oráculo de Perguntas | Sala da Visitante | conducao_terapeutica | /salas/oraculo-perguntas | ✅ | visitante |
| 2 | Qual Voz Guia tua Atuação? (Quiz) | Sala da Visitante | diagnostico | /quiz/... | ✅ | visitante |
| 3 | Big Five — Leitura Funcional | Sala da Visitante | assessment | /salas/big5 | ✅ | visitante |
| 4 | Eneagrama | Sala de Treinamento | diagnostico | /ferramentas/eneagrama | ✅ | pre_iniciada |
| 5 | Narrativas Terapêuticas (Contos) | Sala de Treinamento | ferramenta_narrativa | /ferramentas/narrativas | ✅ | pre_iniciada |
| 6 | Tarô Terapêutico | Sala de Treinamento | leitura_simbolica | /ferramentas/tarot | ✅ | pre_iniciada |
| 7 | Constelação Sistêmica | Sala de Treinamento | conducao_terapeutica | /ferramentas/constelacao | ✅ | pre_iniciada |
| 8 | SYNTHEIA – Orquestradora Terapêutica | Sala de Treinamento | ferramenta_narrativa | /ferramentas/sintheia | ✅ | pre_iniciada |
| 9 | Big Five — Leitura Funcional | Ferramentas do Método | diagnostico | /ferramenta/big5-funcional | ✅ | pre_iniciada |
| 10 | Torre Viva™ | Ferramentas do Método | diagnostico | /ferramentas/torre-viva | ✅ | pre_iniciada |
| 11 | Leitura em 5 Camadas | Ferramentas do Método | leitura_simbolica | /ferramentas/leitura-5-camadas | ✅ | oracula |
| 12 | Atlas de Arquétipos Femininos | Ferramentas do Método | leitura_simbolica | /atlas-arquetipos | ✅ | pre_iniciada |
| 13 | Radar do Eixo Interno | Ferramentas do Método | leitura_simbolica | /ferramentas-metodo?tab=radar | ✅ | oracula |
| 14 | O Caminho da Mulher que se Torna Inteira | Ferramentas do Método | conducao_terapeutica | /ferramenta/jornada-heroina | ✅ | pre_iniciada |
| 15 | O Labirinto da Heroína Interna® | Labirinto da Heroína | metodo_oracula | /labirinto-heroina | ✅ | aluna_formacao |
| 16 | Mapa Arquetípico do Ego Feminino | Sala das Alunas | autoleitura | /ferramentas/mapa-arquetipos-ego | ✅ | pre_iniciada |
| 17 | Cartografia da Torre | Sala das Alunas | diagnostico | /ferramentas/cartografia-torre | ✅ | pre_iniciada |
| 18 | Espelho de Consciência | Sala das Alunas | autoleitura | /ferramentas/espelho-de-consciencia | ✅ | pre_iniciada |
| 19 | Chakras – Leitura Energética Simbólica | Sala das Alunas | leitura_simbolica | /ferramentas/chakras | ✅ | pre_iniciada |
| 20 | Radiestesia & Gráficos Vibracionais | Sala das Alunas | leitura_simbolica | /radiestesia | ✅ | pre_iniciada |
| 21 | O Oráculo dos Nove Arquétipos | Sala das Alunas | autoleitura | /ferramenta/eneagrama-feminino | ✅ | pre_iniciada |
| 22 | Escala de MAIA Oracular™ | Sala das Alunas | diagnostico | /ferramentas/escala-maia | ✅ | pre_iniciada |
| 23 | Caderno Ritual do Cisne Negro | Sala das Alunas | ritual_simbolico | /biblioteca-das-travessias/... | ✅ | pre_iniciada |
| 24 | Competências do Ego (Antroposofia) | Sala das Alunas | leitura_simbolica | /ferramentas/antroposofia | ✅ | pre_iniciada |
| 25 | Mapa de Hawkins | Sala das Alunas | leitura_simbolica | /ferramentas/hawkins | ✅ | pre_iniciada |
| 26 | Agente Tradutor Simbólico | Sala da Orácula | ferramenta_narrativa | /ferramentas/agente-simbolico | ✅ | pre_iniciada |
| 27 | Big 5 (antigo) | Sala das Alunas | diagnostico | /ferramentas/big5 | ❌ | pre_iniciada |
| 28 | Agente Analista de Caso | Sala da Orácula | ferramenta_narrativa | /ferramentas/agente-analista | ❌ | pre_iniciada |
| 29 | Agente Curador de Práticas | Sala da Orácula | ferramenta_narrativa | /ferramentas/agente-curador | ❌ | pre_iniciada |
| 30 | Trilha de Neuroplasticidade | Ferramentas do Método | ferramenta_narrativa | /ferramentas-metodo?tab=trilha | ❌ | oracula |
| 31 | Neuroplasticidade & Mudança de Padrões | Sala das Alunas | diagnostico | /ferramentas/neuroplasticidade | ❌ | pre_iniciada |
| 32 | Mapa de Plasticidade Psíquica | Sala das Alunas | diagnostico | /ferramentas/plasticidade-psiquica | ❌ | pre_iniciada |

### B) FERRAMENTAS FIXAS NO CÓDIGO (FerramentasHub.tsx)

| # | Nome | Rota | Categoria |
|---|------|------|-----------|
| 33 | Labirinto das 39 Portas | /labirinto | diagnostico |
| 34 | Cartografia Psíquica Orácula | /ferramenta/cartografia-psiquica-oracula | diagnostico |
| 35 | Cartografia Psíquica (duplicata) | /ferramenta/cartografia-psiquica-oracula | cartografia |
| 36 | Torre Viva™ (duplicata) | /ferramentas/torre-viva | sombras |
| 37 | Cartografia das Torres (duplicata) | /ferramentas/cartografia-torre | cartografia |
| 38 | Atlas dos Arquétipos Femininos (duplicata) | /atlas-arquetipos-femininos | arquetipos |
| 39 | Leitura em 5 Camadas (duplicata) | /sala-do-metodo?tab=5-camadas | narrativas |
| 40 | Radar de Eixo (duplicata) | /sala-do-metodo?tab=radar | diagnostico |
| 41 | Mapas Reflexivos Pessoais | /mapas-pessoais | cartografia |
| 42 | Oráculos da Casa | /oraculos | oraculos |
| 43 | Narroterapia Oracular™ | /narroterapia | narrativas |

### C) FERRAMENTAS DA CASA DAS MÁQUINAS (SaaS Clínico)

| # | Nome | Página | Função |
|---|------|--------|--------|
| 44 | Mapa da CidaDELA (Mapa Vivo) | MapaVivoCidadela.tsx | Visualização do mapa simbólico da cliente |
| 45 | Replay da Jornada | ReplayJornada.tsx | Reprodução temporal da evolução |
| 46 | Relatório Narrativo | RelatorioNarrativo.tsx | Síntese narrativa da jornada |
| 47 | Perfil Arquetípico | ClientePerfilArquetipico.tsx | Leitura simbólica do campo psíquico |
| 48 | Labirinto das 39 Portas (SaaS) | LabirintoPage.tsx | Versão clínica do labirinto |
| 49 | Atlas de Arquétipos (SaaS) | AtlasArquetiposPage.tsx | Versão clínica do atlas |
| 50 | Torre Viva™ (SaaS) | TorreVivaPage.tsx | Versão clínica da torre |
| 51 | Cartografia Psíquica (SaaS) | CartografiaPage.tsx | Versão clínica da cartografia |
| 52 | Mapeamento de Complexos | MapeamentoComplexosPage.tsx | Gatilhos e dinâmicas |
| 53 | Mapa da Sombra | MapaSombraPage.tsx | Cartografia da sombra |
| 54 | Diagnóstico de Ego | DiagnosticoEgoPage.tsx | Estrutura egoica |
| 55 | Escrita Não-Censurada | EscritaNaoCensuradaPage.tsx | Protocolo de escrita |
| 56 | Corpo como Inconsciente | CorpoInconscientePage.tsx | Corpo e psique |
| 57 | Sonho Estruturado | SonhoEstruturadoPage.tsx | Registro e análise de sonhos |
| 58 | Decodificação Onírica | DecodificacaoOniricaPage.tsx | IA para sonhos |
| 59 | Imaginação Ativa | ImaginacaoAtivaPage.tsx | Protocolo junguiano |
| 60 | Inventário de Personas | InventarioPersonasPage.tsx | Mapeamento de subpersonalidades |
| 61 | Fio de Ariadne | FioDeAriadne.tsx | Rastreio de labirintos |
| 62 | Oráculo das Estações | OraculoEstacoes.tsx | Ritmo cíclico sazonal |
| 63 | Conselho das Partes Internas | conselho-partes/ | Diálogo de vozes internas |
| 64 | Ritual de Integração | ritual-integracao/ | Protocolo de fechamento |
| 65 | Relacionamentos como Espelho | relacionamentos-espelho/ | Projeções Luz/Sombra |
| 66 | Cartografia de Complexos | cartografia-complexos/ | Módulo de complexos |
| 67 | Bússola Cartógrafa | bussola-cartografa/ | GPS simbólico |
| 68 | Sinais da Jornada | SinaisDaJornada.tsx | Indicadores de progresso |

### D) FERRAMENTAS DO MODO SESSÃO (Session Room)

| # | Nome | Componente | Função |
|---|------|-----------|--------|
| 69 | Oracle Tab | OracleTab.tsx | Consulta oracular em sessão |
| 70 | Sete Camadas | SevenLayersTab.tsx | Leitura em camadas |
| 71 | Mapa Narrativo | NarrativeMapTab.tsx | Mapeamento narrativo |
| 72 | Roteiro de Sessão | SessionScriptTab.tsx | Script terapêutico |
| 73 | Pós-Sessão | PostSessionTab.tsx | Registro pós-sessão |
| 74 | Templates | TemplatesTab.tsx | Modelos de sessão |
| 75 | Mapa Vivo (Sessão) | MapaVivoTab.tsx | CidaDELA em sessão |
| 76 | Jardim da Heroína (Sessão) | JardimHeroinaTab.tsx | Diário simbólico em sessão |
| 77 | Jardim de Grupo | JardimGrupoTab.tsx | Registro grupal |
| 78 | Protocolo Orácula | ProtocoloOraculaTab.tsx | Protocolo guiado |
| 79 | Guardiã do Jardim | guardia-jardim/ | Contenção ética IA |

### E) FERRAMENTAS DE AUTOEXPLORAÇÃO / JARDINS

| # | Nome | Página | Função |
|---|------|--------|--------|
| 80 | Jardim da Psique | JardimPsique.tsx | Diário pessoal simbólico |
| 81 | Jardim do Ofício | jardim-oficio/ | Reflexões profissionais |
| 82 | Jardim da Heroína | JardimHeroinaTab.tsx | Gestos narrativos |
| 83 | Bússola Onírica | BussolaOniricaPage.tsx | Registro de sonhos pessoal |
| 84 | Mapas Reflexivos Pessoais | PersonalMaps.tsx | Big5/Eneagrama pessoal |
| 85 | Oráculos (Tiragem) | OracleHome.tsx | Tiragem de cartas |
| 86 | Cartas da Jornada | CartasJornadaPage.tsx | Cartas simbólicas |
| 87 | Rituais de Mudra | RituaisMudraPage.tsx | Práticas corporais |

### F) FERRAMENTAS DE FORMAÇÃO / TREINAMENTO

| # | Nome | Componente | Função |
|---|------|-----------|--------|
| 88 | Auto-Mapeamento | AutoMapeamento.tsx | Prática pessoal da aluna |
| 89 | Estudos de Caso | EstudosCasoTreinamento.tsx | Casos para estudo |
| 90 | Simulador de Sessão | SimuladorSessaoAvancado.tsx | Prática simulada |
| 91 | Biblioteca de Ferramentas | BibliotecaFerramentas.tsx | Catálogo de ferramentas |
| 92 | Jornada Exemplo | JornadaExemplo.tsx | Modelo demonstrativo |
| 93 | Clientes-Piloto | ClientesPiloto.tsx | Prática supervisionada |
| 94 | Roteiros e Protocolos | RoteirosProtocolo.tsx | Scripts de condução |
| 95 | Manuais e Protocolos | ManuaisProtocolo.tsx | Documentação técnica |
| 96 | Laboratório de Leitura | LaboratorioLeitura.tsx | Prática de leitura clínica |
| 97 | Academia de Formação | AcademiaFormacaoPage.tsx | Gamificação/badges |

### G) FERRAMENTAS DE RADIESTESIA

| # | Nome | Página | Função |
|---|------|--------|--------|
| 98 | Portal da Radiestesia | RadiestesiaPortal.tsx | Hub central |
| 99 | Leitura em 5 Camadas (Radiestesia) | Leitura5Camadas.tsx | Versão radiestésica |
| 100 | Mesa Radiônica | MesaRadionica.tsx | Operação de mesa |
| 101 | Catálogo de Gráficos | CatalogoGraficos.tsx | Biblioteca visual |
| 102 | Pantáculos | Pantaculos.tsx | Gráficos simbólicos |
| 103 | Cristais e Campos | CristaisCampos.tsx | Cristaloterapia |
| 104 | Escala Narrativa | EscalaNarrativa.tsx | Escala simbólica |
| 105 | Diário de Práticas | DiarioPraticas.tsx | Registro de práticas |

### H) OUTRAS FERRAMENTAS ESPALHADAS

| # | Nome | Página | Função |
|---|------|--------|--------|
| 106 | Narroterapia Oracular™ | NarroterapiaHub.tsx | Hub de contos clínicos |
| 107 | Biblioteca Clínica | BibliotecaClinica.tsx | Contos para sessão |
| 108 | Áudios de Narração | AudiosNarracao.tsx | Áudios terapêuticos |
| 109 | Círculo Sagrado | CirculoSagradoPage.tsx | Ferramenta grupal |
| 110 | Portal Junguiano | PortalJunguiano.tsx | Conceitos junguianos |
| 111 | SYNTHEIA | Syntheia.tsx | IA orquestradora |

---

## ETAPA 2 — CLASSIFICAÇÃO POR CATEGORIA

### 1. DIAGNÓSTICO SIMBÓLICO (Leitura de campo)
| Ferramenta | Status | Completa? |
|------------|--------|-----------|
| Cartografia Psíquica Orácula | ✅ Ativa | ✅ Completa |
| Labirinto das 39 Portas | ✅ Ativa | ✅ Completa |
| Big Five — Leitura Funcional | ✅ Ativa | ✅ Completa |
| Eneagrama | ✅ Ativa | ✅ Completa |
| O Oráculo dos Nove Arquétipos | ✅ Ativa | ✅ Completa |
| Qual Voz Guia tua Atuação? (Quiz) | ✅ Ativa | ✅ Completa |
| Escala de MAIA Oracular™ | ✅ Ativa | ⚠️ Parcial |
| Radar do Eixo Interno | ✅ Ativa | ✅ Completa |
| Espelho de Consciência | ✅ Ativa | ✅ Completa |
| Diagnóstico de Ego (SaaS) | ✅ Ativa | ⚠️ Parcial |
| Big 5 (antigo) | ❌ Inativa | Substituída |
| Mapa de Plasticidade Psíquica | ❌ Inativa | Substituída |
| Neuroplasticidade | ❌ Inativa | Substituída |

### 2. CONDUÇÃO TERAPÊUTICA
| Ferramenta | Status | Completa? |
|------------|--------|-----------|
| Leitura em 5 Camadas | ✅ Ativa | ✅ Completa |
| Modo Sessão (Stepper 4 passos) | ✅ Ativa | ✅ Completa |
| Modo Sessão Imersivo | ✅ Ativa | ✅ Completa |
| Protocolo Orácula | ✅ Ativa | ✅ Completa |
| Roteiro de Sessão | ✅ Ativa | ✅ Completa |
| Constelação Sistêmica | ✅ Ativa | ⚠️ Parcial |
| Oráculo de Perguntas | ✅ Ativa | ✅ Completa |
| Imaginação Ativa | ✅ Ativa | ⚠️ Parcial |
| Escrita Não-Censurada | ✅ Ativa | ⚠️ Parcial |
| Biblioteca de Intervenções | ✅ Ativa | ✅ Completa |

### 3. CARTOGRAFIA DA JORNADA
| Ferramenta | Status | Completa? |
|------------|--------|-----------|
| Mapa da CidaDELA (Mapa Vivo) | ✅ Ativa | ✅ Completa |
| Replay da Jornada | ✅ Ativa | ✅ Completa |
| Torre Viva™ | ✅ Ativa | ✅ Completa |
| Cartografia da Torre | ✅ Ativa | ✅ Completa |
| Atlas de Arquétipos Femininos | ✅ Ativa | ✅ Completa |
| Mapa Arquetípico do Ego Feminino | ✅ Ativa | ✅ Completa |
| Mapeamento de Complexos | ✅ Ativa | ✅ Completa |
| Mapa da Sombra | ✅ Ativa | ⚠️ Parcial |
| Fio de Ariadne | ✅ Ativa | ✅ Completa |
| Sinais da Jornada | ✅ Ativa | ✅ Completa |
| Perfil Arquetípico | ✅ Ativa | ✅ Completa |
| Inventário de Personas | ✅ Ativa | ⚠️ Parcial |

### 4. INTEGRAÇÃO
| Ferramenta | Status | Completa? |
|------------|--------|-----------|
| Ritual de Integração | ✅ Ativa | ✅ Completa |
| Caderno Ritual do Cisne Negro | ✅ Ativa | ⚠️ Parcial |
| Rituais de Mudra | ✅ Ativa | ⚠️ Parcial |
| Pós-Sessão | ✅ Ativa | ✅ Completa |
| Oráculo das Estações | ✅ Ativa | ⚠️ Parcial |

### 5. CLIENTE / AUTOEXPLORAÇÃO
| Ferramenta | Status | Completa? |
|------------|--------|-----------|
| Jardim da Psique | ✅ Ativa | ✅ Completa |
| Jardim da Heroína | ✅ Ativa | ✅ Completa |
| Bússola Onírica | ✅ Ativa | ✅ Completa |
| Mapas Reflexivos Pessoais | ✅ Ativa | ✅ Completa |
| Oráculos / Tiragem de Cartas | ✅ Ativa | ✅ Completa |
| Cartas da Jornada | ✅ Ativa | ✅ Completa |
| O Caminho da Mulher que se Torna Inteira | ✅ Ativa | ✅ Completa |

### 6. COMUNIDADE
| Ferramenta | Status | Completa? |
|------------|--------|-----------|
| Círculo Sagrado | ✅ Ativa | ⚠️ Parcial |
| Jardim de Grupo | ✅ Ativa | ✅ Completa |

### 7. FORMAÇÃO
| Ferramenta | Status | Completa? |
|------------|--------|-----------|
| Auto-Mapeamento | ✅ Ativa | ✅ Completa |
| Simulador de Sessão | ✅ Ativa | ✅ Completa |
| Estudos de Caso | ✅ Ativa | ✅ Completa |
| Laboratório de Leitura | ✅ Ativa | ✅ Completa |
| Clientes-Piloto | ✅ Ativa | ✅ Completa |
| Roteiros e Protocolos | ✅ Ativa | ✅ Completa |
| Academia de Formação | ✅ Ativa | ⚠️ Parcial |
| O Labirinto da Heroína Interna® | ✅ Ativa | ✅ Completa |

### MAL DEFINIDAS
| Ferramenta | Problema |
|------------|----------|
| SYNTHEIA | Função confusa — é ferramenta narrativa? IA? Hub? |
| Agente Tradutor Simbólico | IA sem contexto claro de uso |
| Agente Analista de Caso | ❌ Inativa, sem função clara |
| Agente Curador de Práticas | ❌ Inativa, sem função clara |
| Competências do Ego (Antroposofia) | Leitura desconectada do fluxo |
| Mapa de Hawkins | Leitura desconectada do fluxo |
| Chakras – Leitura Energética | Sobreposta com Cartografia Psíquica |
| Corpo como Inconsciente | Sem saída clara |
| Trilha de Neuroplasticidade | ❌ Inativa, conceito dissolvido |

---

## ETAPA 3 — FICHAS ESTRUTURADAS (principais ferramentas)

### 🔵 CARTOGRAFIA PSÍQUICA ORÁCULA
- **Categoria:** Diagnóstico simbólico
- **Função principal:** GPS da psique — gera mapa de traços e CidaDELA
- **Quando usar:** Entrada no sistema / início da jornada
- **Entrada:** Questionário de 25 perguntas
- **Ação central:** Cálculo de 5 territórios + geração de distritos
- **Saída:** Mapa da CidaDELA Interior gerado automaticamente
- **Próximo passo:** → Mapa da Casa → Labirinto das 39 Portas

### 🔵 LABIRINTO DAS 39 PORTAS
- **Categoria:** Diagnóstico simbólico / Condução
- **Função principal:** Identifica campo psíquico ativo via portas emocionais
- **Quando usar:** Em sessão ou autoexploração profunda
- **Entrada:** Seleção de portas (8 grupos)
- **Ação central:** Abertura/fechamento de portas → mapeamento
- **Saída:** Estado das portas + protocolo sugerido
- **Próximo passo:** → Biblioteca de Intervenções → Atualiza CidaDELA

### 🔵 TORRE VIVA™
- **Categoria:** Cartografia da jornada
- **Função principal:** Identifica torres de defesa da psique
- **Quando usar:** Após diagnóstico inicial / em sessão
- **Entrada:** Questionário ou observação clínica
- **Ação central:** Identificação de 7 torres e suas dinâmicas
- **Saída:** Mapa de torres + insights clínicos
- **Próximo passo:** → Perfil Arquetípico → Plano de sessão

### 🔵 ATLAS DE ARQUÉTIPOS FEMININOS
- **Categoria:** Cartografia da jornada
- **Função principal:** Mandala circular de arquétipos ativos/dormentes
- **Quando usar:** Após cartografia psíquica / em sessão
- **Entrada:** Seleção de arquétipos + atividade 1-10
- **Ação central:** Mapeamento de dominância e conflitos
- **Saída:** Perfil arquetípico dinâmico
- **Próximo passo:** → Perfil Arquetípico → Intervenções

### 🔵 LEITURA EM 5 CAMADAS
- **Categoria:** Condução terapêutica
- **Função principal:** Do sintoma ao portal — leitura profunda
- **Quando usar:** Centro da sessão / momento de aprofundamento
- **Entrada:** Queixa ou tema trazido
- **Ação central:** Travessia por 5 camadas (Sintoma → Sombra → Recurso → Portal → Integração)
- **Saída:** Pergunta-mãe + direção terapêutica
- **Próximo passo:** → Protocolo de Intervenção → Registro

### 🔵 MODO SESSÃO (Stepper)
- **Categoria:** Condução terapêutica
- **Função principal:** Condução estruturada de sessão em 4 passos
- **Quando usar:** Toda sessão clínica
- **Entrada:** Seleção de cliente
- **Ação central:** Check-in → GPS → Execução → Registro
- **Saída:** Sessão registrada + CidaDELA atualizada
- **Próximo passo:** → Relatório Narrativo → Jardim do Ofício

### 🔵 MAPA DA CIDADELA (MAPA VIVO)
- **Categoria:** Cartografia da jornada
- **Função principal:** Visualização integrada da psique
- **Quando usar:** Visão geral / início e fim de sessão
- **Entrada:** Dados acumulados de todas as ferramentas
- **Ação central:** Mandala SVG interativa com 11 distritos
- **Saída:** Panorama visual + estados dos distritos
- **Próximo passo:** → Qualquer ferramenta específica

### 🔵 JARDIM DA PSIQUE
- **Categoria:** Cliente / Autoexploração
- **Função principal:** Diário simbólico pessoal
- **Quando usar:** Entre sessões / reflexão diária
- **Entrada:** Impulso da usuária
- **Ação central:** Escrita livre com contenção ética (Guardiã)
- **Saída:** Registro pessoal + insight
- **Próximo passo:** → Nenhum obrigatório (campo livre)

### 🔵 RELATÓRIO NARRATIVO
- **Categoria:** Cartografia da jornada
- **Função principal:** Síntese narrativa da jornada terapêutica
- **Quando usar:** Fechamento de ciclo / devolutiva
- **Entrada:** Dados do Mapa Vivo + histórico
- **Ação central:** IA gera narrativa em 6 seções
- **Saída:** Documento PDF/imprimível
- **Próximo passo:** → Devolutiva para cliente → Fechamento

### 🔵 REPLAY DA JORNADA
- **Categoria:** Cartografia da jornada
- **Função principal:** Visualização temporal da evolução
- **Quando usar:** Supervisão / devolutiva / fechamento
- **Entrada:** Histórico de sessões
- **Ação central:** Playback contemplativo da CidaDELA
- **Saída:** Comparação temporal
- **Próximo passo:** → Relatório Narrativo

---

## ETAPA 4 — DETECÇÃO DE PROBLEMAS

### 🔴 FERRAMENTAS DUPLICADAS (mesma função)
| Par duplicado | Problema |
|---------------|----------|
| **Big Five — Leitura Funcional** existe em 2 salas (Visitante + Método) com IDs e rotas diferentes | DUPLICATA DE REGISTRO |
| **Cartografia Psíquica** aparece 2x no FerramentasHub (id: cartografia-psiquica-oracula + cartografia-psiquica) | DUPLICATA NO CÓDIGO |
| **Torre Viva** existe no DB + no FerramentasHub fixo + na Casa das Máquinas | TRIPLETA |
| **Cartografia da Torre** existe no DB + no FerramentasHub fixo | DUPLICATA |
| **Atlas de Arquétipos** existe no DB + no FerramentasHub fixo | DUPLICATA |
| **Leitura em 5 Camadas** existe no DB + no FerramentasHub fixo + na Radiestesia | TRIPLETA |
| **Radar de Eixo** existe no DB + no FerramentasHub fixo | DUPLICATA |
| **Labirinto** no FerramentasHub + DB + Casa das Máquinas | TRIPLETA |

### 🟡 FERRAMENTAS SOBREPOSTAS (confusas)
| Ferramentas | Sobreposição |
|-------------|-------------|
| Cartografia Psíquica vs Big5 Funcional vs Big5 antigo | Todas medem traços psíquicos |
| Eneagrama vs O Oráculo dos Nove Arquétipos | Ambos são eneagramas com nomes diferentes |
| Mapa do Ego Feminino vs Atlas de Arquétipos vs Perfil Arquetípico | Mapeiam arquétipos de formas similares |
| SYNTHEIA vs Agente Tradutor vs Agente Analista vs Agente Curador | 4 "agentes IA" sem diferenciação clara |
| Neuroplasticidade vs Plasticidade Psíquica vs Trilha de Neuroplasticidade | 3 ferramentas do mesmo tema (todas inativas) |
| Corpo como Inconsciente vs Rituais de Mudra | Sobreposição corpo/somática |

### 🟠 FERRAMENTAS SEM SAÍDA (terminam sem direcionamento)
- Competências do Ego (Antroposofia)
- Mapa de Hawkins
- Chakras – Leitura Energética
- Corpo como Inconsciente
- Inventário de Personas
- Oráculo das Estações
- Escala de MAIA Oracular
- Rituais de Mudra

### 🟣 FERRAMENTAS SEM ENTRADA CLARA
- Imaginação Ativa — quando usar?
- Caderno Ritual do Cisne Negro — como chegar?
- Mapa da Sombra — gatilho de ativação?
- Círculo Sagrado — para quem é?

### ⚫ SEM CATEGORIA CLARA
- SYNTHEIA
- Agente Tradutor Simbólico
- Competências do Ego (Antroposofia)
- Mapa de Hawkins

---

## ETAPA 5 — DECISÃO ESTRUTURAL

| Ferramenta | Decisão | Justificativa |
|------------|---------|---------------|
| Big5 (antigo, /ferramentas/big5) | ❌ ARQUIVAR | Substituído pela Cartografia Psíquica |
| Neuroplasticidade & Mudança de Padrões | ❌ ARQUIVAR | Inativa, linguagem técnica |
| Mapa de Plasticidade Psíquica | ❌ ARQUIVAR | Inativa, substituída |
| Trilha de Neuroplasticidade | ❌ ARQUIVAR | Inativa, conceito dissolvido |
| Agente Analista de Caso | ❌ ARQUIVAR | Inativo, sem função definida |
| Agente Curador de Práticas | ❌ ARQUIVAR | Inativo, sem função definida |
| Big Five (Visitante, duplicata) | 🔄 INTEGRAR | Manter apenas 1 registro, rota /ferramenta/big5-funcional |
| Cartografia Psíquica (duplicata no Hub) | 🔄 INTEGRAR | Remover entrada fixa duplicada |
| Leitura 5 Camadas (Radiestesia) | 🔄 INTEGRAR | Apontar para mesma ferramenta |
| Eneagrama vs Oráculo dos Nove | ✅ MANTER AMBOS | Eneagrama = funcional, Oráculo = simbólico |
| SYNTHEIA | 🔧 REDEFINIR | Como hub de IA unificado (não ferramenta solta) |
| Agente Tradutor Simbólico | 🔧 COMPLEMENTAR | Integrar ao fluxo de sessão |
| Competências do Ego (Antroposofia) | 🔧 COMPLEMENTAR | Subordinar ao Atlas de Arquétipos |
| Mapa de Hawkins | 🔧 COMPLEMENTAR | Subordinar à Cartografia Psíquica |
| Chakras | 🔧 COMPLEMENTAR | Subordinar à Cartografia Psíquica |
| Corpo como Inconsciente | 🔧 COMPLEMENTAR | Subordinar à Condução Terapêutica |
| Inventário de Personas | 🔧 COMPLEMENTAR | Subordinar ao Conselho das Partes |
| Oráculo das Estações | 🔧 COMPLEMENTAR | Subordinar à Integração |
| Escala MAIA | ✅ MANTER | Adicionar saída clara |

---

## ETAPA 6 — FLUXO PRINCIPAL DO MÉTODO

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUXO PRINCIPAL DA ORÁCULA                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ╔═══════════════════════════════════╗                          │
│  ║     1. DIAGNÓSTICO SIMBÓLICO     ║                          │
│  ╠═══════════════════════════════════╣                          │
│  ║                                   ║                          │
│  ║  Quiz da Voz (entrada)            ║                          │
│  ║       ↓                           ║                          │
│  ║  Cartografia Psíquica Orácula     ║                          │
│  ║       ↓                           ║                          │
│  ║  → Gera CidaDELA Interior ←      ║                          │
│  ║       ↓                           ║                          │
│  ║  Labirinto das 39 Portas          ║                          │
│  ║       ↓                           ║                          │
│  ║  Big Five Funcional (complemento) ║                          │
│  ║  Escala MAIA (complemento)        ║                          │
│  ║  Radar do Eixo (complemento)      ║                          │
│  ╚═══════════════════════════════════╝                          │
│       ↓                                                         │
│  ╔═══════════════════════════════════╗                          │
│  ║     2. CONDUÇÃO TERAPÊUTICA      ║                          │
│  ╠═══════════════════════════════════╣                          │
│  ║                                   ║                          │
│  ║  Modo Sessão (Stepper 4 passos)   ║                          │
│  ║       ↓                           ║                          │
│  ║  Leitura em 5 Camadas             ║                          │
│  ║       ↓                           ║                          │
│  ║  Biblioteca de Intervenções       ║                          │
│  ║       ↓                           ║                          │
│  ║  Protocolo Orácula                ║                          │
│  ║       ↓                           ║                          │
│  ║  [Ferramentas específicas]:       ║                          │
│  ║    • Torre Viva™                  ║                          │
│  ║    • Atlas de Arquétipos          ║                          │
│  ║    • Conselho das Partes          ║                          │
│  ║    • Mapeamento de Complexos      ║                          │
│  ║    • Sonho Estruturado            ║                          │
│  ║    • Imaginação Ativa             ║                          │
│  ║    • Escrita Não-Censurada        ║                          │
│  ╚═══════════════════════════════════╝                          │
│       ↓                                                         │
│  ╔═══════════════════════════════════╗                          │
│  ║     3. CARTOGRAFIA DA JORNADA    ║                          │
│  ╠═══════════════════════════════════╣                          │
│  ║                                   ║                          │
│  ║  Mapa da CidaDELA (atualizado)    ║                          │
│  ║       ↓                           ║                          │
│  ║  Perfil Arquetípico (snapshot)    ║                          │
│  ║       ↓                           ║                          │
│  ║  Replay da Jornada               ║                          │
│  ║       ↓                           ║                          │
│  ║  Fio de Ariadne (rastreio)       ║                          │
│  ║       ↓                           ║                          │
│  ║  Sinais da Jornada               ║                          │
│  ║       ↓                           ║                          │
│  ║  Relatório Narrativo             ║                          │
│  ╚═══════════════════════════════════╝                          │
│       ↓                                                         │
│  ╔═══════════════════════════════════╗                          │
│  ║        4. INTEGRAÇÃO             ║                          │
│  ╠═══════════════════════════════════╣                          │
│  ║                                   ║                          │
│  ║  Ritual de Integração             ║                          │
│  ║       ↓                           ║                          │
│  ║  Registro Pós-Sessão             ║                          │
│  ║       ↓                           ║                          │
│  ║  Jardim da Psique (cliente)       ║                          │
│  ║  Jardim do Ofício (terapeuta)     ║                          │
│  ║  Jardim da Heroína (simbólico)    ║                          │
│  ║       ↓                           ║                          │
│  ║  → Retorna ao Mapa da CidaDELA   ║                          │
│  ╚═══════════════════════════════════╝                          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  EIXO TRANSVERSAL: Oráculos · Narroterapia · Formação          │
└─────────────────────────────────────────────────────────────────┘
```

### Fluxo exemplo completo:

```
Labirinto das 39 Portas
  → identifica Porta: "Medo do Abandono" (campo: Vinculação)
  → GPS sugere: Protocolo de Sustentação (Biblioteca)
  → Terapeuta aplica intervenção em sessão
  → Atualiza Mapa da CidaDELA (distrito Relacional muda de estado)
  → Gera snapshot do Perfil Arquetípico
  → Registro Pós-Sessão
  → Terapeuta reflete no Jardim do Ofício
  → Cliente escreve no Jardim da Heroína
  → Próxima sessão: Replay mostra evolução
```

---

## ETAPA 7 — RESULTADO FINAL

### RESUMO QUANTITATIVO
| Categoria | Total | Ativas | Inativas | Problemáticas |
|-----------|-------|--------|----------|---------------|
| Diagnóstico simbólico | 13 | 9 | 4 | 3 duplicatas |
| Condução terapêutica | 10 | 10 | 0 | 0 |
| Cartografia da jornada | 12 | 12 | 0 | 1 parcial |
| Integração | 5 | 5 | 0 | 3 sem saída |
| Autoexploração | 7 | 7 | 0 | 0 |
| Comunidade | 2 | 2 | 0 | 1 parcial |
| Formação | 8 | 8 | 0 | 0 |
| Radiestesia | 8 | 8 | 0 | 5 sem saída |
| Mal definidas | 4 | 2 | 2 | 4 |
| **TOTAL** | **~111** | **~93** | **~8** | **~17** |

### SUGESTÕES DE SIMPLIFICAÇÃO

1. **Remover 6 ferramentas inativas** (Big5 antigo, Neuroplasticidade x3, Agente Analista, Agente Curador)
2. **Eliminar 8 duplicatas no FerramentasHub** — todas as ferramentas devem vir do banco, sem lista fixa no código
3. **Unificar Big Five** — manter apenas 1 registro no banco (atualmente 3 versões)
4. **Subordinar ferramentas complementares** — Hawkins, Antroposofia, Chakras devem aparecer como sub-ferramentas
5. **Definir saída para 8 ferramentas sem direcionamento** — cada ferramenta deve saber para onde levar
6. **Redefinir SYNTHEIA** — de ferramenta solta para motor IA integrado ao fluxo

### PONTOS DE EXCESSO DE COMPLEXIDADE

1. **Diagnóstico:** 13 ferramentas quando 4-5 seriam suficientes (Cartografia + Labirinto + Big5 + Eneagrama + MAIA)
2. **Radiestesia:** 8 ferramentas isoladas sem conexão com o fluxo da CidaDELA
3. **Agentes IA:** 4 agentes sem diferenciação clara de uso
4. **Registros duplicados no banco:** Big Five existe em 3 salas diferentes
5. **FerramentasHub tem lista fixa + dinâmica** — fonte de inconsistência constante
6. **Mapa do Ego vs Atlas vs Perfil Arquetípico** — 3 formas de ver arquétipos sem relação explícita

---

## AÇÕES PRIORITÁRIAS RECOMENDADAS

### Prioridade 1 (Imediata)
- [ ] Remover lista fixa `FIXED_TOOLS` do FerramentasHub — tudo deve vir do banco
- [ ] Desativar/arquivar as 6 ferramentas obsoletas no banco
- [ ] Unificar Big Five em 1 registro

### Prioridade 2 (Curto prazo)
- [ ] Criar campo `proximo_passo` em `sala_ferramentas` para conectar ferramentas
- [ ] Criar campo `categoria_metodo` (diagnostico/conducao/cartografia/integracao)
- [ ] Adicionar saída clara para as 8 ferramentas sem direcionamento

### Prioridade 3 (Médio prazo)
- [ ] Integrar Radiestesia ao fluxo da CidaDELA
- [ ] Unificar agentes IA sob SYNTHEIA
- [ ] Criar hierarquia ferramenta-principal → complementar no banco
