-- Insert initial copy entries for dynamic content management
INSERT INTO public.text_models (chave, titulo, conteudo, categoria, scope, ativo) VALUES
-- Categoria: triade (Pilares Metodológicos)
('triade_completa', 'Tríade Metodológica', 'Ego organiza a experiência • Neuroplasticidade sustenta o processo • A Alma orienta a travessia', 'triade', 'global', true),
('triade_assinatura', 'Assinatura Tríade', '— Tríade Metodológica ORÁCULA', 'triade', 'global', true),

-- Categoria: introducao (Textos de Abertura)
('welcome_mensagem', 'Mensagem de Boas-Vindas', 'Você não entrou para consumir conteúdo. Entrou para atravessar processos com estrutura, linguagem e cuidado simbólico.', 'introducao', 'global', true),
('dashboard_mensagem', 'Mensagem do Dashboard', 'Você não entrou para consumir conteúdo — entrou para atravessar.', 'introducao', 'global', true),
('landing_titulo', 'Título Landing', 'Bem-vinda à', 'introducao', 'global', true),
('landing_destaque', 'Destaque Landing', 'Casa ORÁCULA', 'introducao', 'global', true),
('landing_texto_1', 'Landing Texto 1', 'A Casa ORÁCULA não é um curso.', 'introducao', 'global', true),
('landing_texto_2', 'Landing Texto 2', 'É um espaço de formação simbólica, clínica e ética para mulheres que conduzem outras mulheres.', 'introducao', 'global', true),
('landing_texto_3', 'Landing Texto 3', 'Aqui, a técnica não substitui a escuta. O símbolo não é ornamento — é linguagem. E o portal não é metáfora — é prática.', 'introducao', 'global', true),
('landing_texto_4', 'Landing Texto 4', 'Você entra para aprender a ler narrativas profundas, sustentar eixo e conduzir processos reais de transformação.', 'introducao', 'global', true),
('landing_convite', 'Convite Landing', 'Sente-se. A Casa se revela passo a passo.', 'introducao', 'global', true),

-- Categoria: microcopy (Botões e CTAs)
('btn_entrar_casa', 'Botão Entrar Casa', 'Entrar na Casa ORÁCULA', 'microcopy', 'global', true),
('btn_atravessar_limiar', 'Botão Atravessar', 'Atravessar o limiar', 'microcopy', 'global', true),
('btn_iniciar_travessia', 'Botão Iniciar', 'Iniciar a travessia', 'microcopy', 'global', true),
('btn_atravessar', 'Botão Atravessar Simples', 'Atravessar', 'microcopy', 'global', true),
('btn_acessar_ferramenta', 'Botão Acessar Ferramenta', 'Iniciar a travessia', 'microcopy', 'global', true)
ON CONFLICT (chave) DO UPDATE SET
  titulo = EXCLUDED.titulo,
  conteudo = EXCLUDED.conteudo,
  categoria = EXCLUDED.categoria,
  scope = EXCLUDED.scope,
  updated_at = now();