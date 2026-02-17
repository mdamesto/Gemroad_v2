import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import "./globals.css";
import { StyledComponentsRegistry } from "@/lib/styled-registry";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

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
    <html lang="fr" className={cinzel.variable}>
      <body>
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
