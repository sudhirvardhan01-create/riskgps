export interface AssetAttributes {
  meta_data_key_id: number | null;
  values: string[];
}

export interface AssetForm {
  id? : number;
  asset_code?: string;
  assetName: string;
  assetCategory?: string;
  assetOwner?: string;
  assetITOwner?: string;
  isThirdPartyManagement?: boolean | null;
  thirdPartyName?: string;
  thirdPartyLocation?: string;
  hosting?: string;
  hostingFacility?: string;
  cloudServiceProvider?: string[];
  geographicLocation?: string;
  isRedundancy?: boolean | null;
  databases?: string;
  isNetworkSegmentation?: boolean | null;
  networkName?: string;
  related_processes?: number[];
  attributes?: AssetAttributes[];
  lastUpdated?: Date;
  createdAt?: Date;
  status?: string;
}
