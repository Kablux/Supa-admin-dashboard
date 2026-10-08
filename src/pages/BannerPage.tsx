import { useCallback, useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { loadBanners, toggleBannerActive, removeBanner } from "../api/xhrHelper";
import AppButton from "../components/common/AppButton";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setAudienceFilter, setActiveFilter, setPage, setPageSize } from "../redux/slices/Banner";
import { setSearch } from "../redux/slices/Banner";
import { Banner } from "../types/common.types";
import SearchFilterRow from "../components/SearchFilterRow";
import BannerFilters from "../components/banners/BannerFilters";
import BannerPreviewDialog from "../components/banners/BannerPreviewDialog";
import BannerTable from "../components/banners/BannerTable";
import DeleteBannerDialog from "../components/banners/DeleteBannerDialog";
import { TablePagination } from "@mui/material";
import BannerFormModal from "../components/banners/modal/BannerFormModal";



export default function BannersPage(): React.ReactElement {
  const dispatch = useAppDispatch();

  const {
    list,
    count,
    currentPage,
    pageSize,
    search,
    audienceFilter,
    activeFilter,
    listStatus,
    mutateStatus,
    error,
  } = useAppSelector((state) => state.banners);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Banner | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);
  const [previewTarget, setPreviewTarget] = useState<Banner | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const isLoading = listStatus === "loading";
  const totalPages = Math.ceil(count / pageSize);
  const isFiltered = Boolean(
    search || audienceFilter || activeFilter !== ""
  );

  const reload = useCallback(() => {
    dispatch(loadBanners());
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadBanners());
  }, [dispatch, currentPage,pageSize, search, audienceFilter, activeFilter]);

  const handleEdit = (banner: Banner) => {
    setEditTarget(banner);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setTimeout(() => setEditTarget(null), 300);
    reload();
  };

  const handleToggleActive = async (
    event: React.MouseEvent,
    banner: Banner
  ) => {
    event.stopPropagation();

    setTogglingId(banner.id);

    await dispatch(
      toggleBannerActive({
        id: banner.id,
        is_active: !banner.is_active,
      })
    );

    setTogglingId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    await dispatch(removeBanner(deleteTarget.id));
    setDeleteTarget(null);
  };

  const clearFilters = () => {
    dispatch(setSearch(""));
    dispatch(setAudienceFilter(""));
    dispatch(setActiveFilter(""));
  };

  return (
    <Box
      className="fade-in"
      sx={{ p: 1, display: "flex", flexDirection: "column", gap: 3.5 }}
    >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box className="md:max-w-3xl w-full" >
      {/* ── Filters bar ── */}
      
      <SearchFilterRow
              value={search}
              onChange={e => dispatch(setSearch(e.target.value))}
              placeholder="Search for a banner by name or email"
            />
         
        </Box>
        <AppButton
          startIcon={<AddIcon />}
          onClick={() => { setEditTarget(null); setFormOpen(true); }}
         sx={{
              textTransform: "none",
              fontSize: 14,
              px: 2,
              backgroundColor: "var(--accent-gold, #FFD700)",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "var(--accent-gold, #FFD700)",
                boxShadow: "0 4px 12px rgba(255,215,0,0.25)",
              },
            }}
        >
          Create Banner
        </AppButton>
      </Box>


      {error && (
        <Alert
          severity="error"
          sx={{ borderRadius: "12px", fontSize: 12 }}
        >
          {error}
        </Alert>
      )}

      <Box
        sx={{
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.5,
            py: 2,
            gap: 2,
            flexWrap: "wrap",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
            }}
          >
            <Typography
              sx={{
                 
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              All Banners
            </Typography>

            {!isLoading && (
              <Chip
                label={count}
                size="small"
                sx={{
                  height: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  backgroundColor: "var(--accent-gold-glow)",
                  color: "var(--accent-gold)",
                  border: "1px solid rgba(245,197,24,0.22)",
                  "& .MuiChip-label": { px: 0.75 },
                }}
              />
            )}

            {isFiltered && (
              <Chip
                label="Filtered"
                size="small"
                onDelete={clearFilters}
                sx={{
                  height: 22,
                  fontSize: 11,
                  backgroundColor: "rgba(66,165,245,0.1)",
                  color: "#42A5F5",
                  border: "1px solid rgba(66,165,245,0.25)",
                  "& .MuiChip-deleteIcon": {
                    color: "#42A5F5",
                    fontSize: 14,
                  },
                }}
              />
            )}
          </Box>

          <BannerFilters
           
            audienceFilter={audienceFilter}
            activeFilter={activeFilter}
            onAudienceChange={(value) =>
              dispatch(setAudienceFilter(value))
            }
            onActiveChange={(value) => dispatch(setActiveFilter(value))}
          />
        </Box>

        <BannerTable
          list={list}
          isLoading={isLoading}
          isFiltered={isFiltered}
          togglingId={togglingId}
          onPreview={setPreviewTarget}
          onToggle={handleToggleActive}
          onEdit={handleEdit}
          onDelete={setDeleteTarget}
          onClearFilters={clearFilters}
          onCreate={() => {
            setEditTarget(null);
            setFormOpen(true);
          }}
        />

        {totalPages > 1 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2.5,
              py: 1.75,
              borderTop: "1px solid var(--border)",
            }}
          >
            <Typography
              sx={{
                fontSize: 12.5,
                color: "var(--text-muted)",
              }}
            >
              Showing {((currentPage - 1) * pageSize) + 1}–
              {Math.min(currentPage * pageSize, count)} of{" "}
              {count.toLocaleString()} banners
            </Typography>

            
              {!isLoading && list.length > 0 && (
                   <TablePagination
  component="div"
  count={count} 
  page={currentPage - 1} 
  onPageChange={(_, newPage) => {
    dispatch(setPage(newPage + 1)); 
  }}
  rowsPerPage={pageSize}
  onRowsPerPageChange={(e) => {
    dispatch(setPageSize(parseInt(e.target.value, 10)));
  }}
  rowsPerPageOptions={[5, 10, 25]}
  sx={{
    color: "rgba(255,255,255,0.6)",
    "& .MuiTablePagination-actions": { color: "var(--accent-gold)" },
    borderTop: "1px solid rgba(255,255,255,0.05)",
  }}
/>
                  )}
          </Box>
        )}
      </Box>

      <BannerFormModal
        open={formOpen}
        banner={editTarget}
        onClose={handleFormClose}
      />

      <DeleteBannerDialog
        banner={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={mutateStatus === "loading" && Boolean(deleteTarget)}
      />

      <BannerPreviewDialog
        banner={previewTarget}
        onClose={() => setPreviewTarget(null)}
        onEdit={(banner) => {
          setPreviewTarget(null);
          handleEdit(banner);
        }}
      />
    </Box>
  );
}
