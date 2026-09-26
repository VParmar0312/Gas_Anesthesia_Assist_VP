import { catalog } from "./catalog";
import { contentVersion } from "./sources";
export type ReviewRecord = {
  contentId: string;
  version: string;
  status: "draft" | "approved";
  clinicalReviewer: string | null;
  reviewedAt: string | null;
  reviewDue: string | null;
};
/** Approval fields must be completed by the responsible human reviewer in a reviewed change. */
export const reviewRecords: ReviewRecord[] = catalog.map((e) => ({
  contentId: e.id,
  version: contentVersion,
  status: "draft",
  clinicalReviewer: null,
  reviewedAt: null,
  reviewDue: null,
}));
export function releaseBlockers(
  records: ReviewRecord[],
  now = new Date(),
): string[] {
  return records
    .filter(
      (r) =>
        r.status !== "approved" ||
        !r.clinicalReviewer?.trim() ||
        !r.reviewedAt ||
        !r.reviewDue ||
        !Number.isFinite(Date.parse(r.reviewedAt)) ||
        !Number.isFinite(Date.parse(r.reviewDue)) ||
        Date.parse(r.reviewDue) < now.getTime(),
    )
    .map((r) => r.contentId);
}
