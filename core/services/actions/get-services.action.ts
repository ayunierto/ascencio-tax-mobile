import { api } from '@/core/api/api';
import { ServicesResponse } from '../interfaces';

interface Options {
  limit?: number | string;
  offset?: number | string;
}

export const getServicesAction = async (
  options: Options
): Promise<ServicesResponse> => {
  const { limit, offset } = options;
  const { data } = await api.get<ServicesResponse>('/services', {
    params: {
      limit,
      offset,
    },
  });

  return data;
};
