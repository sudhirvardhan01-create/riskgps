interface AssessmentData {
    assessmentName: string;
    assessmentDesc: string;
    orgId: string;
    orgName: string;
    orgDesc: string;
    businessUnitId: string;
    businessUnitName: string;
    businessUnitDesc: string;
    runId: string;
    userId: string;
}

export const saveAssessment = async (data: AssessmentData ) => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/assessment`,
        {
            method: "POST",
            body: JSON.stringify(data),
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