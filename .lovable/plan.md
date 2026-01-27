
# Plano: Correção de Degustação 24h e Áudio no App

## Análise Atual

### Degustação 24h - Estado Atual
A funcionalidade de degustação JÁ EXISTE e está quase completa:

**O que já funciona:**
- Tabela `degustacao_requests` com campos corretos (status, expira_em, aprovado_por, etc.)
- Hook `useDegustacao.ts` para visitantes solicitarem degustação
- Hook `useDegustacaoAdmin()` para admin gerenciar pedidos
- Painel admin em `/admin` com aba "Degustação"
- Trigger que cria notificação para admins quando novo pedido é criado
- Interface visual para aprovar/rejeitar pedidos

**Problemas identificados:**
1. Notificação chega ao admin mas pode não ter link direto para a aba
2. Falta botão "Encerrar manualmente" no admin
3. Status "expirado" não é atualizado automaticamente (apenas verificado no frontend)
4. Falta histórico visual claro com tempo restante em tempo real

### Áudio - Estado Atual
Múltiplos componentes de áudio já existem:

**Componentes existentes:**
- `AudioUpload.tsx` - Upload/seleção no admin (funcionando)
- `AudioCard.tsx` - Player reativo no Ofício da Voz Oracular (funcionando)
- `AudioBlock.tsx` - Bloco modular para conteúdos (funcionando)
- `PortaAudioPlayer.tsx` - Player no Labirinto (funcionando)
- Players nativos `<audio>` em várias páginas

**Problemas identificados:**
1. Inconsistência entre tipos de player (alguns usam componente customizado, outros `<audio>` nativo)
2. Falta tratamento de erro quando URL é inválida
3. Alguns campos salvam path em vez de URL pública completa
4. Não há componente unificado para todas as situações

---

## Correções Propostas

### 1. Degustação 24h

#### A) Atualização Automática de Status Expirado
Modificar a função `check_and_expire_access` existente para também atualizar degustações expiradas:

```text
┌─────────────────────────────────────────────────────┐
│  Edge Function: check-access-expiration             │
│  (já existe, precisa expansão)                      │
├─────────────────────────────────────────────────────┤
│  1. Verificar profiles com access_expires_at < now()│
│  2. NOVO: Verificar degustacao_requests aprovados   │
│     onde expira_em < now() → marcar como 'expirado' │
│  3. Reverter portal do usuário para 'visitante'    │
└─────────────────────────────────────────────────────┘
```

#### B) Botão "Encerrar Manualmente" no Admin
Adicionar função `endRequest` no hook `useDegustacaoAdmin`:

```text
┌─────────────────────────────────────────────────────┐
│  Ação: Encerrar Degustação                          │
├─────────────────────────────────────────────────────┤
│  1. Atualizar status → 'expirado'                  │
│  2. Atualizar expira_em → now()                    │
│  3. Reverter portal do usuário → 'visitante'       │
│  4. Notificar usuária                               │
│  5. Toast de confirmação                            │
└─────────────────────────────────────────────────────┘
```

#### C) Tempo Restante em Tempo Real
No AdminDegustacaoTab, para pedidos aprovados ativos:

```text
┌─────────────────────────────────────────────────────┐
│  Card do Pedido Aprovado                            │
├─────────────────────────────────────────────────────┤
│  👤 Patricia                                        │
│  ✅ Aprovado                                        │
│  ⏱️ Tempo restante: 18h 32min                      │
│                        [Encerrar]                   │
└─────────────────────────────────────────────────────┘
```

#### D) Notificação com Link Direto
Atualizar trigger para incluir CTA na notificação:

```text
cta_label: 'Ver pedidos'
cta_url: '/admin?tab=degustacao'
```

#### E) Mensagem Clara para Visitante
No VisitorDashboardPanel, quando degustação expira:

```text
┌─────────────────────────────────────────────────────┐
│  ⏰ Sua degustação foi encerrada                    │
│  Seu período de 24h terminou. Conheça nossos       │
│  planos para continuar acessando a Casa.           │
│                   [Conhecer planos]                 │
└─────────────────────────────────────────────────────┘
```

---

### 2. Correção de Áudios

#### A) Componente Unificado de Áudio
Criar componente `UnifiedAudioPlayer.tsx` baseado no `AudioCard.tsx` (que já funciona bem):

```text
Props:
- audioUrl: string
- title?: string
- coverImage?: string
- size?: 'sm' | 'md' | 'lg'
- showTitle?: boolean
- onError?: () => void

Features:
- Play/pause
- Barra de progresso
- Tempo decorrido
- Funciona em mobile
- Não inicia automaticamente
- Tratamento de erro (não renderiza se URL inválida)
```

#### B) Validação de URL no AudioUpload
Adicionar verificação se a URL retornada é válida antes de salvar:

```text
1. Após upload, verificar se URL começa com https://
2. Se for path relativo, converter para URL pública
3. Testar se URL é acessível antes de confirmar
```

#### C) Fallback Seguro em Todas as Páginas
Padronizar renderização condicional:

```text
{audioUrl && isValidAudioUrl(audioUrl) ? (
  <UnifiedAudioPlayer audioUrl={audioUrl} />
) : null}
```

Páginas que precisam atualização:
- QuizPage.tsx (resultado com áudio)
- AulaPage.tsx (aulas com áudio)
- LessonContent.tsx (lições de curso)
- BibliotecaTravessiaDetalhe.tsx (mídia da travessia)
- LabirintoPorta.tsx (já usa PortaAudioPlayer - ok)

---

## Arquivos a Modificar

### Degustação

| Arquivo | Modificação |
|---------|-------------|
| `src/hooks/useDegustacao.ts` | Adicionar função `endRequest` para encerrar manualmente |
| `src/components/admin/AdminDegustacaoTab.tsx` | Adicionar botão "Encerrar", tempo restante em tempo real |
| `src/components/visitor/VisitorDashboardPanel.tsx` | Mensagem quando degustação expirou |
| `supabase/functions/check-access-expiration/index.ts` | Incluir verificação de degustações expiradas |
| Migration SQL | Atualizar trigger para incluir cta_url na notificação |

### Áudio

| Arquivo | Modificação |
|---------|-------------|
| `src/components/audio/UnifiedAudioPlayer.tsx` | CRIAR - componente unificado |
| `src/lib/audioUtils.ts` | CRIAR - funções auxiliares (isValidAudioUrl, getPublicAudioUrl) |
| `src/pages/QuizPage.tsx` | Usar UnifiedAudioPlayer com fallback |
| `src/pages/AulaPage.tsx` | Usar UnifiedAudioPlayer com fallback |
| `src/components/courses/LessonContent.tsx` | Usar UnifiedAudioPlayer com fallback |
| `src/pages/BibliotecaTravessiaDetalhe.tsx` | Usar UnifiedAudioPlayer com fallback |

---

## Ordem de Implementação

1. **Degustação - Backend**
   - Atualizar edge function para expirar degustações
   - Atualizar trigger de notificação

2. **Degustação - Frontend**
   - Adicionar função `endRequest` no hook
   - Implementar botão "Encerrar" e tempo restante no admin
   - Melhorar feedback para visitante

3. **Áudio - Componente Base**
   - Criar `UnifiedAudioPlayer.tsx`
   - Criar `audioUtils.ts`

4. **Áudio - Integração**
   - Atualizar páginas para usar novo componente
   - Testar em mobile

---

## Seção Técnica

### Função SQL para Expirar Degustações

```sql
-- Adicionar à função check_and_expire_access
UPDATE degustacao_requests
SET status = 'expirado'
WHERE status = 'aprovado'
  AND expira_em IS NOT NULL
  AND expira_em < NOW();
```

### Interface do UnifiedAudioPlayer

```typescript
interface UnifiedAudioPlayerProps {
  audioUrl: string;
  title?: string;
  coverImage?: string;
  size?: 'sm' | 'md' | 'lg';
  showControls?: boolean;
  className?: string;
}
```

### Validação de URL de Áudio

```typescript
export function isValidAudioUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  if (!url.startsWith('http://') && !url.startsWith('https://')) return false;
  return true;
}

export function getPublicAudioUrl(path: string): string {
  if (path.startsWith('http')) return path;
  const { data } = supabase.storage.from('audios').getPublicUrl(path);
  return data.publicUrl;
}
```

---

## Critérios de Sucesso

- [ ] Toda solicitação de degustação aparece no admin
- [ ] Admin pode aprovar, negar e encerrar manualmente
- [ ] Degustação expira automaticamente em 24h (status atualizado)
- [ ] Visitante vê mensagem clara quando expira
- [ ] Áudios tocam em mobile e desktop
- [ ] Páginas não quebram se áudio estiver ausente ou inválido
- [ ] Player unificado funciona consistentemente em todo o app
