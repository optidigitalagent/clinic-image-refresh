import { Header } from "../src/components/site/Header";
import { Footer } from "../src/components/site/Footer";
import { Hero } from "../src/components/site/Hero";
import { Services } from "../src/components/site/Services";
import { AboutClinic } from "../src/components/site/AboutClinic";
import { Team } from "../src/components/site/Team";
import { Cases } from "../src/components/site/Cases";
import { Certificates } from "../src/components/site/Certificates";
import { Contacts } from "../src/components/site/Contacts";
import { StaticAppointment } from "./StaticAppointment";
import { StaticPricePage } from "./StaticPricePage";

function HomePage() {
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
        <StaticAppointment />
        <Contacts />
      </main>
      <Footer />
    </div>
  );
}

function getPagePath() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const pathname = window.location.pathname;

  if (basePath && pathname.startsWith(basePath)) {
    return pathname.slice(basePath.length).replace(/^\/+/, "");
  }

  return pathname.replace(/^\/+/, "");
}

export function StaticApp() {
  const pagePath = getPagePath();

  if (pagePath === "price" || pagePath.startsWith("price/")) {
    return <StaticPricePage />;
  }

  return <HomePage />;
}
