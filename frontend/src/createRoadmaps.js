const fs = require("fs");
const path = require("path");

const slugs = [
 
  "devops",
  "devsecops",
  "data-analyst",
  "ai-engineer",
  "ai-data-scientist",
  "data-engineer",
  "android-development",
  "machine-learning-engineer",
  "postgresql-dba",
  "blockchain-development",
  "qa-engineer",
  "ios-development",
  "software-architect",
  "cyber-security",
  "ux-design",
  "technical-writer",
  "game-developer",
  "server-side-game-developer",
  "mlops-engineer",
  "product-manager",
  "engineering-manager",
  "devrel-developer-relations",
  "bi-analyst"
];

const baseDir = path.join(__dirname, "json");

// create folder if not exists
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir);
}

// create empty json files
slugs.forEach(slug => {
  const filePath = path.join(baseDir, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "");
  }
});

console.log("✅ All JSON files created successfully");
