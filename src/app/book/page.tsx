import { Suspense } from "react";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BookingWizard from "@/components/booking/BookingWizard";

export const metadata: Metadata = {
  title: "Book your ride | Yo Viajo con Jesus",
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
