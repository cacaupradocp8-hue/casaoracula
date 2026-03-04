import { Card, CardContent } from '@/components/ui/card';

export function CodigoTecelaTab() {
  return (
    <div className="mt-4 space-y-6">
      <Card className="border-gold/30 bg-gradient-to-br from-card to-gold/5">
        <CardContent className="p-8 space-y-6">
          <h2 className="text-2xl font-display text-gold text-center">Código da Tecelã</h2>
          <p className="text-center text-muted-foreground italic">
            Princípios éticos e simbólicos que orientam a prática das Facilitadoras Orácula
          </p>

          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              { title: '1. Escuta antes de tudo', text: 'Não interpretar, não diagnosticar, não prever. Escutar é o primeiro gesto da facilitação simbólica.' },
              { title: '2. Anonimização radical', text: 'Todo caso compartilhado deve ser completamente desidentificado. Nomes, locais e contextos específicos devem ser transformados.' },
              { title: '3. O símbolo não é explicação', text: 'Arquétipos, portas e territórios são campos de travessia, não rótulos. Nunca reduzir a cliente a um perfil.' },
              { title: '4. Silêncio é linguagem', text: 'Nem todo espaço precisa ser preenchido. O silêncio clínico é parte do Método Orácula.' },
              { title: '5. Ética do não-saber', text: 'Reconhecer os limites da própria escuta. Quando não souber, diga. Quando precisar, encaminhe.' },
              { title: '6. Sem romantização da dor', text: 'A travessia simbólica não transforma sofrimento em beleza. Ela oferece caminhos de integração, não de embelezamento.' },
              { title: '7. Interromper quando necessário', text: 'Se houver dissociação, risco ou sofrimento agudo, interromper imediatamente. A segurança psíquica é inegociável.' },
              { title: '8. Colaboração, não competição', text: 'A Casa das Tecelãs é espaço de troca e aprendizado mútuo. Cada facilitadora contribui com sua escuta única.' },
              { title: '9. Supervisão como prática', text: 'Participar regularmente de supervisões é compromisso ético, não opcional.' },
              { title: '10. O Método é vivo', text: 'O Método Orácula se atualiza com cada travessia. A prática transforma o método tanto quanto o método transforma a prática.' },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-lg bg-card/50 border border-border/50">
                <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.text}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8 italic">
            "A tecelã não cria o fio — ela revela o tecido que já existe."
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
