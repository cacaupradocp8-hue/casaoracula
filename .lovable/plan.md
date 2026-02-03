
# Plano de Correção: Navegação para Travessia Zero (Erro 404)

## Diagnóstico

O botão "Continuar Jornada" na página de formação está navegando para `/portais/{id}`, mas essa rota **não existe**. As rotas corretas são:
- `/portal/{id}` (singular) → para conteúdos da tabela `conteudo_travessias`
- `/travessia/{slug}` → para conteúdos da tabela `travessias`

### Arquivos com o erro:
1. `src/pages/PortalOraculaPage.tsx` → linha 201: `navigate(`/portais/${portal.id}`)`
2. `src/components/formation-map/NodeDetailPanel.tsx` → linha 79: `navigate(`/portais/${node.reference_id}`)`

---

## Solução Proposta

### Correção 1: PortalOraculaPage.tsx (linha 201)

**Antes:**
```tsx
onClick={() => navigate(`/portais/${portal.id}`)}
```

**Depois:**
```tsx
onClick={() => navigate(`/portal/${portal.id}`)}
```

> Correção simples: trocar `/portais/` (plural) por `/portal/` (singular), que corresponde à rota definida em `App.tsx:340`.

---

### Correção 2: NodeDetailPanel.tsx (linha 79)

**Antes:**
```tsx
case 'portal':
  navigate(`/portais/${node.reference_id}`);
  break;
```

**Depois:**
```tsx
case 'portal':
  navigate(`/portal/${node.reference_id}`);
  break;
```

> Mesma correção: usar a rota correta `/portal/` (singular).

---

## Impacto

- A Travessia Zero e todos os portais de formação voltarão a funcionar corretamente
- Nenhuma alteração de banco de dados necessária
- Nenhuma criação de novas rotas

---

## Detalhes Técnicos

| Arquivo | Linha | Rota Incorreta | Rota Correta |
|---------|-------|----------------|--------------|
| PortalOraculaPage.tsx | 201 | `/portais/{id}` | `/portal/{id}` |
| NodeDetailPanel.tsx | 79 | `/portais/{id}` | `/portal/{id}` |

### Rotas existentes em App.tsx:
- `/portal/:id` → renderiza `<PortalDetalhe />` (linha 340)
- `/travessia/:slug` → renderiza `<TravessiaDetalhe />` (linha 366)
- `/portais` → renderiza `<Portais />` (página de listagem, linha 374)
