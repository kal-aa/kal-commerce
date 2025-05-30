"use client";

import {
  startTransition,
  useCallback,
  useMemo,
  useOptimistic,
  useState,
} from "react";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { useSWRConfig } from "swr";
import { refundOrder, removeOrderAction } from "@/app/actions";
import { updateQueryParam } from "@/app/utils/reuses";
import { OrderAlongWithProduct } from "@/app/types/types";
import OrderCard from "./OrderCard";

function OrderActions({
  orders,
  isProcessingSection = true,
}: {
  orders: OrderAlongWithProduct[];
  isProcessingSection: boolean;
}) {
  const [optimisticOrders, setOptimisticOrders] = useOptimistic(orders);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const pendingPage = Number(searchParams.get("pendingPage")) || 1;
  const processingPage = Number(searchParams.get("processingPage")) || 1;

  // Handle Remove order
  const removeOrder = useCallback(
    async (orderId: string, action: string) => {
      if (isProcessingSection || !orderId || !action) return;

      let leftOrders: OrderAlongWithProduct[];
      if (action === "removeAll") {
        leftOrders = optimisticOrders.filter((order) => order.id !== orderId);
      } else {
        leftOrders = optimisticOrders.map((order) =>
          order.id === orderId
            ? { ...order, selectedQuantity: order.selectedQuantity - 1 }
            : order
        );
      }

      startTransition(() => {
        setOptimisticOrders(leftOrders);
      });

      const response = await removeOrderAction(orderId, action);
      if (response?.success === true) {
        mutate("/api/order-count");
        if (pendingPage > 1 && leftOrders.length === 0)
          updateQueryParam(
            "pendingPage",
            String(pendingPage - 1),
            router,
            searchParams
          );
      }
    },
    [
      router,
      searchParams,
      isProcessingSection,
      setOptimisticOrders,
      optimisticOrders,
      mutate,
      pendingPage,
    ]
  );

  // Handle refund action
  const handleCancel = useCallback(
    async (orderId: string, isRefundable: boolean) => {
      if (!isProcessingSection) return;
      if (!isRefundable) {
        alert("This order is not refundable.");
        return;
      }

      setLoadingId(orderId);
      try {
        const { success, refund, paymentDate } = await refundOrder(orderId);

        if (success && refund) {
          const amount = (refund.amount / 100).toFixed(2);
          toast.success("Refund successful!");
          setTimeout(() => {
            toast.info(
              `Amount refunded: ${amount} ${refund.currency.toUpperCase()}`
            );
          }, 2000);

          const leftOrders = optimisticOrders.filter(
            (order) =>
              order.paymentDate?.getTime() !== new Date(paymentDate).getTime()
          );

          startTransition(() => {
            setOptimisticOrders(leftOrders);
          });

          if (processingPage > 1 && leftOrders.length === 0)
            updateQueryParam(
              "processingPage",
              String(processingPage - 1),
              router,
              searchParams
            );
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Refund failed");
      } finally {
        setLoadingId(null);
      }
    },
    [
      router,
      searchParams,
      isProcessingSection,
      processingPage,
      setOptimisticOrders,
      optimisticOrders,
    ]
  );

  // Memorize the map return
  const orderCards = useMemo(
    () =>
      optimisticOrders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          isProcessingSection={isProcessingSection}
          loadingId={loadingId}
          handleCancel={handleCancel}
          removeOrder={removeOrder}
        />
      )),
    [
      optimisticOrders,
      isProcessingSection,
      loadingId,
      handleCancel,
      removeOrder,
    ]
  );

  return orderCards;
}

export default OrderActions;
