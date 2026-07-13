"use client";

import { useActionState, useEffect, useState } from "react";
import {
  crearTransaccion,
  type EstadoFormTransaccion,
} from "@/lib/actions/transacciones";
import {
  CATEGORIAS_GASTO,
  CATEGORIAS_INGRESO,
  type TipoTransaccion,
} from "@/lib/types";

const estadoInicial: EstadoFormTransaccion = { error: null };

export default function TransaccionForm({
  onGuardado,
}: {
  onGuardado: () => void;
}) {
  const [estado, formAction, pending] = useActionState(
    crearTransaccion,
    estadoInicial
  );
  const [tipo, setTipo] = useState<TipoTransaccion>("gasto");
  const [moneda, setMoneda] = useState<"ARS" | "USD">("ARS");

  useEffect(() => {
    if (estado.ok) onGuardado();
  }, [estado.ok, onGuardado]);

  const categorias = tipo === "gasto" ? CATEGORIAS_GASTO : CATEGORIAS_INGRESO;
  const hoy = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {/* Tipo: ingreso / gasto */}
      <div className="grid grid-cols-2 gap-2">
        {(["gasto", "ingreso"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTipo(t)}
            className={`rounded-lg border py-2 text-sm capitalize transition ${
              tipo === t
                ? t === "gasto"
                  ? "border-copper bg-copper/10 text-copper"
                  : "border-sage bg-sage/10 text-sage"
                : "border-border text-mist"
            }`}
          >
            {t}
          </button>
        ))}
        <input type="hidden" name="tipo" value={tipo} />
      </div>

      {/* Monto + moneda */}
      <div className="flex gap-2">
        <input
          type="text"
          name="monto"
          inputMode="decimal"
          required
          placeholder="Monto"
          className="font-mono-num flex-1 rounded-lg border border-border bg-ink px-3 py-2.5 text-paper outline-none focus:border-gold"
        />
        <div className="flex overflow-hidden rounded-lg border border-border">
          {(["ARS", "USD"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMoneda(m)}
              className={`px-3 text-sm ${
                moneda === m ? "bg-gold text-ink" : "bg-ink text-mist"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <input type="hidden" name="moneda" value={moneda} />
      </div>

      {/* Categoría */}
      <select
        name="categoria"
        defaultValue={categorias[0]}
        key={tipo}
        className="rounded-lg border border-border bg-ink px-3 py-2.5 text-paper outline-none focus:border-gold"
      >
        {categorias.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Descripción */}
      <input
        type="text"
        name="descripcion"
        placeholder="Descripción (opcional)"
        className="rounded-lg border border-border bg-ink px-3 py-2.5 text-paper outline-none focus:border-gold"
      />

      {/* Fecha */}
      <input
        type="date"
        name="fecha"
        defaultValue={hoy}
        className="rounded-lg border border-border bg-ink px-3 py-2.5 text-paper outline-none focus:border-gold"
      />

      {estado.error && (
        <p className="text-sm text-copper" role="alert">
          {estado.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 w-full rounded-lg bg-gold py-2.5 font-medium text-ink transition hover:bg-gold-dim disabled:opacity-60"
      >
        {pending ? "Guardando…" : "Guardar"}
      </button>
    </form>
  );
}
