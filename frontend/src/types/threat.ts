export interface ThreatForm {
  id?: number;
  platforms: string[];
  mitreTechniqueId: string;
  mitreTechniqueName: string;
  ciaMapping: string[];
  subTechniqueId?: string;
  subTechniqueName?: string;
  mitreControlId: string;
  mitreControlName: string;
  mitreControlType: string;
  mitreControlDescription?: string;
  bluOceanControlDescription?: string;
  status?: string;
  updatedAt?: Date;
  createdAt?: Date;
}
