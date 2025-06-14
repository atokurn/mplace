import { CommandIcon, FileSpreadsheetIcon } from "lucide-react";

export type FlagConfig = typeof flagConfig;

export const flagConfig = {
  featureFlags: [
    {
      label: "Advanced filters",
      value: "advancedFilters" as const,
      icon: FileSpreadsheetIcon,
      description: "Airtable like advanced filters for filtering products.",
    },
    {
      label: "Command filters",
      value: "commandFilters" as const,
      icon: CommandIcon,
      description: "Linear like command palette for filtering products.",
    },
  ],
};