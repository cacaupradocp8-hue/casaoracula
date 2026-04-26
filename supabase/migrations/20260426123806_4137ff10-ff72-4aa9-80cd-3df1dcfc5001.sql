ALTER TABLE public.clube_estacoes 
ADD COLUMN quiz_id UUID REFERENCES public.quizzes(id),
ADD COLUMN cartografia_id UUID REFERENCES public.cartographies(id);