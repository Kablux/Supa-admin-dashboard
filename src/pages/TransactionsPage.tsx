import React, { useEffect, useMemo, useState } from "react";
import { Box, Button } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchTransactions, fetchTransactionAnalytic } from "../api/xhrHelper";
import SearchFilterRow from "../components/SearchFilterRow";
import { setAnalyticsRange, setCurrentPage, setPageSize } from "../redux/slices/Transactions";
import TransactionsTable from "../components/transactions/TransactionTable";
import TransactionSummaryCards from "../components/transactions/SummaryCard";
import TransactionAnalyticsSection from "../components/transactions/AnalyticsSection";
import TransactionsFilterModal from "../components/transactions/FilterModal";
import { TransactionFilterState } from "../types/common.types";

export default function TransactionsPage() {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<TransactionFilterState>({});
  const [filterModalOpen, setFilterModalOpen] = useState(false);

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

  // Memoize filters object to prevent unwanted re-fetches
  const filterKey = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    dispatch(
      fetchTransactions({
        page: currentPage,
        page_size: pageSize,
        search: search || undefined,
        ...filters,
      })
    );
  }, [dispatch, currentPage, pageSize, search, filterKey]);

  useEffect(() => {
    dispatch(fetchTransactionAnalytic(analyticsRange));
  }, [dispatch, analyticsRange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    dispatch(setCurrentPage(1));
  };

  const handleApplyFilters = (newFilters: TransactionFilterState) => {
    setFilters(newFilters);
    dispatch(setCurrentPage(1));
  };

  const handleResetFilters = () => {
    setFilters({});
    dispatch(setCurrentPage(1));
  };

  const calculatedBalance = Number(totalIncome || 0) - Number(totalExpense || 0);

  const activeFiltersCount = Object.values(filters).filter((val) => val !== undefined && val !== "").length;

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

      {/* Search Bar & Filter Trigger Row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <Box sx={{ flex: 1, maxWidth: 500 }}>
          <SearchFilterRow
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by ID, reference, or user email..."
          />
        </Box>

        <Button
          onClick={() => setFilterModalOpen(true)}
          startIcon={<FilterListIcon sx={{ fontSize: 18 }} />}
          sx={{
            height: 42,
            px: 2.5,
            borderRadius: "8px",
            textTransform: "none",
            fontSize: 13.5,
            fontWeight: 600,
            backgroundColor: activeFiltersCount > 0 ? "rgba(254, 185, 20, 0.1)" : "rgba(255, 255, 255, 0.03)",
            color: activeFiltersCount > 0 ? "var(--accent-gold, #FEB914)" : "var(--text-primary)",
            border: "2px solid",
            borderColor: activeFiltersCount > 0 ? "var(--accent-gold, #FEB914)" : "var(--border)",
            "&:hover": {
              backgroundColor: "var(--bg-card-hover)",
            },
          }}
        >
          Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}
        </Button>
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

      {/* Filter Modal */}
      <TransactionsFilterModal
        open={filterModalOpen}
        filters={filters}
        onClose={() => setFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />
    </Box>
  );
}