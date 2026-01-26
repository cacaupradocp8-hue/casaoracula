
# Plano: Registrar Big Five Funcional na Tabela de Ferramentas

## Problema Identificado

A ferramenta **Big Five — Leitura Funcional** foi criada com:
- Tabelas no banco de dados (dimensoes, perguntas, registros)
- Hook de logica (`useBig5Funcional.ts`)
- Pagina funcional (`Big5Funcional.tsx`)
- Rota configurada (`/ferramenta/big5-funcional`)

Porem, **nao foi registrada** na tabela `sala_ferramentas`, que e a fonte de dados usada pelo Hub de Ferramentas (`/ferramentas`) para listar as ferramentas disponiveis.

## Regras do Hub de Ferramentas

O Hub so exibe ferramentas que atendam **todos** os criterios:
1. `ativa = true`
2. `tipo_ferramenta` preenchido (nao nulo)
3. `finalidade_pratica` preenchido (nao nulo)

## Solucao

Inserir um registro na tabela `sala_ferramentas` com os dados completos da ferramenta:

| Campo | Valor |
|-------|-------|
| ferramenta_chave | big5_funcional |
| ferramenta_nome | Big Five — Leitura Funcional |
| ferramenta_descricao | Questionario funcional OCEAN de 30 perguntas com linguagem contemporanea e profissional |
| icone | Brain (ou emoji adequado) |
| rota | /ferramenta/big5-funcional |
| tipo | diagnostico |
| tipo_ferramenta | diagnostico |
| origem_metodologica | padrao_psicologico |
| finalidade_pratica | Mapear tendencias comportamentais atraves do modelo OCEAN de forma funcional e profissional |
| portal_minimo | pre_iniciada |
| ordem | 2 (apos Big 5 padrao) |
| ativa | true |
| slug | big5-funcional |

## Onde Aparecera

A ferramenta sera exibida na secao **Mapas da Psique** do Hub, pois `tipo_ferramenta = diagnostico` direciona para esta categoria.

## Implementacao

Uma unica migracao SQL para inserir o registro na tabela `sala_ferramentas`.

## Resultado Esperado

Ao acessar `/ferramentas`, a ferramenta **Big Five — Leitura Funcional** aparecera ao lado das outras ferramentas de mapeamento, com acesso direto a rota `/ferramenta/big5-funcional`.
