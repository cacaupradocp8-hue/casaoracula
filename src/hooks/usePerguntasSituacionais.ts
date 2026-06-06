import { useMemo } from 'react';

export function usePerguntasSituacionais() {
  const perguntas = useMemo(() => [
    {
      id: 'p1',
      texto_pergunta: 'Quando algo começa a mudar na sua vida, sua primeira reação costuma ser:',
      opcoes: [
        { label: 'Controlar os detalhes.', eixo: 'torre_interna' },
        { label: 'Procurar sentido.', eixo: 'torre_interna' }, // No motor simplificado mapeamos para eixos Big5
        { label: 'Pensar em como isso afetará os vínculos.', eixo: 'campo_do_outro' },
        { label: 'Travar entre várias possibilidades.', eixo: 'porta_do_abalo' }
      ]
    },
    {
      id: 'p2',
      texto_pergunta: 'Diante de um conflito inesperado, você tende a:',
      opcoes: [
        { label: 'Silenciar para preservar a paz.', eixo: 'campo_do_outro' },
        { label: 'Argumentar com lógica e fatos.', eixo: 'voz_no_mundo' },
        { label: 'Sentir uma sobrecarga emocional imediata.', eixo: 'porta_do_abalo' },
        { label: 'Planejar a saída mais segura.', eixo: 'torre_interna' }
      ]
    },
    {
      id: 'p3',
      texto_pergunta: 'Ao receber um novo convite ou oportunidade:',
      opcoes: [
        { label: 'Analisa os riscos antes de qualquer coisa.', eixo: 'torre_interna' },
        { label: 'Sente entusiasmo e vontade de começar.', eixo: 'porta_do_possivel' },
        { label: 'Pergunta-se se é capaz de dar conta.', eixo: 'porta_do_abalo' },
        { label: 'Avalia quem estará com você nessa jornada.', eixo: 'campo_do_outro' }
      ]
    },
    {
      id: 'p4',
      texto_pergunta: 'No seu tempo livre, o que mais te nutre é:',
      opcoes: [
        { label: 'Organizar suas coisas e planos.', eixo: 'torre_interna' },
        { label: 'Aprender algo novo e estimulante.', eixo: 'porta_do_possivel' },
        { label: 'Estar em silêncio e recolhimento.', eixo: 'torre_interna' },
        { label: 'Conversar e trocar com pessoas queridas.', eixo: 'campo_do_outro' }
      ]
    },
    {
      id: 'p5',
      texto_pergunta: 'Quando você precisa tomar uma decisão difícil:',
      opcoes: [
        { label: 'Ouve a opinião de quem confia.', eixo: 'campo_do_outro' },
        { label: 'Decide rápido para acabar com a angústia.', eixo: 'voz_no_mundo' },
        { label: 'Adia até ter certeza absoluta.', eixo: 'torre_interna' },
        { label: 'Sente que qualquer escolha terá um custo alto.', eixo: 'porta_do_abalo' }
      ]
    }
  ], []);

  return { perguntas };
}
