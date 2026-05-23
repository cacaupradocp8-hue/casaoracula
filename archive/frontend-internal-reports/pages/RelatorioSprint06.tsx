import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const markdown = `# Relatório Executivo de Fechamento: Sprint 06
## SPRINT_06_CLUBE_ORACULAR_ROTA_DOS_LOBOS_FINAL_SUMMARY.md

### 1. Objetivo da Sprint 06
O objetivo principal foi transformar a primeira experiência da assinante no Clube Oracular em uma jornada premium, simbólica e guiada, com foco especial na "Rota dos Lobos", garantindo que a usuária não apenas acesse conteúdos, mas vivencie uma travessia iniciática clara e esteticamente envolvente.

### 2. Problema Inicial Encontrado
- **Fragmentação**: O acesso aos conteúdos era uma lista simples, sem hierarquia ou orientação narrativa.
- **Falta de Contexto**: A assinante entrava no Clube sem uma "porta de entrada" clara ou um convite simbólico.
- **Interface Estática**: Pouca interatividade e ausência de elementos que reforçassem a identidade visual e a profundidade da obra.

### 3. Melhorias Implementadas
- **Bloco "Sua Primeira Travessia"**: Implementado na página inicial do Clube como o ponto de partida essencial para novas assinantes.
- **Rota dos Lobos**: Refatorada para uma interface premium, organizada por blocos lógicos e simbólicos.
- **Abertura do Campo**: Espaço de ambientação e preparação para o estudo.
- **Áudio Principal**: Destaque visual para o conteúdo de áudio central da travessia.
- **Conto/Símbolo Central**: Bloco dedicado ao coração narrativo da rota.
- **Laboratório 80/20**: Seção prática focada em exercícios de aplicação direta.
- **Jardim da Psique**: Integração de perguntas reflexivas para registro no diário pessoal.
- **Converse com o Livro**: Chamada interativa para a ferramenta de consulta oracular.
- **Próximo Passo**: Direcionamento claro para a continuidade da jornada, evitando a sensação de finalização abrupta.

### 4. Arquivos Principais Alterados
- \`src/pages/clube/ClubeRotasCatalogo.tsx\`: Adição do bloco de introdução e organização das rotas.
- \`src/pages/clube/ClubeRotaPremium.tsx\`: Criação da estrutura de página para a experiência guiada.
- \`src/components/clube/RotaLobosHeader.tsx\`: Componente de cabeçalho imersivo.
- \`src/components/clube/SuaPrimeiraTravessia.tsx\`: Card de destaque na home do Clube.
- \`src/components/clube/RotaLobosSection.tsx\`: Estrutura modular para as seções da rota.

### 5. Validações Realizadas
- **SPRINT 06A**: Validação funcional dos cards e âncoras da página inicial.
- **SPRINT 06B**: Auditoria e refinamento da hierarquia visual da Rota dos Lobos.
- **SPRINT 06C**: Validação técnica de links, responsividade e fluxo de navegação.
- **SPRINT 06D**: Implementação e revisão de microcopies e textos autorais orientadores.
- **SPRINT 06E**: Simulação completa da experiência da usuária (UX) do início ao fim.

### 6. Confirmações de Segurança e Integridade
- **Backend/Permissões**: Nenhuma regra de acesso, RLS ou função de banco de dados foi alterada.
- **Pagamentos**: Fluxos de checkout e assinaturas permaneceram intocados.
- **Conteúdo Protegido**: Nenhuma reprodução de trechos longos ou cópias de obras protegidas; apenas referências simbólicas e textos autorais.
- **Mobile/Desktop**: Interface 100% responsiva e testada em ambos os ambientes.
- **Build**: Verificação de tipos e linting concluída com sucesso.

### 7. Estado Final
**APROVADO**. A Rota dos Lobos está consolidada como a primeira experiência premium do Clube Oracular, estabelecendo um padrão visual e funcional para as futuras trilhas de conteúdo.

### 8. Próximos Passos Recomendados
1. **Conteúdo Real**: Inserir os áudios e textos definitivos nas seções estruturadas.
2. **Expansão de Rotas**: Aplicar o modelo premium na próxima trilha de estudos.
3. **Progresso Simbólico**: Implementar sistema de "conclusão de etapa" que reflita visualmente o avanço na travessia.
4. **Painel Editorial**: Criar interface administrativa para gestão dinâmica dos blocos de conteúdo do Clube.

---
**Data de Fechamento**: 14 de Maio de 2026
**Responsável**: Lovable AI
`;

const RelatorioSprint06 = () => {
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
          <div className="flex items-center gap-2 text-gold">
            <FileText className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Relatório Executivo</span>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-sm border border-gold/20 rounded-2xl p-6 md:p-12 shadow-2xl">
          <article className="prose prose-invert prose-gold max-w-none 
            prose-h1:text-3xl prose-h1:text-gold prose-h1:font-serif
            prose-h2:text-2xl prose-h2:text-gold/80 prose-h2:font-serif prose-h2:mt-8
            prose-h3:text-xl prose-h3:text-gold/70 prose-h3:mt-6
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-li:text-gray-300
            prose-strong:text-gold/90
            prose-hr:border-gold/20">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </article>
        </div>
        
        <div className="mt-12 text-center text-muted-foreground text-sm">
          <p>Este documento é para uso interno e acompanhamento técnico da Casa Orácula.</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default RelatorioSprint06;
