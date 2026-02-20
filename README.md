# Figma MCP Server

[![Third Strand Studio](https://img.shields.io/badge/Third%20Strand%20Studio-Visit%20Us-blue)](https://tss.topiray.com)


[![smithery badge](https://smithery.ai/badge/@thirdstrandstudio/mcp-figma)](https://smithery.ai/server/@thirdstrandstudio/mcp-figma)

MCP Server for interacting with the Figma API. This server provides a complete set of Figma API methods through the Model Context Protocol. Sometimes on large figma files you might have to tell it to use depth = 1 for figma_get_file then increase when it needs more.

![image](https://github.com/user-attachments/assets/aab5d665-4373-4e05-b328-f5202019d015)

<a href="https://glama.ai/mcp/servers/@thirdstrandstudio/mcp-figma">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@thirdstrandstudio/mcp-figma/badge" alt="mcp-figma MCP server" />
</a>

## Tools

This server implements all Figma API methods as MCP tools:

### User Methods
1. `figma_get_me` - Get the current user

### File Methods
2. `figma_get_file` - Get a Figma file by key
3. `figma_get_file_nodes` - Get specific nodes from a Figma file
4. `figma_get_images` - Render images from a Figma file
5. `figma_get_image_fills` - Get image fills in a Figma file
6. `figma_get_file_versions` - Get version history of a Figma file

### Comment Methods
7. `figma_get_comments` - Get comments in a Figma file
8. `figma_post_comment` - Add a comment to a Figma file
9. `figma_delete_comment` - Delete a comment from a Figma file
10. `figma_get_comment_reactions` - Get reactions for a comment
11. `figma_post_comment_reaction` - Add a reaction to a comment
12. `figma_delete_comment_reaction` - Delete a reaction from a comment

### Team and Project Methods
13. `figma_get_team_projects` - Get projects in a team
14. `figma_get_project_files` - Get files in a project

### Component Methods
15. `figma_get_team_components` - Get components in a team
16. `figma_get_file_components` - Get components in a file
17. `figma_get_component` - Get a component by key
18. `figma_get_team_component_sets` - Get component sets in a team
19. `figma_get_file_component_sets` - Get component sets in a file
20. `figma_get_component_set` - Get a component set by key

### Style Methods
21. `figma_get_team_styles` - Get styles in a team
22. `figma_get_file_styles` - Get styles in a file
23. `figma_get_style` - Get a style by key

### Webhook Methods (V2 API)
24. `figma_post_webhook` - Create a webhook
25. `figma_get_webhook` - Get a webhook by ID
26. `figma_update_webhook` - Update a webhook
27. `figma_delete_webhook` - Delete a webhook
28. `figma_get_team_webhooks` - Get webhooks for a team

### Library Analytics Methods
29. `figma_get_library_analytics_component_usages` - Get library analytics component usage data
30. `figma_get_library_analytics_style_usages` - Get library analytics style usage data
31. `figma_get_library_analytics_variable_usages` - Get library analytics variable usage data

## Installation

### Installing via Smithery

To install mcp-figma for Claude Desktop automatically via [Smithery](https://smithery.ai/embed/@thirdstrandstudio/mcp-figma):

```bash
npx @smithery/cli@latest install @thirdstrandstudio/mcp-figma --client claude
```

### Prerequisites
- Node.js (v16 or later)
- npm or yarn

### Installing the package

```bash
# Clone the repository
git clone https://github.com/thirdstrandstudio/mcp-figma.git
cd mcp-figma

# Install dependencies
npm install

# Build the package
npm run build
```

## Setup

To use this MCP server, you need to set up your Figma API token. You can do this in one of three ways:

### 1. Environment Variable

Create a `.env` file in the project root or set the environment variable directly:

```
FIGMA_API_KEY=your_figma_api_key
```

### 2. Command Line Arguments

When starting the server, you can pass your Figma API token as a command-line argument:

```bash
# Using the long form
node dist/index.js --figma-token YOUR_FIGMA_TOKEN

# Or using the short form
node dist/index.js -ft YOUR_FIGMA_TOKEN
```

### Usage with Claude Desktop

Add the following to your `claude_desktop_config.json`:

#### Using npx
```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["@thirdstrandstudio/mcp-figma", "--figma-token", "your_figma_api_key"]
    }
  }
}
```

#### Direct Node.js (with environment variable)
```json
{
  "mcpServers": {
    "figma": {
      "command": "node",
      "args": ["/path/to/mcp-figma/dist/index.js"],  
      "env": {
        "FIGMA_API_KEY": "your_figma_api_key"
      }
    }
  }
}
```

#### Direct Node.js (with command-line argument)
```json
{
  "mcpServers": {
    "figma": {
      "command": "node",
      "args": ["/path/to/mcp-figma/dist/index.js", "--figma-token", "your_figma_api_key"]
    }
  }
}
```

Replace `/path/to/mcp-figma` with the actual path to your repository.

## Examples

### Get a Figma File

```javascript
// Get a Figma file
const result = await callTool("figma_get_file", { 
  fileKey: "abcXYZ123"
});
```

### Get Comments from a File

```javascript
// Get comments from a file
const comments = await callTool("figma_get_comments", { 
  fileKey: "abcXYZ123",
  as_md: true 
});
```

### Create a Webhook

```javascript
// Create a webhook
const webhook = await callTool("figma_post_webhook", {
  event_type: "FILE_UPDATE",
  team_id: "12345",
  endpoint: "https://example.com/webhook",
  passcode: "your_passcode_here",
  description: "File update webhook"
});
```

## Development

```bash
# Install dependencies
npm install

# Start the server in development mode
npm start

# Build the server
npm run build

# Run with a Figma API token
npm start -- --figma-token YOUR_FIGMA_TOKEN
```

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the LICENSE file in the project repository.