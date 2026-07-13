import { obtenerTransacciones } from "@/lib/actions/transacciones";
import IngresosClient from "@/components/IngresosClient";

export default async function IngresosPage() {
  const transacciones = await obtenerTransacciones();
  return <IngresosClient transacciones={transacciones} />;
}
