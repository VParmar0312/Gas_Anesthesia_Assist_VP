import { releaseBlockers, reviewRecords } from "../content/review";
import { contentProblems } from "../content/validate";
const structure = contentProblems(),
  blocked = releaseBlockers(reviewRecords);
if (structure.length) console.error(structure.join("\n"));
if (blocked.length)
  console.error(
    `Clinical release blocked: ${blocked.length} entries lack current authorized approval and matching acceptance fixtures.\n${blocked.join(", ")}`,
  );
process.exitCode = structure.length || blocked.length ? 1 : 0;
