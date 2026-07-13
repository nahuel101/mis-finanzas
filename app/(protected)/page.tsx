import { obtenerTransacciones } from "@/lib/actions/transacciones";
import { obtenerCategorias } from "@/lib/actions/categorias";
import GastosClient from "@/components/GastosClient";

export default async function GastosPage() {
  const [transacciones, categorias] = await Promise.all([
    obtenerTransacciones(),
    obtenerCategorias(),
  ]);
  return (
    <GastosClient
      transacciones={transacciones}
      categorias={categorias.gasto.map((c) => c.nombre)}
    />
  );
}
