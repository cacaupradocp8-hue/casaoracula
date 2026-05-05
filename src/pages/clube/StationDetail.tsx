import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Loader2, 
  BookText, 
  BrainCircuit, 
  HelpCircle, 
  Dumbbell, 
  FileText,
  CheckCircle2
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { Button } from '@/components/ui/button';
import { useStationDetail, useUpdateProgress, UserProgressV3 } from '@/hooks/useClubeV3';
import { AudioBlock } from '@/components/clube-v3/AudioBlock';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

export default function StationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useStationDetail(id);
  const updateProgress = useUpdateProgress();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!data?.station) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">Estação não encontrada.</p>
          <Button onClick={() => navigate('/clube')} variant="outline">Voltar para o Clube</Button>
        </div>
      </AppLayout>
    );
  }

  const { station, audios, content, progress } = data;

  const handleStepComplete = (field: keyof UserProgressV3) => {
    updateProgress.mutate({ stationId: station.id, field, value: true });
  };

  const sections = [
    {
      id: 'letter',
      title: 'Carta da Semana',
      icon: BookText,
      content: content?.letter_content,
      field: 'letter_completed' as keyof UserProgressV3,
      isCompleted: progress?.letter_completed
    },
    {
      id: 'reflection',
      title: 'Reflexão Junguiana',
      icon: BrainCircuit,
      content: content?.jungian_reflection,
      field: 'reflection_completed' as keyof UserProgressV3,
      isCompleted: progress?.reflection_completed
    },
    {
      id: 'question',
      title: 'Pergunta Contemplativa',
      icon: HelpCircle,
      content: content?.contemplative_question,
      field: 'question_completed' as keyof UserProgressV3,
      isCompleted: progress?.question_completed
    },
    {
      id: 'practice',
      title: 'Prática Terapêutica',
      icon: Dumbbell,
      content: content?.therapeutic_practice,
      field: 'practice_completed' as keyof UserProgressV3,
      isCompleted: progress?.practice_completed
    },
    {
      id: 'support',
      title: 'Material de Apoio',
      icon: FileText,
      content: content?.support_material,
      field: null,
      isCompleted: false
    }
  ].filter(s => s.content);

  return (
    <AppLayout>
      <ResponsiveContainer size="full" className="py-8 md:py-16 px-4 max-w-4xl mx-auto">
        <div className="space-y-12">
          
          {/* Nav & Header */}
          <div className="space-y-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gold/60 hover:text-gold gap-2 p-0 h-auto"
              onClick={() => navigate('/clube')}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para a Estrada
            </Button>

            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-serif text-foreground/90">{station.title}</h1>
              <p className="text-gold/60 text-sm font-medium uppercase tracking-[0.2em]">{station.subtitle}</p>
              <p className="text-muted-foreground/70 text-sm max-w-2xl leading-relaxed">{station.description}</p>
            </div>
          </div>

          {/* 1. Audio Block */}
          <section>
            <AudioBlock stationId={station.id} audios={audios} progress={progress} />
          </section>

          {/* Other Sections */}
          <div className="space-y-16">
            {sections.map((section, idx) => (
              <motion.section 
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6 scroll-mt-20"
                id={section.id}
              >
                <div className="flex items-center justify-between border-b border-gold/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold/5 flex items-center justify-center text-gold">
                      <section.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-serif text-foreground/90">{section.title}</h3>
                  </div>
                  {section.isCompleted && (
                    <div className="flex items-center gap-2 text-gold text-[10px] font-bold uppercase tracking-widest">
                      <CheckCircle2 className="w-3 h-3" />
                      Concluído
                    </div>
                  )}
                </div>

                <div className="prose prose-invert prose-gold max-w-none prose-p:text-muted-foreground/80 prose-p:leading-relaxed prose-headings:font-serif">
                  <ReactMarkdown>{section.content}</ReactMarkdown>
                </div>

                {section.field && !section.isCompleted && (
                  <Button 
                    variant="outline" 
                    className="border-gold/20 hover:bg-gold/5 text-gold/80 hover:text-gold w-full md:w-auto rounded-full px-8"
                    onClick={() => handleStepComplete(section.field!)}
                  >
                    Marcar como concluído
                  </Button>
                )}
              </motion.section>
            ))}
          </div>

          {/* Footer Navigation */}
          <div className="pt-12 border-t border-border/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Fim da Estação</p>
              <p className="text-sm text-muted-foreground/60 italic">"Cada passo é uma integração da alma."</p>
            </div>
            <Button 
              variant="gold" 
              className="rounded-full px-12 h-12 font-bold shadow-lg shadow-gold/10"
              onClick={() => navigate('/clube')}
            >
              Continuar Jornada
            </Button>
          </div>

        </div>
      </ResponsiveContainer>
    </AppLayout>
  );
}
