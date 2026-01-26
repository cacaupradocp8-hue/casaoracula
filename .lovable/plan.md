
# Plano: Corrigir Áudio da Travessia que Não Toca

## Problema Identificado

O campo `audio_url` nas lições da Travessia Zero está salvando **texto descritivo** em vez de **URLs válidas**:

| Valor Atual no Banco | Valor Esperado |
|---------------------|----------------|
| `✓ Arquivo carregado: 1769387803653.ogg` | `https://pvjiznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/audios/uploads/1769387803653.ogg` |

O player de áudio (`<audio src="✓ Arquivo carregado...">`) não consegue reproduzir porque a string não é uma URL válida.

---

## Causa Raiz

1. O formulário de lições usa um **campo de texto simples** para `audio_url`
2. O admin parece ter copiado a mensagem de sucesso do upload em vez da URL real do arquivo
3. Diferente do `ImageUpload`, não existe um componente `AudioUpload` que gere automaticamente a URL pública

---

## Solução em Duas Partes

### Parte 1: Correção Imediata dos Dados (SQL)

Atualizar os registros existentes para converter os caminhos de arquivo em URLs completas:

```sql
UPDATE conteudo_aulas
SET audio_url = 
  'https://pvjiznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/audios/uploads/' 
  || REGEXP_REPLACE(audio_url, '^.*: ', '')
WHERE audio_url LIKE '✓ Arquivo carregado:%'
  AND travessia_id = '181fe90c-b556-4865-ba7c-686f283a7419';
```

### Parte 2: Criar Componente AudioUpload

Criar um novo componente `AudioUpload.tsx` similar ao `ImageUpload.tsx` que:
- Faz upload direto do arquivo de áudio para o bucket `audios`
- Retorna automaticamente a URL pública completa
- Pode também selecionar áudios da biblioteca existente (`audio_assets`)

---

## Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| `src/components/admin/AudioUpload.tsx` | **Criar** novo componente |
| `src/components/admin/TravessiaLicoesManager.tsx` | Substituir Input por AudioUpload |
| `src/components/admin/AdminConteudosTab.tsx` | Substituir Input por AudioUpload |
| Migration SQL | Corrigir dados existentes |

---

## Novo Componente: AudioUpload

Interface similar ao ImageUpload:
- Botão "Upload" para selecionar arquivo `.mp3`, `.ogg`, `.wav`
- Botão "Biblioteca" para selecionar áudio existente de `audio_assets`
- Botão "URL" para inserir URL externa manualmente
- Preview com player de áudio quando selecionado

```text
┌─────────────────────────────────────────────┐
│  🎵  Arraste um áudio ou escolha uma opção  │
│                                             │
│   [Upload]  [Biblioteca]  [URL]             │
└─────────────────────────────────────────────┘

Quando preenchido:

┌─────────────────────────────────────────────┐
│  ▶️ ═══════════════════════════════ 2:31    │
│  arquivo-audio.mp3                    [X]   │
└─────────────────────────────────────────────┘
```

---

## Integração no Formulário de Lições

Substituir o campo de texto:

**Antes (`TravessiaLicoesManager.tsx:291-298`):**
```tsx
<div className="space-y-2">
  <Label>URL do Áudio</Label>
  <Input
    value={formData.audio_url}
    onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
    placeholder="https://..."
  />
</div>
```

**Depois:**
```tsx
<AudioUpload
  value={formData.audio_url}
  onChange={(url) => setFormData({ ...formData, audio_url: url })}
  label="Áudio da Lição"
/>
```

---

## Resultado Esperado

1. Os áudios da Travessia Zero passarão a tocar imediatamente após a correção SQL
2. Novos uploads de áudio sempre salvarão URLs completas e válidas
3. O admin terá uma experiência consistente entre upload de imagens e áudios
4. A biblioteca de áudios (`audio_assets`) poderá ser reutilizada nas lições

---

## Seção Técnica

### Por Que o Player Não Toca

O elemento HTML `<audio>`:
```html
<audio controls>
  <source src="✓ Arquivo carregado: 1769387803653.ogg" />
</audio>
```

Não pode carregar o arquivo porque:
1. A string não começa com `http://` ou `https://`
2. O navegador interpreta como caminho relativo inválido
3. Nenhum erro é exibido visualmente (falha silenciosa)

### Função de Resolução de URL

O componente `AdminAudiosTab` já tem a lógica correta:
```typescript
const getAudioUrl = (path: string) => {
  const { data } = supabase.storage.from('audios').getPublicUrl(path);
  return data.publicUrl;
};
```

O novo componente `AudioUpload` reutilizará essa mesma lógica.

### Buckets de Storage

- **Imagens**: `content-images`
- **Áudios**: `audios`

Ambos devem estar configurados como públicos para permitir reprodução direta.
