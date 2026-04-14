/**
 * DATA ACCESS LAYER — Barrel Export
 * 
 * Import from '@/lib/dal' for all data operations.
 * 
 * Usage:
 *   import { dal } from '@/lib/dal';
 *   const profile = await dal.users.getProfile(userId);
 *   const clients = await dal.clientes.listClientes({ therapistId });
 * 
 * Migration guide:
 *   Old: import { supabase } from '@/integrations/supabase/client';
 *   New: import { dal } from '@/lib/dal';
 *        — or for raw client access during transition:
 *        import { supabase } from '@/lib/dal/dbClient';
 */

import * as auth from './auth';
import * as users from './users';
import * as clientes from './clientes';
import * as sessions from './sessions';
import * as cidadela from './cidadela';
import * as tools from './tools';
import * as progress from './progress';
import * as subscriptions from './subscriptions';
import * as certificates from './certificates';
import * as cartografiaProfile from './cartografiaProfile';

export const dal = {
  auth,
  users,
  clientes,
  sessions,
  cidadela,
  tools,
  progress,
  subscriptions,
  certificates,
  cartografiaProfile,
} as const;

// Re-export individual modules for tree-shaking
export { auth, users, clientes, sessions, cidadela, tools, progress, subscriptions, certificates, cartografiaProfile };

// Re-export the raw client for gradual migration
export { supabase } from './dbClient';
