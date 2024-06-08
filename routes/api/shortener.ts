import { FreshContext, Handlers } from "$fresh/server.ts";
import { turso } from "../../configs/turso.ts";

export const handler: Handlers = {
  async GET(_req: Request, _ctx: FreshContext) {
    try {
      const result = await turso.execute("SELECT * FROM links");
      const data = result.rows;
      const jsonData = JSON.stringify(data);
      return new Response(jsonData, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.log(error);

      return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
  async POST(req, _ctx) {
    try {
      const body = await req.json();
      const { url } = body;
      if (!url || !isValidUrl(url)) {
        return new Response(JSON.stringify({ error: "Invalid URL" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      const existingLink = await turso.execute({
        sql: "SELECT * FROM links WHERE link = (:link)",
        args: { link: url },
      });
      if (existingLink.rows.length > 0) {
        const responseData = {
          id: existingLink.rows[0].id,
          link: url,
        };
        return new Response(JSON.stringify(responseData), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      const generatedLinkId = await generateUniqueLinkId();
      const result = await turso.execute({
        sql: "INSERT INTO links (id, link) VALUES ((:id),(:link)) RETURNING id",
        args: {
          link: url,
          id: generatedLinkId,
        },
      });
      const insertedLinkId = result.rows[0].id;
      const responseData = { id: insertedLinkId, link: url };
      return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: "Failed to create link" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function generateRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

async function generateUniqueLinkId() {
  const randomString = generateRandomString(8);
  try {
    const result = await turso.execute({
      sql: "SELECT * FROM links WHERE id = (:id)",
      args: { id: randomString },
    });

    // Check if no rows are returned
    if (result.rows.length === 0) {
      return randomString;
    }
    return generateUniqueLinkId();
  } catch (error) {
    console.error("Database query failed:", error);
    throw new Error("Failed to generate a unique link ID");
  }
}
