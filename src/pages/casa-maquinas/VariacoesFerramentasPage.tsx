import { useState } from 'react';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const FERRAMENTAS = [
  'Cartografia Psíquica Orácula',
  'Cartografia das Torres',
  'Labirinto das 39 Portas',
  'Atlas de Arquétipos',
  'Decodificação Onírica',
  'Biblioteca de Intervenções',
] as const;

const DISTRITOS = [
  'Portão da Chegada', 'Torres', 'Portas', 'Jardim dos Arquétipos',
  'Praça do Abalo', 'Casa dos Sonhos', 'Espelho dos Vínculos', 'Forja',
  'Conselho Interior', 'Labirinto', 'Praça da Integração', 'Portal de Renascimento',
] as const;

const ESTADOS = ['Inativo', 'Ativo', 'Integrado'] as const;

type Ferramenta = typeof FERRAMENTAS[number];
type Distrito = typeof DISTRITOS[number];
type Estado = typeof ESTADOS[number];

interface Variacao {
  titulo: string;
  objetivo: string;
  quandoUsar: string;
  aplicacao: string;
  clienteIndicado: string;
  riscoClinico: string;
  perguntaChave: string;
}

// --- Knowledge base for generating variations ---

const FERRAMENTA_FOCO: Record<Ferramenta, { verbo: string; campo: string }> = {
  'Cartografia Psíquica Orácula': { verbo: 'mapear', campo: 'a topografia psíquica e os territórios internos' },
  'Cartografia das Torres': { verbo: 'identificar', campo: 'as estruturas de proteção e defesa da psique' },
  'Labirinto das 39 Portas': { verbo: 'navegar', campo: 'os padrões emocionais e bloqueios inconscientes' },
  'Atlas de Arquétipos': { verbo: 'reconhecer', campo: 'os arquétipos ativos e em sombra na jornada' },
  'Decodificação Onírica': { verbo: 'traduzir', campo: 'as mensagens simbólicas dos sonhos' },
  'Biblioteca de Intervenções': { verbo: 'selecionar', campo: 'protocolos clínicos de sustentação e aprofundamento' },
};

const DISTRITO_SIMBOLO: Record<Distrito, { tema: string; energia: string }> = {
  'Portão da Chegada': { tema: 'início da travessia e abertura ao desconhecido', energia: 'receptividade' },
  'Torres': { tema: 'mecanismos de defesa e vigilância psíquica', energia: 'proteção' },
  'Portas': { tema: 'passagens entre estados emocionais', energia: 'transição' },
  'Jardim dos Arquétipos': { tema: 'forças arquetípicas e mitologia pessoal', energia: 'florescimento' },
  'Praça do Abalo': { tema: 'crises, rupturas e terremotos internos', energia: 'disrupção' },
  'Casa dos Sonhos': { tema: 'material onírico e inconsciente profundo', energia: 'revelação' },
  'Espelho dos Vínculos': { tema: 'relações, projeções e padrões relacionais', energia: 'reflexo' },
  'Forja': { tema: 'transformação ativa e trabalho interno intenso', energia: 'transmutação' },
  'Conselho Interior': { tema: 'diálogo entre partes internas e vozes psíquicas', energia: 'integração deliberada' },
  'Labirinto': { tema: 'ciclos repetitivos e padrões profundos', energia: 'circularidade' },
  'Praça da Integração': { tema: 'consolidação de aprendizados e ancoragem', energia: 'síntese' },
  'Portal de Renascimento': { tema: 'encerramento de ciclo e abertura para o novo', energia: 'renovação' },
};

const ESTADO_QUALIDADE: Record<Estado, { qualidade: string; direcao: string; risco: string }> = {
  'Inativo': {
    qualidade: 'adormecido ou evitado',
    direcao: 'Despertar a percepção sem forçar ativação',
    risco: 'Forçar abertura prematura do território',
  },
  'Ativo': {
    qualidade: 'mobilizado e presente no campo',
    direcao: 'Sustentar a exploração com presença e direção',
    risco: 'Perder-se na intensidade sem ancoragem',
  },
  'Integrado': {
    qualidade: 'assimilado e disponível como recurso',
    direcao: 'Aprofundar a consciência e expandir a aplicação',
    risco: 'Assumir que a integração é definitiva e negligenciar regressões',
  },
};

function gerarVariacao(ferramenta: Ferramenta, distrito: Distrito, estado: Estado): Variacao {
  const f = FERRAMENTA_FOCO[ferramenta];
  const d = DISTRITO_SIMBOLO[distrito];
  const e = ESTADO_QUALIDADE[estado];

  return {
    titulo: `${ferramenta} — ${distrito} — ${estado}`,
    objetivo: `Utilizar a ferramenta para ${f.verbo} ${f.campo}, focalizando o território de ${d.tema}. O distrito encontra-se em estado ${e.qualidade}, exigindo ${e.direcao.toLowerCase()}.`,
    quandoUsar: `Quando a cliente apresenta sinais de ${d.energia} no campo de ${d.tema}, e o território se mostra ${e.qualidade}. Indicado especialmente quando a sessão demanda ${f.verbo} com consciência da dinâmica de ${d.energia}.`,
    aplicacao: `Iniciar pela escuta do campo de ${d.energia}. Aplicar a ferramenta para ${f.verbo} ${f.campo}, respeitando que o distrito está ${e.qualidade}. ${e.direcao}. Manter atenção à linguagem simbólica da cliente e aos sinais de movimento ou resistência no território de ${distrito}.`,
    clienteIndicado: estado === 'Inativo'
      ? `Cliente que ainda não acessou conscientemente o território de ${d.tema}. Pode apresentar evitação, desconhecimento ou dissociação em relação à energia de ${d.energia}.`
      : estado === 'Ativo'
      ? `Cliente em processo ativo de exploração de ${d.tema}. Demonstra engajamento, mas pode precisar de sustentação para não se perder na intensidade de ${d.energia}.`
      : `Cliente que já atravessou e integrou aspectos de ${d.tema}. Pronta para aprofundamento ou revisitação consciente do território de ${d.energia}.`,
    riscoClinico: `${e.risco}. Ao usar ${ferramenta} no distrito de ${distrito}, atentar para não confundir ${d.energia} com conteúdos de outros territórios adjacentes. Manter limites claros da ferramenta sem expandir para além de sua função original.`,
    perguntaChave: estado === 'Inativo'
      ? `"O que acontece em você quando nos aproximamos do território de ${d.tema}?"`
      : estado === 'Ativo'
      ? `"O que este movimento de ${d.energia} está pedindo de você agora?"`
      : `"Como você percebe que ${d.tema} já faz parte de quem você é hoje?"`,
  };
}

export default function VariacoesFerramentasPage() {
  const [ferramenta, setFerramenta] = useState<string>('');
  const [distrito, setDistrito] = useState<string>('');
  const [estado, setEstado] = useState<string>('');
  const [resultado, setResultado] = useState<Variacao | null>(null);
  const [copied, setCopied] = useState(false);

  const canGenerate = ferramenta && distrito && estado;

  const handleGerar = () => {
    if (!canGenerate) return;
    setResultado(gerarVariacao(ferramenta as Ferramenta, distrito as Distrito, estado as Estado));
  };

  const handleVoltar = () => setResultado(null);

  const handleCopy = () => {
    if (!resultado) return;
    const text = [
      resultado.titulo,
      '',
      '🎯 Objetivo clínico', resultado.objetivo,
      '', '📅 Quando usar', resultado.quandoUsar,
      '', '🛠 Aplicação na sessão', resultado.aplicacao,
      '', '👤 Cliente indicado', resultado.clienteIndicado,
      '', '⚠️ Risco clínico', resultado.riscoClinico,
      '', '❓ Pergunta-chave', resultado.perguntaChave,
    ].join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Variação copiada!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CasaMaquinasLayout
      title="Variações das Ferramentas"
      subtitle="Explore aplicações clínicas combinando ferramenta, distrito e estado da jornada"
    >
      <AnimatePresence mode="wait">
        {!resultado ? (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="max-w-xl mx-auto space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Ferramenta</label>
                <Select value={ferramenta} onValueChange={setFerramenta}>
                  <SelectTrigger><SelectValue placeholder="Selecionar ferramenta" /></SelectTrigger>
                  <SelectContent>
                    {FERRAMENTAS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Distrito da CidaDELA</label>
                <Select value={distrito} onValueChange={setDistrito}>
                  <SelectTrigger><SelectValue placeholder="Selecionar distrito" /></SelectTrigger>
                  <SelectContent>
                    {DISTRITOS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Estado da Jornada</label>
                <Select value={estado} onValueChange={setEstado}>
                  <SelectTrigger><SelectValue placeholder="Selecionar estado" /></SelectTrigger>
                  <SelectContent>
                    {ESTADOS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleGerar} disabled={!canGenerate} className="w-full gap-2">
              <Sparkles className="w-4 h-4" />
              Gerar Aplicação
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-4 max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-between gap-3">
              <Button variant="ghost" size="sm" onClick={handleVoltar} className="gap-1.5 text-muted-foreground">
                <ArrowLeft className="w-4 h-4" /> Voltar
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copiado' : 'Copiar'}
              </Button>
            </div>

            <h2 className="text-xl font-display text-primary tracking-wide">{resultado.titulo}</h2>

            {([
              ['🎯 Objetivo clínico', resultado.objetivo],
              ['📅 Quando usar', resultado.quandoUsar],
              ['🛠 Forma de aplicação na sessão', resultado.aplicacao],
              ['👤 Tipo de cliente indicado', resultado.clienteIndicado],
              ['⚠️ Risco clínico possível', resultado.riscoClinico],
              ['❓ Pergunta-chave para condução', resultado.perguntaChave],
            ] as [string, string][]).map(([label, text]) => (
              <Card key={label} className="border-border/40 bg-card/30">
                <CardHeader className="pb-1.5 pt-4 px-5">
                  <CardTitle className="text-sm text-primary/80">{label}</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </CasaMaquinasLayout>
  );
}
