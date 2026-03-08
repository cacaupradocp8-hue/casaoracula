
CREATE TABLE public.inventario_personas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE NOT NULL,
  therapist_id UUID NOT NULL,
  contextos_personas JSONB NOT NULL DEFAULT '[]'::jsonb,
  analise_discrepancia TEXT,
  custo_energetico TEXT,
  sombra_revelada TEXT,
  pergunta_incomoda_resposta TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.inventario_personas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapist manages own inventories"
  ON public.inventario_personas
  FOR ALL
  TO authenticated
  USING (therapist_id = auth.uid() OR public.is_admin(auth.uid()))
  WITH CHECK (therapist_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE TRIGGER update_inventario_personas_updated_at
  BEFORE UPDATE ON public.inventario_personas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
