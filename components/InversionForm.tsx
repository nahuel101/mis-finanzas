"use client";

import { useActionState, useEffect, useState } from "react";
import {
  crearInversion,
  type EstadoFormInversion,
} from "@/lib/actions/inversiones";
import type { TipoInversion } from "@/lib/types";

const ETIQUETAS_TIPO: Record<TipoInversion, string> = {
  cedear: "CEDEAR (BYMA)",
  accion: "Acción / ETF de EE.UU.",
  cripto: "Cripto",
  bono: "Bono",
  otro: "Otro",
};

const AYUDA_TICKER: Record<TipoInversion, string> = {
  cedear: 'Ticker en BYMA, sin ".BA" (ej: AAPL, TSLA, KO)',
  accion: "Ticker de EE.UU. (ej: AAPL, VOO, SPY)",
  cripto: 'ID de CoinGecko (ej: "bitcoin", "ethereum")',
  bono: "Nombre o código del bono (ej: AL30)",
  otro: "Nombre identificatorio",
};

const estadoInicial: EstadoFormInversion = { error: null };

export default function InversionForm({
  onGuardado,
}: {
  onGuardado: () => void;
}) {
  const [estado, formAction, pending] = useActionState(
    crearInversion,
    estadoInicial
  );
  const [tipo, setTipo] = useState<TipoInversion>("cedear");
  const [monedaCompra, setMonedaCompra] = useState<"ARS" | "USD">("ARS");

  useEffect(() => {
    if (estado.ok) onGuardado();
  }, [estado.ok, onGuardado]);

  const hoy = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <select
        name="tipo"
        value={tipo}
        onChange={(e) => setTipo(e.target.value as TipoInversion)}
        className="rounded-lg border border-border bg-ink px-3 py-2.5 text-paper outline-none focus:border-gold"
      >
        {Object.entries(ETIQUETAS_TIPO).map(([valor, etiqueta]) => (
          <option key={valor} value={valor}>
            {etiqueta}
          </option>
        ))}
      </select>

      <div>
        <input
          type="text"
          name="ticker"
          required
          placeholder={
            tipo === "cripto" ? "bitcoin" : tipo === "cedear" ? "AAPL" : "Ticker"
          }
          className="w-full rounded-lg border border-border bg-ink px-3 py-2.5 uppercase text-paper outline-none focus:border-gold placeholder:normal-case"
        />
        <p className="mt-1 text-xs text-mist-dim">{AYUDA_TICKER[tipo]}</p>
      </div>

      <input
        type="text"
        name="nombre"
        placeholder="Nombre (opcional)"
        className="rounded-lg border border-border bg-ink px-3 py-2.5 text-paper outline-none focus:border-gold"
      />

      <div className="flex gap-2">
        <input
          type="text"
          name="cantidad"
          inputMode="decimal"
          required
          placeholder="Cantidad"
          className="font-mono-num flex-1 rounded-lg border border-border bg-ink px-3 py-2.5 text-paper outline-none focus:border-gold"
        />
        <input
          type="text"
          name="precioCompra"
          inputMode="decimal"
          required
          placeholder="Precio compra"
          className="font-mono-num flex-1 rounded-lg border border-border bg-ink px-3 py-2.5 text-paper outline-none focus:border-gold"
        />
        <div className="flex overflow-hidden rounded-lg border border-border">
          {(["ARS", "USD"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMonedaCompra(m)}
              className={`px-3 text-sm ${
                monedaCompra === m ? "bg-gold text-ink" : "bg-ink text-mist"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <input type="hidden" name="monedaCompra" value={monedaCompra} />
      </div>

      <input
        type="date"
        name="fechaCompra"
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
