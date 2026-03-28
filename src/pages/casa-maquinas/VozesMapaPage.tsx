import { Link } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { CasaMaquinasSidebar } from '@/components/casa-maquinas/CasaMaquinasSidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { VOZES } from '@/data/vozes';
import { useState } from 'react';

export default function VozesMapaPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedVoz = VOZES.find(v => v.id === selected);

  // Radial layout for the 7 voices around a center
  const cx = 250, cy = 250, r = 160;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <CasaMaquinasSidebar />
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <Link to="/casa-das-maquinas/7-vozes">
                <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
              </Link>
              <h1 className="text-2xl font-display font-bold text-foreground">Mapa de Integração</h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Mandala SVG */}
              <div className="flex-1 flex justify-center">
                <svg viewBox="0 0 500 500" className="w-full max-w-[500px]">
                  {/* Center circle */}
                  <circle cx={cx} cy={cy} r={30} className="fill-primary/20 stroke-primary" strokeWidth={1.5} />
                  <text x={cx} y={cy + 4} textAnchor="middle" className="fill-primary text-[10px] font-semibold">7 Vozes</text>

                  {VOZES.map((voz, i) => {
                    const angle = (Math.PI * 2 * i) / 7 - Math.PI / 2;
                    const x = cx + r * Math.cos(angle);
                    const y = cy + r * Math.sin(angle);
                    const isSelected = selected === voz.id;

                    return (
                      <g key={voz.id} className="cursor-pointer" onClick={() => setSelected(isSelected ? null : voz.id)}>
                        {/* Connection line */}
                        <line x1={cx} y1={cy} x2={x} y2={y} stroke={`hsl(${voz.cor})`} strokeWidth={isSelected ? 2.5 : 1} strokeOpacity={isSelected ? 0.8 : 0.3} />
                        {/* Voice circle */}
                        <circle cx={x} cy={y} r={isSelected ? 32 : 26} fill={`hsl(${voz.cor})`} fillOpacity={isSelected ? 0.25 : 0.15} stroke={`hsl(${voz.cor})`} strokeWidth={isSelected ? 2 : 1} />
                        <text x={x} y={y + 3} textAnchor="middle" className="fill-foreground text-[8px] font-medium pointer-events-none" style={{ fontSize: '8px' }}>
                          {voz.nome.split(' ').length > 2 ? voz.nome.split(' ').slice(0, 2).join(' ') : voz.nome}
                        </text>

                        {/* District nodes around each voice */}
                        {isSelected && voz.distritos.map((d, di) => {
                          const dAngle = angle + ((di - 1) * 0.35);
                          const dx = cx + (r + 65) * Math.cos(dAngle);
                          const dy = cy + (r + 65) * Math.sin(dAngle);
                          return (
                            <g key={d}>
                              <line x1={x} y1={y} x2={dx} y2={dy} stroke={`hsl(${voz.cor})`} strokeWidth={1} strokeOpacity={0.4} strokeDasharray="4 2" />
                              <rect x={dx - 35} y={dy - 8} width={70} height={16} rx={8} fill={`hsl(${voz.cor})`} fillOpacity={0.12} stroke={`hsl(${voz.cor})`} strokeWidth={0.5} />
                              <text x={dx} y={dy + 3} textAnchor="middle" className="fill-foreground pointer-events-none" style={{ fontSize: '6px' }}>{d}</text>
                            </g>
                          );
                        })}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Detail panel */}
              {selectedVoz && (
                <div className="w-full lg:w-72 space-y-4 p-5 rounded-xl border border-border/40 bg-card/60">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: `hsl(${selectedVoz.cor})` }} />
                    <h3 className="font-display font-semibold text-foreground">{selectedVoz.nome}</h3>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground mb-1">Distritos</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedVoz.distritos.map(d => (
                        <span key={d} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px]">{d}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground mb-1">Ferramentas</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedVoz.ferramentas.map(f => (
                        <span key={f} className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px]">{f}</span>
                      ))}
                    </div>
                  </div>
                  <Link to={`/casa-das-maquinas/7-vozes/${selectedVoz.id}`}>
                    <Button variant="outline" size="sm" className="w-full mt-2 text-xs">Ver detalhe</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
