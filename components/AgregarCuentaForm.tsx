"use client";

import { useActionState } from "react";
import { crearUsuario, type EstadoFormUsuario } from "@/lib/actions/usuarios";

const estadoInicial: EstadoFormUsuario = { error: null };

export default function AgregarCuentaForm() {
  const [estado, formAction, pending] = useActionState(
    crearUsuario,
    estadoInicial
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input
        type="email"
        name="email"
        required
        placeholder="Email de la nueva cuenta"
        className="rounded-lg border border-border bg-ink px-3 py-2.5 text-paper outline-none focus:border-gold"
      />
      <input
        type="password"
        name="password"
        required
        minLength={6}
        placeholder="Contraseña (mínimo 6 caracteres)"
        className="rounded-lg border border-border bg-ink px-3 py-2.5 text-paper outline-none focus:border-gold"
      />

      {estado.error && (
        <p className="text-sm text-copper" role="alert">
          {estado.error}
        </p>
      )}
      {estado.ok && <p className="text-sm text-sage">Cuenta creada ✓</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-gold py-2.5 font-medium text-gold transition hover:bg-gold hover:text-ink disabled:opacity-60"
      >
        {pending ? "Creando…" : "Crear cuenta"}
      </button>
    </form>
  );
}
