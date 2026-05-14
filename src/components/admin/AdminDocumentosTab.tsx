import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, ShieldCheck, ClipboardList, Book } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

export function AdminDocumentosTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-serif text-foreground">Painel de Documentos</h2>
        <p className="text-muted-foreground text-sm">Guias, protocolos e manuais operacionais da Casa Orácula</p>
      </div>

      <Tabs defaultValue="operacional" className="w-full">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="operacional" className="gap-2">
            <ShieldCheck className="w-4 h-4" />
            Operacional (Rockty)
          </TabsTrigger>
          <TabsTrigger value="clinico" className="gap-2">
            <ClipboardList className="w-4 h-4" />
            Protocolos Clínicos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="operacional" className="pt-4 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-primary mb-2">
                <FileText className="w-5 h-5" />
                <Badge variant="outline" className="text-[10px] uppercase">Guia de Monitoramento</Badge>
              </div>
              <CardTitle>Monitoramento Rockty em Produção Controlada</CardTitle>
              <CardDescription>Protocolo de acompanhamento diário e resposta a incidentes</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] rounded-md border p-4 bg-muted/20">
                <div className="prose prose-sm prose-invert max-w-none">
                  <h3>1. Checklist Diário</h3>
                  <ul>
                    <li>Verificar se o painel Guardiã Rockty carrega sem erros.</li>
                    <li>Conferir se o volume de webhooks hoje condiz com o esperado.</li>
                    <li>Validar se há matrículas pendentes não processadas há mais de 1 hora.</li>
                    <li>Checar logs de erro no Supabase Edge Functions (opcional).</li>
                  </ul>
                  
                  <h3>2. Indicadores de Atenção</h3>
                  <ul>
                    <li><strong>Status "error" no Webhook:</strong> Indica falha no processamento.</li>
                    <li><strong>Oferta Desconhecida:</strong> Webhook recebido mas oferta não mapeada na tabela <code>rockty_offer_mapping</code>.</li>
                    <li><strong>Divergência de Portal:</strong> Usuária com portal diferente entre <code>profiles</code> e <code>user_roles</code>.</li>
                  </ul>

                  <h3>3. Procedimentos de Resposta</h3>
                  <p>Consulte o arquivo <code>SPRINT_04C2_ROCKTY_PRODUCTION_MONITORING_GUIDE.md</code> para detalhes completos sobre resolução de incidentes.</p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-primary mb-2">
                <ShieldCheck className="w-5 h-5" />
                <Badge variant="outline" className="text-[10px] uppercase">Protocolo de Vendas</Badge>
              </div>
              <CardTitle>Primeiras Vendas Reais - Protocolo de Acompanhamento</CardTitle>
              <CardDescription>Passo a passo para as primeiras 10 vendas em produção</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] rounded-md border p-4 bg-muted/20">
                <div className="prose prose-sm prose-invert max-w-none">
                  <h3>1. Pré-Venda</h3>
                  <ul>
                    <li>Guardiã Rockty acessível.</li>
                    <li>Webhook ativo e HMAC configurado.</li>
                    <li>Mapeamentos oficiais conferidos.</li>
                  </ul>
                  
                  <h3>2. Durante a Venda</h3>
                  <ul>
                    <li>Acompanhar o log do webhook em tempo real.</li>
                    <li>Verificar se o registro de matrícula pendente foi criado.</li>
                    <li>Confirmar se o acesso foi liberado (portal atualizado).</li>
                  </ul>

                  <p>Consulte o arquivo <code>SPRINT_04C3_FIRST_REAL_SALES_MONITORING_PROTOCOL.md</code> para o protocolo detalhado.</p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clinico" className="pt-4 space-y-4">
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              <Book className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Os manuais e roteiros clínicos podem ser acessados na Sala de Sessão.</p>
              <div className="flex justify-center gap-4 mt-6">
                <Button variant="outline" size="sm" asChild>
                  <a href="/session-room/manuais">Ver Manuais</a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="/session-room/roteiros">Ver Roteiros</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Badge({ children, variant = 'default', className }: { children: React.ReactNode; variant?: 'default' | 'outline' | 'secondary' | 'destructive'; className?: string }) {
  const variants = {
    default: 'bg-primary text-primary-foreground',
    outline: 'border border-primary text-primary',
    secondary: 'bg-secondary text-secondary-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
