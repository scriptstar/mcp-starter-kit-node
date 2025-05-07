# MCP Quick Start Server

This project is a simple quick-start example of a Model Context Protocol (MCP) server built with TypeScript and the `@modelcontextprotocol/sdk`. It demonstrates how to define basic tools, resources, and prompts.

## Features

- **Tool: `add`**: Adds two numbers.
  - Parameters: `a` (number), `b` (number)
  - Returns: The sum as a string.
- **Tool: `fetch-chuck-jokes`**: Fetches a random Chuck Norris joke.
  - Parameters: None
  - Returns: A Chuck Norris joke as a string.
- **Resource: `greeting`**: Provides a personalized greeting.
  - URI Scheme: `greeting://{name}`
  - Example: `greeting://World` would provide a greeting for "World".
- **Prompt: `getGreetingAndJoke`**: Instructs an AI client to greet a user by name and then tell them a Chuck Norris joke.
  - Parameter: `name` (string)
  - Example: Invoking with `name: "Narendra"` will set up a conversation for the AI to greet Narendra and tell a joke.

## Directory Structure

```
quick-start/
├── build/              # Compiled JavaScript output
├── src/                # TypeScript source files
│   ├── index.ts        # Main server setup and entry point
│   ├── tools/
│   │   └── index.ts    # Tool definitions
│   ├── resources/
│   │   └── index.ts    # Resource definitions
│   └── prompts/
│       └── index.ts    # Prompt definitions
├── .gitignore
├── package-lock.json
├── package.json
├── tsconfig.json
└── README.md           # This file
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Setup & Installation

1.  **Clone the repository (if you haven't already):**

    ```bash
    git clone https://github.com/scriptstar/mcp-starter-kit-node.git
    cd mcp-starter-kit-node
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Building the Server

To compile the TypeScript code into JavaScript, run:

```bash
npm run build
```

This command executes `tsc` (the TypeScript compiler) according to the `tsconfig.json` configuration and places the output in the `build/` directory. It also makes the main build file executable.

## Running the Server

Once built, you can start the MCP server using:

```bash
node build/index.js
```

Alternatively, for production-like environments, you can use the start script:

```bash
npm start
```

The server will start and listen for messages on standard input (stdin) and send responses to standard output (stdout), as it uses the `StdioServerTransport`.

## Development Workflow

For a more efficient development experience, you can use the `dev` script:

```bash
npm run dev
```

This command uses `concurrently` to run two processes:

1.  `tsc -w`: Watches your TypeScript files for changes and recompiles them automatically.
2.  `nodemon build/index.js`: Watches for changes in the `build` directory (where `tsc` outputs JavaScript) and restarts the Node.js server automatically.

This provides a live-reload-like experience during development.

## Linting

This project uses ESLint with TypeScript support to maintain code quality and consistency.

- **To check for linting errors:**
  ```bash
  npm run lint
  ```
- **To automatically fix fixable linting errors:**
  ```bash
  npm run lint:fix
  ```

It's recommended to run the linter before committing code.

## How It Works

This server implements the Model Context Protocol.

- **`src/index.ts`**: Initializes an `McpServer` instance, imports tool, resource, and prompt registration functions from their respective modules, calls these functions to register them with the server, and then connects a `StdioServerTransport` to handle communication.
- **`src/tools/index.ts`**: Exports a `registerTools` function.
  - `add`: Takes two numbers `a` and `b` and returns their sum.
  - `fetch-chuck-jokes`: Makes an HTTP GET request to `https://api.chucknorris.io/jokes/random` and returns the joke.
- **`src/resources/index.ts`**: Exports a `registerResources` function.
  - `greeting`: Defines a resource template `greeting://{name}`. When this URI is requested, it returns a personalized greeting message.
- **`src/prompts/index.ts`**: Exports a `registerPrompts` function.
  - `getGreetingAndJoke`: Defines a prompt that takes a `name` argument. It constructs a set of initial messages to guide an AI client. The first message (role: assistant) sets the context, and the second message (role: user) formulates the request using the provided `name`.

## Interacting with the Server (Conceptual)

This MCP server is designed to be controlled by an MCP client (e.g., an AI assistant, a development tool). The client communicates with the server by sending JSON-RPC messages to its stdin and receiving responses from its stdout.

Here's how a client might interact with the defined capabilities:

1.  **Calling the `add` tool:**
    A client could send a JSON-RPC request like:

    ```json
    {
      "jsonrpc": "2.0",
      "method": "callTool",
      "params": { "name": "add", "args": { "a": 5, "b": 3 } },
      "id": "request1"
    }
    ```

    The server would respond with the result:

    ```json
    {
      "jsonrpc": "2.0",
      "result": { "content": [{ "type": "text", "text": "8" }] },
      "id": "request1"
    }
    ```

2.  **Accessing the `greeting` resource:**
    A client could request to read the resource URI `greeting://Alice`:

    ```json
    {
      "jsonrpc": "2.0",
      "method": "readResource",
      "params": { "uri": "greeting://Alice" },
      "id": "request2"
    }
    ```

    The server would respond:

    ```json
    {
      "jsonrpc": "2.0",
      "result": {
        "contents": [{ "uri": "greeting://Alice", "text": "Hello, Alice!" }]
      },
      "id": "request2"
    }
    ```

3.  **Using the `getGreetingAndJoke` prompt:**
    A client wanting to initiate this guided task for "Bob" would send:
    ```json
    {
      "jsonrpc": "2.0",
      "method": "getPrompt",
      "params": {
        "uri": "prompt://getGreetingAndJoke",
        "args": { "name": "Bob" }
      },
      "id": "request3"
    }
    ```
    The server would respond with the initial messages:
    ```json
    {
      "jsonrpc": "2.0",
      "result": {
        "messages": [
          {
            "role": "assistant",
            "content": {
              "type": "text",
              "text": "You are a friendly assistant. Your task is to greet the user by their name and then tell them a Chuck Norris joke. You should use the available tools and resources to accomplish this. I will now wait for your instruction to proceed with greeting and joke telling for the specified user."
            }
          },
          {
            "role": "user",
            "content": {
              "type": "text",
              "text": "Please greet Bob and then tell a Chuck Norris joke."
            }
          }
        ]
      },
      "id": "request3"
    }
    ```
    The AI client would then process these messages and subsequently decide to call the `greeting` resource (for "Bob") and the `fetch-chuck-jokes` tool, using separate `readResource` and `callTool` requests.

## Further Development

- Add more complex tools with various input/output types.
- Implement resources that interact with local files or databases.
- Create more sophisticated prompts for multi-turn conversations.
- Explore other transport layers (e.g., HTTP) if needed.
- Add comprehensive error handling and logging.

This README should give a good overview of your project!
