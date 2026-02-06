import { createContext, useContext, ReactNode } from "react";
import { LabirintoModo } from "../components/LabirintoModoSelector";

export interface LabirintoConfig {
  modo: LabirintoModo;
  clienteId?: string;
  sessionCaseId?: string;
  terapeutaId?: string;
}

interface LabirintoContextValue {
  config: LabirintoConfig;
  isProfessional: boolean;
}

const LabirintoContext = createContext<LabirintoContextValue | null>(null);

export function LabirintoProvider({ 
  children, 
  config 
}: { 
  children: ReactNode; 
  config: LabirintoConfig;
}) {
  const value: LabirintoContextValue = {
    config,
    isProfessional: config.modo === "profissional",
  };

  return (
    <LabirintoContext.Provider value={value}>
      {children}
    </LabirintoContext.Provider>
  );
}

export function useLabirintoContext() {
  const context = useContext(LabirintoContext);
  if (!context) {
    throw new Error("useLabirintoContext must be used within LabirintoProvider");
  }
  return context;
}
