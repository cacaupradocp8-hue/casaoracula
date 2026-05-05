-- Create the suggested schema for the new Clube experience
CREATE TABLE public.clube_v3_routes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    status TEXT DEFAULT 'draft',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.clube_v3_stations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    route_id UUID REFERENCES public.clube_v3_routes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.clube_v3_station_audios (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    station_id UUID REFERENCES public.clube_v3_stations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    audio_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    status TEXT DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.clube_v3_station_content (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    station_id UUID REFERENCES public.clube_v3_stations(id) ON DELETE CASCADE UNIQUE,
    letter_content TEXT,
    jungian_reflection TEXT,
    contemplative_question TEXT,
    therapeutic_practice TEXT,
    support_material TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.clube_v3_user_progress (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    station_id UUID REFERENCES public.clube_v3_stations(id) ON DELETE CASCADE,
    audio_completed BOOLEAN DEFAULT false,
    letter_completed BOOLEAN DEFAULT false,
    reflection_completed BOOLEAN DEFAULT false,
    question_completed BOOLEAN DEFAULT false,
    practice_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, station_id)
);

-- Enable RLS
ALTER TABLE public.clube_v3_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clube_v3_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clube_v3_station_audios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clube_v3_station_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clube_v3_user_progress ENABLE ROW LEVEL SECURITY;

-- Policies for public/authenticated read
CREATE POLICY "Anyone can view published routes" ON public.clube_v3_routes FOR SELECT USING (status = 'published' OR (auth.role() = 'authenticated' AND is_admin(auth.uid())));
CREATE POLICY "Anyone can view published stations" ON public.clube_v3_stations FOR SELECT USING (status = 'published' OR (auth.role() = 'authenticated' AND is_admin(auth.uid())));
CREATE POLICY "Anyone can view published audios" ON public.clube_v3_station_audios FOR SELECT USING (status = 'published' OR (auth.role() = 'authenticated' AND is_admin(auth.uid())));
CREATE POLICY "Anyone can view published content" ON public.clube_v3_station_content FOR SELECT USING (true); -- Content visibility controlled by station status usually
CREATE POLICY "Users can view their own progress" ON public.clube_v3_user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.clube_v3_user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can edit their own progress" ON public.clube_v3_user_progress FOR UPDATE USING (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admins can do everything on routes" ON public.clube_v3_routes FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins can do everything on stations" ON public.clube_v3_stations FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins can do everything on audios" ON public.clube_v3_station_audios FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins can do everything on content" ON public.clube_v3_station_content FOR ALL USING (is_admin(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_clube_v3_routes_updated_at BEFORE UPDATE ON public.clube_v3_routes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clube_v3_stations_updated_at BEFORE UPDATE ON public.clube_v3_stations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clube_v3_station_audios_updated_at BEFORE UPDATE ON public.clube_v3_station_audios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clube_v3_station_content_updated_at BEFORE UPDATE ON public.clube_v3_station_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clube_v3_user_progress_updated_at BEFORE UPDATE ON public.clube_v3_user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
