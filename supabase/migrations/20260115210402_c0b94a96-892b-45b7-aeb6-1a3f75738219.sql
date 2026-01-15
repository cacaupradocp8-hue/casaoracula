-- Tabela para conteúdo editável da página de vendas ORÁCULA
CREATE TABLE public.formacao_oracula_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.formacao_oracula_content ENABLE ROW LEVEL SECURITY;

-- Política: qualquer um pode ler (página pública)
CREATE POLICY "Public read access for formacao content"
ON public.formacao_oracula_content
FOR SELECT
USING (true);

-- Política: apenas admin pode editar
CREATE POLICY "Admin can manage formacao content"
ON public.formacao_oracula_content
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Inserir conteúdo padrão
INSERT INTO public.formacao_oracula_content (section_key, content) VALUES
('hero', '{
  "titulo": "ORÁCULA — A Formação que une Psique Feminina, Arquétipos, Contos de Poder e Tecnologia Viva",
  "subtitulo": "Uma certificação para terapeutas, psicólogas e mentoras do feminino que querem profundidade simbólica, método aplicável e um APP profissional para sustentar sua prática.",
  "cta_texto": "Quero entrar na Formação ORÁCULA"
}'::jsonb),

('vsl', '{
  "video_url": "",
  "texto_acima": "Assista ao vídeo e entenda por que a ORÁCULA não é um curso comum — é uma travessia.",
  "texto_abaixo": "Essa formação não ensina técnicas soltas. Ela forma terapeutas simbólicas com método, ética e presença.",
  "cta_texto": "Entrar na Formação ORÁCULA"
}'::jsonb),

('o_que_e', '{
  "titulo": "O que é a Formação ORÁCULA",
  "items": [
    "Formação profissional (não autoajuda)",
    "Base simbólica, arquetípica e narrativa",
    "Aplicável em atendimentos individuais e grupos",
    "Integra tecnologia (APP) + clínica simbólica",
    "Forma terapeutas com identidade, método e linguagem própria"
  ]
}'::jsonb),

('app_diferencial', '{
  "titulo": "O APP Casa Orácula",
  "subtitulo": "O app não é bônus. Ele é parte do método.",
  "items": [
    {"icone": "users", "texto": "Gestão de clientes (modelo autônomo)"},
    {"icone": "compass", "texto": "Ferramentas: Big5, Eneagrama, Oráculos, Rituais"},
    {"icone": "book-open", "texto": "Biblioteca simbólica"},
    {"icone": "flask-conical", "texto": "Laboratório de Leitura (criado pelo admin)"},
    {"icone": "sparkles", "texto": "Agentes de IA (SYNTHEIA: Ferramenteira, Archétypos, Aracne & Arcano)"},
    {"icone": "lock", "texto": "Área privada da terapeuta"},
    {"icone": "trending-up", "texto": "Evolução da aluna dentro da formação"}
  ]
}'::jsonb),

('para_quem', '{
  "titulo": "Para quem é",
  "incluidos": [
    "Terapeutas",
    "Psicólogas",
    "Mentoras do feminino",
    "Facilitadoras de círculos",
    "Profissionais do simbólico e do cuidado"
  ],
  "excluidos": "Não é para curiosas ou consumo superficial."
}'::jsonb),

('o_que_recebe', '{
  "titulo": "O que você recebe",
  "items": [
    "Formação ORÁCULA completa",
    "Acesso ao App Casa Orácula",
    "Ferramentas ilimitadas durante o período contratado",
    "Conteúdos formativos + aplicação prática",
    "Linguagem simbólica + método estruturado"
  ]
}'::jsonb),

('planos', '{
  "titulo": "Escolha seu caminho",
  "planos": [
    {
      "nome": "FUNDADORAS",
      "preco": "R$ 1.500",
      "periodo": "1 ano de acesso",
      "destaque": true,
      "items": [
        "Formação ORÁCULA",
        "App com arsenal ilimitado por 1 ano",
        "Acesso especial de fundadora"
      ],
      "checkout_url": ""
    },
    {
      "nome": "MENTORIA",
      "preco": "R$ 2.500",
      "periodo": "2 anos de acesso",
      "destaque": false,
      "items": [
        "Formação ORÁCULA",
        "Mentoria",
        "App por 2 anos"
      ],
      "checkout_url": ""
    },
    {
      "nome": "ASSINATURA",
      "preco": "R$ 49,90",
      "periodo": "por mês",
      "destaque": false,
      "items": [
        "Acesso contínuo ao App",
        "Após término dos acessos anteriores"
      ],
      "checkout_url": ""
    }
  ]
}'::jsonb),

('autoridade', '{
  "texto": "ORÁCULA é uma formação que respeita o simbólico, a clínica, a ética e o tempo da psique. Não acelera processos — sustenta travessias."
}'::jsonb),

('faq', '{
  "titulo": "Perguntas Frequentes",
  "items": [
    {"pergunta": "Isso substitui terapia?", "resposta": "Não. A formação ORÁCULA é uma ferramenta profissional para terapeutas, não substitui acompanhamento terapêutico pessoal."},
    {"pergunta": "Preciso ser psicóloga?", "resposta": "Não necessariamente. A formação é para profissionais do cuidado que trabalham com o simbólico de forma ética e responsável."},
    {"pergunta": "O app fala com minhas clientes?", "resposta": "Não. O app é uma ferramenta privada da terapeuta. Suas clientes não têm acesso direto ao sistema."},
    {"pergunta": "É vitalício?", "resposta": "O acesso depende do plano escolhido. Fundadoras têm 1 ano, Mentoria 2 anos, e a Assinatura é contínua enquanto ativa."},
    {"pergunta": "Posso usar em grupo?", "resposta": "Sim. As ferramentas e metodologias podem ser adaptadas tanto para atendimentos individuais quanto para círculos e grupos."}
  ]
}'::jsonb);

-- Trigger para updated_at
CREATE TRIGGER update_formacao_oracula_content_updated_at
  BEFORE UPDATE ON public.formacao_oracula_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();