
# Central de Jornadas — Plano Ajustado (v2)

## 1. ESCUTAS VINCULADAS ÀS SEMANAS

A tabela `clube_conteudo_semanal` já possui `podcast_audio_url`, `podcast_titulo`, `podcast_descricao`, `pratica_titulo`, `pratica_descricao`.

**Decisão**: Escutas ficam 100% dentro da semana. Na aba "Semanas" do admin, cada semana expõe:
- Áudio principal (`podcast_audio_url` + `podcast_titulo`)
- Tema (`carta_descricao_simbolica` ou novo campo `tema_semana`)
- Prática (`pratica_titulo` + `pratica_descricao`)

A tabela `clube_livro_escutas` permanece para escutas avulsas/bônus, mas o fluxo principal é pela semana.

---

## 2. APLICAÇÃO — Estrutura expandida

Substituir `traducao_aula/sessao/circulo` por 8 colunas TEXT em `clube_estacoes`:

| Bloco | Campos |
|-------|--------|
| **Aplicar em mim** | `aplicacao_mim_instrucao`, `aplicacao_mim_exercicio` |
| **Aplicar em sessão** | `aplicacao_sessao_pergunta`, `aplicacao_sessao_intervencao`, `aplicacao_sessao_risco` |
| **Aplicar em grupo** | `aplicacao_grupo_dinamica`, `aplicacao_grupo_regra`, `aplicacao_grupo_risco` |

---

## 3. CONEXÃO ESTRADA ↔ SEMANAS

Adicionar `conteudo_semanal_id UUID REFERENCES clube_conteudo_semanal(id)` em `clube_jornadas`.

**Fluxo**:
- A estrada mostra os pontos (jornadas) ordenados
- Cada ponto pode referenciar uma semana específica
- Semana ativa = semana do ponto com status `in_progress`
- Pontos sem semana = marcos estruturais (Portal, Encontro)
- Na UI da aluna: ponto atual puxa conteúdo da semana vinculada

---

## 4. GERADOR

- Permanece como ferramenta auxiliar
- Grava diretamente em `clube_conteudo_semanal`
- Não cria jornadas nem estações
- Botão "Gerar com IA" aparece dentro da aba Semanas (inline)

---

## 5. UX DA PÁGINA DO LIVRO (Admin)

```
┌─────────────────────────────────────────┐
│ ← Voltar    📚 Nome do Livro            │
│             Autor · Estação #3          │
├─────────────────────────────────────────┤
│  [Estrada]  [Semanas]  [Aplicação]  [Encontro] │
├─────────────────────────────────────────┤
│  (conteúdo da aba ativa)                │
└─────────────────────────────────────────┘
```

### Aba Estrada
- Cards com drag-to-reorder
- Cada item: título, tipo, semana vinculada (dropdown), toggle ativo

### Aba Semanas
- Accordion por semana
- Campos: áudio, tema, prática, pergunta contemplativa
- Botão "Gerar com IA" inline

### Aba Aplicação
- 3 cards visuais (Em mim / Em sessão / Em grupo)
- Cada um com campos específicos, ícone e cor sutil

### Aba Encontro
- Formulário: data, hora, link, tema
- Preview do card da aluna

### Princípios UX
- Fundo escuro, cards e accordions (sem tabelas cruas)
- Salvar com feedback visual (toast)
- Consistente com estética premium do admin

---

## Migrations necessárias

1. Adicionar 8 colunas de aplicação em `clube_estacoes`
2. Adicionar `conteudo_semanal_id` em `clube_jornadas`

## Ordem de execução

1. Migrations
2. Página lista de estações (`/admin/clube-livro`)
3. Página da estação (`/admin/clube-livro/estacao/:id`) com 4 abas
4. Integrar gerador na aba Semanas
5. Registrar rotas

## Fora de escopo
- Alterações na experiência da aluna (Rota Oracular)
- Novas tabelas de progresso
- Mudanças em `clube_estacao_registros`
