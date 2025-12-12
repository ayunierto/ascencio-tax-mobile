import { Service } from './service.interface';

export type CreateServiceResponse = Service;
export type ServiceResponse = Service;
export type ServicesResponse = {
  count: number;
  pages: number;
  services: Service[];
};
export type UpdateServiceResponse = Service;
export type DeleteServiceResponse = Service;
