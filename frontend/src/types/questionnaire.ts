export interface QuestionnaireData {
  questionnaireId?: string;
  assetCategory: string | string[];
  mitreControlId: string[];
  questionCode?: string;
  question: string;
  status?: string;
  createdDate?: Date;
  modifiedDate?: Date;
}
