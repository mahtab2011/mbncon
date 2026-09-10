import { RequireOptiFabricAuth } from "@/components/optifabric/RequireOptiFabricAuth";

export default function MiniPilotLayout({ children }: { children: React.ReactNode }) {
  return <RequireOptiFabricAuth>{children}</RequireOptiFabricAuth>;
}
