import {createContext, PropsWithChildren, useContext} from 'react'
import {useFormContext} from 'react-hook-form'
import {ZodOptionalDef, ZodType, ZodTypeAny} from 'zod'
import {isZodArray, isZodObject, isZodUnion} from '../../utils/zod-utils'

export type AutoformFieldContext = {
  hierarchy: ZodType<any>[]
  field: ZodType<any>
  isOptional: boolean
  path: string
  textKey: string
}

const AutoformFieldContext = createContext<AutoformFieldContext>({
  hierarchy: [],
  field: {} as unknown as ZodType,
  isOptional: false,
  path: '',
  textKey: '',
})

export const useAutoformField = () => {
  const ctx = useContext(AutoformFieldContext)
  const methods = useFormContext()
  const [parent] = ctx.hierarchy
  const isInArray = !!parent && isZodArray(parent)
  const isInUnion = !!parent && isZodUnion(parent)
  const isInObject = !!parent && isZodObject(parent)

  return {...ctx, ...methods, parent, isInArray, isInUnion, isInObject}
}

const AutoformFieldProvider = ({
  field,
  name,
  children,
  reset = false,
}: PropsWithChildren<{field: ZodTypeAny; name?: string; reset?: boolean}>) => {
  const requiredField = field.isOptional() ? (field._def as ZodOptionalDef).innerType : field
  const parentParams = useAutoformField()
  const {hierarchy, path} = reset ? {hierarchy: [], path: ''} : parentParams

  const newPath = name ? path + (path !== '' ? '.' : '') + name : path
  const newTextKey = `${/[^:]*$/.exec(name!)![0]}`

  // console.log("AutoformFieldProvider.tsx | AutoFormFieldProvider", name, field, children)

  return (
    <AutoformFieldContext.Provider
      value={{
        hierarchy: [requiredField, ...hierarchy],
        field: requiredField,
        isOptional: field.isOptional(),
        path: newPath,
        textKey: newTextKey,
      }}>
      {children}
    </AutoformFieldContext.Provider>
  )
}

export default AutoformFieldProvider
