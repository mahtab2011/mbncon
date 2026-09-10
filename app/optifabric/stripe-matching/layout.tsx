import { RequireOptiFabricAuth } from "@/components/optifabric/RequireOptiFabricAuth";

export default function StripeMatchingLayout({ children }: { children: React.ReactNode }) {
  return <RequireOptiFabricAuth>{children}</RequireOptiFabricAuth>;
}
