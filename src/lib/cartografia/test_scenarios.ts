
import { normalizarMedias } from './leituraComportamental';
import { derivarCidadela } from './derivacaoCidadela';
import { montarProfileJson } from './montarProfileJson';

// Mock context for testing
const mockContext = {
  nome_cliente: 'Usuária Teste',
  objetivo: 'Autoconhecimento',
  fase_vida: 'Transição'
};

const runScenario = (name: string, rawMedias: Record<string, number>) => {
  console.log(`\n=== Cenário: ${name} ===`);
  const { profileJson } = montarProfileJson({
    rawMedias,
    contexto: mockContext as any
  });

  console.log(`Tensão Central: ${profileJson.derivacao.tensao_central}`);
  console.log(`Porta Inicial (Cidadela): ${profileJson.derivacao.porta_inicial_nome}`);
  console.log(`Slug Recomendado (Porta Inicial): ${profileJson.recomendacoes?.rotas[0]}`);
  console.log(`Proximo Passo: ${profileJson.recomendacoes?.proximo_passo}`);
};

// 1. Controle vs Colapso (Abalo alto + Torre alta)
runScenario('Controle vs Colapso', {
  porta_do_possivel: 3,
  torre_interna: 5,
  campo_do_outro: 2,
  voz_no_mundo: 2,
  porta_do_abalo: 5
});

// 2. Pertencimento vs Autonomia (Campo alto + Voz baixa)
runScenario('Pertencimento vs Autonomia', {
  porta_do_possivel: 3,
  torre_interna: 3,
  campo_do_outro: 5,
  voz_no_mundo: 1,
  porta_do_abalo: 2
});

// 3. Estrutura vs Expressão (Torre alta + Voz baixa, sem colapso)
runScenario('Estrutura vs Expressão', {
  porta_do_possivel: 4,
  torre_interna: 5,
  campo_do_outro: 3,
  voz_no_mundo: 1,
  porta_do_abalo: 2
});
