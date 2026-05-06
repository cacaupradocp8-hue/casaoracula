# Documentação Técnica: Ecossistema Casa Orácula

## 1. Visão Geral
A **Casa Orácula** é uma plataforma progressiva e adaptativa voltada para o desenvolvimento pessoal, estudo de arquétipos e prática terapêutica. O sistema é construído com foco em **performance mobile-first**, acessibilidade e uma interface imersiva que se adapta ao nível de jornada do usuário (Visitante, Membro, Aluna de Formação ou Orácula/Admin).

### Stack Tecnológica
- **Frontend**: React (Vite) com TypeScript.
- **Estilização**: Tailwind CSS com Shadcn/UI para componentes atômicos.
- **Backend/Banco de Dados**: Supabase (PostgreSQL, Auth, Storage, Edge Functions).
- **Gerenciamento de Estado**: React Query (Server State) e React Context (Global UI/Auth State).
- **Roteamento**: React Router DOM v6.

---

## 2. Fluxo Cronológico do Usuário

### A. Autenticação e Entrada (`/auth`)
O ponto de entrada principal. O sistema utiliza o `AuthContext.tsx` para gerenciar a sessão do usuário via Supabase.
- **Login/Signup**: Suporta E-mail/Senha e Magic Links.
- **Contexto de Domínio**: O `AppDomainContext.tsx` identifica o subdomínio ou contexto para personalizar a experiência visual logo na entrada.

### B. Onboarding e Boas-Vindas (`/onboarding`)
Novos membros passam por um fluxo de introdução onde definem suas intenções iniciais. Isso é controlado pelo hook `useOnboarding`.

### C. Dashboard Dinâmico
Dependendo do perfil (`portal`), o usuário é redirecionado:
- **Visitante**: `/sala-da-visitante` - Acesso restrito e focado em conversão.
- **Membro**: `/dashboard-membro` - Acesso às rotas do clube, biblioteca e ferramentas pessoais.

---

## 3. Módulos Principais

### Clube da Rota (`/clube`)
O coração da jornada de conteúdo.
- **Catálogo (`ClubeRotasCatalogo.tsx`)**: Mostra as rotas disponíveis (ex: "Mulheres que Correm com os Lobos").
- **Seção de Boas-Vindas**: Integra a **Cidadela** (Cartografia), o progresso atual (**Continuar**) e a próxima estação (**Iniciar**).
- **Estação Premium (`ClubeRotaPremium.tsx`)**: Página de conteúdo compacta no desktop, com heros proporcionais e seções de áudio (`AudioOracular`).

### Cidadela e Cartografia
- **Criação**: `/ferramenta/cartografia-psiquica-oracula` - Onde o usuário mapeia sua estrutura interna.
- **Visualização**: `/cidadela/revelacao` - Onde o "Mapa da Cidadela" é exibido como base da jornada.

### Biblioteca e Mentoria
- **Biblioteca Unificada**: Agrega cursos, aulas e materiais de apoio.
- **Mentoria**: Área para acompanhamento direto e grupos de estudo.

---

## 4. Casa das Máquinas (`/casa-das-maquinas`)
O centro administrativo e profissional da plataforma. É protegido pelo `CasaMaquinasGuard.tsx`.

### Principais Funcionalidades:
- **Gestão de Clientes**: `/clientes` e `/clientes/:id`. Visualização detalhada do progresso, relatórios de jornada e mapas vivos.
- **Modo Sessão**: `/nova-sessao` e `/sessao/:clienteId`. Interface imersiva para terapeutas conduzirem atendimentos em tempo real.
- **Ferramentas de Intervenção**: Inclui Atlas de Arquétipos, Labirinto, Decodificação Onírica e Mapeamento de Complexos.
- **7 Vozes**: Sistema de diagnóstico baseado em vozes primárias (`VozesHomePage.tsx`).
- **Jardim do Ofício**: Área de supervisão e prática profissional.

---

## 5. Arquitetura de Código e Componentes

### Lógica de "Voz Dominante"
Utiliza o hook `useUserVoz.ts` para buscar no banco de dados a voz primária do usuário.
- **Componente `VozTag.tsx`**: Um pill visual que aparece no perfil e no hero do clube, reforçando a identidade arquetípica do usuário.

### Player de Áudio (`AudioOracular.tsx`)
Substitui janelas externas por um player nativo e elegante que permite a escuta dos conteúdos da estação sem sair da página.

### Sistema de Estações e Progresso
O progresso é rastreado via `useStationProgress.ts`, permitindo que o usuário retome exatamente de onde parou.

---

## 6. Estrutura do Banco de Dados (Supabase)

### Tabelas Críticas:
- `profiles`: Dados básicos, nível de acesso (`portal`) e metadados.
- `user_voz`: Armazena a voz primária e secundária vinculada ao `user_id`.
- `user_stations_progress`: Logs de conclusão de áudios e conteúdos por estação.
- `cartografia_profiles`: Dados gerados pela ferramenta de cartografia psíquica.
- `clientes_conexoes`: Vincula profissionais (Oráculas) às suas clientes para gestão na Casa das Máquinas.

---

## 7. Instruções para Desenvolvedores
1. **Responsividade**: Siga sempre o padrão mobile-first. Use `md:`, `lg:` para ajustes desktop, evitando larguras fixas em `px`.
2. **Performance**: Páginas pesadas são carregadas via `React.lazy` (Suspense).
3. **Segurança**: Rotas sensíveis devem ser envolvidas por `ProtectedRoute` com o `minPortal` adequado.
