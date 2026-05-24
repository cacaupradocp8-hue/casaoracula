# Documentação Técnica: Rotas da Casa V0.2

Esta documentação descreve a arquitetura e o funcionamento do módulo **Rotas da Casa** em sua versão 0.2, incluindo sua integração com o ecossistema **Cidadela**.

## 1. Visão Geral

O módulo "Rotas da Casa" gerencia o progresso pedagógico e a jornada das usuárias através de "Estações" e "Itens de Rota". A V0.2 consolida a transição para um modelo baseado em itens individuais, permitindo progresso granular e integração simbólica com a Cidadela.

## 2. Modelagem de Dados (Tabelas `clube_*`)

O núcleo das Rotas reside em quatro tabelas principais no Supabase:

- **`clube_estacoes`**: Define os marcos principais da jornada (ex: Estação 1, Estação 2). Contém metadados sobre o livro do mês e essências narrativas.
- **`clube_rota_itens`**: Itens individuais de cada estação (vídeos, áudios, laboratórios, etc.). Define a ordem, obrigatoriedade e metadados visuais.
- **`clube_rota_progresso`**: Tabela de junção que rastreia o estado de cada usuária em cada item (`not_started`, `in_progress`, `completed`).
- **`clube_jornadas`**: (Legado/Transição) Mantida para compatibilidade, mas a lógica da V0.2 prioriza `clube_rota_itens`.

## 3. Lógica de Negócio e Hooks

### `useRotaOracular` (Hook Central)
Localizado em `src/hooks/useRotaOracular.ts`, é o "cérebro" da estrada:
- Resolve a estação ativa e seus itens.
- Calcula o estado de cada ponto (`locked`, `available`, `in_progress`, `completed`).
- Gerencia as mutações `marcarEmAndamento` e `concluirPonto`.
- **Gatilho Cidadela**: Ao concluir 100% dos itens obrigatórios de uma estação, dispara automaticamente o registro no histórico da Cidadela.

### `useTodasRotas`
Localizado em `src/hooks/useTodasRotas.ts`:
- Agrega o catálogo de todas as estações.
- Implementa o **Lock Progressivo**: A estação N só é desbloqueada se a estação N-1 tiver 100% dos itens obrigatórios concluídos (exceto para Administradores).

## 4. Integração Cidadela-Rotas

A integração ocorre de forma assíncrona e desacoplada através do DAL `cidadelaEstado.ts`.

### Contrato de Travessia
Quando uma estação é concluída nas Rotas, um registro é inserido no `historico_travessias` da tabela `user_cidadela_estado`:

```ts
{
  distrito: string; // Título da Estação
  tipo: "estacao_concluida";
  completado_em: string; // ISO Date
  contexto: string; // Chave de idempotência
  metadata: {
    origem: "rotas-da-casa",
    estacao_id: string,
    estacao_numero: number,
    titulo_visual: string
  }
}
```

### Idempotência
Para evitar registros duplicados em disparos repetidos (ex: recarga de página após conclusão), utilizamos o campo `contexto`:
- **Chave**: `rota_estacao_{estacaoId}`
- O DAL `addTravessiaToHistorico` verifica se já existe um registro com este `contexto` antes de inserir.

## 5. Portabilidade e Expansão

- **Independência de IA**: O sistema de Rotas V0.2 não depende de Syntheia ou Atlas para seu funcionamento básico (progresso e desbloqueio).
- **Consistência Textual**: O termo oficial para a jornada é "Rotas da Casa", preservando as URLs sob o prefixo `/clube`.
- **Guardrails Éticos**: O progresso é individual e privado, focado na jornada pedagógica da usuária sem exposição social não autorizada.

## 6. Limites da V0.2

- O mapeamento de competências da Cidadela via Rotas é estrutural (está no código), mas não é preenchido automaticamente nesta versão, focando apenas no registro de "travessia".
- O desbloqueio de estações é estritamente linear.

---
*Documento gerado como parte da Etapa 96 — Maio/2026.*
