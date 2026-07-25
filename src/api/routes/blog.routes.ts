import { Router } from "express";
import { blogController } from "../controllers/blog.controller";

const router = Router();

router.get("/blogs", blogController.getBlogs);
router.get("/blogs/:id", blogController.getBlogById);
router.post("/blogs", blogController.createBlog);
router.post("/blogs/:id/like", blogController.likeBlog);

export default router;
