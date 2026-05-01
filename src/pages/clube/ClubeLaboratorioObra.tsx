import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Compass, Eye, Hammer, Loader2, FlaskConical, CheckCircle2, MessagesSquare, Sparkles } from 'lucide-react';
import { Laboratorio8020Modal } from '@/components/clube/Laboratorio8020Modal';
import { useLabOracularConfig, useLabOracularProgress, useSaveLabOracular, callLabOracularIa, type LabOrigem } from '@/hooks/useLabOracular';
import { CartografiaPhase } from '@/components/clube/laboratorio/CartografiaPhase';
import { EspelhoPhase } from '@/components/clube/laboratorio/EspelhoPhase';
import { ForjaPhase } from '@/components/clube/laboratorio/ForjaPhase';
import { EncarnacaoPhase } from '@/components/clube/laboratorio/EncarnacaoPhase';
import { toast } from 'sonner';

// /clube/laboratorio/:tipo/:id  →  tipo: 'season' | 'book'

type Fase = 'cartografia' | 'espelho' | 'forja' | 'encarnacao';

export default function ClubeLaboratorioObra() {
  const { tipo, id } = useParams<{ tipo: 'season' | 'book'; id: string }>();
  const navigate = useNavigate();
  const [fase, setFase] = useState<Fase>('cartografia');

  const origem: LabOrigem | null = useMemo(() => {
    if (!tipo || !id) return null;
    if (tipo === 'season') return { kind: 'season', seasonId: id };
    if (tipo === 'book') return { kind: 'book', bookId: id };
    return null;
  }, [tipo, id]);

  // Carregar dados da obra (estação OU livro)
  const { data: obra, isLoading: loadingObra } = useQuery({
    queryKey: ['lab-obra', tipo, id],
    enabled: !!tipo && !!id,
    queryFn: async () => {
      if (tipo === 'season') {
        const { data, error } = await supabase
          .from('clube_estacoes')
          .select('id, titulo, livro_titulo, livro_autor, livro_capa_url')
          .eq('id', id!)
          .maybeSingle();
        if (error) throw error;
        return data ? {
          titulo: data.titulo,
          livro_titulo: data.livro_titulo,
          livro_autor: data.livro_autor,
          capa: data.livro_capa_url,
        } : null;
      }
      const { data, error } = await supabase
        .from('books')
        .select('id, title, author, cover_url')
        .eq('id', id!)
        .maybeSingle();
      if (error) throw error;
      return data ? {
        titulo: data.title,
        livro_titulo: data.title,
        livro_autor: data.author,
        capa: data.cover_url,
      } : null;
    },
  });

  const { data: config } = useLabOracularConfig(origem);
  const { data: progresso, isLoading: loadingProg } = useLabOracularProgress(origem);
  const save = useSaveLabOracular(origem);

  type LabFase = 'cartografia' | 'espelho' | 'forja';
  const [iaLoading, setIaLoading] = useState<LabFase | null>(null);

  async function rodarIa(modo: LabFase, inputs: Record<string, unknown>) {
    if (!obra) return;
    try {
      setIaLoading(modo);
      const analise = await callLabOracularIa({
        modo,
        obra: { titulo: obra.livro_titulo, autor: obra.livro_autor },
        contexto_autoral: config,
        inputs,
      });
      const fieldMap: Record<LabFase, string> = {
        cartografia: 'cart_analise_ia',
        espelho: 'esp_analise_ia',
        forja: 'forja_plano_ia',
      };
      const statusMap: Record<LabFase, string> = {
        cartografia: 'cart_status',
        espelho: 'esp_status',
        forja: 'forja_status',
      };
      await save.mutateAsync({
        [fieldMap[modo]]: analise,
        [statusMap[modo]]: 'completed',
      } as any);
      toast.success('Análise pronta');
    } catch (e: any) {
      toast.error(e?.message || 'Falha na IA');
    } finally {
      setIaLoading(null);
    }
  }

  if (loadingObra || loadingProg) {
    return <AppLayout><div className="flex justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div></AppLayout>;
  }
  if (!obra) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Obra não encontrada.</p>
          <Link to="/clube/laboratorio"><Button variant="outline" className="mt-4">Voltar</Button></Link>
        </div>
      </AppLayout>
    );
  }

  const phaseStatus = {
    cartografia: progresso?.cart_status || 'not_started',
    espelho: progresso?.esp_status || 'not_started',
    forja: progresso?.forja_status || 'not_started',
    encarnacao: 'not_started',
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <Button variant="ghost" size="icon" onClick={() => navigate('/clube/laboratorio')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <FlaskConical className="w-4 h-4 text-primary flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Laboratório Oracular</p>
              <h1 className="font-display text-base text-foreground truncate">{obra.livro_titulo}</h1>
            </div>
            {origem?.kind === 'book' && (
              <Laboratorio8020Modal 
                bookId={origem.bookId} 
                bookTitle={obra.livro_titulo} 
                trigger={
                  <Button variant="outline" size="sm" className="h-8 gap-2 border-gold/30 hover:border-gold/60 bg-gold/5 text-gold hover:bg-gold/10 transition-all font-medium">
                    <Sparkles className="w-3 h-3" />
                    80/20
                  </Button>
                }
              />
            )}
          </div>
        </div>

        {/* Stepper */}
        <Card className="p-3 mb-4">
          <div className="grid grid-cols-4 gap-2">
            <PhaseStep active={fase === 'cartografia'} status={phaseStatus.cartografia} icon={<Compass className="w-4 h-4" />} label="Cartografia" onClick={() => setFase('cartografia')} />
            <PhaseStep active={fase === 'espelho'} status={phaseStatus.espelho} icon={<Eye className="w-4 h-4" />} label="Espelho" onClick={() => setFase('espelho')} />
            <PhaseStep active={fase === 'forja'} status={phaseStatus.forja} icon={<Hammer className="w-4 h-4" />} label="Forja" onClick={() => setFase('forja')} />
            <PhaseStep active={fase === 'encarnacao'} status={phaseStatus.encarnacao} icon={<MessagesSquare className="w-4 h-4" />} label="Encarnação" onClick={() => setFase('encarnacao')} />
          </div>
        </Card>

        {/* Fase ativa */}
        {fase === 'cartografia' && (
          <CartografiaPhase
            progresso={progresso}
            config={config}
            onSave={(patch) => save.mutate({ ...patch, cart_status: 'in_progress' } as any)}
            onRunIa={(inputs) => rodarIa('cartografia', inputs)}
            iaLoading={iaLoading === 'cartografia'}
            onNext={() => setFase('espelho')}
          />
        )}
        {fase === 'espelho' && (
          <EspelhoPhase
            progresso={progresso}
            config={config}
            onSave={(patch) => save.mutate({ ...patch, esp_status: 'in_progress' } as any)}
            onRunIa={(inputs) => rodarIa('espelho', inputs)}
            iaLoading={iaLoading === 'espelho'}
            onNext={() => setFase('forja')}
            onBack={() => setFase('cartografia')}
          />
        )}
        {fase === 'forja' && (
          <ForjaPhase
            progresso={progresso}
            config={config}
            onSave={(patch) => save.mutate({ ...patch, forja_status: 'in_progress' } as any)}
            onRunIa={(inputs) => rodarIa('forja', inputs)}
            iaLoading={iaLoading === 'forja'}
            onConcluir={() => save.mutate({ concluido: true, concluido_em: new Date().toISOString(), forja_status: 'completed' } as any)}
            onBack={() => setFase('espelho')}
          />
        )}
        {fase === 'encarnacao' && (
          <EncarnacaoPhase
            progresso={progresso}
            obra={{ titulo: obra.livro_titulo, autor: obra.livro_autor }}
            onBack={() => setFase('forja')}
          />
        )}
      </div>
    </AppLayout>
  );
}

function PhaseStep({ active, status, icon, label, onClick }: { active: boolean; status: string; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 py-2 px-2 rounded transition text-xs ${
        active ? 'bg-primary/10 text-primary border border-primary/30' : 'text-muted-foreground hover:bg-muted/50 border border-transparent'
      }`}
    >
      <div className="flex items-center gap-1">
        {icon}
        {status === 'completed' && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
      </div>
      <span className="font-medium">{label}</span>
    </button>
  );
}
