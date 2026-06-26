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
  ChevronRight, Sparkles, Wand2, HelpCircle, ArrowRight
} from 'lucide-react';
import { useEssencia8020 } from '@/hooks/useEssencia8020';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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
            className="gap-2 border-primary/30 hover:border-primary/60 bg-primary/5 text-primary hover:bg-primary/10 transition-all font-medium rounded-full px-6"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            Laboratório 80/20
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[92vh] p-0 overflow-hidden bg-[#070509] border-white/5 shadow-[0_0_100px_rgba(0,0,0,1)] ring-1 ring-white/10">
        <div className="flex flex-col h-full relative">
          {/* Luzes de Fundo */}
          <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

          {/* Header Premium Apple-style */}
          <div className="relative shrink-0 pt-12 pb-8 px-8 md:px-12 border-b border-white/[0.03]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-4 max-w-2xl">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <FlaskConical className="w-4 h-4 text-primary" />
                  </div>
                  <Badge variant="outline" className="bg-white/5 text-primary border-primary/20 uppercase tracking-[0.3em] text-[10px] py-1 px-3 rounded-full font-bold">
                    Módulo Oficial
                  </Badge>
                  <div className="flex items-center gap-1.5 text-gold/80">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">80/20 Essence</span>
                  </div>
                </motion.div>
                
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-5xl font-display text-white leading-[1.1] tracking-tight"
                >
                  {bookTitle}
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-white/40 text-base md:text-lg font-serif italic leading-relaxed"
                >
                  "O núcleo simbólico e aplicável: a essência destilada para sua prática clínica."
                </motion.p>
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="hidden md:block pb-2"
              >
                <div className="text-right">
                  <div className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold mb-1">Status do Módulo</div>
                  <div className="flex items-center gap-2 justify-end">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <span className="text-xs text-emerald-500 font-bold uppercase tracking-widest">Ativo & Verificado</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-8 md:p-12 space-y-16 pb-24">
              
              {/* Grid Principal - 1 a 5 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                <div className="space-y-12">
                  <EssenciaItem 
                    number="01"
                    icon={<Target className="w-5 h-5" />}
                    title="Núcleo Vivo"
                    content={essencia?.nucleo_vivo}
                    accentColor="primary"
                  />
                  <EssenciaItem 
                    number="02"
                    icon={<Zap className="w-5 h-5" />}
                    title="Tensão Central"
                    content={essencia?.tensao_central}
                    accentColor="amber"
                  />
                  <EssenciaItem 
                    number="03"
                    icon={<ImageIcon className="w-5 h-5" />}
                    title="Imagem Organizadora"
                    content={essencia?.imagem_organizadora}
                    accentColor="emerald"
                  />
                </div>
                
                <div className="space-y-12">
                  <EssenciaItem 
                    number="04"
                    icon={<Stethoscope className="w-5 h-5" />}
                    title="Aplicação Terapêutica"
                    content={essencia?.aplicacao_terapeutica}
                    accentColor="blue"
                  />
                  <EssenciaItem 
                    number="05"
                    icon={<AlertTriangle className="w-5 h-5" />}
                    title="Distorções Comuns"
                    content={essencia?.distorcao_comum}
                    accentColor="red"
                  />
                </div>
              </div>

              {/* Resumo Premium - Estilo Quote Apple */}
              {essencia?.resumo_premium && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-gold/10 to-primary/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                  <div className="relative bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 md:p-14 overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                      <BookOpen className="w-40 h-40 text-primary" />
                    </div>
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <h4 className="text-gold font-display text-xl md:text-2xl tracking-tight">O Olhar Oracular</h4>
                      </div>
                      <div className="text-white/70 text-lg md:text-xl leading-relaxed font-serif italic whitespace-pre-wrap pl-2 border-l-2 border-primary/30">
                        {essencia?.resumo_premium}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Perguntas Clínicas - 06 */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-display text-2xl md:text-3xl tracking-tight">
                      06. Perguntas Clínicas
                    </h4>
                    <p className="text-white/40 text-sm font-medium uppercase tracking-[0.2em] mt-1">Instrumentalizando a escuta</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {essencia?.perguntas_clinicas?.map((q, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="group flex gap-5 bg-white/[0.02] hover:bg-white/[0.04] p-6 rounded-3xl border border-white/5 hover:border-primary/20 transition-all duration-500"
                    >
                      <div className="text-primary font-display text-2xl opacity-40 group-hover:opacity-100 transition-opacity">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <p className="text-white/80 text-base font-serif leading-relaxed mt-1">
                        {q}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Exercício Integrativo - 07 */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-gold/10 pointer-events-none" />
                <div className="bg-[#0D0B14] border border-primary/20 rounded-[3rem] p-10 md:p-16 space-y-8 relative">
                  <div className="absolute -bottom-20 -right-20 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-1000">
                    <Wand2 className="w-80 h-80 text-gold" />
                  </div>
                  
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-gold font-display text-2xl md:text-4xl tracking-tight">
                        07. Exercício Integrativo
                      </h4>
                      <p className="text-gold/50 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">Transmutação & Prática</p>
                    </div>
                  </div>
                  
                  <div className="text-white/90 text-lg md:text-2xl leading-relaxed font-serif italic relative z-10 max-w-3xl">
                    {essencia?.exercicio}
                  </div>
                </div>
              </motion.div>

              {/* Riscos Éticos */}
              {essencia?.riscos_eticos && (
                <div className="pt-10 space-y-4">
                  <div className="flex items-center gap-3 text-red-400/80">
                    <AlertTriangle className="w-4 h-4" />
                    <h5 className="text-[10px] font-bold uppercase tracking-[0.3em]">Riscos Éticos & Cautelas</h5>
                  </div>
                  <div className="bg-red-500/[0.03] border border-red-500/10 rounded-2xl p-6 text-sm text-red-200/40 font-serif italic leading-relaxed">
                    "{essencia?.riscos_eticos}"
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer Navigation Bar */}
          <div className="shrink-0 p-8 md:px-12 bg-black/40 backdrop-blur-xl border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <div className="flex items-center gap-2 text-white/30 text-[10px] uppercase tracking-[0.3em] font-bold">
                <FlaskConical className="w-3.5 h-3.5" />
                Laboratório 80/20 do Clube
              </div>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Button 
                onClick={() => navigate('/clube/espelho-do-conto')}
                className="flex-1 md:flex-none h-14 rounded-full bg-gold hover:bg-gold/90 text-[#070509] font-bold px-10 gap-3 shadow-[0_10px_30px_rgba(234,179,8,0.3)] hover:shadow-[0_15px_40px_rgba(234,179,8,0.4)] group transition-all duration-500"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                Entrar no Espelho do Conto
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EssenciaItem({ 
  number, 
  icon, 
  title, 
  content, 
  accentColor 
}: { 
  number: string; 
  icon: React.ReactNode; 
  title: string; 
  content?: string | null;
  accentColor: string;
}) {
  if (!content) return null;
  
  const colors: Record<string, string> = {
    primary: 'text-primary border-primary/20 bg-primary/5',
    amber: 'text-amber-400 border-amber-400/20 bg-amber-400/5',
    emerald: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
    blue: 'text-blue-400 border-blue-400/20 bg-blue-400/5',
    red: 'text-red-400 border-red-400/20 bg-red-400/5',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-4 group"
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-500 group-hover:scale-110",
          colors[accentColor]
        )}>
          {icon}
        </div>
        <div className="space-y-0.5">
          <div className="text-[10px] text-white/30 font-bold uppercase tracking-[0.3em]">{number}</div>
          <h5 className="text-white font-display text-lg tracking-tight group-hover:text-gold transition-colors">
            {title}
          </h5>
        </div>
      </div>
      <div className="relative pl-14">
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-white/5 group-hover:bg-primary/20 transition-colors" />
        <p className="text-white/60 text-base font-serif leading-relaxed italic group-hover:text-white/80 transition-colors">
          {content}
        </p>
      </div>
    </motion.div>
  );
}
