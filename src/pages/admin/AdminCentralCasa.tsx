import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Castle, Sparkles, BookOpen, Compass, DoorOpen, Flower2, 
  ImageIcon, Headphones, Users, Layout, Plus, ArrowRight,
  Eye, GraduationCap, MessageSquare, Library, Settings,
  Zap, FlaskConical, LayoutPanelLeft, Scroll, ExternalLink,
  Settings2, Music, Image as ImageIconLucide, Book
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function AdminCentralCasa() {
  const navigate = useNavigate();

  const { data: estacaoAtiva } = useQuery({
    queryKey: ['admin-central-casa-estacao-ativa'],
    queryFn: async () => {
      const { data } = await supabase
        .from('clube_estacoes')
        .select('id, titulo')
        .eq('ativa', true)
        .order('numero', { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    }
  });

  const { data: estacoes } = useQuery({
    queryKey: ['admin-central-casa-estacoes'],
    queryFn: async () => {
      const { data } = await supabase
        .from('clube_estacoes')
        .select('id, titulo, numero')
        .order('numero', { ascending: true });
      return data;
    }
  });

  const handleSetTab = (tab: string) => {
    if ((window as any).Admin_SetActiveTab) {
      (window as any).Admin_SetActiveTab(tab);
    } else {
      navigate(`/admin?tab=${tab}`);
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

      {/* Grid de Áreas Reorganizada */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* ROTAS DA CASA (ESTRUTURA REAL) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <Compass className="w-6 h-6 text-gold" />
              <h2 className="text-2xl font-serif text-foreground">Rotas da Casa</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-gold hover:text-gold hover:bg-gold/10 gap-2" onClick={() => handleSetTab('central-rotas')}>
              Ver todas as rotas
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <Card className="bg-gradient-to-br from-gold/5 via-card/40 to-card/40 border-gold/30 backdrop-blur-xl hover:border-gold/50 transition-all duration-500 overflow-hidden group">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="p-4 rounded-2xl bg-gold/10 group-hover:scale-110 transition-transform duration-500">
                      <Sparkles className="w-8 h-8 text-gold" />
                    </div>
                    <Badge className="bg-gold text-black font-bold px-3">JORNADA PRINCIPAL</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-3xl font-serif text-foreground group-hover:text-gold transition-colors">Rota dos Lobos</h3>
                      <div className="flex items-center gap-2 text-gold/80 font-medium text-sm">
                        <BookOpen className="w-4 h-4" />
                        <span>Obra-base: Mulheres que Correm com os Lobos</span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed max-w-xl">
                      Edite a travessia, estações, áudios e conteúdos imersivos da jornada da Natureza Instintiva.
                    </p>

                    {/* Hierarchy Display */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                      {[
                        { title: 'O Chamado Selvagem', num: 'I', order: 1 },
                        { title: 'A Mulher Domesticada', num: 'II', order: 2 },
                        { title: 'Barba Azul', num: 'III', order: 3 },
                        { title: 'Vasalisa', num: 'IV', order: 4 },
                        { title: 'Mulher Esqueleto', num: 'V', order: 5 },
                        { title: 'O Retorno da Mulher Selvagem', num: 'VI', order: 6 }
                      ].map((est, idx) => {
                        const dbEst = estacoes?.find(e => e.numero === est.order);
                        return (
                          <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group/item cursor-pointer"
                               onClick={() => dbEst ? navigate(`/admin/clube/central/${dbEst.id}`) : navigate('/admin/clube/ciclos')}>
                            <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center text-[10px] font-bold text-gold shrink-0">
                              {est.num}
                            </div>
                            <span className="text-sm font-medium text-foreground/80 group-hover/item:text-gold transition-colors truncate">
                              {est.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-6 border-t border-gold/10">
                    <Button 
                      className="bg-gold hover:bg-gold/80 text-black font-bold gap-2"
                      onClick={() => handleSetTab('central-rotas')}
                    >
                      <Zap className="w-4 h-4" />
                      Acessar Rota dos Lobos
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-gold/20 hover:bg-gold/5 text-gold gap-2"
                      onClick={() => navigate('/admin/clube/ciclos')}
                    >
                      <Settings2 className="w-4 h-4" />
                      Gerir Estações
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="text-muted-foreground hover:text-gold gap-2"
                      onClick={() => navigate('/clube')}
                    >
                      <Eye className="w-4 h-4" />
                      Ver como Aluna
                    </Button>
                  </div>
                </div>
                
                <div className="hidden md:block w-px bg-primary/10" />
                
                <div className="md:w-48 space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/40">Status Ativo</h4>
                    <div className="p-4 rounded-2xl bg-black/20 border border-gold/10 space-y-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-muted-foreground uppercase">Estação em Foco</span>
                        <span className="text-gold font-serif truncate">{estacaoAtiva?.titulo || 'Nenhuma'}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground">Progresso Geral</span>
                        <span className="text-emerald-500 font-bold">100%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-white/40">Arquitetura</h4>
                    <ul className="space-y-2 text-[11px] text-muted-foreground font-light">
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-gold" />
                        12 Portais Ativos
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-gold" />
                        6 Estações Mapeadas
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-gold" />
                        Travessia Terapêutica
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SALA DA VISITANTE */}
        <Card className="bg-card/40 border-primary/10 backdrop-blur-xl hover:border-blue-500/40 hover:bg-card/60 transition-all duration-500 overflow-hidden group">
          <CardContent className="p-8 flex flex-col h-full space-y-6">
            <div className="flex justify-between items-start">
              <div className="p-4 rounded-2xl bg-blue-500/10 group-hover:scale-110 transition-transform duration-500">
                <Users className="w-7 h-7 text-blue-500" />
              </div>
              <Badge variant="secondary" className="bg-primary/5 text-muted-foreground font-mono text-[10px] px-2">PÚBLICO</Badge>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif text-foreground group-hover:text-blue-500 transition-colors">Sala da Visitante</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">
                Conteúdos públicos e porta de entrada da Casa Orácula.
              </p>
            </div>
            <div className="mt-auto flex flex-col gap-2 pt-6 border-t border-primary/5">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full gap-2 border-primary/10"
                disabled
              >
                Editor específico ainda não configurado
              </Button>
              <Button 
                size="sm" 
                className="w-full gap-2 bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => navigate('/sala-da-visitante')}
              >
                <Eye className="w-4 h-4" />
                Ver como Visitante
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* PRIMEIRA LEITURA */}
        <Card className="bg-card/40 border-primary/10 backdrop-blur-xl hover:border-purple-500/40 hover:bg-card/60 transition-all duration-500 overflow-hidden group">
          <CardContent className="p-8 flex flex-col h-full space-y-6">
            <div className="flex justify-between items-start">
              <div className="p-4 rounded-2xl bg-purple-500/10 group-hover:scale-110 transition-transform duration-500">
                <Scroll className="w-7 h-7 text-purple-500" />
              </div>
              <Badge variant="secondary" className="bg-primary/5 text-muted-foreground font-mono text-[10px] px-2">ENTRADA</Badge>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif text-foreground group-hover:text-purple-500 transition-colors">Primeira Leitura</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">
                Mapeamento inicial e entrada na egrégora.
              </p>
            </div>
            <div className="mt-auto flex flex-col gap-2 pt-6 border-t border-primary/5">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full gap-2 border-purple-500/20 text-purple-200"
                onClick={() => handleSetTab('leituras')}
              >
                <Settings className="w-4 h-4" />
                Editar Devolutivas
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full gap-2 text-muted-foreground hover:text-purple-500"
                onClick={() => navigate('/primeira-leitura')}
              >
                <Eye className="w-4 h-4" />
                Ver como Visitante
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* BIBLIOTECA E MÍDIAS */}
        <Card className="bg-card/40 border-primary/10 backdrop-blur-xl hover:border-pink-500/40 hover:bg-card/60 transition-all duration-500 overflow-hidden group">
          <CardContent className="p-8 flex flex-col h-full space-y-6">
            <div className="flex justify-between items-start">
              <div className="p-4 rounded-2xl bg-pink-500/10 group-hover:scale-110 transition-transform duration-500">
                <Headphones className="w-7 h-7 text-pink-500" />
              </div>
              <Badge variant="secondary" className="bg-primary/5 text-muted-foreground font-mono text-[10px] px-2">MÍDIAS</Badge>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif text-foreground group-hover:text-pink-500 transition-colors">Biblioteca & Mídias</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">
                Onde edito áudios, banners, capas e imagens da rota.
              </p>
            </div>
            <div className="mt-auto grid grid-cols-2 gap-2 pt-6 border-t border-primary/5">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-primary/10 text-[10px] px-1"
                onClick={() => handleSetTab('audios')}
              >
                <Music className="w-3 h-3" />
                Gerir Áudios
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-primary/10 text-[10px] px-1"
                onClick={() => handleSetTab('clube-carrosseis-insights')}
              >
                <ImageIconLucide className="w-3 h-3" />
                Gerir Banners
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="col-span-2 gap-2 border-primary/10 text-[10px]"
                onClick={() => navigate('/admin/clube/ciclos')}
              >
                <Book className="w-3 h-3" />
                Gerir Capas (Estações)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* FORMAÇÃO E CURSOS */}
        <Card className="bg-card/40 border-primary/10 backdrop-blur-xl hover:border-rose-500/40 hover:bg-card/60 transition-all duration-500 overflow-hidden group">
          <CardContent className="p-8 flex flex-col h-full space-y-6">
            <div className="flex justify-between items-start">
              <div className="p-4 rounded-2xl bg-rose-500/10 group-hover:scale-110 transition-transform duration-500">
                <GraduationCap className="w-7 h-7 text-rose-500" />
              </div>
              <Badge variant="secondary" className="bg-primary/5 text-muted-foreground font-mono text-[10px] px-2">ACADÊMICO</Badge>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif text-foreground group-hover:text-rose-500 transition-colors">Formação & Cursos</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">
                Gerencie módulos, aulas, materiais e trilhas formativas.
              </p>
            </div>
            <div className="mt-auto pt-6 border-t border-primary/5 flex items-center justify-between">
              <Button 
                variant="ghost" 
                className="w-full gap-2 text-muted-foreground hover:text-rose-500"
                onClick={() => handleSetTab('cursos')}
              >
                Abrir Portal Acadêmico
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* TRAVESSIAS */}
        <Card className="bg-card/40 border-primary/10 backdrop-blur-xl hover:border-emerald-500/40 hover:bg-card/60 transition-all duration-500 overflow-hidden group">
          <CardContent className="p-8 flex flex-col h-full space-y-6">
            <div className="flex justify-between items-start">
              <div className="p-4 rounded-2xl bg-emerald-500/10 group-hover:scale-110 transition-transform duration-500">
                <Compass className="w-7 h-7 text-emerald-500" />
              </div>
              <Badge variant="secondary" className="bg-primary/5 text-muted-foreground font-mono text-[10px] px-2">PROCESSO</Badge>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif text-foreground group-hover:text-emerald-500 transition-colors">Travessias</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">
                Gestão de processos terapêuticos e narrativas guiadas.
              </p>
            </div>
            <div className="mt-auto pt-6 border-t border-primary/5">
              <Button 
                variant="ghost" 
                className="w-full gap-2 text-muted-foreground hover:text-emerald-500"
                onClick={() => handleSetTab('travessias')}
              >
                Gerenciar Travessias
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

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
        <Button variant="outline" className="gap-2" onClick={() => handleSetTab('settings')}>
          Abrir Configurações
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
