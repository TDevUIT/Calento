import { api, getErrorMessage } from '../config/axios';
import { API_ROUTES } from '../constants/routes';
import type {
  ItemType,
  UserPriority,
  UpdatePriorityRequest,
  BulkUpdatePriorityRequest,
} from '../interface/priority.interface';

export type { ItemType, UserPriority, UpdatePriorityRequest, BulkUpdatePriorityRequest };

interface PriorityResponse {
  success: boolean;
  message: string;
  data: UserPriority[];
}

interface SinglePriorityResponse {
  success: boolean;
  message: string;
  data: UserPriority;
}

interface MessageResponse {
  success: boolean;
  message: string;
}

export const getUserPriorities = async (): Promise<UserPriority[]> => {
  try {
    const response = await api.get<PriorityResponse>(
      API_ROUTES.PRIORITIES,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updatePriority = async (data: UpdatePriorityRequest): Promise<UserPriority> => {
  try {
    const response = await api.post<SinglePriorityResponse>(
      API_ROUTES.PRIORITY_UPDATE,
      data,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const bulkUpdatePriorities = async (data: BulkUpdatePriorityRequest): Promise<UserPriority[]> => {
  try {
    const response = await api.post<PriorityResponse>(
      API_ROUTES.PRIORITY_BULK_UPDATE,
      data,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deletePriority = async (itemId: string, itemType: ItemType): Promise<void> => {
  try {
    await api.delete<MessageResponse>(
      API_ROUTES.PRIORITY_DELETE(itemId, itemType),
      { withCredentials: true }
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const resetPriorities = async (): Promise<void> => {
  try {
    await api.delete<MessageResponse>(
      API_ROUTES.PRIORITY_RESET,
      { withCredentials: true }
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
