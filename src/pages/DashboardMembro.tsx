import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardWelcome } from "@/components/dashboard/DashboardWelcome";
import { DashboardBussola } from "@/components/dashboard/DashboardBussola";
import { DashboardJornada } from "@/components/dashboard/DashboardJornada";
import { DashboardPaths } from "@/components/dashboard/DashboardPaths";
import { DashboardProgress } from "@/components/dashboard/DashboardProgress";
import { DashboardQuickActions } from "@/components/dashboard/DashboardQuickActions";
import { DashboardCommunity } from "@/components/dashboard/DashboardCommunity";

export default function DashboardMembro() {
  return (
    <AppLayout>
      <div className="container mx-auto px-5 md:px-6 py-8 pb-20 max-w-5xl">
        <DashboardWelcome />
        <DashboardBussola />
        <DashboardJornada />
        <DashboardPaths />
        <DashboardProgress />
        <DashboardQuickActions />
        <DashboardCommunity />
      </div>
    </AppLayout>
  );
}
