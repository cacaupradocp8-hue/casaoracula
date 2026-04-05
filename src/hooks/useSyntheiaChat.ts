 // ============================================
 // SYNTHEIA CHAT HOOK
 // Manages conversations and messages with Syntheia AI
 // ============================================
 
 import { useState, useCallback } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 import { useAuth } from '@/contexts/AuthContext';
 import { sendMessageToSyntheia, SyntheiaChatMode, ChatMessage, RoutingContext } from '@/services/syntheiaChat';
 
 interface ConversationContext {
   quizResultId?: string;
   arquetipo?: string;
   categoria?: string;
   voiceId?: string;
   voicePrompt?: string;
   [key: string]: unknown;
 }
 
 interface UseSyntheiaChatOptions {
   mode?: SyntheiaChatMode;
   voiceId?: string;
   context?: ConversationContext;
   autoCreateConversation?: boolean;
   routingContext?: RoutingContext;
 }
 
 interface Message {
   id: string;
   role: 'user' | 'assistant';
   content: string;
   timestamp: Date;
 }
 
 export function useSyntheiaChat(options: UseSyntheiaChatOptions = {}) {
   const { user } = useAuth();
   const [conversationId, setConversationId] = useState<string | null>(null);
   const [messages, setMessages] = useState<Message[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
 
   const mode = options.mode || 'arcano';
 
   // Create a new conversation
   const createConversation = useCallback(async (contextOverride?: ConversationContext) => {
     if (!user) {
       setError('Usuária não autenticada');
       return null;
     }
 
     try {
       const ctx = contextOverride || options.context;
       const insertData = {
         user_id: user.id,
         mode_id: mode,
         voice_id: ctx?.voiceId || options.voiceId || null,
         title: ctx?.arquetipo ? `Conversa: ${ctx.arquetipo}` : 'Nova conversa',
         context_data: ctx || null,
       };

       const { data, error: insertError } = await supabase
         .from('syntheia_conversations')
         .insert(insertData as never)
         .select('id')
         .single();
 
       if (insertError) throw insertError;
 
       setConversationId(data.id);
       setMessages([]);
       return data.id;
     } catch (err) {
       console.error('[useSyntheiaChat] Error creating conversation:', err);
       setError('Erro ao criar conversa');
       return null;
     }
   }, [user, mode, options.context, options.voiceId]);
 
   // Send a message
   const sendMessage = useCallback(async (content: string) => {
     if (!content.trim()) return;
     
     setIsLoading(true);
     setError(null);
 
     const userMessage: Message = {
       id: `user-${Date.now()}`,
       role: 'user',
       content: content.trim(),
       timestamp: new Date(),
     };
     setMessages(prev => [...prev, userMessage]);
 
     try {
       let convId = conversationId;
       if (!convId && user) {
         convId = await createConversation();
       }
 
       const apiMessages: ChatMessage[] = messages.map(m => ({
         role: m.role,
         content: m.content,
       }));
       apiMessages.push({ role: 'user', content: content.trim() });
 
       const response = await sendMessageToSyntheia(
         mode,
         apiMessages,
         options.context,
         options.context?.voicePrompt,
         options.routingContext
       );
 
       const assistantMessage: Message = {
         id: `assistant-${Date.now()}`,
         role: 'assistant',
         content: response.message.content,
         timestamp: new Date(),
       };
       setMessages(prev => [...prev, assistantMessage]);
 
       // Save messages to database
       if (convId && user) {
         await supabase.from('syntheia_messages').insert([
           {
             conversation_id: convId,
             role: 'user',
             content: content.trim(),
             tokens_used: null,
           },
           {
             conversation_id: convId,
             role: 'assistant',
             content: response.message.content,
             tokens_used: response.usage?.total_tokens || null,
           },
         ]);
       }
 
       return assistantMessage;
     } catch (err) {
       console.error('[useSyntheiaChat] Error sending message:', err);
       const errorMsg = err instanceof Error ? err.message : 'Erro ao enviar mensagem';
       setError(errorMsg);
       setMessages(prev => prev.filter(m => m.id !== userMessage.id));
       return null;
     } finally {
       setIsLoading(false);
     }
   }, [conversationId, messages, mode, options.context, options.routingContext, user, createConversation]);
 
   const clearConversation = useCallback(() => {
     setConversationId(null);
     setMessages([]);
     setError(null);
   }, []);
 
   const addWelcomeMessage = useCallback((content: string) => {
     const welcomeMsg: Message = {
       id: 'welcome',
       role: 'assistant',
       content,
       timestamp: new Date(),
     };
     setMessages([welcomeMsg]);
   }, []);
 
   return {
     conversationId,
     messages,
     isLoading,
     error,
     sendMessage,
     createConversation,
     clearConversation,
     addWelcomeMessage,
   };
 }
