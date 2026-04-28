import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  ArrowRight, 
  ChevronRight, 
  BookOpen, 
  Compass, 
  Clock, 
  Headphones, 
  MessageSquare, 
  Zap, 
  Flower2, 
  MapPin,
  ChevronDown
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useRotaOracular } from '@/hooks/useRotaOracular';
import { cn } from '@/lib/utils';

export default function ClubeRotaPremium() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { pontos, estacaoAtual, isLoading } = useRotaOracular();

  const ponto = useMemo(() => {
    return pontos.find(p => p.slug === slug);
  }, [pontos, slug]);

  const proximoPonto = useMemo(() => {
    if (!ponto) return null;
    return pontos.find(p => p.ordem === ponto.ordem + 1);
  }, [pontos, ponto]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          >
            <Compass className="w-10 h-10 text-gold opacity-20" />
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  if (!ponto) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <h2 className="font-display text-2xl text-foreground mb-4">Rota não encontrada</h2>
          <Button onClick={() => navigate('/clube')} variant="outline">Voltar para o Clube</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto pb-20 px-4 md:px-0">
        
        {/* 1. HERO SECTION CINEMATOGRÁFICA */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center space-y-6"
          >
            <Badge variant="outline" className="border-gold/30 text-gold/80 bg-gold/5 px-4 py-1 uppercase tracking-widest text-[10px]">
              {estacaoAtual?.livro_titulo || 'Estação Oracular'}
            </Badge>
            
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] max-w-3xl mx-auto">
              {ponto.nome}
            </h1>
            
            <p className="font-serif italic text-lg md:text-xl text-muted-foreground/70 max-w-2xl mx-auto leading-relaxed">
              "{ponto.subtitulo || 'Inicie sua travessia para as profundezas do conhecimento.'}"
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" variant="gold" className="w-full sm:w-auto h-14 px-8 text-base gap-3 shadow-[0_0_20px_rgba(201,169,110,0.2)]">
                Continuar travessia <ArrowRight className="w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base gap-3 border-gold/20 hover:bg-gold/5">
                <Headphones className="w-5 h-5 text-gold" /> Ouvir Áudio
              </Button>
            </div>
          </motion.div>

          {/* Background Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full opacity-20 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[120px]" />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
          
          {/* COLUNA ESQUERDA - CONTEÚDO PRINCIPAL */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* 3. TIMELINE DA TRAVESSIA (Visual de progresso) */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <Compass className="w-5 h-5 text-gold" />
                <h3 className="font-display text-xl uppercase tracking-widest text-foreground/80">Cronologia do Desvendar</h3>
              </div>
              
              <div className="relative pl-8 space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gradient-to-b before:from-gold/50 before:via-gold/20 before:to-transparent">
                {pontos.slice(0, 4).map((item, idx) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative group"
                  >
                    <div className={cn(
                      "absolute -left-[29px] w-5 h-5 rounded-full border-2 border-gold/50 bg-background z-10 transition-all group-hover:scale-125 group-hover:shadow-[0_0_10px_rgba(201,169,110,0.5)]",
                      item.slug === slug && "bg-gold scale-110 shadow-[0_0_15px_rgba(201,169,110,0.4)]"
                    )} />
                    <div className="space-y-2">
                      <span className="text-[10px] text-gold/60 uppercase tracking-tighter">Fase 0{idx + 1}</span>
                      <h4 className={cn(
                        "font-display text-lg transition-colors",
                        item.slug === slug ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}>{item.nome}</h4>
                      {item.slug === slug && (
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
                          Você está neste estágio da jornada. O mergulho torna-se mais denso à medida que as camadas superficiais são deixadas para trás.
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* 4. CARDS DE CONTEÚDOS (Áudios) */}
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Headphones className="w-5 h-5 text-gold" />
                  <h3 className="font-display text-xl uppercase tracking-widest text-foreground/80">Escutas de Poder</h3>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-gold hover:text-gold/80">Ver tudo</Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="group bg-card/20 border-white/5 hover:border-gold/20 transition-all duration-500 overflow-hidden cursor-pointer">
                    <CardContent className="p-0">
                      <div className="flex items-center p-4 gap-4">
                        <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gold/10 flex items-center justify-center">
                          <Play className="w-6 h-6 text-gold group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-0 bg-gold/5 group-hover:bg-transparent transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-gold/60 uppercase mb-1">Áudio de Integração</p>
                          <h4 className="font-display text-base text-foreground group-hover:text-gold transition-colors truncate">O Mistério da {i}ª Noite</h4>
                          <div className="flex items-center gap-3 mt-1 opacity-40">
                            <span className="flex items-center gap-1 text-[10px]"><Clock className="w-3 h-3" /> 12:45</span>
                            <span className="flex items-center gap-1 text-[10px]"><Badge variant="outline" className="text-[8px] h-4 border-white/10 px-1">HD</Badge></span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* 5. CONVERSE COM O LIVRO (IA) */}
            <section className="space-y-8 pt-8">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-gold" />
                <h3 className="font-display text-xl uppercase tracking-widest text-foreground/80">Sussurros da Obra</h3>
              </div>
              
              <Card className="bg-gradient-to-br from-gold/10 via-card/40 to-card/20 border-white/5 shadow-xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
                    <motion.div 
                      whileHover={{ scale: 1.05, rotate: -2 }}
                      className="relative w-40 md:w-48 shrink-0 shadow-[20px_20px_50px_rgba(0,0,0,0.5)]"
                    >
                      <img 
                        src={estacaoAtual?.livro_capa_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800"} 
                        alt="Capa do Livro"
                        className="w-full aspect-[2/3] object-cover rounded shadow-2xl grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                      />
                      <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded" />
                    </motion.div>
                    
                    <div className="flex-1 space-y-6 w-full">
                      <div className="space-y-2">
                        <h4 className="font-display text-2xl text-foreground">Diálogo com o Inconsciente</h4>
                        <p className="text-sm text-muted-foreground/80 leading-relaxed italic">
                          Pergunte ao livro sobre as tensões deste capítulo ou peça uma orientação simbólica para sua semana.
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="relative group">
                          <Input 
                            placeholder="Escreva sua inquietação..." 
                            className="bg-background/40 border-white/10 h-14 pl-5 pr-14 focus:border-gold/30 transition-all"
                          />
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gold/40 hover:text-gold hover:bg-gold/10"
                          >
                            <ArrowRight className="w-5 h-5" />
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {['Qual o significado do lobo?', 'Como resgatar minha força?', 'Símbolos de cura'].map(tag => (
                            <button key={tag} className="text-[10px] px-3 py-1.5 rounded-full border border-white/5 bg-white/5 text-muted-foreground hover:border-gold/20 hover:text-gold transition-all">
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* 6. TREINAMENTO (Simulação) */}
            <section className="space-y-8 pt-8">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-gold" />
                <h3 className="font-display text-xl uppercase tracking-widest text-foreground/80">Câmara de Simulação</h3>
              </div>
              
              <Card className="bg-black/40 border-white/5 border-l-gold border-l-2">
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] text-gold/60 uppercase font-medium">Situação de Campo</span>
                    <h4 className="text-xl font-display">A Encruzilhada do Resgate</h4>
                  </div>
                  <p className="text-muted-foreground/80 text-sm leading-relaxed">
                    Você encontrou um arquétipo ferido no campo psíquico. Como você utiliza as ferramentas da {estacaoAtual?.titulo} para realizar a primeira escuta sem ser devorada pelo trauma?
                  </p>
                  <Button variant="outline" className="w-full h-12 border-gold/20 text-gold hover:bg-gold/5 gap-2 uppercase tracking-widest text-xs font-bold">
                    Iniciar Simulação Contextual
                  </Button>
                </CardContent>
              </Card>
            </section>

            {/* 7. JARDIM (Prompt) */}
            <section className="space-y-8 pt-8">
              <div className="flex items-center gap-3">
                <Flower2 className="w-5 h-5 text-gold" />
                <h3 className="font-display text-xl uppercase tracking-widest text-foreground/80">Sementeira Interna</h3>
              </div>
              
              <div className="bg-gradient-to-r from-card/50 to-transparent p-1 rounded-xl">
                <div className="bg-background/80 backdrop-blur-sm rounded-lg p-8 space-y-6 border border-white/5">
                   <p className="font-serif italic text-xl text-center text-foreground/90 px-4">
                     "Escreva hoje sobre as peles que você já trocou mas que ainda insistem em vestir seu corpo atual."
                   </p>
                   <div className="flex justify-center">
                     <Button variant="link" className="text-gold/60 text-xs gap-2">
                       <MapPin className="w-3 h-3" /> Registrar no Jardim da Psique
                     </Button>
                   </div>
                </div>
              </div>
            </section>

            {/* 8. PRÓXIMA ROTA */}
            {proximoPonto && (
              <section className="pt-16">
                <Separator className="bg-white/5 mb-16" />
                <div className="group cursor-pointer" onClick={() => navigate(`/clube/rota/${proximoPonto.slug}`)}>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] mb-4">Próximo Destino</p>
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-3xl md:text-5xl text-muted-foreground group-hover:text-foreground transition-all duration-500">
                      {proximoPonto.nome}
                    </h2>
                    <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-all duration-500">
                      <ChevronRight className="w-8 h-8 group-hover:text-black transition-colors" />
                    </div>
                  </div>
                </div>
              </section>
            )}

          </div>

          {/* COLUNA DIREITA - SIDEBAR DE CARTOGRAFIA */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-8">
              
              {/* 2. CARD LATERAL DE CARTOGRAFIA */}
              <Card className="bg-card/30 border-white/5 backdrop-blur-md overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-gold/40 via-gold to-gold/40" />
                <CardContent className="p-6 space-y-8">
                  <div className="space-y-1">
                    <h3 className="font-display text-lg uppercase tracking-widest text-gold/80">Cartografia Atual</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Coordenadas da Alma</p>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { label: 'Estação', value: estacaoAtual?.numero + ' - ' + estacaoAtual?.titulo, icon: MapPin },
                      { label: 'Rota Atual', value: ponto.nome, icon: Compass, active: true },
                      { label: 'Porta', value: 'Iniciação Selvagem', icon: MessageSquare },
                      { label: 'Campo', value: 'Vale das Sombras', icon: Flower2 },
                      { label: 'Torre', value: 'Observatório', icon: Clock },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 group">
                        <div className={cn(
                          "w-8 h-8 rounded-full border flex items-center justify-center transition-all",
                          item.active ? "border-gold bg-gold/10 text-gold shadow-[0_0_10px_rgba(201,169,110,0.3)]" : "border-white/10 text-muted-foreground/40 group-hover:border-white/20"
                        )}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[8px] text-muted-foreground/50 uppercase tracking-tighter">{item.label}</p>
                          <p className={cn(
                            "text-xs font-medium truncate",
                            item.active ? "text-foreground" : "text-muted-foreground/70"
                          )}>{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-white/5" />
                  
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-muted-foreground/50">
                       <span>Expansão de Consciência</span>
                       <span className="text-gold">42%</span>
                     </div>
                     <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '42%' }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gold shadow-[0_0_10px_rgba(201,169,110,0.5)]" 
                       />
                     </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recursos Adicionais Sidebar */}
              <div className="px-2 space-y-6">
                 <div className="space-y-4">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 font-bold">Arquivos de Apoio</h4>
                    <div className="space-y-2">
                       {['Manual da Loba.pdf', 'Mapa de Sombras.png'].map(file => (
                         <div key={file} className="flex items-center justify-between text-xs text-muted-foreground/60 hover:text-foreground cursor-pointer transition-colors p-2 rounded hover:bg-white/5 group">
                           <span>{file}</span>
                           <ChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}
