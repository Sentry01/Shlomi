---
title: 'Giving Copilot a Database: Building an MCP Server for Supabase'
description: 'Model Context Protocol lets AI assistants talk to external tools. I built an MCP server that connects Copilot to Supabase — giving it real schema awareness instead of guesswork. Here is how the plumbing works.'
pubDate: 2026-03-07
tags: ['mcp', 'copilot', 'supabase', 'ai', 'database', 'agent']
draft: false
---

## The context gap

Here is a scene every developer knows: you are working with Copilot on a database-backed feature, and it suggests a query against a table that does not exist. Or it gets the column names almost right — close enough to look plausible, wrong enough to fail at runtime. The model is guessing because it has no way to see your actual schema.

This is the context gap. AI assistants are remarkably capable at code generation, but they are fundamentally limited by what they can see. Your database schema, your table relationships, your column types and constraints — none of this is visible to the model unless you manually paste it into the chat. And the moment your schema changes, that pasted context is stale.

Model Context Protocol (MCP) is the emerging standard for closing this gap. It defines how AI assistants connect to external tools and data sources through a structured, server-based interface. Instead of guessing about your data model, the assistant queries an MCP server that returns the real schema on demand.

I built one for Supabase.

## What the server does

The Supabase MCP server is a Node.js process that acts as a bridge between Copilot and your Supabase database. It exposes three core handlers:

```javascript
// Schema introspection -- returns full database schema
server.registerHandler('getSchema', async () => {
  return await schemaProvider.getFullSchema();
});

// Table details -- returns columns, types, relationships
server.registerHandler('getTableInfo', async (params) => {
  return await schemaProvider.getTableInfo(params.tableName);
});

// Safe query execution -- SELECT-only by default
server.registerHandler('executeQuery', async (params) => {
  return await queryHandler.execute(params.query, params.params);
});
```

When Copilot needs database context — to generate a query, suggest a migration, or write data-access code — it calls the MCP server instead of guessing. The response includes actual table names, column types, foreign key relationships, and index information. The model's suggestions go from "plausible" to "correct."

## The architecture

The server follows a clean separation of concerns:

```
+---------------------+     +-------------------+
|  VS Code + Copilot  |<--->|   MCP Protocol    |
+---------------------+     +---------+---------+
                                      |
                              +-------v---------+
                              |  Supabase MCP   |
                              |     Server      |
                              +-------+---------+
                                      |
                              +-------v---------+
                              |    Supabase     |
                              |    Database     |
                              +-----------------+
```

Three components do the work:

- **`supabase-client.js`** handles connection setup using `@supabase/supabase-js`. It takes a URL and scoped API key, creates a client with session persistence disabled (this is a server, not a browser), and validates that both values exist before proceeding.
- **`schema-provider.js`** queries Supabase for database metadata. The `getFullSchema()` method calls a stored procedure that returns table definitions, column types, and relationships. `getTableInfo(tableName)` drills into a specific table.
- **`query-handler.js`** validates and executes queries. It enforces an allowlist of query types — `SELECT` only by default — and rejects anything that does not match. This is a deliberate design constraint: an MCP server that can run arbitrary `DROP TABLE` commands against your production database is a liability, not a feature.

## Security as a first-class concern

Giving an AI assistant access to your database is a sentence that should make any security-minded engineer uncomfortable. The server's design reflects that discomfort:

**Scoped API keys.** The server authenticates to Supabase using a service-role key, but the recommendation is to create a dedicated key with read-only permissions scoped to the tables you want Copilot to see. Never use a root key.

**Query type validation.** Before any query executes, the handler normalizes and checks the query string against the configured allowlist. By default, only `SELECT` queries are permitted. You can expand this (carefully) through the `ALLOWED_QUERY_TYPES` environment variable.

```javascript
validateQuery(queryString) {
  const normalizedQuery = queryString.trim().toUpperCase();
  const isAllowed = this.allowedQueryTypes.some(
    type => normalizedQuery.startsWith(type)
  );
  if (!isAllowed) {
    throw new Error(
      'Query type not allowed. Allowed: ' + this.allowedQueryTypes.join(', ')
    );
  }
  return true;
}
```

**No credential storage in code.** All sensitive configuration flows through environment variables. The `.env.example` file documents what is needed; the actual values never touch version control.

**Configuration via VS Code settings.** The MCP server registers in VS Code's `settings.json`, where environment variables are passed directly to the process:

```json
{
  "mcp": {
    "servers": {
      "mcp-server-supabase": {
        "command": "node",
        "args": ["/path/to/mcp-server-supabase/src/index.js"],
        "env": {
          "SUPABASE_URL": "https://your-project.supabase.co",
          "SUPABASE_SERVICE_KEY": "your-scoped-key",
          "ALLOWED_QUERY_TYPES": "SELECT"
        }
      }
    }
  }
}
```

## Why MCP matters for agentic workflows

This project is not just about Supabase. It is about a pattern that is going to reshape how AI tools interact with the developer's environment.

Today, most AI coding assistants operate in a context vacuum — they see the open file, maybe the repository, and nothing else. MCP changes this by giving assistants a standardized way to reach into external systems: databases, APIs, deployment pipelines, monitoring dashboards. Each MCP server is a new "sense" that the assistant gains.

The compound effect is significant. An AI assistant that can see your schema, query your staging data, check your deployment status, and read your CI logs is qualitatively different from one that can only see your source code. It is the difference between a developer who just started at the company and one who has been there for six months and knows where everything lives.

The MCP ecosystem is still early — the protocol itself is evolving, and the tooling around it is young. But the direction is clear: the most capable AI development environments will be the ones with the richest MCP server ecosystem. Every tool, database, and service that your team uses should eventually have an MCP server in front of it.

## Building your own

If you want to build an MCP server for a different data source, the pattern is the same:

1. Create a Node.js project with `@modelcontextprotocol/server`
2. Implement handlers for the operations your tool supports
3. Apply strict security constraints (read-only by default, scoped credentials, query validation)
4. Register in VS Code's MCP settings
5. Test by asking Copilot questions that require your tool's context

The Supabase implementation is [on GitHub](https://github.com/Sentry01/Supabase-MCP-for-Copilot). The code is intentionally straightforward — the value is in the pattern, not the complexity.
