# SALA DE TREINAMENTO V0.1 — DOCUMENTAÇÃO TÉCNICA E FUNCIONAL

## 1. Visão Geral
A **Sala de Treinamento V0.1** é o laboratório pedagógico seguro da Casa Orácula 2.0. Ela foi projetada para ser um ambiente de experimentação controlada, onde a aluna pode praticar habilidades fundamentais antes da transição para o uso profissional na Casa das Máquinas.

### Objetivos de Treino:
- **Literatura como laboratório:** Uso de narrativas como espelhos simbólicos.
- **Casos fictícios:** Prática de leitura de contexto com personagens simuladas.
- **Escuta simbólica:** Desenvolvimento da percepção atmosférica e imersiva.
- **Formulação em camadas:** Organização do raciocínio clínico-simbólico.
- **Perguntas e Cautelas:** Treino de prudência ética e investigação profunda.
- **Transição Ética:** Preparação consciente para o uso do Atlas Orácula.

---

## 2. Mapa de Rotas
Abaixo estão as rotas que compõem o ecossistema da Sala de Treinamento e suas funções pedagógicas:

- `/sala-de-treinamento`: Hub central de navegação e integração de laboratórios.
- `/sala-de-treinamento/clinica-dos-contos`: Treino simbólico-literário e casos-espelho.
- `/sala-de-treinamento/casos-simulados`: Prática com personagens fictícias e formulação.
- `/sala-de-treinamento/formulacao-guiada`: Laboratório de raciocínio organizado em 7 camadas.
- `/clube/laboratorio`: Laboratório Oracular (Apoio — Estudo de obras do Clube).
- `/narroterapia/audios`: Ofício da Voz (Apoio — Treino de narração e presença).
- `/clube/treinamento`: Câmara do Sussurro (Apoio — Escuta ativa imersiva).
- `/narroterapia/biblioteca-contos`: Acervo Simbólico de Referência (Estudo).
- `/narroterapia/clinica`: Câmara de Narração Oracular (Uso profissional orientado).
- `/casa-das-maquinas/atlas`: Atlas Orácula (Copiloto profissional — Destino final).

---

## 3. Fluxo Pedagógico da Aluna
O percurso recomendado foi estruturado para garantir uma maturação progressiva:

1.  **Sala de Treinamento:** Ponto de partida e acolhimento ético.
2.  **Clínica dos Contos:** O olhar simbólico através da literatura clássica.
3.  **Casos Simulados:** A aplicação do olhar em contextos humanos fictícios.
4.  **Câmara do Sussurro:** Aprofundamento da escuta imersiva e atmosférica.
5.  **Formulação Guiada:** A consolidação do raciocínio técnico-simbólico.
6.  **Atlas Orácula:** Transição para a prática real, disponível apenas para perfis profissionais.

---

## 4. Áreas Principais

### Clínica dos Contos
Focada no treino simbólico-literário. Utiliza "Casos-Espelho" (ex: Patinho Feio, Barba Azul) para reconhecer fenômenos psíquicos em narrativas. Inclui o Acervo Simbólico de Referência.

### Casos Simulados
Focada na prática com personagens fictícias (ex: Caso Lia, Caso Rosa). Treina a identificação de sinais, hipóteses provisórias e definição de direção sem risco clínico.

### Formulação Guiada
Laboratório que ensina a organizar a leitura de um caso em 7 camadas: Queixa, Sinais, Hipóteses, Cautelas, Direção, Intervenção e Evolução.

### Laboratórios de Apoio
Integração com recursos existentes: Laboratório Oracular (80/20), Ofício da Voz (narração) e Câmara do Sussurro (escuta imersiva).

### Acervos e Bibliotecas
Conexão entre o material de estudo livre (Acervo Simbólico) e o material de uso clínico restrito (Câmara de Narração Oracular).

---

## 5. Permissões e Proteções
- **Câmara do Sussurro:** Mantém permissões originais vinculadas ao Clube do Livro.
- **Biblioteca Clínica:** Mantém gatekeeper restrito que exige certificação/autorização.
- **Atlas Orácula:** Permanece protegido por perfis profissionais; a ponte é apenas orientativa.
- **Segurança de Rotas:** Nenhum link contorna os `ProtectedRoute` ou expõe rotas restritas ao público.

---

## 6. Anteparos Éticos
A Sala de Treinamento V0.1 opera sob princípios de segurança:
- **Treino não é atendimento:** O ambiente é puramente pedagógico.
- **Ficção:** Casos simulados não representam pessoas reais.
- **Não Persistência:** Fichas "mock" são visuais; nenhum dado é salvo ou transformado em prontuário.
- **Ausência de Diagnóstico:** O sistema não gera diagnósticos ou prescrições automáticas.
- **Separação de Dados:** Não existe transferência automática de dados do treino para o Atlas profissional.

---

## 7. Limites Técnicos (V0.1)
- **Zero Persistência:** Não salva dados no banco de dados.
- **Zero IA:** Não realiza chamadas a modelos de linguagem nesta fase.
- **Infraestrutura:** Não altera esquemas de Supabase, Auth ou permissões de Admin.
- **Integridade:** Não modifica o código funcional do Atlas Orácula ou da Casa das Máquinas.

---

## 8. Guardrails para Futuras Etapas
Qualquer uma das seguintes ações requer nova aprovação e planejamento:
- Implementação de persistência de progresso de alunas.
- Criação de banco de dados para casos e exercícios.
- Integração de IA para geração de simulações ou feedback.
- Criação de relatórios de desempenho pedagógico.
- Conexão entre a Sala de Treinamento e o painel Admin.
- Transformação de componentes visuais (mocks) em formulários funcionais.

---

## 9. Estado Final
A **Sala de Treinamento V0.1** está declarada como **CONGELADA**. Ela serve como a fundação pedagógica integrada e segura para o desenvolvimento contínuo da Casa Orácula 2.0.
