import type { ReactNode } from "react";

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-medium"
      style={{ color: "var(--brand-green-deep)" }}
    >
      <span className="h-px w-6" style={{ background: "var(--brand-green-strong)" }} />
      {children}
    </div>
  );
}

export function SectionHeading({
  label,
  title,
  subtitle,
  align = "left",
}: {
  label: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center mx-auto max-w-2xl" : "max-w-2xl"}>
      <SectionLabel>{label}</SectionLabel>
      <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl leading-[1.05]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
