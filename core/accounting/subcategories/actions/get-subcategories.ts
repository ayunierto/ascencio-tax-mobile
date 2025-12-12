import { api } from '@/core/api/api';
import { Subcategory } from '../interfaces';

export const getSubcategories = async (): Promise<Subcategory[]> => {
  const { data } = await api.get<Subcategory[]>('/subcategories');
  return data;
};
