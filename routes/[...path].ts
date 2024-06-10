import { FreshContext, Handlers } from "$fresh/server.ts";
import { turso } from "../configs/turso.ts";

export const handler = async (_req: Request, _ctx: FreshContext) => {
  // params
  try {
    // Extract parameters from context
    const params = _ctx.params;
    const pathId = params.path;
    // Execute SQL query to fetch the link associated with the pathId
    const queryResult = await turso.execute({
      sql: "SELECT * FROM links WHERE id = (:id)",
      args: { id: pathId },
    });
    // Check if the result is empty and return a 404 response if true
    if (queryResult.rows.length === 0) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    // Extract the link from the query result
    const link = queryResult.rows[0].link as string;
    // Check if the link is empty or null and return a 404 response if true
    if (!link) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Redirect to the link with a 301 status
    const newUrl = new URL(link);
    return Response.redirect(newUrl, 301);
  } catch (error) {
    console.error("Error fetching data:", error);

    // Return a 500 response in case of an error
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
