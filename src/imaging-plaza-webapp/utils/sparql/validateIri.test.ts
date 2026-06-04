import { describe, it, expect } from 'vitest'
import { validateIri } from './validateIri'

describe('validateIri', () => {
  describe('accepts valid IRIs', () => {
    const valid = [
      'https://imaging-plaza.epfl.ch/finalGraph',
      'https://github.com/qchapp/lungs-segmentation',
      'https://example.com/path/to/resource?query=1&other=2',
      'https://example.com/path#fragment',
      'http://localhost:8080/path',
      'urn:isbn:0451450523',
      'https://example.com/with%20encoded%20spaces',
    ]

    it.each(valid)('returns %s unchanged', iri => {
      expect(validateIri('uri', iri)).toBe(iri)
    })
  })

  describe('rejects IRIs with characters forbidden by SPARQL IRIREF', () => {
    const cases: Array<[string, string]> = [
      ['less-than', 'https://example.com/<bad'],
      ['greater-than', 'https://example.com/bad>'],
      ['double-quote', 'https://example.com/with"quote'],
      ['open-brace', 'https://example.com/{injected}'],
      ['close-brace', 'https://example.com/path}'],
      ['pipe', 'https://example.com/a|b'],
      ['caret', 'https://example.com/a^b'],
      ['backtick', 'https://example.com/a`b'],
      ['backslash', 'https://example.com/a\\b'],
      ['space', 'https://example.com/has space'],
      ['tab', 'https://example.com/has\ttab'],
      ['newline', 'https://example.com/has\nnewline'],
      ['carriage-return', 'https://example.com/has\rcr'],
    ]

    it.each(cases)('rejects IRI with %s', (_label, iri) => {
      expect(() => validateIri('uri', iri)).toThrow()
    })
  })

  describe('rejects empty and non-string inputs', () => {
    it('rejects empty string', () => {
      expect(() => validateIri('uri', '')).toThrow()
    })

    it('rejects undefined cast to string', () => {
      expect(() => validateIri('uri', undefined as unknown as string)).toThrow()
    })

    it('rejects null cast to string', () => {
      expect(() => validateIri('uri', null as unknown as string)).toThrow()
    })
  })

  describe('classic SPARQL injection attempts', () => {
    it('blocks breakout-then-inject via >', () => {
      const malicious =
        'https://example.com/x> } } } INSERT DATA { <http://evil> <http://evil> <http://evil>'
      expect(() => validateIri('uri', malicious)).toThrow()
    })

    it('blocks closing the GRAPH block with }', () => {
      const malicious = 'https://example.com/x}}; DROP GRAPH <http://target>'
      expect(() => validateIri('uri', malicious)).toThrow()
    })
  })
})
