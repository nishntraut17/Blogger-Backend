import { Router } from "express";
import { createBlog, getBlogs, getBlog } from "../controllers/blog";
import auth from "../middleware/auth";
import multer from 'multer';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single('image'), createBlog);
router.get("/", getBlogs);
router.get("/:id", getBlog);

export default router;