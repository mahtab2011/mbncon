import { RequireOptiFabricAuth } from "@/components/optifabric/RequireOptiFabricAuth";

export default function ReleaseFreezeLayout({ children }: { children: React.ReactNode }) {
  return <RequireOptiFabricAuth>{children}</RequireOptiFabricAuth>;
}
