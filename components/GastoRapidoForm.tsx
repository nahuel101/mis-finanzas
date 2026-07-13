"use client";

import { useActionState, useEffect, useState } from "react";
import {
  crearTransaccion,
  type EstadoFormTransaccion,
} from "@/lib/actions/transacciones";

const estadoInicial: EstadoFormTransaccion = { error: null };

export default function GastoRapidoForm({
  categoria,
  onGuardado,
}: {
  categoria: string;
  onGuardado: () => void;
}) {
  const [estado, formAction, pending] = useActionState(
    crearTransaccion,
    estadoInicial
  );
  const [moneda, setMoneda] = useState<"ARS" | "USD">("ARS");
  const hoy = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (estado.ok) onGuardado();
  }, [estado.ok, onGuardado]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="tipo" value="gasto" />
      <input type="hidden" name="categoria" value={categoria} />
      <input type="hidden" name="fecha" value={hoy} />

      <div className="flex gap-2">
        <input
          type="text"
          name="monto"
          inputMode="decimal"
          required
          autoFocus
          placeholder="Monto"
          className="font-mono-num flex-1 rounded-lg border border-border bg-ink px-3 py-2.5 text-xl text-paper outline-none focus:border-gold"
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

      {estado.error && (
        <p className="text-sm text-copper" role="alert">
          {estado.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-copper py-2.5 font-medium text-ink transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Guardando…" : `Agregar a ${categoria}`}
      </button>
    </form>
  );
}
