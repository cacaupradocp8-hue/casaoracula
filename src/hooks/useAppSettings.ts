import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AppSetting {
  id: string;
  key: string;
  value: string;
  description: string | null;
}

export function useAppSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('*');

        if (error) throw error;

        const settingsMap: Record<string, string> = {};
        data?.forEach(setting => {
          settingsMap[setting.key] = setting.value;
        });
        setSettings(settingsMap);
      } catch (error) {
        console.error('Error fetching app settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const getSetting = (key: string, fallback: string = ''): string => {
    return settings[key] ?? fallback;
  };

  const getWhatsAppNumber = () => getSetting('cta_whatsapp_number', '5511999999999');
  const getMatriculaUrl = () => getSetting('cta_matricula_url', '#');
  const getMentoriaDescription = () => getSetting('mentoria_description', '');
  const getModalTitulo = () => getSetting('modal_conteudo_bloqueado_titulo', 'Conteúdo exclusivo');
  const getModalTexto = () => getSetting('modal_conteudo_bloqueado_texto', 'Este conteúdo é exclusivo para matriculadas.');
  
  // Entry page audio settings
  const getEntryAudioUrl = () => getSetting('entry_audio_url', '');
  const getEntryAudioTitle = () => getSetting('entry_audio_title', '');
  const getEntryAudioCaption = () => getSetting('entry_audio_caption', '');

  return {
    settings,
    isLoading,
    getSetting,
    getWhatsAppNumber,
    getMatriculaUrl,
    getMentoriaDescription,
    getModalTitulo,
    getModalTexto,
    getEntryAudioUrl,
    getEntryAudioTitle,
    getEntryAudioCaption,
  };
}

export function useAppSettingsAdmin() {
  const [settings, setSettings] = useState<AppSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .order('key');

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching app settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSetting = async (key: string, value: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('app_settings')
        .update({ value })
        .eq('key', key);

      if (error) throw error;
      
      setSettings(prev => 
        prev.map(s => s.key === key ? { ...s, value } : s)
      );
      return true;
    } catch (error) {
      console.error('Error updating setting:', error);
      return false;
    }
  };

  const createSetting = async (key: string, value: string, description?: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .insert({ key, value, description })
        .select()
        .single();

      if (error) throw error;
      
      setSettings(prev => [...prev, data]);
      return true;
    } catch (error) {
      console.error('Error creating setting:', error);
      return false;
    }
  };

  const deleteSetting = async (key: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('app_settings')
        .delete()
        .eq('key', key);

      if (error) throw error;
      
      setSettings(prev => prev.filter(s => s.key !== key));
      return true;
    } catch (error) {
      console.error('Error deleting setting:', error);
      return false;
    }
  };

  return {
    settings,
    isLoading,
    updateSetting,
    createSetting,
    deleteSetting,
    refetch: fetchSettings,
  };
}
