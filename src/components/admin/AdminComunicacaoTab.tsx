import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Zap, History, Send, Activity } from 'lucide-react';
import { AutomationHealthDashboard } from './communication/AutomationHealthDashboard';
import { CommunicationTemplates } from './communication/CommunicationTemplates';
import { CommunicationAutomation } from './communication/CommunicationAutomation';
import { CommunicationLogs } from './communication/CommunicationLogs';
import { CommunicationCampaigns } from './communication/CommunicationCampaigns';

export function AdminComunicacaoTab() {
  const [activeTab, setActiveTab] = useState('templates');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Comunicação</h2>
        <p className="text-muted-foreground">
          Gerencie templates, automações e envios de mensagens
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="templates" className="gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="automation" className="gap-2">
            <Zap className="h-4 w-4" />
            Automação
          </TabsTrigger>
          <TabsTrigger value="health" className="gap-2">
            <Activity className="h-4 w-4" />
            Saúde
          </TabsTrigger>
          <TabsTrigger value="logs" className="gap-2">
            <History className="h-4 w-4" />
            Logs
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="gap-2">
            <Send className="h-4 w-4" />
            Envio Manual
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <CommunicationTemplates />
        </TabsContent>

        <TabsContent value="automation" className="mt-6">
          <CommunicationAutomation />
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <CommunicationLogs />
        </TabsContent>

        <TabsContent value="campaigns" className="mt-6">
          <CommunicationCampaigns />
        </TabsContent>
      </Tabs>
    </div>
  );
}
