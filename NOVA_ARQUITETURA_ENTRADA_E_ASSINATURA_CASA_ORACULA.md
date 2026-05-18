# NOVA ARQUITETURA: ENTRADA E ASSINATURA CASA ORÁCULA

Este documento detalha a reestruturação estratégica da Casa Orácula, separando a experiência gratuita da experiência de assinatura e definindo a nova jornada do usuário.

## 1. Fluxo Gratuito Atualizado (Porta de Entrada)
A porta de entrada é desenhada para ser fluida, mística e sem barreiras imediatas de login até o momento de salvar o progresso.

1.  **Sala de Visita (Pública):** Boas-vindas, ambientação e micro-ritual.
2.  **Quiz da Voz (Público/Gratuito):** Diagnóstico arquetípico inicial.
3.  **Resultado Inicial:** Revelação imediata após o quiz.
4.  **Jornada Inicial 00 (Gratuita):** A experiência principal de introdução ao método.
5.  **CTA Estratégico:** Convite para habitar a CidaDELA e assinar as "Rotas".

## 2. Fluxo da Assinatura (Rotas da Casa Orácula)
A assinatura expande a experiência para o acompanhamento contínuo e ferramentas de profundidade.

*   **Produto:** Rotas da Casa Orácula.
*   **Slogan:** Contos, livros e práticas simbólicas para atravessar a psique e habitar sua CidaDELA interior.
*   **Ecossistema:**
    *   CidaDELA Interior (Cartografia Psíquica).
    *   Rotas de leitura simbólica (Antigo Clube).
    *   Clínica dos Contos.
    *   Acervo de Áudios, Práticas e Registros.
    *   Encontros e Lab 80/20.
    *   Mapa de Progresso Integrado.

## 3. Mapeamento de Mudanças

### Rotas Impactadas
| Rota | Status Atual | Novo Status |
| :--- | :--- | :--- |
| `/sala-da-visitante` | Público | Público (Mantido) |
| `/quiz` | Protegido | Público |
| `/cartografia` | Gratuito/Base | **Assinatura (Protegido)** |
| `/clube` | Clube de Leitura | `/rotas` (Assinatura) |

### Nomes e Substituições
*   **Antigo:** Clube de Leitura Oracular -> **Novo:** Rotas da Casa Orácula.
*   **Antigo:** Cartografia Psíquica (Entrada) -> **Novo:** CidaDELA Interior (Benefício Assinante).

### CTAs (Call to Actions)
*   **Na Sala de Visita:** "Descobrir minha Voz" (Leva ao Quiz).
*   **No Resultado do Quiz:** "Iniciar Travessia 00" (Gratuito).
*   **Na Travessia 00:** "Habitar minha CidaDELA" (Leva à página de Assinatura).

## 4. Proposta de Nova Navegação
*   **Visitante:** Home -> Sala de Visita -> Quiz -> Login/Cadastro.
*   **Logado (Gratuito):** Dashboard -> Travessia 00 -> Vitrine de Assinatura.
*   **Logado (Assinante):** Dashboard -> CidaDELA -> Rotas -> Clínica dos Contos -> Práticas.

## 5. Plano de Implementação (Passos Pequenos)
1.  **Commit 1:** Atualização de textos e meta-tags para refletir "Rotas da Casa Orácula".
2.  **Commit 2:** Liberação da rota `/quiz` (remover `ProtectedRoute` se aplicável).
3.  **Commit 3:** Implementação da lógica de acesso para a CidaDELA (apenas assinantes).
4.  **Commit 4:** Rebranding das páginas do antigo "Clube" para "Rotas".
5.  **Commit 5:** Ajuste dos CTAs de conversão entre a Jornada 00 e a Assinatura.
