import { BannerPayload, BannerFormErrors } from "../types/common.types";

export function formatDate(iso: string | null): string {
  if (!iso) return "—";

  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function isExpired(endsAt: string | null): boolean {
  if (!endsAt) return false;
  return new Date(endsAt) < new Date();
}

export function isScheduled(startsAt: string | null): boolean {
  if (!startsAt) return false;
  return new Date(startsAt) > new Date();
}

export function getBannerImage(banner: {
  image_url?: string | null;
  image_large?: string | null;
  image_small?: string | null;
}) {
  return banner.image_url || banner.image_large || banner.image_small || "";
}


export function validateForm(v: BannerPayload): BannerFormErrors {
  const e: BannerFormErrors = {};

  if (!v.title?.trim()) e.title = 'Title is required';
  if (!v.audience) e.audience = 'Select an audience';

  if (!v.starts_at) e.starts_at = 'Start date is required';
  if (!v.ends_at) e.ends_at = 'End date is required';

  if (v.starts_at && v.ends_at) {
    const startObj = new Date(v.starts_at);
    const endObj = new Date(v.ends_at);

    if (endObj.getTime() <= startObj.getTime()) {
      e.ends_at = 'End date must be strictly after the start date';
    }
  }

  if (v.is_clickable && v.cta_type !== 'NONE' && !v.cta_value?.trim()) {
    e.cta_value = 'CTA value is required when a CTA type is selected';
  }

  return e;
}