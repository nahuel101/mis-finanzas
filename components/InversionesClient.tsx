"use client";

import { useState } from "react";
import type { InversionValuada } from "@/lib/valuacion";
import Modal from "@/components/Modal";
import InversionForm from "@/components/InversionForm";
import InversionRow from "@/components/InversionRow";

export default function InversionesClient({
  inversiones,
  dolarCCL,
}: {
  inversiones: InversionValuada[];
  dolarCCL: number | null;
}) {
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl italic text-paper">Inversiones</p>
        <button
          onClick={() => setModalAbierto(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-ink"
          aria-label="Agregar inversión"
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

      {!dolarCCL && (
        <p className="text-xs text-mist-dim">
          No se pudo obtener el dólar CCL en este momento — se muestran
          valores de compra hasta que vuelva a estar disponible.
        </p>
      )}

      {inversiones.length === 0 ? (
        <p className="pt-6 text-center text-sm text-mist-dim">
          No hay inversiones cargadas. Tocá + para agregar la primera.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {inversiones.map((inv) => (
            <InversionRow key={inv.id} inv={inv} />
          ))}
        </ul>
      )}

      <Modal
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title="Nueva inversión"
      >
        <InversionForm onGuardado={() => setModalAbierto(false)} />
      </Modal>
    </div>
  );
}
