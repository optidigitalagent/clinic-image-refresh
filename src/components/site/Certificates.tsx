import { useState } from "react";
import { X } from "lucide-react";
import { withBasePath } from "@/lib/base-path";
import { SectionHeading } from "./SectionLabel";

type Certificate = {
  src: string;
  alt: string;
};

const CLOUDINARY_CERTIFICATE_BASE =
  "https://res.cloudinary.com/qofhq8xa/image/upload/f_auto,q_auto,c_limit,w_2000/certificates";

const CLOUDINARY_CERTIFICATE_NUMBERS = [
  "04",
  "18",
  "26",
  "27",
  "29",
  "05",
  "06",
  "08",
  "10",
  "12",
  "22",
  "24",
];

const CLOUDINARY_CERTIFICATES: Certificate[] = CLOUDINARY_CERTIFICATE_NUMBERS.map((number) => ({
  src: `${CLOUDINARY_CERTIFICATE_BASE}/certificate-${number}.png`,
  alt: `Сертифікат Ami Dental ${number}`,
}));

const ELECTRONIC_CERTIFICATES: Certificate[] = [
  {
    src: withBasePath("media/certificates/electronic/certificate-62.webp"),
    alt: "Сертифікат Ami Dental 62",
  },
  {
    src: withBasePath("media/certificates/electronic/certificate-gushcha-oa-2025.webp"),
    alt: "Сертифікат Гущі Ольги Анатоліївни, 2025",
  },
  {
    src: withBasePath("media/certificates/electronic/certificate-gushcha-oa-2026.webp"),
    alt: "Сертифікат Гущі Ольги Анатоліївни, 2026",
  },
];

const CERTS = [
  ...CLOUDINARY_CERTIFICATES.slice(0, 5),
  ...ELECTRONIC_CERTIFICATES,
  ...CLOUDINARY_CERTIFICATES.slice(5),
];
const splitIndex = Math.ceil(CERTS.length / 2);
const row1 = CERTS.slice(0, splitIndex);
const row2 = CERTS.slice(splitIndex);

function CertCard({ c, onOpen }: { c: Certificate; onOpen: (c: Certificate) => void }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => onOpen(c)}
      className="shrink-0 h-[270px] sm:h-[350px] md:h-[380px] overflow-visible bg-transparent transition-transform duration-300 hover:scale-[1.02] flex items-center justify-center p-0"
    >
      <img
        src={c.src}
        alt={c.alt}
        className="h-full w-auto max-w-none rounded-xl object-contain shadow-[var(--shadow-soft)]"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </button>
  );
}

export function Certificates() {
  const [open, setOpen] = useState<Certificate | null>(null);

  return (
    <section id="certificates" className="py-20 md:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Кваліфікація"
          title={
            <>
              Сертифікати <br />
              <em style={{ color: "var(--brand-pink-strong)" }}>та професійний розвиток</em>
            </>
          }
          subtitle="Фото сертифікатів і документів, наданих клінікою. Натисніть на будь-який документ, щоб роздивитися."
        />
      </div>

      <div className="mt-12 space-y-4 marquee-pause">
        <div className="overflow-hidden">
          <div className="marquee-track gap-4" style={{ animationDuration: "80s" }}>
            {[...row1, ...row1].map((c, idx) => (
              <CertCard key={`c1-${idx}`} c={c} onOpen={setOpen} />
            ))}
          </div>
        </div>
        <div className="overflow-hidden">
          <div className="marquee-track-reverse gap-4" style={{ animationDuration: "80s" }}>
            {[...row2, ...row2].map((c, idx) => (
              <CertCard key={`c2-${idx}`} c={c} onOpen={setOpen} />
            ))}
          </div>
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(null)}
        >
          <div className="relative max-w-3xl w-full" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label="Закрити"
              className="absolute -top-4 -right-4 h-10 w-10 rounded-full bg-background inline-flex items-center justify-center shadow"
            >
              <X className="h-4 w-4" />
            </button>
            <img src={open.src} alt={open.alt} className="w-full max-h-[85vh] rounded-2xl object-contain" />
          </div>
        </div>
      )}
    </section>
  );
}
