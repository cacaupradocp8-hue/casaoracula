import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface AcademyLevel {
  level: number;
  name: string;
  description: string;
  minPoints: number;
  icon: string;
}

export const ACADEMY_LEVELS: AcademyLevel[] = [
  { level: 1, name: 'Iniciada', description: 'Primeiros passos na jornada profissional', minPoints: 0, icon: '🌱' },
  { level: 2, name: 'Cartógrafa da Cidade', description: 'Domínio da cartografia e territórios simbólicos', minPoints: 100, icon: '🗺️' },
  { level: 3, name: 'Guardiã das Portas', description: 'Competência nas travessias e portas psíquicas', minPoints: 300, icon: '🚪' },
  { level: 4, name: 'Tecelã de Narrativas', description: 'Maestria em narroterapia e leitura simbólica', minPoints: 600, icon: '🧵' },
  { level: 5, name: 'Mestra da Travessia', description: 'Domínio completo do Método Orácula', minPoints: 1000, icon: '👑' },
];

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt?: string;
}

const ALL_BADGES: Badge[] = [
  { id: 'first_session', name: 'Primeira Sessão', icon: '✨', description: 'Registrou sua primeira sessão clínica' },
  { id: 'five_sessions', name: '5 Sessões', icon: '🌟', description: 'Completou 5 sessões registradas' },
  { id: 'twenty_sessions', name: '20 Sessões', icon: '💫', description: 'Completou 20 sessões registradas' },
  { id: 'first_client', name: 'Primeiro Caso', icon: '🤝', description: 'Registrou seu primeiro caso clínico' },
  { id: 'five_clients', name: '5 Casos', icon: '🌿', description: 'Gerencia 5 ou mais casos' },
  { id: 'tool_explorer', name: 'Exploradora', icon: '🔍', description: 'Utilizou 3 ferramentas diferentes' },
  { id: 'tool_master', name: 'Mestra Ferramental', icon: '⚒️', description: 'Utilizou 6 ou mais ferramentas' },
  { id: 'dream_keeper', name: 'Guardiã dos Sonhos', icon: '🌙', description: 'Registrou decodificações oníricas' },
  { id: 'labyrinth_walker', name: 'Caminhante do Labirinto', icon: '🌀', description: 'Completou registros no labirinto' },
  { id: 'cartographer', name: 'Cartógrafa', icon: '📐', description: 'Realizou cartografias com clientes' },
];

export interface AcademyProgress {
  level: number;
  points: number;
  badges: Badge[];
  specialties: string[];
}

export interface AcademyStats {
  sessionsCount: number;
  clientsCount: number;
  toolsUsed: string[];
  dreamsCount: number;
  labyrinthCount: number;
  cartographyCount: number;
}

function calculateLevel(points: number): number {
  for (let i = ACADEMY_LEVELS.length - 1; i >= 0; i--) {
    if (points >= ACADEMY_LEVELS[i].minPoints) return ACADEMY_LEVELS[i].level;
  }
  return 1;
}

function calculateBadges(stats: AcademyStats): Badge[] {
  const earned: Badge[] = [];
  const now = new Date().toISOString();

  if (stats.sessionsCount >= 1) earned.push({ ...ALL_BADGES[0], earnedAt: now });
  if (stats.sessionsCount >= 5) earned.push({ ...ALL_BADGES[1], earnedAt: now });
  if (stats.sessionsCount >= 20) earned.push({ ...ALL_BADGES[2], earnedAt: now });
  if (stats.clientsCount >= 1) earned.push({ ...ALL_BADGES[3], earnedAt: now });
  if (stats.clientsCount >= 5) earned.push({ ...ALL_BADGES[4], earnedAt: now });
  if (stats.toolsUsed.length >= 3) earned.push({ ...ALL_BADGES[5], earnedAt: now });
  if (stats.toolsUsed.length >= 6) earned.push({ ...ALL_BADGES[6], earnedAt: now });
  if (stats.dreamsCount >= 1) earned.push({ ...ALL_BADGES[7], earnedAt: now });
  if (stats.labyrinthCount >= 1) earned.push({ ...ALL_BADGES[8], earnedAt: now });
  if (stats.cartographyCount >= 1) earned.push({ ...ALL_BADGES[9], earnedAt: now });

  return earned;
}

function calculatePoints(stats: AcademyStats): number {
  let points = 0;
  points += stats.sessionsCount * 10;
  points += stats.clientsCount * 20;
  points += stats.toolsUsed.length * 15;
  points += stats.dreamsCount * 8;
  points += stats.labyrinthCount * 12;
  points += stats.cartographyCount * 15;
  return points;
}

export function useAcademyProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<AcademyProgress | null>(null);
  const [stats, setStats] = useState<AcademyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async (): Promise<AcademyStats | null> => {
    if (!user) return null;

    const sessionsQuery = supabase.from('sessions' as any);
    const sessions = await sessionsQuery.select('id', { count: 'exact', head: true }).eq('therapist_id', user.id);
    const clients = await supabase.from('clientes').select('id', { count: 'exact', head: true }).eq('terapeuta_id', user.id);
    const dreams = await sessionsQuery.select('id', { count: 'exact', head: true }).eq('therapist_id', user.id).not('dream_record', 'is', null);
    const labyrinth = await sessionsQuery.select('id', { count: 'exact', head: true }).eq('therapist_id', user.id).not('labyrinth_record', 'is', null);
    const cartography = await supabase.from('cartographies').select('id, client_id').limit(100);

    // Determine tools used by checking various record tables
    const toolsUsed: string[] = [];
    const checks = await Promise.all([
      supabase.from('big5_registros').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('big5_symbolic_registros').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('big5_oracular_registros').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('big5_funcional_registros').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    ]);
    if ((checks[0].count || 0) > 0) toolsUsed.push('big5');
    if ((checks[1].count || 0) > 0) toolsUsed.push('big5_simbolico');
    if ((checks[2].count || 0) > 0) toolsUsed.push('big5_oracular');
    if ((checks[3].count || 0) > 0) toolsUsed.push('big5_funcional');
    if ((sessions.count || 0) > 0) toolsUsed.push('sessoes');
    if ((cartography.data?.length || 0) > 0) toolsUsed.push('cartografia');

    return {
      sessionsCount: sessions.count || 0,
      clientsCount: clients.count || 0,
      toolsUsed,
      dreamsCount: dreams.count || 0,
      labyrinthCount: labyrinth.count || 0,
      cartographyCount: cartography.data?.length || 0,
    };
  }, [user]);

  const refreshProgress = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const currentStats = await fetchStats();
      if (!currentStats) return;

      setStats(currentStats);
      const points = calculatePoints(currentStats);
      const level = calculateLevel(points);
      const badges = calculateBadges(currentStats);

      const progressData: AcademyProgress = {
        level,
        points,
        badges,
        specialties: currentStats.toolsUsed,
      };
      setProgress(progressData);

      // Upsert to database
      const upsertData = {
        user_id: user.id,
        level,
        points,
        badges_json: badges as any,
        specialties: currentStats.toolsUsed,
        updated_at: new Date().toISOString(),
      };
      await (supabase.from('academy_progress') as any).upsert(upsertData, { onConflict: 'user_id' });
    } catch (error) {
      console.error('Error refreshing academy progress:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, fetchStats]);

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  const currentLevel = ACADEMY_LEVELS.find(l => l.level === (progress?.level || 1)) || ACADEMY_LEVELS[0];
  const nextLevel = ACADEMY_LEVELS.find(l => l.level === (progress?.level || 1) + 1);
  const progressToNext = nextLevel
    ? ((progress?.points || 0) - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints) * 100
    : 100;

  return {
    progress,
    stats,
    isLoading,
    currentLevel,
    nextLevel,
    progressToNext: Math.min(100, Math.max(0, progressToNext)),
    refreshProgress,
    allLevels: ACADEMY_LEVELS,
  };
}
