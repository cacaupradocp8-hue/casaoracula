import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Compass, Plus, Sparkles, BookOpen, Clock, Users, 
  ArrowRight, Shield, Zap, Search, Filter, MoreVertical,
  LayoutGrid, List as ListIcon, Star, Settings2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export default function AdminRotasCasa() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const rotas = [
    {
      id: 'rota-dos-lobos',
      title: 'Rota dos Lobos',
      description: 'Jornada principal baseada na obra "Mulheres que Correm com os Lobos".',
      status: 'Ativa',
      stations: 6,
      students: 1250,
      baseWork: 'Mulheres que Correm com os Lobos',
      lastUpdate: 'há 2 dias',
      color: 'gold',
      icon: Sparkles
    },
    {
      id: 'rota-da-heroina',
      title: 'Rota da Heroína',
      description: 'A jornada mítica da mulher em busca de sua própria soberania.',
      status: 'Em breve',
      stations: 0,
      students: 0,
      baseWork: 'A Jornada da Heroína',
      lastUpdate: '-',
      color: 'emerald',
      icon: Compass
    },
    {
      id: 'rota-da-sombra',
      title: 'Rota da Sombra',
      description: 'Exploração dos aspectos ocultos e integração da psique feminina.',
      status: 'Planejado',
      stations: 0,
      students: 0,
      baseWork: 'Psicologia Junguiana',
      lastUpdate: '-',
      color: 'purple',
      icon: Shield
    },
    {
      id: 'rota-do-instinto',
      title: 'Rota do Instinto',
      description: 'Resgate da sabedoria corporal e conexões ancestrais.',
      status: 'Planejado',
      stations: 0,
      students: 0,
      baseWork: 'Sabedoria Ancestral',
      lastUpdate: '-',
      color: 'rose',
      icon: Zap
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Breadcrumb & Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-medium">
          <span className="hover:text-gold cursor-pointer" onClick={() => navigate('/admin')}>Central</span>
          <span>/</span>
          <span className="text-gold">Rotas da Casa</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-serif text-foreground">Rotas da Casa</h1>
            <p className="text-muted-foreground max-w-2xl font-light">
              Gerencie as jornadas iniciáticas e arquiteturas simbólicas do ecossistema Oracula.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-muted/50 rounded-lg p-1 border border-primary/5">
              <Button 
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setViewMode('list')}
              >
                <ListIcon className="h-4 w-4" />
              </Button>
            </div>
            <Button className="bg-gold hover:bg-gold/80 text-black font-semibold gap-2">
              <Plus className="w-4 h-4" />
              Criar Nova Rota
            </Button>
          </div>
        </div>
      </div>

      {/* Filters & Stats */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-10 bg-card/40 border-primary/10" placeholder="Buscar rotas..." />
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gold/5 border border-gold/10">
            <Star className="w-4 h-4 text-gold fill-gold" />
            <span className="font-medium text-gold">1 Rota Ativa</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 border border-primary/5">
            <Clock className="w-4 h-4" />
            <span>3 em Planejamento</span>
          </div>
        </div>
      </div>

      {/* Rotas Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {rotas.map((rota) => (
            <Card 
              key={rota.id} 
              className={cn(
                "group relative bg-card/40 border-primary/10 backdrop-blur-xl hover:border-gold/30 transition-all duration-500 overflow-hidden",
                rota.status === 'Ativa' ? "ring-1 ring-gold/20" : "opacity-80"
              )}
            >
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className={cn(
                    "p-4 rounded-2xl transition-transform duration-500 group-hover:scale-110",
                    rota.status === 'Ativa' ? "bg-gold/10 text-gold" : "bg-muted text-muted-foreground"
                  )}>
                    <rota.icon className="w-8 h-8" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={rota.status === 'Ativa' ? 'default' : 'secondary'} className={cn(
                      rota.status === 'Ativa' ? "bg-gold text-black" : "bg-muted text-muted-foreground"
                    )}>
                      {rota.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-primary/10">
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Settings2 className="w-4 h-4" /> Configurações
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer text-destructive">
                          Arquivar Rota
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-serif text-foreground group-hover:text-gold transition-colors">
                      {rota.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="w-4 h-4" />
                      <span>{rota.baseWork}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {rota.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/5">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Estações</span>
                      <p className="text-lg font-serif">{rota.stations}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Alunas</span>
                      <p className="text-lg font-serif">
                        {rota.students > 0 ? rota.students.toLocaleString() : '-'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      className={cn(
                        "flex-1 gap-2",
                        rota.status === 'Ativa' ? "bg-gold hover:bg-gold/80 text-black font-bold" : "bg-muted cursor-not-allowed"
                      )}
                      onClick={() => rota.status === 'Ativa' && navigate('/admin/clube/rota-dos-lobos')}
                      disabled={rota.status !== 'Ativa'}
                    >
                      {rota.status === 'Ativa' ? 'Gerenciar Rota' : 'Configurar Rota'}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-card/40 border border-primary/10 rounded-xl overflow-hidden backdrop-blur-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-primary/10 bg-muted/30">
                <th className="p-4 text-xs uppercase tracking-widest font-bold text-muted-foreground">Rota</th>
                <th className="p-4 text-xs uppercase tracking-widest font-bold text-muted-foreground">Status</th>
                <th className="p-4 text-xs uppercase tracking-widest font-bold text-muted-foreground text-center">Estações</th>
                <th className="p-4 text-xs uppercase tracking-widest font-bold text-muted-foreground text-right">Alunas</th>
                <th className="p-4 text-xs uppercase tracking-widest font-bold text-muted-foreground text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {rotas.map((rota) => (
                <tr key={rota.id} className="border-b border-primary/5 hover:bg-primary/5 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        rota.status === 'Ativa' ? "bg-gold/10 text-gold" : "bg-muted text-muted-foreground"
                      )}>
                        <rota.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground group-hover:text-gold transition-colors">{rota.title}</p>
                        <p className="text-xs text-muted-foreground">{rota.baseWork}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={rota.status === 'Ativa' ? 'default' : 'secondary'} className="text-[10px]">
                      {rota.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-center font-serif text-lg">{rota.stations}</td>
                  <td className="p-4 text-right font-serif text-lg">
                    {rota.students > 0 ? rota.students.toLocaleString() : '-'}
                  </td>
                  <td className="p-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-2 hover:text-gold"
                      onClick={() => rota.status === 'Ativa' && navigate('/admin/clube/rota-dos-lobos')}
                    >
                      Editar <ArrowRight className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Info Section */}
      <div className="p-6 rounded-2xl bg-gold/5 border border-gold/10 flex items-start gap-4">
        <Sparkles className="w-6 h-6 text-gold shrink-0 mt-1" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-gold">Dica da Guardiã</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            As Rotas da Casa são trilhas estruturadas que guiam a aluna por um processo de transformação. 
            Você pode criar novas rotas para diferentes temas ou obras literárias, definindo suas próprias estações e portais.
          </p>
        </div>
      </div>
    </div>
  );
}
