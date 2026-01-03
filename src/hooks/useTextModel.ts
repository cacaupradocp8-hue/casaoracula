import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TextModels {
  [key: string]: string;
}

export function useTextModels() {
  const [texts, setTexts] = useState<TextModels>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTexts = async () => {
      const { data } = await supabase
        .from('text_models')
        .select('chave, conteudo');
      
      if (data) {
        const textMap = data.reduce((acc, item) => {
          acc[item.chave] = item.conteudo;
          return acc;
        }, {} as TextModels);
        setTexts(textMap);
      }
      setIsLoading(false);
    };

    fetchTexts();
  }, []);

  const getText = (key: string, fallback: string = '') => {
    return texts[key] || fallback;
  };

  return { texts, getText, isLoading };
}
