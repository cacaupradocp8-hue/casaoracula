import { useState, useEffect } from 'react';
import { Leaf, Plus, Calendar, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useJardimGrupo } from '@/hooks/useJardimGrupo';
import { JardimGrupoRegistro, ClimaMovimento, CLIMA_MOVIMENTO_LABELS, CLIMA_MOVIMENTO_ICONS } from '@/types/jardim-grupo';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface JardimGrupoTabProps {
  groupId: string;
  sessionId?: string;
}

export function JardimGrupoTab({ groupId, sessionId }: JardimGrupoTabProps) {
  const { loading, fetchRegistros, createRegistro, deleteRegistro } = useJardimGrupo();
  const [registros, setRegistros] = useState<JardimGrupoRegistro[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [faseJornadaGrupo, setFaseJornadaGrupo] = useState('');
  const [temaSimbolico, setTemaSimbolico] = useState('');
  const [ritualAtual, setRitualAtual] = useState('');
  const [climaMovimento, setClimaMovimento] = useState<ClimaMovimento | ''>('');
  const [climaDescricao, setClimaDescricao] = useState('');
  const [escutaCampo, setEscutaCampo] = useState('');
  const [movimentosRepetidos, setMovimentosRepetidos] = useState('');
  const [escutaColetiva, setEscutaColetiva] = useState('');
  const [resistenciasGrupais, setResistenciasGrupais] = useState('');
  const [ritualRealizado, setRitualRealizado] = useState('');
  const [respostaCampo, setRespostaCampo] = useState('');
  const [imagensEmergentes, setImagensEmergentes] = useState('');
  const [simbolosColetivos, setSimbolosColetivos] = useState('');
  const [fraseSementeGrupo, setFraseSementeGrupo] = useState('');
  const [campoFechado, setCampoFechado] = useState(false);
  const [ritualFechamento, setRitualFechamento] = useState('');
  const [cuidadoProximoEncontro, setCuidadoProximoEncontro] = useState('');
  const [notasPrivadas, setNotasPrivadas] = useState('');

  useEffect(() => {
    loadRegistros();
  }, [groupId]);

  const loadRegistros = async () => {
    const data = await fetchRegistros(groupId);
    setRegistros(data);
  };

  const resetForm = () => {
    setFaseJornadaGrupo('');
    setTemaSimbolico('');
    setRitualAtual('');
    setClimaMovimento('');
    setClimaDescricao('');
    setEscutaCampo('');
    setMovimentosRepetidos('');
    setEscutaColetiva('');
    setResistenciasGrupais('');
    setRitualRealizado('');
    setRespostaCampo('');
    setImagensEmergentes('');
    setSimbolosColetivos('');
    setFraseSementeGrupo('');
    setCampoFechado(false);
    setRitualFechamento('');
    setCuidadoProximoEncontro('');
    setNotasPrivadas('');
  };

  const handleSave = async () => {
    const registro = await createRegistro({
      group_id: groupId,
      session_id: sessionId,
      therapist_id: '', // Will be set by hook
      fase_jornada_grupo: faseJornadaGrupo || undefined,
      tema_simbolico: temaSimbolico || undefined,
      ritual_atual: ritualAtual || undefined,
      clima_movimento: climaMovimento || undefined,
      clima_descricao: climaDescricao || undefined,
      escuta_campo: escutaCampo || undefined,
      movimentos_repetidos: movimentosRepetidos || undefined,
      escuta_coletiva: escutaColetiva || undefined,
      resistencias_grupais: resistenciasGrupais || undefined,
      ritual_realizado: ritualRealizado || undefined,
      resposta_campo: respostaCampo || undefined,
      imagens_emergentes: imagensEmergentes || undefined,
      simbolos_coletivos: simbolosColetivos || undefined,
      frase_semente_grupo: fraseSementeGrupo || undefined,
      campo_fechado: campoFechado,
      ritual_fechamento: ritualFechamento || undefined,
      cuidado_proximo_encontro: cuidadoProximoEncontro || undefined,
      notas_privadas: notasPrivadas || undefined,
    });

    if (registro) {
      resetForm();
      setShowForm(false);
      loadRegistros();
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteRegistro(id);
    if (success) {
      loadRegistros();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-green-500/20">
            <Leaf className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h2 className="text-lg font-display text-foreground">Jardim do Grupo</h2>
            <p className="text-sm text-muted-foreground">Diário simbólico do campo coletivo</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Registro
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader>
            <CardTitle className="text-base">Novo Registro do Campo</CardTitle>
            <CardDescription>Registre a escuta do campo coletivo deste encontro</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={['contexto', 'clima', 'fechamento']} className="space-y-2">
              {/* Contexto do Encontro */}
              <AccordionItem value="contexto" className="border rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium">
                  🌀 Contexto do Encontro
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Fase da Jornada Grupal</Label>
                      <Input
                        placeholder="Ex: Travessia do Limiar"
                        value={faseJornadaGrupo}
                        onChange={(e) => setFaseJornadaGrupo(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tema Simbólico</Label>
                      <Input
                        placeholder="Ex: A sombra coletiva"
                        value={temaSimbolico}
                        onChange={(e) => setTemaSimbolico(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ritual Atual</Label>
                      <Input
                        placeholder="Ex: Círculo de partilha"
                        value={ritualAtual}
                        onChange={(e) => setRitualAtual(e.target.value)}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Clima do Campo */}
              <AccordionItem value="clima" className="border rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium">
                  🌊 Clima do Campo
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Movimento do Campo</Label>
                    <Select value={climaMovimento} onValueChange={(v) => setClimaMovimento(v as ClimaMovimento)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o clima..." />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(CLIMA_MOVIMENTO_LABELS) as ClimaMovimento[]).map((key) => (
                          <SelectItem key={key} value={key}>
                            {CLIMA_MOVIMENTO_ICONS[key]} {CLIMA_MOVIMENTO_LABELS[key]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição do Clima</Label>
                    <Textarea
                      placeholder="Como o campo se apresentou hoje?"
                      value={climaDescricao}
                      onChange={(e) => setClimaDescricao(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Escuta do Campo</Label>
                    <Textarea
                      placeholder="O que o campo pediu? O que ficou em silêncio?"
                      value={escutaCampo}
                      onChange={(e) => setEscutaCampo(e.target.value)}
                      rows={2}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Ecos da Jornada Coletiva */}
              <AccordionItem value="ecos" className="border rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium">
                  🔄 Ecos da Jornada Coletiva
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Movimentos Repetidos</Label>
                    <Textarea
                      placeholder="Que padrões se repetem no grupo?"
                      value={movimentosRepetidos}
                      onChange={(e) => setMovimentosRepetidos(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Escuta Coletiva</Label>
                    <Textarea
                      placeholder="O que emerge da escuta conjunta?"
                      value={escutaColetiva}
                      onChange={(e) => setEscutaColetiva(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Resistências Grupais</Label>
                    <Textarea
                      placeholder="Onde o grupo encontra resistência?"
                      value={resistenciasGrupais}
                      onChange={(e) => setResistenciasGrupais(e.target.value)}
                      rows={2}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Ritual do Encontro */}
              <AccordionItem value="ritual" className="border rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium">
                  ✨ Ritual do Encontro
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Ritual Realizado</Label>
                    <Textarea
                      placeholder="Que ritual foi proposto/vivido?"
                      value={ritualRealizado}
                      onChange={(e) => setRitualRealizado(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Resposta do Campo</Label>
                    <Textarea
                      placeholder="Como o campo respondeu ao ritual?"
                      value={respostaCampo}
                      onChange={(e) => setRespostaCampo(e.target.value)}
                      rows={2}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Imagens, Símbolos e Frases */}
              <AccordionItem value="simbolos" className="border rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium">
                  🌱 Imagens, Símbolos e Frases
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Imagens Emergentes</Label>
                    <Textarea
                      placeholder="Que imagens surgiram no encontro?"
                      value={imagensEmergentes}
                      onChange={(e) => setImagensEmergentes(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Símbolos Coletivos</Label>
                    <Textarea
                      placeholder="Símbolos que marcaram o grupo"
                      value={simbolosColetivos}
                      onChange={(e) => setSimbolosColetivos(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Frase-Semente do Grupo</Label>
                    <Input
                      placeholder="Uma frase que sintetiza o encontro"
                      value={fraseSementeGrupo}
                      onChange={(e) => setFraseSementeGrupo(e.target.value)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Fechamento Ético */}
              <AccordionItem value="fechamento" className="border rounded-lg px-4 border-amber-500/30">
                <AccordionTrigger className="text-sm font-medium text-amber-400">
                  🔐 Fechamento Ético (Obrigatório)
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <Switch
                      checked={campoFechado}
                      onCheckedChange={setCampoFechado}
                    />
                    <div>
                      <Label className="text-amber-400">Campo Fechado</Label>
                      <p className="text-xs text-muted-foreground">
                        Confirmo que o campo simbólico foi encerrado adequadamente
                      </p>
                    </div>
                    {campoFechado ? (
                      <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-400 ml-auto" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Ritual de Fechamento</Label>
                    <Textarea
                      placeholder="Como o campo foi fechado?"
                      value={ritualFechamento}
                      onChange={(e) => setRitualFechamento(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cuidado para o Próximo Encontro</Label>
                    <Textarea
                      placeholder="O que precisa de atenção no próximo encontro?"
                      value={cuidadoProximoEncontro}
                      onChange={(e) => setCuidadoProximoEncontro(e.target.value)}
                      rows={2}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Notas Privadas */}
              <AccordionItem value="notas" className="border rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium">
                  📝 Notas Privadas
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label>Observações da Terapeuta</Label>
                    <Textarea
                      placeholder="Notas privadas sobre o grupo (não visíveis para participantes)"
                      value={notasPrivadas}
                      onChange={(e) => setNotasPrivadas(e.target.value)}
                      rows={3}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => { resetForm(); setShowForm(false); }}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                Salvar Registro
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* History */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Histórico de Registros ({registros.length})
        </h3>
        
        {registros.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-muted-foreground">
              <Leaf className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Nenhum registro ainda.</p>
              <p className="text-sm">Crie o primeiro registro do jardim do grupo.</p>
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-3 pr-4">
              {registros.map((registro) => (
                <Card key={registro.id} className="hover:border-green-500/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {format(new Date(registro.data_registro), "d 'de' MMMM, yyyy", { locale: ptBR })}
                        </span>
                        {registro.clima_movimento && (
                          <Badge variant="outline" className="text-xs">
                            {CLIMA_MOVIMENTO_ICONS[registro.clima_movimento]} {CLIMA_MOVIMENTO_LABELS[registro.clima_movimento]}
                          </Badge>
                        )}
                        {registro.campo_fechado ? (
                          <Badge className="bg-green-500/20 text-green-400 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Campo Fechado
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Campo Aberto
                          </Badge>
                        )}
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover registro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(registro.id)}>
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    <div className="space-y-2 text-sm">
                      {registro.tema_simbolico && (
                        <p><span className="text-muted-foreground">Tema:</span> {registro.tema_simbolico}</p>
                      )}
                      {registro.frase_semente_grupo && (
                        <p className="italic text-gold">"{registro.frase_semente_grupo}"</p>
                      )}
                      {registro.escuta_campo && (
                        <p className="text-muted-foreground line-clamp-2">{registro.escuta_campo}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
