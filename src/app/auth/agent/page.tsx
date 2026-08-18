"use client";

import { Suspense } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { RoleLoginForm } from "@/components/auth/RoleLoginForm";

function AgentSignInContent() {
  return (
    <>
      <SiteHeader />
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
        <RoleLoginForm role="agent" />
      </main>
      <Footer />
    </>
  );
}

export default function AgentSignInPage() {
  return <Suspense fallback={null}><AgentSignInContent /></Suspense>;
}
