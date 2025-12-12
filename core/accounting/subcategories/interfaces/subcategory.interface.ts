import { Category } from '../../categories/interfaces/category.interface';

export interface Subcategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
}
