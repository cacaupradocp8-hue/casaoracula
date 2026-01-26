// ============================================
// ESCALA DE MAIA ORACULAR™
// ============================================
// Estados de Força e Estados de Potência
// Ferramenta simbólica de autorregulação

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ArrowRight, Leaf, Moon, Sun, Circle, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SalvarJardimModal } from '@/components/shared/SalvarJardimModal';
import { motion, AnimatePresence } from 'framer-motion';

// Estados de Força (Contração)
const ESTADOS_FORCA = [
  { id: 'medo', label: 'Medo', descricao: 'Sensação de ameaça ou perigo iminente' },
  { id: 'culpa', label: 'Culpa', descricao: 'Peso por algo feito ou não feito' },
  { id: 'raiva_contida', label: 'Raiva contida', descricao: 'Energia que não encontrou expressão' },
  { id: 'orgulho_defensivo', label: 'Orgulho defensivo', descricao: 'Proteção através da superioridade' },
  { id: 'necessidade_controle', label: 'Necessidade de controle', descricao: 'Tentativa de garantir segurança' },
  { id: 'desejo_provar', label: 'Desejo de provar algo', descricao: 'Busca por validação externa' },
  { id: 'urgencia_resolver', label: 'Urgência em resolver', descricao: 'Pressão para agir imediatamente' },
];

// Estados de Potência (Integração)
const ESTADOS_POTENCIA = [
  { id: 'neutralidade_lucida', label: 'Neutralidade lúcida', descricao: 'Observação sem julgamento' },
  { id: 'coragem_silenciosa', label: 'Coragem silenciosa', descricao: 'Força que não precisa demonstrar' },
  { id: 'aceitacao_limite', label: 'Aceitação do limite', descricao: 'Reconhecimento do que não cabe mudar agora' },
  { id: 'clareza_sem_pressa', label: 'Clareza sem pressa', descricao: 'Visão que não exige ação imediata' },
  { id: 'responsabilidade_serena', label: 'Responsabilidade serena', descricao: 'Resposta consciente, não reativa' },
  { id: 'presenca_corpo', label: 'Presença no corpo', descricao: 'Ancoragem física no momento' },
  { id: 'escolha_consciente', label: 'Escolha consciente', descricao: 'Decisão a partir da integração' },
];

// Perguntas oraculares
const PERGUNTAS_ORACULO = [
  'O que esse estado está tentando proteger?',
  'O que ficaria em risco se você agisse diferente agora?',
  'O que pode ser sustentado sem ação imediata?',
];

type Tela = 'apresentacao' | 'forca' | 'potencia' | 'leitura' | 'integracao';

export default function EscalaMAIA() {
  const navigate = useNavigate();
  const [telaAtual, setTelaAtual] = useState<Tela>('apresentacao');
  const [estadosForcaSelecionados, setEstadosForcaSelecionados] = useState<string[]>([]);
  const [estadosPotenciaSelecionados, setEstadosPotenciaSelecionados] = useState<string[]>([]);
  const [respostasIntegracao, setRespostasIntegracao] = useState({
    nao_decidir: '',
    sustentar_sem_resolver: '',
    postura_etica: '',
  });
  const [showJardimModal, setShowJardimModal] = useState(false);

  const toggleEstadoForca = (id: string) => {
    setEstadosForcaSelecionados(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const toggleEstadoPotencia = (id: string) => {
    setEstadosPotenciaSelecionados(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const avancar = () => {
    const telas: Tela[] = ['apresentacao', 'forca', 'potencia', 'leitura', 'integracao'];
    const idx = telas.indexOf(telaAtual);
    if (idx < telas.length - 1) {
      setTelaAtual(telas[idx + 1]);
    }
  };

  const voltar = () => {
    const telas: Tela[] = ['apresentacao', 'forca', 'potencia', 'leitura', 'integracao'];
    const idx = telas.indexOf(telaAtual);
    if (idx > 0) {
      setTelaAtual(telas[idx - 1]);
    }
  };

  const handleSalvarNoJardim = () => {
    setShowJardimModal(true);
  };

  const getConteudoParaSalvar = () => ({
    estados_forca: estadosForcaSelecionados.map(id => 
      ESTADOS_FORCA.find(e => e.id === id)?.label || id
    ),
    estados_potencia: estadosPotenciaSelecionados.map(id => 
      ESTADOS_POTENCIA.find(e => e.id === id)?.label || id
    ),
    respostas_integracao: respostasIntegracao,
    perguntas_oraculo: PERGUNTAS_ORACULO,
  });

  const getResultadoSimbolico = () => ({
    predominancia: estadosForcaSelecionados.length > estadosPotenciaSelecionados.length 
      ? 'campo de força' 
      : estadosPotenciaSelecionados.length > estadosForcaSelecionados.length
        ? 'campo de potência'
        : 'transição',
    estados_nomeados_forca: estadosForcaSelecionados.length,
    estados_nomeados_potencia: estadosPotenciaSelecionados.length,
  });

  // Símbolos alquímicos para cada tela
  const simbolos: Record<Tela, React.ReactNode> = {
    apresentacao: <Circle className="w-6 h-6" />,
    forca: <Moon className="w-6 h-6" />,
    potencia: <Sun className="w-6 h-6" />,
    leitura: <Sparkles className="w-6 h-6" />,
    integracao: <Leaf className="w-6 h-6" />,
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <Link 
            to="/ferramentas" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar às Ferramentas
          </Link>
        </div>

        {/* Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
            {simbolos[telaAtual]}
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Escala de MAIA Oracular™
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Estados de Força e Estados de Potência
          </p>
        </div>

        {/* Indicador de progresso */}
        <div className="flex justify-center gap-2 mb-8">
          {(['apresentacao', 'forca', 'potencia', 'leitura', 'integracao'] as Tela[]).map((tela, idx) => (
            <div
              key={tela}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                telaAtual === tela 
                  ? 'w-8 bg-primary' 
                  : idx < ['apresentacao', 'forca', 'potencia', 'leitura', 'integracao'].indexOf(telaAtual)
                    ? 'bg-primary/50'
                    : 'bg-muted'
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={telaAtual}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* TELA 1 - APRESENTAÇÃO */}
            {telaAtual === 'apresentacao' && (
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4 text-center">
                    <p className="text-lg italic text-foreground/90">
                      "Esta não é uma escala para medir quem você é.
                      <br />
                      É um espelho para reconhecer de onde você está agindo agora."
                    </p>
                    
                    <div className="h-px bg-border/50 w-16 mx-auto" />
                    
                    <p className="text-muted-foreground">
                      Estados mudam.
                      <br />
                      Consciência se move.
                      <br />
                      Nada aqui é definitivo.
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button 
                      onClick={avancar} 
                      className="w-full gap-2"
                      size="lg"
                    >
                      <Circle className="w-4 h-4" />
                      Iniciar Leitura
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TELA 2 - ESTADOS DE FORÇA (CONTRAÇÃO) */}
            {telaAtual === 'forca' && (
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-6 space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-lg font-semibold text-foreground flex items-center justify-center gap-2">
                      <Moon className="w-5 h-5 text-amber-500" />
                      Quando a energia está reagindo para sobreviver
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Selecione os estados que você reconhece em si agora
                    </p>
                  </div>

                  <div className="space-y-3">
                    {ESTADOS_FORCA.map((estado) => (
                      <label
                        key={estado.id}
                        className={cn(
                          'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                          estadosForcaSelecionados.includes(estado.id)
                            ? 'border-amber-500/50 bg-amber-500/10'
                            : 'border-border/50 hover:border-border'
                        )}
                      >
                        <Checkbox
                          checked={estadosForcaSelecionados.includes(estado.id)}
                          onCheckedChange={() => toggleEstadoForca(estado.id)}
                          className="mt-0.5"
                        />
                        <div>
                          <p className="font-medium text-foreground">{estado.label}</p>
                          <p className="text-sm text-muted-foreground">{estado.descricao}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <p className="text-sm italic text-muted-foreground">
                      "Força não é erro.
                      <br />
                      É energia tentando proteger algo ferido."
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={voltar} className="flex-1">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                    <Button onClick={avancar} className="flex-1">
                      Avançar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TELA 3 - ESTADOS DE POTÊNCIA (INTEGRAÇÃO) */}
            {telaAtual === 'potencia' && (
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-6 space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-lg font-semibold text-foreground flex items-center justify-center gap-2">
                      <Sun className="w-5 h-5 text-emerald-500" />
                      Quando a energia sustenta sem reagir
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Selecione os estados que você reconhece em si agora
                    </p>
                  </div>

                  <div className="space-y-3">
                    {ESTADOS_POTENCIA.map((estado) => (
                      <label
                        key={estado.id}
                        className={cn(
                          'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                          estadosPotenciaSelecionados.includes(estado.id)
                            ? 'border-emerald-500/50 bg-emerald-500/10'
                            : 'border-border/50 hover:border-border'
                        )}
                      >
                        <Checkbox
                          checked={estadosPotenciaSelecionados.includes(estado.id)}
                          onCheckedChange={() => toggleEstadoPotencia(estado.id)}
                          className="mt-0.5"
                        />
                        <div>
                          <p className="font-medium text-foreground">{estado.label}</p>
                          <p className="text-sm text-muted-foreground">{estado.descricao}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <p className="text-sm italic text-muted-foreground">
                      "Potência não é intensidade.
                      <br />
                      É coerência interna."
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={voltar} className="flex-1">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                    <Button onClick={avancar} className="flex-1">
                      Avançar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TELA 4 - LEITURA ORACULAR */}
            {telaAtual === 'leitura' && (
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-6 space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-lg font-semibold text-foreground flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5 text-violet-500" />
                      Leitura do Estado Atual
                    </h2>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      O que aparece aqui não define você.
                      <br />
                      Indica o campo a partir do qual você está escolhendo agora.
                    </p>
                  </div>

                  {/* Resumo das seleções */}
                  <div className="space-y-4">
                    {estadosForcaSelecionados.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-amber-500 flex items-center gap-2">
                          <Moon className="w-4 h-4" />
                          Estados de Força reconhecidos:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {estadosForcaSelecionados.map(id => {
                            const estado = ESTADOS_FORCA.find(e => e.id === id);
                            return (
                              <span 
                                key={id}
                                className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm"
                              >
                                {estado?.label}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {estadosPotenciaSelecionados.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-emerald-500 flex items-center gap-2">
                          <Sun className="w-4 h-4" />
                          Estados de Potência reconhecidos:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {estadosPotenciaSelecionados.map(id => {
                            const estado = ESTADOS_POTENCIA.find(e => e.id === id);
                            return (
                              <span 
                                key={id}
                                className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm"
                              >
                                {estado?.label}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {estadosForcaSelecionados.length === 0 && estadosPotenciaSelecionados.length === 0 && (
                      <p className="text-center text-muted-foreground text-sm italic">
                        Nenhum estado foi selecionado. Isso também é uma informação.
                      </p>
                    )}
                  </div>

                  {/* Perguntas Oraculares */}
                  <div className="space-y-3 pt-4 border-t border-border/50">
                    <p className="text-sm font-medium text-foreground">
                      Perguntas-oráculo para contemplação:
                    </p>
                    <ul className="space-y-2">
                      {PERGUNTAS_ORACULO.map((pergunta, idx) => (
                        <li 
                          key={idx}
                          className="text-sm text-muted-foreground italic pl-4 border-l-2 border-violet-500/30"
                        >
                          {pergunta}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-violet-500/10 rounded-lg p-4 text-center">
                    <p className="text-sm italic text-violet-600 dark:text-violet-400">
                      "Antes de mudar o estado, escute o que ele pede."
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={voltar} className="flex-1">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                    <Button onClick={avancar} className="flex-1">
                      Ir para Integração
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TELA 5 - INTEGRAÇÃO (FECHAMENTO) */}
            {telaAtual === 'integracao' && (
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-6 space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-lg font-semibold text-foreground flex items-center justify-center gap-2">
                      <Leaf className="w-5 h-5 text-emerald-500" />
                      Escolha de Postura
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nao-decidir" className="text-sm">
                        O que eu não devo decidir hoje?
                      </Label>
                      <Textarea
                        id="nao-decidir"
                        placeholder="Escreva livremente..."
                        value={respostasIntegracao.nao_decidir}
                        onChange={(e) => setRespostasIntegracao(prev => ({
                          ...prev,
                          nao_decidir: e.target.value
                        }))}
                        className="min-h-[80px] resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sustentar" className="text-sm">
                        O que posso sustentar sem resolver?
                      </Label>
                      <Textarea
                        id="sustentar"
                        placeholder="Escreva livremente..."
                        value={respostasIntegracao.sustentar_sem_resolver}
                        onChange={(e) => setRespostasIntegracao(prev => ({
                          ...prev,
                          sustentar_sem_resolver: e.target.value
                        }))}
                        className="min-h-[80px] resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postura" className="text-sm">
                        Qual postura me protege eticamente agora?
                      </Label>
                      <Textarea
                        id="postura"
                        placeholder="Escreva livremente..."
                        value={respostasIntegracao.postura_etica}
                        onChange={(e) => setRespostasIntegracao(prev => ({
                          ...prev,
                          postura_etica: e.target.value
                        }))}
                        className="min-h-[80px] resize-none"
                      />
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <p className="text-sm italic text-muted-foreground">
                      "Consciência não se força.
                      <br />
                      Ela amadurece quando é respeitada."
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={voltar} className="flex-1">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                    <Button 
                      onClick={handleSalvarNoJardim} 
                      className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Leaf className="w-4 h-4" />
                      Salvar no Jardim da Psique
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Aviso Ético */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            A Escala de MAIA Oracular™ é um instrumento simbólico autoral da Casa Orácula.
            <br />
            Não se baseia em escalas de consciência quantitativas, nem propõe hierarquia de estados.
          </p>
        </div>

        {/* Modal Jardim */}
        <SalvarJardimModal
          open={showJardimModal}
          onOpenChange={setShowJardimModal}
          ferramenta_nome="Escala de MAIA Oracular™"
          ferramenta_chave="escala_maia"
          conteudo={getConteudoParaSalvar()}
          resultado_simbolico={getResultadoSimbolico()}
          tipo_registro="reflexao"
          onSaved={() => {
            navigate('/jardim-psique');
          }}
          onSkipped={() => {
            navigate('/ferramentas');
          }}
        />
      </div>
    </AppLayout>
  );
}
