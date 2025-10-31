export interface Experiment {
  id: string;
  name: string;
  cellLines: string[];
  isotope: string;
  projectId: string;
  studyType: string;
}

export const strainOptions = [
  { value: "BALB/c", label: "BALB/c" },
  { value: "C57BL/6", label: "C57BL/6" },
  { value: "NOD/SCID", label: "NOD/SCID" },
];

export const cellsInjectedOptions = [
  { value: "1x10^6", label: "1x10^6" },
  { value: "2x10^6", label: "2x10^6" },
  { value: "5x10^6", label: "5x10^6" },
];

export const vehicleOptions = [
  { value: "PBS", label: "PBS" },
  { value: "Saline", label: "Saline" },
  { value: "DMSO", label: "DMSO" },
];

export const doseTypeOptions = [
  { value: "Single Dose", label: "Single Dose" },
  { value: "Multiple Dose", label: "Multiple Dose" },
  { value: "Escalating Dose", label: "Escalating Dose" },
];

export const drugTypeOptions = [
  { value: "Antibody", label: "Antibody" },
  { value: "Small Molecule", label: "Small Molecule" },
  { value: "Peptide", label: "Peptide" },
];
export const cellLineOptions = [
  { value: "HeLa", label: "HeLa" },
  { value: "MCF-7", label: "MCF-7" },
  { value: "A549", label: "A549" },
  { value: "No Cells", label: "No Cells" },
];

export const isotopeOptions = [
  { value: "I-131", label: "I-131" },
  { value: "Tc-99m", label: "Tc-99m" },
];

export const specialisationOptions = [
  { value: "Preclinic", label: "Preclinic" },
  { value: "CMC", label: "CMC" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Hotlab", label: "Hotlab" },
];

export const studyTypeOptions = [
  { value: "Biodistribution", label: "Biodistribution" },
  { value: "Dose Range Finding", label: "Dose Range Finding" },
  { value: "Toxicity", label: "Toxicity" },
  { value: "Efficacy", label: "Efficacy" },
  { value: "Model Study", label: "Model Study" },
];

export const getDataTypeOptions = (studyType: string) => {
  switch (studyType) {
    case "Biodistribution":
      return [
        { value: "ProtXX", label: "ProtXX" },
        { value: "Callipering", label: "Callipering" },
        { value: "Cells & Drugs Prep", label: "Cells & Drugs Prep" },
        { value: "Cage Cards", label: "Cage Cards" },
        { value: "Weight Sheet", label: "Weight Sheet" },
      ];
    case "Dose Range Finding":
      return [
        { value: "Cage Cards", label: "Cage Cards" },
        { value: "Weight Sheet", label: "Weight Sheet" },
        { value: "Callipering", label: "Callipering" },
      ];
    case "Toxicity":
      return [
        { value: "Cage Cards", label: "Cage Cards" },
        { value: "Weight Sheet", label: "Weight Sheet" },
        { value: "Histopathology", label: "Histopathology" },
      ];
    case "Efficacy":
      return [
        { value: "Cage Cards", label: "Cage Cards" },
        { value: "Callipering", label: "Callipering" },
        { value: "Weight Sheet", label: "Weight Sheet" },
      ];
    case "Model Study":
      return [
        { value: "Cage Cards", label: "Cage Cards" },
        { value: "Study Protocol", label: "Study Protocol" },
        { value: "Model Validation", label: "Model Validation" },
      ];
    default:
      return [
        { value: "Cage Cards", label: "Cage Cards" },
        { value: "Callipering", label: "Callipering" },
      ];
  }
};

export const experiments: Experiment[] = [
  {
    id: "1",
    name: "BioD_Proj1_1",
    cellLines: ["MCF-7"],
    isotope: "I-131",
    projectId: "1",
    studyType: "Biodistribution",
  },
  {
    id: "2",
    name: "BioD_Proj1_2",
    cellLines: ["A549"],
    isotope: "Tc-99m",
    projectId: "1",
    studyType: "Biodistribution",
  },
  {
    id: "3",
    name: "BioD_Proj1_3",
    cellLines: ["SKBR-3"],
    isotope: "I-131",
    projectId: "1",
    studyType: "Biodistribution",
  },
  {
    id: "4",
    name: "BioD_Proj1_4",
    cellLines: ["HeLa"],
    isotope: "Tc-99m",
    projectId: "1",
    studyType: "Biodistribution",
  },
  {
    id: "5",
    name: "BioD_Proj1_5",
    cellLines: ["PC-3"],
    isotope: "I-131",
    projectId: "1",
    studyType: "Biodistribution",
  },
  // Biodistribution - Project 2
  {
    id: "6",
    name: "BioD_Proj2_1",
    cellLines: ["MCF-7"],
    isotope: "I-131",
    projectId: "2",
    studyType: "Biodistribution",
  },
  {
    id: "7",
    name: "BioD_Proj2_2",
    cellLines: ["A549"],
    isotope: "Tc-99m",
    projectId: "2",
    studyType: "Biodistribution",
  },
  {
    id: "8",
    name: "BioD_Proj2_3",
    cellLines: ["SKBR-3"],
    isotope: "I-131",
    projectId: "2",
    studyType: "Biodistribution",
  },
  {
    id: "9",
    name: "BioD_Proj2_4",
    cellLines: ["HeLa"],
    isotope: "Tc-99m",
    projectId: "2",
    studyType: "Biodistribution",
  },
  {
    id: "10",
    name: "BioD_Proj2_5",
    cellLines: ["PC-3"],
    isotope: "I-131",
    projectId: "2",
    studyType: "Biodistribution",
  },
  // Dose Range Finding - Project 1
  {
    id: "41",
    name: "DRF_Proj1_1",
    cellLines: ["MCF-7"],
    isotope: "I-131",
    projectId: "1",
    studyType: "Dose Range Finding",
  },
  {
    id: "42",
    name: "DRF_Proj1_2",
    cellLines: ["A549"],
    isotope: "Tc-99m",
    projectId: "1",
    studyType: "Dose Range Finding",
  },
  {
    id: "43",
    name: "DRF_Proj1_3",
    cellLines: ["SKBR-3"],
    isotope: "I-131",
    projectId: "1",
    studyType: "Dose Range Finding",
  },

  // Toxicity - Project 1
  {
    id: "11",
    name: "Tox_Proj1_1",
    cellLines: ["MCF-7"],
    isotope: "I-131",
    projectId: "1",
    studyType: "Toxicity",
  },
  {
    id: "12",
    name: "Tox_Proj1_2",
    cellLines: ["A549"],
    isotope: "Tc-99m",
    projectId: "1",
    studyType: "Toxicity",
  },
  {
    id: "13",
    name: "Tox_Proj1_3",
    cellLines: ["SKBR-3"],
    isotope: "I-131",
    projectId: "1",
    studyType: "Toxicity",
  },
  {
    id: "14",
    name: "Tox_Proj1_4",
    cellLines: ["HeLa"],
    isotope: "Tc-99m",
    projectId: "1",
    studyType: "Toxicity",
  },
  {
    id: "15",
    name: "Tox_Proj1_5",
    cellLines: ["PC-3"],
    isotope: "I-131",
    projectId: "1",
    studyType: "Toxicity",
  },
  // Toxicity - Project 2
  {
    id: "16",
    name: "Tox_Proj2_1",
    cellLines: ["MCF-7"],
    isotope: "I-131",
    projectId: "2",
    studyType: "Toxicity",
  },
  {
    id: "17",
    name: "Tox_Proj2_2",
    cellLines: ["A549"],
    isotope: "Tc-99m",
    projectId: "2",
    studyType: "Toxicity",
  },
  {
    id: "18",
    name: "Tox_Proj2_3",
    cellLines: ["SKBR-3"],
    isotope: "I-131",
    projectId: "2",
    studyType: "Toxicity",
  },
  {
    id: "19",
    name: "Tox_Proj2_4",
    cellLines: ["HeLa"],
    isotope: "Tc-99m",
    projectId: "2",
    studyType: "Toxicity",
  },
  {
    id: "20",
    name: "Tox_Proj2_5",
    cellLines: ["PC-3"],
    isotope: "I-131",
    projectId: "2",
    studyType: "Toxicity",
  },

  // Efficacy - Project 1
  {
    id: "21",
    name: "Eff_Proj1_1",
    cellLines: ["MCF-7"],
    isotope: "I-131",
    projectId: "1",
    studyType: "Efficacy",
  },
  {
    id: "22",
    name: "Eff_Proj1_2",
    cellLines: ["A549"],
    isotope: "Tc-99m",
    projectId: "1",
    studyType: "Efficacy",
  },
  {
    id: "23",
    name: "Eff_Proj1_3",
    cellLines: ["SKBR-3"],
    isotope: "I-131",
    projectId: "1",
    studyType: "Efficacy",
  },
  {
    id: "24",
    name: "Eff_Proj1_4",
    cellLines: ["HeLa"],
    isotope: "Tc-99m",
    projectId: "1",
    studyType: "Efficacy",
  },
  {
    id: "25",
    name: "Eff_Proj1_5",
    cellLines: ["PC-3"],
    isotope: "I-131",
    projectId: "1",
    studyType: "Efficacy",
  },
  // Efficacy - Project 2
  {
    id: "26",
    name: "Eff_Proj2_1",
    cellLines: ["MCF-7"],
    isotope: "I-131",
    projectId: "2",
    studyType: "Efficacy",
  },
  {
    id: "27",
    name: "Eff_Proj2_2",
    cellLines: ["A549"],
    isotope: "Tc-99m",
    projectId: "2",
    studyType: "Efficacy",
  },
  {
    id: "28",
    name: "Eff_Proj2_3",
    cellLines: ["SKBR-3"],
    isotope: "I-131",
    projectId: "2",
    studyType: "Efficacy",
  },
  {
    id: "29",
    name: "Eff_Proj2_4",
    cellLines: ["HeLa"],
    isotope: "Tc-99m",
    projectId: "2",
    studyType: "Efficacy",
  },
  {
    id: "30",
    name: "Eff_Proj2_5",
    cellLines: ["PC-3"],
    isotope: "I-131",
    projectId: "2",
    studyType: "Efficacy",
  },

  // Model Study - Project 1
  {
    id: "31",
    name: "Model_Proj1_1",
    cellLines: ["MCF-7"],
    isotope: "I-131",
    projectId: "1",
    studyType: "Model Study",
  },
  {
    id: "32",
    name: "Model_Proj1_2",
    cellLines: ["A549"],
    isotope: "Tc-99m",
    projectId: "1",
    studyType: "Model Study",
  },
  {
    id: "33",
    name: "Model_Proj1_3",
    cellLines: ["SKBR-3"],
    isotope: "I-131",
    projectId: "1",
    studyType: "Model Study",
  },
  {
    id: "34",
    name: "Model_Proj1_4",
    cellLines: ["HeLa"],
    isotope: "Tc-99m",
    projectId: "1",
    studyType: "Model Study",
  },
  {
    id: "35",
    name: "Model_Proj1_5",
    cellLines: ["PC-3"],
    isotope: "I-131",
    projectId: "1",
    studyType: "Model Study",
  },
  // Model Study - Project 2
  {
    id: "36",
    name: "Model_Proj2_1",
    cellLines: ["MCF-7"],
    isotope: "I-131",
    projectId: "2",
    studyType: "Model Study",
  },
  {
    id: "37",
    name: "Model_Proj2_2",
    cellLines: ["A549"],
    isotope: "Tc-99m",
    projectId: "2",
    studyType: "Model Study",
  },
  {
    id: "38",
    name: "Model_Proj2_3",
    cellLines: ["SKBR-3"],
    isotope: "I-131",
    projectId: "2",
    studyType: "Model Study",
  },
  {
    id: "39",
    name: "Model_Proj2_4",
    cellLines: ["HeLa"],
    isotope: "Tc-99m",
    projectId: "2",
    studyType: "Model Study",
  },
  {
    id: "40",
    name: "Model_Proj2_5",
    cellLines: ["PC-3"],
    isotope: "I-131",
    projectId: "2",
    studyType: "Model Study",
  },
];
