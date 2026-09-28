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
