import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { SosIncident } from "../../types/common.types";
import SosIncidentStatusChip from "./StatusChip";

const headerCellSx = {
  fontSize: 12,
  fontWeight: 500,
  // letterSpacing: "0.5px",
  color: "var(--text-secondary, #8A92A6)",
  borderColor: "var(--border)",
  py: 1.5,
  px: 2,
  whiteSpace: "nowrap",
} as const;

const bodyCellSx = {
  fontSize: 12,
  color: "var(--text-primary, #FFFFFF)",
  borderColor: "var(--border, rgba(255, 255, 255, 0.08))",
  py: 1.5,
  px: 2,
} as const;


interface SosIncidentsTableProps {
  items: SosIncident[];
  count: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export default function SosIncidentsTable({
  items,
  count,
  currentPage,
  pageSize,
  isLoading,
  onPageChange,
  onPageSizeChange,
}: SosIncidentsTableProps) {
  return (
    <TableContainer
    sx={{
    width: "100%",
    maxWidth: "100%",
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
    "&::-webkit-scrollbar": {
      height: 5,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: 10,
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },
  }}
    >
      <Table size="small" 
      sx={{
      minWidth: 1000,
      width: "100%",
      tableLayout: "auto",
    }}>
        <TableHead>
          <TableRow>
            <TableCell sx={headerCellSx}>
              Incident &amp; Reason
            </TableCell>
            <TableCell sx={headerCellSx}>Status</TableCell>
            <TableCell sx={headerCellSx}>Ride Details</TableCell>
            <TableCell sx={headerCellSx}>Triggered By</TableCell>
            <TableCell sx={headerCellSx}>Audio Log</TableCell>
            <TableCell sx={headerCellSx}>Created At</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={bodyCellSx}>
                <Box sx={{ py: 4 }}>
                  <CircularProgress
                    size={28}
                    sx={{ color: "var(--accent-gold, #FEB914)" }}
                  />
                </Box>
              </TableCell>
            </TableRow>
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={bodyCellSx}>
                <Typography
                  sx={{
                    py: 4,
                    color: "var(--text-secondary, #8A92A6)",
                    fontSize: 14,
                  }}
                >
                  No SOS safety incidents found matching your query.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            items.map((incident) => (
              <TableRow
                key={incident.id}
                sx={{
                  transition: "background-color 0.15s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.025)",
                  },
                  "&:last-child td": {
                    borderBottom: 0,
                  },
                }}
              >
                {/* Incident ID and reason */}
                <TableCell sx={bodyCellSx}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: "monospace",
                    }}
                  >
                    {incident.id.slice(0, 10)}...
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "var(--text-muted, #8A92A6)",
                      mt: 0.25,
                    }}
                  >
                    {incident.reason || "No reason provided"}
                  </Typography>
                </TableCell>

                {/* Status */}
                <TableCell sx={bodyCellSx}>
                  <SosIncidentStatusChip status={incident.status} />
                </TableCell>

                {/* Ride details */}
                <TableCell sx={bodyCellSx}>
                  {incident.ride ? (
                    <>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "var(--text-primary, #FFF)",
                        }}
                      >
                        {incident.ride.pickup_address} ➔{" "}
                        {incident.ride.dropoff_address}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 11.5,
                          color: "var(--text-muted, #8A92A6)",
                          mt: 0.25,
                        }}
                      >
                        Rider: {incident.ride.rider} | Driver:{" "}
                        {incident.ride.driver}
                      </Typography>
                    </>
                  ) : (
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "var(--text-muted, #8A92A6)",
                      }}
                    >
                      N/A
                    </Typography>
                  )}
                </TableCell>

                {/* Triggered by */}
                <TableCell sx={bodyCellSx}>
                  {incident.triggered_by ? (
                    <>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "var(--text-primary, #FFF)",
                        }}
                      >
                        {incident.triggered_by.full_name}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 11.5,
                          color: "var(--text-muted, #8A92A6)",
                          mt: 0.25,
                        }}
                      >
                        {incident.triggered_by.email} (
                        {incident.triggered_by.phone_number})
                      </Typography>
                    </>
                  ) : (
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "var(--text-muted, #8A92A6)",
                      }}
                    >
                      N/A
                    </Typography>
                  )}
                </TableCell>

                {/* Audio recording */}
                <TableCell sx={bodyCellSx}>
                  {incident.audio?.audio_file ? (
                    <Tooltip title="Play emergency audio recording">
                      <IconButton
                        size="small"
                        component="a"
                        href={incident.audio.audio_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open emergency audio recording"
                        sx={{
                          backgroundColor: "rgba(239, 68, 68, 0.1)",
                          color: "#EF5350",
                          "&:hover": {
                            backgroundColor: "rgba(239, 68, 68, 0.2)",
                          },
                        }}
                      >
                        <PlayArrowRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "var(--text-muted, #8A92A6)",
                      }}
                    >
                      No Audio
                    </Typography>
                  )}
                </TableCell>

                {/* Created at */}
                <TableCell sx={bodyCellSx}>
                  <Typography
                    sx={{
                      fontSize: 12.5,
                      color: "var(--text-secondary, #8A92A6)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {new Date(incident.created_at).toLocaleString()}
                  </Typography>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={count}
        page={Math.max(0, currentPage - 1)}
        onPageChange={(_, newPage) => onPageChange(newPage + 1)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(event) =>
          onPageSizeChange(Number(event.target.value))
        }
          sx={{
            color: "var(--text-secondary, #C1C7D0)",
            "& .MuiTablePagination-actions": { color: "var(--accent-gold)" },
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
      />
    </TableContainer>
  );
}