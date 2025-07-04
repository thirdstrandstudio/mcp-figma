# Enhanced Figma MCP Server 🚀

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/coladapo/mcp-figma)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![MCP](https://img.shields.io/badge/MCP-Compatible-purple.svg)](https://modelcontextprotocol.io)

The most powerful Figma MCP implementation available - featuring AI-powered design generation, full CRUD operations, intelligent automation, and 40+ tools that transform how you work with Figma.

## 🌟 Why This MCP?

While Figma's official Dev Mode MCP offers only 4 read-only tools, our Enhanced Figma MCP provides:

- **40+ Advanced Tools** - Complete Figma API coverage plus AI-powered enhancements
- **Full CRUD Operations** - Create, read, update, and delete anything in Figma
- **AI Design Generation** - Generate complete designs from natural language
- **Intelligent Caching** - 5x faster operations with smart caching
- **Batch Operations** - Update hundreds of nodes efficiently with rate limiting
- **Design Analysis** - Automated accessibility, consistency, and performance checks
- **Cross-Platform** - Works everywhere, not just desktop

## 🎯 Key Features

### 🤖 AI-Powered Design
- **Natural Language → Figma**: "Create a modern login form with social auth"
- **Design Improvements**: AI suggestions for accessibility and aesthetics
- **Component Variations**: Generate multiple design options automatically
- **Content Generation**: Realistic text, data, and image suggestions

### ⚡ Performance & Efficiency
- **Smart Caching**: LRU cache reduces API calls by up to 80%
- **Batch Operations**: Update multiple nodes with automatic rate limiting
- **Parallel Processing**: Handle complex operations concurrently
- **Error Recovery**: Automatic retries with exponential backoff

### 🔍 Analysis & Optimization
- **Accessibility Audit**: WCAG compliance checking with auto-fixes
- **Consistency Analysis**: Find spacing, color, and typography issues
- **Performance Metrics**: Identify render-heavy designs
- **Duplicate Detection**: Find and merge duplicate components

### 🔄 Advanced Automation
- **Design System Sync**: Keep multiple files in sync automatically
- **Code ↔ Figma Sync**: Bidirectional component synchronization
- **User Flow Generation**: Create complete prototypes programmatically
- **Image Optimization**: Bulk optimize all images in your designs

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/coladapo/mcp-figma.git
cd mcp-figma

# Install dependencies
npm install

# Build the project
npm run build
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file:

```env
FIGMA_API_KEY=your_figma_api_key
OPENAI_API_KEY=your_openai_key  # Optional: For AI features
```

### Claude Desktop Configuration
Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "figma-enhanced": {
      "command": "node",
      "args": ["/path/to/mcp-figma/dist/index.js"],
      "env": {
        "FIGMA_API_KEY": "your_figma_api_key",
        "OPENAI_API_KEY": "your_openai_key"
      }
    }
  }
}
```

## 🛠️ Available Tools

### Core Figma Operations (31 tools)
All standard Figma API operations including:
- File management
- Component operations  
- Style management
- Comments & reactions
- Webhooks
- Team management
- Analytics

### Enhanced AI Tools (10+ new tools)

#### 🎨 `figma_generate_design_from_description`
Generate complete designs from natural language:
```
Input: "Create a pricing table with 3 tiers, modern style, dark theme"
Output: Complete Figma component with proper structure
```

#### 🔍 `figma_analyze_design`
Comprehensive design analysis:
```
Input: { fileKey: "abc123", aspects: ["accessibility", "performance"] }
Output: Detailed report with issues and fixes
```

#### 🔄 `figma_batch_update_nodes`
Update multiple nodes efficiently:
```
Input: { 
  fileKey: "abc123",
  updates: [
    { nodeId: "1:1", properties: { fills: [...] } },
    { nodeId: "1:2", properties: { opacity: 0.8 } }
  ]
}
```

#### 🎯 `figma_generate_component_variations`
Create design variations:
```
Input: { componentKey: "xyz", count: 5, variationType: "color" }
Output: 5 color variations of your component
```

#### 🖼️ `figma_optimize_images`
Bulk image optimization:
```
Input: { fileKey: "abc123", format: "webp", quality: 0.85 }
Output: All images optimized for web
```

## 💡 Usage Examples

### Generate a Complete UI from Description
```javascript
const result = await mcp.call('figma_generate_design_from_description', {
  description: "Create a modern dashboard with sidebar navigation, charts section, and user profile area",
  style: "material-design",
  colorScheme: "dark",
  framework: "react"
});
```

### Analyze and Fix Accessibility Issues
```javascript
const analysis = await mcp.call('figma_analyze_design', {
  fileKey: 'your-file-key',
  aspects: ['accessibility']
});

// Auto-fix issues
for (const issue of analysis.accessibility) {
  if (issue.fix) {
    await mcp.call('figma_batch_update_nodes', {
      fileKey: 'your-file-key',
      updates: [{ nodeId: issue.nodeId, properties: issue.fix }]
    });
  }
}
```

### Sync Design System Across Files
```javascript
await mcp.call('figma_sync_design_system', {
  sourceFileKey: 'design-system-key',
  targetFileKeys: ['app-file-1', 'app-file-2'],
  components: true,
  styles: true,
  variables: true
});
```

## 🏗️ Architecture

```
Enhanced Figma MCP
├── Core Services
│   ├── Cache Manager (LRU Cache)
│   ├── Batch Manager (Rate Limiting)
│   ├── AI Design Generator
│   └── Design Analyzer
├── Tool Implementations
│   ├── Standard Figma API (31 tools)
│   └── Enhanced Tools (10+ tools)
└── Integrations
    ├── Figma REST API
    ├── OpenAI API (optional)
    └── Future: Figma Plugin Bridge
```

## 🚀 Roadmap

- [ ] Figma Plugin Bridge for advanced operations
- [ ] Real-time collaboration features
- [ ] Git integration for version control
- [ ] Advanced prototyping automation
- [ ] Custom design token management
- [ ] Multi-language code generation
- [ ] Team workflow automation

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built on top of [thirdstrandstudio/mcp-figma](https://github.com/thirdstrandstudio/mcp-figma)
- Powered by [Model Context Protocol](https://modelcontextprotocol.io)
- Enhanced with OpenAI's GPT-4 for AI features

---

**Note**: This is not affiliated with Figma Inc. This is a community project that enhances the Figma experience through the Model Context Protocol.
