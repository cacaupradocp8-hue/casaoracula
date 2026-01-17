-- Create table for symbolic reflection templates
CREATE TABLE public.symbolic_template_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  template_type TEXT NOT NULL, -- 'big5', 'enneagram', 'tarot', 'constellation'
  title TEXT NOT NULL,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  sections JSONB NOT NULL DEFAULT '{}', -- Stores section content as key-value pairs
  notes JSONB DEFAULT '{}', -- Stores optional notes per section
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.symbolic_template_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for user access (only creator can access)
CREATE POLICY "Users can view their own template sessions" 
ON public.symbolic_template_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own template sessions" 
ON public.symbolic_template_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own template sessions" 
ON public.symbolic_template_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own template sessions" 
ON public.symbolic_template_sessions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_symbolic_template_sessions_updated_at
BEFORE UPDATE ON public.symbolic_template_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_symbolic_template_sessions_user_type ON public.symbolic_template_sessions(user_id, template_type);
CREATE INDEX idx_symbolic_template_sessions_created ON public.symbolic_template_sessions(created_at DESC);