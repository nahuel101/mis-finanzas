import { obtenerTransacciones } from "@/lib/actions/transacciones";
import { obtenerCategorias } from "@/lib/actions/categorias";
import { obtenerDolarMEP } from "@/lib/valuacion";
import GastosClient from "@/components/GastosClient";

export default async function GastosPage() {
  const [transacciones, categorias, dolarMEP] = await Promise.all([
    obtenerTransacciones(),
    obtenerCategorias(),
    obtenerDolarMEP(),
  ]);
  return (
    <GastosClient
      transacciones={transacciones}
      categorias={categorias.gasto.map((c) => c.nombre)}
      dolarMEP={dolarMEP}
    />
  );
}
