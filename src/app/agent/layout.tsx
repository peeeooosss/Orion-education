import { AgentLayout } from "@/components/layout/AgentLayout";
import { ZoneSwitcher } from "@/components/layout/ZoneSwitcher";

export default function AgentLayoutRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AgentLayout>{children}</AgentLayout>
      <ZoneSwitcher />
    </>
  );
}
