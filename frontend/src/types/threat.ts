export interface RelatedControlForm {
  id?: number | null;
  mitreControlId: string;
  mitreControlName: string;
  mitreControlType: string;
  mitreControlDescription?: string;
  bluOceanControlDescription?: string;
  controlPriority: number | null;
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

export interface ThreatBundleForm {
  threatBundleName: string;
  mitreThreatTechnique: {
    threatBundleId?: string;
    mitreTechniqueId: string;
    mitreTechniqueName: string;
    status?: string;
    createdDate?: Date;
    modifiedDate?: Date;
  }[];
}
