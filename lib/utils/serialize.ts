


export function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}


export function serializeArray<T>(docs: T[]): T[] {
  return JSON.parse(JSON.stringify(docs)) as T[];
}
