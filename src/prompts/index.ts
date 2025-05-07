import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Define the Zod schema for validating the parameters once received in the callback
const getGreetingAndJokeParamsSchema = z.object({
  name: z.string().min(1, "Name cannot be empty."), // Added min(1) for basic validation
});

// Define the args shape for the prompt, conforming to PromptArgsRawShape
// PromptArgsRawShape is typically { [key: string]: z.ZodType<string | undefined> }
const getGreetingAndJokeArgsShape = {
  name: z.string().describe("The name of the person to greet."),
};

export function registerPrompts(server: McpServer) {
  server.prompt(
    "getGreetingAndJoke",
    getGreetingAndJokeArgsShape, // This is the argsSchema
    async (
      args: { name?: string },
      _extra: any /* eslint-disable-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
    ) => {
      // args here is { name: string | undefined } based on PromptArgsRawShape
      // We can use our more specific Zod object schema for robust validation and type inference
      const parseResult = getGreetingAndJokeParamsSchema.safeParse(args);

      if (!parseResult.success) {
        console.error(
          "Parameter validation failed for getGreetingAndJoke prompt:",
          parseResult.error.flatten()
        );
        // Provide a user-friendly error message via the prompt response
        return {
          messages: [
            {
              role: "assistant",
              content: {
                // Single content part object
                type: "text" as const,
                text:
                  "I'm sorry, but I need a valid name to provide a greeting and a joke. " +
                  (parseResult.error.flatten().fieldErrors.name?.[0] ||
                    "Please provide the 'name' parameter."),
              },
            },
          ],
        };
      }

      // 'name' is now validated and correctly typed as string
      const { name } = parseResult.data;

      return {
        messages: [
          {
            role: "assistant",
            content: {
              // Single content part object
              type: "text" as const,
              text: "You are a friendly assistant. Your task is to greet the user by their name and then tell them a Chuck Norris joke. You should use the available tools and resources to accomplish this. I will now wait for your instruction to proceed with greeting and joke telling for the specified user.",
            },
          },
          {
            role: "user",
            content: {
              // Single content part object
              type: "text" as const,
              text: `Please greet ${name} and then tell a Chuck Norris joke.`,
            },
          },
        ],
      };
    }
  );
}
