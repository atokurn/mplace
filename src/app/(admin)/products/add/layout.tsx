'use client';

import * as React from "react";

interface AddProductLayoutProps {
  children: React.ReactNode;
}

export default function AddProductLayout({ children }: AddProductLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}