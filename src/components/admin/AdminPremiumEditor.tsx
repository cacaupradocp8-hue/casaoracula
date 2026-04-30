import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, Bot, Brain, Layout, Eye, Zap, 
  MessageSquare, BookOpen, PenTool, Search, 
  Settings, ChevronRight, PanelRight, Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TemplateEditorialEditor } from './clube-livro/TemplateEditorialEditor';
import { LabConfigManager } from './clube-livro/LabConfigManager';

export function AdminPremiumEditor() {
  const [activeTab, setActiveTab] = useState('editor');
  const [showPreview, setShowPreview] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState('editora');
  const [content, setContent] = useState('');

  const agents = [
    { id: 'editora', name: 'Editora', icon: BookOpen, color: 'text-gold' },
    { id: 'psicologa', name: 'Psicóloga', icon: Brain, color: 'text-purple-400' },
    { id: 'copywriter', name: 'Copywriter', icon: PenTool, color: 'text-blue-400' },
    { id: 'roteirista', name: 'Roteirista', icon: Play, color: 'text-emerald-400' },
    { id: 'curadora', name: 'Curadora', icon: Search, color: 'text-amber-400' },
  ];

  const { data: estacaoAtual } = useQuery({
    queryKey: ['admin-estacao-ativa-premium'],
    queryFn: async () => {
      const { data } = await supabase
        .from('clube_estacoes')
        .select('*')
        .eq('ativa', true)
        .limit(1)
        .maybeSingle();
      return data;
    }
  });

  return (
    <div className="flex h-[calc(100vh-10rem)] bg-background border border-primary/10 rounded-2xl overflow-hidden shadow-2xl">
      {/* 1. Sidebar Premium (Notion Style) */}
      <aside className="w-16 md:w-64 border-r border-primary/5 bg-muted/20 flex flex-col shrink-0">
        <div className="p-4 border-b border-primary/5 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-gold" />
          </div>
          <span className="font-display text-sm font-bold tracking-tight hidden md:block">Casa Orácula <span className="text-gold">Pro</span></span>
        </div>
        
        <div className="flex-1 p-2 space-y-1">
          <NavItem active={activeTab === 'editor'} onClick={() => setActiveTab('editor')} icon={Layout} label="Máquina de Rotas" />
          <NavItem active={activeTab === 'treinamento'} onClick={() => setActiveTab('treinamento')} icon={Zap} label="Sala de Treinamento" />
          <NavItem active={activeTab === 'ia'} onClick={() => setActiveTab('ia')} icon={Bot} label="Agentes de Campo" />
          <div className="pt-4 pb-2 px-3">
             <span className="text-[10px] uppercase font-bold text-muted-foreground/50 tracking-widest hidden md:block">Ajudantes IA</span>
          </div>
          {agents.map(agent => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all",
                selectedAgent === agent.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <agent.icon className={cn("w-4 h-4", agent.color)} />
              <span className="hidden md:block">{agent.name}</span>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-primary/5 space-y-2">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs" onClick={() => setShowPreview(!showPreview)}>
            <PanelRight className="w-4 h-4" />
            <span className="hidden md:block">{showPreview ? 'Esconder Preview' : 'Mostrar Preview'}</span>
          </Button>
        </div>
      </aside>

      {/* 2. Editor Central (Apple/Notion Style) */}
      <main className="flex-1 overflow-y-auto bg-background/50 relative">
        <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-primary/5 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="font-serif text-lg">Editor Editorial</h2>
            <Badge variant="outline" className="text-[9px] uppercase tracking-widest text-gold border-gold/30">Versão Premium</Badge>
          </div>
          <div className="flex items-center gap-2">
             <Button variant="outline" size="sm" className="h-8 text-xs gap-2 border-primary/10">Salvar Rascunho</Button>
             <Button size="sm" className="h-8 text-xs gap-2 bg-gold text-black font-bold">Publicar Rota</Button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto py-12 px-6">
          <Tabs value={activeTab} className="space-y-8">
            <TabsContent value="editor" className="mt-0 space-y-12">
               <div className="space-y-4">
                 <Input 
                   className="text-4xl font-serif bg-transparent border-none p-0 focus-visible:ring-0 placeholder:opacity-20 h-auto" 
                   placeholder="Título da Rota..."
                 />
                 <Textarea 
                   className="text-lg font-serif bg-transparent border-none p-0 focus-visible:ring-0 placeholder:opacity-20 resize-none min-h-[100px]" 
                   placeholder="Subtítulo ou essência da jornada..."
                 />
               </div>

               <div className="space-y-6">
                 <div className="flex items-center gap-2 text-gold/60">
                    <Settings className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Configuração de Template</span>
                 </div>
                 <TemplateEditorialEditor 
                   item={{ tipo: 'portal', metadata: {} } as any} 
                   onUpdate={() => {}} 
                 />
               </div>
            </TabsContent>

            <TabsContent value="treinamento" className="mt-0 space-y-8">
               <div className="space-y-2 mb-8">
                 <h3 className="text-2xl font-serif">Simulador de Campo</h3>
                 <p className="text-sm text-muted-foreground">Configure os desafios e estudos de caso desta estação.</p>
               </div>
               <LabConfigManager cicloId={estacaoAtual?.id || ''} />
            </TabsContent>

            <TabsContent value="ia" className="mt-0 space-y-8">
               <Card className="bg-gold/5 border-gold/10">
                 <CardHeader>
                    <CardTitle className="text-gold flex items-center gap-2">
                       <Bot className="w-5 h-5" /> Hub de Agentes
                    </CardTitle>
                    <CardDescription>Peça para a IA gerar conteúdo baseado na essência da estação.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="p-4 rounded-xl bg-background/50 border border-primary/5 min-h-[200px] flex items-center justify-center text-muted-foreground italic text-sm">
                       Selecione um agente na lateral e peça uma tarefa específica.
                    </div>
                    <div className="flex gap-2">
                       <Input placeholder={`Comando para a ${selectedAgent}...`} />
                       <Button className="bg-gold text-black"><Sparkles className="w-4 h-4 mr-2" /> Gerar</Button>
                    </div>
                 </CardContent>
               </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* 3. Preview da Aluna (Netflix Style) */}
      {showPreview && (
        <aside className="w-80 md:w-96 border-l border-primary/5 bg-black/20 flex flex-col shrink-0">
          <div className="p-4 border-b border-primary/5 flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest flex items-center gap-2">
              <Eye className="w-3 h-3" /> Preview em Tempo Real
            </span>
            <div className="flex gap-1">
               <div className="w-2 h-2 rounded-full bg-red-500/50" />
               <div className="w-2 h-2 rounded-full bg-amber-500/50" />
               <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-none">
            {/* Mobile View Mockup */}
            <div className="w-full aspect-[9/19] bg-background border-[8px] border-muted rounded-[2.5rem] shadow-2xl overflow-hidden relative">
               <div className="absolute top-0 left-0 w-full h-full p-4 space-y-4 overflow-y-auto">
                  <div className="h-40 w-full rounded-2xl bg-gold/10 animate-pulse" />
                  <div className="space-y-2">
                     <div className="h-6 w-3/4 rounded bg-primary/20" />
                     <div className="h-4 w-1/2 rounded bg-primary/10" />
                  </div>
                  <div className="space-y-2 pt-4">
                     <div className="h-3 w-full rounded bg-muted" />
                     <div className="h-3 w-full rounded bg-muted" />
                     <div className="h-3 w-2/3 rounded bg-muted" />
                  </div>
                  <div className="h-10 w-full rounded-xl bg-gold/20 mt-8" />
               </div>
            </div>
            
            <div className="space-y-4 p-4 rounded-xl bg-gold/5 border border-gold/10">
               <h4 className="text-[10px] uppercase font-bold text-gold tracking-widest">Dica de Experiência</h4>
               <p className="text-[11px] text-muted-foreground leading-relaxed">
                 O template de <strong>Portal</strong> gera uma página de entrada cinematográfica com transição suave. Certifique-se de preencher a "Frase-Semente" para o fechamento.
               </p>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

function NavItem({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group",
        active ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      )}
    >
      <Icon className={cn("w-4 h-4", active ? "scale-110" : "group-hover:scale-110 transition-transform")} />
      <span className="hidden md:block">{label}</span>
      {active && <div className="ml-auto w-1 h-1 rounded-full bg-primary-foreground hidden md:block" />}
    </button>
  );
}
