import React, { createContext, useContext, useState, useCallback } from 'react';
import { PortalType } from '@/types/portal';

interface AdminPreviewContextType {
  // Preview mode state
  isPreviewMode: boolean;
  previewPortal: PortalType | null;
  
  // Actions
  enablePreviewMode: (portal: PortalType) => void;
  disablePreviewMode: () => void;
  togglePreviewMode: (portal?: PortalType) => void;
  
  // Utility to get effective portal for access checks
  getEffectivePortal: (actualPortal: PortalType) => PortalType;
}

const AdminPreviewContext = createContext<AdminPreviewContextType | undefined>(undefined);

export function AdminPreviewProvider({ children }: { children: React.ReactNode }) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewPortal, setPreviewPortal] = useState<PortalType | null>(null);

  const enablePreviewMode = useCallback((portal: PortalType) => {
    setIsPreviewMode(true);
    setPreviewPortal(portal);
  }, []);

  const disablePreviewMode = useCallback(() => {
    setIsPreviewMode(false);
    setPreviewPortal(null);
  }, []);

  const togglePreviewMode = useCallback((portal?: PortalType) => {
    if (isPreviewMode) {
      disablePreviewMode();
    } else if (portal) {
      enablePreviewMode(portal);
    }
  }, [isPreviewMode, enablePreviewMode, disablePreviewMode]);

  const getEffectivePortal = useCallback((actualPortal: PortalType): PortalType => {
    // Only admin can use preview mode
    if (actualPortal !== 'admin') return actualPortal;
    
    // If preview mode is active, return the simulated portal
    if (isPreviewMode && previewPortal) {
      return previewPortal;
    }
    
    return actualPortal;
  }, [isPreviewMode, previewPortal]);

  return (
    <AdminPreviewContext.Provider
      value={{
        isPreviewMode,
        previewPortal,
        enablePreviewMode,
        disablePreviewMode,
        togglePreviewMode,
        getEffectivePortal,
      }}
    >
      {children}
    </AdminPreviewContext.Provider>
  );
}

export function useAdminPreview() {
  const context = useContext(AdminPreviewContext);
  if (context === undefined) {
    throw new Error('useAdminPreview must be used within an AdminPreviewProvider');
  }
  return context;
}

// Optional hook that returns undefined if not in provider (for non-admin pages)
export function useAdminPreviewOptional() {
  return useContext(AdminPreviewContext);
}
