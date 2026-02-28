import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Award, CheckCircle2, XCircle, Search, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface AlunaProgress {
  user_id: string;
  nome: string;
  email: string;
  travessia_percent: number;
  lab_concluido: boolean;
  registro_salvo: boolean;
  integracao_concluida: boolean;
  certificado_status: string | null;
  certificado_id: string | null;
}

export function AdminCertificacaoTab() {
  const [ciclos, setCiclos] = useState<any[]>([]);
  const [selectedCiclo, setSelectedCiclo] = useState<string>('');
  const [alunas, setAlunas] = useState<AlunaProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [validating, setValidating] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('clube_livro_ciclos').select('id, titulo, autor_livro, ativo')
      .order('ordem')
      .then(({ data }) => setCiclos(data || []));
  }, []);

  const fetchProgress = async (cicloId: string) => {
    setLoading(true);
    try {
      // Get all escutas for this ciclo
      const { data: escutas } = await supabase
        .from('clube_livro_escutas')
        .select('id')
        .eq('ciclo_id', cicloId)
        .eq('ativo', true);
      const totalEscutas = escutas?.length || 0;
      const escutaIds = escutas?.map(e => e.id) || [];

      // Get all non-visitor users
      const { data: users } = await supabase
        .from('profiles')
        .select('id, nome, email')
        .order('nome');

      if (!users?.length) { setAlunas([]); setLoading(false); return; }

      // Get audio progress for all users
      const { data: audioProgress } = await supabase
        .from('clube_audio_progress')
        .select('user_id, track_id, concluido')
        .eq('concluido', true)
        .in('track_id', escutaIds.length > 0 ? escutaIds : ['00000000-0000-0000-0000-000000000000']);

      // Get lab progress
      const { data: labProgress } = await supabase
        .from('lab_8020_progress')
        .select('user_id, concluido')
        .eq('concluido', true);

      // Get registros
      const { data: registros } = await supabase
        .from('clube_estacao_registros')
        .select('user_id');

      // Get integracoes
      const { data: integracoes } = await supabase
        .from('clube_livro_integracoes')
        .select('user_id, status')
        .eq('ciclo_id', cicloId)
        .eq('status', 'concluida');

      // Get certificates
      const { data: certs } = await supabase
        .from('certificates')
        .select('id, user_id, status')
        .eq('ciclo_id', cicloId);

      // Build progress map
      const audioMap = new Map<string, number>();
      (audioProgress || []).forEach(ap => {
        audioMap.set(ap.user_id, (audioMap.get(ap.user_id) || 0) + 1);
      });
      const labSet = new Set((labProgress || []).map(l => l.user_id));
      const registroSet = new Set((registros || []).map(r => r.user_id));
      const integracaoSet = new Set((integracoes || []).map(i => i.user_id));
      const certMap = new Map<string, { id: string; status: string }>();
      (certs || []).forEach(c => certMap.set(c.user_id, { id: c.id, status: c.status || 'elegivel' }));

      const result: AlunaProgress[] = users.map(u => {
        const completed = audioMap.get(u.id) || 0;
        const percent = totalEscutas > 0 ? Math.round((completed / totalEscutas) * 100) : 0;
        const cert = certMap.get(u.id);
        return {
          user_id: u.id,
          nome: u.nome || '',
          email: u.email || '',
          travessia_percent: percent,
          lab_concluido: labSet.has(u.id),
          registro_salvo: registroSet.has(u.id),
          integracao_concluida: integracaoSet.has(u.id),
          certificado_status: cert?.status || null,
          certificado_id: cert?.id || null,
        };
      });

      // Sort: elegíveis first, then by name
      result.sort((a, b) => {
        const aElegivel = a.travessia_percent >= 70 && a.lab_concluido && a.registro_salvo && a.integracao_concluida;
        const bElegivel = b.travessia_percent >= 70 && b.lab_concluido && b.registro_salvo && b.integracao_concluida;
        if (aElegivel && !bElegivel) return -1;
        if (!aElegivel && bElegivel) return 1;
        return (a.nome || '').localeCompare(b.nome || '');
      });

      setAlunas(result);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao buscar progresso');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCiclo = (id: string) => {
    setSelectedCiclo(id);
    fetchProgress(id);
  };

  const handleValidar = async (aluna: AlunaProgress) => {
    setValidating(aluna.user_id);
    try {
      const ciclo = ciclos.find(c => c.id === selectedCiclo);
      const cargaBase = (ciclo as any)?.carga_horaria_base || 20;
      const cargaAjuste = (ciclo as any)?.carga_horaria_ajuste || 0;

      if (aluna.certificado_id) {
        // Update existing
        await supabase.from('certificates').update({
          status: 'validado',
          issue_date: new Date().toISOString().split('T')[0],
          carga_horaria_total: cargaBase + cargaAjuste,
          updated_at: new Date().toISOString(),
        }).eq('id', aluna.certificado_id);
      } else {
        // Create new
        await supabase.from('certificates').insert({
          user_id: aluna.user_id,
          ciclo_id: selectedCiclo,
          status: 'validado',
          issue_date: new Date().toISOString().split('T')[0],
          carga_horaria_total: cargaBase + cargaAjuste,
        });
      }

      toast.success(`Certificado validado para ${aluna.nome || aluna.email}`);
      fetchProgress(selectedCiclo);
    } catch (e) {
      toast.error('Erro ao validar certificado');
    } finally {
      setValidating(null);
    }
  };

  const handleRevogar = async (aluna: AlunaProgress) => {
    if (!aluna.certificado_id) return;
    setValidating(aluna.user_id);
    try {
      await supabase.from('certificates').update({
        status: 'elegivel',
        updated_at: new Date().toISOString(),
      }).eq('id', aluna.certificado_id);
      toast.success('Certificado revogado');
      fetchProgress(selectedCiclo);
    } catch (e) {
      toast.error('Erro ao revogar');
    } finally {
      setValidating(null);
    }
  };

  const isElegivel = (a: AlunaProgress) =>
    a.travessia_percent >= 70 && a.lab_concluido && a.registro_salvo && a.integracao_concluida;

  const filteredAlunas = alunas.filter(a => {
    if (!searchTerm) return isElegivel(a) || a.certificado_status;
    const term = searchTerm.toLowerCase();
    return (a.nome?.toLowerCase().includes(term) || a.email?.toLowerCase().includes(term));
  });

  const StatusIcon = ({ ok }: { ok: boolean }) => ok
    ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
    : <XCircle className="w-4 h-4 text-muted-foreground/40" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Casa da Certificação</h2>
        <p className="text-muted-foreground">Validação institucional de travessias concluídas.</p>
      </div>

      <Card className="bg-card/50">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select value={selectedCiclo} onValueChange={handleSelectCiclo}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um livro / ciclo" />
                </SelectTrigger>
                <SelectContent>
                  {ciclos.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.titulo} {c.autor_livro ? `— ${c.autor_livro}` : ''} {c.ativo ? '✅' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar aluna..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {!selectedCiclo ? (
        <p className="text-center text-muted-foreground py-12">Selecione um livro para ver a elegibilidade.</p>
      ) : loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : filteredAlunas.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          {searchTerm ? 'Nenhuma aluna encontrada.' : 'Nenhuma aluna elegível para certificação neste livro.'}
        </p>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {filteredAlunas.filter(a => isElegivel(a)).length} elegível(eis) · {filteredAlunas.filter(a => a.certificado_status === 'validado').length} validado(s)
          </p>

          {filteredAlunas.map(aluna => (
            <Card key={aluna.user_id} className="bg-card/50">
              <CardContent className="py-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{aluna.nome || 'Sem nome'}</p>
                    <p className="text-xs text-muted-foreground truncate">{aluna.email}</p>
                  </div>

                  {/* Progress indicators */}
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1" title={`Travessia: ${aluna.travessia_percent}%`}>
                      <StatusIcon ok={aluna.travessia_percent >= 70} />
                      <span className="text-muted-foreground">{aluna.travessia_percent}%</span>
                    </div>
                    <div className="flex items-center gap-1" title="Lab 80/20">
                      <StatusIcon ok={aluna.lab_concluido} />
                      <span className="text-muted-foreground">Lab</span>
                    </div>
                    <div className="flex items-center gap-1" title="Registro">
                      <StatusIcon ok={aluna.registro_salvo} />
                      <span className="text-muted-foreground">Reg</span>
                    </div>
                    <div className="flex items-center gap-1" title="Integração">
                      <StatusIcon ok={aluna.integracao_concluida} />
                      <span className="text-muted-foreground">Int</span>
                    </div>
                  </div>

                  {/* Status + Action */}
                  <div className="flex items-center gap-2 shrink-0">
                    {aluna.certificado_status === 'validado' ? (
                      <>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          <Award className="w-3 h-3 mr-1" /> Validado
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-destructive"
                          onClick={() => handleRevogar(aluna)}
                          disabled={validating === aluna.user_id}
                        >
                          Revogar
                        </Button>
                      </>
                    ) : isElegivel(aluna) ? (
                      <Button
                        size="sm"
                        variant="gold"
                        className="gap-1"
                        onClick={() => handleValidar(aluna)}
                        disabled={validating === aluna.user_id}
                      >
                        {validating === aluna.user_id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Award className="w-3 h-3" />
                        )}
                        Validar Travessia
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Incompleto
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminCertificacaoTab;
