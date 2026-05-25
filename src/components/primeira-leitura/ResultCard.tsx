import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Flame, Wind, Mountain } from 'lucide-react';

interface ResultCardProps {
  type: 'fogo' | 'terra' | 'ar' | 'agua';
}

const resultData = {
  fogo: {
    title: "Chama Impulsionadora",
    description: "Sua leitura sugere que você se move por visões que ainda não se concretizaram. Há uma pressa sagrada em sua busca, um desejo de transformar a realidade através da vontade.",
    advice: "A Casa Orácula convida você a encontrar o centro imóvel de sua própria chama.",
    icon: Flame,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20"
  },
  terra: {
    title: "Raiz Profunda",
    description: "Sua leitura revela uma alma que busca solidez e continuidade. Você é quem sustenta, quem observa o tempo longo e valoriza o que pode ser tocado e construído com as mãos.",
    advice: "A Casa Orácula sugere que você olhe para o que cresce no escuro, além do que é visível.",
    icon: Mountain,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20"
  },
  ar: {
    title: "Vento da Mudança",
    description: "Sua leitura indica uma mente que habita os espaços entre as coisas. Sua curiosidade é sua bússola, e sua liberdade é o ar que você respira. Você traduz o invisível.",
    advice: "A Casa Orácula propõe que você ancore seu pensamento em uma prática ritual.",
    icon: Wind,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20"
  },
  agua: {
    title: "Mar de Memória",
    description: "Sua leitura aponta para uma sensibilidade que capta as correntes sutis do ambiente. Você sente antes de pensar, e suas emoções são oceanos que carregam sabedoria antiga.",
    advice: "A Casa Orácula oferece um cais seguro para que você possa mergulhar sem se perder.",
    icon: ShieldCheck,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20"
  }
};

export const ResultCard: React.FC<ResultCardProps> = ({ type }) => {
  const data = resultData[type];
  const Icon = data.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`w-full max-w-xl mx-auto rounded-3xl border ${data.borderColor} ${data.bgColor} p-8 text-center space-y-6 shadow-2xl backdrop-blur-md`}
    >
      <div className={`w-20 h-20 rounded-full ${data.bgColor} flex items-center justify-center mx-auto border ${data.borderColor}`}>
        <Icon className={`w-10 h-10 ${data.color}`} />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-500/80">O Veredito do Símbolo</span>
        <h2 className={`text-3xl font-serif ${data.color}`}>
          {data.title}
        </h2>
      </div>

      <p className="text-lg text-foreground/90 leading-relaxed italic">
        "{data.description}"
      </p>

      <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mx-auto" />

      <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
        {data.advice}
      </p>
    </motion.div>
  );
};
