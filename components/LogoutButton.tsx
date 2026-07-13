import { signOut } from "@/auth";

export default function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
      }}
    >
      <button className="rounded-full border border-border px-3 py-1.5 text-xs text-mist transition hover:border-gold hover:text-gold">
        Salir
      </button>
    </form>
  );
}
