/**
 * Funciones para obtener cotizaciones en vivo desde APIs públicas
 * y gratuitas. Pensadas para correr en el servidor (route handlers),
 * nunca directo desde el navegador.
 *
 * - Dólar (blue / oficial / MEP / CCL): dolarapi.com — pública, sin key.
 * - Acciones y CEDEARs: Yahoo Finance (endpoint no oficial, sin key).
 *   Los CEDEARs se consultan con el ticker + sufijo ".BA" (ej: "AAPL.BA"),
 *   que ya devuelve el precio real de mercado en pesos (BYMA), sin
 *   necesidad de calcular ratios a mano. Si más adelante querés una
 *   fuente oficial garantizada, IOL o Rava tienen API propia (requieren
 *   cuenta).
 * - Cripto: CoinGecko — pública, sin key, con límite de uso razonable.
 */

export type DolarTipo =
  | "oficial"
  | "blue"
  | "bolsa" // MEP
  | "contadoconliqui" // CCL
  | "mayorista"
  | "tarjeta"
  | "cripto";

export interface DolarCotizacion {
  casa: DolarTipo;
  compra: number;
  venta: number;
  fechaActualizacion: string;
}

const DOLAR_API = "https://dolarapi.com/v1/dolares";

export async function getDolares(): Promise<DolarCotizacion[]> {
  const res = await fetch(DOLAR_API, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error("No se pudo obtener la cotización del dólar");
  return res.json();
}

export async function getDolar(tipo: DolarTipo): Promise<DolarCotizacion> {
  const res = await fetch(`${DOLAR_API}/${tipo}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`No se pudo obtener el dólar ${tipo}`);
  return res.json();
}

/**
 * Precio de un instrumento vía Yahoo Finance, en su moneda de
 * cotización nativa. Para acciones/ETFs de EE.UU. se usa el ticker
 * tal cual (ej: "AAPL" → USD). Para CEDEARs, BYMA lista el mismo
 * ticker con sufijo ".BA" y el precio ya viene directo en pesos
 * (ej: "AAPL.BA" → ARS) — así evitamos calcular a mano el ratio de
 * conversión y quedamos pegados al precio real de mercado.
 */
export async function getPrecioYahoo(
  ticker: string
): Promise<{ precio: number; moneda: string }> {
  const res = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      ticker
    )}`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) throw new Error(`No se pudo obtener precio de ${ticker}`);
  const data = await res.json();
  const meta = data?.chart?.result?.[0]?.meta;
  const precio = meta?.regularMarketPrice;
  const moneda = meta?.currency;
  if (typeof precio !== "number") {
    throw new Error(`Ticker no encontrado: ${ticker}`);
  }
  return { precio, moneda };
}

/** Precio de una acción de EE.UU. en USD (mantiene compatibilidad simple). */
export async function getPrecioAccionUSD(ticker: string): Promise<number> {
  const { precio } = await getPrecioYahoo(ticker);
  return precio;
}

/** Arma el símbolo de Yahoo para un CEDEAR a partir del ticker base. */
export function tickerCedear(ticker: string): string {
  const t = ticker.trim().toUpperCase();
  return t.endsWith(".BA") ? t : `${t}.BA`;
}

/** Precio de una criptomoneda en USD, vía CoinGecko. */
export async function getPrecioCriptoUSD(coingeckoId: string): Promise<number> {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
      coingeckoId
    )}&vs_currencies=usd`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) throw new Error(`No se pudo obtener precio de ${coingeckoId}`);
  const data = await res.json();
  const price = data?.[coingeckoId]?.usd;
  if (typeof price !== "number") {
    throw new Error(`Cripto no encontrada: ${coingeckoId}`);
  }
  return price;
}

