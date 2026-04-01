import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Loader2, Leaf, Home, Inbox, Sparkles, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useClienteJardimCompleto } from '@/hooks/useClienteJardimCompleto';
import { useOrientacoesCliente } from '@/hooks/useOrientacoes';
import { useAuth } from '@/contexts/AuthContext';

// Blocos da Home
import { BoasVindasBloco } from '@/components/jardim-cliente/BoasVindasBloco';
import { TerapeutaDeixouBloco } from '@/components/jardim-cliente/TerapeutaDeixouBloco';
import { JardimHojeBloco } from '@/components/jardim-cliente/JardimHojeBloco';
import { TravessiaResumoBloco } from '@/components/jardim-cliente/TravessiaResumoBloco';

// Seções internas
import { MeuJardimSecao } from '@/components/jardim-cliente/MeuJardimSecao';
import { DaTerapeutaSecao } from '@/components/jardim-cliente/DaTerapeutaSecao';
import { PraticasSecao } from '@/components/jardim-cliente/PraticasSecao';
import { TravessiaSecao } from '@/components/jardim-cliente/TravessiaSecao';

type Tab = 'inicio' | 'jardim' | 'terapeuta' | 'praticas' | 'travessia';

const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: 'inicio', label: 'Início', icon: Home },
  { key: 'jardim', label: 'Meu Jardim', icon: Leaf },
  { key: 'terapeuta', label: 'Da Terapeuta', icon: Inbox },
  { key: 'praticas', label: 'Práticas', icon: Sparkles },
  { key: 'travessia', label: 'Travessia', icon: MapPin },
];

export default function JardimHeroinaClientePage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('inicio');

  const {
    jardim,
    minhasEntries,
    entriesTerapeuta,
    praticas,
    praticasPendentes,
    sessoesCompartilhadas,
    travessia,
    contadores,
    loading,
    saving,
    criarEntry,
    toggleSharedWithTherapist,
  } = useClienteJardimCompleto();

  const {
    orientacoes,
    loading: loadingOrientacoes,
    marcarVista,
    completar,
    responder,
  } = useOrientacoesCliente();

  const orientacoesPendentes = orientacoes.filter((o) => o.status !== 'completed');

  if (loading || loadingOrientacoes) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-5 h-5 text-emerald-500/50 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!jardim) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center mb-6">
            <Leaf className="w-8 h-8 text-emerald-500/30" />
          </div>
          <h2 className="text-lg font-display text-foreground/80 mb-2">Jardim ainda não preparado</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Seu Jardim da Heroína será ativado pela sua terapeuta. 
            Este é um espaço de integração entre sessões.
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen pb-24">
        {/* Header sutil */}
        <div className="text-center pt-6 pb-2">
          <p className="text-[10px] uppercase tracking-[0.5em] text-emerald-500/40 font-medium">
            Jardim da Heroína
          </p>
        </div>

        {/* Tab navigation - mobile friendly */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/10">
          <div className="container mx-auto max-w-lg px-2">
            <div className="flex overflow-x-auto scrollbar-hide gap-0.5 py-2">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-all shrink-0",
                    tab === key
                      ? "bg-emerald-500/15 text-emerald-400 font-medium"
                      : "text-muted-foreground/50 hover:text-muted-foreground/70"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                  {key === 'terapeuta' && orientacoesPendentes.length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-[9px] text-white flex items-center justify-center">
                      {orientacoesPendentes.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 max-w-lg py-6">
          {tab === 'inicio' && (
            <div className="space-y-8">
              <BoasVindasBloco />

              <TerapeutaDeixouBloco
                orientacoesPendentes={orientacoesPendentes}
                entriesTerapeuta={entriesTerapeuta}
                praticasPendentes={praticasPendentes}
                onVerTudo={() => setTab('terapeuta')}
                onCompletarOrientacao={completar}
                onResponderOrientacao={responder}
                onMarcarVistaOrientacao={marcarVista}
              />

              <JardimHojeBloco saving={saving} onCriar={criarEntry} />

              <TravessiaResumoBloco
                items={travessia}
                contadores={contadores}
                onVerTudo={() => setTab('travessia')}
              />
            </div>
          )}

          {tab === 'jardim' && (
            <MeuJardimSecao
              entries={minhasEntries}
              userId={user?.id || ''}
              saving={saving}
              onCriar={criarEntry}
              onToggleShare={toggleSharedWithTherapist}
            />
          )}

          {tab === 'terapeuta' && (
            <DaTerapeutaSecao
              orientacoes={orientacoes}
              entriesTerapeuta={entriesTerapeuta}
              praticas={praticas}
              sessoesCompartilhadas={sessoesCompartilhadas}
              onCompletarOrientacao={completar}
              onResponderOrientacao={responder}
              onMarcarVistaOrientacao={marcarVista}
            />
          )}

          {tab === 'praticas' && <PraticasSecao praticas={praticas} />}

          {tab === 'travessia' && <TravessiaSecao items={travessia} />}
        </div>
      </div>
    </AppLayout>
  );
}
