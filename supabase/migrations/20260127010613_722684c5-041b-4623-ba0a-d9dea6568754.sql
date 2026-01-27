-- Add interpretation columns to big5_funcional_dimensoes
ALTER TABLE big5_funcional_dimensoes
ADD COLUMN IF NOT EXISTS interpretacao_alto TEXT,
ADD COLUMN IF NOT EXISTS interpretacao_baixo TEXT,
ADD COLUMN IF NOT EXISTS ponto_atencao_alto TEXT,
ADD COLUMN IF NOT EXISTS ponto_atencao_baixo TEXT;

-- Populate interpretation data for each dimension
UPDATE big5_funcional_dimensoes SET
  interpretacao_alto = 'Você tende a:
• aprender com facilidade
• questionar padrões estabelecidos
• se interessar por ideias novas e abordagens diferentes

Costuma se adaptar bem a contextos de mudança e inovação.',
  interpretacao_baixo = 'Você tende a:
• preferir métodos testados
• valorizar estabilidade e previsibilidade
• confiar mais no concreto do que no abstrato

Funciona bem em contextos que exigem constância.',
  ponto_atencao_alto = 'Pode se dispersar ou se frustrar em ambientes muito rígidos ou repetitivos.',
  ponto_atencao_baixo = 'Pode resistir a mudanças necessárias ou ignorar alternativas criativas.'
WHERE chave = 'abertura';

UPDATE big5_funcional_dimensoes SET
  interpretacao_alto = 'Você tende a:
• cumprir compromissos com responsabilidade
• manter organização e foco
• sustentar projetos de longo prazo

É vista como alguém confiável.',
  interpretacao_baixo = 'Você tende a:
• agir de forma mais espontânea
• ter dificuldade com rotinas rígidas
• priorizar o que faz sentido no momento

Funciona bem em contextos criativos ou flexíveis.',
  ponto_atencao_alto = 'Pode assumir carga excessiva ou ter dificuldade em flexibilizar planos.',
  ponto_atencao_baixo = 'Pode enfrentar dificuldades com prazos, constância ou finalização.'
WHERE chave = 'conscienciosidade';

UPDATE big5_funcional_dimensoes SET
  interpretacao_alto = 'Você tende a:
• se energizar em interações sociais
• expressar ideias com facilidade
• assumir iniciativa em grupos

Ambientes colaborativos costumam favorecer seu desempenho.',
  interpretacao_baixo = 'Você tende a:
• processar informações internamente
• observar antes de agir
• preferir interações mais profundas e seletivas

Funciona bem em atividades que exigem concentração e análise.',
  ponto_atencao_alto = 'Pode ter dificuldade em lidar com silêncio, espera ou processos internos.',
  ponto_atencao_baixo = 'Pode ser percebida como distante ou pouco participativa, mesmo quando está envolvida.'
WHERE chave = 'extroversao';

UPDATE big5_funcional_dimensoes SET
  interpretacao_alto = 'Você tende a:
• considerar o impacto das suas ações nos outros
• cooperar e buscar harmonia
• demonstrar empatia com facilidade

É vista como alguém acessível e colaborativa.',
  interpretacao_baixo = 'Você tende a:
• priorizar autonomia e objetividade
• lidar bem com discordâncias
• tomar decisões sem buscar aprovação constante

Funciona bem em contextos que exigem posicionamento claro.',
  ponto_atencao_alto = 'Pode evitar conflitos necessários ou ceder demais.',
  ponto_atencao_baixo = 'Pode ser percebida como dura ou pouco sensível, mesmo sem intenção.'
WHERE chave = 'amabilidade';

UPDATE big5_funcional_dimensoes SET
  interpretacao_alto = 'Você tende a:
• reagir intensamente ao estresse
• sentir emoções negativas com mais frequência
• perceber ameaças com facilidade

Isso pode aumentar sua sensibilidade e percepção do ambiente.',
  interpretacao_baixo = 'Você tende a:
• manter estabilidade emocional
• lidar bem com pressão
• recuperar-se rapidamente de frustrações

Funciona bem em contextos de alta exigência.',
  ponto_atencao_alto = 'Pode se desgastar emocionalmente ou entrar em ciclos de preocupação.',
  ponto_atencao_baixo = 'Pode minimizar emoções importantes ou ignorar sinais internos de desgaste.'
WHERE chave = 'neuroticismo';