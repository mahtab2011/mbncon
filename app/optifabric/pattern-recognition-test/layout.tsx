import { RequireOptiFabricAuth } from "@/components/optifabric/RequireOptiFabricAuth";

export default function PatternRecognitionTestLayout({ children }: { children: React.ReactNode }) {
  return <RequireOptiFabricAuth>{children}</RequireOptiFabricAuth>;
}
