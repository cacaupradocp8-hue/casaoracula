# DOCUMENTAÇÃO: ROTAS DA CASA V0

## 1. Visão Geral
As **Rotas da Casa** representam o espaço de continuidade, travessia, leitura simbólica e práticas de integração dentro da Casa Orácula 2.0. É a evolução conceitual do antigo "Clube", focada em profundidade e jornada constante.

Tecnicamente, a área ainda utiliza caminhos legados (como `/clube`), mas sua interface e linguagem foram reposicionadas para refletir a nova identidade visual e semântica das Rotas da Casa.

## 2. Decisão Técnica da V0
Nesta fase inicial, optou-se pela estabilidade técnica em detrimento da pureza estrutural:
- **NÃO renomear `/clube`**: Mantido para evitar quebras em links externos e integrações.
- **NÃO criar redirects**: Evita complexidade desnecessária na navegação interna.
- **NÃO alterar slugs/hooks/queries**: Toda a lógica de dados do Supabase e estados de progresso permanece intacta.
- **NÃO alterar permissões**: O controle de acesso continua vinculado às regras pré-existentes do Clube.
- **Camada Visual**: O termo "Clube" é tratado como um legado técnico interno, enquanto "Rotas da Casa" é a terminologia oficial da interface.

## 3. Rotas Principais
- `/clube`: Catálogo de Rotas (Antigo Clube)
- `/clube/rota/:slug`: Página de conteúdo específico da rota
- `/clube/laboratorio`: Laboratório Oracular
- `/travessias`: Acesso às jornadas de travessia
- `/minha-jornada`: Dashboard de progresso da aluna
- `/biblioteca`: Acervo Vivo e consulta simbólica

## 4. Ficheiros Principais
- `src/pages/clube/ClubeRotasCatalogo.tsx`
- `src/pages/clube/ClubeRotaPremium.tsx`
- `src/pages/clube/ClubeAcervo.tsx`
- `src/pages/clube/ClubeLaboratorio.tsx`
- `src/pages/clube/ClubeLaboratorioObra.tsx`
- `src/pages/casa/CasaAtrio.tsx`
- `src/pages/casa/CasaLeitura.tsx`
- `src/pages/casa/CasaCirculo.tsx`
- `src/pages/casa/CasaJardim.tsx`
- `src/pages/casa/CasaSustentacao.tsx`
- `src/components/layout/Navigation.tsx` (Porta de entrada visual e labels)

## 5. Núcleo das Rotas da Casa V0
- **Minha Rota**: Foco na jornada individual.
- **Travessias**: Caminhos estruturados de aprendizado.
- **Acervo Vivo**: Biblioteca de recursos simbólicos.
- **Laboratório Oracular**: Espaço de prática e experimentação.
- **Práticas de Integração**: Exercícios para consolidar o conhecimento.
- **Espaço de Continuidade**: Sustentação da prática diária.

## 6. Pontes com Outras Áreas

### Sala de Treinamento
- Integração via Câmara do Sussurro e Laboratório Oracular para feedback vocal e técnico.
- Ofício da Voz e Clínica dos Contos como extensões práticas das rotas.

### Atlas Orácula
- O Atlas fornece a base para o treino de percepção simbólica e leitura de padrões necessários nas Rotas.

### Formação Orácula
- A Formação provê o método e os ciclos de estudo que alimentam as práticas de integração.

### Narroterapia
- Conexão direta com o Acervo Simbólico e a Câmara de Narração Oracular.

## 7. Linguagem Oficial (Substituições)
- Clube → **Rotas da Casa**
- Acervo do Clube → **Acervo Vivo**
- Voltar ao Clube → **Voltar às Rotas**
- Ferramentas → **Práticas de Integração**
- Assinantes → **Acesso reservado às Rotas da Casa**
- Espaço de Sustentação → **Espaço de Continuidade**

## 8. Limites Técnicos da V0
A versão V0 é estritamente visual e semântica. Ela:
- Não altera dados ou permissões.
- Não modifica a estrutura do Supabase ou Auth.
- Não altera slugs, URLs ou a lógica de rotas do React Router.
- Não move ficheiros nem apaga códigos legados.

## 9. Guardrails para Próximas Etapas
Mudanças que requerem nova aprovação e planejamento:
- Criação da rota física `/rotas-da-casa`.
- Migração de slugs no banco de dados.
- Renomeação de pastas e arquivos (`src/pages/clube` para `src/pages/rotas`).
- Alteração na lógica de assinaturas ou integração com o Admin.

## 10. Estado Final
As **Rotas da Casa V0** estão declaradas como **CONGELADAS**. Representam uma camada de experiência do usuário (UX) e interface (UI) unificada, operando sobre a infraestrutura técnica estável do antigo sistema de Clube.
