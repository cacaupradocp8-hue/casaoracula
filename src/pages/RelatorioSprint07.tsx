import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const markdown = `# Relatório de Implementação: Progresso Simbólico da Travessia
## SPRINT_07_CLUBE_TRAVESSIA_SYMBOLIC_PROGRESS_RESULT.md

### 1. Diagnóstico do Estado Atual
- Identificamos que já existem mecanismos de persistência no backend para os principais conteúdos da jornada:
  - **Áudio**: Tabela \`clube_livro_escuta_progress\` rastreia conclusão de audios.
  - **Jardim**: Tabela \`jardim_psique_registros\` armazena entradas pessoais (ferramentas/reflexões).
  - **Lab 80/20**: Tabela \`clube_livro_integracao_8020\` rastreia conclusões de práticas.
  - **Conversa com o Livro**: Tabela \`clube_livro_chat_interactions\` registra interações com Syntheia.
  - **Progresso na Rota**: Tabela \`clube_rota_progresso\` rastreia o estado geral do item da rota (não iniciado, em andamento, concluído).

### 2. Solução Escolhida
Implementamos uma solução híbrida:
- **Componente Visual**: Criamos o \`ClubeTravessiaProgress\`, um indicador de 7 passos que reflete a estrutura simbólica da página.
- **Hook de Integração**: Criamos o \`useClubeTravessiaProgress\` que consome as tabelas de progresso existentes para exibir o status real de cada etapa sempre que possível.
- **Sem Mudanças no Schema**: Utilizamos 100% da infraestrutura de dados já existente, sem necessidade de novas tabelas ou migrações neste momento.

### 3. Arquivos Alterados
- \`src/components/clube/ClubeTravessiaProgress.tsx\` (Novo: UI do indicador)
- \`src/hooks/useClubeTravessiaProgress.ts\` (Novo: Lógica de cálculo de progresso)
- \`src/pages/clube/ClubeRotaPremium.tsx\` (Integrado o indicador na página principal da rota)

### 4. Persistência
- **Houve persistência**: Sim, o sistema reflete o progresso salvo no banco de dados para áudios, jardim, laboratório e chat. 
- O estado visual é dinâmico e se atualiza conforme a usuária realiza as atividades.

### 5. Confirmação de Segurança e Backend
- **Backend/Permissões**: Não foram alterados. O código apenas lê os dados que a usuária já possui permissão para acessar.
- **RLS/Triggers**: Mantidos intactos.
- **Pagamentos/Auth**: Nenhuma alteração realizada nestes módulos críticos.

### 6. Validação Mobile
- O indicador de progresso foi projetado com Grid responsivo:
  - Mobile: Exibição em lista compacta (1 a 2 colunas).
  - Tablet/Desktop: Exibição em linha horizontal de cards (7 colunas).
  - Touch-friendly e com feedback visual claro de conclusão.

### 7. Status do Build
- Build executado com sucesso.
- Verificação de Lint: Aprovado.

---

**Classificação**: APROVADO

A Rota dos Lobos agora conta com uma bússola de progresso clara, orientando a assinante através das 7 etapas da travessia simbólica.
`;

const RelatorioSprint07 = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard-membro')}
            className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </Button>
          <div className="flex items-center gap-2 text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Resultado Sprint 07</span>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6 md:p-12 shadow-2xl">
          <article className="prose prose-invert prose-emerald max-w-none 
            prose-h1:text-3xl prose-h1:text-emerald-500 prose-h1:font-serif
            prose-h2:text-2xl prose-h2:text-emerald-400 prose-h2:font-serif prose-h2:mt-8
            prose-h3:text-xl prose-h3:text-emerald-300 prose-h3:mt-6
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-li:text-gray-300
            prose-strong:text-emerald-200
            prose-hr:border-emerald-500/20">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </article>
        </div>
      </div>
    </AppLayout>
  );
};

export default RelatorioSprint07;
