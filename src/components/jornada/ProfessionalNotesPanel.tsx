// ============================================
// PROFESSIONAL NOTES PANEL — Practitioner-only notes per phase
// ============================================

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Save, Loader2, Lock, Eye } from 'lucide-react';

interface ProfessionalNote {
  id?: string;
  observacoes: string;
  padroes_observados: string;
  intervencoes_sugeridas: string;
  proximos_passos: string;
}

interface ProfessionalNotesPanelProps {
  registroId: string;
  faseNumero: number;
  terapeutaId: string;
}

export function ProfessionalNotesPanel({
  registroId,
  faseNumero,
  terapeutaId,
}: ProfessionalNotesPanelProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState<ProfessionalNote>({
    observacoes: '',
    padroes_observados: '',
    intervencoes_sugeridas: '',
    proximos_passos: '',
  });
  const [noteId, setNoteId] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
  }, [registroId, faseNumero]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('jornada_heroina_notas_profissionais')
        .select('*')
        .eq('registro_id', registroId)
        .eq('fase_numero', faseNumero)
        .eq('terapeuta_id', terapeutaId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setNoteId(data.id);
        setNotes({
          observacoes: data.observacoes || '',
          padroes_observados: data.padroes_observados || '',
          intervencoes_sugeridas: data.intervencoes_sugeridas || '',
          proximos_passos: data.proximos_passos || '',
        });
      } else {
        setNoteId(null);
        setNotes({
          observacoes: '',
          padroes_observados: '',
          intervencoes_sugeridas: '',
          proximos_passos: '',
        });
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (noteId) {
        // Update
        const { error } = await supabase
          .from('jornada_heroina_notas_profissionais')
          .update({
            ...notes,
          })
          .eq('id', noteId);

        if (error) throw error;
      } else {
        // Insert
        const { data, error } = await supabase
          .from('jornada_heroina_notas_profissionais')
          .insert({
            registro_id: registroId,
            fase_numero: faseNumero,
            terapeuta_id: terapeutaId,
            ...notes,
          })
          .select()
          .single();

        if (error) throw error;
        setNoteId(data.id);
      }

      toast.success('Notas salvas');
    } catch (error: any) {
      console.error('Error saving notes:', error);
      toast.error('Erro ao salvar: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="glass">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-amber-500/30">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-500" />
          Notas Profissionais
        </CardTitle>
        <CardDescription className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          Visível apenas para você
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm">Observações</Label>
          <Textarea
            value={notes.observacoes}
            onChange={(e) => setNotes(prev => ({ ...prev, observacoes: e.target.value }))}
            placeholder="O que você observou durante esta fase?"
            className="mt-2 min-h-[80px] text-sm"
          />
        </div>

        <div>
          <Label className="text-sm">Padrões Observados</Label>
          <Textarea
            value={notes.padroes_observados}
            onChange={(e) => setNotes(prev => ({ ...prev, padroes_observados: e.target.value }))}
            placeholder="Que padrões simbólicos ou comportamentais você identificou?"
            className="mt-2 min-h-[80px] text-sm"
          />
        </div>

        <div>
          <Label className="text-sm">Intervenções Sugeridas</Label>
          <Textarea
            value={notes.intervencoes_sugeridas}
            onChange={(e) => setNotes(prev => ({ ...prev, intervencoes_sugeridas: e.target.value }))}
            placeholder="Que práticas ou intervenções simbólicas você sugere?"
            className="mt-2 min-h-[80px] text-sm"
          />
        </div>

        <div>
          <Label className="text-sm">Próximos Passos</Label>
          <Textarea
            value={notes.proximos_passos}
            onChange={(e) => setNotes(prev => ({ ...prev, proximos_passos: e.target.value }))}
            placeholder="O que explorar na próxima sessão?"
            className="mt-2 min-h-[80px] text-sm"
          />
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full" size="sm">
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Salvar Notas
        </Button>
      </CardContent>
    </Card>
  );
}
