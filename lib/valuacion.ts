import type { Inversion } from "./types";
import { getDolares, getPrecioCriptoUSD, getPrecioYahoo, tickerCedear } from "./prices";

/** Precio en vivo por inversión: { [inversion.id]: { precio, moneda } } */
export type PreciosCache = Record<string, { precio: number; moneda: string }>;

/**
 * Valor actual de una inversión en pesos.
 * - Si hay precio en vivo (acción/CEDEAR/cripto), lo usa y convierte a
 *   pesos con el dólar CCL cuando la cotización viene en USD.
 * - Si no hay precio en vivo (bono, otro, o falló la consulta), usa el
 *   precio de compra como aproximación, con la misma conversión.
 */
export function valorInversionARS(
  inv: Inversion,
  precios: PreciosCache,
  dolarCCL: number
): number {
  const enVivo = precios[inv.id];

  if (enVivo) {
    const enPesos =
      enVivo.moneda === "ARS" ? enVivo.precio : enVivo.precio * dolarCCL;
    return enPesos * inv.cantidad;
  }

  const compraEnPesos =
    inv.moneda_compra === "ARS"
      ? inv.precio_compra
      : inv.precio_compra * dolarCCL;
  return compraEnPesos * inv.cantidad;
}

/** Costo de compra de una inversión, en pesos (para calcular ganancia/pérdida). */
export function costoInversionARS(inv: Inversion, dolarCCL: number): number {
  const enPesos =
    inv.moneda_compra === "ARS"
      ? inv.precio_compra
      : inv.precio_compra * dolarCCL;
  return enPesos * inv.cantidad;
}

/** Dólar contado con liqui actual, o null si la consulta falla. */
export async function obtenerDolarCCL(): Promise<number | null> {
  try {
    const dolares = await getDolares();
    const ccl = dolares.find((d) => d.casa === "contadoconliqui");
    return ccl ? ccl.venta : null;
  } catch {
    return null;
  }
}

export interface InversionValuada extends Inversion {
  valorActualARS: number | null;
  gananciaARS: number | null;
  gananciaPct: number | null;
  precioEnVivo: boolean;
}

/**
 * Enriquece cada inversión con su valor actual y ganancia/pérdida,
 * consultando los precios en vivo que correspondan según el tipo.
 * Se ejecuta en el servidor (page.tsx), antes de renderizar.
 */
export async function valuarInversiones(
  inversiones: Inversion[],
  dolarCCL: number | null
): Promise<InversionValuada[]> {
  return Promise.all(
    inversiones.map(async (inv) => {
      let precio: { precio: number; moneda: string } | null = null;

      try {
        if (inv.tipo === "cripto" && inv.coingecko_id) {
          const usd = await getPrecioCriptoUSD(inv.coingecko_id);
          precio = { precio: usd, moneda: "USD" };
        } else if (inv.tipo === "cedear" || inv.tipo === "accion") {
          const simbolo =
            inv.tipo === "cedear" ? tickerCedear(inv.ticker) : inv.ticker;
          precio = await getPrecioYahoo(simbolo);
        }
      } catch {
        precio = null;
      }

      if (!dolarCCL) {
        return {
          ...inv,
          valorActualARS: null,
          gananciaARS: null,
          gananciaPct: null,
          precioEnVivo: false,
        };
      }

      const preciosCache: PreciosCache = precio ? { [inv.id]: precio } : {};
      const valorActualARS = valorInversionARS(inv, preciosCache, dolarCCL);
      const costoARS = costoInversionARS(inv, dolarCCL);
      const gananciaARS = valorActualARS - costoARS;
      const gananciaPct = costoARS ? (gananciaARS / costoARS) * 100 : null;

      return {
        ...inv,
        valorActualARS,
        gananciaARS,
        gananciaPct,
        precioEnVivo: precio !== null,
      };
    })
  );
}
