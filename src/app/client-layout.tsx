"use client";

import styled from "styled-components";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";
import { BoosterAnimation } from "@/components/cards/booster-animation";

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Main = styled.main`
  flex: 1;
`;

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppWrapper>
      <Navbar />
      <Sidebar />
      <Main>{children}</Main>
      <Footer />
      <BoosterAnimation />
    </AppWrapper>
  );
}
