import React from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogDescription, DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  FlaskConical, Target, Zap, Image as ImageIcon, 
  Stethoscope, AlertTriangle, BookOpen, MessageSquare, 
  ChevronRight, Sparkles, Wand2, HelpCircle
} from 'lucide-react';
import { useEssencia8020 } from '@/hooks/useEssencia8020';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface Laboratorio8020ModalProps {
  bookId: string;
  bookTitle: string;
  trigger?: React.ReactNode;
}

export function Laboratorio8020Modal({ bookId, bookTitle, trigger }: Laboratorio8020ModalProps) {
  const { data: essencia, isLoading } = useEssencia8020(bookId);
  const navigate = useNavigate();

  if (!essencia && !isLoading) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-primary/30 hover:border-primary/60 bg-primary/5 text-primary hover:bg-primary/10 transition-all font-medium"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            🧪 Ver Laboratório 80/20
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-[#0A0714] border-primary/20 shadow-glow">
        <div className="flex flex-col h-full">
          {/* Header Premium */}
          <div className="relative h-44 flex-shrink-0 bg-gradient-to-r from-[#1A1625] to-[#0F0D15] p-8 border-b border-primary/10">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <FlaskConical className="w-32 h-32 text-primary" />
            </div>
            
            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 uppercase tracking-[0.2em] text-[9px] py-0.5">
                  Módulo Oficial
                </Badge>
                <div className="flex items-center gap-1 text-gold">
                  <Sparkles className="w-3 h-3" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Laboratório 80/20</span>
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-display text-foreground leading-tight">
                {bookTitle}
              </h2>
              <p className="text-muted-foreground text-sm font-body italic max-w-2xl">
                O núcleo simbólico e aplicável: a essência destilada para sua prática clínica.
              </p>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6 md:p-8 space-y-10 pb-12">
              {/* Seção 1: O Núcleo do Laboratório */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <EssenciaItem 
                    icon={<Target className="text-primary" />}
                    title="1. Núcleo Vivo"
                    content={essencia?.nucleo_vivo}
                  />
                  <EssenciaItem 
                    icon={<Zap className="text-amber-500" />}
                    title="2. Tensão Central"
                    content={essencia?.tensao_central}
                  />
                  <EssenciaItem 
                    icon={<ImageIcon className="text-emerald-500" />}
                    title="3. Imagem Organizadora"
                    content={essencia?.imagem_organizadora}
                  />
                </div>
                <div className="space-y-6">
                  <EssenciaItem 
                    icon={<Stethoscope className="text-blue-400" />}
                    title="4. Aplicação Terapêutica"
                    content={essencia?.aplicacao_terapeutica}
                  />
                  <EssenciaItem 
                    icon={<AlertTriangle className="text-red-400" />}
                    title="5. Distorções Comuns"
                    content={essencia?.distorcao_comum}
                  />
                </div>
              </div>

              {/* Seção 2: Resumo Premium */}
              <div className="bg-[#13101C]/50 border border-primary/10 rounded-3xl p-6 md:p-8 space-y-4">
                <h4 className="flex items-center gap-2 text-gold font-display text-lg">
                  <BookOpen className="w-5 h-5" />
                  Resumo Premium
                </h4>
                <div className="text-muted-foreground text-sm leading-relaxed font-body whitespace-pre-wrap">
                  {essencia?.resumo_premium}
                </div>
              </div>

              {/* Seção 3: Perguntas Clínicas */}
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 text-primary font-display text-lg">
                  <HelpCircle className="w-5 h-5" />
                  6. Perguntas Clínicas
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {essencia?.perguntas_clinicas?.map((q, i) => (
                    <div key={i} className="flex gap-3 text-sm text-foreground bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-primary/20 transition-colors">
                      <span className="text-primary font-bold">0{i+1}.</span>
                      <span className="font-body leading-relaxed">{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seção 4: Exercício Integrativo */}
              <div className="bg-gradient-to-br from-primary/10 to-gold/10 border border-primary/20 rounded-3xl p-6 md:p-8 space-y-4 relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 opacity-10">
                  <Wand2 className="w-40 h-40 text-gold" />
                </div>
                <h4 className="flex items-center gap-2 text-gold font-display text-lg relative z-10">
                  <Sparkles className="w-5 h-5" />
                  7. Exercício Integrativo
                </h4>
                <div className="text-foreground text-sm md:text-base leading-relaxed font-body relative z-10">
                  {essencia?.exercicio}
                </div>
              </div>

              {/* Riscos Éticos */}
              {essencia?.riscos_eticos && (
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 text-red-500/80 font-display text-lg">
                    <AlertTriangle className="w-5 h-5" />
                    Riscos Éticos & Cautelas
                  </h4>
                  <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-5 text-sm text-muted-foreground font-body leading-relaxed italic">
                    {essencia?.riscos_eticos}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer CTA */}
          <div className="p-6 bg-[#0A0714] border-t border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-muted-foreground text-[11px] uppercase tracking-wider font-medium">
              <FlaskConical className="w-4 h-4" />
              Laboratório 80/20 do Clube
            </div>
            <Button 
              onClick={() => navigate('/clube/chat-livro')}
              className="w-full sm:w-auto rounded-full bg-gold hover:bg-gold/90 text-[#0A0714] font-bold px-8 py-6 gap-2 shadow-gold group transition-all"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              Converse com o Livro
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EssenciaItem({ icon, title, content }: { icon: React.ReactNode; title: string; content?: string | null }) {
  if (!content) return null;
  return (
    <div className="space-y-1.5 group">
      <div className="flex items-center gap-2">
        <div className="p-1 rounded bg-white/5 border border-white/5 group-hover:border-primary/30 transition-colors">
          {icon}
        </div>
        <h5 className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground group-hover:text-foreground transition-colors">
          {title}
        </h5>
      </div>
      <p className="text-sm text-foreground/90 font-body leading-relaxed pl-8">
        {content}
      </p>
    </div>
  );
}
