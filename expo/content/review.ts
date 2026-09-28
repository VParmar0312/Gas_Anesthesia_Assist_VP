import { catalog } from "./catalog";
import { contentVersion } from "./sources";
export type ReviewRecord = {
  contentId: string;
  version: string;
  status: "draft" | "approved";
  clinicalReviewer: string | null;
  reviewedAt: string | null;
  reviewDue: string | null;
  acceptanceFixtureIds?: string[];
};
export interface AcceptanceFixture {
  contentId: string;
  version: string;
  description: string;
  expected: string;
  verifiedBy: string;
}
/** These registries are intentionally empty. Authorized humans must add approvals in a reviewed change. */
export const authorizedReviewers: string[] = [];
export const clinicalAcceptanceFixtures: Record<string, AcceptanceFixture> = {};
export const reviewRecords: ReviewRecord[] = catalog.map((e) => ({
  contentId: e.id,
  version: contentVersion,
  status: "draft",
  clinicalReviewer: null,
  reviewedAt: null,
  reviewDue: null,
  acceptanceFixtureIds: [],
}));
export function releaseBlockers(
  records: ReviewRecord[],
  now = new Date(),
  fixtures = clinicalAcceptanceFixtures,
  reviewers = authorizedReviewers,
): string[] {
  return records
    .filter((r) => {
      const reviewed = Date.parse(r.reviewedAt ?? ""),
        due = Date.parse(r.reviewDue ?? "");
      return (
        r.status !== "approved" ||
        !r.clinicalReviewer?.trim() ||
        !reviewers.includes(r.clinicalReviewer) ||
        !Number.isFinite(reviewed) ||
        !Number.isFinite(due) ||
        reviewed > now.getTime() ||
        due <= reviewed ||
        due <= now.getTime() ||
        !r.acceptanceFixtureIds?.length ||
        r.acceptanceFixtureIds.some((id) => {
          const f = fixtures[id];
          return (
            !f ||
            f.contentId !== r.contentId ||
            f.version !== r.version ||
            !f.description.trim() ||
            !f.expected.trim() ||
            f.verifiedBy !== r.clinicalReviewer
          );
        })
      );
    })
    .map((r) => r.contentId);
}
