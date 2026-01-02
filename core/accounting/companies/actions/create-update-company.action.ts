import { api } from '@/core/api/api';
import { CreateCompanyRequest, Company } from '@ascencio/shared';

export const createUpdateCompany = async (
  company: CreateCompanyRequest,
): Promise<Company> => {
  const { id, ...rest } = company;

  console.warn(id, rest);

  const { data } = await api<Company>({
    method: id === 'new' ? 'POST' : 'PATCH',
    url: id === 'new' ? '/companies' : `/companies/${id}`,
    data: rest,
  });

  return data;
};
