import { RequireOptiFabricAuth } from "@/components/optifabric/RequireOptiFabricAuth";

export default function CuttingAssistantLayout({ children }: { children: React.ReactNode }) {
  return <RequireOptiFabricAuth>{children}</RequireOptiFabricAuth>;
}
