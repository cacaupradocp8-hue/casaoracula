
-- Restaura execução de funções críticas para o funcionamento do app
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO public;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO public;

-- Garante que outras funções auxiliares usadas em RLS/Triggers estejam disponíveis
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO public;
