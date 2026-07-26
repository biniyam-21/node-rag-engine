import fs from "fs";
import path from "path";
import { notificationService } from "./notification.service";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  views: number;
  likes: number;
  pinned: boolean;
  coverImage?: string;
  author?: string;
}

const INITIAL_BLOGS: BlogPost[] = [
  {
    id: "1",
    title: "Building Scalable APIs with FastAPI and Redis",
    excerpt:
      "A deep dive into building high-performance Python APIs with automatic caching, rate limiting, and async I/O — lessons from scaling to 5M daily requests.",
    content: `## Building Scalable APIs with FastAPI and Redis

Scaling modern backend architectures requires intelligent caching strategies, efficient async I/O operations, and reliable database indexing.

### Key Architectural Pillars

1. **Asynchronous Non-Blocking I/O**: Leveraging ASGI and Python's \`asyncio\` event loop to handle concurrent client requests efficiently.
2. **Multi-Tier Caching with Redis**: Storing hot keys and pre-calculated JSON payloads with low TTL in Redis memory before touching main persistence storage.
3. **Connection Pooling**: Managing database pool sizes to avoid TCP handshake bottlenecks during traffic surges.

\`\`\`python
from fastapi import FastAPI
import aioredis

app = FastAPI()

@app.on_event("startup")
async def startup():
    app.state.redis = await aioredis.from_url("redis://localhost")
\`\`\`

### Lessons from 5M Daily Requests

- Always set explicit memory eviction policies (\`volatile-lru\`) on Redis.
- Use compression (zstd/gzip) for stored JSON objects over 10KB.
- Monitor response latency at the 99th percentile (p99) rather than averages.`,
    date: "Jun 10, 2026",
    readTime: "8 min",
    tags: ["Backend", "Python", "Performance"],
    views: 2341,
    likes: 42,
    pinned: true,
    author: "Biniyam Tesfu",
  },
  {
    id: "2",
    title: "From 0 to 1M Requests: Real Scaling Lessons",
    excerpt:
      "What I actually learned when a side project unexpectedly went viral — the decisions, the mistakes, and the architecture changes that saved it.",
    content: `## From 0 to 1M Requests: Real Scaling Lessons

When a side project goes viral overnight, infrastructure bottlenecks show up immediately. Here is what broke and how we fixed it under pressure.

### What Broke First

- **Database Connection Exhaustion**: Un-pooled connections overwhelmed PostgreSQL when traffic hit 2,500 active concurrent connections.
- **Static Asset Delivery**: Serving local assets from the application process consumed CPU cycles that belonged to business logic.

### Quick Wins & Permanent Fixes

1. **CDN Offloading**: Moved all static assets and heavy images to Cloudflare Edge CDN.
2. **PgBouncer Connection Pooling**: Reduced database CPU load by 70%.
3. **Read Replicas**: Routed heavy read-only analytical queries to read-replicas.`,
    date: "May 28, 2026",
    readTime: "12 min",
    tags: ["Scaling", "Architecture", "Backend"],
    views: 4892,
    likes: 89,
    pinned: true,
    author: "Biniyam Tesfu",
  },
  {
    id: "3",
    title: "Why I Love Framer Motion for Micro-Interactions",
    excerpt:
      "A practical guide to adding meaningful motion to your React app without hurting performance or accessibility. Real examples, real patterns.",
    content: `## Why I Love Framer Motion for Micro-Interactions

Micro-interactions transform a static user interface into an engaging, responsive product experience.

### Motion Design Principles

- Keep animation durations between 180ms and 350ms.
- Use spring physics for physical feedback (\`stiffness: 400, damping: 28\`).
- Honor \`prefers-reduced-motion\` for accessibility.`,
    date: "May 14, 2026",
    readTime: "6 min",
    tags: ["React", "Animation", "Frontend"],
    views: 1823,
    likes: 31,
    pinned: false,
    author: "Biniyam Tesfu",
  },
];

export class BlogService {
  private blogs: Map<string, BlogPost> = new Map();
  private filePath = path.join(__dirname, "../../data/blogs.json");

  constructor() {
    this.loadFromFile();
  }

  private loadFromFile(): void {
    try {
      if (fs.existsSync(this.filePath)) {
        const fileData = fs.readFileSync(this.filePath, "utf-8");
        const parsedData: BlogPost[] = JSON.parse(fileData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          parsedData.forEach((b) => this.blogs.set(String(b.id), b));
          return;
        }
      }
    } catch (err) {
      console.warn("Could not load blogs from file, fallback to initial defaults:", err);
    }

    // Initialize with default blogs & write to file
    INITIAL_BLOGS.forEach((b) => this.blogs.set(b.id, { ...b }));
    this.saveToFile();
  }

  private saveToFile(): void {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const arrayData = Array.from(this.blogs.values());
      fs.writeFileSync(this.filePath, JSON.stringify(arrayData, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to persist blog data to disk:", err);
    }
  }

  public getAllBlogs(): BlogPost[] {
    return Array.from(this.blogs.values()).sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  public getBlogById(id: string): BlogPost | null {
    const blog = this.blogs.get(String(id));
    if (blog) {
      blog.views += 1;
      this.saveToFile();
    }
    return blog || null;
  }

  public createBlog(data: Partial<BlogPost>): BlogPost {
    const id = String(Date.now());
    const date = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const newBlog: BlogPost = {
      id,
      title: data.title || "Untitled Article",
      excerpt: data.excerpt || (data.content ? data.content.slice(0, 140) + "..." : ""),
      content: data.content || "",
      date,
      readTime: data.readTime || `${Math.max(1, Math.ceil((data.content?.length || 0) / 500))} min`,
      tags: Array.isArray(data.tags) && data.tags.length > 0 ? data.tags : ["Engineering"],
      views: 1,
      likes: 0,
      pinned: !!data.pinned,
      coverImage: data.coverImage || undefined,
      author: data.author || "Biniyam Tesfu",
    };

    this.blogs.set(id, newBlog);
    this.saveToFile();
    return newBlog;
  }

  public updateBlog(id: string, data: Partial<BlogPost>): BlogPost | null {
    const existing = this.blogs.get(String(id));
    if (!existing) return null;

    const updated: BlogPost = {
      ...existing,
      title: data.title !== undefined ? data.title : existing.title,
      excerpt: data.excerpt !== undefined ? data.excerpt : existing.excerpt,
      content: data.content !== undefined ? data.content : existing.content,
      tags: Array.isArray(data.tags) && data.tags.length > 0 ? data.tags : existing.tags,
      readTime: data.readTime || existing.readTime,
      coverImage: data.coverImage !== undefined ? data.coverImage : existing.coverImage,
      pinned: data.pinned !== undefined ? !!data.pinned : existing.pinned,
    };

    this.blogs.set(String(id), updated);
    this.saveToFile();
    return updated;
  }

  public deleteBlog(id: string): boolean {
    const existed = this.blogs.delete(String(id));
    if (existed) {
      this.saveToFile();
    }
    return existed;
  }

  public async likeBlog(id: string): Promise<{ success: boolean; likes: number; blogTitle?: string }> {
    const blog = this.blogs.get(String(id));
    if (!blog) {
      return { success: false, likes: 0 };
    }

    blog.likes += 1;
    this.saveToFile();

    // Send Telegram alert
    await notificationService.sendBlogLikeNotification(blog.title, blog.likes);

    return {
      success: true,
      likes: blog.likes,
      blogTitle: blog.title,
    };
  }
}

export const blogService = new BlogService();
