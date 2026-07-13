import BottomNav from "@/components/BottomNav";
import LogoMark from "@/components/LogoMark";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col">
      <header className="flex items-center gap-2 px-5 pb-2 pt-6">
        <LogoMark className="h-7 w-7 rounded-lg" />
        <p className="font-display text-xl font-semibold text-paper">
          Mis Finanzas
        </p>
      </header>

      <main className="flex-1 px-5 pb-28 pt-2">{children}</main>

      <BottomNav />
    </div>
  );
}
