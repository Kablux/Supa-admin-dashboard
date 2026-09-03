import React from "react";
import ExportModal, { ExportColumn } from "../ExportModal";
import { getReferrals } from "../../api/xhr";
import { ReferralQueryParams, ReferralUser } from "../../types/common.types";

const REFERRALS_COLUMNS: ExportColumn[] = [
  { key: "id", label: "user_id", default: true },
  { key: "user", label: "Referrer", default: true },
  { key: "referred_user", label: "Referred User", default: true },
  { key: "role", label: "Role", default: true },
  { key: "created_at", label: "Date Created", default: true },
  { key: "updated_at", label: "Last Updated", default: false },
];

interface ExportReferralsModalProps {
  isOpen: boolean;
  onClose: () => void;
  params: ReferralQueryParams;
}

const getUserDisplayName = (user?: ReferralUser | string): string => {
  if (!user) return "N/A";
  if (typeof user === "string") return user;

  const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
  return fullName || user.email || user.id || "N/A";}
  
export default function ExportReferralsModal({
  isOpen,
  onClose,
  params,
}: ExportReferralsModalProps) {
  return (
    <ExportModal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Referrals"
      entityLabel="referrals"
      fileBaseName="referrals_export"
      columns={REFERRALS_COLUMNS}
      fetchPage={async (page, page_size) => {
        const res = await getReferrals({ ...params, page, page_size });
        const formattedResults = res.data.results.map((item) => ({
          ...item,
          user: getUserDisplayName(item.user),
          referred_user: getUserDisplayName(item.referred_user),
        }));

        return { 
          results: formattedResults as unknown as Record<string, unknown>[], 
          count: res.data.count 
        };
      }}
    />
  );
}