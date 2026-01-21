import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingAudio {
  id: string;
  titulo: string;
  file_path: string;
}

export function useOnboardingAudio() {
  const [audio, setAudio] = useState<OnboardingAudio | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOnboardingAudio() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch the most recent published audio in "Onboarding" category
        const { data, error: fetchError } = await supabase
          .from('audio_assets')
          .select('id, titulo, file_path')
          .eq('categoria', 'Onboarding')
          .eq('publicado', true)
          .order('ordem', { ascending: true })
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (fetchError) {
          throw fetchError;
        }

        if (data?.file_path) {
          setAudio(data);
          
          // Get public URL from storage
          const { data: urlData } = supabase.storage
            .from('audios')
            .getPublicUrl(data.file_path);
          
          setAudioUrl(urlData.publicUrl);
        }
      } catch (err) {
        console.error('Error fetching onboarding audio:', err);
        setError('Erro ao carregar áudio');
      } finally {
        setIsLoading(false);
      }
    }

    fetchOnboardingAudio();
  }, []);

  return { audio, audioUrl, isLoading, error };
}
