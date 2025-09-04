export interface NISTControls {
  frameWorkControlCategoryId: string;
  frameWorkControlCategory: string;
  frameWorkControlSubCategoryId: string;
  frameWorkControlSubCategory: string;
}

export interface ControlForm {
  id?: number;
  mitreControlId: string;
  mitreControlName: string;
  mitreControlType: string;
  subControls?: {
    mitreControlDescription: string;
    bluOceanControlDescription: string;
  }[];
  nistControls: NISTControls[];
  status?: string;
  updated_at?: Date;
  created_at?: Date;
}
