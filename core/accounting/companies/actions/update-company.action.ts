import { api } from '@/core/api/api';
import { UpdateCompanyDto } from '@ascencio/shared/schemas/accounting';
import { Company } from '@ascencio/shared/interfaces';

export const updateCompanyAction = async (
  id: string,
  input: UpdateCompanyDto,
): Promise<Company> => {
  const { data } = await api.patch<Company>(`/companies/${id}`, input);
  return data;
};
