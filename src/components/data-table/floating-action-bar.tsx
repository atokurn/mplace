"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Download,
  Upload,
  Trash2,
  Edit,
  Copy,
  Archive,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Table } from '@tanstack/react-table';

interface FloatingActionBarProps<TData> {
  table?: Table<TData>;
  onExport?: () => void;
  onImport?: () => void;
  onBulkDelete?: (selectedIds: string[]) => void;
  onBulkEdit?: (selectedIds: string[]) => void;
  onBulkArchive?: (selectedIds: string[]) => void;
  exportLabel?: string;
  importLabel?: string;
  className?: string;
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
}

export function FloatingActionBar<TData>({
  table,
  onExport,
  onImport,
  onBulkDelete,
  onBulkEdit,
  onBulkArchive,
  exportLabel = 'Export',
  importLabel = 'Import',
  className,
  position = 'bottom-center',
}: FloatingActionBarProps<TData>) {
  const selectedRows = table?.getFilteredSelectedRowModel().rows || [];
  const hasSelection = selectedRows.length > 0;
  const selectedIds = selectedRows.map(row => row.original as any).map(item => item.id);

  // Only show when items are selected
  const shouldShow = hasSelection;

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2',
    'bottom-left': 'bottom-6 left-6',
  };

  if (!shouldShow) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        'fixed z-50 flex items-center gap-2 rounded-2xl bg-[#1f1f1f] border border-[#2f2f2f] p-3 shadow-2xl backdrop-blur-sm',
        positionClasses[position],
        className
      )}
    >
      {/* Selection indicator when items are selected */}
      {hasSelection && (
        <div className="flex items-center gap-2 px-3 py-1 bg-[#00ff99]/10 rounded-lg border border-[#00ff99]/20">
          <span className="text-[#00ff99] text-sm font-medium">
            {selectedRows.length} selected
          </span>
        </div>
      )}

      {/* Bulk actions */}
      <div className="flex items-center gap-3">
        {onBulkEdit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => onBulkEdit(selectedIds)}
                variant="outline"
                size="sm"
                className="border-[#00ff99]/30 bg-[#00ff99]/10 hover:bg-[#00ff99]/20 text-[#00ff99] h-9 transition-colors duration-200"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit selected items</p>
            </TooltipContent>
          </Tooltip>
        )}

        {onBulkDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => onBulkDelete(selectedIds)}
                variant="outline"
                size="sm"
                className="border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 h-9 transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete selected items</p>
            </TooltipContent>
          </Tooltip>
        )}

        {onBulkArchive && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => onBulkArchive(selectedIds)}
                variant="outline"
                size="sm"
                className="border-[#2f2f2f] bg-[#2f2f2f]/50 hover:bg-[#2f2f2f] text-white h-9"
              >
                <Archive className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Archive selected items</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Secondary actions dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-[#2f2f2f] bg-[#2f2f2f]/50 hover:bg-[#2f2f2f] text-white h-9 px-3"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-[#1f1f1f] border-[#2f2f2f] text-white"
          >
            {onExport && (
              <DropdownMenuItem
                onClick={onExport}
                className="hover:bg-[#2f2f2f] focus:bg-[#2f2f2f]"
              >
                <Download className="w-4 h-4 mr-2" />
                {exportLabel}
              </DropdownMenuItem>
            )}
            {onImport && (
              <DropdownMenuItem
                onClick={onImport}
                className="hover:bg-[#2f2f2f] focus:bg-[#2f2f2f]"
              >
                <Upload className="w-4 h-4 mr-2" />
                {importLabel}
              </DropdownMenuItem>
            )}
            {(onExport || onImport) && <DropdownMenuSeparator className="bg-[#2f2f2f]" />}
            <DropdownMenuItem
              onClick={() => table?.toggleAllRowsSelected(false)}
              className="hover:bg-[#2f2f2f] focus:bg-[#2f2f2f]"
            >
              <Copy className="w-4 h-4 mr-2" />
              Clear Selection
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}