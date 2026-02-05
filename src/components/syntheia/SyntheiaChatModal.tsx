 // ============================================
 // SYNTHEIA CHAT MODAL
 // Full-screen chat modal for post-quiz conversations
 // ============================================
 
 import { useState, useRef, useEffect } from 'react';
 import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
 import { Button } from '@/components/ui/button';
 import { Textarea } from '@/components/ui/textarea';
 import { ScrollArea } from '@/components/ui/scroll-area';
 import { Send, Bot, User, Loader2, Sparkles, X } from 'lucide-react';
 import { cn } from '@/lib/utils';
 import { useSyntheiaChat } from '@/hooks/useSyntheiaChat';
 import { SyntheiaChatMode } from '@/services/syntheiaChat';
 
 interface SyntheiaChatModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   mode?: SyntheiaChatMode;
   context?: {
     quizResultId?: string;
     arquetipo?: string;
     categoria?: string;
     voiceId?: string;
     [key: string]: unknown;
   };
   welcomeMessage?: string;
   title?: string;
 }
 
 export function SyntheiaChatModal({
   open,
   onOpenChange,
   mode = 'arcano',
   context,
   welcomeMessage,
   title = 'Syntheia',
 }: SyntheiaChatModalProps) {
   const [input, setInput] = useState('');
   const scrollRef = useRef<HTMLDivElement>(null);
   
   const {
     messages,
     isLoading,
     error,
     sendMessage,
     addWelcomeMessage,
     clearConversation,
   } = useSyntheiaChat({ mode, context });
 
   // Add welcome message on mount
   useEffect(() => {
     if (open && welcomeMessage && messages.length === 0) {
       addWelcomeMessage(welcomeMessage);
     }
   }, [open, welcomeMessage, messages.length, addWelcomeMessage]);
 
   // Clear on close
   useEffect(() => {
     if (!open) {
       clearConversation();
       setInput('');
     }
   }, [open, clearConversation]);
 
   // Auto-scroll to bottom
   useEffect(() => {
     if (scrollRef.current) {
       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
     }
   }, [messages]);
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!input.trim() || isLoading) return;
 
     const messageContent = input.trim();
     setInput('');
     await sendMessage(messageContent);
   };
 
   const handleKeyDown = (e: React.KeyboardEvent) => {
     if (e.key === 'Enter' && !e.shiftKey) {
       e.preventDefault();
       handleSubmit(e);
     }
   };
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 gap-0">
         <DialogHeader className="px-6 py-4 border-b border-border flex-shrink-0">
           <div className="flex items-center justify-between">
             <DialogTitle className="flex items-center gap-2">
               <Sparkles className="w-5 h-5 text-gold" />
               {title}
             </DialogTitle>
             <Button
               variant="ghost"
               size="icon"
               onClick={() => onOpenChange(false)}
               className="h-8 w-8"
             >
               <X className="h-4 w-4" />
             </Button>
           </div>
           {context?.arquetipo && (
             <p className="text-sm text-muted-foreground mt-1">
               Explorando: {context.arquetipo}
             </p>
           )}
         </DialogHeader>
 
         {/* Messages area */}
         <ScrollArea className="flex-1 p-4" ref={scrollRef}>
           <div className="space-y-4">
             {messages.map((message) => (
               <div
                 key={message.id}
                 className={cn(
                   "flex gap-3",
                   message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                 )}
               >
                 <div className={cn(
                   "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                   message.role === 'user' 
                     ? 'bg-primary/20 text-primary' 
                     : 'bg-gold/20 text-gold'
                 )}>
                   {message.role === 'user' ? (
                     <User className="w-4 h-4" />
                   ) : (
                     <Bot className="w-4 h-4" />
                   )}
                 </div>
                 <div className={cn(
                   "max-w-[80%] rounded-2xl px-4 py-3",
                   message.role === 'user'
                     ? 'bg-primary/10 text-foreground'
                     : 'bg-muted text-foreground'
                 )}>
                   <p className="text-sm whitespace-pre-wrap leading-relaxed">
                     {message.content}
                   </p>
                 </div>
               </div>
             ))}
             
             {isLoading && (
               <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                   <Bot className="w-4 h-4 text-gold" />
                 </div>
                 <div className="bg-muted rounded-2xl px-4 py-3">
                   <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                 </div>
               </div>
             )}
 
             {error && (
               <div className="text-center py-2">
                 <p className="text-sm text-destructive">{error}</p>
               </div>
             )}
           </div>
         </ScrollArea>
 
         {/* Input area */}
         <form onSubmit={handleSubmit} className="border-t border-border p-4 flex-shrink-0">
           <div className="flex gap-2">
             <Textarea
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={handleKeyDown}
               placeholder="Digite sua mensagem..."
               className="min-h-[44px] max-h-32 resize-none bg-background/50"
               disabled={isLoading}
             />
             <Button 
               type="submit" 
               size="icon"
               variant="gold"
               disabled={!input.trim() || isLoading}
               className="h-11 w-11 flex-shrink-0"
             >
               <Send className="w-4 h-4" />
             </Button>
           </div>
         </form>
       </DialogContent>
     </Dialog>
   );
 }