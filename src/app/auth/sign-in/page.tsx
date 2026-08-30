"use client";

import { Suspense } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { RoleLoginForm } from "@/components/auth/RoleLoginForm";

function SignInContent() {
  return (
    <>
      <SiteHeader />
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-10">
        <RoleLoginForm />
      </main>
      <Footer />
    </>
  );
}

export default function SignInPage() {
  return <Suspense fallback={null}><SignInContent /></Suspense>;
}
