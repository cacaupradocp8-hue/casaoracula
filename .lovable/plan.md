
# Plano de Reestruturação — Jardim da Heroína (Versão Cliente)

## DIAGNÓSTICO ATUAL

### Infraestrutura de dados ✅ Completa
| Tabela | Função | Status |
|---|---|---|
| `co_jardins` | Vínculo jardim ↔ cliente ↔ terapeuta | ✅ |
| `co_jardim_entries` | Registros bidirecionais (cliente/terapeuta) com `visibility_to_client` e `shared_with_therapist` | ✅ |
| `co_orientacoes` | Orientações da terapeuta com tipo, status, resposta | ✅ |
| `co_praticas` | Práticas propostas com status | ✅ |
| `co_sessoes` | Sessões com `shared_with_client` | ✅ |
| `clientes` | Vínculo com `client_user_id`, convite, email | ✅ |

### Hooks existentes ✅ Parcialmente reutilizáveis
| Hook | Função | Reuso |
|---|---|---|
| `useClienteJardim` | Lê `co_jardins` + `co_jardim_entries` da cliente | ✅ Manter e expandir |
| `useOrientacoesCliente` | Lê `co_orientacoes` da cliente | ✅ Manter |

### Página atual ⚠️ Monolítica
`JardimHeroinaClientePage.tsx` — tudo numa lista vertical: orientações + form + entries. Sem hierarquia, sem seções, sem travessia.

---

## NOVA ARQUITETURA

### Estrutura de arquivos

```
src/pages/jardim-heroina-cliente/
├── JardimClienteLayout.tsx         ← Layout com abas internas
├── JardimClienteHome.tsx           ← Home com 4 blocos
├── JardimClienteMeuJardim.tsx      ← Seção "Meu Jardim" (registros)
├── JardimClienteOrientacoes.tsx    ← Seção "O que minha terapeuta deixou"
├── JardimClientePraticas.tsx       ← Seção "Minhas práticas"
├── JardimClienteTravessia.tsx      ← Seção "Minha travessia"
└── index.ts

src/components/jardim-cliente/
├── BoasVindasBloco.tsx             ← Bloco 1: saudação contextual
├── TerapeutaDeixouBloco.tsx        ← Bloco 2: orientações + entries visíveis
├── JardimHojeBloco.tsx             ← Bloco 3: ações rápidas
├── TravessiaResumoBloco.tsx        ← Bloco 4: timeline resumida
├── EntryCardCliente.tsx            ← Card de entry (versão cliente)
├── NovoRegistroCliente.tsx         ← Form de novo registro expandido
├── PraticaCardCliente.tsx          ← Card de prática
└── TravessiaTimeline.tsx           ← Timeline visual

src/hooks/
├── useClienteJardim.ts             ← Expandir: sessões compartilhadas + práticas
└── useOrientacoes.ts               ← Manter como está
```

### Roteamento

```
/meu-jardim                 → JardimClienteLayout (tabs internas)
  Tab "Início"              → JardimClienteHome (4 blocos)
  Tab "Meu Jardim"          → JardimClienteMeuJardim
  Tab "Da Terapeuta"        → JardimClienteOrientacoes
  Tab "Práticas"            → JardimClientePraticas
  Tab "Travessia"           → JardimClienteTravessia
```

Rota única `/meu-jardim` com navegação por tabs — sem sub-rotas para manter simplicidade.

---

## DETALHAMENTO DOS BLOCOS

### BLOCO 1 — Boas-vindas
- Saudação por horário ("Bom dia, [nome]")
- Nome vem de `profiles.display_name` ou `clientes.nome`
- Frase curta rotativa de acolhimento
- Sem dados técnicos

### BLOCO 2 — O que sua terapeuta deixou (DESTAQUE)
- Card com borda e fundo especial (emerald)
- Mostra orientações pendentes (`co_orientacoes` onde `status != 'completed'`)
- Mostra entries da terapeuta com `visibility_to_client = true`
- Mostra práticas em aberto (`co_praticas`)
- Conta total: "3 coisas novas da sua terapeuta"
- Link "Ver tudo" → aba "Da Terapeuta"

### BLOCO 3 — Seu Jardim hoje
- Botões-ação:
  - 📝 Reflexão
  - 💭 Sensação
  - 🌙 Sonho
  - ✍️ Anotação
- Cada botão abre modal/sheet de registro rápido
- Toggle de compartilhamento com terapeuta

### BLOCO 4 — Sua travessia
- Últimas 5 entradas (mix de entries + orientações concluídas)
- Contador: "X registros · Y práticas concluídas"
- Link "Ver tudo" → aba "Travessia"

---

## SEÇÕES INTERNAS (TABS)

### Tab "Meu Jardim"
- Lista de entries da cliente (ordenada por data desc)
- Form de novo registro com tipos expandidos: reflexão, sensação, sonho, resposta, anotação
- Toggle de compartilhamento por entry
- Limite de 500 chars (já existe)

### Tab "Da Terapeuta"
- Orientações (reutiliza `OrientacaoCard`)
- Entries da terapeuta visíveis (`visibility_to_client = true`)
- Sessões compartilhadas (`shared_with_client = true`) — resumo suave

### Tab "Práticas"
- Lista de `co_praticas` da cliente
- Status: proposta → em andamento → concluída
- Botão para registrar reflexão sobre prática
- Resposta da cliente

### Tab "Travessia"
- Timeline visual cronológica reversa
- Ícones por tipo de evento (entry, orientação, prática, sessão)
- Sem linguagem técnica — "Você registrou uma reflexão", "Sua terapeuta deixou uma prática"

---

## HOOK EXPANDIDO

`useClienteJardim` será expandido para trazer também:
- `co_praticas` onde `client_user_id = user.id`
- `co_sessoes` onde `client_user_id = user.id` AND `shared_with_client = true`
- Contadores para a home

---

## IMPACTO

| Arquivo | Ação |
|---|---|
| `JardimHeroinaClientePage.tsx` | **Substituir** por redirecionamento para novo layout |
| `useClienteJardim.ts` | **Expandir** com práticas e sessões |
| `useOrientacoes.ts` | **Manter** |
| `OrientacaoCard.tsx` | **Manter** |
| `App.tsx` | **Manter** rota `/meu-jardim` apontando para novo componente |
| `JardimFirstExperience.tsx` | **Integrar** no estado vazio da home |

---

## SEGURANÇA (RLS)

- Todas as queries filtram por `client_user_id = auth.uid()`
- Entries da terapeuta: apenas `visibility_to_client = true`
- Sessões: apenas `shared_with_client = true`
- Orientações: via `clientes.client_user_id`
- Nenhum bypass, nenhuma contorno

---

## O QUE NÃO MUDA

- Banco de dados (estrutura suficiente)
- Hooks da terapeuta
- Casa das Máquinas
- Fluxo de convite
- RLS existente

Aprovar para implementar?
