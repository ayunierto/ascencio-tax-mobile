import { api } from '@/core/api/api';
import { CreateCompanyRequest } from '@ascencio/shared/schemas';
import { Company } from '@ascencio/shared/interfaces';

export const createCompanyAction = async (
  input: CreateCompanyRequest,
): Promise<Company> => {
  const { data } = await api.post<Company>('/companies', input);
  console.warn({ data });
  return data;
};
