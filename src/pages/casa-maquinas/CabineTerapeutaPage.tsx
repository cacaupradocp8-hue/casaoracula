import { useState, useEffect, useMemo, useCallback } from 'react';
import { useMapaVivoLive } from '@/hooks/useMapaVivoLive';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/dal/dbClient';
import { useAuth } from '@/contexts/AuthContext';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { CabineClientesList } from '@/components/cabine/CabineClientesList';
import { CabinePreparacao } from '@/components/cabine/CabinePreparacao';
import { CabineSessao } from '@/components/cabine/CabineSessao';
import { CabineIntegracao } from '@/components/cabine/CabineIntegracao';
import { CabineSintheya } from '@/components/cabine/CabineSintheya';
import { CabineSussurro } from '@/components/cabine/CabineSussurro';
import { calcularLeituraCampo, type LeituraCampo } from '@/lib/cabine/motorOracular';
import { Loader2 } from 'lucide-react';

export type CabineMode = 'preparacao' | 'sessao' | 'integracao';

export interface ClienteComStatus {
  id: string;
  nome: string;
  status: string;
  client_user_id: string | null;
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
  const { state: mapaVivoState, fetchMapaVivo } = useMapaVivoLive();

  const selectedCliente = useMemo(
    () => clientes.find(c => c.id === selectedClienteId) ?? null,
    [clientes, selectedClienteId]
  );

  // Motor oracular — calcula Estado do Campo
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

  // Load clients + their last session date
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: rawClientes } = await supabase
        .from('clientes')
        .select('id, nome, status, client_user_id')
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
    })();
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
  }, []);

  const handleStartSession = useCallback((withoutProfile: boolean) => {
    setSessionWithoutProfile(withoutProfile);
    setSessionStartedAt(new Date());
    setMode('sessao');
  }, []);

  const handleEndSession = useCallback(async () => {
    if (!user || !selectedClienteId) return;
    const now = new Date().toISOString();

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
        },
      } as any)
      .select('id')
      .single();

    if (!error && data) {
      setSavedSessionId(data.id);
      setMode('integracao');
    }
  }, [user, selectedClienteId, sessionData, sessionWithoutProfile, sessionStartedAt, leituraCampo]);

  if (loading) {
    return (
      <CasaMaquinasLayout title="Cabine da Terapeuta" subtitle="Seu ambiente de condução clínica">
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      </CasaMaquinasLayout>
    );
  }

  return (
    <CasaMaquinasLayout title="Cabine da Terapeuta" subtitle="Seu ambiente de condução clínica">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_240px] gap-4 min-h-[calc(100vh-12rem)]">
        {/* Left: Clients */}
        <CabineClientesList
          clientes={clientes}
          selectedId={selectedClienteId}
          onSelect={handleSelectCliente}
        />

        {/* Center: Main area */}
        <div className="min-h-0">
          {!selectedClienteId ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground/50 italic">Selecione uma cliente para começar</p>
            </div>
          ) : mode === 'preparacao' ? (
            <CabinePreparacao
              cliente={selectedCliente!}
              profile={profile}
              profileLoading={profileLoading}
              leituraCampo={leituraCampo}
              onStartSession={handleStartSession}
            />
          ) : mode === 'sessao' ? (
            <CabineSessao
              cliente={selectedCliente!}
              profile={profile}
              sessionData={sessionData}
              setSessionData={setSessionData}
              startedAt={sessionStartedAt!}
              leituraCampo={leituraCampo}
              onEnd={handleEndSession}
            />
          ) : (
            <CabineIntegracao
              cliente={selectedCliente!}
              sessionId={savedSessionId!}
              onDone={() => {
                setMode('preparacao');
                setSessionData(EMPTY_SESSION);
                setSavedSessionId(null);
              }}
            />
          )}
        </div>

        {/* Right: SINTHEYA + Sussurro */}
        <div className="space-y-3 hidden lg:block">
          <CabineSintheya
            clienteNome={selectedCliente?.nome || ''}
            leitura={leituraCampo}
            sessionData={mode === 'sessao' ? sessionData : undefined}
            sessionActive={mode === 'sessao'}
          />
          <CabineSussurro
            leitura={leituraCampo}
            sessionActive={mode === 'sessao'}
            checkinTexto={sessionData.checkinTexto}
            anotacoes={sessionData.anotacoes}
          />
        </div>
      </div>
    </CasaMaquinasLayout>
  );
}
