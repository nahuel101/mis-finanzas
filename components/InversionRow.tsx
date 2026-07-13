import type { InversionValuada } from "@/lib/valuacion";
import { formatMonto } from "@/lib/format";
import { eliminarInversion } from "@/lib/actions/inversiones";

export default function InversionRow({ inv }: { inv: InversionValuada }) {
  return (
    <li className="rounded-xl border border-border bg-surface px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-paper">
            {inv.ticker}
            {inv.nombre ? (
              <span className="ml-1 font-normal text-mist-dim">
                {inv.nombre}
              </span>
            ) : null}
          </p>
          <p className="text-xs capitalize text-mist-dim">
            {inv.tipo} · {inv.cantidad} u.
          </p>
        </div>
        <div className="text-right">
          {inv.valorActualARS === null ? (
            <p className="text-xs text-mist-dim">Sin cotizar</p>
          ) : !inv.precioEnVivo ? (
            <p className="font-mono-num text-sm text-paper">
              {formatMonto(inv.valorActualARS, "ARS")}
              <span className="ml-1 text-[10px] text-mist-dim">(compra)</span>
            </p>
          ) : (
            <>
              <p className="font-mono-num text-sm text-paper">
                {formatMonto(inv.valorActualARS, "ARS")}
              </p>
              {inv.gananciaPct !== null && (
                <p
                  className={`font-mono-num text-xs ${
                    inv.gananciaARS !== null && inv.gananciaARS >= 0
                      ? "text-sage"
                      : "text-copper"
                  }`}
                >
                  {inv.gananciaARS !== null && inv.gananciaARS >= 0 ? "+" : ""}
                  {inv.gananciaPct.toFixed(1)}%
                </p>
              )}
            </>
          )}
        </div>
      </div>
      <form action={eliminarInversion.bind(null, inv.id)}>
        <button
          type="submit"
          className="mt-2 text-xs text-mist-dim hover:text-copper"
        >
          Eliminar
        </button>
      </form>
    </li>
  );
}
