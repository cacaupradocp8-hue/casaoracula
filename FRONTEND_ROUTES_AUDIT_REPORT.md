# FRONTEND ROUTES AUDIT REPORT - Casa Orácula

## 1. Rotas por Domínio

### Admin (`/admin`)
- `/admin/clube`
- `/admin/ferramentas/criar`
- `/admin/modulos-formativos`
- `/admin/oracle-cards`

### Casa das Máquinas (`/casa-das-maquinas`)
- `/casa-das-maquinas/clientes`
- `/casa-das-maquinas/sessao/:clienteId`
- `/casa-das-maquinas/7-vozes`
- `/casa-das-maquinas/academia`

### Jornada / Clube (`/jornada`, `/clube`)
- `/minha-jornada`
- `/travessias`
- `/clube/rota/:slug`

### Sala de Visita (`/sala-da-visitante`)
- `/sala-da-visitante`
- `/auth`

## 2. Auditoria de Saúde das Rotas
- **Rotas Duplicadas:** Não encontradas. O projeto usa um sistema de extração de grupos (`renderAdminRoutes`, etc) que evita duplicidade.
- **Rotas Legadas (Com Redirecionamento):**
  - `/admin/clube-livro` -> `/admin/clube`
  - `/saas/clientes/*` -> `/casa-das-maquinas/clientes/*`
  - `/app/clientes/:clienteId/cidadela` -> `/casa-das-maquinas/clientes/:clienteId/mapa-cidadela`
- **Rotas sem Proteção:** `/auth`, `/reset-password` e rotas de erro são as únicas públicas intencionais.
- **Rotas Quebradas:** Não detectadas via análise estática.

---
*Apenas diagnóstico. Nenhuma alteração foi realizada.*
