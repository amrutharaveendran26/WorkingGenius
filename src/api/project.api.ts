import apiClient from './apiClient';
import { projectEndpoints } from './endpoints';

export const getAllProjects = async () => {
  const { data } = await apiClient.get(projectEndpoints.getAll);
  return data;
};

export const getProjectById = async (id: number) => {
  const { data } = await apiClient.get(projectEndpoints.getById(id));
  return data;
};

export const createProject = async (payload: any) => {
  const { data } = await apiClient.post(projectEndpoints.create, payload);
  return data;
};

export const updateProject = async (id: number, payload: any) => {
  const { data } = await apiClient.put(projectEndpoints.update(id), payload);
  return data;
};

export const deleteProject = async (id: number) => {
  const { data } = await apiClient.delete(projectEndpoints.delete(id));
  return data;
};

export const deleteProjectTask = async (id: number) => {
  const { data } = await apiClient.delete(projectEndpoints.deleteTask(id));
  return data;
};
