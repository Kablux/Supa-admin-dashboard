import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TablePagination,
  CircularProgress,
  IconButton,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

import SearchFilterRow from "../components/SearchFilterRow";
import { loadSosIncidents } from "../api/xhrHelper";
import { setCurrentPage,setSearch,setPageSize,setStatusFilter } from "../redux/slices/Sos";
import SosIncidentsTable from "../components/sos/SosTable";


const selectSx = {
  fontSize: 14,
  borderRadius: "8px",
  backgroundColor: "var(--bg-secondary, #161B26)",
  color: "var(--text-secondary, #8A92A6)",
  height: 40,
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--border, rgba(255, 255, 255, 0.08))",
    borderWidth: "2px",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--accent-gold, #FEB914)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--accent-gold, #FEB914)",
    borderWidth: "2px",
  },
  "& .MuiSelect-icon": { color: "var(--text-muted, #8A92A6)" },
} as const;

export default function SosIncidentsPage() {
  const dispatch = useAppDispatch();
  const {
    items,
    count,
    currentPage,
    pageSize,
    search,
    statusFilter,
    rideFilter,
    triggeredByFilter,
    status,
  } = useAppSelector((state) => state.sos);

  const isLoading = status === "loading";
  const isFiltered = Boolean(search || statusFilter || rideFilter || triggeredByFilter);

  useEffect(() => {
    dispatch(loadSosIncidents());
  }, [dispatch, currentPage, pageSize, search, statusFilter, rideFilter, triggeredByFilter]);

  const renderStatusChip = (incidentStatus: string) => {
    switch (incidentStatus?.toUpperCase()) {
      case "OPEN":
        return (
          <Chip
            label="OPEN"
            size="small"
            sx={{
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              color: "#F87171",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              fontWeight: 600,
              fontSize: 11,
            }}
          />
        );
      case "RESOLVED":
        return (
          <Chip
            label="RESOLVED"
            size="small"
            sx={{
              backgroundColor: "rgba(16, 185, 129, 0.12)",
              color: "#34D399",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              fontWeight: 600,
              fontSize: 11,
            }}
          />
        );
      default:
        return (
          <Chip
            label={incidentStatus || "IN PROGRESS"}
            size="small"
            sx={{
              backgroundColor: "rgba(245, 158, 11, 0.12)",
              color: "#FBBF24",
              border: "1px solid rgba(245, 158, 11, 0.25)",
              fontWeight: 600,
              fontSize: 11,
            }}
          />
        );
    }
  };

  return (
    <Box className="fade-in" sx={{ p: 1, display: "flex", flexDirection: "column", gap: 3.5 }}>
    

      {/* Search & Filters Bar */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap"  , justifyContent:"space-between"}}>
        <Box className="md:max-w-xl w-full">
          <SearchFilterRow
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            placeholder="Search incident, ride, or user ID..."
          />
        </Box>

       {/* Status Dropdown Filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={statusFilter}
            displayEmpty
            onChange={(e) => dispatch(setStatusFilter(e.target.value))}
            sx={{
              ...selectSx,
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
                gap: 1,
                py: 1,
              },
            }}
          >
            <MenuItem value="" sx={{ fontSize: 13.5, color: "var(--text-secondary)" }}>
              All Statuses
            </MenuItem>
            <MenuItem value="OPEN" sx={{ fontSize: 13.5, display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box component="span" sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#EF5350" }} />
              Open
            </MenuItem>
            <MenuItem value="RESOLVED" sx={{ fontSize: 13.5, display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box component="span" sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#34D399" }} />
              Resolved
            </MenuItem>
            <MenuItem value="IN_PROGRESS" sx={{ fontSize: 13.5, display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box component="span" sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#FBBF24" }} />
              In Progress
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

       <SosIncidentsTable
        items={items}
        count={count}
        currentPage={currentPage}
        pageSize={pageSize}
        isLoading={isLoading}
        onPageChange={(page) => dispatch(setCurrentPage(page))}
        onPageSizeChange={(size) => dispatch(setPageSize(size))}
      />
    </Box>
  );
}