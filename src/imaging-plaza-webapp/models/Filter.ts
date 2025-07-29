import {z} from 'zod'
import { AffiliationEnum, ComputerLanguageEnum, FairLevelEnum, ImagingModalityEnum, OperatingSystemEnum } from '@/components/Form/schema-consts';


// Filter Types for Filtering the Search
export const FilterSchema = z.object({
    title: z.string(),
    key: z.string(),
    values: z.array(z.string()),
    selected: z.array(z.string()),
    schema: z.string(),
  });
  export type Filter = z.infer<typeof FilterSchema>;
  export const defaultFilters: Filter[] = [
    { title: 'Programming Language', key: 'programmingLanguage', values: Object.values(ComputerLanguageEnum), selected : [], schema: 'schema:programmingLanguage',  },
    { title: 'Operating System', key: 'operatingSystem', values: Object.values(OperatingSystemEnum), selected : [], schema: 'schema:operatingSystem' },
    { title: 'Imaging Modality', key: 'imagingModality', values: Object.values(ImagingModalityEnum), selected : [], schema: 'imag:imagingModality'},
    { title: 'Fair Level', key: 'fairLevel', values: Object.values(FairLevelEnum), selected : [], schema: 'imag:fairLevel'},
    { title: 'Related to Organization', key: 'affiliation', values: Object.values(AffiliationEnum), selected : [], schema: 'imag:relatedToOrganization'},
    // { title: 'Feature List', key: 'featureList', values: Object.values(FeatureEnum), selected : [], schema: 'schema:featureList'},
  ];
  