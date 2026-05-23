# Sala de Treinamento V0 — Documentação Técnica e Pedagógica

## 1. Visão Geral
A Sala de Treinamento é um laboratório pedagógico seguro da Casa Orácula 2.0, projetado para que profissionais (alunas, terapeutas, psicólogas, mentoras e facilitadoras) possam treinar o olhar clínico e simbólico antes do atendimento real.

**O que ela é:**
- Um ambiente de treino de formulação e escuta simbólica.
- Um espaço para leitura de casos fictícios e literatura.
- Um laboratório de prática de perguntas, cautelas e escolha de próximos passos.
- Uma ponte pedagógica para o raciocínio do Atlas Orácula.

**O que ela NÃO é:**
- Não é um ambiente de atendimento real.
- Não é um sistema de prontuário.
- Não utiliza nem armazena dados reais de clientes.
- Não gera diagnósticos ou conclusões clínicas automáticas.
- Não substitui supervisão profissional.
- Não utiliza Inteligência Artificial ou persistência de dados nesta versão (V0).

---

## 2. Objetivo da V0
A versão 0.0 serve como Prova de Conceito (PoC) para validar:
- A experiência pedagógica e a clareza do percurso de aprendizado.
- A adequação da linguagem ética e dos blocos de aviso.
- A conexão lógica entre o treino simbólico (Literatura) e o raciocínio clínico (Atlas).
- A utilidade das shells iniciais: Clínica dos Contos, Casos Simulados e Formulação Guiada.

---

## 3. Arquitetura de Rotas
As rotas seguem o padrão de proteção do projeto (`ProtectedRoute`), garantindo acesso apenas a utilizadoras autenticadas:

| Rota | Descrição | Status |
| :--- | :--- | :--- |
| `/sala-de-treinamento` | Página principal / Hub do laboratório | Ativa |
| `/sala-de-treinamento/clinica-dos-contos` | Laboratório de literatura e símbolos | Ativa |
| `/sala-de-treinamento/casos-simulados` | Prática com personagens fictícias | Ativa |
| `/sala-de-treinamento/formulacao-guiada` | Treino de raciocínio em camadas | Ativa |

---

## 4. Estrutura de Ficheiros
Os ficheiros que compõem este módulo são estritamente de frontend e apresentação:

- `src/pages/SalaDeTreinamentoPage.tsx`: Hub central e guia de percurso.
- `src/pages/ClinicaDosContosPage.tsx`: Interface pedagógica literária.
- `src/pages/CasosSimuladosPage.tsx`: Interface de casos fictícios.
- `src/pages/FormulacaoGuiadaPage.tsx`: Interface de raciocínio clínico.
- `src/App.tsx`: Registro e proteção das rotas.

---

## 5. Percurso Pedagógico Recomendado
A Sala foi desenhada para uma navegação sequencial que constrói a maestria profissional:

1.  **Clínica dos Contos**: Treino de leitura simbólica, casos-espelho e interpretação de narrativas literárias.
2.  **Casos Simulados**: Prática de escuta e formulação básica com personagens fictícias (Lia, Joana, Helena, Rosa).
3.  **Formulação Guiada**: Organização do raciocínio nas 7 camadas do Atlas (Queixa, Sinais, Hipóteses, Cautelas, Direção, Intervenção e Revisão).
4.  **Atlas Orácula**: Aplicação real do raciocínio treinado dentro da Casa das Máquinas, com responsabilidade profissional total.

---

## 6. Blocos Éticos e Limites
Todas as páginas da Sala de Treinamento reforçam o compromisso ético:
> "Este espaço é pedagógico. Não usa clientes reais, não gera diagnóstico, não substitui supervisão e não deve ser usado como prontuário ou decisão profissional automática."

Este princípio é o **pilar central** e deve ser mantido em qualquer expansão do módulo.

---

## 7. Limites Técnicos (Estado Congelado)
A V0 da Sala de Treinamento possui isolamento técnico total:
- **Sem Persistência**: Nenhuma informação inserida nas fichas de treino é salva no banco de dados.
- **Sem IA**: Não há chamadas para OpenAI, Syntheia ou Edge Functions de processamento.
- **Sem Dados Reais**: O módulo não possui permissão para ler tabelas de clientes ou sessões reais.
- **Sem Saídas Oficiais**: Não há geração de PDFs, relatórios ou documentos exportáveis.

---

## 8. Guardrails para Expansões Futuras
Qualquer alteração que envolva os itens abaixo requer **aprovação explícita** e nova rodada de auditoria:
- Transformar fichas *mock* em formulários persistentes.
- Conectar o progresso das alunas ao banco de dados (Supabase).
- Integrar a Mentora IA (Syntheia) para análise de casos simulados.
- Criar banco de dados dinâmico de contos ou personagens.
- Conectar a Sala ao Painel de Administração (Admin 2.0).
- Alterar permissões de acesso (`PortalType`).

---

## 9. Próximas Etapas Possíveis
- Testes de usabilidade com um grupo pequeno de alunas.
- Revisão do conteúdo pedagógico por especialistas em narroterapia e clínica.
- Expansão do catálogo de casos fictícios e obras literárias.
- Planeamento da integração de "progresso de maestria" (Gamificação pedagógica).

---
**Status: CONGELADO**
*Documentação gerada em 23 de Maio de 2026.*
