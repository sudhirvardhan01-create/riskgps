export interface RelatedControlForm {
  mitreControlId: string;
  mitreControlName: string;
  mitreControlType: string;
  mitreControlDescription?: string;
  bluOceanControlDescription?: string;
}

export interface ThreatForm {
  id?: number;
  platforms: string[];
  mitreTechniqueId: string;
  mitreTechniqueName: string;
  ciaMapping: string[];
  subTechniqueId: string;
  subTechniqueName: string;
  controls?: RelatedControlForm[];
  status?: string;
  updated_at?: Date;
  created_at?: Date;
}
