import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Compass, Shield, BookOpen, Brain, Flame, Eye, Heart, Layers, MessageSquare, Map as MapIcon, Sparkles, DoorOpen
} from 'lucide-react';

const HIDDEN_TOOLS = new Set([
  'Escrita Simbólica',
  'Espelho Relacional',
  'Ritual Simbólico',
  'Diálogo de Partes',
  'Mapa de Transformação',
  'Ritual de Passagem',
]);

const FERRAMENTAS = [
  { nome: 'Cartografia Psíquica', categoria: 'Leitura de Campo', icon: Compass, desc: 'Mapeamento inicial da psique. Identifica Torres, Portas e campo dominante.', distrito: 'Portão da Chegada' },
  { nome: 'Torre Viva', categoria: 'Leitura de Campo', icon: Shield, desc: 'Explora as Torres de proteção psíquica e seus mecanismos de defesa.', distrito: 'Torres' },
  { nome: 'Labirinto das 39 Portas', categoria: 'Leitura de Campo', icon: DoorOpen, desc: 'Navegação pelas portas simbólicas que revelam padrões inconscientes.', distrito: 'Portas' },
  { nome: 'Atlas de Arquétipos', categoria: 'Narrativa', icon: Brain, desc: 'Identificação dos arquétipos ativos e em sombra na jornada da cliente.', distrito: 'Jardim dos Arquétipos' },
  { nome: 'Escrita Simbólica', categoria: 'Narrativa', icon: BookOpen, desc: 'Protocolo de escrita para acessar camadas profundas do mito pessoal.', distrito: 'Praça do Abalo' },
  { nome: 'Decodificação Onírica', categoria: 'Narrativa', icon: Eye, desc: 'Leitura simbólica de sonhos como mensagens do inconsciente.', distrito: 'Casa dos Sonhos' },
  { nome: 'Espelho Relacional', categoria: 'Condução', icon: Heart, desc: 'Ferramenta para revisão de vínculos e padrões relacionais.', distrito: 'Espelho dos Vínculos' },
  { nome: 'Ritual Simbólico', categoria: 'Condução', icon: Flame, desc: 'Criação de rituais de transformação e integração.', distrito: 'Forja' },
  { nome: 'Diálogo de Partes', categoria: 'Condução', icon: MessageSquare, desc: 'Facilitação do diálogo entre partes internas em conflito.', distrito: 'Conselho Interior' },
  { nome: 'Portas Avançadas', categoria: 'Sustentação', icon: Layers, desc: 'Navegação por ciclos e padrões repetitivos profundos.', distrito: 'Labirinto' },
  { nome: 'Mapa de Transformação', categoria: 'Sustentação', icon: MapIcon, desc: 'Revisão da jornada e consolidação de aprendizados.', distrito: 'Praça da Integração' },
  { nome: 'Ritual de Passagem', categoria: 'Sustentação', icon: Sparkles, desc: 'Encerramento simbólico de ciclo e abertura para nova etapa.', distrito: 'Portal de Renascimento' },
];

const CATEGORIAS_CORES: Record<string, string> = {
  'Leitura de Campo': 'bg-blue-500/20 text-blue-400',
  'Narrativa': 'bg-amber-500/20 text-amber-400',
  'Condução': 'bg-emerald-500/20 text-emerald-400',
  'Sustentação': 'bg-purple-500/20 text-purple-400',
};

export function BibliotecaFerramentas() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[#F5F1E8]/50">
        Referência completa das ferramentas do Método Orácula organizadas por categoria e distrito.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {FERRAMENTAS.filter(f => !HIDDEN_TOOLS.has(f.nome)).map(f => (
          <Card key={f.nome} className="bg-[#0F2438] border-[#C9A24A]/10 hover:border-[#C9A24A]/30 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <f.icon className="w-5 h-5 text-[#C9A24A]" />
                  <CardTitle className="text-base text-[#F5F1E8]">{f.nome}</CardTitle>
                </div>
                <Badge className={`text-xs shrink-0 ${CATEGORIAS_CORES[f.categoria] || ''}`}>{f.categoria}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <p className="text-sm text-[#F5F1E8]/60">{f.desc}</p>
              <p className="text-xs text-[#C9A24A]/60">Distrito: {f.distrito}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
