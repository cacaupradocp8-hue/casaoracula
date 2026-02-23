import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BookMedia {
  id: string;
  station_id: string;
  type: 'cover' | 'banner' | 'gallery';
  title: string;
  file_url: string;
  file_kind: 'image' | 'pdf';
  order_index: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

const KEY = 'book_media';

export function useBookMedia(stationId: string | undefined) {
  return useQuery({
    queryKey: [KEY, stationId],
    enabled: !!stationId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('book_media')
        .select('*')
        .eq('station_id', stationId!)
        .order('type')
        .order('order_index');
      if (error) throw error;
      return data as BookMedia[];
    },
  });
}

export function useCreateBookMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: Omit<BookMedia, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase.from('book_media').insert(item).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (d) => qc.invalidateQueries({ queryKey: [KEY, d.station_id] }),
  });
}

export function useUpdateBookMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BookMedia> & { id: string }) => {
      const { data, error } = await supabase.from('book_media').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (d) => qc.invalidateQueries({ queryKey: [KEY, d.station_id] }),
  });
}

export function useDeleteBookMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, stationId }: { id: string; stationId: string }) => {
      const { error } = await supabase.from('book_media').delete().eq('id', id);
      if (error) throw error;
      return stationId;
    },
    onSuccess: (stationId) => qc.invalidateQueries({ queryKey: [KEY, stationId] }),
  });
}
