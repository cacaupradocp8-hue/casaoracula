
import { createClient } from '@supabase/supabase-client';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const stationItemId = '14526fea-ca33-47c5-b35e-9f262098fb53';

// Mocked parser logic from ImportadorEstacao.tsx
function normHeader(raw) {
  return raw
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const HEADER_MAP = [
  { test: h => h === 'hero', key: 'hero' },
  { test: h => h.startsWith('mapa'), key: 'mapa_simbolico' },
  { test: h => /^audio(s)?\b/.test(h), key: 'audio' },
  { test: h => h.startsWith('caso'), key: 'caso_simbolico' },
  { test: h => h.startsWith('desafio'), key: 'desafio_escuta' },
  { test: h => h.startsWith('revelac'), key: 'revelacao_estacao' },
  { test: h => h.startsWith('ferramenta'), key: 'ferramenta_oracular' },
  { test: h => h.startsWith('jardim da psique') || h === 'jardim psique', key: 'jardim_psique' },
  { test: h => h.startsWith('jardim do oficio') || h === 'jardim oficio', key: 'jardim_oficio' },
  { test: h => h.startsWith('missao'), key: 'missao_campo' },
  { test: h => h.startsWith('fechamento'), key: 'fechamento' },
];

function resolveHeader(raw) {
  const h = normHeader(raw);
  for (const m of HEADER_MAP) {
    if (m.test(h)) {
      if (m.key === 'audio') {
        const num = parseInt(h.replace(/\D+/g, ''), 10);
        return { key: 'audio', index: isNaN(num) ? 1 : num };
      }
      return { key: m.key };
    }
  }
  return null;
}

function parseImport(text) {
  const blocks = {};
  const unknownHeaders = [];
  const audios = {};

  const lines = text.replace(/\r\n/g, '\n').split('\n');
  let currentBlockKey = null;
  let currentAudioIdx = null;
  let currentField = null;
  let buffer = [];

  const flushField = () => {
    if (currentBlockKey && currentField) {
      const value = buffer.join('\n').replace(/\s+$/g, '').replace(/^\s*\n/, '');
      const target = currentBlockKey === 'audio' && currentAudioIdx != null
        ? (audios[currentAudioIdx] ||= {})
        : (blocks[currentBlockKey] ||= {});
      target[currentField] = value.trim();
    }
    buffer = [];
    currentField = null;
  };

  for (const rawLine of lines) {
    const line = rawLine;
    const headerMatch = line.match(/^\s*##\s+(.+?)\s*$/);
    if (headerMatch) {
      flushField();
      const resolved = resolveHeader(headerMatch[1]);
      if (!resolved) {
        unknownHeaders.push(headerMatch[1].trim());
        currentBlockKey = null;
        currentAudioIdx = null;
      } else {
        currentBlockKey = resolved.key;
        currentAudioIdx = resolved.index ?? null;
      }
      continue;
    }

    const kv = line.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*(.*)$/);
    if (kv && currentBlockKey) {
      flushField();
      currentField = kv[1].toLowerCase();
      buffer = [kv[2]];
      continue;
    }

    if (currentField) buffer.push(line);
  }
  flushField();

  const audioIdxs = Object.keys(audios).map(Number).sort((a, b) => a - b);
  if (audioIdxs.length > 0) {
    blocks.__audios = audioIdxs.map(i => audios[i]);
  }

  return { blocks, unknownHeaders };
}

function mapToMetadata(blocks, baseMeta, mode) {
  const meta = mode === 'replace' ? { ...baseMeta } : JSON.parse(JSON.stringify(baseMeta || {}));
  const report = [];

  const setBlock = (key, partial, label) => {
    const prev = (typeof meta[key] === 'object' && meta[key] !== null) ? meta[key] : {};
    meta[key] = { ...prev, ...partial };
    report.push(`${label} atualizado`);
  };

  if (blocks.hero) {
    setBlock('hero', {
      titulo: blocks.hero.titulo ?? meta.hero?.titulo ?? '',
      texto: blocks.hero.texto ?? meta.hero?.texto ?? '',
      cta: blocks.hero.cta ?? meta.hero?.cta ?? '',
    }, 'Hero');
  }
  if (blocks.mapa_simbolico) {
    setBlock('mapa_simbolico', {
      titulo: blocks.mapa_simbolico.titulo ?? meta.mapa_simbolico?.titulo ?? '',
      descricao: blocks.mapa_simbolico.descricao ?? meta.mapa_simbolico?.descricao ?? '',
      imagem_url: blocks.mapa_simbolico.imagem_url ?? meta.mapa_simbolico?.imagem_url ?? '',
    }, 'Mapa Simbólico');
  }
  // Other blocks omitted as they are not used in this test

  return { meta, report };
}

async function runTest() {
  const testContent = `## Hero
titulo: Clareira do Chamado
subtitulo: O Despertar da Loba
texto: O início da jornada de reconexão com o instinto selvagem.

## Mapa Simbólico
titulo: Mapa do Instinto Soterrado
descricao: Um guia visual para identificar onde sua natureza selvagem foi silenciada.
`;

  console.log('--- ETAPA 2.8: TESTE CONTROLADO DO IMPORTADOR ---');
  
  // 1. Fetch current data
  const { data: item, error: fetchError } = await supabase
    .from('clube_rota_itens')
    .select('*')
    .eq('id', stationItemId)
    .single();

  if (fetchError) {
    console.error('Erro ao buscar item:', fetchError);
    return;
  }

  console.log('Metadata atual:', JSON.stringify(item.metadata, null, 2));

  // 2. Parse
  const { blocks, unknownHeaders } = parseImport(testContent);
  console.log('Blocos identificados:', Object.keys(blocks));
  if (unknownHeaders.length > 0) console.log('Cabeçalhos desconhecidos:', unknownHeaders);

  // 3. Map (Merge mode as requested for safety validation)
  const { meta, report } = mapToMetadata(blocks, item.metadata, 'merge');
  console.log('Relatório de mapeamento:', report);

  // 4. Update
  const updates = { metadata: meta };
  if (blocks.hero?.titulo) {
    updates.titulo = blocks.hero.titulo;
  }

  const { error: updateError } = await supabase
    .from('clube_rota_itens')
    .update(updates)
    .eq('id', stationItemId);

  if (updateError) {
    console.error('Erro ao atualizar item:', updateError);
    return;
  }

  console.log('Persistência: SUCESSO');
  console.log('Novo Metadata:', JSON.stringify(meta, null, 2));

  // 5. Validation
  console.log('Validando campos Hero:');
  console.log('  Título:', meta.hero.titulo === 'Clareira do Chamado' ? 'OK' : 'ERRO');
  console.log('  Subtítulo:', meta.hero.subtitulo === 'O Despertar da Loba' ? 'OK' : 'ERRO');
  
  console.log('Validando campos Mapa Simbólico:');
  console.log('  Título:', meta.mapa_simbolico.titulo === 'Mapa do Instinto Soterrado' ? 'OK' : 'ERRO');
  console.log('  Descrição:', meta.mapa_simbolico.descricao === 'Um guia visual para identificar onde sua natureza selvagem foi silenciada.' ? 'OK' : 'ERRO');

  console.log('Validando campos não afetados:');
  console.log('  Ferramenta Oracular Nome:', meta.ferramenta_oracular.nome_publico === 'Mapa do Instinto Soterrado' ? 'OK' : 'ERRO');
}

runTest();
