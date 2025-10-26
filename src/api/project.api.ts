import apiClient from './apiClient';
import { commentEndpoints, projectEndpoints, taskEndpoints } from './endpoints';
import { ApiResponse, Comment, CommentPayload, GetAllProjectsResponse } from './types';

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

export const deleteProject = async (id: number): Promise<ApiResponse> => {
  const response = await apiClient.delete<ApiResponse>(projectEndpoints.delete(id));
  return response.data;
};

export const deleteTask = async (id: number): Promise<ApiResponse> => {
  const response = await apiClient.delete<ApiResponse>(taskEndpoints.delete(id));
  return response.data;
};

export const addComment = async (data: CommentPayload): Promise<ApiResponse<Comment>> => {
  const response = await apiClient.post<ApiResponse<Comment>>(commentEndpoints.addComment, data);
  return response.data;
};

export const getCommentsByProject = async (projectId: number): Promise<ApiResponse<Comment[]>> => {
  const response = await apiClient.get<ApiResponse<Comment[]>>(
    commentEndpoints.getProjectComment(projectId),
  );
  return response.data;
};
