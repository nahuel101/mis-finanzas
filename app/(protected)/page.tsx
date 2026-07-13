import { obtenerTransacciones } from "@/lib/actions/transacciones";
import GastosClient from "@/components/GastosClient";

export default async function GastosPage() {
  const transacciones = await obtenerTransacciones();
  return <GastosClient transacciones={transacciones} />;
}
