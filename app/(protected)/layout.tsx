import BottomNav from "@/components/BottomNav";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col">
      <header className="px-5 pb-2 pt-6">
        <p className="font-display text-xl italic text-paper">
          Mis Finanzas
        </p>
      </header>

      <main className="flex-1 px-5 pb-28 pt-2">{children}</main>

      <BottomNav />
    </div>
  );
}
