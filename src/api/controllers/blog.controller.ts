import { Request, Response, NextFunction } from "express";
import { blogService } from "../../services/blog.service";

export class BlogController {
  public async getBlogs(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const blogs = blogService.getAllBlogs();
      res.status(200).json({
        success: true,
        data: blogs,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getBlogById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const blog = blogService.getBlogById(String(id));

      if (!blog) {
        res.status(404).json({
          success: false,
          message: "Blog post not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: blog,
      });
    } catch (error) {
      next(error);
    }
  }

  public async createBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, content, excerpt, tags, readTime, coverImage, pinned } = req.body;

      if (!title || !content) {
        res.status(400).json({
          success: false,
          message: "Title and content are required.",
        });
        return;
      }

      const newBlog = blogService.createBlog({
        title,
        content,
        excerpt,
        tags: Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : [],
        readTime,
        coverImage,
        pinned: Boolean(pinned),
      });

      res.status(201).json({
        success: true,
        message: "Blog post created successfully!",
        data: newBlog,
      });
    } catch (error) {
      next(error);
    }
  }

  public async likeBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await blogService.likeBlog(String(id));

      if (!result.success) {
        res.status(404).json({
          success: false,
          message: "Blog post not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Blog post liked!",
        likes: result.likes,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const blogController = new BlogController();
