import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageNotSupportedOutlinedIcon from "@mui/icons-material/ImageNotSupportedOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import BannerStatusChip from "./BannerStatusChip";
import BannerTableSkeleton from "./BannerTableSkeleton";
import EmptyBannerState from "./EmptyBannerState";
import { Banner } from "../../types/common.types";
import { getBannerImage, formatDate } from "../../utils/bannerHelpers";
import { TABLE_HEADERS, AUDIENCE_META, cellSx } from "./bannerMeta";

interface BannerTableProps {
  list: Banner[];
  isLoading: boolean;
  isFiltered: boolean;
  togglingId: string | null;
  onPreview: (banner: Banner) => void;
  onToggle: (event: React.MouseEvent, banner: Banner) => void;
  onEdit: (banner: Banner) => void;
  onDelete: (banner: Banner) => void;
  onClearFilters: () => void;
  onCreate: () => void;
}

export default function BannerTable({
  list,
  isLoading,
  isFiltered,
  togglingId,
  onPreview,
  onToggle,
  onEdit,
  onDelete,
  onClearFilters,
  onCreate,
}: BannerTableProps): React.ReactElement {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            {TABLE_HEADERS.map((header) => (
              <TableCell
                key={header}
                sx={{
                  fontSize: 12,
                      fontWeight: 500,
                      color: "var(--text-secondary)",
                      borderBottom: "1px solid var(--text-secondary)",
                      borderTop: "1px solid var(--text-secondary)",
                      p: 1.25,
                  whiteSpace: "nowrap",
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {isLoading ? (
            <BannerTableSkeleton />
          ) : list.length === 0 ? (
            <EmptyBannerState
              isFiltered={isFiltered}
              onClear={onClearFilters}
              onCreate={onCreate}
            />
          ) : (
            list.map((banner) => {
              const audience = AUDIENCE_META[banner.audience];
              const image = getBannerImage(banner);

              return (
                <TableRow
                  key={banner.id}
                  onClick={() => onPreview(banner)}
                  sx={{
                    cursor: "pointer",
                    "&:last-child td": { borderBottom: "none" },
                    "&:hover": {
                      backgroundColor: "var(--bg-card-hover)",
                    },
                    transition: "background 0.12s ease",
                  }}
                >
                  <TableCell sx={{ ...cellSx, width: 52, pl: 2, pr: 1 }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 34,
                        borderRadius: "7px",
                        overflow: "hidden",
                        border: "1px solid var(--border)",
                        backgroundColor: "#191e2d",
                        flexShrink: 0,
                      }}
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={banner.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                          }}
                        >
                          <ImageNotSupportedOutlinedIcon
                            sx={{
                              fontSize: 14,
                              color: "var(--text-muted)",
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  </TableCell>

                  <TableCell sx={{ ...cellSx, maxWidth: 200 }}>
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        lineHeight: 1.3,
                      }}
                      noWrap
                    >
                      {banner.title || "(No title)"}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 10.5,
                        color: "var(--text-muted)",
                        fontFamily: "monospace",
                        mt: 0.2,
                      }}
                      noWrap
                    >
                      {banner.id}
                    </Typography>
                  </TableCell>

                  <TableCell sx={cellSx}>
                  <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                        >
                          {audience.label}
                        </Typography>
                    
                  </TableCell>

                  <TableCell sx={cellSx}>
                    <BannerStatusChip banner={banner} />
                  </TableCell>

                  <TableCell sx={cellSx}>
                    {banner.is_clickable && banner.cta_type !== "NONE" ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.6,
                        }}
                      >
                        {/* <LinkOutlinedIcon
                          sx={{
                            fontSize: 12,
                            color: "var(--accent-gold)",
                          }}
                        /> */}
                        <Typography
                          sx={{
                            fontSize: 10,
                            color: "var(--accent-gold)",
                            fontWeight: 500,
                          }}
                        >
                          {banner.cta_type.replace("_", " ")}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography
                        sx={{ fontSize: 12, color: "var(--text-muted)" }}
                      >
                        —
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell sx={cellSx}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <CalendarTodayOutlinedIcon
                        sx={{
                          fontSize: 11,
                          color: "var(--text-muted)",
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: 11.5,
                          color: "var(--text-secondary)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {banner.starts_at || banner.ends_at
                          ? `${formatDate(banner.starts_at)} → ${formatDate(
                              banner.ends_at
                            )}`
                          : "—"}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={cellSx}>
                    <Typography
                      sx={{
                        fontSize: 11.5,
                        color: "var(--text-secondary)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(banner.created_at)}
                    </Typography>
                  </TableCell>

                  <TableCell
                    sx={{ ...cellSx, width: 120 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      <Tooltip
                        title={banner.is_active ? "Deactivate" : "Activate"}
                        placement="top"
                      >
                        <span>
                          <Switch
                            checked={banner.is_active}
                            size="small"
                            disabled={togglingId === banner.id}
                            onChange={(event) =>
                              onToggle(
                                event as unknown as React.MouseEvent,
                                banner
                              )
                            }
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": {
                                color: "var(--accent-gold)",
                              },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                {
                                  backgroundColor: "var(--accent-gold)",
                                },
                            }}
                          />
                        </span>
                      </Tooltip>

                      <Tooltip title="Edit" placement="top">
                        <IconButton
                          size="small"
                          onClick={() => onEdit(banner)}
                          sx={{
                            color: "var(--text-muted)",
                            borderRadius: "7px",
                            "&:hover": {
                              color: "var(--accent-gold)",
                              backgroundColor: "var(--accent-gold-glow)",
                            },
                          }}
                        >
                          <EditOutlinedIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete" placement="top">
                        <IconButton
                          size="small"
                          onClick={() => onDelete(banner)}
                          sx={{
                            color: "var(--text-muted)",
                            borderRadius: "7px",
                            "&:hover": {
                              color: "#EF5350",
                              backgroundColor: "rgba(239,83,80,0.08)",
                            },
                          }}
                        >
                          <DeleteOutlinedIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
