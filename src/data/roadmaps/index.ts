import { Roadmap } from "@/types/roadmap";
import { dsaRoadmap } from "./dsa";

export const roadmaps: Record<string, Roadmap> = {
  dsa: dsaRoadmap,
  cp: {
    id: "cp",
    title: "Competitive Programming",
    description: "Advanced algorithms, mathematics, and data structures for competitive programming platforms like Codeforces and AtCoder.",
    difficulty: "Advanced",
    estimatedHours: 200,
    icon: "Trophy",
    topics: []
  },
  "java-backend": {
    id: "java-backend",
    title: "Java Backend Developer",
    description: "Learn Java, Spring Boot, microservices, databases, and enterprise architecture.",
    difficulty: "Intermediate",
    estimatedHours: 150,
    icon: "Server",
    topics: []
  },
  "web-dev": {
    id: "web-dev",
    title: "Web Development",
    description: "Full-stack web development roadmap covering HTML, CSS, JavaScript, React, Node.js, and databases.",
    difficulty: "Beginner",
    estimatedHours: 180,
    icon: "Globe",
    topics: []
  },
  "system-design": {
    id: "system-design",
    title: "System Design",
    description: "Learn how to design highly scalable, available, and resilient distributed systems.",
    difficulty: "Advanced",
    estimatedHours: 80,
    icon: "Database",
    topics: []
  }
};

export function getRoadmap(id: string): Roadmap | undefined {
  return roadmaps[id];
}

export function getAllRoadmaps(): Roadmap[] {
  return Object.values(roadmaps);
}
