
-- =====================================================
-- PROFESSIONAL EDITION: FEMININE ENNEAGRAM
-- Extends archetipos with practitioner-only content
-- =====================================================

-- Add professional-only columns to eneagrama_feminino_arquetipos
ALTER TABLE public.eneagrama_feminino_arquetipos
ADD COLUMN IF NOT EXISTS notas_leitura TEXT,
ADD COLUMN IF NOT EXISTS transferencias_comuns TEXT,
ADD COLUMN IF NOT EXISTS resistencias_tipicas TEXT,
ADD COLUMN IF NOT EXISTS linguagem_evitar TEXT,
ADD COLUMN IF NOT EXISTS linguagem_que_abre TEXT,
ADD COLUMN IF NOT EXISTS cautelas_eticas TEXT,
ADD COLUMN IF NOT EXISTS perguntas_abertura TEXT[],
ADD COLUMN IF NOT EXISTS espelhos_simbolicos TEXT[],
ADD COLUMN IF NOT EXISTS prompts_reenquadramento TEXT[],
ADD COLUMN IF NOT EXISTS convites_integracao TEXT[],
ADD COLUMN IF NOT EXISTS ritual_encerramento TEXT;

-- Create session guidance table for dynamic professional content
CREATE TABLE IF NOT EXISTS public.eneagrama_feminino_orientacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    arquetipo_id UUID REFERENCES public.eneagrama_feminino_arquetipos(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('abertura', 'espelho', 'reenquadramento', 'integracao', 'encerramento')),
    titulo TEXT,
    texto TEXT NOT NULL,
    ordem INTEGER DEFAULT 0,
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.eneagrama_feminino_orientacoes ENABLE ROW LEVEL SECURITY;

-- Professionals and admins can read orientacoes
CREATE POLICY "Professionals can read orientacoes"
    ON public.eneagrama_feminino_orientacoes
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.confirmacao_profissional
            WHERE user_id = auth.uid() AND aceita_codigo_etico = true
        )
        OR get_user_portal(auth.uid()) = 'admin'::portal_type
    );

-- Admins can manage orientacoes
CREATE POLICY "Admins can manage orientacoes"
    ON public.eneagrama_feminino_orientacoes
    FOR ALL
    USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

-- Add updated_at trigger
CREATE TRIGGER update_eneagrama_feminino_orientacoes_updated_at
    BEFORE UPDATE ON public.eneagrama_feminino_orientacoes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add mode column to registros table to distinguish professional sessions
ALTER TABLE public.eneagrama_feminino_registros
ADD COLUMN IF NOT EXISTS modo_aplicacao TEXT DEFAULT 'pessoal' CHECK (modo_aplicacao IN ('pessoal', 'profissional')),
ADD COLUMN IF NOT EXISTS notas_profissionais TEXT,
ADD COLUMN IF NOT EXISTS campo_tensao TEXT,
ADD COLUMN IF NOT EXISTS vetor_integracao TEXT;

-- Insert sample professional orientations for each archetype
-- (Admin can edit these)
INSERT INTO public.eneagrama_feminino_orientacoes (arquetipo_id, tipo, titulo, texto, ordem) 
SELECT 
    id,
    'abertura',
    'Pergunta de Abertura',
    CASE numero
        WHEN 1 THEN 'O que você sente quando não consegue cuidar de alguém?'
        WHEN 2 THEN 'Como é quando você se sente invisível?'
        WHEN 3 THEN 'O que acontece quando você não atinge suas metas?'
        WHEN 4 THEN 'O que você faz com a sensação de não pertencer?'
        WHEN 5 THEN 'Como é quando o mundo exige demais de você?'
        WHEN 6 THEN 'O que você faz quando não sabe em quem confiar?'
        WHEN 7 THEN 'Como é quando a alegria não está disponível?'
        WHEN 8 THEN 'O que você sente quando se percebe vulnerável?'
        WHEN 9 THEN 'Como é quando há conflito ao seu redor?'
        ELSE 'O que você sente neste momento?'
    END,
    1
FROM public.eneagrama_feminino_arquetipos;

INSERT INTO public.eneagrama_feminino_orientacoes (arquetipo_id, tipo, titulo, texto, ordem)
SELECT 
    id,
    'espelho',
    'Espelho Simbólico',
    CASE numero
        WHEN 1 THEN 'Percebo uma parte de você que cuida de todos — e esquece de ser cuidada.'
        WHEN 2 THEN 'Vejo uma força que conquista para ser vista — quando talvez queira apenas ser.'
        WHEN 3 THEN 'Sinto uma busca por reconhecimento — que talvez seja um pedido de amor.'
        WHEN 4 THEN 'Noto uma profundidade que pode parecer peso — mas é também sua riqueza.'
        WHEN 5 THEN 'Percebo um recolhimento protetor — que talvez guarde tesouros não nomeados.'
        WHEN 6 THEN 'Vejo uma vigilância constante — que talvez seja uma forma de cuidar do mundo.'
        WHEN 7 THEN 'Sinto uma alegria que se move rápido — talvez para não tocar em algo mais fundo.'
        WHEN 8 THEN 'Noto uma força que protege — e talvez também precise ser protegida.'
        WHEN 9 THEN 'Percebo uma paz que harmoniza tudo — e às vezes esquece de si mesma.'
        ELSE 'Percebo algo em você que pede atenção.'
    END,
    1
FROM public.eneagrama_feminino_arquetipos;

INSERT INTO public.eneagrama_feminino_orientacoes (arquetipo_id, tipo, titulo, texto, ordem)
SELECT 
    id,
    'encerramento',
    'Ritual de Encerramento',
    CASE numero
        WHEN 1 THEN 'Convide-a a receber algo sem precisar retribuir hoje.'
        WHEN 2 THEN 'Convide-a a nomear um desejo que não depende de agradar alguém.'
        WHEN 3 THEN 'Convide-a a pausar e sentir valor sem realizar.'
        WHEN 4 THEN 'Convide-a a celebrar algo ordinário e belo.'
        WHEN 5 THEN 'Convide-a a compartilhar algo de seu mundo interior.'
        WHEN 6 THEN 'Convide-a a confiar em algo sem prova.'
        WHEN 7 THEN 'Convide-a a estar presente em algo difícil sem fugir.'
        WHEN 8 THEN 'Convide-a a pedir ajuda de forma genuína.'
        WHEN 9 THEN 'Convide-a a afirmar uma preferência pessoal.'
        ELSE 'Convide-a a honrar o que foi visto hoje.'
    END,
    1
FROM public.eneagrama_feminino_arquetipos;

-- Update sample professional notes for each archetype
UPDATE public.eneagrama_feminino_arquetipos SET
    notas_leitura = CASE numero
        WHEN 1 THEN 'Observe a dificuldade em receber. O cuidado pode ser mecanismo de controle. Sustente pausas antes de oferecer soluções.'
        WHEN 2 THEN 'Atenção à sedução relacional. A conquista pode mascarar ferida de rejeição. Nomeie o desejo subjacente.'
        WHEN 3 THEN 'Cuidado com a performance. O sucesso pode esconder vazio identitário. Pergunte sobre momentos de pausa.'
        WHEN 4 THEN 'Respeite a profundidade sem patologizar. A melancolia pode ser portal. Evite pressa em "resolver".'
        WHEN 5 THEN 'Não force exposição. O recolhimento é proteção legítima. Ofereça perguntas, não invasão.'
        WHEN 6 THEN 'Sustente a confiança gradualmente. A desconfiança protegeu algo. Seja consistente, não excessivamente acolhedora.'
        WHEN 7 THEN 'Não compre a alegria performática. Por trás pode haver dor não metabolizada. Pergunte sobre o que evita.'
        WHEN 8 THEN 'Não recue da intensidade. A força esconde vulnerabilidade. Nomeie a proteção como recurso, não falha.'
        WHEN 9 THEN 'Não confunda paz com ausência de conflito interno. Pergunte sobre preferências próprias. Sustente silêncios.'
        ELSE 'Observe os padrões com curiosidade, não julgamento.'
    END,
    transferencias_comuns = CASE numero
        WHEN 1 THEN 'Pode tentar cuidar da facilitadora. Risco de inversão de papéis.'
        WHEN 2 THEN 'Pode seduzir ou buscar aprovação da facilitadora.'
        WHEN 3 THEN 'Pode tentar impressionar ou competir com a facilitadora.'
        WHEN 4 THEN 'Pode projetar incompreensão ou sentir-se "demais".'
        WHEN 5 THEN 'Pode se retrair ou sentir a facilitadora como invasiva.'
        WHEN 6 THEN 'Pode testar a confiabilidade da facilitadora.'
        WHEN 7 THEN 'Pode desviar do desconforto com humor ou mudança de assunto.'
        WHEN 8 THEN 'Pode testar limites ou desafiar a facilitadora.'
        WHEN 9 THEN 'Pode concordar excessivamente para evitar atrito.'
        ELSE 'Observe a dinâmica transferencial com atenção.'
    END,
    linguagem_evitar = CASE numero
        WHEN 1 THEN 'Evite: "Você precisa cuidar mais de si" (reforça culpa). Evite: "Você é tão generosa" (reforça padrão).'
        WHEN 2 THEN 'Evite: "Você não precisa agradar" (fecha o canal). Evite: Elogios superficiais.'
        WHEN 3 THEN 'Evite: "Sucesso não é tudo" (invalida). Evite: Comparações com outras pessoas.'
        WHEN 4 THEN 'Evite: "Todos se sentem assim" (minimiza). Evite: Pressa em "resolver" a melancolia.'
        WHEN 5 THEN 'Evite: "Você precisa se abrir mais" (invasivo). Evite: Perguntas demais de uma vez.'
        WHEN 6 THEN 'Evite: "Relaxa, não precisa se preocupar" (invalida). Evite: Respostas evasivas.'
        WHEN 7 THEN 'Evite: "Você está fugindo" (acusa). Evite: Entrar no jogo da leveza superficial.'
        WHEN 8 THEN 'Evite: "Você é muito intensa" (patologiza). Evite: Recuar da confrontação direta.'
        WHEN 9 THEN 'Evite: "O que VOCÊ quer?" (pode paralisar). Evite: Aceitar a harmonia superficial.'
        ELSE 'Evite linguagem que feche mais do que abre.'
    END,
    linguagem_que_abre = CASE numero
        WHEN 1 THEN '"O que você sente quando é cuidada?" / "Quem cuidou de você quando era pequena?"'
        WHEN 2 THEN '"O que você desejaria se ninguém estivesse olhando?" / "Como é quando não precisa conquistar?"'
        WHEN 3 THEN '"Quem você é quando não está realizando?" / "O que você sente no intervalo entre metas?"'
        WHEN 4 THEN '"O que a profundidade te ensinou?" / "O que há de belo no comum?"'
        WHEN 5 THEN '"O que você gostaria de compartilhar do seu mundo?" / "Como é quando você se sente segura?"'
        WHEN 6 THEN '"O que te ajuda a confiar?" / "Quando você sabe que pode relaxar?"'
        WHEN 7 THEN '"O que você não quer olhar?" / "O que acontece quando para?"'
        WHEN 8 THEN '"Quem protege você?" / "Como é ser vulnerável com alguém seguro?"'
        WHEN 9 THEN '"Se ninguém precisasse de você, o que escolheria?" / "O que te irrita mas você não diz?"'
        ELSE '"O que esse padrão protegia em você?"'
    END,
    cautelas_eticas = CASE numero
        WHEN 1 THEN 'Risco de burnout. Se houver sinais de exaustão severa, considere encaminhamento.'
        WHEN 2 THEN 'Atenção a histórico de relações abusivas. A sedução pode ser sobrevivência.'
        WHEN 3 THEN 'Cuidado com idealização da facilitadora. Pode projetar figura de sucesso.'
        WHEN 4 THEN 'Se houver ideação suicida ou automutilação, protocolo clínico imediato.'
        WHEN 5 THEN 'Respeite os limites. Não confunda recolhimento com resistência patológica.'
        WHEN 6 THEN 'Se houver paranoia significativa, avaliar encaminhamento psiquiátrico.'
        WHEN 7 THEN 'Atenção a comportamentos aditivos. A fuga pode mascarar trauma.'
        WHEN 8 THEN 'Se houver histórico de violência (sofrida ou praticada), trabalho cuidadoso.'
        WHEN 9 THEN 'Atenção a dissociação. A "paz" pode ser desconexão do corpo.'
        ELSE 'Observe sinais de sofrimento que excedam o escopo simbólico.'
    END
WHERE numero BETWEEN 1 AND 9;
