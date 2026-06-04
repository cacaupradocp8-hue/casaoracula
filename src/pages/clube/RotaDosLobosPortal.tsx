import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, Sparkles, ArrowRight, BookOpen, Clock, Layers, Star, Map, TreePine, Eye, Ghost, Quote } from 'lucide-react';
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

  const lobosEstacoesRaw = [
    { 
      numero: 1, 
      nome: 'Clareira do Chamado', 
      frase: 'A vida que ainda chama por baixo do funcionamento.',
      icon: <TreePine className="w-5 h-5" />,
      territorios: 'Portão da Chegada, Coração da CidadELA'
    },
    { 
      numero: 2, 
      nome: 'Casa da Boa Menina', 
      frase: 'A mulher que aprendeu a desaparecer de forma aceitável.',
      icon: <Eye className="w-5 h-5" />,
      territorios: 'Torres, Espelho dos Vínculos'
    },
    { 
      numero: 3, 
      nome: 'Porta Proibida', 
      frase: 'A mulher que negocia com o que já percebeu.',
      icon: <Ghost className="w-5 h-5" />,
      territorios: 'Labirinto, Praça do Abismo'
    },
    { 
      numero: 4, 
      nome: 'Casa da Boneca Interior', 
      frase: 'A mulher que volta a confiar no que percebe.',
      icon: <Star className="w-5 h-5" />,
      territorios: 'Conselho Interior, Bosque dos Arquétipos'
    },
    { 
      numero: 5, 
      nome: 'Margem dos Ossos', 
      frase: 'O amor depois da superfície.',
      icon: <Sparkles className="w-5 h-5" />,
      territorios: 'Portal de Renascimento, Praça do Abismo'
    },
    { 
      numero: 6, 
      nome: 'Território da Loba', 
      frase: 'A mulher que volta para a própria vida.',
      icon: <Compass className="w-5 h-5" />,
      territorios: 'CidadELA Integral'
    },
  ];

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

  const lobosTerritoriosKeys = [
    'portao_chegada', 'coracao_cidadela', 'torres', 'espelho_vinculos', 
    'labirinto', 'praca_abismo', 'conselho_interior', 'bosque_arquetipos', 'portal_renascimento'
  ];

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  return (
    <AppLayout>
      <div className="relative bg-[#010816] text-white selection:bg-gold/20 min-h-screen overflow-x-hidden font-sans">
        {/* Atmosphere / Fog */}
        <div className="fixed inset-0 pointer-events-none z-[1]">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#010816]/40 to-[#010816]" />
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-soft-light" />
        </div>

        {/* 1. HERO - PORTAL SIMBÓLICO */}
        <section className="relative min-h-[90vh] flex flex-col justify-center pt-20 pb-12 z-10">
          <div className="absolute inset-0 -z-10 overflow-hidden">
             <motion.img 
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.25 }}
                transition={{ duration: 3 }}
                src="https://images.unsplash.com/photo-1550853024-fae8cd4be47f?auto=format&fit=crop&q=80" 
                className="w-full h-full object-cover grayscale"
                alt="Floresta Nebulosa"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#010816] via-transparent to-transparent" />
          </div>

          <ResponsiveContainer size="wide" className="px-6">
            <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/30 mb-12">
               <span className="hover:text-gold transition-colors cursor-pointer" onClick={() => navigate('/clube/rotas')}>Clube da Casa</span>
               <span className="opacity-30">/</span>
               <span className="text-gold/60">Rota dos Lobos</span>
            </nav>

            <div className="max-w-4xl space-y-8">
               <motion.div
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 1 }}
               >
                 <span className="text-gold/60 font-serif italic text-xl md:text-2xl block mb-2">Bem-vinda à</span>
                 <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif tracking-tighter leading-[0.9]">
                    ROTA DOS <br/>
                    <span className="text-gold italic">LOBOS</span>
                 </h1>
               </motion.div>

               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.5, duration: 1 }}
                 className="space-y-6"
               >
                 <h2 className="text-xl md:text-2xl text-gold/80 font-serif border-l-2 border-gold/30 pl-6 py-2">
                    Jornada de Recuperação da Natureza Instintiva
                 </h2>

                 <div className="max-w-2xl space-y-6 text-lg md:text-xl text-white/70 leading-relaxed font-light font-serif">
                    <p>Esta travessia nasce da obra <span className="text-white italic">Mulheres que Correm com os Lobos</span> e conduz você por seis territórios simbólicos da CidadELA.</p>
                    <p>Não é uma rota para entender um livro. É uma travessia para reconhecer onde sua natureza foi silenciada, onde sua percepção foi desacreditada e onde sua vitalidade ainda tenta voltar.</p>
                    <p>Aqui, cada conto é um espelho. Cada estação, uma passagem. Cada ferramenta, um rastro. Cada Jardim, um lugar onde a travessia começa a ganhar linguagem.</p>
                    <p className="text-white/90">Você não está aqui para se corrigir. <span className="text-gold">Está aqui para lembrar.</span></p>
                 </div>

                 <div className="flex flex-wrap gap-4 pt-8">
                    <Button 
                      variant="gold" 
                      size="lg" 
                      className="rounded-full px-10 h-14 text-sm font-bold uppercase tracking-widest group shadow-premium-glow"
                      onClick={() => {
                        const firstSlug = lobosEstacoes[0]?.slug;
                        if (firstSlug) navigate(`/clube/rota/${firstSlug}`);
                      }}
                    >
                       Iniciar Travessia
                       <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="rounded-full px-10 h-14 text-sm font-bold uppercase tracking-widest border-white/10 hover:bg-white/5"
                      onClick={() => document.getElementById('estacoes')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                       Ver Estações
                    </Button>
                 </div>
               </motion.div>
            </div>
          </ResponsiveContainer>
        </section>

        {/* 2. CARD POÉTICO - RESPIRO EMOCIONAL */}
        <section className="relative z-10 py-32 overflow-hidden">
           <div className="absolute inset-0 bg-gold/[0.02] -skew-y-3 transform origin-center" />
           <ResponsiveContainer size="narrow" className="px-6 relative">
              <motion.div 
                {...fadeIn}
                className="text-center space-y-8"
              >
                 <Quote className="w-12 h-12 text-gold/20 mx-auto mb-4" />
                 <blockquote className="text-3xl md:text-5xl font-serif leading-tight text-white/90 italic">
                    "A loba não vem ensinar você a ser outra. <br className="hidden md:block"/>
                    Ela vem lembrar o que em você continuou vivo, mesmo soterrado."
                 </blockquote>
                 <div className="h-12 w-[1px] bg-gradient-to-b from-gold/40 to-transparent mx-auto" />
              </motion.div>
           </ResponsiveContainer>
        </section>

        {/* 3. FAIXA DE SÍNTESE */}
        <section className="relative z-10 py-24 border-y border-white/5 bg-black/20">
           <ResponsiveContainer size="wide" className="px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                 <div className="lg:col-span-4">
                    <h3 className="text-sm uppercase tracking-[0.4em] text-gold/60 font-bold mb-4">A Travessia</h3>
                    <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">Esta rota <br/> atravessa</h2>
                 </div>
                 <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {[
                      { title: "6 Estações", desc: "Seis passagens pela floresta simbólica.", icon: <TreePine /> },
                      { title: "Contos-Espelho", desc: "Narrativas que revelam padrões da psique feminina.", icon: <BookOpen /> },
                      { title: "Ferramentas Oraculares", desc: "Rastros para reconhecer sinais, Torres e Labirintos.", icon: <Compass /> },
                      { title: "Jardins", desc: "Registros da travessia íntima e do ofício.", icon: <Star /> },
                      { title: "CidadELA", desc: "O mapa vivo por onde a rota passa.", icon: <Map /> },
                    ].map((item, i) => (
                      <div key={i} className="space-y-3">
                         <div className="text-gold/40">{React.cloneElement(item.icon as React.ReactElement, { className: "w-6 h-6" })}</div>
                         <h4 className="text-lg font-serif text-white">{item.title}</h4>
                         <p className="text-sm text-white/50 leading-relaxed font-light">{item.desc}</p>
                      </div>
                    ))}
                 </div>
              </div>
           </ResponsiveContainer>
        </section>

        {/* 4. O QUE ESTA ROTA DESPERTA */}
        <section className="relative z-10 py-32 px-6">
           <ResponsiveContainer size="medium">
              <motion.div {...fadeIn} className="space-y-16">
                 <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-[0.3em] text-white/30 font-bold">Iniciação</h3>
                    <h2 className="text-4xl md:text-5xl font-serif text-white">Nesta rota, você será conduzida a perceber:</h2>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                    {[
                      "onde sua voz foi diminuída para caber",
                      "onde seu instinto foi tratado como exagero",
                      "onde sua vida funciona, mas já não respira",
                      "onde você percebe, mas suaviza o que percebe",
                      "onde sua intuição ainda pede autorização",
                      "onde partes suas foram exiladas para continuar sendo aceita"
                    ].map((text, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-4 items-start group"
                      >
                         <span className="w-6 h-[1px] bg-gold/30 mt-3 group-hover:w-8 transition-all" />
                         <p className="text-xl md:text-2xl font-serif text-white/70 group-hover:text-white transition-colors">{text}</p>
                      </motion.div>
                    ))}
                 </div>

                 <div className="pt-12 border-t border-white/5">
                    <p className="text-2xl md:text-3xl font-serif italic text-gold/80 max-w-2xl">
                       "A Rota dos Lobos não promete uma nova mulher. Ela abre caminho para que a mulher esquecida comece a voltar."
                    </p>
                 </div>
              </motion.div>
           </ResponsiveContainer>
        </section>

        {/* 5. BLOCO CIDADELA */}
        <section className="relative z-10 py-32 bg-black/40 border-y border-white/5">
           <ResponsiveContainer size="wide" className="px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                 <div className="lg:col-span-5 space-y-8">
                    <div className="space-y-4">
                       <h3 className="text-xs uppercase tracking-[0.3em] text-gold/60 font-bold">Cartografia</h3>
                       <h2 className="text-4xl md:text-5xl font-serif text-white">Territórios ativados nesta travessia</h2>
                    </div>
                    
                    <p className="text-xl text-white/60 font-serif leading-relaxed">
                       A Rota dos Lobos atravessa a CidadELA como uma trilha na floresta.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                       {[
                         'Portão da Chegada', 'Coração da CidadELA', 'Torres', 
                         'Espelho dos Vínculos', 'Labirinto', 'Praça do Abismo', 
                         'Conselho Interior', 'Bosque dos Arquétipos', 'Portal de Renascimento'
                       ].map(t => (
                         <div key={t} className="flex items-center gap-3 text-sm text-white/40">
                            <div className="w-1 h-1 rounded-full bg-gold/40" />
                            {t}
                         </div>
                       ))}
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                       <p className="text-sm font-serif italic text-gold/60">
                          "A CidadELA não é cenário. <br/> Ela é o mapa vivo por onde esta rota passa."
                       </p>
                    </div>

                    {!hasCidadela && (
                       <Button variant="gold" className="rounded-full w-full" onClick={() => navigate('/ferramenta/cartografia-psiquica-oracula')}>
                          Revelar minha CidadELA
                       </Button>
                    )}
                 </div>

                 <div className="lg:col-span-7 flex justify-center">
                    <div className="relative w-full max-w-[500px]">
                       <div className="absolute inset-0 bg-gold/10 blur-[100px] rounded-full opacity-20" />
                       <div className="relative bg-white/[0.02] border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl">
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
                    </div>
                 </div>
              </div>
           </ResponsiveContainer>
        </section>

        {/* 6. BLOCO DAS ESTAÇÕES */}
        <section id="estacoes" className="relative z-10 py-32 px-6">
           <ResponsiveContainer size="wide">
              <div className="text-center space-y-4 mb-20">
                 <h3 className="text-xs uppercase tracking-[0.4em] text-white/30 font-bold">O Itinerário</h3>
                 <h2 className="text-5xl md:text-7xl font-serif text-white">As Seis Passagens</h2>
                 <p className="text-gold/60 italic font-serif text-xl">da Rota dos Lobos</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {lobosEstacoes.map((estacao, i) => (
                    <motion.div
                      key={i}
                      {...fadeIn}
                      transition={{ delay: i * 0.1 }}
                      className="group"
                    >
                       <div className={cn(
                         "relative h-full p-10 rounded-[2.5rem] border transition-all duration-700 overflow-hidden flex flex-col",
                         estacao.isLocked 
                           ? "border-white/5 bg-white/[0.01] opacity-40 grayscale" 
                           : "border-gold/10 bg-[#020a1a] hover:border-gold/30 hover:shadow-premium-glow"
                       )}>
                          {/* Station Number Background */}
                          <div className="absolute -top-4 -right-4 text-[10rem] font-serif text-white/[0.02] font-black group-hover:text-gold/[0.03] transition-colors leading-none">
                             {estacao.numero}
                          </div>

                          <div className="relative z-10 space-y-8 flex flex-col h-full">
                             <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                   <div className="w-10 h-10 rounded-full bg-gold/5 flex items-center justify-center text-gold/60 border border-gold/10 group-hover:scale-110 transition-transform">
                                      {estacao.icon}
                                   </div>
                                   {estacao.completed && <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px]">✦ Concluída</Badge>}
                                   {estacao.inProgress && <Badge className="bg-gold/10 text-gold border-gold/20 text-[9px] animate-pulse">Em curso</Badge>}
                                </div>
                                <h4 className="text-3xl font-serif text-white group-hover:text-gold transition-colors">{estacao.nome}</h4>
                                <p className="text-lg text-white/50 italic font-serif leading-snug line-clamp-2">"{estacao.frase}"</p>
                             </div>

                             <div className="space-y-6 flex-1 py-6 border-y border-white/5">
                                <div className="space-y-2">
                                   <p className="text-[10px] uppercase tracking-widest text-gold/40 font-bold">Campo de Leitura</p>
                                   <p className="text-sm text-white/60 leading-relaxed">{estacao.dbData?.subtitulo || 'Território desconhecido'}</p>
                                </div>
                                <div className="space-y-2">
                                   <p className="text-[10px] uppercase tracking-widest text-gold/40 font-bold">Ferramenta Oracular</p>
                                   <p className="text-sm text-white/60">Análise de Rastro Simbólico</p>
                                </div>
                                <div className="space-y-2">
                                   <p className="text-[10px] uppercase tracking-widest text-gold/40 font-bold">CidadELA</p>
                                   <p className="text-xs text-white/40">{estacao.territorios}</p>
                                </div>
                             </div>

                             <div className="pt-4">
                                <Button 
                                  variant={estacao.isLocked ? "ghost" : estacao.completed ? "outline" : "gold"} 
                                  className="w-full rounded-full h-12 uppercase tracking-widest text-[10px] font-bold"
                                  disabled={estacao.isLocked}
                                  onClick={() => estacao.slug && navigate(`/clube/rota/${estacao.slug}`)}
                                >
                                   {estacao.isLocked ? 'Território Bloqueado' : estacao.completed ? 'Revisitar Passagem' : 'Atravessar agora'}
                                   {!estacao.isLocked && <ArrowRight className="ml-2 w-3 h-3" />}
                                </Button>
                             </div>
                          </div>
                       </div>
                    </motion.div>
                 ))}
              </div>
           </ResponsiveContainer>
        </section>

        {/* 7. COMO A TRAVESSIA FUNCIONA */}
        <section className="relative z-10 py-32 bg-gold/[0.02]">
           <ResponsiveContainer size="medium" className="px-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
                 <div className="md:col-span-5 space-y-6">
                    <h3 className="text-xs uppercase tracking-[0.3em] text-gold/60 font-bold">O Método</h3>
                    <h2 className="text-4xl md:text-5xl font-serif text-white">Em cada estação, você atravessa a mesma sequência</h2>
                    <p className="text-xl text-white/40 font-serif italic">"A rota não foi criada para ser consumida. Foi criada para ser atravessada."</p>
                 </div>
                 <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                    {[
                      "Áudios", "Caso Simbólico", "Desafio de Escuta", 
                      "Revelação", "Ferramenta Oracular", "Jardim da Psique", 
                      "Jardim do Ofício", "Missão de Campo", "Fechamento"
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-4">
                         <span className="text-gold/20 font-serif text-2xl">0{i+1}</span>
                         <span className="text-white/70 text-lg font-light">{step}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </ResponsiveContainer>
        </section>

        {/* 8. O QUE MUDA */}
        <section className="relative z-10 py-32 px-6">
           <ResponsiveContainer size="medium">
              <motion.div {...fadeIn} className="space-y-16">
                 <div className="space-y-4 text-center">
                    <h3 className="text-xs uppercase tracking-[0.3em] text-white/30 font-bold">A Transformação</h3>
                    <h2 className="text-4xl md:text-6xl font-serif text-white">Ao final desta rota</h2>
                    <p className="text-xl text-white/60 font-serif max-w-xl mx-auto">Você não sai apenas com anotações sobre um livro. Você sai com rastros.</p>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {[
                      "o que voltou a respirar",
                      "o que você parou de suavizar",
                      "que Torre ficou visível",
                      "que Labirinto começou a se revelar",
                      "que pergunta mudou sua escuta",
                      "que parte sua precisa ser protegida daqui em diante"
                    ].map((text, i) => (
                      <div key={i} className="p-8 rounded-3xl bg-white/[0.01] border border-white/5 flex gap-6 items-center hover:bg-white/[0.03] transition-colors">
                         <div className="w-2 h-2 rounded-full bg-gold/60" />
                         <p className="text-lg md:text-xl font-serif text-white/80 leading-snug">{text}</p>
                      </div>
                    ))}
                 </div>

                 <div className="text-center pt-12">
                    <p className="text-2xl md:text-3xl font-serif italic text-white/60 italic">
                       "A floresta não termina quando a rota acaba. <br/> Ela continua trabalhando em silêncio."
                    </p>
                 </div>
              </motion.div>
           </ResponsiveContainer>
        </section>

        {/* 9. CTA FINAL */}
        <section className="relative z-10 py-40 overflow-hidden">
           <div className="absolute inset-0 bg-[#020d1f] -z-10" />
           <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#010816] to-transparent" />
           
           <ResponsiveContainer size="narrow" className="px-6 text-center space-y-12">
              <motion.div {...fadeIn} className="space-y-6">
                 <h2 className="text-5xl md:text-7xl font-serif text-white">A loba já conhece <br/> o caminho.</h2>
                 <div className="space-y-4 text-xl text-white/50 font-serif italic">
                    <p>Você não precisa correr.</p>
                    <p>Não precisa provar força.</p>
                    <p>Não precisa virar outra mulher.</p>
                    <p className="text-white/80">Apenas comece a escutar.</p>
                 </div>
              </motion.div>

              <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
                 <Button 
                   variant="gold" 
                   size="lg" 
                   className="rounded-full px-16 h-16 text-base font-bold uppercase tracking-[0.2em] shadow-premium-glow group mb-6"
                   onClick={() => {
                     const firstSlug = lobosEstacoes[0]?.slug;
                     if (firstSlug) navigate(`/clube/rota/${firstSlug}`);
                   }}
                 >
                    Iniciar Travessia
                    <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </Button>
                 <p className="text-xs uppercase tracking-widest text-gold/40 font-bold">A primeira estação será a Clareira do Chamado.</p>
              </motion.div>
           </ResponsiveContainer>
        </section>

        {/* Footer Navigation */}
        <footer className="relative z-10 py-12 border-t border-white/5 bg-black/40">
           <ResponsiveContainer size="wide" className="px-6 flex justify-between items-center">
              <Button variant="ghost" className="text-white/40 hover:text-white gap-2 uppercase tracking-widest text-[10px]" onClick={() => navigate('/clube/rotas')}>
                 <Compass className="w-4 h-4" /> Voltar ao Portal das Rotas
              </Button>
              <div className="text-[10px] uppercase tracking-widest text-white/20">Casa Orácula © 2026</div>
           </ResponsiveContainer>
        </footer>
      </div>
    </AppLayout>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
