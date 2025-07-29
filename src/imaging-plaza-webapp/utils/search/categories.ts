import {
  SoftwarePropertiesGroup,
  SoftwareProperty,
  SoftwareTask,
} from '../../models/SoftwareProperties'
import {v4 as uuidv4} from 'uuid'
import {CATEGORIES_FILTERS_GROUP} from '../../constants/softwareProperties'

export const getTasksFromCategories = (
  categories: SoftwarePropertiesGroup,
  tasks: SoftwarePropertiesGroup
) => {
  const filteredtasks = categories.filters
    .map((cat: SoftwareProperty) => {
      // @ts-ignore
      return tasks.filters.filter((taskFilter: SoftwareTask) => {
        return taskFilter.categoryId == cat.id
      })
    })
    .flat()
    .filter(item => item)
  return new SoftwarePropertiesGroup(uuidv4(), 'relatedTasks', filteredtasks)
}

export const getCategoriesFromTasks = (
  tasks: SoftwareProperty[],
  categories: SoftwarePropertiesGroup,
  filterName: string
) => {
  const filteredCategories = categories.filters.filter(cat => {
    return (
      tasks
        // @ts-ignore
        .map((taskFilter: SoftwareTask) => {
          return taskFilter.categoryId
        })
        .includes(cat.id)
    )
  })
  return new SoftwarePropertiesGroup(uuidv4(), filterName, filteredCategories)
}

export const getCategoriesFromNameKeys = (nameKeys: string[]) => {
  const categories = nameKeys.map((nameKey: string) => {
    return CATEGORIES_FILTERS_GROUP.getFilterByNameKey(nameKey)
  }) as SoftwareProperty[]
  return new SoftwarePropertiesGroup(uuidv4(), 'categories', categories)
}

export const getCategoriesFromIds = (ids: string[]) => {
  const categories = ids.map((id: string) => {
    return CATEGORIES_FILTERS_GROUP.getFilterById(id)
  }) as SoftwareProperty[]
  return new SoftwarePropertiesGroup(uuidv4(), 'categories', categories)
}
