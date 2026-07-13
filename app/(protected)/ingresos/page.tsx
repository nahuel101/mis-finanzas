import { obtenerTransacciones } from "@/lib/actions/transacciones";
import { obtenerCategorias } from "@/lib/actions/categorias";
import { obtenerDolarMEP } from "@/lib/valuacion";
import IngresosClient from "@/components/IngresosClient";

export default async function IngresosPage() {
  const [transacciones, categorias, dolarMEP] = await Promise.all([
    obtenerTransacciones(),
    obtenerCategorias(),
    obtenerDolarMEP(),
  ]);
  return (
    <IngresosClient
      transacciones={transacciones}
      categorias={categorias.ingreso.map((c) => c.nombre)}
      dolarMEP={dolarMEP}
    />
  );
}
