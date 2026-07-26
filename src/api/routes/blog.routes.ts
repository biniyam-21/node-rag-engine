import { Router } from "express";
import { blogController } from "../controllers/blog.controller";

const router = Router();

router.get("/blogs", blogController.getBlogs);
router.get("/blogs/:id", blogController.getBlogById);
router.post("/blogs", blogController.createBlog);
router.put("/blogs/:id", blogController.updateBlog);
router.delete("/blogs/:id", blogController.deleteBlog);
router.post("/blogs/:id/like", blogController.likeBlog);

export default router;
