# FOUNDER_EXISTING_PAGES_REUSE_AUDIT

## 1. Identificação de Páginas e Status de Reuso

Após análise do diretório `src/pages/` e `src/components/clube/`, mapeamos a infraestrutura atual:

| Rota / Arquivo | Função Atual | Qualidade Visual | Decisão de Reuso |
| :--- | :--- | :--- | :--- |
| `/clube/rotas` (`ClubeRotasPortal.tsx`) | Portal contemplativo com áudio e cards. | **Excelente** | **MANTER.** Será adaptada para `founder_beta` para focar na Rota dos Lobos. |
| `/clube/rotas/rota-dos-lobos` (`RotaDosLobos.tsx`) | Página de entrada da jornada dos lobos. | **Excelente** | **MANTER.** Hero cinematográfico e cards de estações perfeitos. |
| `/clube/rota/:slug` (`ClubeRotaPremium.tsx`) | Estrutura de cada uma das 6 estações. | **Excelente** | **MANTER.** Já integra áudio, conteúdo e inputs de Jardim. |
| `/dashboard-membro` (`DashboardMembro.tsx`) | Landing da assinante com Mandala e Bússola. | **Bom** | **ADAPTAR.** Será a base do Dashboard Founder focado na CidadELA. |
| `/cidadela` (`CidadelaPage.tsx`) | Visão técnica/gerencial dos distritos. | **Regular** | **NÃO USAR.** Usaremos o componente `CidadelaRotasView.tsx` no Dashboard. |
| `/ferramenta/cartografia...` | Motor do teste de 30 perguntas. | **Funcional** | **SIMPLIFICAR.** Criar versão "Cartografia Express" (12 questões). |
| `/jardim-da-psique` (`JardimPsique.tsx`) | Listagem de registros da usuária. | **Bom** | **MANTER.** Apenas garantir link no menu inferior. |

## 2. Componentes de Alta Fidelidade (Preservar 100%)

Estes componentes já seguem o design system "Netflix Premium" da Casa e serão os pilares da experiência:

*   **`EscutaPremium.tsx`:** Player de áudio imersivo.
*   **`EstacaoHero.tsx`:** Cabeçalho cinematográfico das estações.
*   **`EstacaoCaminhoTrail.tsx`:** Navegação horizontal entre as estações.
*   **`MiniMandalaTerritorios.tsx`:** Visualização compacta dos distritos ativos.
*   **`JardimInput.tsx`:** Captura de respostas para Psique e Ofício.

## 3. Páginas "Soltas" que precisam de Costura

Identificamos as interfaces que existem mas estão sem o fluxo linear desejado:

*   **Entrada Founder:** Atualmente não existe uma "boas-vindas" específica ao Conselho Fundador. Adaptaremos o `ClubeRotasPortal` ou criaremos uma camada `FounderOverlay` sobre ele.
*   **Resultado CidadELA:** Hoje a saída do teste é clínica. Reaproveitaremos o `CidadelaRotasView` (já existente no código) para mostrar o mapa de forma mística e progressiva.
*   **Feedback Final:** Não há página de feedback técnico. Criaremos uma interface minimalista seguindo o estilo das estações.

## 4. Proposta de Implementação da Camada Founder

Em vez de criar um app paralelo, aplicaremos a flag `founder_beta` nos arquivos existentes:

1.  **Navegação:** `Navigation.tsx` e `BottomNavPreview.tsx` esconderão os links de "Formação", "Cursos" e "Admin" para fundadoras, deixando apenas: **Início (CidadELA) \| Rota dos Lobos \| Jardins \| Feedback.**
2.  **Home Dinâmica:** A rota `/clube` detectará se a usuária é `founder_beta` e se já fez a Cartografia. Se não fez, exibe o convite ao Conselho Fundador e o CTA para a "Cartografia Express".
3.  **Cartografia Express (Novo componente):** Uma versão reduzida do `CartografiaEstruturalStepper` com apenas 12 perguntas (1 por distrito), mapeando rapidamente o estado atual.
4.  **Admin Switch:** No menu de perfil do Admin, adicionaremos um toggle "Visualizar como Fundadora" que ativa/desativa a flag `founder_beta` localmente para testes.

## 5. Estrutura de Dados (Feedback)

*   **Tabela `founder_feedback`:** Criaremos esta tabela via migração para garantir que os dados sejam estruturados (Campos: `clareza`, `confusao`, `aplicabilidade`, `encantamento`, `sugestoes`, `valor_percebido`).

## 6. Fluxo de Navegação Costurado

1.  **Login** → Redireciona para `/clube`.
2.  **`/clube` (Founder Layer)** → Vídeo/Áudio Onboarding + CTA "Criar minha CidadELA".
3.  **Cartografia Express** (12 questões) → Salva perfil inicial.
4.  **Resultado CidadELA** → Mostra Mandala Ativa + CTA "Entrar na Rota dos Lobos".
5.  **Rota dos Lobos** → Apresentação Cinematográfica.
6.  **Estações (1 a 6)** → Conteúdo → Jardim Psique → Jardim Ofício → Concluir (Acende Distrito).
7.  **Dashboard Founder** → Mandala atualizada é a protagonista.
8.  **Feedback** → Coleta do parecer técnico final.

---
**Conclusão:** O projeto já possui toda a "massa bruta" visual. O trabalho agora é puramente de engenharia de rotas, simplificação do teste e persistência do feedback.
