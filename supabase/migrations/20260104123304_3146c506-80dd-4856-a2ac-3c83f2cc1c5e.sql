
-- Create oracular_readings table
CREATE TABLE public.oracular_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  axes_professional TEXT,
  projection_shadow TEXT,
  symbolic_narrative TEXT,
  portal_readiness TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'answered')),
  admin_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.oracular_readings ENABLE ROW LEVEL SECURITY;

-- Users can create own readings
CREATE POLICY "Users can create own readings"
ON public.oracular_readings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view own readings
CREATE POLICY "Users can view own readings"
ON public.oracular_readings
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can manage all readings
CREATE POLICY "Admins can manage all readings"
ON public.oracular_readings
FOR ALL
USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

-- Update trigger
CREATE TRIGGER update_oracular_readings_updated_at
  BEFORE UPDATE ON public.oracular_readings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
