import { useParams, Link } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { CasaMaquinasSidebar } from '@/components/casa-maquinas/CasaMaquinasSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ChevronDown, Sparkles, Star, Heart } from 'lucide-react';
import { VOZES } from '@/data/vozes';
import { useUserVoz } from '@/hooks/useUserVoz';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

function CollapseBlock({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border/40 rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/30 transition-colors">
        <span className="font-display font-semibold text-foreground">{title}</span>
        <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="px-5 pb-5 space-y-3 text-sm text-muted-foreground">{children}</div>}
    </div>
  );
}

export default function VozDetalhePage() {
  const { vozId } = useParams();
  const voz = VOZES.find(v => v.id === vozId);
  const { voz_primaria, voz_apoio, setVozAtiva } = useUserVoz();

  if (!voz) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <CasaMaquinasSidebar />
          <main className="flex-1 p-10 text-center text-muted-foreground">Voz não encontrada.</main>
        </div>
      </SidebarProvider>
    );
  }

  const isPrimaria = voz.id === voz_primaria;
  const isApoio = voz.id === voz_apoio;

  const handleUsarVoz = async () => {
    const success = await setVozAtiva(voz.id);
    if (success) {
      toast.success(`Voz "${voz.nome}" ativada para a sessão atual`);
    } else {
      toast.error('Erro ao ativar voz');
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <CasaMaquinasSidebar />
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <Link to="/casa-das-maquinas/7-vozes/lista">
                <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
              </Link>
              <div className="w-8 h-8 rounded-full shrink-0" style={{ backgroundColor: `hsl(${voz.cor})` }} />
              <h1 className="text-2xl font-display font-bold text-foreground">{voz.nome}</h1>
              {isPrimaria && (
                <Badge className="bg-gold/15 text-gold border-gold/30 gap-1">
                  <Star className="w-3 h-3" /> Sua voz primária
                </Badge>
              )}
              {isApoio && (
                <Badge variant="outline" className="border-primary/30 text-primary gap-1">
                  <Heart className="w-3 h-3" /> Voz de apoio
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground italic text-lg">"{voz.frase}"</p>

            <CollapseBlock title="Essência" defaultOpen>
              <p><span className="font-medium text-foreground">Arquétipo central:</span> {voz.arquetipoCentral}</p>
              <p><span className="font-medium text-foreground">Função psicológica:</span> {voz.funcaoPsicologica}</p>
              <p><span className="font-medium text-foreground">Forma de condução:</span> {voz.formaConducao}</p>
            </CollapseBlock>

            <CollapseBlock title="Cidade">
              <p><span className="font-medium text-foreground">Distritos mais utilizados:</span></p>
              <div className="flex flex-wrap gap-2">
                {voz.distritos.map(d => (
                  <span key={d} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{d}</span>
                ))}
              </div>
              <p className="pt-2">{voz.conducaoJornada}</p>
            </CollapseBlock>

            <CollapseBlock title="Ferramentas">
              <div className="flex flex-wrap gap-2">
                {voz.ferramentas.map(f => (
                  <span key={f} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">{f}</span>
                ))}
              </div>
            </CollapseBlock>

            <CollapseBlock title="Clínico">
              <p><span className="font-medium text-foreground">Perguntas clínicas:</span></p>
              <ul className="list-disc list-inside space-y-1">
                {voz.perguntasClinicas.map(p => <li key={p}>{p}</li>)}
              </ul>
              <p className="pt-2"><span className="font-medium text-foreground">Estilo de sessão:</span> {voz.estiloSessao}</p>
              <p><span className="font-medium text-foreground">Tipo de cliente:</span> {voz.tipoCliente}</p>
            </CollapseBlock>

            <CollapseBlock title="Sombra">
              <p><span className="font-medium text-foreground">Sombra possível:</span> {voz.sombraPossivel}</p>
              <p><span className="font-medium text-foreground">Riscos clínicos:</span> {voz.riscosClinicos}</p>
            </CollapseBlock>

            <CollapseBlock title="Expansão">
              <p><span className="font-medium text-foreground">Uso em grupos:</span> {voz.usoGrupos}</p>
              <p><span className="font-medium text-foreground">Uso na formação:</span> {voz.usoFormacao}</p>
            </CollapseBlock>

            <Button variant="gold" size="lg" className="w-full gap-2" onClick={handleUsarVoz}>
              <Sparkles className="w-4 h-4" /> Usar esta Voz na sessão
            </Button>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
