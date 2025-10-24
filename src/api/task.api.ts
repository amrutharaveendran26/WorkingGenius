import apiClient from './apiClient';
import { taskEndpoints } from './endpoints';

export const deleteTask = async (id: number) => {
  const { data } = await apiClient.delete(taskEndpoints.delete(id));
  return data;
};
