import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  BookOpen, RefreshCw, DoorOpen, GraduationCap, MessageSquare, Library,
  ArrowRight, Wrench, Settings, Sparkles, Plus, Clock, Layout, LucideIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/shared/SectionHeader';

interface HubCard {
  key: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tab: string;
  color: string;
  bg: string;
  statType?: 'ciclos' | 'portais' | 'acervo' | 'treinamento' | 'chat';
}

const PREMIUM_CARDS: HubCard[] = [
  {
    key: 'ciclos',
    title: 'Ciclos & Estações',
    description: 'Gestão de jornadas temporais e livros ativos.',
    icon: RefreshCw,
    tab: 'clube-jornadas',
    color: 'text-gold',
    bg: 'bg-gold/10',
    statType: 'ciclos',
  },
  {
    key: 'portais',
    title: 'Portais Simbólicos',
    description: 'Configuração da cartografia: Porta, Campo, Torre e Labirinto.',
    icon: DoorOpen,
    tab: 'clube-portais',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    statType: 'portais',
  },
  {
    key: 'conteudos',
    title: 'Acervo & Biblioteca',
    description: 'Gestão de livros, áudios e materiais de apoio.',
    icon: Library,
    tab: 'clube-acervo',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    statType: 'acervo',
  },
  {
    key: 'treinamento',
    title: 'Sala de Treinamento',
    description: 'Configuração de simulações clínicas e orientações éticas.',
    icon: GraduationCap,
    tab: 'clube-treinamento',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    statType: 'treinamento',
  },
  {
    key: 'chat',
    title: 'Chat com o Livro',
    description: 'Perguntas guiadas e base de conhecimento da IA.',
    icon: MessageSquare,
    tab: 'clube-chat',
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
    statType: 'chat',
  },
];

export default function AdminClubeHub() {
  const navigate = useNavigate();
  const { data: stats } = useQuery({
    queryKey: ['admin-clube-hub-premium-stats'],
    queryFn: async () => {
      const [ciclos, books, estacoes, portais, perguntas] = await Promise.all([
        supabase.from('clube_livro_ciclos').select('id', { count: 'exact', head: true }),
        supabase.from('books').select('id', { count: 'exact', head: true }),
        supabase.from('clube_estacoes').select('id', { count: 'exact', head: true }),
        supabase.from('clube_portais').select('id', { count: 'exact', head: true }),
        supabase.from('clube_livro_perguntas').select('id', { count: 'exact', head: true }),
      ]);
      return {
        ciclos: cycles_count(estacoes.count, ciclos.count),
        books: books.count || 0,
        portais: portais.count || 0,
        chat: perguntas.count || 0,
      };
    },
  });

  function cycles_count(est: number | null, cic: number | null) {
    return (est || 0) + (cic || 0);
  }

  const getStatText = (type?: string) => {
    if (!stats) return '...';
    switch (type) {
      case 'ciclos': return `${stats.ciclos} Ativos`;
      case 'portais': return `${stats.portais} Mapeados`;
      case 'acervo': return `${stats.books} Obras`;
      case 'chat': return `${stats.chat} Prompts`;
      case 'treinamento': return `Ativo`;
      default: return '';
    }
  };

  const handleTabChange = (tab: string) => {
    // Navigate via URL to ensure the Admin component's effect picks it up
    // This is safer than just calling the global function which might be stale
    switch (tab) {
      case 'clube-jornadas': navigate('/admin/clube/ciclos'); break;
      case 'clube-portais': navigate('/admin/clube/portais'); break;
      case 'clube-acervo': navigate('/admin/clube/conteudos'); break;
      case 'clube-treinamento': navigate('/admin/clube/treinamento'); break;
      case 'clube-chat': navigate('/admin/clube/chat'); break;
      case 'settings': navigate('/admin?tab=settings'); break;
      case 'gerador-semanal': navigate('/admin?tab=gerador-semanal'); break;
      default:
        if ((window as any).Admin_SetActiveTab) {
          (window as any).Admin_SetActiveTab(tab);
        } else {
          navigate(`/admin?tab=${tab}`);
        }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Editorial */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-primary/10">
        <div className="space-y-2">
          <Badge variant="outline" className="text-gold border-gold/30 bg-gold/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold">
            Editorial Admin Premium
          </Badge>
          <h1 className="text-4xl md:text-5xl font-serif text-foreground tracking-tight">
            Clube de Leitura <span className="text-gold italic">Oracular</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg font-light leading-relaxed">
            Painel operacional para gestão de jornadas simbólicas, 
            treinamentos clínicos e orquestração de inteligência narrativa.
          </p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="border-gold/20 hover:bg-gold/5 text-gold gap-2" onClick={() => handleTabChange('settings')}>
             <Settings className="w-4 h-4" />
             Configurações
           </Button>
           <Button className="bg-gold hover:bg-gold/80 text-black font-semibold gap-2" onClick={() => handleTabChange('clube-jornadas')}>
             <Plus className="w-4 h-4" />
             Novo Ciclo
           </Button>
        </div>
      </div>

      {/* Grid de Cards Estilo Netflix/Notion */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PREMIUM_CARDS.map((card, idx) => (
          <div 
            key={card.key} 
            onClick={() => handleTabChange(card.tab)}
            className="group relative cursor-pointer"
          >
            <Card className="h-full bg-card/40 border-primary/10 backdrop-blur-xl hover:border-gold/40 hover:bg-card/60 transition-all duration-500 overflow-hidden group">
              <div className={cn("absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700", card.bg)} />
              
              <CardContent className="p-8 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <div className={cn("p-4 rounded-2xl transition-transform duration-500 group-hover:scale-110", card.bg)}>
                    <card.icon className={cn("w-7 h-7", card.color)} />
                  </div>
                  <Badge variant="secondary" className="bg-primary/5 text-muted-foreground font-mono text-[10px] px-2">
                    0{idx + 1}
                  </Badge>
                </div>

                <div className="space-y-2 mb-8">
                  <h3 className="text-2xl font-serif text-foreground group-hover:text-gold transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">
                    {card.description}
                  </p>
                </div>

                <div className="mt-auto pt-6 border-t border-primary/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                    <Clock className="w-3 h-3" />
                    {getStatText(card.statType)}
                  </div>
                  <div className="w-8 h-8 rounded-full border border-primary/10 flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-all duration-300">
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-black transition-colors" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}

        {/* Card Especial: Ateliê IA */}
        <div 
          onClick={() => handleTabChange('gerador-semanal')}
          className="group relative cursor-pointer md:col-span-1"
        >
          <Card className="h-full bg-gradient-to-br from-gold/10 to-transparent border-gold/20 hover:border-gold/50 transition-all duration-500 overflow-hidden">
            <CardContent className="p-8 flex flex-col h-full relative">
              <Sparkles className="absolute top-4 right-4 w-12 h-12 text-gold/20 animate-pulse" />
              <div className="mb-8">
                <div className="p-4 rounded-2xl bg-gold/20 w-fit">
                  <Wrench className="w-7 h-7 text-gold" />
                </div>
              </div>
              <div className="space-y-2 mb-8">
                <h3 className="text-2xl font-serif text-gold">Ateliê de Conteúdo IA</h3>
                <p className="text-sm text-muted-foreground/80 leading-relaxed font-light">
                  Gere rascunhos de cartas, roteiros de podcasts e práticas clínicas usando inteligência artificial narrativa.
                </p>
              </div>
              <div className="mt-auto pt-6 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-gold font-bold">Laboratório 80/20</span>
                <Button size="sm" variant="ghost" className="text-gold hover:bg-gold/10" onClick={() => navigate('/admin/atelie-conteudo')}>Acessar Ferramenta</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Seção de Resumo/Atividade Estilo Notion */}
      <div className="pt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="bg-muted/10 border-primary/5">
            <CardContent className="p-8">
               <div className="flex items-center gap-3 mb-6">
                  <Layout className="w-5 h-5 text-gold" />
                  <h4 className="font-serif text-xl">Estrutura Operacional</h4>
               </div>
               <div className="space-y-4">
                  {[
                    { label: 'Fluxo de Criação', desc: 'Criar Ciclo → Definir Portais → Adicionar Acervo' },
                    { label: 'Treinamento Ativo', desc: 'Simulações baseadas no ciclo vigente' },
                    { label: 'IA Oracular', desc: 'Base de conhecimento integrada ao livro' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/5">
                       <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                       <div>
                          <p className="text-sm font-semibold">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>

         <Card className="bg-gold/5 border-gold/10">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-4">
               <div className="p-4 rounded-full bg-gold/10">
                  <BookOpen className="w-8 h-8 text-gold" />
               </div>
               <h4 className="font-serif text-2xl">Manual da Guardiã</h4>
               <p className="text-sm text-muted-foreground max-w-sm font-light leading-relaxed">
                 O admin agora é modular. Cada área acima representa um pilar do Clube.
                 Use o <strong>Ateliê de Conteúdo</strong> para acelerar a criação de materiais semanais.
               </p>
               <Button variant="link" className="text-gold hover:text-gold/80 uppercase tracking-widest text-[10px] font-bold" onClick={() => navigate('/admin/modulos-formativos')}>
                 Ver Documentação do Sistema
               </Button>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
