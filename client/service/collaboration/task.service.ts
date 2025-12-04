import { api, getErrorMessage } from '../../config/axios';
import {
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskQueryParams,
  PaginatedTasksResponse,
  TaskResponse,
  TaskStatisticsResponse,
  TaskStatus,
  Task,
} from '../../interface/task.interface';
import { API_ROUTES } from '../../constants/routes';

export const getTasks = async (params?: TaskQueryParams): Promise<PaginatedTasksResponse> => {
  try {
    const response = await api.get<PaginatedTasksResponse>(
      API_ROUTES.TASKS,
      {
        params,
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getTaskById = async (id: string): Promise<TaskResponse> => {
  try {
    const response = await api.get<TaskResponse>(
      API_ROUTES.TASK_DETAIL(id),
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createTask = async (data: CreateTaskRequest): Promise<TaskResponse> => {
  try {
    const response = await api.post<TaskResponse>(
      API_ROUTES.TASK_CREATE,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateTask = async (
  id: string,
  data: UpdateTaskRequest
): Promise<TaskResponse> => {
  try {
    const response = await api.put<TaskResponse>(
      API_ROUTES.TASK_UPDATE(id),
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const partialUpdateTask = async (
  id: string,
  data: UpdateTaskRequest
): Promise<TaskResponse> => {
  try {
    const response = await api.patch<TaskResponse>(
      API_ROUTES.TASK_UPDATE(id),
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateTaskStatus = async (
  id: string,
  status: TaskStatus
): Promise<TaskResponse> => {
  try {
    const response = await api.patch<TaskResponse>(
      API_ROUTES.TASK_UPDATE_STATUS(id),
      { status },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  try {
    await api.delete(
      API_ROUTES.TASK_DELETE(id),
      { withCredentials: true }
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const restoreTask = async (id: string): Promise<TaskResponse> => {
  try {
    const response = await api.post<TaskResponse>(
      API_ROUTES.TASK_RESTORE(id),
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getOverdueTasks = async (params?: TaskQueryParams): Promise<PaginatedTasksResponse> => {
  try {
    const response = await api.get<PaginatedTasksResponse>(
      API_ROUTES.TASK_OVERDUE,
      {
        params,
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getTaskStatistics = async (): Promise<TaskStatisticsResponse> => {
  try {
    const response = await api.get<TaskStatisticsResponse>(
      API_ROUTES.TASK_STATISTICS,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const searchTasks = async (
  searchTerm: string,
  params?: Omit<TaskQueryParams, 'search'>
): Promise<PaginatedTasksResponse> => {
  try {
    const response = await api.get<PaginatedTasksResponse>(
      API_ROUTES.TASKS,
      {
        params: {
          ...params,
          search: searchTerm,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getTasksByStatus = async (
  status: TaskStatus,
  params?: Omit<TaskQueryParams, 'status'>
): Promise<PaginatedTasksResponse> => {
  try {
    const response = await api.get<PaginatedTasksResponse>(
      API_ROUTES.TASKS,
      {
        params: {
          ...params,
          status,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getTasksByDateRange = async (
  dueAfter: string,
  dueBefore: string,
  params?: Omit<TaskQueryParams, 'due_after' | 'due_before'>
): Promise<PaginatedTasksResponse> => {
  try {
    const response = await api.get<PaginatedTasksResponse>(
      API_ROUTES.TASKS,
      {
        params: {
          ...params,
          due_after: dueAfter,
          due_before: dueBefore,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const taskService = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  partialUpdateTask,
  updateTaskStatus,
  deleteTask,
  restoreTask,
  getOverdueTasks,
  getTaskStatistics,
  searchTasks,
  getTasksByStatus,
  getTasksByDateRange,
};

export default taskService;

