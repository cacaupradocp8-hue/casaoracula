
# Plano: Vitrine de Ferramentas para Visitantes

## Objetivo

Criar uma **página separada** (`/ferramentas-vitrine`) que exibe todas as ferramentas da Casa em estado **bloqueado**, sem alterar a proteção da rota principal `/ferramentas`. Isso permite que visitantes conheçam a riqueza do método antes de entrar.

---

## Abordagem

| Elemento | Decisão |
|----------|---------|
| Rota protegida `/ferramentas` | ✅ Mantida intacta |
| Nova rota `/ferramentas-vitrine` | ✅ Aberta para visitantes |
| Estado das ferramentas na vitrine | 🔒 Sempre bloqueado |
| CTA | Direcionar para Travessia Zero |

---

## Arquitetura da Solução

```text
/ferramentas-vitrine (NOVA)
├── Acessível para visitantes autenticados
├── Busca TODAS as ferramentas ativas do banco
├── Exibe com FerramentaCard em modo bloqueado
├── Banner explicativo no topo
└── CTA para iniciar travessia

/ferramentas (EXISTENTE)
├── Protegido com minPortal="mentorada"
├── Sem alterações
└── Lógica de acesso normal
```

---

## Alterações Técnicas

### 1. Criar Nova Página `FerramentasVitrine`

**Arquivo:** `src/pages/FerramentasVitrine.tsx`

Conteúdo:
- Reutilizar a estrutura visual do `FerramentasHub`
- Buscar ferramentas ativas do banco (mesma query)
- **Forçar `acessivel: false`** para todas as ferramentas
- Não permitir navegação ao clicar nos cards
- Exibir ícone real com cadeado sobreposto

---

### 2. Adicionar Banner de Vitrine

No topo da página, exibir:

```text
┌─────────────────────────────────────────────────────────┐
│ 🔐 Vitrine de Ferramentas                               │
│                                                         │
│ Estes são os recursos disponíveis para quem atravessa   │
│ a formação. Para utilizá-los, inicie sua jornada na     │
│ Sala da Visitante.                                      │
│                                                         │
│ [Iniciar Travessia]                                     │
└─────────────────────────────────────────────────────────┘
```

---

### 3. Modificar FerramentaCard para Modo Vitrine

**Arquivo:** `src/components/shared/FerramentaCard.tsx`

Adicionar prop opcional `vitrineMode`:

```text
interface FerramentaCardProps {
  ferramenta: FerramentaCardData;
  onClick: () => void;
  colorScheme?: 'gold' | 'purple' | 'emerald' | 'rose';
  vitrineMode?: boolean;  // NOVO
}
```

Quando `vitrineMode = true`:
- Exibir o ícone original (não substituir por cadeado)
- Adicionar cadeado pequeno no canto do ícone
- Manter descrição da finalidade visível (não mensagem de bloqueio)
- Remover botão "Abrir"
- Cursor `cursor-default` (não `cursor-not-allowed`)

---

### 4. Registrar Rota no App.tsx

**Arquivo:** `src/App.tsx`

```text
<Route
  path="/ferramentas-vitrine"
  element={
    <ProtectedRoute minPortal="visitante">
      <FerramentasVitrine />
    </ProtectedRoute>
  }
/>
```

---

### 5. Adicionar Link no Menu para Visitantes

**Onde:** Na navegação lateral ou no Tour, adicionar link para `/ferramentas-vitrine` visível para visitantes.

Possíveis locais:
- `Navigation.tsx` — item condicional para visitantes
- `Tour.tsx` — botão "Ver todas as ferramentas"
- `VisitorHomePage.tsx` — card com CTA

---

## Resultado Esperado

| Perfil | Acesso `/ferramentas` | Acesso `/ferramentas-vitrine` |
|--------|----------------------|------------------------------|
| visitante | ❌ Bloqueado | ✅ Todas bloqueadas (vitrine) |
| aluna | ❌ Bloqueado | ✅ Todas bloqueadas (vitrine) |
| mentorada+ | ✅ Normal | ✅ Pode ver vitrine também |
| admin | ✅ Total | ✅ Pode ver vitrine |

---

## Fluxo do Visitante

1. Visitante acessa `/ferramentas-vitrine`
2. Vê todas as ferramentas organizadas por seção
3. Cada card mostra:
   - Ícone original + cadeado pequeno
   - Nome da ferramenta
   - Finalidade/descrição
   - Badge de tipo (quando houver)
4. Banner no topo explica contexto
5. CTA leva para Travessia Zero ou Sala da Visitante

---

## Benefícios

- ✅ Rota protegida permanece intacta
- ✅ Visitantes conhecem a amplitude do método
- ✅ Cards mantêm identidade visual (não apenas cadeados)
- ✅ Nenhuma promessa falsa — tudo claramente bloqueado
- ✅ Incentivo claro para iniciar a travessia
- ✅ Reutiliza componentes existentes

---

## Ordem de Implementação

1. Adicionar prop `vitrineMode` ao `FerramentaCard`
2. Criar página `FerramentasVitrine.tsx`
3. Registrar rota em `App.tsx`
4. Adicionar link na navegação para visitantes
