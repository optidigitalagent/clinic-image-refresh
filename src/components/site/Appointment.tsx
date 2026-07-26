import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { submitAppointment } from "@/lib/appointment.functions";
import { SectionHeading } from "./SectionLabel";

export function Appointment() {
  const submit = useServerFn(submitAppointment);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setError(null);
    try {
      await submit({ data: { name, phone, comment: comment || null } });
      setState("success");
      setName("");
      setPhone("");
      setComment("");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Помилка відправки");
    }
  }

  return (
    <section id="appointment" className="relative py-20 md:py-28 bg-brand-aurora-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 items-center">
          <div>
            <SectionHeading
              label="Запис"
              title={<>Зробіть перший крок <br /><em style={{ color: "var(--brand-pink-strong)" }}>до здорової усмішки</em></>}
              subtitle="Залиште номер телефону — адміністратор передзвонить у робочий час, відповість на запитання та підбере зручний час прийому."
            />

            <div className="mt-8 space-y-3 text-sm text-foreground/80">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Телефони адміністратора</div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  <a href="tel:+380686707519" className="hover:text-foreground">+38 (068) 670 75 19</a>
                  <a href="tel:+380736707519" className="hover:text-foreground">+38 (073) 670 75 19</a>
                  <a href="tel:+380996707719" className="hover:text-foreground">+38 (099) 670 77 19</a>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">Пн–Пт: 9:00–21:00 · Сб: 9:00–18:00</div>
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="rounded-3xl border border-border/70 bg-background/85 backdrop-blur p-6 sm:p-8 shadow-xl"
          >
            {state === "success" ? (
              <div className="flex flex-col items-center text-center py-10">
                <div
                  className="h-14 w-14 rounded-full inline-flex items-center justify-center mb-4"
                  style={{ background: "color-mix(in oklab, var(--brand-green) 22%, transparent)", color: "var(--brand-green-deep)" }}
                >
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-display">Заявку прийнято</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                  Дякуємо! Адміністратор Ami Dental зателефонує вам найближчим часом.
                </p>
                <button
                  type="button"
                  onClick={() => setState("idle")}
                  className="mt-6 text-sm font-medium"
                  style={{ color: "var(--brand-green-deep)" }}
                >
                  Надіслати ще одну
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      Імʼя та прізвище
                    </span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      maxLength={80}
                      className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                      placeholder="Ольга Петренко"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      Номер телефону
                    </span>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      maxLength={30}
                      className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                      placeholder="+38 (0__) ___-__-__"
                      inputMode="tel"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      Коментар <span className="normal-case text-muted-foreground/60">(за бажанням)</span>
                    </span>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      maxLength={500}
                      rows={3}
                      className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                      placeholder="Опишіть коротко, з чим звертаєтеся"
                    />
                  </label>
                </div>

                {state === "error" && error && (
                  <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="mt-6 w-full btn-primary-brand rounded-full px-5 py-3.5 text-sm font-medium inline-flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {state === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Відправляємо…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Надіслати заявку
                    </>
                  )}
                </button>
                <p className="mt-3 text-[11px] text-muted-foreground text-center">
                  Натискаючи «Надіслати», ви погоджуєтеся на обробку персональних даних для звʼязку з вами.
                </p>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
