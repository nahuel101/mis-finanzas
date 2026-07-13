"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export interface EstadoLogin {
  error: string | null;
}

export async function autenticar(
  _prevState: EstadoLogin,
  formData: FormData
): Promise<EstadoLogin> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/",
    });
    return { error: null };
  } catch (error) {
    // signIn redirige internamente lanzando un error especial de Next;
    // hay que dejarlo pasar para que la redirección funcione.
    if (error instanceof AuthError) {
      return { error: "Usuario o contraseña incorrectos." };
    }
    throw error;
  }
}
