import apiClient from './apiClient';
import { projectEndpoints } from './endpoints';
import { ApiResponse, GetAllProjectsResponse } from './types';

export const getAllProjects = async (): Promise<GetAllProjectsResponse> => {
  const response = await apiClient.get<GetAllProjectsResponse>(projectEndpoints.getAll);
  return response.data;
};

export const getProjectById = async (id: number) => {
  const { data } = await apiClient.get(projectEndpoints.getById(id));
  return data;
};

export const createProject = async (data: any): Promise<ApiResponse> => {
  const response = await apiClient.post<ApiResponse>(projectEndpoints.create, data);
  return response.data;
};

export const updateProject = async (id: number, data: any): Promise<ApiResponse> => {
  const response = await apiClient.put<ApiResponse>(projectEndpoints.update(id), data);
  return response.data;
};

export const deleteProject = async (id: number) => {
  const { data } = await apiClient.delete(projectEndpoints.delete(id));
  return data;
};

export const deleteProjectTask = async (id: number) => {
  const { data } = await apiClient.delete(projectEndpoints.deleteTask(id));
  return data;
};
