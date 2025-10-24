import { QuestionnaireData } from "@/types/questionnaire";

export const fetchAllQuestionnaire = async (
  assetCategory: string,
  page: number,
  limit: number,
  searchPattern?: string,
  sort?: string,
  statusFilter?: string[]
) => {
  const [sortBy, sortOrder] = (sort ?? "").split(":");
  const params = new URLSearchParams();
  params.append("assetCategory", assetCategory);
  params.append("page", JSON.stringify(page));
  params.append("limit", JSON.stringify(limit));
  params.append("search", searchPattern ?? "");
  params.append("sort_by", sortBy);
  params.append("sort_order", sortOrder);

  if (statusFilter && statusFilter?.length > 0) {
    const joinedStatusFilter = statusFilter.join(",");
    params.append("status", joinedStatusFilter);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/questionnaire?${params}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }
  const res = await response.json();
  return res.result;
};

export const createQuestionnaire = async (data: QuestionnaireData) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/questionnaire`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  const res = await response.json();
  if (!response.ok) {
    throw new Error(res.message || "Failed to create question");
  }
  return res.data;
};

export const updateQuestionnaire = async (
  id: string,
  data: QuestionnaireData
) => {
  if (!id) {
    throw new Error("Failed to perform the operation, invalid arguments");
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/questionnaire/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update question");
  }
  const res = await response.json();
  return res.data;
};

export const deleteQuestionnaire = async (
  id: string,
  assetCategory: string
) => {
  if (!id || !assetCategory) {
    throw new Error("Failed to perform the operation, invalid arguments");
  }
  const reqBody = { assetCategory };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/questionnaire/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete the question");
  }
  const res = await response.json();
  return res.data;
};

export const updateQuestionnaireStatus = async (id: string, status: string) => {
  if (!id || !status) {
    throw new Error("Failed to perform the operation, invalid arguments");
  }
  const reqBody = { status };
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/library/questionnaire/update-status/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update the status of question");
  }
  const res = await response.json();
  return res.message;
};
