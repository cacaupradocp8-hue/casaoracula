import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useJourneyMedia, useUpsertJourneyMedia, type GalleryItem } from '@/hooks/useJourneyMedia';
import { useToast } from '@/hooks/use-toast';
import { Image, Save, Loader2, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

interface Props {
  jornadaId: string;
}

export function AdminJourneyMediaSection({ jornadaId }: Props) {
  const { toast } = useToast();
  const { data: media, isLoading } = useJourneyMedia(jornadaId);
  const upsert = useUpsertJourneyMedia();

  const [headerUrl, setHeaderUrl] = useState('');
  const [infraUrl, setInfraUrl] = useState('');
  const [infraKind, setInfraKind] = useState<'image' | 'pdf'>('image');
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [published, setPublished] = useState(true);
  const [dirty, setDirty] = useState(false);

  // New gallery item form
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newKind, setNewKind] = useState<'image' | 'pdf'>('image');
  const [newCaption, setNewCaption] = useState('');
  const [newCredit, setNewCredit] = useState('');

  useEffect(() => {
    if (media) {
      setHeaderUrl(media.header_image_url || '');
      setInfraUrl(media.infographic_url || '');
      setInfraKind((media.infographic_kind as 'image' | 'pdf') || 'image');
      setGallery(Array.isArray(media.gallery_items) ? media.gallery_items : []);
      setPublished(media.published);
      setDirty(false);
    }
  }, [media]);

  const handleSave = async () => {
    try {
      await upsert.mutateAsync({
        journey_id: jornadaId,
        header_image_url: headerUrl.trim() || null,
        infographic_url: infraUrl.trim() || null,
        infographic_kind: infraKind,
        gallery_items: gallery,
        published,
      });
      setDirty(false);
      toast({ title: 'Mídia da jornada salva ✓' });
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    }
  };

  const addGalleryItem = () => {
    if (!newUrl.trim()) return;
    if (gallery.length >= 5) {
      toast({ title: 'Máximo 5 itens na galeria' });
      return;
    }
    setGallery([...gallery, { url: newUrl.trim(), title: newTitle.trim() || 'Material', kind: newKind, order: gallery.length, caption: newCaption.trim(), credit: newCredit.trim() }]);
    setNewUrl(''); setNewTitle(''); setNewCaption(''); setNewCredit('');
    setDirty(true);
  };

  const removeGalleryItem = (idx: number) => {
    setGallery(gallery.filter((_, i) => i !== idx));
    setDirty(true);
  };

  if (isLoading) return null;

  return (
    <div className="space-y-3 mt-3 p-3 rounded-lg border border-border/50 bg-muted/10">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-1.5">
          <Image className="w-3 h-3" />
          Mídia da Jornada
        </h4>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => { setPublished(!published); setDirty(true); }}>
            {published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          </Button>
          {dirty && (
            <Button size="sm" onClick={handleSave} disabled={upsert.isPending} className="gap-1 h-7 text-xs">
              {upsert.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
              Salvar
            </Button>
          )}
        </div>
      </div>

      {/* Header image */}
      <div>
        <Label className="text-[10px]">Imagem de Header</Label>
        <Input value={headerUrl} onChange={e => { setHeaderUrl(e.target.value); setDirty(true); }} placeholder="URL da imagem..." className="h-7 text-xs" />
        {headerUrl && <img src={headerUrl} alt="Preview" className="mt-1 h-16 rounded object-cover" />}
      </div>

      {/* Infographic */}
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2">
          <Label className="text-[10px]">Infográfico URL</Label>
          <Input value={infraUrl} onChange={e => { setInfraUrl(e.target.value); setDirty(true); }} placeholder="URL..." className="h-7 text-xs" />
        </div>
        <div>
          <Label className="text-[10px]">Tipo</Label>
          <Select value={infraKind} onValueChange={v => { setInfraKind(v as any); setDirty(true); }}>
            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="image">Imagem</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Gallery */}
      <div>
        <Label className="text-[10px]">Galeria (máx. 5)</Label>
        <div className="space-y-1 mt-1">
          {gallery.map((item, i) => (
            <div key={i} className="flex items-center gap-2 p-1.5 rounded border border-border/50 bg-background text-xs">
              <Badge variant="outline" className="text-[9px]">{item.kind}</Badge>
              <span className="flex-1 truncate">{item.title}</span>
              <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-destructive" onClick={() => removeGalleryItem(i)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
        {gallery.length < 5 && (
          <div className="space-y-1.5 mt-2">
            <div className="flex items-end gap-1.5">
              <div className="flex-1">
                <Input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="URL" className="h-7 text-xs" />
              </div>
              <div className="w-24">
                <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Título" className="h-7 text-xs" />
              </div>
              <Select value={newKind} onValueChange={v => setNewKind(v as any)}>
                <SelectTrigger className="h-7 text-xs w-20"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Img</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={addGalleryItem} disabled={!newUrl.trim()}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex gap-1.5">
              <Input value={newCaption} onChange={e => setNewCaption(e.target.value)} placeholder="Legenda (opcional)" className="h-7 text-xs" />
              <Input value={newCredit} onChange={e => setNewCredit(e.target.value)} placeholder="Crédito (opcional)" className="h-7 text-xs" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
