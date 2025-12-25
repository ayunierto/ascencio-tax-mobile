import { api } from '@/core/api/api';
import { Company } from '@ascencio/shared/interfaces';

export const getCompaniesAction = async (): Promise<Company[]> => {
  const { data } = await api.get<Company[]>('/companies');
  return data;
};
