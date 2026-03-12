
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type EstagioJornada = 'visitante' | 'exploradora' | 'estudante' | 'cartografa' | 'tecela';

interface EstagioInfo {
  key: EstagioJornada;
  label: string;
  index: number;
}

export const ESTAGIOS: EstagioInfo[] = [
  { key: 'visitante', label: 'Visitante', index: 0 },
  { key: 'exploradora', label: 'Exploradora', index: 1 },
  { key: 'estudante', label: 'Estudante', index: 2 },
  { key: 'cartografa', label: 'Cartógrafa', index: 3 },
  { key: 'tecela', label: 'Tecelã', index: 4 },
];

// Events required per stage transition
const EVENTOS_VISITANTE = ['video_boas_vindas', 'ver_mapa_casa', 'quiz_voz'];
const EVENTOS_EXPLORADORA = ['tirar_carta', 'reflexao_jardim', 'explorar_oraculos'];
const EVENTOS_ESTUDANTE = ['entrar_clube_livro', 'iniciar_curso', 'sala_treinamento'];
const EVENTOS_CARTOGRAFA = ['cartografia_psiquica', 'labirinto_portas', 'narroterapia'];

function calcularEstagio(eventos: string[], hasClientes: boolean): EstagioJornada {
  const has = (list: string[]) => list.every(e => eventos.includes(e));

  if (has(EVENTOS_CARTOGRAFA) || hasClientes) return 'tecela';
  if (has(EVENTOS_ESTUDANTE)) return 'cartografa';
  if (has(EVENTOS_EXPLORADORA)) return 'estudante';
  if (has(EVENTOS_VISITANTE)) return 'exploradora';
  return 'visitante';
}

function calcularProgresso(eventos: string[], hasClientes: boolean): number {
  // Count completed milestones across all stages
  const all = [...EVENTOS_VISITANTE, ...EVENTOS_EXPLORADORA, ...EVENTOS_ESTUDANTE, ...EVENTOS_CARTOGRAFA];
  const totalMilestones = all.length + 1; // +1 for clients (tecelã)
  let completed = all.filter(e => eventos.includes(e)).length;
  if (hasClientes) completed += 1;
  return Math.round((completed / totalMilestones) * 100);
}

export function useJornadaHabitante() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['jornada-habitante', user?.id],
    queryFn: async () => {
      if (!user) return { eventos: [] as string[], hasClientes: false };

      // Fetch tracked events
      const { data: eventosData } = await supabase
        .from('jornada_habitante_eventos')
        .select('evento')
        .eq('user_id', user.id);

      const eventos = (eventosData || []).map(e => e.evento);

      // Auto-detect from existing tables
      // Quiz done?
      const { data: quizData } = await supabase
        .from('big5_registros')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      if (quizData && quizData.length > 0 && !eventos.includes('quiz_voz')) {
        eventos.push('quiz_voz');
      }

      // Has clients? (tecelã detection)
      const { count: clientCount } = await supabase
        .from('clientes')
        .select('id', { count: 'exact', head: true })
        .eq('terapeuta_id', user.id);
      const hasClientes = (clientCount || 0) > 0;

      // Cartografia done?
      const { data: cartoData } = await supabase
        .from('cartografia_psiquica')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      if (cartoData && cartoData.length > 0 && !eventos.includes('cartografia_psiquica')) {
        eventos.push('cartografia_psiquica');
      }

      return { eventos, hasClientes };
    },
    enabled: !!user,
  });

  const eventos = data?.eventos || [];
  const hasClientes = data?.hasClientes || false;
  const estagio = calcularEstagio(eventos, hasClientes);
  const progresso = calcularProgresso(eventos, hasClientes);
  const estagioInfo = ESTAGIOS.find(e => e.key === estagio)!;

  return {
    estagio,
    estagioInfo,
    progresso,
    eventos,
    isLoading,
  };
}

/** Register a journey milestone event */
export async function registrarEventoJornada(userId: string, evento: string) {
  const { error } = await supabase
    .from('jornada_habitante_eventos')
    .upsert({ user_id: userId, evento }, { onConflict: 'user_id,evento' });
  if (error) throw error;
}
