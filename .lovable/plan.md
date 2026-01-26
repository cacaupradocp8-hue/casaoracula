

# Plano: Corrigir Áudio que Não Toca na Travessia Zero

## Problema Identificado

A **Aula "Dia 1 — O Silêncio"** (id: `27cd2622-5b42-4175-a1d2-0fec81cab961`) tem o campo `audio_url` com valor inválido:

| Campo | Valor Atual | Problema |
|-------|-------------|----------|
| audio_url | ` 1769387803653.ogg` | Começa com espaço, não tem URL base |

As demais aulas (Dia 2 a 8) já possuem URLs completas e funcionam corretamente.

---

## Causa Raiz

1. O SQL de correção anterior usou o padrão `✓ Arquivo carregado:%`, que não capturou o Dia 1
2. O Dia 1 foi salvo com um formato diferente: apenas o nome do arquivo com um espaço inicial
3. O código em `AulaPage.tsx` passa o `audio_url` diretamente para `<source src="">` sem normalizar

---

## Solução em Duas Partes

### Parte 1: Correção de Dados (SQL Migration)

Corrigir o registro do Dia 1 e qualquer outro que tenha apenas nome de arquivo:

```sql
UPDATE conteudo_aulas
SET audio_url = 
  'https://pvjiznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/audios/uploads/' 
  || TRIM(audio_url)
WHERE audio_url IS NOT NULL 
  AND audio_url NOT LIKE 'http%'
  AND TRIM(audio_url) != '';
```

Isso converte qualquer valor que:
- Não seja nulo
- Não comece com `http`
- Não seja apenas espaços em branco

### Parte 2: Normalização no Código

Adicionar uma função helper em `AulaPage.tsx` para garantir que URLs incompletas sejam normalizadas antes de renderizar:

```typescript
const getAudioUrl = (url: string | null) => {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  
  // Se já é URL completa, retorna como está
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  
  // Constrói URL completa do storage
  return `https://pvjiznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/audios/uploads/${trimmed}`;
};
```

E usar no render:

```tsx
{aula.audio_url && getAudioUrl(aula.audio_url) && (
  <Card className="mb-8">
    {/* ... */}
    <audio controls className="w-full">
      <source src={getAudioUrl(aula.audio_url)!} />
    </audio>
  </Card>
)}
```

---

## Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| Migration SQL | Atualizar registros existentes |
| `src/pages/AulaPage.tsx` | Adicionar helper `getAudioUrl` e usar no render |
| `src/components/courses/LessonContent.tsx` | Aplicar mesma normalização (para cursos) |

---

## Resultado Esperado

1. O áudio do "Dia 1 — O Silêncio" vai tocar imediatamente após a correção SQL
2. Qualquer novo registro com formato inválido será tratado pelo código
3. A aplicação fica resiliente a valores parcialmente incorretos

---

## Seção Técnica

### Por Que o Áudio Não Toca

O elemento HTML:
```html
<audio controls>
  <source src=" 1769387803653.ogg" />
</audio>
```

O navegador interpreta ` 1769387803653.ogg` como um **caminho relativo** (começa com espaço, que é ignorado). Como não existe um arquivo `1769387803653.ogg` na raiz do site, o áudio falha silenciosamente.

### Arquivo Confirmado no Storage

O arquivo existe no bucket:
- **Bucket**: `audios`
- **Path**: `uploads/1769387803653.ogg`
- **URL Correta**: `https://pvjiznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/audios/uploads/1769387803653.ogg`

### Fluxo de Correção

```text
1. Migration SQL executa
2. audio_url do Dia 1: " 1769387803653.ogg" → URL completa
3. Usuário recarrega página
4. <audio src="https://...1769387803653.ogg">
5. Áudio toca normalmente
```

