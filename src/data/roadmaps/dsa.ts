import { Roadmap } from "@/types/roadmap";

export const dsaRoadmap: Roadmap = {
  id: "dsa",
  title: "Data Structures & Algorithms",
  description: "Master the core fundamentals of DSA for competitive programming and tech interviews. From basic arrays to advanced graph algorithms.",
  difficulty: "Intermediate",
  estimatedHours: 120,
  icon: "Terminal",
  topics: [
    {
      id: "arrays",
      title: "Arrays",
      description: "Learn how arrays store data contiguously in memory and solve problems using two pointers and sliding window techniques.",
      order: 1,
      prerequisites: [],
      resources: [
        {
          id: "res-arr-1",
          type: "video",
          title: "Arrays - Data Structures & Algorithms",
          url: "https://www.youtube.com/watch?v=RBSGKlAvoiM",
          author: "NeetCode",
          duration: "15 mins"
        },
        {
          id: "res-arr-2",
          type: "article",
          title: "Introduction to Arrays",
          url: "https://www.geeksforgeeks.org/introduction-to-arrays/",
          author: "GeeksforGeeks",
          duration: "10 mins"
        }
      ],
      problems: [
        {
          id: "prob-arr-1",
          title: "Two Sum",
          url: "https://leetcode.com/problems/two-sum/",
          platform: "LeetCode",
          difficulty: "Easy"
        },
        {
          id: "prob-arr-2",
          title: "Best Time to Buy and Sell Stock",
          url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
          platform: "LeetCode",
          difficulty: "Easy"
        },
        {
          id: "prob-arr-3",
          title: "3Sum",
          url: "https://leetcode.com/problems/3sum/",
          platform: "LeetCode",
          difficulty: "Medium"
        }
      ]
    },
    {
      id: "strings",
      title: "Strings",
      description: "Understand string manipulation, common string algorithms, and pattern matching.",
      order: 2,
      prerequisites: ["arrays"],
      resources: [
        {
          id: "res-str-1",
          type: "video",
          title: "String manipulation techniques",
          url: "https://www.youtube.com/watch?v=WqilE1knt_w",
          author: "NeetCode",
          duration: "20 mins"
        }
      ],
      problems: [
        {
          id: "prob-str-1",
          title: "Valid Palindrome",
          url: "https://leetcode.com/problems/valid-palindrome/",
          platform: "LeetCode",
          difficulty: "Easy"
        },
        {
          id: "prob-str-2",
          title: "Longest Substring Without Repeating Characters",
          url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
          platform: "LeetCode",
          difficulty: "Medium"
        }
      ]
    },
    {
      id: "recursion",
      title: "Recursion",
      description: "Learn the foundation of solving problems by breaking them down into smaller instances of the same problem.",
      order: 3,
      prerequisites: [],
      resources: [
        {
          id: "res-rec-1",
          type: "video",
          title: "Recursion for Beginners",
          url: "https://www.youtube.com/watch?v=ngCos392W4w",
          author: "FreeCodeCamp",
          duration: "1 hour"
        }
      ],
      problems: [
        {
          id: "prob-rec-1",
          title: "Fibonacci Number",
          url: "https://leetcode.com/problems/fibonacci-number/",
          platform: "LeetCode",
          difficulty: "Easy"
        }
      ]
    },
    {
      id: "binary-search",
      title: "Binary Search",
      description: "Master logarithmic time search algorithms and find the answer on monotonic functions.",
      order: 4,
      prerequisites: ["arrays"],
      resources: [],
      problems: [
        {
          id: "prob-bs-1",
          title: "Binary Search",
          url: "https://leetcode.com/problems/binary-search/",
          platform: "LeetCode",
          difficulty: "Easy"
        }
      ]
    },
    {
      id: "linked-lists",
      title: "Linked Lists",
      description: "Master dynamic data structures where elements point to the next node.",
      order: 5,
      prerequisites: [],
      resources: [],
      problems: []
    },
    {
      id: "trees",
      title: "Trees",
      description: "Learn about hierarchical data structures, binary trees, and tree traversals (DFS/BFS).",
      order: 6,
      prerequisites: ["recursion"],
      resources: [],
      problems: []
    },
    {
      id: "bst",
      title: "Binary Search Trees",
      description: "Trees that maintain a specific ordering property to allow fast search.",
      order: 7,
      prerequisites: ["trees"],
      resources: [],
      problems: []
    },
    {
      id: "heaps",
      title: "Heaps / Priority Queues",
      description: "Learn about Complete Binary Trees used to quickly find the min or max element.",
      order: 8,
      prerequisites: ["trees"],
      resources: [],
      problems: []
    },
    {
      id: "graphs",
      title: "Graphs",
      description: "Study nodes and edges, adjacency lists, and graph traversal algorithms (Dijkstra, BFS, DFS).",
      order: 9,
      prerequisites: ["trees", "arrays"],
      resources: [],
      problems: []
    },
    {
      id: "dynamic-programming",
      title: "Dynamic Programming",
      description: "Solve complex problems by breaking them down into simpler subproblems and caching results.",
      order: 10,
      prerequisites: ["recursion"],
      resources: [],
      problems: []
    },
    {
      id: "greedy",
      title: "Greedy Algorithms",
      description: "Algorithms that make the locally optimal choice at each stage.",
      order: 11,
      prerequisites: ["arrays", "heaps"],
      resources: [],
      problems: []
    },
    {
      id: "tries",
      title: "Tries",
      description: "A specialized tree used for searching strings and prefix matching.",
      order: 12,
      prerequisites: ["trees", "strings"],
      resources: [],
      problems: []
    },
    {
      id: "segment-trees",
      title: "Segment Trees",
      description: "Advanced data structure for fast range queries and point updates.",
      order: 13,
      prerequisites: ["trees", "arrays"],
      resources: [],
      problems: []
    },
    {
      id: "bit-manipulation",
      title: "Bit Manipulation",
      description: "Operating on numbers at the binary level for extreme performance optimization.",
      order: 14,
      prerequisites: [],
      resources: [],
      problems: []
    }
  ]
};
