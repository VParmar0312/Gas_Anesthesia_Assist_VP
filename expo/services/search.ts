import { Entry } from "../content/catalog";
const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
function near(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0,
    j = 0,
    edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length >= b.length) i++;
    if (b.length >= a.length) j++;
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}
export function searchEntries(entries: Entry[], query: string, kind = "all") {
  const q = normalize(query);
  return entries
    .filter((e) => kind === "all" || e.kind === kind)
    .map((e) => {
      const title = normalize(e.title),
        aliases = e.aliases.map(normalize),
        text = normalize(`${e.title} ${e.summary} ${e.aliases.join(" ")}`);
      const score = !q
        ? 1
        : title === q || aliases.includes(q)
          ? 100
          : title.startsWith(q)
            ? 80
            : text.includes(q)
              ? 60
              : q
                    .split(" ")
                    .every((token) =>
                      text
                        .split(" ")
                        .some(
                          (word) =>
                            word.startsWith(token) ||
                            (token.length >= 4 && near(token, word)),
                        ),
                    )
                ? 30
                : 0;
      return { e, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.e.title.localeCompare(b.e.title))
    .map((x) => x.e);
}
