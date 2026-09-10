import { RequireOptiFabricAuth } from "@/components/optifabric/RequireOptiFabricAuth";

export default function PilotDashboardLayout({ children }: { children: React.ReactNode }) {
  return <RequireOptiFabricAuth>{children}</RequireOptiFabricAuth>;
}
