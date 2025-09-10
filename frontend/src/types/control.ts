export interface ControlForm {
  id?: number;
  mitreControlId: string;
  mitreControlName: string;
  mitreControlType: string;
  mitreControlDescription?: string;
  bluOceanControlDescription?: string;
  subControls?: {
    mitreTechniqueId: string;
    mitreTechniqueName: string;
    subTechniqueId: string;
    subTechniqueName: string;
    mitreControlDescription: string;
    bluOceanControlDescription: string;
  }[];
  status?: string;
  updated_at?: Date;
  created_at?: Date;
}

export interface ControlFrameworkForm {
  id?: number;
  framework: string;
  frameWorkControlCategoryId: string;
  frameWorkControlCategory: string;
  frameWorkControlSubCategoryId: string;
  frameWorkControlSubCategory: string;
  status?: string;
  updated_at?: Date;
  created_at?: Date;
}
