# Plano de Onboarding e Primeira Jornada da Aluna: Sprint 05
**Documento:** SPRINT_05_STUDENT_ONBOARDING_AND_FIRST_JOURNEY_PLAN.md
**Status:** PLANEJAMENTO E DIAGNÓSTICO
**Data:** 14 de Maio de 2026

## 1. Mapeamento do Fluxo Atual (Post-Login)

### A. Visitante (visitante)
- **Destino:** `/sala-da-visitante`.
- **Experiência:** Ambiente limitado, focado em conversão e experimentação básica.
- **Barreira:** Bloqueios visuais (`LockedForVisitor`) em funcionalidades avançadas.

### B. Assinante/Aluna (membro)
- **Fluxo Inicial (New User):**
  1. Login -> `/onboarding`.
  2. Escolha de Arquétipo de Entrada (`CallScreen`).
  3. Redirecionamento para `/quiz/descubra-seu-eixo`.
  4. Pós-Quiz -> `/dashboard-membro`.
- **Fluxo Recorrente:**
  1. Login -> `/dashboard-membro`.
  2. Se `boas-vindas=true` (pós-venda), exibe `BoasVindasBanner`.
  3. Visualização da Bússola Oracular (estado psíquico, próximas ações).

### C. Administrador (admin)
- **Destino:** `/dashboard-membro` ou `/admin`.
- **Experiência:** Acesso total, incluindo painel de governança e documentos.

---

## 2. Diagnóstico da Experiência Atual

### Pontos Fortes:
- **Personalização:** Onboarding baseado em arquétipos e quiz de voz.
- **Identidade:** Linguagem visual "Oracular" consistente.
- **Feedback Visual:** Bússola e Mapas dão profundidade ao produto.

### Pontos de Melhoria (Gaps):
- **Clareza de Acesso:** Alunas que compram produtos específicos (Clube vs. Formação) caem na mesma Bússola, o que pode confundir quem busca conteúdo direto.
- **Mensagem de Boas-Vindas:** O banner é efêmero; falta um local fixo de "Comece por Aqui" para diferentes perfis.
- **Curva de Aprendizado:** A Bússola é poderosa, mas complexa para o primeiro minuto de uso.
- **Segmentação de Jornada:** A jornada recomendada é genérica; não diferencia claramente o caminho de uma assinante do Clube vs. uma aluna da Formação.

---

## 3. Proposta de Nova Experiência Inicial (UX Strategy)

### 3.1. Hub "Comece por Aqui" (Fixed Entry)
Implementar ou destacar uma seção fixa no Dashboard que mude conforme o produto ativo:
- **Clube Oracular:** Foco na Biblioteca de Contos e Encontros.
- **Formação Orácula:** Foco na Academia, Módulos e Fórum.
- **Visitante:** Foco na Travessia Gratuita e Cartografia básica.

### 3.2. Refinamento da "Primeira Jornada"
- **Pós-Quiz:** Em vez de apenas jogar no Dashboard, apresentar um "Mapa de Boas-Vindas" que explica os 3 pilares: Bússola (Estado), Portais (Conteúdo) e Salas (Ferramentas).
- **Gamificação Leve:** Checkbox de "Primeiros Passos" (ex: "Complete seu perfil", "Faça sua primeira leitura", "Assista ao vídeo de introdução").

### 3.3. Segmentação Visual
- Uso de cores de destaque ou ícones específicos para diferenciar trilhas (ex: Dourado para Formação, Prata para Clube).

---

## 4. Regras e Restrições (Safe-Guards)

- **Permissões:** Mantidas via `user_roles` e `effectivePortal`.
- **Segurança:** HMAC e Webhooks permanecem intocados.
- **Dados:** Nenhuma alteração no schema `profiles` ou `subscriptions` nesta fase.
- **Rockty:** Integração 100% preservada.

---

## 5. Próximos Passos Recomendados

1. **Prototipagem da "Sala de Início":** Desenhar a interface do hub segmentado.
2. **Refatoração do Banner de Boas-Vindas:** Torná-lo um componente persistente até a conclusão dos primeiros passos.
3. **Auditoria de Conteúdo:** Verificar se os links de "Próxima Ação" estão apontando para os destinos mais relevantes para novas alunas.

## 6. Classificação Final do Plano
**PRONTO PARA REVISÃO E DESIGN.**
