import { api } from '@/core/api/api';
import { CreateCompanyDto } from '@ascencio/shared/schemas/accounting';
import { Company } from '@ascencio/shared/interfaces';

export const createCompanyAction = async (
  input: CreateCompanyDto,
): Promise<Company> => {
  const { data } = await api.post<Company>('/companies', input);
  return data;
};
