/**
 * Mouse strain information from API
 */
export interface MouseStrain {
  id: number;
  mouse_strain_name: string;
  mouse_strain_description: string;
}

/**
 * Cell line information from API
 */
export interface CellLine {
  id: number;
  cell_line_name: string;
  vendor_name: string;
}

export type DrugDropdownOption = {
  id: number;
  drug_name: string;
  om_number: string;
  drug_display_name: string;
};
