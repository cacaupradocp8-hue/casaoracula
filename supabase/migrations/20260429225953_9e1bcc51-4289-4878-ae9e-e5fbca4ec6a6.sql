-- Create table for general user progress
CREATE TABLE public.user_journey_stats (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    current_portal_slug TEXT DEFAULT 'barba-azul',
    current_portal_name TEXT DEFAULT 'Barba Azul',
    mastery_level INTEGER DEFAULT 1,
    rituals_completed INTEGER DEFAULT 0,
    portals_crossed INTEGER DEFAULT 0,
    total_minutes_invested INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for personalized road nodes
CREATE TABLE public.user_road_nodes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'proximo', -- 'concluido', 'ativo', 'proximo'
    node_type TEXT DEFAULT 'Portal', -- 'Portal', 'Ritual', 'Desafio', etc.
    estimated_minutes INTEGER,
    remaining_minutes INTEGER,
    position_order INTEGER NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for symbolic rewards
CREATE TABLE public.symbolic_rewards (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    rarity TEXT DEFAULT 'comum', -- 'comum', 'raro', 'lendario'
    icon_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create junction table for user rewards
CREATE TABLE public.user_unlocked_rewards (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reward_id UUID NOT NULL REFERENCES public.symbolic_rewards(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, reward_id)
);

-- Enable RLS
ALTER TABLE public.user_journey_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_road_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symbolic_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_unlocked_rewards ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own journey stats" ON public.user_journey_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own road nodes" ON public.user_road_nodes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Everyone can view rewards" ON public.symbolic_rewards FOR SELECT USING (true);
CREATE POLICY "Users can view their own unlocked rewards" ON public.user_unlocked_rewards FOR SELECT USING (auth.uid() = user_id);

-- Updated at trigger for stats
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_journey_stats_updated_at
BEFORE UPDATE ON public.user_journey_stats
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
