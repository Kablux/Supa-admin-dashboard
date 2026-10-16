import Skeleton from "@mui/material/Skeleton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

export default function BannerTableSkeleton(): React.ReactElement {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <TableRow key={i}>
          {[52, 200, 100, 90, 110, 120, 110, 80].map((w, j) => (
            <TableCell key={j} sx={{ border: "none", py: 1.5, px: 2 }}>
              <Skeleton
                variant="rounded"
                width={w}
                height={15}
                sx={{ bgcolor: "var(--border)" }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
