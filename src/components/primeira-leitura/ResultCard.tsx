import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

interface ResultCardProps {
  type: string;
}

const resultData: Record<string, { title: string; text: string; practical: string }> = {
  'padrao-relacional': {
    title: "Você percebe padrões antes de eventos.",
    text: "Sua escuta tende a notar repetições: o modo como uma história se organiza, volta e se repete em vínculos, escolhas e reações. Isso é potente, porque ajuda a enxergar a estrutura por trás do episódio. Mas também pede cuidado: nem toda repetição nasce do mesmo lugar. Às vezes há defesa, exaustão, contexto ou uma camada simbólica mais profunda. Na Casa Orácula, leitura simbólica não é reduzir uma pessoa a um padrão. É aprender a diferenciar camadas.",
    practical: "Na prática, esse tipo de escuta tende a perceber repetições: vínculos que se reorganizam do mesmo modo, escolhas que voltam ao mesmo ponto e cenas que parecem mudar de forma sem mudar de fundo. Isso é uma força. O próximo desafio é transformar a percepção do padrão em pergunta, não em conclusão rápida."
  },
  'crenca-central': {
    title: "Você percebe narrativas antes de sintomas.",
    text: "Sua escuta tende a localizar histórias internas que organizam comportamento. Você percebe quando uma pessoa vive presa a uma ideia silenciosa sobre valor, merecimento, dever ou pertencimento. Isso é potente. Mas traz um risco: interpretar tudo como crença e ignorar corpo, contexto, defesa ou história. Na Casa Orácula, a leitura simbólica aprende a diferenciar narrativa, proteção e travessia.",
    practical: "Na prática, esse tipo de escuta tende a perceber frases internas que conduzem a pessoa sem que ela perceba: “preciso merecer”, “não posso falhar”, “se eu descansar, perco valor”. Isso é uma força. O próximo desafio é não reduzir toda a história a uma crença. A Casa ensina a ler crença, corpo, vínculo, contexto e símbolo como camadas."
  },
  'hipercontrole': {
    title: "Você percebe estratégias de proteção.",
    text: "Sua escuta nota quando alguém tenta manter tudo de pé por meio de controle, vigilância ou excesso de responsabilidade. Isso revela uma sensibilidade para defesas e formas de proteção. Mas o cuidado é não tratar toda organização como rigidez. Às vezes, o controle foi a única linguagem possível para atravessar uma história. Na Casa Orácula, aprendemos a ler a proteção antes de tentar desmontá-la.",
    practical: "Na prática, esse tipo de escuta tende a perceber quando o controle não é frieza, mas uma forma de proteção. A pessoa tenta manter tudo de pé porque, em algum lugar, parar parece perigoso. Isso é uma força. O próximo desafio é não atacar a defesa cedo demais. Primeiro, é preciso compreender o que ela protege."
  },
  'exaustao-emocional': {
    title: "Você percebe dor antes de estrutura.",
    text: "Sua escuta reconhece rapidamente o cansaço, a sobrecarga e o peso emocional de uma história. Isso cria acolhimento. Mas também pode gerar superidentificação: quando vemos só a dor, podemos perder a arquitetura que sustenta aquela repetição. Na Casa Orácula, acolher é apenas a primeira camada. Depois vem a diferenciação.",
    practical: "Na prática, esse tipo de escuta reconhece rapidamente cansaço, sobrecarga e colapso silencioso. Isso cria acolhimento. O próximo desafio é não parar apenas na dor. A dor precisa ser escutada, mas também precisa ser situada dentro de uma estrutura de sentido."
  },
  'ferida-vinculo': {
    title: "Você percebe vínculo e necessidade de segurança.",
    text: "Sua escuta tende a notar como a história de alguém se organiza em torno de pertencimento, medo de abandono, cobrança ou busca de reconhecimento. Isso pode abrir uma leitura muito delicada. Mas pede cuidado: vínculo não explica tudo sozinho. Às vezes há crença, defesa, contexto ou símbolo operando junto. Na Casa Orácula, a escuta amadurece quando aprende a não escolher uma única camada cedo demais.",
    practical: "Na prática, esse tipo de escuta percebe rapidamente temas de pertencimento, abandono, cobrança, reconhecimento e medo de decepcionar. Isso é uma força. O próximo desafio é não explicar tudo pelo vínculo. Às vezes, vínculo é uma camada. Não o mapa inteiro."
  },
  'conflito-simbolico': {
    title: "Você percebe símbolos e tensões de sentido.",
    text: "Sua escuta procura a imagem por trás da história. Você percebe quando uma frase, um gesto ou uma repetição carrega mais do que uma explicação imediata. Isso é uma força da leitura simbólica. Mas também exige rigor: símbolo sem método vira interpretação solta. Na Casa Orácula, o símbolo não substitui a realidade. Ele organiza a travessia.",
    practical: "Na prática, esse tipo de escuta tende a perceber imagens, repetições, símbolos e tensões de sentido antes de chegar a uma conclusão. Isso é uma força. Mas também pede método. Na Casa Orácula, a leitura simbólica não substitui a realidade. Ela organiza a travessia com cuidado, ética e estrutura."
  }
};

export const ResultCard: React.FC<ResultCardProps> = ({ type }) => {
  const data = resultData[type] || resultData['padrao-relacional'];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto rounded-[40px] border border-primary/10 bg-card/40 p-8 md:p-12 text-center space-y-8 shadow-sm backdrop-blur-xl relative overflow-hidden"
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.4em] text-primary/40 font-medium">Devolutiva</p>
          <h2 className="text-2xl md:text-3xl font-display text-primary leading-tight px-4">
            {data.title}
          </h2>
        </div>

        <div className="space-y-4 text-sm md:text-base text-foreground/80 leading-relaxed font-serif italic max-w-lg mx-auto">
          {data.text.split('. ').map((sentence, i, arr) => (
            <p key={i}>{sentence}{i < arr.length - 1 ? '.' : ''}</p>
          ))}
        </div>

        <div className="pt-6 border-t border-primary/10 space-y-3 max-w-lg mx-auto text-left">
          <h4 className="text-xs uppercase tracking-widest text-primary/60 font-display">Como isso aparece na prática</h4>
          <p className="text-sm text-foreground/70 leading-relaxed">
            {data.practical}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 pt-8 opacity-30">
        <ShieldCheck className="w-4 h-4 text-primary" />
        <span className="text-[9px] uppercase tracking-widest text-primary">Protocolo de Leitura Simbólica</span>
      </div>
    </motion.div>
  );
};
