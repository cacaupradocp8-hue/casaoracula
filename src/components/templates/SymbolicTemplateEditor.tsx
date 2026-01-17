import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  FileDown, 
  ChevronDown,
  ChevronUp,
  StickyNote,
  AlertTriangle
} from 'lucide-react';
import { useSymbolicTemplates, TemplateType, SymbolicTemplateSession } from '@/hooks/useSymbolicTemplates';
import { useToast } from '@/hooks/use-toast';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface TemplateSection {
  key: string;
  title: string;
  description?: string;
  placeholder?: string;
}

interface SymbolicTemplateEditorProps {
  templateType: TemplateType;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  introduction: string;
  sections: TemplateSection[];
  listPath: string;
}

export function SymbolicTemplateEditor({
  templateType,
  title,
  subtitle,
  icon,
  introduction,
  sections,
  listPath,
}: SymbolicTemplateEditorProps) {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getSession, updateSession } = useSymbolicTemplates(templateType);

  const [session, setSession] = useState<SymbolicTemplateSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sectionValues, setSectionValues] = useState<Record<string, string>>({});
  const [noteValues, setNoteValues] = useState<Record<string, string>>({});
  const [openNotes, setOpenNotes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadSession = async () => {
      if (!sessionId) {
        navigate(listPath);
        return;
      }

      setLoading(true);
      const data = await getSession(sessionId);
      if (data) {
        setSession(data);
        setSectionValues(data.sections || {});
        setNoteValues(data.notes || {});
      } else {
        toast({
          title: 'Sessão não encontrada',
          variant: 'destructive',
        });
        navigate(listPath);
      }
      setLoading(false);
    };

    loadSession();
  }, [sessionId]);

  const handleSave = useCallback(async () => {
    if (!sessionId) return;

    setSaving(true);
    const success = await updateSession(sessionId, {
      sections: sectionValues,
      notes: noteValues,
    });

    if (success) {
      toast({ title: 'Sessão salva com sucesso!' });
    }
    setSaving(false);
  }, [sessionId, sectionValues, noteValues, updateSession, toast]);

  const handleSectionChange = (key: string, value: string) => {
    setSectionValues(prev => ({ ...prev, [key]: value }));
  };

  const handleNoteChange = (key: string, value: string) => {
    setNoteValues(prev => ({ ...prev, [key]: value }));
  };

  const toggleNote = (key: string) => {
    setOpenNotes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const exportAsText = () => {
    if (!session) return;

    let content = `${title}\n`;
    content += `${'='.repeat(title.length)}\n\n`;
    content += `Título: ${session.title}\n`;
    content += `Data: ${format(new Date(session.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}\n\n`;
    content += `---\n\n`;

    sections.forEach(section => {
      content += `## ${section.title}\n\n`;
      content += `${sectionValues[section.key] || '(Não preenchido)'}\n\n`;
      if (noteValues[section.key]) {
        content += `Notas: ${noteValues[section.key]}\n\n`;
      }
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.title.replace(/[^a-z0-9]/gi, '_')}_${format(new Date(), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({ title: 'Exportado como texto' });
  };

  const exportAsHTML = () => {
    if (!session) return;

    let html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>${session.title} - ${title}</title>
  <style>
    body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #333; }
    h1 { color: #8B6914; border-bottom: 2px solid #8B6914; padding-bottom: 10px; }
    h2 { color: #5C4A0E; margin-top: 30px; }
    .meta { color: #666; font-size: 0.9em; margin-bottom: 30px; }
    .section { margin-bottom: 25px; }
    .content { white-space: pre-wrap; line-height: 1.6; }
    .notes { background: #f9f6ee; padding: 10px 15px; border-left: 3px solid #8B6914; margin-top: 10px; font-size: 0.9em; }
    .disclaimer { background: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 40px; font-size: 0.85em; }
    @media print { body { margin: 20px; } }
  </style>
</head>
<body>
  <h1>${session.title}</h1>
  <p class="meta">
    ${title}<br>
    ${format(new Date(session.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
  </p>
`;

    sections.forEach(section => {
      html += `  <div class="section">
    <h2>${section.title}</h2>
    <div class="content">${sectionValues[section.key] || '<em>(Não preenchido)</em>'}</div>
`;
      if (noteValues[section.key]) {
        html += `    <div class="notes"><strong>Notas:</strong> ${noteValues[section.key]}</div>\n`;
      }
      html += `  </div>\n`;
    });

    html += `  <div class="disclaimer">
    <strong>⚠️ Aviso:</strong> Este é um instrumento simbólico e reflexivo. Não constitui diagnóstico ou avaliação clínica.
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.title.replace(/[^a-z0-9]/gi, '_')}_${format(new Date(), 'yyyy-MM-dd')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({ title: 'Exportado como HTML (imprimível)' });
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  if (!session) return null;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(listPath)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <SectionHeader
            title={title}
            subtitle={subtitle}
            icon={icon}
          />
        </div>

        {/* Session Title */}
        <Card className="mb-6 border-gold/30 bg-gold/5">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-lg">{session.title}</h2>
                <p className="text-sm text-muted-foreground">
                  Criado em {format(new Date(session.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FileDown className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={exportAsText}>
                      Exportar como Texto (.txt)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={exportAsHTML}>
                      Exportar como HTML (imprimível)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button onClick={handleSave} disabled={saving} size="sm">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Salvar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ethical Disclaimer */}
        <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
          <CardContent className="py-4">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Este é um instrumento simbólico e reflexivo. Não fornece diagnóstico ou avaliação clínica. 
                A interpretação é de responsabilidade exclusiva do profissional.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Introduction */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <p className="text-muted-foreground whitespace-pre-line">{introduction}</p>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <Card key={section.key}>
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
                {section.description && (
                  <CardDescription>{section.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={sectionValues[section.key] || ''}
                  onChange={(e) => handleSectionChange(section.key, e.target.value)}
                  placeholder={section.placeholder || 'Escreva suas observações...'}
                  rows={5}
                  className="resize-none"
                />
                
                <Collapsible open={openNotes[section.key]} onOpenChange={() => toggleNote(section.key)}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <StickyNote className="w-4 h-4 mr-2" />
                      Notas adicionais
                      {openNotes[section.key] ? (
                        <ChevronUp className="w-4 h-4 ml-2" />
                      ) : (
                        <ChevronDown className="w-4 h-4 ml-2" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <Textarea
                      value={noteValues[section.key] || ''}
                      onChange={(e) => handleNoteChange(section.key, e.target.value)}
                      placeholder="Notas pessoais sobre esta seção..."
                      rows={3}
                      className="resize-none text-sm"
                    />
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Save Button */}
        <div className="flex justify-end mt-6 gap-3">
          <Button variant="outline" onClick={() => navigate(listPath)}>
            Voltar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Salvar Alterações
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
