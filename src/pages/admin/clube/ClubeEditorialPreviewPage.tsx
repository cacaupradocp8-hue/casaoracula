import React, { Suspense, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { 
  Compass, 
  ArrowLeft, 
  Eye, 
  DoorOpen, 
  Layers, 
  Layout, 
  ShieldAlert, 
  MapPin, 
  Headphones,
  FlaskConical,
  Clock,
  Mic2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AppLayout } from '@/components/layout/AppLayout';
import { cn } from '@/lib/utils';
import { AudioOracular } from '@/components/audio/AudioOracular';
import { ClubeTravessiaProgress, TravessiaStep } from '@/components/clube/ClubeTravessiaProgress';
import { ErrorBoundary } from 'react-error-boundary';

function PreviewErrorFallback({ error, resetErrorBoundary }: any) {
  useEffect(() => {
    console.error("[PREVIEW_CRITICAL_ERROR]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-midnight flex flex-col items-center justify-center p-8 text-center space-y-4">
      <AlertTriangle className="w-12 h-12 text-destructive mb-2" />
      <h2 className="text-2xl font-display text-white">Erro no Render do Preview</h2>
      <p className="text-white/60 max-w-md font-mono text-xs bg-white/5 p-4 rounded-lg break-all">
        {error.message}
      </p>
      <div className="flex flex-col gap-2">
        <Button onClick={resetErrorBoundary} variant="outline">Tentar Novamente</Button>
        <Button onClick={() => window.location.href = '/admin'} variant="ghost">Voltar ao Painel</Button>
      </div>
    </div>
  );
}



export default function ClubeEditorialPreviewPage() {
  return (
    <ErrorBoundary FallbackComponent={PreviewErrorFallback}>
      <ClubeEditorialPreviewContent />
    </ErrorBoundary>
  );
}

function ClubeEditorialPreviewContent() {
  const { itemId } = useParams();
  const navigate = useNavigate();


  // Fetch the item
  const { data: item, isLoading: loadingItem } = useQuery({
    queryKey: ['admin-preview-item', itemId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_rota_itens')
        .select(`
          *,
          estacao:clube_estacoes(*)
        `)
        .eq('id', itemId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!itemId
  });

  // Fetch sibling items for the timeline preview
  const { data: siblingItems } = useQuery({
    queryKey: ['admin-preview-siblings', item?.estacao_id],
    queryFn: async () => {
      if (!item?.estacao_id) return [];
      const { data, error } = await supabase
        .from('clube_rota_itens')
        .select('*')
        .eq('estacao_id', item.estacao_id)
        .order('ordem');
      if (error) throw error;
      return data || [];
    },
    enabled: !!item?.estacao_id
  });

  if (loadingItem) {
    return (
      <div className="fixed inset-0 bg-midnight flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}>
          <Compass className="w-12 h-12 text-gold/40" />
        </motion.div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-midnight flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl text-white mb-4">Item não encontrado</h2>
        <Button onClick={() => navigate('/admin')}>Voltar ao Painel</Button>
      </div>
    );
  }

  const estacao = item.estacao as any;
  
  console.info("[PREVIEW_DEBUG] Processando item:", item.titulo, "Estacao:", estacao?.titulo);

  
  let metadata: any = {};
  try {
    if (typeof item.metadata === 'string') {
      metadata = JSON.parse(item.metadata);
    } else {
      metadata = item.metadata || {};
    }
    // Final safety check to ensure metadata is an object and not null
    if (!metadata || typeof metadata !== 'object') {
      metadata = {};
    }
  } catch (e) {
    console.error("Error parsing metadata:", e);
    metadata = {};
  }
  
  const audios = Array.isArray(metadata.audios) ? metadata.audios : [];
  const placeholders = Array.isArray(metadata.audio_placeholders) ? metadata.audio_placeholders : [];
  
  const cartografia = [
    { label: 'Onde você está', value: estacao?.titulo, icon: MapPin },
    { label: 'A Porta', value: item.porta, icon: DoorOpen },
    { label: 'O Campo', value: item.campo, icon: Layers },
    { label: 'A Torre', value: item.torre, icon: Layout },
    { label: 'O Labirinto', value: item.labirinto, icon: ShieldAlert },
  ].filter(c => c.value && typeof c.value === 'string' && c.value.trim());

  // Mocked steps for preview progress
  const mockSteps: TravessiaStep[] = (siblingItems || []).map(sib => ({
    id: sib.id,
    label: sib.titulo || 'Sem título',
    icon: Compass,
    status: sib.id === item.id ? 'in_progress' : (sib.ordem < (item.ordem || 0) ? 'completed' : 'not_started')
  }));

  console.info("[PREVIEW_DEBUG] Rendering content for item:", item.id);

  return (
    <div className="relative bg-midnight text-foreground overflow-x-hidden min-h-screen">

      {/* MODO PREVIEW BANNER */}
      <div className="fixed top-0 left-0 right-0 z-[100] bg-gold text-midnight py-2 px-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
          <Eye className="w-4 h-4" />
          <span>Modo Preview — Apenas para Admin</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/admin?tab=clube-editorial')}
          className="h-8 gap-2 hover:bg-midnight/10 text-midnight border-midnight/20 border"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Editorial
        </Button>
      </div>

      <AppLayout>
        <div className="pt-12">
          {/* Hero Section */}
          <section className="relative min-h-[70vh] flex items-center justify-center px-4 z-10 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-30">
              {item.image_url ? (
                <img src={item.image_url} alt="" className="w-full h-full object-cover mix-blend-luminosity" />
              ) : estacao?.banner_url ? (
                <img src={estacao.banner_url} alt="" className="w-full h-full object-cover" />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-b from-midnight/20 via-midnight/60 to-midnight" />
            </div>

            <div className="relative z-10 text-center w-full max-w-4xl mx-auto space-y-6">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] tracking-[0.6em] uppercase text-gold/60 font-medium">
                  {estacao?.livro_titulo || 'Estação Oracular'}
                </span>
                <span className="text-[12px] italic font-serif text-white/30">
                  Travessia: {estacao?.titulo}
                </span>
              </div>

              <h1 className="font-display font-light leading-[0.95] tracking-tighter text-5xl md:text-7xl lg:text-8xl">
                <span className="bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent">
                  {item.titulo}
                </span>
              </h1>

              {item.subtitulo && (
                <p className="font-serif italic text-xl md:text-3xl text-white/40 max-w-2xl mx-auto">
                  "{item.subtitulo}"
                </p>
              )}
            </div>
          </section>

          {/* Progress & Content */}
          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-12 space-y-16 pb-24">
            <ClubeTravessiaProgress steps={mockSteps} className="mb-12" />

            {/* Cartografia & Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start" id="mapa-vivo">
              <div className="lg:col-span-5 grid grid-cols-1 gap-4">
                {cartografia.map((c, i) => (
                  <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl border border-gold/10 bg-gold/[0.03] flex items-center justify-center">
                        <c.icon className="w-5 h-5 text-gold/60" />
                      </div>
                      <div>
                        <p className="text-[8px] tracking-[0.4em] uppercase text-white/30 font-bold">{c.label}</p>
                        <p className="font-display text-lg text-white/90">{c.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-7 relative pl-12 border-l border-gold/10">
                {(siblingItems || []).map((sib, idx) => (
                  <div key={sib.id} className={cn(
                    "relative mb-8 p-4 rounded-xl transition-all",
                    sib.id === item.id ? "bg-white/[0.04] border border-white/10" : "opacity-40"
                  )}>
                    <div className={cn(
                      "absolute -left-[54px] top-6 w-4 h-4 rounded-full border",
                      sib.id === item.id ? "bg-gold border-gold shadow-[0_0_20px_rgba(212,175,55,0.5)]" : "bg-midnight border-white/20"
                    )} />
                    <p className="text-[8px] tracking-[0.4em] uppercase font-bold text-white/30">PASSO {idx + 1}</p>
                    <h3 className="font-display text-xl">{sib.titulo}</h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Audios Section */}
            {(audios.length > 0 || placeholders.length > 0) && (
              <div className="space-y-8 py-12 border-t border-white/5" id="audios-da-estacao">
                <div className="text-center">
                  <Badge variant="outline" className="border-gold/30 text-gold/60 mb-2">AUDIOTECA</Badge>
                  <h2 className="font-display text-3xl md:text-4xl text-white">Escuta Profunda</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {audios.map((audio: any, i: number) => {
                    if (!audio || !audio.url) return null;
                    return (
                      <AudioOracular 
                        key={`audio-${i}`} 
                        titulo={audio.titulo || `Áudio ${i+1}`} 
                        audioUrl={audio.url} 
                      />
                    );
                  })}
                  {placeholders.map((ph: any, i: number) => (
                    <div key={`ph-${i}`} className="rounded-xl border border-white/5 bg-white/[0.01] p-6 flex items-center justify-between opacity-50 grayscale">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                          <Mic2 className="w-4 h-4 text-white/20" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white/60">{ph.titulo}</p>
                          <p className="text-[10px] uppercase tracking-wider text-white/20">{ph.taxonomia || 'Aguardando'}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] border-white/10 text-white/20">EM PRODUÇÃO</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Jardim Section */}
            {item.jardim_prompt && (
              <div className="space-y-8 py-12 border-t border-white/5">
                <div className="text-center">
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-500/60 mb-2">JARDIM DA PSIQUE</Badge>
                  <h2 className="font-display text-3xl md:text-4xl text-white">Escrita Íntima</h2>
                </div>
                <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-emerald-500/[0.02] border border-emerald-500/10">
                  <p className="text-lg md:text-xl font-serif italic text-white/70 leading-relaxed text-center whitespace-pre-wrap">
                    {item.jardim_prompt}
                  </p>
                </div>
              </div>
            )}

            {/* Laboratório Section */}
            {item.cenario_treinamento && (
              <div className="space-y-8 py-12 border-t border-white/5">
                <div className="text-center">
                  <Badge variant="outline" className="border-gold/30 text-gold/60 mb-2">LABORATÓRIO 80/20</Badge>
                  <h2 className="font-display text-3xl md:text-4xl text-white">Prática Objetiva</h2>
                </div>
                <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-gold/[0.02] border border-gold/10">
                  <div className="text-sm md:text-base text-white/70 leading-relaxed whitespace-pre-wrap">
                    {item.cenario_treinamento}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </AppLayout>
    </div>
  );
}
