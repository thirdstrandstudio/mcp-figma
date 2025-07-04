import PQueue from 'p-queue';
import axiosRetry from 'axios-retry';
import axios from 'axios';

export interface BatchOperation<T> {
  id: string;
  operation: () => Promise<T>;
  priority?: number;
}

export interface BatchResult<T> {
  id: string;
  success: boolean;
  result?: T;
  error?: Error;
}

export class BatchManager {
  private queue: PQueue;
  
  constructor(maxConcurrent: number = 5, retryAttempts: number = 3) {
    this.queue = new PQueue({ 
      concurrency: maxConcurrent,
      interval: 1000, // 1 second
      intervalCap: 10, // Max 10 operations per second (Figma rate limit)
    });

    // Configure axios retry
    axiosRetry(axios, {
      retries: retryAttempts,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
               error.response?.status === 429; // Rate limit
      },
    });
  }

  async execute<T>(operations: BatchOperation<T>[]): Promise<BatchResult<T>[]> {
    const results: BatchResult<T>[] = [];
    
    const promises = operations.map((op) =>
      this.queue.add(
        async () => {
          try {
            const result = await op.operation();
            results.push({
              id: op.id,
              success: true,
              result,
            });
          } catch (error) {
            results.push({
              id: op.id,
              success: false,
              error: error as Error,
            });
          }
        },
        { priority: op.priority || 0 }
      )
    );

    await Promise.all(promises);
    return results;
  }

  async executeWithProgress<T>(
    operations: BatchOperation<T>[],
    onProgress?: (completed: number, total: number) => void
  ): Promise<BatchResult<T>[]> {
    const results: BatchResult<T>[] = [];
    let completed = 0;
    
    const promises = operations.map((op) =>
      this.queue.add(
        async () => {
          try {
            const result = await op.operation();
            results.push({
              id: op.id,
              success: true,
              result,
            });
          } catch (error) {
            results.push({
              id: op.id,
              success: false,
              error: error as Error,
            });
          } finally {
            completed++;
            onProgress?.(completed, operations.length);
          }
        },
        { priority: op.priority || 0 }
      )
    );

    await Promise.all(promises);
    return results;
  }

  // Batch update multiple nodes
  async batchUpdateNodes(
    fileKey: string,
    updates: Array<{ nodeId: string; properties: any }>
  ): Promise<BatchResult<any>[]> {
    const operations: BatchOperation<any>[] = updates.map((update) => ({
      id: update.nodeId,
      operation: async () => {
        // This would call the Figma API
        // For now, it's a placeholder
        console.log(`Updating node ${update.nodeId} with`, update.properties);
        return { success: true };
      },
    }));

    return this.execute(operations);
  }

  // Get queue statistics
  getStats() {
    return {
      size: this.queue.size,
      pending: this.queue.pending,
      isPaused: this.queue.isPaused,
    };
  }

  pause() {
    this.queue.pause();
  }

  resume() {
    this.queue.start();
  }

  clear() {
    this.queue.clear();
  }
}

// Singleton instance
let batchInstance: BatchManager | null = null;

export function getBatchManager(
  maxConcurrent?: number,
  retryAttempts?: number
): BatchManager {
  if (!batchInstance) {
    batchInstance = new BatchManager(maxConcurrent, retryAttempts);
  }
  return batchInstance;
}
