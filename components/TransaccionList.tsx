"use client";

import type { Transaccion } from "@/lib/types";
import { formatFecha, formatMonto } from "@/lib/format";
import { eliminarTransaccion } from "@/lib/actions/transacciones";

export default function TransaccionList({
  transacciones,
  vacioTexto,
}: {
  transacciones: Transaccion[];
  vacioTexto: string;
}) {
  if (transacciones.length === 0) {
    return <p className="pt-2 text-center text-sm text-mist-dim">{vacioTexto}</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {transacciones.map((t) => (
        <li
          key={t.id}
          className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3"
        >
          <div className="min-w-0">
            <p className="truncate text-sm text-paper">
              {t.descripcion || t.categoria}
            </p>
            <p className="text-xs text-mist-dim">
              {t.categoria} · {formatFecha(t.fecha)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`font-mono-num shrink-0 text-sm ${
                t.tipo === "ingreso" ? "text-sage" : "text-copper"
              }`}
            >
              {t.tipo === "ingreso" ? "+" : "−"}
              {formatMonto(t.monto, t.moneda)}
            </span>
            <form action={eliminarTransaccion.bind(null, t.id)}>
              <button
                type="submit"
                aria-label="Borrar movimiento"
                className="text-mist-dim hover:text-copper"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path
                    d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13h6l1-13"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  );
}
