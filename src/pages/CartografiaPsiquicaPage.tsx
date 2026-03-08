import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Map, Sparkles, Save, Share2, Loader2 } from 'lucide-react';

/* ─── Constants ─── */
const CORES = [
  { nome: 'Ouro', hex: '#C9A24A', significado: 'esperança, abundância' },
  { nome: 'Prata', hex: '#A8B2BD', significado: 'reflexão, mistério' },
  { nome: 'Azul', hex: '#3B6B9E', significado: 'calma, profundidade' },
  { nome: 'Vermelho', hex: '#B44B4B', significado: 'paixão, energia' },
  { nome: 'Verde', hex: '#556B57', significado: 'crescimento, renovação' },
  { nome: 'Roxo', hex: '#7B5EA7', significado: 'transformação, magia' },
  { nome: 'Cinza', hex: '#8A8A8A', significado: 'neutralidade, transição' },
  { nome: 'Preto', hex: '#1A1A2E', significado: 'potencial, desconhecido' },
  { nome: 'Branco', hex: '#E8E4DA', significado: 'clareza, vazio' },
  { nome: 'Rosa', hex: '#C4848A', significado: 'ternura, vulnerabilidade' },
  { nome: 'Laranja', hex: '#D4874D', significado: 'criatividade, alegria' },
  { nome: 'Marrom', hex: '#8B6F47', significado: 'enraizamento, estabilidade' },
];

const ATMOSFERAS = [
  'Calma', 'Agitada', 'Clara', 'Nebulosa', 'Quente', 'Fria',
  'Viva', 'Estática', 'Segura', 'Ameaçadora', 'Aberta', 'Fechada',
  'Organizada', 'Caótica', 'Esperançosa', 'Desesperada',
];

const DISTRITOS = [
  { key: 'portao_chegada', nome: 'Portão da Chegada', desc: 'Chegadas, inícios', icon: '🚪' },
  { key: 'torres', nome: 'Torres', desc: 'Estruturas, proteção', icon: '🏛️' },
  { key: 'portas', nome: 'Portas', desc: 'Emoções, acessos', icon: '🔑' },
  { key: 'jardim_arquetipos', nome: 'Jardim dos Arquétipos', desc: 'Forças profundas', icon: '🌿' },
  { key: 'praca_abalo', nome: 'Praça do Abalo', desc: 'Emoções intensas', icon: '⚡' },
  { key: 'casa_sonhos', nome: 'Casa dos Sonhos', desc: 'Inconsciente, imaginação', icon: '🌙' },
  { key: 'espelho_vinculos', nome: 'Espelho dos Vínculos', desc: 'Relacionamentos', icon: '🪞' },
  { key: 'forja', nome: 'Forja', desc: 'Transformação', icon: '🔥' },
  { key: 'conselho_interior', nome: 'Conselho Interior', desc: 'Sabedoria interna', icon: '👁️' },
  { key: 'labirinto', nome: 'Labirinto', desc: 'Confusão, ciclos', icon: '🌀' },
  { key: 'praca_integracao', nome: 'Praça da Integração', desc: 'Síntese', icon: '☀️' },
  { key: 'portal_renascimento', nome: 'Portal de Renascimento', desc: 'Transição', icon: '🦋' },
];

const SIMBOLOS = [
  { nome: 'Árvore', icon: '🌳' }, { nome: 'Montanha', icon: '⛰️' },
  { nome: 'Rio', icon: '🏞️' }, { nome: 'Fogo', icon: '🔥' },
  { nome: 'Água', icon: '💧' }, { nome: 'Vento', icon: '🌬️' },
  { nome: 'Luz', icon: '✨' }, { nome: 'Sombra', icon: '🌑' },
  { nome: 'Ponte', icon: '🌉' }, { nome: 'Porta', icon: '🚪' },
  { nome: 'Coração', icon: '❤️' }, { nome: 'Coroa', icon: '👑' },
  { nome: 'Espada', icon: '⚔️' }, { nome: 'Escudo', icon: '🛡️' },
  { nome: 'Chave', icon: '🗝️' }, { nome: 'Labirinto', icon: '🌀' },
  { nome: 'Espelho', icon: '🪞' }, { nome: 'Livro', icon: '📖' },
  { nome: 'Flor', icon: '🌸' }, { nome: 'Estrela', icon: '⭐' },
];

const TOTAL_STEPS = 9;

export default function CartografiaPsiquicaPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Data
  const [cor, setCor] = useState('');
  const [atmosfera, setAtmosfera] = useState<string[]>([]);
  const [territorios, setTerritorios] = useState<string[]>([]);
  const [recursos, setRecursos] = useState('');
  const [conflitos, setConflitos] = useState('');
  const [simbolo, setSimbolo] = useState('');
  const [porqueSimbolo, setPorqueSimbolo] = useState('');
  const [pontoPartida, setPontoPartida] = useState('');

  const corObj = CORES.find(c => c.nome === cor);
  const selectedDistritos = DISTRITOS.filter(d => territorios.includes(d.key));

  const toggleAtmosfera = (a: string) => {
    setAtmosfera(prev =>
      prev.includes(a) ? prev.filter(x => x !== a) : prev.length < 4 ? [...prev, a] : prev
    );
  };
  const toggleTerritorio = (key: string) => {
    setTerritorios(prev =>
      prev.includes(key) ? prev.filter(x => x !== key) : prev.length < 5 ? [...prev, key] : prev
    );
  };

  const canAdvance = () => {
    switch (step) {
      case 1: return !!cor;
      case 2: return atmosfera.length > 0;
      case 3: return territorios.length > 0;
      case 6: return !!simbolo;
      case 7: return !!pontoPartida;
      default: return true;
    }
  };

  const calcEquilibrio = () => {
    const rLen = recursos.trim().length;
    const cLen = conflitos.trim().length;
    if (rLen + cLen === 0) return 50;
    return Math.round((rLen / (rLen + cLen)) * 100);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const indice = calcEquilibrio();

    const { error } = await supabase.from('cartografia_psiquica').insert({
      user_id: user.id,
      cor_predominante: cor,
      atmosfera,
      territorios_principais: territorios,
      recursos_internos: recursos,
      conflitos_tensoes: conflitos,
      simbolo_pessoal: simbolo,
      por_que_simbolo: porqueSimbolo,
      ponto_partida: pontoPartida,
      indice_equilibrio: indice,
      metadata_json: { cor_hex: corObj?.hex, cor_significado: corObj?.significado },
    } as any);

    if (error) {
      console.error(error);
      toast.error('Erro ao salvar cartografia');
    } else {
      toast.success('Cartografia salva com sucesso ✨');
      navigate('/dashboard');
    }
    setSaving(false);
  };

  /* ─── Slide transition ─── */
  const slideVariants = {
    enter: { opacity: 0, x: 60 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -60 },
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Progress */}
      {step > 0 && step < TOTAL_STEPS - 1 && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(step / (TOTAL_STEPS - 1)) * 100}%` }}
          />
        </div>
      )}

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35 }}
            className="w-full max-w-2xl"
          >
            {/* STEP 0 — Abertura */}
            {step === 0 && (
              <div className="text-center space-y-8">
                <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Map className="w-12 h-12 text-primary" />
                </div>
                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
                    Cartografia Psíquica Orácula
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Como é a geografia da sua cidade interior agora?
                  </p>
                </div>
                <p className="text-sm text-muted-foreground/70 max-w-md mx-auto leading-relaxed">
                  Vamos criar um mapa da sua psique — não é um teste, é uma leitura simbólica do seu estado atual.
                  Cada resposta revela uma paisagem interior.
                </p>
                <Button onClick={() => setStep(1)} variant="gold" size="lg" className="mt-4">
                  <Sparkles className="w-5 h-5 mr-2" /> Começar cartografia
                </Button>
              </div>
            )}

            {/* STEP 1 — Cor */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-display font-semibold">Se sua cidade interior fosse uma cor, qual seria?</h2>
                  <p className="text-sm text-muted-foreground">Escolha a cor que ressoa com seu momento</p>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {CORES.map(c => (
                    <button
                      key={c.nome}
                      onClick={() => setCor(c.nome)}
                      className={`group relative rounded-xl p-3 text-center transition-all duration-200 border ${
                        cor === c.nome
                          ? 'border-primary ring-2 ring-primary/30 scale-105'
                          : 'border-border/30 hover:border-border/60'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full mx-auto mb-2 shadow-md"
                        style={{ backgroundColor: c.hex }}
                      />
                      <p className="text-xs font-medium text-foreground">{c.nome}</p>
                      <p className="text-[10px] text-muted-foreground leading-tight">{c.significado}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2 — Atmosfera */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-display font-semibold">Como é a atmosfera dessa cidade agora?</h2>
                  <p className="text-sm text-muted-foreground">Selecione até 4 descritores</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ATMOSFERAS.map(a => (
                    <button
                      key={a}
                      onClick={() => toggleAtmosfera(a)}
                      className={`rounded-lg py-3 px-4 text-sm font-medium transition-all border ${
                        atmosfera.includes(a)
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'border-border/30 text-muted-foreground hover:border-border/60'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-center text-muted-foreground/50">
                  Esses descritores criam a atmosfera da sua cidade
                </p>
              </div>
            )}

            {/* STEP 3 — Territórios */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-display font-semibold">Quais territórios estão mais presentes em você agora?</h2>
                  <p className="text-sm text-muted-foreground">Selecione até 5 distritos da CidaDELA</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DISTRITOS.map(d => (
                    <button
                      key={d.key}
                      onClick={() => toggleTerritorio(d.key)}
                      className={`flex items-center gap-3 rounded-xl p-3 text-left transition-all border ${
                        territorios.includes(d.key)
                          ? 'bg-primary/10 border-primary'
                          : 'border-border/20 hover:border-border/50'
                      }`}
                    >
                      <span className="text-2xl">{d.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{d.nome}</p>
                        <p className="text-xs text-muted-foreground">{d.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4 — Recursos */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-display font-semibold">Onde você encontra força, segurança e criatividade?</h2>
                  <p className="text-sm text-muted-foreground">Descreva seus recursos internos</p>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground/60">
                    {['Encontro força em...', 'Me sinto segura quando...', 'Minha criatividade floresce em...', 'Sou capaz de...'].map(s => (
                      <button
                        key={s}
                        onClick={() => setRecursos(prev => prev ? `${prev}\n${s}` : s)}
                        className="border border-border/20 rounded-full px-3 py-1 hover:border-primary/40 hover:text-primary transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <Textarea
                    value={recursos}
                    onChange={e => setRecursos(e.target.value)}
                    placeholder="Escreva livremente sobre seus recursos internos..."
                    className="min-h-[160px] bg-card/50 border-border/20 text-foreground placeholder:text-muted-foreground/40"
                    maxLength={2000}
                  />
                </div>
              </div>
            )}

            {/* STEP 5 — Conflitos */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-display font-semibold">Quais territórios estão em tensão?</h2>
                  <p className="text-sm text-muted-foreground">Descreva os conflitos ou áreas de sombra</p>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground/60">
                    {['Há conflito entre...', 'Sinto tensão quando...', 'Estou confusa sobre...', 'Preciso integrar...'].map(s => (
                      <button
                        key={s}
                        onClick={() => setConflitos(prev => prev ? `${prev}\n${s}` : s)}
                        className="border border-border/20 rounded-full px-3 py-1 hover:border-primary/40 hover:text-primary transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <Textarea
                    value={conflitos}
                    onChange={e => setConflitos(e.target.value)}
                    placeholder="Escreva livremente sobre tensões e conflitos..."
                    className="min-h-[160px] bg-card/50 border-border/20 text-foreground placeholder:text-muted-foreground/40"
                    maxLength={2000}
                  />
                </div>
              </div>
            )}

            {/* STEP 6 — Símbolo Pessoal */}
            {step === 6 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-display font-semibold">Há um símbolo que representa sua jornada agora?</h2>
                  <p className="text-sm text-muted-foreground">Escolha o que mais ressoa</p>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {SIMBOLOS.map(s => (
                    <button
                      key={s.nome}
                      onClick={() => setSimbolo(s.nome)}
                      className={`rounded-xl p-3 text-center transition-all border ${
                        simbolo === s.nome
                          ? 'bg-primary/10 border-primary ring-1 ring-primary/30 scale-105'
                          : 'border-border/20 hover:border-border/50'
                      }`}
                    >
                      <span className="text-2xl block">{s.icon}</span>
                      <p className="text-[10px] mt-1 text-foreground/70">{s.nome}</p>
                    </button>
                  ))}
                </div>
                {simbolo && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Por que esse símbolo?</p>
                    <Textarea
                      value={porqueSimbolo}
                      onChange={e => setPorqueSimbolo(e.target.value)}
                      placeholder="O que esse símbolo significa para você neste momento..."
                      className="min-h-[100px] bg-card/50 border-border/20 text-foreground placeholder:text-muted-foreground/40"
                      maxLength={1000}
                    />
                  </div>
                )}
              </div>
            )}

            {/* STEP 7 — Ponto de Partida */}
            {step === 7 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-display font-semibold">Por qual distrito você quer começar?</h2>
                  <p className="text-sm text-muted-foreground">Escolha entre os territórios que você selecionou</p>
                </div>
                <div className="space-y-2">
                  {selectedDistritos.map(d => (
                    <button
                      key={d.key}
                      onClick={() => setPontoPartida(d.key)}
                      className={`w-full flex items-center gap-4 rounded-xl p-4 text-left transition-all border ${
                        pontoPartida === d.key
                          ? 'bg-primary/10 border-primary'
                          : 'border-border/20 hover:border-border/50'
                      }`}
                    >
                      <span className="text-3xl">{d.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{d.nome}</p>
                        <p className="text-xs text-muted-foreground">{d.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-center text-muted-foreground/50">
                  Você pode explorar os outros territórios depois
                </p>
              </div>
            )}

            {/* STEP 8 — Visualização do Mapa */}
            {step === 8 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-display font-semibold">Sua Cartografia Psíquica</h2>
                  <p className="text-sm text-muted-foreground">O mapa da sua cidade interior</p>
                </div>

                {/* Map Visualization */}
                <Card className="border-border/10 overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${corObj?.hex || '#0B1B2B'}15, transparent 70%)` }}
                >
                  <CardContent className="p-6 space-y-6">
                    {/* Cor & Atmosfera */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="w-8 h-8 rounded-full shadow-md" style={{ backgroundColor: corObj?.hex }} />
                      <span className="text-sm font-medium text-foreground">{cor}</span>
                      <span className="text-xs text-muted-foreground">— {corObj?.significado}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {atmosfera.map(a => (
                        <span key={a} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground">
                          {a}
                        </span>
                      ))}
                    </div>

                    {/* Territories Map */}
                    <div className="relative py-8">
                      <div className="flex justify-center">
                        <div className="relative w-64 h-64">
                          {/* Center symbol */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                              <span className="text-2xl">{SIMBOLOS.find(s => s.nome === simbolo)?.icon || '✨'}</span>
                            </div>
                          </div>
                          {/* Orbiting territories */}
                          {selectedDistritos.map((d, i) => {
                            const angle = (i / selectedDistritos.length) * Math.PI * 2 - Math.PI / 2;
                            const x = 50 + Math.cos(angle) * 38;
                            const y = 50 + Math.sin(angle) * 38;
                            const isPonto = d.key === pontoPartida;
                            return (
                              <div
                                key={d.key}
                                className={`absolute flex flex-col items-center gap-0.5 transition-all ${
                                  isPonto ? 'scale-110' : ''
                                }`}
                                style={{
                                  left: `${x}%`, top: `${y}%`,
                                  transform: 'translate(-50%, -50%)',
                                }}
                              >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                                  isPonto
                                    ? 'bg-primary/20 ring-2 ring-primary shadow-lg'
                                    : 'bg-card/60 border border-border/20'
                                }`}>
                                  {d.icon}
                                </div>
                                <span className="text-[8px] text-foreground/60 text-center whitespace-nowrap max-w-[70px] truncate">
                                  {d.nome}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Recursos & Conflitos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {recursos && (
                        <div className="rounded-lg border border-accent/20 bg-accent/5 p-3">
                          <p className="text-[10px] font-medium text-accent-foreground/70 mb-1">🌿 Recursos</p>
                          <p className="text-xs text-foreground/70 line-clamp-4 whitespace-pre-line">{recursos}</p>
                        </div>
                      )}
                      {conflitos && (
                        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                          <p className="text-[10px] font-medium text-destructive/70 mb-1">🔥 Tensões</p>
                          <p className="text-xs text-foreground/70 line-clamp-4 whitespace-pre-line">{conflitos}</p>
                        </div>
                      )}
                    </div>

                    {/* Equilíbrio */}
                    <div className="flex items-center gap-3">
                      <p className="text-xs text-muted-foreground">Índice de equilíbrio</p>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${calcEquilibrio()}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-primary">{calcEquilibrio()}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleSave} disabled={saving} variant="gold" className="flex-1">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Salvar cartografia
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => toast.info('Cartografia compartilhada com a terapeuta')}>
                    <Share2 className="w-4 h-4 mr-2" /> Compartilhar com terapeuta
                  </Button>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-xs text-muted-foreground/50">
                    Próxima ferramenta sugerida: Mapa das Vozes Internas
                  </p>
                  <p className="text-[10px] text-muted-foreground/30">
                    Esta ferramenta é exploratória, não diagnóstica. Leitura simbólica do estado psíquico.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {step > 0 && step < TOTAL_STEPS - 1 && (
        <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm border-t border-border/10 p-4">
          <div className="max-w-2xl mx-auto flex justify-between items-center">
            <Button variant="ghost" size="sm" onClick={() => setStep(s => s - 1)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
            </Button>
            <span className="text-xs text-muted-foreground">{step} / {TOTAL_STEPS - 2}</span>
            <Button
              size="sm"
              onClick={() => setStep(s => s + 1)}
              disabled={!canAdvance()}
            >
              {step === TOTAL_STEPS - 2 ? 'Ver mapa' : 'Próximo'} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Back button on final screen */}
      {step === 8 && (
        <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm border-t border-border/10 p-4">
          <div className="max-w-2xl mx-auto flex justify-between items-center">
            <Button variant="ghost" size="sm" onClick={() => setStep(7)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              Revisitar depois
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
