-- Função para validar e ativar convite
CREATE OR REPLACE FUNCTION public.validar_e_ativar_convite(
    p_user_id UUID,
    p_codigo TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_convite_id UUID;
    v_limite_uso INTEGER;
    v_usos_realizados INTEGER;
    v_data_expiracao TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Busca o convite ativo
    SELECT id, limite_uso, usos_realizados
    INTO v_convite_id, v_limite_uso, v_usos_realizados
    FROM public.convites_fundadora
    WHERE codigo = p_codigo AND ativo = true;

    IF v_convite_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Código inválido ou inativo.');
    END IF;

    IF v_usos_realizados >= v_limite_uso THEN
        RETURN jsonb_build_object('success', false, 'error', 'Este convite atingiu o limite de usos.');
    END IF;

    -- Verifica se já possui um acesso ativo para este convite
    IF EXISTS (SELECT 1 FROM public.acessos_fundadora WHERE user_id = p_user_id AND codigo_utilizado = p_codigo AND data_expiracao > now()) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Você já possui um acesso ativo para este convite.');
    END IF;

    -- Calcula expiração
    v_data_expiracao := now() + interval '7 days';

    -- Registra o acesso
    INSERT INTO public.acessos_fundadora (user_id, codigo_id, data_ativacao, data_expiracao, codigo_utilizado)
    VALUES (p_user_id, v_convite_id, now(), v_data_expiracao, p_codigo);

    -- Incrementa uso
    UPDATE public.convites_fundadora
    SET usos_realizados = usos_realizados + 1
    WHERE id = v_convite_id;

    RETURN jsonb_build_object('success', true, 'data_expiracao', v_data_expiracao);
END;
$$;

-- RLS Adicional para Admin
CREATE POLICY "Admin pode gerenciar convites" ON public.convites_fundadora
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND portal = 'admin'));

CREATE POLICY "Admin pode ver todos os acessos" ON public.acessos_fundadora
    FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND portal = 'admin'));
