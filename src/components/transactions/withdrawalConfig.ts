import type {
  FetchPendingApprovalParams,
  PendingApprovalRecipient,
  PendingApprovalUser,
  Transaction,
  TransactionDetail,
} from "../../types/common.types";

/**
 * Withdrawal approval configuration.
 *
 * All withdrawal requests are held by the backend until an admin approves
 * (Paystack transfer starts) or rejects (amount + fee returned to the driver).
 *
 * ⚠️ Keep these in sync with the backend enums. If the backend uses a different
 * value for "awaiting approval", change PENDING_APPROVAL_STATUS here only.
 */
export const WITHDRAWAL_TYPE = "payout";
export const PENDING_APPROVAL_STATUS = "pending_approval";

/**
 * Extra query params for the "Withdrawal requests" queue, sent to
 * GET /business-admin/transactions/pending-approval/ (which already only
 * returns status=pending_approval). Remove `type` to show every
 * pending-approval transaction, not just driver withdrawals.
 */
export const PENDING_WITHDRAWAL_FILTERS: FetchPendingApprovalParams = {
  type: WITHDRAWAL_TYPE,
};

/* ------------------- pending-approval row normalisation ------------------- */

const asObject = <T extends object>(v: unknown): T | null =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as T) : null;

export const expandedUser = (tx?: TransactionDetail | null) => asObject<PendingApprovalUser>(tx?.user);

/** The wallet user's id whether `user` is a plain id or an expanded object. */
export const userIdOf = (tx?: TransactionDetail | null): string | undefined =>
  typeof tx?.user === "string" ? tx.user : expandedUser(tx)?.id;

/** The bank account this withdrawal is going to, if the row carries one. */
export const recipientOf = (tx?: TransactionDetail | null) =>
  asObject<PendingApprovalRecipient>(tx?.transfer_recipient);

export const walletOf = (tx?: TransactionDetail | null) => asObject<Record<string, unknown>>(tx?.wallet);

/**
 * Fill the flat list fields (user_name, user_email, user_type) from the
 * expanded `user` object so the shared table can render pending-approval rows.
 */
export const normalizePendingRow = (row: TransactionDetail): TransactionDetail => {
  const user = expandedUser(row);
  const joinedName = [user?.first_name, user?.last_name].filter(Boolean).join(" ");
  return {
    ...row,
    user_name: row.user_name || user?.full_name || joinedName || "",
    user_email: row.user_email || user?.email || "",
    user_type: row.user_type || row.user_role || user?.role || "",
  };
};

export const isWithdrawal = (tx?: Pick<Transaction, "type"> | null) =>
  tx?.type === WITHDRAWAL_TYPE;

/** Only transactions in the pending-approval state can be approved or rejected. */
export const isAwaitingApproval = (tx?: Pick<Transaction, "status"> | null) =>
  tx?.status === PENDING_APPROVAL_STATUS;

const LABELS: Record<string, string> = {
  pending_approval: "Awaiting approval",
  success: "Successful",
  successful: "Successful",
  completed: "Completed",
  pending: "Pending",
  failed: "Failed",
  expired: "Expired",
  rejected: "Declined",
  declined: "Declined",
  reversed: "Reversed",
};

export const formatStatusLabel = (status?: string) =>
  (status && LABELS[status]) || (status ? status.replace(/_/g, " ") : "N/A");

/** Chip colours shared by the table and the detail modal. */
export const statusColors = (status?: string): { bg: string; fg: string } => {
  switch (status) {
    case "success":
    case "successful":
    case "completed":
      return { bg: "rgba(52, 211, 153, 0.1)", fg: "#34D399" };
    case PENDING_APPROVAL_STATUS:
      return { bg: "rgba(96, 165, 250, 0.12)", fg: "#60A5FA" };
    case "pending":
      return { bg: "rgba(254, 185, 20, 0.1)", fg: "#FEB914" };
    default:
      return { bg: "rgba(239, 68, 68, 0.1)", fg: "#EF4444" };
  }
};

export const formatNaira = (amount: string | number | undefined) =>
  `₦${Math.abs(Number(amount) || 0).toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;
