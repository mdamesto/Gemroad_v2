"use client";

import styled, { ThemeProvider } from "styled-components";
import { theme } from "@/lib/theme";
import { AuthProvider } from "@/hooks/use-user";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { LeftNav } from "@/components/layout/left-nav";
import { Footer } from "@/components/layout/footer";
import { BoosterAnimation } from "@/components/cards/booster-animation";
import { AmbientBackground } from "@/components/ui/ambient-background";
import { ToastContainer } from "@/components/ui/toast";

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
`;

const Body = styled.div`
  display: flex;
  flex: 1;
`;

const Main = styled.main`
  flex: 1;
  position: relative;
  z-index: 1;
  margin-left: 220px;
  padding-top: 16px;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AppWrapper>
          <AmbientBackground />
          <Navbar />
          <Sidebar />
          <Body>
            <LeftNav />
            <Main>{children}</Main>
          </Body>
          <Footer />
          <BoosterAnimation />
          <ToastContainer />
        </AppWrapper>
      </AuthProvider>
    </ThemeProvider>
  );
}
