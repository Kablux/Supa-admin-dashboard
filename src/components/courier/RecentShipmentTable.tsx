import React from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { Shipment } from "../../types/common.types";

const STATUS_COLORS: Record<string, { fg: string; bg: string }> = {
  Completed: { fg: "#50c878", bg: "rgba(80,200,120,0.12)" },
  "In Transit": { fg: "#4d8eff", bg: "rgba(77,142,255,0.12)" },
  Pending: { fg: "#ffb300", bg: "rgba(255,179,0,0.12)" },
  Cancelled: { fg: "#ff6b6b", bg: "rgba(255,107,107,0.12)" },
};

const headCellSx = {
  color: "var(--text-secondary)",
  fontSize: 12.5,
  fontWeight: 600,
  borderBottom: "1px solid var(--border, rgba(255,255,255,0.08))",
  py: 1.5,
};

const bodyCellSx = {
  color: "var(--text-primary)",
  fontSize: 13,
  borderBottom: "1px solid var(--border, rgba(255,255,255,0.06))",
  py: 1.5,
};

interface Props {
  shipments: Shipment[];
  onRowMenu?: (shipment: Shipment) => void;
}

export default function RecentShipmentTable({ shipments, onRowMenu }: Props) {
  return (
    <Box
      sx={{
        p: 2,
        mt:4
      }}
    >
      <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 1 }}>
        Recent Shipment
      </Typography>

      <TableContainer>
        <Table sx={{ minWidth: 720 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={headCellSx}>Name</TableCell>
              <TableCell sx={headCellSx}>Date</TableCell>
              <TableCell sx={headCellSx}>Pickup</TableCell>
              <TableCell sx={headCellSx}>Destination</TableCell>
              <TableCell sx={headCellSx}>Status</TableCell>
              <TableCell sx={headCellSx} align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {shipments.map((s) => {
              const c = STATUS_COLORS[s.status] || STATUS_COLORS.Completed;
              return (
                <TableRow
                  key={s.id}
                  hover
                  sx={{
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.02)" },
                  }}
                >
                  <TableCell sx={bodyCellSx}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Avatar
                        src={s.avatar}
                        sx={{ width: 30, height: 30, fontSize: 13 }}
                      >
                        {s.name.charAt(0)}
                      </Avatar>
                      <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                        {s.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={bodyCellSx}>{s.date}</TableCell>
                  <TableCell sx={{ ...bodyCellSx, maxWidth: 180 }}>
                    {s.pickup}
                  </TableCell>
                  <TableCell sx={{ ...bodyCellSx, maxWidth: 180 }}>
                    {s.destination}
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    <Box
                      component="span"
                      sx={{
                        px: 1.25,
                        py: 0.5,
                        borderRadius: "8px",
                        fontSize: 12,
                        fontWeight: 600,
                        color: c.fg,
                        backgroundColor: c.bg,
                      }}
                    >
                      {s.status}
                    </Box>
                  </TableCell>
                  <TableCell sx={bodyCellSx} align="right">
                    <IconButton
                      size="small"
                      onClick={() => onRowMenu?.(s)}
                      sx={{ color: "var(--text-secondary)" }}
                    >
                      <MoreVertRoundedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}