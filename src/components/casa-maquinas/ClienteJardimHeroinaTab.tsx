import { useCallback, useEffect, useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { JardimHeroinaIntegracaoTab } from '@/components/session-room/JardimHeroinaIntegracaoTab';

interface ClienteJardimHeroinaTabProps {
  clientId: string;
  clientName: string;
}

export function ClienteJardimHeroinaTab({ clientId, clientName }: ClienteJardimHeroinaTabProps) {
  const { user } = useAuth();
  const [caseId, setCaseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ensureJardimBase = useCallback(async () => {
    if (!user || !clientId) return;

    setLoading(true);
    setError(null);

    try {
      const { data: existingJardim, error: jardimError } = await supabase
        .from('jardim_heroina')
        .select('case_id')
        .eq('client_id', clientId)
        .eq('therapist_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (jardimError) throw jardimError;

      if (existingJardim?.case_id) {
        setCaseId(existingJardim.case_id);
        return;
      }

      const { data: existingCase, error: caseError } = await supabase
        .from('session_cases')
        .select('id')
        .eq('client_id', clientId)
        .eq('therapist_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (caseError) throw caseError;

      let resolvedCaseId = existingCase?.id ?? null;

      if (!resolvedCaseId) {
        const { data: createdCase, error: createCaseError } = await supabase
          .from('session_cases')
          .insert({
            therapist_id: user.id,
            client_id: clientId,
            title: `Jornada de ${clientName}`,
            status: 'active',
          })
          .select('id')
          .single();

        if (createCaseError) throw createCaseError;
        resolvedCaseId = createdCase.id;
      }

      const { error: createJardimError } = await supabase.from('jardim_heroina').insert({
        case_id: resolvedCaseId,
        therapist_id: user.id,
        client_id: clientId,
        status: 'inactive',
      });

      if (createJardimError) throw createJardimError;

      setCaseId(resolvedCaseId);
    } catch (err) {
      console.error('Erro ao preparar Jardim da Heroína:', err);
      setError('Não foi possível preparar o Jardim da Heroína agora.');
    } finally {
      setLoading(false);
    }
  }, [clientId, clientName, user]);

  useEffect(() => {
    ensureJardimBase();
  }, [ensureJardimBase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[280px]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !caseId) {
    return (
      <Card className="border-border/30 bg-card/70">
        <CardHeader>
          <CardTitle>Jardim da Heroína</CardTitle>
          <CardDescription>
            Houve um problema ao preparar o espaço simbólico desta cliente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={ensureJardimBase} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <JardimHeroinaIntegracaoTab
      caseId={caseId}
      clientId={clientId}
      clientName={clientName}
    />
  );
}