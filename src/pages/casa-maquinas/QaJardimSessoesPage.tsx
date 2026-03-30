import { useState, useMemo } from 'react';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { QaFilters as QaFiltersComponent } from '@/components/qa-jardim/QaFilters';
import { QaVinculoSummary } from '@/components/qa-jardim/QaVinculoSummary';
import { QaJardinsTable } from '@/components/qa-jardim/QaJardinsTable';
import { QaEntriesTable } from '@/components/qa-jardim/QaEntriesTable';
import { QaSessoesTable } from '@/components/qa-jardim/QaSessoesTable';
import { QaConsistencyAlerts } from '@/components/qa-jardim/QaConsistencyAlerts';
import { QaRulesInspector } from '@/components/qa-jardim/QaRulesInspector';
import {
  useQaTherapists,
  useQaClients,
  useQaJardins,
  useQaEntries,
  useQaSessoes,
  computeConsistencyAlerts,
  type QaFilters,
} from '@/hooks/useQaJardimData';

export default function QaJardimSessoesPage() {
  const { isAdmin } = useAuth();
  const [filters, setFilters] = useState<QaFilters>({});
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<'entry' | 'sessao' | null>(null);

  const { data: therapists = [], isLoading: loadingT } = useQaTherapists();
  const { data: clients = [], isLoading: loadingC } = useQaClients(filters.therapistId);
  const { data: jardins = [], isLoading: loadingJ } = useQaJardins(filters);
  const { data: entries = [], isLoading: loadingE } = useQaEntries(filters);
  const { data: sessoes = [], isLoading: loadingS } = useQaSessoes(filters);

  const isLoading = loadingT || loadingC || loadingJ || loadingE || loadingS;

  // Compute summary
  const selectedClient = clients.find(c => c.id === filters.clientId);
  const selectedTherapist = therapists.find(t => t.id === filters.therapistId);
  const vinculoAtivo = selectedClient ? selectedClient.status === 'ativo' : false;

  const alerts = useMemo(
    () => computeConsistencyAlerts(jardins, entries, sessoes, clients),
    [jardins, entries, sessoes, clients]
  );

  if (!isAdmin) {
    return (
      <CasaMaquinasLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Alert variant="destructive" className="max-w-md">
            <ShieldAlert className="h-5 w-5" />
            <AlertTitle>Acesso Negado</AlertTitle>
            <AlertDescription>Esta página é restrita a administradores.</AlertDescription>
          </Alert>
        </div>
      </CasaMaquinasLayout>
    );
  }

  return (
    <CasaMaquinasLayout>
      <div className="space-y-6 p-4 max-w-[1400px] mx-auto">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">QA — Jardim + Sessões</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Painel interno de inspeção. Dados lidos via RLS admin — sem contorno de segurança.
          </p>
        </div>

        <Alert className="border-yellow-500/50">
          <ShieldAlert className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-sm">Página de QA interno</AlertTitle>
          <AlertDescription className="text-xs">
            Admin não tem permissão de INSERT/UPDATE nas tabelas co_*. Ações de escrita foram omitidas.
            Conteúdos sensíveis (content, summary_internal) são exibidos truncados.
          </AlertDescription>
        </Alert>

        {/* Filtros */}
        <QaFiltersComponent
          filters={filters}
          onChange={setFilters}
          therapists={therapists}
          clients={clients}
          jardins={jardins}
        />

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && (
          <>
            {/* Resumo do vínculo */}
            {(filters.therapistId || filters.clientId) && (
              <QaVinculoSummary
                therapistName={selectedTherapist?.nome || undefined}
                clientName={selectedClient?.nome || undefined}
                therapistId={filters.therapistId}
                clientId={filters.clientId}
                clientUserId={selectedClient?.client_user_id || undefined}
                vinculoAtivo={vinculoAtivo}
                jardinsCount={jardins.length}
                entriesCount={entries.length}
                sessoesCount={sessoes.length}
                sessoesSharedCount={sessoes.filter(s => s.shared_with_client).length}
                entriesSharedWithTherapist={entries.filter(e => e.shared_with_therapist).length}
                entriesVisibleToClient={entries.filter(e => e.visibility_to_client).length}
              />
            )}

            {/* Jardins */}
            <QaJardinsTable jardins={jardins} />

            {/* Entries */}
            <QaEntriesTable
              entries={entries}
              onSelect={(e) => { setSelectedItem(e); setSelectedType('entry'); }}
            />

            {/* Sessões */}
            <QaSessoesTable
              sessoes={sessoes}
              onSelect={(s) => { setSelectedItem(s); setSelectedType('sessao'); }}
            />

            {/* Teste de regras */}
            <QaRulesInspector selectedItem={selectedItem} type={selectedType} />

            {/* Alertas de consistência */}
            <QaConsistencyAlerts alerts={alerts} />
          </>
        )}
      </div>
    </CasaMaquinasLayout>
  );
}
