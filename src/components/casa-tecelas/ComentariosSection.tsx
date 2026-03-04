import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send } from 'lucide-react';
import { useTecelaComentarios } from '@/hooks/useTecela';
import { format } from 'date-fns';

interface Props {
  refType: string;
  refId: string;
}

export function ComentariosSection({ refType, refId }: Props) {
  const { comentarios, isLoading, addComentario } = useTecelaComentarios(refType, refId);
  const [text, setText] = useState('');

  const handleSend = async () => {
    if (!text.trim()) return;
    await addComentario(text);
    setText('');
  };

  return (
    <div className="space-y-3 pt-3 border-t border-border/30">
      <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
        <MessageCircle className="h-3 w-3" /> Comentários ({comentarios.length})
      </p>

      {comentarios.map((c: any) => (
        <div key={c.id} className="flex gap-2 text-sm">
          <div className="flex-1">
            <span className="font-medium text-foreground">{c.profiles?.nome || 'Anônimo'}</span>
            <span className="text-muted-foreground ml-2 text-xs">{format(new Date(c.created_at), 'dd/MM HH:mm')}</span>
            <p className="text-muted-foreground mt-0.5">{c.conteudo}</p>
          </div>
        </div>
      ))}

      <div className="flex gap-2">
        <Input
          placeholder="Escreva um comentário..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          className="text-sm"
        />
        <Button variant="ghost" size="icon" onClick={handleSend} disabled={!text.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
