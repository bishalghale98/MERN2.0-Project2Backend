import { Request, Response } from "express";
import Category from "../../database/models/Category";
import { where } from "sequelize";

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // remove non-alphanumeric characters except space
    .replace(/\s+/g, "-") // replace space(s) with hyphen
    .trim();
};

class CategoryController {
  categoryData = [
    {
      categoryName: "Electronics",
    },
    {
      categoryName: "Groceries",
    },
    {
      categoryName: "Food/Beverages",
    },
    {
      categoryName: "Mens Shirts",
    },
  ];

  async seedCategory(): Promise<void> {
    const existingCategories = await Category.findAll();

    if (existingCategories.length === 0) {
      const formattedData = this.categoryData.map((item) => ({
        ...item,
        categorySlug: generateSlug(item.categoryName),
      }));

      await Category.bulkCreate(formattedData);
      console.log("Category seeded successfully");
    } else {
      console.log("category already seeded");
    }
  }

  // addCategory
  async addCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryName, categorySlug } = req.body;

      if (!categoryName || !categorySlug) {
        res.status(400).json({
          message: "Please provide both category name and slug.",
        });
        return;
      }

      const existingCategory = await Category.findOne({
        where: { categoryName },
      });
      if (existingCategory) {
        res.status(409).json({
          message: "Category with this name already exists.",
        });
        return;
      }

      const newCategory = await Category.create({
        categoryName,
        categorySlug,
      });

      res.status(201).json({
        message: "Category created successfully",
        data: newCategory,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  async getAllCategory(req: Request, res: Response): Promise<void> {
    try {
      const categories = await Category.findAll();

      if (!categories || categories.length == 0) {
        res.status(404).json({
          success: false,
          message: "No category has found",
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: "Category Fetch successfully",
        data: categories,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const data = await Category.findAll({
        where: { id },
      });
      if (!data || data.length == 0) {
        res.status(404).json({
          success: false,
          message: "No category with that id",
        });
        return;
      }

      await Category.destroy({ where: { id } });
      res.status(200).json({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { categoryName, categorySlug } = req.body;

      if (!id || !categoryName || !categorySlug) {
        res.status(400).json({ message: "Missing required fields." });
        return;
      }

      const [updatedRowsCount] = await Category.update(
        { categoryName, categorySlug },
        { where: { id } }
      );

      if (updatedRowsCount === 0) {
        res
          .status(404)
          .json({ message: "Category not found or no changes made." });
        return;
      }

      res.status(200).json({ message: "Category updated successfully." });
    } catch (error) {
      console.error("Update category error:", error);
      res.status(500).json({
        message: "Internal server error.",
        error: error instanceof Error ? error.message : error,
      });
    }
  }
}

export default new CategoryController();
