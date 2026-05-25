# Auditoria de Blocos Simbólicos e Narrativos — Etapa 148

## 1. Resumo executivo

A auditoria dos blocos `BussolaAtual`, `JornadaRecomendada`, `SuaVozResumo` e do hook `useBussolaOracular` confirma que os componentes são **funcionalmente seguros** e não realizam chamadas externas a IA ou dados protegidos (Casa das Máquinas). 

Entretanto, foi identificado um **risco de domínio linguístico**: o código interno e alguns comentários ainda utilizam terminologia "clínica" (ex: `AlertaClinico`, `gerarLeituraClinica`), o que diverge da diretriz de simplificação e migração para o domínio simbólico/pedagógico da habitante.

Os blocos não competem agressivamente com a Cidadela, mas alguns (como `SuaVozResumo`) apresentam redundância que pode ser simplificada em fases futuras.

## 2. Mapa técnico

| Componente | Caminho | Dados usados | Usa IA? | Altera dados? | Risco | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `BussolaAtual` | `src/components/bussola-home/BussolaAtual.tsx` | Territórios, Nível Integração | Não | Não | Baixo (Linguagem) | `KEEP_AS_LIGHT_SYMBOLIC_SIGNAL` |
| `JornadaRecomendada` | `src/components/bussola-home/JornadaRecomendada.tsx` | Livro do Ciclo Ativo | Não | Não | Zero | `KEEP_AS_LIGHT_SYMBOLIC_SIGNAL` |
| `SuaVozResumo` | `src/components/bussola-home/SuaVozResumo.tsx` | Arquétipo de entrada | Não | Não | Baixo (Redundância) | `SIMPLIFY_TO_CTA_LATER` |
| `AlertaOracular` | `src/components/bussola-home/AlertaOracular.tsx` | Alertas de Tensão | Não | Não | Médio (Linguagem) | `NEEDS_TEXT_REVIEW` |
| `useBussolaOracular` | `src/hooks/useBussolaOracular.ts` | Supabase (Auto-mapeamento) | Não | Não | Médio (Domínio) | `NEEDS_DOMAIN_REVIEW` |

## 3. Análise por bloco

### BussolaAtual
- **Função atual**: Oferecer um resumo do "território dominante" e do estado de integração.
- **Dados usados**: JSON de distritos e metadados de cartografia.
- **Risco**: Contém o termo "Leitura clínica direta" em comentário de código e utiliza função homônima no hook.
- **Duplicação com Cidadela**: Baixa (é um resumo executivo).
- **Recomendação**: Permanecer, mas renomear "Leitura Clínica" para "Sinal da Casa" ou "Leitura Simbólica".

### JornadaRecomendada
- **Função atual**: CTA para o Clube do Livro/Ciclo ativo.
- **Dados usados**: Tabela `clube_estacoes`.
- **Risco**: Nenhum.
- **Duplicação com Cidadela**: Nenhuma (foco em conteúdo).
- **Recomendação**: Manter como está.

### SuaVozResumo
- **Função atual**: Mostrar o arquétipo/voz da usuária.
- **Dados usados**: Perfil (entry_archetype).
- **Risco**: Redundância com o "Mapa Vivo" e a própria Cidadela.
- **Duplicação com Cidadela**: Alta (o arquétipo é o coração da Cidadela).
- **Recomendação**: Mover para a Cidadela em Fase 2 ou simplificar para um selo discreto no Dashboard.

## 4. Auditoria de linguagem

### Termos Problemáticos Encontrados
- `AlertaClinico` (Interface no hook)
- `gerarLeituraClinica` (Função no hook)
- `gerarAlertasClinicosFromEstado` (Função no hook)
- `// Leitura clínica direta` (Comentário no componente `BussolaAtual`)
- `// LEITURA DO MOMENTO — Clínica e direta` (Comentário no hook)

### Termos Seguros Encontrados
- `Território`
- `Travessia`
- `Integração`
- `Bússola`
- `Voz`
- `Jornada`

## 5. Comparação com Cidadela

| Bloco | Relação com Cidadela | Duplicação? | Ação futura recomendada |
| :--- | :--- | :--- | :--- |
| `BussolaAtual` | Resumo da posição no mapa. | Complementar | Manter como sinal leve. |
| `JornadaRecomendada`| Conteúdo pedagógico. | Não | Manter como CTA operacional. |
| `SuaVozResumo` | Identidade arquetípica. | Sim | Mover para a Cidadela. |
| `AlertaOracular` | Avisos de tensão no mapa. | Complementar | Renomear terminologia interna. |

## 6. Riscos encontrados

- **SHOULD_FIX_BEFORE_DASHBOARD_PHASE_2**: A terminologia "clínica" no código e comentários deve ser substituída por termos simbólicos/pedagógicos para evitar confusão de domínios.
- **OPTIONAL_IMPROVEMENT**: Desacoplar `SuaVozResumo` do Dashboard para centralizar a identidade na Cidadela.

## 7. Decisão final

Classificação: `DASHBOARD_SYMBOLIC_BLOCKS_NEED_TEXT_REVIEW`

## 8. Próximo prompt sugerido

"Execute a Etapa 149: Refatorar o hook `useBussolaOracular` e o componente `BussolaAtual` para remover toda terminologia 'clínica' do código e comentários, substituindo por termos do domínio simbólico (ex: `SinalDaCasa`, `LeituraSimbólica`, `AvisoDeTensão`)."

## Validação técnica

- `npx tsc --noEmit`: Sucesso.
- `npm run build`: Sucesso.
- Zero alterações em código ou banco de dados nesta etapa de auditoria.
