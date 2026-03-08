import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, BookOpen, Calendar, Hand, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

/* ─── Distritos da CidaDELA ─── */
const DISTRITOS = [
  'Portão da Chegada', 'Torres', 'Portas', 'Jardim dos Arquétipos',
  'Praça do Abalo', 'Casa dos Sonhos', 'Espelho dos Vínculos', 'Forja',
  'Conselho Interior', 'Labirinto', 'Praça da Integração', 'Portal de Renascimento',
];

/* ─── Catálogo de Mudras ─── */
const MUDRAS = [
  {
    key: 'joia_preciosa',
    nome: 'Mudra da Joia Preciosa',
    intencao: 'Ativar o senso de valor próprio e abundância interior. Indicado quando a cliente apresenta desvalorização ou dificuldade em reconhecer seus dons.',
    instrucoes: [
      'Sente-se confortavelmente com a coluna ereta.',
      'Una as pontas dos dedos polegar e anelar de ambas as mãos.',
      'Mantenha as demais dedos estendidos e relaxados.',
      'Posicione as mãos sobre o colo, palmas voltadas para cima.',
      'Respire profundamente por 5 minutos, visualizando uma luz dourada no centro do peito.',
      'Ao exalar, repita internamente: "Eu reconheço meu valor".',
    ],
    distritoSugerido: 'Jardim dos Arquétipos',
    cor: 'hsl(var(--primary))',
  },
  {
    key: 'loto_interior',
    nome: 'Mudra do Lótus Interior',
    intencao: 'Abrir o campo emocional e facilitar a expressão de sentimentos bloqueados. Útil em momentos de fechamento emocional ou após sessões intensas.',
    instrucoes: [
      'Sente-se em posição confortável.',
      'Junte as bases das mãos e os dedos mínimos.',
      'Abra os demais dedos como pétalas de uma flor.',
      'Posicione o mudra na altura do coração.',
      'Inspire profundamente, imaginando o lótus se abrindo.',
      'Expire lentamente, permitindo que emoções fluam.',
      'Mantenha por 7 minutos.',
    ],
    distritoSugerido: 'Portas',
    cor: 'hsl(280, 60%, 55%)',
  },
  {
    key: 'escudo_raiz',
    nome: 'Mudra do Escudo de Raiz',
    intencao: 'Estabelecer segurança e enraizamento. Indicado para momentos de ansiedade, instabilidade emocional ou quando a cliente se sente "desconectada do chão".',
    instrucoes: [
      'Sente-se com os pés firmes no chão.',
      'Entrelace todos os dedos com as palmas voltadas para baixo.',
      'Posicione as mãos sobre o umbigo.',
      'Visualize raízes crescendo dos seus pés em direção à terra.',
      'Respire pelo nariz, sentindo o peso do corpo na cadeira.',
      'Mantenha por 5 a 10 minutos.',
    ],
    distritoSugerido: 'Torres',
    cor: 'hsl(25, 50%, 45%)',
  },
  {
    key: 'espelho_silencio',
    nome: 'Mudra do Espelho do Silêncio',
    intencao: 'Promover introspecção e escuta interior profunda. Para uso quando a cliente precisa acessar a sabedoria interna e reduzir ruído mental.',
    instrucoes: [
      'Sente-se em silêncio absoluto.',
      'Una as pontas dos dedos indicador e polegar (Chin Mudra).',
      'Mantenha as mãos sobre os joelhos, palmas voltadas para cima.',
      'Feche os olhos suavemente.',
      'Observe seus pensamentos sem se apegar a eles.',
      'Permaneça por 10 minutos em escuta silenciosa.',
    ],
    distritoSugerido: 'Conselho Interior',
    cor: 'hsl(210, 40%, 50%)',
  },
  {
    key: 'fogo_transformacao',
    nome: 'Mudra do Fogo da Transformação',
    intencao: 'Ativar a coragem para mudança e liberação de padrões antigos. Indicado quando a cliente está pronta para soltar o que não serve mais.',
    instrucoes: [
      'Sente-se ereta e firme.',
      'Entrelace os dedos das mãos, deixando o polegar esquerdo sobre o direito.',
      'Estenda o indicador esquerdo para cima.',
      'Posicione o mudra na frente do plexo solar.',
      'Respire com intensidade controlada — inspire pelo nariz, expire pela boca.',
      'Visualize chamas douradas purificando o que precisa ser liberado.',
      'Mantenha por 5 minutos.',
    ],
    distritoSugerido: 'Forja',
    cor: 'hsl(15, 70%, 50%)',
  },
  {
    key: 'ponte_vinculos',
    nome: 'Mudra da Ponte dos Vínculos',
    intencao: 'Equilibrar as relações e fortalecer a capacidade de dar e receber afeto. Útil em contextos de dependência emocional ou isolamento.',
    instrucoes: [
      'Sente-se confortavelmente.',
      'Una a ponta do polegar direito com o mindinho esquerdo, e vice-versa.',
      'Mantenha os demais dedos relaxados, formando uma ponte entre as mãos.',
      'Posicione na altura do coração.',
      'Visualize uma ponte de luz conectando você a alguém significativo.',
      'Respire suavemente por 7 minutos.',
    ],
    distritoSugerido: 'Espelho dos Vínculos',
    cor: 'hsl(330, 50%, 55%)',
  },
];

type View = 'overview' | 'detail' | 'diary';

export default function RituaisMudraPage() {
  const { user } = useAuth();
  const { clienteId } = useParams<{ clienteId: string }>();
  const [view, setView] = useState<View>('overview');
  const [selectedMudra, setSelectedMudra] = useState<typeof MUDRAS[0] | null>(null);
  const [distrito, setDistrito] = useState('');
  const [anotacoes, setAnotacoes] = useState('');
  const [saving, setSaving] = useState(false);
  const [diary, setDiary] = useState<any[]>([]);
  const [loadingDiary, setLoadingDiary] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const openDetail = (mudra: typeof MUDRAS[0]) => {
    setSelectedMudra(mudra);
    setDistrito(mudra.distritoSugerido);
    setAnotacoes('');
    setView('detail');
  };

  const loadDiary = async () => {
    if (!clienteId) return;
    setLoadingDiary(true);
    const { data } = await supabase
      .from('praticas_mudra')
      .select('*')
      .eq('client_id', clienteId)
      .order('data_pratica', { ascending: false });
    setDiary(data || []);
    setLoadingDiary(false);
  };

  const openDiary = () => {
    setView('diary');
    loadDiary();
  };

  const handleRegister = async () => {
    if (!user || !clienteId || !selectedMudra) return;
    setSaving(true);
    const { error } = await supabase.from('praticas_mudra').insert({
      client_id: clienteId,
      therapist_id: user.id,
      mudra_nome: selectedMudra.nome,
      distrito_associado: distrito,
      anotacoes_pratica: anotacoes || null,
    } as any);
    if (error) {
      console.error(error);
      toast.error('Erro ao registrar prática');
    } else {
      toast.success('Prática registrada com sucesso ✨');
      setView('overview');
    }
    setSaving(false);
  };

  return (
    <CasaMaquinasLayout
      title="Rituais de Cura Feminina"
      subtitle="Mudras e Centramento — práticas somáticas de equilíbrio simbólico"
    >
      <AnimatePresence mode="wait">
        {/* ─── OVERVIEW ─── */}
        {view === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 max-w-3xl mx-auto"
          >
            {/* Intro */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Hand className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                Práticas somáticas de centramento com mudras terapêuticos.
                Cada mudra é um gesto sagrado que ativa um campo simbólico específico
                na CidaDELA Interior da cliente.
              </p>
            </div>

            {/* Diary button */}
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={openDiary}>
                <BookOpen className="w-4 h-4 mr-2" /> Ver Diário de Prática
              </Button>
            </div>

            {/* Mudra cards */}
            <div className="grid gap-3">
              {MUDRAS.map(m => (
                <Card
                  key={m.key}
                  className="border-border/10 bg-card/60 hover:border-primary/20 transition-colors cursor-pointer"
                  onClick={() => openDetail(m)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                      style={{ backgroundColor: `${m.cor}20`, color: m.cor }}
                    >
                      🙏
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{m.nome}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{m.intencao}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0 border-border/20 text-muted-foreground">
                      {m.distritoSugerido}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="text-[10px] text-center text-muted-foreground/40">
              Ferramenta de leitura simbólica. Não substitui julgamento clínico.
            </p>
          </motion.div>
        )}

        {/* ─── DETAIL ─── */}
        {view === 'detail' && selectedMudra && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 max-w-2xl mx-auto"
          >
            <Button variant="ghost" size="sm" onClick={() => setView('overview')}>
              ← Voltar aos Mudras
            </Button>

            <Card className="border-border/10 bg-card/60">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${selectedMudra.cor}15`, color: selectedMudra.cor }}
                  >
                    🙏
                  </div>
                  <div>
                    <CardTitle className="text-lg">{selectedMudra.nome}</CardTitle>
                    <CardDescription className="text-xs">Distrito sugerido: {selectedMudra.distritoSugerido}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Intenção */}
                <div>
                  <h3 className="text-xs font-semibold text-primary mb-1">Intenção Terapêutica</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedMudra.intencao}</p>
                </div>

                {/* Instruções */}
                <div>
                  <h3 className="text-xs font-semibold text-primary mb-2">Instruções Passo a Passo</h3>
                  <ol className="space-y-2">
                    {selectedMudra.instrucoes.map((inst, i) => (
                      <li key={i} className="flex gap-3 text-sm text-foreground/80">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                          {i + 1}
                        </span>
                        {inst}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Distrito selector */}
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground mb-2">Distrito da CidaDELA para Nutrição</h3>
                  <Select value={distrito} onValueChange={setDistrito}>
                    <SelectTrigger className="bg-card border-border/20">
                      <SelectValue placeholder="Selecione um distrito..." />
                    </SelectTrigger>
                    <SelectContent>
                      {DISTRITOS.map(d => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Anotações */}
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground mb-2">Anotações da Prática</h3>
                  <Textarea
                    value={anotacoes}
                    onChange={e => setAnotacoes(e.target.value)}
                    placeholder="Registre observações sobre a prática, sensações, imagens que surgiram..."
                    className="min-h-[120px] bg-card border-border/20 placeholder:text-muted-foreground/30"
                    maxLength={2000}
                  />
                </div>

                <Button onClick={handleRegister} disabled={saving} variant="gold" className="w-full">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                  Registrar Prática
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ─── DIARY ─── */}
        {view === 'diary' && (
          <motion.div
            key="diary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4 max-w-2xl mx-auto"
          >
            <Button variant="ghost" size="sm" onClick={() => setView('overview')}>
              ← Voltar aos Mudras
            </Button>

            <h2 className="text-lg font-display font-semibold text-foreground">Diário de Prática</h2>

            {loadingDiary ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            ) : diary.length === 0 ? (
              <p className="text-center text-muted-foreground/40 py-10">Nenhuma prática registrada ainda</p>
            ) : (
              <div className="space-y-2">
                {diary.map((d: any) => {
                  const isExpanded = expandedId === d.id;
                  return (
                    <Card
                      key={d.id}
                      className="border-border/10 bg-card/60 cursor-pointer transition-colors hover:border-border/20"
                      onClick={() => setExpandedId(isExpanded ? null : d.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-muted-foreground/50" />
                            <div>
                              <p className="text-sm font-medium text-foreground">{d.mudra_nome}</p>
                              <p className="text-[10px] text-muted-foreground">
                                {new Date(d.data_pratica).toLocaleDateString('pt-BR', {
                                  day: 'numeric', month: 'short', year: 'numeric',
                                  hour: '2-digit', minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {d.distrito_associado && (
                              <Badge variant="outline" className="text-[9px] border-border/20 text-muted-foreground">
                                {d.distrito_associado}
                              </Badge>
                            )}
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground/40" /> : <ChevronDown className="w-4 h-4 text-muted-foreground/40" />}
                          </div>
                        </div>
                        {isExpanded && d.anotacoes_pratica && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 pt-3 border-t border-border/10"
                          >
                            <p className="text-xs text-foreground/70 whitespace-pre-line">{d.anotacoes_pratica}</p>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </CasaMaquinasLayout>
  );
}
