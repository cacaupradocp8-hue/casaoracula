/**
 * Maps quiz result titulo_simbolico to voz IDs from the 7 Vozes system.
 */
const VOZ_MAP: Record<string, string> = {
  'voz do fogo': 'fogo-antigo',
  'voz do corpo': 'cura-pelo-contato',
  'voz narrativa': 'sopra-historias',
  'voz coletiva': 'sonha-para-o-coletivo',
  'voz tecelã': 'tece-o-invisivel',
  'voz anciã': 'lembra-caminhos-antigos',
  'voz da sombra': 'escuta-as-sombras',
};

/**
 * Extracts voz ID from a quiz result title like "🔮 VOZ DO FOGO"
 */
export function mapQuizResultToVozId(tituloSimbolico: string): string | null {
  const cleaned = tituloSimbolico
    .replace(/🔮/g, '')
    .trim()
    .toLowerCase();
  
  for (const [key, vozId] of Object.entries(VOZ_MAP)) {
    if (cleaned.includes(key)) return vozId;
  }
  return null;
}
