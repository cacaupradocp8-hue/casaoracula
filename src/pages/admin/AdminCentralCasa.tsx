import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Castle, Sparkles, BookOpen, Compass, DoorOpen, Flower2, 
  ImageIcon, Headphones, Users, Layout, Plus, ArrowRight,
  Eye, GraduationCap, MessageSquare, Library, Settings,
  Zap, FlaskConical, LayoutPanelLeft, Scroll
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface HouseArea {
  title: string;
  description: string;
  icon: any;
  tab?: string;
  route?: string;
  color: string;
  bg: string;
  tag?: string;
}

const HOUSE_AREAS: HouseArea[] = [
  {
    title: 'Rota dos Lobos',
    description: 'Jornada principal da Natureza Instintiva.',
    icon: Sparkles,
    route: '/admin/clube/ciclos',
    color: 'text-gold',
    bg: 'bg-gold/10',
    tag: 'JORNADA'
  },
  {
    title: 'Clube de Leitura',
    description: 'Gestão de obras, estações e editorial.',
    icon: BookOpen,
    tab: 'clube',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    tag: 'EDITORIAL'
  },
  {
    title: 'Travessias',
    description: 'Processos terapêuticos e narrativos guiados.',
    icon: Compass,
    tab: 'travessias',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    tag: 'PROCESSO'
  },
  {
    title: 'Sala da Visitante',
    description: 'Conteúdos públicos e entrada da Casa.',
    icon: Users,
    route: '/',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    tag: 'PUBLICO'
  },
  {
    title: 'Primeira Leitura',
    description: 'Mapeamento inicial e entrada na egrégora.',
    icon: Scroll,
    tab: 'leituras',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    tag: 'ENTRADA'
  },
  {
    title: 'Portais & Jardins',
    description: 'Configuração de espaços e micro-conteúdos.',
    icon: DoorOpen,
    tab: 'clube-portais',
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    tag: 'AMBIENTE'
  },
  {
    title: 'Estúdio de Áudio',
    description: 'Gestão de trilhas, narrações e meditações.',
    icon: Headphones,
    tab: 'audios',
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
    tag: 'SONORO'
  },
  {
    title: 'Banners & Visual',
    description: 'Identidade visual e avisos da Central.',
    icon: ImageIcon,
    tab: 'clube-carrosseis-insights',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
    tag: 'VISUAL'
  },
  {
    title: 'Formação & Cursos',
    description: 'Aulas, módulos e certificação profissional.',
    icon: GraduationCap,
    tab: 'cursos',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
    tag: 'ACADÊMICO'
  }
];

export default function AdminCentralCasa() {
  const navigate = useNavigate();

  const handleNavigate = (area: HouseArea) => {
    if (area.route) {
      navigate(area.route);
    } else if (area.tab) {
      if ((window as any).Admin_SetActiveTab) {
        (window as any).Admin_SetActiveTab(area.tab);
      } else {
        navigate(`/admin?tab=${area.tab}`);
      }
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-primary/10">
        <div className="space-y-3">
          <Badge variant="outline" className="text-gold border-gold/30 bg-gold/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold">
            Guardiã da Casa
          </Badge>
          <h1 className="text-4xl md:text-6xl font-serif text-foreground tracking-tight">
            Central da <span className="text-gold italic">Casa Orácula</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg font-light leading-relaxed">
            Bem-vinda ao coração operacional. Aqui você governa cada espaço, 
            da Rota dos Lobos ao silêncio do Estúdio.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-primary/20 hover:bg-primary/5 text-muted-foreground gap-2" onClick={() => navigate('/')}>
            <Eye className="w-4 h-4" />
            Visão da Aluna
          </Button>
          <Button className="bg-gold hover:bg-gold/80 text-black font-semibold gap-2" onClick={() => navigate('/admin/clube/ciclos')}>
            <Plus className="w-4 h-4" />
            Nova Estação
          </Button>
        </div>
      </div>

      {/* Grid de Áreas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {HOUSE_AREAS.map((area, idx) => (
          <div 
            key={idx}
            onClick={() => handleNavigate(area)}
            className="group relative cursor-pointer"
          >
            <Card className="h-full bg-card/40 border-primary/10 backdrop-blur-xl hover:border-gold/40 hover:bg-card/60 transition-all duration-500 overflow-hidden group">
              <div className={cn("absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700", area.bg)} />
              
              <CardContent className="p-8 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <div className={cn("p-4 rounded-2xl transition-transform duration-500 group-hover:scale-110", area.bg)}>
                    <area.icon className={cn("w-7 h-7", area.color)} />
                  </div>
                  <Badge variant="secondary" className="bg-primary/5 text-muted-foreground font-mono text-[10px] px-2">
                    {area.tag}
                  </Badge>
                </div>

                <div className="space-y-2 mb-8">
                  <h3 className="text-2xl font-serif text-foreground group-hover:text-gold transition-colors">
                    {area.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">
                    {area.description}
                  </p>
                </div>

                <div className="mt-auto pt-6 border-t border-primary/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                    <Zap className="w-3 h-3 text-gold" />
                    Gerenciar Área
                  </div>
                  <div className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-all duration-300">
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-black transition-colors" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Footer / Quick Access */}
      <div className="p-8 bg-muted/20 border border-primary/10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
            <Settings className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Configurações do Ecossistema</h4>
            <p className="text-sm text-muted-foreground font-light">Acessos, integrações e dados globais da Casa.</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => (window as any).Admin_SetActiveTab?.('settings')}>
          Abrir Configurações
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
