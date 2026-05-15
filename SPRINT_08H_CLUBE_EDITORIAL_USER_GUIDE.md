# Guia de Uso: Sistema Editorial do Clube Oracular

Este guia orienta o uso do Painel Editorial para garantir que a gestão de conteúdos, áudios e jornadas do Clube Oracular seja feita com segurança, consistência pedagógica e rastreabilidade.

---

## 1. Visão Geral
O **Sistema Editorial do Clube** é a ferramenta central de gestão das jornadas da aluna. Ele permite que o Admin controle:
*   **Estações**: As grandes fases ou ciclos lunares do Clube.
*   **Itens da Rota**: Os passos diários ou lições da travessia.
*   **Audioteca**: O acervo central de arquivos de áudio, meditações e aulas.
*   **Histórico**: A auditoria de quem mudou o quê e quando.

---

## 2. Fluxo Editorial Recomendado
Para evitar erros e exposição de conteúdos incompletos, siga sempre este ciclo:
1.  **Editar**: Realize as mudanças necessárias nos campos.
2.  **Salvar**: Salve os dados mantendo o status em **Rascunho**.
3.  **Pré-visualizar**: Use o botão "Pré-visualizar" para ver como a aluna enxergará o conteúdo.
4.  **Revisar**: Confira textos, áudios e prompts no modo preview.
5.  **Publicar**: Altere o status para **Publicado** apenas após a revisão.
6.  **Acompanhar**: Verifique no Histórico se a alteração foi registrada corretamente.

---

## 3. Gestão de Estações
*   **Título e Subtítulo**: Devem refletir o tema do ciclo ou o livro em estudo.
*   **Livro Vinculado**: Identifique o título da obra base para facilitar a busca.
*   **Status de Visibilidade**:
    *   **Ativa**: A estação está em curso (aparece no destaque).
    *   **Publicada**: A estação está disponível para navegação.
*   **Cuidado**: Ao despublicar uma estação, todos os seus passos ficam inacessíveis para as alunas.

---

## 4. Edição de Itens da Rota (Passos)
*   **Textos Guiados**: Use o campo de roteiro para instruções claras e acolhedoras.
*   **Campos Simbólicos**: Preencha Porta, Campo, Torre e Labirinto conforme a cartografia da rota.
*   **Prompts do Jardim**: Questões reflexivas para a escrita íntima da aluna.
*   **Cenários de Treinamento**: Casos práticos para a aplicação técnica dos conceitos.

---

## 5. Preview Editorial
*   **Quando usar**: SEMPRE antes de publicar qualquer alteração importante.
*   **O que verificar**:
    *   O áudio está tocando corretamente?
    *   O prompt do jardim está inspirador?
    *   A formatação do texto está legível?
*   **Como voltar**: O preview abre em uma nova aba; basta fechá-la para retornar ao editor.

---

## 6. Status Rascunho vs. Publicado
*   **Rascunho**: Use enquanto estiver produzindo, revisando ou aguardando aprovação. O conteúdo fica invisível para a aluna.
*   **Publicado**: O conteúdo entra em "Produção" e fica imediatamente disponível na Rota dos Lobos.
*   **Dica**: Nunca deixe uma rota com "buracos" (passos intermediários em rascunho enquanto o final está publicado).

---

## 7. Histórico Editorial
*   **Localização**: Aba "Histórico Editorial" no painel principal.
*   **O que contém**: Identificação do Admin, data/hora, campo alterado, valor antigo e valor novo.
*   **Uso**: Serve para auditoria de erros e para recuperar textos ou configurações que foram sobrescritas indevidamente.

---

## 8. Audioteca (Biblioteca de Áudios)
*   **Editar Faixas**: Gerencie os metadados da fonte original do áudio.
*   **Ouvir Preview**: Teste o arquivo diretamente na tabela clicando no botão Play.
*   **URL e Duração**: Mantenha a URL original (Supabase) e a duração real em segundos para o player funcionar perfeitamente.

---

## 9. Vínculo de Áudios à Rota
Ao editar um passo, use a seção **Áudios da Rota**:
*   **Botão "Vincular Audioteca"**: Abre o seletor central. Evite preencher URLs manualmente.
*   **Sincronizado (Verde)**: Os dados do passo batem com a Audioteca.
*   **Divergente (Amarelo)**: A URL existe, mas o título ou tipo foi editado manualmente no passo. Considere sincronizar novamente.
*   **Manual (Cinza)**: Link externo ou legado que não está cadastrado na Audioteca central.

---

## 10. Taxonomia Editorial
Categorize cada áudio corretamente para facilitar a curadoria:
*   **Abertura de Campo**: Início de ciclo ou estação.
*   **Aula Principal**: Conteúdo formativo teórico.
*   **Conto & Símbolo**: Narrativas arquetípicas e mitológicas.
*   **Prática Guiada**: Exercícios ativos de aplicação.
*   **Laboratório 80/20**: Instruções práticas de alta eficiência.
*   **Fechamento de Campo**: Encerramento e integração de aprendizado.
*   **Forja Profissional**: Conteúdo voltado à atuação da facilitadora.
*   **Meditação**: Conduções introspectivas e de silêncio.
*   **Instrução Técnica**: Orientações sobre o uso da plataforma ou ferramentas.

---

## 11. Regras de Segurança Editorial
1.  **Direitos Autorais**: Não cole trechos extensos de livros protegidos sem a devida contextualização ou autorização.
2.  **Qualidade Mínima**: Não publique passos sem áudio ou sem prompt se o tipo do passo exigir.
3.  **Teste de Links**: Sempre teste URLs de áudio externas antes de salvar.
4.  **Integridade**: Não apague o conteúdo do campo `metadata` manualmente a menos que saiba exatamente o que está fazendo.

---

## 12. Checklist Final de Publicação
Antes de marcar como **Publicado**, verifique:
*   [ ] O texto foi revisado (ortografia e tom de voz)?
*   [ ] O áudio foi testado e está audível?
*   [ ] O prompt do Jardim faz sentido para este passo?
*   [ ] A taxonomia editorial foi aplicada (Aula, Prática, etc)?
*   [ ] O Preview foi validado visualmente?
*   [ ] A ordem do passo está correta na sequência da estação?

---
**Em caso de dúvidas técnicas, acione o suporte de desenvolvimento.**
