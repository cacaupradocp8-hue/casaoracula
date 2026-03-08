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
  Sparkles, Music, FileText, Star, Lock, ChevronRight
} from "lucide-react";

type View = "overview" | "modules" | "lesson";

interface Module {
  id: string;
  titulo: string;
  descricao: string | null;
  subtitulo: string | null;
  ordem: number;
  estudos_caso: any;
}

interface Lesson {
  id: string;
  titulo: string;
  texto_aula: string | null;
  video_url: string | null;
  audio_url: string | null;
  descricao_curta: string | null;
  ordem: number;
  module_id: string;
}

interface LessonProgress {
  lesson_id: string;
  completed: boolean;
}

const DEUSA_ICONS: Record<string, string> = {
  "Introdução aos Arquétipos": "🌀",
  "Ártemis: A Caçadora": "🏹",
  "Atena: A Estrategista": "🦉",
  "Afrodite: A Alquimista do Desejo": "🌹",
  "Deméter: A Grande Mãe": "🌾",
  "Perséfone: A Guardiã do Submundo": "🌙",
  "Héstia: O Fogo Interior": "🔥",
  "Integração: A Dança das Deusas": "✨",
};

const ESTUDOS_CASO: Record<string, string> = {
  "Ártemis: A Caçadora": "Uma cliente de 35 anos relata dificuldade em manter relacionamentos. Análise: Ártemis hiperativada — autonomia excessiva como defesa contra vulnerabilidade. O trabalho terapêutico envolve honrar a Caçadora sem que ela impeça o vínculo.",
  "Atena: A Estrategista": "Terapeuta identifica em sua cliente padrão de racionalização excessiva das emoções. Atena domina o Conselho Interior, silenciando vozes mais instintivas. A integração requer dar espaço para o corpo falar.",
  "Afrodite: A Alquimista do Desejo": "Cliente artista relata bloqueio criativo após término. A Forja está fria — Afrodite recolhida. O ritual de reativação envolve reconectar prazer e criação sem o vínculo externo.",
  "Deméter: A Grande Mãe": "Facilitadora identifica em si esgotamento por cuidar excessivamente das clientes. Deméter inflada no Jardim. Limite saudável: nutrir sem se esvaziar.",
  "Perséfone: A Guardiã do Submundo": "Cliente em luto profundo resiste a trabalhar a perda. Perséfone convida à descida — não como destruição, mas como iniciação. O Labirinto é caminho, não prisão.",
  "Héstia: O Fogo Interior": "Terapeuta percebe que sua cliente não consegue ficar sozinha. Héstia ausente na Praça da Integração. Prática: rituais de silêncio e presença para reacender o fogo interno.",
};

const MEDITACOES: Record<string, string> = {
  "Introdução aos Arquétipos": "Feche os olhos. Respire profundamente três vezes. Imagine que você está na entrada de uma cidade antiga... sua cidade interior. Quem a recebe no Portão? Qual deusa está ali, esperando?",
  "Ártemis: A Caçadora": "Imagine-se em uma floresta densa. Você está sozinha, mas não tem medo. Seus pés conhecem o caminho. Sinta a força de quem não precisa de permissão para existir.",
  "Atena: A Estrategista": "Visualize um salão de pedra iluminado por tochas. No centro, uma mesa com um mapa. Você se senta e olha o mapa da sua vida. O que Atena mostra que precisa de estratégia?",
  "Afrodite: A Alquimista do Desejo": "Sinta o calor subindo pela base da sua coluna. Uma rosa vermelha desabrocha no centro do seu peito. O que seu desejo mais profundo quer lhe dizer?",
  "Deméter: A Grande Mãe": "Imagine-se em um campo fértil. Suas mãos tocam a terra. Tudo que você plantou está crescendo. O que precisa de mais cuidado? O que já pode ser colhido?",
  "Perséfone: A Guardiã do Submundo": "Você desce uma escada em espiral. Cada degrau leva mais fundo. No fundo, há uma sala iluminada por cristais. O que mora ali que você precisa encontrar?",
  "Héstia: O Fogo Interior": "Imagine uma chama dourada no centro do seu corpo. Ela não queima — ela aquece. É sua presença, seu lar interno. Apenas observe a chama. Nada a fazer. Apenas ser.",
  "Integração: A Dança das Deusas": "Todas as deusas que você encontrou estão agora em círculo dentro de você. Observe como se movem, como se olham. Qual é a dança que nasce entre elas?",
};

const CursoDeusasPage: React.FC = () => {
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

  useEffect(() => {
    fetchCourse();
  }, [user]);

  const fetchCourse = async () => {
    setLoading(true);
    const { data: course } = await supabase
      .from("courses")
      .select("id")
      .eq("titulo", "Despertando as Deusas: Arquétipos Femininos na CidaDELA")
      .single();

    if (!course) { setLoading(false); return; }
    setCourseId(course.id);

    const [{ data: mods }, { data: lsns }] = await Promise.all([
      supabase.from("course_modules").select("id, titulo, descricao, subtitulo, ordem, estudos_caso").eq("course_id", course.id).order("ordem"),
      supabase.from("course_lessons").select("id, titulo, texto_aula, video_url, audio_url, descricao_curta, ordem, module_id").eq("publicado", true).order("ordem"),
    ]);

    if (mods) setModules(mods);
    if (lsns) setLessons(lsns);

    if (user) {
      const lessonIds = (lsns || []).map(l => l.id);
      if (lessonIds.length > 0) {
        const { data: prog } = await supabase
          .from("course_lesson_progress")
          .select("lesson_id, completed")
          .eq("user_id", user.id)
          .in("lesson_id", lessonIds);
        if (prog) setProgress(prog);
      }

      // Load exercise response for current lesson if any
    }
    setLoading(false);
  };

  const openModule = (mod: Module) => {
    setSelectedModule(mod);
    const modLessons = lessons.filter(l => l.module_id === mod.id);
    if (modLessons.length > 0) {
      openLesson(modLessons[0], mod);
    } else {
      setView("modules");
    }
  };

  const openLesson = async (lesson: Lesson, mod?: Module) => {
    setSelectedLesson(lesson);
    if (mod) setSelectedModule(mod);
    setView("lesson");
    setExerciseText("");

    if (user) {
      const { data } = await supabase
        .from("course_exercise_responses")
        .select("resposta")
        .eq("user_id", user.id)
        .eq("lesson_id", lesson.id)
        .maybeSingle();
      if (data) setExerciseText(data.resposta);
    }
  };

  const markComplete = async () => {
    if (!user || !selectedLesson) return;
    setSaving(true);

    // Save exercise if filled
    if (exerciseText.trim()) {
      await supabase.from("course_exercise_responses").upsert({
        user_id: user.id,
        lesson_id: selectedLesson.id,
        resposta: exerciseText.trim(),
      } as any, { onConflict: "user_id,lesson_id" });
    }

    // Mark lesson complete
    await supabase.from("course_lesson_progress").upsert({
      user_id: user.id,
      lesson_id: selectedLesson.id,
      completed: true,
      completed_at: new Date().toISOString(),
    }, { onConflict: "user_id,lesson_id" });

    setProgress(prev => {
      const existing = prev.find(p => p.lesson_id === selectedLesson.id);
      if (existing) return prev.map(p => p.lesson_id === selectedLesson.id ? { ...p, completed: true } : p);
      return [...prev, { lesson_id: selectedLesson.id, completed: true }];
    });

    toast.success("Aula marcada como concluída!");
    setSaving(false);
  };

  const isLessonComplete = (lessonId: string) => progress.some(p => p.lesson_id === lessonId && p.completed);
  const completedCount = progress.filter(p => p.completed).length;
  const totalLessons = lessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const currentModuleLessons = selectedModule ? lessons.filter(l => l.module_id === selectedModule.id) : [];
  const currentLessonIndex = selectedLesson ? currentModuleLessons.findIndex(l => l.id === selectedLesson.id) : -1;

  const goNextLesson = () => {
    if (currentLessonIndex < currentModuleLessons.length - 1) {
      openLesson(currentModuleLessons[currentLessonIndex + 1]);
    } else {
      // Go to next module
      const modIndex = modules.findIndex(m => m.id === selectedModule?.id);
      if (modIndex < modules.length - 1) {
        openModule(modules[modIndex + 1]);
      }
    }
  };

  const goPrevLesson = () => {
    if (currentLessonIndex > 0) {
      openLesson(currentModuleLessons[currentLessonIndex - 1]);
    }
  };

  const transition = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 } };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Sparkles className="h-8 w-8 animate-pulse text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          {view !== "overview" && (
            <Button variant="ghost" size="icon" onClick={() => setView(view === "lesson" ? "modules" : "overview")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Star className="h-6 w-6 text-primary" />
              Despertando as Deusas
            </h1>
            <p className="text-sm text-muted-foreground">Arquétipos Femininos na CidaDELA</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* OVERVIEW */}
          {view === "overview" && (
            <motion.div key="overview" {...transition} className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 border border-border/30 p-8">
                <div className="absolute top-4 right-4 text-6xl opacity-20">✨</div>
                <h2 className="text-xl font-bold text-foreground mb-3">Arquétipos Femininos na CidaDELA Interior</h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Um mergulho profundo nos arquétipos femininos e como eles habitam os territórios da CidaDELA Interior. 
                  Cada módulo ativa uma deusa e o distrito que ela governa — de Ártemis nas Torres até Perséfone no Labirinto.
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <Badge variant="secondary">8 módulos</Badge>
                  <Badge variant="secondary">{totalLessons} aulas</Badge>
                  <Badge variant="outline">Formação</Badge>
                </div>

                {completedCount > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                      <span>Progresso</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                  </div>
                )}

                <Button size="lg" className="gap-2" onClick={() => setView("modules")}>
                  <Play className="h-5 w-5" /> {completedCount > 0 ? "Continuar Curso" : "Iniciar Curso"}
                </Button>
              </div>

              {/* Quick module preview */}
              <div className="grid gap-3">
                {modules.slice(0, 4).map(m => (
                  <Card key={m.id} className="cursor-pointer hover:shadow-md transition-shadow border-border/50" onClick={() => openModule(m)}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <span className="text-2xl">{DEUSA_ICONS[m.titulo] || "🌀"}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-sm">{m.titulo}</h3>
                        <p className="text-xs text-muted-foreground">{m.subtitulo}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </CardContent>
                  </Card>
                ))}
                {modules.length > 4 && (
                  <Button variant="ghost" className="text-primary" onClick={() => setView("modules")}>
                    Ver todos os {modules.length} módulos →
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {/* MODULES */}
          {view === "modules" && (
            <motion.div key="modules" {...transition} className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-foreground">Módulos do Curso</h2>
                <span className="text-sm text-muted-foreground">{completedCount}/{totalLessons} aulas concluídas</span>
              </div>

              {modules.map(mod => {
                const modLessons = lessons.filter(l => l.module_id === mod.id);
                const modComplete = modLessons.every(l => isLessonComplete(l.id));
                const modStarted = modLessons.some(l => isLessonComplete(l.id));

                return (
                  <Card key={mod.id} className="cursor-pointer hover:shadow-lg transition-all border-border/50" onClick={() => openModule(mod)}>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <span className="text-3xl mt-1">{DEUSA_ICONS[mod.titulo] || "🌀"}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-foreground">{mod.titulo}</h3>
                            {modComplete && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                          </div>
                          {mod.subtitulo && <p className="text-sm text-primary/80 mb-1">{mod.subtitulo}</p>}
                          <p className="text-sm text-muted-foreground">{mod.descricao}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={modComplete ? "default" : modStarted ? "secondary" : "outline"} className="text-xs">
                              {modComplete ? "Concluído" : modStarted ? "Em andamento" : "Não iniciado"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{modLessons.length} aula(s)</span>
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

          {/* LESSON */}
          {view === "lesson" && selectedLesson && selectedModule && (
            <motion.div key="lesson" {...transition} className="space-y-6">
              {/* Module context */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{DEUSA_ICONS[selectedModule.titulo] || "🌀"}</span>
                <span>{selectedModule.titulo}</span>
                <span>•</span>
                <span>Aula {currentLessonIndex + 1} de {currentModuleLessons.length}</span>
              </div>

              <h2 className="text-xl font-bold text-foreground">{selectedLesson.titulo}</h2>

              {/* Video placeholder */}
              {selectedLesson.video_url ? (
                <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                  <iframe src={selectedLesson.video_url} className="w-full h-full" allowFullScreen />
                </div>
              ) : (
                <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border/30 flex items-center justify-center">
                  <div className="text-center">
                    <Play className="h-12 w-12 text-primary/40 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Vídeo em breve</p>
                  </div>
                </div>
              )}

              {/* Transcription */}
              {selectedLesson.texto_aula && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> Transcrição da Aula</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{selectedLesson.texto_aula}</p>
                  </CardContent>
                </Card>
              )}

              {/* Exercise */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /> Exercício de Autoidentificação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Reflita: Como {selectedModule.titulo.includes(":") ? selectedModule.titulo.split(":")[0] : "este arquétipo"} se manifesta na sua vida? 
                    Em quais momentos você reconhece essa energia? Como ela aparece no seu trabalho clínico?
                  </p>
                  <Textarea
                    value={exerciseText}
                    onChange={e => setExerciseText(e.target.value)}
                    placeholder="Escreva sua reflexão aqui..."
                    rows={5}
                    className="resize-none"
                  />
                </CardContent>
              </Card>

              {/* Case Study */}
              {ESTUDOS_CASO[selectedModule.titulo] && (
                <Card className="border-amber-500/20 bg-amber-500/5">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">📋 Estudo de Caso</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/80 leading-relaxed italic">{ESTUDOS_CASO[selectedModule.titulo]}</p>
                  </CardContent>
                </Card>
              )}

              {/* Meditation */}
              {MEDITACOES[selectedModule.titulo] && (
                <Card className="border-violet-500/20 bg-violet-500/5">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2"><Music className="h-4 w-4" /> Meditação Guiada</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedLesson.audio_url ? (
                      <audio controls className="w-full mb-3">
                        <source src={selectedLesson.audio_url} />
                      </audio>
                    ) : (
                      <div className="bg-muted/50 rounded-lg p-4 mb-3 flex items-center gap-3">
                        <Music className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Áudio em breve</span>
                      </div>
                    )}
                    <p className="text-sm text-foreground/70 italic leading-relaxed">{MEDITACOES[selectedModule.titulo]}</p>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <Button variant="ghost" disabled={currentLessonIndex <= 0} onClick={goPrevLesson} className="gap-1">
                  <ArrowLeft className="h-4 w-4" /> Anterior
                </Button>
                <Button
                  onClick={markComplete}
                  disabled={saving || isLessonComplete(selectedLesson.id)}
                  className="gap-2"
                  variant={isLessonComplete(selectedLesson.id) ? "secondary" : "default"}
                >
                  {isLessonComplete(selectedLesson.id) ? (
                    <><CheckCircle2 className="h-4 w-4" /> Concluída</>
                  ) : (
                    <>{saving ? "Salvando..." : "Marcar como Concluída"}</>
                  )}
                </Button>
                <Button variant="ghost" onClick={goNextLesson} className="gap-1">
                  Próxima <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CursoDeusasPage;
