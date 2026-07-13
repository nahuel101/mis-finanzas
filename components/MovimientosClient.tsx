"use client";

import { useState } from "react";
import type { Transaccion } from "@/lib/types";
import { formatFecha, formatMonto } from "@/lib/format";
import Modal from "@/components/Modal";
import TransaccionForm from "@/components/TransaccionForm";
import { eliminarTransaccion } from "@/lib/actions/transacciones";

export default function MovimientosClient({
  transacciones,
}: {
  transacciones: Transaccion[];
}) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [filtro, setFiltro] = useState<"todos" | "ingreso" | "gasto">("todos");

  const visibles =
    filtro === "todos"
      ? transacciones
      : transacciones.filter((t) => t.tipo === filtro);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl italic text-paper">Movimientos</p>
        <button
          onClick={() => setModalAbierto(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-ink"
          aria-label="Agregar movimiento"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="flex gap-2 text-xs">
        {(["todos", "ingreso", "gasto"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`rounded-full border px-3 py-1 capitalize ${
              filtro === f
                ? "border-gold text-gold"
                : "border-border text-mist-dim"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {visibles.length === 0 ? (
        <p className="pt-6 text-center text-sm text-mist-dim">
          No hay movimientos todavía. Tocá + para cargar el primero.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {visibles.map((t) => (
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
      )}

      <Modal
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title="Nuevo movimiento"
      >
        <TransaccionForm onGuardado={() => setModalAbierto(false)} />
      </Modal>
    </div>
  );
}
