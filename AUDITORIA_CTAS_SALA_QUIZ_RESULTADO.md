# Auditoria de CTAs: Sala de Visita, Quiz e Resultado

Este relatório detalha a limpeza de CTAs realizada no fluxo inicial da Casa Orácula para garantir que a experiência da usuária seja focada na Travessia 00.

## 1. Sala de Visita
**Status:** Correta
- **CTAs Encontrados:** 
  - "Descobrir minha Voz" (Botão principal para iniciar o Quiz).
- **Ação:** Mantido como único portal de entrada.
- **Fluxo:** Sala de Visita → Quiz da Voz.

## 2. Quiz da Voz
**Status:** Ajustado
- **CTAs Encontrados:**
  - "Ver Resultado" (Ao final do questionário).
- **Ação:** Mantido para processar a revelação da Voz.
- **Fluxo:** Quiz → Resultado.

## 3. Resultado do Quiz
**Status:** Limpeza Profunda Realizada
- **CTAs Mantidos:**
  - **Ação Dominante:** "Guardar minha Voz e iniciar a Travessia 00" (Leva para `/travessia/travessia-zero-o-limiar-da-casa`).
  - **Ação Secundária:** "Refazer quiz" (Link discreto no rodapé).
- **CTAs Removidos/Ocultados:**
  - Bloco "Rotas da Casa Orácula" (Removido da interface).
  - Bloco "CidaDELA Interior" (Removido da interface).
  - Botão "Aprofundar este arquétipo com Syntheia" (Removido de `QuizPage.tsx`).
  - Botão "Ver registro técnico" (Removido de `QuizPage.tsx`).
  - Botão "Visualizar registro técnico da Voz" (Removido de `QuizPage.tsx`).
  - Removido qualquer link para `/planos`, `/casa-das-maquinas` ou `/clube` neste estágio.

## 4. Auditoria de Conteúdo Modular (Admin)
Foram identificados blocos no banco de dados que podem injetar CTAs extras. Sugerimos a desativação ou ajuste no Admin:
- **Bloco CTA Button (ID: 5dbcd449...):** "👉 Tornar-me Habitante da Casa Orácula". Sugere-se desativar para o contexto `quiz_result` até que a Travessia 00 seja concluída.
- **Blocos AI Chat (Syntheia):** Configurados para diversos resultados. Embora o botão de acesso tenha sido removido da interface fixa, os blocos ainda existem no banco. A interface agora os ignora por padrão no fluxo de resultado imediato.

## 5. Ajustes de Rodapé
- O rodapé simbólico foi atualizado de "CASA ORÁCULA — CLÍNICA DOS CONTOS" para:
  > **"A Voz chama. A Travessia começa."**

## Conclusão
O fluxo agora apresenta uma jornada linear e sem distrações:
**Chegada (Sala) → Descoberta (Quiz) → Compromisso (Resultado → Travessia 00).**

A ação de assinatura e exploração completa da Casa (CidaDELA/Planos) agora é reservada para o momento posterior à introdução da Travessia 00.
