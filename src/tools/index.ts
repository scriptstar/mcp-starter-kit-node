import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerTools(server: McpServer) {
  // Add an addition tool
  server.tool("add", { a: z.number(), b: z.number() }, async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }],
  }));

  // Async tool with external API call
  server.tool("fetch-chuck-jokes", async () => {
    const response = await fetch(`https://api.chucknorris.io/jokes/random`);
    const data = await response.json();
    const joke = data.value;
    return {
      content: [{ type: "text", text: joke }],
    };
  });
}
