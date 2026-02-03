import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Info, Heart, Compass } from 'lucide-react';

export type CategoriaBadge = 'padrao' | 'autoral' | 'metodo_oracula';
export type FamiliaSimbolica = 
  | 'ego_identidade' 
  | 'sombra' 
  | 'corpo' 
  | 'imprevisivel' 
  | 'narrativa' 
  | 'oraculares'
  | 'feminino_profundo';

interface FerramentaPageTemplateProps {
  // Cabeçalho
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  categoriaBadge?: CategoriaBadge;
  
  // Textos padronizados (podem vir do banco)
  textoQuandoUsar?: string;
  textoOQueSustenta?: string;
  textoComoAtravessar?: string;
  
  // Navegação
  backHref?: string;
  backLabel?: string;
  
  // Conteúdo interativo da ferramenta
  children: ReactNode;
  
  // Cliente (se em contexto de sessão)
  clienteInfo?: { id: string; nome: string } | null;
  
  // Ferramenta nome para EthicalNotice
  toolName?: string;
}

const BADGE_CONFIG: Record<CategoriaBadge, { label: string; className: string; emoji: string }> = {
  padrao: { 
    label: 'Padrão', 
    className: 'bg-muted text-muted-foreground border-muted',
    emoji: '🔹'
  },
  autoral: { 
    label: 'Autoral', 
    className: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
    emoji: '🔸'
  },
  metodo_oracula: { 
    label: 'Método Orácula', 
    className: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    emoji: '🟣'
  },
};

// Textos padrão (fallback quando não há texto do banco)
const DEFAULT_TEXTS = {
  quandoUsar: 'Esta ferramenta é chamada quando o campo pede uma leitura simbólica estruturada para apoiar a compreensão do processo.',
  oQueSustenta: 'Esta ferramenta sustenta a clareza da escuta e a organização simbólica. Não oferece diagnóstico, cura ou solução — oferece reconhecimento.',
  comoAtravessar: 'Pode ser usada individualmente como prática de autoconhecimento, integrada a sessões terapêuticas ou aplicada em contextos de grupo com orientação adequada.',
};

export function FerramentaPageTemplate({
  title,
  subtitle,
  icon,
  categoriaBadge = 'padrao',
  textoQuandoUsar,
  textoOQueSustenta,
  textoComoAtravessar,
  backHref = '/ferramentas',
  backLabel = 'Voltar às Ferramentas',
  children,
  clienteInfo,
  toolName,
}: FerramentaPageTemplateProps) {
  const navigate = useNavigate();
  const badgeConfig = BADGE_CONFIG[categoriaBadge];

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-4xl">
        {/* Navegação */}
        <div className="mb-6">
          <Link 
            to={backHref} 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Link>
        </div>

        {/* 🟣 CABEÇALHO */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <SectionHeader
              title={title}
              subtitle={subtitle}
              icon={icon}
              className="flex-1"
            />
            <Badge 
              variant="outline" 
              className={`shrink-0 ${badgeConfig.className}`}
            >
              {badgeConfig.emoji} {badgeConfig.label}
            </Badge>
          </div>
        </div>

        {/* Cliente Info (se houver) */}
        {clienteInfo && (
          <Card className="mb-6 border-gold/30 bg-gold/5">
            <CardContent className="py-4">
              <p className="text-sm">
                Aplicando para: <strong>{clienteInfo.nome}</strong>
              </p>
            </CardContent>
          </Card>
        )}

        {/* EthicalNotice */}
        <EthicalNotice toolName={toolName || title} className="mb-6" />

        {/* 🟤 QUANDO USAR */}
        <Card className="mb-6 border-border/50 bg-card/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Info className="w-4 h-4 text-gold" />
              Quando usar esta ferramenta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">
              {textoQuandoUsar || DEFAULT_TEXTS.quandoUsar}
            </p>
          </CardContent>
        </Card>

        {/* 🟢 O QUE SUSTENTA */}
        <Card className="mb-6 border-border/50 bg-card/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Heart className="w-4 h-4 text-rose-400" />
              O que esta ferramenta sustenta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">
              {textoOQueSustenta || DEFAULT_TEXTS.oQueSustenta}
            </p>
          </CardContent>
        </Card>

        {/* 🔵 CONTEÚDO INTERATIVO */}
        <div className="space-y-6 mb-8">
          {children}
        </div>

        {/* 🟡 COMO ATRAVESSAR */}
        <Card className="border-border/50 bg-card/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Compass className="w-4 h-4 text-blue-400" />
              Como atravessar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">
              {textoComoAtravessar || DEFAULT_TEXTS.comoAtravessar}
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
