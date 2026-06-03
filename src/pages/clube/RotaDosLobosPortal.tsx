import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, Sparkles, ArrowRight, Play, BookOpen, Clock, Layers, Star } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { Button } from '@/components/ui/button';
import { useBussolaOracular } from '@/hooks/useBussolaOracular';
import { useTodasRotas } from '@/hooks/useTodasRotas';
import { Badge } from '@/components/ui/badge';
import { CamadaCidadela } from '@/components/cartografia-unificada/CamadaCidadela';

export default function RotaDosLobosPortal() {
  const navigate = useNavigate();
  const bussola = useBussolaOracular();
  const { data: estacoes } = useTodasRotas();

  const hasCidadela = bussola.temCartografia;

  // Filtra apenas as 6 estações da Rota dos Lobos baseadas no subtítulo ou títulos fornecidos
  const lobosEstacoesRaw = [
    { numero: 1, nome: 'Clareira do Chamado', sub: 'A vida que ainda chama por baixo do funcionamento.' },
    { numero: 2, nome: 'Casa da Boa Menina', sub: 'A mulher que aprendeu a desaparecer de forma aceitável.' },
    { numero: 3, nome: 'Porta Proibida', sub: 'A mulher que negocia com o que já percebeu.' },
    { numero: 4, nome: 'Casa da Boneca Interior', sub: 'A mulher que volta a confiar no que percebe.' },
    { numero: 5, nome: 'Margem dos Ossos', sub: 'O amor depois da superfície.' },
    { numero: 6, nome: 'Território da Loba', sub: 'A mulher que volta para a própria vida.' },
  ];

  // Mapeia os dados oficiais do banco de dados (hooks/useTodasRotas) para exibir no portal
  const lobosEstacoes = lobosEstacoesRaw.map(base => {
    const dbEst = estacoes?.find(e => e.numero === base.numero);
    return {
      ...base,
      dbData: dbEst,
      isLocked: dbEst ? dbEst.status === 'locked' : true,
      inProgress: dbEst ? dbEst.status === 'in_progress' : false,
      completed: dbEst ? dbEst.status === 'completed' : false,
      slug: dbEst?.primeiro_slug
    };
  });

  // Filtra territórios para a CamadaCidadela na Rota dos Lobos
  const lobosTerritoriosKeys = [
    'portao_chegada', 'coracao_cidadela', 'torres', 'espelho_vinculos', 
    'labirinto', 'praca_abismo', 'conselho_interior', 'bosque_arquetipos', 'portal_renascimento'
  ];

  return (
    <AppLayout>
      <div className="relative bg-[#010816] text-white selection:bg-gold/20 min-h-screen overflow-x-hidden">
        {/* Immersive Background */}
        <div className="absolute inset-0 z-0 h-[80vh]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#010816] z-10" />
          <div className="absolute inset-0 bg-black/60 z-0" />
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 2 }}
            src="https://images.unsplash.com/photo-1550853024-fae8cd4be47f?auto=format&fit=crop&q=80" 
            className="w-full h-full object-cover grayscale"
            alt=""
          />
          {/* Subtle noise and light textures */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-soft-light z-20" />
        </div>

        <main className="relative z-10 pb-32">
          {/* 1. HERO - FLORESTA SIMBÓLICA */}
          <section className="relative h-[70vh] flex flex-col justify-center items-center text-center px-6">
            <ResponsiveContainer size="wide" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center gap-4 mb-4">
                   <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold/60" />
                   <Star className="w-4 h-4 text-gold/80" fill="currentColor" />
                   <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold/60" />
                </div>
                <h1 className="text-6xl md:text-8xl font-serif tracking-tighter">
                  Rota dos <span className="text-gold italic">Lobos</span>
                </h1>
                <p className="text-xl md:text-2xl text-gold/70 font-serif italic max-w-xl mx-auto">
                  Uma jornada de recuperação da natureza instintiva.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1.5 }}
                className="max-w-2xl mx-auto pt-8 space-y-6 text-white/70 leading-relaxed font-light"
              >
                <p>Você não está entrando em um curso.</p>
                <p className="text-2xl text-white/90 font-serif italic">Está entrando numa floresta simbólica.</p>
                <p>
                  Aqui, Mulheres que Correm com os Lobos deixa de ser apenas uma obra.<br/>
                  Torna-se uma travessia.
                </p>
                <div className="flex items-center justify-center gap-6 pt-4 text-[10px] uppercase tracking-[0.2em] text-gold/40 font-bold">
                  <span>Cada estação revela um território</span>
                  <span className="w-1 h-1 rounded-full bg-gold/20" />
                  <span>Cada conto abre uma porta</span>
                </div>
              </motion.div>
            </ResponsiveContainer>
          </section>

          {/* 2. BOAS-VINDAS & CIDADELA */}
          <section className="px-6 py-20 -mt-20">
            <ResponsiveContainer size="wide">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-center">
                <div className="lg:col-span-6 space-y-10">
                   <div className="space-y-6">
                      <h2 className="text-3xl font-serif text-white">Antes de entrar na floresta</h2>
                      <div className="space-y-4 text-white/60 leading-relaxed">
                        <p className="text-xl text-white/80 font-serif italic">Desacelere.</p>
                        <p>Esta rota não foi criada para ser consumida rapidamente. Ela foi criada para ser atravessada.</p>
                        <p>Você será convidada a reconhecer o que permaneceu vivo mesmo depois de anos de adaptação, silêncio, força funcional e pertencimento condicionado.</p>
                        <p className="text-gold/60 italic border-l border-gold/30 pl-4 py-1">A Casa recebe primeiro. A travessia começa depois.</p>
                      </div>
                   </div>

                   {/* CIDADELA NA ROTA */}
                   {!hasCidadela ? (
                     <div className="p-8 rounded-3xl border border-gold/20 bg-gold/5 space-y-6 shadow-premium-glow">
                        <h3 className="text-xl font-serif text-gold">Antes de atravessar, revele sua CidadELA</h3>
                        <p className="text-sm text-white/60 leading-relaxed">
                          A Rota dos Lobos atravessa territórios profundos da Casa. Revelar sua CidadELA ajuda a Casa a acender os lugares que irão acompanhar sua travessia.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                           <Button variant="gold" size="lg" className="rounded-full flex-1" onClick={() => navigate('/ferramenta/cartografia-psiquica-oracula')}>
                             Revelar minha CidadELA
                           </Button>
                           <Button variant="ghost" className="text-xs uppercase tracking-widest text-white/40 hover:text-white" onClick={() => navigate('/clube/rota/clareira-do-chamado')}>
                             Entrar na Rota mesmo assim
                           </Button>
                        </div>
                     </div>
                   ) : (
                     <div className="space-y-6">
                        <h3 className="text-xl font-serif text-white">Sua CidadELA nesta rota</h3>
                        <p className="text-sm text-white/60 leading-relaxed italic font-serif">
                          Estes são os territórios que se acendem enquanto você atravessa a Rota dos Lobos.
                        </p>
                        <div className="flex flex-wrap gap-2">
                           {lobosTerritoriosKeys.map(key => {
                             const isAtivo = bussola.distritosAtivos.some(d => d.key === key);
                             return (
                               <Badge key={key} variant="outline" className={isAtivo ? "bg-gold/10 border-gold/30 text-gold" : "opacity-30 border-white/10"}>
                                 {key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                               </Badge>
                             );
                           })}
                        </div>
                     </div>
                   )}
                </div>

                <div className="lg:col-span-6 flex justify-center">
                   {hasCidadela && (
                     <div className="w-full max-w-[480px] bg-white/[0.02] border border-white/5 rounded-[3rem] p-4 md:p-8">
                       <CamadaCidadela 
                         data={{
                           distrito_dominante: bussola.distritoDominante?.nome || '',
                           distrito_dominante_descricao: bussola.leituraSimbolica || '',
                           distritos_ativos: bussola.distritosAtivos.map(d => d.nome),
                           distritos_tensao: bussola.distritoTensao ? [bussola.distritoTensao.nome] : [],
                           territorio_crescimento: '',
                           territorio_crescimento_descricao: '',
                           leitura_integrada: '',
                           tensao_simbolica: '',
                           direcao_travessia: '',
                         }}
                         cor="CidadELA"
                         corHex={bussola.corHex}
                         atmosfera={[]}
                         simbolo=""
                         simboloIcon=""
                         territorios={lobosTerritoriosKeys}
                         pontoPartida={bussola.distritoDominante?.key || ''}
                         hideTechnical
                       />
                     </div>
                   )}
                </div>
              </div>
            </ResponsiveContainer>
          </section>

          {/* 3. ESTAÇÕES DA ROTA */}
          <section className="px-6 py-24 bg-black/40">
            <ResponsiveContainer size="wide" className="space-y-16">
               <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <Compass className="w-4 h-4 text-gold/60" />
                    <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-white/40">O Caminho da Loba</h2>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-serif text-white">Seis Territórios da Floresta</h3>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                 {lobosEstacoes.map((estacao, i) => (
                   <motion.div
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.1 }}
                     className="group relative"
                   >
                     <div className={cn(
                       "relative rounded-3xl p-8 h-full border transition-all duration-500 overflow-hidden flex flex-col",
                       estacao.isLocked 
                         ? "border-white/5 bg-white/[0.02] opacity-60" 
                         : "border-gold/15 bg-midnight hover:border-gold/40 hover:shadow-2xl"
                     )}>
                        {/* Background subtle number */}
                        <div className="absolute top-4 right-8 text-8xl font-serif text-white/[0.02] font-black pointer-events-none group-hover:text-gold/[0.03] transition-colors">
                          {estacao.numero}
                        </div>

                        <div className="relative z-10 flex flex-col h-full space-y-6">
                           <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                 <span className="text-[10px] tracking-[0.4em] uppercase text-gold/40 font-bold">Estação 0{estacao.numero}</span>
                                 {estacao.completed ? (
                                   <Badge className="bg-emerald-500/20 text-emerald-400 text-[8px] uppercase tracking-wider">✦ Concluída</Badge>
                                 ) : estacao.inProgress ? (
                                   <Badge className="bg-gold/20 text-gold text-[8px] uppercase tracking-wider animate-pulse">Em curso</Badge>
                                 ) : null}
                              </div>
                              <h4 className={cn("text-2xl font-serif", estacao.isLocked ? "text-white/40" : "text-white group-hover:text-gold transition-colors")}>
                                {estacao.nome}
                              </h4>
                              <p className="text-sm text-white/50 italic font-serif leading-relaxed line-clamp-2">
                                {estacao.sub}
                              </p>
                           </div>

                           <div className="space-y-4 flex-1">
                              <div className="space-y-1">
                                <p className="text-[9px] uppercase tracking-widest text-white/20 font-bold">Conto Central</p>
                                <p className="text-xs text-white/40">{estacao.dbData?.subtitulo || 'Revelado ao entrar'}</p>
                              </div>

                              <div className="flex items-center gap-2 pt-2">
                                <Layers className="w-3 h-3 text-gold/30" />
                                <span className="text-[9px] uppercase tracking-widest text-white/30">CidadELA: +2 territórios</span>
                              </div>
                           </div>

                           <div className="pt-6">
                              <Button 
                                variant={estacao.isLocked ? "outline" : estacao.completed ? "ghost" : "gold"} 
                                className="w-full rounded-full gap-2 text-xs font-bold uppercase tracking-widest h-12"
                                disabled={estacao.isLocked}
                                onClick={() => estacao.slug && navigate(`/clube/rota/${estacao.slug}`)}
                              >
                                {estacao.isLocked ? 'Bloqueada' : estacao.completed ? 'Revisitar' : 'Entrar na Estação'}
                                {!estacao.isLocked && <ArrowRight className="w-3 h-3" />}
                              </Button>
                           </div>
                        </div>
                     </div>
                   </motion.div>
                 ))}
               </div>

               <div className="text-center pt-8">
                  <Button variant="ghost" className="text-muted-foreground hover:text-white gap-2" onClick={() => navigate('/clube/rotas')}>
                    <Compass className="w-4 h-4" /> Voltar ao Portal das Rotas
                  </Button>
               </div>
            </ResponsiveContainer>
          </section>
        </main>
      </div>
    </AppLayout>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
