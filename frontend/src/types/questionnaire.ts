export interface QuestionnaireData {
  questionnaireId?: string;
  assetCategory?: string;
  assetCategories: string[];
  mitreControlId: string[];
  questionCode?: string;
  question: string;
  status?: string;
  createdDate?: Date;
  modifiedDate?: Date;
}
