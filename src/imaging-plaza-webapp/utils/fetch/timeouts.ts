// Default timeout for outbound calls to the imaging-plaza microservices
// (GraphDB, fair-level-indicator, gimie, search). Long enough for slow
// SPARQL queries; short enough that a hung upstream doesn't pin a Next.js
// API worker forever.
export const DEFAULT_FETCH_TIMEOUT_MS = 30_000

// Index rebuild is heavier than a normal query — GraphDB walks the whole
// repository to recompute the autocomplete trie.
export const INDEX_REBUILD_TIMEOUT_MS = 60_000

export const fetchTimeout = (ms: number = DEFAULT_FETCH_TIMEOUT_MS) =>
  AbortSignal.timeout(ms)
