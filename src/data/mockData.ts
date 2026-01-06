// Mock data for Move Mice functionality

export const mockMice = [
  { id: "25-03-156", label: "25-03-156" },
  { id: "25-03-184", label: "25-03-184" },
  { id: "25-03-118", label: "25-03-118" },
  { id: "25-03-147", label: "25-03-147" },
  { id: "25-03-139", label: "25-03-139" },
  { id: "25-03-123", label: "25-03-123" },
  { id: "25-03-234", label: "25-03-234" },
];

export const mockExperiments = [
  {
    id: "exp001",
    name: "EXP001_Biodistribution_MCF-7",
    cellLines: ["MCF-7"],
    isotope: "Lu-177",
    projectId: "proj001",
    studyType: "Biodistribution",
  },
  {
    id: "exp002",
    name: "EXP002_Toxicity_A549",
    cellLines: ["A549"],
    isotope: "Ac-225",
    projectId: "proj002",
    studyType: "Toxicity",
  },
  {
    id: "exp003",
    name: "EXP003_Efficacy_HeLa",
    cellLines: ["HeLa"],
    isotope: "Y-90",
    projectId: "proj003",
    studyType: "Efficacy",
  },
  {
    id: "exp004",
    name: "EXP004_DRF_PC-3",
    cellLines: ["PC-3"],
    isotope: "Lu-177",
    projectId: "proj004",
    studyType: "DRF",
  },
  {
    id: "exp005",
    name: "EXP005_Biodistribution_MDA-MB-231",
    cellLines: ["MDA-MB-231"],
    isotope: "Ac-225",
    projectId: "proj005",
    studyType: "Biodistribution",
  },
  {
    id: "exp006",
    name: "EXP006_Safety_HCT116",
    cellLines: ["HCT116"],
    isotope: "Y-90",
    projectId: "proj006",
    studyType: "Safety",
  },
  {
    id: "exp007",
    name: "EXP007_Efficacy_SKBR-3",
    cellLines: ["SKBR-3"],
    isotope: "Lu-177",
    projectId: "proj007",
    studyType: "Efficacy",
  },
];

// Study types for Create New Experiment modal
export const studyTypes = [
  { id: "biodistribution", label: "Biodistribution" },
  { id: "dose-range-finding", label: "Dose Range Finding" },
  { id: "toxicity", label: "Toxicity" },
  { id: "efficacy", label: "Efficacy" },
  { id: "model-study", label: "Model Study" },
];
