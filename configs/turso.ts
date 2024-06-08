import { createClient } from "https://esm.sh/@libsql/client@0.6.0/web";

export const turso = createClient({
  url: Deno.env.get("TURSO_DATABASE_URL") ||
    "libsql://link-shortener-probir-sarkar.turso.io",
  authToken: Deno.env.get("TURSO_AUTH_TOKEN"),
});
