"use client";

import { useActionState } from "react";
import Link from "next/link";
import { autenticar, type EstadoLogin } from "@/lib/actions/auth-form";
import LogoMark from "@/components/LogoMark";

const estadoInicial: EstadoLogin = { error: null };

export default function LoginPage() {
  const [estado, formAction, pending] = useActionState(
    autenticar,
    estadoInicial
  );

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <LogoMark className="mx-auto mb-4 h-14 w-14 rounded-2xl" />
          <p className="font-display text-3xl font-semibold text-paper">
            Mis Finanzas
          </p>
          <p className="mt-2 text-sm text-mist">
            Gastos, ingresos e inversiones, en un solo libro.
          </p>
        </div>

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
              autoComplete="current-password"
              className="mt-2 mb-2 w-full rounded-lg border border-border bg-ink px-3 py-2.5 text-paper outline-none focus:border-gold"
              placeholder="••••••••"
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
            {pending ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-mist-dim">
          ¿Primera vez usando la app?{" "}
          <Link href="/setup" className="text-gold hover:underline">
            Creá la primera cuenta
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
