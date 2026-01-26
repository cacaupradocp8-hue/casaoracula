
# Plano: Biblioteca Pessoal Unificada

## Visão Geral

Criar uma nova página central chamada **"Minha Biblioteca"** (`/minha-biblioteca`) que reúne todos os conteúdos pessoais salvos pela aluna em um único lugar organizado.

---

## O Que Será Reunido

| Categoria | Tabela de Origem | O Que Mostra |
|-----------|------------------|--------------|
| Diários de Bordo | `diario_bordo_aulas` | Notas pessoais escritas durante as aulas |
| Jardim da Psique | `jardim_psique_registros` | Sonhos, frases, reflexões, resultados de ferramentas |
| Oráculos | `oracle_draws` | Histórico de tiragens pessoais (não profissionais) |
| Labirinto | `labirinto_leituras` | Leituras pessoais do Labirinto Oracular |
| Progresso de Aulas | `course_lesson_progress` | Aulas concluídas com datas |

---

## Design da Interface

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  📚 MINHA BIBLIOTECA                                     [Exportar PDF] │
│  Seu espaço pessoal de memórias e aprendizados                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [📔 Diários] [🌿 Jardim] [🔮 Oráculos] [🌀 Labirinto] [📊 Progresso]  │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  🔍 Buscar...                              📅 Filtrar por período ▼     │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ 📔 Dia 3 — A Escuta Interior                                      │ │
│  │ "Percebi que o silêncio não é ausência, mas presença..."          │ │
│  │ 📅 25 Jan 2026 · Travessia Zero                      [Ver aula →] │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ 🌿 Mapa dos Cinco Territórios                        ✓ Integrado  │ │
│  │ "O território da abertura me chamou mais atenção..."              │ │
│  │ 📅 24 Jan 2026 · Ferramenta                         [Abrir →]     │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ 🔮 Tiragem do Oráculo Lua                                         │ │
│  │ 3 cartas · "Um novo ciclo se inicia..."                           │ │
│  │ 📅 23 Jan 2026                                       [Ver →]      │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ...mais registros...                                                   │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  🔒 Tudo aqui é 100% privado. Nenhum admin vê seus registros.          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Funcionalidades

1. **Abas por categoria**: Permite filtrar por tipo de conteúdo
2. **Aba "Todos"**: Timeline unificada ordenada por data
3. **Busca textual**: Procura em todos os registros
4. **Filtro por período**: Última semana, mês, 3 meses, todos
5. **Links diretos**: Cada card leva ao conteúdo original (aula, ferramenta, etc.)
6. **Exportar PDF**: Gera documento com todos os registros (ou por categoria)
7. **100% privado**: Apenas a própria usuária vê (RLS existente)

---

## Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| `src/pages/MinhaBiblioteca.tsx` | **CRIAR** - Nova página principal |
| `src/hooks/useMinhaBiblioteca.ts` | **CRIAR** - Hook que agrega todas as fontes |
| `src/components/biblioteca-pessoal/BibliotecaCard.tsx` | **CRIAR** - Card unificado para diferentes tipos |
| `src/components/biblioteca-pessoal/BibliotecaTabs.tsx` | **CRIAR** - Navegação por abas |
| `src/components/biblioteca-pessoal/BibliotecaTimeline.tsx` | **CRIAR** - Lista cronológica |
| `src/App.tsx` | Adicionar rota `/minha-biblioteca` |
| `src/components/layout/Navigation.tsx` | Adicionar link na seção Jornada |

---

## Hook `useMinhaBiblioteca`

O hook será responsável por:
1. Buscar dados de todas as 5 tabelas em paralelo
2. Normalizar para um formato unificado
3. Ordenar por data (mais recente primeiro)
4. Filtrar por categoria, busca e período

```text
Formato Unificado:
{
  id: string
  tipo: 'diario' | 'jardim' | 'oraculo' | 'labirinto' | 'progresso'
  titulo: string
  resumo: string
  data: Date
  link: string
  metadata: { ... }
}
```

---

## Integração no Menu

A "Minha Biblioteca" será adicionada ao bloco **Jornada** no menu de navegação, logo após "Jardim da Psique":

```text
JORNADA
├── Meu Caminho
├── Jardim da Psique
└── Minha Biblioteca  ← NOVO
```

---

## Resultado Esperado

1. Aluna tem **um só lugar** para ver tudo que salvou
2. Navegação fluida entre registros e conteúdos originais
3. Busca unificada facilita encontrar memórias específicas
4. Exportação permite criar documento físico/digital da jornada
5. Zero impacto em outras funcionalidades existentes

---

## Seção Tecnica

### Estrutura de Dados Normalizada

```typescript
interface RegistroBiblioteca {
  id: string;
  tipo: 'diario' | 'jardim' | 'oraculo' | 'labirinto' | 'progresso';
  titulo: string;
  resumo: string | null;
  data: string; // ISO date
  link: string;
  icone: string; // lucide icon name
  metadata: {
    // tipo-specific data
    aulaId?: string;
    cursoNome?: string;
    ferramentaChave?: string;
    oracleId?: string;
    portaId?: string;
    integrado?: boolean;
    arquivado?: boolean;
  };
}
```

### Queries Paralelas

```typescript
const { data, isLoading } = useQuery({
  queryKey: ['minha-biblioteca', userId, filtros],
  queryFn: async () => {
    const [diarios, jardim, oraculos, labirinto, progresso] = await Promise.all([
      supabase.from('diario_bordo_aulas').select('*').eq('user_id', userId),
      supabase.from('jardim_psique_registros').select('*').eq('user_id', userId),
      supabase.from('oracle_draws').select('*').eq('user_id', userId).eq('is_professional_session', false),
      supabase.from('labirinto_leituras').select('*').eq('user_id', userId).is('cliente_id', null),
      supabase.from('course_lesson_progress').select('*, lesson:course_lessons(titulo, modulo:course_modules(titulo, curso:courses(titulo)))').eq('user_id', userId).eq('completed', true),
    ]);
    
    return normalizeAndMerge(diarios, jardim, oraculos, labirinto, progresso);
  },
  staleTime: 30000,
});
```

### Seguranca (RLS)

Todas as tabelas ja possuem RLS configurado com `user_id = auth.uid()`. Nenhuma alteracao de seguranca necessaria.

### Mapeamento de Links

| Tipo | Link Pattern |
|------|--------------|
| diario | `/travessia/{travessiaId}/aula/{aulaId}` ou `/curso/{cursoId}/aula/{aulaId}` |
| jardim | `/jardim-da-psique/{registroId}` |
| oraculo | `/oraculos/{oracleId}/history` |
| labirinto | `/labirinto/porta/{portaId}` |
| progresso | `/curso/{cursoId}/aula/{lessonId}` |
