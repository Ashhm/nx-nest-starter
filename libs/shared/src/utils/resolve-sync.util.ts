type MapperFunction<T, R> = (item: T) => Promise<R>;

export async function resolveSync<T, R>(
  items: T[],
  mapper: MapperFunction<T, R>,
  options: {
    concurrency: number;
    delay?: number;
    onChunkCompleted?: (chunk: T[], results: Array<Awaited<ReturnType<MapperFunction<T, R>>>>) => void;
  } = { concurrency: 1 },
): Promise<Array<Awaited<ReturnType<MapperFunction<T, R>>>>> {
  const results: Array<Awaited<ReturnType<MapperFunction<T, R>>>> = [];

  // Helper function to process items sequentially within each chunk
  async function processItemsSequentially(chunk: T[]): Promise<void> {
    for (const item of chunk) {
      const result = await mapper(item);
      results.push(result);
    }
  }

  const { concurrency } = options;
  const totalItems = items.length;
  const batchSize = Math.ceil(totalItems / concurrency);

  for (let i = 0; i < totalItems; i += batchSize) {
    const chunk = items.slice(i, i + batchSize);
    await processItemsSequentially(chunk);
    if (options.delay != null) {
      await new Promise((resolve) => setTimeout(resolve, options.delay));
    }
    if (options.onChunkCompleted != null) {
      await options.onChunkCompleted(chunk, results);
    }
  }

  return results;
}
