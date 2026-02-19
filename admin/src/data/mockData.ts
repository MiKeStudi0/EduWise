import { User, Roadmap, Technology, Module, Topic, Subtopic, Lesson, Subscription, SEOEntry, Role, Permission } from '@/types';

export const initialUsers: User[] = [
  { id: 'u1', name: 'Alex Johnson', email: 'alex@learnstak.io', role: 'Admin', status: 'active', createdAt: '2024-01-15' },
  { id: 'u2', name: 'Sarah Chen', email: 'sarah@learnstak.io', role: 'Content Manager', status: 'active', createdAt: '2024-02-20' },
  { id: 'u3', name: 'Mike Rivera', email: 'mike@learnstak.io', role: 'Viewer', status: 'active', createdAt: '2024-03-10' },
  { id: 'u4', name: 'Emily Davis', email: 'emily@learnstak.io', role: 'Content Manager', status: 'inactive', createdAt: '2024-04-05' },
  { id: 'u5', name: 'James Wilson', email: 'james@learnstak.io', role: 'Viewer', status: 'active', createdAt: '2024-05-18' },
  { id: 'u6', name: 'Priya Sharma', email: 'priya@learnstak.io', role: 'Admin', status: 'active', createdAt: '2024-06-01' },
];

export const initialTechnologies: Technology[] = [
  { id: 'tech-1', name: 'React', description: 'A JavaScript library for building user interfaces', status: 'active' },
  { id: 'tech-2', name: 'Node.js', description: 'JavaScript runtime built on Chrome V8 engine', status: 'active' },
  { id: 'tech-3', name: 'Python', description: 'General-purpose programming language', status: 'active' },
];

export const initialModules: Module[] = [
  { id: 'mod-1', technologyId: 'tech-1', name: 'Fundamentals', description: 'Core React concepts', status: 'active' },
  { id: 'mod-2', technologyId: 'tech-1', name: 'Hooks', description: 'React hooks in depth', status: 'active' },
  { id: 'mod-3', technologyId: 'tech-2', name: 'Core Modules', description: 'Node.js core modules', status: 'active' },
  { id: 'mod-4', technologyId: 'tech-2', name: 'Express.js', description: 'Web framework for Node', status: 'active' },
  { id: 'mod-5', technologyId: 'tech-3', name: 'Basics', description: 'Python fundamentals', status: 'active' },
  { id: 'mod-6', technologyId: 'tech-3', name: 'Django', description: 'Python web framework', status: 'inactive' },
];

export const initialTopics: Topic[] = [
  { id: 'top-1', moduleId: 'mod-1', name: 'JSX', description: 'JavaScript XML syntax', status: 'active' },
  { id: 'top-2', moduleId: 'mod-1', name: 'Components', description: 'Building UI components', status: 'active' },
  { id: 'top-3', moduleId: 'mod-2', name: 'useState', description: 'State management hook', status: 'active' },
  { id: 'top-4', moduleId: 'mod-2', name: 'useEffect', description: 'Side effects hook', status: 'active' },
  { id: 'top-5', moduleId: 'mod-3', name: 'File System', description: 'Working with files', status: 'active' },
  { id: 'top-6', moduleId: 'mod-3', name: 'HTTP Module', description: 'HTTP module basics', status: 'active' },
  { id: 'top-7', moduleId: 'mod-4', name: 'Routing', description: 'Express routing', status: 'active' },
  { id: 'top-8', moduleId: 'mod-4', name: 'Middleware', description: 'Express middleware', status: 'inactive' },
  { id: 'top-9', moduleId: 'mod-5', name: 'Data Types', description: 'Python data types', status: 'active' },
  { id: 'top-10', moduleId: 'mod-5', name: 'Control Flow', description: 'Loops and conditions', status: 'active' },
  { id: 'top-11', moduleId: 'mod-6', name: 'Models', description: 'Django ORM models', status: 'active' },
  { id: 'top-12', moduleId: 'mod-6', name: 'Views', description: 'Django views', status: 'inactive' },
];

export const initialSubtopics: Subtopic[] = [
  { id: 'sub-1', topicId: 'top-1', name: 'Expressions', description: 'JSX expressions', status: 'active' },
  { id: 'sub-2', topicId: 'top-1', name: 'Elements', description: 'JSX elements', status: 'active' },
  { id: 'sub-3', topicId: 'top-2', name: 'Functional', description: 'Functional components', status: 'active' },
  { id: 'sub-4', topicId: 'top-2', name: 'Props', description: 'Component props', status: 'active' },
  { id: 'sub-5', topicId: 'top-3', name: 'Basic State', description: 'Basic state usage', status: 'active' },
  { id: 'sub-6', topicId: 'top-3', name: 'Complex State', description: 'Objects and arrays', status: 'active' },
  { id: 'sub-7', topicId: 'top-4', name: 'Side Effects', description: 'Managing side effects', status: 'active' },
  { id: 'sub-8', topicId: 'top-4', name: 'Cleanup', description: 'Effect cleanup', status: 'inactive' },
  { id: 'sub-9', topicId: 'top-5', name: 'Read/Write', description: 'File operations', status: 'active' },
  { id: 'sub-10', topicId: 'top-6', name: 'Server', description: 'HTTP server', status: 'active' },
  { id: 'sub-11', topicId: 'top-7', name: 'GET Routes', description: 'Handling GET', status: 'active' },
  { id: 'sub-12', topicId: 'top-8', name: 'Auth Middleware', description: 'Auth middleware', status: 'active' },
  { id: 'sub-13', topicId: 'top-9', name: 'Strings', description: 'String operations', status: 'active' },
  { id: 'sub-14', topicId: 'top-10', name: 'Loops', description: 'For and while loops', status: 'active' },
  { id: 'sub-15', topicId: 'top-11', name: 'Fields', description: 'Model fields', status: 'active' },
  { id: 'sub-16', topicId: 'top-12', name: 'Class Views', description: 'Class-based views', status: 'inactive' },
];

export const initialLessons: Lesson[] = [
  { id: 'les-1', subtopicId: 'sub-1', title: 'Embedding JavaScript', content: 'Learn to embed JS in JSX', duration: '15 min', status: 'active' },
  { id: 'les-2', subtopicId: 'sub-1', title: 'Template Literals', content: 'Using template literals in JSX', duration: '10 min', status: 'active' },
  { id: 'les-3', subtopicId: 'sub-2', title: 'Creating Elements', content: 'How to create JSX elements', duration: '20 min', status: 'active' },
  { id: 'les-4', subtopicId: 'sub-3', title: 'Function Components', content: 'Building functional components', duration: '25 min', status: 'active' },
  { id: 'les-5', subtopicId: 'sub-4', title: 'Passing Props', content: 'How to pass and use props', duration: '15 min', status: 'active' },
  { id: 'les-6', subtopicId: 'sub-5', title: 'Counter Example', content: 'Build a counter with useState', duration: '20 min', status: 'active' },
  { id: 'les-7', subtopicId: 'sub-6', title: 'State with Objects', content: 'Managing object state', duration: '25 min', status: 'active' },
  { id: 'les-8', subtopicId: 'sub-7', title: 'Data Fetching', content: 'Fetch data with useEffect', duration: '30 min', status: 'active' },
  { id: 'les-9', subtopicId: 'sub-9', title: 'Reading Files', content: 'Using fs.readFile', duration: '20 min', status: 'active' },
  { id: 'les-10', subtopicId: 'sub-10', title: 'Basic Server', content: 'Create an HTTP server', duration: '25 min', status: 'active' },
  { id: 'les-11', subtopicId: 'sub-11', title: 'GET Handler', content: 'Handle GET requests', duration: '15 min', status: 'active' },
  { id: 'les-12', subtopicId: 'sub-13', title: 'String Methods', content: 'Python string methods', duration: '20 min', status: 'active' },
  { id: 'les-13', subtopicId: 'sub-14', title: 'For Loops', content: 'Python for loops', duration: '15 min', status: 'active' },
  { id: 'les-14', subtopicId: 'sub-15', title: 'CharField', content: 'Using CharField in models', duration: '20 min', status: 'active' },
];

export const initialRoadmaps: Roadmap[] = [
  { id: 'r1', title: 'Frontend Developer', description: 'Become a frontend expert', technologies: 'React, CSS, JS', status: 'active', createdAt: '2024-01-10' },
  { id: 'r2', title: 'Backend Developer', description: 'Master backend development', technologies: 'Node.js, Python', status: 'active', createdAt: '2024-02-15' },
  { id: 'r3', title: 'Full Stack Developer', description: 'End-to-end web development', technologies: 'React, Node.js', status: 'inactive', createdAt: '2024-03-20' },
  { id: 'r4', title: 'Data Science', description: 'Data analysis and ML', technologies: 'Python', status: 'active', createdAt: '2024-04-01' },
];

export const initialSubscriptions: Subscription[] = [
  { id: 's1', userName: 'Alex Johnson', plan: 'Pro', status: 'active', startDate: '2024-01-01', endDate: '2025-01-01', amount: '$29/mo' },
  { id: 's2', userName: 'Sarah Chen', plan: 'Enterprise', status: 'active', startDate: '2024-02-01', endDate: '2025-02-01', amount: '$99/mo' },
  { id: 's3', userName: 'Mike Rivera', plan: 'Basic', status: 'active', startDate: '2024-03-01', endDate: '2025-03-01', amount: '$9/mo' },
  { id: 's4', userName: 'Emily Davis', plan: 'Pro', status: 'inactive', startDate: '2024-04-01', endDate: '2024-10-01', amount: '$29/mo' },
  { id: 's5', userName: 'James Wilson', plan: 'Basic', status: 'active', startDate: '2024-05-01', endDate: '2025-05-01', amount: '$9/mo' },
];

export const initialSEOEntries: SEOEntry[] = [
  { id: 'seo1', page: '/home', title: 'Learnstak - Learn to Code', description: 'Master programming with interactive lessons', keywords: 'coding, learn, programming', status: 'active' },
  { id: 'seo2', page: '/courses', title: 'Courses - Learnstak', description: 'Browse our comprehensive courses', keywords: 'courses, tutorials, lessons', status: 'active' },
  { id: 'seo3', page: '/pricing', title: 'Pricing - Learnstak', description: 'Affordable plans for everyone', keywords: 'pricing, plans, subscription', status: 'active' },
  { id: 'seo4', page: '/about', title: 'About - Learnstak', description: 'Our mission and team', keywords: 'about, team, mission', status: 'inactive' },
];

export const initialRoles: Role[] = [
  { id: 'role1', name: 'Admin', description: 'Full system access', userCount: 2, status: 'active' },
  { id: 'role2', name: 'Content Manager', description: 'Manage content and courses', userCount: 2, status: 'active' },
  { id: 'role3', name: 'Viewer', description: 'Read-only access', userCount: 2, status: 'active' },
];

export const initialPermissions: Permission[] = [
  { id: 'perm1', name: 'users.read', module: 'Users', description: 'View user list', status: 'active' },
  { id: 'perm2', name: 'users.write', module: 'Users', description: 'Create and edit users', status: 'active' },
  { id: 'perm3', name: 'users.delete', module: 'Users', description: 'Delete users', status: 'active' },
  { id: 'perm4', name: 'content.read', module: 'Content', description: 'View content', status: 'active' },
  { id: 'perm5', name: 'content.write', module: 'Content', description: 'Create and edit content', status: 'active' },
  { id: 'perm6', name: 'content.delete', module: 'Content', description: 'Delete content', status: 'active' },
  { id: 'perm7', name: 'settings.manage', module: 'Settings', description: 'Manage system settings', status: 'active' },
];

export const chartData = {
  userGrowth: [
    { month: 'Jan', users: 120 },
    { month: 'Feb', users: 210 },
    { month: 'Mar', users: 340 },
    { month: 'Apr', users: 480 },
    { month: 'May', users: 590 },
    { month: 'Jun', users: 720 },
  ],
  lessonsPerTech: [
    { name: 'React', count: 8 },
    { name: 'Node.js', count: 3 },
    { name: 'Python', count: 3 },
  ],
};
