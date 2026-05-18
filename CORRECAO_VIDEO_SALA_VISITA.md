# CORREÇÃO: Vídeo de Boas-Vindas da Sala de Visita

## Causa Encontrada
O vídeo de boas-vindas não estava sendo exibido para visitantes anônimas porque o valor da configuração `sala_visita_video_url` no banco de dados continha aspas duplas literais (ex: `"\"2f649...\""` em vez de `"2f649..."`). 

Isso provavelmente ocorreu devido a uma atualização via painel administrativo que salvou o valor como uma string JSON. O componente de extração de ID do Cloudflare (`extractVideoId`) é rigoroso e não reconhecia o ID quando envolto em aspas, resultando em um ID nulo e na não renderização do player.

Além disso, outras configurações também apresentavam esse problema de aspas extras, o que poderia afetar textos e links em todo o app para usuários não logados.

## Arquivos Alterados
1.  **Banco de Dados (`app_settings`)**: Atualizado o valor de `sala_visita_video_url` para remover aspas extras.
2.  **`src/hooks/useAppSettings.ts`**: Implementada uma correção global que detecta e remove aspas extras de qualquer configuração carregada, garantindo robustez para todas as chaves do sistema.
3.  **`src/hooks/useCloudflareVideo.ts`**: Refatorada a função `extractVideoId` para limpar espaços e aspas do input antes de tentar identificar o ID do vídeo.

## Correção Aplicada
- Limpeza manual da chave crítica no banco de dados.
- Tratamento preventivo no hook de configurações (`useAppSettings`) para tratar valores vindos com aspas do banco.
- Tratamento preventivo no hook de vídeo (`useCloudflareVideo`) para aceitar IDs mesmo que contenham caracteres extras de formatação acidentais.

## Testes Realizados

### Teste como Visitante Anônima
- **Ação**: Acessar `/sala-da-visitante` sem login.
- **Resultado**: O hook `useAppSettings` carrega a URL correta, o `extractVideoId` identifica o ID `2f649a79ebaaae5f6f7f0dc4d11ef1a0`, e o `CloudflareStreamPlayer` solicita o token com sucesso. O vídeo aparece e carrega normalmente.
- **Evidência**: Logs de rede mostram chamada bem-sucedida para a Edge Function `cloudflare-video-token` com nível `visitante` e carregamento dos fragmentos de vídeo via `videodelivery.net`.

### Teste como Visitante Logada
- **Ação**: Acessar a mesma página com uma conta de teste.
- **Resultado**: O fluxo permanece idêntico e funcional. O player detecta o nível de acesso da usuária, mas como o requisito mínimo é `visitante`, o acesso é concedido sem restrições.

---
**Status: Restaurado e Protegido**
O vídeo agora está visível para todas, e o sistema está mais resiliente contra erros de salvamento de dados no Admin.
