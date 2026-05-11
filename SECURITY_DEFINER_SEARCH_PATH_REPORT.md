# SECURITY DEFINER SEARCH PATH REPORT - Casa Orácula

## Funções Vulneráveis (Sem search_path configurado)

| Nome da Função | Schema | Uso Detectado | Risco | Sugestão |
|:---|:---|:---|:---|:---|
| `update_training_stats` | public | Trigger | Médio | `SET search_path = public` |
| `aplicar_impacto_cidadela` | public | Trigger | Médio | `SET search_path = public` |
| `get_clube_proximo_passo` | public | API/Frontend | Baixo | `SET search_path = public` |

## Trecho de Exemplo (Vulnerável)
```sql
CREATE OR REPLACE FUNCTION public.update_training_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 -- FALTANDO: SET search_path = public
AS $function$
...
```

## Impacto
Sem o `search_path`, o PostgreSQL procura objetos nos schemas definidos na sessão do usuário que chama a função. Se um atacante conseguir criar uma tabela com o mesmo nome em um schema temporário, ele pode desviar o comportamento da função.

---
*Apenas diagnóstico. Nenhuma alteração foi realizada.*
