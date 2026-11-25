import { useEffect, useState } from "react";
import { fetchDriverDetails, fetchTransactionDetailsApi, getDriverList } from "../../api/xhr";
import type { Driver } from "../../types/auth";
import type { Transaction, TransactionDetail } from "../../types/common.types";
import { isAwaitingApproval, isWithdrawal, userIdOf } from "./withdrawalConfig";

const isDriverTransaction = (tx: Partial<TransactionDetail>) =>
  isWithdrawal(tx as Transaction) ||
  [tx.user_type, tx.user_role].some((r) => String(r || "").toLowerCase() === "driver");

/**
 * Resolve the driver behind a transaction.
 * 1. Try the transaction's `user` id against the driver detail endpoint.
 * 2. Fall back to searching the driver list by email (exact match only).
 */
async function resolveDriver(tx: TransactionDetail): Promise<Driver | null> {
  const userId = userIdOf(tx);
  if (userId) {
    try {
      return await fetchDriverDetails(userId);
    } catch {
      /* fall through to email lookup */
    }
  }

  if (!tx.user_email) return null;

  const { results } = await getDriverList({ search: tx.user_email, page_size: 5 });
  const email = tx.user_email.toLowerCase();
  const match = results?.find((d) => d.email?.toLowerCase() === email);
  // Detail endpoint carries more (bank account, vehicles) than the list row.
  return match ? fetchDriverDetails(match.id).catch(() => match) : null;
}

/**
 * Loads full transaction details (and the driver, for driver transactions) when
 * the modal opens. `seed` is the list row, shown immediately while detail loads.
 */
export function useTransactionDetails(seed: Transaction | null, isOpen: boolean) {
  const [transaction, setTransaction] = useState<TransactionDetail | null>(seed);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(false);
  const [driverLoading, setDriverLoading] = useState(false);
  const [driverError, setDriverError] = useState(false);

  const seedId = seed?.id;

  useEffect(() => {
    if (!isOpen || !seed) {
      setTransaction(null);
      setDriver(null);
      setDriverError(false);
      return;
    }

    let cancelled = false;
    setTransaction(seed);
    setDriver(null);
    setDriverError(false);
    // Rows from the pending-approval endpoint are already complete, and the detail endpoint
    // 404s for pending_approval transactions — only fetch detail for other rows.
    const needsDetail = !isAwaitingApproval(seed);
    setLoading(needsDetail);

    (async () => {
      let detail: TransactionDetail = seed;
      if (needsDetail) {
        try {
          const fetched = await fetchTransactionDetailsApi(seed.id);
          // Keep any richer values the list row already has; take the live status from detail.
          const seedFilled = Object.fromEntries(
            Object.entries(seed).filter(([, v]) => v !== undefined && v !== null && v !== "")
          );
          detail = { ...fetched, ...seedFilled, status: fetched.status || seed.status } as TransactionDetail;
          if (!cancelled) setTransaction(detail);
        } catch (err) {
          console.error("Failed to fetch transaction details", err);
        } finally {
          if (!cancelled) setLoading(false);
        }
      }

      if (cancelled || !isDriverTransaction(detail)) return;

      setDriverLoading(true);
      try {
        const found = await resolveDriver(detail);
        if (!cancelled) {
          setDriver(found);
          setDriverError(!found);
        }
      } catch (err) {
        console.error("Failed to fetch driver for transaction", err);
        if (!cancelled) setDriverError(true);
      } finally {
        if (!cancelled) setDriverLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, seedId]);

  return { transaction, driver, loading, driverLoading, driverError, setTransaction };
}
