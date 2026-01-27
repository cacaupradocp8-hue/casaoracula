

# Plano: Estrutura de 4 Semanas do Clube do Livro

## Resumo da Mudança

A estrutura atual usa 4 fases genéricas (Chamado, Ruptura, Reorganização, Integração). A nova especificação exige uma estrutura de **4 SEMANAS** com conteúdo muito mais rico e específico por semana, incluindo:

- Textos de orientação fixos por semana
- Alertas clínicos com avisos éticos
- Pontes com outras Salas (ex: Sala da Sustentação)
- Listas de uso inadequado
- Capítulos específicos de leitura orientada

---

## Arquitetura Proposta

### Nova Estrutura de Fases/Semanas

```text
SEMANA 0 — Ritual de Abertura (já implementado, precisa atualização)
SEMANA 1 — O Arquétipo Não É a Cliente
SEMANA 2 — O Risco da Projeção da Facilitadora
SEMANA 3 — Quando Não Usar um Conto
SEMANA 4 — Integração e Fechamento
```

---

## Mudanças no Banco de Dados

### Tabela: clube_livro_fases

Adicionar campos para suportar o conteúdo rico por semana:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `numero_semana` | integer | Número da semana (0, 1, 2, 3, 4) |
| `leitura_orientada` | text | Capítulos/seções para ler |
| `alerta_clinico` | text | Aviso clínico fixo (ex: "O arquétipo é campo, não rótulo") |
| `observacao_clinica` | text | Observação mais longa |
| `lista_uso_inadequado` | text[] | Lista de situações a evitar |
| `ponte_sala_id` | uuid | Link para outra Sala (referência) |
| `ponte_sala_texto` | text | Texto explicativo da ponte |
| `texto_fechamento` | text | Bloco de fechamento da semana |

---

## Mudanças na UI

### 1. Página de Ritual (ClubeLivroRitual.tsx)

Atualizar o texto do manifesto para o novo texto canônico:

```text
"Este não é um clube de leitura.
É um campo de escuta simbólica.

Não lemos para entender histórias.
Lemos para sustentar imagens sem invadir.

Se você costuma explicar demais, apressar sentidos ou salvar personagens,
este ciclo vai te desacelerar."
```

Checkbox atualizado:
- "Aceito ler sem interpretar para o outro."

### 2. Página de Fase/Semana (ClubeLivroFase.tsx)

Expandir para exibir todos os novos blocos:

1. **Número da Semana** (header visual)
2. **Leitura Orientada** (capítulos em destaque)
3. **Pergunta-Guia** (já existe)
4. **Alerta Clínico** (card vermelho/amber)
5. **Observação Clínica** (texto expandido)
6. **Lista de Uso Inadequado** (bullets com ícone de proibido)
7. **Ponte com Sala** (card com botão de navegação)
8. **Texto de Fechamento** (bloco final)

### 3. Admin (AdminClubeLivroTab.tsx)

Expandir o editor de fases para incluir todos os novos campos:
- Campo de número da semana
- Textarea para leitura orientada
- Textarea para alerta clínico
- Textarea para observação clínica
- Editor de lista (uso inadequado)
- Seletor de Sala para ponte
- Textarea para texto da ponte
- Textarea para fechamento

---

## Fluxo Visual por Semana

```text
┌─────────────────────────────────────────────────────────┐
│  SEMANA 1 — O Arquétipo Não É a Cliente                │
├─────────────────────────────────────────────────────────┤
│  📖 LEITURA ORIENTADA                                   │
│  Introdução + Capítulo: La Loba                        │
├─────────────────────────────────────────────────────────┤
│  ✨ PERGUNTA-GUIA                                       │
│  "Onde eu costumo confundir símbolo com identidade?"   │
│  [    Campo de escrita privada    ]  [Salvar]          │
├─────────────────────────────────────────────────────────┤
│  ⚠️ ALERTA CLÍNICO                                     │
│  Nunca diga à cliente: "Você é a mulher selvagem."     │
│  O arquétipo é campo, não rótulo.                      │
├─────────────────────────────────────────────────────────┤
│  🜁 PONTE COM SALA DA SUSTENTAÇÃO                      │
│  "Se esta leitura ativar excesso de identificação      │
│  ou impulso de condução, pause."                       │
│                     [Ir para a Sala da Sustentação]    │
└─────────────────────────────────────────────────────────┘
```

---

## Arquivos a Modificar

1. **Migração SQL** - Adicionar novos campos na tabela `clube_livro_fases`

2. **src/hooks/useClubeLivro.ts** - Atualizar interface `ClubeFase` com novos campos

3. **src/pages/clube-livro/ClubeLivroRitual.tsx** - Atualizar texto canônico e checkbox

4. **src/pages/clube-livro/ClubeLivroFase.tsx** - Expandir para exibir:
   - Número da semana
   - Leitura orientada
   - Alerta clínico
   - Observação clínica
   - Lista de uso inadequado
   - Ponte com sala
   - Texto de fechamento

5. **src/components/admin/AdminClubeLivroTab.tsx** - Expandir editor de fases com todos os novos campos

6. **src/pages/clube-livro/ClubeLivroCiclo.tsx** - Ajustar visualização das semanas

---

## Ordem de Implementação

1. Migração do banco (novos campos)
2. Atualizar tipos no hook useClubeLivro
3. Atualizar texto do ritual de abertura
4. Expandir página de fase/semana
5. Expandir admin com novos campos
6. Testar fluxo completo

---

## Considerações

- O texto do Ritual de Abertura será o novo texto canônico especificado
- Os campos de lista (uso inadequado) serão armazenados como array de texto
- A ponte com Sala será opcional e renderizada apenas se configurada
- O alerta clínico terá destaque visual (cor amber/vermelho)
- Mantemos compatibilidade com fases existentes (campos novos são nullable)

