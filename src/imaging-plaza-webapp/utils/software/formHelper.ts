import {Translate} from 'next-translate'
import {multipleSelectType} from '../../components/Form/components/FormPropertyMultipleSelect'
import {SoftwarePropertiesGroup, SoftwareProperty} from '../../models/SoftwareProperties'

export const convertSPToMultipleSelectObject = (properties: SoftwareProperty[], t: Translate) => {
  return properties.map(item => {
    //@ts-ignore
    return {value: item.id, label: t(`filters:${item.nameKey}`)}
  })
}

export const convertMultipleObjectToSP = (
  object: multipleSelectType,
  properties: SoftwarePropertiesGroup
) => {
  return properties.getFilterById(object.value)
}
