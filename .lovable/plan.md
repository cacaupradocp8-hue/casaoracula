## Diagnóstico

A "tela branca" no preview ao vivo **não é um crash** — é um problema de **contraste/opacidade extrema** introduzido na última passada de "Premium Look".

Evidências:
- Naveguei até `/clube` e capturei screenshot: a página renderiza, mas tudo aparece em tons quase invisíveis sobre o fundo escuro (texto, cards e botões em opacidades 10–40%).
- Console não mostra nenhum erro fatal (apenas warnings de `forwardRef` e `postMessage` cross-origin, que são ruído do iframe Lovable e não bloqueiam render).
- Build do dev server ok, sem exceções.

Em `src/components/clube-livro/ClubeHomePage.tsx` (e arquivos irmãos do Clube), o refatoramento aplicou:
- `text-muted-foreground/40` e `/30` em textos primários
- `bg-card/10`, `bg-card/20`, `bg-card/30` em cartões importantes
- `border-border/10`, `border-primary/10` em separadores
- `text-foreground/30` em rótulos de ação

Resultado: sobre o fundo `#0a0d14`, esses elementos viram quase invisíveis em monitores não-OLED → percepção de "tela em branco".

Isso conflita com a regra de memória registrada:
> *Legibility Standards — Drop shadows, overlays, contraste mínimo*

## O que será corrigido

1. **`src/components/clube-livro/ClubeHomePage.tsx`**
   - Texto secundário: `/40` e `/30` → `/70`
   - Cards: `bg-card/10..30` → `bg-card/60` com `backdrop-blur-sm`
   - Bordas: `/10..15` → `/30`
   - Itens de lista (rotas) com contraste mínimo legível

2. **Varredura nas demais páginas do Clube** (`src/pages/clube/*.tsx` e `src/components/clube-livro/*`, `src/components/clube-oracular/*`):
   - Aplicar o mesmo aumento de contraste mínimo onde houver `/10`–`/40` em textos/superfícies primárias
   - Manter opacidades baixas APENAS em decoração (linhas finas, ornamentos, ícones secundários)

3. **Validação visual**
   - Após edits, navegar `/clube`, `/clube/rotas`, `/clube/laboratorio` e screenshot para confirmar que tudo está legível em viewport claro e escuro.

4. **Salvar nova memória** `mem://style/legibility-and-contrast-standards-v3`:
   - Texto primário nunca abaixo de `/80`
   - Texto secundário nunca abaixo de `/60`
   - Superfícies de card nunca abaixo de `bg-card/50`
   - Opacidades `<40%` reservadas a ornamentos puramente decorativos

## Não será mexido

- Lógica de roteamento, autenticação, RLS ou hooks.
- Estética escura premium — apenas calibração de contraste.
- Outras seções fora do Clube (a menos que você confirme tela branca lá também).

## Pergunta antes de executar

Você confirmou que a tela branca é no `/clube`. Posso aplicar as correções em **toda a área do Clube de Leitura** (Home, Rotas, Laboratório, Encontro, Acervo, Forja, Chat Livro, Câmara do Sussurro)? Ou prefere começar só pela `ClubeHome` e validar antes de propagar?