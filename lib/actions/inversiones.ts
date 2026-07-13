"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { sql } from "@/lib/db";
import type { Inversion } from "@/lib/types";

export interface EstadoFormInversion {
  error: string | null;
  ok?: boolean;
}

export async function obtenerInversiones(): Promise<Inversion[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const rows = await sql`
    select id, user_id, tipo, ticker, nombre,
           cantidad::float8 as cantidad, precio_compra::float8 as precio_compra,
           moneda_compra, coingecko_id, fecha_compra::text as fecha_compra,
           created_at::text as created_at
    from inversiones
    where user_id = ${session.user.id}
    order by created_at desc
  `;
  return rows as Inversion[];
}

export async function crearInversion(
  _prevState: EstadoFormInversion,
  formData: FormData
): Promise<EstadoFormInversion> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Tu sesión expiró. Volvé a iniciar sesión." };
  }

  const tipo = formData.get("tipo") as string;
  const tickerRaw = (formData.get("ticker") as string)?.trim();
  const nombre = (formData.get("nombre") as string) || null;
  const cantidad = Number(
    (formData.get("cantidad") as string)?.replace(",", ".")
  );
  const precioCompra = Number(
    (formData.get("precioCompra") as string)?.replace(",", ".")
  );
  const monedaCompra = formData.get("monedaCompra") as string;
  const fechaCompra = formData.get("fechaCompra") as string;

  if (!["cedear", "accion", "cripto", "bono", "otro"].includes(tipo)) {
    return { error: "Tipo inválido." };
  }
  if (!tickerRaw) {
    return { error: "Ingresá un ticker o identificador." };
  }
  if (!cantidad || cantidad <= 0) {
    return { error: "Ingresá una cantidad válida." };
  }
  if (!precioCompra || precioCompra <= 0) {
    return { error: "Ingresá un precio de compra válido." };
  }
  if (!["ARS", "USD"].includes(monedaCompra)) {
    return { error: "Moneda inválida." };
  }

  const ticker = tickerRaw.toUpperCase();
  const coingeckoId = tipo === "cripto" ? tickerRaw.toLowerCase() : null;

  await sql`
    insert into inversiones
      (user_id, tipo, ticker, nombre, cantidad, precio_compra, moneda_compra, coingecko_id, fecha_compra)
    values
      (${session.user.id}, ${tipo}, ${ticker}, ${nombre}, ${cantidad}, ${precioCompra}, ${monedaCompra}, ${coingeckoId}, ${fechaCompra})
  `;

  revalidatePath("/");
  revalidatePath("/inversiones");
  return { error: null, ok: true };
}

export async function eliminarInversion(id: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  await sql`
    delete from inversiones
    where id = ${id} and user_id = ${session.user.id}
  `;

  revalidatePath("/");
  revalidatePath("/inversiones");
}
