import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import {
  useActiveCanteiro, useCanteiroEntries, useArchivedCanteiros, useSubmitPartilha,
  type CollectiveBedEntry,
} from '@/hooks/useCanteiro';
import { useAuth } from '@/contexts/AuthContext';
import { canAccessFeature } from '@/types/portal';
import { Leaf, Scissors, Sprout, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/** Canteiro page for CasaTecelaInterior */
export default function CanteiroEstacao() {
  const { user } = useAuth();
  const { data: canteiro, isLoading } = useActiveCanteiro();
  const isFormacao = user && canAccessFeature(user.portal, 'aluna');

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!canteiro) {
    return (
      <Card className="bg-muted/20 border-dashed">
        <CardContent className="py-10 text-center space-y-2">
          <Sprout className="w-8 h-8 text-muted-foreground/40 mx-auto" />
          <p className="text-sm text-muted-foreground">
            Nenhum Canteiro ativo nesta estação.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Sprout className="w-5 h-5 text-gold" />
          <h2 className="font-display text-lg text-foreground">Canteiro da Estação</h2>
        </div>
        {canteiro.oracular_seasons && (
          <Badge variant="outline" className="text-xs text-muted-foreground border-border/50">
            {canteiro.oracular_seasons.simbolo && (
              <span className="mr-1">{canteiro.oracular_seasons.simbolo}</span>
            )}
            {canteiro.oracular_seasons.nome_estacao}
          </Badge>
        )}
        <p className="text-xs text-muted-foreground/70 italic max-w-md mx-auto">
          Partilhas selecionadas para sustentar o campo coletivo.
        </p>
      </div>

      {/* Tabs: Sementes / Tecelagens */}
      <Tabs defaultValue="psique">
        <TabsList className="grid grid-cols-2 h-auto p-1 bg-muted/50">
          <TabsTrigger value="psique" className="text-xs gap-1.5 py-2">
            <Leaf className="w-3.5 h-3.5" /> Sementes
          </TabsTrigger>
          <TabsTrigger value="oficio" className="text-xs gap-1.5 py-2">
            <Scissors className="w-3.5 h-3.5" /> Tecelagens
          </TabsTrigger>
        </TabsList>

        <TabsContent value="psique" className="mt-4">
          <EntryList bedId={canteiro.id} origem="psique" />
        </TabsContent>
        <TabsContent value="oficio" className="mt-4">
          <EntryList bedId={canteiro.id} origem="oficio" />
        </TabsContent>
      </Tabs>

      {/* Submit dialog */}
      <SubmitPartilhaDialog bedId={canteiro.id} seasonId={canteiro.season_id} />

      {/* Arquivo de canteiros encerrados (formação only) */}
      {isFormacao && <ArquivoCanteiros />}
    </div>
  );
}

function EntryList({ bedId, origem }: { bedId: string; origem: 'psique' | 'oficio' }) {
  const { data: entries, isLoading } = useCanteiroEntries(bedId, origem);

  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground text-sm animate-pulse">Carregando…</div>;
  }

  if (!entries || entries.length === 0) {
    return (
      <Card className="bg-muted/10 border-dashed">
        <CardContent className="py-8 text-center">
          <p className="text-sm text-muted-foreground">
            {origem === 'psique'
              ? 'Nenhuma semente partilhada neste canteiro.'
              : 'Nenhuma tecelagem partilhada neste canteiro.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}

function EntryCard({ entry }: { entry: CollectiveBedEntry }) {
  const nome = entry.exibicao_anonima ? 'Anônima' : (entry.profiles?.nome || 'Tecelã');

  return (
    <Card className="bg-card/60 border-border/30">
      <CardContent className="p-4 space-y-2">
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
          {entry.texto}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground/60 italic">{nome}</span>
          {entry.publicado_em && (
            <span className="text-[10px] text-muted-foreground/50">
              {format(new Date(entry.publicado_em), "d MMM yyyy", { locale: ptBR })}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SubmitPartilhaDialog({ bedId, seasonId }: { bedId: string; seasonId: string }) {
  const [open, setOpen] = useState(false);
  const [texto, setTexto] = useState('');
  const [origem, setOrigem] = useState<'psique' | 'oficio'>('psique');
  const [anonima, setAnonima] = useState(false);
  const submitMutation = useSubmitPartilha();

  const handleSubmit = () => {
    if (!texto.trim()) return;
    submitMutation.mutate(
      { bed_id: bedId, season_id: seasonId, origem, texto: texto.trim(), exibicao_anonima: anonima },
      {
        onSuccess: () => {
          setTexto('');
          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2 text-sm border-gold/20 hover:border-gold/40">
          <Send className="w-4 h-4" />
          Levar ao Canteiro da Estação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Partilhar no Canteiro</DialogTitle>
          <p className="text-xs text-muted-foreground">
            Sua partilha será revisada antes de ser publicada.
          </p>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* Origem */}
          <div className="flex gap-2">
            <Button
              variant={origem === 'psique' ? 'default' : 'outline'}
              size="sm"
              className={cn('gap-1.5 text-xs', origem === 'psique' && 'bg-gold hover:bg-gold/90 text-primary-foreground')}
              onClick={() => setOrigem('psique')}
            >
              <Leaf className="w-3 h-3" /> Semente (Psique)
            </Button>
            <Button
              variant={origem === 'oficio' ? 'default' : 'outline'}
              size="sm"
              className={cn('gap-1.5 text-xs', origem === 'oficio' && 'bg-gold hover:bg-gold/90 text-primary-foreground')}
              onClick={() => setOrigem('oficio')}
            >
              <Scissors className="w-3 h-3" /> Tecelagem (Ofício)
            </Button>
          </div>

          <Textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escreva sua partilha para o campo coletivo…"
            rows={5}
            className="resize-none"
          />

          <div className="flex items-center gap-2">
            <Checkbox
              id="anonima"
              checked={anonima}
              onCheckedChange={(v) => setAnonima(!!v)}
            />
            <label htmlFor="anonima" className="text-xs text-muted-foreground cursor-pointer">
              Publicar de forma anônima
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            disabled={!texto.trim() || submitMutation.isPending}
            className="bg-gold hover:bg-gold/90 text-primary-foreground gap-2"
          >
            {submitMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Enviar para Curadoria
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ArquivoCanteiros() {
  const { data: archived } = useArchivedCanteiros();

  if (!archived || archived.length === 0) return null;

  return (
    <div className="mt-8 space-y-3">
      <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
        Canteiros Encerrados
      </h3>
      {archived.map((bed) => (
        <Card key={bed.id} className="bg-muted/10 border-border/20">
          <CardContent className="p-4 flex items-center gap-3">
            <Sprout className="w-4 h-4 text-muted-foreground/40 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground/70 truncate">
                {bed.oracular_seasons?.simbolo} {bed.oracular_seasons?.nome_estacao}
              </p>
              {bed.oracular_seasons?.periodo && (
                <p className="text-[10px] text-muted-foreground">{bed.oracular_seasons.periodo}</p>
              )}
            </div>
            <Badge variant="outline" className="text-[10px] text-muted-foreground/60">Encerrado</Badge>
          </CardContent>
        </Card>
      ))}
      <p className="text-[10px] text-muted-foreground/50 italic text-center">
        "Este Canteiro cumpriu seu tempo. O que foi partilhado permanece no campo."
      </p>
    </div>
  );
}
