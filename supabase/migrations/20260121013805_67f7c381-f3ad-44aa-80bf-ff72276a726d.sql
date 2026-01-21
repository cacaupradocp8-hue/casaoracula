-- Create personal_symbolic_maps table for therapist reflective work
-- STRICT PRIVACY: Only owner can access. Admin CANNOT see user content.
-- This is NOT clinical documentation - it's symbolic/reflective/formative.

CREATE TABLE public.personal_symbolic_maps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_key TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content JSONB NOT NULL DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX idx_personal_symbolic_maps_user_id ON public.personal_symbolic_maps(user_id);
CREATE INDEX idx_personal_symbolic_maps_template ON public.personal_symbolic_maps(template_key);

-- Enable Row Level Security
ALTER TABLE public.personal_symbolic_maps ENABLE ROW LEVEL SECURITY;

-- STRICT RLS: Users can ONLY access their own maps
-- Admin CANNOT see user content (intentional privacy protection)

CREATE POLICY "Users can view their own maps"
ON public.personal_symbolic_maps
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own maps"
ON public.personal_symbolic_maps
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own maps"
ON public.personal_symbolic_maps
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own maps"
ON public.personal_symbolic_maps
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_personal_symbolic_maps_updated_at
BEFORE UPDATE ON public.personal_symbolic_maps
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add comment explaining the privacy model
COMMENT ON TABLE public.personal_symbolic_maps IS 'Private reflective maps for therapists. Strict RLS: only owner can access. Admin cannot view content. NOT clinical records - symbolic/reflective/formative only.';