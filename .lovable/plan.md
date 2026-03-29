

# Plano: Migrar todas as Edge Functions para OpenAI GPT API

## Resumo

Migrar as 16 edge functions que usam o Lovable AI Gateway para a API OpenAI diretamente, usando a `OPENAI_API_KEY` já configurada. As 2 funções que já usam OpenAI (`syntheia-chat`, `cartografia-leitura-profunda`) permanecem inalteradas.

## Funções a migrar (16)

| # | Função | Modelo atual |
|---|--------|-------------|
| 1 | ai-chat | gemini |
| 2 | bussola-cartografa | gemini |
| 3 | bussola-onirica | gemini |
| 4 | estudio-gerar-estrutura | gemini |
| 5 | estudio-gerar-infografico | gemini |
| 6 | ethical-review-content | gemini |
| 7 | generate-clinical-narrative | gemini |
| 8 | generate-journey-narrative | gemini |
| 9 | generate-labirinto-image | gemini (imagem) |
| 10 | generate-labirinto-roteiro | gemini |
| 11 | generate-oracle-image | gemini (imagem) |
| 12 | generate-portal-content | gemini |
| 13 | gerar-semana-clube | gemini |
| 14 | labirinto-leitura | gemini |
| 15 | mapa-vivo-insights | gemini |
| 16 | revise-portal-content | gemini |
| 17 | studio-generate-episode | gemini |
| 18 | syntheia-generate | gemini |

## Alteração padrão em cada função

Em cada arquivo `index.ts`:

1. **Trocar a chave**: `LOVABLE_API_KEY` → `OPENAI_API_KEY`
2. **Trocar a URL**: `https://ai.gateway.lovable.dev/v1/chat/completions` → `https://api.openai.com/v1/chat/completions`
3. **Trocar o modelo**: `google/gemini-*` → `gpt-4o` (texto) ou `gpt-image-1` (imagem)
4. **Mensagens de erro**: atualizar referências

## Modelo OpenAI por tipo de tarefa

| Tipo | Modelo |
|------|--------|
| Texto (chat, análise, geração) | `gpt-4o` |
| Geração de imagem | `gpt-image-1` via `/v1/images/generations` |

## Caso especial: Geração de imagens

As funções `generate-oracle-image` e `generate-labirinto-image` usam geração de imagem. Serão migradas para usar a API de imagens da OpenAI (`/v1/images/generations`) com o modelo DALL-E 3.

## Redeploy

Após editar cada função, redeploy automático.

## Detalhes Técnicos

- A `OPENAI_API_KEY` já está configurada como secret — nenhuma ação do usuário necessária
- O formato de request/response da OpenAI é compatível (mesmo schema de `messages`, `choices`, etc.)
- Funções que usam streaming (`ai-chat`) continuarão com streaming via OpenAI

