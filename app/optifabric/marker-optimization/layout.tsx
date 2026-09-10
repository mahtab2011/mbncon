import { RequireOptiFabricAuth } from "@/components/optifabric/RequireOptiFabricAuth";

export default function MarkerOptimizationLayout({ children }: { children: React.ReactNode }) {
  return <RequireOptiFabricAuth>{children}</RequireOptiFabricAuth>;
}
