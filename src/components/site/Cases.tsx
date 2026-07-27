import { useState } from "react";
import { X } from "lucide-react";
import { SectionHeading } from "./SectionLabel";
import { withBasePath } from "@/lib/base-path";

const CASES_BASE =
  "https://res.cloudinary.com/qofhq8xa/image/upload/f_auto,q_auto,c_limit,w_1600/cases";

type SplitCase = {
  id: number;
  before: string;
  after: string;
  title?: string;
};

type CombinedCase = {
  id: number;
  combined: string;
  label: string;
};

type Case = SplitCase | CombinedCase;

const CASES: Case[] = [
  {
    id: 1,
    before: `${CASES_BASE}/case-01/before-01.png`,
    after: `${CASES_BASE}/case-01/after-01.png`,
    title: "Кісткова пластика при вираженому дефіциті кістки перед імплантацією",
  },
  {
    id: 2,
    before: `${CASES_BASE}/case-02/before-01.png`,
    after: withBasePath("media/cases/case-02-after-01.jpg"),
  },
  {
    id: 3,
    combined: `${CASES_BASE}/case-03/combined-before-stage-after.png`,
    label: "До / Етап / Після",
  },
  {
    id: 4,
    combined: `${CASES_BASE}/case-04/combined-before-after.png`,
    label: "До / Після",
  },
  {
    id: 5,
    combined: `${CASES_BASE}/case-05/combined-before-after.png`,
    label: "До / Після",
  },
  { id: 6, before: `${CASES_BASE}/case-06/before-01.png`, after: `${CASES_BASE}/case-06/after-01.png` },
  { id: 7, before: `${CASES_BASE}/case-07/before-01.png`, after: `${CASES_BASE}/case-07/after-01.png` },
  { id: 8, before: `${CASES_BASE}/case-08/before-01.png`, after: `${CASES_BASE}/case-08/after-01.png` },
  { id: 9, before: `${CASES_BASE}/case-09/before-01.png`, after: `${CASES_BASE}/case-09/after-01.png` },
  { id: 10, before: `${CASES_BASE}/case-10/before-01.png`, after: `${CASES_BASE}/case-10/after-01.png` },
  { id: 11, before: `${CASES_BASE}/case-11/before-01.png`, after: `${CASES_BASE}/case-11/after-01.png` },
  { id: 12, before: `${CASES_BASE}/case-13/after-01.png`, after: `${CASES_BASE}/case-12/before-01.png` },
  { id: 13, before: `${CASES_BASE}/case-13/before-01.png`, after: `${CASES_BASE}/case-12/after-01.png` },
];

const row1 = CASES.slice(0, 7);
const row2 = CASES.slice(7);

function CaseCard({ c, onOpen }: { c: Case; onOpen: (c: Case) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(c)}
      className="shrink-0 w-[280px] sm:w-[340px] rounded-2xl overflow-hidden border border-border/70 bg-card hover:shadow-lg transition-shadow"
    >
      {"combined" in c ? (
        <figure className="relative bg-muted">
          <img
            src={c.combined}
            alt={c.label}
            className="aspect-[2/1] w-full object-cover"
            loading="lazy"
          />
          <figcaption className="absolute left-2 top-2 rounded-full bg-background/85 px-2 py-0.5 text-[10px] uppercase tracking-wider">
            {c.label}
          </figcaption>
        </figure>
      ) : (
        <div className="grid grid-cols-2 divide-x divide-border">
          <figure className="relative">
            <img src={c.before} alt="До" className="aspect-square w-full object-cover" loading="lazy" />
            <figcaption className="absolute left-2 top-2 rounded-full bg-background/85 px-2 py-0.5 text-[10px] uppercase tracking-wider">
              До
            </figcaption>
          </figure>
          <figure className="relative">
            <img src={c.after} alt="Після" className="aspect-square w-full object-cover" loading="lazy" />
            <figcaption
              className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider text-white"
              style={{ background: "var(--brand-green-strong)" }}
            >
              Після
            </figcaption>
          </figure>
        </div>
      )}
      {"combined" in c ? null : c.title ? (
        <div className="px-3 py-2 text-left text-[11px] leading-snug text-muted-foreground">
          {c.title}
        </div>
      ) : null}
    </button>
  );
}

export function Cases() {
  const [open, setOpen] = useState<Case | null>(null);

  return (
    <section id="cases" className="relative py-20 md:py-28 bg-brand-aurora-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label="Кейси"
          title={
            <>
              Реальні результати <br />
              <em style={{ color: "var(--brand-pink-strong)" }}>наших пацієнтів</em>
            </>
          }
          subtitle="Фото до і після — коротко, чесно, без ретуші. Натисніть на кейс, щоб роздивитися."
        />
      </div>

      <div className="mt-12 space-y-5">
        <div className="overflow-hidden">
          <div className="marquee-track gap-4" style={{ animationDuration: "60s" }}>
            {[...row1, ...row1].map((c, idx) => (
              <CaseCard key={`r1-${idx}`} c={c} onOpen={setOpen} />
            ))}
          </div>
        </div>
        <div className="overflow-hidden">
          <div className="marquee-track-reverse gap-4" style={{ animationDuration: "60s" }}>
            {[...row2, ...row2].map((c, idx) => (
              <CaseCard key={`r2-${idx}`} c={c} onOpen={setOpen} />
            ))}
          </div>
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setOpen(null)}
        >
          <div
            className="relative w-full max-w-md sm:max-w-lg my-auto rounded-2xl sm:rounded-3xl bg-background p-4 sm:p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label="Закрити"
              className="absolute -right-2 -top-2 sm:right-3 sm:top-3 z-10 h-11 w-11 rounded-full bg-background border border-border shadow-lg inline-flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex flex-col gap-4 sm:gap-5 mt-2">
              {"combined" in open ? (
                <figure>
                  <div className="text-xs uppercase tracking-wider mb-2 text-muted-foreground">
                    {open.label}
                  </div>
                  <img
                    src={open.combined}
                    alt={open.label}
                    className="w-full max-h-[70vh] rounded-xl sm:rounded-2xl object-contain bg-muted border border-border/60"
                  />
                </figure>
              ) : (
                <>
                  {open.title ? (
                    <div className="text-sm font-medium leading-snug">{open.title}</div>
                  ) : null}
                  <figure>
                    <div className="text-xs uppercase tracking-wider mb-2 text-muted-foreground">До</div>
                    <img
                      src={open.before}
                      alt="До"
                      className="w-full aspect-[4/3] rounded-xl sm:rounded-2xl object-cover border border-border/60"
                    />
                  </figure>
                  <figure>
                    <div
                      className="text-xs uppercase tracking-wider mb-2"
                      style={{ color: "var(--brand-green-deep)" }}
                    >
                      Після
                    </div>
                    <img
                      src={open.after}
                      alt="Після"
                      className="w-full aspect-[4/3] rounded-xl sm:rounded-2xl object-cover border border-border/60"
                    />
                  </figure>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
