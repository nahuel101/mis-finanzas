"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  crearCategoria,
  eliminarCategoria,
  renombrarCategoria,
  type EstadoFormCategoria,
} from "@/lib/actions/categorias";
import type { Categoria, TipoTransaccion } from "@/lib/types";

const estadoInicial: EstadoFormCategoria = { error: null };

function CategoriaSeccion({
  tipo,
  titulo,
  categorias,
}: {
  tipo: TipoTransaccion;
  titulo: string;
  categorias: Categoria[];
}) {
  const [estado, formAction, pending] = useActionState(
    crearCategoria,
    estadoInicial
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (estado.ok) formRef.current?.reset();
  }, [estado.ok]);

  return (
    <section className="rounded-xl border border-border bg-surface p-4">
      <p className="mb-3 text-xs uppercase tracking-wide text-mist">
        {titulo}
      </p>

      {categorias.length === 0 ? (
        <p className="text-sm text-mist-dim">Sin categorías todavía.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {categorias.map((cat) => (
            <li key={cat.id} className="flex items-center gap-2">
              <form action={renombrarCategoria} className="flex-1">
                <input type="hidden" name="id" value={cat.id} />
                <input
                  type="text"
                  name="nombre"
                  defaultValue={cat.nombre}
                  onBlur={(e) => {
                    const valor = e.currentTarget.value.trim();
                    if (valor && valor !== cat.nombre) {
                      e.currentTarget.form?.requestSubmit();
                    }
                  }}
                  className="w-full rounded-lg border border-border bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-gold"
                />
              </form>
              <form action={eliminarCategoria.bind(null, cat.id)}>
                <button
                  type="submit"
                  aria-label={`Borrar categoría ${cat.nombre}`}
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

      <form
        ref={formRef}
        action={formAction}
        className="mt-3 flex gap-2"
      >
        <input type="hidden" name="tipo" value={tipo} />
        <input
          type="text"
          name="nombre"
          required
          placeholder="Nueva categoría"
          className="flex-1 rounded-lg border border-border bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-gold"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-gold px-4 text-sm font-medium text-ink transition hover:bg-gold-dim disabled:opacity-60"
        >
          +
        </button>
      </form>
      {estado.error && (
        <p className="mt-2 text-xs text-copper" role="alert">
          {estado.error}
        </p>
      )}
    </section>
  );
}

export default function CategoriasManager({
  categoriasGasto,
  categoriasIngreso,
}: {
  categoriasGasto: Categoria[];
  categoriasIngreso: Categoria[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <CategoriaSeccion
        tipo="gasto"
        titulo="Categorías de gastos"
        categorias={categoriasGasto}
      />
      <CategoriaSeccion
        tipo="ingreso"
        titulo="Categorías de ingresos"
        categorias={categoriasIngreso}
      />
    </div>
  );
}
