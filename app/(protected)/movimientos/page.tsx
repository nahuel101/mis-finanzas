import { obtenerTransacciones } from "@/lib/actions/transacciones";
import MovimientosClient from "@/components/MovimientosClient";

export default async function MovimientosPage() {
  const transacciones = await obtenerTransacciones();
  return <MovimientosClient transacciones={transacciones} />;
}
