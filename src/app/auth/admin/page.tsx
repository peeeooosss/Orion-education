"use client";

import { Suspense } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { RoleLoginForm } from "@/components/auth/RoleLoginForm";

function AdminSignInContent() {
  return (
    <>
      <SiteHeader />
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
        <RoleLoginForm role="admin" />
      </main>
      <Footer />
    </>
  );
}

export default function AdminSignInPage() {
  return <Suspense fallback={null}><AdminSignInContent /></Suspense>;
}
