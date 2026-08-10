import React, { useMemo, useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Checkbox,
  FormControlLabel,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

// NOTE: requires the SheetJS dependency —  npm i xlsx

export type ExportFormat = "xlsx" | "csv";

export interface ExportColumn {
  key: string; // field key on each row object
  label: string; // header in the exported file
  default?: boolean; // checked by default
}

interface PageResult {
  results: Record<string, unknown>[];
  count: number;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string; // e.g. "Export Drivers"
  entityLabel: string; // e.g. "drivers" (used in toasts)
  fileBaseName: string; // e.g. "drivers_export"
  columns: ExportColumn[];
  /** Fetch one page of the CURRENT filtered dataset. The modal pages through all. */
  fetchPage: (page: number, pageSize: number) => Promise<PageResult>;
}

// A selected column with no data shows "Not available" rather than a blank cell.
// (0 and "0" are real values and are kept.)
const cell = (value: unknown) =>
  value === undefined || value === null || value === "" ? "N/A" : value;

export default function ExportModal({
  isOpen,
  onClose,
  title,
  entityLabel,
  fileBaseName,
  columns,
  fetchPage,
}: ExportModalProps) {
  const allKeys = useMemo(() => columns.map((c) => c.key), [columns]);
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(columns.filter((c) => c.default).map((c) => c.key)),
  );
  const [format, setFormat] = useState<ExportFormat>("xlsx");
  const [loading, setLoading] = useState(false);

  const allSelected = allKeys.length > 0 && selected.size === allKeys.length;
  const someSelected = selected.size > 0 && !allSelected;

  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(allKeys));

  const toggleField = (key: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const orderedCols = useMemo(
    () => columns.filter((c) => selected.has(c.key)),
    [columns, selected],
  );

  // Page through the whole current dataset.
  const fetchAll = async (): Promise<Record<string, unknown>[]> => {
    const pageSize = 100;
    const all: Record<string, unknown>[] = [];
    let page = 1;
    for (let guard = 0; guard < 500; guard++) {
      const res = await fetchPage(page, pageSize);
      all.push(...res.results);
      if (res.results.length === 0 || all.length >= res.count) break;
      page += 1;
    }
    return all;
  };

  const handleExport = async () => {
    if (orderedCols.length === 0) {
      toast.error("Select at least one field to export");
      return;
    }
    setLoading(true);
    try {
      const data = await fetchAll();
      if (data.length === 0) {
        toast.error(`No ${entityLabel} match the current filters`);
        return;
      }

      const rows = data.map((r) => {
        const row: Record<string, unknown> = {};
        orderedCols.forEach((c) => {
          row[c.label] = cell(r[c.key]);
        });
        return row;
      });

      const ws = XLSX.utils.json_to_sheet(rows, {
        header: orderedCols.map((c) => c.label),
      });
      const wb = XLSX.utils.book_new();
      const sheetName = (title.replace(/^export\s*/i, "") || "Export").slice(0, 31);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);

      const stamp = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(wb, `${fileBaseName}_${stamp}.${format}`, {
        bookType: format,
      });

      toast.success(`Exported ${data.length} ${entityLabel}`);
      onClose();
    } catch (err) {
      console.error("Export failed", err);
      toast.error("Export failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

   const checkboxSx = {
    color: "secondary.main",
    "&.Mui-checked": { color: "var(--accent-gold, #FFD700)" },
    "&.MuiCheckbox-indeterminate": { color: "var(--accent-gold, #FFD700)" },
  };
  const labelSx = { "& .MuiFormControlLabel-label": { fontSize: 14 } };

  const formatOptions: { value: ExportFormat; label: string }[] = [
    { value: "xlsx", label: "Excel (.xlsx)" },
    { value: "csv", label: "CSV (.csv)" },
  ];

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          background: "var(--bg-card)",
          color: "var(--text-primary, #fff)",
          borderRadius: "18px",
          maxWidth: 520,
          width: "100%",
          border: "1px solid var(--border)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          px: 3,
          pt: 3,
          pb: 2,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 18, fontWeight: 700 }}>{title}</Typography>
          <Typography sx={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Choose the fields to include and a format
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "secondary.main" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: "var(--border)" }} />

      {/* Fields */}
      <Box sx={{ px: 3, py: 2 }}>
        <FormControlLabel
          sx={{ ...labelSx, mb: 0.5 }}
          control={
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onChange={toggleAll}
              sx={checkboxSx}
            />
          }
          label={
            <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
              Select all
            </Typography>
          }
        />
        <Divider sx={{borderColor: "var(--border)", mb: 1 }} />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            columnGap: 2,
            maxHeight: 320,
            overflowY: "auto",
          }}
        >
          {columns.map((col) => (
            <FormControlLabel
              key={col.key}
              sx={labelSx}
              control={
                <Checkbox
                  checked={selected.has(col.key)}
                  onChange={() => toggleField(col.key)}
                  sx={checkboxSx}
                />
              }
              label={col.label}
            />
          ))}
        </Box>
      </Box>

      <Divider sx={{borderColor: "var(--border)" }} />

      {/* Format + actions */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography sx={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Format
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {formatOptions.map((opt) => {
              const active = format === opt.value;
              return (
                <Box
                  key={opt.value}
                  onClick={() => setFormat(opt.value)}
                  sx={{
                    px: 1.75,
                    py: 0.75,
                    borderRadius: "8px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    userSelect: "none",
                    transition: "all 0.15s ease",
                    backgroundColor: active
                      ? "var(--accent-gold, #FFD700)"
                      : "rgba(255,255,255,0.03)",
                    color: active ? "#000" : "var(--text-secondary)",
                    border: "1px solid",
                    borderColor: active
                      ? "var(--accent-gold, #FFD700)"
                      : "var(--border, rgba(255,255,255,0.12))",
                    "&:hover": {
                      borderColor: active
                        ? "var(--accent-gold, #FFD700)"
                        : "rgba(255,255,255,0.25)",
                      color: active ? "#000" : "var(--text-primary)",
                    },
                  }}
                >
                  {opt.label}
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            disabled={loading}
            sx={{
              px: 2,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "10px",
              color: "var(--text-primary)",
              border: "1px solid var(--border, rgba(255,255,255,0.15))",
              "&:hover": {
                borderColor: "secondary.main",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={loading || selected.size === 0}
            startIcon={
              !loading && <FileDownloadRoundedIcon sx={{ fontSize: 18 }} />
            }
           sx={{
                         px: 3,
                         textTransform: "none",
                         borderRadius: "10px",
                         minWidth: 150,
                         backgroundColor: "var(--accent-gold, #FFD700)",
                         color: "#000",
                         boxShadow: "none",
                         "&:hover": {
                           backgroundColor: "var(--accent-gold, #FFD700)",
                           boxShadow: "0 4px 12px rgba(255,215,0,0.25)",
                         },
                         "&.Mui-disabled": {
                           backgroundColor: "rgba(255,255,255,0.12)",
                           color: "rgba(255,255,255,0.4)",
                         },
                       }}
                     >
                       {loading ? (
                         <CircularProgress size={18} sx={{ color: "#000" }} />
                       ) : (
                         `Export (${selected.size})`
                       )}
                     </Button>
                   </Box>
      </Box>
    </Dialog>
  );
}