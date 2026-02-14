import { FileCode, Palette, FileJson, Atom, GitBranch, Server } from "lucide-react";

export const topics = [
  {
    id: "html",
    name: "HTML",
    icon: FileCode,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    lessons: [
      { 
        id: "intro", 
        title: "Introduction to HTML", 
        description: "HTML (HyperText Markup Language) is the skeleton of every website. It tells the browser what content is on the page—headings, paragraphs, images, and links.",
        videoUrl: "https://www.youtube.com/embed/UB1O30fR-EE", 
        problem: "Computers need a structured way to understand text, images, and layout. Without HTML, a browser would just see a blob of unformatted text.",
        mentalModel: "Think of HTML like the frame of a house. It defines the rooms (sections) and structure, but it doesn't decide the paint color (CSS) or how the lights turn on (JavaScript).",
        whenToUse: ["Structuring web content", "Creating forms", "Embedding images/video"],
        whenNotToUse: ["Styling the page (use CSS)", "Complex logic (use JS)"],
        syntax: "<tagname>Content goes here...</tagname>",
        code: `<!DOCTYPE html>
<html>
<head>
  <title>My First Page</title>
</head>
<body>
  <h1>Hello World</h1>
  <p>This is my first website.</p>
</body>
</html>`,
        subtopics: [
            {
                title: "The Anatomy of an Element",
                content: "An HTML element usually consists of a start tag, content, and an end tag.",
                example: "<h1>This is a Heading</h1>",
                tip: "Tags are case-insensitive, but it's best practice to use lowercase (e.g., <div> not <DIV>)."
            },
            {
                title: "Nesting Elements",
                content: "Elements can contain other elements. This is called nesting.",
                example: "<div><p>I am inside a div!</p></div>",
                tip: "Always close inner tags before closing outer tags. Think of them like Russian nesting dolls."
            }
        ],
        commonMistakes: [
            "Forgetting the end tag (e.g., leaving a <p> open).",
            "Nesting block elements inside inline elements incorrectly."
        ],
        bonusTip: "Use semantic tags like <article> and <section> instead of just <div> for better SEO and accessibility."
      },
    ],
  },
  {
    id: "css",
    name: "CSS",
    icon: Palette,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    lessons: [
      { 
        id: "intro", 
        title: "Introduction to CSS", 
        description: "CSS (Cascading Style Sheets) controls how HTML elements are displayed.",
        videoUrl: "https://www.youtube.com/embed/yfoY53QXEnI",
        problem: "HTML is ugly by default. CSS solves the problem of design, layout, and visual hierarchy.",
        mentalModel: "If HTML is the skeleton, CSS is the skin, clothes, and makeup.",
        whenToUse: ["Changing colors/fonts", "Layouts (Grid/Flexbox)", "Responsive design"],
        whenNotToUse: ["Defining page structure (use HTML)", "Handling data logic (use JS)"],
        syntax: "selector { property: value; }",
        code: `body {
  font-family: sans-serif;
  background-color: #f0f0f0;
}
h1 {
  color: navy;
  text-align: center;
}`,
        subtopics: [],
        commonMistakes: [" forgetting the semi-colon ; at the end of a line."],
        bonusTip: "Use CSS Variables (--primary-color) to make theme changes easy."
      },
    ],
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: FileJson,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    lessons: [
      { 
        id: "intro", 
        title: "Introduction to JavaScript", 
        description: "JavaScript is the programming language of the web. It allows you to add interactivity, manipulate content, and communicate with servers.",
        videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk",
        problem: "HTML and CSS are static. You can't click a button to hide an element or fetch data from a server without logic.",
        mentalModel: "If HTML is the skeleton and CSS is the skin, JavaScript is the nervous system and muscles. It makes things move and react.",
        whenToUse: ["Handling user clicks", "Validating forms", "Fetching data (API calls)", "Complex animations"],
        whenNotToUse: ["Static content (use HTML)", "Simple styling (use CSS)"],
        syntax: "function name() { // code }",
        code: `// Select a button
const btn = document.querySelector('button');

// Add an event listener
btn.addEventListener('click', () => {
  alert('Button clicked!');
});`,
        subtopics: [
            {
                title: "Variables",
                content: "Containers for storing data values.",
                example: "let count = 0; const name = 'Alice';",
                tip: "Use 'const' by default, and 'let' only if you need to reassign the value. Avoid 'var'."
            },
            {
                title: "Functions",
                content: "Blocks of code designed to perform a particular task.",
                example: "function greet(name) { return 'Hello ' + name; }",
                tip: "Arrow functions (=>) are a concise syntax for writing functions."
            }
        ],
        commonMistakes: ["Confusing '=' (assignment) with '==' or '===' (comparison).", " forgetting that JS is case-sensitive."],
        bonusTip: "Use console.log() frequently to debug and see what your code is doing."
      },
    ],
  },
  {
    id: "react",
    name: "React",
    icon: Atom,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    lessons: [
      { 
        id: "components", 
        title: "React Components", 
        description: "React is a library for building user interfaces based on components. A component is a small, reusable piece of UI.",
        videoUrl: "https://www.youtube.com/embed/SqcY0GlETPk",
        problem: "Building complex UIs with vanilla JS leads to 'spaghetti code' where state management becomes difficult.",
        mentalModel: "Lego blocks. You build small blocks (Button, Header, Card) and assemble them into a castle (App).",
        whenToUse: ["Single Page Applications (SPAs)", "Complex interactive UIs", "Large teams sharing UI components"],
        whenNotToUse: ["Simple static websites", "When bundle size must be extremely minimal"],
        syntax: "const Component = () => { return <div>Hello</div>; }",
        code: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count is {count}
    </button>
  );
}`,
        subtopics: [
            {
                title: "JSX",
                content: "Syntax extension for JavaScript that looks like HTML.",
                example: "const element = <h1>Hello, world!</h1>;",
                tip: "JSX requires a single parent element. Use fragments <>...</> to group elements without adding a node to the DOM."
            },
            {
                title: "Props",
                content: "Inputs passed to components, similar to function arguments.",
                example: "<Welcome name='Sara' />",
                tip: "Props are read-only (immutable) from the child's perspective."
            }
        ],
        commonMistakes: ["Modifying state directly (e.g., state.value = 5) instead of using the setter function.", "Forgetting the 'key' prop in lists."],
        bonusTip: "Keep components small and focused on doing one thing well."
      },
    ],
  },
  {
    id: "git",
    name: "Git & GitHub",
    icon: GitBranch,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    lessons: [
      { 
        id: "basics", 
        title: "Git Basics", 
        description: "Git is a distributed version control system. It tracks changes in your code so you can revert mistakes and collaborate with others.",
        videoUrl: "https://www.youtube.com/embed/USjZcfj8yxE",
        problem: "Without version control, overwriting a file means losing the previous version forever. Collaborating via email/USB is messy.",
        mentalModel: "A time machine for your code. You create 'save points' (commits) that you can travel back to.",
        whenToUse: ["Every project, big or small", "Collaborating with teams"],
        whenNotToUse: ["Never. Always use Git."],
        syntax: "git <command>",
        code: `# Initialize a repository
git init

# Stage changes
git add .

# Commit changes
git commit -m "Initial commit"

# Push to remote
git push origin main`,
        subtopics: [
            {
                title: "Commits",
                content: "A snapshot of your project at a specific point in time.",
                example: "git commit -m 'Fix login bug'",
                tip: "Write clear, descriptive commit messages."
            },
            {
                title: "Branches",
                content: "Parallel versions of your repository. Use them to work on features without breaking the main code.",
                example: "git checkout -b feature-login",
                tip: "Keep the 'main' branch clean and deployable."
            }
        ],
        commonMistakes: ["Committing secrets (API keys, passwords).", "Pushing to the wrong branch."],
        bonusTip: "Use a .gitignore file to exclude node_modules and environment variables."
      },
    ],
  },
  {
    id: "nodejs",
    name: "Node.js",
    icon: Server,
    color: "text-green-600",
    bgColor: "bg-green-600/10",
    lessons: [
      {
        id: "intro",
        title: "Introduction to Node.js",
        description: "Node.js is a runtime environment that allows you to run JavaScript on the server side, outside of the browser.",
        videoUrl: "https://www.youtube.com/embed/TlB_eWDSMt4",
        problem: "JavaScript was originally locked in the browser. To build a backend, you had to learn PHP, Java, or Python.",
        mentalModel: "It's Chrome's V8 JavaScript engine, but ripped out of the browser and given file system and network access.",
        whenToUse: ["Building APIs (REST/GraphQL)", "Real-time applications (Chat, Gaming)", "Server-side rendering"],
        whenNotToUse: ["CPU-intensive tasks (Video encoding, heavy math) - Node is single-threaded."],
        syntax: "const http = require('http');",
        code: `const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});`,
        subtopics: [
            {
                title: "NPM",
                content: "Node Package Manager. The world's largest software registry.",
                example: "npm install express",
                tip: "Check package.json to see your project's dependencies."
            }
        ],
        commonMistakes: ["Blocking the event loop with heavy synchronous code.", "Not handling asynchronous errors properly."],
        bonusTip: "Use 'nodemon' in development to automatically restart your server when files change."
      }
    ]
  }
];
