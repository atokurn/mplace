"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RecentSale {
  id: string;
  name: string;
  email: string;
  avatar: string;
  amount: number;
}

interface RecentSalesProps {
  data: RecentSale[];
}

export function RecentSales({ data }: RecentSalesProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p className="text-muted-foreground">No recent sales data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {data.map((sale) => (
        <div key={sale.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={sale.avatar} alt={sale.name} />
            <AvatarFallback>
              {sale.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none truncate max-w-[150px]" title={sale.name}>{sale.name}</p>
            <p className="text-sm text-muted-foreground truncate max-w-[150px]" title={sale.email}>{sale.email}</p>
          </div>
          <div className="ml-auto font-medium">
            +${sale.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      ))}
    </div>
  );
}