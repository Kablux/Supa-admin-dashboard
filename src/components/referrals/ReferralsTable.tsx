import {
  Box,
  Typography,
  CircularProgress,
  TablePagination,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import { Referral } from "../../types/common.types"; // Adjust path if needed

interface ReferralsTableProps {
  isLoading: boolean;
  referralsList: Referral[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onViewReferral: (referralId: string) => void;
  onPageSizeChange: (newPageSize: number) => void;
}

export default function ReferralsTable({
  isLoading,
  referralsList,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onViewReferral,
}: ReferralsTableProps) {
  return (
    <Box
      sx={{
        overflowX: "auto",
       
      }}
    >
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 8,
          }}
        >
          <CircularProgress size={28} sx={{ color: "var(--accent-gold)" }} />
        </Box>
      ) : referralsList.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 10,
            px: 3,
            my: 4,
            mx: "auto",
            maxWidth: 450,
            textAlign: "center",
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: "rgba(255, 193, 7, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <RouteOutlinedIcon
              sx={{ fontSize: 32, color: "var(--accent-gold, #FFC107)" }}
            />
          </Box>

          <Typography
            sx={{ fontSize: 18, fontWeight: 600, color: "#fff", mb: 1 }}
          >
            No Referrals Found
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              color: "rgba(255,255,255,0.5)",
              maxWidth: 300,
              lineHeight: 1.5,
            }}
          >
            There are currently no referrals matching this status or filter
            criteria.
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    "User (Referrer)",
                    "Referred User",
                    "Role",
                    "Created At",
                    "Updated At",
                  ].map((header) => (
                    <TableCell
                      key={header}
                     sx={{
                        fontSize: 14,
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
                {referralsList.map((referral) => (
                  <TableRow
                    key={referral.id}
                    onClick={() => onViewReferral(referral.id)}
                    sx={{
                      cursor: "pointer",
                      "&:last-child td": { borderBottom: "none" },
                      "&:hover": { backgroundColor: "var(--bg-card-hover)" },
                      transition: "background 0.12s",
                    }}
                  >
                    {/* User (Referrer) */}
                    <TableCell
                      sx={{
                        p: 1.25,
                        px: 2,
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        maxWidth: 220,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "text.primary",
                        }}
                      >
                        {referral.user?.first_name} {referral.user?.last_name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 11,
                          color: "text.secondary",
                          mt: 0.5,
                        }}
                      >
                        {referral.user?.email}
                      </Typography>
                    </TableCell>

                    {/* Referred User */}
                    <TableCell
                      sx={{
                        py: 1.25,
                        px: 2,
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        maxWidth: 220,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "text.primary",
                        }}
                      >
                        {referral.referred_user?.first_name} {referral.referred_user?.last_name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 11,
                          color: "text.secondary",
                          mt: 0.5,
                        }}
                      >
                        {referral.referred_user?.email}
                      </Typography>
                    </TableCell>

                    {/* Role */}
                    <TableCell
                      sx={{
                        py: 1.25,
                        px: 2,
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "inline-block",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: "rgba(255,255,255,0.05)",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 12,
                            color: "text.primary",
                            textTransform: "capitalize",
                          }}
                        >
                          {referral.role}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Created At */}
                    <TableCell
                      sx={{
                        py: 1.25,
                        px: 2,
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 13,
                          color: "text.secondary",
                        }}
                      >
                        {new Date(referral.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography>
                    </TableCell>

                    {/* Updated At */}
                    <TableCell
                      sx={{
                        py: 1.25,
                        px: 2,
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 13,
                          color: "text.secondary",
                        }}
                      >
                        {new Date(referral.updated_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={totalCount}
            page={currentPage - 1} // MUI TablePagination is 0-indexed
            onPageChange={onPageChange}
            rowsPerPage={pageSize}
            onRowsPerPageChange={(e) =>
              onPageSizeChange(parseInt(e.target.value, 10))
            }
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{
              color: "text.secondary",
              "& .MuiTablePagination-actions": {
                color: "var(--accent-gold)",
              },
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          />
        </>
      )}
    </Box>
  );
}