# Data Access Layer (DAL) — Guia de Migração

## O que é

A camada DAL (`src/lib/dal/`) centraliza todo acesso a dados num único ponto de troca.
Hoje ela encapsula o Supabase; no futuro, pode ser substituída por qualquer backend
(REST API, GraphQL, SDK próprio) **sem alterar os 386+ componentes que consomem dados**.

## Estrutura

```
src/lib/dal/
├── index.ts        # Barrel export — import { dal } from '@/lib/dal'
├── dbClient.ts     # Ponto único de swap (hoje = Supabase)
├── auth.ts         # Autenticação
├── users.ts        # Perfis, portal, roles
├── clientes.ts     # CRUD de clientes
├── sessions.ts     # Sessões clínicas
├── cidadela.ts     # Estado da cidadela / mapa psíquico
├── tools.ts        # Ferramentas e resultados
└── progress.ts     # Progresso de aprendizagem
```

## Como usar (código novo)

```ts
import { dal } from '@/lib/dal';

// Auth
const user = await dal.auth.getCurrentUser();

// Perfil
const profile = await dal.users.getProfile(userId);

// Clientes (paginado)
const clients = await dal.clientes.listClientes({
  therapistId: userId,
  status: 'ativo',
  limit: 20,
  offset: 0,
});

// Sessões
const sessions = await dal.sessions.listSessions({
  userId,
  clientId,
  limit: 10,
});
```

## Migração progressiva

1. **Código novo** → sempre usar `dal.*`
2. **Código existente** → migrar gradualmente, arquivo por arquivo
3. **Nunca** importar `@/integrations/supabase/client` em código novo
4. Se precisar do client raw: `import { supabase } from '@/lib/dal/dbClient'`

## Para migrar para backend externo

1. Substituir `dbClient.ts` pelo novo SDK/client
2. Adaptar cada módulo (`auth.ts`, `users.ts`, etc.) para a nova API
3. A interface pública (`dal.*`) permanece idêntica
4. Nenhum componente precisa mudar
