import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";
import AppError from "../utils/appError.js";

/**
 *  @desc    Get all categories or get categories by type.
 *  @route   GET /api/category
 */
const getCategories = asyncHandler(async (req, res, next) => {
  const { type } = req.query;
  const organizationId = req.user?.organization;
  // console.log("CurrentUser: ", userId, "- getCategories ctrler");
  console.log("TransactionType: ", type, "- getCategories ctrler");

  //? Check if user is authenticated.
  if (!organizationId) {
    throw new AppError("Unauthorized user", 401);
  }

  //? Create query with or without 'type' parameter.
  // const query = type ? { userId, type } : { userId };
  const query = { type, organization: organizationId };

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
  const organizationId = req.user?.organization;
  if (!organizationId) {
    throw new AppError("Unauthorized user", 401);
  }
  const categoryEntry = req.body.formData;
  //? If request data is an Array
  if (Array.isArray(categoryEntry)) {
    const createdCategories = await Category.insertMany(
      categoryEntry.map((category) => ({
        ...category,
        organization: organizationId,
      }))
    );
    res.status(201).json(createdCategories);
    return;
  }

  const { name, icon } = req.body.formData;
  const { type } = req.query;


  // Check if a category with the same userId and type already exists
  const existingCategory = await Category.findOne({
    name,
    type,
    organization: organizationId,
  });

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
    name,
    icon,
    type,
    organization: organizationId,
  });
  res.status(201).json(createdCategory);
});


/**
 *  @desc    Delete a category.
 *  @route   DELETE /api/category/:id
 */
const deleteCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  const organizationId = req.user?.organization;
  if (!organizationId) {
    throw new AppError("Unauthorized user", 401);
  }

  // Find and delete the category by ID and ensure it belongs to the authenticated user
  const category = await Category.findOneAndDelete({
    _id: categoryId,
    organization: organizationId,
  });

  if (!category) {
    throw new AppError("Category not found.", 404);
  }

  res.status(200).json({ message: "Category deleted successfully." });
});

export { getCategories, createCategory, deleteCategory };
