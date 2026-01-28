import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  VSLPortal,
  SilencioVisual,
  OrigemProjeto,
  EspelhoLead,
  BigIdeia,
  MecanismoUnico,
  ApresentacaoFormacao,
  ParaQuemE,
  ComoESustentada,
  InvestimentoBloco,
  FAQFormacao,
  FechamentoRitual
} from "@/components/formacao";

interface FormacaoContent {
  [key: string]: Record<string, unknown>;
}

export default function FormacaoOracula() {
  const [content, setContent] = useState<FormacaoContent>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("formacao_oracula_content")
        .select("section_key, content");

      if (error) throw error;

      const contentMap: FormacaoContent = {};
      data?.forEach((item) => {
        contentMap[item.section_key] = item.content as Record<string, unknown>;
      });

      setContent(contentMap);
    } catch (error) {
      console.error("Error fetching formacao content:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse font-body">
          Carregando...
        </div>
      </div>
    );
  }

  // Extract content sections with fallbacks
  const vsl = content.vsl || {};
  const silencio = content.silencio || {};
  const origem = content.origem || {};
  const espelho = content.espelho_lead || {};
  const bigIdeia = content.big_ideia || {};
  const mecanismo = content.mecanismo || {};
  const apresentacao = content.apresentacao || {};
  const paraQuem = content.para_quem || {};
  const sustentacao = content.sustentacao || {};
  const planos = content.planos || {};
  const faq = content.faq || {};
  const fechamento = content.fechamento || {};

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Bloco 0: Portal de Entrada (VSL Isolada) */}
      <VSLPortal videoUrl={vsl.video_url as string} />

      {/* Bloco 1: Silêncio Visual */}
      <SilencioVisual texto={silencio.texto as string} />

      {/* Bloco 2: Origem do Projeto */}
      <OrigemProjeto 
        titulo={origem.titulo as string}
        paragrafos={origem.paragrafos as string[]}
      />

      {/* Bloco 3: Espelho da Lead */}
      <EspelhoLead frases={espelho.frases as string[]} />

      {/* Bloco 4: Big Ideia (Virada) */}
      <BigIdeia 
        fraseCentral={bigIdeia.frase_central as string}
        explicacao={bigIdeia.explicacao as string}
      />

      {/* Bloco 5: Mecanismo Único */}
      <MecanismoUnico 
        nome={mecanismo.nome as string}
        oQueE={mecanismo.o_que_e as string}
        oQueMuda={mecanismo.o_que_muda as string}
        oQueDeixaDeAcontecer={mecanismo.o_que_deixa as string}
      />

      {/* Bloco 6: Apresentação da Formação */}
      <ApresentacaoFormacao 
        titulo={apresentacao.titulo as string}
        subtitulo={apresentacao.subtitulo as string}
        detalhes={apresentacao.detalhes as {
          duracao?: string;
          estrutura?: string;
          presenca?: string;
          ritoFinal?: string;
        }}
      />

      {/* Bloco 7: Para Quem É / Para Quem Não É */}
      <ParaQuemE 
        paraQuem={paraQuem.incluidos as string[]}
        naoParaQuem={paraQuem.excluidos as string[]}
      />

      {/* Bloco 8: Como a Travessia É Sustentada */}
      <ComoESustentada 
        titulo={sustentacao.titulo as string}
        subtitulo={sustentacao.subtitulo as string}
        elementos={sustentacao.elementos as {
          icone: string;
          titulo: string;
          descricao: string;
        }[]}
      />

      {/* Bloco 9: Investimento */}
      <div id="investimento">
        <InvestimentoBloco 
          titulo={planos.titulo as string}
          subtitulo={planos.subtitulo as string}
          planos={planos.planos as {
            nome: string;
            preco: string;
            periodo: string;
            items: string[];
            destaque?: boolean;
            checkout_url?: string;
          }[]}
          notaFinal={planos.nota_final as string}
        />
      </div>

      {/* FAQ */}
      <FAQFormacao 
        titulo={faq.titulo as string}
        items={faq.items as { pergunta: string; resposta: string }[]}
      />

      {/* Fechamento Ritual */}
      <FechamentoRitual 
        frase={fechamento.frase as string}
        cta={fechamento.cta as string}
      />
    </div>
  );
}
