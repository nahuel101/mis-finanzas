import { redirect } from "next/navigation";
import { contarUsuarios } from "@/lib/actions/usuarios";
import SetupForm from "@/components/SetupForm";

// Esta página depende de si ya existe algún usuario en la base, algo
// que puede cambiar en cualquier momento — nunca debe quedar cacheada
// ni pre-generada en el build.
export const dynamic = "force-dynamic";

export default async function SetupPage() {
  const total = await contarUsuarios();

  // Ya hay una cuenta creada: esta pantalla deja de tener sentido
  // (evita que cualquiera pueda crear cuentas nuevas sin loguearse).
  if (total > 0) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="font-display text-3xl italic text-paper">
            Mis Finanzas
          </p>
          <p className="mt-2 text-sm text-mist">
            Creá la primera cuenta para empezar.
          </p>
        </div>
        <SetupForm />
      </div>
    </main>
  );
}
