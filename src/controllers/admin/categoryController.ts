import { Request, Response } from "express";
import Category from "../../database/models/Category";

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
        where: { categorySlug },
      });
      if (existingCategory) {
        res.status(409).json({
          message: "Category with this slug already exists.",
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
}

export default new CategoryController();
