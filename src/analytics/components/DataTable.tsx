import { ReactNode } from "react";
import { Box, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Typography } from "@mui/material";

export interface Column<T> {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  render?: (row: T) => ReactNode;
  width?: number | string;
  nowrap?: boolean;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  loading = false,
  count,
  page,
  pageSize,
  onPage,
  onPageSize,
  sortKey,
  onSort,
  emptyText = "No records for these filters.",
  dense = true,
}: {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  count?: number;
  page?: number;
  pageSize?: number;
  onPage?: (page: number) => void;
  onPageSize?: (size: number) => void;
  sortKey?: string;
  onSort?: (key: string) => void;
  emptyText?: string;
  dense?: boolean;
}) {
  const head = { color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" as const, background: "var(--bg-card)" };
  const cell = { color: "var(--text-primary)", fontSize: 13, borderBottom: "1px solid var(--border-subtle)", fontVariantNumeric: "tabular-nums" as const };
  return (
    <Box>
      <TableContainer sx={{ maxHeight: 620 }}>
        <Table size={dense ? "small" : "medium"} stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key} align={column.align} sx={{ ...head, width: column.width }}>
                  {onSort ? (
                    <TableSortLabel active={sortKey === column.key} direction="desc" onClick={() => onSort(column.key)}>
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell key={column.key} sx={cell}>
                        <Skeleton sx={{ bgcolor: "var(--bg-card-hover)" }} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : rows.map((row, index) => (
                  <TableRow key={String(row.id ?? row.driver_id ?? row.rider_id ?? index)} hover>
                    {columns.map((column) => (
                      <TableCell key={column.key} align={column.align} sx={column.nowrap || column.align === "right" ? { ...cell, whiteSpace: "nowrap" } : cell}>
                        {column.render ? column.render(row) : String(row[column.key] ?? "—")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      {!loading && rows.length === 0 && <Typography sx={{ textAlign: "center", py: 4, color: "var(--text-secondary)", fontSize: 14 }}>{emptyText}</Typography>}
      {count !== undefined && onPage && (
        <TablePagination
          component="div"
          count={count}
          page={(page || 1) - 1}
          rowsPerPage={pageSize || 20}
          onPageChange={(_, next) => onPage(next + 1)}
          onRowsPerPageChange={(event) => onPageSize?.(Number(event.target.value))}
          rowsPerPageOptions={[10, 20, 50, 100]}
          sx={{ color: "var(--text-secondary)", "@media print": { display: "none" } }}
        />
      )}
    </Box>
  );
}
