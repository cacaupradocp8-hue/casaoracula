import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Cloud, Mountain, Moon } from 'lucide-react';

interface ResultCardProps {
  type: 'visao' | 'raiz' | 'teia' | 'sombras';
}

const resultData = {
  visao: {
    title: "O Clarão da Visão",
    description: "Sua leitura sugere que você se move por lampejos de clareza que antecipam o tempo. Há uma pressa sagrada em sua busca, um desejo de iluminar o que ainda está oculto sob a superfície do cotidiano.",
    advice: "A Casa Orácula convida você a encontrar o centro imóvel de sua própria percepção.",
    icon: Eye,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20"
  },
  raiz: {
    title: "O Silêncio da Raiz",
    description: "Sua leitura revela uma alma que busca a solidez do que permanece. Você é quem sustenta, quem observa o tempo longo e valoriza a construção que exige paciência e presença na terra.",
    advice: "A Casa Orácula sugere que você olhe para o que cresce no escuro, além do que é visível.",
    icon: Mountain,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20"
  },
  teia: {
    title: "O Olhar da Teia",
    description: "Sua leitura indica uma mente que habita os espaços entre as coisas, percebendo os fios invisíveis que conectam os destinos. Sua curiosidade é sua bússola, e a liberdade é o ar que você respira.",
    advice: "A Casa Orácula propõe que você ancore sua percepção em uma prática de escuta dedicada.",
    icon: Cloud,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20"
  },
  sombras: {
    title: "A Escuta das Sombras",
    description: "Sua leitura aponta para uma sensibilidade que capta as correntes sutis e os ecos do passado. Você sente os contornos do mistério antes que ele se revele por inteiro.",
    advice: "A Casa Orácula oferece um cais seguro para que você possa mergulhar em sua própria profundidade.",
    icon: Moon,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20"
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
        <span className="text-xs font-bold uppercase tracking-widest text-amber-500/80">Leitura do Símbolo</span>
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
