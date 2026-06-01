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

function getObraFromItem(item: any) {
  const metadata = (item?.metadata || {}) as Record<string, unknown>;
  const livro_titulo = typeof metadata.livro_titulo === 'string' ? metadata.livro_titulo.trim() : '';
  return livro_titulo || null;
}

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

  const { data: dbData } = useQuery({
    queryKey: ['admin-central-casa-db-v2'],
    queryFn: async () => {
      const { data: estacoes } = await supabase
        .from('clube_estacoes')
        .select('id, titulo, numero, livro_titulo, publicada')
        .order('numero', { ascending: true });
        
      const { data: items } = await supabase
        .from('clube_rota_itens')
        .select('estacao_id, rota_custom, tipo, metadata')
        .not('rota_custom', 'is', null);

      return { estacoes: estacoes || [], items: items || [] };
    }
  });

  const { estacoes, items } = dbData || { estacoes: [], items: [] };

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

          {(() => {
            // 1) Mapear Estação → Rota
            const estacaoToRota = new Map<string, string>();
            (items || []).forEach((i: any) => {
              if (i.rota_custom) estacaoToRota.set(i.estacao_id, i.rota_custom);
            });

            // 2) Mapear Obra → Rota
            const obraToRota = new Map<string, string>();
            (estacoes || []).forEach((e: any) => {
              const rota = estacaoToRota.get(e.id);
              if (rota && e.livro_titulo) obraToRota.set(e.livro_titulo, rota);
            });

            // 3) Agrupar por Rota (agora real, baseada em rota_custom)
            const grupos = new Map<string, { rota: string; estacoes: any[]; principalObra: string }>();
            (estacoes || []).forEach((e: any) => {
              const obra = e.livro_titulo || 'Sem Obra';
              if (obra.startsWith('SISTEMA_ROTAS:')) return; // Pular marcadores de sistema

              const rota = obraToRota.get(obra) || (obra.includes('Mulheres que Correm com os Lobos') ? 'Rota dos Lobos' : `Outras: ${obra}`);
              
              if (!grupos.has(rota)) {
                grupos.set(rota, { rota, estacoes: [], principalObra: obra });
              }
              
              // Só adiciona ao grupo se for uma estação real (não marcador de obra)
              if (e.numero > 0 && e.subtitulo !== 'MARCADOR_OBRA') {
                grupos.get(rota)!.estacoes.push(e);
              }
            });
            const rotas = Array.from(grupos.values());

            if (rotas.length === 0) {
              return (
                <Card className="bg-card/40 border-dashed border-primary/10 backdrop-blur-xl">
                  <CardContent className="p-8 text-center space-y-3">
                    <Sparkles className="w-8 h-8 text-gold mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Nenhuma Rota mapeada. Crie uma Rota e vincule uma Obra-base para começar.
                    </p>
                    <Button
                      className="bg-gold hover:bg-gold/80 text-black font-bold gap-2"
                      onClick={() => handleSetTab('central-rotas')}
                    >
                      Abrir Rotas da Casa <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            }

            return (
              <div className="grid grid-cols-1 gap-4">
                {rotas.map((g, idx) => {
                  const principal = idx === 0;
                  const totalEstacoes = g.estacoes.length;
                  const publicadas = g.estacoes.filter((e: any) => e.publicada).length;
                  return (
                    <Card
                      key={g.rota}
                      className={cn(
                        'bg-card/60 border-primary/10 backdrop-blur-xl transition-all group',
                        principal && 'bg-gradient-to-br from-gold/5 via-card/40 to-card/40 border-gold/30 hover:border-gold/50'
                      )}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex items-start gap-4 min-w-0">
                            <div className={cn(
                              'p-3 rounded-2xl shrink-0',
                              principal ? 'bg-gold/10 text-gold' : 'bg-primary/10 text-foreground/70'
                            )}>
                              <Sparkles className="w-6 h-6" />
                            </div>
                            <div className="space-y-1 min-w-0">
                              <h3 className={cn(
                                'text-xl md:text-2xl font-serif truncate',
                                principal && 'group-hover:text-gold transition-colors'
                              )}>
                                {g.rota}
                              </h3>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <BookOpen className="w-3.5 h-3.5 text-gold/60" />
                                <span>Itens da Rota: {g.rota}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {totalEstacoes} estação(ões) · {publicadas} publicada(s)
                              </p>
                            </div>
                          </div>
                          <Badge className={cn(
                            'shrink-0',
                            publicadas > 0 ? 'bg-gold text-black' : 'bg-muted text-muted-foreground'
                          )}>
                            {publicadas > 0 ? 'Ativa' : 'Rascunho'}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-5 mt-5 border-t border-primary/5">
                          <Button
                            size="sm"
                            className="bg-gold hover:bg-gold/80 text-black font-bold gap-2"
                            onClick={() => handleSetTab('central-rotas')}
                          >
                            <Zap className="w-4 h-4" />
                            Gerenciar Rota
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-primary/20 gap-2"
                            onClick={() => navigate(`/admin/clube/ciclos?obra=${encodeURIComponent(g.principalObra)}`)}
                          >
                            <Settings2 className="w-4 h-4" />
                            Gerir Estações
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            );
          })()}
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
