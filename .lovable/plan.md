# Ajustes do Clube Oracular — refinamento de UX

Foco: deixar a rota mais compacta no desktop, organizar a home do clube com boas-vindas + Cidadela + retomada, agrupar áudios da estação e expor a Voz Dominante como identidade. Sem novas features complexas — só ajuste do que já existe.

---

## 1. Página da Rota — versão compacta (desktop)
Arquivo: `src/pages/clube/ClubeRotaPremium.tsx`

Hoje cada bloco "respira" muito (hero 100svh, espaçamentos `space-y-48`, paddings gigantes), o que faz o conteúdo parecer "pesado" no desktop. Ajustes:

- **Hero (linha 137)**: trocar `min-h-[100svh]` por algo proporcional — `min-h-[70svh] md:min-h-[75vh]` no desktop, `min-h-[80svh]` no mobile. Reduzir `space-y` interno de `sm:space-y-10` para `sm:space-y-6`.
- **Tipografia do título (linha 200)**: `clamp(2.5rem, 12vw, 8rem)` → `clamp(2.25rem, 7vw, 5.5rem)`. Mantém presença, evita ocupar a tela inteira.
- **Container principal (linha 267)**: `space-y-24 sm:space-y-32 md:space-y-48` → `space-y-16 md:space-y-24`. Padding vertical `pt-10 sm:pt-20 pb-24 sm:pb-48` → `pt-8 md:pt-12 pb-16 md:pb-24`.
- **Section helper (linha 757)**: margem do header `mb-6 sm:mb-8 md:mb-10` → `mb-4 md:mb-6`.
- **Bloco Laboratório 80/20 (linha 510)**: paddings `p-6 sm:p-8 md:p-14` → `p-6 md:p-10`; título `text-5xl` → `text-3xl md:text-4xl`.
- **CTA Formação (linha 621)** e **Próxima Rota (linha 677)**: `p-6 sm:p-8 md:p-14` → `p-6 md:p-8`; títulos `md:text-5xl` → `md:text-4xl`.
- **Indicador de scroll (linha 253)**: ocultar em `md+` (`hidden md:hidden`? não — `md:hidden` mantém só em mobile).
- **Coluna timeline (linha 302)**: reduzir `py-5` dos itens para `py-3 md:py-4`.

Resultado: no desktop, com um único scroll já se vê hero + mapa vivo, e os blocos seguintes ocupam ~70% da viewport em vez de 100%.

---

## 3 + 4. Home do Clube — Boas-vindas, Cidadela e Continuar
Arquivo: `src/pages/clube/ClubeRotasCatalogo.tsx`

Adicionar **uma seção de boas-vindas no topo do hero existente** com 3 blocos lado a lado (stack em mobile):

```text
┌─────────────────────────────────────────────────────────────┐
│  Bem-vinda ao Clube Oracular                                │
│  Este espaço não é sobre acumular conteúdo. É sobre         │
│  atravessar experiências.                                   │
│                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
│  │ 🧭 Cidadela  │ │ ▶ Continuar  │ │ ✨ Iniciar   │         │
│  │ (status ou   │ │ (rota em     │ │ (próxima     │         │
│  │  CTA criar)  │ │  curso)      │ │  rota)       │         │
│  └──────────────┘ └──────────────┘ └──────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### 3a. Bloco Cidadela (lógica condicional)
- Buscar via `useCartografiaProfile` (ou hook equivalente já existente — verificar `src/hooks/useCartografiaProfile.ts`) se a aluna tem mapa.
- **Sem mapa**: card com título "Toda jornada começa pela sua cartografia interna." + botão `Criar minha Cidadela` → navega para `/ferramenta/cartografia-psiquica-oracula`.
- **Com mapa**: card com status "Mapa criado" + botão `Acessar minha Cidadela` → navega para `/cidadela/revelacao`. Mini-preview opcional usando `MiniMapaCidadela` em versão reduzida (sem texto de descrição).

### 3b. Bloco "Continuar de onde parei"
- Pegar primeira estação com `status === 'in_progress'` da lista `estacoes` (já carregada). Se houver, CTA navega para `/clube/rota/{primeiro_slug}`. Se não houver, esconde o bloco ou mostra "Iniciar minha jornada" apontando para a primeira estação `available`.

### 3c. Bloco "Iniciar minha jornada"
- Sempre visível: aponta para a primeira estação não-locked.

A seção fica antes dos filtros existentes. Os filtros e o grid de estações continuam intocados (preserva descoberta).

---

## 5 + 6. Estação do Livro — Bloco único de áudios
Arquivo: `src/pages/clube/ClubeRotaPremium.tsx` (linhas 382–418)

A seção de áudios já existe, mas o player é só "abre em nova aba". Ajustes:

- Renomear título da Section para **"Áudios da Estação"** (kicker mantém "Escutas de poder").
- Trocar o `<button onClick={window.open}>` pelo componente `AudioOracular` (`src/components/audio/AudioOracular`, já usado em `AudioBlock` e `PortaAudioPlayer`) — player funcional inline com controle real.
- Layout em lista vertical: cada item mostra título do áudio + player abaixo. Mantém `audio.tipo` como subtítulo.
- Demais módulos da estação (carta, reflexão, pergunta, prática) continuam nos blocos existentes (Mapa Vivo, Chat Livro, Jardim, Treinamento) — sem alteração.

---

## 7. Tag "Voz Dominante" no perfil + topo da home
Hook: `src/hooks/useUserVoz.ts` (já existe, expõe `voz_primaria`).
Mapeamento simbólico: `src/utils/vozMapping.ts` (verificar nomes).

### 7a. Componente novo: `<VozTag />`
`src/components/voz/VozTag.tsx` — pill compacta:
```text
[ ✦ Voz: Guardiã ]
```
Visual: borda gold/30, fundo gold/5, ícone Sparkles, tracking widget. Se `voz_primaria` estiver vazia, esconde.

### 7b. Onde aparecer
- **Perfil da aluna** (`src/pages/casa-maquinas/PerfilProfissionalPage.tsx` — já lê voz; só garantir que a tag aparece visualmente destacada no topo do header do perfil).
- **Home do Clube** (`ClubeRotasCatalogo.tsx`): inserir a tag no canto superior direito do hero existente, ao lado do kicker "Mapa das travessias".

---

## 8. Regra de experiência (já em vigor; só validar)
- Onboarding = mapa + progresso → já é gerenciado por `useJourneyGuard`.
- Estação = conteúdo + prática → garantido pela rota `/clube/rota/:slug`.
- Cidadela = base da jornada → reforçado pelo bloco novo na home.

Sem mudanças de roteamento. Apenas garantir que o CTA "Criar minha Cidadela" da home aponta para `/ferramenta/cartografia-psiquica-oracula` e o "Acessar minha Cidadela" para `/cidadela/revelacao` (ambos já existentes).

---

## Resumo de arquivos tocados
- `src/pages/clube/ClubeRotaPremium.tsx` — compactação visual + áudios com player inline.
- `src/pages/clube/ClubeRotasCatalogo.tsx` — boas-vindas + bloco Cidadela + continuar + tag voz.
- `src/components/voz/VozTag.tsx` — novo, pill da Voz Dominante.
- `src/pages/casa-maquinas/PerfilProfissionalPage.tsx` — exibir `<VozTag />` em destaque.

Sem migrações de banco, sem novas rotas, sem novos hooks.

Posso prosseguir com a implementação?