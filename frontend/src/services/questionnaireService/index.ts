import {
  createQuestionnaire,
  deleteQuestionnaire,
  fetchAllQuestionnaire,
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
  delete: (id: string, assetCategory: string) =>
    deleteQuestionnaire(id, assetCategory),
  updateStatus: (id: string, status: string) =>
    updateQuestionnaireStatus(id, status),
};
