# CICLO SALA DE TREINAMENTO V0.2 — ENCERRAMENTO

## 1. Estado final
A Sala de Treinamento V0.2 está encerrada, documentada e congelada como primeira versão persistente da camada pedagógica da Casa Orácula 2.0.

## 2. Escopo concluído
- persistência de progresso pedagógico;
- persistência de submissões pedagógicas;
- histórico por módulo;
- arquivamento lógico;
- isolamento por usuária;
- RLS aplicada;
- ausência de dados reais;
- ausência de Atlas;
- ausência de IA;
- documentação técnica em `docs/SALA_TREINAMENTO_V0_2.md`.

## 3. Módulos fechados
| Módulo | Página | module_key | Estado | Observação |
| :--- | :--- | :--- | :--- | :--- |
| Laboratório dos Contos | `src/pages/ClinicaDosContosPage.tsx` | `clinica-dos-contos` | Fechado | Persistência e histórico integrados. |
| Casos Simulados | `src/pages/CasosSimuladosPage.tsx` | `casos-simulados` | Fechado | Persistência e histórico integrados. |
| Formulação Guiada | `src/pages/FormulacaoGuiadaPage.tsx` | `formulacao-guiada` | Fechado | Persistência e histórico integrados. |

## 4. Guardrails congelados
Registra-se que continuam proibidos dentro da V0.2:
- dados reais de clientes;
- nomes reais;
- diagnósticos;
- CID/DSM;
- prontuário;
- relatório clínico;
- envio ao Atlas;
- envio à IA;
- Syntheia;
- feedback automatizado;
- exportação de respostas;
- dashboard administrativo;
- alteração de RLS;
- alteração de schema.

## 5. Ficheiros principais do ciclo
- `src/pages/ClinicaDosContosPage.tsx`
- `src/pages/CasosSimuladosPage.tsx`
- `src/pages/FormulacaoGuiadaPage.tsx`
- `src/hooks/useTrainingData.ts`
- `src/services/trainingService.ts`
- `src/types/training.ts`
- `supabase/migrations/20260523150000_create_training_persistence_v0_2.sql`
- `docs/SALA_TREINAMENTO_V0_2.md`

## 6. Estado de portabilidade
A implementação está preparada para saída futura do Lovable porque possui:
- migration versionada;
- service React/Supabase padrão;
- hooks reutilizáveis;
- documentação técnica;
- RLS explícita;
- ausência de dependência oculta do Lovable.

## 7. Próximos ciclos possíveis
As seguintes possibilidades futuras foram mapeadas (sem execução neste ciclo):
- Auditoria global da Casa Orácula 2.0 pós-V0.2;
- Rotas da Casa V0.2;
- Formação Orácula V0.2;
- Atlas Orácula V0.2, somente com auditoria ética própria;
- painel administrativo pedagógico, somente com nova RLS;
- IA/Syntheia, somente em ciclo separado e com guardrails próprios.

## 8. Decisão final
`SALA_TREINAMENTO_V0_2_CLOSED`
