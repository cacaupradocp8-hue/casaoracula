import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { MobilePageShell } from '@/components/shared/MobilePageShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  GraduationCap, BookOpen, Users, Calendar, Target, Award,
  ChevronRight, Clock, BarChart3, MessageCircle, FileUp, Zap, Sparkles
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

interface FormacaoCourse {
  id: string;
  titulo: string;
  subtitulo: string | null;
  descricao: string;
  capa_url: string | null;
  duracao_estimada: string | null;
  tags: string[];
  totalLessons: number;
  completedLessons: number;
}

const TEAM = [
  { name: 'Fundadora & Mentora', role: 'Criadora do Método Orácula', description: 'Guia da formação simbólica e condutora das travessias.' },
  { name: 'Supervisora Clínica', role: 'Supervisão de Casos', description: 'Acompanhamento ético e técnico das práticas.' },
  { name: 'Facilitadoras Sêniores', role: 'Suporte Pedagógico', description: 'Apoio nas atividades práticas e fóruns.' },
];

const OBJECTIVES = [
  'Dominar as ferramentas de leitura de campo simbólico',
  'Conduzir sessões individuais e em grupo com segurança ética',
  'Integrar arquétipos, narrativas e rituais na prática clínica',
  'Desenvolver competência para supervisão e certificação',
  'Construir identidade profissional como Facilitadora Orácula',
];

export default function FormacaoMetodoPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<FormacaoCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    const fetchFormacaoCourses = async () => {
      try {
        // Fetch courses tagged or linked to formação
        const { data: coursesData } = await supabase
          .from('courses')
          .select('id, titulo, subtitulo, descricao, capa_url, duracao_estimada, tags')
          .eq('publicado', true)
          .order('ordem', { ascending: true });

        if (!coursesData) { setIsLoading(false); return; }

        const enriched: FormacaoCourse[] = [];
        let totalAll = 0, completedAll = 0;

        for (const c of coursesData) {
          const { count: lessonCount } = await supabase
            .from('course_lessons')
            .select('id', { count: 'exact', head: true })
            .in('module_id', 
              (await supabase.from('course_modules').select('id').eq('course_id', c.id)).data?.map(m => m.id) || []
            );

          let completed = 0;
          if (user) {
            const moduleIds = (await supabase.from('course_modules').select('id').eq('course_id', c.id)).data?.map(m => m.id) || [];
            const lessonIds = (await supabase.from('course_lessons').select('id').in('module_id', moduleIds.length > 0 ? moduleIds : ['none'])).data?.map(l => l.id) || [];
            if (lessonIds.length > 0) {
              const { count } = await supabase
                .from('course_lesson_progress')
                .select('id', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('completed', true)
                .in('lesson_id', lessonIds);
              completed = count || 0;
            }
          }

          const total = lessonCount || 0;
          totalAll += total;
          completedAll += completed;

          enriched.push({
            ...c,
            tags: c.tags || [],
            totalLessons: total,
            completedLessons: completed,
          });
        }

        setCourses(enriched);
        setOverallProgress(totalAll > 0 ? Math.round((completedAll / totalAll) * 100) : 0);
      } catch (err) {
        console.error('Error fetching formação courses:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormacaoCourses();
  }, [user]);

  return (
    <AppLayout>
      <MobilePageShell
        badge="Formação"
        title="Formação no Método Orácula"
        subtitle="Sua jornada de certificação como Facilitadora Orácula"
      >
        <div className="pb-20 space-y-10">
          {/* Welcome Hero */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gold/10 via-primary/5 to-background border border-border/30 p-6 md:p-8"
          >
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-gold" />
                <span className="text-sm font-medium text-gold">Bem-vinda à Formação</span>
              </div>
              <h2 className="font-display text-xl md:text-2xl font-bold text-foreground leading-tight">
                Uma jornada de profundidade, ética e competência simbólica
              </h2>
              <p className="text-foreground/80 leading-relaxed max-w-2xl">
                A Formação no Método Orácula é um processo progressivo de certificação que integra
                ferramentas de leitura de campo, narrativas simbólicas, condução de sessões e
                sustentação profissional. Cada módulo foi desenhado para construir maturidade clínica real.
              </p>

              {user && (
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-sm text-foreground/50">
                    <BarChart3 className="w-4 h-4" />
                    <span className="text-foreground/70">Progresso geral: {overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2 max-w-xs" />
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { icon: BookOpen, label: 'Módulos', href: '#modules', color: 'text-gold' },
              { icon: Zap, label: 'Treinamento', href: '/sala-de-treinamento', color: 'text-primary' },
              { icon: Sparkles, label: 'Simulação', href: '/sala-de-treinamento', color: 'text-purple-400' },
              { icon: MessageCircle, label: 'Fórum', href: '/formacao-metodo/forum', color: 'text-blue-400' },
              { icon: FileUp, label: 'Avaliações', href: '/formacao-metodo/avaliacoes', color: 'text-emerald-400' },
              { icon: Award, label: 'Certificado', href: '/formacao-metodo/avaliacoes', color: 'text-amber-400' },
            ].map(action => (
              <Link key={action.label} to={action.href}>
                <Card className="hover:bg-muted/30 transition-colors border-border/30 cursor-pointer h-full">
                  <CardContent className="p-4 text-center space-y-2 flex flex-col justify-center h-full">
                    <action.icon className={`w-6 h-6 mx-auto ${action.color}`} />
                    <p className="text-sm font-medium text-foreground/80">{action.label}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Objectives */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-gold/60" />
              <h2 className="font-display text-lg font-semibold text-foreground">Objetivos da Formação</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {OBJECTIVES.map((obj, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border/20">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center text-xs font-bold text-gold">
                    {i + 1}
                  </span>
                  <p className="text-sm text-foreground/85 leading-relaxed">{obj}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Modules / Courses */}
          <section id="modules">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-gold/60" />
              <h2 className="font-display text-lg font-semibold text-foreground">Módulos & Cursos</h2>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
              </div>
            ) : courses.length === 0 ? (
              <Card className="p-8 text-center border-border/30">
                <p className="text-foreground/50">Nenhum curso disponível no momento.</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {courses.map((course, i) => {
                  const pct = course.totalLessons > 0
                    ? Math.round((course.completedLessons / course.totalLessons) * 100) : 0;
                  return (
                    <Link key={course.id} to={`/cursos/${course.id}`}>
                      <Card className="hover:bg-muted/20 transition-colors border-border/30 overflow-hidden">
                        <CardContent className="p-4 flex gap-4">
                          {course.capa_url ? (
                            <img src={course.capa_url} alt="" className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-gold/10 to-primary/10 flex items-center justify-center flex-shrink-0">
                              <BookOpen className="w-8 h-8 text-gold/30" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-foreground/60">Módulo {i + 1}</span>
                              {course.tags.map(t => (
                                <Badge key={t} variant="outline" className="text-xs border-border/30">{t}</Badge>
                              ))}
                            </div>
                            <h3 className="font-display font-semibold text-foreground/90 truncate">{course.titulo}</h3>
                            <div className="flex items-center gap-3 text-xs text-foreground/60">
                              {course.duracao_estimada && (
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duracao_estimada}</span>
                              )}
                              <span>{course.totalLessons} aulas</span>
                            </div>
                            {user && pct > 0 && (
                              <div className="flex items-center gap-2">
                                <Progress value={pct} className="h-1.5 flex-1" />
                                <span className="text-xs text-foreground/60">{pct}%</span>
                              </div>
                            )}
                          </div>
                          <ChevronRight className="w-5 h-5 text-foreground/40 flex-shrink-0 self-center" />
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* Schedule */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-gold/60" />
              <h2 className="font-display text-lg font-semibold text-foreground">Cronograma</h2>
            </div>
            <Card className="border-border/30">
              <CardContent className="p-5 space-y-3">
                {[
                  { phase: 'Fase 1 — Fundamentos', desc: 'Leitura de campo, portas simbólicas, mapeamento', weeks: 'Semanas 1–4' },
                  { phase: 'Fase 2 — Condução', desc: 'Sessões práticas, protocolos, ética profissional', weeks: 'Semanas 5–8' },
                  { phase: 'Fase 3 — Integração', desc: 'Supervisão, casos reais, certificação', weeks: 'Semanas 9–12' },
                ].map((p, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-xs font-bold text-gold">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm text-foreground">{p.phase}</h4>
                        <span className="text-xs text-foreground/60">{p.weeks}</span>
                      </div>
                      <p className="text-xs text-foreground/70 mt-0.5">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          {/* Team */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-gold/60" />
              <h2 className="font-display text-lg font-semibold text-foreground">Equipe</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {TEAM.map((member, i) => (
                <Card key={i} className="border-border/30">
                  <CardContent className="p-4 text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-gold/10 mx-auto flex items-center justify-center">
                      <Users className="w-6 h-6 text-gold/40" />
                    </div>
                    <h4 className="font-medium text-sm text-foreground">{member.name}</h4>
                    <p className="text-xs text-gold">{member.role}</p>
                    <p className="text-xs text-foreground/70">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </MobilePageShell>
    </AppLayout>
  );
}
