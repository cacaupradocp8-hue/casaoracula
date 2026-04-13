/**
 * DATA ACCESS LAYER — Database Client
 * 
 * Single point of swap for the entire application.
 * Today: re-exports Supabase client.
 * Future: replace with any backend (REST API, GraphQL, custom SDK).
 * 
 * ALL new data-access code should import from here instead of
 * '@/integrations/supabase/client' directly.
 */

export { supabase } from '@/integrations/supabase/client';
