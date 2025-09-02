export interface ProcessAttributes {
  meta_data_key_id: number | null;
  values: string[];
}

export interface ProcessDependency {
    sourceProcessId?: number,
    targetProcessId?: number,
    relationshipType?: string,
}

export interface ProcessData {
    id?: number,
    processCode?: string,
    processName: string,
    processDescription?: string,
    seniorExecutiveOwnerName?: string,
    seniorExecutiveOwnerEmail?: string,
    operationsOwnerName?: string,
    operationsOwnerEmail?: string,
    technologyOwnerName?: string,
    technologyOwnerEmail?: string,
    organizationalRevenueImpactPercentage?: number  // this is not used in any calculations and the value ranges from 1-100
    financialMateriality?: boolean
    thirdPartyInvolvement?: boolean,
    users?: string,
    requlatoryAndCompliance?: string[],
    criticalityOfDataProcessed?: string,
    dataProcessed?: string[],
    processDependency?: ProcessDependency[],
    status?: string,
    attributes?: ProcessAttributes[],
    industry?: string[],
    domain?: string[],
    lastUpdated?: Date
}