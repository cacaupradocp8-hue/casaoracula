import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBookMedia, useCreateBookMedia, useUpdateBookMedia, useDeleteBookMedia, type BookMedia } from '@/hooks/useBookMedia';
import { useToast } from '@/hooks/use-toast';
import { Image, FileText, Plus, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';

interface Props {
  estacaoId: string;
}

function MediaRow({ item, onDelete }: { item: BookMedia; onDelete: () => void }) {
  const { toast } = useToast();
  const update = useUpdateBookMedia();
  const isImage = item.file_kind === 'image';

  const togglePublish = async () => {
    try {
      await update.mutateAsync({ id: item.id, published: !item.published });
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg border border-border bg-muted/20">
      {isImage && item.file_url ? (
        <img src={item.file_url} alt={item.title} className="w-12 h-12 object-cover rounded" />
      ) : (
        <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
          <FileText className="w-5 h-5 text-muted-foreground" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{item.title || '(sem título)'}</p>
        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className="text-[10px]">{item.type}</Badge>
          <Badge variant="outline" className="text-[10px]">{item.file_kind}</Badge>
          {!item.published && <Badge variant="secondary" className="text-[10px]">Rascunho</Badge>}
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={togglePublish}>
        {item.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </Button>
      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={onDelete}>
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}

function AddMediaForm({ estacaoId, onDone }: { estacaoId: string; onDone: () => void }) {
  const { toast } = useToast();
  const create = useCreateBookMedia();
  const [type, setType] = useState<'cover' | 'banner' | 'gallery'>('gallery');
  const [title, setTitle] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileKind, setFileKind] = useState<'image' | 'pdf'>('image');

  const handleAdd = async () => {
    if (!fileUrl.trim()) return;
    try {
      await create.mutateAsync({
        station_id: estacaoId,
        type,
        title: title.trim() || (type === 'cover' ? 'Capa' : type === 'banner' ? 'Banner' : 'Material'),
        file_url: fileUrl.trim(),
        file_kind: fileKind,
        order_index: 0,
        published: true,
      });
      toast({ title: 'Mídia adicionada ✓' });
      setTitle(''); setFileUrl('');
      onDone();
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-3 p-3 border border-dashed border-border rounded-lg">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Tipo</Label>
          <Select value={type} onValueChange={(v) => setType(v as any)}>
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="cover">Capa</SelectItem>
              <SelectItem value="banner">Banner</SelectItem>
              <SelectItem value="gallery">Galeria</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Formato</Label>
          <Select value={fileKind} onValueChange={(v) => setFileKind(v as any)}>
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="image">Imagem</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label className="text-xs">Título</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Infográfico geral" className="h-8 text-sm" />
      </div>
      <div>
        <Label className="text-xs">URL do arquivo *</Label>
        <Input value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="https://..." className="h-8 text-sm" />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onDone}>Cancelar</Button>
        <Button size="sm" onClick={handleAdd} disabled={create.isPending || !fileUrl.trim()} className="gap-1">
          {create.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
          Adicionar
        </Button>
      </div>
    </div>
  );
}

export function AdminBookMediaSection({ estacaoId }: Props) {
  const { data: items, isLoading } = useBookMedia(estacaoId);
  const deleteMut = useDeleteBookMedia();
  const [showAdd, setShowAdd] = useState(false);

  const covers = (items || []).filter(i => i.type === 'cover');
  const banners = (items || []).filter(i => i.type === 'banner');
  const gallery = (items || []).filter(i => i.type === 'gallery');

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2">
        <Image className="w-3.5 h-3.5" />
        Mídia do Livro
      </h3>

      {isLoading ? (
        <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>
      ) : (
        <>
          {covers.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Capa</p>
              {covers.map(c => <MediaRow key={c.id} item={c} onDelete={() => deleteMut.mutate({ id: c.id, stationId: estacaoId })} />)}
            </div>
          )}
          {banners.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Banner</p>
              {banners.map(b => <MediaRow key={b.id} item={b} onDelete={() => deleteMut.mutate({ id: b.id, stationId: estacaoId })} />)}
            </div>
          )}
          {gallery.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Galeria</p>
              <div className="space-y-1.5">
                {gallery.map(g => <MediaRow key={g.id} item={g} onDelete={() => deleteMut.mutate({ id: g.id, stationId: estacaoId })} />)}
              </div>
            </div>
          )}

          {showAdd ? (
            <AddMediaForm estacaoId={estacaoId} onDone={() => setShowAdd(false)} />
          ) : (
            <Button variant="outline" size="sm" onClick={() => setShowAdd(true)} className="gap-1 w-full border-dashed">
              <Plus className="w-3 h-3" /> Adicionar Mídia
            </Button>
          )}
        </>
      )}
    </div>
  );
}
