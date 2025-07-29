export class SoftwarePropertiesGroup {
  constructor(
    public id: string,
    public nameKey: string,
    public filters: Array<SoftwareProperty | SoftwareTask>
  ) {}

  getFilterByNameKey(keyName: string): SoftwareProperty | SoftwareTask | undefined {
    return this.filters.find(x => x.nameKey == keyName)
  }

  getFilterById(id: string): SoftwareProperty | SoftwareTask | undefined {
    return this.filters.find(x => x.id == id)
  }

  getFiltersByIds(ids: string[]): (SoftwareProperty | SoftwareTask | undefined)[] {
    return ids.map(id => this.getFilterById(id))
  }
}

export interface SoftwareProperty {
  id: string
  nameKey: string
}

export interface SoftwareTask extends SoftwareProperty {
  categoryId: string
}

export interface SoftwareLicense extends SoftwareProperty {
  licenseId: string
  reference: string
}
