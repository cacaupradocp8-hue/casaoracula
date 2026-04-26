import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOraculoPortaisResumo } from '@/hooks/useOraculoPortais';
import { ArrowLeft, DoorOpen, Pencil, CheckCircle2, Circle } from 'lucide-react';

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    draft: { label: 'Rascunho', variant: 'secondary' },
    published: { label: 'Publicado', variant: 'default' },
    archived: { label: 'Arquivado', variant: 'outline' },
  };
  const s = map[status] || map.draft;
  return <Badge variant={s.variant}>{s.label}</Badge>;
}

function CompleteBullet({ ok }: { ok: boolean }) {
  return ok
    ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
    : <Circle className="w-3.5 h-3.5 text-muted-foreground/30" />;
}

export default function AdminOraculoPortais() {
  const { data: portais = [], isLoading } = useOraculoPortaisResumo();

  const sections = [
    { key: 'tem_essencia', label: 'Essência' },
    { key: 'tem_audio_principal', label: 'Áudio' },
    { key: 'tem_laboratorio', label: 'Lab' },
    { key: 'tem_jardins', label: 'Jardins' },
    { key: 'tem_aplicacao', label: 'Aplicação' },
    { key: 'tem_narroterapia', label: 'Narroterapia' },
    { key: 'tem_forja', label: 'Forja' },
    { key: 'tem_ferramenta', label: 'Ferramenta' },
    { key: 'tem_risco_etico', label: 'Risco' },
  ];

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin/clube">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <SectionHeader
            title="Portais Oraculares"
            subtitle="Gestão dos 8 portais formativos"
            icon={<DoorOpen className="w-5 h-5" />}
          />
        </div>

        {isLoading ? (
          <p className="text-center py-12 text-muted-foreground text-sm">Carregando portais…</p>
        ) : (
          <div className="space-y-3">
            {portais.map((p: any) => {
              const done = sections.filter(s => p[s.key]).length;
              const total = sections.length;
              return (
                <Card key={p.id} className="hover:border-primary/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {p.ordem}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm">{p.nome}</h3>
                          <StatusBadge status={p.status} />
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{p.descricao_curta}</p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {sections.map(s => (
                            <div key={s.key} className="flex items-center gap-1" title={s.label}>
                              <CompleteBullet ok={p[s.key]} />
                              <span className="text-[10px] text-muted-foreground">{s.label}</span>
                            </div>
                          ))}
                          <span className="text-[10px] text-muted-foreground ml-2">({done}/{total})</span>
                        </div>
                      </div>
                      <Link to={`/admin/clube/oraculo-portais/${p.id}`}>
                        <Button variant="outline" size="sm">
                          <Pencil className="w-3.5 h-3.5 mr-1" /> Editar
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
