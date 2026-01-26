-- Adicionar novos campos à tabela radiestesia_graficos para a estrutura completa
ALTER TABLE radiestesia_graficos
ADD COLUMN IF NOT EXISTS tipo_acao TEXT,
ADD COLUMN IF NOT EXISTS quando_usar TEXT,
ADD COLUMN IF NOT EXISTS como_usar TEXT,
ADD COLUMN IF NOT EXISTS erro_iniciante TEXT,
ADD COLUMN IF NOT EXISTS nivel_intensidade TEXT CHECK (nivel_intensidade IN ('suave', 'medio', 'forte', 'muito_forte')),
ADD COLUMN IF NOT EXISTS observacao_etica TEXT,
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Criar índice para busca por slug
CREATE INDEX IF NOT EXISTS idx_radiestesia_graficos_slug ON radiestesia_graficos(slug);

-- Inserir os 20 gráficos iniciais

-- ═══════════════════════════════════════════════════════════════
-- LIMPEZA & DESIMPREGNAÇÃO (5 gráficos)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO radiestesia_graficos (
  nome, slug, autor, origem, categoria, tipo_leitura, tipo_acao,
  para_que_serve, quando_usar, quando_nao_usar, como_usar,
  erro_iniciante, nivel_intensidade, observacao_etica, combinacoes, ordem, ativo
) VALUES 
(
  'Desimpregnador', 'desimpregnador', 'Tradicional', 'tradicional', 'clinico', 'limpeza', 'Limpeza',
  'Remove impregnações energéticas acumuladas em objetos, ambientes ou campos pessoais. Atua sobre camadas de energia estagnada.',
  'Após atendimentos intensos. Em objetos usados por terceiros. Em ambientes com energia densa. Quando há sensação de peso persistente.',
  'Nunca usar em processos agudos de crise. Não usar como substituto de limpeza física. Evitar em grávidas sem orientação.',
  'Posicionar testemunho no centro do gráfico. Tempo médio: 15-30 minutos. Observar sinais de conclusão no pêndulo. Não forçar tempos prolongados.',
  'Deixar o gráfico ativo por tempo indeterminado. Usar sem intenção clara. Esperar resultados imediatos sem continuidade.',
  'forte',
  'Este gráfico não substitui cuidados profissionais de saúde. Seu uso é de responsabilidade exclusiva do operador.',
  ARRAY['Quartzo branco', 'Sal grosso', 'Incenso'],
  1, true
),
(
  'Desembaraçador', 'desembaracador', 'Tradicional', 'tradicional', 'clinico', 'limpeza', 'Limpeza',
  'Desfaz nós energéticos e padrões repetitivos. Atua sobre emaranhamentos relacionais e sistêmicos.',
  'Quando há padrões que se repetem sem explicação. Em conflitos relacionais persistentes. Antes de trabalhos de constelação.',
  'Não usar como atalho para questões que exigem psicoterapia. Evitar em estados de confusão mental aguda.',
  'Testemunho no centro. Tempo médio: 20-40 minutos. Pode ser combinado com cristais de corte. Encerrar com gráfico estabilizador.',
  'Usar para desfazer relações conscientemente desejadas. Confundir limpeza energética com término de vínculos.',
  'medio',
  'O uso inadequado pode trazer desconforto temporário. Sempre encerre com estabilização.',
  ARRAY['Obsidiana', 'Turmalina negra', 'Citrino'],
  2, true
),
(
  'Dissipador', 'dissipador', 'Angelo Vitale', 'autoral', 'clinico', 'limpeza', 'Limpeza',
  'Dispersa energias densas sem direcionamento específico. Cria espaço para renovação do campo.',
  'Quando o campo está saturado. Após discussões ou conflitos. Em ambientes de trabalho com muitas pessoas.',
  'Não usar em campos fragilizados. Evitar quando há necessidade de manter energia acumulada.',
  'Posicionar no ambiente ou com testemunho. Tempo: 10-20 minutos. Ideal combinar com ventilação do espaço físico.',
  'Usar sem preparar o campo para receber nova energia. Dissipar sem depois nutrir.',
  'medio',
  'A dissipação cria vazio. Tenha intenção clara sobre o que deseja cultivar após o uso.',
  ARRAY['Ametista', 'Água corrente', 'Ventilação'],
  3, true
),
(
  'Triturador', 'triturador', 'Mássimo Frizari', 'autoral', 'clinico', 'limpeza', 'Limpeza',
  'Quebra formas-pensamento cristalizadas e padrões energéticos densos. Ação intensa e direcionada.',
  'Em casos de obsessão mental. Quando há sensação de bloqueio intenso. Após traumas agudos com acompanhamento.',
  'Nunca usar sem experiência prévia. Evitar em pessoas sensíveis sem preparação. Não usar em crianças.',
  'Apenas com testemunho específico. Tempo máximo: 10 minutos. Sempre encerrar com gráfico de harmonização.',
  'Usar como primeira opção. Aplicar tempo prolongado. Não acompanhar o processo com atenção.',
  'muito_forte',
  'Gráfico de alta intensidade. Uso inadequado pode gerar desconforto. Requer experiência.',
  ARRAY['Turmalina negra', 'Obsidiana', 'Sal grosso'],
  4, true
),
(
  'Diafragma', 'diafragma', 'Servranx', 'tradicional', 'clinico', 'limpeza', 'Limpeza',
  'Filtra energias indesejadas enquanto permite passagem das benéficas. Atua como membrana seletiva.',
  'Para proteção contínua de ambientes. Em consultorios terapêuticos. Quando há necessidade de filtrar sem bloquear.',
  'Não é adequado para limpeza profunda. Não substitui desimpregnação quando necessária.',
  'Posicionar em local fixo do ambiente. Pode ficar ativo continuamente. Limpar semanalmente.',
  'Esperar que faça limpeza profunda. Não limpar o próprio gráfico periodicamente.',
  'suave',
  'Gráfico de manutenção, não de emergência. Use-o como parte de rotina, não como solução única.',
  ARRAY['Selenita', 'Quartzo transparente', 'Água'],
  5, true
),

-- ═══════════════════════════════════════════════════════════════
-- PROTEÇÃO (5 gráficos)
-- ═══════════════════════════════════════════════════════════════
(
  'SCAP', 'scap', 'André Philippe', 'autoral', 'clinico', 'protecao', 'Proteção',
  'Sistema de Correção e Ativação Psíquica. Proteção multidimensional com ativação de centros energéticos.',
  'Antes de atendimentos. Para proteção pessoal diária. Em momentos de vulnerabilidade energética.',
  'Não usar como escudo contra responsabilidades pessoais. Evitar dependência exclusiva.',
  'Testemunho no centro. Tempo: 5-15 minutos para ativação. Pode ser usado diariamente.',
  'Acreditar que substitui cuidados com limites pessoais. Usar como desculpa para não trabalhar questões internas.',
  'medio',
  'Proteção energética não substitui proteção emocional e psicológica consciente.',
  ARRAY['Ametista', 'Quartzo rosa', 'Obsidiana'],
  6, true
),
(
  'Escudo Protetor', 'escudo-protetor', 'Tradicional', 'tradicional', 'clinico', 'protecao', 'Proteção',
  'Cria barreira energética ao redor do campo. Proteção básica e acessível para iniciantes.',
  'Em situações de exposição a ambientes densos. Antes de reuniões difíceis. Para proteção de objetos.',
  'Não é adequado para casos que exigem proteção profunda. Não bloqueia tudo.',
  'Visualizar o escudo se formando. Tempo: 5-10 minutos. Renovar diariamente se necessário.',
  'Criar escudo e esquecer de renovar. Acreditar que é invulnerável.',
  'suave',
  'Proteção básica requer manutenção. Não cria invulnerabilidade.',
  ARRAY['Turmalina negra', 'Hematita', 'Obsidiana'],
  7, true
),
(
  'Luxor', 'luxor', 'Tradicional Egípcio', 'tradicional', 'oracular', 'protecao', 'Proteção',
  'Proteção de origem egípcia com conexão aos mistérios. Atua em níveis profundos de consciência.',
  'Em trabalhos rituais. Para proteção de espaços sagrados. Em meditações profundas.',
  'Não usar sem conhecimento da tradição. Evitar uso casual ou superficial.',
  'Requer preparação ritual. Tempo variável conforme propósito. Encerrar com gratidão.',
  'Usar sem reverência. Tratar como gráfico comum.',
  'forte',
  'Este gráfico carrega tradição. Use com respeito e conhecimento.',
  ARRAY['Lápis-lazúli', 'Ouro', 'Incenso de mirra'],
  8, true
),
(
  'Anti-Magia', 'anti-magia', 'Tradicional', 'tradicional', 'oracular', 'protecao', 'Proteção',
  'Neutraliza influências energéticas direcionadas. Não julga origem, apenas neutraliza.',
  'Quando há suspeita de influência externa direcionada. Em ambientes com histórico de conflitos energéticos.',
  'Não usar para alimentar paranoia. Evitar quando o problema é interno, não externo.',
  'Testemunho no centro. Tempo: 15-30 minutos. Combinar com limpeza prévia.',
  'Culpar terceiros por questões pessoais. Usar como substituto de autoconhecimento.',
  'forte',
  'Nem toda dificuldade vem de fora. Use com discernimento e honestidade.',
  ARRAY['Sal grosso', 'Turmalina negra', 'Arruda'],
  9, true
),
(
  'Anti-Ondas', 'anti-ondas', 'Moderno', 'autoral', 'clinico', 'protecao', 'Proteção',
  'Minimiza efeitos de radiações eletromagnéticas e ondas artificiais no campo energético.',
  'Próximo a equipamentos eletrônicos. Em escritórios com muitos aparelhos. Para sensíveis a eletrônicos.',
  'Não substitui distância física de fontes de radiação. Não cura efeitos já instalados.',
  'Posicionar próximo às fontes. Pode ficar ativo continuamente. Limpar semanalmente.',
  'Achar que pode usar celular ilimitadamente. Não tomar cuidados físicos básicos.',
  'suave',
  'Proteção energética complementa, não substitui, cuidados práticos com exposição.',
  ARRAY['Shungita', 'Turmalina negra', 'Quartzo fumê'],
  10, true
),

-- ═══════════════════════════════════════════════════════════════
-- POTENCIALIZAÇÃO & ENERGIA (5 gráficos)
-- ═══════════════════════════════════════════════════════════════
(
  'Alta Vitalidade', 'alta-vitalidade', 'Tradicional', 'tradicional', 'clinico', 'campo', 'Potencialização',
  'Aumenta nível de energia vital do campo. Revitaliza após períodos de esgotamento.',
  'Após doenças. Em períodos de recuperação. Quando há baixa energia persistente.',
  'Não usar em estados de hiperatividade. Evitar em condições cardíacas sem orientação médica.',
  'Testemunho no centro. Tempo: 15-30 minutos. Combinar com descanso físico.',
  'Usar como substituto de sono e alimentação. Forçar energia quando o corpo pede descanso.',
  'forte',
  'Energia vital genuína vem de hábitos saudáveis. O gráfico potencializa, não substitui.',
  ARRAY['Citrino', 'Carneliana', 'Jaspe vermelho'],
  11, true
),
(
  'Amplificador Universal', 'amplificador', 'Giorgio Picchi', 'autoral', 'oracular', 'campo', 'Potencialização',
  'Amplifica qualquer intenção ou trabalho energético. Deve ser usado com cuidado.',
  'Para potencializar outros gráficos. Em rituais que precisam de mais força. Para carregar cristais.',
  'Nunca usar com intenções confusas. Evitar em estados emocionais instáveis.',
  'Posicionar o que deseja amplificar sobre o gráfico. Tempo: 5-15 minutos. Ter clareza absoluta.',
  'Amplificar sem saber o quê. Usar em conjunto com negatividade.',
  'muito_forte',
  'Amplifica tudo, inclusive sombras. Use apenas com consciência clara.',
  ARRAY['Quartzo gerador', 'Pirâmide', 'Sol'],
  12, true
),
(
  'Gerador Pirâmide', 'gerador-piramide', 'Geometria Sagrada', 'tradicional', 'estudo', 'campo', 'Potencialização',
  'Gera energia através da forma piramidal. Concentra e direciona força vital.',
  'Para carregar água e alimentos. Em meditações. Para potencializar cristais.',
  'Não usar para forçar resultados. Evitar expectativas mágicas.',
  'Posicionar no centro da pirâmide ou sobre gráfico. Tempo variável. Observar sinais.',
  'Esperar milagres. Não respeitar tempos naturais.',
  'medio',
  'A pirâmide concentra, não cria do nada. A fonte é sempre a intenção consciente.',
  ARRAY['Quartzo transparente', 'Cobre', 'Água'],
  13, true
),
(
  'Gerador Circular', 'gerador-circular', 'Tradicional', 'tradicional', 'estudo', 'campo', 'Potencialização',
  'Gera energia de forma equilibrada e contínua. Menos intenso que pirâmide, mais sustentável.',
  'Para manutenção energética. Em ambientes de convivência. Para trabalhos de longa duração.',
  'Não adequado para necessidades intensas pontuais. Não substitui limpeza.',
  'Posicionar no ambiente. Pode ficar ativo continuamente. Limpar mensalmente.',
  'Esperar resultados intensos rápidos. Não cuidar da manutenção.',
  'suave',
  'Energia sustentável é preferível a picos intensos. Cultive constância.',
  ARRAY['Ametista', 'Quartzo rosa', 'Selenita'],
  14, true
),
(
  'Turbilhão', 'turbilhao', 'La Foye', 'autoral', 'clinico', 'campo', 'Potencialização',
  'Cria movimento energético intenso. Desbloqueia estagnações através de movimento espiral.',
  'Quando há energia parada. Em bloqueios criativos. Para iniciar novos ciclos.',
  'Não usar em pessoas ansiosas. Evitar em estados de confusão. Não usar à noite.',
  'Testemunho no centro. Tempo máximo: 10 minutos. Sempre estabilizar depois.',
  'Usar antes de dormir. Aplicar em excesso. Não dar tempo de integração.',
  'forte',
  'Movimento intenso requer integração. Não provoque turbilhões sem saber acolher.',
  ARRAY['Carneliana', 'Citrino', 'Laranja'],
  15, true
),

-- ═══════════════════════════════════════════════════════════════
-- SIMBÓLICOS FUNDAMENTAIS (5 gráficos)
-- ═══════════════════════════════════════════════════════════════
(
  'Flor da Vida', 'flor-da-vida', 'Geometria Sagrada', 'tradicional', 'oracular', 'narrativa', 'Regulador',
  'Padrão fundamental da criação. Harmoniza através da geometria sagrada. Conecta com ordem universal.',
  'Para harmonização geral. Em meditações. Para carregar objetos. Em ambientes de cura.',
  'Não usar com intenções de manipulação. A geometria amplifica tudo.',
  'Posicionar testemunho ou objeto no centro. Tempo: 15-60 minutos. Pode usar para meditação.',
  'Tratar como decoração. Não respeitar a potência do símbolo.',
  'medio',
  'A Flor da Vida conecta com ordem maior. Use com reverência e propósito claro.',
  ARRAY['Todos os cristais', 'Água', 'Sementes'],
  16, true
),
(
  'Cubo de Metatron', 'cubo-metatron', 'Tradição Cabalística', 'tradicional', 'oracular', 'narrativa', 'Regulador',
  'Contém todos os sólidos platônicos. Conecta com estrutura fundamental da realidade.',
  'Para compreensão profunda. Em estudos esotéricos. Para conexão com dimensões superiores.',
  'Não usar sem base de estudo. Evitar uso superficial.',
  'Contemplar em meditação. Tempo: variável. Requer preparação prévia.',
  'Usar sem conhecer os sólidos platônicos. Tratar como amuleto comum.',
  'forte',
  'Conhecimento requer estudo. O símbolo revela para quem está preparado.',
  ARRAY['Quartzo transparente', 'Ametista', 'Fluorita'],
  17, true
),
(
  'Antahkarana', 'antahkarana', 'Tradição Tibetana', 'tradicional', 'estudo', 'narrativa', 'Regulador',
  'Ponte entre personalidade e alma. Símbolo de conexão e integração espiritual.',
  'Em meditações profundas. Para trabalhos de integração. Em processos de autoconhecimento.',
  'Não usar em estados dissociativos. Evitar sem ancoragem prévia.',
  'Meditar com o símbolo. Tempo: 15-30 minutos. Ter os pés no chão.',
  'Usar para fugir da realidade. Buscar experiências sem integração.',
  'medio',
  'A ponte une céu e terra. Mantenha-se ancorado enquanto busca o alto.',
  ARRAY['Lápis-lazúli', 'Ametista', 'Quartzo azul'],
  18, true
),
(
  'Sri Yantra', 'sri-yantra', 'Tradição Hindu', 'tradicional', 'oracular', 'narrativa', 'Regulador',
  'Yantra supremo da tradição hindu. Representa a totalidade do cosmos e a jornada espiritual.',
  'Em meditações avançadas. Para conexão com o sagrado feminino. Em rituais de prosperidade.',
  'Não usar sem conhecimento da tradição. Evitar uso comercial superficial.',
  'Contemplar do exterior para o centro. Tempo: variável. Requer iniciação idealmente.',
  'Usar apenas para prosperidade material. Ignorar a dimensão espiritual.',
  'forte',
  'Este yantra representa a totalidade. Aproxime-se com humildade e reverência.',
  ARRAY['Rubi', 'Coral', 'Ouro'],
  19, true
),
(
  'Labirinto de Chartres', 'labirinto-chartres', 'Tradição Medieval', 'tradicional', 'estudo', 'narrativa', 'Regulador',
  'Caminho de peregrinação interior. Representa jornada da alma através das provas da vida.',
  'Em momentos de transição. Para clareza em decisões. Em processos de transformação.',
  'Não usar com pressa. Evitar expectativa de respostas rápidas.',
  'Percorrer mentalmente ou fisicamente. Tempo: o que for necessário. Honrar cada etapa.',
  'Querer atalhos. Pular etapas. Buscar apenas a chegada.',
  'suave',
  'O caminho é o mestre. Não há atalhos genuínos na jornada interior.',
  ARRAY['Quartzo rosa', 'Ametista', 'Calcita'],
  20, true
)
ON CONFLICT (slug) DO NOTHING;