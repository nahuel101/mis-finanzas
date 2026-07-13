"use client";

import { useMemo, useState } from "react";
import type { Transaccion } from "@/lib/types";
import { formatMonto } from "@/lib/format";
import Modal from "@/components/Modal";
import TransaccionForm from "@/components/TransaccionForm";
import TransaccionList from "@/components/TransaccionList";

const MES_ACTUAL = new Date().toLocaleDateString("es-AR", {
  month: "long",
  year: "numeric",
});

export default function IngresosClient({
  transacciones,
  categorias,
}: {
  transacciones: Transaccion[];
  categorias: string[];
}) {
  const [modalAbierto, setModalAbierto] = useState(false);

  const ingresos = useMemo(
    () => transacciones.filter((t) => t.tipo === "ingreso"),
    [transacciones]
  );

  const hoy = new Date();
  const ingresosDelMes = useMemo(
    () =>
      ingresos.filter((t) => {
        const [y, m] = t.fecha.split("-").map(Number);
        return y === hoy.getFullYear() && m === hoy.getMonth() + 1;
      }),
    [ingresos, hoy]
  );

  const totalMesARS = ingresosDelMes
    .filter((t) => t.moneda === "ARS")
    .reduce((acc, t) => acc + Number(t.monto), 0);
  const totalMesUSD = ingresosDelMes
    .filter((t) => t.moneda === "USD")
    .reduce((acc, t) => acc + Number(t.monto), 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl font-semibold text-paper">Ingresos</p>
        <button
          onClick={() => setModalAbierto(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-ink"
          aria-label="Agregar ingreso"
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

      <section className="rounded-2xl border border-border bg-surface p-5">
        <p className="text-xs uppercase tracking-wide text-mist capitalize">
          Ingresos de {MES_ACTUAL}
        </p>
        <p className="font-mono-num mt-2 text-4xl text-sage">
          {formatMonto(totalMesARS, "ARS")}
        </p>
        {totalMesUSD > 0 && (
          <p className="font-mono-num mt-1 text-sm text-mist">
            {formatMonto(totalMesUSD, "USD")}
          </p>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-mist">
          Movimientos
        </p>
        <TransaccionList
          transacciones={ingresos}
          vacioTexto="No hay ingresos todavía. Tocá + para cargar el primero."
        />
      </section>

      <Modal
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title="Nuevo ingreso"
      >
        <TransaccionForm
          tipoFijo="ingreso"
          categorias={categorias}
          onGuardado={() => setModalAbierto(false)}
        />
      </Modal>
    </div>
  );
}
