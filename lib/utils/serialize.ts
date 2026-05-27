/**
 * lib/utils/serialize.ts
 *
 * Converts Mongoose lean() documents into plain JSON-serializable objects
 * safe to pass from Next.js Server Components to Client Components.
 *
 * Why this is needed
 * ──────────────────
 * Even with `.lean()`, Mongoose returns:
 *  • `_id`        → BSON ObjectId  (has a `buffer` property — not plain)
 *  • `createdAt`  → native Date    (not JSON-serializable as-is in RSC)
 *  • `updatedAt`  → native Date
 *
 * Next.js serializes RSC props via structured clone, which rejects objects
 * that have custom `toJSON` methods (ObjectId) or are Date instances.
 *
 * This utility runs `JSON.parse(JSON.stringify(value))` which:
 *  • Calls `.toJSON()` / `.toString()` on ObjectId  → plain string
 *  • Calls `.toISOString()` on Date               → plain string
 *  • Strips undefined values
 *  • Leaves strings, numbers, booleans, arrays, plain objects intact
 */

/**
 * Serialize a single Mongoose lean document (or any value) into a
 * plain, JSON-safe object.
 */
export function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}

/**
 * Serialize an array of Mongoose lean documents.
 */
export function serializeArray<T>(docs: T[]): T[] {
  return JSON.parse(JSON.stringify(docs)) as T[];
}
