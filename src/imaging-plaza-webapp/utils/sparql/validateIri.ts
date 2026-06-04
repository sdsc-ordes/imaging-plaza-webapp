import { IllegalArgumentError } from '@/errors/IllegalArgumentError'

// SPARQL 1.1 IRIREF grammar forbids these characters inside <...>:
// '<', '>', '"', '{', '}', '|', '^', '`', '\\', and any code point <= 0x20.
// Any of them in an interpolated IRI would either break the query syntax
// or allow injecting additional SPARQL.
const FORBIDDEN_IRIREF_CHARS = /[\x00-\x20<>"{}|^`\\]/

export function validateIri(name: string, iri: string): string {
  if (typeof iri !== 'string' || iri.length === 0 || FORBIDDEN_IRIREF_CHARS.test(iri)) {
    throw new IllegalArgumentError(name, iri)
  }
  return iri
}
