
-- Porta 1: O Chamado → O Chamado Interno
UPDATE labirinto_fases SET
  nome = 'O Chamado Interno',
  nucleo = 'Identidade',
  tema_central = 'O desconforto que inicia a travessia',
  pergunta_chave = 'O que em mim já não aceita mais viver como antes?',
  exercicio_titulo = 'Nomear o Incômodo',
  exercicio_instrucao = 'Escrever 3 situações onde a vida perdeu vitalidade. Identificar o sentimento comum entre elas.',
  ritual_texto = 'Queimar simbolicamente (ou rasgar) uma frase antiga que não sustenta mais a vida atual.',
  codigo_interno = 'P01',
  versao_conteudo = '2.0'
WHERE ordem = 1;

-- Porta 2: A Ruptura → A Separação do Feminino
UPDATE labirinto_fases SET
  nome = 'A Separação do Feminino',
  nucleo = 'Identidade',
  tema_central = 'Ruptura com o corpo, o sentir e a intuição',
  pergunta_chave = 'O que precisei abandonar em mim para ser aceita?',
  exercicio_titulo = 'Linha da Desconexão',
  exercicio_instrucao = 'Identificar quando começou a se afastar do sentir. Nomear ganhos e perdas dessa separação.',
  ritual_texto = 'Toque consciente no corpo (mãos no ventre ou coração).',
  codigo_interno = 'P02',
  versao_conteudo = '2.0'
WHERE ordem = 2;

-- Porta 3: A Descida → A Identificação com o Masculino
UPDATE labirinto_fases SET
  nome = 'A Identificação com o Masculino',
  nucleo = 'Identidade',
  tema_central = 'Performance, controle e endurecimento',
  pergunta_chave = 'Quem eu precisei me tornar para sobreviver?',
  exercicio_titulo = 'Personagem de Sobrevivência',
  exercicio_instrucao = 'Descrever a persona funcional criada. Reconhecer o que ela protege e o que ela bloqueia.',
  ritual_texto = 'Retirar simbolicamente um "uniforme" imaginário.',
  codigo_interno = 'P03',
  versao_conteudo = '2.0'
WHERE ordem = 3;

-- Porta 4: O Labirinto → O Sucesso sem Alma
UPDATE labirinto_fases SET
  nome = 'O Sucesso sem Alma',
  nucleo = 'Descida',
  tema_central = 'Conquistas que não nutrem',
  pergunta_chave = 'O que conquistei que não me preencheu?',
  exercicio_titulo = 'Inventário do Vazio',
  exercicio_instrucao = 'Listar conquistas externas. Nomear emoções reais associadas.',
  ritual_texto = 'Silêncio guiado de luto simbólico.',
  codigo_interno = 'P04',
  versao_conteudo = '2.0'
WHERE ordem = 4;

-- Porta 5: O Osso → A Desintegração
UPDATE labirinto_fases SET
  nome = 'A Desintegração',
  nucleo = 'Descida',
  tema_central = 'Queda da identidade construída',
  pergunta_chave = 'O que em mim está ruindo — e precisa ruir?',
  exercicio_titulo = 'O Que Não Sustenta Mais',
  exercicio_instrucao = 'Nomear estruturas internas falidas.',
  ritual_texto = 'Respiração profunda + escrita livre sem censura.',
  codigo_interno = 'P05',
  versao_conteudo = '2.0'
WHERE ordem = 5;

-- Porta 6: A Memória → A Descida à Deusa
UPDATE labirinto_fases SET
  nome = 'A Descida à Deusa',
  nucleo = 'Descida',
  tema_central = 'Encontro com a sombra feminina',
  pergunta_chave = 'Que parte minha foi chamada de exagerada, perigosa ou errada?',
  exercicio_titulo = 'Nomear a Sombra',
  exercicio_instrucao = 'Dar voz a uma emoção negada.',
  ritual_texto = 'Escrita em primeira pessoa da parte rejeitada.',
  codigo_interno = 'P06',
  versao_conteudo = '2.0'
WHERE ordem = 6;

-- Porta 7: A Ferida → O Anseio de Reconexão
UPDATE labirinto_fases SET
  nome = 'O Anseio de Reconexão',
  nucleo = 'Corpo',
  tema_central = 'Saudade da totalidade',
  pergunta_chave = 'O que minha alma pede agora?',
  exercicio_titulo = 'Mapa do Desejo Vivo',
  exercicio_instrucao = 'Mapear desejos autênticos que foram silenciados ou esquecidos.',
  ritual_texto = 'Visualização guiada de reconexão.',
  codigo_interno = 'P07',
  versao_conteudo = '2.0'
WHERE ordem = 7;

-- Porta 8: A Defesa → Cura da Ferida Materna
UPDATE labirinto_fases SET
  nome = 'Cura da Ferida Materna',
  nucleo = 'Corpo',
  tema_central = 'Reconciliação com o feminino ferido',
  pergunta_chave = 'Que tipo de amor materno faltou — e como isso moldou minhas relações?',
  exercicio_titulo = 'O Feminino Herdado',
  exercicio_instrucao = 'Nomear o que recebeu e o que não recebeu. Identificar padrões repetidos em relações femininas.',
  ritual_texto = 'Escrita de uma carta simbólica à mãe (real ou arquetípica), sem envio.',
  codigo_interno = 'P08',
  versao_conteudo = '2.0'
WHERE ordem = 8;

-- Porta 9: O Espelho → Cura da Ferida Paterna
UPDATE labirinto_fases SET
  nome = 'Cura da Ferida Paterna',
  nucleo = 'Corpo',
  tema_central = 'Autoridade, reconhecimento e validação',
  pergunta_chave = 'Onde ainda busco permissão para existir plenamente?',
  exercicio_titulo = 'O Olhar que Faltou',
  exercicio_instrucao = 'Identificar onde busca validação externa. Nomear o custo disso na vida adulta.',
  ritual_texto = 'Postura corporal de presença + afirmação simbólica de autoridade interna.',
  codigo_interno = 'P09',
  versao_conteudo = '2.0'
WHERE ordem = 9;

-- Porta 10: A Escolha → A Integração do Masculino e Feminino
UPDATE labirinto_fases SET
  nome = 'A Integração do Masculino e Feminino',
  nucleo = 'Integração',
  tema_central = 'Integração de ação e sentir',
  pergunta_chave = 'Qual parte minha lidera em excesso — e qual está silenciada?',
  exercicio_titulo = 'Diálogo Interno',
  exercicio_instrucao = 'Escrita em duas vozes (agir × sentir).',
  ritual_texto = 'Respiração alternada + gesto simbólico de união.',
  codigo_interno = 'P10',
  versao_conteudo = '2.0'
WHERE ordem = 10;

-- Porta 11: A Integração → Reivindicação da Autoridade Feminina
UPDATE labirinto_fases SET
  nome = 'Reivindicação da Autoridade Feminina',
  nucleo = 'Integração',
  tema_central = 'Autonomia simbólica',
  pergunta_chave = 'Onde entreguei meu poder para sobreviver?',
  exercicio_titulo = 'Território Psíquico',
  exercicio_instrucao = 'Identificar invasões emocionais. Definir limites simbólicos.',
  ritual_texto = 'Delimitação espacial consciente (corpo e voz).',
  codigo_interno = 'P11',
  versao_conteudo = '2.0'
WHERE ordem = 11;

-- Porta 12: A Voz → O Retorno ao Mundo
UPDATE labirinto_fases SET
  nome = 'O Retorno ao Mundo',
  nucleo = 'Integração',
  tema_central = 'Voltar diferente',
  pergunta_chave = 'Como levo quem me tornei para o mundo real?',
  exercicio_titulo = 'Nova Ética de Vida',
  exercicio_instrucao = '3 compromissos inegociáveis com a própria verdade.',
  ritual_texto = 'Declaração verbal de compromisso simbólico.',
  codigo_interno = 'P12',
  versao_conteudo = '2.0'
WHERE ordem = 12;

-- Porta 13: O Retorno → A Vida Criativa
UPDATE labirinto_fases SET
  nome = 'A Vida Criativa',
  nucleo = 'Integração',
  tema_central = 'Criação como expressão da alma',
  pergunta_chave = 'O que deseja nascer através de mim?',
  exercicio_titulo = 'Mapa Criativo Essencial',
  exercicio_instrucao = 'Mapear impulsos criativos autênticos e escolher um para materializar.',
  ritual_texto = 'Ação criativa mínima imediata (24h).',
  codigo_interno = 'P13',
  versao_conteudo = '2.0'
WHERE ordem = 13;

-- Porta 14: A Guardiã → A Heroína Integrada
UPDATE labirinto_fases SET
  nome = 'A Heroína Integrada',
  nucleo = 'Integração',
  tema_central = 'Integração e continuidade',
  pergunta_chave = 'Quem sou agora — e como sustento isso no tempo?',
  exercicio_titulo = 'Linha do Tempo Integrada',
  exercicio_instrucao = 'Traçar a linha do tempo da jornada pessoal, marcando transformações-chave.',
  ritual_texto = 'Consagração simbólica do percurso.',
  codigo_interno = 'P14',
  versao_conteudo = '2.0'
WHERE ordem = 14;
