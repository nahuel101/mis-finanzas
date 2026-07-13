"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { sql } from "@/lib/db";
import {
  DEFAULT_CATEGORIAS_GASTO,
  DEFAULT_CATEGORIAS_INGRESO,
  type Categoria,
  type TipoTransaccion,
} from "@/lib/types";

export interface EstadoFormCategoria {
  error: string | null;
  ok?: boolean;
}

/**
 * Categorías del usuario logueado, agrupadas por tipo. Si el usuario
 * todavía no tiene ninguna (cuenta nueva), se siembran las categorías
 * por defecto una sola vez para que la app no arranque vacía.
 */
export async function obtenerCategorias(): Promise<{
  gasto: Categoria[];
  ingreso: Categoria[];
}> {
  const session = await auth();
  if (!session?.user?.id) return { gasto: [], ingreso: [] };
  const userId = session.user.id;

  let rows = (await sql`
    select id, user_id, tipo, nombre, orden
    from categorias
    where user_id = ${userId}
    order by tipo, orden, nombre
  `) as Categoria[];

  if (rows.length === 0) {
    const semilla: { tipo: TipoTransaccion; nombre: string; orden: number }[] =
      [
        ...DEFAULT_CATEGORIAS_GASTO.map((nombre, orden) => ({
          tipo: "gasto" as const,
          nombre,
          orden,
        })),
        ...DEFAULT_CATEGORIAS_INGRESO.map((nombre, orden) => ({
          tipo: "ingreso" as const,
          nombre,
          orden,
        })),
      ];

    for (const { tipo, nombre, orden } of semilla) {
      await sql`
        insert into categorias (user_id, tipo, nombre, orden)
        values (${userId}, ${tipo}, ${nombre}, ${orden})
        on conflict (user_id, tipo, nombre) do nothing
      `;
    }

    rows = (await sql`
      select id, user_id, tipo, nombre, orden
      from categorias
      where user_id = ${userId}
      order by tipo, orden, nombre
    `) as Categoria[];
  }

  return {
    gasto: rows.filter((c) => c.tipo === "gasto"),
    ingreso: rows.filter((c) => c.tipo === "ingreso"),
  };
}

export async function crearCategoria(
  _prevState: EstadoFormCategoria,
  formData: FormData
): Promise<EstadoFormCategoria> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Tu sesión expiró. Volvé a iniciar sesión." };
  }

  const tipo = formData.get("tipo") as string;
  const nombre = (formData.get("nombre") as string)?.trim();

  if (!["ingreso", "gasto"].includes(tipo)) {
    return { error: "Tipo inválido." };
  }
  if (!nombre) {
    return { error: "Ingresá un nombre de categoría." };
  }

  const existente = await sql`
    select id from categorias
    where user_id = ${session.user.id} and tipo = ${tipo} and nombre = ${nombre}
  `;
  if (existente.length > 0) {
    return { error: "Ya existe esa categoría." };
  }

  const maxOrden = await sql`
    select coalesce(max(orden), -1)::int as max from categorias
    where user_id = ${session.user.id} and tipo = ${tipo}
  `;
  const orden = (maxOrden[0] as { max: number }).max + 1;

  await sql`
    insert into categorias (user_id, tipo, nombre, orden)
    values (${session.user.id}, ${tipo}, ${nombre}, ${orden})
  `;

  revalidatePath("/");
  revalidatePath("/ingresos");
  revalidatePath("/cuenta");
  return { error: null, ok: true };
}

export async function renombrarCategoria(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;

  const id = formData.get("id") as string;
  const limpio = ((formData.get("nombre") as string) ?? "").trim();
  if (!id || !limpio) return;

  try {
    await sql`
      update categorias
      set nombre = ${limpio}
      where id = ${id} and user_id = ${session.user.id}
    `;
  } catch {
    // Ya existe otra categoría del mismo tipo con ese nombre: se ignora
    // el cambio en lugar de romper la pantalla.
    return;
  }

  revalidatePath("/");
  revalidatePath("/ingresos");
  revalidatePath("/cuenta");
}

export async function eliminarCategoria(id: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  await sql`
    delete from categorias
    where id = ${id} and user_id = ${session.user.id}
  `;

  revalidatePath("/");
  revalidatePath("/ingresos");
  revalidatePath("/cuenta");
}
