import * as React from "react";
import { getOrders } from "@/app/_lib/queries/orders";
import { ordersSearchParamsCache } from "@/lib/search-params";
import { OrderTable } from "./OrderTable";

interface OrderTableWrapperProps {
  searchParams?: {
    page?: string;
    per_page?: string;
    sort?: string;
    orderNumber?: string;
    status?: string;
    paymentStatus?: string;
    operator?: string;
  };
}

export async function OrderTableWrapper({ searchParams }: OrderTableWrapperProps) {
  const search = ordersSearchParamsCache.parse(searchParams ?? {});
  const { data: orders, pageCount } = await getOrders(search);

  return <OrderTable orders={orders} pageCount={pageCount} />;
}