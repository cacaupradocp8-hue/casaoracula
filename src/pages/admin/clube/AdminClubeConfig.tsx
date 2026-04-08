import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Settings, Target, GraduationCap, Sparkles } from 'lucide-react';
import { LabConfigManager } from '@/components/admin/clube-livro/LabConfigManager';

export default function AdminClubeConfig() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin/clube-livro">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <SectionHeader
            title="Configurações do Clube"
            subtitle="Regras de progressão, níveis de acesso e Lab 80/20"
            icon={<Settings className="w-5 h-5" />}
          />
        </div>

        <div className="space-y-6">
          <Card className="border-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-gold" />
                Regras de Progressão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>🌑 <strong>Portal</strong> — sempre aberto</p>
              <p>🌒 <strong>Travessia</strong> — aberta</p>
              <p>🌓 <strong>Escuta</strong> — desbloqueia após 30% da Travessia</p>
              <p>🌔 <strong>Laboratório</strong> — desbloqueia após 70% da Travessia</p>
              <p>🌕 <strong>Registro</strong> — desbloqueia após Laboratório concluído</p>
              <p>✨ <strong>Integração</strong> — desbloqueia após Registro salvo</p>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-gold" />
                Níveis de Acesso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>👁 <strong>Visitante</strong> — página institucional, Mapa do Ano, Mensagem do Campo</p>
              <p>📖 <strong>Assinante</strong> — travessia do livro ativo + Lab 80/20 da estação atual</p>
              <p>🎓 <strong>Aluna/Formação</strong> — acesso irrestrito a estações, laboratórios e ferramentas</p>
            </CardContent>
          </Card>

          <Card className="bg-muted/20 border-gold/10">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="text-xs uppercase tracking-widest text-gold font-medium">
                  Governança do Clube
                </span>
              </div>
              <p className="text-sm font-medium text-foreground mb-2">
                Este não é um calendário de leitura.
              </p>
              <p className="text-sm text-muted-foreground">
                É um mapa de travessia formativa. Cada livro existe para desenvolver uma habilidade simbólica,
                fortalecer a prática profissional e ampliar a capacidade de sustentar processos — em si e no outro.
              </p>
            </CardContent>
          </Card>

        </div>
      </div>
    </AppLayout>
  );
}
