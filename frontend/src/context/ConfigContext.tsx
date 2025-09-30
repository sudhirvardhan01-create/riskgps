"use client";

import { MetaDataService } from "@/services/metaDataService";
import { MetaData } from "@/types/meta-data";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ConfigContextType {
  metadata: MetaData[];
  setMetadata: React.Dispatch<React.SetStateAction<MetaData[]>>;
  fetchMetadataByKey: (key: string) => MetaData;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [metadata, setMetadata] = useState<MetaData[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const meta = await MetaDataService.fetch(0, -1);
        setMetadata(meta?.data ?? []);
      } catch (err) {
        console.log("Error while fetching metadata", err);
      }
    })();
  }, []);

  const fetchMetadataByKey = (key: string) => {
    const data: MetaData | undefined = metadata?.find(
      (item) => item.name.toLowerCase().trim() === key.toLowerCase().trim()
    );
    if (!data) throw new Error("No metadata matched with the entered key");
    return data;
  };

  return (
    <ConfigContext.Provider
      value={{ metadata, setMetadata, fetchMetadataByKey }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error("useConfig must be used within ConfigProvider");
  return context;
};
