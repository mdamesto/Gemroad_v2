import type { Metadata } from "next";
import "./globals.css";
import { StyledComponentsRegistry } from "@/lib/styled-registry";
import { ClientLayout } from "./client-layout";

export const metadata: Metadata = {
  title: "GemRoad - TCG Post-Apocalyptique",
  description:
    "Collectionnez des cartes, complétez des séries, gagnez des pierres précieuses. Un jeu de cartes à collectionner post-apocalyptique.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <StyledComponentsRegistry>
          <ClientLayout>{children}</ClientLayout>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
