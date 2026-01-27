
# Plano: Expansao do Clube do Livro Oracular

## Resumo do Status Atual

O sistema base do Clube do Livro Oracular ja foi implementado com:
- Tabelas no banco de dados (ciclos, fases, perguntas, respostas, escutas, encontros)
- Paginas: Apresentacao, Ciclo, Fase, Escutas, Encontros
- Hook `useClubeLivro.ts` para gestao de dados
- Tab administrativa para gerenciar conteudo
- Rotas protegidas para nivel `aluna+`

**Problema atual**: O Clube esta "orfao" - nao ha link no menu de navegacao para acessa-lo.

---

## Mudancas Necessarias

### 1. Navegacao e Acesso

**Adicionar link no menu de Recursos:**
- Arquivo: `src/components/layout/Navigation.tsx`
- Local: Dentro do bloco `recursos` (linha ~261-321)
- Item: `{ path: '/clube-livro', label: 'Circulo de Leitura', icon: BookOpen, minPortal: 'aluna' }`

**Adicionar card na pagina Biblioteca:**
- Arquivo: `src/pages/Biblioteca.tsx`
- Adicionar secao de destaque para o Clube do Livro com link direto

---

### 2. Alteracoes no Banco de Dados

Adicionar novos campos para suportar as especificacoes completas:

```text
Tabela: clube_livro_ciclos
  - tema_simbolico (text) -- ex: "DESPERTAR", "COLAPSO DO PERSONAGEM"
  - orientacao_clinica_uso (text) -- Quando usar este livro com clientes
  - orientacao_clinica_evitar (text) -- Quando nao usar
  - orientacao_clinica_riscos (text) -- Riscos de projecao da terapeuta
  - orientacao_clinica_indicado (text) -- Tipo de cliente indicado
  - orientacao_clinica_contraindicado (text) -- Tipo de cliente contraindicado
  - ritual_aceite_obrigatorio (boolean, default true) -- Se requer aceite do ritual

Tabela: clube_livro_fases
  - tipo_fase (text) -- 'chamado', 'ruptura', 'reorganizacao', 'integracao'
  - orientacao_curta (text) -- texto curto de orientacao por fase
```

---

### 3. Estrutura de Fases Padronizadas

O sistema atual permite fases flexiveis. A nova especificacao pede 4 fases FIXAS:
1. **Chamado** - inicio da jornada
2. **Ruptura** - momento de crise/desorganizacao
3. **Reorganizacao** - retomada do fio
4. **Integracao** - consolidacao e encerramento

**Abordagem**: Manter flexibilidade no banco, mas criar helper no Admin para gerar as 4 fases automaticamente ao criar um novo ciclo.

---

### 4. Ritual de Abertura

**Nova pagina**: `src/pages/clube-livro/ClubeLivroRitual.tsx`

Conteudo fixo (canonico):
- Fundo escuro
- Texto-manifesto imutavel
- Checkbox obrigatorio: "Leio com presenca, nao com pressa."
- Botao: "Entrar no Ciclo"
- Salva aceite no localStorage ou banco (por ciclo/usuario)

**Rota**: `/clube-livro/:id/ritual`

**Fluxo**: Apresentacao → Ritual (se nao aceito) → Ciclo

---

### 5. Uso Clinico (Profissional)

**Nova aba na pagina do Ciclo** para usuarios profissionais verificados:

Arquivo: `src/pages/clube-livro/ClubeLivroCiclo.tsx`
- Adicionar Tab "Uso Clinico" visivel apenas para `isProfessionalVerified`
- Exibir: 
  - Quando usar este livro
  - Quando evitar
  - Riscos de projecao
  - Cliente indicado/contraindicado
- Aviso fixo etico

---

### 6. Calendario e Arquivo de Ciclos

**Atualizar pagina de Apresentacao** (`ClubeLivroApresentacao.tsx`):

Estrutura:
1. Texto-manifesto (ja existe)
2. **Ciclo Atual** - em destaque
3. **Proximos Ciclos** - cards bloqueados com data prevista
4. **Ciclos Anteriores** - arquivo expandivel
5. **Regras Eticas** - sempre visivel (texto fixo)

---

### 7. Melhoria no Admin

Arquivo: `src/components/admin/AdminClubeLivroTab.tsx`

Adicionar:
- Campo de tema simbolico
- Campos de orientacao clinica (5 campos)
- Toggle para ritual obrigatorio
- Botao "Gerar Fases Padrao" que cria automaticamente: Chamado, Ruptura, Reorganizacao, Integracao
- Preview do calendario anual

---

### 8. Regras de Acesso Diferenciado

O sistema atual usa `portal_minimo = 'aluna'` para todos. A especificacao pede:

| Nivel | Acesso |
|-------|--------|
| Visitante | Nenhum |
| Assinante | Ciclo atual |
| Aluna Formacao | Ciclo atual + material clinico |
| Oracula/Certificada | Ciclo atual + material clinico + supervisao |

**Implementacao**: 
- Campo `portal_minimo_clinico` na tabela ciclos (default: `aluna_formacao`)
- Verificacao em runtime para exibir/ocultar aba clinica

---

## Arquivos a Criar

1. `src/pages/clube-livro/ClubeLivroRitual.tsx` - Tela de ritual de abertura
2. Migracao SQL para novos campos

## Arquivos a Modificar

1. `src/components/layout/Navigation.tsx` - Adicionar link no menu Recursos
2. `src/pages/Biblioteca.tsx` - Adicionar card de acesso ao Clube
3. `src/pages/clube-livro/ClubeLivroApresentacao.tsx` - Reorganizar com ciclos atual/proximos/anteriores
4. `src/pages/clube-livro/ClubeLivroCiclo.tsx` - Adicionar aba de uso clinico
5. `src/hooks/useClubeLivro.ts` - Adicionar hooks para ritual aceite e dados clinicos
6. `src/components/admin/AdminClubeLivroTab.tsx` - Adicionar campos clinicos e gerador de fases
7. `src/App.tsx` - Adicionar rota `/clube-livro/:id/ritual`

---

## Ordem de Implementacao

1. Migracao do banco de dados (novos campos)
2. Atualizar hooks com tipos expandidos
3. Criar pagina do Ritual de Abertura
4. Atualizar Apresentacao com estrutura de ciclos
5. Adicionar aba Uso Clinico na pagina do Ciclo
6. Atualizar Admin com novos campos
7. Adicionar link no menu de navegacao
8. Adicionar card na Biblioteca

---

## Consideracoes de Seguranca

- RLS ja aplicado: respostas sao privadas por usuario
- Campos clinicos sao apenas leitura (gerenciados por admin)
- Aceite do ritual pode ser salvo no banco vinculado ao usuario
- Verificacao de `isProfessionalVerified` para aba clinica

## Nota sobre UX

- Linguagem simbolica e contida
- Nada academico ou gamificado
- Sem obrigatoriedade de participacao
- Escrita sempre privada
- Nenhum forum ou feed publico
