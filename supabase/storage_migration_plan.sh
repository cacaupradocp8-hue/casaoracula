# Plano de Migração de Storage Soberano
# Este script deve ser executado via Supabase CLI após o 'db push'

# 1. Criação dos Buckets no Novo Projeto
# oracle-images (Público)
# content-images (Público)
# clube-assets (Público)
# audios (Privado - Requer Auth)

echo "Criando buckets..."
# supabase storage buckets create oracle-images --public true
# supabase storage buckets create content-images --public true
# supabase storage buckets create clube-assets --public true
# supabase storage buckets create audios --public false

# 2. Estratégia de Cópia
# Utilizar o comando 'supabase storage cp' ou script de stream (Node.js) para baixar da origem e subir no destino.
# Ordem: Baixar oracle-images -> Validar contagem (49) -> Subir oracle-images.

# 3. Validação
# - Comparar número de arquivos (Origem vs Destino).
# - Testar link público de uma carta: https://[NOVO_ID].supabase.co/storage/v1/object/public/oracle-images/oracle-cards/exemplo.jpg
# - Testar acesso privado a um áudio via painel admin.
