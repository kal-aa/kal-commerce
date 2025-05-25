import { formatDistanceToNow } from "date-fns";

// Round the No. in to two decimals
export function round(num: number) {
  return (Math.round(num * 100) / 100).toFixed(2);
}

export function formatTime(date: Date) {
  return formatDistanceToNow(date, { addSuffix: true });
}
