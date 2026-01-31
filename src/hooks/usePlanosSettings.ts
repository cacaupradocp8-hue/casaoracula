import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PlanosSettings {
  rocktyCheckoutFormacaoUrl: string;
  rocktyCheckoutOraculaUrl: string;
  supportWhatsappUrl: string;
  supportEmail: string;
}

export function usePlanosSettings() {
  const [settings, setSettings] = useState<PlanosSettings>({
    rocktyCheckoutFormacaoUrl: '',
    rocktyCheckoutOraculaUrl: '',
    supportWhatsappUrl: '',
    supportEmail: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('key, value')
          .in('key', [
            'rockty_checkout_formacao_url',
            'rockty_checkout_oracula_url',
            'support_whatsapp_url',
            'support_email'
          ]);

        if (error) throw error;

        const settingsMap: Record<string, string> = {};
        data?.forEach(s => { settingsMap[s.key] = s.value; });

        setSettings({
          rocktyCheckoutFormacaoUrl: settingsMap['rockty_checkout_formacao_url'] || '',
          rocktyCheckoutOraculaUrl: settingsMap['rockty_checkout_oracula_url'] || '',
          supportWhatsappUrl: settingsMap['support_whatsapp_url'] || '',
          supportEmail: settingsMap['support_email'] || '',
        });
      } catch (error) {
        console.error('Error fetching planos settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, isLoading };
}
