import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface GalleryItem {
  url: string;
  title: string;
  kind: 'image' | 'pdf';
  order: number;
  caption?: string;
  credit?: string;
  source_url?: string;
}

export interface JourneyMedia {
  id: string;
  journey_id: string;
  header_image_url: string | null;
  infographic_url: string | null;
  infographic_kind: 'image' | 'pdf';
  gallery_items: GalleryItem[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

const KEY = 'journey_media';

export function useJourneyMedia(journeyId: string | undefined) {
  return useQuery({
    queryKey: [KEY, journeyId],
    enabled: !!journeyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('journey_media')
        .select('*')
        .eq('journey_id', journeyId!)
        .maybeSingle() as any;
      if (error) throw error;
      return data as JourneyMedia | null;
    },
  });
}

export function useUpsertJourneyMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (media: Partial<JourneyMedia> & { journey_id: string }) => {
      const { data, error } = await (supabase
        .from('journey_media') as any)
        .upsert(media, { onConflict: 'journey_id' })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (d) => qc.invalidateQueries({ queryKey: [KEY, d.journey_id] }),
  });
}
