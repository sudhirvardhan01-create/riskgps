import {
  createQuestionnaire,
  deleteQuestionnaire,
  fetchAllQuestionnaire,
  updateQuestionnaire,
  updateQuestionnaireStatus,
} from "@/pages/api/questionnaire";
import { QuestionnaireData } from "@/types/questionnaire";

export const QuestionnaireService = {
  fetch: (
    assetCategory: string,
    page: number,
    limit: number,
    searchPattern?: string,
    sort?: string,
    statusFilter?: string[]
  ) =>
    fetchAllQuestionnaire(
      assetCategory,
      page,
      limit,
      searchPattern,
      sort,
      statusFilter
    ),
  create: (data: QuestionnaireData) => createQuestionnaire(data),
  update: (id: string, data: QuestionnaireData) =>
    updateQuestionnaire(id, data),
  delete: (id: string, assetCategory: string) =>
    deleteQuestionnaire(id, assetCategory),
  updateStatus: (id: string, status: string) =>
    updateQuestionnaireStatus(id, status),
};
