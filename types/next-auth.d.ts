import type { DefaultSession } from "next-auth";

// Agrega el campo "id" a session.user, que Auth.js no tipa por defecto.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
