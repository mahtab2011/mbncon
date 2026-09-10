import { RequireOptiFabricAuth } from "@/components/optifabric/RequireOptiFabricAuth";

export default function GeometryEngineTestLayout({ children }: { children: React.ReactNode }) {
  return <RequireOptiFabricAuth>{children}</RequireOptiFabricAuth>;
}
