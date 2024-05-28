import express from "express";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../controllers/category.js";
import { validateToken } from "../middlewares/validateToken.js";

const router = express.Router();

router
  .route("/")
  .get(validateToken, getCategories) // GET all categories
  .post(validateToken, createCategory); // CREATE a new category

router.route("/:categoryId").delete(deleteCategory); // DELETE a category
export default router;
