import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  HelpCircle,
  Shuffle,
  Heart,
  HeartOff,
  ArrowLeft,
  Search,
  Save,
  X,
  Loader2,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Pergunta {
  id: string;
  pergunta: string;
  tema: string;
  tags: string[];
  portal_minimo: string;
}

interface Favorito {
  pergunta_id: string;
}

export default function OraculoPerguntas() {
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTema, setFilterTema] = useState<string>('all');
  const [sortedQuestion, setSortedQuestion] = useState<Pergunta | null>(null);
  const [applicationDialog, setApplicationDialog] = useState(false);
  const [selectedPergunta, setSelectedPergunta] = useState<Pergunta | null>(null);
  const [applicationForm, setApplicationForm] = useState({
    contexto: '',
    resposta: '',
    devolutiva: '',
  });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [perguntasRes, favoritosRes] = await Promise.all([
      supabase.from('oraculo_perguntas').select('*').order('tema'),
      supabase.from('oraculo_favoritos').select('pergunta_id'),
    ]);

    setPerguntas((perguntasRes.data || []) as Pergunta[]);
    setFavoritos((favoritosRes.data || []).map((f: Favorito) => f.pergunta_id));
    setIsLoading(false);
  };

  const toggleFavorite = async (perguntaId: string) => {
    const isFav = favoritos.includes(perguntaId);

    if (isFav) {
      await supabase
        .from('oraculo_favoritos')
        .delete()
        .eq('pergunta_id', perguntaId)
        .eq('user_id', user?.id);
      setFavoritos(prev => prev.filter(id => id !== perguntaId));
    } else {
      await supabase.from('oraculo_favoritos').insert({
        pergunta_id: perguntaId,
        user_id: user?.id,
      });
      setFavoritos(prev => [...prev, perguntaId]);
    }
  };

  const sortearPergunta = () => {
    const filtered = getFilteredPerguntas();
    if (filtered.length === 0) return;
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    setSortedQuestion(random);
  };

  const openApplication = (pergunta: Pergunta) => {
    setSelectedPergunta(pergunta);
    setApplicationForm({ contexto: '', resposta: '', devolutiva: '' });
    setApplicationDialog(true);
  };

  const saveApplication = async () => {
    if (!selectedPergunta) return;
    setSaving(true);

    const { error } = await supabase.from('oraculo_aplicacoes').insert({
      pergunta_id: selectedPergunta.id,
      user_id: user?.id,
      ...applicationForm,
    });

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Aplicação registrada!' });
      setApplicationDialog(false);
    }
    setSaving(false);
  };

  const getFilteredPerguntas = () => {
    return perguntas.filter(p => {
      const matchSearch =
        p.pergunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchTema = filterTema === 'all' || p.tema === filterTema;
      return matchSearch && matchTema;
    });
  };

  const temas = [...new Set(perguntas.map(p => p.tema))];
  const filteredPerguntas = getFilteredPerguntas();

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/salas">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <SectionHeader
            title="Oráculo das Perguntas Desafiadoras"
            subtitle="Perguntas poderosas para transformar sessões"
            icon={<HelpCircle className="w-5 h-5" />}
          />
        </div>

        {/* Sortear */}
        <Card className="glass mb-6 border-gold/30 bg-gradient-to-br from-gold/10 to-transparent">
          <CardContent className="p-6 text-center">
            {sortedQuestion ? (
              <div className="space-y-4">
                <p className="text-xl font-display text-foreground italic">"{sortedQuestion.pergunta}"</p>
                <div className="flex justify-center gap-2">
                  <Badge variant="outline">{sortedQuestion.tema}</Badge>
                  {sortedQuestion.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-center gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => toggleFavorite(sortedQuestion.id)}>
                    {favoritos.includes(sortedQuestion.id) ? (
                      <HeartOff className="w-4 h-4 mr-1" />
                    ) : (
                      <Heart className="w-4 h-4 mr-1" />
                    )}
                    {favoritos.includes(sortedQuestion.id) ? 'Desfavoritar' : 'Favoritar'}
                  </Button>
                  <Button variant="gold" size="sm" onClick={() => openApplication(sortedQuestion)}>
                    Registrar Aplicação
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSortedQuestion(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-muted-foreground mb-4">Clique para receber uma pergunta do oráculo</p>
                <Button variant="gold" size="lg" onClick={sortearPergunta}>
                  <Shuffle className="w-5 h-5 mr-2" /> Sortear Pergunta
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar pergunta ou tag..."
              className="pl-10"
            />
          </div>
          <Select value={filterTema} onValueChange={setFilterTema}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por tema" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os temas</SelectItem>
              {temas.map(tema => (
                <SelectItem key={tema} value={tema}>
                  {tema}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lista de perguntas */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPerguntas.map(pergunta => (
              <Card key={pergunta.id} className="glass hover:border-gold/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-lg font-medium mb-2">"{pergunta.pergunta}"</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{pergunta.tema}</Badge>
                        {pergunta.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFavorite(pergunta.id)}
                        className={favoritos.includes(pergunta.id) ? 'text-red-400' : ''}
                      >
                        <Heart className={`w-5 h-5 ${favoritos.includes(pergunta.id) ? 'fill-current' : ''}`} />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openApplication(pergunta)}>
                        Usar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog de Aplicação */}
        <Dialog open={applicationDialog} onOpenChange={setApplicationDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Registrar Aplicação</DialogTitle>
            </DialogHeader>
            {selectedPergunta && (
              <div className="space-y-4 pt-2">
                <Card className="bg-gold/10 border-gold/30">
                  <CardContent className="p-3">
                    <p className="italic">"{selectedPergunta.pergunta}"</p>
                  </CardContent>
                </Card>

                <div>
                  <Label>Contexto de uso</Label>
                  <Textarea
                    value={applicationForm.contexto}
                    onChange={e => setApplicationForm(prev => ({ ...prev, contexto: e.target.value }))}
                    placeholder="Em que momento da sessão foi usada? Qual o contexto?"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Resposta da cliente</Label>
                  <Textarea
                    value={applicationForm.resposta}
                    onChange={e => setApplicationForm(prev => ({ ...prev, resposta: e.target.value }))}
                    placeholder="O que a cliente respondeu ou expressou?"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Devolutiva/Reflexão</Label>
                  <Textarea
                    value={applicationForm.devolutiva}
                    onChange={e => setApplicationForm(prev => ({ ...prev, devolutiva: e.target.value }))}
                    placeholder="Suas observações sobre o impacto da pergunta"
                    rows={3}
                  />
                </div>

                <Button onClick={saveApplication} disabled={saving} variant="gold" className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Salvando...' : 'Salvar Registro'}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
