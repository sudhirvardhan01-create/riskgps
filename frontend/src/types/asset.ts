export interface AssetAttributes {
  meta_data_key_id: number | null;
  values: string[];
}

export interface AssetForm {
  id? : number;
  assetCode?: string;
  applicationName: string;
  assetName?: string | null;
  assetCategory?: string;
  assetDescription?: string;
  applicationOwner?: string;
  applicationITOwner?: string;
  isThirdPartyManagement?: boolean | null;
  thirdPartyName?: string;
  thirdPartyLocation?: string;
  hosting?: string;
  hostingFacility?: string;
  cloudServiceProvider?: string[];
  geographicLocation?: string;
  hasRedundancy?: boolean | null;
  databases?: string;
  hasNetworkSegmentation?: boolean | null;
  networkName?: string;
  relatedProcesses?: number[];
  attributes?: AssetAttributes[];
  updatedAt?: Date;
  createdAt?: Date;
  status?: string;
  industry?: string[];
  domain?: string[];
}
