import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar, Users } from "lucide-react";

interface CommunityThread {
  id: string;
  titulo: string;
  autor_id: string;
  respostas_count: number | null;
  autorNome?: string;
}

const anim = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

export function DashboardCommunity() {
  const navigate = useNavigate();
  const [threads, setThreads] = useState<CommunityThread[]>([]);

  useEffect(() => {
    fetchThreads();
  }, []);

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

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {/* Atividade Recente */}
      <motion.div {...anim(0.5)}>
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
              onClick={() => navigate("/comunidade")}
            >
              Ver tudo
            </Button>
          </CardHeader>
          <CardContent>
            {threads.length > 0 ? (
              <ul className="space-y-3">
                {threads.map((t) => (
                  <li key={t.id} className="flex items-start gap-3 group cursor-pointer" onClick={() => navigate("/comunidade")}>
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

      {/* Próximos Encontros */}
      <motion.div {...anim(0.55)}>
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
    </div>
  );
}
