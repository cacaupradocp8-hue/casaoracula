import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft, ArrowRight, Play, BookOpen, CheckCircle2,
  Sparkles, FileText, ChevronRight, Moon, Eye, Key
} from "lucide-react";

type View = "overview" | "modules" | "lesson";

interface Module { id: string; titulo: string; descricao: string | null; subtitulo: string | null; ordem: number; estudos_caso: any; }
interface Lesson { id: string; titulo: string; texto_aula: string | null; video_url: string | null; audio_url: string | null; descricao_curta: string | null; ordem: number; module_id: string; }
interface LessonProgress { lesson_id: string; completed: boolean; }

const MOD_ICONS: Record<string, string> = {
  "Introdução à Cabala Onírica": "🕎",
  "Símbolo: Pés": "🦶",
  "Símbolo: Joelhos": "🦵",
  "Símbolo: Mãos": "🤲",
  "Símbolo: Boca e Dentes": "👄",
  "Símbolo: Voos": "🕊️",
  "Símbolo: Estradas": "🛤️",
  "Estudos de Caso Integrados": "📋",
};

const ESTUDOS: Record<string, string> = {
  "Símbolo: Pés": "Sonho: 'Caminhava descalça sobre vidro sem sentir dor.' — Análise: Os pés descalços sobre vidro indicam uma travessia dolorosa que a sonhadora está minimizando conscientemente. Malkut pede aterramento — o corpo sabe, mas a mente nega. Intervenção: trabalhar a reconexão com sensações físicas reais.",
  "Símbolo: Joelhos": "Sonho: 'Meus joelhos dobraram sozinhos e caí no chão de uma igreja.' — Análise: A rendição involuntária. Os joelhos cedem quando o ego resiste ao que a alma já sabe. Netzach/Hod pedem equilíbrio entre persistência e entrega. Intervenção: ritual de ajoelhar-se conscientemente.",
  "Símbolo: Mãos": "Sonho: 'Minhas mãos estavam cheias de terra e não conseguia lavá-las.' — Análise: Terra nas mãos é matéria prima, potencial não trabalhado. Chesed quer dar, mas a sonhadora sente-se 'suja' por criar. Intervenção: exercício somático de modelar argila com intenção.",
  "Símbolo: Boca e Dentes": "Sonho: 'Meus dentes caíam um a um enquanto tentava falar.' — Análise: O sonho mais universal. Da'at bloqueado — há conhecimento que precisa ser falado mas gera medo de desintegração. Intervenção: práticas de voz e nomeação do que está silenciado.",
  "Símbolo: Voos": "Sonho: 'Voava sobre minha cidade, mas não conseguia descer.' — Análise: Tiferet inflado — a beleza da transcendência vira dissociação. A sonhadora precisa voltar ao corpo, não subir mais. Intervenção: exercícios de enraizamento e presença corporal.",
  "Símbolo: Estradas": "Sonho: 'Estava numa encruzilhada com três caminhos, todos escuros.' — Análise: Os 22 caminhos da Árvore se manifestam como escolha. A escuridão não é ameaça — é o desconhecido que toda iniciação exige. Intervenção: trabalho com a carta do Louco no Tarot como espelho.",
  "Estudos de Caso Integrados": "Caso completo: Cliente sonha repetidamente com 'correr descalça por uma estrada sem fim, com dentes caindo'. Integração: Pés (Malkut) + Estradas (caminhos) + Dentes (Da'at). A cliente está em fuga de uma verdade que precisa ser dita, mas sente que falar a destruirá. O trabalho combina enraizamento (pés), nomeação (dentes) e aceitação do caminho desconhecido (estrada).",
};

const CursoChaveOniricaPage: React.FC = () => {
  const { user } = useAuth();
  const [view, setView] = useState<View>("overview");
  const [courseId, setCourseId] = useState<string | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [exerciseText, setExerciseText] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCourse(); }, [user]);

  const fetchCourse = async () => {
    setLoading(true);
    const { data: course } = await supabase.from("courses").select("id").eq("titulo", "A Chave Onírica: Interpretação de Sonhos pela Cabala").single();
    if (!course) { setLoading(false); return; }
    setCourseId(course.id);

    const [{ data: mods }, { data: lsns }] = await Promise.all([
      supabase.from("course_modules").select("id, titulo, descricao, subtitulo, ordem, estudos_caso").eq("course_id", course.id).order("ordem"),
      supabase.from("course_lessons").select("id, titulo, texto_aula, video_url, audio_url, descricao_curta, ordem, module_id").eq("publicado", true).order("ordem"),
    ]);
    if (mods) setModules(mods);
    if (lsns) setLessons(lsns);

    if (user && lsns && lsns.length > 0) {
      const { data: prog } = await supabase.from("course_lesson_progress").select("lesson_id, completed").eq("user_id", user.id).in("lesson_id", lsns.map(l => l.id));
      if (prog) setProgress(prog);
    }
    setLoading(false);
  };

  const openModule = (mod: Module) => {
    setSelectedModule(mod);
    const modLessons = lessons.filter(l => l.module_id === mod.id);
    if (modLessons.length > 0) openLesson(modLessons[0], mod);
    else setView("modules");
  };

  const openLesson = async (lesson: Lesson, mod?: Module) => {
    setSelectedLesson(lesson);
    if (mod) setSelectedModule(mod);
    setView("lesson");
    setExerciseText("");
    if (user) {
      const { data } = await supabase.from("course_exercise_responses").select("resposta").eq("user_id", user.id).eq("lesson_id", lesson.id).maybeSingle();
      if (data) setExerciseText(data.resposta);
    }
  };

  const markComplete = async () => {
    if (!user || !selectedLesson) return;
    setSaving(true);
    if (exerciseText.trim()) {
      await supabase.from("course_exercise_responses").upsert({ user_id: user.id, lesson_id: selectedLesson.id, resposta: exerciseText.trim() } as any, { onConflict: "user_id,lesson_id" });
    }
    await supabase.from("course_lesson_progress").upsert({ user_id: user.id, lesson_id: selectedLesson.id, completed: true, completed_at: new Date().toISOString() }, { onConflict: "user_id,lesson_id" });
    setProgress(prev => {
      const ex = prev.find(p => p.lesson_id === selectedLesson.id);
      if (ex) return prev.map(p => p.lesson_id === selectedLesson.id ? { ...p, completed: true } : p);
      return [...prev, { lesson_id: selectedLesson.id, completed: true }];
    });
    toast.success("Aula concluída!");
    setSaving(false);
  };

  const isComplete = (id: string) => progress.some(p => p.lesson_id === id && p.completed);
  const completedCount = progress.filter(p => p.completed).length;
  const totalLessons = lessons.length;
  const pct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const modLessons = selectedModule ? lessons.filter(l => l.module_id === selectedModule.id) : [];
  const lessonIdx = selectedLesson ? modLessons.findIndex(l => l.id === selectedLesson.id) : -1;

  const goNext = () => {
    if (lessonIdx < modLessons.length - 1) openLesson(modLessons[lessonIdx + 1]);
    else { const mi = modules.findIndex(m => m.id === selectedModule?.id); if (mi < modules.length - 1) openModule(modules[mi + 1]); }
  };
  const goPrev = () => { if (lessonIdx > 0) openLesson(modLessons[lessonIdx - 1]); };

  const tr = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 } };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Moon className="h-8 w-8 animate-pulse text-primary" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          {view !== "overview" && (
            <Button variant="ghost" size="icon" onClick={() => setView(view === "lesson" ? "modules" : "overview")}><ArrowLeft className="h-5 w-5" /></Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Key className="h-6 w-6 text-primary" />A Chave Onírica</h1>
            <p className="text-sm text-muted-foreground">Interpretação de Sonhos pela Cabala</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === "overview" && (
            <motion.div key="ov" {...tr} className="space-y-6">
              <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-purple-500/10 border border-border/30 p-8 relative">
                <div className="absolute top-4 right-4 text-6xl opacity-15">🕎</div>
                <h2 className="text-xl font-bold text-foreground mb-3">Interpretação de Sonhos pela Cabala</h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Um mergulho na tradição cabalística de leitura onírica. Cada módulo aborda um símbolo corporal — pés, joelhos, mãos, boca, voos, estradas — e sua correspondência na Árvore da Vida, conectando prática clínica à linguagem sagrada dos sonhos.
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <Badge variant="secondary">8 módulos</Badge>
                  <Badge variant="secondary">{totalLessons} aulas</Badge>
                  <Badge variant="outline">Formação</Badge>
                </div>
                {completedCount > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-muted-foreground mb-1"><span>Progresso</span><span>{pct}%</span></div>
                    <Progress value={pct} className="h-2" />
                  </div>
                )}
                <Button size="lg" className="gap-2" onClick={() => setView("modules")}>
                  <Play className="h-5 w-5" /> {completedCount > 0 ? "Continuar Curso" : "Iniciar Curso"}
                </Button>
              </div>
              <div className="grid gap-3">
                {modules.slice(0, 4).map(m => (
                  <Card key={m.id} className="cursor-pointer hover:shadow-md transition-shadow border-border/50" onClick={() => openModule(m)}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <span className="text-2xl">{MOD_ICONS[m.titulo] || "🌀"}</span>
                      <div className="flex-1"><h3 className="font-semibold text-foreground text-sm">{m.titulo}</h3><p className="text-xs text-muted-foreground">{m.subtitulo}</p></div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </CardContent>
                  </Card>
                ))}
                {modules.length > 4 && <Button variant="ghost" className="text-primary" onClick={() => setView("modules")}>Ver todos os {modules.length} módulos →</Button>}
              </div>
            </motion.div>
          )}

          {view === "modules" && (
            <motion.div key="mods" {...tr} className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-foreground">Módulos do Curso</h2>
                <span className="text-sm text-muted-foreground">{completedCount}/{totalLessons} concluídas</span>
              </div>
              {modules.map(mod => {
                const ml = lessons.filter(l => l.module_id === mod.id);
                const done = ml.every(l => isComplete(l.id));
                const started = ml.some(l => isComplete(l.id));
                return (
                  <Card key={mod.id} className="cursor-pointer hover:shadow-lg transition-all border-border/50" onClick={() => openModule(mod)}>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <span className="text-3xl mt-1">{MOD_ICONS[mod.titulo] || "🌀"}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1"><h3 className="font-bold text-foreground">{mod.titulo}</h3>{done && <CheckCircle2 className="h-4 w-4 text-green-500" />}</div>
                          {mod.subtitulo && <p className="text-sm text-primary/80 mb-1">{mod.subtitulo}</p>}
                          <p className="text-sm text-muted-foreground">{mod.descricao}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={done ? "default" : started ? "secondary" : "outline"} className="text-xs">{done ? "Concluído" : started ? "Em andamento" : "Não iniciado"}</Badge>
                            <span className="text-xs text-muted-foreground">{ml.length} aula(s)</span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground mt-2" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </motion.div>
          )}

          {view === "lesson" && selectedLesson && selectedModule && (
            <motion.div key="lesson" {...tr} className="space-y-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{MOD_ICONS[selectedModule.titulo] || "🌀"}</span><span>{selectedModule.titulo}</span><span>•</span><span>Aula {lessonIdx + 1}/{modLessons.length}</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">{selectedLesson.titulo}</h2>

              {selectedLesson.video_url ? (
                <div className="aspect-video rounded-xl overflow-hidden bg-muted"><iframe src={selectedLesson.video_url} className="w-full h-full" allowFullScreen /></div>
              ) : (
                <div className="aspect-video rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-border/30 flex items-center justify-center">
                  <div className="text-center"><Play className="h-12 w-12 text-primary/40 mx-auto mb-2" /><p className="text-sm text-muted-foreground">Vídeo em breve</p></div>
                </div>
              )}

              {selectedLesson.texto_aula && (
                <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> Transcrição</CardTitle></CardHeader>
                  <CardContent><p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{selectedLesson.texto_aula}</p></CardContent>
                </Card>
              )}

              <Card className="border-primary/20">
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /> Exercício de Decifração</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">Registre um sonho recente que contenha o símbolo estudado. Descreva o sonho e ofereça sua leitura cabalística, identificando a Sefirá relacionada e possíveis intervenções.</p>
                  <Textarea value={exerciseText} onChange={e => setExerciseText(e.target.value)} placeholder="Descreva o sonho e sua análise..." rows={5} className="resize-none" />
                </CardContent>
              </Card>

              {ESTUDOS[selectedModule.titulo] && (
                <Card className="border-indigo-500/20 bg-indigo-500/5">
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><Eye className="h-4 w-4" /> Estudo de Caso</CardTitle></CardHeader>
                  <CardContent><p className="text-sm text-foreground/80 leading-relaxed italic">{ESTUDOS[selectedModule.titulo]}</p></CardContent>
                </Card>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <Button variant="ghost" disabled={lessonIdx <= 0} onClick={goPrev} className="gap-1"><ArrowLeft className="h-4 w-4" /> Anterior</Button>
                <Button onClick={markComplete} disabled={saving || isComplete(selectedLesson.id)} variant={isComplete(selectedLesson.id) ? "secondary" : "default"} className="gap-2">
                  {isComplete(selectedLesson.id) ? <><CheckCircle2 className="h-4 w-4" /> Concluída</> : saving ? "Salvando..." : "Marcar como Concluída"}
                </Button>
                <Button variant="ghost" onClick={goNext} className="gap-1">Próxima <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CursoChaveOniricaPage;
