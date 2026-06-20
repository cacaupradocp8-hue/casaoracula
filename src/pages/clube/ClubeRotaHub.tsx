import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRotaHub } from '@/hooks/useClubeTemplate';
import { useRotaProgresso } from '@/hooks/useRotaProgresso';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useFounderAccess } from '@/hooks/useFounderAccess';
import { AppLayout } from '@/components/layout/AppLayout';
import { RotaHubHero } from '@/components/clube/rota-template/RotaHubHero';
import { RotaLivroBanner } from '@/components/clube/rota-template/RotaLivroBanner';
import { RotaEstacoesGrid } from '@/components/clube/rota-template/RotaEstacoesGrid';
import { RotaPropositoTese } from '@/components/clube/rota-template/RotaPropositoTese';
import { Card } from '@/components/ui/card';
import { Loader2, MessageSquare, ArrowRight } from 'lucide-react';

export default function ClubeRotaHub() {
  const { rotaSlug = 'rota-dos-lobos' } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useRotaHub(rotaSlug);
  const { data: progresso } = useRotaProgresso(data?.rota?.id);
  const { isActive: isFounderActive } = useFounderAccess();

  const { isPlaying, togglePlay } = useAudioPlayer({
    audioUrl: data?.rota?.audio_acolhimento_url
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (error || !data?.rota) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white font-serif">
          Rota não encontrada.
        </div>
      </AppLayout>
    );
  }

  const { rota, estacoes } = data;

  const irParaEstacao1 = () => {
    if (estacoes?.[0]) {
      navigate(`/clube/rota/${estacoes[0].slug}`);
    }
  };

  return (
    <AppLayout>
      <div className="bg-[#020617] text-white min-h-screen overflow-x-hidden font-sans selection:bg-gold/30 selection:text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-12 pb-20">
          
          <RotaHubHero 
            titulo={rota.titulo}
            fraseGuia={rota.frase_guia}
            descricao={rota.descricao}
            bannerUrl={rota.banner_url || ''}
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            onEnter={irParaEstacao1}
          />

          <div className="max-w-4xl mx-auto">
            <RotaLivroBanner 
              obraRegente={rota.obra_regente}
              capaUrl={rota.livro_capa_url}
              onAction={irParaEstacao1}
            />
          </div>

          <RotaPropositoTese />

          <div className="max-w-3xl mx-auto">
            <Card
              onClick={() => navigate(`/clube/chat-livro?rota=${rotaSlug}&obra=${encodeURIComponent(rota.obra_regente || '')}&capa=${encodeURIComponent(rota.livro_capa_url || '')}`)}
              className="group cursor-pointer bg-[#0A0A0B]/80 backdrop-blur-xl border border-gold/20 hover:border-gold/60 transition-all duration-500 rounded-3xl p-6 md:p-8 flex items-center gap-5 hover:shadow-[0_0_40px_-12px_rgba(212,175,55,0.4)]"
            >
              <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold/80 font-bold mb-1">Diálogo Simbólico</p>
                <h3 className="text-xl md:text-2xl font-serif text-white">Converse com o Livro</h3>
                <p className="text-sm text-white/50 font-serif italic mt-1">
                  Aprofunde a leitura em um diálogo guiado sobre a obra desta rota.
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gold group-hover:translate-x-1 transition-transform" />
            </Card>
          </div>

          <div className="space-y-12 pt-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-serif text-white">Estações da Jornada</h2>
              <p className="text-gold/60 font-serif italic">Siga o rastro, uma estação por vez.</p>
            </div>

            <RotaEstacoesGrid 
              estacoes={estacoes.map((e, idx) => {
                const concluidas = progresso?.concluidas ?? new Set<string>();
                const isAdmin = progresso?.isAdmin ?? false;
                const publicada = (e as any).publicada !== false && (e as any).ativa !== false;
                const prevConcluida = idx === 0 || concluidas.has(estacoes[idx - 1].id);
                const isConcluida = concluidas.has(e.id);

                let status: 'locked' | 'unlocked' | 'completed';
                if (isAdmin) {
                  status = isConcluida ? 'completed' : 'unlocked';
                } else if (isFounderActive) {
                  // Fundadora: só Clareira do Chamado (estação 1) liberada
                  if (idx === 0) {
                    status = isConcluida ? 'completed' : 'unlocked';
                  } else {
                    status = 'locked';
                  }
                } else if (!publicada) {
                  status = 'locked';
                } else if (prevConcluida) {
                  status = isConcluida ? 'completed' : 'unlocked';
                } else {
                  status = 'locked';
                }

                return {
                  id: e.id,
                  nome: e.nome,
                  status,
                  numero: idx + 1,
                  slug: e.slug,
                  imagemUrl: (e as any).imagem_destaque_url || (e as any).banner_url || (e as any).imagem_url || undefined,
                };
              })}
              onSelect={(slug) => navigate(`/clube/rota/${slug}`)}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
