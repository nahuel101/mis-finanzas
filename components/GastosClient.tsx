"use client";

import { useMemo, useState } from "react";
import type { Transaccion } from "@/lib/types";
import { formatMonto } from "@/lib/format";
import Modal from "@/components/Modal";
import GastoRapidoForm from "@/components/GastoRapidoForm";
import TransaccionForm from "@/components/TransaccionForm";
import TransaccionList from "@/components/TransaccionList";

const MES_ACTUAL = new Date().toLocaleDateString("es-AR", {
  month: "long",
  year: "numeric",
});

export default function GastosClient({
  transacciones,
  categorias,
  dolarMEP,
}: {
  transacciones: Transaccion[];
  categorias: string[];
  dolarMEP: number | null;
}) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<
    string | null
  >(null);
  const [modalCompletoAbierto, setModalCompletoAbierto] = useState(false);

  const gastos = useMemo(
    () => transacciones.filter((t) => t.tipo === "gasto"),
    [transacciones]
  );

  const hoy = new Date();
  const gastosDelMes = useMemo(
    () =>
      gastos.filter((t) => {
        const [y, m] = t.fecha.split("-").map(Number);
        return y === hoy.getFullYear() && m === hoy.getMonth() + 1;
      }),
    [gastos, hoy]
  );

  const totalMesARS = gastosDelMes
    .filter((t) => t.moneda === "ARS")
    .reduce((acc, t) => acc + Number(t.monto), 0);
  const totalMesUSD = gastosDelMes
    .filter((t) => t.moneda === "USD")
    .reduce((acc, t) => acc + Number(t.monto), 0);
  const totalCombinadoARS =
    totalMesARS + (dolarMEP ? totalMesUSD * dolarMEP : 0);

  const porCategoria = useMemo(() => {
    const map = new Map<string, number>();
    gastosDelMes
      .filter((t) => t.moneda === "ARS")
      .forEach((t) => {
        map.set(t.categoria, (map.get(t.categoria) ?? 0) + Number(t.monto));
      });
    return map;
  }, [gastosDelMes]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="font-display text-2xl font-semibold text-paper">Gastos</p>
        <button
          onClick={() => setModalCompletoAbierto(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-ink"
          aria-label="Agregar gasto con detalle"
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

      {/* Total del mes */}
      <section className="rounded-2xl border border-border bg-surface p-5">
        <p className="text-xs uppercase tracking-wide text-mist capitalize">
          Gastos de {MES_ACTUAL}
        </p>
        <p className="font-mono-num mt-2 text-4xl text-copper">
          {formatMonto(totalCombinadoARS, "ARS")}
        </p>
        {totalMesUSD > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="font-mono-num text-sm text-mist">
              {formatMonto(totalMesARS, "ARS")}{" "}
              <span className="text-[10px] text-mist-dim">ARS</span>
            </span>
            <span className="font-mono-num text-sm text-mist">
              {formatMonto(totalMesUSD, "USD")}{" "}
              <span className="text-[10px] text-mist-dim">USD</span>
            </span>
          </div>
        )}
        {totalMesUSD > 0 && !dolarMEP && (
          <p className="mt-1 text-xs text-copper">
            No se pudo cotizar el dólar MEP — el total no incluye los gastos
            en USD.
          </p>
        )}
      </section>

      {/* Categorías como botones */}
      <section className="grid grid-cols-3 gap-2.5">
        {categorias.length === 0 && (
          <p className="col-span-3 text-sm text-mist-dim">
            No tenés categorías todavía. Agregá una desde Cuenta.
          </p>
        )}
        {categorias.map((categoria) => (
          <button
            key={categoria}
            onClick={() => setCategoriaSeleccionada(categoria)}
            className="relative flex flex-col items-center gap-1.5 rounded-xl border border-border bg-surface px-2 py-3 text-center transition hover:border-copper/60"
          >
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-copper/15 text-copper">
              <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none">
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="text-[11px] text-mist">{categoria}</span>
            <span className="font-mono-num text-lg text-paper">
              {formatMonto(porCategoria.get(categoria) ?? 0, "ARS")}
            </span>
          </button>
        ))}
      </section>

      {/* Movimientos del mes */}
      <section className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide text-mist">
          Movimientos
        </p>
        <TransaccionList
          transacciones={gastos}
          vacioTexto="No hay gastos todavía. Tocá una categoría para cargar el primero."
        />
      </section>

      <Modal
        open={categoriaSeleccionada !== null}
        onClose={() => setCategoriaSeleccionada(null)}
        title={`Nuevo gasto`}
      >
        {categoriaSeleccionada && (
          <GastoRapidoForm
            categoria={categoriaSeleccionada}
            onGuardado={() => setCategoriaSeleccionada(null)}
          />
        )}
      </Modal>

      <Modal
        open={modalCompletoAbierto}
        onClose={() => setModalCompletoAbierto(false)}
        title="Nuevo gasto"
      >
        <TransaccionForm
          tipoFijo="gasto"
          categorias={categorias}
          onGuardado={() => setModalCompletoAbierto(false)}
        />
      </Modal>
    </div>
  );
}
