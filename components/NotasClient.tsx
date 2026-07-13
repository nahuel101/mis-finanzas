"use client";

import { useActionState, useEffect, useState } from "react";
import type { Nota } from "@/lib/types";
import Modal from "@/components/Modal";
import { crearNota, eliminarNota, type EstadoFormNota } from "@/lib/actions/notas";

const estadoInicial: EstadoFormNota = { error: null };

function formatFechaHora(iso: string): string {
  return new Date(iso).toLocaleString("es-AR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function NotaForm({ onGuardado }: { onGuardado: () => void }) {
  const [estado, formAction, pending] = useActionState(
    crearNota,
    estadoInicial
  );

  useEffect(() => {
    if (estado.ok) onGuardado();
  }, [estado.ok, onGuardado]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <textarea
        name="contenido"
        required
        autoFocus
        rows={5}
        placeholder="Escribí tu nota…"
        className="resize-none rounded-lg border border-border bg-ink px-3 py-2.5 text-paper outline-none focus:border-gold"
      />

      {estado.error && (
        <p className="text-sm text-copper" role="alert">
          {estado.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-gold py-2.5 font-medium text-ink transition hover:bg-gold-dim disabled:opacity-60"
      >
        {pending ? "Guardando…" : "Guardar"}
      </button>
    </form>
  );
}

export default function NotasClient({ notas }: { notas: Nota[] }) {
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl font-semibold text-paper">
          Notas
        </p>
        <button
          onClick={() => setModalAbierto(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-ink"
          aria-label="Agregar nota"
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

      {notas.length === 0 ? (
        <p className="pt-6 text-center text-sm text-mist-dim">
          No hay notas todavía. Tocá + para escribir la primera.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {notas.map((nota) => (
            <li
              key={nota.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3"
            >
              <div className="min-w-0">
                <p className="whitespace-pre-wrap text-sm text-paper">
                  {nota.contenido}
                </p>
                <p className="mt-1 text-xs text-mist-dim">
                  {formatFechaHora(nota.created_at)}
                </p>
              </div>
              <form action={eliminarNota.bind(null, nota.id)} className="shrink-0">
                <button
                  type="submit"
                  aria-label="Borrar nota"
                  className="p-1.5 text-mist-dim hover:text-copper"
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
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title="Nueva nota"
      >
        <NotaForm onGuardado={() => setModalAbierto(false)} />
      </Modal>
    </div>
  );
}
