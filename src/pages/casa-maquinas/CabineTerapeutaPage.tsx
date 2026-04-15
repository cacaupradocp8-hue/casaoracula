import { useState, useEffect, useMemo, useCallback } from 'react';
import { useMapaVivoLive } from '@/hooks/useMapaVivoLive';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/dal/dbClient';
import { useAuth } from '@/contexts/AuthContext';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Navigation } from '@/components/layout/Navigation';
import { CabinePortalAbertura } from '@/components/cabine/CabinePortalAbertura';
import { CabineActiveView } from '@/components/cabine/CabineActiveView';
import { CabineGrupoCenterPanel } from '@/components/cabine/CabineGrupoCenterPanel';
import { CabineCirculoCenterPanel } from '@/components/cabine/CabineCirculoCenterPanel';
import { CabineSintheya } from '@/components/cabine/CabineSintheya';
import { CabineSussurro } from '@/components/cabine/CabineSussurro';
import { CabineCreateModals } from '@/components/cabine/CabineCreateModals';
import type { CabineOperationMode } from '@/components/cabine/CabineModeSelector';
import { useTherapeuticGroups, type TherapeuticGroup } from '@/hooks/useTherapeuticGroups';
import { useCirculosSagrados, type CirculoSagrado } from '@/hooks/useCirculosSagrados';
import { calcularLeituraCampo, type LeituraCampo } from '@/lib/cabine/motorOracular';
import { gerarMensagemJardimVivo, type FluxoClinicoResult } from '@/lib/cabine/motorSessaoVivo';
import { Loader2, ArrowLeft } from 'lucide-react';
export type CabineMode = 'preparacao' | 'sessao' | 'integracao';

export interface ClienteComStatus {
  id: string;
  nome: string;
  status: string;
  client_user_id: string | null;
  has_initial_cartography: boolean;
  has_initial_cidadela: boolean;
  lastSessionDate: string | null;
  statusCabine: 'ativo' | 'precisa_atencao' | 'sem_historico';
}

export interface CartografiaProfile {
  id: string;
  contexto: string;
  profile_json: any;
  medias_json: any;
  oracula_inicial: string | null;
  intensidade_oracular: string | null;
  updated_at: string;
}

export interface SessionData {
  checkinTexto: string;
  portaAtiva: string;
  campoPredominante: string;
  torreEstruturante: string;
  observacaoEtica: string;
  ferramentaEscolhida: string;
  anotacoes: string;
  resumoSessao: string;
  hipoteseSimbólica: string;
  proximosPassos: string;
}

const EMPTY_SESSION: SessionData = {
  checkinTexto: '',
  portaAtiva: '',
  campoPredominante: '',
  torreEstruturante: '',
  observacaoEtica: '',
  ferramentaEscolhida: '',
  anotacoes: '',
  resumoSessao: '',
  hipoteseSimbólica: '',
  proximosPassos: '',
};

export default function CabineTerapeutaPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState<ClienteComStatus[]>([]);
  const [selectedClienteId, setSelectedClienteId] = useState<string | null>(null);
  const [mode, setMode] = useState<CabineMode>('preparacao');
  const [profile, setProfile] = useState<CartografiaProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData>(EMPTY_SESSION);
  const [sessionStartedAt, setSessionStartedAt] = useState<Date | null>(null);
  const [sessionWithoutProfile, setSessionWithoutProfile] = useState(false);
  const [savedSessionId, setSavedSessionId] = useState<string | null>(null);
  const { state: mapaVivoState, fetchMapaVivo, salvarSnapshot, loading: mapaVivoLoading } = useMapaVivoLive();
  const [currentFluxo, setCurrentFluxo] = useState<FluxoClinicoResult | null>(null);

  // ═══ Operation mode ═══
  const [operationMode, setOperationMode] = useState<CabineOperationMode>('individual');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedCirculoId, setSelectedCirculoId] = useState<string | null>(null);
  const [groups, setGroups] = useState<TherapeuticGroup[]>([]);
  const [circulos, setCirculos] = useState<CirculoSagrado[]>([]);
  const [createModal, setCreateModal] = useState<'cliente' | 'grupo' | 'circulo' | null>(null);

  const { fetchGroups } = useTherapeuticGroups();
  const { fetchCirculos } = useCirculosSagrados();

  const sessionActive = mode === 'sessao' || mode === 'integracao';

  // Determine if we're in the "portal" (entry) or "active" state
  const isInPortal = operationMode === 'individual'
    ? !selectedClienteId
    : operationMode === 'grupo'
      ? !selectedGroupId
      : !selectedCirculoId;

  // Focus mode: hide navigation during active session
  const focusMode = mode === 'sessao';

  const selectedCliente = useMemo(
    () => clientes.find(c => c.id === selectedClienteId) ?? null,
    [clientes, selectedClienteId]
  );

  const selectedGroup = useMemo(
    () => groups.find(g => g.id === selectedGroupId) ?? null,
    [groups, selectedGroupId]
  );

  const selectedCirculo = useMemo(
    () => circulos.find(c => c.id === selectedCirculoId) ?? null,
    [circulos, selectedCirculoId]
  );

  // Motor oracular
  const leituraCampo: LeituraCampo | null = useMemo(() => {
    if (!selectedCliente) return null;
    return calcularLeituraCampo(
      profile?.profile_json || null,
      {
        lastSessionDate: selectedCliente.lastSessionDate,
        intensidade_oracular: profile?.intensidade_oracular,
        oracula_inicial: profile?.oracula_inicial,
      }
    );
  }, [selectedCliente, profile]);

  // Load clients
  const loadClientes = useCallback(async (autoSelectId?: string) => {
    if (!user) return;
    const { data: rawClientes } = await supabase
      .from('clientes')
      .select('id, nome, status, client_user_id, has_initial_cartography, has_initial_cidadela')
      .eq('terapeuta_id', user.id)
      .order('nome');

    if (!rawClientes) { setLoading(false); return; }

    const clientIds = rawClientes.map(c => c.id);
    const { data: sessions } = await supabase
      .from('sessions')
      .select('client_id, date')
      .eq('user_id', user.id)
      .in('client_id', clientIds)
      .order('date', { ascending: false });

    const lastMap = new Map<string, string>();
    sessions?.forEach(s => {
      if (!lastMap.has(s.client_id)) lastMap.set(s.client_id, s.date);
    });

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const enriched: ClienteComStatus[] = rawClientes.map(c => {
      const last = lastMap.get(c.id) ?? null;
      let statusCabine: ClienteComStatus['statusCabine'] = 'sem_historico';
      if (last) {
        statusCabine = new Date(last) >= thirtyDaysAgo ? 'ativo' : 'precisa_atencao';
      }
      return { ...c, lastSessionDate: last, statusCabine };
    });

    setClientes(enriched);
    setLoading(false);

    const selectId = autoSelectId || searchParams.get('clienteId');
    if (selectId && enriched.some(c => c.id === selectId)) {
      setSelectedClienteId(selectId);
      fetchMapaVivo(selectId);
    }
  }, [user, searchParams, fetchMapaVivo]);

  useEffect(() => { loadClientes(); }, [loadClientes]);

  // Pre-load groups and circles
  useEffect(() => {
    if (!user) return;
    fetchGroups('active').then(setGroups);
    fetchCirculos().then(setCirculos);
  }, [user]);

  // Load cartografia profile when client changes
  useEffect(() => {
    if (!selectedClienteId || !user) { setProfile(null); return; }
    setProfileLoading(true);
    (async () => {
      const { data } = await supabase
        .from('co_cartografia_profile')
        .select('id, contexto, profile_json, medias_json, oracula_inicial, intensidade_oracular, updated_at')
        .or(`client_user_id.eq.${clientes.find(c => c.id === selectedClienteId)?.client_user_id},user_id.eq.${user.id}`)
        .order('updated_at', { ascending: false })
        .limit(5);

      if (data && data.length > 0) {
        const casaMaquinas = data.find((d: any) => d.contexto === 'casa_das_maquinas');
        setProfile((casaMaquinas || data[0]) as any);
      } else {
        setProfile(null);
      }
      setProfileLoading(false);
    })();
  }, [selectedClienteId, user, clientes]);

  const handleSelectCliente = useCallback((id: string) => {
    setSelectedClienteId(id);
    setMode('preparacao');
    setSessionData(EMPTY_SESSION);
    setSessionStartedAt(null);
    setSavedSessionId(null);
    setSessionWithoutProfile(false);
    setCurrentFluxo(null);
    fetchMapaVivo(id);
  }, [fetchMapaVivo]);

  const handleChangeOperationMode = useCallback((newMode: CabineOperationMode) => {
    if (sessionActive) return;
    setOperationMode(newMode);
    if (newMode !== 'individual') {
      setSelectedClienteId(null);
      setProfile(null);
    }
    if (newMode !== 'grupo') setSelectedGroupId(null);
    if (newMode !== 'circulo') setSelectedCirculoId(null);
    setMode('preparacao');
    setSessionData(EMPTY_SESSION);
  }, [sessionActive]);

  const handleBackToPortal = useCallback(() => {
    setSelectedClienteId(null);
    setSelectedGroupId(null);
    setSelectedCirculoId(null);
    setProfile(null);
    setMode('preparacao');
    setSessionData(EMPTY_SESSION);
    setSessionStartedAt(null);
    setSavedSessionId(null);
    setCurrentFluxo(null);
  }, []);

  const handleStartSession = useCallback((withoutProfile: boolean) => {
    if (!leituraCampo) {
      console.warn('Tentativa de iniciar sessão sem leitura de campo — bloqueada.');
      return;
    }
    setSessionWithoutProfile(withoutProfile);
    setSessionStartedAt(new Date());
    setMode('sessao');
  }, [leituraCampo]);

  const handleEndSession = useCallback(async () => {
    if (!user || !selectedClienteId) return;
    const now = new Date().toISOString();
    const cliente = clientes.find(c => c.id === selectedClienteId);

    const { data, error } = await supabase
      .from('sessions')
      .insert({
        client_id: selectedClienteId,
        user_id: user.id,
        date: new Date().toISOString().split('T')[0],
        checkin_state: sessionData.checkinTexto ? 'registrado' : null,
        checkin_notes: sessionData.checkinTexto || null,
        tool_id: null,
        insight: sessionData.resumoSessao || null,
        task: sessionData.proximosPassos || null,
        notes: sessionData.anotacoes || null,
        session_without_profile: sessionWithoutProfile,
        completed_at: now,
        sintese_json: {
          resumo: sessionData.resumoSessao,
          hipotese_simbolica: sessionData.hipoteseSimbólica,
          proximos_passos: sessionData.proximosPassos,
          estagio_final: currentFluxo?.fluxo || null,
        },
        cabine_data: {
          porta_ativa: sessionData.portaAtiva,
          campo_predominante: sessionData.campoPredominante,
          torre_estruturante: sessionData.torreEstruturante,
          observacao_etica: sessionData.observacaoEtica,
          ferramenta_escolhida: sessionData.ferramentaEscolhida,
          checkin_texto: sessionData.checkinTexto,
          started_at: sessionStartedAt?.toISOString(),
          estado_campo: leituraCampo?.estado || null,
          direcao_conducao: leituraCampo?.direcao || null,
          estagio_sessao: currentFluxo?.fluxo || null,
        },
      } as any)
      .select('id')
      .single();

    if (!error && data) {
      setSavedSessionId(data.id);

      if (cliente?.client_user_id && leituraCampo) {
        await salvarSnapshot(cliente.client_user_id, {
          client_user_id: cliente.client_user_id,
          therapist_user_id: user.id,
          session_id: data.id,
          estado_campo: leituraCampo.estado,
          direcao_conducao: leituraCampo.direcao,
          risco: leituraCampo.risco,
          estagio: currentFluxo?.fluxo || undefined,
          tensao_ativa: null,
          ferramenta_utilizada: sessionData.ferramentaEscolhida || null,
          ritmo_travessia: mapaVivoState?.ritmo_atual || null,
          tipo_registro: 'sessao',
          mensagem_simbolica: gerarMensagemJardimVivo(
            currentFluxo?.fluxo || 'continuidade',
            mapaVivoState || null,
          ),
        } as any);
      }

      setMode('integracao');
    }
  }, [user, selectedClienteId, sessionData, sessionWithoutProfile, sessionStartedAt, leituraCampo, clientes, currentFluxo, mapaVivoState, salvarSnapshot]);

  // ═══ LOADING ═══
  if (loading) {
    return (
      <CasaMaquinasLayout title="Cabine da Terapeuta" subtitle="Centro clínico de condução">
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      </CasaMaquinasLayout>
    );
  }

  // ═══ FOCUS MODE — session active, minimal chrome ═══
  if (focusMode && selectedCliente) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          <CabineActiveView
            cliente={selectedCliente}
            profile={profile}
            leituraCampo={leituraCampo}
            mapaVivoState={mapaVivoState}
            mode={mode}
            sessionData={sessionData}
            setSessionData={setSessionData}
            sessionStartedAt={sessionStartedAt}
            savedSessionId={savedSessionId}
            currentFluxo={currentFluxo}
            onStartSession={handleStartSession}
            onEndSession={handleEndSession}
            onFluxoChange={setCurrentFluxo}
            onBack={handleBackToPortal}
          />
        </div>
      </div>
    );
  }

  // ═══ PORTAL DE ABERTURA — no selection yet ═══
  if (isInPortal) {
    return (
      <CasaMaquinasLayout title="" subtitle="">
        <CabinePortalAbertura
          operationMode={operationMode}
          onChangeMode={handleChangeOperationMode}
          clientes={clientes}
          groups={groups}
          circulos={circulos}
          onSelectCliente={handleSelectCliente}
          onSelectGroup={(id) => setSelectedGroupId(id)}
          onSelectCirculo={(id) => setSelectedCirculoId(id)}
        />
      </CasaMaquinasLayout>
    );
  }

  // ═══ ACTIVE — INDIVIDUAL ═══
  if (operationMode === 'individual' && selectedCliente) {
    return (
      <CasaMaquinasLayout title="" subtitle="">
        <CabineActiveView
          cliente={selectedCliente}
          profile={profile}
          leituraCampo={leituraCampo}
          mapaVivoState={mapaVivoState}
          mode={mode}
          sessionData={sessionData}
          setSessionData={setSessionData}
          sessionStartedAt={sessionStartedAt}
          savedSessionId={savedSessionId}
          currentFluxo={currentFluxo}
          onStartSession={handleStartSession}
          onEndSession={handleEndSession}
          onFluxoChange={setCurrentFluxo}
          onBack={handleBackToPortal}
        />
        {/* Sintheya + Sussurro as floating whispers in non-session mode */}
        {mode === 'preparacao' && (
          <div className="hidden lg:block fixed right-6 top-24 w-60 space-y-3 z-10">
            <CabineSintheya
              clienteNome={selectedCliente.nome}
              leitura={leituraCampo}
              sessionData={undefined}
              sessionActive={false}
              mapaVivoState={mapaVivoState}
            />
            <CabineSussurro
              leitura={leituraCampo}
              sessionActive={false}
              checkinTexto=""
              anotacoes=""
              sessionStage={null}
            />
          </div>
        )}
      </CasaMaquinasLayout>
    );
  }

  // ═══ ACTIVE — GROUP ═══
  if (operationMode === 'grupo' && selectedGroupId) {
    return (
      <CasaMaquinasLayout title="" subtitle="">
        <div className="mb-4">
          <button
            onClick={handleBackToPortal}
            className="flex items-center gap-2 text-xs text-muted-foreground/50 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar
          </button>
        </div>
        <CabineGrupoCenterPanel
          groupId={selectedGroupId}
          groupName={selectedGroup?.nome || ''}
        />
      </CasaMaquinasLayout>
    );
  }

  // ═══ ACTIVE — CIRCLE ═══
  if (operationMode === 'circulo' && selectedCirculo) {
    return (
      <CasaMaquinasLayout title="" subtitle="">
        <div className="mb-4">
          <button
            onClick={handleBackToPortal}
            className="flex items-center gap-2 text-xs text-muted-foreground/50 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar
          </button>
        </div>
        <CabineCirculoCenterPanel circulo={selectedCirculo} />
      </CasaMaquinasLayout>
    );
  }

  return null;
}
