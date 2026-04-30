-- Drop rigid constraint
ALTER TABLE public.co_camara_sussurro_casos DROP CONSTRAINT IF EXISTS co_camara_sussurro_casos_dificuldade_check;

-- Alter idade to text
ALTER TABLE public.co_camara_sussurro_casos ALTER COLUMN idade TYPE TEXT;

-- Align co_camara_sussurro_casos with simulation engine
ALTER TABLE public.co_camara_sussurro_casos 
ADD COLUMN IF NOT EXISTS distrito_esperado TEXT,
ADD COLUMN IF NOT EXISTS hipotese_esperada TEXT,
ADD COLUMN IF NOT EXISTS ferramenta_principal TEXT,
ADD COLUMN IF NOT EXISTS nivel TEXT DEFAULT 'guiado',
ADD COLUMN IF NOT EXISTS categoria TEXT;

-- Update training progress table
ALTER TABLE public.co_training_progress 
ADD COLUMN IF NOT EXISTS streak_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_training_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS activated_districts JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS certification_potential INTEGER DEFAULT 0;

-- Seed some cases
INSERT INTO public.co_camara_sussurro_casos 
(titulo, idade, contexto, fala_inicial, distrito_esperado, torre_provavel, erro_comum, pergunta_ideal, leitura_simbolica, resposta_correta, hipotese_esperada, ferramenta_principal, nivel, dificuldade, categoria, tema_emocional)
VALUES 
('O Peso do Mundo', '42 anos, Executiva', 'Sobrecarga de trabalho e sensação de paralisia.', 'Eu sinto que se eu parar um segundo, tudo desaba sobre mim.', 'Distrito do Metal', 'Torre do Trabalho', 'Tentar resolver a agenda dela.', 'O que aconteceria se você soltasse esse peso por um instante?', 'O peso é a armadura que ela usa para não sentir o vazio.', 'Reconhecer a necessidade de vulnerabilidade.', 'Auto-exigência defensiva.', 'Mapa da Sombra', 'guiado', 'iniciante', 'Profissional', 'Sobrecarga'),
('A Voz Silenciada', '28 anos, Artista', 'Bloqueio criativo e medo do julgamento.', 'Minha voz parece que ficou presa na garganta.', 'Distrito da Água', 'Torre da Criatividade', 'Incentivar ela a produzir mais.', 'Quem é a pessoa que você teme que te ouça?', 'A garganta presa é o limite imposto pelo censor interno.', 'Identificar o crítico interno.', 'Supressão da expressão por medo social.', 'Diário Simbólico', 'guiado', 'intermediario', 'Criatividade', 'Medo'),
('O Labirinto do Passado', '55 anos, Aposentado', 'Luto mal resolvido e nostalgia excessiva.', 'Eu vivo nos meus álbuns de foto. O presente não tem cor.', 'Distrito da Terra', 'Torre da Memória', 'Falar para ele focar no futuro.', 'Qual é o objeto dessa foto que mais te chama hoje?', 'O apego à terra seca do passado impede o plantio de novas sementes.', 'Transformar a saudade em legado.', 'Melancolia por estagnação.', 'Árvore Genealógica Simbólica', 'semi_guiado', 'iniciante', 'Luto', 'Nostalgia'),
('Fogo que Consome', '35 anos, Líder comunitária', 'Raiva explosiva e cansaço extremo (burnout).', 'Eu quero quebrar tudo quando as pessoas não cooperam.', 'Distrito do Fogo', 'Torre do Conflito', 'Tentar acalmá-la ou dar técnicas de respiração.', 'De onde vem esse calor que você não consegue conter?', 'O fogo é o grito de uma injustiça interna não nomeada.', 'Canalizar a raiva para a ação propositiva.', 'Reatividade por exaustão ética.', 'O Martelo e a Bigorna', 'semi_guiado', 'intermediario', 'Emocional', 'Raiva'),
('A Ilha do Isolamento', '31 anos, Programador', 'Dificuldade de conexão emocional.', 'As pessoas são imprevisíveis. Prefiro o código.', 'Distrito do Ar', 'Torre da Lógica', 'Tentar convencer ele a sair mais.', 'Como é o clima nessa ilha onde você mora?', 'O código é o escudo racional contra a dor do afeto.', 'Aceitar a imprevisibilidade do sentir.', 'Desconexão emocional defensiva.', 'Cidadela Interior', 'avançado', 'avancado', 'Relacionamentos', 'Isolamento'),
('Raízes Expostas', '19 anos, Estudante', 'Crise de identidade e conflito familiar.', 'Eu não sei quem eu sou longe da expectativa dos meus pais.', 'Distrito da Madeira', 'Torre da Origem', 'Criticar os pais dela.', 'Se você fosse uma planta, que tipo de vaso você escolheria agora?', 'A planta está crescendo mas as raízes estão presas em um vaso pequeno.', 'Diferenciação do self.', 'Simbiose familiar.', 'O Espelho de Vênus', 'guiado', 'iniciante', 'Identidade', 'Família'),
('O Espelho Quebrado', '48 anos, Dona de casa', 'Sentimento de invisibilidade.', 'Ninguém me vê. Eu sou apenas um eletrodoméstico que funciona.', 'Distrito do Metal', 'Torre da Identidade', 'Dar dicas de auto-cuidado superficial.', 'Quando você olha no espelho, quem é a primeira pessoa que desaparece?', 'A invisibilidade é o reflexo da própria desvalorização interna.', 'Reconstruir a auto-imagem além do papel social.', 'Perda de identidade nos papéis.', 'O Oráculo Pessoal', 'semi_guiado', 'intermediario', 'Autoestima', 'Invisibilidade'),
('Vento que Dispersa', '24 anos, Influencer', 'Ansiedade e falta de propósito.', 'Eu faço mil coisas e sinto que não fiz nada.', 'Distrito do Ar', 'Torre do Propósito', 'Mandar ela fazer um planejamento de tempo.', 'Qual é o centro desse redemoinho onde você está?', 'A dispersão é o medo de escolher e perder as outras possibilidades.', 'Ancorar em um propósito central.', 'Fragmentação da atenção.', 'A Bússola de Ouro', 'guiado', 'iniciante', 'Carreira', 'Ansiedade'),
('Mar de Emoções', '62 anos, Professora', 'Excesso de empatia e sofrimento vicário.', 'A dor do mundo me invade. Eu choro por tudo.', 'Distrito da Água', 'Torre da Compaixão', 'Dizer para ela ser menos sensível.', 'Onde termina o mar e onde começa a areia em você?', 'A falta de limites psíquicos faz com que ela se afogue na dor alheia.', 'Construir diques de proteção emocional.', 'Contágio emocional por falta de contorno.', 'O Cálice Sagrado', 'semi_guiado', 'avancado', 'Emocional', 'Empatia'),
('A Porta Fechada', '39 anos, Advogado', 'Racionalismo extremo e falta de sonhos.', 'Sonhar é perda de tempo. A realidade é o que importa.', 'Distrito da Terra', 'Torre do Realismo', 'Tentar forçar uma imaginação ativa.', 'O que está guardado atrás da porta que você nunca abre?', 'O realismo é a tranca de uma porta que esconde a decepção antiga.', 'Reabrir o espaço para o simbólico.', 'Atrofia da imaginação.', 'A Chave Onírica', 'avançado', 'avancado', 'Espiritualidade', 'Ceticismo');

-- Function to update training stats
CREATE OR REPLACE FUNCTION public.update_training_stats()
RETURNS TRIGGER AS $$
DECLARE
    last_date DATE;
    today_date DATE;
    current_streak INTEGER;
    distrito_nome TEXT;
    total_completed INTEGER;
BEGIN
    -- Get existing stats or initialize
    SELECT streak_days, last_training_at::DATE INTO current_streak, last_date
    FROM public.co_training_progress
    WHERE user_id = NEW.user_id;

    today_date := NOW()::DATE;

    IF NOT FOUND THEN
        -- Initialize progress if not found
        INSERT INTO public.co_training_progress (user_id, streak_days, last_training_at)
        VALUES (NEW.user_id, 1, NOW());
        current_streak := 1;
        last_date := today_date;
    ELSE
        -- Update streak logic
        IF last_date IS NULL THEN
            current_streak := 1;
        ELSIF last_date = today_date THEN
            -- Already trained today, keep current streak
        ELSIF last_date = today_date - 1 THEN
            current_streak := current_streak + 1;
        ELSE
            current_streak := 1;
        END IF;
    END IF;

    -- Update activated districts if score is high
    IF NEW.score_total >= 7 AND NEW.resposta_distrito IS NOT NULL THEN
        distrito_nome := NEW.resposta_distrito;
        
        -- Get total unique cases completed with high score
        SELECT count(DISTINCT case_id) INTO total_completed 
        FROM public.co_training_attempts 
        WHERE user_id = NEW.user_id AND score_total >= 7;

        UPDATE public.co_training_progress
        SET 
            activated_districts = (
                SELECT jsonb_agg(DISTINCT x)
                FROM (
                    SELECT jsonb_array_elements_text(COALESCE(activated_districts, '[]'::jsonb)) as x
                    UNION
                    SELECT distrito_nome
                ) sub
            ),
            streak_days = current_streak,
            last_training_at = NOW(),
            certification_potential = LEAST(100, total_completed * 2)
        WHERE user_id = NEW.user_id;
    ELSE
        UPDATE public.co_training_progress
        SET 
            streak_days = current_streak,
            last_training_at = NOW()
        WHERE user_id = NEW.user_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for training attempts
DROP TRIGGER IF EXISTS on_training_attempt_completed ON public.co_training_attempts;
CREATE TRIGGER on_training_attempt_completed
AFTER INSERT ON public.co_training_attempts
FOR EACH ROW
WHEN (NEW.status = 'concluido')
EXECUTE FUNCTION public.update_training_stats();
