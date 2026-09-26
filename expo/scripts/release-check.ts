import {releaseBlockers,reviewRecords} from '../content/review';
const blocked=releaseBlockers(reviewRecords);
if(blocked.length){console.error(`Clinical release blocked: ${blocked.length} entries lack current independent approval. See docs/CLINICAL_REVIEW.md.`);process.exitCode=1;}else console.log('All content review records are current. Complete the native release checks before distribution.');
