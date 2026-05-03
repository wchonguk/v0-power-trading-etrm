import { AppShell } from "@/components/shell/app-shell";
import { DashboardPage } from "@/components/pages/dashboard";

export default function Home() {
  return (
    <AppShell>
      <DashboardPage />
    </AppShell>
  );
}
