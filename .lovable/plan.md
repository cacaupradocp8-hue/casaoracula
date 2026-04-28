## Problema

Na página `/admin/clube/central/...` (e em todo `/admin/*`), ao abrir abas de edição (Rota/Passos, Iniciação, Lab IA, etc.), **o conteúdo não rola** — partes do formulário ficam cortadas e inacessíveis.

## Causa raiz

Em `src/pages/Admin.tsx` (linha 213–216) o layout do admin está montado assim:

```text
<AppLayout>                      ← já tem scroll natural da página
  <div class="flex min-h-[calc(100vh-5rem)]">
    <AdminSidebar />
    <div class="flex-1 min-w-0 overflow-auto">   ← cria um 2º scroll interno
      ...conteúdo das abas...
    </div>
  </div>
</AppLayout>
```

Dois problemas combinados:

1. O wrapper interno tem `overflow-auto` **sem altura fixa**. Como o pai usa `min-h-[calc(100vh-5rem)]` (mínimo, não máximo), o div cresce junto com o conteúdo e o `overflow-auto` nunca dispara — mas o `<main>` do `AppLayout` tem `pb-24` no mobile (bottom nav) que esconde o final.
2. Em viewports menores (como o atual 939×531) o `min-h-[calc(100vh-5rem)]` força o container a ocupar quase toda a tela, e o conteúdo extra das abas longas (AplicacaoTab, PassosRotaTab, EntradaTab) fica abaixo da bottom nav fixa, sem possibilidade de rolagem porque a página tenta rolar mas o `overflow-auto` interno intercepta.

## Correção

Editar **apenas** `src/pages/Admin.tsx`:

- Trocar `min-h-[calc(100vh-5rem)]` por algo que **não** force altura mínima (`flex` simples), e **remover** `overflow-auto` do wrapper de conteúdo. Deixar a rolagem natural da página (a do `<body>`/`<main>`) cuidar de tudo.
- Aumentar o `pb` do container interno para garantir respiro acima da bottom nav mobile (`pb-32`).

Resultado: uma única barra de rolagem (a da página), conteúdo sempre acessível em qualquer altura de tela, sidebar permanece à esquerda.

## Bônus (opcional, mesmo arquivo)

Tornar a `AdminSidebar` `sticky top-20` para que ela acompanhe a rolagem em telas grandes sem precisar de scroll interno.

## Arquivos alterados

- `src/pages/Admin.tsx` — ajuste do wrapper de layout (3–4 linhas)

Nada mais é tocado. As abas (`PassosRotaTab`, `AplicacaoTab`, `EntradaTab`, `EncontroTab`, `EstradaTab`, `SemanasTab`) continuam idênticas.