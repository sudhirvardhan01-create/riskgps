export const getOrganization = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch login data");
  }
  return response.json();
};

export const getOrganizationProcess = async (orgId: string, buId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${orgId}/business-unit/${buId}/processes`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch login data");
  }
  return response.json();
};

export const getOrganizationRisks = async (orgId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${orgId}/risk-scenarios`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch login data");
  }
  return response.json();
};

export const getOrganizationTaxonomy = async (orgId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/organization/${orgId}/taxonomies`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch login data");
  }
  return response.json();
};
