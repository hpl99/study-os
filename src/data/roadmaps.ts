import { Roadmap } from "@/types/roadmap";

// Ensure modularity: you can add more roadmaps here manually later.
export const roadmaps: Roadmap[] = [
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    description: "Master problem solving and algorithms for interviews.",
    category: "Software Engineering",
    difficulty: "Intermediate",
    estimatedHours: 120,
    icon: "Terminal",
    topics: []
  },
  {
    id: "java-backend",
    title: "Java Backend",
    description: "Learn Spring Boot, Hibernate, and enterprise Java patterns.",
    category: "Backend",
    difficulty: "Advanced",
    estimatedHours: 150,
    icon: "Server",
    topics: []
  },
  {
    id: "system-design",
    title: "System Design",
    description: "Learn to design scalable, highly available systems.",
    category: "Architecture",
    difficulty: "Expert",
    estimatedHours: 80,
    icon: "Globe",
    topics: []
  },
  {
    id: "devops",
    title: "DevOps",
    description: "Master CI/CD, Docker, Kubernetes, and Cloud.",
    category: "DevOps",
    difficulty: "Advanced",
    estimatedHours: 100,
    icon: "Server",
    topics: []
  },
  {
    id: "databases",
    title: "Databases",
    description: "Deep dive into SQL, NoSQL, indexing, and replication.",
    category: "Data",
    difficulty: "Intermediate",
    estimatedHours: 60,
    icon: "Database",
    topics: []
  },
  {
    id: "machine-learning",
    title: "Machine Learning Basics",
    description: "Fundamentals of ML algorithms, math, and model training.",
    category: "AI",
    difficulty: "Advanced",
    estimatedHours: 120,
    icon: "BookOpen",
    topics: []
  }
];

export function getRoadmapById(id: string): Roadmap | undefined {
  return roadmaps.find(r => r.id === id);
}

export function getAllRoadmaps(): Roadmap[] {
  return roadmaps;
}
