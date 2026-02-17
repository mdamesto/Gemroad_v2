import { ClientLayout } from "../client-layout";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
