import { z } from 'zod';
import { convertZodToJsonSchema } from '../utils/schema-utils.js';

// Enhanced tool schemas
export const GenerateDesignFromDescriptionSchema = z.object({
  description: z.string().describe("Natural language description of the design to generate"),
  style: z.string().optional().describe("Design style (e.g., material, flat, neumorphic)"),
  colorScheme: z.string().optional().describe("Color scheme (e.g., dark, light, blue)"),
  framework: z.string().optional().describe("Target framework (e.g., react, vue, flutter)")
});

export const AnalyzeDesignSchema = z.object({
  fileKey: z.string().describe("The file key to analyze"),
  aspects: z.array(z.enum(['accessibility', 'consistency', 'performance', 'all']))
    .optional()
    .describe("Aspects to analyze")
});

export const BatchUpdateNodesSchema = z.object({
  fileKey: z.string().describe("The file key containing the nodes"),
  updates: z.array(z.object({
    nodeId: z.string().describe("Node ID to update"),
    properties: z.any().describe("Properties to update")
  })).describe("Array of node updates")
});

export const GenerateComponentVariationsSchema = z.object({
  fileKey: z.string().describe("The file key containing the component"),
  componentKey: z.string().describe("The component key to generate variations for"),
  count: z.number().min(1).max(10).default(3).describe("Number of variations to generate"),
  variationType: z.enum(['color', 'layout', 'style', 'all']).default('all')
    .describe("Type of variations to generate")
});

export const OptimizeImagesSchema = z.object({
  fileKey: z.string().describe("The file key containing images to optimize"),
  format: z.enum(['webp', 'avif', 'jpg', 'png']).default('webp')
    .describe("Target image format"),
  maxSize: z.number().optional().describe("Maximum file size in bytes"),
  quality: z.number().min(0.1).max(1).default(0.9).describe("Image quality (0.1-1)")
});

export const SyncDesignSystemSchema = z.object({
  sourceFileKey: z.string().describe("Source design system file key"),
  targetFileKeys: z.array(z.string()).describe("Target file keys to sync to"),
  components: z.boolean().default(true).describe("Sync components"),
  styles: z.boolean().default(true).describe("Sync styles"),
  variables: z.boolean().default(true).describe("Sync variables")
});

export const FindDuplicatesSchema = z.object({
  fileKey: z.string().describe("The file key to search for duplicates"),
  type: z.enum(['components', 'styles', 'all']).default('all')
    .describe("Type of duplicates to find")
});

export const GenerateContentSchema = z.object({
  fileKey: z.string().describe("The file key to populate with content"),
  nodeIds: z.array(z.string()).describe("Node IDs to populate"),
  contentType: z.enum(['text', 'data', 'images']).describe("Type of content to generate"),
  context: z.string().describe("Context for content generation (e.g., 'e-commerce product cards')")
});

export const CreateUserFlowSchema = z.object({
  fileKey: z.string().describe("The file key to create the flow in"),
  screens: z.array(z.string()).describe("Screen names or frame IDs to connect"),
  transitions: z.enum(['instant', 'dissolve', 'smart-animate', 'move-in', 'push'])
    .default('smart-animate').describe("Transition type between screens"),
  generateMobileVersion: z.boolean().default(false)
    .describe("Also generate mobile responsive version")
});

export const ImportComponentFromCodeSchema = z.object({
  code: z.string().describe("Component code to import"),
  framework: z.enum(['react', 'vue', 'angular', 'html']).describe("Source framework"),
  targetFileKey: z.string().describe("Target file to import into"),
  targetPageId: z.string().optional().describe("Target page ID (optional)")
});

// Export all enhanced tools configuration
export const enhancedTools = [
  {
    name: "figma_generate_design_from_description",
    description: "Generate a complete Figma design from natural language description using AI",
    inputSchema: convertZodToJsonSchema(GenerateDesignFromDescriptionSchema),
  },
  {
    name: "figma_analyze_design",
    description: "Analyze a Figma design for accessibility, consistency, and performance issues",
    inputSchema: convertZodToJsonSchema(AnalyzeDesignSchema),
  },
  {
    name: "figma_batch_update_nodes",
    description: "Update multiple nodes in a batch operation with rate limiting",
    inputSchema: convertZodToJsonSchema(BatchUpdateNodesSchema),
  },
  {
    name: "figma_generate_component_variations",
    description: "Generate multiple variations of a component with AI assistance",
    inputSchema: convertZodToJsonSchema(GenerateComponentVariationsSchema),
  },
  {
    name: "figma_optimize_images",
    description: "Optimize all images in a file for better performance",
    inputSchema: convertZodToJsonSchema(OptimizeImagesSchema),
  },
  {
    name: "figma_sync_design_system",
    description: "Sync design system components, styles, and variables across files",
    inputSchema: convertZodToJsonSchema(SyncDesignSystemSchema),
  },
  {
    name: "figma_find_duplicates",
    description: "Find duplicate components, styles, or assets in a file",
    inputSchema: convertZodToJsonSchema(FindDuplicatesSchema),
  },
  {
    name: "figma_generate_content",
    description: "Generate realistic content (text, data, images) for designs using AI",
    inputSchema: convertZodToJsonSchema(GenerateContentSchema),
  },
  {
    name: "figma_create_user_flow",
    description: "Create interactive user flows with prototyping connections",
    inputSchema: convertZodToJsonSchema(CreateUserFlowSchema),
  },
  {
    name: "figma_import_component_from_code",
    description: "Import a component from code (React, Vue, etc.) into Figma",
    inputSchema: convertZodToJsonSchema(ImportComponentFromCodeSchema),
  },
];
