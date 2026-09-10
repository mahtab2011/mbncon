import { RequireOptiFabricAuth } from "@/components/optifabric/RequireOptiFabricAuth";

export default function CadImportDiagnosticsLayout({ children }: { children: React.ReactNode }) {
  return <RequireOptiFabricAuth>{children}</RequireOptiFabricAuth>;
}
