import { obtenerTransacciones } from "@/lib/actions/transacciones";
import { obtenerCategorias } from "@/lib/actions/categorias";
import IngresosClient from "@/components/IngresosClient";

export default async function IngresosPage() {
  const [transacciones, categorias] = await Promise.all([
    obtenerTransacciones(),
    obtenerCategorias(),
  ]);
  return (
    <IngresosClient
      transacciones={transacciones}
      categorias={categorias.ingreso.map((c) => c.nombre)}
    />
  );
}
