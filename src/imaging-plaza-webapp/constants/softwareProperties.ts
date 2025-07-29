import {SoftwarePropertiesGroup, SoftwareProperty} from '../models/SoftwareProperties'
import {LICENSES_FILTERS} from './licenses'

export const COLOR_SPACE_FILTERS: SoftwareProperty[] = [
  {id: 'fe77907d-e852-4f02-840b-4c7a538d617c', nameKey: 'sRGB'},
  {id: 'a6b1ac80-677f-4577-a56c-ce7ec0c2336b', nameKey: 'Grayscale'},
  {id: '20f3d011-eed1-4d47-8309-7c8d0c46190f', nameKey: 'RGB'},
]

export const COLOR_SPACES_INPUT_FILTERS_GROUP = new SoftwarePropertiesGroup(
  'e150e810-1006-4366-8371-87c991d8ef2a',
  'softwareInputs.colorSpace',
  COLOR_SPACE_FILTERS
)
export const COLOR_SPACES_OUTPUT_FILTERS_GROUP = new SoftwarePropertiesGroup(
  '96be6178-fda9-447e-9f59-e090631cce3c',
  'softwareOutputs.colorSpace',
  COLOR_SPACE_FILTERS
)

export const DIMENSIONALITIES_FILTERS: SoftwareProperty[] = [
  {id: '0ac6338e-9177-48d7-9b8c-fd6e551dd9bf', nameKey: '1D'},
  {id: 'c786d214-6411-4738-aec0-80144cb05037', nameKey: '2D'},
  {id: '714eaaac-c4e1-472b-b74f-8f0870894a21', nameKey: '3D'},
  {id: '9251e0a0-994e-49a3-b93b-b78f8c9c4be7', nameKey: '4D'},
  {id: 'b5701004-82af-43cc-9a6a-a6eb75ca5d29', nameKey: '5D'},
  {id: 'efa858d3-9b4a-45db-a9df-a20c08ced9df', nameKey: '6D'},
  {id: '61998df3-9267-49f2-bbd0-12f8fd70c426', nameKey: '7D'},
  {id: '8dc93472-7896-4eb6-85b5-a76a117d72a6', nameKey: '8D'},
  {id: '3e75398e-3af4-4b3d-b45e-e367ed1bf05b', nameKey: '9D'},
  {id: 'ea090206-b770-4b73-a9cd-890e9b3c8cd8', nameKey: '10D'},
]

export const DIMENSIONALITIES_INPUT_FILTERS_GROUP = new SoftwarePropertiesGroup(
  '109e4f2d-7eaf-444f-83a8-08581caa97c3',
  'softwareInputs.spatialDimensions',
  DIMENSIONALITIES_FILTERS
)

export const DIMENSIONALITIES_OUTPUT_FILTERS_GROUP = new SoftwarePropertiesGroup(
  'd139f043-5075-4b9f-bf98-f9c0f138935f',
  'softwareOutputs.spatialDimensions',
  DIMENSIONALITIES_FILTERS
)

const FAIR_LEVEL_1 = {id: '1', nameKey: '1'}
const FAIR_LEVEL_2 = {id: '2', nameKey: '2'}
const FAIR_LEVEL_3 = {id: '3', nameKey: '3'}
const FAIR_LEVEL_4 = {id: '4', nameKey: '4'}
const FAIR_LEVEL_5 = {id: '5', nameKey: '5'}

export const FAIR_LEVELS_FILTERS_GROUP = new SoftwarePropertiesGroup(
  '52dd4cc2-d00f-4c90-b3e8-c72d82153e90',
  'fairLevel',
  [FAIR_LEVEL_1, FAIR_LEVEL_2, FAIR_LEVEL_3, FAIR_LEVEL_4, FAIR_LEVEL_5]
)
export const PROGRAMMING_LANGUAGES_FILTERS_GROUP = new SoftwarePropertiesGroup(
  '32d8f77b-192e-4364-9693-8864df41170b',
  'programmingLanguages',
  [
    {id: '027fcd26-2824-441b-af5b-8bdfd159e710', nameKey: 'OCaml'},
    {id: 'bbd1cf52-9a9f-43fd-8b1e-fc0b039a964a', nameKey: 'JSP'},
    {id: '43f456eb-5438-47ca-a204-fb0d2178aa07', nameKey: 'VHDL'},
    {id: 'fec7a552-3fcc-4770-a29a-d5b71bdbdfe5', nameKey: 'REXX'},
    {id: 'f347450b-6d14-4fb6-80a9-2b3a124fc13b', nameKey: 'CWL'},
    {id: '44e91fb2-704b-411f-8c6d-4dc9bb442d45', nameKey: 'Other'},
    {id: '2faca469-4ccd-4b01-b6b7-bc126b489a02', nameKey: 'Assembly language'},
    {id: '65161718-7bde-4b69-a7c2-ca207dd47f94', nameKey: 'C#'},
    {id: '349f115f-1524-4b15-9287-14ca43959cb5', nameKey: 'PyMOL'},
    {id: '396306c1-cc42-4bd5-8726-b4b0f8049753', nameKey: 'D'},
    {id: '1615122b-8629-4762-8fd2-f228263e180d', nameKey: 'Scala'},
    {id: 'd1270f8e-7bf7-4aad-bab0-fd6a55597f26', nameKey: 'C++'},
    {id: '5178cc52-5ce3-42b1-8242-6fccc41f26bb', nameKey: 'Groovy'},
    {id: '4c5f0c54-b207-4185-a5c3-378ce01a9d48', nameKey: 'ColdFusion'},
    {id: '2b113f86-509f-433f-a9ad-1802676ba94a', nameKey: 'MATLAB'},
    {id: '0ebc90e1-7403-4604-b32d-9a6c08a3d9ef', nameKey: 'AWK'},
    {id: '583f887d-1388-4eb2-bee1-85dd907eb954', nameKey: 'lcarus'},
    {id: '9f3e864f-8024-4e75-9447-cc0b8043edfe', nameKey: 'Ada'},
    {id: 'da44af10-fde5-41c8-8005-51bfcd03eb6b', nameKey: 'Haskell'},
    {id: '8bcb62c4-2d5c-47ea-ab99-6572ae8cc8fc', nameKey: 'XAML'},
    {id: 'd32f1541-935a-4afb-b09b-4ec1e1b52e8b', nameKey: 'Smalltalk'},
    {id: 'bbd21c63-8a41-41d7-955d-43bb041a622f', nameKey: 'Javascript'},
    {id: '6be422e7-46de-4ef4-b854-4e7077c69c73', nameKey: 'SAS'},
    {id: '598bd24d-e2d8-4086-aecb-24f5b56497b0', nameKey: 'Maple'},
    {id: '97c17577-bf46-42d2-8c74-82ac984ea6a7', nameKey: 'NMTRAN'},
    {id: 'dab5bcb0-a3e4-42a2-8431-8326addd85e2', nameKey: 'Scheme'},
    {id: 'f5f85b22-4d31-4c09-a53a-ceca020e25a1', nameKey: 'SQL'},
    {id: '7d68821d-fd97-4ae7-9fb9-1e52dced945e', nameKey: 'Python'},
    {id: 'be8a4c31-7ed1-4a9b-af18-432cbd6859ce', nameKey: 'Racket'},
    {id: '16daba59-69e8-4e2e-a7bd-6bdd2929dd56', nameKey: 'Perl'},
    {id: 'c074c041-4929-4cb4-9236-e07fd6529366', nameKey: 'C'},
    {id: '36605582-95e1-472c-8bcc-f555effe232a', nameKey: 'LabView'},
    {id: '9730b607-cb2f-4066-95c7-b1336c0d3afe', nameKey: 'R'},
    {id: '586c0a60-da92-46b7-b4f2-bb6eaf76b242', nameKey: 'PHP'},
    {id: '861b2e6a-531d-4e1e-b4d8-22eb6410c8c3', nameKey: 'Turing'},
    {id: '59b62787-4916-47a0-9991-28dd3875aff4', nameKey: 'Verilog'},
    {id: '82dc13b3-fa3a-40d6-ac46-2e523b0b10ba', nameKey: 'Delphi'},
    {id: '4fa09e6a-d04e-4022-8806-ba7ce723e207', nameKey: 'Prolog'},
    {id: 'b9ba8f63-3fe2-4e18-acc1-8478f9f1e0f5', nameKey: 'Bash'},
    {id: 'f1716a08-7d87-405c-a468-f1ac0c4c9d15', nameKey: 'MLXTRAN'},
    {id: 'a8c58237-f2dc-4a57-af4e-31eb5c1ee73f', nameKey: 'ImageJ Macro'},
    {id: 'eb59473a-bb38-41a8-9729-8c0904d7850c', nameKey: 'Java'},
    {id: '79e0ee73-9e0d-40f9-b498-956f8d4c79a8', nameKey: 'Applescript'},
    {id: '68c6e8be-e59a-475e-b847-832acb2d57d0', nameKey: 'Ruby'},
    {id: '250a5bec-0aba-4d53-a9fd-c5907a91b235', nameKey: 'Lua'},
    {id: '66907d7f-b1ef-4b4b-a549-8919e8e23fd1', nameKey: 'Visual Basic'},
    {id: '6b39acde-68da-4c61-84ca-6951e0dd8e2e', nameKey: 'Lisp'},
    {id: 'd307cc22-8efd-4a7c-ba28-fcdaad392536', nameKey: 'Eiffel'},
    {id: '62aa4559-0c6f-4d85-8eb8-dd614a0aadd6', nameKey: 'Pascal'},
    {id: 'afc86039-4ce7-40f1-a5ba-e200d33fcb68', nameKey: 'Forth'},
    {id: '05d485d5-8f1b-41e0-bf1f-08d8e1276ad9', nameKey: 'COBOL'},
    {id: 'b971b50c-bf3d-4e25-ac9e-e9fba0bc71fc', nameKey: 'Shell'},
    {id: 'b96b85b2-40cc-4080-bffd-f8e6386a0718', nameKey: 'Fortran'},
    {id: '0919bd79-1bfd-4a26-aaf0-eba3f8770625', nameKey: 'Dylan'},
    {id: '834ed716-f2d3-4867-82ab-724fc35437c9', nameKey: 'Mathematica'},
    {id: '0a03eb3c-680f-4a50-8d78-e6a59d6b44a4', nameKey: 'Actionscript'},
  ]
)

export const SOFTWARE_CATEGORIES_FILTERS_GROUP = new SoftwarePropertiesGroup(
  'cdd76e06-207c-47b4-99a5-21e00c944cee',
  'softwareCategories',
  [
    {
      id: 'c71d58d5-8285-4c68-a9c4-dadfdc858408',
      nameKey: 'Plug-in',
    },
    {id: 'ec11550c-0849-40b4-b9ca-d3fdd670627d', nameKey: 'Other'},
    {id: 'ba6cbc9a-a0d9-4386-8928-82d263634715', nameKey: 'Desktop application'},
    {id: 'da46136b-9d93-47e6-8d97-4fef121a88f6', nameKey: 'Command-line tool'},
    {id: 'db8c5a0c-dd5f-47c1-93b3-4164a603bdac', nameKey: 'Library'},
    {id: '58c3b817-09d1-4ad9-bbd3-9cf772006d0a', nameKey: 'Web application'},
  ]
)

export const TYPES_FILTERS: SoftwareProperty[] = [
  {
    id: '7d36beb4-2453-483d-8371-35d910214e86',
    nameKey: 'Pre-trained model',
  },
  {id: 'dceadf12-1699-41a4-bbbd-02df38a4a855', nameKey: 'Mesh'},
  {id: '70a664c9-e912-4666-8501-240951172311', nameKey: 'Image'},
  {id: '9fb7de3b-3d8d-476b-8388-ad91cdbd8fda', nameKey: 'Point cloud'},
  {id: '0df8a257-6038-4cd6-9053-4ee09ee6a4f1', nameKey: 'Configuration file'},
  {id: '64b586cf-143a-4b2d-a028-4cd46bbf4529', nameKey: 'Other'},
]

export const TYPES_OUTPUT_FILTERS_GROUP = new SoftwarePropertiesGroup(
  'cfc91e8e-92af-4da0-8f04-6f2e57732e66',
  'softwareOutputs.type',
  TYPES_FILTERS
)
export const TYPES_INPUT_FILTERS_GROUP = new SoftwarePropertiesGroup(
  '64d5cdc5-e3d5-4772-b101-7d84cd03d318',
  'softwareInputs.type',
  TYPES_FILTERS
)

export const TASKS_FILTERS_GROUP = new SoftwarePropertiesGroup(
  'dbeb8c6e-f0bc-4042-9659-98cd73c5fdae',
  'softwareTasks',
  [
    {
      id: 'd6abe3f6-a376-41bd-a171-e2c5c983eb8b',
      nameKey: 'Annotation',
      categoryId: '1',
    },
    {id: '8aa88181-360b-4e9d-aa4b-ad4bb3f3a9ad', nameKey: 'Labelling', categoryId: '1'},
    {id: 'e648bd30-83fe-4cb4-8b01-3fbde77bd9eb', nameKey: 'Drawing', categoryId: '1'},
    {id: '4beb47bf-1ac5-4d6d-be7b-c940d660848b', nameKey: 'Tracking', categoryId: '2'},
    {id: '532566b5-8665-4dd3-8184-7d2a78bfb027', nameKey: 'Segmentation', categoryId: '3'},
    {id: '6dc0be7a-af62-4f4d-bef4-607bd12455b3', nameKey: 'Classification', categoryId: '3'},
    {
      id: 'd82f903f-c536-4b9f-b7db-595f5641f99f',
      nameKey: 'Object detection',
      categoryId: '3',
    },
    {id: '8804e5c3-54d1-4eb2-8541-a1a7ece5800d', nameKey: 'Object recognition', categoryId: '3'},
    {id: 'bac15587-5b0f-4192-9873-7f95d3338e1d', nameKey: 'Clustering', categoryId: '3'},
    {id: '312c2c3b-b1d3-4b63-83e1-ba3e4cc1b2af', nameKey: 'Grouping', categoryId: '3'},
    {id: '2a4d7baa-9337-4c5f-9283-8d37e228d884', nameKey: 'Pattern recognition', categoryId: '3'},
    {id: '7a973882-d177-40a3-a566-83289e520eb0', nameKey: 'Template matching', categoryId: '3'},
    {
      id: '9c9cb88e-367f-47ec-b097-96d8916bfe40',
      nameKey: 'Instance segmentation',
      categoryId: '3',
    },
    {id: 'b8a885d5-c332-4a46-bb77-45e3937043e5', nameKey: 'Pixel classification', categoryId: '3'},
    {id: '3e0bb718-92a6-4f65-9c7f-52da56fb311d', nameKey: 'Preprocessing', categoryId: '4'},
    {id: '9badd78a-9f46-4136-8cf4-a0c50c89c4ca', nameKey: 'Filtering', categoryId: '4'},
    {id: '21f40c83-06b8-40d2-94bf-1efdb082c2cd', nameKey: 'Image simplification', categoryId: '4'},
    {id: 'a0989452-9459-470e-96f3-3b277f6d3154', nameKey: 'Image enhancement', categoryId: '4'},
    {id: 'd6788052-5b5c-4b7f-8e3a-2d4bb1d0f19b', nameKey: 'Feature extraction', categoryId: '5'},
    {
      id: '786d6395-baba-44fe-a917-8aa8b0dc0c36',
      nameKey: 'Dimensionality reduction',
      categoryId: '5',
    },
    {
      id: '2b22ef5b-ee33-4a40-8a00-9591959a0f47',
      nameKey: 'Dimensional image analysis',
      categoryId: '5',
    },
    {id: 'e6400279-d406-467e-b178-f8a33c93fa77', nameKey: 'Pose estimation', categoryId: '6'},
    {id: 'a46d64cf-cdcd-49d2-819f-fd338fe37ec1', nameKey: 'Pose information', categoryId: '6'},
    {id: 'c24aacee-9b82-4f8d-a648-e689a5f425ad', nameKey: 'Pose detection', categoryId: '6'},
    {id: '1e8f53bf-3ebe-423f-94e7-7652b1b358d5', nameKey: 'Orientation analysis', categoryId: '6'},
    {id: '374d0d0f-84f2-44cc-99ad-28024e21b62c', nameKey: 'Mesh generation', categoryId: '7'},
    {id: 'f561c20c-62f5-413f-9f18-57f0f09aec6c', nameKey: 'Voxelization', categoryId: '7'},
    {
      id: '025f03a2-eea8-4f63-9bf8-93651d31366c',
      nameKey: 'Surface parameterisation',
      categoryId: '7',
    },
    {
      id: '91582bc5-bf98-4320-bb32-12de63bfea56',
      nameKey: 'Morphological analysis',
      categoryId: '8',
    },
    {id: '508e82f8-29a9-419f-8ede-30b52735ed32', nameKey: 'Feature detection', categoryId: '8'},
    {id: '89964b6f-a3b3-4c2e-bcb3-385f81c31279', nameKey: 'Scene reconstruction', categoryId: '9'},
    {id: 'e67ec185-5eb5-400c-8150-e1559af08543', nameKey: '3d reconstruction', categoryId: '9'},
    {id: '7e4ff282-121b-498c-95a7-ad54228e8551', nameKey: '3d model generation', categoryId: '9'},
    {
      id: '86cc1ba8-4542-4f9a-99c0-9a0d093e78bf',
      nameKey: 'Morphological reconstruction',
      categoryId: '9',
    },
    {id: '16cf2b9d-19a9-47f8-856f-01174495d58a', nameKey: 'Depth estimation', categoryId: '9'},
    {id: 'd3819359-446c-4758-b5c4-f2c15eb89ddf', nameKey: 'Curvature estimation', categoryId: '9'},
    {id: '0bec831e-513d-43fb-b1cd-efb9b1e805c2', nameKey: 'Shading estimation', categoryId: '9'},
    {id: '6db05f2c-d95e-4e91-91c7-654495cf4a68', nameKey: 'Modelling', categoryId: '10'},
    {id: '0e6ce0b2-f1fe-456d-aa45-8afbd3ffff15', nameKey: 'Simulation', categoryId: '10'},
    {
      id: '8f2c3c89-b6b2-4f82-85c7-368d89374706',
      nameKey: 'Visual question answering',
      categoryId: '11',
    },
    {id: '4aa26606-6402-452e-b318-3c5e9a426189', nameKey: 'Optical flow', categoryId: '12'},
    {
      id: 'f90b27a5-b015-4d06-8314-30eba42a01d0',
      nameKey: 'Digital image correlation',
      categoryId: '12',
    },
    {id: '7d48bdad-2ffb-4e7c-b49b-81390677a75e', nameKey: 'Motion estimation', categoryId: '12'},
    {id: '6bf30d9d-c795-4f07-a2de-108a21e42b9c', nameKey: 'Registration', categoryId: '12'},
    {id: 'c6966262-05e9-4bbc-839b-2f6735ed0095', nameKey: 'Stitching', categoryId: '12'},
    {id: '6eb92832-2787-400d-a9f1-f47a268d2f6e', nameKey: 'Drift correction', categoryId: '12'},
    {
      id: 'd1f6ec29-c280-424d-949d-69d8e572cc34',
      nameKey: 'Statistics measurement',
      categoryId: '13',
    },
    {
      id: '54c8dfbb-03ec-4f51-ad77-12a7db9e1c48',
      nameKey: 'Quality metric measurement',
      categoryId: '13',
    },
    {
      id: '25e42ec9-04ec-4992-aad0-0c25ab787976',
      nameKey: 'Distribution measurements',
      categoryId: '13',
    },
    {
      id: 'fee57981-041a-4406-bdfa-21c744385800',
      nameKey: 'Image quality assessment',
      categoryId: '13',
    },
    {id: 'c03e8660-324f-4eae-aa8c-98b9611546c2', nameKey: 'Visualization', categoryId: '14'},
    {id: '281a0d29-5236-4f92-ab8f-b6a7a95f9727', nameKey: 'Rendering', categoryId: '14'},
    {id: '9565f1ce-c89b-4d9d-87c2-8d40a4c7f73c', nameKey: 'Denoising', categoryId: '15'},
    {id: 'e2051703-9fe0-4b49-a04d-7aa79fc4c680', nameKey: 'Deblurring', categoryId: '15'},
    {id: 'c8423c57-34b8-412a-b919-cf6d0bf5172d', nameKey: 'Smoothing', categoryId: '15'},
    {id: '62205e22-0bc0-411c-8f94-7bb11f682e6b', nameKey: 'Deconvolution', categoryId: '15'},
  ]
)

export const CATEGORIES: SoftwareProperty[] = [
  {id: '1', nameKey: 'Annotation'},
  {id: '2', nameKey: 'Tracking'},
  {id: '3', nameKey: 'Segmentation'},
  {id: '4', nameKey: 'Preprocessing'},
  {id: '5', nameKey: 'Feature extraction'},
  {id: '6', nameKey: 'Pose estimation'},
  {id: '7', nameKey: 'Mesh generation'},
  {id: '8', nameKey: 'Morphological analysis'},
  {id: '9', nameKey: 'Scene reconstruction'},
  {id: '10', nameKey: 'Modelling'},
  {id: '11', nameKey: 'Visual question answering'},
  {id: '12', nameKey: 'Optical flow'},
  {id: '13', nameKey: 'Statistics measurement'},
  {id: '14', nameKey: 'Visualization'},
  {id: '15', nameKey: 'Denoising'},
]

export const CATEGORIES_FILTERS_GROUP = new SoftwarePropertiesGroup(
  '042223da-bfb5-4c91-8908-51ba8cb3a450',
  'categories',
  CATEGORIES
)

export const SOFTWARE_FILTER_GROUPS = [
  CATEGORIES_FILTERS_GROUP,
  DIMENSIONALITIES_INPUT_FILTERS_GROUP,
  PROGRAMMING_LANGUAGES_FILTERS_GROUP,
  FAIR_LEVELS_FILTERS_GROUP,
  SOFTWARE_CATEGORIES_FILTERS_GROUP,
]

export const DEEP_LEARNING_FILTERS: SoftwareProperty[] = [
  {nameKey: 'tensorflow1X', id: 'f5288dc0-7129-47d2-a447-b41470b42a0d'},
  {nameKey: 'tensorflow2X', id: '7fcad96b-6f5e-48be-88da-e7f4a5effc5e'},
  {nameKey: 'pyTorch', id: 'ad361322-8962-45e7-97de-b6432d6fa264'},
  {nameKey: 'caffe', id: '36afdd0d-c72a-47f7-81e0-6d2e3a7d40b5'},
  {nameKey: 'caffe2', id: '4cc0a91c-917d-4deb-b141-3676a553043e'},
  {nameKey: 'mxNet', id: 'c2d3212b-e70d-42f2-a124-d628fed527b1'},
  {nameKey: 'jax', id: 'b283e402-4fd3-4be4-b4e6-352ee3dcc8c8'},
  {nameKey: 'chainer', id: '5f53ab5f-1728-4818-af52-9a3c6961b0a7'},
  {nameKey: 'torch', id: '60ef986a-66c6-4261-a99b-5115a34f6d38'},
  {nameKey: 'keras', id: 'a96b20ff-b3d8-4642-94f8-b966ad40f09c'},
  {nameKey: 'csbDeep', id: 'ff247657-2b9e-4489-86f0-2b73ed099026'},
]

export const DEEP_LEARNING_FILTERS_GROUP = new SoftwarePropertiesGroup(
  '3cbb758f-c51e-45fd-aaae-a1fd54d7b244',
  'deepLearningFrameworks',
  DEEP_LEARNING_FILTERS
)

export const MODALITY_FILTERS: SoftwareProperty[] = [
  {nameKey: 'computedRadiography', id: '14e7279e-2c33-4da3-910a-cb2d34245070'},
  {nameKey: 'computedTomography', id: 'd209bf18-ae8f-4155-909a-6ebef8df391f'},
  {nameKey: 'magneticResonance', id: 'd72fd351-6f0a-4b62-a6df-b103a3c74e74'},
  {nameKey: 'ultrasound', id: '7dea7532-351c-4711-a7eb-fcd998e4e4d6'},
  {nameKey: 'xRayAngiography', id: 'bc9d23c0-790d-4a0a-a620-cb883c061034'},
  {nameKey: 'radiotherapyPlan', id: '12c9eecc-d59e-4ae6-9f63-7c136516e8f6'},
  {nameKey: 'other', id: '1ae4791f-d88a-4a3c-bb2a-66eaa6d36ab3'},
]

export const MODALITY_FILTERS_GROUP = new SoftwarePropertiesGroup(
  'e8b875fa-32a9-47d6-aaf3-a673ab65f620',
  'softwareModalities',
  MODALITY_FILTERS
)

export const OS_FILTERS: SoftwareProperty[] = [
  {nameKey: 'gnuLinux', id: 'bac36a3d-ec93-4bc4-beac-15d4406f7338'},
  {nameKey: 'windows', id: 'a67bff2b-54e0-408f-afc6-39e9cfaa5136'},
  {nameKey: 'osxX8664', id: 'bc8e0f84-5333-4e11-9f51-52588f4d3019'},
  {nameKey: 'android', id: '3c647d2f-b608-492d-b994-272a0bbf3cb7'},
  {nameKey: 'osxArm', id: '706d77d3-8f38-4237-b566-11e73dafd3c0'},
  {nameKey: 'torch', id: 'b8268c48-cdb7-4c59-a0be-ed212e6065fd'},
  {nameKey: 'keras', id: '496796d3-aa22-47e5-8faa-caa1c3fe7d41'},
  {nameKey: 'csbDeep', id: '2e6630ec-38d2-457b-bff6-c000016deb66'},
]

export const LICENSES_FILTERS_GROUP = new SoftwarePropertiesGroup(
  'd8e51064-de94-4666-a68d-7c7bf0820458',
  'licenses',
  LICENSES_FILTERS
)

export const OS_FILTERS_GROUP = new SoftwarePropertiesGroup(
  '713b796e-d3df-4d19-ae7d-491f14606889',
  'operatingSystems',
  OS_FILTERS
)

export const ALL_FILTERS_GROUPS = [
  COLOR_SPACES_INPUT_FILTERS_GROUP,
  DIMENSIONALITIES_INPUT_FILTERS_GROUP,
  FAIR_LEVELS_FILTERS_GROUP,
  PROGRAMMING_LANGUAGES_FILTERS_GROUP,
  SOFTWARE_CATEGORIES_FILTERS_GROUP,
  TYPES_INPUT_FILTERS_GROUP,
  TASKS_FILTERS_GROUP,
  CATEGORIES_FILTERS_GROUP,
  DEEP_LEARNING_FILTERS_GROUP,
  MODALITY_FILTERS_GROUP,
  LICENSES_FILTERS_GROUP,
  OS_FILTERS_GROUP,
]
