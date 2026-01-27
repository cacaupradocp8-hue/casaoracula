
# Plano: Estrutura Completa dos 12 Ciclos do Clube do Livro Oracular

## Situacao Atual

O banco de dados ja possui:
- 1 ciclo cadastrado: "Mulheres que Correm com Lobos" (id: 9ab2832e-...)
- 5 fases neste ciclo (4 padrao + 1 manual)
- Estrutura de tabelas completa para ciclos, fases, perguntas, escutas e encontros
- Campos clinicos disponiveis (orientacao_clinica_uso, evitar, riscos, indicado, contraindicado)
- Campos de semana disponiveis (numero_semana, leitura_orientada, alerta_clinico, etc.)

## O Que Sera Criado

### 1. Botao de Importacao em Massa no Admin

Adicionar um botao **"Importar Calendario Anual"** no AdminClubeLivroTab que:
- Cria automaticamente os 12 ciclos com titulos, autores e temas simbolicos
- Gera as 4 semanas padrao para cada ciclo com a estrutura especificada
- Preenche os campos clinicos basicos para livros que precisam
- Define datas de inicio/fim baseadas em ciclos de 6 semanas

### 2. Dados dos 12 Ciclos

```text
CICLO 1 - DESPERTAR
  Livro: Mulheres que Correm com os Lobos
  Autor: Clarissa Pinkola Estes
  Tema: DESPERTAR

CICLO 2 - COLAPSO DO PERSONAGEM
  Livro: O Codigo do Ser
  Autor: James Hillman
  Tema: COLAPSO DO PERSONAGEM

CICLO 3 - CORPO & SOMBRA
  Livro: A Coruja Era Filha do Padeiro
  Autor: Marion Woodman
  Tema: CORPO & SOMBRA

CICLO 4 - ESPACO POTENCIAL
  Livro: O Brincar e a Realidade
  Autor: Donald Winnicott
  Tema: ESPACO POTENCIAL

CICLO 5 - DESEJO & AMBIVALENCIA
  Livro: Inteligencia Erotica
  Autor: Esther Perel
  Tema: DESEJO & AMBIVALENCIA

CICLO 6 - QUEDA & DIGNIDADE
  Livro: O Acontecimento
  Autor: Annie Ernaux
  Tema: QUEDA & DIGNIDADE

CICLO 7 - NARRATIVA COMO CURA
  Livro: Ficcoes que Curam
  Autor: James Hillman
  Tema: NARRATIVA COMO CURA

CICLO 8 - CASA PSIQUICA
  Livro: A Poetica do Espaco
  Autor: Gaston Bachelard
  Tema: CASA PSIQUICA

CICLO 9 - ATENCAO & LIMITE
  Livro: A Gravidade e a Graca
  Autor: Simone Weil
  Tema: ATENCAO & LIMITE

CICLO 10 - RESPONSABILIDADE
  Livro: A Condicao Humana
  Autor: Hannah Arendt
  Tema: RESPONSABILIDADE

CICLO 11 - ESCRITA COMO PRATICA
  Livro: O Poder da Escrita
  Autor: Christina Baldwin
  Tema: ESCRITA COMO PRATICA

CICLO 12 - LINGUAGEM VIVA
  Livro: Agua Viva
  Autor: Clarice Lispector
  Tema: LINGUAGEM VIVA
```

### 3. Estrutura de 4 Semanas por Ciclo

Para cada ciclo, serao criadas 4 semanas com a estrutura canonica:

| Semana | Titulo | Tipo | Descricao |
|--------|--------|------|-----------|
| 1 | O Arquetipo Nao E a Cliente | chamado | Diferenca entre simbolo e identidade |
| 2 | O Risco da Projecao da Facilitadora | ruptura | Quando a leitura vira identificacao |
| 3 | Quando Nao Usar um Conto | reorganizacao | Contraindicacoes e uso inadequado |
| 4 | Integracao e Fechamento | integracao | Consolidacao do ciclo |

### 4. Conteudo Clinico Padrao (Mulheres que Correm com Lobos)

Para o primeiro ciclo, ja preenchido como exemplo:

**Quando usar com clientes:**
- Cliente desconectada do corpo
- Excesso de adaptacao
- Apagamento do desejo

**Quando evitar:**
- Crise psicotica
- Luto recente
- Ego fragilizado

**Riscos de projecao da terapeuta:**
- Romantizar sofrimento
- Projetar propria iniciacao

---

## Arquivos a Modificar

### 1. src/components/admin/AdminClubeLivroTab.tsx

Adicionar:
- Botao "Importar Calendario Anual (12 Ciclos)"
- Mutation para inserir os 12 ciclos em massa
- Mutation para gerar as 4 semanas de cada ciclo
- Confirmacao antes da importacao

### 2. src/hooks/useClubeLivro.ts

Adicionar:
- Constante CALENDARIO_ANUAL com os dados dos 12 livros
- Constante SEMANAS_PADRAO com a estrutura das 4 semanas

---

## Fluxo de Importacao

```text
1. Admin clica em "Importar Calendario Anual"
2. Modal de confirmacao aparece
3. Ao confirmar:
   a. Verifica ciclos existentes (evita duplicatas)
   b. Insere os 12 ciclos com ordem sequencial
   c. Para cada ciclo, gera as 4 semanas padrao
   d. Define primeiro ciclo como ativo
   e. Define todos como rascunho (publicado = false)
4. Toast de sucesso
5. Lista atualizada
```

---

## Consideracoes

- O ciclo existente ("Mulheres que Correm com Lobos") sera mantido
- Novos ciclos serao criados com publicado = false para revisao manual
- As datas de inicio/fim podem ser definidas manualmente apos importacao
- Conteudo clinico pode ser preenchido posteriormente no editor expandido
- Capas dos livros podem ser adicionadas via upload no editor de ciclo
