import { catalog } from "./catalog";
import { sources, contentVersion } from "./sources";
import { drugDetails, factProblems, propofolDoses } from "./drugDetails";
import { reviewRecords } from "./review";
import { toolDefinitions } from "./tools";
export function contentProblems(): string[] {
  const problems: string[] = [],
    ids = catalog.map((e) => e.id);
  if (new Set(ids).size !== ids.length) problems.push("Duplicate catalog IDs");
  if (
    new Set(reviewRecords.map((r) => r.contentId)).size !== reviewRecords.length
  )
    problems.push("Duplicate review IDs");
  for (const entry of catalog) {
    for (const id of entry.sources)
      if (!sources[id]) problems.push(`${entry.id}: orphan citation ${id}`);
    for (const id of entry.related)
      if (!ids.includes(id))
        problems.push(`${entry.id}: unsupported link ${id}`);
    const review = reviewRecords.find((r) => r.contentId === entry.id);
    if (!review || review.version !== contentVersion)
      problems.push(`${entry.id}: missing or mismatched review record`);
  }
  for (const source of Object.values(sources)) {
    if (
      !source.title.trim() ||
      !source.version.trim() ||
      !source.scope.trim() ||
      !Number.isFinite(Date.parse(source.checked))
    )
      problems.push(`${source.id}: incomplete source metadata`);
    try {
      if (new URL(source.url).protocol !== "https:")
        problems.push(`${source.id}: non-HTTPS source`);
    } catch {
      problems.push(`${source.id}: invalid URL`);
    }
  }
  for (const [drug, fields] of Object.entries(drugDetails))
    for (const [field, fact] of Object.entries(fields)) {
      problems.push(...factProblems(fact).map((p) => `${drug}/${field}: ${p}`));
      if (!sources[fact.sourceId])
        problems.push(`${drug}/${field}: orphan citation`);
    }
  for (const fact of propofolDoses) problems.push(...factProblems(fact, true));
  for (const tool of toolDefinitions) {
    if (!tool.scope || !tool.formula)
      problems.push(`${tool.id}: missing tool scope/formula`);
    for (const field of tool.fields)
      if (
        !field.unit ||
        !Number.isFinite(field.min) ||
        !Number.isFinite(field.max) ||
        field.min > field.max
      )
        problems.push(`${tool.id}/${field.id}: invalid unit/bounds`);
    for (const source of tool.sources)
      if (!sources[source]) problems.push(`${tool.id}: orphan tool citation`);
  }
  return problems;
}
