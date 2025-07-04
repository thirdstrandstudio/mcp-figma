export interface DesignAnalysis {
  accessibility: AccessibilityIssue[];
  consistency: ConsistencyIssue[];
  performance: PerformanceIssue[];
  suggestions: Suggestion[];
  score: {
    accessibility: number;
    consistency: number;
    performance: number;
    overall: number;
  };
}

export interface AccessibilityIssue {
  nodeId: string;
  nodeName: string;
  issue: string;
  severity: 'error' | 'warning' | 'info';
  wcagLevel: string;
  fix?: string;
}

export interface ConsistencyIssue {
  nodeId: string;
  nodeName: string;
  issue: string;
  type: 'spacing' | 'color' | 'typography' | 'size';
  expected?: any;
  actual?: any;
}

export interface PerformanceIssue {
  nodeId: string;
  nodeName: string;
  issue: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
}

export interface Suggestion {
  category: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export class DesignAnalyzer {
  // Analyze color contrast for accessibility
  private analyzeColorContrast(
    foreground: { r: number; g: number; b: number },
    background: { r: number; g: number; b: number }
  ): number {
    // Calculate relative luminance
    const getLuminance = (color: { r: number; g: number; b: number }) => {
      const [r, g, b] = [color.r, color.g, color.b].map((c) => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const l1 = getLuminance(foreground);
    const l2 = getLuminance(background);
    const contrast = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    
    return contrast;
  }

  async analyzeDesign(fileData: any): Promise<DesignAnalysis> {
    const issues = {
      accessibility: [] as AccessibilityIssue[],
      consistency: [] as ConsistencyIssue[],
      performance: [] as PerformanceIssue[],
    };

    const suggestions: Suggestion[] = [];
    
    // Traverse the node tree
    const analyzeNode = (node: any, depth: number = 0) => {
      // Accessibility checks
      if (node.type === 'TEXT') {
        const fontSize = node.style?.fontSize || 12;
        if (fontSize < 12) {
          issues.accessibility.push({
            nodeId: node.id,
            nodeName: node.name,
            issue: `Text size ${fontSize}px is below minimum recommended 12px`,
            severity: 'warning',
            wcagLevel: 'AA',
            fix: 'Increase font size to at least 12px',
          });
        }

        // Check color contrast if we have fill information
        if (node.fills?.[0]?.color && node.parent?.fills?.[0]?.color) {
          const contrast = this.analyzeColorContrast(
            node.fills[0].color,
            node.parent.fills[0].color
          );
          
          if (contrast < 4.5) {
            issues.accessibility.push({
              nodeId: node.id,
              nodeName: node.name,
              issue: `Insufficient color contrast (${contrast.toFixed(2)}:1)`,
              severity: 'error',
              wcagLevel: 'AA',
              fix: 'Increase contrast to at least 4.5:1 for normal text',
            });
          }
        }
      }

      // Check interactive element sizes
      if (['BUTTON', 'INPUT'].includes(node.type) || node.name?.toLowerCase().includes('button')) {
        const minSize = 44; // WCAG minimum touch target
        if (node.absoluteBoundingBox) {
          const { width, height } = node.absoluteBoundingBox;
          if (width < minSize || height < minSize) {
            issues.accessibility.push({
              nodeId: node.id,
              nodeName: node.name,
              issue: `Interactive element too small (${width}x${height}px)`,
              severity: 'error',
              wcagLevel: 'AA',
              fix: `Increase size to at least ${minSize}x${minSize}px`,
            });
          }
        }
      }

      // Performance checks
      if (depth > 10) {
        issues.performance.push({
          nodeId: node.id,
          nodeName: node.name,
          issue: 'Deeply nested component (>10 levels)',
          impact: 'medium',
          recommendation: 'Consider flattening the component hierarchy',
        });
      }

      // Check for excessive effects
      if (node.effects && node.effects.length > 3) {
        issues.performance.push({
          nodeId: node.id,
          nodeName: node.name,
          issue: `Too many effects (${node.effects.length})`,
          impact: 'high',
          recommendation: 'Reduce number of effects for better performance',
        });
      }

      // Recursive analysis
      if (node.children) {
        node.children.forEach((child: any) => analyzeNode(child, depth + 1));
      }
    };

    // Start analysis from document root
    if (fileData.document) {
      analyzeNode(fileData.document);
    }

    // Calculate scores
    const scores = {
      accessibility: Math.max(0, 100 - issues.accessibility.length * 10),
      consistency: Math.max(0, 100 - issues.consistency.length * 5),
      performance: Math.max(0, 100 - issues.performance.length * 15),
      overall: 0,
    };
    
    scores.overall = Math.round(
      (scores.accessibility + scores.consistency + scores.performance) / 3
    );

    // Generate suggestions
    if (issues.accessibility.length > 0) {
      suggestions.push({
        category: 'accessibility',
        description: 'Run an accessibility audit and fix contrast issues',
        priority: 'high',
      });
    }

    if (issues.performance.length > 0) {
      suggestions.push({
        category: 'performance',
        description: 'Optimize component hierarchy and reduce effects',
        priority: 'medium',
      });
    }

    return {
      accessibility: issues.accessibility,
      consistency: issues.consistency,
      performance: issues.performance,
      suggestions,
      score: scores,
    };
  }

  // Find duplicate components
  async findDuplicates(fileData: any): Promise<Array<{
    original: string;
    duplicates: string[];
    similarity: number;
  }>> {
    const components: Map<string, any[]> = new Map();
    const duplicates: Array<{
      original: string;
      duplicates: string[];
      similarity: number;
    }> = [];

    const collectComponents = (node: any) => {
      if (node.type === 'COMPONENT' || node.type === 'INSTANCE') {
        const key = `${node.type}_${node.name}`;
        if (!components.has(key)) {
          components.set(key, []);
        }
        components.get(key)!.push(node);
      }

      if (node.children) {
        node.children.forEach(collectComponents);
      }
    };

    if (fileData.document) {
      collectComponents(fileData.document);
    }

    // Find duplicates
    components.forEach((nodes, key) => {
      if (nodes.length > 1) {
        duplicates.push({
          original: nodes[0].id,
          duplicates: nodes.slice(1).map(n => n.id),
          similarity: 1.0, // Exact name match
        });
      }
    });

    return duplicates;
  }

  // Find unused components
  async findUnusedComponents(fileData: any): Promise<string[]> {
    const components: Set<string> = new Set();
    const usedComponents: Set<string> = new Set();
    const unused: string[] = [];

    const collectUsage = (node: any) => {
      if (node.type === 'COMPONENT') {
        components.add(node.id);
      } else if (node.type === 'INSTANCE' && node.componentId) {
        usedComponents.add(node.componentId);
      }

      if (node.children) {
        node.children.forEach(collectUsage);
      }
    };

    if (fileData.document) {
      collectUsage(fileData.document);
    }

    components.forEach((id) => {
      if (!usedComponents.has(id)) {
        unused.push(id);
      }
    });

    return unused;
  }
}

// Singleton instance
let analyzerInstance: DesignAnalyzer | null = null;

export function getDesignAnalyzer(): DesignAnalyzer {
  if (!analyzerInstance) {
    analyzerInstance = new DesignAnalyzer();
  }
  return analyzerInstance;
}
