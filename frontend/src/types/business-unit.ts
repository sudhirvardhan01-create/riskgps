export interface BusinessUnitFormData {
  businessUnitName: string;
  buHead: { name: string; email: string };
  buPocBiso: { name: string; email: string };
  buItPoc: { name: string; email: string };
  buFinanceLead: { name: string; email: string };
  tags: { key: string; value: string }[];
}

export interface BusinessUnitData {
  id: string;
  businessUnitName: string;
  buCode: string;
  buSize: number;
  assessments: number;
  tags: { key: string; value: string }[];
  status: "active" | "disable";
  lastUpdated?: string;
  orgId?: string; // Add orgId field
  // Contact roles
  buHead?: { name: string; email: string };
  buPocBiso?: { name: string; email: string };
  buItPoc?: { name: string; email: string };
  buFinanceLead?: { name: string; email: string };
}
