import { Suspense } from "react";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BookingWizard from "@/components/booking/BookingWizard";

// Depends on the Supabase client at request time (via BookingWizard) —
// must not be statically prerendered at build time, when env vars aren't
// guaranteed to be present.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reserva tu viaje | Yo Viajo con Jesus",
};

export default function BookPage() {
  return (
    <>
      <Nav />
      <main id="main" className="flex-1 pb-24 pt-36">
        <Suspense fallback={null}>
          <BookingWizard />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
