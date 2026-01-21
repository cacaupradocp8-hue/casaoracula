// ============================================
// PERSONAL SYMBOLIC MAPS - EDITOR PAGE
// ============================================
// Form-based reflective editor with sections and prompts
// NOT clinical records - symbolic/reflective/formative only

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  Save,
  Loader2,
  Map,
  Check,
  Brain,
  Compass,
  Flower2,
  Users,
  Sparkles,
  AlertTriangle,
  Edit2,
} from 'lucide-react';
import { usePersonalMaps } from '@/hooks/usePersonalMaps';
import { useToast } from '@/hooks/use-toast';
import { PersonalSymbolicMap, getTemplateByKey, PersonalMapTemplate } from '@/types/personal-map';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, React.ReactNode> = {
  Brain: <Brain className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
  Flower2: <Flower2 className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
};

export default function PersonalMapEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getMap, updateMap } = usePersonalMaps();

  const [map, setMap] = useState<PersonalSymbolicMap | null>(null);
  const [template, setTemplate] = useState<PersonalMapTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [content, setContent] = useState<Record<string, string>>({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);

  // Load map data
  useEffect(() => {
    async function loadMap() {
      if (!id) return;

      setLoading(true);
      const data = await getMap(id);

      if (!data) {
        toast({
          title: 'Mapa não encontrado',
          variant: 'destructive',
        });
        navigate('/mapas-pessoais');
        return;
      }

      setMap(data);
      setContent(data.content || {});
      setTitle(data.title);
      setDescription(data.description || '');

      const tmpl = getTemplateByKey(data.template_key);
      setTemplate(tmpl || null);

      setLoading(false);
    }

    loadMap();
  }, [id, getMap, navigate, toast]);

  // Auto-save debounced
  const handleSave = useCallback(async () => {
    if (!map) return;

    setSaving(true);
    const success = await updateMap(map.id, {
      title,
      description: description || undefined,
      content,
    });

    setSaving(false);

    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }, [map, title, description, content, updateMap]);

  // Update section content
  const handleSectionChange = (sectionKey: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      [sectionKey]: value,
    }));
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  if (!map || !template) {
    return null;
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/mapas-pessoais')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="p-2 rounded-lg bg-gold/10 text-gold">
              {ICON_MAP[template.icon]}
            </div>
            <div>
              {editingTitle ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => setEditingTitle(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setEditingTitle(false)}
                  className="h-8 text-lg font-semibold"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => setEditingTitle(true)}
                  className="flex items-center gap-2 hover:text-gold transition-colors"
                >
                  <h1 className="text-lg font-semibold">{title}</h1>
                  <Edit2 className="w-3 h-3 opacity-50" />
                </button>
              )}
              <p className="text-sm text-muted-foreground">{template.title}</p>
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : saved ? (
              <Check className="w-4 h-4 mr-2 text-emerald-500" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saved ? 'Salvo!' : 'Salvar'}
          </Button>
        </div>

        {/* Disclaimer */}
        <Card className="mb-6 border-amber-500/20 bg-amber-500/5">
          <CardContent className="py-3">
            <div className="flex gap-2 items-center text-xs text-amber-700 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>
                Este é um espaço de reflexão simbólica pessoal. Não é documentação clínica.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <div className="mb-6">
          <Label className="text-muted-foreground text-sm">Descrição / Contexto</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Adicione contexto ou notas gerais sobre este mapa..."
            rows={2}
            className="mt-1 bg-background/50"
          />
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {template.sections.map((section, idx) => (
            <Card key={section.key} className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gold/10 text-gold text-xs flex items-center justify-center font-medium">
                    {idx + 1}
                  </span>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Prompts as guidance */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {section.prompts.map((prompt) => (
                    <span
                      key={prompt}
                      className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                    >
                      {prompt}
                    </span>
                  ))}
                </div>

                {/* Reflection textarea */}
                <Textarea
                  value={content[section.key] || ''}
                  onChange={(e) => handleSectionChange(section.key, e.target.value)}
                  placeholder="Escreva suas reflexões aqui..."
                  rows={4}
                  className={cn(
                    'bg-background/50 transition-colors',
                    content[section.key] && 'border-gold/30'
                  )}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom save button */}
        <div className="mt-8 flex justify-center">
          <Button onClick={handleSave} disabled={saving} size="lg">
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : saved ? (
              <Check className="w-4 h-4 mr-2 text-emerald-500" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saved ? 'Salvo!' : 'Salvar Mapa'}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
