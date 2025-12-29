import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getPortal, getCaseLimit } from '@/types/portal';
import { FolderOpen, Plus, Calendar, Tag, ChevronRight, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Case {
  id: string;
  codename: string;
  centralTheme: string;
  tags: string[];
  briefHistory: string;
  createdAt: Date;
  sessionsCount: number;
}

const MOCK_CASES: Case[] = [
  {
    id: '1',
    codename: 'Lua Cheia',
    centralTheme: 'Medo de abandono e padrões de autossabotagem em relacionamentos',
    tags: ['abandono', 'relacionamentos', 'autossabotagem'],
    briefHistory: 'Mulher de 38 anos, casada há 15 anos. Apresenta ciclos de aproximação intensa seguidos de afastamento abrupto.',
    createdAt: new Date('2024-01-15'),
    sessionsCount: 8,
  },
  {
    id: '2',
    codename: 'Raiz Profunda',
    centralTheme: 'Luto não elaborado e dificuldade de vinculação',
    tags: ['luto', 'vinculação', 'mãe'],
    briefHistory: 'Mulher de 45 anos que perdeu a mãe há 3 anos e não conseguiu chorar desde então.',
    createdAt: new Date('2024-02-20'),
    sessionsCount: 5,
  },
];

export default function Casos() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cases, setCases] = useState(MOCK_CASES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCase, setNewCase] = useState({
    codename: '',
    centralTheme: '',
    tags: '',
    briefHistory: '',
  });

  if (!user) return null;

  const portal = getPortal(user.portal);
  const caseLimit = getCaseLimit(user.portal);
  const canCreateMore = caseLimit === 'unlimited' || cases.length < caseLimit;

  const handleCreateCase = () => {
    if (!newCase.codename.trim() || !newCase.centralTheme.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Codinome e tema central são obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    const newCaseData: Case = {
      id: Date.now().toString(),
      codename: newCase.codename,
      centralTheme: newCase.centralTheme,
      tags: newCase.tags.split(',').map(t => t.trim()).filter(Boolean),
      briefHistory: newCase.briefHistory,
      createdAt: new Date(),
      sessionsCount: 0,
    };

    setCases(prev => [newCaseData, ...prev]);
    setNewCase({ codename: '', centralTheme: '', tags: '', briefHistory: '' });
    setIsDialogOpen(false);
    
    toast({
      title: 'Caso criado',
      description: `O caso "${newCaseData.codename}" foi criado com sucesso.`,
    });
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <SectionHeader
          title="Meus Casos"
          subtitle={`Gerencie seus casos clínicos de forma confidencial`}
          icon={<FolderOpen className="w-5 h-5" />}
          action={
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="gold" disabled={!canCreateMore} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Novo Caso
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">Criar Novo Caso</DialogTitle>
                  <DialogDescription>
                    Use sempre um codinome. Nunca registre dados identificáveis da cliente.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="codename">Codinome *</Label>
                    <Input
                      id="codename"
                      placeholder="Ex: Lua Cheia, Raiz Profunda..."
                      value={newCase.codename}
                      onChange={(e) => setNewCase(prev => ({ ...prev, codename: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="theme">Tema Central *</Label>
                    <Textarea
                      id="theme"
                      placeholder="Qual é a questão central deste caso?"
                      value={newCase.centralTheme}
                      onChange={(e) => setNewCase(prev => ({ ...prev, centralTheme: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      placeholder="Ex: abandono, luto, relacionamentos (separadas por vírgula)"
                      value={newCase.tags}
                      onChange={(e) => setNewCase(prev => ({ ...prev, tags: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="history">Histórico Breve</Label>
                    <Textarea
                      id="history"
                      placeholder="Breve contexto do caso (mantenha anônimo)"
                      className="min-h-[100px]"
                      value={newCase.briefHistory}
                      onChange={(e) => setNewCase(prev => ({ ...prev, briefHistory: e.target.value }))}
                    />
                  </div>
                  <Button variant="gold" onClick={handleCreateCase} className="w-full">
                    Criar Caso
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          }
          className="mb-8"
        />

        {/* Case Limit Info */}
        {caseLimit !== 'unlimited' && (
          <Card className="mb-6 bg-secondary/30 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Casos utilizados
                </span>
                <span className="font-medium">
                  {cases.length} / {caseLimit}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cases List */}
        {cases.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-display text-xl font-semibold mb-2">Nenhum caso criado</h3>
              <p className="text-muted-foreground mb-4">
                Crie seu primeiro caso para começar a documentar suas sessões.
              </p>
              <Button variant="gold" onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Caso
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {cases.map((caso) => (
              <Card key={caso.id} className="group hover:shadow-gold transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-display flex items-center gap-2">
                        {caso.codename}
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-gold transition-colors" />
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {caso.centralTheme}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {caso.briefHistory}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {caso.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(caso.createdAt, "d 'de' MMMM, yyyy", { locale: ptBR })}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {caso.sessionsCount} sessões
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Confidentiality Notice */}
        <Card className="mt-8 bg-secondary/30 border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">
              <strong>Lembre-se:</strong> Confidencialidade e anonimização são obrigatórias. 
              Nunca registre dados que possam identificar a cliente.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
