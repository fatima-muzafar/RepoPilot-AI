# RepoPilot AI

RepoPilot AI is a repository-aware AI assistant built with Next.js. It allows users to ask questions about a selected GitHub repository and receive streaming AI responses.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## FE-07 — Tool Results and Structured UI

FE-07 extends the streaming AI assistant with a server-side GitHub repository tool.

### Tool: `get_repository_details`

**Purpose:**
Fetch current metadata and statistics for a GitHub repository.

### Input Schema

The tool accepts:

```text
owner: string
repo: string
```

Example:

```json
{
  "owner": "facebook",
  "repo": "react"
}
```

The input is validated using Zod before the tool executes.

### Execution

The tool executes server-side and requests repository information from the GitHub API.

The browser does not directly execute the tool.

```text
User
  ↓
RepoPilot AI
  ↓
/api/chat
  ↓
get_repository_details
  ↓
GitHub API
  ↓
Structured result
  ↓
RepositoryToolResult
```

### Return Shape

The tool returns:

```text
{
  name: string
  fullName: string
  owner: string
  description: string | null
  stars: number
  forks: number
  watchers: number
  language: string | null
  license: string | null
  topics: string[]
  url: string
}
```

### Tool Lifecycle UI

The frontend renders the tool lifecycle as distinct states:

1. **Input streaming** — repository tool input is being generated.
2. **Input available** — the requested repository is displayed.
3. **Output available** — the structured repository result is rendered as a repository component.
4. **Output error** — a designed error state is displayed when the tool execution fails.

Tool results are rendered through the `RepositoryToolResult` component rather than displayed as raw JSON.

## Project Technologies

* Next.js
* React
* TypeScript
* Tailwind CSS
* AI SDK
* OpenRouter
* Zod
* GitHub REST API

## Deployment

The application can be deployed using Vercel.

Before deployment, configure the required environment variables in the deployment environment.
