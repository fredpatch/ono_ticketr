"use client";

import AnimationWrapper from "@/components/shared/AnimationWrapper";
import NavBar from "@/components/shared/NavBar";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AnimationWrapper keyValue="auth-layout">
      <NavBar />
      <>{children}</>
    </AnimationWrapper>
  );
}
