import { useEffect, useState } from "react";
import { getOrganizationById } from "@/services/organizationService";
import { Organization } from "@/types/organization";

interface UseOrganizationReturn {
  organization: Organization | null;
  loading: boolean;
  error: string | null;
}

export const useOrganization = (orgId: string | string[] | undefined): UseOrganizationReturn => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganization = async () => {
      if (!orgId) return;

      setLoading(true);
      setError(null);
      
      try {
        const apiResponse = await getOrganizationById(orgId as string);

        const transformedOrg: Organization = {
          id: apiResponse.data.organizationId,
          name: apiResponse.data.name,
          orgId: apiResponse.data.organizationId,
          orgCode: apiResponse.data.orgCode,
          orgImage: "/orgImage.png",
          tags: {
            industry: apiResponse.data.industryVertical || "Unknown",
            size: apiResponse.data.numberOfEmployees < 500
              ? "Small (< 500 Employees)"
              : apiResponse.data.numberOfEmployees < 2000
                ? "Medium (500-2000 Employees)"
                : "Large (> 2000 Employees)",
          },
          members: {
            avatars: [], // Empty array - API doesn't return member data
            additionalCount: 0,
          },
          businessUnits: apiResponse.data.businessUnits || ["-", "-", "-"],
          status: apiResponse.data.isDeleted ? "disabled" : "active",
          lastUpdated: apiResponse.data.modifiedDate
            ? new Date(apiResponse.data.modifiedDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          createdDate: apiResponse.data.createdDate || "-",
          modifiedDate: apiResponse.data.modifiedDate || "-",
          createdBy: apiResponse.data.createdBy || "-",
          details: {
            industryVertical: apiResponse.data.industryVertical || "-",
            regionOfOperation: apiResponse.data.regionOfOperation || "-",
            employeeCount: apiResponse.data.numberOfEmployees || "-",
            cisoName: apiResponse.data.cisoName || "-",
            cisoEmail: apiResponse.data.cisoEmail || "-",
            annualRevenue: apiResponse.data.annualRevenue
              ? `$ ${parseInt(apiResponse.data.annualRevenue).toLocaleString()}`
              : "-",
            riskAppetite: apiResponse.data.riskAppetite
              ? `$ ${parseInt(apiResponse.data.riskAppetite).toLocaleString()}`
              : "-",
            cybersecurityBudget: apiResponse.data.cybersecurityBudget
              ? `$ ${parseInt(apiResponse.data.cybersecurityBudget).toLocaleString()}`
              : "-",
            insuranceCoverage: apiResponse.data.insuranceCoverage
              ? `$ ${parseInt(apiResponse.data.insuranceCoverage).toLocaleString()}`
              : "-",
            insuranceCarrier: apiResponse.data.insuranceCarrier || "-",
            claimsCount: apiResponse.data.numberOfClaims?.toString() || "-",
            claimsValue: apiResponse.data.claimsValue
              ? `$ ${parseInt(apiResponse.data.claimsValue).toLocaleString()}`
              : "-",
            regulators: apiResponse.data.regulators || "-",
            regulatoryRequirements: apiResponse.data.regulatoryRequirements || "-",
            additionalInformation: apiResponse.data.additionalInformation || "-",
            recordTypes: apiResponse.data.recordTypes || ["-", "-", "-"],
            piiRecordsCount: apiResponse.data.piiRecordsCount?.toString() || "-",
            pfiRecordsCount: apiResponse.data.pfiRecordsCount?.toString() || "-",
            phiRecordsCount: apiResponse.data.phiRecordsCount?.toString() || "-",
            governmentRecordsCount: apiResponse.data.governmentRecordsCount?.toString() || "-",
            certifications: apiResponse.data.certifications || ["-"],
            intellectualPropertyPercentage: apiResponse.data.intellectualPropertyPercentage?.toString() || "-",
          },
        };

        setOrganization(transformedOrg);
      } catch (err) {
        console.error("Failed to load organization:", err);
        setError(err instanceof Error ? err.message : "Failed to load organization");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [orgId]);

  return { organization, loading, error };
};
