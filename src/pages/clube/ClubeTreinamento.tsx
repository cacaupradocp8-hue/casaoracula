import { useState } from 'react';
import { BookOpen, Compass, Calendar, Briefcase, Settings, ChevronRight, CheckCircle2 } from 'lucide-react';
import { CALENDARIO_ANUAL } from '@/constants/clubeLivroCalendario';
import { cn } from '@/lib/utils';

interface Modulo {
  id: string;
  titulo: string;
  subtitulo: string;
  icon: React.ElementType;
  conteudo: React.ReactNode;
}

function ModuloComoUsar() {
  return (
    <div className="space-y-8">
      <p className="text-muted-foreground leading-relaxed">
        O Clube do Livro Oracular não é um grupo de leitura comum. É um laboratório de prática simbólica 
        onde cada livro se torna campo de treinamento para o olhar clínico.
      </p>

      <div className="space-y-6">
        <div className="border border-border/40 rounded-lg p-5 space-y-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            Leitura Prática
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Leia sem pressa. Pare quando o corpo pedir. Não busque entendimento — busque escuta. 
            A leitura no Clube é feita com presença, não com performance. Cada ciclo dura um mês 
            e acompanha um livro específico com orientação simbólica.
          </p>
        </div>

        <div className="border border-border/40 rounded-lg p-5 space-y-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Compass className="w-4 h-4 text-primary" />
            Uso do Chat — "Converse com o Livro"
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            O chat não é para tirar dúvidas sobre o livro. É para transformar leitura em prática. 
            Pergunte: "Como isso vira intervenção?", "Que exercício nasce desse trecho?", 
            "Como aplicar esse conteúdo em grupo?". A IA responde com estrutura clínica: 
            síntese, campo simbólico, aplicação e alerta ético.
          </p>
        </div>

        <div className="border border-border/40 rounded-lg p-5 space-y-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" />
            Uso da Forja
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A Forja é onde suas criações são guardadas. Perguntas clínicas, exercícios narrativos 
            e mini-travessias que você cria no chat são salvas na Forja para uso futuro em sessões, 
            grupos e círculos. O que você cria, você sustenta.
          </p>
        </div>
      </div>
    </div>
  );
}

function ModuloPitchEtico() {
  return (
    <div className="space-y-8">
      <p className="text-muted-foreground leading-relaxed">
        A formação na Casa Orácula não é um curso. É uma travessia. Antes de praticar, 
        é preciso compreender a postura que sustenta o trabalho.
      </p>

      <div className="space-y-6">
        <div className="border-l-2 border-primary/40 pl-5 space-y-2">
          <h3 className="font-semibold text-foreground">Postura Ética</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Arquétipo é campo, não rótulo. Nunca diga à cliente "Você é a mulher selvagem". 
            O símbolo é um espelho — não uma identidade. A facilitadora sustenta o campo 
            sem se projetar nele.
          </p>
        </div>

        <div className="border-l-2 border-primary/40 pl-5 space-y-2">
          <h3 className="font-semibold text-foreground">Quando Usar</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Use a leitura simbólica quando a cliente está desconectada do corpo, em excesso 
            de adaptação ou apagamento do desejo. Não use em crise psicótica, luto recente 
            ou ego fragilizado.
          </p>
        </div>

        <div className="border-l-2 border-primary/40 pl-5 space-y-2">
          <h3 className="font-semibold text-foreground">Roteiro de Apresentação</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Ao apresentar o trabalho simbólico para uma potencial cliente ou grupo, evite 
            linguagem mística ou promessas de cura. Apresente como prática de escuta simbólica 
            com base em psicologia profunda, com limites éticos claros e estrutura profissional.
          </p>
        </div>
      </div>
    </div>
  );
}

function ModuloCalendario() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground leading-relaxed">
        O Clube segue um calendário anual com 12 ciclos. Cada ciclo ativa um eixo simbólico 
        diferente, construindo progressivamente a maturidade clínica da facilitadora.
      </p>

      <div className="space-y-3">
        {CALENDARIO_ANUAL.map((ciclo) => (
          <div
            key={ciclo.ordem}
            className="flex items-start gap-4 border border-border/30 rounded-lg p-4 hover:border-border/60 transition-colors"
          >
            <span className="text-xs font-mono text-primary/70 bg-primary/5 rounded px-2 py-1 shrink-0">
              {String(ciclo.ordem).padStart(2, '0')}
            </span>
            <div className="min-w-0">
              <p className="font-medium text-foreground text-sm">{ciclo.titulo}</p>
              <p className="text-xs text-muted-foreground">{ciclo.autor}</p>
              <span className="text-[10px] uppercase tracking-wider text-primary/60 mt-1 inline-block">
                {ciclo.tema}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModuloPratica() {
  return (
    <div className="space-y-8">
      <p className="text-muted-foreground leading-relaxed">
        O Clube não termina na leitura. Cada ciclo deve gerar prática real. 
        Aqui estão os três eixos de aplicação.
      </p>

      <div className="space-y-6">
        <div className="border border-border/40 rounded-lg p-5 space-y-3">
          <h3 className="font-semibold text-foreground">Em Sessão Individual</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary/50" /> Identificar o eixo simbólico ativo na cliente</li>
            <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary/50" /> Usar perguntas clínicas do ciclo atual</li>
            <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary/50" /> Aplicar exercícios narrativos criados na Forja</li>
            <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary/50" /> Observar sem concluir — sustentar o campo</li>
          </ul>
        </div>

        <div className="border border-border/40 rounded-lg p-5 space-y-3">
          <h3 className="font-semibold text-foreground">Em Grupo Terapêutico</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary/50" /> Escolher trechos que ativem dinâmicas coletivas</li>
            <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary/50" /> Facilitar compartilhamento sem interpretação forçada</li>
            <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary/50" /> Usar o roteiro de encontro do Clube como base</li>
          </ul>
        </div>

        <div className="border border-border/40 rounded-lg p-5 space-y-3">
          <h3 className="font-semibold text-foreground">Na Prática Profissional</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary/50" /> Integrar leitura simbólica ao repertório clínico</li>
            <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary/50" /> Criar ofertas baseadas nos ciclos do Clube</li>
            <li className="flex gap-2"><ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary/50" /> Documentar aprendizados para evolução clínica</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function ModuloCasaMaquinas() {
  return (
    <div className="space-y-8">
      <p className="text-muted-foreground leading-relaxed">
        A Casa das Máquinas é o próximo passo. Quando a leitura vira prática consistente, 
        a terapeuta está pronta para o ambiente profissional completo.
      </p>

      <div className="space-y-6">
        <div className="border-l-2 border-primary/40 pl-5 space-y-2">
          <h3 className="font-semibold text-foreground">Leitura de Campo</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Na Casa das Máquinas, cada sessão começa com uma leitura de campo: 
            qual território psíquico está ativo, qual porta está aberta, 
            qual movimento a psique está fazendo.
          </p>
        </div>

        <div className="border-l-2 border-primary/40 pl-5 space-y-2">
          <h3 className="font-semibold text-foreground">Mapa Narrativo</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            O mapa narrativo organiza a história da cliente em eixos simbólicos. 
            Não é diagnóstico — é cartografia da alma.
          </p>
        </div>

        <div className="border-l-2 border-primary/40 pl-5 space-y-2">
          <h3 className="font-semibold text-foreground">Ética Profissional</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A ética na Casa Orácula não é código de conduta — é postura de escuta. 
            Não interpretar além do campo, não projetar a própria história, 
            não romantizar o sofrimento.
          </p>
        </div>

        <div className="border-l-2 border-primary/40 pl-5 space-y-2">
          <h3 className="font-semibold text-foreground">CRM Narrativo</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            O CRM narrativo é a ferramenta de acompanhamento de clientes. 
            Registra sessões, movimentos psíquicos, ferramentas usadas 
            e evolução do campo — tudo com linguagem simbólica.
          </p>
        </div>
      </div>
    </div>
  );
}

const MODULOS: Modulo[] = [
  {
    id: 'como-usar',
    titulo: 'Como Usar o Clube',
    subtitulo: 'Leitura, chat e forja — o fluxo completo',
    icon: BookOpen,
    conteudo: <ModuloComoUsar />,
  },
  {
    id: 'pitch-etico',
    titulo: 'Pitch Ético da Formação',
    subtitulo: 'Postura, limites e apresentação profissional',
    icon: Compass,
    conteudo: <ModuloPitchEtico />,
  },
  {
    id: 'calendario',
    titulo: 'Calendário do Ano',
    subtitulo: '12 ciclos — a progressão da jornada',
    icon: Calendar,
    conteudo: <ModuloCalendario />,
  },
  {
    id: 'pratica',
    titulo: 'Como Isso Vira Prática',
    subtitulo: 'Sessão, grupo e atuação profissional',
    icon: Briefcase,
    conteudo: <ModuloPratica />,
  },
  {
    id: 'casa-maquinas',
    titulo: 'Introdução à Casa das Máquinas',
    subtitulo: 'O próximo passo da formação',
    icon: Settings,
    conteudo: <ModuloCasaMaquinas />,
  },
];

export default function ClubeTreinamento() {
  const [activeModulo, setActiveModulo] = useState(MODULOS[0].id);
  const [visited, setVisited] = useState<Set<string>>(new Set([MODULOS[0].id]));

  const current = MODULOS.find((m) => m.id === activeModulo)!;

  function handleSelect(id: string) {
    setActiveModulo(id);
    setVisited((prev) => new Set(prev).add(id));
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Header editorial */}
        <header className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Formação no Clube
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
            Antes de praticar, forme-se. Este espaço prepara seu olhar clínico, 
            sua postura ética e sua compreensão do sistema.
          </p>
        </header>

        {/* Navegação por módulos */}
        <nav className="flex flex-col gap-1.5">
          {MODULOS.map((m, i) => {
            const Icon = m.icon;
            const isActive = m.id === activeModulo;
            const wasVisited = visited.has(m.id);

            return (
              <button
                key={m.id}
                onClick={() => handleSelect(m.id)}
                className={cn(
                  'flex items-center gap-3 text-left px-4 py-3 rounded-lg border transition-all',
                  isActive
                    ? 'bg-primary/5 border-primary/30 text-foreground'
                    : 'border-transparent hover:bg-muted/40 text-muted-foreground hover:text-foreground'
                )}
              >
                <span className="shrink-0">
                  {wasVisited && !isActive ? (
                    <CheckCircle2 className="w-4 h-4 text-primary/50" />
                  ) : (
                    <Icon className={cn('w-4 h-4', isActive ? 'text-primary' : '')} />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{m.titulo}</p>
                  <p className="text-xs text-muted-foreground truncate">{m.subtitulo}</p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Progresso simples */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{visited.size} de {MODULOS.length} módulos visitados</span>
          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary/40 rounded-full transition-all"
              style={{ width: `${(visited.size / MODULOS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Conteúdo do módulo ativo */}
        <article className="pb-16">
          <h2 className="text-lg font-semibold text-foreground mb-1">{current.titulo}</h2>
          <p className="text-xs text-muted-foreground mb-6">{current.subtitulo}</p>
          {current.conteudo}
        </article>
      </div>
    </div>
  );
}
