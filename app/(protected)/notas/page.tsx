import { obtenerNotas } from "@/lib/actions/notas";
import NotasClient from "@/components/NotasClient";

export default async function NotasPage() {
  const notas = await obtenerNotas();
  return <NotasClient notas={notas} />;
}
