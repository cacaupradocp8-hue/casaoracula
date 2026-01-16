-- Create mind_maps table
CREATE TABLE public.mind_maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Novo Mapa',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mind_map_nodes table
CREATE TABLE public.mind_map_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  map_id UUID NOT NULL REFERENCES public.mind_maps(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.mind_map_nodes(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Novo Nó',
  notes TEXT,
  color TEXT,
  tags TEXT[],
  position_x NUMERIC NOT NULL DEFAULT 0,
  position_y NUMERIC NOT NULL DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mind_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mind_map_nodes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mind_maps (owner-only access)
CREATE POLICY "Users can view their own maps"
ON public.mind_maps FOR SELECT
USING (owner_id = auth.uid() OR public.get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Users can create their own maps"
ON public.mind_maps FOR INSERT
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own maps"
ON public.mind_maps FOR UPDATE
USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their own maps"
ON public.mind_maps FOR DELETE
USING (owner_id = auth.uid());

-- RLS Policies for mind_map_nodes (via map ownership)
CREATE POLICY "Users can view nodes of their maps"
ON public.mind_map_nodes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.mind_maps m
    WHERE m.id = map_id
    AND (m.owner_id = auth.uid() OR public.get_user_portal(auth.uid()) = 'admin')
  )
);

CREATE POLICY "Users can create nodes in their maps"
ON public.mind_map_nodes FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.mind_maps m
    WHERE m.id = map_id AND m.owner_id = auth.uid()
  )
);

CREATE POLICY "Users can update nodes in their maps"
ON public.mind_map_nodes FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.mind_maps m
    WHERE m.id = map_id AND m.owner_id = auth.uid()
  )
);

CREATE POLICY "Users can delete nodes in their maps"
ON public.mind_map_nodes FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.mind_maps m
    WHERE m.id = map_id AND m.owner_id = auth.uid()
  )
);

-- Triggers for updated_at
CREATE TRIGGER update_mind_maps_updated_at
BEFORE UPDATE ON public.mind_maps
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mind_map_nodes_updated_at
BEFORE UPDATE ON public.mind_map_nodes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_mind_maps_owner ON public.mind_maps(owner_id);
CREATE INDEX idx_mind_map_nodes_map ON public.mind_map_nodes(map_id);
CREATE INDEX idx_mind_map_nodes_parent ON public.mind_map_nodes(parent_id);