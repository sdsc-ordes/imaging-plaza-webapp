import {ZodArray, ZodOptionalDef} from 'zod'
import {isZodArray, isZodEnum, isZodObject, isZodUnion} from '../../../utils/zod-utils'
import {useAutoformField} from '../AutoformFieldProvider'
import {FormObject} from './FormObject'
import {FormObjectArray} from './FormObjectArray'
import FormPrimitiveArray from './FormPrimitiveArray'
import {FormUnion} from './FormUnion'
import {FormUnionArray} from './FormUnionArray'
import MultiSelect from './MultiSelect'
import PrimitiveField from './PrimitiveField'
import CreatableMultiSelect from './CreatableMultiSelect'


/**
 * Field switcher (the field context with name etc has been provided by the AutoFormFieldProvider)
 * Will display the right input depending on the field
 */
const FormField = ({placeholder}: {placeholder?: string}) => {
  const {field} = useAutoformField()
  const {textKey} = useAutoformField()

  const requiredField = field.isOptional() ? (field._def as ZodOptionalDef).innerType : field

  if (isZodArray(requiredField)) {
    if (isZodObject((requiredField as ZodArray<any>).element)) {
      return <FormObjectArray />
    } else if (textKey === "affiliation" ||textKey === "featureList" || textKey === "applicationCategory"|| textKey === "relatedToOrganization"|| textKey === "isPluginModuleOf"|| textKey === "programmingLanguage" || textKey === "softwareRequirements" || textKey === "imagingModality") {
      return <CreatableMultiSelect />
    } else if (isZodUnion((requiredField as ZodArray<any>).element)) {
      return <FormUnionArray />
    } else if (isZodEnum((requiredField as ZodArray<any>).element)) {
      return <MultiSelect />
    } else {
      return <FormPrimitiveArray />
    }
  } else if (isZodObject(requiredField)) {
    return <FormObject placeholder={placeholder} />
  } else if (isZodUnion(requiredField)) {
    return <FormUnion />
  }

  //Pass on to primitive type
  return <PrimitiveField placeholder={placeholder} />
}

export default FormField
