import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TripRequestForm from "@/components/TripRequestForm";

export const metadata: Metadata = {
  title: "Solicita un viaje | Yo Viajo con Jesus",
};

export default function TripRequestPage() {
  return (
    <>
      <Nav />
      <main id="main" className="flex-1 pb-24 pt-36">
        <div className="wrap max-w-2xl">
          <TripRequestForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
