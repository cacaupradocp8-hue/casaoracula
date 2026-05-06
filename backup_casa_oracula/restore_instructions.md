# Manual de Restauração — Casa Oracula Soberana

Este manual descreve como restaurar o backup gerado a partir do Lovable Cloud (`pvjiznbfwtjqmpeiqqzk`) em seu novo Supabase Soberano (`munuccwcupigaubfuxdm`).

## Arquivos Disponíveis em `/backup_casa_oracula/`

1.  **`schema_only.sql`**: Estrutura completa (tabelas, views, triggers, RLS, enums).
2.  **`data_editorial_only.sql`**: Dados de configuração, conteúdo de cursos, oráculos e assets (Seguro para restauração imediata).
3.  **`data_sensitive_optional.sql`**: Dados de usuários, prontuários, registros de sessões e logs (Contém PII - Informações Pessoais).
4.  **`full_public_backup.sql`**: Schema + Dados de todas as tabelas públicas em um único arquivo.
5.  **`storage_manifest.csv`**: Lista de todos os arquivos presentes no Storage para conferência.
6.  **`validation_queries.sql`**: Queries para verificar se a migração ocorreu com sucesso.
7.  **`backup_report.md`**: Relatório técnico do estado do backup.

---

## Passo a Passo para Restauração Segura

### 1. Preparação do Terreno (Supabase Novo)
Recomenda-se usar um projeto Supabase **limpo**. Se houver tabelas existentes, limpe o schema `public`:
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO anon;
GRANT ALL ON SCHEMA public TO authenticated;
GRANT ALL ON SCHEMA public TO service_role;
```

### 2. Restauração da Estrutura (Schema)
Execute o conteúdo de `schema_only.sql` no SQL Editor do seu novo Supabase.
*   **Atenção**: Se houver erros de extensões (ex: `pgvector`), certifique-se de que elas estão habilitadas no painel 'Extensions' do Supabase.

### 3. Restauração dos Dados Editoriais (A Casa)
Execute `data_editorial_only.sql`. Este arquivo contém a "alma" do projeto (conteúdos, cursos, oráculos).
*   **Dica**: Como há chaves estrangeiras circulares, utilize `SET session_replication_role = 'replica';` antes do script e `SET session_replication_role = 'origin';` depois para evitar erros de constraint.

### 4. Restauração de Dados Sensíveis (Opcional)
Se decidir migrar o histórico dos usuários, execute `data_sensitive_optional.sql`.

### 5. Configuração de Auth e Storage
*   **Auth**: O Supabase não permite importar `auth.users` via SQL direto por segurança. Você precisará recriar os usuários ou usar a API de Admin para importá-los via script.
*   **Storage**: Crie os buckets manualmente (ex: `oracle-images`, `content-images`) e aplique as políticas de RLS que já estão no `schema_only.sql`.

---

## Verificação Final
Use o arquivo `validation_queries.sql` para garantir que o número de registros bate com o original.
