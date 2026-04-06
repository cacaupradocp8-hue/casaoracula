import { motion } from 'framer-motion';
import { Lock, Unlock, Map, BookOpen, Users, Compass, Flame, Shield, Eye, Layers, Star, Sparkles } from 'lucide-react';

const distritos = [
  { name: 'Portas', angle: 0, icon: Compass },
  { name: 'Torres', angle: 51, icon: Shield },
  { name: 'Arquétipos', angle: 102, icon: Star },
  { name: 'Labirinto', angle: 153, icon: Eye },
  { name: 'Sonhos', angle: 204, icon: Sparkles },
  { name: 'Forja', angle: 255, icon: Flame },
  { name: 'Integração', angle: 306, icon: Layers },
];

function MandalaRing({ locked = false }: { locked?: boolean }) {
  const radius = 120;
  const centerX = 160;
  const centerY = 160;

  return (
    <div className="relative w-[320px] h-[320px] mx-auto">
      {/* Outer ring */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320">
        <circle
          cx={centerX} cy={centerY} r={radius + 15}
          fill="none"
          stroke={locked ? 'rgba(255,255,255,0.06)' : 'url(#goldGrad)'}
          strokeWidth="1"
          strokeDasharray={locked ? '4 8' : 'none'}
        />
        <circle
          cx={centerX} cy={centerY} r={radius - 15}
          fill="none"
          stroke={locked ? 'rgba(255,255,255,0.04)' : 'rgba(201,164,92,0.15)'}
          strokeWidth="0.5"
        />
        {/* Center circle */}
        <circle
          cx={centerX} cy={centerY} r={20}
          fill={locked ? 'rgba(255,255,255,0.02)' : 'rgba(201,164,92,0.08)'}
          stroke={locked ? 'rgba(255,255,255,0.06)' : 'rgba(201,164,92,0.25)'}
          strokeWidth="1"
        />
        {/* Connecting lines */}
        {distritos.map((d) => {
          const rad = (d.angle * Math.PI) / 180;
          const x = centerX + radius * Math.cos(rad);
          const y = centerY + radius * Math.sin(rad);
          return (
            <line
              key={d.name}
              x1={centerX} y1={centerY}
              x2={x} y2={y}
              stroke={locked ? 'rgba(255,255,255,0.03)' : 'rgba(201,164,92,0.1)'}
              strokeWidth="0.5"
            />
          );
        })}
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(201,164,92,0.4)" />
            <stop offset="50%" stopColor="rgba(201,164,92,0.15)" />
            <stop offset="100%" stopColor="rgba(201,164,92,0.4)" />
          </linearGradient>
        </defs>
      </svg>

      {/* District nodes */}
      {distritos.map((d, i) => {
        const rad = (d.angle * Math.PI) / 180;
        const x = centerX + radius * Math.cos(rad);
        const y = centerY + radius * Math.sin(rad);
        const Icon = d.icon;

        return (
          <motion.div
            key={d.name}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: locked ? 0.3 + i * 0.05 : 0.5 + i * 0.08, duration: 0.4 }}
            className="absolute flex flex-col items-center gap-1"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center transition-all
              ${locked
                ? 'bg-white/[0.03] border border-white/10'
                : 'bg-primary/10 border border-primary/30 shadow-[0_0_20px_-5px_hsl(var(--gold)/0.2)]'
              }
            `}>
              {locked ? (
                <Lock className="w-3.5 h-3.5 text-white/20" />
              ) : (
                <Icon className="w-4 h-4 text-primary/70" strokeWidth={1.5} />
              )}
            </div>
            <span className={`text-[9px] font-medium tracking-wide whitespace-nowrap ${locked ? 'text-white/15' : 'text-white/50'}`}>
              {d.name}
            </span>
          </motion.div>
        );
      })}

      {/* Center icon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {locked ? (
          <Lock className="w-5 h-5 text-white/15" />
        ) : (
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Map className="w-5 h-5 text-primary/60" />
          </motion.div>
        )}
      </div>

      {/* Pulsing glow for unlocked */}
      {!locked && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-primary/[0.04] blur-2xl pointer-events-none"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      )}
    </div>
  );
}

export function CidadelaComparison() {
  return (
    <section className="relative py-28 md:py-40 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#060a10] to-black" />
      
      {/* Ambient glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-primary/[0.03] blur-[200px] pointer-events-none"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-primary/70 text-xs uppercase tracking-[0.5em] mb-6">O Mapa que muda tudo</p>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-white mb-6">
            A CidaDELA <span className="text-gold-gradient">Interior</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            A psique feminina tem uma arquitetura. Com a Formação, você aprende a cartografá-la.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* SEM a formação */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="border border-white/[0.06] rounded-3xl p-8 md:p-10 bg-white/[0.01] relative overflow-hidden">
              {/* Grayscale overlay feel */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <p className="text-white/20 text-xs uppercase tracking-[0.3em] mb-8 text-center">Sem a Formação</p>
                
                <MandalaRing locked />
                
                <div className="mt-10 space-y-4">
                  {[
                    'Intuição sem critério de leitura',
                    'Símbolos sem mapa de aplicação',
                    'Escuta sem estrutura de condução',
                    'Ferramentas isoladas sem método',
                  ].map((item, i) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="flex items-center gap-3 text-white/25 text-sm"
                    >
                      <div className="w-1 h-1 rounded-full bg-white/15 shrink-0" />
                      {item}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* COM a formação */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="border border-primary/20 rounded-3xl p-8 md:p-10 bg-white/[0.02] relative overflow-hidden shadow-[0_0_100px_-30px_hsl(var(--gold)/0.12)]">
              {/* Gold glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <p className="text-primary/50 text-xs uppercase tracking-[0.3em] mb-8 text-center">Com a Formação Orácula</p>
                
                <MandalaRing locked={false} />
                
                <div className="mt-10 space-y-4">
                  {[
                    { text: 'Mapa Vivo da CidaDELA — cartografia em tempo real', icon: Map },
                    { text: 'Casa das Máquinas — SaaS profissional integrado', icon: Users },
                    { text: 'Clube Oracular — leitura como intervenção psíquica', icon: BookOpen },
                    { text: 'Método completo — Portas, Campos e Torres', icon: Compass },
                  ].map((item, i) => (
                    <motion.div
                      key={item.text}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 + i * 0.12 }}
                      className="flex items-center gap-3 text-white/60 text-sm group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                        <item.icon className="w-3.5 h-3.5 text-primary/60" strokeWidth={1.5} />
                      </div>
                      {item.text}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <p className="text-gold-gradient font-display text-xl md:text-2xl italic">
            Sem mapa, toda escuta é tentativa.<br />
            <span className="text-white/40 text-lg not-italic">Com ele, cada sessão tem direção.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
