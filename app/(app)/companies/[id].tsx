import { Redirect, useLocalSearchParams } from 'expo-router';
import { CompanyForm } from '@/core/accounting/companies/components';
import { useCompany } from '@/core/accounting/companies/hooks';

const UpdateCompanyScreen = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data: company, isPending: isLoadingCompany } = useCompany(id || '');

  if (!company || isLoadingCompany) {
    return <Redirect href="/(app)/companies" />;
  }

  return <CompanyForm company={company} />;
};

export default UpdateCompanyScreen;
