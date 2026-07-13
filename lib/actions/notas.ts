"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { sql } from "@/lib/db";
import type { Nota } from "@/lib/types";

export interface EstadoFormNota {
  error: string | null;
  ok?: boolean;
}

export async function obtenerNotas(): Promise<Nota[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const rows = await sql`
    select id, user_id, contenido, created_at::text as created_at
    from notas
    where user_id = ${session.user.id}
    order by created_at desc
  `;
  return rows as Nota[];
}

export async function crearNota(
  _prevState: EstadoFormNota,
  formData: FormData
): Promise<EstadoFormNota> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Tu sesión expiró. Volvé a iniciar sesión." };
  }

  const contenido = (formData.get("contenido") as string)?.trim();
  if (!contenido) {
    return { error: "Escribí algo antes de guardar." };
  }

  await sql`
    insert into notas (user_id, contenido)
    values (${session.user.id}, ${contenido})
  `;

  revalidatePath("/notas");
  return { error: null, ok: true };
}

export async function eliminarNota(id: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  await sql`
    delete from notas
    where id = ${id} and user_id = ${session.user.id}
  `;

  revalidatePath("/notas");
}
