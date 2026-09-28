import AddIcon from "@mui/icons-material/Add";
import ViewBannerIcon from "@mui/icons-material/ViewCarouselOutlined";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import AppButton from "../common/AppButton";

interface EmptyBannerStateProps {
  isFiltered: boolean;
  onClear: () => void;
  onCreate: () => void;
}

export default function EmptyBannerState({
  isFiltered,
  onClear,
  onCreate,
}: EmptyBannerStateProps): React.ReactElement {
  return (
    <TableRow>
      <TableCell colSpan={8} sx={{ border: "none", py: 10 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "20px",
              backgroundColor: "var(--accent-gold-glow)",
              border: "1px solid rgba(245,197,24,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-gold)",
            }}
          >
            <ViewBannerIcon sx={{ fontSize: 32 }} />
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                 
                fontWeight: 700,
                fontSize: 17,
                color: "var(--text-primary)",
                mb: 0.75,
              }}
            >
              {isFiltered ? "No banners match your filters" : "No banners yet"}
            </Typography>

            <Typography
              sx={{
                fontSize: 13,
                color: "var(--text-muted)",
                maxWidth: 300,
              }}
            >
              {isFiltered
                ? "Try adjusting your search or filters."
                : "Create your first app banner to promote offers or announcements."}
            </Typography>
          </Box>

          {isFiltered ? (
            <AppButton variant="outlined" size="small" onClick={onClear}>
              Clear filters
            </AppButton>
          ) : (
            <AppButton
              size="small"
              startIcon={<AddIcon />}
              onClick={onCreate}
            >
              Create Banner
            </AppButton>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
}
