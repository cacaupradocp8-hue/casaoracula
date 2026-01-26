
# Plano: Ajustes Finais da Ferramenta Big Five Funcional

## Resumo das Alterações

Este plano resolve os 4 problemas identificados para deixar a ferramenta Big Five — Leitura Funcional como a versão única e funcional.

---

## 1. Desativar Ferramentas Big 5 Duplicadas

Alterar `ativa = false` para as ferramentas antigas que serão removidas do Hub:

| ID | Nome | Ação |
|----|------|------|
| `de09a467-d3f9-486a-be2b-b1a335ce7b54` | Big 5 | Desativar |
| `7803626e-0762-47f1-9d57-f7012b69a6ff` | Big Five (OCEAN) | Desativar |

A ferramenta `big5_simbolico` (O Mapa dos Cinco Territórios) será mantida, pois é uma versão diferente com proposta simbólica.

---

## 2. Traduzir Fatores para Português na Interface

Corrigir a tela de introdução que exibe os nomes em inglês.

**Arquivo:** `src/pages/Big5Funcional.tsx`

**Alteração na linha 194:**
```text
Antes: {dim.nome_ingles}
Depois: {dim.nome}
```

Os nomes já estão em português no banco:
- Abertura à Experiência
- Conscienciosidade  
- Extroversão
- Amabilidade
- Neuroticismo

---

## 3. Corrigir Ícones no Hub de Ferramentas

O componente `FerramentaCard` renderiza o ícone diretamente como texto. Para ícones salvos como nomes de componentes Lucide (ex: "Brain"), é necessário adicionar um mapeamento.

**Arquivo:** `src/components/shared/FerramentaCard.tsx`

**Solução:**
Criar um mapa de ícones conhecidos e renderizar o componente correspondente quando o valor for um nome Lucide:

```text
const ICON_MAP = {
  Brain: <Brain />,
  Map: <Map />,
  wrench: <Wrench />,
  target: <Target />,
  castle: <Castle />,
  layers: <Layers />,
  users: <Users />,
  triangle: <Triangle />,
};

// Na renderização:
Se icone está em ICON_MAP → renderizar componente
Senão → renderizar como emoji/texto
```

---

## 4. Adicionar Integração com Jardim da Psique

Para que os resultados sejam salvos automaticamente no diário arquetípico (como as outras ferramentas fazem), adicionar o `SalvarJardimModal` na tela de resultado.

**Arquivo:** `src/pages/Big5Funcional.tsx`

**Alterações:**
1. Importar `SalvarJardimModal`
2. Adicionar state para controlar o modal
3. Exibir o modal após salvar o resultado
4. Passar os dados do resultado para o modal

---

## Ordem de Execução

1. Migração SQL para desativar ferramentas duplicadas
2. Corrigir exibição dos nomes em português
3. Atualizar FerramentaCard com mapeamento de ícones Lucide
4. Adicionar integração com SalvarJardimModal

---

## Resultado Final

- Apenas **Big Five — Leitura Funcional** aparecerá no Hub (além da versão Simbólica)
- Os 5 fatores serão exibidos em português
- Ícones serão renderizados corretamente
- Resultados serão salvos no Jardim da Psique automaticamente
