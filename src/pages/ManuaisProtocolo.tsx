// ============================================
// CLINICAL MANUALS - ORACULAR PROTOCOL
// Professional therapeutic documentation
// ============================================

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, Map, Sparkles, Route, ChevronDown, ChevronUp, Book } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// ============================================
// MANUAL CONTENT DATA
// ============================================

interface ManualSection {
  title: string;
  content: string | string[];
  type?: 'text' | 'list' | 'warning' | 'example';
}

interface Manual {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  clinicalFunction: string;
  sections: ManualSection[];
}

const MANUALS: Manual[] = [
  {
    id: 'mapa',
    title: 'O Mapa dos Cinco Territórios da Psique Feminina',
    subtitle: 'Manual Clínico — Ferramenta de Localização Psíquica',
    icon: <Map className="w-6 h-6 text-gold" />,
    clinicalFunction: 'Localização psíquica: identificar onde a energia psíquica está concentrada no momento presente.',
    sections: [
      {
        title: 'Propósito da Ferramenta',
        type: 'text',
        content: 'O Mapa dos Cinco Territórios é uma ferramenta de localização psíquica que permite à profissional identificar onde a energia da cliente está concentrada no momento presente. Não é um teste de personalidade, mas sim uma bússola simbólica que orienta o trabalho terapêutico inicial.\n\nCada território representa um campo de experiência onde a psique pode estar mais presente, não como diagnóstico fixo, mas como ponto de partida para a escuta.'
      },
      {
        title: 'Quando Utilizar',
        type: 'list',
        content: [
          'Início de um processo terapêutico ou mentoria',
          'Momentos de confusão, estagnação ou crise',
          'Quando a cliente não consegue nomear o que sente',
          'Para estabelecer linguagem comum entre profissional e cliente',
          'Antes de iniciar intervenções mais profundas'
        ]
      },
      {
        title: 'Problema que Endereça',
        type: 'text',
        content: 'Frequentemente, a cliente chega à sessão com uma sensação difusa de mal-estar, sem conseguir localizar a origem ou natureza do que sente. O Mapa oferece um vocabulário simbólico que nomeia sem patologizar, localizando a experiência em um campo reconhecível.\n\nA ferramenta resolve o problema da "confusão inicial" que pode paralisar tanto a cliente quanto a profissional.'
      },
      {
        title: 'Como Introduzir à Cliente',
        type: 'example',
        content: '"Vamos começar identificando onde sua energia está mais concentrada agora. Isso não é um teste que define quem você é — é uma forma de localizar onde estamos, como quando olhamos um mapa antes de iniciar uma viagem. O território que aparece hoje pode ser diferente de outro momento, e isso é esperado."'
      },
      {
        title: 'Aplicação Passo a Passo',
        type: 'list',
        content: [
          '1. Preparação: Reserve 15-20 minutos em ambiente tranquilo. Explique que não há respostas certas.',
          '2. Aplicação: Conduza o questionário simbólico. Observe reações emocionais durante o processo.',
          '3. Leitura: Identifique o território predominante. Não revele imediatamente — faça perguntas abertas primeiro.',
          '4. Diálogo: Apresente a narrativa do território usando linguagem simbólica. Pergunte: "Isso ressoa com você?"',
          '5. Validação: Permita que a cliente corrija, adicione ou conteste. O mapa é ferramenta, não sentença.',
          '6. Registro: Anote o território identificado, observações e nuances para continuidade do processo.'
        ]
      },
      {
        title: 'Campos de Observação por Território',
        type: 'text',
        content: 'Para cada território identificado, observe e registre:\n\n• Padrão Emocional: Qual emoção se repete com mais frequência?\n• Conflito Recorrente: Qual embate interno ou externo aparece constantemente?\n• Repetição Comportamental: Que comportamento a cliente reconhece como cíclico?\n• Risco Clínico: Que cuidados éticos este território exige?\n• Potencial Inexplorado: Que força está latente neste campo?'
      },
      {
        title: 'Erros Comuns a Evitar',
        type: 'warning',
        content: [
          'Tratar o território como diagnóstico fixo ou rótulo permanente',
          'Usar pontuações numéricas como "verdade" sobre a cliente',
          'Pular a fase de diálogo e validação com a cliente',
          'Ignorar territórios secundários que podem conter informações importantes',
          'Aplicar em estado de crise aguda sem suporte adequado',
          'Usar a ferramenta para confirmar hipóteses prévias da profissional'
        ]
      },
      {
        title: 'Limites Éticos',
        type: 'warning',
        content: [
          'Esta ferramenta não substitui avaliação psicológica ou psiquiátrica',
          'Não utilize para tomar decisões clínicas unilaterais',
          'O resultado não define capacidade, potencial ou prognóstico da cliente',
          'Não compartilhe resultados com terceiros sem consentimento',
          'Em caso de indicadores de risco, encaminhe para profissional especializado'
        ]
      },
      {
        title: 'Integração Pós-Sessão',
        type: 'list',
        content: [
          'Registre o território predominante no prontuário da cliente',
          'Defina com a cliente uma "palavra-âncora" para referenciar este território',
          'Planeje próximas sessões considerando o campo identificado',
          'Revisit o mapa após 4-6 sessões para observar movimentos',
          'Use o território como base para escolha de outras ferramentas do protocolo'
        ]
      }
    ]
  },
  {
    id: 'oraculo',
    title: 'O Oráculo dos Nove Arquétipos do Feminino Profundo',
    subtitle: 'Manual Clínico — Ferramenta de Interpretação Simbólica',
    icon: <Sparkles className="w-6 h-6 text-gold" />,
    clinicalFunction: 'Interpretação simbólica de padrões: traduzir sintomas e repetições em dinâmicas arquetípicas.',
    sections: [
      {
        title: 'Propósito da Ferramenta',
        type: 'text',
        content: 'O Oráculo dos Nove Arquétipos é uma ferramenta de interpretação simbólica que traduz padrões comportamentais, relacionais e emocionais em dinâmicas arquetípicas compreensíveis. Não tipifica a cliente — ilumina as forças que operam em sua psique.\n\nCada arquétipo representa uma configuração de energia psíquica com dons, feridas, sombras e caminhos de integração específicos. A ferramenta facilita o insight emocional sem exigir sobre-racionalização.'
      },
      {
        title: 'Quando Utilizar',
        type: 'list',
        content: [
          'Após a localização psíquica (Mapa dos Territórios)',
          'Quando padrões relacionais se repetem sem clareza',
          'Para trabalho de sombra e integração',
          'Quando a cliente intelectualiza demais e sente pouco',
          'Para reframe simbólico de narrativas cristalizadas',
          'Em momentos de transição de vida (separações, mudanças, perdas)'
        ]
      },
      {
        title: 'Problema que Endereça',
        type: 'text',
        content: 'A cliente frequentemente narra sintomas e conflitos sem perceber o padrão subjacente. Diz "isso sempre acontece comigo" sem conseguir nomear "isso". O Oráculo oferece uma linguagem mítica que conecta experiências aparentemente dispersas em uma narrativa coerente.\n\nA ferramenta resolve o problema da fragmentação narrativa, onde a cliente não consegue ver o fio que conecta suas experiências.'
      },
      {
        title: 'Como Introduzir à Cliente',
        type: 'example',
        content: '"Os arquétipos são padrões de energia que todas nós carregamos. Não é sobre descobrir \'quem você é\' como se fosse fixo, mas sobre entender que forças estão mais ativas agora e como elas influenciam suas escolhas. Vamos olhar juntas para essas forças — uma predominante, uma na sombra — e ver o que elas contam sobre o momento que você vive."'
      },
      {
        title: 'Aplicação Passo a Passo',
        type: 'list',
        content: [
          '1. Contextualização: Explique que arquétipos são padrões, não personalidades. Todas carregamos todos.',
          '2. Identificação: Aplique o instrumento para identificar o arquétipo predominante.',
          '3. Sombra: Identifique o arquétipo-sombra — aquele que sabota ou que foi exilado.',
          '4. Arquétipo Exilado (opcional): Explore se há um arquétipo que a cliente rejeita ou desconhece.',
          '5. Leitura Narrativa: Apresente a narrativa simbólica. Use imagens, metáforas, histórias.',
          '6. Diálogo Reflexivo: Faça perguntas abertas: "Onde você reconhece essa força na sua vida?"',
          '7. Reenquadramento: Ofereça prompts de reenquadramento quando houver cristalização negativa.',
          '8. Registro: Anote configuração arquetípica, reações e insights para continuidade.'
        ]
      },
      {
        title: 'Estrutura da Leitura Arquetípica',
        type: 'text',
        content: 'Para cada arquétipo identificado, explore:\n\n• Essência Simbólica: Qual é a energia central deste arquétipo?\n• Dom Central: Que força única este arquétipo oferece?\n• Ferida Central: Qual vulnerabilidade está associada?\n• Expressão-Sombra: Como este arquétipo se manifesta quando ferido?\n• Dinâmica Relacional: Como este padrão afeta vínculos?\n• Caminho de Expansão: Como integrar e transcender os limites?\n• Trabalho de Sombra: Que perguntas ajudam a iluminar o escuro?\n• Espelhos Simbólicos: Que imagens, mitos ou histórias ilustram este padrão?'
      },
      {
        title: 'Erros Comuns a Evitar',
        type: 'warning',
        content: [
          'Tipificar a cliente como "sendo" um arquétipo fixo',
          'Ignorar o arquétipo-sombra por ser desconfortável',
          'Usar linguagem julgadora ou patologizante',
          'Apresentar a sombra como "defeito" ao invés de energia não integrada',
          'Fazer leituras preditivas ("você sempre vai...")',
          'Impor interpretações sem validação da cliente',
          'Usar arquétipos para justificar comportamentos prejudiciais'
        ]
      },
      {
        title: 'Limites Éticos',
        type: 'warning',
        content: [
          'Arquétipos não são diagnósticos — são mapas simbólicos',
          'Nunca use para prever comportamento ou destino',
          'Não utilize para justificar padrões destrutivos',
          'Respeite resistências — elas contêm informação',
          'O arquétipo não define identidade ou valor da pessoa',
          'Transtornos mentais requerem encaminhamento especializado'
        ]
      },
      {
        title: 'Integração Pós-Sessão',
        type: 'list',
        content: [
          'Registre configuração arquetípica no prontuário (predominante + sombra)',
          'Ofereça reflexão escrita: "Onde você vê esse arquétipo agindo na sua semana?"',
          'Planeje práticas simbólicas específicas para o arquétipo identificado',
          'Nas sessões seguintes, use a linguagem arquetípica como referência',
          'Observe mudanças na constelação arquetípica ao longo do processo',
          'Conecte descobertas com a próxima ferramenta: O Caminho'
        ]
      }
    ]
  },
  {
    id: 'caminho',
    title: 'O Caminho da Mulher que se Torna Inteira',
    subtitle: 'Manual Clínico — Ferramenta de Integração e Individuação',
    icon: <Route className="w-6 h-6 text-gold" />,
    clinicalFunction: 'Integração e individuação: sustentar processos longos de transformação com estrutura e ética.',
    sections: [
      {
        title: 'Propósito da Ferramenta',
        type: 'text',
        content: 'O Caminho é uma ferramenta de processo que mapeia a jornada de individuação em 7 fases arquetípicas. Diferente das ferramentas anteriores que "fotografam" o momento, esta "filma" o processo — oferecendo linguagem para o que está sendo atravessado.\n\nNão analisa, diagnostica ou prevê — sustenta. É a ferramenta que permite à profissional e à cliente compreenderem que toda travessia tem etapas, e que recaídas são parte do caminho, não sinais de fracasso.'
      },
      {
        title: 'Quando Utilizar',
        type: 'list',
        content: [
          'Processos terapêuticos de médio/longo prazo (6+ meses)',
          'Quando a cliente sente que "não está progredindo"',
          'Para normalizar movimentos aparentemente regressivos',
          'Durante transições de vida significativas',
          'Para prevenir dependência terapêutica',
          'Como estrutura para supervisão clínica',
          'Para encerramento ético e consciente de processos'
        ]
      },
      {
        title: 'Problema que Endereça',
        type: 'text',
        content: 'Processos longos frequentemente geram sensação de estagnação, dependência ou desesperança. A cliente (e às vezes a profissional) pode perder de vista o movimento que está acontecendo.\n\nO Caminho resolve o problema da "terapia sem fim", oferecendo marcadores de fase que orientam sem apressar, e sinais de integração que indicam quando uma etapa foi genuinamente atravessada.'
      },
      {
        title: 'Como Introduzir à Cliente',
        type: 'example',
        content: '"A transformação não acontece em linha reta — ela segue um padrão de espiral. Às vezes você vai sentir que voltou ao mesmo lugar, mas estará em outro nível. Vamos mapear onde você está nessa espiral agora, não para apressar o processo, mas para que você saiba que cada fase tem seu propósito — inclusive as mais difíceis."'
      },
      {
        title: 'As 7 Fases do Caminho',
        type: 'text',
        content: 'Fase 1 — A Chamada: Algo rompe a vida ordinária. Sintoma, crise, perda.\nFase 2 — A Recusa: Resistência ao chamado. Negação, minimização, racionalização.\nFase 3 — O Limiar: Decisão de atravessar. Início do processo consciente.\nFase 4 — O Ventre: Imersão no desconhecido. Desconstrução de identidades antigas.\nFase 5 — O Encontro: Confronto com a sombra. Integração de partes negadas.\nFase 6 — A Morte: Luto pelo que não pode retornar. Aceitação do irrevogável.\nFase 7 — O Retorno: Integração. A mulher que retorna não é a que partiu.'
      },
      {
        title: 'Aplicação Passo a Passo',
        type: 'list',
        content: [
          '1. Mapeamento Inicial: Identifique em qual fase a cliente se encontra. Use a narrativa do processo.',
          '2. Normalização: Explique as características da fase atual. Valide dificuldades específicas.',
          '3. Foco Terapêutico: Defina o foco do trabalho para esta fase (veja campos por fase).',
          '4. Risco Específico: Identifique armadilhas comuns desta fase. Trabalhe preventivamente.',
          '5. Tarefa Simbólica: Ofereça prática simbólica apropriada para a fase.',
          '6. Sinais de Integração: Defina com a cliente o que indicará que esta fase foi atravessada.',
          '7. Revisão: A cada 4-6 sessões, revise o mapeamento. Observe movimentos.'
        ]
      },
      {
        title: 'Campos de Observação por Fase',
        type: 'text',
        content: 'Para cada fase, registre e acompanhe:\n\n• Foco Terapêutico: Qual é a tarefa central desta etapa?\n• Risco Específico: O que pode travar ou desviar nesta fase?\n• Tarefa Simbólica: Que prática ou ritual apoia a travessia?\n• Sinal de Integração: Como saberemos que esta fase foi atravessada?\n\nNão apresse as fases. Algumas levam semanas, outras, anos. O tempo é da cliente, não do método.'
      },
      {
        title: 'Erros Comuns a Evitar',
        type: 'warning',
        content: [
          'Apressar fases para "mostrar progresso"',
          'Ignorar movimentos regressivos (eles são informação)',
          'Tratar fases como escada linear — é uma espiral',
          'Usar a ferramenta para julgar "atraso" da cliente',
          'Prometer timeline específico de transformação',
          'Confundir "fase difícil" com "regressão patológica"',
          'Criar dependência usando o mapa como muleta eterna'
        ]
      },
      {
        title: 'Limites Éticos',
        type: 'warning',
        content: [
          'O Caminho não substitui tratamento psiquiátrico quando necessário',
          'Movimentos suicidas ou de autolesão requerem intervenção especializada imediata',
          'Esta ferramenta não prevê evolução — mapeia processo',
          'Nunca use para comparar clientes ou criar competição',
          'A profissional também está em seu próprio caminho — supervisione-se',
          'Encerramento de processo é parte do caminho, não abandono'
        ]
      },
      {
        title: 'Integração Pós-Sessão',
        type: 'list',
        content: [
          'Registre fase atual e observações no prontuário',
          'Atualize tarefa simbólica ativa e acompanhe nas sessões seguintes',
          'Celebre passagens de fase — são marcos importantes',
          'Use linguagem do Caminho para contextualizar dificuldades',
          'Planeje encerramento ético quando a cliente atingir integração sustentada',
          'Ofereça sessões de manutenção espaçadas após o término formal'
        ]
      },
      {
        title: 'Conexão com o Protocolo Completo',
        type: 'text',
        content: 'O Caminho funciona melhor quando precedido pelo Mapa (localização) e pelo Oráculo (interpretação). Juntas, as três ferramentas formam o Protocolo Oracular Clínico:\n\nMAPA → Localiza onde a energia está concentrada\nORÁCULO → Interpreta padrões e forças ativas\nCAMINHO → Sustenta o processo de transformação\n\nA cliente pode entrar em qualquer ponto, mas a sequência completa oferece a estrutura mais robusta para processos terapêuticos sérios.'
      }
    ]
  }
];

// ============================================
// DISCLAIMER COMPONENT
// ============================================

function ClinicalDisclaimer() {
  return (
    <Card className="border-amber-500/30 bg-amber-500/5">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="text-amber-500 text-xl">⚠️</div>
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium text-amber-200">Aviso Clínico e Ético</p>
            <p>
              Este material é um instrumento simbólico e reflexivo destinado a profissionais 
              de saúde mental, terapeutas e facilitadoras de processos de desenvolvimento humano.
            </p>
            <p>
              <strong>Não constitui diagnóstico, prognóstico ou avaliação clínica.</strong> Não 
              substitui formação profissional, supervisão clínica ou tratamento especializado.
            </p>
            <p>
              As ferramentas descritas não têm caráter preditivo e não devem ser usadas para 
              tomar decisões unilaterais sobre o processo da cliente.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// MANUAL SECTION COMPONENT
// ============================================

interface ManualSectionCardProps {
  section: ManualSection;
}

function ManualSectionCard({ section }: ManualSectionCardProps) {
  const [isOpen, setIsOpen] = useState(true);

  const renderContent = () => {
    if (section.type === 'list' && Array.isArray(section.content)) {
      return (
        <ul className="space-y-2">
          {section.content.map((item, idx) => (
            <li key={idx} className="flex gap-2 text-muted-foreground">
              <span className="text-gold mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    if (section.type === 'warning' && Array.isArray(section.content)) {
      return (
        <div className="space-y-2 bg-destructive/10 p-4 rounded-lg border border-destructive/20">
          {section.content.map((item, idx) => (
            <div key={idx} className="flex gap-2 text-sm">
              <span className="text-destructive">✕</span>
              <span className="text-muted-foreground">{item}</span>
            </div>
          ))}
        </div>
      );
    }

    if (section.type === 'example') {
      return (
        <div className="bg-gold/5 p-4 rounded-lg border border-gold/20 italic text-muted-foreground">
          {section.content as string}
        </div>
      );
    }

    return (
      <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
        {section.content as string}
      </p>
    );
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between cursor-pointer group py-2">
          <h3 className="font-semibold text-foreground group-hover:text-gold transition-colors">
            {section.title}
          </h3>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 pb-4">
        {renderContent()}
      </CollapsibleContent>
    </Collapsible>
  );
}

// ============================================
// MANUAL CARD COMPONENT
// ============================================

interface ManualCardProps {
  manual: Manual;
}

function ManualCard({ manual }: ManualCardProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = generatePrintHTML(manual);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const handleDownload = () => {
    const printContent = generatePrintHTML(manual);
    const blob = new Blob([printContent], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `manual-${manual.id}-casa-oracula.html`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success('Manual baixado com sucesso');
  };

  return (
    <div ref={printRef}>
      <Card className="border-gold/20">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {manual.icon}
              <div>
                <CardTitle className="text-lg font-display text-gold">
                  {manual.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{manual.subtitle}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Baixar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-gold/5 rounded-lg border border-gold/20">
            <p className="text-sm">
              <span className="font-medium text-gold">Função Clínica:</span>{' '}
              <span className="text-muted-foreground">{manual.clinicalFunction}</span>
            </p>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            {manual.sections.map((section, idx) => (
              <div key={idx}>
                <ManualSectionCard section={section} />
                {idx < manual.sections.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// PRINT HTML GENERATOR
// ============================================

function generatePrintHTML(manual: Manual): string {
  const sectionsHTML = manual.sections.map(section => {
    let contentHTML = '';
    
    if (section.type === 'list' && Array.isArray(section.content)) {
      contentHTML = `<ul>${section.content.map(item => `<li>${item}</li>`).join('')}</ul>`;
    } else if (section.type === 'warning' && Array.isArray(section.content)) {
      contentHTML = `<div class="warning">${section.content.map(item => `<div class="warning-item">✕ ${item}</div>`).join('')}</div>`;
    } else if (section.type === 'example') {
      contentHTML = `<blockquote>${section.content}</blockquote>`;
    } else {
      contentHTML = `<p>${(section.content as string).replace(/\n/g, '<br>')}</p>`;
    }
    
    return `<div class="section"><h2>${section.title}</h2>${contentHTML}</div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>${manual.title} - Manual Clínico | Casa Orácula</title>
  <style>
    * { box-sizing: border-box; }
    body { 
      font-family: Georgia, 'Times New Roman', serif; 
      max-width: 800px; 
      margin: 40px auto; 
      padding: 40px; 
      color: #333; 
      line-height: 1.7;
    }
    h1 { 
      color: #8B6914; 
      border-bottom: 2px solid #8B6914; 
      padding-bottom: 15px; 
      font-size: 1.8em;
      margin-bottom: 5px;
    }
    .subtitle { 
      color: #666; 
      font-size: 1em; 
      font-style: italic;
      margin-bottom: 30px;
    }
    .clinical-function {
      background: #f9f6ee;
      padding: 15px 20px;
      border-left: 4px solid #8B6914;
      margin-bottom: 30px;
      font-size: 0.95em;
    }
    .clinical-function strong { color: #8B6914; }
    h2 { 
      color: #5C4A0E; 
      margin-top: 30px; 
      margin-bottom: 15px;
      font-size: 1.2em;
      border-bottom: 1px solid #ddd;
      padding-bottom: 8px;
    }
    p { margin-bottom: 15px; }
    ul { 
      padding-left: 25px; 
      margin-bottom: 15px;
    }
    li { 
      margin-bottom: 8px; 
    }
    blockquote { 
      background: #f9f6ee; 
      padding: 20px; 
      border-left: 4px solid #8B6914; 
      margin: 20px 0;
      font-style: italic;
      color: #555;
    }
    .warning { 
      background: #fff5f5; 
      padding: 20px; 
      border-radius: 5px; 
      border: 1px solid #feb2b2;
      margin: 20px 0;
    }
    .warning-item { 
      margin-bottom: 8px; 
      color: #c53030;
    }
    .section { 
      margin-bottom: 25px;
      page-break-inside: avoid;
    }
    .disclaimer { 
      background: #fffbeb; 
      padding: 20px; 
      border-radius: 5px; 
      margin-top: 40px; 
      border: 1px solid #f6e05e;
      font-size: 0.85em;
    }
    .disclaimer strong { color: #d69e2e; }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      color: #888;
      font-size: 0.8em;
    }
    @media print { 
      body { 
        margin: 20px; 
        padding: 20px;
      }
      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <h1>${manual.title}</h1>
  <p class="subtitle">${manual.subtitle}</p>
  
  <div class="clinical-function">
    <strong>Função Clínica:</strong> ${manual.clinicalFunction}
  </div>
  
  ${sectionsHTML}
  
  <div class="disclaimer">
    <strong>⚠️ Aviso Clínico e Ético:</strong> Este material é um instrumento simbólico e reflexivo 
    destinado a profissionais. Não constitui diagnóstico, prognóstico ou avaliação clínica. 
    Não substitui formação profissional, supervisão clínica ou tratamento especializado. 
    As ferramentas descritas não têm caráter preditivo.
  </div>
  
  <div class="footer">
    <p>Protocolo Oracular Clínico — Casa Orácula</p>
    <p>Material de uso exclusivo para profissionais formadas no método</p>
  </div>
</body>
</html>`;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ManuaisProtocolo() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('mapa');

  const handlePrintAll = () => {
    let allContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Manuais Clínicos - Protocolo Oracular | Casa Orácula</title>
  <style>
    * { box-sizing: border-box; }
    body { 
      font-family: Georgia, 'Times New Roman', serif; 
      max-width: 800px; 
      margin: 40px auto; 
      padding: 40px; 
      color: #333; 
      line-height: 1.7;
    }
    h1 { 
      color: #8B6914; 
      border-bottom: 2px solid #8B6914; 
      padding-bottom: 15px; 
      font-size: 1.8em;
      margin-bottom: 5px;
    }
    .subtitle { 
      color: #666; 
      font-size: 1em; 
      font-style: italic;
      margin-bottom: 30px;
    }
    .clinical-function {
      background: #f9f6ee;
      padding: 15px 20px;
      border-left: 4px solid #8B6914;
      margin-bottom: 30px;
      font-size: 0.95em;
    }
    .clinical-function strong { color: #8B6914; }
    h2 { 
      color: #5C4A0E; 
      margin-top: 30px; 
      margin-bottom: 15px;
      font-size: 1.2em;
      border-bottom: 1px solid #ddd;
      padding-bottom: 8px;
    }
    p { margin-bottom: 15px; }
    ul { 
      padding-left: 25px; 
      margin-bottom: 15px;
    }
    li { 
      margin-bottom: 8px; 
    }
    blockquote { 
      background: #f9f6ee; 
      padding: 20px; 
      border-left: 4px solid #8B6914; 
      margin: 20px 0;
      font-style: italic;
      color: #555;
    }
    .warning { 
      background: #fff5f5; 
      padding: 20px; 
      border-radius: 5px; 
      border: 1px solid #feb2b2;
      margin: 20px 0;
    }
    .warning-item { 
      margin-bottom: 8px; 
      color: #c53030;
    }
    .section { 
      margin-bottom: 25px;
      page-break-inside: avoid;
    }
    .disclaimer { 
      background: #fffbeb; 
      padding: 20px; 
      border-radius: 5px; 
      margin-top: 40px; 
      border: 1px solid #f6e05e;
      font-size: 0.85em;
    }
    .disclaimer strong { color: #d69e2e; }
    .manual-break {
      page-break-before: always;
      margin-top: 60px;
      padding-top: 40px;
      border-top: 3px solid #8B6914;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      color: #888;
      font-size: 0.8em;
    }
    .cover {
      text-align: center;
      padding: 100px 40px;
      page-break-after: always;
    }
    .cover h1 {
      font-size: 2.5em;
      border: none;
      margin-bottom: 20px;
    }
    .cover p {
      font-size: 1.2em;
      color: #666;
    }
    @media print { 
      body { 
        margin: 20px; 
        padding: 20px;
      }
      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="cover">
    <h1>Manuais Clínicos</h1>
    <p>Protocolo Oracular do Feminino Profundo</p>
    <p style="margin-top: 40px; font-size: 0.9em;">Casa Orácula</p>
  </div>
`;

    MANUALS.forEach((manual, index) => {
      const sectionsHTML = manual.sections.map(section => {
        let contentHTML = '';
        
        if (section.type === 'list' && Array.isArray(section.content)) {
          contentHTML = `<ul>${section.content.map(item => `<li>${item}</li>`).join('')}</ul>`;
        } else if (section.type === 'warning' && Array.isArray(section.content)) {
          contentHTML = `<div class="warning">${section.content.map(item => `<div class="warning-item">✕ ${item}</div>`).join('')}</div>`;
        } else if (section.type === 'example') {
          contentHTML = `<blockquote>${section.content}</blockquote>`;
        } else {
          contentHTML = `<p>${(section.content as string).replace(/\n/g, '<br>')}</p>`;
        }
        
        return `<div class="section"><h2>${section.title}</h2>${contentHTML}</div>`;
      }).join('');

      allContent += `
  <div class="${index > 0 ? 'manual-break' : ''}">
    <h1>${manual.title}</h1>
    <p class="subtitle">${manual.subtitle}</p>
    
    <div class="clinical-function">
      <strong>Função Clínica:</strong> ${manual.clinicalFunction}
    </div>
    
    ${sectionsHTML}
  </div>
`;
    });

    allContent += `
  <div class="disclaimer">
    <strong>⚠️ Aviso Clínico e Ético:</strong> Este material é um instrumento simbólico e reflexivo 
    destinado a profissionais. Não constitui diagnóstico, prognóstico ou avaliação clínica. 
    Não substitui formação profissional, supervisão clínica ou tratamento especializado. 
    As ferramentas descritas não têm caráter preditivo.
  </div>
  
  <div class="footer">
    <p>Protocolo Oracular Clínico — Casa Orácula</p>
    <p>Material de uso exclusivo para profissionais formadas no método</p>
  </div>
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(allContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 pb-20 max-w-4xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <Book className="w-6 h-6 text-gold" />
                <h1 className="text-2xl font-display text-foreground">Manuais Clínicos</h1>
              </div>
              <p className="text-muted-foreground mt-1">
                Protocolo Oracular do Feminino Profundo
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handlePrintAll}>
            <Printer className="w-4 h-4 mr-2" />
            Imprimir Todos
          </Button>
        </div>

        {/* Disclaimer */}
        <ClinicalDisclaimer />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mapa" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Mapa</span>
            </TabsTrigger>
            <TabsTrigger value="oraculo" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Oráculo</span>
            </TabsTrigger>
            <TabsTrigger value="caminho" className="flex items-center gap-2">
              <Route className="w-4 h-4" />
              <span className="hidden sm:inline">Caminho</span>
            </TabsTrigger>
          </TabsList>

          {MANUALS.map(manual => (
            <TabsContent key={manual.id} value={manual.id} className="mt-6">
              <ManualCard manual={manual} />
            </TabsContent>
          ))}
        </Tabs>

        {/* Protocol Overview */}
        <Card className="mt-8 border-gold/20 bg-gold/5">
          <CardContent className="p-6">
            <h3 className="font-display text-gold mb-4">Fluxo do Protocolo Oracular</h3>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Badge variant="outline" className="text-base py-2 px-4">
                <Map className="w-4 h-4 mr-2" />
                MAPA
              </Badge>
              <span className="text-gold">→</span>
              <Badge variant="outline" className="text-base py-2 px-4">
                <Sparkles className="w-4 h-4 mr-2" />
                ORÁCULO
              </Badge>
              <span className="text-gold">→</span>
              <Badge variant="outline" className="text-base py-2 px-4">
                <Route className="w-4 h-4 mr-2" />
                CAMINHO
              </Badge>
            </div>
            <p className="text-center text-muted-foreground mt-4 text-sm">
              Localização → Interpretação → Integração
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
