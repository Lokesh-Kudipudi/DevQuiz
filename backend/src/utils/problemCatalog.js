const fs = require("fs");
const path = require("path");

let cachedProblems = null;
let cachedSourcePath = null;

const CANDIDATE_PATHS = [
  path.resolve(process.cwd(), "src/data/problems.json"),
  path.resolve(process.cwd(), "public/problems.json"),
  path.resolve(
    process.cwd(),
    "../frontend/public/problems.json",
  ),
];

const getCatalogPath = () => {
  if (process.env.PROBLEMS_CATALOG_PATH) {
    return path.resolve(
      process.cwd(),
      process.env.PROBLEMS_CATALOG_PATH,
    );
  }

  return CANDIDATE_PATHS.find((candidatePath) =>
    fs.existsSync(candidatePath),
  );
};

const loadProblemCatalog = () => {
  if (cachedProblems) {
    return {
      problems: cachedProblems,
      sourcePath: cachedSourcePath,
    };
  }

  const catalogPath = getCatalogPath();

  if (!catalogPath) {
    throw new Error(
      "Problem catalog not found. Set PROBLEMS_CATALOG_PATH or place problems.json in an expected location.",
    );
  }

  const raw = fs.readFileSync(catalogPath, "utf-8");
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error(
      "Problem catalog must be an array of problems.",
    );
  }

  cachedProblems = parsed;
  cachedSourcePath = catalogPath;

  return {
    problems: cachedProblems,
    sourcePath: cachedSourcePath,
  };
};

module.exports = {
  loadProblemCatalog,
};
