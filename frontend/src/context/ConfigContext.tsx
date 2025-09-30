"use client";

import { MetaData } from "@/types/meta-data";
import React, { createContext, useContext, useState } from "react";

interface ConfigContextType {
  metadata: MetaData[];
  setMetadata: React.Dispatch<React.SetStateAction<MetaData[]>>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [metadata, setMetadata] = useState<MetaData[]>([]);

  return (
    <ConfigContext.Provider value={{ metadata, setMetadata }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error("useConfig must be used within ConfigProvider");
  return context;
};
