# ESTRUTURA_PORTAIS

## 1. Portais Disponíveis
- **Visitante:** Acesso público e degustação.
- **Aluna:** Cursos livres e jornadas específicas.
- **Assinante:** Conteúdo recorrente do Clube Premium.
- **Orácula:** Formação avançada e certificação.

## 2. Hierarquia de Acesso
Usuárias podem ter múltiplos portais, mas o sistema prioriza o maior nível de acesso no login (Orácula > Assinante > Aluna > Visitante).

## 3. Sincronização de Dados
O campo `portal` em `profiles` e `user_roles` deve estar sempre em sincronia para garantir o funcionamento correto do sistema de permissões.
