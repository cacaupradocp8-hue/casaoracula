# RLS POLICIES AUDIT REPORT - Casa Orácula

## 1. Tabelas com RLS Habilitado (OK)
- `profiles`
- `session_cases`
- `community_posts`
- `user_roles`
- `clube_rota_itens`

## 2. Tabelas sem RLS (Auditadas)
- `email_logs`: Geralmente usado para auditoria interna.
- `pgmq` tables: Gerenciadas internamente pela fila de e-mail.
- Tabelas de configuração global (AI settings).

## 3. Tabelas Sensíveis sem Política
- Nenhuma tabela com PII (Dados Pessoais Identificáveis) críticos foi encontrada sem proteção total, mas recomenda-se habilitar RLS em `email_logs` para evitar leitura por usuários autenticados sem privilégios.

## 4. Políticas por Tabela (Exemplo: Profiles)
- `Users can view their own profile`: (auth.uid() = id) - **Correto**
- `Users can update their own profile`: (auth.uid() = id) - **Correto**

## 5. Políticas Permissivas
- Foram detectadas políticas que permitem `SELECT` baseado em `portal` (ex: `is_admin()`). Estão corretas para a lógica de negócio, mas dependem da integridade da tabela `user_roles`.

---
*Apenas diagnóstico. Nenhuma alteração foi realizada.*
