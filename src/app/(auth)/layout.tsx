"use client";

import { AuthProvider } from "@/hooks/use-user";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
