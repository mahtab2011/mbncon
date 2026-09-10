import { RequireOptiFabricAuth } from "@/components/optifabric/RequireOptiFabricAuth";

export default function EngineeringWizardLayout({ children }: { children: React.ReactNode }) {
  return <RequireOptiFabricAuth>{children}</RequireOptiFabricAuth>;
}
