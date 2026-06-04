import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface RotaV3 {
  id: string;
  slug: string;
  title: string;
  description: string;
  banner_desktop_url: string | null;
  banner_mobile_url: string | null;
  audio_welcome_url: string | null;
  audio_welcome_title: string | null;
  audio_welcome_image: string | null;
  carta_titulo: string | null;
  carta_texto: string | null;
  carta_assinatura: string | null;
  carta_imagem_url: string | null;
  fechamento_imagem_url: string | null;
  sussurros: string[];
  status: string;
  display_order: number;
  metadata: any;
}

export function useRotasV3() {
  return useQuery({
    queryKey: ['clube-v3-routes'],
    queryFn: async (): Promise<RotaV3[]> => {
      const { data, error } = await supabase
        .from('clube_v3_routes')
        .select('*')
        .eq('status', 'published')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });
}

export function useRotaV3(slug: string) {
  return useQuery({
    queryKey: ['clube-v3-route', slug],
    queryFn: async (): Promise<RotaV3 | null> => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from('clube_v3_routes')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}
