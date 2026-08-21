import { Driver } from "../../../types/auth";

export type DriverActionType =
  | "approve"
  | "activate"
  | "reject"
  | "suspend"
  | "delete";

export const primaryVehicleOf = (d?: Driver | null) =>
  d?.vehicles?.[0] || d?.vehicle;

export const primaryImageOf = (d?: Driver | null): string | null => {
  const v: any = primaryVehicleOf(d);
  return (
    v?.images?.find((img: any) => img.image_type === "front")?.image_url ||
    v?.images?.[0]?.image_url ||
    null
  );
};

export const getDriverFlags = (d?: Driver | null) => ({
  isActive: d?.kyc_status === "APPROVED",
  isSuspended: d?.status === "suspended",
  isInReview: d?.kyc_status === "IN_REVIEW",
  isPending: d?.kyc_status === "PENDING",
  isRejected: d?.kyc_status === "REJECTED",
});