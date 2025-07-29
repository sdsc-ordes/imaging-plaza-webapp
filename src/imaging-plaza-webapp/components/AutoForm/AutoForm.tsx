import React, {useMemo} from 'react'
import {FieldValues, UseFormSetError, UseFormWatch} from 'react-hook-form'
import {UnknownKeysParam, ZodObject, ZodRawShape, ZodTypeAny, z} from 'zod'
import {AutoFormSection} from './AutoFormSection'
import {FormDescriptor, FormSection} from './types'

export type AutoFormRef<A extends FieldValues> = {
  setError: UseFormSetError<A>
  watch: UseFormWatch<A>
}

export type AutoFormProps<A extends ZodObject<ZodRawShape>, C extends Record<string, true>> = {
  fields: A
  value?: Partial<z.infer<A>>
  onSubmit: (data: Partial<z.infer<A>>) => Promise<void>
  descriptor?: FormDescriptor<z.infer<A>, C>
  formRef?: React.ForwardedRef<AutoFormRef<z.infer<A>>>
  onDirty?: () => void
  isSubmitDisabled?: boolean
}

/**
 * Auto form with the schema splitted as describei in schema-ui
 */
export const AutoForm = <A extends ZodObject<ZodRawShape>, C extends Record<string, true>>({
  fields,
  onSubmit,
  descriptor,
  value,
  onDirty,
  isSubmitDisabled,
}: AutoFormProps<A, C>) => {
  const schemas = useMemo(() => descriptorToSection<A, C>(fields, descriptor), [descriptor, fields])

  return (
    <>
      {Object.entries(schemas).map(([key, schemaPart], index) => (
        <AutoFormSection<
          ZodObject<Pick<ZodRawShape, never>, UnknownKeysParam, ZodTypeAny, {}, {}>,
          C
        >
          key={key}
          value={value}
          first={index === 0}
          fields={schemaPart.fields}
          section={schemaPart.section}
          onSubmit={onSubmit}
          onDirty={onDirty}
          isSubmitDisabled={isSubmitDisabled}
        />
      ))}
    </>
  )
}

type SchemaModel<A extends ZodObject<ZodRawShape>, C extends Record<string, true>> = Record<
  string,
  {
    fields: ZodObject<Pick<ZodRawShape, never>, UnknownKeysParam, ZodTypeAny, {}, {}>
    section: FormSection<z.infer<A>, C>
  }
>

const descriptorToSection = <A extends ZodObject<ZodRawShape>, C extends Record<string, true>>(
  fields: A,
  descriptor?: FormDescriptor<z.infer<A>, C>
): SchemaModel<A, C> => {
  if (!descriptor?.sections) {
    return {}
  }

  if (descriptor.sections.fields !== undefined) {
    const section = descriptor.sections as FormSection<A, C>
    const sectionModel = fields.pick({
      ...section.fields.reduce((acc, value) => ({...acc, [value]: true}), {}),
    })
    return {
      default: {
        section,
        fields: sectionModel,
      },
    }
  }

  return Object.entries(descriptor.sections as Record<string, FormSection<A, C>>).reduce<
    SchemaModel<A, C>
  >((accSections, [key, values]) => {
    const sectionFields = fields.pick({
      ...values.fields.reduce((acc, value) => ({...acc, [value]: true}), {}),
    })
    return {
      ...accSections,
      [key]: {
        section: values,
        fields: sectionFields,
      },
    }
  }, {})
}
