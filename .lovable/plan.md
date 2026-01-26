
# Plano: Substituir Nomes de Ícones por Símbolos

## Problema Identificado

Na aba **Ferramentas** (`/ferramentas`), os cards exibem textos como "sparkles", "Flower2", "brain-circuit", "book-open" porque o campo `icone` na tabela `sala_ferramentas` armazena **nomes de ícones Lucide** em vez de símbolos/emojis.

O componente `FerramentaCard` renderiza diretamente o valor do campo `icone`:

```tsx
{acessivel ? (icone || "🔧") : <Lock className="w-5 h-5" />}
```

Quando `icone = "sparkles"`, aparece o texto "sparkles" literal.

---

## Solução: Atualizar Banco de Dados

Substituir todos os nomes de ícones Lucide por **símbolos Unicode** ou **emojis** apropriados.

### Mapeamento Proposto

| Ferramenta | Ícone Atual | Símbolo Novo |
|------------|-------------|--------------|
| Neuroplasticidade | brain-circuit | 🧠 |
| Mapa dos Cinco Territórios | sparkles | ✨ |
| Oráculo dos Nove Arquétipos | Flower2 | 🌸 |
| Radar de Eixo | 🎯 | 🎯 (manter) |
| Trilha de Neuroplasticidade | 🔄 | 🔄 (manter) |
| Eneagrama | circle | ⭕ |
| Espelho de Consciência | eye | 👁 |
| Mapa Arquetípico do Ego | crown | 👑 |
| Cartografia da Torre | building | 🏛 |
| Caderno Ritual Cisne Negro | Feather | 🪶 |
| Labirinto das 39 Portas | Flame | 🔥 |
| Leitura em 5 Camadas | 🔮 | 🔮 (manter) |
| Mapa da Orácula | map | 🗺 |
| Big 5 | brain | 🧬 |
| SYNTHEIA | sparkles | 🌟 |
| Agente Tradutor Simbólico | bot | 🤖 |
| Narrativas Terapêuticas | book-open | 📖 |
| Caminho da Mulher | Compass | 🧭 |
| Chakras | circle-dot | ☯ |
| Hawkins | activity | 📊 |

---

## Etapa: Migração SQL

```sql
UPDATE sala_ferramentas SET icone = '🧠' WHERE icone = 'brain-circuit';
UPDATE sala_ferramentas SET icone = '✨' WHERE icone = 'sparkles';
UPDATE sala_ferramentas SET icone = '🌸' WHERE icone = 'Flower2';
UPDATE sala_ferramentas SET icone = '⭕' WHERE icone = 'circle';
UPDATE sala_ferramentas SET icone = '👁' WHERE icone = 'eye';
UPDATE sala_ferramentas SET icone = '👑' WHERE icone = 'crown';
UPDATE sala_ferramentas SET icone = '🏛' WHERE icone = 'building';
UPDATE sala_ferramentas SET icone = '🪶' WHERE icone = 'Feather';
UPDATE sala_ferramentas SET icone = '🔥' WHERE icone = 'Flame';
UPDATE sala_ferramentas SET icone = '🗺' WHERE icone = 'map';
UPDATE sala_ferramentas SET icone = '🧬' WHERE icone = 'brain';
UPDATE sala_ferramentas SET icone = '🤖' WHERE icone = 'bot';
UPDATE sala_ferramentas SET icone = '📖' WHERE icone = 'book-open';
UPDATE sala_ferramentas SET icone = '🧭' WHERE icone = 'Compass';
UPDATE sala_ferramentas SET icone = '☯' WHERE icone = 'circle-dot';
UPDATE sala_ferramentas SET icone = '📊' WHERE icone = 'activity';
```

---

## Resultado Esperado

Após a migração, os cards exibirão símbolos visuais em vez de texto:

```text
ANTES                    DEPOIS
┌─────────────────┐      ┌─────────────────┐
│ sparkles        │  →   │      ✨         │
│ Mapa dos Cinco  │      │ Mapa dos Cinco  │
│ Territórios     │      │ Territórios     │
└─────────────────┘      └─────────────────┘
```

---

## Arquivos Afetados

| Arquivo | Ação |
|---------|------|
| Migração SQL | CRIAR - Atualizar campo `icone` em `sala_ferramentas` |

Nenhuma alteração de código é necessária. O componente `FerramentaCard` já renderiza o campo `icone` corretamente — o problema estava nos dados.
