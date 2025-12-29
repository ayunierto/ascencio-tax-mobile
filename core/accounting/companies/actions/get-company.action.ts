import { api } from '@/core/api/api';
import { Company } from '@ascencio/shared/interfaces';

export const getCompanyAction = async (id: string): Promise<Company> => {
  if (id === 'new') {
    return {
      id: 'new',
      logoUrl: '',
      name: '',
      legalName: '',
      businessNumber: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      province: '',
      postalCode: '',
      payrollAccountNumber: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: undefined,
      users: [],
    } as Company;
  }
  const { data } = await api.get<Company>(`/companies/${id}`);
  return data;
};
