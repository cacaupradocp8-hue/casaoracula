
export type CidadelaOverview = {
  isLoading: boolean;
  error: string | null;

  estadoAtual: {
    titulo: string;
    descricao: string;
    distritoAtivo?: string | null;
  };

  travessias: {
    total: number;
    recentes: Array<{
      id: string;
      titulo: string;
      contexto?: string;
      data?: string;
    }>;
  };

  rotas: {
    emAndamento: number;
    concluidas: number;
    proximaRota?: {
      titulo: string;
      href: string;
    } | null;
  };

  treinamento: {
    modulosIniciados: number;
    exerciciosConcluidos: number;
    proximoTreino?: {
      titulo: string;
      href: string;
    } | null;
  };

  formacao: {
    cursosAtivos: number;
    aulasConcluidas: number;
    proximoCurso?: {
      titulo: string;
      href: string;
    } | null;
  };

  proximoPasso: {
    titulo: string;
    descricao: string;
    href: string;
    tipo: "rotas" | "treinamento" | "formacao" | "jornada";
  } | null;
};
