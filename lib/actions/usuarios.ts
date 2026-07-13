"use server";

import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { sql } from "@/lib/db";

export interface EstadoFormUsuario {
  error: string | null;
  ok?: boolean;
}

/** Cuántas cuentas existen. Se usa para decidir si /setup sigue habilitado. */
export async function contarUsuarios(): Promise<number> {
  const rows = await sql`select count(*)::int as total from users`;
  return (rows[0] as { total: number }).total;
}

/**
 * Crea la primera cuenta de la app. Solo funciona si todavía no existe
 * ningún usuario (lo verifica de nuevo acá, por las dudas, aunque la
 * página /setup ya hace su propio chequeo antes de mostrarse).
 */
export async function crearPrimerUsuario(
  _prevState: EstadoFormUsuario,
  formData: FormData
): Promise<EstadoFormUsuario> {
  const total = await contarUsuarios();
  if (total > 0) {
    return { error: "Ya existe una cuenta. Andá a /login." };
  }
  return crearUsuarioInterno(formData);
}

/**
 * Crea una cuenta adicional (ej: la de tu pareja). Requiere estar
 * logueado, así no queda como un registro público.
 */
export async function crearUsuario(
  _prevState: EstadoFormUsuario,
  formData: FormData
): Promise<EstadoFormUsuario> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Tenés que iniciar sesión para agregar una cuenta." };
  }
  return crearUsuarioInterno(formData);
}

async function crearUsuarioInterno(
  formData: FormData
): Promise<EstadoFormUsuario> {
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;

  if (!email || !email.includes("@")) {
    return { error: "Ingresá un email válido." };
  }
  if (!password || password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }

  const existente = await sql`select id from users where email = ${email}`;
  if (existente.length > 0) {
    return { error: "Ya existe una cuenta con ese email." };
  }

  const hash = await bcrypt.hash(password, 10);
  await sql`insert into users (email, password_hash) values (${email}, ${hash})`;

  return { error: null, ok: true };
}
