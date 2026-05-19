-- Create the drafts table
CREATE TABLE IF NOT EXISTS public.cartografia_estrutural_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    step TEXT NOT NULL DEFAULT 'intro',
    respostas JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'draft',
    versao TEXT NOT NULL DEFAULT '2.0-estrutural',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT unique_user_draft UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE public.cartografia_estrutural_drafts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own drafts"
    ON public.cartografia_estrutural_drafts
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_cartografia_draft_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cartografia_draft_updated_at_trigger
    BEFORE UPDATE ON public.cartografia_estrutural_drafts
    FOR EACH ROW
    EXECUTE FUNCTION update_cartografia_draft_updated_at();
