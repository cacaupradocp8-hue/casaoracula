import { useState, useEffect } from 'react';
import { 
  ContentBlockType, 
  BlockContent,
  RichTextContent,
  ImageContent,
  VideoContent,
  AudioContent,
  AIChatContent,
  CTAButtonContent,
  DEFAULT_BLOCK_CONTENT,
  BLOCK_TYPE_META
} from '@/types/modular';
import { PortalType } from '@/types/portal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PORTAL_LABELS: Record<PortalType, string> = {
  visitante: 'Visitante',
  pre_iniciada: 'Pré-Iniciada',
  iniciada: 'Iniciada',
  admin: 'Admin',
};
import { supabase } from '@/integrations/supabase/client';

interface BlockEditorProps {
  blockType: ContentBlockType;
  initialContent?: BlockContent;
  initialTitulo?: string;
  initialDescricao?: string;
  initialPortalMinimo?: PortalType;
  initialAgenteId?: string;
  onSave: (data: {
    content: BlockContent;
    titulo?: string;
    descricao?: string;
    portalMinimo: PortalType;
    agenteId?: string;
  }) => void;
  onCancel: () => void;
}

interface Agente {
  id: string;
  nome: string;
}

export function BlockEditor({
  blockType,
  initialContent,
  initialTitulo = '',
  initialDescricao = '',
  initialPortalMinimo = 'visitante',
  initialAgenteId = '',
  onSave,
  onCancel,
}: BlockEditorProps) {
  const [content, setContent] = useState<BlockContent>(
    initialContent || DEFAULT_BLOCK_CONTENT[blockType]
  );
  const [titulo, setTitulo] = useState(initialTitulo);
  const [descricao, setDescricao] = useState(initialDescricao);
  const [portalMinimo, setPortalMinimo] = useState<PortalType>(initialPortalMinimo);
  const [agenteId, setAgenteId] = useState(initialAgenteId);
  const [agentes, setAgentes] = useState<Agente[]>([]);

  useEffect(() => {
    if (blockType === 'ai_chat') {
      supabase
        .from('agentes')
        .select('id, nome')
        .eq('status', 'ativo')
        .then(({ data }) => {
          if (data) setAgentes(data);
        });
    }
  }, [blockType]);

  const handleSave = () => {
    onSave({
      content,
      titulo: titulo || undefined,
      descricao: descricao || undefined,
      portalMinimo,
      agenteId: agenteId || undefined,
    });
  };

  const updateContent = <K extends keyof BlockContent>(key: K, value: BlockContent[K]) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Common Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Título do Bloco (opcional)</Label>
          <Input
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            placeholder="Título visível para usuários"
          />
        </div>
        <div className="space-y-2">
          <Label>Portal Mínimo</Label>
          <Select value={portalMinimo} onValueChange={v => setPortalMinimo(v as PortalType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(PORTAL_LABELS) as [PortalType, string][]).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Descrição Interna (admin)</Label>
        <Input
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          placeholder="Nota interna para identificar o bloco"
        />
      </div>

      {/* Type-specific editors */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium mb-4">
          Conteúdo: {BLOCK_TYPE_META[blockType].label}
        </h4>

        {blockType === 'rich_text' && (
          <RichTextEditor 
            content={content as RichTextContent} 
            onChange={c => setContent(c)} 
          />
        )}

        {blockType === 'image' && (
          <ImageEditor 
            content={content as ImageContent} 
            onChange={c => setContent(c)} 
          />
        )}

        {blockType === 'video' && (
          <VideoEditor 
            content={content as VideoContent} 
            onChange={c => setContent(c)} 
          />
        )}

        {blockType === 'audio' && (
          <AudioEditor 
            content={content as AudioContent} 
            onChange={c => setContent(c)} 
          />
        )}

        {blockType === 'ai_chat' && (
          <AIChatEditor 
            content={content as AIChatContent} 
            onChange={c => setContent(c)}
            agentes={agentes}
            selectedAgenteId={agenteId}
            onAgenteChange={setAgenteId}
          />
        )}

        {blockType === 'cta_button' && (
          <CTAButtonEditor 
            content={content as CTAButtonContent} 
            onChange={c => setContent(c)} 
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={handleSave}>Salvar Bloco</Button>
      </div>
    </div>
  );
}

// Sub-editors for each block type

function RichTextEditor({ 
  content, 
  onChange 
}: { 
  content: RichTextContent; 
  onChange: (c: RichTextContent) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>Conteúdo HTML</Label>
      <Textarea
        value={content.html}
        onChange={e => onChange({ ...content, html: e.target.value })}
        placeholder="<p>Seu texto aqui...</p>"
        rows={8}
        className="font-mono text-sm"
      />
      <p className="text-xs text-muted-foreground">
        Use HTML para formatar o texto (parágrafos, listas, negrito, etc.)
      </p>
    </div>
  );
}

function ImageEditor({ 
  content, 
  onChange 
}: { 
  content: ImageContent; 
  onChange: (c: ImageContent) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>URL da Imagem</Label>
        <Input
          value={content.url}
          onChange={e => onChange({ ...content, url: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Texto Alternativo (alt)</Label>
          <Input
            value={content.alt || ''}
            onChange={e => onChange({ ...content, alt: e.target.value })}
            placeholder="Descrição da imagem"
          />
        </div>
        <div className="space-y-2">
          <Label>Legenda</Label>
          <Input
            value={content.caption || ''}
            onChange={e => onChange({ ...content, caption: e.target.value })}
            placeholder="Legenda opcional"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tamanho</Label>
          <Select 
            value={content.size || 'medium'} 
            onValueChange={v => onChange({ ...content, size: v as ImageContent['size'] })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Pequeno</SelectItem>
              <SelectItem value="medium">Médio</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
              <SelectItem value="full">Tela cheia</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Proporção</Label>
          <Select 
            value={content.aspectRatio || 'auto'} 
            onValueChange={v => onChange({ ...content, aspectRatio: v as ImageContent['aspectRatio'] })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Automático</SelectItem>
              <SelectItem value="16:9">16:9</SelectItem>
              <SelectItem value="4:3">4:3</SelectItem>
              <SelectItem value="1:1">1:1 (Quadrado)</SelectItem>
              <SelectItem value="3:4">3:4 (Retrato)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function VideoEditor({ 
  content, 
  onChange 
}: { 
  content: VideoContent; 
  onChange: (c: VideoContent) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>URL do Vídeo</Label>
        <Input
          value={content.url}
          onChange={e => onChange({ ...content, url: e.target.value })}
          placeholder="https://youtube.com/watch?v=... ou https://vimeo.com/..."
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Provedor</Label>
          <Select 
            value={content.provider || 'youtube'} 
            onValueChange={v => onChange({ ...content, provider: v as VideoContent['provider'] })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="vimeo">Vimeo</SelectItem>
              <SelectItem value="custom">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Thumbnail (opcional)</Label>
          <Input
            value={content.thumbnail || ''}
            onChange={e => onChange({ ...content, thumbnail: e.target.value })}
            placeholder="URL da thumb"
          />
        </div>
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <Switch 
            checked={content.autoplay || false}
            onCheckedChange={v => onChange({ ...content, autoplay: v })}
          />
          <span className="text-sm">Autoplay</span>
        </label>
        <label className="flex items-center gap-2">
          <Switch 
            checked={content.loop || false}
            onCheckedChange={v => onChange({ ...content, loop: v })}
          />
          <span className="text-sm">Loop</span>
        </label>
        <label className="flex items-center gap-2">
          <Switch 
            checked={content.muted || false}
            onCheckedChange={v => onChange({ ...content, muted: v })}
          />
          <span className="text-sm">Mudo</span>
        </label>
      </div>
    </div>
  );
}

function AudioEditor({ 
  content, 
  onChange 
}: { 
  content: AudioContent; 
  onChange: (c: AudioContent) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>URL do Áudio</Label>
        <Input
          value={content.url}
          onChange={e => onChange({ ...content, url: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Título</Label>
          <Input
            value={content.title || ''}
            onChange={e => onChange({ ...content, title: e.target.value })}
            placeholder="Nome da faixa"
          />
        </div>
        <div className="space-y-2">
          <Label>Artista</Label>
          <Input
            value={content.artist || ''}
            onChange={e => onChange({ ...content, artist: e.target.value })}
            placeholder="Nome do artista"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Capa (opcional)</Label>
        <Input
          value={content.coverImage || ''}
          onChange={e => onChange({ ...content, coverImage: e.target.value })}
          placeholder="URL da imagem de capa"
        />
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <Switch 
            checked={content.autoplay || false}
            onCheckedChange={v => onChange({ ...content, autoplay: v })}
          />
          <span className="text-sm">Autoplay</span>
        </label>
        <label className="flex items-center gap-2">
          <Switch 
            checked={content.loop || false}
            onCheckedChange={v => onChange({ ...content, loop: v })}
          />
          <span className="text-sm">Loop</span>
        </label>
      </div>
    </div>
  );
}

function AIChatEditor({ 
  content, 
  onChange,
  agentes,
  selectedAgenteId,
  onAgenteChange,
}: { 
  content: AIChatContent; 
  onChange: (c: AIChatContent) => void;
  agentes: Agente[];
  selectedAgenteId: string;
  onAgenteChange: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Agente de IA</Label>
        <Select value={selectedAgenteId} onValueChange={onAgenteChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um agente (ou use o padrão)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Agente Padrão</SelectItem>
            {agentes.map(a => (
              <SelectItem key={a.id} value={a.id}>{a.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Mensagem de Boas-vindas</Label>
        <Textarea
          value={content.welcomeMessage || ''}
          onChange={e => onChange({ ...content, welcomeMessage: e.target.value })}
          placeholder="Olá! Como posso ajudar você hoje?"
          rows={2}
        />
      </div>
      <div className="space-y-2">
        <Label>Placeholder do Campo</Label>
        <Input
          value={content.placeholder || ''}
          onChange={e => onChange({ ...content, placeholder: e.target.value })}
          placeholder="Digite sua pergunta..."
        />
      </div>
      <div className="space-y-2">
        <Label>Contexto Adicional (para o agente)</Label>
        <Textarea
          value={content.contextPrompt || ''}
          onChange={e => onChange({ ...content, contextPrompt: e.target.value })}
          placeholder="Instruções específicas para esta página..."
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Máximo de Mensagens</Label>
          <Input
            type="number"
            value={content.maxMessages || ''}
            onChange={e => onChange({ ...content, maxMessages: parseInt(e.target.value) || undefined })}
            placeholder="Ilimitado"
          />
        </div>
        <label className="flex items-center gap-2 pt-6">
          <Switch 
            checked={content.showHistory !== false}
            onCheckedChange={v => onChange({ ...content, showHistory: v })}
          />
          <span className="text-sm">Mostrar Histórico</span>
        </label>
      </div>
    </div>
  );
}

function CTAButtonEditor({ 
  content, 
  onChange 
}: { 
  content: CTAButtonContent; 
  onChange: (c: CTAButtonContent) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Texto do Botão</Label>
          <Input
            value={content.text}
            onChange={e => onChange({ ...content, text: e.target.value })}
            placeholder="Clique aqui"
          />
        </div>
        <div className="space-y-2">
          <Label>Ação</Label>
          <Select 
            value={content.action || 'navigate'} 
            onValueChange={v => onChange({ ...content, action: v as CTAButtonContent['action'] })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="navigate">Navegar (interna)</SelectItem>
              <SelectItem value="external">Link Externo</SelectItem>
              <SelectItem value="scroll">Scroll para Seção</SelectItem>
              <SelectItem value="modal">Abrir Modal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Destino / URL</Label>
        <Input
          value={content.href || ''}
          onChange={e => onChange({ ...content, href: e.target.value })}
          placeholder="/pagina ou https://..."
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Estilo</Label>
          <Select 
            value={content.variant || 'gold'} 
            onValueChange={v => onChange({ ...content, variant: v as CTAButtonContent['variant'] })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Padrão</SelectItem>
              <SelectItem value="gold">Dourado</SelectItem>
              <SelectItem value="mystical">Místico</SelectItem>
              <SelectItem value="outline">Contorno</SelectItem>
              <SelectItem value="ghost">Fantasma</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Tamanho</Label>
          <Select 
            value={content.size || 'lg'} 
            onValueChange={v => onChange({ ...content, size: v as CTAButtonContent['size'] })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Pequeno</SelectItem>
              <SelectItem value="md">Médio</SelectItem>
              <SelectItem value="lg">Grande</SelectItem>
              <SelectItem value="xl">Extra Grande</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Ícone (Lucide)</Label>
          <Input
            value={content.icon || ''}
            onChange={e => onChange({ ...content, icon: e.target.value })}
            placeholder="ArrowRight, Star..."
          />
        </div>
      </div>
      <label className="flex items-center gap-2">
        <Switch 
          checked={content.fullWidth || false}
          onCheckedChange={v => onChange({ ...content, fullWidth: v })}
        />
        <span className="text-sm">Largura Total</span>
      </label>
    </div>
  );
}
