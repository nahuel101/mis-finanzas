import { auth } from "@/auth";
import { obtenerCategorias } from "@/lib/actions/categorias";
import LogoutButton from "@/components/LogoutButton";
import AgregarCuentaForm from "@/components/AgregarCuentaForm";
import CategoriasManager from "@/components/CategoriasManager";

export default async function CuentaPage() {
  const [session, categorias] = await Promise.all([
    auth(),
    obtenerCategorias(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <p className="font-display text-2xl font-semibold text-paper">Cuenta</p>

      <section className="rounded-xl border border-border bg-surface p-4">
        <p className="text-xs uppercase tracking-wide text-mist">
          Sesión activa
        </p>
        <p className="font-mono-num mt-1 text-sm text-paper">
          {session?.user?.email}
        </p>
        <div className="mt-4">
          <LogoutButton />
        </div>
      </section>

      <div className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-wide text-mist">
          Categorías
        </p>
        <CategoriasManager
          categoriasGasto={categorias.gasto}
          categoriasIngreso={categorias.ingreso}
        />
      </div>

      <section className="rounded-xl border border-border bg-surface p-4">
        <p className="mb-1 text-xs uppercase tracking-wide text-mist">
          Agregar otra cuenta
        </p>
        <p className="mb-4 text-xs text-mist-dim">
          Por ejemplo, para que tu pareja tenga su propio acceso. Cada cuenta
          ve únicamente sus propios movimientos e inversiones.
        </p>
        <AgregarCuentaForm />
      </section>
    </div>
  );
}
