import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";

/**
 *  @desc    Get all categories or get categories by type.
 *  @route   GET /api/category
 */
const getCategories = asyncHandler(async (req, res, next) => {
  // const { _id: userId } = req.user;
  const { type } = req.query;
  // console.log("CurrentUser: ", userId, "- getCategories ctrler");
  console.log("TransactionType: ", type, "- getCategories ctrler");

  //? Check if user is authenticated.
  if (!req.user) {
    const error = new Error("Unauthorized user");
    error.statusCode = 401;
    throw error;
  }

  //? Create query with or without 'type' parameter.
  // const query = type ? { userId, type } : { userId };
  const query = { type };

  //? Find categories in order by name, based on query.
  const categories = await Category.find(query).sort({ name: "asc" });

  //? If categories are found, send them.
  if (categories) {
    res.status(200).json(categories);
  } else {
    throw new Error("No Categories Found");
  }
});

/**
 *  @desc    Create a new category..
 *  @route   POST /api/category?type=revenue
 */
const createCategory = asyncHandler(async (req, res, next) => {
  // const { _id: userId } = req.user;
  const categoryEntry = req.body.formData;
  //? If request data is an Array
  if (Array.isArray(categoryEntry)) {
    const createdCategories = await Category.insertMany(
      categoryEntry.map(category => category)
    )
    res.status(201).json(createdCategories);
    return;
  }

  const { name, icon } = req.body.formData;
  const { type } = req.query;


  // Check if a category with the same userId and type already exists
  const existingCategory = await Category.findOne({ name, type });

  if (existingCategory) {
    return res.status(400).json({
      error: "This category already exists.",
    });
  }

  console.log("Overall Category Request : ");
  // console.log({ userId, name, icon, type });
  console.log({ name, icon, type });
  console.log(req.body);

  const createdCategory = await Category.create({
    // userId,
    name,
    icon,
    type,
  });
  res.status(201).json(createdCategory);
});


/**
 *  @desc    Delete a category.
 *  @route   DELETE /api/category/:id
 */
const deleteCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  // const { _id: userId } = req.user;

  // Find and delete the category by ID and ensure it belongs to the authenticated user
  const category = await Category.findOneAndDelete({ _id: categoryId });

  if (!category) {
    return res.status(404).json({ error: "Category not found." });
  }

  res.status(200).json({ message: "Category deleted successfully." });
});

export { getCategories, createCategory, deleteCategory };
