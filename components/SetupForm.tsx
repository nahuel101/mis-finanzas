"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  crearPrimerUsuario,
  type EstadoFormUsuario,
} from "@/lib/actions/usuarios";

const estadoInicial: EstadoFormUsuario = { error: null };

export default function SetupForm() {
  const [estado, formAction, pending] = useActionState(
    crearPrimerUsuario,
    estadoInicial
  );

  if (estado.ok) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 text-center">
        <p className="text-sage">Cuenta creada ✓</p>
        <Link
          href="/login"
          className="mt-4 inline-block rounded-lg bg-gold px-4 py-2 font-medium text-ink hover:bg-gold-dim"
        >
          Ir a iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-border bg-surface p-6 shadow-xl shadow-black/20"
    >
      <label className="block text-xs font-medium uppercase tracking-wide text-mist">
        Email
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="mt-2 mb-4 w-full rounded-lg border border-border bg-ink px-3 py-2.5 text-paper outline-none focus:border-gold"
          placeholder="vos@ejemplo.com"
        />
      </label>

      <label className="block text-xs font-medium uppercase tracking-wide text-mist">
        Contraseña
        <input
          type="password"
          name="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="mt-2 mb-2 w-full rounded-lg border border-border bg-ink px-3 py-2.5 text-paper outline-none focus:border-gold"
          placeholder="Mínimo 6 caracteres"
        />
      </label>

      {estado.error && (
        <p className="mb-4 text-sm text-copper" role="alert">
          {estado.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-full rounded-lg bg-gold py-2.5 font-medium text-ink transition hover:bg-gold-dim disabled:opacity-60"
      >
        {pending ? "Creando…" : "Crear cuenta"}
      </button>
    </form>
  );
}
