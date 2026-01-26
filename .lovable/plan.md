

# Plano: Corrigir Flickering do Jardim da Psique + Criar Diário de Bordo para Aulas

## Problema 1: Jardim da Psique Piscando (Flickering)

### Diagnóstico

O console mostra dezenas de erros `"TypeError: Failed to fetch"` repetidos em loop. A causa raiz é uma **referência de objeto instável** no hook:

```typescript
// JardimPsique.tsx linha 83-86
const { registros, loading, getFerramentasUsadas } = useJardimPsique({
  arquivado: viewArquivados,
  busca: busca || undefined,  // <-- novo objeto a cada render!
});
```

O objeto `filtros` é recriado a cada render, causando:
1. `useCallback` recria `fetchRegistros` (porque `filtros` mudou)
2. `useEffect` dispara `fetchRegistros`
3. Componente re-renderiza
4. Ciclo infinito de requisições

### Solução

1. **Memorizar os filtros** no componente `JardimPsique.tsx` usando `useMemo`
2. **Desestruturar os filtros** no hook `useJardimPsique.ts` para evitar dependência do objeto inteiro
3. **Adicionar `staleTime`** usando TanStack Query (padrão já usado em outros hooks do projeto)

---

## Problema 2: Diário de Bordo nas Aulas

### O que a Usuária Quer

Um espaço **dentro de cada aula/travessia** para que a aluna possa:
- Fazer anotações pessoais enquanto assiste/lê
- Registrar insights e reflexões
- Ter um histórico do que anotou em cada lição

Isso é diferente do Jardim da Psique global - é um **diário contextualizado por aula**.

### Solução Proposta

Criar um novo componente `DiarioBordoAula` que:
1. Aparece colapsado por padrão no final da aula
2. Permite escrever/editar notas
3. Salva automaticamente (auto-save com debounce)
4. Mostra histórico de entradas anteriores daquela aula

---

## Arquivos a Modificar/Criar

| Arquivo | Ação |
|---------|------|
| `src/hooks/useJardimPsique.ts` | Refatorar para evitar loop infinito |
| `src/pages/JardimPsique.tsx` | Memorizar filtros com useMemo |
| `src/components/shared/DiarioBordoAula.tsx` | **CRIAR** - componente de diário para aulas |
| `src/pages/AulaPage.tsx` | Adicionar DiarioBordoAula |
| `src/components/courses/LessonContent.tsx` | Adicionar DiarioBordoAula |
| Migration SQL | Criar tabela `diario_bordo_aulas` |

---

## Parte 1: Corrigir Flickering

### Refatoração do Hook

O hook será refatorado para:
1. Receber parâmetros primitivos em vez de objeto
2. Usar `JSON.stringify` para estabilizar a dependência
3. Adicionar um flag `enabled` para evitar fetch desnecessário

```typescript
export function useJardimPsique(filtros?: FiltrosJardim) {
  // Serializar filtros para dependência estável
  const filtrosKey = JSON.stringify(filtros ?? {});
  
  const fetchRegistros = useCallback(async () => {
    // ... lógica existente
  }, [user?.id, filtrosKey]); // Dependência estável
  
  useEffect(() => {
    fetchRegistros();
  }, [fetchRegistros]);
}
```

### Memorização na Página

```typescript
// JardimPsique.tsx
const filtros = useMemo(() => ({
  arquivado: viewArquivados,
  busca: busca || undefined,
}), [viewArquivados, busca]);

const { registros, loading } = useJardimPsique(filtros);
```

---

## Parte 2: Diário de Bordo para Aulas

### Nova Tabela: `diario_bordo_aulas`

```sql
CREATE TABLE public.diario_bordo_aulas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  aula_id UUID NOT NULL,
  conteudo TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: Apenas o próprio usuário pode ver/editar suas notas
ALTER TABLE public.diario_bordo_aulas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own notes"
  ON public.diario_bordo_aulas
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Índice para busca rápida
CREATE INDEX idx_diario_bordo_user_aula 
  ON public.diario_bordo_aulas(user_id, aula_id);
```

### Novo Componente: DiarioBordoAula

Um componente compacto que:
- Mostra um accordion/collapsible com ícone de caderno
- Textarea para escrita livre
- Auto-save após 2 segundos de inatividade
- Indicador visual de "salvando..." / "salvo"
- Badge mostrando data da última edição

```text
┌─────────────────────────────────────────────────────────┐
│ 📓 Diário de Bordo                          [▼ Abrir]   │
└─────────────────────────────────────────────────────────┘

Quando expandido:

┌─────────────────────────────────────────────────────────┐
│ 📓 Diário de Bordo                          [▲ Fechar]  │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Minhas anotações sobre esta aula...                 │ │
│ │                                                     │ │
│ │ - Insight sobre o tema X                            │ │
│ │ - Lembrar de aplicar Y                              │ │
│ │                                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│                              ✓ Salvo · Editado há 2min  │
└─────────────────────────────────────────────────────────┘
```

### Integração nas Páginas de Aula

Adicionar após o conteúdo principal e antes do botão "Marcar como concluída":

```tsx
{/* AulaPage.tsx - após Materials, antes de Mark as Complete */}
<DiarioBordoAula aulaId={aula.id} />
```

```tsx
{/* LessonContent.tsx - após conteúdo, antes de navegação */}
<DiarioBordoAula aulaId={lesson.id} />
```

---

## Resultado Esperado

1. **Jardim da Psique** para de piscar e carrega normalmente
2. **Cada aula** tem seu próprio espaço de anotações pessoais
3. **Auto-save** evita perda de conteúdo
4. **100% privado** - protegido por RLS (só o próprio usuário vê)
5. **Leve** - não afeta performance das aulas

---

## Seção Técnica

### Por Que o Flickering Acontece

```text
Render 1: filtros = { arquivado: false, busca: undefined }
          ↓
useCallback recria fetchRegistros (filtros é nova referência)
          ↓
useEffect dispara fetchRegistros
          ↓
fetch inicia → componente re-renderiza enquanto loading
          ↓
Render 2: filtros = { arquivado: false, busca: undefined } (NOVA referência!)
          ↓
useCallback recria fetchRegistros novamente
          ↓
useEffect dispara novamente
          ↓
Loop infinito → "Failed to fetch" (rate limit ou cancelamento)
```

### Solução com JSON.stringify

```typescript
const filtrosKey = JSON.stringify(filtros ?? {});

// Agora filtrosKey é uma STRING estável:
// '{"arquivado":false}' === '{"arquivado":false}' ✓
```

### Hook para Diário de Bordo

```typescript
function useDiarioBordo(aulaId: string) {
  const [conteudo, setConteudo] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Carregar nota existente
  useEffect(() => {
    if (!aulaId || !user) return;
    // fetch do banco...
  }, [aulaId, user]);
  
  // Auto-save com debounce
  const debouncedSave = useMemo(
    () => debounce(async (text: string) => {
      setSaving(true);
      await supabase.from('diario_bordo_aulas').upsert({...});
      setLastSaved(new Date());
      setSaving(false);
    }, 2000),
    [aulaId, user]
  );
  
  return { conteudo, setConteudo, saving, lastSaved };
}
```

