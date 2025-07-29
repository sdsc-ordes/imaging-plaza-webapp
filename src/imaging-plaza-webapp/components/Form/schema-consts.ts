// import { NonceProvider } from "chakra-react-select";

export enum ImagingModalityEnum {
  MRI = 'MRI',
  CAT = 'CAT',
  XRay = 'X-ray',
  Any = 'Any',
}
export enum AffiliationEnum {
  EPFL = 'EPFL',
  UNIL = 'UNIL',
  ETHZ = 'ETHZ',
  UZH = 'UZH',
  None = 'None',
}

export enum IsPluginModuleOfEnum {
  Fiji = 'Fiji',
  Napari = 'napari',
  Icy = 'icy',
  QuPath = 'qupath',
  OMERO = 'OMERO',
  Pyxu = 'pyxu',
  None = 'None',
}

export enum ApplicationCategoryEnum {
  DesktopApp = 'Desktop app',
  Plugin = 'Plugin',
  WebApp = 'Web app',
  Notebook = 'Notebook',
  Library = 'Library',
}

export enum ImageObjectTagEnum {
  Logo = 'logo',
  IllustrativeImage = 'illustrative image',
  BeforeImage = 'before image',
  AfterImage = 'after image',
  AnimatedImage = 'animated image',
}
export enum OperatingSystemEnum {
  Windows = 'Windows',
  Linux = 'Linux',
  MacOS= 'MacOS',
  Other = 'Other',
}
export enum ProcessorRequirementsEnum {
  ARM64 = 'ARM64',
  AMD64 = 'AMD64',
  None = 'None',
}
export enum FeatureEnum {
  Annotation = 'Annotation',
  Labelling = 'Labelling',
  Drawing = 'Drawing',
  OpticalFlow = 'Optical flow',
  DigitalImageCorrelation = 'Digital image correlation',
  MotionEstimation = 'Motion estimation',
  Registration = 'Registration',
  Stitching = 'Stitching',
  DriftCorrection = 'Drift correction',
  Denoising = 'Denoising',
  Deblurring = 'Deblurring',
  Smoothing = 'Smoothing',
  Deconvolution = 'Deconvolution',
  Preprocessing = 'Preprocessing',
  Filtering = 'Filtering',
  ImageSimplification = 'Image simplification',
  ImageEnhancement = 'Image enhancement',
  Segmentation = 'Segmentation',
  Classification = 'Classification',
  ObjectDetection = 'Object detection',
  ObjectRecognition = 'Object recognition',
  Clustering = 'Clustering',
  Grouping = 'Grouping',
  PatternRecognition = 'Pattern recognition',
  TemplateMatching = 'Template matching',
  InstanceSegmentation = 'Instance segmentation',
  PixelClassification = 'Pixel classification',
  FeatureExtraction = 'Feature extraction',
  DimensionalityReduction = 'Dimensionality reduction',
  DirectionalImageAnalysis = 'Directional image analysis',
  PoseEstimation = 'Pose estimation',
  PoseInformation = 'Pose information',
  PoseDetection = 'Pose detection',
  OrientationAnalysis = 'Orientation analysis',
  SceneReconstruction = 'Scene reconstruction',
  Reconstruction3d = '3d reconstruction',
  ModelGeneration3d = '3d model generation',
  MorphologicalReconstruction = 'Morphological reconstruction',
  DepthEstimation = 'Depth estimation',
  CurvatureEstimation = 'Curvature estimation',
  ShadingEstimation = 'Shading estimation',
  Modelling = 'Modelling',
  Simulation = 'Simulation',
  Visualization = 'Visualization',
  Rendering = 'Rendering',
  StatisticsMeasurement = 'Statistics measurement',
  QualityMetricMeasurement = 'Quality metric measurement',
  DistributionMeasurements = 'Distribution measurements',
  ImageQualityAssessment = 'Image quality assessment',
  MeshGeneration = 'Mesh generation',
  Voxelization = 'Voxelization',
  SurfaceParameterisation = 'Surface parameterisation',
  MorphologicalAnalysis = 'Morphological analysis',
  FeatureDetection = 'Feature detection',
  Tracking = 'Tracking',
  VisualQuestionAnswering = 'Visual question answering',
}

export enum SoftwareRequirementsEnum {
    PyTorch_2_2 = 'PyTorch 2.2',
    PyTorch_2_1 = 'PyTorch 2.1',
    PyTorch_2_0 = 'PyTorch 2.0',
    PyTorch_1_13 = 'PyTorch 1.13',
    Tensorflow_2_15 = 'Tensorflow 2.15',
    Tensorflow_2_4 = 'Tensorflow 2.4',
    Tensorflow_2_2 = 'Tensorflow 2.2',
    Tensorflow_2_0 = 'Tensorflow 2.0',
    Tensorflow_1_8 = 'Tensorflow 1.8',
    Tensorflow_1_5 = 'Tensorflow 1.5',
    Tensorflow_1_4 = 'Tensorflow 1.4',
    CUDA_11_8 = 'CUDA 11.8',
    CUDA_12_1 = 'CUDA 12.1',
    CUDA_10_1 = 'CUDA 10.1',
    CUDA_9_0 = 'CUDA 9.0',
    None = 'None',
  }

export enum ComputerLanguageEnum {
  Python = 'Python',
  Scala = 'Scala',
  Java = 'Java',
  JavaScript = 'JavaScript',
  GoLang = 'GoLang',
  Csharp = 'C#',
  C = 'C',
  Bash = 'bash',
  Shell = 'shell',
  R = 'R',
  Rust = 'Rust',
  Cplusplus = 'C++',
  MatLab = 'MATLAB',
}

export enum FairLevelEnum {
  FairLevel1 = 'Fair level 1',
  FairLevel2 = 'Fair level 2', 
  FairLevel3 = 'Fair level 3', 
  FairLevel4 = 'Fair level 4',   
  FairLevel5 = 'Fair level 5'
}

export const FAIR_LEVEL_ORDER: Record<string, number> = {
  'Fair level 5': 5,
  'Fair level 4': 4,
  'Fair level 3': 3,
  'Fair level 2': 2,
  'Fair level 1': 1,
}


export enum HostTypeEnum {
  PlazaGradioApplication = 'plaza-gradio-application',
  RenkuProject = 'renku-project',
  GoogleColab = 'google-colab',
  Wasm = 'wasm',
  Other = 'other',
}

export enum FileFormatEnum {
  DICOM = 'DICOM (Digital Imaging and Communications in Medicine)',
  NIfTI = 'NIfTI (Neuroimaging Informatics Technology Initiative)',
  MINC = 'MINC (Medical Imaging NetCDF)',
  NRRD = 'NRRD (Nearly Raw Raster Data)',
  HDF5 = 'HDF5 (Hierarchical Data Format)',
  Parquet = 'Parquet',
  CSV_TSV = 'CSV/TSV (Tabular Data)',
  JSON_XML = 'JSON/XML (Structured Data Formats)',
  JPEG_PNG_TIFF = 'JPEG/PNG/TIFF (Standard Image Formats)',
  RAW = 'RAW (Unprocessed Binary Data)',
  Other = 'Other',
}
