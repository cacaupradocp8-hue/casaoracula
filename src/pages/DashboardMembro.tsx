import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Play, Calendar, MessageCircle, ShoppingBag, BookOpen, Clock, ArrowRight, Users } from "lucide-react";
import { ptBR } from "date-fns/locale";
import { formatDateSafe } from "@/lib/date-safe";

interface LastProgress {
  lessonTitle: string;
  courseTitle: string;
  courseId: string;
  updatedAt: string;
}

interface CommunityThread {
  id: string;
  titulo: string;
  autor_id: string;
  created_at: string;
  respostas_count: number | null;
  autorNome?: string;
}

interface UserProduct {
  id: string;
  titulo: string;
  tipo: "curso" | "assinatura";
  status: string;
}

const anim = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

export default function DashboardMembro() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lastProgress, setLastProgress] = useState<LastProgress | null>(null);
  const [threads, setThreads] = useState<CommunityThread[]>([]);
  const [products, setProducts] = useState<UserProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const welcomeName = user?.name?.split(" ")[0] || "Membro";

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchLastProgress(), fetchThreads(), fetchProducts()]);
      setLoading(false);
    };
    load();
  }, [user]);

  const fetchLastProgress = async () => {
    try {
      const { data } = await supabase
        .from("course_lesson_progress")
        .select("lesson_id, updated_at, completed")
        .eq("user_id", user!.id)
        .order("updated_at", { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        const { data: lesson } = await supabase
          .from("course_lessons")
          .select("titulo, module_id")
          .eq("id", data[0].lesson_id)
          .single();

        if (lesson) {
          const { data: mod } = await supabase
            .from("course_modules")
            .select("course_id, titulo")
            .eq("id", lesson.module_id)
            .single();

          if (mod) {
            const { data: course } = await supabase
              .from("courses")
              .select("titulo")
              .eq("id", mod.course_id)
              .single();

            setLastProgress({
              lessonTitle: lesson.titulo,
              courseTitle: course?.titulo || mod.titulo,
              courseId: mod.course_id,
              updatedAt: data[0].updated_at,
            });
          }
        }
      }
    } catch (e) {
      console.error("Error fetching progress:", e);
    }
  };

  const fetchThreads = async () => {
    try {
      const { data } = await supabase
        .from("casa_circulo_threads")
        .select("id, titulo, autor_id, created_at, respostas_count")
        .eq("status", "active")
        .order("ultima_atividade", { ascending: false })
        .limit(5);

      if (data) {
        const autorIds = [...new Set(data.map((t) => t.autor_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, nome")
          .in("id", autorIds);

        const profileMap = new Map(profiles?.map((p) => [p.id, p.nome]) || []);
        setThreads(
          data.map((t) => ({ ...t, autorNome: profileMap.get(t.autor_id) || "Membro" }))
        );
      }
    } catch (e) {
      console.error("Error fetching threads:", e);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data: enrollments } = await supabase
        .from("course_enrollments")
        .select("id, course_id, ativo")
        .eq("user_id", user!.id)
        .eq("ativo", true);

      const items: UserProduct[] = [];

      if (enrollments) {
        const courseIds = enrollments.map((e) => e.course_id);
        const { data: courses } = await supabase
          .from("courses")
          .select("id, titulo")
          .in("id", courseIds);

        courses?.forEach((c) => {
          items.push({ id: c.id, titulo: c.titulo, tipo: "curso", status: "Ativo" });
        });
      }

      const { data: subs } = await supabase
        .from("subscriptions")
        .select("id, status, plan_id")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(3);

      subs?.forEach((s) => {
        items.push({
          id: s.id,
          titulo: s.plan_id || "Assinatura",
          tipo: "assinatura",
          status: s.status === "active" ? "Ativa" : s.status === "past_due" ? "Pendente" : "Inativa",
        });
      });

      setProducts(items);
    } catch (e) {
      console.error("Error fetching products:", e);
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-5 md:px-6 py-8 pb-20 max-w-5xl">
        {/* Header */}
        <motion.div {...anim(0)} className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-1">
            Bem-vinda, <span className="text-primary">{welcomeName}</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* 1. Minha Jornada */}
          <motion.div {...anim(0.1)}>
            <Card className="glass border-primary/15 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-display flex items-center gap-2 text-foreground">
                  <Play className="w-4 h-4 text-primary" />
                  Minha Jornada
                </CardTitle>
              </CardHeader>
              <CardContent>
                {lastProgress ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground/80">{lastProgress.courseTitle}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Última aula: {lastProgress.lessonTitle}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(lastProgress.updatedAt), "dd/MM 'às' HH:mm")}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 border-primary/20 text-primary hover:bg-primary/5"
                      onClick={() => navigate(`/cursos/${lastProgress.courseId}`)}
                    >
                      Continuar <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <BookOpen className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Nenhuma aula iniciada ainda.</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3 gap-1.5 border-primary/20 text-primary hover:bg-primary/5"
                      onClick={() => navigate("/cursos")}
                    >
                      Explorar Cursos <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* 2. Próximos Encontros */}
          <motion.div {...anim(0.15)}>
            <Card className="glass border-primary/15 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-display flex items-center gap-2 text-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  Próximos Encontros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <Calendar className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Nenhum encontro agendado.</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Os próximos eventos aparecerão aqui.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 3. Atividade Recente */}
          <motion.div {...anim(0.2)}>
            <Card className="glass border-primary/15 h-full">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-display flex items-center gap-2 text-foreground">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  Atividade Recente
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-primary hover:bg-primary/5"
                  onClick={() => navigate("/casa-tecelas")}
                >
                  Ver tudo
                </Button>
              </CardHeader>
              <CardContent>
                {threads.length > 0 ? (
                  <ul className="space-y-3">
                    {threads.map((t) => (
                      <li key={t.id} className="flex items-start gap-3 group cursor-pointer" onClick={() => navigate("/casa-tecelas")}>
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Users className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-foreground/80 truncate group-hover:text-primary transition-colors">
                            {t.titulo}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t.autorNome} · {t.respostas_count || 0} respostas
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhuma discussão recente.
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* 4. Meus Produtos */}
          <motion.div {...anim(0.25)}>
            <Card className="glass border-primary/15 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-display flex items-center gap-2 text-foreground">
                  <ShoppingBag className="w-4 h-4 text-primary" />
                  Meus Produtos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {products.length > 0 ? (
                  <ul className="space-y-2.5">
                    {products.map((p) => (
                      <li key={p.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          {p.tipo === "curso" ? (
                            <BookOpen className="w-4 h-4 text-muted-foreground shrink-0" />
                          ) : (
                            <ShoppingBag className="w-4 h-4 text-muted-foreground shrink-0" />
                          )}
                          <span className="text-sm text-foreground/80 truncate">{p.titulo}</span>
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                            p.status === "Ativo" || p.status === "Ativa"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : p.status === "Pendente"
                              ? "bg-amber-500/10 text-amber-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {p.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-4">
                    <ShoppingBag className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Nenhum produto ativo.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
