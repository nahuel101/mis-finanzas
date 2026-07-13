"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Transaccion } from "@/lib/types";
import { formatMonto } from "@/lib/format";

const COLORES = [
  "#c9a227", // gold
  "#7fb89a", // sage
  "#c1693f", // copper
  "#6f8681", // mist-dim
  "#8a7220", // gold-dim
  "#567d69", // sage-dim
  "#8a4b2d", // copper-dim
  "#9fb3ac", // mist
];

export default function GastosPorCategoriaChart({
  transacciones,
}: {
  transacciones: Transaccion[];
}) {
  const data = useMemo(() => {
    const porCategoria = new Map<string, number>();
    transacciones
      .filter((t) => t.tipo === "gasto" && t.moneda === "ARS")
      .forEach((t) => {
        porCategoria.set(
          t.categoria,
          (porCategoria.get(t.categoria) ?? 0) + Number(t.monto)
        );
      });
    return Array.from(porCategoria.entries())
      .map(([categoria, monto]) => ({ categoria, monto }))
      .sort((a, b) => b.monto - a.monto);
  }, [transacciones]);

  if (data.length === 0) {
    return (
      <p className="text-sm text-mist-dim">Todavía no hay gastos en pesos.</p>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="h-40 w-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="monto"
              nameKey="categoria"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORES[i % COLORES.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatMonto(Number(value), "ARS")}
              contentStyle={{
                background: "#1d3d35",
                border: "1px solid #2a4a41",
                borderRadius: 8,
                fontSize: 12,
                color: "#f4f2ea",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex-1 space-y-1.5 text-xs">
        {data.slice(0, 6).map((d, i) => (
          <li key={d.categoria} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-mist">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: COLORES[i % COLORES.length] }}
              />
              {d.categoria}
            </span>
            <span className="font-mono-num text-paper">
              {formatMonto(d.monto, "ARS")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
