import { RequireOptiFabricAuth } from "@/components/optifabric/RequireOptiFabricAuth";

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <RequireOptiFabricAuth>{children}</RequireOptiFabricAuth>;
}
