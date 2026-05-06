-- 08_schema_storage_buckets_policies.sql
-- Objetivo: Criar buckets e políticas de segurança de arquivos.
-- Comandos: ~10 comandos.
-- Execução: Requer RLS (Bloco 07).
-- Dependências: Nenhuma técnica, mas recomendável após RLS.
-- Risco: Médio (Links quebrados se as políticas de SELECT falharem).
-- Validação: Verificar buckets em Storage no painel.

-- Criação via RPC (Caso o usuário prefira SQL)
-- Nota: Buckets geralmente são criados via Painel, mas aqui deixamos as políticas.

-- Políticas para oracle-images (Público)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('oracle-images', 'oracle-images', true);

CREATE POLICY "Oracle Images are Public"
ON storage.objects FOR SELECT
USING (bucket_id = 'oracle-images');

-- Políticas para audios (Privado)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('audios', 'audios', false);

CREATE POLICY "Authenticated users can read audios"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'audios');
