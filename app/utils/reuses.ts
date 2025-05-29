import { formatDistanceToNow } from "date-fns";

// Round the No. in to two decimals
export function round(num: number) {
  return (Math.round(num * 100) / 100).toFixed(2);
}

export function formatTime(date: Date) {
  return formatDistanceToNow(date, { addSuffix: true });
}

// Helper funcion to check if the order is refundable
export function checkIsRefundable(
  paymentDate: Date,
  refundPeriodMs = 3 * 24 * 60 * 60 * 1000
) {
  if (!paymentDate || isNaN(paymentDate.getTime())) return false;
  return new Date() < new Date(paymentDate.getTime() + refundPeriodMs);
}

// Helper function to the refund button
export function formatRefundBatchLabel(date: Date): string {
  return (
    String(date.getUTCDate()).slice(-1) +
    String(date.getUTCHours()).slice(-1) +
    String(date.getUTCMinutes()).slice(-1) +
    String(date.getSeconds()).slice(-1)
  );
}
