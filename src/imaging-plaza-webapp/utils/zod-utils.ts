import {validate} from '@coteries/utils'
import {ZodArray, ZodObjectDef, ZodOptional, ZodUnion} from 'zod'

export const isZodArray = validate<ZodArray<any>>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodArray'
)

export const isZodUnion = validate<ZodUnion<any>>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodUnion'
)

export const isZodOptional = validate<ZodOptional<any>>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodOptional'
)

export const isZodEnum = validate<ZodUnion<any>>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodNativeEnum'
)

export const isZodObject = validate<ZodObjectDef>(
  o => typeof o === 'object' && o._def?.typeName === 'ZodObject'
)
