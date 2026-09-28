import { contentProblems } from "../content/validate";
const problems = contentProblems();
if (problems.length) {
  console.error(problems.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    "Content structure valid. This does not confer clinical approval.",
  );
