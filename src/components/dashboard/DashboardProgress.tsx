import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, Clock, ArrowRight, ShoppingBag } from "lucide-react";
import { formatDateSafe } from "@/lib/date-safe";

interface LastProgress {
  lessonTitle: string;
  courseTitle: string;
  courseId: string;
  updatedAt: string;
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

export function DashboardProgress() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lastProgress, setLastProgress] = useState<LastProgress | null>(null);
  const [products, setProducts] = useState<UserProduct[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchLastProgress();
    fetchProducts();
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
        if (courseIds.length > 0) {
          const { data: courses } = await supabase
            .from("courses")
            .select("id, titulo")
            .in("id", courseIds);

          courses?.forEach((c) => {
            items.push({ id: c.id, titulo: c.titulo, tipo: "curso", status: "Ativo" });
          });
        }
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
    <div className="grid md:grid-cols-2 gap-5 mb-8">
      {/* Progresso da Jornada */}
      <motion.div {...anim(0.35)}>
        <Card className="glass border-primary/15 h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display flex items-center gap-2 text-foreground">
              <Play className="w-4 h-4 text-primary" />
              Progresso da Jornada
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
                    {formatDateSafe(lastProgress.updatedAt, "dd/MM 'às' HH:mm", undefined, 'Data indisponível', 'dashboard.progress.updated-at')}
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

      {/* Meus Produtos */}
      <motion.div {...anim(0.4)}>
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
  );
}
