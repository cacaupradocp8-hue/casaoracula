

# Plano: Personalização de Áudio na Página de Entrada

## Resumo

Vamos adicionar três configurações no banco de dados (`app_settings`) e criar uma seção dedicada no Admin para configurar o áudio da página de entrada, sem precisar editar código.

## Situação Atual

| O que existe | Localização |
|--------------|-------------|
| Tabela `app_settings` | Banco de dados (key/value) |
| Hook `useAppSettings()` | `src/hooks/useAppSettings.ts` |
| Hook `useAppSettingsAdmin()` | `src/hooks/useAppSettings.ts` |
| Aba de Configurações | `AdminSettingsTab.tsx` |
| `UnifiedAudioPlayer` | `src/components/audio/UnifiedAudioPlayer.tsx` |
| Landing Page | `src/pages/Landing.tsx` |

A página de entrada (`Landing.tsx`) atualmente **não possui áudio**.

---

## O Que Será Criado

### 1. Novas Configurações no Banco

Três novas chaves na tabela `app_settings`:

| Chave | Descrição |
|-------|-----------|
| `entry_audio_url` | URL do áudio (mp3/m4a) |
| `entry_audio_title` | Título exibido no player |
| `entry_audio_caption` | Texto curto abaixo do player |

### 2. Seção no Admin: "Mídias da Entrada"

Adicionar uma seção dedicada no `AdminSettingsTab.tsx`:

```text
┌──────────────────────────────────────────────────────────────┐
│  🎵 Áudio da Página de Entrada                               │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  URL do Áudio (mp3 ou m4a)                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ https://exemplo.com/audio-entrada.mp3                  │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  Título                                                      │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Bem-vinda à Casa                                       │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  Legenda curta (opcional)                                    │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Uma introdução poética à Casa ORÁCULA                  │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  [🔊 Preview]                         [Salvar Configuração]  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  ▶ Bem-vinda à Casa        ═══════════○═══  2:45 / 5:30│  │
│  │  Uma introdução poética à Casa ORÁCULA                 │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- Validação de URL (http/https)
- Preview do áudio antes de salvar
- Mensagem de erro se URL inválida
- Toast de confirmação ao salvar

### 3. Atualização da Landing Page

Modificar `Landing.tsx` para:

1. Buscar configurações de áudio via `useAppSettings()`
2. Se `entry_audio_url` existir e for válida → exibir player
3. Se não existir → não renderizar nada (sem erro)

```text
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                    [Logo Casa ORÁCULA]                       │
│                                                              │
│            Bem-vinda à Casa ORÁCULA                          │
│                                                              │
│      A Casa ORÁCULA não é um curso...                        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  ▶ Bem-vinda à Casa        ═══════════○═══  2:45 / 5:30│  │
│  │  Uma introdução poética                                │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│         [Entrar na Casa ORÁCULA]  [Conhecer a Casa]          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Arquivos a Modificar

| Arquivo | Modificação |
|---------|-------------|
| `src/hooks/useAppSettings.ts` | Adicionar funções `getEntryAudioUrl`, `getEntryAudioTitle`, `getEntryAudioCaption` |
| `src/components/admin/AdminSettingsTab.tsx` | Adicionar seção "Áudio da Página de Entrada" com formulário e preview |
| `src/pages/Landing.tsx` | Integrar `UnifiedAudioPlayer` com renderização condicional |

**Nenhuma nova tabela será criada** - usaremos a `app_settings` existente.

---

## Fluxo de Uso

### Para o Admin:

1. Acessa `/admin` → aba "Configurações"
2. Encontra seção "Áudio da Página de Entrada"
3. Cola a URL do áudio (mp3/m4a)
4. Preenche título e legenda (opcional)
5. Clica em "Preview" para ouvir
6. Clica em "Salvar Configuração"
7. Pronto! O áudio aparece na Landing

### Para Remover o Áudio:

1. Acessa a mesma seção no Admin
2. Limpa o campo de URL
3. Salva
4. O player desaparece da Landing

---

## Validações Implementadas

| Validação | Comportamento |
|-----------|---------------|
| URL vazia | Player não renderiza (ok) |
| URL sem http/https | Erro: "URL inválida" |
| URL retorna 404 | Fallback: "Áudio indisponível no momento" |
| Formatos aceitos | mp3, m4a, ogg, wav |

---

## Comportamento do Player

| Configuração | Valor |
|--------------|-------|
| Autoplay | NÃO |
| Preload | `none` (não pesa a página) |
| Tamanho | `lg` (grande, destacado) |
| Posição | Entre o texto poético e os botões |

---

## Seção Técnica

### Funções Adicionadas ao Hook

```typescript
// useAppSettings.ts
const getEntryAudioUrl = () => getSetting('entry_audio_url', '');
const getEntryAudioTitle = () => getSetting('entry_audio_title', '');
const getEntryAudioCaption = () => getSetting('entry_audio_caption', '');
```

### Integração na Landing

```typescript
// Landing.tsx
const { getEntryAudioUrl, getEntryAudioTitle, getEntryAudioCaption, isLoading } = useAppSettings();

const audioUrl = getEntryAudioUrl();
const audioTitle = getEntryAudioTitle();
const audioCaption = getEntryAudioCaption();

// Renderização condicional
{audioUrl && (
  <div className="space-y-2">
    <UnifiedAudioPlayer 
      audioUrl={audioUrl}
      title={audioTitle}
      size="lg"
    />
    {audioCaption && (
      <p className="text-sm text-muted-foreground text-center italic">
        {audioCaption}
      </p>
    )}
  </div>
)}
```

### Seção do Admin

```typescript
// AdminSettingsTab.tsx - Nova seção
<Card>
  <CardHeader>
    <CardTitle>🎵 Áudio da Página de Entrada</CardTitle>
    <CardDescription>
      Configure o áudio que aparece na página inicial para visitantes
    </CardDescription>
  </CardHeader>
  <CardContent>
    {/* Formulário com campos e preview */}
  </CardContent>
</Card>
```

---

## Critérios de Sucesso

- [ ] Admin consegue configurar URL, título e legenda do áudio
- [ ] Admin consegue fazer preview antes de salvar
- [ ] Áudio aparece na Landing quando URL está configurada
- [ ] Áudio não aparece quando URL está vazia
- [ ] Página não quebra se URL for inválida
- [ ] Player usa `preload="none"` para não pesar
- [ ] Fallback exibe "Áudio indisponível" em caso de erro

