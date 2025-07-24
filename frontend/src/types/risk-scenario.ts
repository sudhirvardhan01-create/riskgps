
export interface RiskScenarioAttributes {
  meta_data_key: number;
  value: string[];
}

export interface RiskScenarioData {
  id? : number;
  risk_code?: string;
  riskScenario: string;
  riskStatement: string;
  riskDescription: string;
  industry?: string[]
  tags?: number;
  processes?: number;
  assets?: number;
  threats?: number;
  riskField1?: string;
  riskField2?: string;
  attributes?: RiskScenarioAttributes[];
  lastUpdated?: string;
  status?: string;
}
