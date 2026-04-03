const tags = [
  {
    id: 1,
    name: "Frontend",
  },
  {
    id: 2,
    name: "Backend",
  },
  {
    id: 3,
    name: "Full-Stack",
  },
];

const blogs = [
  {
    id: 1,
    title: "Best Practices for Asynchronous JavaScript",
    content:
      "Asynchronous programming is essential in modern web development. From callbacks to Promises and async/await, JavaScript offers several ways to handle async work. This article compares the strengths and tradeoffs of each approach and shares practical patterns for writing cleaner, more maintainable code. Through real examples, you will learn how to avoid common pitfalls and improve both code quality and developer productivity.",
    image: "/images/a1.avif",
    author: "Liam Carter",
    tag_id: 3,
    created_at: "2025-10-01",
  },
  {
    id: 2,
    title: "The Complete Guide to CSS Grid",
    content:
      "CSS Grid is a powerful tool for modern page layouts, making complex two-dimensional designs straightforward. Compared with float-based layouts and Flexbox, Grid gives you more precise control. This guide starts with the basics and shows how to build responsive layouts with practical examples, including grid lines, named areas, and other advanced techniques. Whether you are new to layout or already experienced, you will gain useful knowledge and skills quickly.",
    image: "/images/a2.avif",
    author: "Emma Brooks",
    tag_id: 2,
    created_at: "2025-10-02",
  },
  {
    id: 3,
    title: "React Hooks Tips and Common Pitfalls",
    content:
      "React Hooks changed the way we write components by bringing state management into function components. But they also introduce easy mistakes, such as incorrect dependency arrays or infinite useEffect loops. This article summarizes common Hook scenarios, analyzes typical mistakes, and provides practical solutions. We will look closely at useState, useEffect, and useCallback so you can build more efficient and stable React applications.",
    image: "/images/a3.avif",
    author: "Noah Foster",
    tag_id: 1,
    created_at: "2025-10-03",
  },
  {
    id: 4,
    title: "Database Index Optimization Strategies",
    content:
      "In database performance tuning, index design is a key factor. Well-chosen indexes can dramatically improve query speed, but too many indexes can slow down writes. This article explains different index types, discusses the principles behind composite indexes, and uses real SQL execution plans to show the impact of optimization. From theory to practice, you will learn how to design indexes that support high-performance database systems.",
    image: "/images/a4.avif",
    author: "Ava Mitchell",
    tag_id: 3,
    created_at: "2025-10-04",
  },
  {
    id: 5,
    title: "Microservices Architecture Design Principles",
    content:
      "Microservices bring flexibility and scalability, but they also increase system complexity. Defining service boundaries, handling service-to-service communication, and maintaining data consistency are all important challenges. Based on practical project experience, this article covers core microservices principles, including service decomposition, API gateway design, monitoring, and alerts. The goal is to help you build reliable and efficient distributed systems.",
    image: "/images/a5.avif",
    author: "Sophia Reed",
    tag_id: 1,
    created_at: "2025-10-05",
  },
  {
    id: 6,
    title: "Practical Frontend Performance Optimization",
    content:
      "Page load speed directly affects user experience and conversion rates. Frontend performance optimization spans many areas, from asset compression and caching strategies to code splitting and lazy loading. This article uses Chrome DevTools to identify common bottlenecks and provides practical solutions, including image optimization, CSS and JavaScript minification, and CDN setup. With real examples, you will see how to cut load times dramatically and improve key product metrics.",
    image: "/images/a6.avif",
    author: "Ethan Morgan",
    tag_id: 2,
    created_at: "2025-10-06",
  },
];

export { tags, blogs };
