import OpenAI from 'openai';
import { z } from 'zod';

// Schema for design generation
const DesignSpecSchema = z.object({
  type: z.enum(['frame', 'component', 'text', 'button', 'input', 'card', 'layout']),
  name: z.string(),
  properties: z.object({
    width: z.number().optional(),
    height: z.number().optional(),
    x: z.number().optional(),
    y: z.number().optional(),
    fills: z.array(z.any()).optional(),
    strokes: z.array(z.any()).optional(),
    effects: z.array(z.any()).optional(),
    layoutMode: z.enum(['NONE', 'HORIZONTAL', 'VERTICAL']).optional(),
    padding: z.number().optional(),
    spacing: z.number().optional(),
  }),
  children: z.array(z.lazy(() => DesignSpecSchema)).optional(),
});

type DesignSpec = z.infer<typeof DesignSpecSchema>;

export class AIDesignGenerator {
  private openai: OpenAI | null = null;
  
  constructor(apiKey?: string) {
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async generateFromDescription(
    description: string,
    context?: {
      style?: string;
      colorScheme?: string;
      framework?: string;
    }
  ): Promise<DesignSpec> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are a Figma design expert. Generate a detailed design specification based on the user's description.
Return a JSON object that represents the Figma node structure with the following schema:
- type: The type of node (frame, component, text, button, input, card, layout)
- name: A descriptive name for the node
- properties: Visual properties like width, height, position, fills, etc.
- children: Array of child nodes

Consider these guidelines:
- Use modern design principles
- Ensure proper spacing and alignment
- Include appropriate colors and effects
- Structure components hierarchically
${context?.style ? `- Follow ${context.style} design style` : ''}
${context?.colorScheme ? `- Use ${context.colorScheme} color scheme` : ''}
${context?.framework ? `- Optimize for ${context.framework} framework` : ''}`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: description },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No design generated');
    }

    const designSpec = JSON.parse(content);
    return DesignSpecSchema.parse(designSpec);
  }

  async improveDesign(
    currentDesign: any,
    aspect: 'accessibility' | 'consistency' | 'performance' | 'aesthetics'
  ): Promise<{ suggestions: string[]; improvedDesign: any }> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    const aspectPrompts = {
      accessibility: 'Analyze for WCAG compliance, color contrast, text readability, and interactive element sizes.',
      consistency: 'Check for consistent spacing, typography, colors, and component usage.',
      performance: 'Optimize for rendering performance, reduce complexity, and improve load times.',
      aesthetics: 'Enhance visual appeal, modernize the design, and improve visual hierarchy.',
    };

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a Figma design expert focusing on ${aspect}. ${aspectPrompts[aspect]}
Analyze the provided design and return:
1. A list of specific suggestions for improvement
2. An improved version of the design specification`,
        },
        {
          role: 'user',
          content: JSON.stringify(currentDesign),
        },
      ],
      temperature: 0.5,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No improvements generated');
    }

    return JSON.parse(content);
  }

  async generateVariations(
    baseDesign: any,
    count: number = 3,
    variationType: 'color' | 'layout' | 'style' | 'all' = 'all'
  ): Promise<DesignSpec[]> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `Generate ${count} variations of the provided design focusing on ${variationType} changes.
Return an array of design specifications, each representing a unique variation.`,
        },
        {
          role: 'user',
          content: JSON.stringify(baseDesign),
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No variations generated');
    }

    const result = JSON.parse(content);
    return result.variations || [];
  }

  async generateComponentFromCode(
    code: string,
    framework: 'react' | 'vue' | 'angular' | 'html'
  ): Promise<DesignSpec> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `Convert the provided ${framework} code into a Figma design specification.
Analyze the component structure, styling, and layout to create an accurate Figma representation.`,
        },
        {
          role: 'user',
          content: code,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No design generated from code');
    }

    const designSpec = JSON.parse(content);
    return DesignSpecSchema.parse(designSpec);
  }

  // Generate content for designs
  async generateContent(
    contentType: 'text' | 'data' | 'images',
    context: string,
    count: number = 5
  ): Promise<any[]> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    const prompts = {
      text: `Generate ${count} realistic text content items for: ${context}`,
      data: `Generate ${count} realistic data entries for: ${context}. Return as JSON array.`,
      images: `Generate ${count} image descriptions and suggested Unsplash queries for: ${context}`,
    };

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: prompts[contentType],
        },
        {
          role: 'user',
          content: context,
        },
      ],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content generated');
    }

    return JSON.parse(content);
  }
}

// Singleton instance
let aiInstance: AIDesignGenerator | null = null;

export function getAIDesignGenerator(apiKey?: string): AIDesignGenerator {
  if (!aiInstance) {
    aiInstance = new AIDesignGenerator(apiKey);
  }
  return aiInstance;
}
