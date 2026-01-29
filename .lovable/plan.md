
# Plano: Criar o Oráculo dos Reinos

## Resumo
Criar um novo oráculo completo chamado "Oráculo dos Reinos" com base no PDF enviado, incluindo o deck, categorias por Reino/Tema, e todas as cartas de perguntas reflexivas.

---

## Estrutura do Oráculo (extraída do PDF)

### Reinos e Temas identificados:

| Reino | Temas | Quantidade de Cartas |
|-------|-------|---------------------|
| **Água** | Emoções e Memória, Relações e Emoções | ~21 cartas |
| **Terra** | Corpo, Sombra e Confronto, Sombra e Raízes | ~21 cartas |
| **Fogo** | Potência, Verdade e Nascimento do Eu | ~5+ cartas (documento cortado em 50 páginas) |
| **Ar** | (provável, não visível no preview) | ~20 cartas (estimado) |

**Total estimado: ~60-80 cartas**

---

## Etapas de Implementação

### Etapa 1: Criar o Deck Principal
Inserir um novo registro na tabela `oracle_decks`:

- **nome:** Oráculo dos Reinos
- **slug:** oraculo-dos-reinos
- **subtítulo:** Perguntas dos Quatro Elementos
- **tema:** Cores elementais (azul água, marrom terra, vermelho fogo, branco ar)
- **portal_minimo:** pre_iniciada (configurável)
- **status:** draft (para revisão antes de publicar)

### Etapa 2: Criar Categorias por Reino
Inserir 4 categorias na tabela `oracle_categories`:

1. **Reino da Água** - Emoções e Memória
2. **Reino da Terra** - Corpo, Sombra e Raízes
3. **Reino do Fogo** - Potência e Verdade
4. **Reino do Ar** - (a confirmar com documento completo)

### Etapa 3: Cadastrar Todas as Cartas
Inserir cada pergunta como uma carta na tabela `oracle_cards`:

**Campos por carta:**
- `title`: Primeira palavra-chave da pergunta
- `short_message`: A pergunta reflexiva completa
- `category_id`: Vinculado ao Reino correspondente
- `keywords_json`: Palavras-chave extraídas do tema
- `reflection_questions_json`: A mesma pergunta como questão reflexiva
- `status`: published
- `ordem`: Sequência dentro do Reino

**Exemplo de carta:**
```text
Reino: Água | Tema: Emoções e Memória
Pergunta: "Que amor em mim ainda tem medo de ser recebido?"
Keywords: [amor, medo, receber, emoções, memória]
```

### Etapa 4: Criar Tiragens Padrão
Inserir spreads sugeridos na tabela `oracle_spreads`:

1. **Tiragem do Elemento** - 1 carta de cada Reino (4 cartas)
2. **Tiragem Reflexiva** - 3 cartas aleatórias
3. **Tiragem do Reino** - 5 cartas de um único Reino escolhido

---

## Detalhes Técnicos

### Operações no Banco de Dados

```text
1. INSERT INTO oracle_decks (1 registro)
2. INSERT INTO oracle_categories (4 registros)
3. INSERT INTO oracle_cards (60-80 registros em lotes)
4. INSERT INTO oracle_spreads (3 registros)
```

### Processamento das Cartas do PDF
Extrair de cada página:
- Reino (REINO DA ÁGUA, TERRA, FOGO, AR)
- Tema (subtítulo após o Reino)
- Pergunta (texto da carta)

### Tratamento de Imagens
O PDF contém imagens de cada carta. Opções:
- Usar as imagens extraídas do PDF como `main_image_url`
- Deixar vazio para geração posterior via IA
- O documento tem imagens em `parsed-documents://...` que podem ser copiadas

---

## Observações

1. **Documento incompleto**: O PDF foi processado até a página 50. Se existirem mais cartas (Reino do Ar, por exemplo), será necessário reprocessar ou adicionar manualmente.

2. **Configuração de acesso**: O oráculo será criado como `draft` para revisão antes de publicar.

3. **Imagens das cartas**: Podemos copiar as imagens extraídas do PDF para o storage do projeto e associá-las às cartas.

4. **Alinhamento com sistema existente**: O oráculo seguirá exatamente a estrutura já existente (oracle_decks, oracle_cards, etc.), garantindo compatibilidade total com as páginas de Oráculos já implementadas.
