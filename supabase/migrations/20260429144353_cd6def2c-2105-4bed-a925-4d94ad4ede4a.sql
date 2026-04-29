-- Update admin_automation_rules to support portal-specific goals and audit data
ALTER TABLE public.admin_automation_rules 
ADD COLUMN portal TEXT,
ADD COLUMN measurement_window_days INTEGER DEFAULT 7,
ADD COLUMN approval_reason TEXT,
ADD COLUMN last_success_rate NUMERIC,
ADD COLUMN last_volume INTEGER,
ADD COLUMN last_snapshot_at TIMESTAMP WITH TIME ZONE;

-- Update unique constraint to include portal (using COALESCE for null portals)
ALTER TABLE public.admin_automation_rules 
DROP CONSTRAINT admin_automation_rules_risk_type_action_type_channel_key;

CREATE UNIQUE INDEX idx_automation_rules_unique 
ON public.admin_automation_rules (risk_type, action_type, channel, COALESCE(portal, 'GLOBAL'));

-- Create audit table
CREATE TABLE public.admin_automation_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id UUID REFERENCES public.admin_automation_rules(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL, -- 'activate', 'deactivate', 'simulate', 'update'
    reason TEXT,
    snapshot_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for audit table
ALTER TABLE public.admin_automation_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
ON public.admin_automation_audit
FOR SELECT
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND portal = 'admin'));

CREATE POLICY "Admins can create audit logs"
ON public.admin_automation_audit
FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND portal = 'admin'));

-- Function to handle simulation logging
CREATE OR REPLACE FUNCTION public.log_automation_simulation(
    p_risk_type TEXT,
    p_action_type TEXT,
    p_channel TEXT,
    p_portal TEXT,
    p_admin_id UUID,
    p_snapshot JSONB
) RETURNS UUID AS $$
DECLARE
    v_audit_id UUID;
BEGIN
    INSERT INTO public.admin_automation_audit (action, reason, snapshot_data, admin_id)
    VALUES ('simulate', 'Simulação de impacto para ' || p_risk_type || ' / ' || p_action_type, p_snapshot, p_admin_id)
    RETURNING id INTO v_audit_id;
    RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
