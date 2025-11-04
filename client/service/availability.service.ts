import { api } from '@/config/axios';
import type {
  Availability,
  CreateAvailabilityDto,
  UpdateAvailabilityDto,
  BulkCreateAvailabilityDto,
  CheckAvailabilityDto,
  GetAvailableSlotsDto,
  AvailabilityCheck,
  AvailableSlots,
  WeeklySchedule,
} from '@/interface/availability.interface';

const BASE_URL = '/availability';

export const availabilityService = {
  create: async (data: CreateAvailabilityDto): Promise<Availability> => {
    const response = await api.post<{ data: Availability }>(BASE_URL, data);
    return response.data.data;
  },

  bulkCreate: async (data: BulkCreateAvailabilityDto): Promise<Availability[]> => {
    const response = await api.post<{ data: Availability[] }>(
      `${BASE_URL}/bulk`,
      data
    );
    return response.data.data;
  },

  getAll: async (): Promise<Availability[]> => {
    const response = await api.get<{ data: Availability[] }>(BASE_URL);
    return response.data.data;
  },

  getActive: async (): Promise<Availability[]> => {
    const response = await api.get<{ data: Availability[] }>(
      `${BASE_URL}/active`
    );
    return response.data.data;
  },

  getSchedule: async (): Promise<WeeklySchedule> => {
    const response = await api.get<{ data: WeeklySchedule }>(
      `${BASE_URL}/schedule`
    );
    return response.data.data;
  },

  getById: async (id: string): Promise<Availability> => {
    const response = await api.get<{ data: Availability }>(
      `${BASE_URL}/${id}`
    );
    return response.data.data;
  },

  update: async (id: string, data: UpdateAvailabilityDto): Promise<Availability> => {
    const response = await api.patch<{ data: Availability }>(
      `${BASE_URL}/${id}`,
      data
    );
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
  },

  deleteAll: async (): Promise<void> => {
    await api.delete(BASE_URL);
  },

  checkAvailability: async (data: CheckAvailabilityDto): Promise<AvailabilityCheck> => {
    const response = await api.post<{ data: AvailabilityCheck }>(
      `${BASE_URL}/check`,
      data
    );
    return response.data.data;
  },

  getAvailableSlots: async (data: GetAvailableSlotsDto): Promise<AvailableSlots[]> => {
    const response = await api.post<{ data: AvailableSlots[] }>(
      `${BASE_URL}/slots`,
      data
    );
    return response.data.data;
  },
};
