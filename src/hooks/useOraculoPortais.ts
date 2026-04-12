import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const QK = 'oraculo-portais';

// ── Portal resumo (view) ──
export function useOraculoPortaisResumo() {
  return useQuery({
    queryKey: [QK, 'resumo'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('vw_oraculo_portais_resumo')
        .select('*')
        .order('ordem');
      if (error) throw error;
      return data as any[];
    },
  });
}

// ── Portal detail ──
export function useOraculoPortal(id: string | null) {
  return useQuery({
    queryKey: [QK, 'detail', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await (supabase as any)
        .from('oraculo_portais')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

// ── Generic 1:1 sub-table hook ──
function usePortalSubSingle(table: string, portalId: string | null, fkField = 'portal_id') {
  const qc = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: [QK, table, portalId],
    queryFn: async () => {
      if (!portalId) return null;
      const { data, error } = await (supabase as any)
        .from(table)
        .select('*')
        .eq(fkField, portalId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!portalId,
  });

  const upsert = useMutation({
    mutationFn: async (values: Record<string, any>) => {
      if (!portalId) throw new Error('Sem portal');
      const existing = query.data;
      if (existing?.id) {
        const { id, created_at, updated_at, ...rest } = values;
        const { error } = await (supabase as any).from(table).update(rest).eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from(table).insert({ ...values, [fkField]: portalId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QK, table, portalId] });
      qc.invalidateQueries({ queryKey: [QK, 'resumo'] });
      toast({ title: 'Salvo com sucesso' });
    },
    onError: (e: Error) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });

  return { data: query.data, isLoading: query.isLoading, upsert };
}

// ── Generic 1:N sub-table hook ──
function usePortalSubMany(table: string, fkField: string, fkValue: string | null, orderField = 'ordem') {
  const qc = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: [QK, table, fkValue],
    queryFn: async () => {
      if (!fkValue) return [];
      const { data, error } = await (supabase as any)
        .from(table)
        .select('*')
        .eq(fkField, fkValue)
        .order(orderField);
      if (error) throw error;
      return data as any[];
    },
    enabled: !!fkValue,
  });

  const add = useMutation({
    mutationFn: async (values: Record<string, any>) => {
      if (!fkValue) throw new Error('Sem referência');
      const { error } = await (supabase as any).from(table).insert({ ...values, [fkField]: fkValue });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QK, table, fkValue] });
      toast({ title: 'Item adicionado' });
    },
    onError: (e: Error) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...values }: Record<string, any>) => {
      const { error } = await (supabase as any).from(table).update(values).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QK, table, fkValue] });
    },
    onError: (e: Error) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from(table).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QK, table, fkValue] });
      toast({ title: 'Item removido' });
    },
    onError: (e: Error) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });

  return { data: query.data || [], isLoading: query.isLoading, add, update, remove };
}

// ── Exported hooks for each sub-table ──
export const usePortalEssencia = (portalId: string | null) =>
  usePortalSubSingle('oraculo_portal_essencia', portalId);

export const usePortalAudios = (portalId: string | null) =>
  usePortalSubMany('oraculo_portal_audios', 'portal_id', portalId);

export const usePortalLaboratorio = (portalId: string | null) =>
  usePortalSubSingle('oraculo_portal_laboratorios', portalId);

export const usePortalLabPassos = (labId: string | null) =>
  usePortalSubMany('oraculo_portal_laboratorio_passos', 'laboratorio_id', labId);

export const usePortalJardins = (portalId: string | null) =>
  usePortalSubSingle('oraculo_portal_jardins', portalId);

export const usePortalAplicacoes = (portalId: string | null) =>
  usePortalSubSingle('oraculo_portal_aplicacoes', portalId);

export const usePortalNarroterapia = (portalId: string | null) =>
  usePortalSubSingle('oraculo_portal_narroterapia', portalId);

export const usePortalNarroterapiaPerguntas = (narroId: string | null) =>
  usePortalSubMany('oraculo_portal_narroterapia_perguntas', 'narroterapia_id', narroId);

export const usePortalForja = (portalId: string | null) =>
  usePortalSubSingle('oraculo_portal_forjas', portalId);

export const usePortalForjaPassos = (forjaId: string | null) =>
  usePortalSubMany('oraculo_portal_forja_passos', 'forja_id', forjaId);

export const usePortalForjaErros = (forjaId: string | null) =>
  usePortalSubMany('oraculo_portal_forja_erros', 'forja_id', forjaId);

export const usePortalFerramenta = (portalId: string | null) =>
  usePortalSubSingle('oraculo_portal_ferramentas', portalId);

export const usePortalFerramentaCampos = (ferramentaId: string | null) =>
  usePortalSubMany('oraculo_portal_ferramenta_campos', 'ferramenta_id', ferramentaId);

export const usePortalRiscosEticos = (portalId: string | null) =>
  usePortalSubMany('oraculo_portal_riscos_eticos', 'portal_id', portalId);

export const usePortalMateriais = (portalId: string | null) =>
  usePortalSubMany('oraculo_portal_materiais', 'portal_id', portalId);

// ── Portal CRUD mutations ──
export function usePortalMutations() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const updatePortal = useMutation({
    mutationFn: async ({ id, ...values }: { id: string } & Record<string, any>) => {
      const { error } = await (supabase as any).from('oraculo_portais').update(values).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QK] });
      toast({ title: 'Portal salvo' });
    },
    onError: (e: Error) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });

  const deletePortal = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from('oraculo_portais').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QK] });
      toast({ title: 'Portal excluído' });
    },
  });

  const checkPublicacao = async (portalId: string): Promise<boolean> => {
    const { data, error } = await (supabase as any).rpc('oraculo_portal_pode_publicar', { p_portal_id: portalId });
    if (error) return false;
    return !!data;
  };

  return { updatePortal, deletePortal, checkPublicacao };
}
