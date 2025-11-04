export const sheetOptionsMap: Record<
  string,
  { title: string; options: string[] }
> = {
  biod: {
    title: "BioD Sheets",
    options: [
      "Organ Sheet",
      "AGC Sheet",
      "Graph",
      "Cage Cards",
      "Cells & Drugs Prep",
    ],
  },
  "dose-range": {
    title: "Dose Range Finding Sheets",
    options: ["Weight Sheet", "Hematology", "Blood Chemistry", "Necropsy"],
  },
  toxicity: {
    title: "Toxicity Sheets",
    options: ["Weight Sheet", "Hematology", "Blood Chemistry", "Necropsy"],
  },
  efficacy: {
    title: "Efficacy Sheets",
    options: ["Weight Sheet", "Callipering"],
  },
  "model-study": {
    title: "Model Study Sheets",
    options: ["Weight Sheet", "Callipering"],
  },
};
