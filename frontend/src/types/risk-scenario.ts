
export interface RiskScenarioAttributes {
  meta_data_key_id: number | null;
  values: string[];
}

export interface RiskScenarioData {
  id? : number;
  risk_code?: string;
  riskScenario: string;
  riskStatement: string;
  riskDescription: string;
  industry?: string[]
  tags?: number;
  related_processes?: number[]| { process_id: number; [key: string]: any }[];
  assets?: number;
  threats?: number;
  riskField1?: string;
  riskField2?: string;
  attributes?: RiskScenarioAttributes[];
  lastUpdated?: string;
  status?: string;
}
