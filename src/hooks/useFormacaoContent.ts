import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ContentSection {
  id: string;
  section_key: string;
  content: Record<string, unknown>;
  updated_at: string;
  updated_by: string | null;
}

export function useFormacaoContent() {
  const [sections, setSections] = useState<Record<string, Record<string, any>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchContent = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("formacao_oracula_content")
        .select("*");

      if (error) throw error;

      const contentMap: Record<string, Record<string, any>> = {};
      data?.forEach((item) => {
        contentMap[item.section_key] = item.content as Record<string, any>;
      });

      setSections(contentMap);
    } catch (error) {
      console.error("Error fetching formacao content:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const updateSection = async (sectionKey: string, content: Record<string, any>) => {
    try {
      const { error } = await supabase
        .from("formacao_oracula_content")
        .update({ 
          content,
          updated_at: new Date().toISOString()
        })
        .eq("section_key", sectionKey);

      if (error) throw error;

      setSections(prev => ({
        ...prev,
        [sectionKey]: content
      }));

      toast({
        title: "Conteúdo atualizado",
        description: "As alterações foram salvas com sucesso."
      });

      return true;
    } catch (error) {
      console.error("Error updating section:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    sections,
    isLoading,
    updateSection,
    refetch: fetchContent
  };
}
