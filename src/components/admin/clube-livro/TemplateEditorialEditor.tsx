
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RotaItem } from './types';
import { ImageUpload } from '../ImageUpload';
import { VideoUpload } from '../VideoUpload';
import { AudioUpload } from '../AudioUpload';

interface TemplateEditorialEditorProps {
  item: RotaItem;
  onUpdate: (data: Partial<RotaItem>) => void;
}

export function TemplateEditorialEditor({ item, onUpdate }: TemplateEditorialEditorProps) {
  const metadata = item.metadata || {};

  const updateMetadata = (key: string, value: any) => {
    onUpdate({
      metadata: {
        ...metadata,
        [key]: value
      }
    });
  };

  const renderPortalFields = () => (
    <div className="space-y-4 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase">Essência</Label>
          <Input 
            value={metadata.essencia || ''} 
            onChange={(e) => updateMetadata('essencia', e.target.value)}
            placeholder="A ideia central deste portal"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase">Tensão Central</Label>
          <Input 
            value={metadata.tensao_central || ''} 
            onChange={(e) => updateMetadata('tensao_central', e.target.value)}
            placeholder="O conflito que a aluna enfrentará"
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs font-bold uppercase">Texto de Abertura</Label>
        <Textarea 
          value={metadata.texto_abertura || ''} 
          onChange={(e) => updateMetadata('texto_abertura', e.target.value)}
          placeholder="O convite para entrar"
          className="min-h-[100px]"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs font-bold uppercase">Núcleo 80/20</Label>
        <Textarea 
          value={metadata.nucleo_8020 || ''} 
          onChange={(e) => updateMetadata('nucleo_8020', e.target.value)}
          placeholder="A teoria fundamental concentrada"
          className="min-h-[100px]"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase">Risco Ético</Label>
          <Input 
            value={metadata.risco_etico || ''} 
            onChange={(e) => updateMetadata('risco_etico', e.target.value)}
            placeholder="O perigo de não integrar este passo"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase">Frase Final</Label>
          <Input 
            value={metadata.frase_final || ''} 
            onChange={(e) => updateMetadata('frase_final', e.target.value)}
            placeholder="O comando final"
          />
        </div>
      </div>
    </div>
  );

  const renderEscutaFields = () => (
    <div className="space-y-4 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase">Duração (Ex: 15:00)</Label>
          <Input 
            value={metadata.duracao || ''} 
            onChange={(e) => updateMetadata('duracao', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase">CTA (Texto do Botão)</Label>
          <Input 
            value={metadata.cta || ''} 
            onChange={(e) => updateMetadata('cta', e.target.value)}
            placeholder="O que fazer após ouvir?"
          />
        </div>
      </div>
      <div className="space-y-3">
        <Label className="text-xs font-bold uppercase">Áudio da Escuta</Label>
        <AudioUpload 
          value={metadata.audio_url || ''} 
          onChange={(url) => updateMetadata('audio_url', url)}
          folder="escutas"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs font-bold uppercase">Roteiro / Resumo</Label>
        <Textarea 
          value={metadata.roteiro || ''} 
          onChange={(e) => updateMetadata('roteiro', e.target.value)}
          placeholder="Tópicos principais do áudio"
          className="min-h-[100px]"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs font-bold uppercase">Perguntas Orientadoras</Label>
        <Textarea 
          value={metadata.perguntas || ''} 
          onChange={(e) => updateMetadata('perguntas', e.target.value)}
          placeholder="O que a aluna deve se perguntar durante a escuta?"
          className="min-h-[80px]"
        />
      </div>
    </div>
  );

  const renderLaboratorioFields = () => (
    <div className="space-y-4 pt-4">
      <div className="space-y-1">
        <Label className="text-xs font-bold uppercase">Objetivo da Prática</Label>
        <Input 
          value={metadata.objetivo || ''} 
          onChange={(e) => updateMetadata('objetivo', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase">Exercício Pessoal</Label>
          <Textarea 
            value={metadata.exercicio_pessoal || ''} 
            onChange={(e) => updateMetadata('exercicio_pessoal', e.target.value)}
            placeholder="Ação individual da aluna"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase">Aplicação na Sessão</Label>
          <Textarea 
            value={metadata.aplicacao_sessao || ''} 
            onChange={(e) => updateMetadata('aplicacao_sessao', e.target.value)}
            placeholder="Como usar isso clinicamente?"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase">Erro Comum</Label>
          <Input 
            value={metadata.erro_comum || ''} 
            onChange={(e) => updateMetadata('erro_comum', e.target.value)}
            placeholder="O que evitar?"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase">Resultado Esperado</Label>
          <Input 
            value={metadata.resultado_esperado || ''} 
            onChange={(e) => updateMetadata('resultado_esperado', e.target.value)}
            placeholder="O que a aluna deve sentir/saber após o lab?"
          />
        </div>
      </div>
    </div>
  );

  const renderTravessiaFields = () => (
    <div className="space-y-4 pt-4">
      <div className="space-y-1">
        <Label className="text-xs font-bold uppercase">Objetivo da Travessia</Label>
        <Input 
          value={metadata.objetivo || ''} 
          onChange={(e) => updateMetadata('objetivo', e.target.value)}
          placeholder="Onde a aluna deve chegar?"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase">Mapa da Jornada (Markdown)</Label>
          <Textarea 
            value={metadata.mapa_jornada || ''} 
            onChange={(e) => updateMetadata('mapa_jornada', e.target.value)}
            placeholder="Descreva os marcos da travessia..."
            className="min-h-[120px]"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase">Instruções de Navegação</Label>
          <Textarea 
            value={metadata.instrucoes || ''} 
            onChange={(e) => updateMetadata('instrucoes', e.target.value)}
            placeholder="Como navegar por este trecho?"
            className="min-h-[120px]"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase">Alerta de Terreno (Aviso)</Label>
          <Input 
            value={metadata.alerta || ''} 
            onChange={(e) => updateMetadata('alerta', e.target.value)}
            placeholder="Cuidado com..."
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase">Ponto de Reabastecimento</Label>
          <Input 
            value={metadata.reabastecimento || ''} 
            onChange={(e) => updateMetadata('reabastecimento', e.target.value)}
            placeholder="Recurso extra de apoio"
          />
        </div>
      </div>
    </div>
  );

  const renderEncontroFields = () => (
    <div className="space-y-4 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase">Data/Hora do Encontro</Label>
          <Input 
            type="datetime-local"
            value={metadata.data_hora || ''} 
            onChange={(e) => updateMetadata('data_hora', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase">Link da Sala (Zoom/Meet)</Label>
          <Input 
            value={metadata.link_sala || ''} 
            onChange={(e) => updateMetadata('link_sala', e.target.value)}
            placeholder="https://zoom.us/j/..."
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs font-bold uppercase">Pauta do Encontro</Label>
        <Textarea 
          value={metadata.pauta || ''} 
          onChange={(e) => updateMetadata('pauta', e.target.value)}
          placeholder="O que será discutido?"
          className="min-h-[100px]"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase">Leitura Prévia</Label>
          <Input 
            value={metadata.leitura_previa || ''} 
            onChange={(e) => updateMetadata('leitura_previa', e.target.value)}
            placeholder="Capítulos ou páginas"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase">Material Necessário</Label>
          <Input 
            value={metadata.materiais || ''} 
            onChange={(e) => updateMetadata('materiais', e.target.value)}
            placeholder="Caderno, velas, etc."
          />
        </div>
      </div>
    </div>
  );

  const renderRegistroFields = () => (
    <div className="space-y-4 pt-4">
      <div className="space-y-1">
        <Label className="text-xs font-bold uppercase">Pergunta Principal</Label>
        <Input 
          value={metadata.pergunta_principal || ''} 
          onChange={(e) => updateMetadata('pergunta_principal', e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs font-bold uppercase">Pergunta Profunda (Sombra)</Label>
        <Input 
          value={metadata.pergunta_profunda || ''} 
          onChange={(e) => updateMetadata('pergunta_profunda', e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs font-bold uppercase">Orientação para a Escrita</Label>
        <Textarea 
          value={metadata.orientacao_escrita || ''} 
          onChange={(e) => updateMetadata('orientacao_escrita', e.target.value)}
          placeholder="Como realizar este registro?"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs font-bold uppercase">Integração Simbólica</Label>
        <Input 
          value={metadata.integracao_simbolica || ''} 
          onChange={(e) => updateMetadata('integracao_simbolica', e.target.value)}
          placeholder="Qual objeto ou imagem representa esta integração?"
        />
      </div>
    </div>
  );

  const renderIntegracaoFields = () => (
    <div className="space-y-4 pt-4">
      <div className="space-y-1">
        <Label className="text-xs font-bold uppercase">Síntese do Ciclo</Label>
        <Textarea 
          value={metadata.sintese || ''} 
          onChange={(e) => updateMetadata('sintese', e.target.value)}
          placeholder="O que foi aprendido em uma frase?"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase">Frase-Semente</Label>
          <Input 
            value={metadata.frase_semente || ''} 
            onChange={(e) => updateMetadata('frase_semente', e.target.value)}
            placeholder="O que floresce agora?"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase">Mudança Percebida</Label>
          <Input 
            value={metadata.mudanca_percebida || ''} 
            onChange={(e) => updateMetadata('mudanca_percebida', e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase">Próximo Passo (Gatilho)</Label>
          <Input 
            value={metadata.proximo_passo || ''} 
            onChange={(e) => updateMetadata('proximo_passo', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase">Fechamento Ritualístico</Label>
          <Input 
            value={metadata.fechamento || ''} 
            onChange={(e) => updateMetadata('fechamento', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderDefaultFields = () => (
    <div className="space-y-4 pt-4">
      <div className="space-y-1">
        <Label className="text-xs font-bold uppercase">Descrição/Conteúdo</Label>
        <Textarea 
          value={item.subtitulo || ''} 
          onChange={(e) => onUpdate({ subtitulo: e.target.value })}
          className="min-h-[150px]"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="border-gold/20 bg-gold/5">
        <CardHeader className="py-3 px-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-display text-gold uppercase tracking-widest">
                Template Editorial: {item.tipo}
              </CardTitle>
              <CardDescription className="text-[10px]">
                Preencha os campos específicos deste tipo de conteúdo.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Tabs defaultValue="conteudo" className="w-auto">
                <TabsList className="h-8 bg-background/50 border border-primary/5">
                  <TabsTrigger value="conteudo" className="text-[10px] uppercase h-7 px-3">Editorial</TabsTrigger>
                  <TabsTrigger value="midia" className="text-[10px] uppercase h-7 px-3">Mídia</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Tabs defaultValue="conteudo">
            <TabsContent value="conteudo">
              {item.tipo === 'portal' && renderPortalFields()}
              {item.tipo === 'escuta' && renderEscutaFields()}
              {item.tipo === 'travessia' && renderTravessiaFields()}
              {item.tipo === 'laboratorio' && renderLaboratorioFields()}
              {item.tipo === 'registro' && renderRegistroFields()}
              {item.tipo === 'integracao' && renderIntegracaoFields()}
              {item.tipo === 'encontro' && renderEncontroFields()}
              {!['portal', 'escuta', 'travessia', 'laboratorio', 'registro', 'integracao', 'encontro'].includes(item.tipo) && renderDefaultFields()}
            </TabsContent>
            
            <TabsContent value="midia" className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUpload 
                  value={item.image_url || ''} 
                  onChange={(url) => onUpdate({ image_url: url })}
                  label="Imagem de Capa (Opcional)"
                  folder="clube-assets"
                  aspectRatio="video"
                />
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase">URL do Vídeo (Vimeo/Youtube)</Label>
                    <Input 
                      value={metadata.video_url || ''} 
                      onChange={(e) => updateMetadata('video_url', e.target.value)}
                      placeholder="https://vimeo.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase">Botão CTA (Texto)</Label>
                    <Input 
                      value={metadata.cta_label || ''} 
                      onChange={(e) => updateMetadata('cta_label', e.target.value)}
                      placeholder="Ex: Quero saber mais"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase">Link do CTA</Label>
                    <Input 
                      value={metadata.cta_url || ''} 
                      onChange={(e) => updateMetadata('cta_url', e.target.value)}
                      placeholder="Ex: https://formacaooracula.com.br"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase">ID do Recurso Externo</Label>
                    <Input 
                      value={item.ref_id || ''} 
                      onChange={(e) => onUpdate({ ref_id: e.target.value })}
                      placeholder="UUID do recurso relacionado"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
