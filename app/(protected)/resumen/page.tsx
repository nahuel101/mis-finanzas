import { obtenerTransacciones } from "@/lib/actions/transacciones";
import { obtenerInversiones } from "@/lib/actions/inversiones";
import { obtenerDolarCCL, valuarInversiones } from "@/lib/valuacion";
import { formatMonto } from "@/lib/format";
import GastosPorCategoriaChart from "@/components/GastosPorCategoriaChart";

export default async function ResumenPage() {
  const [transacciones, inversiones] = await Promise.all([
    obtenerTransacciones(),
    obtenerInversiones(),
  ]);
  const dolarCCL = await obtenerDolarCCL();
  const inversionesValuadas = await valuarInversiones(inversiones, dolarCCL);

  const hoy = new Date();
  const delMes = transacciones.filter((t) => {
    const [y, m] = t.fecha.split("-").map(Number);
    return y === hoy.getFullYear() && m === hoy.getMonth() + 1;
  });

  const totalPor = (tipo: "ingreso" | "gasto", moneda: "ARS" | "USD") =>
    transacciones
      .filter((t) => t.tipo === tipo && t.moneda === moneda)
      .reduce((acc, t) => acc + Number(t.monto), 0);

  const mesPor = (tipo: "ingreso" | "gasto", moneda: "ARS" | "USD") =>
    delMes
      .filter((t) => t.tipo === tipo && t.moneda === moneda)
      .reduce((acc, t) => acc + Number(t.monto), 0);

  const balanceARS = totalPor("ingreso", "ARS") - totalPor("gasto", "ARS");
  const balanceUSD = totalPor("ingreso", "USD") - totalPor("gasto", "USD");
  const ingresosMesARS = mesPor("ingreso", "ARS");
  const gastosMesARS = mesPor("gasto", "ARS");

  const valorCarteraARS = dolarCCL
    ? inversionesValuadas.reduce(
        (acc, inv) => acc + (inv.valorActualARS ?? 0),
        0
      )
    : null;

  return (
    <div className="flex flex-col gap-5">
      <p className="font-display text-2xl italic text-paper">Resumen</p>

      {/* Balance principal */}
      <section className="rounded-2xl border border-border bg-surface p-5">
        <p className="text-xs uppercase tracking-wide text-mist">
          Balance total
        </p>
        <p className="font-mono-num mt-2 text-3xl text-paper">
          {formatMonto(balanceARS, "ARS")}
        </p>
        <p className="font-mono-num mt-1 text-sm text-mist">
          {formatMonto(balanceUSD, "USD")}
        </p>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full bg-gradient-to-r from-sage to-gold"
            style={{
              width: `${Math.min(
                100,
                Math.max(
                  8,
                  (ingresosMesARS / Math.max(1, ingresosMesARS + gastosMesARS)) *
                    100
                )
              )}%`,
            }}
          />
        </div>
      </section>

      {/* Este mes */}
      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-mist">Ingresos del mes</p>
          <p className="font-mono-num mt-1 text-lg text-sage">
            {formatMonto(ingresosMesARS, "ARS")}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs text-mist">Gastos del mes</p>
          <p className="font-mono-num mt-1 text-lg text-copper">
            {formatMonto(gastosMesARS, "ARS")}
          </p>
        </div>
      </section>

      {/* Cartera de inversiones */}
      <section className="rounded-xl border border-border bg-surface p-4">
        <p className="text-xs uppercase tracking-wide text-mist">
          Cartera de inversiones
        </p>
        <p className="font-mono-num mt-2 text-2xl text-gold">
          {valorCarteraARS !== null
            ? formatMonto(valorCarteraARS, "ARS")
            : inversiones.length
              ? "No se pudo cotizar"
              : "Sin inversiones cargadas"}
        </p>
        <p className="mt-1 text-xs text-mist-dim">
          {inversiones.length} posiciones · valuado a dólar CCL
        </p>
      </section>

      {/* Gastos por categoría */}
      {transacciones.some((t) => t.tipo === "gasto") && (
        <section className="rounded-xl border border-border bg-surface p-4">
          <p className="mb-3 text-xs uppercase tracking-wide text-mist">
            Gastos por categoría
          </p>
          <GastosPorCategoriaChart transacciones={transacciones} />
        </section>
      )}
    </div>
  );
}
