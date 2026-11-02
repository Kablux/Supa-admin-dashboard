import { Dialog, DialogContent } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import { CourierRider } from "../../../types/common.types";
import { useAppSelector } from "../../../redux/hooks";
import RiderDetailsHeader from "./RiderDetailsHeader";
import RiderStatusBadges from "./RiderStatusBadges";
import ContactInfoSection from "./ContactInfoSection";
import VehicleInfoSection from "./VehicleInfoSection";
import GuarantorsSection from "./GuarantorsSection";
import ComplianceNotesSection from "./ComplianceNotesSection";
import RiderDetailsActions from "./RiderDetailsActions";
import DetailSection from "./shared/DetailSection";
import { KycDocumentsSection, buildKycDocuments } from "./kyc-documents";

const KYC_REVIEWABLE = ["UNDER_REVIEW", "NEEDS_RESUBMISSION"];

export interface RiderDetailsModalProps {
  open: boolean;
  rider: CourierRider | null;
  kycApprovingId?: string | null;
  kycRejectingId?: string | null;
  suspendingId?: string | null;
  unsuspendingId?: string | null;
  onClose: () => void;
  onApproveKyc: (userId: string) => void;
  onRejectKyc: (rider: CourierRider) => void;
  /** Leave undefined until the suspend endpoint ships — button shows as "coming soon" */
  onSuspend?: (rider: CourierRider) => void;
  onUnsuspend?: (rider: CourierRider) => void;
}

export default function RiderDetailsModal({
  open,
  rider,
  kycApprovingId,
  kycRejectingId,
  suspendingId,
  unsuspendingId,
  onClose,
  onApproveKyc,
  onRejectKyc,
  onSuspend,
  onUnsuspend,
}: RiderDetailsModalProps) {
  const { user } = useAppSelector((state) => state.auth);
  if (!rider) return null;

  // ── Eligibility ──
  const isKycReviewable = KYC_REVIEWABLE.includes(rider.kyc_status);
  const canApproveKyc = isKycReviewable;
  const canRejectKyc = isKycReviewable && rider.account_status === "PENDING_APPROVAL";

  const accountStatus = rider.account_status?.toUpperCase();
  const canSuspend = accountStatus === "ACTIVE";
  const canUnsuspend = accountStatus === "SUSPENDED";

  const kycDocuments = buildKycDocuments(rider);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "var(--bg-card, #1A1D26)",
          backgroundImage: "none",
          border: "1px solid var(--border, rgba(255, 255, 255, 0.08))",
          borderRadius: "16px",
          color: "var(--text-primary, #FFFFFF)",
          overflow: "hidden",
        },
      }}
    >
      <RiderDetailsHeader rider={rider} onClose={onClose} />

      <DialogContent
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
        <RiderStatusBadges rider={rider} isSuspended={canUnsuspend} />
        <ContactInfoSection rider={rider} />
        <VehicleInfoSection rider={rider} />

        <DetailSection title="KYC Documents & Media" icon={<DescriptionIcon fontSize="small" />} bare>
         
          <KycDocumentsSection key={rider.id} documents={kycDocuments} />
        </DetailSection>

        <GuarantorsSection rider={rider} />
        <ComplianceNotesSection rider={rider} approverEmail={user?.email || "Admin"} />
      </DialogContent>

      <RiderDetailsActions
        rider={rider}
        canApproveKyc={canApproveKyc}
        canRejectKyc={canRejectKyc}
        canSuspend={canSuspend}
        canUnsuspend={canUnsuspend}
        isApproving={kycApprovingId === rider.id}
        isRejecting={kycRejectingId === rider.id}
        isSuspending={suspendingId === rider.id}
        isUnsuspending={unsuspendingId === rider.id}
        onApproveKyc={onApproveKyc}
        onRejectKyc={onRejectKyc}
        onSuspend={onSuspend}
        onUnsuspend={onUnsuspend}
      />
    </Dialog>
  );
}
