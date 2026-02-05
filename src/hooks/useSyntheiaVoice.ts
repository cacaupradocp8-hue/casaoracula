 // ============================================
 // SYNTHEIA VOICE HOOK
 // Fetches voice prompt based on quiz result or other triggers
 // ============================================
 
 import { useState, useEffect } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 
 export interface SyntheiaVoice {
   id: string;
   type: string;
   title: string;
   voice_prompt: string;
   trigger_context: Record<string, unknown> | null;
 }
 
 interface UseSyntheiaVoiceOptions {
   type?: 'quiz' | 'porta' | 'travessia' | 'arquetipo' | 'ferramenta' | 'ritual';
   triggerId?: string; // e.g., quiz result ID, porta ID, etc.
 }
 
 export function useSyntheiaVoice(options: UseSyntheiaVoiceOptions = {}) {
   const [voice, setVoice] = useState<SyntheiaVoice | null>(null);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
 
   useEffect(() => {
     if (!options.type || !options.triggerId) {
       setVoice(null);
       return;
     }
 
     const fetchVoice = async () => {
       setIsLoading(true);
       setError(null);
 
       try {
         // Try to find a voice matching the trigger
         const { data, error: fetchError } = await supabase
           .from('syntheia_voices')
           .select('id, type, title, voice_prompt, trigger_context')
           .eq('type', options.type)
           .eq('active', true)
           .limit(1);
 
         if (fetchError) throw fetchError;
 
         // Check if any voice matches the trigger context
         if (data && data.length > 0) {
           const matchedVoice = data.find(v => {
             if (!v.trigger_context) return true; // Default voice for this type
             // Check if trigger_context matches
             const ctx = v.trigger_context as Record<string, unknown>;
             return ctx.trigger_id === options.triggerId;
           }) || data[0];
 
           setVoice(matchedVoice as SyntheiaVoice);
         } else {
           setVoice(null);
         }
       } catch (err) {
         console.error('[useSyntheiaVoice] Error:', err);
         setError('Erro ao carregar voz');
         setVoice(null);
       } finally {
         setIsLoading(false);
       }
     };
 
     fetchVoice();
   }, [options.type, options.triggerId]);
 
   return { voice, isLoading, error };
 }