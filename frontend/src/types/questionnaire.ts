export interface QuestionnaireData {
  questionnaireAssetControlId?: string;
  assetCategory: string;
  mitreControlId: string[];
  questionCode?: string;
  question: string;
  status?: string;
  createdDate?: Date;
  modifiedDate?: Date;
}
