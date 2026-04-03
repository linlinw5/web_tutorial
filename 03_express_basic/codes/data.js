export const blogs = [
  {
    id: 1,
    title: "Practical Async Patterns in JavaScript",
    content:
      "Asynchronous code is everywhere in web apps, from API calls to file operations. This article compares callbacks, Promises, and async/await with clear examples and tradeoffs. You will learn how to structure async flows, handle errors consistently, and avoid race conditions. We also cover simple conventions that make large codebases easier to read and maintain over time.",
    image: "/images/a1.avif",
    author: "Mason Lee",
    tag_id: 3,
    created_at: "2025-10-01",
  },
  {
    id: 2,
    title: "A Friendly Guide to CSS Grid",
    content:
      "CSS Grid gives you powerful two-dimensional layout control without hacks. In this guide, we build responsive page sections step by step, using tracks, gaps, named areas, and auto-placement. You will see when Grid is better than Flexbox and how to combine both effectively. By the end, you can design clean layouts that adapt smoothly across devices.",
    image: "/images/a2.avif",
    author: "Hannah Carter",
    tag_id: 2,
    created_at: "2025-10-02",
  },
  {
    id: 3,
    title: "React Hooks: Useful Patterns and Common Pitfalls",
    content:
      "Hooks simplify stateful logic, but small mistakes can cause confusing bugs. This post focuses on practical usage of useState, useEffect, useMemo, and useCallback in real projects. We highlight dependency array issues, stale closures, and rerender performance problems, then show safe patterns to fix them. The goal is to help you build predictable, maintainable React components.",
    image: "/images/a3.avif",
    author: "Noah Rivera",
    tag_id: 1,
    created_at: "2025-10-03",
  },
  {
    id: 4,
    title: "Database Indexing Strategies That Actually Work",
    content:
      "Good indexes can turn slow queries into fast ones, but over-indexing hurts writes and storage. This article explains B-tree basics, composite index ordering, and how query patterns affect index choices. We read execution plans to confirm improvements instead of guessing. You will leave with a checklist for designing indexes that balance read speed and operational cost.",
    image: "/images/a4.avif",
    author: "Olivia Bennett",
    tag_id: 3,
    created_at: "2025-10-04",
  },
  {
    id: 5,
    title: "Microservices Design Principles for Real Teams",
    content:
      "Microservices offer flexibility, but they also introduce coordination and reliability challenges. In this piece, we discuss service boundaries, API contracts, failure isolation, and observability fundamentals. We also compare synchronous and asynchronous communication styles with practical pros and cons. The focus is on building systems that can evolve safely under real production pressure.",
    image: "/images/a5.avif",
    author: "Ethan Brooks",
    tag_id: 1,
    created_at: "2025-10-05",
  },
  {
    id: 6,
    title: "Hands-On Frontend Performance Optimization",
    content:
      "Page speed has a direct impact on user satisfaction and business results. This tutorial covers practical wins such as image optimization, caching strategy, code splitting, and lazy loading. We use browser tools to identify bottlenecks and measure improvements after each change. With a performance-first workflow, you can steadily reduce load time and improve interaction responsiveness.",
    image: "/images/a6.avif",
    author: "Grace Turner",
    tag_id: 2,
    created_at: "2025-10-06",
  },
];
