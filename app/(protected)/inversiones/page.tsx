import { obtenerInversiones } from "@/lib/actions/inversiones";
import { obtenerDolarCCL, valuarInversiones } from "@/lib/valuacion";
import InversionesClient from "@/components/InversionesClient";

export default async function InversionesPage() {
  const inversiones = await obtenerInversiones();
  const dolarCCL = await obtenerDolarCCL();
  const inversionesValuadas = await valuarInversiones(inversiones, dolarCCL);

  return (
    <InversionesClient
      inversiones={inversionesValuadas}
      dolarCCL={dolarCCL}
    />
  );
}
