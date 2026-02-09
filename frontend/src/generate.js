const fs = require("fs");
const path = require("path");

const roadmaps = [
  { slug: "ios-development", title: "iOS Development" },
  { slug: "software-architect", title: "Software Architect" },
  { slug: "cyber-security", title: "Cyber Security" },
  { slug: "ux-design", title: "UX Design" },
  { slug: "technical-writer", title: "Technical Writer" },
  { slug: "game-developer", title: "Game Developer" },
  { slug: "server-side-game-developer", title: "Server Side Game Developer" },
  { slug: "mlops-engineer", title: "MLOps Engineer" },
  { slug: "product-manager", title: "Product Manager" },
  { slug: "engineering-manager", title: "Engineering Manager" },
  { slug: "devrel-developer-relations", title: "DevRel (Developer Relations)" },
  { slug: "bi-analyst", title: "BI Analyst" },
];

const BASE_DIR = path.join(process.cwd(), "app/roadmap");

roadmaps.forEach(({ slug, title }) => {
  const folderPath = path.join(BASE_DIR, slug);
  const filePath = path.join(folderPath, "page.tsx");

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(
      filePath,
      `export default function Page() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">${title}</h1>
      <p className="mt-2 text-gray-600">
        Roadmap page for ${title}
      </p>
    </main>
  );
}
`
    );
  }
});

console.log("✅ Pages created successfully!");
