export interface ControlForm {
  id?: number;
  mitreControlId: string;
  mitreControlName: string;
  mitreControlType: string;
  mitreControlDescription: string;
  bluoceanControlDescription: string;
  nistControlCategoryId: string;
  nistControlCategory: string;
  nistControlSubcategoryId: string;
  nistControlSubcategory: string;
  status?: string;
  updated_at?: Date;
  created_at?: Date;
}
