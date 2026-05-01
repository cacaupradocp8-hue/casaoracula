import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Target, Brain, ArrowUpRight, Zap, Star, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const Laboratorio8020 = () => {
  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-foreground">Laboratório 80/20 (Análise de Impacto)</h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                Identifique os <span className="text-primary font-medium">20% de padrões simbólicos</span> que estão gerando 80% dos impasses ou dos avanços na sua clínica.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <InsightCard 
          icon={Target} 
          title="Ponto Cego Dominante" 
          value="Transferência" 
          desc="Presente em 65% dos seus casos analisados." 
        />
        <InsightCard 
          icon={Brain} 
          title="Ferramenta de Alavanca" 
          value="Mapa Vivo" 
          desc="Gerou os insights mais profundos este mês." 
        />
        <InsightCard 
          icon={TrendingUp} 
          title="Taxa de Evolução" 
          value="+12%" 
          desc="Comparado ao último ciclo de supervisão." 
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white/[0.01] border-white/10">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" /> Distribuição de Complexos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ComplexProgress label="Complexo Materno" value={70} />
            <ComplexProgress label="Complexo de Autoridade" value={45} />
            <ComplexProgress label="Complexo de Abandono" value={30} />
            <ComplexProgress label="Sombra Profissional" value={20} />
          </CardContent>
        </Card>

        <Card className="bg-white/[0.01] border-white/10 p-6 flex flex-col justify-center items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <ArrowUpRight className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-white">Próximo Nível de Maestria</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Focar na técnica de "Imaginação Ativa" nos próximos 3 casos pode reduzir seu tempo de diagnóstico em 40%.
            </p>
          </div>
          <button className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">
            Ver plano de ação
          </button>
        </Card>
      </div>

      <Card className="bg-white/[0.01] border-white/10">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" /> Padrões de Alto Impacto (Top 20%)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-white">Identificação Arquetípica Precoce</h4>
                <p className="text-xs text-muted-foreground">Quando você identifica o arquétipo na primeira sessão, a taxa de adesão do cliente sobe 80%.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-white">Resistência Silenciosa</h4>
                <p className="text-xs text-muted-foreground">O padrão de "concordância passiva" é o maior ladrão de profundidade nos seus atendimentos atuais.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

function InsightCard({ icon: Icon, title, value, desc }: { icon: any, title: string, value: string, desc: string }) {
  return (
    <Card className="bg-white/[0.02] border-white/5 hover:border-primary/20 transition-all">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-widest font-bold">{title}</span>
        </div>
        <div className="text-2xl font-semibold text-white">{value}</div>
        <p className="text-[11px] text-muted-foreground/60 leading-relaxed">{desc}</p>
      </CardContent>
    </Card>
  );
}

function ComplexProgress({ label, value }: { label: string, value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[11px]">
        <span className="text-white/70">{label}</span>
        <span className="text-primary">{value}%</span>
      </div>
      <Progress value={value} className="h-1 bg-white/5" />
    </div>
  );
}