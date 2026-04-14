import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import {
  getCidadelaEstado,
  upsertCidadelaEstado,
  addTravessiaToHistorico,
  updateCompetencias,
  UserCidadelaEstado,
} from '@/lib/dal/cidadelaEstado';

export function useCidadelaEstado() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const key = ['cidadela-estado', user?.id];

  const { data: estado, isLoading } = useQuery({
    queryKey: key,
    queryFn: () => getCidadelaEstado(user!.id),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000,
  });

  const update = useMutation({
    mutationFn: (updates: Partial<Omit<UserCidadelaEstado, 'user_id'>>) =>
      upsertCidadelaEstado(user!.id, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const addTravessia = useMutation({
    mutationFn: (t: { distrito: string; tipo: string; completado_em: string; contexto?: string }) =>
      addTravessiaToHistorico(user!.id, t),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const addCompetencia = useMutation({
    mutationFn: (c: { distrito: string; tipo: string; nivel: number; acerto: boolean }) =>
      updateCompetencias(user!.id, c),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return { estado, isLoading, update, addTravessia, addCompetencia };
}
