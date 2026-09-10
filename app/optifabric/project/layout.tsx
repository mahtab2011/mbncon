import { RequireOptiFabricAuth } from "@/components/optifabric/RequireOptiFabricAuth";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return <RequireOptiFabricAuth>{children}</RequireOptiFabricAuth>;
}
