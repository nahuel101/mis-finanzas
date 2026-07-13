"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { sql } from "@/lib/db";
import type { Transaccion } from "@/lib/types";

export interface EstadoFormTransaccion {
  error: string | null;
  ok?: boolean;
}

export async function obtenerTransacciones(): Promise<Transaccion[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const rows = await sql`
    select id, user_id, tipo, monto::float8 as monto, moneda, categoria,
           descripcion, fecha::text as fecha, created_at::text as created_at
    from transacciones
    where user_id = ${session.user.id}
    order by fecha desc, created_at desc
  `;
  return rows as Transaccion[];
}

export async function crearTransaccion(
  _prevState: EstadoFormTransaccion,
  formData: FormData
): Promise<EstadoFormTransaccion> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Tu sesión expiró. Volvé a iniciar sesión." };
  }

  const tipo = formData.get("tipo") as string;
  const monto = Number((formData.get("monto") as string)?.replace(",", "."));
  const moneda = formData.get("moneda") as string;
  const categoria = formData.get("categoria") as string;
  const descripcion = (formData.get("descripcion") as string) || null;
  const fecha = formData.get("fecha") as string;

  if (!["ingreso", "gasto"].includes(tipo)) {
    return { error: "Tipo inválido." };
  }
  if (!monto || monto <= 0) {
    return { error: "Ingresá un monto válido." };
  }
  if (!["ARS", "USD"].includes(moneda)) {
    return { error: "Moneda inválida." };
  }
  if (!categoria) {
    return { error: "Elegí una categoría." };
  }

  await sql`
    insert into transacciones (user_id, tipo, monto, moneda, categoria, descripcion, fecha)
    values (${session.user.id}, ${tipo}, ${monto}, ${moneda}, ${categoria}, ${descripcion}, ${fecha})
  `;

  revalidatePath("/");
  revalidatePath("/ingresos");
  revalidatePath("/resumen");
  return { error: null, ok: true };
}

export async function eliminarTransaccion(id: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  await sql`
    delete from transacciones
    where id = ${id} and user_id = ${session.user.id}
  `;

  revalidatePath("/");
  revalidatePath("/ingresos");
  revalidatePath("/resumen");
}
