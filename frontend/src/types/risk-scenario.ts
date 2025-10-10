
export interface RiskScenarioAttributes {
  meta_data_key_id: string | null;
  values: string[];
}

export interface RiskScenarioData {
  id? : number;
  risk_code?: string;
  riskScenario: string;
  riskStatement: string;
  riskDescription: string;
  ciaMapping: string[];
  industry?: string[];
  domain?: string[];
  tags?: number;
  related_processes?: number[];
  assets?: number;
  threats?: number;
  riskField1?: string;
  riskField2?: string;
  attributes?: RiskScenarioAttributes[];
  lastUpdated?: Date;
  createdAt?: Date;
  status?: string;
}
