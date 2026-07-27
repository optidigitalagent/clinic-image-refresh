/**
 * Живий контент з Google Таблиці.
 *
 * Власник сайту редагує звичайну Google Таблицю (з телефона теж),
 * сайт підтягує дані під час завантаження сторінки.
 * Якщо таблиця недоступна / порожня — показуються вбудовані дані з коду.
 */

import { useEffect, useState } from "react";
import { DOCTORS, type Doctor } from "@/lib/doctors-data";
import { PRICE_CATEGORIES, type PriceCategory } from "@/lib/price-data";

/** ID Google Таблиці (частина посилання між /d/ і /edit). Порожньо = дані з коду. */
export const CONTENT_SHEET_ID = "1CBzCEbNNPSj_6AxlCMevJ6d-m8MDDCA89OV7yHz_aOY";

/** Назви вкладок у таблиці */
const DOCTORS_TAB = "Лікарі";
const PRICES_TAB = "Прайс";

function sheetUrl(tab: string) {
  return `https://docs.google.com/spreadsheets/d/${CONTENT_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
    tab
  )}`;
}

/** Мінімальний CSV-парсер (з підтримкою лапок і переносів рядків усередині комірки). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch !== "\r") {
      field += ch;
    }
  }
  row.push(field);
  rows.push(row);
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

/** Перетворює будь-яке посилання Google Drive на пряме посилання для <img>. */
export function normalizePhotoUrl(raw: string): string {
  const url = raw.trim();
  if (!url) return "";
  const driveId =
    url.match(/\/file\/d\/([a-zA-Z0-9_-]{20,})/)?.[1] ??
    url.match(/[?&]id=([a-zA-Z0-9_-]{20,})/)?.[1] ??
    url.match(/\/d\/([a-zA-Z0-9_-]{20,})/)?.[1];
  if (driveId) return `https://drive.google.com/thumbnail?id=${driveId}&sz=w1200`;
  return url;
}

function splitBullets(raw: string): string[] {
  return raw
    .split(/\r?\n|;/)
    .map((s) => s.trim().replace(/^[-•·]\s*/, ""))
    .filter(Boolean);
}

async function fetchTab(tab: string): Promise<string[][] | null> {
  if (!CONTENT_SHEET_ID) return null;
  try {
    const res = await fetch(sheetUrl(tab), { cache: "no-store" });
    if (!res.ok) return null;
    return parseCsv(await res.text());
  } catch {
    return null;
  }
}

/** Заголовки колонок ігноруються — важливий лише порядок колонок. */
function rowsWithoutHeader(rows: string[][]): string[][] {
  if (rows.length === 0) return rows;
  const first = rows[0].map((c) => c.trim().toLowerCase());
  const looksLikeHeader = first.some((c) =>
    ["фото", "посада", "ім'я", "имя", "піб", "категорія", "послуга", "ціна", "цена"].includes(c)
  );
  return looksLikeHeader ? rows.slice(1) : rows;
}

/** Лікарі: колонки — Фото | Посада | ПІБ | Короткий опис | Деталі (кожен пункт з нового рядка) */
export function useDoctors(): Doctor[] {
  const [doctors, setDoctors] = useState<Doctor[]>(DOCTORS);

  useEffect(() => {
    let cancelled = false;
    fetchTab(DOCTORS_TAB).then((rows) => {
      if (cancelled || !rows) return;
      const parsed = rowsWithoutHeader(rows)
        .map((r) => ({
          photo: normalizePhotoUrl(r[0] ?? ""),
          role: (r[1] ?? "").trim(),
          name: (r[2] ?? "").trim(),
          intro: (r[3] ?? "").trim(),
          bullets: splitBullets(r[4] ?? ""),
        }))
        .filter((d) => d.name);
      if (parsed.length) setDoctors(parsed);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return doctors;
}

/**
 * Прайс: колонки — Категорія | Послуга | Ціна.
 * Категорії задані в коді (їх не можна додавати з таблиці),
 * а послуги всередині категорії власник додає/видаляє скільки завгодно.
 */
export function usePriceCategories(): PriceCategory[] {
  const [categories, setCategories] = useState<PriceCategory[]>(PRICE_CATEGORIES);

  useEffect(() => {
    let cancelled = false;
    fetchTab(PRICES_TAB).then((rows) => {
      if (cancelled || !rows) return;
      const byCategory = new Map<string, { name: string; price: string }[]>();
      for (const r of rowsWithoutHeader(rows)) {
        const cat = (r[0] ?? "").trim().toLowerCase();
        const name = (r[1] ?? "").trim();
        const price = (r[2] ?? "").trim();
        if (!cat || !name) continue;
        const list = byCategory.get(cat) ?? [];
        list.push({ name, price });
        byCategory.set(cat, list);
      }
      if (byCategory.size === 0) return;

      let n = 0;
      const next = PRICE_CATEGORIES.map((category) => {
        const fromSheet =
          byCategory.get(category.label.trim().toLowerCase()) ??
          byCategory.get(category.id.toLowerCase());
        if (!fromSheet || fromSheet.length === 0) {
          // категорія відсутня в таблиці — лишаємо як є, але з наскрізною нумерацією
          return {
            ...category,
            groups: category.groups.map((g) => ({
              ...g,
              items: g.items.map((it) => ({ ...it, n: ++n })),
            })),
          };
        }
        return {
          ...category,
          groups: [{ items: fromSheet.map((it) => ({ n: ++n, ...it })) }],
        };
      });
      setCategories(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return categories;
}
