import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./tools/index.js";
import { registerResources } from "./resources/index.js";
import { registerPrompts } from "./prompts/index.js";

// Create an MCP server
const server = new McpServer({
  name: "MCP Quick Start",
  version: "1.0.0",
});

// Register tools
registerTools(server);

// Register resources
registerResources(server);

// Register prompts
registerPrompts(server);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
