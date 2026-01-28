
# Plano: Corrigir Acesso às Travessias Após Travessia 00

## Problema Identificado

A Travessia 1 está configurada com `portal_minimo: visitante` no banco de dados, permitindo que visitantes acessem após completar a Travessia 00.

| Travessia | portal_minimo atual | portal_minimo correto |
|-----------|--------------------|-----------------------|
| 0 (Zero)  | visitante          | visitante             |
| 1 (Portal I) | visitante       | **aluna**             |
| 2+ | mentorada/aluna | aluna |

## Causa Raiz

A lógica de navegação está correta, mas o dado no banco está errado:

```typescript
// Esta verificação está correta
const canAccessNextTravessia = nextTravessia 
  ? isAdmin || canAccessFeature(user.portal, nextTravessia.portal_minimo)
  : false;
```

Como `nextTravessia.portal_minimo` retorna `visitante`, qualquer visitante passa na verificação.

---

## Solução Proposta

### Opção A: Corrigir Dados no Banco (Recomendada)

Atualizar o `portal_minimo` de todas as travessias numeradas (1+) para `aluna`.

```sql
UPDATE travessias 
SET portal_minimo = 'aluna' 
WHERE number >= 1;
```

**Vantagem**: Solução limpa, sem lógica extra no código.

### Opção B: Adicionar Regra de Negócio no Código

Modificar `TravessiaDetalhe.tsx` para forçar que travessias após a Zero requeiram portal `aluna`:

```typescript
// Travessias numeradas (1+) sempre requerem aluna
const effectivePortalMinimo = nextTravessia.number >= 1 
  ? 'aluna' 
  : nextTravessia.portal_minimo;

const canAccessNextTravessia = nextTravessia 
  ? isAdmin || canAccessFeature(user.portal, effectivePortalMinimo)
  : false;
```

**Vantagem**: Proteção extra mesmo se alguém errar no Admin.

---

## Implementação Recomendada

Combinar ambas as abordagens:

### 1. Corrigir Banco (via Migration)

```sql
UPDATE travessias 
SET portal_minimo = 'aluna' 
WHERE number >= 1 AND portal_minimo = 'visitante';
```

### 2. Adicionar Proteção no Código

Modificar a lógica de `canAccessNextTravessia` em `TravessiaDetalhe.tsx`:

```typescript
// Regra de negócio: Travessias numeradas (1+) exigem pelo menos aluna
const getEffectivePortalMinimo = (travessia: Travessia): PortalType => {
  if (travessia.number >= 1 && travessia.portal_minimo === 'visitante') {
    return 'aluna'; // Fallback de segurança
  }
  return travessia.portal_minimo;
};

const canAccessNextTravessia = nextTravessia 
  ? isAdmin || (
      canAccessFeature(user.portal, getEffectivePortalMinimo(nextTravessia)) && 
      (!nextTravessia.requer_profissional || isProfessional)
    )
  : false;
```

---

## Arquivos a Modificar

| Arquivo | Modificação |
|---------|-------------|
| Migration SQL | Atualizar `portal_minimo` das travessias 1+ para `aluna` |
| `src/pages/TravessiaDetalhe.tsx` | Adicionar `getEffectivePortalMinimo` como fallback de segurança |

---

## Fluxo Esperado Após Correção

```text
Visitante completa Travessia 00
           ↓
   Tenta acessar Travessia 1
           ↓
  ┌────────────────────────────┐
  │ portal_minimo = 'aluna'    │
  │ user.portal = 'visitante'  │
  │ canAccessFeature = FALSE   │
  └────────────────────────────┘
           ↓
    Botão desabilitado + cadeado
    Mensagem: "Requer matrícula"
```

---

## Critérios de Sucesso

- [ ] Visitante NÃO consegue acessar Travessia 1 após completar Travessia 00
- [ ] Botão "Próxima Travessia" aparece desabilitado com cadeado
- [ ] Aluna matriculada consegue acessar normalmente
- [ ] Admin mantém acesso total

---

## Seção Técnica

### Lógica de Hierarquia de Portais

```typescript
// src/types/portal.ts
const PORTAL_HIERARCHY: Record<PortalType, number> = {
  visitante: 1,
  aluna: 2,
  oracula: 3,
  assinante: 4,
  admin: 5,
};

// canAccessFeature(visitante, aluna) → 1 >= 2 → FALSE
// canAccessFeature(aluna, aluna) → 2 >= 2 → TRUE
```

### Modificação em TravessiaDetalhe.tsx

Localização: linhas 424-431

```typescript
// ANTES
const canAccessNextTravessia = nextTravessia 
  ? isAdmin || (canAccessFeature(user.portal, nextTravessia.portal_minimo) && ...)
  : false;

// DEPOIS
const getEffectivePortalMinimo = (t: Travessia): PortalType => {
  // Travessias 1+ nunca devem ser acessíveis para visitantes
  if (t.number >= 1 && t.portal_minimo === 'visitante') {
    return 'aluna';
  }
  return t.portal_minimo;
};

const canAccessNextTravessia = nextTravessia 
  ? isAdmin || (
      canAccessFeature(user.portal, getEffectivePortalMinimo(nextTravessia)) && 
      (!nextTravessia.requer_profissional || isProfessional)
    )
  : false;
```
