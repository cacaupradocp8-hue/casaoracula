import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface Props {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
  };
}

export function TherabotMessage({ message }: Props) {
  return (
    <div className={cn("flex gap-2.5", message.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
      <div className={cn(
        "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
        message.role === 'user'
          ? 'bg-primary/15 text-primary'
          : 'bg-gold/15 text-gold'
      )}>
        {message.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
      </div>
      <div className={cn(
        "max-w-[82%] rounded-2xl px-3.5 py-2.5",
        message.role === 'user'
          ? 'bg-primary/10 text-foreground rounded-tr-md'
          : 'bg-muted/60 text-foreground rounded-tl-md'
      )}>
        <div className="text-xs leading-relaxed prose prose-sm prose-invert max-w-none [&>p]:mb-1.5 [&>p:last-child]:mb-0">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
