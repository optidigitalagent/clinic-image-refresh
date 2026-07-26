import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { AboutClinic } from "@/components/site/AboutClinic";
import { Team } from "@/components/site/Team";
import { Cases } from "@/components/site/Cases";
import { Certificates } from "@/components/site/Certificates";
import { Appointment } from "@/components/site/Appointment";
import { Contacts } from "@/components/site/Contacts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ami Dental — стоматологія повного циклу в Києві" },
      {
        name: "description",
        content:
          "Ami Dental — сучасна стоматологія у Києві: терапія, ортодонтія, протезування, хірургія та імплантація. Досвідчена команда, індивідуальний план і турбота про пацієнта.",
      },
      { property: "og:title", content: "Ami Dental — стоматологія повного циклу в Києві" },
      {
        property: "og:description",
        content: "Комплексна стоматологічна допомога від досвідченої команди Ami Dental. Запис онлайн.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <AboutClinic />
        <Team />
        <Cases />
        <Certificates />
        <Appointment />
        <Contacts />
      </main>
      <Footer />
    </div>
  );
}
