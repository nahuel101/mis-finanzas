import type { Moneda } from "./types";

const fmtARS = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const fmtUSD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export function formatMonto(monto: number, moneda: Moneda): string {
  return moneda === "ARS" ? fmtARS.format(monto) : fmtUSD.format(monto);
}

export function formatFecha(fechaISO: string): string {
  const [y, m, d] = fechaISO.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
  });
}
