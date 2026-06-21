import { TableRow,Skeleton, TableCell } from "@mui/material";

export function TableSkeleton(): React.ReactElement {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <TableRow key={i}>
          {[200, 140, 180, 160, 100, 40].map((w, j) => (
            <TableCell key={j} sx={{ border: 'none', py: 1.5 }}>
              <Skeleton variant="rounded" width={w} height={16} sx={{ bgcolor: 'var(--border)' }} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}