

# Plano: Adicionar Botão "Copiar URL" na Biblioteca de Áudios

## O Que Será Implementado

Adicionar um botão na tabela de áudios do Admin que copia a URL pública para a área de transferência com um clique.

## Modificação Visual

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│  Biblioteca de Áudios                                        [+ Novo Áudio]      │
├──────────────────────────────────────────────────────────────────────────────────┤
│  ▶  │ Título              │ Categoria  │ Portal   │ Duração │ Status │ Ações    │
├──────────────────────────────────────────────────────────────────────────────────┤
│  ▶  │ Bem-vinda à Casa    │ Onboarding │ visitante│  5:30   │   👁   │ 📋 ✏️ 🗑️ │
│  ▶  │ Meditação do Fogo   │ Meditação  │ iniciada │  12:45  │   👁   │ 📋 ✏️ 🗑️ │
└──────────────────────────────────────────────────────────────────────────────────┘
                                                                  ↑
                                                            NOVO BOTÃO
                                                          "Copiar URL"
```

## Comportamento

1. Admin clica no botão 📋 (ícone Copy)
2. Sistema copia a URL completa para o clipboard:
   `https://pvjiznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/audios/uploads/12345.mp3`
3. Toast aparece: "URL copiada!"
4. Admin pode colar em qualquer lugar (ex: campo de Áudio da Página de Entrada)

---

## Arquivo a Modificar

| Arquivo | Modificação |
|---------|-------------|
| `src/components/admin/AdminAudiosTab.tsx` | Adicionar botão "Copiar URL" e função `handleCopyUrl` |

---

## Mudanças no Código

### 1. Importar ícone Copy do Lucide

```typescript
import { Copy } from 'lucide-react';
```

### 2. Adicionar função handleCopyUrl

```typescript
const handleCopyUrl = async (audio: AudioAsset) => {
  const url = getAudioUrl(audio.file_path);
  await navigator.clipboard.writeText(url);
  toast({ title: 'URL copiada!' });
};
```

### 3. Adicionar botão na coluna de ações

```typescript
<Button
  variant="ghost"
  size="icon"
  className="h-8 w-8"
  onClick={() => handleCopyUrl(audio)}
  title="Copiar URL"
>
  <Copy className="w-4 h-4" />
</Button>
```

---

## Fluxo de Uso

1. Admin vai em `/admin` → aba **Áudios**
2. Encontra o áudio desejado
3. Clica no botão 📋 **Copiar URL**
4. Toast confirma: "URL copiada!"
5. Vai na aba **Configurações** → seção "Áudio da Página de Entrada"
6. Cola a URL no campo
7. Salva

---

## Critério de Sucesso

- [ ] Botão "Copiar URL" aparece em cada linha da tabela de áudios
- [ ] Ao clicar, a URL pública completa é copiada
- [ ] Toast confirma a ação
- [ ] URL copiada funciona quando colada em qualquer campo de áudio

