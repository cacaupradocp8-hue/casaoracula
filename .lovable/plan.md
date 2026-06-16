# Mensagem amigável quando o vídeo está indisponível

## Problema confirmado
Na `/sala-da-visitante`, o `cloudflare-video-token` responde 200, mas o manifest `videodelivery.net/.../video.m3u8` retorna **404** (vídeo não existe mais na conta Cloudflare). Hoje o `CloudflareStreamPlayer` trata isso como `NETWORK_ERROR` e fica em loop infinito de `hls.startLoad()` — o usuário vê apenas o spinner.

## Solução (1 arquivo)

**`src/components/video/CloudflareStreamPlayer.tsx`**

1. Adicionar `retryCountRef` para limitar tentativas de recuperação de `NETWORK_ERROR` a **1 retry**. Após isso, marcar como erro fatal.
2. Detectar especificamente `data.response?.code === 404` no handler de erro do HLS e exibir mensagem "Vídeo indisponível no momento".
3. Customizar a tela de erro existente (linhas 267-280) para mostrar duas mensagens distintas:
   - **Indisponível (404)**: "Este vídeo está temporariamente indisponível." — sem botão "Tentar novamente" (não vai ajudar).
   - **Outros erros**: mensagem atual + botão de retry.

## Comportamento resultante

- Visitante na `/sala-da-visitante` vê um card discreto: ícone + "Este vídeo está temporariamente indisponível", em vez do spinner travado.
- Resto da página (boas-vindas, CTA "Iniciar Primeira Leitura") continua funcionando normalmente.
- Quando você subir um novo vídeo no Cloudflare e atualizar o ID no admin, volta a funcionar sem nenhuma mudança de código.

## Fora do escopo
- Não vou trocar o ID do vídeo no banco (você fará isso no admin quando tiver o novo).
- Não vou esconder a seção de vídeo — o fallback amigável é melhor que sumir silenciosamente.
