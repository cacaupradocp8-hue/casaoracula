import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { ReactionType } from './types';

export type { ReactionType };

/** Reactions for multiple entries */
export function useCanteiroReactions(entryIds: string[]) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['canteiro-reactions', entryIds],
    queryFn: async () => {
      if (!entryIds.length) return {};

      const { data, error } = await supabase
        .from('canteiro_reactions')
        .select('entry_id, reaction_type, user_id')
        .in('entry_id', entryIds);

      if (error) throw error;

      const map: Record<string, Record<ReactionType, { count: number; userReacted: boolean }>> = {};
      (data || []).forEach((r) => {
        const entryId = r.entry_id;
        const reactionType = r.reaction_type as ReactionType;
        if (!map[entryId]) map[entryId] = {} as Record<ReactionType, { count: number; userReacted: boolean }>;
        if (!map[entryId][reactionType]) {
          map[entryId][reactionType] = { count: 0, userReacted: false };
        }
        map[entryId][reactionType].count++;
        if (r.user_id === user?.id) {
          map[entryId][reactionType].userReacted = true;
        }
      });
      return map;
    },
    enabled: entryIds.length > 0,
  });
}

/** Toggle a reaction */
export function useToggleReaction() {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ entryId, reactionType }: { entryId: string; reactionType: ReactionType }) => {
      if (!user) throw new Error('Not authenticated');

      const { data: existing } = await supabase
        .from('canteiro_reactions')
        .select('id')
        .eq('entry_id', entryId)
        .eq('user_id', user.id)
        .eq('reaction_type', reactionType)
        .maybeSingle();

      if (existing) {
        await supabase.from('canteiro_reactions').delete().eq('id', existing.id);
      } else {
        await supabase.from('canteiro_reactions').insert({
          entry_id: entryId,
          user_id: user.id,
          reaction_type: reactionType,
        });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['canteiro-reactions'] });
    },
  });
}
