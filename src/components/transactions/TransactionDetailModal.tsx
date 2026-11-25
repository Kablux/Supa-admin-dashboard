import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  Divider,
  IconButton,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AppButton from "../common/AppButton";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { approveTransaction, rejectTransaction } from "../../api/xhrHelper";
import type { PendingApprovalRecipient, Transaction, TransactionDetail } from "../../types/common.types";
import { useTransactionDetails } from "./useTransactionDetails";
import {
  formatNaira,
  formatStatusLabel,
  expandedUser,
  isAwaitingApproval,
  isWithdrawal,
  recipientOf,
  statusColors,
  walletOf,
} from "./withdrawalConfig";

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
}

type Mode = "view" | "approve" | "decline";

const MIN_REASON_LENGTH = 5;

/* ------------------------------- helpers ------------------------------- */

const formatDateTime = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

const humanize = (key: string) => key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/** Flatten metadata into displayable rows (one level deep, primitives only). */
const metadataRows = (metadata: unknown): [string, string][] => {
  let obj = metadata;
  if (typeof obj === "string") {
    try {
      obj = JSON.parse(obj);
    } catch {
      return obj ? [["Note", obj as string]] : [];
    }
  }
  if (!obj || typeof obj !== "object") return [];
  return Object.entries(obj as Record<string, unknown>)
    .filter(([, v]) => v !== null && v !== undefined && v !== "" && typeof v !== "object")
    .map(([k, v]) => [humanize(k), String(v)]);
};

/** Numeric wallet fields (balances) — key names aren't documented, so render whatever is numeric. */
const walletRows = (tx: TransactionDetail | null): [string, string][] => {
  const wallet = walletOf(tx);
  if (!wallet) return [];
  return Object.entries(wallet)
    .filter(([k, v]) => !/(^id$|_id$|currency|version)/i.test(k) && v !== null && v !== "" && !isNaN(Number(v)))
    .map(([k, v]) => [humanize(k), formatNaira(v as string | number)]);
};

/** Linked fee / parent transactions as "label → amount" rows. */
const linkedRows = (tx: TransactionDetail | null): [string, string][] => {
  if (!tx) return [];
  const related = Array.isArray(tx.related_transactions)
    ? tx.related_transactions
    : tx.related_transactions
    ? [tx.related_transactions]
    : [];
  const items = [...related, ...(tx.parent_transaction ? [tx.parent_transaction] : [])];
  return items
    .filter((t): t is Record<string, unknown> => !!t && typeof t === "object")
    .map((t, i): [string, string] => [
      t.type ? humanize(String(t.type)) : `Linked transaction ${i + 1}`,
      t.amount !== undefined ? formatNaira(t.amount as string | number) : String(t.reference ?? t.id ?? ""),
    ]);
};

const sectionTitleSx = {
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
  color: "var(--text-secondary)",
  mb: 1.25,
};

const panelSx = {
  border: "1px solid var(--border)",
  borderRadius: "12px",
  p: 2,
  backgroundColor: "rgba(255,255,255,0.02)",
};

const Field = ({ label, value, mono }: { label: string; value?: React.ReactNode; mono?: boolean }) => (
  <Box sx={{ minWidth: 0 }}>
    <Typography sx={{ fontSize: 11.5, color: "var(--text-secondary)", mb: 0.25 }}>{label}</Typography>
    <Typography
      component="div"
      sx={{
        fontSize: 13.5,
        fontWeight: 500,
        color: "var(--text-primary)",
        fontFamily: mono ? "monospace" : undefined,
        wordBreak: "break-word",
        textTransform: mono ? undefined : "capitalize",
      }}
    >
      {value ?? "N/A"}
    </Typography>
  </Box>
);

const grid2 = { display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 };

const StatusChip = ({ status }: { status?: string }) => {
  const { bg, fg } = statusColors(status);
  return (
    <Chip
      label={formatStatusLabel(status)}
      size="small"
      sx={{ fontSize: 12, height: 22, fontWeight: 600, backgroundColor: bg, color: fg, textTransform: "capitalize" }}
    />
  );
};

/* -------------------------------- modal -------------------------------- */

export default function TransactionDetailModal({ transaction: seed, open, onClose }: TransactionDetailModalProps) {
  const dispatch = useAppDispatch();
  const actionInFlightId = useAppSelector((s) => s.transactions.actionInFlightId);
  const { transaction: tx, driver, loading, driverLoading, driverError, setTransaction } = useTransactionDetails(
    seed,
    open
  );

  const [mode, setMode] = useState<Mode>("view");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) {
      setMode("view");
      setReason("");
    }
  }, [open]);

  const submitting = !!tx && actionInFlightId === tx.id;
  const awaiting = isAwaitingApproval(tx);
  const withdrawal = isWithdrawal(tx);
  // The row's own recipient is where Paystack will send the money; the driver profile is a fallback.
  const recipient: PendingApprovalRecipient | null = recipientOf(tx) ??
    (driver?.transfer_recipient as PendingApprovalRecipient | null | undefined) ??
    null;
  const rowUser = expandedUser(tx);
  const phone = driver?.phone_number || (rowUser?.phone_number as string | undefined);
  const trimmedReason = reason.trim();

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  const handleApprove = async () => {
    if (!tx) return;
    const result = await dispatch(approveTransaction(tx.id));
    if (approveTransaction.fulfilled.match(result)) {
      setTransaction((prev) => (prev ? { ...prev, ...result.payload } : prev));
      onClose();
    }
  };

  const handleDecline = async () => {
    if (!tx || trimmedReason.length < MIN_REASON_LENGTH) return;
    const result = await dispatch(rejectTransaction({ id: tx.id, reason: trimmedReason }));
    if (rejectTransaction.fulfilled.match(result)) {
      setTransaction((prev) => (prev ? { ...prev, ...result.payload } : prev));
      onClose();
    }
  };

  const meta = metadataRows(tx?.metadata);
  const balances = walletRows(tx);
  const linked = linkedRows(tx);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          background: "var(--bg-card)",
          backgroundImage: "none",
          color: "var(--text-primary)",
          borderRadius: "18px",
          maxWidth: 640,
          width: "100%",
          m: 2,
          p: { xs: 2, sm: 3.5 },
          border: "1px solid var(--border)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        },
      }}
    >
      <IconButton
        onClick={handleClose}
        disabled={submitting}
        sx={{ position: "absolute", top: 10, right: 10, color: "var(--text-secondary)" }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      {!tx ? null : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {/* Header */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flexWrap: "wrap", pr: 4 }}>
              <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
                {withdrawal ? "Withdrawal request" : "Transaction details"}
              </Typography>
              <StatusChip status={tx.status} />
              {loading && <CircularProgress size={14} sx={{ color: "var(--text-secondary)" }} />}
            </Box>
            <Typography sx={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.5px", mt: 1 }}>
              {formatNaira(tx.amount)}
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: "var(--text-secondary)" }}>
              Requested {formatDateTime(tx.created_at)}
            </Typography>
          </Box>

          {awaiting && mode === "view" && (
            <Box
              sx={{
                display: "flex",
                gap: 1.25,
                alignItems: "flex-start",
                p: 1.5,
                borderRadius: "10px",
                backgroundColor: "rgba(96, 165, 250, 0.08)",
                border: "1px solid rgba(96, 165, 250, 0.25)",
              }}
            >
              <WarningAmberIcon sx={{ fontSize: 18, color: "#60A5FA", mt: 0.25 }} />
              <Typography sx={{ fontSize: 13, color: "var(--text-primary)", lineHeight: 1.6 }}>
                This withdrawal is on hold. No money has been sent yet. Approving starts the bank transfer;
                declining returns the amount and fee to the driver's available balance.
              </Typography>
            </Box>
          )}

          {/* Withdrawal information */}
          <Box sx={panelSx}>
            <Typography sx={sectionTitleSx}>{withdrawal ? "Withdrawal information" : "Transaction information"}</Typography>
            <Box sx={grid2}>
              <Field label="Reference" value={tx.reference || tx.id} mono />
              {tx.group_reference && <Field label="Group reference" value={tx.group_reference} mono />}
              <Field label="Type" value={tx.type?.replace(/_/g, " ")} />
              <Field label="Channel" value={tx.channel?.replace(/_/g, " ") || "N/A"} />
              <Field label="Direction" value={tx.direction} />
              {tx.fund_source && <Field label="Fund source" value={tx.fund_source} />}
              <Field label="Created" value={formatDateTime(tx.created_at)} />
              {tx.updated_at && <Field label="Last updated" value={formatDateTime(tx.updated_at)} />}
              {meta.map(([k, v]) => (
                <Field key={k} label={k} value={v} />
              ))}
              {linked.map(([k, v], i) => (
                <Field key={`linked-${i}`} label={k} value={v} />
              ))}
            </Box>
          </Box>

          {/* Driver / user */}
          <Box sx={panelSx}>
            <Typography sx={sectionTitleSx}>{withdrawal ? "Driver" : "User"}</Typography>

            {driverLoading ? (
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                <Skeleton variant="circular" width={44} height={44} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton width="40%" />
                  <Skeleton width="60%" />
                </Box>
              </Box>
            ) : (
              <>
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mb: driver ? 2 : 0 }}>
                  <Avatar
                    src={driver?.profile_picture_url || driver?.profile_picture || undefined}
                    sx={{ width: 44, height: 44, bgcolor: "rgba(254,185,20,0.15)", color: "var(--accent-gold)" }}
                  >
                    {(driver?.full_name || tx.user_name || "?").charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: 14.5, fontWeight: 600 }}>
                      {driver?.full_name || tx.user_name || "Unknown user"}
                    </Typography>
                    <Typography sx={{ fontSize: 12.5, color: "var(--text-secondary)", wordBreak: "break-all" }}>
                      {driver?.email || tx.user_email || "No email"}
                    </Typography>
                  </Box>
                </Box>

                {!driver && phone && (
                  <Box sx={{ ...grid2, mt: 2 }}>
                    <Field label="Phone" value={phone} />
                  </Box>
                )}

                {driver && (
                  <Box sx={grid2}>
                    <Field label="Phone" value={phone || "N/A"} />
                    <Field label="Account status" value={driver.status?.replace(/_/g, " ")} />
                    <Field label="KYC status" value={driver.kyc_status?.replace(/_/g, " ").toLowerCase()} />
                    <Field label="Rating" value={driver.rating ? `${Number(driver.rating).toFixed(1)} ★` : "N/A"} />
                    <Field label="Completed rides" value={driver.completed_rides ?? driver.total_rides ?? "N/A"} />
                    <Field label="Cancelled rides" value={driver.cancelled_rides ?? "N/A"} />
                  </Box>
                )}

                {withdrawal && driverError && (
                  <Typography sx={{ fontSize: 12.5, color: "var(--text-secondary)", mt: 1.5 }}>
                    Full driver profile could not be loaded. Verify the driver on the Drivers page before
                    approving.
                  </Typography>
                )}
              </>
            )}
          </Box>

          {/* Wallet balances */}
          {balances.length > 0 && (
            <Box sx={panelSx}>
              <Typography sx={sectionTitleSx}>Wallet balances</Typography>
              <Box sx={grid2}>
                {balances.map(([k, v]) => (
                  <Field key={k} label={k} value={v} />
                ))}
              </Box>
            </Box>
          )}

          {/* Payout destination */}
          {withdrawal && (recipient || driver || !driverLoading) && (
            <Box sx={panelSx}>
              <Typography sx={sectionTitleSx}>Payout account</Typography>
              {recipient ? (
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(254,185,20,0.1)",
                      color: "var(--accent-gold)",
                    }}
                  >
                    <AccountBalanceIcon sx={{ fontSize: 20 }} />
                  </Box>
                  <Box sx={{ ...grid2, flex: 1 }}>
                    <Field label="Account name" value={recipient.account_name} />
                    <Field label="Account number" value={recipient.account_number} mono />
                    {recipient.bank_name ? (
                      <Field label="Bank" value={recipient.bank_name as string} />
                    ) : (
                      <Field label="Bank code" value={recipient.bank_code} mono />
                    )}
                  </Box>
                </Box>
              ) : (
                <Typography sx={{ fontSize: 13, color: "#EF4444" }}>
                  No payout bank account is attached to this withdrawal.
                </Typography>
              )}
            </Box>
          )}

          {/* Actions */}
          {awaiting && (
            <>
              <Divider />

              {mode === "view" && (
                <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end", flexWrap: "wrap" }}>
                  <AppButton
                    onClick={() => setMode("decline")}
                    startIcon={<HighlightOffIcon />}
                    sx={{
                      backgroundColor: "transparent",
                      color: "#EF4444",
                      border: "1px solid rgba(239,68,68,0.5)",
                      "&:hover": { backgroundColor: "rgba(239,68,68,0.08)", boxShadow: "none" },
                    }}
                  >
                    Decline
                  </AppButton>
                  <AppButton onClick={() => setMode("approve")} startIcon={<CheckCircleOutlineIcon />}>
                    Approve withdrawal
                  </AppButton>
                </Box>
              )}

              {mode === "approve" && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Typography sx={{ fontSize: 14, lineHeight: 1.7 }}>
                    Send <b>{formatNaira(tx.amount)}</b> to{" "}
                    <b>{recipient ? `${recipient.account_name} (${recipient.account_number})` : "the driver's bank account"}</b>?
                    The transfer starts immediately and the driver is notified. This cannot be undone.
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
                    <AppButton
                      onClick={() => setMode("view")}
                      disabled={submitting}
                      sx={{ backgroundColor: "transparent", color: "var(--text-primary)", border: "1px solid var(--border)" }}
                    >
                      Back
                    </AppButton>
                    <AppButton onClick={handleApprove} loading={submitting} sx={{ minWidth: 160 }}>
                      Confirm & send
                    </AppButton>
                  </Box>
                </Box>
              )}

              {mode === "decline" && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Typography sx={{ fontSize: 14, lineHeight: 1.7 }}>
                    The amount and fee will be returned to the driver's available balance and the driver will be
                    notified with your reason.
                  </Typography>
                  <TextField
                    autoFocus
                    multiline
                    minRows={3}
                    placeholder="Reason for declining (shown to the driver)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    disabled={submitting}
                    error={reason.length > 0 && trimmedReason.length < MIN_REASON_LENGTH}
                    helperText={
                      reason.length > 0 && trimmedReason.length < MIN_REASON_LENGTH
                        ? `Please enter at least ${MIN_REASON_LENGTH} characters`
                        : " "
                    }
                    sx={{
                      "& .MuiInputBase-root": { color: "var(--text-primary)", fontSize: 14, borderRadius: "10px" },
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--border)" },
                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "var(--accent-gold)" },
                    }}
                  />
                  <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
                    <AppButton
                      onClick={() => setMode("view")}
                      disabled={submitting}
                      sx={{ backgroundColor: "transparent", color: "var(--text-primary)", border: "1px solid var(--border)" }}
                    >
                      Back
                    </AppButton>
                    <AppButton
                      onClick={handleDecline}
                      loading={submitting}
                      disabled={trimmedReason.length < MIN_REASON_LENGTH}
                      sx={{
                        minWidth: 160,
                        backgroundColor: "#EF4444",
                        color: "#fff",
                        border: "1px solid #EF4444",
                        "&:hover": { backgroundColor: "#DC2626", boxShadow: "none" },
                      }}
                    >
                      Decline withdrawal
                    </AppButton>
                  </Box>
                </Box>
              )}
            </>
          )}
        </Box>
      )}
    </Dialog>
  );
}
