import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { withBasePath } from "@/lib/base-path";
import { SectionHeading } from "./SectionLabel";

const DOCTORS = [
  {
    photo: withBasePath("media/doctors/doctor-nataliia-lytovchenko.webp"),
    role: "Щелепно-лицевий хірург вищої категорії",
    name: "Литовченко Наталія Михайлівна",
    intro:
      "Кандидат медичних наук, доцент кафедри хірургічної стоматології та щелепно-лицьової хірургії НМУ імені О.О. Богомольця.",
    bullets: [
      "Член EACMFS, Української асоціації черепно-щелепно-лицьових хірургів та Асоціації стоматологів України.",
      "Реконструктивно-відновні операції при дефектах і деформаціях щелеп та м'яких тканин обличчя.",
      "Кістково-пластичні операції кісток лицьового черепа, лікування захворювань слинних залоз і СНЩС.",
      "Дентальна імплантація, синус-ліфтинг, кісткова пластика та лікування утрудненого прорізування зубів мудрості.",
    ],
  },
  {
    photo: withBasePath("media/doctors/doctor-olha-hushcha.webp"),
    role: "Лікар-стоматолог широкого профілю",
    name: "Гуща Ольга Анатоліївна",
    intro:
      "Спеціалізація — терапія, ортопедія та ортодонтія. Працює з 2003 року й має великий практичний досвід.",
    bullets: [
      "Всі види лікування зубів: карієс, кореневі канали та некаріозні ураження.",
      "Протезування: керамічні коронки, вкладки, накладки, вініри та коронки на імплантах.",
      "Ортодонтія: виправлення прикусу у дорослих і підлітків сучасними методиками.",
      "Лікування тканин пародонту та комплексна реабілітація зубних рядів і зубощелепних деформацій.",
    ],
  },
  {
    photo: withBasePath("media/doctors/doctor-dmytro-hushcha.webp"),
    role: "Лікар-стоматолог-ортопед вищої категорії",
    name: "Гуща Дмитро Костянтинович",
    intro:
      "Кандидат медичних наук, доцент кафедри НМУ імені О.О. Богомольця. Досвід клінічної практики — 25 років.",
    bullets: [
      "Спеціалізація — ортопедична стоматологія та гнатологія.",
      "Функціональна діагностика, планування комплексного ортопедичного лікування та відновлення прикусу.",
      "Протезування зубів і реабілітація з урахуванням роботи скронево-нижньощелепного суглоба.",
    ],
  },
];

function DoctorCard({ d }: { d: (typeof DOCTORS)[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="rounded-3xl border border-border/70 bg-card overflow-hidden flex flex-col">
      <div className="aspect-[4/5] overflow-hidden bg-muted">
        <img src={d.photo} alt={d.name} className="h-full w-full object-cover" />
      </div>
      <div className="p-6 flex flex-col gap-3">
        <div className="text-xs uppercase tracking-wider" style={{ color: "var(--brand-green-deep)" }}>
          {d.role}
        </div>
        <h3 className="text-xl font-display leading-tight">{d.name}</h3>
        <p className="text-sm text-muted-foreground">{d.intro}</p>

        {open && (
          <ul className="mt-2 space-y-2 animate-in fade-in">
            {d.bullets.map((b) => (
              <li key={b} className="text-xs text-foreground/75 pl-3 relative">
                <span
                  className="absolute left-0 top-1.5 h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--brand-pink-strong)" }}
                />
                {b}
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium self-start rounded-full border border-border px-3 py-1.5 hover:border-foreground/40 transition-colors"
          style={{ color: "var(--brand-green-deep)" }}
        >
          {open ? "Згорнути" : "Детальніше про лікаря"}
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
    </article>
  );
}

export function Team() {
  return (
    <section id="team" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Команда"
          title={<>Лікарі, які бачать <br /><em style={{ color: "var(--brand-pink-strong)" }}>всю картину</em></>}
          subtitle="Клінічна практика, науковий досвід і комплексний погляд на здоров'я зубощелепної системи."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
          {DOCTORS.map((d) => (
            <DoctorCard key={d.name} d={d} />
          ))}
        </div>
      </div>
    </section>
  );
}
