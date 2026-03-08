import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { MobilePageShell } from '@/components/shared/MobilePageShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, FileUp, ChevronLeft, Upload, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Submission {
  id: string;
  titulo: string;
  descricao: string | null;
  file_url: string | null;
  status: string;
  feedback: string | null;
  nota: number | null;
  created_at: string;
}

interface Certificate {
  id: string;
  certificado_url: string | null;
  status: string | null;
  issue_date: string | null;
  carga_horaria_total: number | null;
}

export default function FormacaoAvaliacoesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      try {
        const [subsRes, certsRes] = await Promise.all([
          supabase
            .from('course_work_submissions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('certificates')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
        ]);

        setSubmissions((subsRes.data || []) as Submission[]);
        setCertificates((certsRes.data || []) as Certificate[]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [user]);

  const handleSubmit = async () => {
    if (!user || !titulo.trim()) return;
    setIsSubmitting(true);

    try {
      let fileUrl: string | null = null;

      if (file) {
        const ext = file.name.split('.').pop();
        const path = `submissions/${user.id}/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from('content-images')
          .upload(path, file);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from('content-images').getPublicUrl(path);
        fileUrl = urlData.publicUrl;
      }

      // Get first course for simplicity
      const { data: courses } = await supabase
        .from('courses')
        .select('id')
        .eq('publicado', true)
        .limit(1);

      const courseId = courses?.[0]?.id;
      if (!courseId) throw new Error('No course found');

      const { error } = await supabase.from('course_work_submissions').insert({
        course_id: courseId,
        user_id: user.id,
        titulo: titulo.trim(),
        descricao: descricao.trim() || null,
        file_url: fileUrl,
      });

      if (error) throw error;

      toast({ title: 'Trabalho enviado com sucesso!' });
      setTitulo('');
      setDescricao('');
      setFile(null);

      // Refresh
      const { data } = await supabase
        .from('course_work_submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setSubmissions((data || []) as Submission[]);
    } catch (err) {
      console.error(err);
      toast({ title: 'Erro ao enviar trabalho', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
    pendente: { icon: <Clock className="w-3 h-3" />, label: 'Pendente', color: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
    aprovado: { icon: <CheckCircle className="w-3 h-3" />, label: 'Aprovado', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
    revisao: { icon: <XCircle className="w-3 h-3" />, label: 'Em Revisão', color: 'bg-primary/15 text-primary border-primary/20' },
    reprovado: { icon: <XCircle className="w-3 h-3" />, label: 'Revisão Necessária', color: 'bg-destructive/15 text-destructive border-destructive/20' },
  };

  return (
    <AppLayout>
      <MobilePageShell
        badge="Avaliações"
        title="Avaliações & Certificado"
        subtitle="Envie seus trabalhos e acompanhe sua certificação"
      >
        <div className="pb-20 space-y-6">
          <Link to="/formacao-metodo" className="inline-flex items-center gap-2 text-foreground/40 hover:text-foreground text-sm">
            <ChevronLeft className="w-4 h-4" /> Voltar à Formação
          </Link>

          <Tabs defaultValue="enviar" className="space-y-6">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="enviar" className="gap-2"><FileUp className="w-4 h-4" />Enviar Trabalho</TabsTrigger>
              <TabsTrigger value="historico" className="gap-2"><Clock className="w-4 h-4" />Histórico</TabsTrigger>
              <TabsTrigger value="certificado" className="gap-2"><Award className="w-4 h-4" />Certificado</TabsTrigger>
            </TabsList>

            {/* Submit Work */}
            <TabsContent value="enviar">
              <Card className="border-border/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileUp className="w-5 h-5 text-gold" />
                    Novo Envio
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground/70 mb-1.5 block">Título do Trabalho</label>
                    <Input
                      placeholder="Ex: Relatório da Sessão Prática 1"
                      value={titulo}
                      onChange={e => setTitulo(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/70 mb-1.5 block">Descrição (opcional)</label>
                    <Textarea
                      placeholder="Descreva brevemente seu trabalho..."
                      value={descricao}
                      onChange={e => setDescricao(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/70 mb-1.5 block">Arquivo (PDF, imagem)</label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-md border border-border/40 hover:bg-muted/30 transition-colors text-sm">
                          <Upload className="w-4 h-4" />
                          {file ? file.name : 'Selecionar arquivo'}
                        </div>
                        <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={e => setFile(e.target.files?.[0] || null)} />
                      </label>
                    </div>
                  </div>
                  <Button variant="gold" onClick={handleSubmit} disabled={!titulo.trim() || isSubmitting} className="gap-2">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Enviar Trabalho
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* History */}
            <TabsContent value="historico">
              {isLoading ? (
                <div className="space-y-3">{[1, 2].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
              ) : submissions.length === 0 ? (
                <Card className="p-8 text-center border-border/30">
                  <p className="text-foreground/50">Nenhum trabalho enviado ainda.</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {submissions.map(sub => {
                    const sc = statusConfig[sub.status] || statusConfig.pendente;
                    return (
                      <Card key={sub.id} className="border-border/30">
                        <CardContent className="p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm text-foreground/80">{sub.titulo}</h4>
                            <Badge className={`gap-1 text-xs ${sc.color}`}>
                              {sc.icon} {sc.label}
                            </Badge>
                          </div>
                          {sub.descricao && <p className="text-xs text-foreground/50">{sub.descricao}</p>}
                          {sub.file_url && (
                            <a href={sub.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-gold hover:underline">
                              Ver arquivo anexado
                            </a>
                          )}
                          {sub.feedback && (
                            <div className="p-3 rounded-lg bg-muted/20 border border-border/10">
                              <p className="text-xs font-medium text-foreground/60 mb-1">Feedback da instrutora:</p>
                              <p className="text-sm text-foreground/70">{sub.feedback}</p>
                            </div>
                          )}
                          {sub.nota !== null && (
                            <p className="text-xs text-foreground/40">Nota: <span className="font-medium text-gold">{sub.nota}</span></p>
                          )}
                          <p className="text-xs text-foreground/30">
                            Enviado {formatDistanceToNow(new Date(sub.created_at), { addSuffix: true, locale: ptBR })}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Certificate */}
            <TabsContent value="certificado">
              {isLoading ? (
                <Skeleton className="h-48 rounded-xl" />
              ) : certificates.length === 0 ? (
                <Card className="border-border/30">
                  <CardContent className="p-8 text-center space-y-4">
                    <Award className="w-16 h-16 text-gold/30 mx-auto" />
                    <h3 className="font-display text-lg font-semibold text-foreground/80">Certificado ainda não disponível</h3>
                    <p className="text-sm text-foreground/50 max-w-md mx-auto">
                      Complete todos os módulos e envie os trabalhos avaliativos para receber seu certificado de conclusão.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {certificates.map(cert => (
                    <Card key={cert.id} className="border-border/30 overflow-hidden">
                      <CardContent className="p-6 text-center space-y-4">
                        <div className="w-20 h-20 rounded-full bg-gold/10 mx-auto flex items-center justify-center">
                          <Award className="w-10 h-10 text-gold" />
                        </div>
                        <h3 className="font-display text-lg font-semibold text-foreground">
                          Certificado de Formação
                        </h3>
                        <p className="text-sm text-foreground/50">
                          Status: <Badge variant="outline">{cert.status || 'Pendente'}</Badge>
                        </p>
                        {cert.carga_horaria_total && (
                          <p className="text-xs text-foreground/40">Carga horária: {cert.carga_horaria_total}h</p>
                        )}
                        {cert.issue_date && (
                          <p className="text-xs text-foreground/40">Emitido em: {new Date(cert.issue_date).toLocaleDateString('pt-BR')}</p>
                        )}
                        {cert.certificado_url && (
                          <a href={cert.certificado_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="gold" className="gap-2">
                              <Award className="w-4 h-4" /> Baixar Certificado
                            </Button>
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </MobilePageShell>
    </AppLayout>
  );
}

// Need Send icon
function Send(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>
  );
}
