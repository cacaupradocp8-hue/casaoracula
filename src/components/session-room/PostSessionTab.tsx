import { useState, useEffect } from 'react';
import { Heart, Plus, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useSessionRoom } from '@/hooks/useSessionRoom';
import type { PostSessionClosure } from '@/types/session-room';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PostSessionTabProps {
  caseId: string;
  clientId: string;
}

export function PostSessionTab({ caseId, clientId }: PostSessionTabProps) {
  const { fetchClosures, createClosure } = useSessionRoom();
  
  const [closures, setClosures] = useState<PostSessionClosure[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    moved: '',
    left_open: '',
    do_not_touch: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadClosures();
  }, [caseId]);

  const loadClosures = async () => {
    const data = await fetchClosures(caseId);
    setClosures(data);
  };

  const handleSave = async () => {
    if (!formData.moved && !formData.left_open && !formData.do_not_touch) return;
    
    setSaving(true);
    const saved = await createClosure(caseId, clientId, formData);
    if (saved) {
      setClosures([saved, ...closures]);
      setFormData({ moved: '', left_open: '', do_not_touch: '' });
      setShowForm(false);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400" />
            Fechar o Campo
          </h3>
          <p className="text-sm text-muted-foreground">
            Registro pós-sessão para integração
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Novo Registro
          </Button>
        )}
      </div>

      {/* New Closure Form */}
      {showForm && (
        <Card className="border-rose-500/30">
          <CardHeader>
            <CardTitle className="text-base">Registrar Fechamento</CardTitle>
            <CardDescription>
              O que você percebeu após a sessão?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                O que se moveu?
              </Label>
              <Textarea
                value={formData.moved}
                onChange={(e) => setFormData({ ...formData, moved: e.target.value })}
                placeholder="Insights, emoções liberadas, conexões feitas..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                O que ficou aberto?
              </Label>
              <Textarea
                value={formData.left_open}
                onChange={(e) => setFormData({ ...formData, left_open: e.target.value })}
                placeholder="Questões para próximas sessões, temas que surgiram..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                O que não deve ser tocado agora?
              </Label>
              <Textarea
                value={formData.do_not_touch}
                onChange={(e) => setFormData({ ...formData, do_not_touch: e.target.value })}
                placeholder="Temas sensíveis que precisam de mais tempo..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                Salvar Registro
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Previous Closures */}
      {closures.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Registros Anteriores</h4>
          
          {closures.map((closure) => (
            <Card key={closure.id} className="bg-muted/30">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {format(new Date(closure.created_at), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {closure.moved && (
                  <div>
                    <span className="font-medium text-green-400">Moveu-se:</span>
                    <p className="text-muted-foreground mt-1">{closure.moved}</p>
                  </div>
                )}
                {closure.left_open && (
                  <div>
                    <span className="font-medium text-yellow-400">Ficou aberto:</span>
                    <p className="text-muted-foreground mt-1">{closure.left_open}</p>
                  </div>
                )}
                {closure.do_not_touch && (
                  <div>
                    <span className="font-medium text-rose-400">Não tocar agora:</span>
                    <p className="text-muted-foreground mt-1">{closure.do_not_touch}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {closures.length === 0 && !showForm && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              Nenhum registro pós-sessão ainda.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
