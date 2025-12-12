import { User } from "@/core/auth/interfaces";
import { Category } from "../../categories/interfaces/category.interface";
import { Subcategory } from "../../subcategories/interfaces";

export interface ExpenseResponse {
  id: string;
  merchant: string;
  date: string;
  total: number;
  tax: number;
  imageUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  subcategory?: Subcategory;
  user?: User;
}
