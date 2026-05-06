# Plano de Exportação de Storage — Casa Oracula

Para mover os arquivos físicos do Lovable Cloud para seu Supabase soberano, siga este plano:

## Buckets Necessários
Crie os seguintes buckets no novo Supabase (com acesso público se desejar manter URLs acessíveis):
- `oracle-images`
- `content-images`
- `clube-assets`
- `audios`

## Método de Migração Recomendado
Como o volume de arquivos é significativo, utilize a CLI do Supabase para fazer o download e upload em massa:

1. **Download do Antigo:**
   ```bash
   # Exemplo para bucket oracle-images
   supabase storage cp -r ss:///oracle-images ./local-backup/oracle-images
   ```

2. **Upload para o Novo:**
   ```bash
   # Configure a CLI para o novo projeto (munuccwcupigaubfuxdm)
   supabase storage cp -r ./local-backup/oracle-images ss:///oracle-images
   ```

## Referências no Banco
O arquivo `schema_only.sql` já contém as definições de RLS. Ao restaurar os dados, as tabelas que referenciam caminhos de arquivos (como `oracle_cards`) apontarão para os caminhos corretos, desde que os nomes dos buckets sejam idênticos.
