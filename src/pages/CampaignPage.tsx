import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { AppDispatch, RootState } from "../redux/store";
import {
  fetchPromotionSummary,
  fetchPromotions,
  deletePromotion,
  updatePromotion,
  createPromotion,
} from "../api/xhrHelper";
import PromotionsTable from "../components/promotions/Table";
import SearchFilterRow from "../components/SearchFilterRow";
import { Promotion, CreatePromotionPayload } from "../types/common.types";
import OverviewCards, { OverviewItem } from "../components/OverviewCard";
import CreateEditPromotionModal from "../components/promotions/CreateEditModal";
import ViewPromotionModal from "../components/promotions/ViewModal";
import { MdCampaign, MdPayments, MdRedeem } from "react-icons/md";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RunningWithErrorsIcon from "@mui/icons-material/RunningWithErrors";
import AppButton from "../components/common/AppButton";
import ConfirmDeleteModal from "../components/promotions/DeleteModal";
import toast from "react-hot-toast";

export default function CampaignPage() {
  const dispatch = useDispatch<AppDispatch>();

  const [search, setSearch] = useState("");
  const [discountTypeFilter, setDiscountTypeFilter] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("");

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [viewingPromo, setViewingPromo] = useState<Promotion | null>(null);
const [deletingPromo, setDeletingPromo] = useState<Promotion | null>(null);

  const { list: promotions, summary, saving, deletingId } = useSelector(
    (state: RootState) => state.promotions
  );

  useEffect(() => {
    dispatch(fetchPromotionSummary());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchPromotions({
        page: page + 1,
        page_size: pageSize,
        search: search || undefined,
        discount_type: (discountTypeFilter as any) || undefined,
        is_active: activeFilter === "" ? undefined : activeFilter === "true",
      })
    );
  }, [dispatch, page, pageSize, search, discountTypeFilter, activeFilter]);
  
  
  const promoStats: OverviewItem[] = [
    {
      title: "Total Promos",
      value: summary.data?.total_promos ?? 0,
      icon: <MdCampaign />,
    },
    {
      title: "Active Promos",
      value: summary.data?.active ?? 0,
      icon: <CheckCircleIcon color="success" />,
    },
    {
      title: "Expired Promos",
      value: summary.data?.expired ?? 0,
      icon: <RunningWithErrorsIcon color="error" />,
    },
    {
      title: "Total Redemptions",
      value: summary.data?.total_redemptions ?? 0,
       icon: <MdRedeem color="#9CC4CC"/>,
      },
      {
        title: "Total Discount Given",
        value: `₦${Math.abs(Number(summary.data?.total_discount_given || 0)).toLocaleString()}`,
        icon: <MdPayments color="#336EF5"/>,
    },
  ];

  const handleOpenCreate = () => {
    setEditingPromo(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (promo: Promotion) => {
    setEditingPromo(promo);
    setModalOpen(true);
  };


const handleOpenDelete = (promoOrId: Promotion | string) => {
    if (typeof promoOrId === "string") {
      const found = promotions.data.find((p) => p.id === promoOrId) || null;
      setDeletingPromo(found || ({ id: promoOrId, name: "" } as Promotion));
    } else {
      setDeletingPromo(promoOrId);
    }
  };

const handleConfirmDelete = async () => {
    if (!deletingPromo) return;
    try {
      await dispatch(deletePromotion(deletingPromo.id)).unwrap();
      toast.success("Promotion deleted successfully");
      setDeletingPromo(null);
    } catch (error: any) {
      toast.error(
        typeof error === "string" 
          ? error 
          : error?.message || "Failed to delete promotion"
      );
    }
  };
  
  const handleFormSubmit = async (payload: CreatePromotionPayload) => {
    try {
      if (editingPromo) {
        await dispatch(
          updatePromotion({ id: editingPromo.id, payload })
        ).unwrap();
        toast.success("Promotion updated successfully");
      } else {
        await dispatch(createPromotion(payload)).unwrap();
        toast.success("Promotion created successfully");
      }
      setModalOpen(false);
    } catch (error: any) {
      toast.error(
        typeof error === "string" 
          ? error 
          : error?.message || "Failed to save promotion"
      );
    }
  };

  return (
    <Box className="fade-in" sx={{ p: 1, display: "flex", flexDirection: "column", gap: 3.5 }}>
    
      {/* Search & Filters Row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap-reverse", gap: 2 }}>
        <Box className="md:max-w-xl w-full">
          <SearchFilterRow
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Search promo name, code, description..."
          />
        </Box>

<Box className="w-full md:w-auto flex justify-end">
        <AppButton
              startIcon={<AddIcon />}
                onClick={handleOpenCreate}
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
                Create Promotion
              </AppButton>
</Box>
       
      </Box>

      {/* Overview Cards Block */}
      <OverviewCards items={promoStats} loading={summary.loading} />

 <Box
        sx={{
          display: "flex",
          justifyContent: "end",
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
          }}
        >
 <FormControl size="small" sx={{ minWidth: 150, }}>
          <Select
            value={discountTypeFilter}
            displayEmpty
            onChange={(e) => {
              setDiscountTypeFilter(e.target.value);
              setPage(0);
            }}
            sx={{
              fontSize: 14,
              borderRadius: "8px",
              backgroundColor: "var(--bg-secondary, #161B26)",
              color: "var(--text-secondary, #8A92A6)",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--border, rgba(255, 255, 255, 0.08))",
              },
            }}
          >
            <MenuItem value="" sx={{ fontSize: 12 }}>
              All Types
            </MenuItem>
            <MenuItem value="PERCENTAGE" sx={{ fontSize: 12, }}>
              Percentage (%)
            </MenuItem>
            <MenuItem value="FIXED" sx={{ fontSize: 12 }}>
              Fixed Amount
            </MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select
            value={activeFilter}
            displayEmpty
            onChange={(e) => {
              setActiveFilter(e.target.value);
              setPage(0);
            }}
            sx={{
              fontSize: 14,
              borderRadius: "8px",
              backgroundColor: "var(--bg-secondary, #161B26)",
              color: "var(--text-secondary, #8A92A6)",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--border, rgba(255, 255, 255, 0.08))",
              },
            }}
          >
            <MenuItem value="" sx={{ fontSize: 14 }}>
              All Status
            </MenuItem>
            <MenuItem value="true" sx={{ fontSize: 14 }}>
              🟢 Active
            </MenuItem>
            <MenuItem value="false" sx={{ fontSize: 14 }}>
              🔴 Inactive
            </MenuItem>
          </Select>
        </FormControl>
        </Box>
        </Box>

      {/* Promotions List Table */}
      <PromotionsTable
        promotions={promotions}
        page={page}
        pageSize={pageSize}
        deletingId={deletingId}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(0);
        }}
        onRowClick={(promo) => setViewingPromo(promo)}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Create / Edit Dialog */}
      <CreateEditPromotionModal
        open={modalOpen}
        editingPromo={editingPromo}
        saving={saving}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Detail View Dialog */}
      <ViewPromotionModal
        open={Boolean(viewingPromo)}
        promo={viewingPromo}
        onClose={() => setViewingPromo(null)}
        onEdit={(promo) => handleOpenEdit(promo)}
      />
      
      <ConfirmDeleteModal
        open={Boolean(deletingPromo)}
        isDeleting={Boolean(deletingId)}
        promoName={deletingPromo?.name}
        onClose={() => setDeletingPromo(null)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}