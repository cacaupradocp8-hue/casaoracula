import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface TextModels {
  [key: string]: string;
}

/**
 * Cached globally via React Query. Refetched at most once per session;
 * cross-component mounts share the same fetch.
 */
export function useTextModels() {
  const { data: texts = {}, isLoading } = useQuery<TextModels>({
    queryKey: ['text-models', 'kv'],
    queryFn: async () => {
      const { data } = await supabase
        .from('text_models')
        .select('chave, conteudo');
      if (!data) return {};
      return data.reduce((acc, item) => {
        acc[item.chave] = item.conteudo;
        return acc;
      }, {} as TextModels);
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const getText = (key: string, fallback: string = '') => texts[key] || fallback;

  return { texts, getText, isLoading };
}
