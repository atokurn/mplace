"use client";

import React, { createContext, useContext, ReactNode } from 'react';

// Define feature flags interface
export interface FeatureFlags {
  advancedFiltering: boolean;
  columnPinning: boolean;
  bulkActions: boolean;
  exportData: boolean;
  realTimeUpdates: boolean;
  advancedSorting: boolean;
  customViews: boolean;
  dataVisualization: boolean;
}

// Default feature flags
const defaultFeatureFlags: FeatureFlags = {
  advancedFiltering: true,
  columnPinning: true,
  bulkActions: true,
  exportData: true,
  realTimeUpdates: false,
  advancedSorting: true,
  customViews: false,
  dataVisualization: true,
};

// Context interface
interface FeatureFlagsContextType {
  flags: FeatureFlags;
  isEnabled: (flag: keyof FeatureFlags) => boolean;
  updateFlag: (flag: keyof FeatureFlags, value: boolean) => void;
}

// Create context
const FeatureFlagsContext = createContext<FeatureFlagsContextType | undefined>(undefined);

// Provider props
interface FeatureFlagsProviderProps {
  children: ReactNode;
  initialFlags?: Partial<FeatureFlags>;
}

// Provider component
export function FeatureFlagsProvider({ 
  children, 
  initialFlags = {} 
}: FeatureFlagsProviderProps) {
  const [flags, setFlags] = React.useState<FeatureFlags>({
    ...defaultFeatureFlags,
    ...initialFlags,
  });

  const isEnabled = React.useCallback(
    (flag: keyof FeatureFlags): boolean => {
      return flags[flag];
    },
    [flags]
  );

  const updateFlag = React.useCallback(
    (flag: keyof FeatureFlags, value: boolean) => {
      setFlags(prev => ({
        ...prev,
        [flag]: value,
      }));
    },
    []
  );

  const contextValue = React.useMemo(
    () => ({
      flags,
      isEnabled,
      updateFlag,
    }),
    [flags, isEnabled, updateFlag]
  );

  return (
    <FeatureFlagsContext.Provider value={contextValue}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

// Hook to use feature flags
export function useFeatureFlags(): FeatureFlagsContextType {
  const context = useContext(FeatureFlagsContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider');
  }
  return context;
}

// Hook to check if a specific feature is enabled
export function useFeatureFlag(flag: keyof FeatureFlags): boolean {
  const { isEnabled } = useFeatureFlags();
  return isEnabled(flag);
}