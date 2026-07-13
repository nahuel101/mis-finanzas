export type Moneda = "ARS" | "USD";
export type TipoTransaccion = "ingreso" | "gasto";
export type TipoInversion = "cedear" | "accion" | "cripto" | "bono" | "otro";

export interface Transaccion {
  id: string;
  user_id: string;
  tipo: TipoTransaccion;
  monto: number;
  moneda: Moneda;
  categoria: string;
  descripcion: string | null;
  fecha: string; // ISO date (YYYY-MM-DD)
  created_at: string;
}

export interface Categoria {
  id: string;
  user_id: string;
  tipo: TipoTransaccion;
  nombre: string;
  orden: number;
}

export interface Inversion {
  id: string;
  user_id: string;
  tipo: TipoInversion;
  ticker: string;
  nombre: string | null;
  cantidad: number;
  precio_compra: number;
  moneda_compra: Moneda;
  coingecko_id: string | null;
  fecha_compra: string;
  created_at: string;
}

// Categorías con las que se "siembra" la cuenta de cada usuario la
// primera vez (ver lib/actions/categorias.ts). A partir de ahí, cada
// usuario las administra libremente desde Cuenta.
export const DEFAULT_CATEGORIAS_GASTO = [
  "Comida",
  "Transporte",
  "Vivienda",
  "Servicios",
  "Salud",
  "Ocio",
  "Ropa",
  "Educación",
  "Otros",
] as const;

export const DEFAULT_CATEGORIAS_INGRESO = [
  "Sueldo",
  "Freelance",
  "Ventas",
  "Regalo",
  "Otros",
] as const;
