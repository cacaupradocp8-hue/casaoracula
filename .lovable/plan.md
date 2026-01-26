

# Plano: Corrigir Flickering na Página de Detalhe do Jardim

## Problema Identificado

A página de detalhe (`/jardim-da-psique/:id`) está piscando porque a função `getRegistro` do hook **não está memorizada com `useCallback`**, causando um loop infinito de requisições.

```text
Render 1 → getRegistro é NOVA função
    ↓
useEffect([id, getRegistro]) dispara
    ↓
fetch inicia → loading = true → re-render
    ↓
Render 2 → getRegistro é NOVA função de novo!
    ↓
useEffect dispara novamente
    ↓
Loop infinito ∞
```

---

## Solução

Duas correções necessárias:

### 1. Memorizar `getRegistro` no Hook

Envolver a função `getRegistro` em `useCallback` com dependências estáveis (`user.id` e `toast`):

```typescript
// useJardimPsique.ts
const getRegistro = useCallback(async (
  registroId: string
): Promise<JardimRegistro | null> => {
  if (!user) return null;
  // ... lógica existente
}, [user?.id]); // Apenas user.id como dependência
```

### 2. Remover `getRegistro` das Dependências do useEffect

Na página de detalhe, usar um padrão mais seguro que não depende da referência da função:

```typescript
// JardimPsiqueDetalhe.tsx
useEffect(() => {
  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    const data = await getRegistro(id);
    // ...
  };
  fetchData();
}, [id]); // Apenas id - getRegistro movido para fora ou estabilizado
```

Alternativa: fazer a query diretamente na página de detalhe em vez de usar o hook genérico.

---

## Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| `src/hooks/useJardimPsique.ts` | Envolver `getRegistro` em `useCallback` |
| `src/pages/JardimPsiqueDetalhe.tsx` | Ajustar dependências do `useEffect` |

---

## Modificações Detalhadas

### Hook: `useJardimPsique.ts`

```typescript
// Antes (linha 291-321)
const getRegistro = async (registroId: string) => { ... };

// Depois
const getRegistro = useCallback(async (
  registroId: string
): Promise<JardimRegistro | null> => {
  if (!user) return null;

  try {
    const { data, error } = await (supabase as any)
      .from('jardim_psique_registros')
      .select('*')
      .eq('id', registroId)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;

    return {
      ...data,
      conteudo: (data.conteudo as Record<string, unknown>) || {},
      resultado_simbolico: data.resultado_simbolico as Record<string, unknown> | null,
      tags: data.tags || [],
      tipo_registro: data.tipo_registro || 'ferramenta',
      titulo: data.titulo || null,
      fonte: data.fonte || null,
      emocao_predominante: data.emocao_predominante || null,
    };
  } catch (error: unknown) {
    console.error('Erro ao buscar registro:', error);
    return null;
  }
}, [user?.id]);
```

### Página: `JardimPsiqueDetalhe.tsx`

```typescript
// Antes (linha 86-96)
useEffect(() => {
  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    const data = await getRegistro(id);
    setRegistro(data);
    setReflexaoEditada(data?.reflexao_pessoal || '');
    setLoading(false);
  };
  fetchData();
}, [id, getRegistro]);

// Depois - getRegistro agora é estável
useEffect(() => {
  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    const data = await getRegistro(id);
    setRegistro(data);
    setReflexaoEditada(data?.reflexao_pessoal || '');
    setLoading(false);
  };
  fetchData();
}, [id, getRegistro]); // Agora funciona porque getRegistro é useCallback
```

---

## Resultado Esperado

1. Página de detalhe carrega **uma única vez**
2. Sem requisições duplicadas
3. Sem flickering/piscando
4. Transição suave da lista para o detalhe

---

## Seção Técnica

### Por Que Isso Acontece

O React compara referências de objetos/funções em arrays de dependência. Quando você escreve:

```typescript
const getRegistro = async () => { ... };  // Nova função a cada render
```

Cada render cria uma **nova instância** da função. O React vê como "diferente" e re-executa o `useEffect`.

### Solução: `useCallback`

```typescript
const getRegistro = useCallback(async () => { ... }, [user?.id]);
```

Agora a função só é recriada quando `user.id` muda (ou seja, quase nunca durante navegação normal).

### Funções que Também Precisariam de useCallback

Para consistência, outras funções do hook também deveriam ser memorizadas:
- `atualizarReflexao`
- `marcarIntegrado`
- `arquivarRegistro`
- `salvarRegistro`

Mas como essas são usadas apenas em handlers de clique (não em dependências de useEffect), o impacto é menor. A prioridade é corrigir `getRegistro`.

