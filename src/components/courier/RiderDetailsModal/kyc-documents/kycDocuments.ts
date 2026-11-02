import { CourierRider } from "../../../../types/common.types";

export type KycDocKind = "image" | "pdf" | "other";

export interface KycDocument {
  key: string;
  label: string;
  url: string;
  kind: KycDocKind;
}

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif", "bmp", "avif", "svg", "heic"];
const OTHER_EXTENSIONS = ["doc", "docx", "xls", "xlsx", "csv", "txt", "zip"];

export const ZOOM_MIN = 1;
export const ZOOM_MAX = 3;
export const ZOOM_STEP = 0.5;

export const kindLabel: Record<KycDocKind, string> = {
  image: "Image",
  pdf: "PDF",
  other: "File",
};

/**
 * Work out how to render a file from its URL. URLs without a recognisable
 * extension are treated as images; if the image fails to load, the viewer
 * falls back to an "open original" state.
 */
export function getDocKind(url: string): KycDocKind {
  let path = url;
  try {
    path = new URL(url, window.location.origin).pathname;
  } catch {
    /* keep raw url */
  }
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (IMAGE_EXTENSIONS.includes(ext)) return "image";
  if (OTHER_EXTENSIONS.includes(ext)) return "other";
  return "image";
}

export function buildKycDocuments(rider: CourierRider): KycDocument[] {
  const candidates: Array<{ key: string; label: string; url?: string | null }> = [
    { key: "rider_permit", label: "Rider Permit", url: rider.rider_permit_url },
    { key: "government_id_front", label: "Government ID", url: rider.government_id_front_url },
    { key: "vehicle_picture", label: "Vehicle Picture", url: rider.vehicle_picture_url },
  ];

  return candidates
    .filter((c): c is { key: string; label: string; url: string } => Boolean(c.url))
    .map((c) => ({ ...c, kind: getDocKind(c.url) }));
}
