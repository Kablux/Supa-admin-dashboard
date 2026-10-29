import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchTransactions, fetchTransactionAnalytic } from "../api/xhrHelper";
import SearchFilterRow from "../components/SearchFilterRow";
import { setAnalyticsRange, setCurrentPage, setPageSize } from "../redux/slices/Transactions";
import TransactionAnalyticsSection from "../components/transactions/AnalyticsSection";
import TransactionSummaryCards from "../components/transactions/SummaryCard";
import TransactionsTable from "../components/transactions/TransactionTable";


export default function TransactionsPage() {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");

  const {
    items: transactions,
    totalCount,
    currentPage,
    pageSize,
    totalIncome,
    totalExpense,
    analytics,
    analyticsRange,
    isLoading,
    isAnalyticsLoading,
  } = useAppSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(
      fetchTransactions({
        page: currentPage,
        page_size: pageSize,
        search: search || undefined,
      })
    );
  }, [dispatch, currentPage, pageSize, search]);

  useEffect(() => {
    dispatch(fetchTransactionAnalytic(analyticsRange));
  }, [dispatch, analyticsRange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    dispatch(setCurrentPage(1));
  };

  const calculatedBalance = Number(totalIncome || 0) - Number(totalExpense || 0);

  return (
    <Box className="fade-in" sx={{ p: 1, display: "flex", flexDirection: "column", gap: 3.5 }}>
      {/* Summary Cards */}
      <TransactionSummaryCards
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        calculatedBalance={calculatedBalance}
      />

      {/* Analytics Chart Section */}
      <TransactionAnalyticsSection
        analytics={analytics}
        analyticsRange={analyticsRange}
        isAnalyticsLoading={isAnalyticsLoading}
        onRangeChange={(range) => dispatch(setAnalyticsRange(range))}
      />

      {/* Search Bar */}
      <Box className="md:max-w-xl w-full">
        <SearchFilterRow
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by ID, reference, or user email..."
        />
      </Box>

      {/* Transactions Table */}
      <TransactionsTable
        isLoading={isLoading}
        transactions={transactions}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={(_, newPage) => dispatch(setCurrentPage(newPage + 1))}
        onPageSizeChange={(size) => dispatch(setPageSize(size))}
      />
    </Box>
  );
}