import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CommunityFeed } from '@/components/comunidade/CommunityFeed';
import { CommunityForums } from '@/components/comunidade/CommunityForums';
import { CommunityGroups } from '@/components/comunidade/CommunityGroups';
import { FacilitadoraDirectory } from '@/components/comunidade/FacilitadoraDirectory';
import { CommunityEvents } from '@/components/comunidade/CommunityEvents';
import { MessageSquare, Newspaper, Users, UserCheck, Calendar } from 'lucide-react';

const tabs = [
  { value: 'feed', label: 'Feed', icon: Newspaper },
  { value: 'foruns', label: 'Fóruns', icon: MessageSquare },
  { value: 'grupos', label: 'Grupos', icon: Users },
  { value: 'diretorio', label: 'Diretório', icon: UserCheck },
  { value: 'eventos', label: 'Eventos', icon: Calendar },
];

export default function ComunidadePage() {
  return (
    <CasaMaquinasLayout
      title="Casa das Tecelãs"
      subtitle="Comunidade de terapeutas, facilitadoras e alunas em formação"
    >
      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList className="grid grid-cols-3 md:grid-cols-5 gap-2 h-auto bg-transparent p-0">
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2 px-3 py-3 rounded-lg border border-primary/20 data-[state=active]:bg-primary/15 data-[state=active]:border-primary/50 data-[state=active]:text-primary text-muted-foreground hover:text-foreground transition-all text-sm"
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden md:inline text-xs">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="feed"><CommunityFeed /></TabsContent>
        <TabsContent value="foruns"><CommunityForums /></TabsContent>
        <TabsContent value="grupos"><CommunityGroups /></TabsContent>
        <TabsContent value="diretorio"><FacilitadoraDirectory /></TabsContent>
        <TabsContent value="eventos"><CommunityEvents /></TabsContent>
      </Tabs>
    </CasaMaquinasLayout>
  );
}
