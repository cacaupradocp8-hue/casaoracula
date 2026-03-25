import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay },
});

export default function ConviteClube() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const nome = user?.name?.split(' ')[0] || 'Visitante';

  return (
    <AppLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-5">
        <div className="max-w-lg w-full text-center space-y-10 py-16">

          {/* Símbolo */}
          <motion.div {...fade(0)}>
            <span className="text-gold/40 text-4xl block mb-6">🜂</span>
            <p className="text-xs uppercase tracking-[0.25em] text-gold/50 mb-4">
              Um convite
            </p>
            <h1 className="font-display text-3xl md:text-4xl text-foreground leading-tight">
              {nome}, a Casa está aberta.
            </h1>
          </motion.div>

          {/* Texto simbólico */}
          <motion.div {...fade(0.15)} className="space-y-4">
            <p className="text-foreground/80 leading-relaxed">
              Você descobriu sua Voz. Atravessou o limiar.
              Agora existe um território esperando para ser revelado —
              <span className="text-gold font-display font-semibold"> sua CidaDELA Interior</span>.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Dentro da Casa, você vai cartografar seu mapa psíquico,
              habitar os distritos que governam seu campo interno e receber
              direção simbólica para cada passo da jornada.
            </p>
          </motion.div>

          {/* O que espera */}
          <motion.div {...fade(0.25)}>
            <div className="border border-gold/10 rounded-2xl bg-card/30 backdrop-blur-sm p-6 space-y-3 text-left">
              <p className="text-xs uppercase tracking-[0.2em] text-gold/40 text-center mb-4">
                O que te espera dentro
              </p>
              {[
                'Cartografia Psíquica — revelar seu mapa interior',
                'CidaDELA Viva — GPS simbólico que evolui com você',
                'Clube de Leitura — jornadas guiadas pela sua Voz',
                'Práticas e Ferramentas — escuta, sonhos, oráculo',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-gold/60 text-sm mt-0.5">✦</span>
                  <p className="text-foreground/80 text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div {...fade(0.35)} className="space-y-3">
            <Button
              variant="gold"
              size="lg"
              onClick={() => navigate('/planos-clube')}
              className="gap-2 px-8 py-6 text-base w-full max-w-xs mx-auto"
            >
              Entrar para o Clube
              <ArrowRight className="w-4 h-4" />
            </Button>
            <p className="text-muted-foreground/50 text-xs">
              Escolha o plano que faz sentido para você
            </p>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
