import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface DegustacaoRequest {
  id: string;
  user_id: string;
  status: 'pendente' | 'aprovado' | 'rejeitado' | 'expirado';
  motivo: string | null;
  admin_notes: string | null;
  aprovado_por: string | null;
  aprovado_em: string | null;
  expira_em: string | null;
  created_at: string;
  updated_at: string;
}

interface DegustacaoRequestWithProfile extends DegustacaoRequest {
  profiles?: {
    id: string;
    nome: string | null;
    email: string | null;
  } | null;
}

export function useDegustacao() {
  const { user } = useAuth();
  const [myRequest, setMyRequest] = useState<DegustacaoRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasDegustacaoActive, setHasDegustacaoActive] = useState(false);

  const fetchMyRequest = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Check for pending or approved request
      const { data, error } = await supabase
        .from('degustacao_requests')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['pendente', 'aprovado'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setMyRequest(data as DegustacaoRequest);
        
        // Check if degustação is currently active
        if (data.status === 'aprovado' && data.expira_em) {
          const expiresAt = new Date(data.expira_em);
          const now = new Date();
          setHasDegustacaoActive(expiresAt > now);
        } else {
          setHasDegustacaoActive(false);
        }
      } else {
        setMyRequest(null);
        setHasDegustacaoActive(false);
      }
    } catch (error) {
      console.error('Error fetching degustação request:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyRequest();
  }, [fetchMyRequest]);

  const requestDegustacao = useCallback(async (motivo?: string) => {
    if (!user) return false;
    
    setIsSubmitting(true);
    try {
      // Check if already has pending request
      if (myRequest && myRequest.status === 'pendente') {
        toast({
          title: 'Pedido já enviado',
          description: 'Você já possui um pedido de degustação pendente.',
          variant: 'default',
        });
        return false;
      }

      const { error } = await supabase
        .from('degustacao_requests')
        .insert({
          user_id: user.id,
          motivo: motivo || null,
        });

      if (error) throw error;

      toast({
        title: 'Pedido enviado!',
        description: 'Seu pedido de degustação foi enviado. Aguarde a aprovação.',
      });

      await fetchMyRequest();
      return true;
    } catch (error) {
      console.error('Error requesting degustação:', error);
      toast({
        title: 'Erro ao enviar pedido',
        description: 'Não foi possível enviar seu pedido. Tente novamente.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [user, myRequest, fetchMyRequest]);

  return {
    myRequest,
    isLoading,
    isSubmitting,
    hasDegustacaoActive,
    requestDegustacao,
    refetch: fetchMyRequest,
  };
}

// Admin hook for managing requests
export function useDegustacaoAdmin() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<DegustacaoRequestWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchRequests = useCallback(async () => {
    if (!user || user.portal !== 'admin') return;
    
    setIsLoading(true);
    try {
      // Fetch requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('degustacao_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;

      // Fetch profiles for each request
      const userIds = [...new Set(requestsData?.map(r => r.user_id) || [])];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, nome, email')
        .in('id', userIds);

      // Merge data
      const enrichedRequests = (requestsData || []).map(request => ({
        ...request,
        profiles: profilesData?.find(p => p.id === request.user_id) || null,
      })) as DegustacaoRequestWithProfile[];

      setRequests(enrichedRequests);
    } catch (error) {
      console.error('Error fetching degustação requests:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const approveRequest = useCallback(async (requestId: string, notes?: string) => {
    if (!user || user.portal !== 'admin') return false;
    
    setIsProcessing(true);
    try {
      // Calculate expiration (24 hours from now)
      const expiraEm = new Date();
      expiraEm.setHours(expiraEm.getHours() + 24);

      // Find the request to get user_id
      const request = requests.find(r => r.id === requestId);
      if (!request) throw new Error('Request not found');

      // Update request status
      const { error: updateError } = await supabase
        .from('degustacao_requests')
        .update({
          status: 'aprovado',
          aprovado_por: user.id,
          aprovado_em: new Date().toISOString(),
          expira_em: expiraEm.toISOString(),
          admin_notes: notes || null,
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Temporarily upgrade user's portal to mentorada
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          portal: 'mentorada',
          access_expires_at: expiraEm.toISOString(),
        })
        .eq('id', request.user_id);

      if (profileError) throw profileError;

      // Notify user using correct table name
      await supabase
        .from('notifications')
        .insert({
          user_id: request.user_id,
          type: 'info',
          title: 'Degustação aprovada!',
          body: 'Seu acesso de degustação foi aprovado! Você tem 24 horas para explorar a Casa.',
        });

      toast({
        title: 'Pedido aprovado',
        description: 'O acesso de degustação foi liberado por 24 horas.',
      });

      await fetchRequests();
      return true;
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: 'Erro ao aprovar',
        description: 'Não foi possível aprovar o pedido.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [user, requests, fetchRequests]);

  const rejectRequest = useCallback(async (requestId: string, notes?: string) => {
    if (!user || user.portal !== 'admin') return false;
    
    setIsProcessing(true);
    try {
      const request = requests.find(r => r.id === requestId);
      if (!request) throw new Error('Request not found');

      const { error } = await supabase
        .from('degustacao_requests')
        .update({
          status: 'rejeitado',
          admin_notes: notes || null,
        })
        .eq('id', requestId);

      if (error) throw error;

      // Notify user using correct table name
      await supabase
        .from('notifications')
        .insert({
          user_id: request.user_id,
          type: 'info',
          title: 'Pedido de degustação',
          body: 'Seu pedido de degustação não foi aprovado desta vez. Conheça nossos planos para acessar a Casa.',
        });

      toast({
        title: 'Pedido rejeitado',
        description: 'O pedido foi rejeitado.',
      });

      await fetchRequests();
      return true;
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: 'Erro ao rejeitar',
        description: 'Não foi possível rejeitar o pedido.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [user, requests, fetchRequests]);

  const pendingCount = requests.filter(r => r.status === 'pendente').length;

  return {
    requests,
    pendingCount,
    isLoading,
    isProcessing,
    approveRequest,
    rejectRequest,
    refetch: fetchRequests,
  };
}
