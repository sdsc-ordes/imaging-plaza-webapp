import {z} from 'zod'

export const LeafTriplet = z.object({
  '@value': z.string().optional(),
  '@id': z.string().optional(),
})

export type LeafTriplet = z.infer<typeof LeafTriplet>

export const RootTriplet = z
  .object({
    '@id': z.string(),
    '@type': z.string().array().optional(),
  })
  .catchall(LeafTriplet.array())

export type RootTriplet = z.infer<typeof RootTriplet>

// export const NestedTriplet = z
//   .object({
//     '@id': z.string(),
//     '@type': z.string().array().optional(),
//   })
//   .catchall(LeafTriplet.array())

//   export type NestedTriplet = z.infer<typeof NestedTriplet>
