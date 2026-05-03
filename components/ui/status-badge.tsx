import { cn } from "@/lib/utils";
import type { TradeStatus, ConfirmationStatus, SettlementStatus } from "@/lib/mock-data";

type Status = TradeStatus | ConfirmationStatus | SettlementStatus;

const statusConfig: Record<string, { label: string; className: string }> = {
  "Pending Validation": {
    label: "Pending",
    className: "bg-pending-muted text-pending border border-pending/20",
  },
  Approved: {
    label: "Approved",
    className: "bg-profit-muted text-profit border border-profit/20",
  },
  Confirmed: {
    label: "Confirmed",
    className: "bg-primary/10 text-primary border border-primary/20",
  },
  Settled: {
    label: "Settled",
    className: "bg-muted text-muted-foreground border border-border",
  },
  Rejected: {
    label: "Rejected",
    className: "bg-loss-muted text-loss border border-loss/20",
  },
  Pending: {
    label: "Pending",
    className: "bg-pending-muted text-pending border border-pending/20",
  },
  Sent: {
    label: "Sent",
    className: "bg-primary/10 text-primary border border-primary/20",
  },
  Matched: {
    label: "Matched",
    className: "bg-profit-muted text-profit border border-profit/20",
  },
  Disputed: {
    label: "Disputed",
    className: "bg-loss-muted text-loss border border-loss/20",
  },
  Processed: {
    label: "Processed",
    className: "bg-profit-muted text-profit border border-profit/20",
  },
  Failed: {
    label: "Failed",
    className: "bg-loss-muted text-loss border border-loss/20",
  },
};

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status] ?? { label: status, className: "bg-muted text-muted-foreground border border-border" };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", config.className)}>
      {config.label}
    </span>
  );
}
