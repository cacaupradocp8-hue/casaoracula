import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, ShieldCheck, ClipboardList, Book, Info, Lock, Map, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

export function AdminDocumentosTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-serif text-foreground">Painel de Documentos</h2>
        <p className="text-muted-foreground text-sm">Guias, protocolos e manuais operacionais da Casa Orácula</p>
      </div>

      <Tabs defaultValue="operacao" className="w-full">
        <TabsList className="bg-muted/50 p-1 flex-wrap h-auto">
          <TabsTrigger value="operacao" className="gap-2">
            <Zap className="w-4 h-4" />
            📌 Operação
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="gap-2">
            <Lock className="w-4 h-4" />
            🛡 Segurança
          </TabsTrigger>
          <TabsTrigger value="manuais" className="gap-2">
            <Book className="w-4 h-4" />
            🏛 Manuais
          </TabsTrigger>
          <TabsTrigger value="produto" className="gap-2">
            <Map className="w-4 h-4" />
            🧭 Produto
          </TabsTrigger>
        </TabsList>

        {/* 📌 OPERAÇÃO */}
        <TabsContent value="operacao" className="pt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-primary mb-2">
                  <FileText className="w-5 h-5" />
                  <Badge variant="outline" className="text-[10px] uppercase">Guia</Badge>
                </div>
                <CardTitle className="text-lg">Monitoramento Rockty</CardTitle>
                <CardDescription>Protocolo diário em produção controlada</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] rounded-md border p-4 bg-muted/20">
                  <div className="prose prose-sm prose-invert max-w-none">
                    <h3>Checklist Diário</h3>
                    <ul>
                      <li>Verificar painel Guardiã Rockty.</li>
                      <li>Conferir volume de webhooks.</li>
                      <li>Validar matrículas pendentes (&gt;1h).</li>
                      <li>Checar logs de erro nas Edge Functions.</li>
                    </ul>
                    <p className="text-xs text-muted-foreground mt-4 italic">Ref: SPRINT_04C2_ROCKTY_PRODUCTION_MONITORING_GUIDE.md</p>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Zap className="w-5 h-5" />
                  <Badge variant="outline" className="text-[10px] uppercase">Protocolo</Badge>
                </div>
                <CardTitle className="text-lg">Primeiras Vendas Reais</CardTitle>
                <CardDescription>Acompanhamento das primeiras 10 vendas</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] rounded-md border p-4 bg-muted/20">
                  <div className="prose prose-sm prose-invert max-w-none">
                    <h3>Passo a Passo</h3>
                    <ul>
                      <li>Validar webhook ativo e HMAC.</li>
                      <li>Acompanhar log em tempo real.</li>
                      <li>Confirmar liberação de portal (sincronia).</li>
                    </ul>
                    <p className="text-xs text-muted-foreground mt-4 italic">Ref: SPRINT_04C3_FIRST_REAL_SALES_MONITORING_PROTOCOL.md</p>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-2 text-primary mb-2">
                  <ClipboardList className="w-5 h-5" />
                  <Badge variant="outline" className="text-[10px] uppercase">Operação</Badge>
                </div>
                <CardTitle className="text-lg">Checklist de Produção Controlada</CardTitle>
                <CardDescription>Manutenção semanal e integridade do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[250px] rounded-md border p-4 bg-muted/20">
                  <div className="prose prose-sm prose-invert max-w-none">
                    <h3>Verificação Técnica</h3>
                    <ul>
                      <li>Auditoria de logs por falhas de processamento.</li>
                      <li>Verificação de integridade profiles vs subscriptions.</li>
                      <li>Revisão de novos offer_ids na plataforma.</li>
                    </ul>
                    <p className="text-xs text-muted-foreground mt-4 italic">Ref: CHECKLIST_PRODUCAO_CONTROLADA.md</p>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 border-primary/30 bg-primary/5">
              <CardHeader>
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Zap className="w-5 h-5 text-gold" />
                  <Badge variant="outline" className="text-[10px] uppercase border-gold text-gold">Lançamento</Badge>
                </div>
                <CardTitle className="text-lg">Plano de Produção Controlada</CardTitle>
                <CardDescription>Estratégia de lançamento e monitoramento inicial</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[250px] rounded-md border p-4 bg-muted/20">
                  <div className="prose prose-sm prose-invert max-w-none">
                    <h3>Operação Sprint 04D</h3>
                    <ul>
                      <li><strong>Checklist Pré-Venda:</strong> Webhook, Mapping e HMAC.</li>
                      <li><strong>Monitoramento Real:</strong> Acompanhamento das 3 primeiras vendas.</li>
                      <li><strong>Critérios de Sucesso:</strong> Liberação imediata e sem erros críticos.</li>
                    </ul>
                    <p className="text-xs text-muted-foreground mt-4 italic">Ref: SPRINT_04D_CONTROLLED_PRODUCTION_LAUNCH_PLAN.md</p>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 🛡 SEGURANÇA */}
        <TabsContent value="seguranca" className="pt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-amber-500 mb-2">
                  <Lock className="w-5 h-5" />
                  <Badge variant="outline" className="text-[10px] uppercase border-amber-500/50 text-amber-500">Segurança</Badge>
                </div>
                <CardTitle className="text-lg">Política de Webhooks</CardTitle>
                <CardDescription>Diretrizes de segurança e integridade</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[250px] rounded-md border p-4 bg-muted/20">
                  <div className="prose prose-sm prose-invert max-w-none">
                    <ul>
                      <li><strong>HMAC Obrigatório:</strong> Validação de assinatura em todas as chamadas.</li>
                      <li><strong>Idempotência:</strong> Prevenção de processamento duplicado.</li>
                      <li><strong>Privacidade:</strong> Não armazenamento de dados sensíveis de pagamento.</li>
                    </ul>
                    <p className="text-xs text-muted-foreground mt-4 italic">Ref: POLITICA_WEBHOOKS.md</p>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-amber-500 mb-2">
                  <AlertTriangleIcon className="w-5 h-5" />
                  <Badge variant="outline" className="text-[10px] uppercase border-amber-500/50 text-amber-500">Auditoria</Badge>
                </div>
                <CardTitle className="text-lg">Critérios de Unknown Offer</CardTitle>
                <CardDescription>Como tratar ofertas não mapeadas</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[250px] rounded-md border p-4 bg-muted/20">
                  <div className="prose prose-sm prose-invert max-w-none">
                    <ul>
                      <li>Identificação do <code>offer_id</code> no log.</li>
                      <li>Validação do portal alvo de destino.</li>
                      <li>Procedimento de atualização de mapeamento seguro.</li>
                    </ul>
                    <p className="text-xs text-muted-foreground mt-4 italic">Ref: CRITERIOS_UNKNOWN_OFFER.md</p>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-2 text-red-500 mb-2">
                  <ShieldAlert className="w-5 h-5" />
                  <Badge variant="outline" className="text-[10px] uppercase border-red-500/50 text-red-500">Crítico</Badge>
                </div>
                <CardTitle className="text-lg">Procedimento de Incidente</CardTitle>
                <CardDescription>O que fazer em caso de falha sistêmica</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[250px] rounded-md border p-4 bg-muted/20">
                  <div className="prose prose-sm prose-invert max-w-none">
                    <h3>Fluxo de Resposta</h3>
                    <ol>
                      <li><strong>Detecção:</strong> Alerta visual ou chamado de suporte.</li>
                      <li><strong>Triagem:</strong> Consulta aos logs de processamento.</li>
                      <li><strong>Ação:</strong> Reprocessamento ou notificação técnica.</li>
                    </ol>
                    <p className="text-xs text-muted-foreground mt-4 italic">Ref: PROCEDIMENTO_INCIDENTE.md</p>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 🏛 MANUAIS DA CASA */}
        <TabsContent value="manuais" className="pt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <ClipboardList className="w-5 h-5" />
                  <Badge variant="outline" className="text-[10px] uppercase border-blue-400/50 text-blue-400">Clínico</Badge>
                </div>
                <CardTitle className="text-lg">Manual Clínico</CardTitle>
                <CardDescription>Roteiros e práticas de atendimento</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">Conteúdo restrito às facilitadoras e guardiãs autorizadas.</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <a href="/session-room/manuais">Ver Manuais</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <Book className="w-5 h-5" />
                  <Badge variant="outline" className="text-[10px] uppercase border-blue-400/50 text-blue-400">Operação</Badge>
                </div>
                <CardTitle className="text-lg">Manual da Facilitadora</CardTitle>
                <CardDescription>Gestão de turmas e acompanhamento</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] rounded-md border p-4 bg-muted/20">
                  <div className="prose prose-sm prose-invert max-w-none">
                    <ul>
                      <li>Gestão de liberação de módulos.</li>
                      <li>Monitoramento de engajamento.</li>
                      <li>Comunicação interna via portais.</li>
                    </ul>
                    <p className="text-xs text-muted-foreground mt-4 italic">Ref: MANUAL_FACILITADORA.md</p>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <ShieldCheck className="w-5 h-5" />
                  <Badge variant="outline" className="text-[10px] uppercase border-blue-400/50 text-blue-400">Admin</Badge>
                </div>
                <CardTitle className="text-lg">Manual da Guardiã / Admin</CardTitle>
                <CardDescription>Configurações mestres e governança de dados</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] rounded-md border p-4 bg-muted/20">
                  <div className="prose prose-sm prose-invert max-w-none">
                    <ul>
                      <li>Gestão de níveis de acesso (Roles).</li>
                      <li>Configuração de integrações de pagamento.</li>
                      <li>Auditoria de segurança e logs sensíveis.</li>
                    </ul>
                    <p className="text-xs text-muted-foreground mt-4 italic">Ref: MANUAL_GUARDIA_ADMIN.md</p>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 🧭 PRODUTO */}
        <TabsContent value="produto" className="pt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-purple-400 mb-2">
                  <Map className="w-5 h-5" />
                  <Badge variant="outline" className="text-[10px] uppercase border-purple-400/50 text-purple-400">Estratégia</Badge>
                </div>
                <CardTitle className="text-lg">Mapa de Planos</CardTitle>
                <CardDescription>Estrutura de precificação e portais</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] rounded-md border p-4 bg-muted/20">
                  <div className="prose prose-sm prose-invert max-w-none">
                    <ul>
                      <li>Definição de Clube, Formação e Jornadas.</li>
                      <li>Periodicidades e regras de renovação.</li>
                      <li>Mappings de oferta correspondentes.</li>
                    </ul>
                    <p className="text-xs text-muted-foreground mt-4 italic">Ref: MAPA_PLANOS.md</p>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-purple-400 mb-2">
                  <Info className="w-5 h-5" />
                  <Badge variant="outline" className="text-[10px] uppercase border-purple-400/50 text-purple-400">UX</Badge>
                </div>
                <CardTitle className="text-lg">Jornada de Acesso</CardTitle>
                <CardDescription>Experiência da usuária do checkout ao portal</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] rounded-md border p-4 bg-muted/20">
                  <div className="prose prose-sm prose-invert max-w-none">
                    <ul>
                      <li>Fluxo de compra e recepção de e-mail.</li>
                      <li>Processo de primeiro login (Match de E-mail).</li>
                      <li>Ativação de portal via pendências.</li>
                    </ul>
                    <p className="text-xs text-muted-foreground mt-4 italic">Ref: JORNADA_ACESSO.md</p>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-2 text-purple-400 mb-2">
                  <LayoutIcon className="w-5 h-5" />
                  <Badge variant="outline" className="text-[10px] uppercase border-purple-400/50 text-purple-400">Arquitetura</Badge>
                </div>
                <CardTitle className="text-lg">Estrutura dos Portais</CardTitle>
                <CardDescription>Divisão lógica e técnica de conteúdos</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] rounded-md border p-4 bg-muted/20">
                  <div className="prose prose-sm prose-invert max-w-none">
                    <ul>
                      <li>Visitante, Aluna, Assinante e Orácula.</li>
                      <li>Hierarquia de permissões e visibilidade.</li>
                      <li>Sincronia entre <code>profiles</code> e <code>user_roles</code>.</li>
                    </ul>
                    <p className="text-xs text-muted-foreground mt-4 italic">Ref: ESTRUTURA_PORTAIS.md</p>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
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

// Helper icons
function ShieldAlert(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}

function AlertTriangleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function LayoutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}
