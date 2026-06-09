
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Save, Music, Headphones, Sparkles, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AudioUpload } from '@/components/admin/AudioUpload';

interface AdminCamaraEscutaProps {
  estacaoId: string;
}

export function AdminCamaraEscuta({ estacaoId }: AdminCamaraEscutaProps) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [editingObra, setEditingObra] = useState<any>(null);

  const { data: obras, isLoading } = useQuery({
    queryKey: ['admin-camara-obras', estacaoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_camara_escuta_obras')
        .select('*')
        .eq('estacao_id', estacaoId)
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const saveObraMutation = useMutation({
    mutationFn: async (obra: any) => {
      if (obra.id) {
        const { error } = await supabase
          .from('clube_camara_escuta_obras')
          .update(obra)
          .eq('id', obra.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('clube_camara_escuta_obras')
          .insert({ ...obra, estacao_id: estacaoId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-camara-obras', estacaoId] });
      setEditingObra(null);
      toast({ title: 'Obra salva com sucesso!' });
    }
  });

  const deleteObraMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clube_camara_escuta_obras')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-camara-obras', estacaoId] });
      toast({ title: 'Obra removida' });
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-serif text-foreground flex items-center gap-2">
            <Headphones className="w-5 h-5 text-gold" />
            Câmara da Escuta
          </h2>
          <p className="text-xs text-muted-foreground">Obras de treinamento de percepção simbólica para esta estação.</p>
        </div>
        <Button 
          onClick={() => setEditingObra({ 
            titulo: '', 
            tipo: 'Música', 
            autor: '', 
            url: '', 
            audio_regente_url: '',
            funcao_escuta: '', 
            pergunta_psique: '', 
            pergunta_oficio: '',
            territorio_principal: '',
            territorio_secundario_1: '',
            territorio_secundario_2: '',
            ordem: (obras?.length || 0) + 1,
            ativo: true
          })}
          className="bg-gold text-black font-bold gap-2"
        >
          <Plus className="w-4 h-4" /> Adicionar Obra
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {obras?.map((obra) => (
          <Card key={obra.id} className="border-primary/10 hover:border-gold/30 transition-all bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-serif">{obra.titulo}</CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-gold" onClick={() => setEditingObra(obra)}>
                  <Plus className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => {
                  if (confirm('Tem certeza?')) deleteObraMutation.mutate(obra.id);
                }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20 uppercase font-bold tracking-widest">
                  {obra.territorio_principal || 'Sem território'}
                </span>
                {obra.territorio_secundario_1 && (
                   <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-primary/10 uppercase font-bold tracking-widest">
                    {obra.territorio_secundario_1}
                   </span>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground line-clamp-2 italic">"{obra.funcao_escuta}"</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingObra} onOpenChange={(open) => !open && setEditingObra(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingObra?.id ? 'Editar Obra' : 'Nova Obra'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Título da Obra</Label>
              <Input value={editingObra?.titulo} onChange={e => setEditingObra({...editingObra, titulo: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Autor / Artista</Label>
              <Input value={editingObra?.autor} onChange={e => setEditingObra({...editingObra, autor: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Tipo (Música, Vídeo, Poema)</Label>
              <Input value={editingObra?.tipo} onChange={e => setEditingObra({...editingObra, tipo: e.target.value})} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <AudioUpload
                label="URL do Áudio Principal (ou link embed do Spotify)"
                value={editingObra?.url || ''}
                onChange={(url) => setEditingObra({...editingObra, url})}
                folder="clube/camara/obras"
              />
              <p className="text-[10px] text-muted-foreground italic">
                Para Spotify, pode colar o link direto da playlist/álbum (ex: https://open.spotify.com/playlist/...) ou o link "src" do embed.

              </p>
            </div>
            <div className="space-y-2">
              <AudioUpload
                label="URL do Áudio Regente (Abertura)"
                value={editingObra?.audio_regente_url || ''}
                onChange={(url) => setEditingObra({...editingObra, audio_regente_url: url})}
                folder="clube/camara/regentes"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label>Função da Escuta (Por que ouvir esta obra?)</Label>
              <Textarea value={editingObra?.funcao_escuta} onChange={e => setEditingObra({...editingObra, funcao_escuta: e.target.value})} />
            </div>

            <div className="space-y-2">
              <Label>Território Principal (Obrigatório)</Label>
              <Input value={editingObra?.territorio_principal} onChange={e => setEditingObra({...editingObra, territorio_principal: e.target.value})} placeholder="Ex: Praça do Abalo" />
            </div>
            
            <div className="space-y-2">
              <Label>Território Secundário 1</Label>
              <Input value={editingObra?.territorio_secundario_1} onChange={e => setEditingObra({...editingObra, territorio_secundario_1: e.target.value})} placeholder="Ex: Espelho dos Vínculos" />
            </div>

            <div className="space-y-2">
              <Label>Território Secundário 2</Label>
              <Input value={editingObra?.territorio_secundario_2} onChange={e => setEditingObra({...editingObra, territorio_secundario_2: e.target.value})} placeholder="Opcional" />
            </div>

            <div className="space-y-2 md:col-span-2 border-t border-primary/5 pt-4">
              <h4 className="text-xs uppercase tracking-widest text-gold font-bold mb-2 flex items-center gap-2">
                <Music className="w-3 h-3" /> Guia de Escuta (Formação Simbólica)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>O que escutar (um por linha)</Label>
                  <Textarea 
                    value={editingObra?.guia_escuta?.join('\n')} 
                    onChange={e => setEditingObra({...editingObra, guia_escuta: e.target.value.split('\n')})} 
                    className="h-24" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>O que evitar (um por linha)</Label>
                  <Textarea 
                    value={editingObra?.guia_evitar?.join('\n')} 
                    onChange={e => setEditingObra({...editingObra, guia_evitar: e.target.value.split('\n')})} 
                    className="h-24" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Rastro Simbólico (Ex: 🩸 A Ferida Habitável)</Label>
                  <Input 
                    value={editingObra?.rastro_simbolo || ''} 
                    onChange={e => setEditingObra({...editingObra, rastro_simbolo: e.target.value})} 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2 border-t border-primary/5 pt-4">
              <h4 className="text-xs uppercase tracking-widest text-gold font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Registros no Jardim
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pergunta - Jardim da Psique</Label>
                  <Textarea value={editingObra?.pergunta_psique} onChange={e => setEditingObra({...editingObra, pergunta_psique: e.target.value})} className="h-20" />
                </div>
                <div className="space-y-2">
                  <Label>Pergunta - Jardim do Ofício</Label>
                  <Textarea value={editingObra?.pergunta_oficio} onChange={e => setEditingObra({...editingObra, pergunta_oficio: e.target.value})} className="h-20" />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingObra(null)}>Cancelar</Button>
            <Button className="bg-gold text-black font-bold" onClick={() => saveObraMutation.mutate(editingObra)}>
              Salvar Obra
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
