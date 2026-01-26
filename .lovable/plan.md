
# Plano: Adicionar Big Five Oracular ao Hub de Ferramentas do Método

## Problema Identificado
A ferramenta **Big Five Oracular** foi implementada e está acessível em `/ferramenta/big5-oracular`, mas **não aparece** na página `/ferramentas-metodo` porque essa página usa uma lista hardcoded de ferramentas.

## Solução

### Etapa 1: Adicionar ao Array de Ferramentas

Modificar `src/pages/FerramentasMetodoHub.tsx` para incluir o Big Five Oracular no array `FERRAMENTAS`:

```text
┌─────────────────────────────────────────────────────────────────┐
│                  FERRAMENTAS DO MÉTODO                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Labirinto  │  │ Torre Viva  │  │ Cartografia │              │
│  │  39 Portas  │  │     ™       │  │ das Torres  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                 │
│  ┌─────────────┐  ← NOVO                                        │
│  │   Big Five  │                                                │
│  │   Oracular  │                                                │
│  └─────────────┘                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Nova Entrada no Array

```typescript
{
  id: 'big5-oracular',
  titulo: 'Big Five Oracular',
  subtitulo: 'Mapa Simbólico de Funcionamento Psíquico',
  descricao: 'Identifique os 5 fatores simbólicos e a Porta associada ao momento atual. Inclui ritual de ancoragem.',
  icon: Sparkles,  // ou Brain
  cor: 'text-violet-400',
  bgCor: 'bg-violet-500/20',
  rota: '/ferramenta/big5-oracular',
  minPortal: 'mentorada',
  destaques: [
    '30 perguntas simbólicas',
    'Visualização radial',
    'Ritual por Porta',
  ],
}
```

### Etapa 2: Importar Icone

Adicionar `Sparkles` aos imports de `lucide-react` no arquivo.

---

## Arquivo a Modificar

| Arquivo | Acao |
|---------|------|
| `src/pages/FerramentasMetodoHub.tsx` | Adicionar Big Five Oracular ao array FERRAMENTAS |

---

## Resultado Esperado

Apos implementacao, a ferramenta aparecera na pagina `/ferramentas-metodo` junto com:
- Labirinto das 39 Portas
- Torre Viva
- Cartografia das Torres
- **Big Five Oracular** (novo)

O card tera o mesmo estilo visual e respeitara o controle de acesso por portal.
