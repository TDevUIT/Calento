import { api, getErrorMessage } from '../config/axios';
import { HealthStatus, HealthOkResponse } from '../interface/health.interface';
import { API_ROUTES } from '../constants/routes';

export type { HealthStatus, HealthOkResponse } from '../interface/health.interface';

export const getHealthStatus = async (): Promise<HealthStatus> => {
  try {
    const response = await api.get<{ success: boolean; data: HealthStatus }>(API_ROUTES.HEALTH);
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getHealthOk = async (): Promise<HealthOkResponse> => {
  try {
    const response = await api.get<{ success: boolean; data: HealthOkResponse }>(API_ROUTES.HEALTH_OK);
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const healthService = {
  getHealthStatus,
  getHealthOk,
};
