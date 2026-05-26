import React from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, MessageSquareText, ShieldCheck } from 'lucide-react';

interface ResultCardProps {
  type: 'simbolica' | 'operacional' | 'clinica';
}

const resultData = {
  simbolica: {
    title: "Escuta Simbólica",
    subtitle: "A Geometria do Invisível",
    description: "Ao focar no 'apagão dos sonhos', sua escuta detectou a falha no sistema de processamento de imagens da psique. Marina não perdeu a produtividade, perdeu a capacidade de simbolizar o próprio desejo.",
    insight: "Sua leitura indica uma afinidade natural com a Casa Orácula — você percebe que o sintoma não é um erro, mas uma linguagem.",
    icon: Search,
  },
  operacional: {
    title: "Escuta Operacional",
    subtitle: "A Engrenagem da Identidade",
    description: "Você priorizou o descompasso entre o 'sucesso' e a 'verdade'. Sua leitura percebe o custo invisível da performance: Marina está operando um software identitário que não pertence à sua natureza original.",
    insight: "Seu olhar é estratégico e profundo. Você busca a eficiência da alma, não apenas o resultado do mundo.",
    icon: BookOpen,
  },
  clinica: {
    title: "Escuta Clínica",
    subtitle: "O Pulso da Presença",
    description: "Você ouviu o 'fora do ar' — a dissociação entre corpo e biografia. Sua escuta percebe que Marina está desabitada de si mesma, mantendo uma estrutura sólida sobre um vazio de sentido sensorial.",
    insight: "Sua escuta é compassiva e estruturante. Você sabe que antes da técnica, é preciso restabelecer a presença.",
    icon: MessageSquareText,
  }
};

export const ResultCard: React.FC<ResultCardProps> = ({ type }) => {
  const data = resultData[type] || resultData.simbolica;
  const Icon = data.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto rounded-[40px] border border-primary/10 bg-card/40 p-8 md:p-12 text-center space-y-8 shadow-sm backdrop-blur-xl relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mx-auto mb-2">
          <Icon className="w-7 h-7 text-primary/70" />
        </div>

        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.4em] text-primary/40 font-medium">Devolutiva</p>
          <h2 className="text-3xl md:text-4xl font-display text-primary leading-tight">
            {data.title}
          </h2>
          <p className="text-sm font-medium text-primary/60 tracking-widest uppercase">{data.subtitle}</p>
        </div>

        <p className="text-lg text-foreground/80 leading-relaxed font-serif italic max-w-lg mx-auto">
          "{data.description}"
        </p>

        <div className="pt-6 border-t border-primary/5">
          <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-md mx-auto">
            {data.insight}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 pt-4">
        <ShieldCheck className="w-4 h-4 text-primary/30" />
        <span className="text-[9px] uppercase tracking-widest text-primary/30">Protocolo Casa Orácula 2.0</span>
      </div>
    </motion.div>
  );
};