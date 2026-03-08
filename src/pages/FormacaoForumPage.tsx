import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { MobilePageShell } from '@/components/shared/MobilePageShell';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, MessageCircle, ChevronLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ModuleForumSection } from '@/components/courses/ModuleForumSection';

interface ForumModule {
  id: string;
  titulo: string;
  course_id: string;
  course_titulo: string;
  ordem: number;
}

export default function FormacaoForumPage() {
  const [modules, setModules] = useState<ForumModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: coursesData } = await supabase
          .from('courses')
          .select('id, titulo')
          .eq('publicado', true)
          .order('ordem');

        if (!coursesData) { setIsLoading(false); return; }

        const allModules: ForumModule[] = [];
        for (const c of coursesData) {
          const { data: mods } = await supabase
            .from('course_modules')
            .select('id, titulo, ordem')
            .eq('course_id', c.id)
            .eq('publicado', true)
            .order('ordem');

          (mods || []).forEach(m => allModules.push({
            ...m,
            course_id: c.id,
            course_titulo: c.titulo,
          }));
        }

        setModules(allModules);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  // Group by course
  const grouped = modules.reduce<Record<string, { titulo: string; modules: ForumModule[] }>>((acc, m) => {
    if (!acc[m.course_id]) acc[m.course_id] = { titulo: m.course_titulo, modules: [] };
    acc[m.course_id].modules.push(m);
    return acc;
  }, {});

  return (
    <AppLayout>
      <MobilePageShell
        badge="Fórum"
        title="Fórum de Dúvidas"
        subtitle="Tire suas dúvidas por módulo com instrutoras e colegas"
      >
        <div className="pb-20 space-y-6">
          <Link to="/formacao-metodo" className="inline-flex items-center gap-2 text-foreground/40 hover:text-foreground text-sm">
            <ChevronLeft className="w-4 h-4" /> Voltar à Formação
          </Link>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
            </div>
          ) : Object.keys(grouped).length === 0 ? (
            <Card className="p-8 text-center border-border/30">
              <p className="text-foreground/50">Nenhum módulo disponível.</p>
            </Card>
          ) : (
            <Accordion type="multiple" className="space-y-4">
              {Object.entries(grouped).map(([courseId, group]) => (
                <div key={courseId} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gold/60" />
                    <h3 className="font-display text-sm font-semibold text-foreground/60">{group.titulo}</h3>
                  </div>
                  {group.modules.map(mod => (
                    <AccordionItem key={mod.id} value={mod.id} className="border border-border/30 rounded-xl overflow-hidden">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center gap-2 text-left">
                          <MessageCircle className="w-4 h-4 text-primary/60" />
                          <span className="text-sm font-medium">{mod.titulo}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <ModuleForumSection moduleId={mod.id} moduleTitle={mod.titulo} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </div>
              ))}
            </Accordion>
          )}
        </div>
      </MobilePageShell>
    </AppLayout>
  );
}
