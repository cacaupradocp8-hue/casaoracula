import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const markdown = `# Auditoria de Visibilidade de Botões (SPRINT 05D)
## SPRINT_05D_HOME_BUTTONS_ROLE_VISIBILITY_AUDIT_RESULT.md

### 1. Lista de Botões por Perfil

#### Visitante (Página: \`/sala-da-visitante\`)
- **Botão:** "Descobrir minha Voz" -> Aponta para \`/quiz/descubra-seu-eixo\` (Público)
- **Menu Superior:** "Explorar a Casa", "Formação Orácula", "Clube do Livro", "Vitrine", "Entrar"
- **Rodapé (Mobile):** Não exibe BottomNav (Padrão para não logados)

#### Assinante / Aluna (Página: \`/dashboard-membro\`)
- **Bússola/Ação Principal:** Dinâmico (ex: "Revelar minha Cidadela", "Prática de regulação")
- **Bloco Comece por Aqui:**
  - **Assinante:** "Entrar no Clube" (/clube), "Continuar" (/minha-jornada), "Ver Leituras" (/biblioteca-unificada)
  - **Aluna:** "Continuar Formação" (/sala-de-treinamento), "Ver Mapa" (/minha-jornada), "Acessar Práticas" (/biblioteca-unificada)
- **Menu Superior:** Dashboard, Clube, Câmara/Treinamento, Ferramentas, Jardins, Formação, Vitrine.
- **Rodapé (Mobile):** Início, Clube, Ferramentas, Jardim, Formação.

#### Admin (Página: \`/dashboard-membro\` ou \`/admin\`)
- **Bloco Comece por Aqui:** "Monitorar" (/admin?tab=rockty-monitor), "Ver Documentos" (/admin?tab=documentos), "Gerenciar" (/admin)
- **Menu Superior:** Dashboard, Clube, Treinamento, Ferramentas, Jardins, Formação, Vitrine + Ícone Usuário -> "Painel Admin" (/admin)
- **Acesso Profissional:** Botão "🧠 Profissional" (Alterna domínio para Casa das Máquinas)

### 2. Rotas de Destino e Proteção

| Rota | Descrição | Nível Mínimo | Proteção Verificada |
|---|---|---|---|
| \`/admin\` | Painel Admin | \`admin\` | Sim (ProtectedRoute) |
| \`/casa-das-maquinas\` | SaaS Profissional | \`oracula\` | Sim (ProtectedRoute) |
| \`/sala-de-treinamento\`| Laboratório | \`aluna\` | Sim (ProtectedRoute) |
| \`/clube\` | Clube Oracular | \`visitante\` (Sales) / \`assinante\` (Conteúdo) | Sim (Gate interno) |
| \`/biblioteca-unificada\`| Acervo | \`visitante\` | Abas protegidas internamente |

### 3. Problemas Encontrados
1. **ExplorarCasaSection.tsx (Inconsistência Visual):** O componente lista botões para \`/casa-maquinas\` e \`/comunidade\` sem checar o portal do usuário, embora as rotas em si estejam protegidas no \`App.tsx\`. Um visitante veria botões que levam ao gate de bloqueio.
2. **HomeFormacaoSections.tsx / HomeTerapeutaSections.tsx:** Estes componentes são renderizados no \`DashboardMembro\` para Alunas e Oráculas, respectivamente. A lógica de exibição está correta, mas as rotas de destino (\`/oracula\`, \`/casa-maquinas\`) realizam gates de redirecionamento adicionais.

### 4. Correções Feitas
* Nenhuma correção de permissão ou backend foi realizada.
* Auditado o arquivo \`src/components/home/HomeOnboardingBlocks.tsx\` e confirmado que as condições \`isVisitor\`, \`isSubscriber\`, \`isStudent\`, \`isAdmin\` estão sendo aplicadas corretamente para filtrar os CTAs da Home.
* Confirmado que \`ProtectedRoute\` no \`App.tsx\` garante a segurança caso o usuário tente acessar a URL diretamente.

### 5. Confirmação de Integridade
- [x] Sem alteração em permissões.
- [x] Sem alteração em backend.
- [x] Sem alteração em banco de dados.
- [x] Sem alteração em RLS.
- [x] Sem alteração em Auth/Pagamentos.

### 6. Classificação
**APROVADO**

---
**Data**: 14 de Maio de 2026
**Responsável**: Lovable AI
`;

const RelatorioAuditoriaBotoes = () => {
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
            Voltar
          </Button>
          <div className="flex items-center gap-2 text-amber-500">
            <ShieldAlert className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Auditoria de Segurança</span>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6 md:p-12 shadow-2xl">
          <article className="prose prose-invert prose-amber max-w-none 
            prose-h1:text-3xl prose-h1:text-amber-500 prose-h1:font-serif
            prose-h2:text-2xl prose-h2:text-amber-400 prose-h2:font-serif prose-h2:mt-8
            prose-h3:text-xl prose-h3:text-amber-300 prose-h3:mt-6
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-li:text-gray-300
            prose-strong:text-amber-200
            prose-hr:border-amber-500/20">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </article>
        </div>
      </div>
    </AppLayout>
  );
};

export default RelatorioAuditoriaBotoes;
