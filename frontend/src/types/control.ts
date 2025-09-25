export interface RelatedThreatForm {
  id?: number;
  mitreTechniqueId: string;
  mitreTechniqueName: string;
  subTechniqueId: string;
  subTechniqueName: string;
  mitreControlDescription: string;
  bluOceanControlDescription: string;
}

export interface ControlForm {
  id?: number;
  mitreControlId: string;
  mitreControlName: string;
  mitreControlType: string;
  mitreControlDescription?: string;
  bluOceanControlDescription?: string;
  controlPriority: number | null;
  subControls?: RelatedThreatForm[];
  status?: string;
  updated_at?: Date;
  created_at?: Date;
}

export interface ControlFrameworkForm {
  id?: number;
  frameWorkName: string;
  frameWorkControlCategoryId: string;
  frameWorkControlCategory: string;
  frameWorkControlSubCategoryId: string;
  frameWorkControlSubCategory: string;
  mitreControls: string[];
  status?: string;
  updated_at?: Date;
  created_at?: Date;
}

export interface MITREControlForm {
  id?: number;
  mitreControlId: string;
  controlPriority: number;
  mitreControlType: string;
  controlDetails: {
    mitreControlName: string;
    subControls?: RelatedThreatForm[];
  }[];
  status?: string;
  updated_at?: Date;
  created_at?: Date;
}
