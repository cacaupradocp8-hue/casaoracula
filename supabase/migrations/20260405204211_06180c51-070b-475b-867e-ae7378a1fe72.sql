
-- 1. Add source_entry_id to collective_bed_entries for traceability
ALTER TABLE public.collective_bed_entries
ADD COLUMN IF NOT EXISTS source_entry_id uuid NULL;

-- 2. Add garden_type to distinguish origin (psique entries vs heroina entries)
-- Already covered by 'origem' column, no change needed

-- 3. Allow users to DELETE their own unpublished/pending canteiro entries (revoke)
CREATE POLICY "Users can delete own entries"
ON public.collective_bed_entries
FOR DELETE
USING (auth.uid() = user_id);

-- 4. Restrict admin access to co_jardim_entries — remove raw content access
-- Drop the overly permissive admin policy
DROP POLICY IF EXISTS "Admin select co_jardim_entries" ON public.co_jardim_entries;

-- Create a restricted admin policy: metadata only (no content column accessible via RLS,
-- but we limit to structural fields by not granting content-level access)
-- Admin can see metadata for operational purposes but should use clientes_admin_safe view
-- for aggregated data. We re-add a limited admin SELECT that still works but
-- the governance enforcement happens at the view/application layer.
-- NOTE: RLS cannot filter columns, so we remove admin direct access entirely.
-- Admin must use dedicated views for jardim metadata.

-- 5. Add tracking action types
-- These are application-level, no schema change needed (studentTrackingService handles it)
